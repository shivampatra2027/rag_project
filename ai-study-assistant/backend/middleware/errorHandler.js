function errorHandler(err, req, res, next) {
  console.error('[ERROR] handled safely', err);

  if (res.headersSent) {
    return next(err);
  }

  const message = (err?.message || '').toLowerCase();
  if (message.includes('no study material uploaded yet') || message.includes('no study material uploaded for this user')) {
    return res.status(404).json({
      error: 'No study material uploaded for this user',
    });
  }

  return res.status(500).json({
    error: 'Internal server error',
  });
}

module.exports = errorHandler;
