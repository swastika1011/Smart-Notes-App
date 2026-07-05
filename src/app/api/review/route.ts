export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { reviewDocumentText } from "@/lib/ai/reviewDocument";
import { extractPdfText } from "@/lib/pdf/extractPdfText";
export async function POST(req: Request) {
  try {
    const { noteId, pdf_url, title = "Uploaded note", description } = await req.json();

    if (!noteId || !pdf_url || !description) {
      return NextResponse.json(
        { success: false, error: "Missing data in request" },
        { status: 400 },
      );
    }

    const pdfRes = await fetch(pdf_url);
    if (!pdfRes.ok) throw new Error("Failed to fetch PDF");

    const pdfFile = new File([await pdfRes.arrayBuffer()], "review.pdf", {
      type: "application/pdf",
    });
    const extractedText = await extractPdfText(pdfFile);
    const review = await reviewDocumentText({ title, description, extractedText });

    return NextResponse.json({
      success: true,
      ...review,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("AI REVIEW ERROR:", err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 },
    );
  }
}
