"use client";

import { useState } from "react";
import Image from "next/image";
import { toast, Toaster } from "sonner";
import { Camera, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ProfileUser = {
  name: string;
  email: string;
  image?: string;
  profileImage?: string;
  bio?: string;
  country?: string;
  university?: string;
  universityName?: string;
  github?: string;
  linkedin?: string;
};

export default function ProfileForm({ user }: { user: ProfileUser }) {
  const [isPending, setIsPending] = useState(false);
  const [preview, setPreview] = useState(
    user.profileImage || user.image || "/window.svg",
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [values, setValues] = useState({
    bio: user.bio || "",
    country: user.country || "",
    university: user.university || user.universityName || "",
    github: user.github || "",
    linkedin: user.linkedin || "",
  });

  function updateValue(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsPending(true);

      const formData = new FormData();
      formData.append("bio", values.bio);
      formData.append("country", values.country);
      formData.append("university", values.university);
      formData.append("github", values.github);
      formData.append("linkedin", values.linkedin);

      if (imageFile) {
        formData.append("profileImage", imageFile);
      }

      const response = await fetch("/api/profile", {
        method: "PATCH",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to update profile");
        return;
      }

      if (data.user?.profileImage || data.user?.image) {
        setPreview(data.user.profileImage || data.user.image);
      }

      setImageFile(null);
      toast.success("Profile updated");
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <Toaster richColors closeButton position="top-right" />
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <section className="border-[4px] border-black rounded-lg p-5 h-fit bg-white shadow-[2px_2px_0_0_rgba(0,0,0,0.25)]">
          <div className="flex flex-col items-center text-center gap-4">
            <Image
              src={preview}
              alt={user.name}
              width={140}
              height={140}
              className="size-36 rounded-full object-cover border-[3px] border-black"
            />
            <div>
              <h2 className="text-24-black">{user.name}</h2>
              <p className="text-sm text-zinc-600 break-all">{user.email}</p>
            </div>
            <div className="w-full text-left space-y-2 text-sm">
              <p>
                <span className="font-bold">University:</span>{" "}
                {values.university || "Not added"}
              </p>
              <p>
                <span className="font-bold">Country:</span>{" "}
                {values.country || "Not added"}
              </p>
              <p className="break-words">
                <span className="font-bold">Bio:</span>{" "}
                {values.bio || "No bio yet"}
              </p>
              {values.github && (
                <a
                  href={values.github}
                  target="_blank"
                  rel="noreferrer"
                  className="block font-semibold underline"
                >
                  GitHub
                </a>
              )}
              {values.linkedin && (
                <a
                  href={values.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="block font-semibold underline"
                >
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="startup-form !my-0 !mx-0">
          <div>
            <label htmlFor="profileImage" className="startup-form_label">
              Avatar
            </label>
            <Input
              id="profileImage"
              name="profileImage"
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0] || null;
                setImageFile(file);
                if (file) {
                  setPreview(URL.createObjectURL(file));
                }
              }}
            />
          </div>

          <div>
            <label htmlFor="university" className="startup-form_label">
              University
            </label>
            <Input
              id="university"
              name="university"
              className="startup-form_input"
              maxLength={120}
              value={values.university}
              onChange={updateValue}
            />
          </div>

          <div>
            <label htmlFor="country" className="startup-form_label">
              Country
            </label>
            <Input
              id="country"
              name="country"
              className="startup-form_input"
              maxLength={80}
              value={values.country}
              onChange={updateValue}
            />
          </div>

          <div>
            <label htmlFor="bio" className="startup-form_label">
              Bio
            </label>
            <Textarea
              id="bio"
              name="bio"
              className="startup-form_textarea"
              maxLength={500}
              value={values.bio}
              onChange={updateValue}
            />
          </div>

          <div>
            <label htmlFor="github" className="startup-form_label">
              GitHub
            </label>
            <Input
              id="github"
              name="github"
              type="url"
              className="startup-form_input"
              placeholder="https://github.com/username"
              value={values.github}
              onChange={updateValue}
            />
          </div>

          <div>
            <label htmlFor="linkedin" className="startup-form_label">
              LinkedIn
            </label>
            <Input
              id="linkedin"
              name="linkedin"
              type="url"
              className="startup-form_input"
              placeholder="https://www.linkedin.com/in/username"
              value={values.linkedin}
              onChange={updateValue}
            />
          </div>

          <Button
            type="submit"
            className="startup-form_btn text-white"
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save Profile"}
            {isPending ? (
              <Save className="size-5 ml-2 animate-pulse" />
            ) : (
              <Camera className="size-5 ml-2" />
            )}
          </Button>
        </form>
      </div>
    </>
  );
}
