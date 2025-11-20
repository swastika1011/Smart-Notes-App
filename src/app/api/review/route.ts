/*
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/write-client";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = "meta-llama/llama-3.1-8b-instruct:free";

export async function POST(req: Request) {
  try {
    const { noteId, pdf_url, description } = await req.json();

    // ⬇️ Fix: dynamic import (works always)
// correct import for pdf-parse in Next.js + ESM
const pdfParse = require("pdf-parse");

    // 1️⃣ Fetch PDF
    const pdf = await fetch(pdf_url);
    if (!pdf.ok) throw new Error("Failed to fetch PDF file.");

    const arrayBuffer = await pdf.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2️⃣ Extract text
    const parsed = await pdfParse(buffer);
    const extractedText = parsed.text || "";

    // 3️⃣ Prompt
    const prompt = `
You are verifying a study note uploaded by an author.

DESCRIPTION:
"${description}"

DOCUMENT CONTENT (trimmed):
"${extractedText.slice(0, 3000)}"

TASK:
1. Does the document match the description? (true/false)
2. Is the content safe? (true/false)
3. Provide a short reason.

Return ONLY this JSON:
{
  "match": true/false,
  "safe": true/false,
  "reason": "..."
}
`;

    // 4️⃣ Call OpenRouter
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "{}";

    // Extract JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const parsedAI = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    const newStatus = parsedAI.match && parsedAI.safe ? "approved" : "rejected";

    await writeClient.patch(noteId)
      .set({
        status: newStatus,
        aiReason: parsedAI.reason || "No reason provided",
      })
      .commit();

    return NextResponse.json({
      success: true,
      status: newStatus,
      reason: parsedAI.reason,
    });

  } catch (err: any) {
    console.error("AI Review Error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
*/
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/write-client";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = "qwen/qwen2-vl-7b-instruct:free"; // supports PDF

export async function POST(req: Request) {
  try {
    const { noteId, pdf_url, description } = await req.json();

    if (!noteId || !pdf_url || !description) {
      return NextResponse.json(
        { success: false, error: "Missing data in request" },
        { status: 400 }
      );
    }

    // 1️⃣ Fetch PDF from Sanity CDN
    const pdfRes = await fetch(pdf_url);
    if (!pdfRes.ok) throw new Error("Failed to fetch PDF");

    const pdfBuffer = Buffer.from(await pdfRes.arrayBuffer());

    // Convert PDF to base64 for OpenRouter
    const pdfBase64 = pdfBuffer.toString("base64");

    // 2️⃣ Prepare request for Vision Model
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
                { type: "text", text: description },
                {
                  type: "input_file",
                  mime_type: "application/pdf",
                  data: pdfBase64,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!openrouterRes.ok) {
      const err = await openrouterRes.text();
      throw new Error("OpenRouter error: " + err);
    }

    const aiData = await openrouterRes.json();
    const message = aiData.choices?.[0]?.message?.content || "";

    // Extract JSON if model outputs extra text
    let extracted;
    try {
      const match = message.match(/\{[\s\S]*\}/);
      extracted = JSON.parse(match[0]);
    } catch {
      throw new Error("AI response not in valid JSON format");
    }

    const newStatus =
      extracted.match && extracted.safe ? "approved" : "rejected";

    // 3️⃣ Update Sanity document
    await writeClient.patch(noteId).set({
      status: newStatus,
      aiReason: extracted.reason || "",
    })
    .commit();

    return NextResponse.json({
      success: true,
      status: newStatus,
      reason: extracted.reason,
    });

  } catch (err: any) {
    console.error("AI REVIEW ERROR:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}

// export const runtime = "nodejs";
// export const dynamic = "force-dynamic";

// import { NextResponse } from "next/server";
// import { writeClient } from "@/sanity/lib/write-client";

// const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
// const MODEL = "qwen/qwen2-vl-7b-instruct:free";

// export async function POST(req: Request) {
//   try {
//     const { noteId, pdf_url, description } = await req.json();

//     if (!pdf_url || !description || !noteId) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     // ---------------------------------------------------
//     // 1️⃣ Fetch PDF from URL and convert to File
//     // ---------------------------------------------------
//     const pdfRes = await fetch(pdf_url);
//     if (!pdfRes.ok) throw new Error("Failed to fetch PDF from Sanity.");

//     const arrayBuffer = await pdfRes.arrayBuffer();
//     const blob = new Blob([arrayBuffer], { type: "application/pdf" });

//     const pdfFile = new File([blob], "file.pdf", {
//       type: "application/pdf",
//     });

//     // ---------------------------------------------------
//     // 2️⃣ Build FormData for OpenRouter
//     // ---------------------------------------------------
//     const aiForm = new FormData();

//     aiForm.append("model", MODEL);

//     aiForm.append(
//       "input",
//       JSON.stringify({
//         prompt: `
// You are a strict file reviewer. Analyze the PDF uploaded.

// DESCRIPTION:
// "${description}"

// TASK:
// 1. Determine if the PDF content matches the description (true/false).
// 2. Check if the PDF contains vulgar, explicit, sexual, hateful, or offensive content (true/false).
// 3. Return ONLY JSON:

// {
//   "match": true/false,
//   "safe": true/false,
//   "reason": "short explanation"
// }
// `
//       })
//     );

//     aiForm.append("files", pdfFile);

//     // ---------------------------------------------------
//     // 3️⃣ Send PDF + description to OpenRouter
//     // ---------------------------------------------------
//     const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${OPENROUTER_API_KEY}`,
//       },
//       body: aiForm,
//     });

//     const aiData = await aiRes.json();

//     const aiText = aiData.choices?.[0]?.message?.content || "{}";

//     // Extract JSON returned by AI
//     const jsonMatch = aiText.match(/\{[\s\S]*\}/);
//     const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

//     const status =
//       parsed.match && parsed.safe ? "approved" : "rejected";

//     // ---------------------------------------------------
//     // 4️⃣ Update Sanity document
//     // ---------------------------------------------------
//     await writeClient
//       .patch(noteId)
//       .set({
//         status,
//         aiReason: parsed.reason || "No reason provided",
//       })
//       .commit();

//     // ---------------------------------------------------
//     // 5️⃣ Return response
//     // ---------------------------------------------------
//     return NextResponse.json({
//       status,
//       reason: parsed.reason,
//       raw: parsed,
//     });

//   } catch (err: any) {
//     console.error("AI Review Error:", err);
//     return NextResponse.json(
//       { success: false, error: err.message },
//       { status: 500 }
//     );
//   }
// }



