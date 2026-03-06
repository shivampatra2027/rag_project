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
    req.body = req.body && typeof req.body === 'object' ? req.body : {};
  }
  next();
});

router.post(
  '/revision',
  validate(revisionSchema),
  asyncHandler(async (req, res) => {
    try {
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

      const candidate = response.data?.candidates?.[0];
      const parts = candidate?.content?.parts || [];
      const revisionNotes = parts
        .filter((part) => typeof part.text === 'string')
        .map((part) => part.text)
        .join('\n')
        .trim();

      if (!revisionNotes) {
        const finishReason = candidate?.finishReason || response.data?.promptFeedback?.blockReason;
        return res.status(502).json({
          message: 'No response text received from AI service.',
          error: finishReason ? `Gemini returned no text. Reason: ${finishReason}` : 'Gemini returned no text.',
        });
      }

      return res.status(200).json({ revisionNotes });
    } catch (error) {
      const upstreamStatus = error.response?.status;
      const upstreamMessage =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        error.message ||
        'Unknown error';

      if (upstreamMessage.toLowerCase().includes('no study material uploaded yet')) {
        return res.status(404).json({ error: 'No study material uploaded for this user' });
      }

      if (upstreamStatus) {
        return res.status(upstreamStatus).json({
          message: 'Revision request failed',
          error: upstreamMessage,
        });
      }

      return res.status(500).json({
        message: 'Internal server error while generating revision plan',
        error: upstreamMessage,
      });
    }
  })
);

module.exports = router;
