import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    views: { type: Number, default: 0 },
    description: { type: String, required: true },
    category: { type: String, required: true, minlength: 1, maxlength: 20 },
    image: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileName: String,
    fileType: String,
    likes: [{
        type: mongoose.Schema.Types.ObjectId, ref: "user"
    }]
  },
  { timestamps: true },
);


export const Note =
  mongoose.models.note || mongoose.model("note", noteSchema);