"use client";

import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { z } from "zod";
import { toast, Toaster } from "sonner";

const SubmissionForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, setIsPending] = useState(false);
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    category: "",
    country: "",
    universityName: "",
  });
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsPending(true);

      await formSchema.parseAsync(formValues);
      if (!imageFile) {
        toast.error("Please upload an image");
        return;
      }

      if (!pdfFile) {
        toast.error("Please upload a PDF file");
        setErrors((prev) => ({ ...prev, pdfFile: "PDF file is required" }));
        return;
      }

      const formData = new FormData();
      formData.append("title", formValues.title);
      formData.append("description", formValues.description);
      formData.append("category", formValues.category);
      formData.append("image", imageFile);
      formData.append("country", formValues.country);
      formData.append("universityName", formValues.universityName);
      formData.append("pdfFile", pdfFile);

      const response = await fetch("/api/notes", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to upload notes");
        return;
      }

      toast.success(
        data.status === "approved"
          ? "Your notes were approved"
          : data.status === "rejected"
            ? "Your notes were rejected"
            : "Your notes were submitted, but processing failed",
      );
      setFormValues({
        title: "",
        description: "",
        category: "",
        country: "",
        universityName: "",
      });
      setPdfFile(null);
      setImageFile(null);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }

      if (pdfInputRef.current) {
        pdfInputRef.current.value = "";
      }
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors((prev) => ({
          ...prev,
          ...Object.fromEntries(
            Object.entries(fieldErrors).map(([key, value]) => [
              key,
              value?.[0] ?? "",
            ]),
          ),
        }));
        toast.error("Validation failed. Please check your inputs.");
        return;
      }

      toast.error("An unexpected error has occurred.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <Toaster richColors closeButton position="top-right" />
      <form onSubmit={handleFormSubmit} className="startup-form">
        <div>
          <label htmlFor="title" className="startup-form_label">
            Title
          </label>
          <Input
            id="title"
            name="title"
            className="startup-form_input"
            required
            placeholder="Notes Title"
            value={formValues.title}
            onChange={handleChange}
          />
          {errors.title && <p className="startup-form_error">{errors.title}</p>}
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
            placeholder="Notes Description"
            value={formValues.description}
            onChange={handleChange}
          />
          {errors.description && (
            <p className="startup-form_error">{errors.description}</p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="startup-form_label">
            Category
          </label>
          <Input
            id="category"
            name="category"
            className="startup-form_input"
            required
            placeholder="Notes Category (Tech, Health, Education...)"
            value={formValues.category}
            onChange={handleChange}
          />
          {errors.category && (
            <p className="startup-form_error">{errors.category}</p>
          )}
        </div>

        <div>
          <label htmlFor="image" className="startup-form_label">
            Upload Image
          </label>

          <Input
            ref={imageInputRef}
            id="image"
            name="image"
            type="file"
            accept="image/*"
            required
            onChange={(event) => {
              setImageFile(event.target.files?.[0] || null);

              setErrors((prev) => {
                const next = { ...prev };
                delete next.image;
                return next;
              });
            }}
          />

          {errors.image && <p className="startup-form_error">{errors.image}</p>}
        </div>

        <div>
          <label htmlFor="country" className="startup-form_label">
            Country
          </label>
          <Input
            id="country"
            name="country"
            className="startup-form_input"
            required
            placeholder="Your Country"
            value={formValues.country}
            onChange={handleChange}
          />
          {errors.country && (
            <p className="startup-form_error">{errors.country}</p>
          )}
        </div>

        <div>
          <label htmlFor="universityName" className="startup-form_label">
            University Name
          </label>
          <Input
            id="universityName"
            name="universityName"
            className="startup-form_input"
            required
            placeholder="Your University Name"
            value={formValues.universityName}
            onChange={handleChange}
          />
          {errors.universityName && (
            <p className="startup-form_error">{errors.universityName}</p>
          )}
        </div>

        <div data-color-mode="light">
          <label htmlFor="pdfFile" className="startup-form_label">
            Upload PDF
          </label>
          <Input
            ref={pdfInputRef}
            id="pdfFile"
            name="pdfFile"
            type="file"
            accept=".pdf"
            required
            onChange={(event) => {
              setPdfFile(event.target.files?.[0] || null);
              setErrors((prev) => {
                const next = { ...prev };
                delete next.pdfFile;
                return next;
              });
            }}
          />
          {errors.pdfFile && (
            <p className="startup-form_error">{errors.pdfFile}</p>
          )}
        </div>

        <Button
          type="submit"
          className="startup-form_btn text-white"
          disabled={isPending}
        >
          {isPending ? "Submitting..." : "Submit Your Notes"}
          <Send className="size-6 ml-2" />
        </Button>
      </form>
    </>
  );
};

export default SubmissionForm;
