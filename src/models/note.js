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
    reviewStatus: {
      type: String,
      enum: ["approved", "rejected", "pending"],
      default: "pending",
    },
    reviewReason: String,
    reviewIssues: [String],
    likes: [{
        type: mongoose.Schema.Types.ObjectId, ref: "user"
    }]
  },
  
  { timestamps: true },
);


export const Note =
  mongoose.models.note || mongoose.model("note", noteSchema);
