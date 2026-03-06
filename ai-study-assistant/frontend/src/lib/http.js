import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL;
const ANON_USER_KEY = 'anon_user_id';
const RAG_USER_KEY = 'rag_user_id';

function createAnonymousUserId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `anon_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
}

function getOrCreateAnonymousUserId() {
  try {
    const existing = localStorage.getItem(ANON_USER_KEY);
    if (existing && typeof existing === 'string' && existing.trim()) {
      return existing.trim();
    }
  } catch (error) {
    return createAnonymousUserId();
  }

  const generated = createAnonymousUserId();

  try {
    localStorage.setItem(ANON_USER_KEY, generated);
  } catch (error) {
    // Ignore storage failures and still return a generated id.
  }

  return generated;
}

function getLoggedInUserId() {
  try {
    const rawUser = localStorage.getItem('user');
    if (!rawUser) {
      return '';
    }

    const parsedUser = JSON.parse(rawUser);
    if (parsedUser && typeof parsedUser.id === 'string' && parsedUser.id.trim()) {
      return parsedUser.id.trim();
    }
  } catch (error) {
    return '';
  }

  return '';
}

function getStoredRagUserId() {
  try {
    const existing = localStorage.getItem(RAG_USER_KEY);
    if (existing && typeof existing === 'string' && existing.trim()) {
      return existing.trim();
    }
  } catch (error) {
    return '';
  }

  return '';
}

function setStoredRagUserId(userId) {
  if (!userId || typeof userId !== 'string' || !userId.trim()) {
    return '';
  }

  const normalized = userId.trim();

  try {
    localStorage.setItem(RAG_USER_KEY, normalized);
  } catch (error) {
    return normalized;
  }

  return normalized;
}

function getOrCreateRagUserId() {
  const existingRagUserId = getStoredRagUserId();
  if (existingRagUserId) {
    return existingRagUserId;
  }

  // Preserve pre-auth study material on the same device after login.
  const existingAnonymousUserId = (() => {
    try {
      const value = localStorage.getItem(ANON_USER_KEY);
      return value && typeof value === 'string' && value.trim() ? value.trim() : '';
    } catch (error) {
      return '';
    }
  })();

  if (existingAnonymousUserId) {
    return setStoredRagUserId(existingAnonymousUserId);
  }

  const loggedInUserId = getLoggedInUserId();
  if (loggedInUserId) {
    return setStoredRagUserId(loggedInUserId);
  }

  return setStoredRagUserId(getOrCreateAnonymousUserId());
}

export function getUserHeaders() {
  return { 'x-user-id': getOrCreateRagUserId() };
}

export default axios;
