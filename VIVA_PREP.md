# AI Study Assistant Viva Prep

## 1. One-minute introduction

This project is an AI-powered study assistant built to help students learn from their own notes instead of using only general-purpose AI. A user uploads PDF study material, the backend extracts text, splits it into chunks, converts those chunks into embeddings using Gemini, and stores them in ChromaDB. When the user asks a doubt or requests a quiz, summary, revision plan, or exam prediction, the system retrieves the most relevant chunks and sends that context to Gemini to generate a grounded response.

The main goal is to reduce hallucination and make the AI answer from the student's uploaded notes. The frontend is built with React and Vite, the backend uses Node.js and Express, MongoDB stores user account data, and ChromaDB is used as the vector database for retrieval.

## 2. Problem statement

Students usually study from scattered PDFs, handwritten notes, and modules. Generic AI tools give broad answers, but they are not always aligned with the exact syllabus or teacher notes. This project solves that by letting students upload their own material and query it through a Retrieval-Augmented Generation pipeline.

## 3. Core idea

Instead of asking the language model directly, the system first retrieves relevant content from uploaded notes. Then it sends:

1. The retrieved context
2. The user query
3. A prompt that forces grounded answering

This improves relevance and reduces unsupported answers.

## 4. Tech stack

- Frontend: React, Vite, Tailwind CSS, Zustand, Axios
- Backend: Node.js, Express
- Authentication: Google OAuth for sign-in
- Database: MongoDB for user records
- Vector database: ChromaDB
- AI model: Gemini for both embeddings and generation
- PDF parsing: `pdf-parse`
- Text chunking: LangChain text splitter

## 5. System architecture

Flow:

1. User signs in with Google.
2. User uploads a PDF.
3. Backend extracts text from the PDF.
4. Text is split into overlapping chunks.
5. Each chunk is converted to an embedding using Gemini.
6. Embeddings are stored in a user-specific Chroma collection.
7. When the user asks a query, the query is embedded.
8. Chroma retrieves the most similar chunks.
9. Retrieved chunks are passed to Gemini with a prompt.
10. Gemini returns the final grounded response.

## 6. Main modules

### Frontend

- `Home`: dashboard for all tools
- `Upload`: uploads and indexes PDF notes
- `Chat`: asks doubts from uploaded notes
- `Quiz`: generates MCQs from retrieved context
- `Revision`: generates a revision plan using exam date and study hours
- `Prediction`: predicts high-priority exam topics and likely questions

### Backend

- `server.js`: Express app setup, middleware, route mounting
- `routes/upload.js`: PDF upload, parsing, and vector storage
- `routes/doubt.js`: RAG-based doubt solving
- `routes/quiz.js`: quiz generation
- `routes/summarize.js`: summary generation
- `routes/revision.js`: revision planning
- `routes/predict.js`: exam prediction
- `controllers/authController.js`: Google login and user lookup
- `rag/embeddings.js`: chunking plus embedding creation and storage
- `rag/retriever.js`: semantic search from ChromaDB
- `memory/chatMemory.js`: short in-memory chat history

## 7. How RAG works in this project

RAG means Retrieval-Augmented Generation.

In this project:

- Retrieval: ChromaDB finds the most relevant chunks from uploaded notes.
- Augmentation: those chunks are inserted into the prompt.
- Generation: Gemini generates the answer using the retrieved chunks.

Why this is better than plain prompting:

- answers are closer to student notes
- lower hallucination risk
- content becomes syllabus-specific
- same notes can power multiple tools like chat, quiz, and revision

## 8. Important implementation details

### Chunking

The project uses a recursive character text splitter with:

- chunk size: 1000
- overlap: 200

Why overlap is used:

- avoids losing meaning at chunk boundaries
- preserves continuity when a concept spans two chunks

### Retrieval

- query is converted to an embedding
- Chroma performs similarity search
- top 4 chunks are used as context

### Multi-user isolation

Each user gets a separate Chroma collection name using:

`study_notes_<userId>`

This prevents one user’s notes from mixing with another’s.

### Chat memory

The app stores the last 10 messages per user in memory. This helps maintain short conversational context, but it is not permanent and will reset if the server restarts.

## 9. Security and validation

- Google credential is verified on the backend
- request validation is done using Joi for some routes
- rate limiting is enabled
- Helmet is used for security headers
- file uploads accept only PDFs and are size-limited

## 10. What is good about this project

- practical real-world use case
- one uploaded note base powers many features
- clear RAG pipeline from ingestion to retrieval to generation
- user-level content isolation
- modular backend routes
- modern frontend with multiple study workflows

## 11. Current limitations you should say honestly

These are important because an examiner may notice them.

### Authentication is not full JWT-based in the current code

The README mentions JWT authentication, but the current implementation does not issue or verify JWTs in middleware. The frontend stores the Google-authenticated user object, and backend study-content requests identify the user mainly through the `x-user-id` header.

Best viva answer:

"I originally planned JWT-based protected APIs, and the README still reflects that design, but the current working version identifies RAG data using a user ID header. Google sign-in is implemented, but a stronger next step would be adding signed JWT verification on all protected routes."

### Chat history is in memory, not persistent

If the server restarts, chat history is lost.

Best viva answer:

"I used in-memory chat history for simplicity and speed during development. In production, I would move this to MongoDB or Redis for persistence and scalability."

### Upload stores files locally

Files are uploaded to a local `uploads` folder.

Best viva answer:

"For local development I used disk storage through Multer. In production I would shift to cloud object storage such as S3 or Cloudinary-style storage."

### Some prompts depend on retrieved context quality

If notes are poor, incomplete, or too short, generated output quality drops.

### No citation UI

The app retrieves chunks internally but does not yet show chunk-level citations to the user.

## 12. Likely viva questions with short answers

### What is the main objective of your project?

To help students study from their own uploaded notes using AI features like doubt solving, summaries, quizzes, revision plans, and exam prediction.

### Why did you use RAG?

Because a normal LLM may answer using general internet-style knowledge, while RAG first retrieves relevant content from uploaded notes and then answers using that context. This makes answers more relevant and grounded.

### Why did you choose ChromaDB?

Because it is simple to integrate, suitable for vector similarity search, and works well for storing document embeddings in a lightweight RAG system.

### Why did you use embeddings?

Embeddings convert text into vectors so semantically similar content can be found even when exact keywords do not match.

### Why did you split the document into chunks?

Because full PDFs are too large for direct model input, and chunking lets us index and retrieve only the most relevant sections efficiently.

### Why overlap chunks?

To preserve context between adjacent chunks and reduce information loss at boundaries.

### Why use MongoDB if ChromaDB is already used?

MongoDB stores structured user account data, while ChromaDB stores vector embeddings for semantic retrieval. They solve different problems.

### What is the role of Gemini in your project?

Gemini is used in two ways: to generate embeddings for text chunks and queries, and to generate the final AI output such as explanations, summaries, quizzes, and predictions.

### How do you handle multiple users?

Each user gets a separate collection name in ChromaDB based on user ID, so retrieval happens only from that user’s uploaded content.

### How do you reduce hallucination?

By using retrieval first, writing prompts that say "use only provided context", and returning an error or fallback when no relevant study material exists.

### What happens if no PDF is uploaded?

The backend returns an error saying no study material is available for that user.

### What are the limitations of your system?

The current version does not have persistent chat memory, does not fully enforce JWT-based authorization, and depends on the quality of uploaded notes.

### How can the project be improved?

By adding JWT auth middleware, persistent chat memory, source citations, cloud file storage, better evaluation metrics, and support for multiple documents with metadata filters.

## 13. Deep technical questions and stronger answers

### Why not send the whole PDF directly to Gemini?

That would be inefficient, expensive, and may exceed context limits. Retrieval is more scalable because only the most relevant chunks are sent.

### Why semantic search instead of keyword search?

Semantic search can retrieve related concepts even when the wording is different, which is useful for student questions that may not exactly match note phrasing.

### Why use Express instead of a heavier framework?

The project mainly needed lightweight REST APIs and middleware composition, so Express was fast to develop and easy to structure.

### What is the tradeoff of using in-memory chat storage?

It is simple and fast, but not durable or scalable across server restarts or multiple backend instances.

### Why is rate limiting important here?

Because LLM APIs are expensive and vulnerable to abuse, so rate limiting protects both system stability and API cost.

## 14. Demo sequence for viva

If asked to demonstrate:

1. Explain the problem in one sentence.
2. Show login page.
3. Upload a PDF.
4. Ask one doubt in chat.
5. Generate a quiz from a topic.
6. Generate a revision plan.
7. Show exam prediction.
8. End by saying all these features reuse the same uploaded note base through RAG.

## 15. Short closing statement

"This project combines document ingestion, semantic retrieval, and generative AI to build a personalized study assistant. Its main strength is that it answers from the student’s own notes rather than only generic model knowledge. The current version is functional, modular, and a good base for stronger production features like JWT authorization, persistent memory, and citation support."

## 16. File references to mention in viva

- Backend entry: `ai-study-assistant/backend/server.js`
- Auth controller: `ai-study-assistant/backend/controllers/authController.js`
- Upload pipeline: `ai-study-assistant/backend/routes/upload.js`
- Embedding storage: `ai-study-assistant/backend/rag/embeddings.js`
- Retrieval: `ai-study-assistant/backend/rag/retriever.js`
- Prompt design: `ai-study-assistant/backend/rag/prompts.js`
- Frontend routes: `ai-study-assistant/frontend/src/App.jsx`
- Auth state: `ai-study-assistant/frontend/src/store/authStore.js`
- HTTP user headers: `ai-study-assistant/frontend/src/lib/http.js`
