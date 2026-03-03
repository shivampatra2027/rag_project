const express = require('express');
const axios = require('axios');
const { doubtPrompt } = require('../rag/prompts');
const { retrieveContext } = require('../rag/retriever');
const { addMessage, getHistory } = require('../memory/chatMemory');
const asyncHandler = require('../utils/asyncHandler');
const { validate, doubtSchema } = require('../middleware/validate');

const router = express.Router();

router.post(
  '/doubt',
  validate(doubtSchema),
  asyncHandler(async (req, res) => {
    const userId = req.userId;
    const { question } = req.body;

    console.log(`[RAG] retrieving context for: ${question}`);
    const chunks = await retrieveContext(userId, question);
    console.log(`[RAG] chunks found: ${chunks.length}`);

    if (!chunks.length) {
      return res.status(404).json({ error: 'No study material uploaded for this user' });
    }

    const context = chunks.join('\n\n');
    const chatHistory = getHistory(userId);

    const messages = [
      { role: 'system', content: 'You are a helpful study tutor.' },
      ...chatHistory,
      { role: 'user', content: doubtPrompt(context, question) },
    ];

    const apiKey = (process.env.GEMINI_API_KEY || '').trim();
    if (!apiKey) {
      return res.status(500).json({ message: 'GEMINI_API_KEY is missing in environment variables.' });
    }

    const model = (process.env.GEMINI_MODEL || 'gemini-2.5-flash').trim();
    const modelPath = model.startsWith('models/') ? model : `models/${model}`;

    const systemMessage = messages.find((m) => m.role === 'system');
    const contentMessages = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/${modelPath}:generateContent`,
      {
        systemInstruction: systemMessage ? { parts: [{ text: systemMessage.content }] } : undefined,
        contents: contentMessages,
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
    const explanation = parts
      .filter((part) => typeof part.text === 'string')
      .map((part) => part.text)
      .join('\n')
      .trim();

    if (!explanation) {
      return res.status(502).json({ message: 'No response text received from AI service.' });
    }

    addMessage(userId, 'user', question);
    addMessage(userId, 'assistant', explanation);

    return res.status(200).json({ explanation });
  })
);

module.exports = router;
