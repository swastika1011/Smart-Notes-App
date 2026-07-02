import mongoose from "mongoose";

const noteViewSchema = new mongoose.Schema(
  {
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "note",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

noteViewSchema.index({ noteId: 1, userId: 1 });

export const NoteView =
  mongoose.models.noteview || mongoose.model("noteview", noteViewSchema);