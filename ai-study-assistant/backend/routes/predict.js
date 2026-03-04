const express = require('express');
const axios = require('axios');
const { retrieveContext } = require('../rag/retriever');
const { examPredictionPrompt } = require('../rag/prompts');
const asyncHandler = require('../utils/asyncHandler');
const { validate, predictSchema } = require('../middleware/validate');

const router = express.Router();

router.use('/predict', (req, res, next) => {
  if (req.method === 'GET') {
    req.method = 'POST';
  }
  next();
});

function parseJsonContent(content) {
  if (!content || typeof content !== 'string') {
    return null;
  }

  const trimmed = content.trim();

  try {
    return JSON.parse(trimmed);
  } catch (error) {
    const fenced = trimmed.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/, '').trim();
    try {
      return JSON.parse(fenced);
    } catch (parseError) {
      return null;
    }
  }
}

router.post(
  '/predict',
  validate(predictSchema),
  asyncHandler(async (req, res) => {
    const userId = req.userId;
    const { examName } = req.body;

    console.log('[PREDICTION] analyzing material');
    const retrievalQuery = 'important topics repeated concepts key subjects';
    const chunks = await retrieveContext(userId, retrievalQuery);

    if (!chunks.length) {
      return res.status(404).json({ error: 'No study material uploaded for this user' });
    }

    const context = chunks.join('\n\n');
    const prompt = examPredictionPrompt(context, examName.trim());

    const apiKey = (process.env.GEMINI_API_KEY || '').trim();
    if (!apiKey) {
      return res.status(500).json({ message: 'GEMINI_API_KEY is missing in environment variables.' });
    }

    const model = (process.env.GEMINI_MODEL || 'gemini-2.5-flash').trim();
    const modelPath = model.startsWith('models/') ? model : `models/${model}`;

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
    const aiText = parts
      .filter((part) => typeof part.text === 'string')
      .map((part) => part.text)
      .join('\n')
      .trim();

    if (!aiText) {
      return res.status(502).json({ message: 'No response text received from AI service.' });
    }

    if (aiText === 'Not enough study material uploaded.') {
      return res.status(422).json({ error: aiText });
    }

    const parsed = parseJsonContent(aiText);
    if (!parsed || typeof parsed !== 'object') {
      return res.status(502).json({
        message: 'Prediction response was not valid JSON.',
        raw: aiText,
      });
    }

    console.log('[PREDICTION] topics generated');
    return res.status(200).json(parsed);
  })
);

module.exports = router;
