import { resolve } from "path";
import { existsSync, readFileSync } from "fs";

// esbuild's build banner sets globalThis.__dirname to the directory of the
// compiled dist/index.mjs — completely independent of process.cwd().
// This resolves to artifacts/api-server/dist, so "../.env" → artifacts/api-server/.env.
// eslint-disable-next-line no-var
declare var __dirname: string | undefined;
const bundleDir: string | undefined = typeof __dirname !== "undefined" ? __dirname : undefined;

// Check candidates in order; first one found wins.
const candidates = [
  ...(bundleDir ? [resolve(bundleDir, "../.env")] : []),
  resolve(process.cwd(), ".env"),
];

let loaded = false;

for (const envPath of candidates) {
  if (!existsSync(envPath)) continue;
  try {
    // Parse manually — avoids dotenv bundling quirks and CWD dependency.
    const raw = readFileSync(envPath, "utf-8").replace(/^﻿/, ""); // strip BOM
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      // Strip surrounding quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      // Don't override vars already set in the real environment
      if (!(key in process.env)) process.env[key] = val;
    }
    console.log(`[env] Loaded ${envPath}`);
    loaded = true;
  } catch (e) {
    console.error(`[env] Failed to read ${envPath}:`, e);
  }
  break;
}

if (!loaded) {
  console.warn(`[env] .env not found. Searched: ${candidates.join(", ")}`);
  console.warn(`[env] GEMINI_API_KEY must be set in the process environment.`);
}
