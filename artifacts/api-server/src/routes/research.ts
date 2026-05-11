import { Router, type Request, type Response } from "express";
import { searchAllSources } from "../lib/research-search.js";

const router = Router();

router.get("/research", async (req: Request, res: Response) => {
  const query = typeof req.query.q === "string" && req.query.q.trim()
    ? req.query.q.trim()
    : "self-directed learning";

  const limitParam = typeof req.query.limit === "string" ? parseInt(req.query.limit, 10) : 8;
  const limit = Number.isNaN(limitParam) || limitParam < 1 ? 8 : Math.min(limitParam, 20);

  try {
    const coreApiKey = process.env.CORE_API_KEY;
    const results = await searchAllSources(query, limit, coreApiKey);
    res.json({ query, results });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    req.log.error({ error: message }, "Research search error");
    res.status(500).json({ error: message });
  }
});

export default router;
