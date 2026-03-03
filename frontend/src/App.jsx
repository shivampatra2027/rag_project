import { useMemo, useState } from 'react';
import Layout from './components/Layout';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Chat from './pages/Chat';
import Quiz from './pages/Quiz';
import Revision from './pages/Revision';
import Prediction from './pages/Prediction';
import Login from './pages/Login';
import useAuthStore from './store/authStore';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const token = useAuthStore((state) => state.token);

  const pageContent = useMemo(() => {
    if (currentPage === 'upload') {
      return <Upload onBack={() => setCurrentPage('home')} />;
    }

    if (currentPage === 'chat') {
      return <Chat onBack={() => setCurrentPage('home')} />;
    }

    if (currentPage === 'quiz') {
      return <Quiz onBack={() => setCurrentPage('home')} />;
    }

    if (currentPage === 'revision') {
      return <Revision onBack={() => setCurrentPage('home')} />;
    }

    if (currentPage === 'prediction') {
      return <Prediction onBack={() => setCurrentPage('home')} />;
    }

    return (
      <Home
        onOpenUpload={() => setCurrentPage('upload')}
        onOpenChat={() => setCurrentPage('chat')}
        onOpenQuiz={() => setCurrentPage('quiz')}
        onOpenRevision={() => setCurrentPage('revision')}
        onOpenPrediction={() => setCurrentPage('prediction')}
      />
    );
  }, [currentPage]);

  if (!token) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      <Layout>{pageContent}</Layout>
    </div>
  );
}

export default App;
