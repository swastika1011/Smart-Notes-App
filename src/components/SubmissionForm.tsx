"use client";

// import React, { useState, useActionState } from "react";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Send } from "lucide-react";
// import { formSchema } from "@/lib/validation";
// import { z } from "zod";
// import { Toaster, toast } from "sonner"

// import { useRouter } from "next/navigation";


// const SubmissionForm = () => {
//   const [errors, setErrors] = useState<Record<string, string>>({});
// //   const [pitch, setPitch] = useState("");
  
//   const router = useRouter();

//   const handleFormSubmit = async (prevState: any, formData: FormData) => {
//     try {
//       const formValues = {
//         title: formData.get("title") as string,
//         description: formData.get("description") as string,
//         category: formData.get("category") as string,
//         link: formData.get("link") as string,
//         // pitch,
//       };

//       await formSchema.parseAsync(formValues);

//     //   const result = await createPitch(prevState, formData, pitch);

//     //   if (result.status == "SUCCESS") {
//     //     toast({
//     //       title: "Success",
//     //       description: "Your startup pitch has been created successfully",
//     //     });

//         // router.push(`/startup/${result._id}`);
//     //   }

//     //   return result;
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         const fieldErorrs = error.flatten().fieldErrors;

//         setErrors(fieldErorrs as unknown as Record<string, string>);

//         toast({
//           title: "Error",
//           description: "Please check your inputs and try again",
//           variant: "destructive",
//         });

//         return { ...prevState, error: "Validation failed", status: "ERROR" };
//       }

//       toast({
//         title: "Error",
//         description: "An unexpected error has occurred",
//         variant: "destructive",
//       });

//       return {
//         ...prevState,
//         error: "An unexpected error has occurred",
//         status: "ERROR",
//       };
//     }
//   };

//   const [state, formAction, isPending] = useActionState(handleFormSubmit, {
//     error: "",
//     status: "INITIAL",
//   });

//   return (
//     <form action={formAction} className="startup-form">
//       <div>
//         <label htmlFor="title" className="startup-form_label">
//           Title
//         </label>
//         <Input
//           id="title"
//           name="title"
//           className="startup-form_input"
//           required
//           placeholder="Startup Title"
//         />

//         {errors.title && <p className="startup-form_error">{errors.title}</p>}
//       </div>

//       <div>
//         <label htmlFor="description" className="startup-form_label">
//           Description
//         </label>
//         <Textarea
//           id="description"
//           name="description"
//           className="startup-form_textarea"
//           required
//           placeholder="Startup Description"
//         />

//         {errors.description && (
//           <p className="startup-form_error">{errors.description}</p>
//         )}
//       </div>

//       <div>
//         <label htmlFor="category" className="startup-form_label">
//           Category
//         </label>
//         <Input
//           id="category"
//           name="category"
//           className="startup-form_input"
//           required
//           placeholder="Startup Category (Tech, Health, Education...)"
//         />

//         {errors.category && (
//           <p className="startup-form_error">{errors.category}</p>
//         )}
//       </div>

//       <div>
//         <label htmlFor="link" className="startup-form_label">
//           Image URL
//         </label>
//         <Input
//           id="link"
//           name="link"
//           className="startup-form_input"
//           required
//           placeholder="Startup Image URL"
//         />

//         {errors.link && <p className="startup-form_error">{errors.link}</p>}
//       </div>

//       <div data-color-mode="light">
//         <label htmlFor="pitch" className="startup-form_label">
//           Upload Pdf
//         </label>
//         {/* add for pdf submission */}
//       </div>

//       <Button
//         type="submit"
//         className="startup-form_btn text-white"
//         disabled={isPending}
//       >
//         {isPending ? "Submitting..." : "Submit Your Notes"}
//         <Send className="size-6 ml-2" />
//       </Button>
//     </form>
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
            placeholder="Startup Title"
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
            placeholder="Startup Description"
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
