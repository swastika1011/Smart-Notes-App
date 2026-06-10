"use client";

import React, { useActionState, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { z } from "zod";
import { toast, Toaster } from "sonner";
import { createPitch, type ActionState } from "@/lib/actions";

const SubmissionForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFormSubmit = async (
    prevState: ActionState,
    formData: FormData,
  ): Promise<ActionState> => {
    try {
      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        link: formData.get("link") as string,
        country: formData.get("country") as string,
        universityName: formData.get("universityName") as string,
      };

      await formSchema.parseAsync(formValues);

      if (!formData.get("pdfFile")) {
        toast.error("Please upload a PDF file");
        setErrors((prev) => ({ ...prev, pdfFile: "PDF file is required" }));
        return { ...prevState, status: "ERROR" };
      }

      const result = await createPitch(prevState, formData);

      if (result.status === "ERROR") {
        toast.error(result.error);
        return result;
      }

      toast.success("Your notes were submitted successfully");
      return { ...prevState, status: "SUCCESS" };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(
          Object.fromEntries(
            Object.entries(fieldErrors).map(([key, value]) => [
              key,
              value?.[0] ?? "",
            ]),
          ),
        );
        toast.error("Validation failed. Please check your inputs.");
        return { ...prevState, error: "Validation failed", status: "ERROR" };
      }

      toast.error("An unexpected error has occurred.");
      return { ...prevState, error: "Unknown error", status: "ERROR" };
    }
  };

  const initialState: ActionState = {
    error: "",
    status: "INITIAL",
  };

  const [, formAction, isPending] = useActionState(
    handleFormSubmit,
    initialState,
  );

  return (
    <>
      <Toaster richColors closeButton position="top-right" />
      <form action={formAction} className="startup-form">
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
          />
          {errors.title && (
            <p className="startup-form_error">{errors.title}</p>
          )}
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
          />
          {errors.category && (
            <p className="startup-form_error">{errors.category}</p>
          )}
        </div>

        <div>
          <label htmlFor="link" className="startup-form_label">
            Image URL
          </label>
          <Input
            id="link"
            name="link"
            className="startup-form_input"
            required
            placeholder="Notes Image URL"
          />
          {errors.link && <p className="startup-form_error">{errors.link}</p>}
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
          />
          {errors.universityName && (
            <p className="startup-form_error">{errors.universityName}</p>
          )}
        </div>

        <div data-color-mode="light">
          <label htmlFor="pdfFile" className="startup-form_label">
            Upload PDF
          </label>
          <Input id="pdfFile" name="pdfFile" type="file" accept=".pdf" required />
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
