import path from "path";
import fs from "fs";
import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// Serve the built React frontend in production.
// STATIC_DIR can be set explicitly; otherwise defaults to the Vite build output
// location relative to this file (artifacts/api-server/dist → artifacts/sdl-intelligence/dist/public).
const staticDir = process.env["STATIC_DIR"]
  ?? path.resolve(import.meta.dirname, "../../sdl-intelligence/dist/public");

if (fs.existsSync(staticDir)) {
  app.use(express.static(staticDir));
  // SPA fallback — any non-API route returns index.html
  app.use((_req, res) => {
    res.sendFile(path.join(staticDir, "index.html"));
  });
  logger.info({ staticDir }, "Serving static frontend");
}

export default app;
