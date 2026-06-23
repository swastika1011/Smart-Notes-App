import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary/cloudinary";
import { connectDB } from "@/lib/mongodb";
import { Note } from "@/models/note";
import { User } from "@/models/user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function publicIdFromCloudinaryUrl(url?: string) {
  if (!url || !url.includes("res.cloudinary.com")) return "";

  try {
    const parsed = new URL(url);
    const uploadIndex = parsed.pathname.indexOf("/upload/");
    if (uploadIndex === -1) return "";

    const afterUpload = parsed.pathname.slice(uploadIndex + "/upload/".length);
    const withoutVersion = afterUpload.replace(/^v\d+\//, "");
    return withoutVersion.replace(/\.[^/.]+$/, "");
  } catch {
    return "";
  }
}

async function destroyCloudinaryAsset(
  publicId: string | undefined,
  resourceType: "image" | "raw",
) {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    console.error("ACCOUNT CLOUDINARY DELETE ERROR:", {
      publicId,
      resourceType,
      error,
    });
  }
}

export async function DELETE() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.userId) {
      return NextResponse.json(
        { message: "You must be logged in to delete your account" },
        { status: 401 },
      );
    }

    if (!mongoose.Types.ObjectId.isValid(currentUser.userId)) {
      return NextResponse.json(
        { message: "Invalid authenticated user" },
        { status: 401 },
      );
    }

    await connectDB();

    const user = await User.findById(currentUser.userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const notes = await Note.find({ author: currentUser.userId }).select(
      "cloudinaryId imageCloudinaryId",
    );

    await Promise.all([
      ...notes.flatMap((note) => [
        destroyCloudinaryAsset(note.cloudinaryId, "raw"),
        destroyCloudinaryAsset(note.imageCloudinaryId, "image"),
      ]),
      destroyCloudinaryAsset(
        user.profileImageCloudinaryId ||
          publicIdFromCloudinaryUrl(user.profileImage || user.image),
        "image",
      ),
    ]);

    await Note.deleteMany({ author: currentUser.userId });
    await Note.updateMany(
      { likes: currentUser.userId },
      { $pull: { likes: currentUser.userId } },
    );
    await Note.updateMany(
      {},
      [{ $set: { likeCount: { $size: { $ifNull: ["$likes", []] } } } }],
    );
    await User.findByIdAndDelete(currentUser.userId);

    const response = NextResponse.json({
      message: "Account deleted successfully",
    });

    response.cookies.set("token", "", {
      httpOnly: true,
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("DELETE ACCOUNT ERROR:", error);

    return NextResponse.json(
      { message: "Failed to delete account" },
      { status: 500 },
    );
  }
}
