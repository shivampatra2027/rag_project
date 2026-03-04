const express = require('express');
const axios = require('axios');
const { summaryPrompt } = require('../rag/prompts');
const { retrieveContext } = require('../rag/retriever');
const asyncHandler = require('../utils/asyncHandler');
const { validate, revisionSchema } = require('../middleware/validate');

const router = express.Router();

router.use('/revision', (req, res, next) => {
  if (req.method === 'GET') {
    req.method = 'POST';
  }
  next();
});

router.post(
  '/revision',
  validate(revisionSchema),
  asyncHandler(async (req, res) => {
    const userId = req.userId;
    const { examDate, hoursPerDay } = req.body;

    const revisionQuery = `revision plan exam preparation important topics before ${examDate} with ${hoursPerDay} hours per day`;

    console.log(`[RAG] retrieving context for: ${revisionQuery}`);
    const chunks = await retrieveContext(userId, revisionQuery);
    console.log(`[RAG] chunks found: ${chunks.length}`);

    if (!chunks.length) {
      return res.status(404).json({ error: 'No study material uploaded for this user' });
    }

    const context = chunks.join('\n\n');

    const apiKey = (process.env.GEMINI_API_KEY || '').trim();
    if (!apiKey) {
      return res.status(500).json({ message: 'GEMINI_API_KEY is missing in environment variables.' });
    }

    const model = (process.env.GEMINI_MODEL || 'gemini-2.5-flash').trim();
    const modelPath = model.startsWith('models/') ? model : `models/${model}`;
    const prompt = `${summaryPrompt(context)}\n\nCreate a revision plan for exam date ${examDate} with ${hoursPerDay} study hours per day. Keep it concise.`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/${modelPath}:generateContent`,
      {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          'x-goog-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );

    const parts = response.data?.candidates?.[0]?.content?.parts || [];
    const revisionNotes = parts
      .filter((part) => typeof part.text === 'string')
      .map((part) => part.text)
      .join('\n')
      .trim();

    if (!revisionNotes) {
      return res.status(502).json({ message: 'No response text received from AI service.' });
    }

    return res.status(200).json({ revisionNotes });
  })
);

module.exports = router;
