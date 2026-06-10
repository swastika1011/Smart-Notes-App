"use server";

import { parseServerActionResponse } from "@/lib/utils";

export type ActionState = {
  error: string;
  status: "INITIAL" | "SUCCESS" | "ERROR";
};

export const createPitch = async (state: ActionState, form: FormData) => {
  const { title, description, category, link } = Object.fromEntries(form);
  const file = form.get("pdfFile") as File | null;

  if (!title || !description || !category || !link || !file) {
    return parseServerActionResponse({
      error: "Missing required fields",
      status: "ERROR",
    });
  }

  return parseServerActionResponse({
    error:
      "Notes API is not connected yet. Add the Express/MongoDB/JWT backend before enabling uploads.",
    status: "ERROR",
  });
};
