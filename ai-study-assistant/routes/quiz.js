const express = require('express');
const axios = require('axios');
const { quizPrompt } = require('../rag/prompts');
const { retrieveContext } = require('../rag/retriever');

const router = express.Router();

function parseQuizJson(content) {
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

router.post('/quiz', async (req, res) => {
  try {
    const { topic } = req.body || {};

    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      return res.status(400).json({ message: 'Invalid input. Provide non-empty "topic" in request body.' });
    }

    console.log(`[RAG] retrieving context for: ${topic}`);
    const chunks = await retrieveContext(topic);
    console.log(`[RAG] chunks found: ${chunks.length}`);

    if (!chunks.length) {
      return res.status(404).json({ error: 'No study material uploaded yet' });
    }

    const context = chunks.join('\n\n');

    const apiKey = (process.env.GEMINI_API_KEY || '').trim();
    if (!apiKey) {
      return res.status(500).json({ message: 'GEMINI_API_KEY is missing in environment variables.' });
    }

    const model = (process.env.GEMINI_MODEL || 'gemini-2.5-flash').trim();
    const modelPath = model.startsWith('models/') ? model : `models/${model}`;
    const prompt = quizPrompt(context);

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/${modelPath}:generateContent`,
      {
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${prompt}\n\nReturn only valid JSON with this exact schema:\n{\n  "quiz": [\n    {\n      "question": "string",\n      "options": {"A": "string", "B": "string", "C": "string", "D": "string"},\n      "answer": "A|B|C|D",\n      "explanation": "string"\n    }\n  ]\n}\nGenerate exactly 10 items in quiz.`,
              },
            ],
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

    const parsed = parseQuizJson(aiText);
    if (!parsed || !Array.isArray(parsed.quiz)) {
      return res.status(502).json({
        message: 'AI response was not valid quiz JSON.',
        raw: aiText,
      });
    }

    const normalizedQuiz = parsed.quiz.slice(0, 10).map((item) => ({
      question: item.question || '',
      options: {
        A: item.options?.A || '',
        B: item.options?.B || '',
        C: item.options?.C || '',
        D: item.options?.D || '',
      },
      answer: item.answer || '',
      explanation: item.explanation || '',
    }));

    return res.status(200).json({
      message: 'Quiz generated successfully',
      total: normalizedQuiz.length,
      quiz: normalizedQuiz,
    });
  } catch (error) {
    const upstreamStatus = error.response?.status;
    const upstreamMessage =
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      error.message ||
      'Unknown error';

    if (upstreamMessage.toLowerCase().includes('does not exist') || upstreamMessage.toLowerCase().includes('not found')) {
      return res.status(404).json({ error: 'No study material uploaded yet' });
    }

    if (upstreamStatus) {
      return res.status(upstreamStatus).json({
        message: 'Gemini API request failed',
        error: upstreamMessage,
      });
    }

    return res.status(500).json({
      message: 'Internal server error while generating quiz',
      error: upstreamMessage,
    });
  }
});

module.exports = router;
