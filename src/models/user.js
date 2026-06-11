import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: String,
    bio: String,
    country: String,
    universityName: String,
    posts: [{type: mongoose.Schema.Types.ObjectId, ref:"note"}]
  },
  { timestamps: true },
);

export const User =
  mongoose.models.user || mongoose.model("user", userSchema);