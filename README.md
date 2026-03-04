.# AI Study Assistant

Full-stack AI study platform with:
- Google login (JWT auth)
- PDF upload and parsing
- RAG with ChromaDB..
- Gemini-powered doubt solving, summaries, quizzes, revision, and exam prediction
- Multi-user isolation via authenticated `userId`

## Project Structure

```text
ai-study-assistant/
  backend/
  frontend/
```

## Tech Stack

### Backend
- Node.js, Express
- MongoDB + Mongoose
- JWT auth + Google token verification
- Multer + pdf-parse
- LangChain + ChromaDB
- Gemini API

### Frontend
- React (Vite)
- TailwindCSS + shadcn-style components
- Axios
- Zustand
- Google OAuth React SDK

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB (local or cloud)
- ChromaDB server running (if using HTTP mode)
- Google OAuth Client ID
- Gemini API key

## 1. Backend Setup

```bash
cd ai-study-assistant/backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173

MONGODB_URI=mongodb://127.0.0.1:27017/ai-study-assistant
JWT_SECRET=replace_with_strong_secret
GOOGLE_CLIENT_ID=your_google_client_id

GEMINI_API_KEY=your_gemini_key_here
GEMINI_MODEL=gemini-2.5-flash
GEMINI_EMBEDDING_MODEL=gemini-embedding-001

CHROMA_URL=http://127.0.0.1:8000
```

Run backend:

```bash
npm run dev
```

## 2. Frontend Setup

```bash
cd ../frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Run frontend:

```bash
npm run dev
```

## 3. Run ChromaDB

From backend folder:

```bash
npm run chroma:docker
```

## 4. Authentication Flow

- Frontend Google login gets an ID token (`credential`)
- Frontend sends it to `POST /api/auth/google`
- Backend verifies token with Google
- Backend returns JWT + user object
- Frontend stores JWT in Zustand/localStorage
- Axios attaches `Authorization: Bearer <token>` automatically

## 5. Key API Routes (Protected)

All below require JWT auth header:

- `POST /api/upload`
- `POST /api/doubt`
- `POST /api/summarize`
- `POST /api/quiz`
- `POST /api/revision`
- `POST /api/predict`
- `GET /api/chat-history`
- `POST /api/clear-chat`

Public route:

- `POST /api/auth/google`
- `GET /health`

## 6. Build for Production

Frontend:

```bash
cd frontend
npm run build
```

Backend:

```bash
cd ../backend
npm start
```
