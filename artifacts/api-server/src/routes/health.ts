import { Router, type IRouter } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { HealthCheckResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});

// Diagnostic: verifies the Gemini API key and model are working.
// Hit /api/healthz/gemini to see the exact error if chat is returning 500.
router.get("/healthz/gemini", async (_req, res) => {
  const { existsSync } = await import("fs");
  const { resolve } = await import("path");

  // Show exactly where the server is looking for .env
  const bundleDir: string | undefined = (globalThis as Record<string, unknown>).__dirname as string | undefined;
  const cwd = process.cwd();
  const envCandidates = [
    ...(bundleDir ? [resolve(bundleDir, "../.env")] : []),
    resolve(cwd, ".env"),
  ];
  const diagnostic = {
    cwd,
    bundleDirFromBanner: bundleDir ?? "(not set)",
    envCandidates,
    candidateExists: envCandidates.map(p => ({ path: p, exists: existsSync(p) })),
    geminiKeySet: !!process.env.GEMINI_API_KEY,
  };

  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";

  if (!apiKey) {
    res.status(500).json({ ok: false, error: "GEMINI_API_KEY is not set", diagnostic });
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("Reply with the single word: ok");
    const text = result.response.text().trim();
    res.json({ ok: true, model: modelName, response: text });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ ok: false, model: modelName, error: message });
  }
});

// Lists all models available to the configured API key
router.get("/healthz/models", async (_req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "GEMINI_API_KEY is not set" });
    return;
  }
  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}&pageSize=50`
    );
    const body = await r.json() as { models?: { name: string; supportedGenerationMethods?: string[] }[] };
    const generateModels = (body.models ?? [])
      .filter(m => m.supportedGenerationMethods?.includes("generateContent"))
      .map(m => m.name.replace("models/", ""));
    res.json({ generateContentModels: generateModels });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: message });
  }
});

export default router;
