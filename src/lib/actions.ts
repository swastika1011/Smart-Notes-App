"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "@/lib/utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";
import { notes } from "@/sanity/schemaTypes/notes";

export const createPitch = async (
  state: any,
  form: FormData
) => {
  const session = await auth();

  if (!session)
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });

  const { title, description, category, link } = Object.fromEntries(form);
  const country = form.get("country") as string | undefined;
  const universityName = form.get("universityName") as string | undefined;
  const file = form.get("pdfFile") as File | null;

   if (!title || !description || !category || !link || !file) {
    return parseServerActionResponse({
      error: "Missing required fields",
      status: "ERROR",
    });
  }

  const slug = slugify(title as string, { lower: true, strict: true });

  try {

     // 1. Upload PDF file asset to Sanity
    const uploadedFile = await writeClient.assets.upload("file", file, {
      contentType: file.type,
      filename: file.name,
    });

    await writeClient
      .patch(session.id) // session.id should be author _id
      .set({
        ...(country ? { country } : {}),
        ...(universityName ? { universityName } : {}),
      })
      .commit();

    const notes = {
      title,
      description,
      category,
      image: link,
      slug: {
        _type: "slug",
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: session?.id,
      },
       file: {
        _type: "file",
        asset: {
          _type: "reference",
          _ref: uploadedFile._id,
        },
      },
      
    };

    const result = await writeClient.create({ _type: "notes", ...notes });
        // 3️⃣ Trigger AI review (asynchronous call)
    const pdfUrl = uploadedFile.url || uploadedFile._url || "";
    if (pdfUrl) {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          noteId: result._id,
          pdf_url: pdfUrl,
          description,
        }),
      }).catch((err) => console.error("AI review trigger failed:", err));
    }

    return parseServerActionResponse({
      ...result,
       pdfUrl: uploadedFile.url,  
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.error("CreatePitch error:", error);
    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });

  }
};
