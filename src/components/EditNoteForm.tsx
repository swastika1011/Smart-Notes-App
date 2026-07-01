"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import { FileImage, FileText, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type EditableNote = {
  _id: string;
  title: string;
  description: string;
};

export default function EditNoteForm({ note }: { note: EditableNote }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [values, setValues] = useState({
    title: note.title,
    description: note.description,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (values.title.trim().length < 3) {
      toast.error("Title must be at least 3 characters");
      return;
    }

    if (values.description.trim().length < 20) {
      toast.error("Description must be at least 20 characters");
      return;
    }

    try {
      setIsPending(true);

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (pdfFile) {
        formData.append("pdfFile", pdfFile);
      }

      const response = await fetch(`/api/notes/${note._id}`, {
        method: "PATCH",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to update note");
        return;
      }

      toast.success(
        data.status === "approved"
          ? "Note approved"
          : data.status === "rejected"
            ? "Note rejected"
            : "Note updated, but processing failed",
      );
      router.push(`/notespage/${note._id}`);
      router.refresh();
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <Toaster richColors closeButton position="top-right" />
      <form onSubmit={handleSubmit} className="startup-form">
        <div className="rounded-3xl border border-blue-100 bg-blue-50/70 p-5">
          <div className="flex items-start gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white text-blue-700 shadow-sm">
              <Sparkles className="size-5" />
            </span>
            <div>
              <h2 className="font-heading text-2xl font-semibold text-[#0A1F44]">
                Resubmit for review
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Updates keep the same note record and send the latest content back through SmartNotes review.
              </p>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="title" className="startup-form_label">
            Title
          </label>
          <Input
            id="title"
            name="title"
            className="startup-form_input"
            required
            minLength={3}
            maxLength={100}
            value={values.title}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="description" className="startup-form_label">
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            className="startup-form_textarea"
            required
            minLength={20}
            maxLength={500}
            value={values.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="image" className="startup-form_label">
            Replace Image
          </label>
          <div className="mt-3 rounded-3xl border border-dashed border-blue-200 bg-white/70 p-5 transition-all duration-200 hover:border-blue-300 hover:bg-white">
            <div className="mb-4 flex items-center gap-3 text-sm text-slate-600">
              <span className="grid size-10 place-items-center rounded-2xl bg-blue-50 text-blue-700">
                <FileImage className="size-5" />
              </span>
              <span>{imageFile ? imageFile.name : "Optional replacement thumbnail"}</span>
            </div>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              className="startup-form_input !mt-0 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:text-blue-700"
              onChange={(event) => setImageFile(event.target.files?.[0] || null)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="pdfFile" className="startup-form_label">
            Replace PDF
          </label>
          <div className="mt-3 rounded-3xl border border-dashed border-blue-200 bg-white/70 p-5 transition-all duration-200 hover:border-blue-300 hover:bg-white">
            <div className="mb-4 flex items-center gap-3 text-sm text-slate-600">
              <span className="grid size-10 place-items-center rounded-2xl bg-blue-50 text-blue-700">
                <FileText className="size-5" />
              </span>
              <span>{pdfFile ? pdfFile.name : "Optional replacement PDF"}</span>
            </div>
            <Input
              id="pdfFile"
              name="pdfFile"
              type="file"
              accept=".pdf"
              className="startup-form_input !mt-0 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:text-blue-700"
              onChange={(event) => setPdfFile(event.target.files?.[0] || null)}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="startup-form_btn text-white"
          disabled={isPending}
        >
          {isPending ? "Resubmitting..." : "Update & Resubmit"}
          <Send className="ml-2 size-5" />
        </Button>
      </form>
    </>
  );
}
