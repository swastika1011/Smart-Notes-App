import mongoose from "mongoose";

export const NOTE_STATUSES = [
  "approved",
  "rejected",
  "processing_failed",
];

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    cloudinaryId: {
  type: String,
},

imageCloudinaryId: {
  type: String,
},
    views: { type: Number, default: 0 },
    description: { type: String, required: true },
    category: { type: String, required: true, minlength: 1, maxlength: 20 },
    image: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileName: String,
    fileType: String,
    extractedText: String,
    status: {
      type: String,
      enum: NOTE_STATUSES,
      default: "processing_failed",
    },
    reviewReason: String,
    reviewIssues: [String],
    reviewedAt: Date,
    submittedAt: Date,
    lastEditedAt: Date,
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    likeCount: { type: Number, default: 0 },
  },
  
  { timestamps: true },
);


export const Note =
  mongoose.models.note || mongoose.model("note", noteSchema);
