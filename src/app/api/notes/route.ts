import { NextResponse, NextRequest} from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { Note } from "@/models/note";
import { User } from "@/models/user";
import { uploadImage } from "@/lib/cloudinary/uploadImage";
import { uploadPdf } from "@/lib/cloudinary/uploadPdf";
import { reviewNotePdf } from "@/lib/notes/reviewNote";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

    const review = await reviewNotePdf({
      title,
      description,
      pdfFile,
    });

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
      extractedText: review.extractedText,
      status: review.status,
      reviewReason: review.reviewReason,
      reviewIssues: review.reviewIssues,
      reviewedAt: review.reviewedAt,
      submittedAt: new Date(),
      cloudinaryId: pdfResult.public_id,
      imageCloudinaryId: imageResult.public_id,
    });

    await User.findByIdAndUpdate(currentUser.userId, {
      $addToSet: { posts: note._id },
      ...(country || universityName
        ? {
            $set: {
              ...(country ? { country } : {}),
              ...(universityName
                ? { university: universityName, universityName }
                : {}),
            },
          }
        : {}),
    });

    return NextResponse.json(
      {
        message: "Note submitted and reviewed successfully",
        noteId: note._id,
        status: note.status,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("CREATE NOTE ERROR:", error);
    const message = error instanceof Error ? error.message : "";

    return NextResponse.json(
      { message: message || "Something went wrong while uploading notes" },
      { status: 500 },
    );
  }
}
