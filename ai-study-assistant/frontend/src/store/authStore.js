import { create } from 'zustand';

function loadInitialAuth() {
  try {
    const rawUser = localStorage.getItem('user');
    const parsedUser = rawUser ? JSON.parse(rawUser) : null;
    return {
      user: parsedUser || null,
    };
  } catch (error) {
    return { user: null };
  }
}

const initialAuth = loadInitialAuth();

const useAuthStore = create((set) => ({
  user: initialAuth.user,
  setAuth: ({ user }) => {
    const nextAuth = {
      user: user || null,
    };

    if (nextAuth.user) {
      localStorage.setItem('user', JSON.stringify(nextAuth.user));
    } else {
      localStorage.removeItem('user');
    }

    set(nextAuth);
  },
  clearAuth: () => {
    localStorage.removeItem('user');
    set({ user: null });
  },
  logout: () => {
    localStorage.removeItem('user');
    set({ user: null });
    window.location.href = '/login';
  },
}));

export default useAuthStore;
