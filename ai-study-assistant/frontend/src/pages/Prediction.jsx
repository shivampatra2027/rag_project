import { useEffect, useRef, useState } from 'react';
import apiClient from '../api/apiClient';

function Prediction({ onBack }) {
  const [examName, setExamName] = useState('');
  const [loading, setLoading] = useState(false);
  const [predictionData, setPredictionData] = useState(null);
  const [error, setError] = useState('');
  const resultRef = useRef(null);

  useEffect(() => {
    if (predictionData && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [predictionData]);

  const runPrediction = async () => {
    const value = examName.trim();
    if (!value || loading) {
      return;
    }

    setLoading(true);
    setError('');
    setPredictionData(null);

    try {
      const response = await apiClient.post('/api/predict', { examName: value });
      setPredictionData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to predict exam topics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ margin: 0 }}>Exam Prediction</h1>
        <button type="button" onClick={onBack}>
          Back
        </button>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', maxWidth: '420px', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Enter exam name"
          value={examName}
          onChange={(e) => setExamName(e.target.value)}
          style={{ padding: '0.6rem' }}
        />
        <button type="button" onClick={runPrediction} disabled={!examName.trim() || loading}>
          Predict Exam Topics
        </button>
        {loading ? <p>Analyzing material...</p> : null}
        {error ? <p>{error}</p> : null}
      </div>

      {predictionData ? (
        <section ref={resultRef} style={{ display: 'grid', gap: '1rem' }}>
          <article style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '0.75rem' }}>
            <h2 style={{ marginTop: 0 }}>Predicted Topics</h2>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {(predictionData.predictedTopics || []).map((item, index) => (
                <div key={`topic-${index}`} style={{ border: '1px solid #eee', borderRadius: '6px', padding: '0.6rem' }}>
                  <p style={{ margin: '0 0 0.35rem 0' }}>
                    <strong>{item.topic}</strong>
                  </p>
                  <p style={{ margin: '0 0 0.35rem 0' }}>Importance: {item.importanceScore}</p>
                  <p style={{ margin: 0 }}>{item.reason}</p>
                </div>
              ))}
            </div>
          </article>

          <article style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '0.75rem' }}>
            <h2 style={{ marginTop: 0 }}>Likely Questions</h2>
            <ul style={{ margin: 0 }}>
              {(predictionData.likelyQuestions || []).map((question, index) => (
                <li key={`q-${index}`}>{question}</li>
              ))}
            </ul>
          </article>

          <article style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '0.75rem' }}>
            <h2 style={{ marginTop: 0 }}>Revision Priority</h2>
            <ol style={{ margin: 0 }}>
              {(predictionData.revisionPriority || []).map((topic, index) => (
                <li key={`priority-${index}`}>{topic}</li>
              ))}
            </ol>
          </article>
        </section>
      ) : null}
    </main>
  );
}

export default Prediction;
