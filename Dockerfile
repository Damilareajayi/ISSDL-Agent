# syntax=docker/dockerfile:1

# ---- build stage ----
FROM node:22-alpine AS builder

RUN corepack enable

WORKDIR /app

# Copy workspace manifests first so dependency install is cached separately
# from source changes.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY lib/api-zod/package.json            ./lib/api-zod/
COPY lib/db/package.json                 ./lib/db/
COPY lib/api-client-react/package.json   ./lib/api-client-react/
COPY lib/api-spec/package.json           ./lib/api-spec/
COPY artifacts/api-server/package.json   ./artifacts/api-server/
COPY artifacts/sdl-intelligence/package.json ./artifacts/sdl-intelligence/
COPY artifacts/mockup-sandbox/package.json   ./artifacts/mockup-sandbox/
COPY scripts/package.json                ./scripts/

RUN pnpm install --frozen-lockfile

# Copy full source and build
COPY . .

# Build order matters: frontend first (Vite → dist/public), then backend (esbuild → dist/)
RUN pnpm build

# ---- runtime stage ----
FROM node:22-alpine AS runtime

WORKDIR /app

# Install only the packages that esbuild intentionally externalised and are
# therefore absent from dist/index.mjs but required at runtime.
# - dotenv    : explicit external in build.mjs
# - @google/generative-ai : matched by the "@google/*" glob external
RUN npm install --no-save dotenv @google/generative-ai

# Compiled Express server bundle + source maps
COPY --from=builder /app/artifacts/api-server/dist ./artifacts/api-server/dist

# Built React SPA — Express serves this as static files.
# The default STATIC_DIR resolves to this path relative to dist/index.mjs,
# so no STATIC_DIR env var is needed unless you move the files.
COPY --from=builder /app/artifacts/sdl-intelligence/dist/public ./artifacts/sdl-intelligence/dist/public

ENV NODE_ENV=production

# Cloud Run injects PORT at runtime; Express already reads process.env.PORT.
EXPOSE 8080

CMD ["node", "--enable-source-maps", "./artifacts/api-server/dist/index.mjs"]
