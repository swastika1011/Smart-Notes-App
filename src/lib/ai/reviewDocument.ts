import OpenAI from "openai";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MODEL =
  process.env.DOCUMENT_REVIEW_MODEL ||
  (OPENROUTER_API_KEY ? "openai/gpt-4o-mini" : "gpt-4o-mini");

export type DocumentReviewResult = {
  matchesDescription: boolean;
  isSafe: boolean;
  status: "approved" | "rejected";
  reason: string;
  issues: string[];
};

function getClient() {
  if (OPENROUTER_API_KEY) {
    return new OpenAI({
      apiKey: OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    });
  }

  if (OPENAI_API_KEY) {
    return new OpenAI({ apiKey: OPENAI_API_KEY });
  }

  throw new Error("Missing OPENROUTER_API_KEY or OPENAI_API_KEY.");
}

function parseReview(content: string): DocumentReviewResult {
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("AI response did not contain valid JSON.");
  }

  const parsed = JSON.parse(jsonMatch[0]) as Partial<DocumentReviewResult>;
  const matchesDescription = Boolean(parsed.matchesDescription);
  const isSafe = Boolean(parsed.isSafe);

  return {
    matchesDescription,
    isSafe,
    status: matchesDescription && isSafe ? "approved" : "rejected",
    reason: String(parsed.reason || "No reason provided."),
    issues: Array.isArray(parsed.issues) ? parsed.issues.map(String) : [],
  };
}

export async function reviewDocumentText(params: {
  title: string;
  description: string;
  extractedText: string;
}) {
  const client = getClient();
  const documentText = params.extractedText.slice(0, 45_000);

  const response = await client.chat.completions.create({
    model: MODEL,
    temperature: 0,
    messages: [
      {
        role: "system",
        content:
          "You moderate uploaded study-note PDFs. Return only JSON. Reject documents that do not match the submitted title/description, contain sexual content, hate/harassment, extremist content, illegal instructions, scams, malware, private credentials, or clearly harmful/wrong educational material.",
      },
      {
        role: "user",
        content: `Title: ${params.title}
Description: ${params.description}

Extracted PDF text:
${documentText}

Return this exact JSON shape:
{
  "matchesDescription": boolean,
  "isSafe": boolean,
  "reason": "short explanation",
  "issues": ["specific issue strings"]
}`,
      },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("AI review returned an empty response.");
  }

  return parseReview(content);
}
