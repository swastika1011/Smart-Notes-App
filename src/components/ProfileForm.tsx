"use client";

import { useState } from "react";
import Image from "next/image";
import { toast, Toaster } from "sonner";
import { Camera, Github, Linkedin, MapPin, Save, School } from "lucide-react";
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
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <section className="h-fit rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-blue-950/10 backdrop-blur-md">
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="relative">
              <Image
                src={preview}
                alt={user.name}
                width={144}
                height={144}
                className="size-36 rounded-full border-4 border-white object-cover shadow-lg shadow-blue-950/15 ring-1 ring-blue-100"
              />
              <span className="absolute bottom-2 right-2 grid size-10 place-items-center rounded-full bg-[#0A1F44] text-white shadow-md">
                <Camera className="size-4" />
              </span>
            </div>
            <div>
              <h2 className="font-heading text-2xl font-semibold text-[#0A1F44]">
                {user.name}
              </h2>
              <p className="mt-1 break-all text-sm text-slate-500">{user.email}</p>
            </div>
            <div className="w-full space-y-3 rounded-2xl border border-blue-50 bg-blue-50/50 p-4 text-left text-sm text-slate-600">
              <p className="flex gap-2">
                <School className="mt-0.5 size-4 shrink-0 text-blue-600" />
                <span>{values.university || "University not added"}</span>
              </p>
              <p className="flex gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-blue-600" />
                <span>{values.country || "Country not added"}</span>
              </p>
              <p className="break-words leading-6">
                {values.bio || "No bio yet"}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {values.github && (
                  <a
                    href={values.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 font-semibold text-[#0A1F44] transition hover:-translate-y-0.5"
                  >
                    <Github className="size-4" />
                    GitHub
                  </a>
                )}
                {values.linkedin && (
                  <a
                    href={values.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 font-semibold text-[#0A1F44] transition hover:-translate-y-0.5"
                  >
                    <Linkedin className="size-4" />
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="startup-form !my-0 !mx-0 !max-w-none">
          <div>
            <label htmlFor="profileImage" className="startup-form_label">
              Avatar
            </label>
            <Input
              id="profileImage"
              name="profileImage"
              type="file"
              accept="image/*"
              className="startup-form_input file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:text-blue-700"
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
            <Save className="ml-2 size-5 animate-pulse" />
          ) : (
              <Camera className="ml-2 size-5" />
            )}
          </Button>
        </form>
      </div>
    </>
  );
}
