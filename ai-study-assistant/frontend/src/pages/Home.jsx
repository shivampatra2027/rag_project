function Home({ onOpenUpload, onOpenChat, onOpenQuiz, onOpenRevision, onOpenPrediction }) {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>AI Study Assistant</h1>
      <div style={{ display: 'grid', gap: '0.75rem', maxWidth: '260px' }}>
        <button type="button" onClick={onOpenUpload}>
          Upload Notes
        </button>
        <button type="button" onClick={onOpenChat}>
          Chat with AI
        </button>
        <button type="button" onClick={onOpenQuiz}>
          Generate Quiz
        </button>
        <button type="button" onClick={onOpenRevision}>
          Revision Planner
        </button>
        <button type="button" onClick={onOpenPrediction}>
          Exam Prediction
        </button>
      </div>
    </main>
  );
}

export default Home;
