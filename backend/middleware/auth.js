const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const secret = (process.env.JWT_SECRET || '').trim();
    if (!secret) {
      return res.status(500).json({ error: 'JWT_SECRET is missing in environment variables.' });
    }

    const decoded = jwt.verify(token, secret);
    const userId = decoded?.userId;

    if (!userId || typeof userId !== 'string') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.userId = userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

module.exports = authMiddleware;
