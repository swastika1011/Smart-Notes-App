export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = "qwen/qwen2-vl-7b-instruct:free";

export async function POST(req: Request) {
  try {
    const { noteId, pdf_url, description } = await req.json();

    if (!noteId || !pdf_url || !description) {
      return NextResponse.json(
        { success: false, error: "Missing data in request" },
        { status: 400 },
      );
    }

    const pdfRes = await fetch(pdf_url);
    if (!pdfRes.ok) throw new Error("Failed to fetch PDF");

    const pdfBase64 = Buffer.from(await pdfRes.arrayBuffer()).toString(
      "base64",
    );

    const openrouterRes = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Review this note against the description and return JSON with match, safe, and reason fields. Description: ${description}`,
                },
                {
                  type: "input_file",
                  mime_type: "application/pdf",
                  data: pdfBase64,
                },
              ],
            },
          ],
        }),
      },
    );

    if (!openrouterRes.ok) {
      const errorBody = await openrouterRes.text();
      throw new Error("OpenRouter error: " + errorBody);
    }

    const aiData = await openrouterRes.json();
    const message = aiData.choices?.[0]?.message?.content || "";
    const match = message.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("AI response not in valid JSON format");

    const extracted = JSON.parse(match[0]);
    const status = extracted.match && extracted.safe ? "approved" : "rejected";

    return NextResponse.json({
      success: true,
      status,
      reason: extracted.reason,
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
