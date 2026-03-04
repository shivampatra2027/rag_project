import { useMemo } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Chat from './pages/Chat';
import Quiz from './pages/Quiz';
import Revision from './pages/Revision';
import Prediction from './pages/Prediction';

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

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPage = pageByRoute[location.pathname] || 'home';

  const appRoutes = useMemo(() => {
    const backToHome = () => navigate('/');

    return (
      <Routes>
        <Route
          path="/"
          element={
            <Home
              onOpenUpload={() => navigate('/upload')}
              onOpenChat={() => navigate('/chat')}
              onOpenQuiz={() => navigate('/quiz')}
              onOpenRevision={() => navigate('/revision')}
              onOpenPrediction={() => navigate('/prediction')}
            />
          }
        />
        <Route path="/upload" element={<Upload onBack={backToHome} />} />
        <Route path="/chat" element={<Chat onBack={backToHome} />} />
        <Route path="/quiz" element={<Quiz onBack={backToHome} />} />
        <Route path="/revision" element={<Revision onBack={backToHome} />} />
        <Route path="/prediction" element={<Prediction onBack={backToHome} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }, [navigate]);

  const handleNavigate = (page) => {
    navigate(routeByPage[page] || '/');
  };

  return (
    <div className="app-shell-bg min-h-screen">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      <Layout>{appRoutes}</Layout>
    </div>
  );
}

export default App;
