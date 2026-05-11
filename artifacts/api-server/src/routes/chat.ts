import { Router, type Request, type Response } from "express";
import {
  GoogleGenerativeAI,
  FunctionCallingMode,
  SchemaType,
  type FunctionDeclaration,
} from "@google/generative-ai";
import { SDL_KNOWLEDGE_BASE } from "../lib/sdl-knowledge.js";
import { searchAllSources } from "../lib/research-search.js";

const router = Router();

const SYSTEM_PROMPT = `You are an SDL Intelligence research assistant — an authoritative expert on Self-Directed Learning (SDL). You are grounded in the following curated knowledge base and should cite specific frameworks, researchers, and publications when relevant.

${SDL_KNOWLEDGE_BASE}

## Behavioral Guidelines
- Be precise: cite authors, years, and framework names specifically.
- Be concise: match response length to the complexity of the question.
- Be honest: distinguish between well-established findings and emerging or contested ideas.
- When you search for publications, synthesize the results — do not just list them. Explain what each paper contributes.
- For African/Global South SDL questions, engage with Ubuntu philosophy and communal learning perspectives.`;

const searchPublicationsTool: FunctionDeclaration = {
  name: "search_publications",
  description:
    "Search academic databases (OpenAlex, Semantic Scholar, CORE) for peer-reviewed publications on self-directed learning or a related topic. Use this when the user asks about recent research, specific studies, empirical evidence, or current trends in SDL.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      query: {
        type: SchemaType.STRING,
        description:
          "The search query — be specific, e.g. 'self-directed learning higher education Africa' or 'SDL readiness measurement instruments'",
      },
    },
    required: ["query"],
  },
};

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
    const modelName = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: SYSTEM_PROMPT,
      tools: [{ functionDeclarations: [searchPublicationsTool] }],
      toolConfig: { functionCallingConfig: { mode: FunctionCallingMode.AUTO } },
    });

    // Gemini requires history to start with "user". Drop any leading assistant
    // messages (e.g. the synthetic welcome message from the frontend).
    const allHistory = messages.slice(0, -1).map((m) => ({
      role: (m.role === "assistant" ? "model" : "user") as "model" | "user",
      parts: [{ text: m.content }],
    }));
    const firstUserIdx = allHistory.findIndex((m) => m.role === "user");
    const history = firstUserIdx === -1 ? [] : allHistory.slice(firstUserIdx);

    const lastMessage = messages[messages.length - 1];
    const chat = model.startChat({ history });

    let result = await chat.sendMessage(lastMessage.content);
    let response = result.response;

    // Handle function calls (tool use)
    const candidate = response.candidates?.[0];
    const parts = candidate?.content?.parts ?? [];
    const functionCallPart = parts.find((p) => p.functionCall);

    if (functionCallPart?.functionCall) {
      const { name, args } = functionCallPart.functionCall;

      if (name === "search_publications") {
        const query = (args as { query: string }).query;
        const coreApiKey = process.env.CORE_API_KEY;
        const publications = await searchAllSources(query, 5, coreApiKey);

        result = await chat.sendMessage([
          {
            functionResponse: {
              name,
              response: { publications },
            },
          },
        ]);
        response = result.response;
      }
    }

    res.json({ content: response.text() });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    req.log.error({ error: message }, "Chat route error");
    res.status(500).json({ error: message });
  }
});

export default router;
