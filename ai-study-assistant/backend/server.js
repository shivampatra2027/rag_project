const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const userIdMiddleware = require('./middleware/userId');
const rateLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const summarizeRoutes = require('./routes/summarize');
const quizRoutes = require('./routes/quiz');
const doubtRoutes = require('./routes/doubt');
const revisionRoutes = require('./routes/revision');
const predictRoutes = require('./routes/predict');
const chatRoutes = require('./routes/chat');

dotenv.config({ path: path.join(__dirname, '.env') });
connectDB().catch((error) => {
  console.error('[DB] connection failed', error.message || error);
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
  })
);
app.use(helmet());
console.log('[SECURITY] rate limit active');

app.use((req, res, next) => {
  const startedAt = Date.now();
  res.on('finish', () => {
    const timestamp = new Date(startedAt).toISOString();
    console.log(`[REQ] ${timestamp} ${req.method} ${req.originalUrl} ${res.statusCode}`);
  });
  next();
});

app.use(express.json());
app.use('/api/auth', rateLimiter, authRoutes);
app.use('/api', userIdMiddleware, rateLimiter);
app.use('/api', uploadRoutes);
app.use('/api', summarizeRoutes);
app.use('/api', quizRoutes);
app.use('/api', doubtRoutes);
app.use('/api', revisionRoutes);
app.use('/api', predictRoutes);
app.use('/api', chatRoutes);

app.get('/', (req, res) => {
  res.send('AI Study Assistant Running ✅');
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'ai-study-assistant',
  });
});

app.use(errorHandler);

process.on('uncaughtException', (error) => {
  console.error('[ERROR] uncaughtException', error);
});

process.on('unhandledRejection', (reason) => {
  console.error('[ERROR] unhandledRejection', reason);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
