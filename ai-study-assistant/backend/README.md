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
- `CHROMA_URL` ChromaDB URL
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
- Ensure ChromaDB is reachable from `CHROMA_URL`

## Health Check
- `GET /health`

Response:
```json
{
  "status": "ok",
  "service": "ai-study-assistant"
}
```
