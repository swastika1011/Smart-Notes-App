import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { uploadImage } from "@/lib/cloudinary/uploadImage";
import { User } from "@/models/user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidOptionalUrl(value: string, host: string) {
  if (!value) return true;

  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" && parsed.hostname.includes(host);
  } catch {
    return false;
  }
}

export async function PATCH(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.userId) {
      return NextResponse.json(
        { message: "You must be logged in to update your profile" },
        { status: 401 },
      );
    }

    await connectDB();

    const formData = await req.formData();
    const bio = getString(formData.get("bio"));
    const country = getString(formData.get("country"));
    const university = getString(formData.get("university"));
    const github = getString(formData.get("github"));
    const linkedin = getString(formData.get("linkedin"));
    const imageFile = formData.get("profileImage");

    if (bio.length > 500) {
      return NextResponse.json(
        { message: "Bio must be 500 characters or fewer" },
        { status: 400 },
      );
    }

    if (country.length > 80 || university.length > 120) {
      return NextResponse.json(
        { message: "Country or university is too long" },
        { status: 400 },
      );
    }

    if (!isValidOptionalUrl(github, "github.com")) {
      return NextResponse.json(
        { message: "GitHub must be a valid https://github.com URL" },
        { status: 400 },
      );
    }

    if (!isValidOptionalUrl(linkedin, "linkedin.com")) {
      return NextResponse.json(
        { message: "LinkedIn must be a valid https://linkedin.com URL" },
        { status: 400 },
      );
    }

    const updates: Record<string, string> = {
      bio,
      country,
      university,
      universityName: university,
      github,
      linkedin,
    };

    if (imageFile instanceof File && imageFile.size > 0) {
      if (!imageFile.type.startsWith("image/")) {
        return NextResponse.json(
          { message: "Please upload a valid profile image" },
          { status: 400 },
        );
      }

      const imageResult = await uploadImage(imageFile);
      updates.profileImage = imageResult.secure_url;
      updates.image = imageResult.secure_url;
      updates.profileImageCloudinaryId = imageResult.public_id;
    }

    const user = await User.findByIdAndUpdate(
      currentUser.userId,
      { $set: updates },
      { new: true },
    ).select("-password");

    return NextResponse.json({
      message: "Profile updated",
      user,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    return NextResponse.json(
      { message: "Failed to update profile" },
      { status: 500 },
    );
  }
}
