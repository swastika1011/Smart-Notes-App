// import { execFile } from "node:child_process";
// import { randomUUID } from "node:crypto";
// import { mkdir, rm, writeFile } from "node:fs/promises";
// import { tmpdir } from "node:os";
// import path from "node:path";
// import { promisify } from "node:util";

// const execFileAsync = promisify(execFile);

// type DoclingOutput = {
//   text?: string;
//   error?: string;
// };

// async function runDocling(scriptPath: string, pdfPath: string) {
//   const candidates =
//     process.env.DOCLING_PYTHON?.trim()
//       ? [process.env.DOCLING_PYTHON.trim()]
//       : process.platform === "win32"
//         ? ["python", "py"]
//         : ["python3", "python"];

//   let lastError: unknown;

//   for (const command of candidates) {
//     try {
//       const args = command === "py" ? ["-3", scriptPath, pdfPath] : [scriptPath, pdfPath];
//       return await execFileAsync(command, args, {
//         maxBuffer: 20 * 1024 * 1024,
//         timeout: 300_000,
//       });
//     } catch (error) {
//       lastError = error;
//     }
//   }

//   throw lastError;
// }

// export async function extractTextWithDocling(file: File) {
//   const bytes = Buffer.from(await file.arrayBuffer());
//   const tempDir = path.join(tmpdir(), "smartnotes-docling");
//   const tempPath = path.join(tempDir, `${randomUUID()}.pdf`);
//   const scriptPath = path.join(process.cwd(), "scripts", "extract_pdf_text_docling.py");

//   await mkdir(tempDir, { recursive: true });
//   await writeFile(tempPath, bytes);

//   try {
//     const { stdout } = await runDocling(scriptPath, tempPath);
//     const parsed = JSON.parse(stdout.trim()) as DoclingOutput;

//     if (parsed.error) {
//       throw new Error(parsed.error);
//     }

//     const text = parsed.text?.trim();
//     if (!text) {
//       throw new Error("Docling could not extract readable text from this PDF.");
//     }

//     return text;
//   } catch (error) {
//     const message = error instanceof Error ? error.message : String(error);

//     if (message.includes("No module named") || message.includes("ModuleNotFoundError")) {
//       throw new Error(
//         "Docling is not installed. Install it with `pip install docling`, or set DOCLING_PYTHON to a Python executable that has docling installed.",
//       );
//     }

//     throw new Error(`Docling extraction failed: ${message}`);
//   } finally {
//     await rm(tempPath, { force: true });
//   }
// }
