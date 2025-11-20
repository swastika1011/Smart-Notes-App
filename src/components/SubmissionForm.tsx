// "use client";

// import React, { useState } from "react";
// import { useActionState } from "react";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Send } from "lucide-react";
// import { formSchema } from "@/lib/validation";
// import { z } from "zod";
// import { toast, Toaster } from "sonner";
// import { useRouter } from "next/navigation";
// import { createPitch } from "@/lib/actions";

// const SubmissionForm = () => {
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [pdfFile, setPdfFile] = useState<File | null>(null);
//   const [aiStatus, setAiStatus] = useState<null | "reviewing" | "done">(null);

//   const router = useRouter();

//   // -------------------------------
//   // 📌 FORM SUBMISSION
//   // -------------------------------
//   const handleFormSubmit = async (prevState: any, formData: FormData) => {
//     try {
//       const formValues = {
//         title: formData.get("title") as string,
//         description: formData.get("description") as string,
//         category: formData.get("category") as string,
//         link: formData.get("link") as string,
//         country: formData.get("country") as string,
//         universityName: formData.get("universityName") as string,
//       };

//       await formSchema.parseAsync(formValues);

//       if (!formData.get("pdfFile")) {
//         toast.error("Please upload a PDF file");
//         setErrors((prev) => ({ ...prev, pdfFile: "PDF file is required" }));
//         return prevState;
//       }

//       // 1️⃣ Save to Sanity
//       const result = await createPitch(prevState, formData);

//       toast.success("Notes uploaded. Starting AI review…");

//       // 2️⃣ AI REVIEW STARTS HERE
//       setAiStatus("reviewing");

//       const reviewResponse = await fetch("/api/review", {
//         method: "POST",
//         body: JSON.stringify({
//           noteId: result._id,
//           pdf_url: result.pdfUrl,
//           description: formValues.description,
//         }),
//       });

//       const reviewData = await reviewResponse.json();

//       setAiStatus("done");

//       if (!reviewData.success) {
//         toast.error("AI Review Failed: " + reviewData.error);
//         return prevState;
//       }

//       // 3️⃣ SHOW FINAL RESULT POPUP
//       if (reviewData.status === "approved") {
//         toast.success(`Approved ✅ — ${reviewData.reason || ""}`);
//       } else {
//         toast.error(`Rejected ❌ — ${reviewData.reason || ""}`);
//       }

//       // 4️⃣ Go to notes page
//       router.push(`/notespage/${result._id}`);

//       return { ...prevState, status: "SUCCESS" };
//     } catch (error: any) {
//       if (error instanceof z.ZodError) {
//         const fieldErrors = error.flatten().fieldErrors;
//         setErrors(fieldErrors as Record<string, string>);
//         toast.error("Validation failed.");
//         return { ...prevState, status: "ERROR" };
//       }

//       toast.error("Unexpected error: " + error.message);
//       return prevState;
//     }
//   };

//   const [state, formAction, isPending] = useActionState(handleFormSubmit, {
//     status: "INITIAL",
//   });

//   // -----------------------------------------------------
//   // UI COMPONENT
//   // -----------------------------------------------------
//   return (
//     <>
//       <Toaster richColors closeButton position="top-right" />

//       {/* AI REVIEW LOADER */}
//       {aiStatus === "reviewing" && (
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-500 mx-auto mb-4" />
//             <p className="text-lg font-semibold">AI Reviewing…</p>
//             <p className="text-sm text-gray-600 mt-1">
//               This usually takes 4–10 seconds
//             </p>
//           </div>
//         </div>
//       )}

//       <form action={formAction} className="startup-form space-y-6">
//         {/* TITLE */}
//         <div>
//           <label htmlFor="title" className="startup-form_label">
//             Title
//           </label>
//           <Input
//             id="title"
//             name="title"
//             className="startup-form_input"
//             required
//             placeholder="Notes Title"
//           />
//           {errors.title && <p className="startup-form_error">{errors.title}</p>}
//         </div>

//         {/* DESCRIPTION */}
//         <div>
//           <label htmlFor="description" className="startup-form_label">
//             Description
//           </label>
//           <Textarea
//             id="description"
//             name="description"
//             className="startup-form_textarea"
//             required
//             placeholder="Describe your notes"
//           />
//           {errors.description && (
//             <p className="startup-form_error">{errors.description}</p>
//           )}
//         </div>

//         {/* CATEGORY */}
//         <div>
//           <label htmlFor="category" className="startup-form_label">
//             Category
//           </label>
//           <Input
//             id="category"
//             name="category"
//             className="startup-form_input"
//             required
//             placeholder="Notes category"
//           />
//         </div>

//         {/* IMAGE URL */}
//         <div>
//           <label htmlFor="link" className="startup-form_label">
//             Image URL
//           </label>
//           <Input
//             id="link"
//             name="link"
//             className="startup-form_input"
//             required
//             placeholder="Thumbnail image URL"
//           />
//         </div>

//         {/* COUNTRY */}
//         <div>
//           <label htmlFor="country" className="startup-form_label">
//             Country
//           </label>
//           <Input
//             id="country"
//             name="country"
//             className="startup-form_input"
//             required
//             placeholder="Your country"
//           />
//         </div>

//         {/* UNIVERSITY NAME */}
//         <div>
//           <label htmlFor="universityName" className="startup-form_label">
//             University Name
//           </label>
//           <Input
//             id="universityName"
//             name="universityName"
//             className="startup-form_input"
//             required
//             placeholder="Your university"
//           />
//         </div>

//         {/* PDF UPLOAD */}
//         <div>
//           <label htmlFor="pdfFile" className="startup-form_label">
//             Upload PDF
//           </label>
//           <Input
//             id="pdfFile"
//             name="pdfFile"
//             type="file"
//             accept=".pdf"
//             required
//             onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
//           />
//           {errors.pdfFile && (
//             <p className="startup-form_error">{errors.pdfFile}</p>
//           )}
//         </div>

//         {/* SUBMIT BUTTON */}
//         <Button
//           type="submit"
//           className="startup-form_btn text-white"
//           disabled={isPending || aiStatus === "reviewing"}
//         >
//           {isPending ? "Uploading…" : "Submit & Review"}
//           <Send className="size-5 ml-2" />
//         </Button>
//       </form>
//     </>
//   );
// };

// export default SubmissionForm;



"use client";

import React, { useState } from "react";
import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { z } from "zod";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { createPitch } from "@/lib/actions";


const SubmissionForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const router = useRouter();

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
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
      //pdf upload
      if (!formData.get("pdfFile")) {
        toast.error("Please upload a PDF file");
        setErrors((prev) => ({ ...prev, pdfFile: "PDF file is required" }));
        return { ...prevState, status: "ERROR" };
      }
       const result = await createPitch(prevState, formData);

      // Success toast
      toast.success("Your Notes has been created successfully");

      // You can redirect or perform any action here
      router.push(`/notespage/${result._id}`);

      return { ...prevState, status: "SUCCESS" };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors as Record<string, string>);

        toast.error("Validation failed. Please check your inputs.");

        return { ...prevState, error: "Validation failed", status: "ERROR" };
      }

      toast.error("An unexpected error has occurred.");

      return { ...prevState, error: "Unknown error", status: "ERROR" };
    }
  };

  const [state, formAction, isPending] = useActionState(
    handleFormSubmit,
    {
      error: "",
      status: "INITIAL",
    }
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
          {errors.link && (
            <p className="startup-form_error">{errors.link}</p>
          )}
        </div>
             {/* Country */}
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
          {errors.country && <p className="startup-form_error">{errors.country}</p>}
        </div>
             {/* University Name */}
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
          <Input
            id="pdfFile"
            name="pdfFile"
            type="file"
            accept=".pdf"
            onChange={(e) => {
              if (e.target.files?.[0]) setPdfFile(e.target.files[0]);
            }}
            required
          />
          {errors.pdfFile && <p className="startup-form_error">{errors.pdfFile}</p>}
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

