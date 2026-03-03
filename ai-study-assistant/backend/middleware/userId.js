const { v4: uuidv4 } = require('uuid');

function userIdMiddleware(req, res, next) {
  try {
    const headerValue = req.headers['x-user-id'];
    const userId = typeof headerValue === 'string' && headerValue.trim() ? headerValue.trim() : uuidv4();

    req.userId = userId;
    res.setHeader('x-user-id', userId);

    console.log(`[USER AUTO-ID] ${userId}`);
    next();
  } catch (error) {
    const fallbackId = `user_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
    req.userId = fallbackId;
    res.setHeader('x-user-id', fallbackId);

    console.log(`[USER AUTO-ID] ${fallbackId}`);
    next();
  }
}

module.exports = userIdMiddleware;
