import { NextResponse, NextRequest} from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { Note } from "@/models/note";
import { User } from "@/models/user";
import { reviewDocumentText } from "@/lib/ai/reviewDocument";
import { uploadImage } from "@/lib/cloudinary/uploadImage";
import { uploadPdf } from "@/lib/cloudinary/uploadPdf";
import { extractTextWithDocling } from "@/lib/pdf/extractTextWithDocling";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.userId) {
      return NextResponse.json(
        { message: "You must be logged in to upload notes" },
        { status: 401 },
      );
    }



    await connectDB();
     const formData = await req.formData();
 
   
const title = formData.get("title") as string;
const description = formData.get("description") as string;
const category = formData.get("category") as string;
const imageFile = formData.get("image") as File | null;
const country = formData.get("country") as string;
const universityName = formData.get("universityName") as string;
const pdfFile = formData.get("pdfFile") as File | null;

    if (!(pdfFile instanceof File) || pdfFile.type !== "application/pdf") {
      return NextResponse.json(
        { message: "Please upload a valid PDF file" },
        { status: 400 },
      );
    }
 

    if (!title || !description || !category || !imageFile || !pdfFile) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!(imageFile instanceof File) || !imageFile.type.startsWith("image/")) {
  return NextResponse.json(
    { message: "Please upload a valid image" },
    { status: 400 }
  );
}

    const extractedText = await extractTextWithDocling(pdfFile);
    const review = await reviewDocumentText({
      title,
      description,
      extractedText,
    });

    if (review.status !== "approved") {
      return NextResponse.json(
        {
          message: review.reason || "The PDF did not pass document review",
          review,
        },
        { status: 422 },
      );
    }

   const pdfResult = await uploadPdf(pdfFile);
    const imageResult = await uploadImage(imageFile as File);
       
    const note = await Note.create({
      title,
      slug: `${slugify(title)}-${Date.now()}`,
      author: currentUser.userId,
      description,
      category,
      image: imageResult.secure_url,
      fileUrl: pdfResult.secure_url,
      fileName: pdfFile.name,
      fileType: pdfFile.type,
      extractedText,
      reviewStatus: review.status,
      reviewReason: review.reason,
      reviewIssues: review.issues,
      cloudinaryId: pdfResult.public_id,
      imageCloudinaryId: imageResult.public_id,
    });

    await User.findByIdAndUpdate(currentUser.userId, {
      $addToSet: { posts: note._id },
      ...(country || universityName
        ? {
            $set: {
              ...(country ? { country } : {}),
              ...(universityName ? { universityName } : {}),
            },
          }
        : {}),
    });

    return NextResponse.json(
      {
        message: "Note uploaded successfully",
        noteId: note._id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("CREATE NOTE ERROR:", error);
    const message = error instanceof Error ? error.message : "";

    if (
      message.includes("Docling") ||
      message.includes("OPENROUTER_API_KEY") ||
      message.includes("OPENAI_API_KEY") ||
      message.includes("AI review")
    ) {
      return NextResponse.json(
        { message },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { message: "Something went wrong while uploading notes" },
      { status: 500 },
    );
  }
}
