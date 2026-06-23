"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import { Send } from "lucide-react";
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
          <Input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={(event) => setImageFile(event.target.files?.[0] || null)}
          />
        </div>

        <div>
          <label htmlFor="pdfFile" className="startup-form_label">
            Replace PDF
          </label>
          <Input
            id="pdfFile"
            name="pdfFile"
            type="file"
            accept=".pdf"
            onChange={(event) => setPdfFile(event.target.files?.[0] || null)}
          />
        </div>

        <Button
          type="submit"
          className="startup-form_btn text-white"
          disabled={isPending}
        >
          {isPending ? "Resubmitting..." : "Update & Resubmit"}
          <Send className="size-6 ml-2" />
        </Button>
      </form>
    </>
  );
}
