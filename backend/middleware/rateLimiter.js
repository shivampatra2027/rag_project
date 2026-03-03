const { rateLimit, ipKeyGenerator } = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.userId || ipKeyGenerator(req.ip),
  message: {
    error: 'Too many requests. Please try again later.',
  },
});

module.exports = rateLimiter;
