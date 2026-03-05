import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Chat from './pages/Chat';
import Quiz from './pages/Quiz';
import Revision from './pages/Revision';
import Prediction from './pages/Prediction';
import useAuthStore from './store/authStore';

const routeByPage = {
  home: '/',
  upload: '/upload',
  chat: '/chat',
  quiz: '/quiz',
  revision: '/revision',
  prediction: '/prediction',
};

const pageByRoute = {
  '/': 'home',
  '/upload': 'upload',
  '/chat': 'chat',
  '/quiz': 'quiz',
  '/revision': 'revision',
  '/prediction': 'prediction',
};

const THEME_KEY = 'ai-study-assistant-theme';

function getPreferredTheme() {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(getPreferredTheme);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = Boolean(user?.id);
  const currentPage = pageByRoute[location.pathname] || 'home';
  const isLoginRoute = location.pathname === '/login';

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const appRoutes = useMemo(() => {
    const backToHome = () => navigate('/');

    return (
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
        <Route
          path="/"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : (
            <Home
              onOpenUpload={() => navigate('/upload')}
              onOpenChat={() => navigate('/chat')}
              onOpenQuiz={() => navigate('/quiz')}
              onOpenRevision={() => navigate('/revision')}
              onOpenPrediction={() => navigate('/prediction')}
            />
            )
          }
        />
        <Route path="/upload" element={!isAuthenticated ? <Navigate to="/login" replace /> : <Upload onBack={backToHome} />} />
        <Route path="/chat" element={!isAuthenticated ? <Navigate to="/login" replace /> : <Chat onBack={backToHome} />} />
        <Route path="/quiz" element={!isAuthenticated ? <Navigate to="/login" replace /> : <Quiz onBack={backToHome} />} />
        <Route path="/revision" element={!isAuthenticated ? <Navigate to="/login" replace /> : <Revision onBack={backToHome} />} />
        <Route
          path="/prediction"
          element={!isAuthenticated ? <Navigate to="/login" replace /> : <Prediction onBack={backToHome} />}
        />
        <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />} />
      </Routes>
    );
  }, [isAuthenticated, navigate]);

  const handleNavigate = (page) => {
    navigate(routeByPage[page] || '/');
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="app-shell-bg min-h-screen">
      {!isLoginRoute && isAuthenticated ? (
        <Navbar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onLogout={logout}
        />
      ) : null}
      {isLoginRoute || !isAuthenticated ? appRoutes : <Layout>{appRoutes}</Layout>}
    </div>
  );
}

export default App;
