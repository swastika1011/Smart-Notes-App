import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Note } from "@/models/note";

export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ notesId: string }> },
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.userId) {
      return NextResponse.json(
        { message: "You must be logged in to like notes" },
        { status: 401 },
      );
    }

    const { notesId } = await params;

    if (!mongoose.Types.ObjectId.isValid(notesId)) {
      return NextResponse.json({ message: "Invalid note id" }, { status: 400 });
    }

    await connectDB();

    const note = await Note.findById(notesId).select("likes likeCount");

    if (!note) {
      return NextResponse.json({ message: "Note not found" }, { status: 404 });
    }

    const userId = currentUser.userId;
    const hasLiked = note.likes.some(
      (like: mongoose.Types.ObjectId) => like.toString() === userId,
    );

    if (hasLiked) {
      note.likes = note.likes.filter(
        (like: mongoose.Types.ObjectId) => like.toString() !== userId,
      );
    } else {
      note.likes.addToSet(new mongoose.Types.ObjectId(userId));
    }

    note.likeCount = note.likes.length;
    await note.save();

    return NextResponse.json({
      liked: !hasLiked,
      likeCount: note.likeCount,
    });
  } catch (error) {
    console.error("LIKE NOTE ERROR:", error);

    return NextResponse.json(
      { message: "Failed to update like" },
      { status: 500 },
    );
  }
}
