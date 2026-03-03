import { useEffect, useRef, useState } from 'react';
import apiClient from '../api/apiClient';

function Quiz({ onBack }) {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [error, setError] = useState('');
  const quizRef = useRef(null);

  useEffect(() => {
    if (quizData && quizRef.current) {
      quizRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [quizData]);

  const generateQuiz = async () => {
    const value = topic.trim();
    if (!value || loading) {
      return;
    }

    setLoading(true);
    setError('');
    setQuizData(null);

    try {
      const response = await apiClient.post('/api/quiz', { topic: value });
      setQuizData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ margin: 0 }}>Quiz Generator</h1>
        <button type="button" onClick={onBack}>
          Back
        </button>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', maxWidth: '420px', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Enter topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          style={{ padding: '0.6rem' }}
        />
        <button type="button" onClick={generateQuiz} disabled={!topic.trim() || loading}>
          Generate Quiz
        </button>
        {loading ? <p>Generating quiz...</p> : null}
        {error ? <p>{error}</p> : null}
      </div>

      {quizData?.quiz?.length ? (
        <section ref={quizRef} style={{ display: 'grid', gap: '1rem' }}>
          {quizData.quiz.map((item, index) => (
            <article key={`quiz-${index}`} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '0.75rem' }}>
              <p style={{ marginTop: 0 }}>
                <strong>{index + 1}. {item.question}</strong>
              </p>
              <p style={{ margin: '0.2rem 0' }}>A. {item.options?.A}</p>
              <p style={{ margin: '0.2rem 0' }}>B. {item.options?.B}</p>
              <p style={{ margin: '0.2rem 0' }}>C. {item.options?.C}</p>
              <p style={{ margin: '0.2rem 0' }}>D. {item.options?.D}</p>
              <p style={{ marginBottom: 0 }}>
                <strong>Answer: {item.answer}</strong>
              </p>
            </article>
          ))}
        </section>
      ) : null}
    </main>
  );
}

export default Quiz;
