# 🧠 AI Study Assistant

Full-stack AI study platform with:
- Google login (JWT auth)
- PDF upload and parsing
- RAG with ChromaDB..
- Gemini-powered doubt solving, summaries, quizzes, revision, and exam prediction
- Multi-user isolation via authenticated `userId`


<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini">
</p>

<p align="center">
  <a href="https://vercel.com"><img src="https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel" alt="Vercel"></a>
  <a href="https://render.com"><img src="https://img.shields.io/badge/Deployed%20on-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black" alt="Render"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License"></a>
</p>

> A full-stack AI-powered study platform that allows students to upload study material and interact with it using AI. Features a modern AI SaaS interface similar to ChatGPT and Perplexity.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Google Login** | Secure JWT authentication with Google OAuth |
| 📄 **PDF Upload** | Upload and parse PDF study materials |
| 💬 **AI Chat Tutor** | Ask doubts with context-aware AI responses |
| 📝 **AI Summaries** | Automatic document summarization |
| ❓ **Quiz Generator** | Generate exam-style quizzes from your notes |
| 📅 **Revision Planner** | AI-powered study schedule aligned to exam dates |
| 🎯 **Exam Prediction** | Predict high-priority topics and likely questions |
| 🧠 **RAG Pipeline** | Retrieval Augmented Generation with ChromaDB |

---

## 🏗 Architecture

```
                    ┌──────────────┐
                    │     User     │
                    │  (Browser)   │
                    └──────┬───────┘
                           │
                           ▼
                 ┌──────────────────┐
                 │     Frontend     │
                 │  React + Vite    │
                 │  TailwindCSS     │
                 │  Shadcn UI       │
                 │  Zustand Store   │
                 │  Modern AI UI    │
                 └────────┬─────────┘
                          │ REST API
                          ▼
                ┌─────────────────────┐
                │      Backend        │
                │   Node.js + Express │
                │  JWT Authentication │
                │  PDF Processing     │
                │  LangChain RAG      │
                └───────┬─────────────┘
                        │
          ┌─────────────┼──────────────┐
          │                            │
          ▼                            ▼

   ┌──────────────────┐         ┌─────────────────────┐
   │     MongoDB      │         │      Gemini AI      │
   │                  │         │                     │
   │ User accounts    │         │ LLM responses       │
   │ Chat history     │         │ Embeddings          │
   │ Metadata         │         │ Summaries           │
   └──────────────────┘         └──────────┬──────────┘
                                           │
                                           ▼

                                  ┌──────────────────┐
                                  │     ChromaDB     │
                                  │  Vector Database │
                                  │                  │
                                  │ Document chunks  │
                                  │ Vector embeddings│
                                  │ Similarity search│
                                  └──────────────────┘
```

---

## 🎨 UI/UX Design

The frontend features a modern AI SaaS design inspired by ChatGPT and Perplexity:

- 🌑 **Dark Theme** with glassmorphism effects
- ✨ **Gradient Accents** (cyan to blue)
- 🎬 **Smooth Animations** and micro-interactions
- 📱 **Fully Responsive** design
- 💎 **Rounded corners** with soft shadows

### Pages

| Page | Features |
|------|----------|
| 🏠 **Home** | Hero section with gradient text, tool cards |
| 📤 **Upload** | Drag & drop zone, progress bar, file preview |
| 💬 **Chat** | Markdown rendering, typing indicator, animated messages |
| ❓ **Quiz** | Question cards, progress tracking, navigation |
| 📅 **Revision** | Day-wise study plans, completion tracking |
| 🎯 **Prediction** | Topic cards, importance scores, priority badges |

---

## 📁 Project Structure

```
ai-study-assistant/
│
├── backend/                    # Node.js Express API
│   ├── controllers/            # Business logic
│   ├── routes/                 # API endpoints
│   ├── middleware/            # Auth, validation
│   ├── models/                # Mongoose schemas
│   ├── rag/                   # RAG pipeline
│   │   ├── chromaClient.js   # ChromaDB connection
│   │   ├── embeddings.js     # Gemini embeddings
│   │   ├── retriever.js       # Context retrieval
│   │   └── prompts.js        # LLM prompts
│   ├── memory/                # Chat memory
│   ├── utils/                 # Utilities
│   └── server.js              # Entry point
│
└── frontend/                   # React + Vite
    ├── src/
    │   ├── components/        # UI components
    │   │   ├── ui/           # Shadcn UI
    │   │   └── Navbar.jsx    # Navigation
    │   ├── pages/            # Page components
    │   │   ├── Home.jsx
    │   │   ├── Chat.jsx
    │   │   ├── Upload.jsx
    │   │   ├── Quiz.jsx
    │   │   ├── Revision.jsx
    │   │   └── Prediction.jsx
    │   ├── store/            # Zustand state
    │   ├── lib/              # Utilities
    │   └── index.css         # Global styles
    └── index.html
```

---

## 🛠 Tech Stack

### Backend

<div align="center">

| Technology | Purpose |
|------------|---------|
| <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white"> | Runtime |
| <img src="https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white"> | Framework |
| <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white"> | Database |
| <img src="https://img.shields.io/badge/JWT-000000?style=flat&logo=JSON%20Web%20Tokens&logoColor=white"> | Auth |
| <img src="https://img.shields.io/badge/LangChain-+green?style=flat"> | LLM Framework |
| <img src="https://img.shields.io/badge/ChromaDB-000000?style=flat"> | Vector DB |

</div>

### Frontend

<div align="center">

| Technology | Purpose |
|------------|---------|
| <img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black"> | Framework |
| <img src="https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white"> | Bundler |
| <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white"> | Styling |
| <img src="https://img.shields.io/badge/ShadcnUI-black?style=flat"> | Components |
| <img src="https://img.shields.io/badge/Zustand-000000?style=flat"> | State |
| <img src="https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white"> | HTTP |

</div>

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- MongoDB (local or Atlas)
- Docker (for ChromaDB)
- Google OAuth Client ID
- Gemini API Key

### Backend Setup

```bash
cd ai-study-assistant/backend
npm install
```

Create `.env`:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/ai-study-assistant
JWT_SECRET=your_strong_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
GEMINI_EMBEDDING_MODEL=gemini-embedding-001
CHROMA_URL=http://127.0.0.1:8000
```

Start backend:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Start frontend:

```bash
npm run dev
```

### ChromaDB Setup

```bash
npm run chroma:docker
```

---

## 🔐 Authentication Flow

```
User clicks Google Login
        │
        ▼
Google returns ID Token
        │
        ▼
Frontend → POST /api/auth/google
        │
        ▼
Backend verifies token with Google
        │
        ▼
Backend generates JWT
        │
        ▼
Frontend stores JWT in localStorage
        │
        ▼
All API requests include:
Authorization: Bearer <JWT_TOKEN>
```

---

## 📡 API Routes

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/google` | Google OAuth login |
| GET | `/api/health` | Health check |

### Protected Routes (Require JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload PDF document |
| POST | `/api/doubt` | Ask AI questions |
| POST | `/api/summarize` | Generate summaries |
| POST | `/api/quiz` | Create quiz questions |
| POST | `/api/revision` | Generate study plan |
| POST | `/api/predict` | Predict exam topics |
| GET | `/api/chat-history` | Get chat history |
| POST | `/api/clear-chat` | Clear chat history |

---

## 🧪 Example Request

### Ask a Doubt

```bash
curl -X POST http://localhost:5000/api/doubt \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"question": "Explain polymorphism in OOP"}'
```

Response:

```json
{
  "explanation": "Polymorphism is one of the core concepts...",
  "sources": ["document1.pdf", "document2.pdf"]
}
```

---

## ☁️ Deployment

| Service | Use |
|---------|-----|
| [Vercel](https://vercel.com) | Frontend hosting |
| [Render](https://render.com) | Backend API hosting |
| [MongoDB Atlas](https://www.mongodb.com/atlas) | Cloud database |
| [Docker](https://docker.com) | ChromaDB container |

---

## 🔄 RAG Pipeline

```
┌─────────────────┐
│  PDF Upload     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Text Extraction │  (pdf-parse)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Text Chunking  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ Embedding Generation    │  (Gemini)
└────────┬────────────────┘
         │
         ▼
┌─────────────────┐
│ ChromaDB        │  (Vector Store)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ User Question   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ Similarity Search       │
└────────┬────────────────┘
         │
         ▼
┌─────────────────┐
│ Relevant Context│
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ Gemini LLM             │
└────────┬────────────────┘
         │
         ▼
┌─────────────────┐
│  AI Response    │
└─────────────────┘
```

---

## 🌱 Future Improvements

- [ ] Streaming AI responses for real-time output
- [ ] AI flashcards generation
- [ ] Study progress tracking dashboard
- [ ] Multi-document RAG support
- [ ] Better citation system with sources
- [ ] Mobile-optimized responsive UI
- [ ] AI study planner with reminders

---

## 📜 License

MIT License - feel free to use this project for learning and development.

---

<p align="center">
  Made with ❤️ using React, Node.js, and Gemini AI
</p>

