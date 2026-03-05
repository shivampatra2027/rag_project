import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL;
const ANON_USER_KEY = 'anon_user_id';

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

export function getUserHeaders() {
  return { 'x-user-id': getLoggedInUserId() || getOrCreateAnonymousUserId() };
}

export default axios;
