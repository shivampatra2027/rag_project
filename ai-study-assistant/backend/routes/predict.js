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
    req.body = req.body && typeof req.body === 'object' ? req.body : {};
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
    try {
      const userId = req.userId;
      const { examName } = req.body;

      console.log('[PREDICTION] analyzing material');
      const retrievalQuery = `important topics repeated concepts key subjects ${examName.trim()}`;
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
          generationConfig: {
            responseMimeType: 'application/json',
          },
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
      const aiText = parts
        .filter((part) => typeof part.text === 'string')
        .map((part) => part.text)
        .join('\n')
        .trim();

      if (!aiText) {
        const finishReason = candidate?.finishReason || response.data?.promptFeedback?.blockReason;
        return res.status(502).json({
          message: 'No response text received from AI service.',
          error: finishReason ? `Gemini returned no text. Reason: ${finishReason}` : 'Gemini returned no text.',
        });
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
          message: 'Prediction request failed',
          error: upstreamMessage,
        });
      }

      return res.status(500).json({
        message: 'Internal server error while predicting exam topics',
        error: upstreamMessage,
      });
    }
  })
);

module.exports = router;
