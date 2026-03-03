import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL;

export function getUserHeaders() {
  try {
    const raw = localStorage.getItem('user');
    const user = raw ? JSON.parse(raw) : null;
    const userId = user?.id;

    if (userId && typeof userId === 'string') {
      return { 'x-user-id': userId };
    }
  } catch (error) {
    return {};
  }

  return {};
}

export default axios;
