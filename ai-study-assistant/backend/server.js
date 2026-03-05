const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const path = require('path');

const connectDB = require('./config/db');

const userIdMiddleware = require('./middleware/userId');
const rateLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

const uploadRoutes = require('./routes/upload');
const summarizeRoutes = require('./routes/summarize');
const quizRoutes = require('./routes/quiz');
const doubtRoutes = require('./routes/doubt');
const revisionRoutes = require('./routes/revision');
const predictRoutes = require('./routes/predict');
const chatRoutes = require('./routes/chat');
const authRoutes = require('./routes/auth');

dotenv.config({ path: path.join(__dirname, '.env') });

connectDB().catch((error) => {
  console.error('[DB] connection failed', error.message || error);
});

const app = express();
const PORT = process.env.PORT || 5000;

/* ---------------- TRUST PROXY (Render / Cloud) ---------------- */

app.set("trust proxy", 1);

/* ---------------- CORS ---------------- */

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://rag-project-kappa.vercel.app"
    ],
    credentials: true
  })
);

/* ---------------- HELMET SECURITY ---------------- */

app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
  })
);

console.log('[SECURITY] rate limit active');

/* ---------------- REQUEST LOGGER ---------------- */

app.use((req, res, next) => {
  const startedAt = Date.now();

  res.on('finish', () => {
    const timestamp = new Date(startedAt).toISOString();
    console.log(
      `[REQ] ${timestamp} ${req.method} ${req.originalUrl} ${res.statusCode}`
    );
  });

  next();
});

/* ---------------- BODY PARSER ---------------- */

app.use(express.json());

/* ---------------- ROUTES ---------------- */

app.use('/api/auth', authRoutes);

app.use('/api', userIdMiddleware, rateLimiter);

app.use('/api', uploadRoutes);
app.use('/api', summarizeRoutes);
app.use('/api', quizRoutes);
app.use('/api', doubtRoutes);
app.use('/api', revisionRoutes);
app.use('/api', predictRoutes);
app.use('/api', chatRoutes);

/* ---------------- ROOT ROUTE ---------------- */

app.get('/', (req, res) => {
  res.send('AI Study Assistant Running ✅');
});

/* ---------------- HEALTH CHECK ---------------- */

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'ai-study-assistant'
  });
});

/* ---------------- ERROR HANDLER ---------------- */

app.use(errorHandler);

/* ---------------- GLOBAL ERROR HANDLING ---------------- */

process.on('uncaughtException', (error) => {
  console.error('[ERROR] uncaughtException', error);
});

process.on('unhandledRejection', (reason) => {
  console.error('[ERROR] unhandledRejection', reason);
});

/* ---------------- START SERVER ---------------- */

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});