# AI Study Assistant Backend

Production-ready Express backend for PDF-powered RAG study workflows (summary, quiz, doubt solving, prediction, revision, and chat memory).

## Features
- PDF upload + text extraction
- Per-user vector indexing in ChromaDB
- RAG routes: summarize, quiz, doubt, revision, predict
- Auto user ID via `x-user-id` middleware
- Chat memory per user
- Security middleware: Helmet + rate limit + validation + global error handler

## Prerequisites
- Node.js 18+
- Docker (for local ChromaDB)

## Setup
1. Install dependencies:
```bash
npm install
```

2. Copy env template:
```bash
cp .env.example .env
```

3. Fill required env values in `.env`.

## Environment Variables
- `PORT` server port
- `GEMINI_API_KEY` Gemini API key
- `GEMINI_MODEL` Gemini generation model
- `GEMINI_EMBEDDING_MODEL` Gemini embedding model
- `CHROMA_URL` local/self-hosted ChromaDB URL
- `CHROMA_CLOUD_ENABLED` set `true` to force Chroma Cloud mode
- `CHROMA_API_KEY` Chroma Cloud API key (`x-chroma-token`)
- `CHROMA_TENANT` Chroma Cloud tenant
- `CHROMA_DATABASE` Chroma Cloud database
- `CHROMA_CLOUD_HOST` Chroma Cloud host (default `api.trychroma.com`)
- `CHROMA_CLOUD_PORT` Chroma Cloud port (default `443`)
- `FRONTEND_URL` allowed frontend origin (`*` by default)
- `OPENAI_API_KEY` optional placeholder (for compatibility with some deployment templates)

## Run Locally
1. Start ChromaDB:
```bash
npm run chroma:docker
```

2. Start backend:
```bash
npm run dev
```

Production start:
```bash
npm start
```

## Deploy
Works on Render, Railway, and VPS with `npm start`.

Recommended deployment settings:
- Build command: `npm install`
- Start command: `npm start`
- Set all required environment variables in platform dashboard
- Use either:
  - local/self-hosted Chroma via `CHROMA_URL`, or
  - Chroma Cloud via `CHROMA_API_KEY`, `CHROMA_TENANT`, `CHROMA_DATABASE`

## Health Check
- `GET /health`

Response:
```json
{
  "status": "ok",
  "service": "ai-study-assistant"
}
```
