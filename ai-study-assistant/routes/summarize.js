const express = require('express');
const axios = require('axios');
const { summaryPrompt } = require('../rag/prompts');

const router = express.Router();

router.post('/summarize', async (req, res) => {
  try {
    const { text } = req.body || {};

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ message: 'Invalid input. Provide non-empty "text" in request body.' });
    }

    const apiKey = (process.env.GEMINI_API_KEY || '').trim();
    if (!apiKey) {
      return res.status(500).json({ message: 'GEMINI_API_KEY is missing in environment variables.' });
    }

    const model = (process.env.GEMINI_MODEL || 'gemini-2.5-flash').trim();
    const prompt = summaryPrompt(text);

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
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

    return res.status(200).send(aiText);
  } catch (error) {
    const upstreamStatus = error.response?.status;
    const upstreamMessage =
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      error.message ||
      'Unknown error';

    if (upstreamStatus) {
      return res.status(upstreamStatus).json({
        message: 'Gemini API request failed',
        error: upstreamMessage,
      });
    }

    return res.status(500).json({
      message: 'Internal server error while generating summary',
      error: upstreamMessage,
    });
  }
});

module.exports = router;
