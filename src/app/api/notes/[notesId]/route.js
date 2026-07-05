import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { deleteNoteById } from "@/lib/notes-data";
import { connectDB } from "@/lib/mongodb";
import { Note } from "@/models/note";
import { uploadImage } from "@/lib/cloudinary/uploadImage";
import { uploadPdf } from "@/lib/cloudinary/uploadPdf";
import { downloadPdfAsFile, reviewNotePdf } from "@/lib/notes/reviewNote";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getString(value) {
  return typeof value === "string" ? value.trim() : "";
}

export async function PATCH(request, { params }) {
  try {
    const { notesId } = await params;
    const currentUser = await getCurrentUser();

    if (!currentUser?.userId) {
      return NextResponse.json(
        { message: "You must be logged in to edit notes" },
        { status: 401 },
      );
    }

    if (!mongoose.Types.ObjectId.isValid(notesId)) {
      return NextResponse.json({ message: "Invalid note id" }, { status: 400 });
    }

    await connectDB();

    const note = await Note.findById(notesId);

    if (!note) {
      return NextResponse.json({ message: "Note not found" }, { status: 404 });
    }

    if (note.author.toString() !== currentUser.userId) {
      return NextResponse.json(
        { message: "You can only edit your own notes" },
        { status: 403 },
      );
    }

    if (!["approved", "rejected", "processing_failed"].includes(note.status)) {
      return NextResponse.json(
        { message: "This note cannot be edited yet" },
        { status: 409 },
      );
    }

    const formData = await request.formData();
    const title = getString(formData.get("title"));
    const description = getString(formData.get("description"));
    const imageFile = formData.get("image");
    const pdfFile = formData.get("pdfFile");
    let reviewPdfFile = null;

    if (!title || title.length < 3 || title.length > 100) {
      return NextResponse.json(
        { message: "Title must be between 3 and 100 characters" },
        { status: 400 },
      );
    }

    if (!description || description.length < 20 || description.length > 500) {
      return NextResponse.json(
        { message: "Description must be between 20 and 500 characters" },
        { status: 400 },
      );
    }

    note.title = title;
    note.description = description;

    if (imageFile instanceof File && imageFile.size > 0) {
      if (!imageFile.type.startsWith("image/")) {
        return NextResponse.json(
          { message: "Please upload a valid image" },
          { status: 400 },
        );
      }

      const imageResult = await uploadImage(imageFile);
      note.image = imageResult.secure_url;
      note.imageCloudinaryId = imageResult.public_id;
    }

    if (pdfFile instanceof File && pdfFile.size > 0) {
      const MAX_PDF_SIZE = 10 * 1024 * 1024;

if (pdfFile.size > MAX_PDF_SIZE) {
  return NextResponse.json(
    {
      message: "PDF size must be 10 MB or smaller.",
    },
    { status: 400 }
  );
}
      if (pdfFile.type !== "application/pdf") {
        return NextResponse.json(
          { message: "Please upload a valid PDF file" },
          { status: 400 },
        );
      }

      const pdfResult = await uploadPdf(pdfFile);
      note.fileUrl = pdfResult.secure_url;
      note.fileName = pdfFile.name;
      note.fileType = pdfFile.type;
      note.cloudinaryId = pdfResult.public_id;
      reviewPdfFile = pdfFile;
    }

    if (!reviewPdfFile) {
      reviewPdfFile = await downloadPdfAsFile(note.fileUrl, note.fileName);
    }

    const review = await reviewNotePdf({
      title,
      description,
      pdfFile: reviewPdfFile,
    });

    note.extractedText = review.extractedText;
    note.status = review.status;
    note.reviewReason = review.reviewReason;
    note.reviewIssues = review.reviewIssues;
    note.reviewedAt = review.reviewedAt;
    note.lastEditedAt = new Date();

    await note.save();

    return NextResponse.json({
      message: "Note updated and reviewed successfully",
      noteId: note._id,
      status: note.status,
    });
  } catch (error) {
    console.error("UPDATE NOTE ERROR:", error);

    return NextResponse.json(
      { message: "Failed to update note" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { notesId } = await params;
    const currentUser = await getCurrentUser();

    if (!currentUser?.userId) {
      return NextResponse.json(
        { message: "You must be logged in to delete notes" },
        { status: 401 },
      );
    }

    if (!mongoose.Types.ObjectId.isValid(notesId)) {
      return NextResponse.json({ message: "Invalid note id" }, { status: 400 });
    }

    const result = await deleteNoteById(notesId, currentUser.userId);

    return NextResponse.json(
      { message: result.message },
      { status: result.status },
    );
  } catch (error) {
    console.error("DELETE NOTE ERROR:", error);

    return NextResponse.json(
      { message: "Failed to delete note" },
      { status: 500 },
    );
  }
}
