import { reviewDocumentText } from "@/lib/ai/reviewDocument";
import { extractTextWithDocling } from "@/lib/pdf/extractTextWithDocling";

type ReviewableStatus = "approved" | "rejected" | "processing_failed";

export type NoteReviewResult = {
  extractedText: string;
  status: ReviewableStatus;
  reviewReason: string;
  reviewIssues: string[];
  reviewedAt: Date;
};

export async function downloadPdfAsFile(url: string, fileName?: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download PDF for review (${response.status}).`);
  }

  return new File([await response.arrayBuffer()], fileName || "note.pdf", {
    type: "application/pdf",
  });
}

export async function reviewNotePdf(params: {
  title: string;
  description: string;
  pdfFile: File;
}): Promise<NoteReviewResult> {
  const reviewedAt = new Date();

  try {
    const extractedText = await extractTextWithDocling(params.pdfFile);
    const review = await reviewDocumentText({
      title: params.title,
      description: params.description,
      extractedText,
    });

    return {
      extractedText,
      status: review.status,
      reviewReason: review.status === "approved" ? "" : review.reason,
      reviewIssues: review.issues,
      reviewedAt,
    };
  } catch (error) {
    console.error("NOTE REVIEW ERROR:", error);

    return {
      extractedText: "",
      status: "processing_failed",
      reviewReason:
        error instanceof Error ? error.message : "Document processing failed.",
      reviewIssues: [],
      reviewedAt,
    };
  }
}
