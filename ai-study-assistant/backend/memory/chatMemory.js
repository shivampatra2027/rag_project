const chatStore = new Map();
const MAX_MESSAGES = 10;

function safeString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function addMessage(userId, role, content) {
  try {
    const uid = safeString(userId);
    const messageContent = safeString(content);
    const messageRole = safeString(role);

    if (!uid || !messageContent || (messageRole !== 'user' && messageRole !== 'assistant')) {
      return;
    }

    const history = chatStore.get(uid) || [];
    history.push({ role: messageRole, content: messageContent });

    if (history.length > MAX_MESSAGES) {
      history.splice(0, history.length - MAX_MESSAGES);
    }

    chatStore.set(uid, history);
    console.log('[MEMORY] message stored');
  } catch (error) {
    // Never crash request flow due to memory bookkeeping.
  }
}

function getHistory(userId) {
  try {
    const uid = safeString(userId);
    if (!uid) {
      return [];
    }

    const history = chatStore.get(uid) || [];
    console.log(`[MEMORY] history loaded for ${uid}`);
    return history;
  } catch (error) {
    return [];
  }
}

function clearHistory(userId) {
  try {
    const uid = safeString(userId);
    if (!uid) {
      return;
    }

    chatStore.delete(uid);
    console.log('[MEMORY] history cleared');
  } catch (error) {
    // No-op by design.
  }
}

module.exports = {
  addMessage,
  getHistory,
  clearHistory,
};
