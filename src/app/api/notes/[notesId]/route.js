import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { deleteNoteById } from "@/lib/notes-data";

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
