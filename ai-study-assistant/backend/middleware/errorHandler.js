function errorHandler(err, req, res, next) {
  console.error('[ERROR] handled safely', err);

  if (res.headersSent) {
    return next(err);
  }

  const rawMessage = err?.message || 'Internal server error';
  const message = rawMessage.toLowerCase();
  if (message.includes('no study material uploaded yet') || message.includes('no study material uploaded for this user')) {
    return res.status(404).json({
      error: 'No study material uploaded for this user',
    });
  }

  if (
    message.includes('unable to reach') ||
    message.includes('failed to retrieve context') ||
    message.includes('failed to store document embeddings') ||
    message.includes('gemini_api_key is missing') ||
    message.includes('chroma_api_key is missing') ||
    message.includes('chroma_tenant is missing') ||
    message.includes('chroma_database is missing')
  ) {
    return res.status(500).json({
      error: rawMessage,
    });
  }

  return res.status(500).json({
    error: rawMessage,
  });
}

module.exports = errorHandler;
