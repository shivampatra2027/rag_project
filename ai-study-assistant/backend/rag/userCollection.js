function sanitizeUserId(userId) {
  if (!userId || typeof userId !== 'string' || !userId.trim()) {
    throw new Error('Invalid user id');
  }

  const cleaned = userId.trim();
  if (!/^[a-zA-Z0-9_-]+$/.test(cleaned)) {
    throw new Error('Invalid user id');
  }

  return cleaned;
}

function collectionNameForUser(userId) {
  const safeUserId = sanitizeUserId(userId);
  return `study_notes_${safeUserId}`;
}

module.exports = {
  sanitizeUserId,
  collectionNameForUser,
};
