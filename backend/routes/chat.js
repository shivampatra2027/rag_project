const express = require('express');
const { clearHistory, getHistory } = require('../memory/chatMemory');

const router = express.Router();

router.get('/chat-history', (req, res) => {
  try {
    const userId = req.userId;
    const history = getHistory(userId);
    console.log(`[MEMORY] history fetched for ${userId}`);

    return res.status(200).json({
      userId,
      history,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch chat history',
      error: error.message || 'Unknown error',
    });
  }
});

router.post('/clear-chat', (req, res) => {
  try {
    const userId = req.userId;
    clearHistory(userId);

    return res.status(200).json({
      message: 'Chat history cleared',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to clear chat history',
      error: error.message || 'Unknown error',
    });
  }
});

module.exports = router;
