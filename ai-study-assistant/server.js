const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const uploadRoutes = require('./routes/upload');
const summarizeRoutes = require('./routes/summarize');
const quizRoutes = require('./routes/quiz');
const doubtRoutes = require('./routes/doubt');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use((req, res, next) => {
  console.log(`[ROUTE HIT] ${req.method} ${req.path}`);
  next();
});
app.use(express.json());
app.use('/api', uploadRoutes);
app.use('/api', summarizeRoutes);
app.use('/api', quizRoutes);
app.use('/api', doubtRoutes);

app.get('/', (req, res) => {
  res.send('AI Study Assistant Running ✅');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
