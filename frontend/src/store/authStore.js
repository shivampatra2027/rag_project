import { create } from 'zustand';

function loadInitialAuth() {
  try {
    const raw = localStorage.getItem('auth');
    if (!raw) {
      return { token: null, user: null };
    }

    const parsed = JSON.parse(raw);
    return {
      token: parsed?.token || null,
      user: parsed?.user || null,
    };
  } catch (error) {
    return { token: null, user: null };
  }
}

const initialAuth = loadInitialAuth();

const useAuthStore = create((set) => ({
  token: initialAuth.token,
  user: initialAuth.user,
  setAuth: ({ token, user }) => {
    const nextAuth = {
      token: token || null,
      user: user || null,
    };

    localStorage.setItem('auth', JSON.stringify(nextAuth));
    set(nextAuth);
  },
  clearAuth: () => {
    localStorage.removeItem('auth');
    set({ token: null, user: null });
  },
}));

export default useAuthStore;
