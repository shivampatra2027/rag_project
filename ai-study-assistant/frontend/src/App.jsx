import { useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Chat from './pages/Chat';
import Quiz from './pages/Quiz';
import Revision from './pages/Revision';
import Prediction from './pages/Prediction';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

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

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#f8fafc',
        color: '#111827',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '16px',
      }}
    >
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div style={{ width: '100%', maxWidth: '980px' }}>{pageContent}</div>
      </main>
    </div>
  );
}

export default App;
