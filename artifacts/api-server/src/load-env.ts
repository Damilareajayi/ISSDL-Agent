import dotenv from "dotenv";
import { resolve } from "path";
import { existsSync } from "fs";

// esbuild banner sets globalThis.__dirname to the directory of dist/index.mjs
const bundleDir: string | undefined = (globalThis as Record<string, unknown>).__dirname as string | undefined;

const candidates = [
  ...(bundleDir ? [resolve(bundleDir, "../.env")] : []),
  resolve(process.cwd(), ".env"),
];

let loaded = false;
for (const p of candidates) {
  if (existsSync(p)) {
    // override: true ensures .env values win even if the variable already
    // exists in process.env (e.g. pnpm pre-sets PORT, NODE_ENV, etc.)
    dotenv.config({ path: p, override: true });
    console.log(`[env] Loaded ${p}`);
    loaded = true;
    break;
  }
}

if (!loaded) {
  console.warn(`[env] No .env file found. Searched:\n  ${candidates.join("\n  ")}`);
}
