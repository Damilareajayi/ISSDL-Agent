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
  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";

  if (!apiKey) {
    res.status(500).json({ ok: false, error: "GEMINI_API_KEY is not set" });
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

export default router;
