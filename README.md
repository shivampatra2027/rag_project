# AI Study Assistant - Developer Documentation

Full-stack RAG-based study assistant with Google OAuth login, PDF ingestion, Gemini-powered generation, and user-isolated vector retrieval in ChromaDB.

## Repository Layout

```text
RAG-Project/
  README.md
  ai-study-assistant/
    backend/
    frontend/
```

## System Architecture

- Frontend: React + Vite single-page app with local state-based page switching.
- Backend: Express API with JWT auth, Joi validation, and rate limiting.
- Storage:
  - MongoDB for user records.
  - ChromaDB for per-user vector collections.
  - In-memory chat history (`Map`) for short conversation context.
- AI:
  - Gemini `generateContent` for summaries, doubts, quiz, revision, prediction.
  - Gemini embeddings for indexing and retrieval.

### Request Flow (Protected Features)

1. Frontend gets Google credential.
2. `POST /api/auth/google` verifies token and returns JWT.
3. Frontend stores JWT in Zustand + `localStorage`.
4. Axios interceptor adds `Authorization: Bearer <token>`.
5. Backend resolves `req.userId` from JWT and routes use user-scoped Chroma collection (`study_notes_<userId>`).

## Tech Stack

### Backend

- Node.js, Express 5
- MongoDB + Mongoose
- `google-auth-library` + JWT
- Multer + `pdf-parse`
- ChromaDB client + LangChain text splitter
- Axios for Gemini API calls

### Frontend

- React 19 + Vite 7
- Tailwind CSS
- Zustand
- Axios
- `@react-oauth/google`

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB instance
- Docker (recommended for local ChromaDB)
- Google OAuth Client ID
- Gemini API key

## Environment Variables

Create `ai-study-assistant/backend/.env`:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/ai-study-assistant
JWT_SECRET=replace_with_strong_secret
GOOGLE_CLIENT_ID=your_google_client_id
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
GEMINI_EMBEDDING_MODEL=gemini-embedding-001
CHROMA_URL=http://127.0.0.1:8000
```

Create `ai-study-assistant/frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

`GOOGLE_CLIENT_ID` and `VITE_GOOGLE_CLIENT_ID` must match.

## Local Development Setup

### 1. Start backend

```bash
cd ai-study-assistant/backend
npm install
npm run dev
```

### 2. Start frontend

```bash
cd ../frontend
npm install
npm run dev
```

### 3. Start ChromaDB

From `ai-study-assistant/backend`:

```bash
npm run chroma:docker
```

This runs:

```bash
docker run -p 8000:8000 -v %cd%/chroma_db:/data chromadb/chroma:latest
```

## Available NPM Scripts

### Backend (`ai-study-assistant/backend/package.json`)

- `npm run dev`: starts Express with nodemon.
- `npm start`: starts Express with node.
- `npm run chroma:docker`: starts ChromaDB via Docker.

### Frontend (`ai-study-assistant/frontend/package.json`)

- `npm run dev`: starts Vite dev server.
- `npm run build`: production build.
- `npm run preview`: preview production build.

## API Contracts

Base URL: `http://localhost:5000`

### Public

- `GET /health`
- `POST /api/auth/google`
  - Body: `{ "credential": "<google_id_token>" }`
  - Response: `{ token, user: { id, name, email } }`

### Protected (JWT required)

- `POST /api/upload`
  - Multipart field: `pdf`
  - Max file size: 20 MB
  - PDF only
- `POST /api/doubt`
  - Body: `{ "question": "..." }`
- `POST /api/summarize`
  - Body: `{ "topic": "..." }`
- `POST /api/quiz`
  - Body: `{ "topic": "..." }`
  - Returns normalized JSON quiz (up to 10 questions).
- `POST /api/revision`
  - Body: `{ "examDate": "YYYY-MM-DD", "hoursPerDay": 1-12 }`
- `POST /api/predict`
  - Body: `{ "examName": "..." }`
  - Expects Gemini strict JSON output.
- `GET /api/chat-history`
- `POST /api/clear-chat`

Rate limit: 60 requests/minute (per `userId` if authenticated, else IP).

## RAG Implementation Notes

- Uploaded PDFs are parsed and chunked (`chunkSize: 1000`, `chunkOverlap: 200`).
- Vectors are generated with Gemini embedding model and stored in ChromaDB.
- Retrieval uses top 4 chunks for prompt grounding.
- Collection name format: `study_notes_<userId>`.

## Frontend Structure

`src/App.jsx` uses `currentPage` state, not React Router.

Main pages:

- `Login`
- `Home`
- `Upload`
- `Chat`
- `Quiz`
- `Revision`
- `Prediction`

Auth state is handled in `src/store/authStore.js` and persisted in `localStorage` under key `auth`.

## Error Handling and Validation

- Joi validation for:
  - `/api/doubt`
  - `/api/revision`
  - `/api/predict`
- Global error middleware maps missing-study-material errors to HTTP 404.
- Gemini upstream errors propagate status/message when available.

## Current Limitations

- No automated test suite configured (`npm test` is placeholder).
- Chat memory is in-process only and resets on backend restart.
- Frontend uses local page state instead of URL routes.
- Most generated responses are plain text/JSON without persistence.

## Troubleshooting

### `No study material uploaded for this user`

Upload at least one PDF via `/api/upload` before using doubt/quiz/revision/predict/summarize.

### Chroma connection error

Ensure ChromaDB is running at `CHROMA_URL`.

### Google auth failure

- Check backend `GOOGLE_CLIENT_ID`.
- Check frontend `VITE_GOOGLE_CLIENT_ID`.
- Ensure both values are identical.

### Gemini API errors

- Verify `GEMINI_API_KEY`.
- Confirm selected models are available for your key:
  - `GEMINI_MODEL`
  - `GEMINI_EMBEDDING_MODEL`

## Production Notes

- Set strict `FRONTEND_URL` (avoid `*` in production).
- Use strong `JWT_SECRET` and secure secret management.
- Add HTTPS termination and reverse proxy (Nginx/Caddy/Cloud load balancer).
- Replace in-memory chat store with persistent storage if conversation continuity is required.
- Add structured logging and monitoring before deployment.
