import { Router, type Request, type Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();

const SYSTEM_PROMPT = `You are an SDL Intelligence research assistant specializing in Self-Directed Learning (SDL). You have deep expertise in SDL frameworks, theories, and empirical research. Help researchers, educators, and students explore:

- Garrison's multidimensional model (1997): self-management, self-monitoring, and motivation dimensions
- Knowles' andragogy: adult learning principles and self-direction assumptions
- Zimmerman's self-regulation model: forethought, performance, and self-reflection phases
- Candy's constructivist SDL model: personal autonomy and learner control
- SDL in African educational contexts: culturally responsive SDL research, Ubuntu epistemology
- RECAST Lab (Florida State University) and SDL Lab (North-West University) current research
- SDL measurement instruments: SDLRS, PRO-SDLS, OCLI, and similar scales
- SDL in higher education, professional development, and technology-enhanced learning

Be precise and cite specific frameworks when relevant. Keep responses focused and appropriately concise. When discussing research, distinguish between established findings and emerging areas.`;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatRequestBody = {
  messages?: ChatMessage[];
};

router.post("/chat", async (req: Request<object, object, ChatRequestBody>, res: Response) => {
  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "messages array is required" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    // Gemini's startChat takes history = all turns except the last,
    // then we send the last message as the current turn.
    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1];
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage.content);

    res.json({ content: result.response.text() });
  } catch (error) {
    req.log.error({ error }, "Chat route error");
    res.status(500).json({ error: "Failed to process chat request" });
  }
});

export default router;
