# SDL Intelligence Platform

An AI-powered research platform for Self-Directed Learning (SDL), built for the International Society for Self-Directed Learning (ISSDL). The platform provides a grounded conversational assistant, live academic search, and interactive tools for researchers, educators, and students working in the SDL field.

**Live:** https://sdl-intelligence-373305531263.europe-west1.run.app

---

## Features

- **SDL Knowledge Chat** — Conversational AI grounded in the SDL knowledge base, citing frameworks, researchers, and publications. Powered by Google Gemini with live research retrieval.
- **Research Trends Explorer** — Searches OpenAlex, Semantic Scholar, and CORE (600M+ papers) in parallel and returns ranked, deduplicated results.
- **Framework Navigator** — Interactive reference for the major SDL frameworks: Knowles, Garrison, Candy, Zimmerman, and the PRO model.
- **Global Labs Map** — Profiles of leading SDL research centres: NWU SDL Unit, RECAST/FSU, ISSDL, FAU, and UTK.
- **Symposia & Events** — ISSDL symposium history, Knowles Award, NWU conferences, and the AOSIS open textbook series.
- **SDL Self-Assessment** — A 6-question SDLRS-based readiness quiz with four readiness levels.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 7, Tailwind CSS 4 |
| Backend | Node.js, Express v5, TypeScript |
| AI | Google Gemini (`@google/generative-ai`) |
| Research APIs | OpenAlex, Semantic Scholar, CORE |
| Build | esbuild (API), Vite (frontend), pnpm workspaces |
| Deployment | Docker, Google Cloud Run, Cloud Build |

---

## Project Structure

```
├── artifacts/
│   ├── api-server/        # Express API — chat, research, health endpoints
│   ├── sdl-intelligence/  # React frontend
│   └── mockup-sandbox/    # Internal UI prototyping sandbox (not deployed)
├── lib/                   # Shared workspace libraries (schemas, API spec)
├── scripts/               # Internal build/dev scripts
├── Dockerfile             # Multi-stage build (Debian builder → Alpine runtime)
└── cloudbuild.yaml        # Google Cloud Build CI/CD pipeline
```

---

## Running Locally

**Requirements:** Node.js 22+, pnpm 11+

```bash
# Clone the repo
git clone https://github.com/Damilareajayi/ISSDL-Agent.git
cd ISSDL-Agent

# Install dependencies
pnpm install

# Set up environment variables
cp artifacts/api-server/.env.example artifacts/api-server/.env
# Edit .env and add your GEMINI_API_KEY

# Start both frontend and backend
pnpm dev
```

- Frontend: http://localhost:5173
- API: http://localhost:8080

---

## Environment Variables

Set these in `artifacts/api-server/.env` for local development, or as Cloud Run environment variables in production.

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Google AI Studio API key |
| `GEMINI_MODEL` | No | Model name (default: `gemini-2.5-flash`) |
| `CORE_API_KEY` | No | CORE academic API key (higher rate limits) |
| `PORT` | No | Server port (default: `8080`) |

---

## Deployment

The repo includes a `cloudbuild.yaml` that builds the Docker image and deploys to Cloud Run automatically on every push to `main`.

To deploy manually:

```bash
gcloud builds submit --config cloudbuild.yaml
```

After deployment, verify the Gemini connection:

```
GET /api/healthz/gemini
```

---

## Acknowledgements

Built for the [International Society for Self-Directed Learning (ISSDL)](https://www.issdl.org) and grounded in the AOSIS SDL open textbook series and the foundational work of Malcolm Knowles, D. Randy Garrison, Philip Candy, Barry Zimmerman, and the global SDL research community.
