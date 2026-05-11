import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { config } from "dotenv";

// Resolve .env from this file's location at runtime.
// In the esbuild output, import.meta.url = the bundled dist/index.mjs URL,
// so dirname(...) = artifacts/api-server/dist, and "../.env" = artifacts/api-server/.env.
// This is CWD-independent — it works no matter where pnpm launches the process from.
const envPath = resolve(dirname(fileURLToPath(import.meta.url)), "../.env");
const result = config({ path: envPath });

if (result.error) {
  console.warn(`[env] .env not found at ${envPath} — falling back to process environment`);
} else {
  console.log(`[env] Loaded .env from ${envPath}`);
}
