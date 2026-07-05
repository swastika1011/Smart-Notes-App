import { execFile } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

type Output = {
  text?: string;
  error?: string;
};

async function runPython(scriptPath: string, pdfPath: string) {
  const candidates =
    process.env.PYTHON_EXECUTABLE?.trim()
      ? [process.env.PYTHON_EXECUTABLE.trim()]
      : process.platform === "win32"
        ? ["python", "py"]
        : ["python3", "python"];

  let lastError: unknown;

  for (const command of candidates) {
    try {
      const args =
        command === "py"
          ? ["-3", scriptPath, pdfPath]
          : [scriptPath, pdfPath];

      return await execFileAsync(command, args, {
        timeout: 300000,
        maxBuffer: 50 * 1024 * 1024,
      });
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError;
}

export async function extractPdfText(file: File): Promise<string>  {
  const tempDir = path.join(tmpdir(), "smartnotes");

  await mkdir(tempDir, { recursive: true });

  const pdfPath = path.join(tempDir, `${randomUUID()}.pdf`);

const buffer = Buffer.from(await file.arrayBuffer());

await writeFile(pdfPath, buffer);
try {
    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "extract_pdf_text.py"
    );

const { stdout } = await runPython(scriptPath, pdfPath);

let parsed: Output;

try {
  parsed = JSON.parse(stdout.trim()) as Output;
} catch {
  throw new Error(`Python returned invalid JSON:\n${stdout}`);
}

if (parsed.error) {
  throw new Error(parsed.error);
}

const text = parsed.text;

if (!text) {
  throw new Error("Unable to extract text from PDF.");
}

return text;
  } 
finally {
await rm(pdfPath, {
  force: true,
  maxRetries: 3,
});
}
}