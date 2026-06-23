import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Note } from "@/models/note";

export const runtime = "nodejs";

type PdfNote = {
  fileUrl?: string;
  fileName?: string;
};

function safePdfName(fileName?: string) {
  const fallback = "note.pdf";
  if (!fileName) return fallback;

  const normalized = fileName.replace(/[\r\n/\\?%*:|"<>;]/g, "-").trim();
  if (!normalized) return fallback;

  return normalized.toLowerCase().endsWith(".pdf")
    ? normalized
    : `${normalized}.pdf`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ notesId: string }> },
) {
  const { notesId } = await params;

  if (!mongoose.Types.ObjectId.isValid(notesId)) {
    return NextResponse.json({ message: "Invalid note id" }, { status: 400 });
  }

  await connectDB();

  const note = (await Note.findById(notesId)
    .select("fileUrl fileName")
    .lean()) as PdfNote | null;
  if (!note?.fileUrl) {
    return NextResponse.json({ message: "PDF not found" }, { status: 404 });
  }

  const pdfResponse = await fetch(note.fileUrl, { cache: "no-store" });
  if (!pdfResponse.ok || !pdfResponse.body) {
    return NextResponse.json(
      { message: "Unable to load PDF" },
      { status: 502 },
    );
  }

  const shouldDownload = request.nextUrl.searchParams.get("download") === "1";
  const fileName = safePdfName(note.fileName);

  return new NextResponse(pdfResponse.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${shouldDownload ? "attachment" : "inline"}; filename="${fileName}"`,
      "Cache-Control": "private, max-age=300",
    },
  });
}
