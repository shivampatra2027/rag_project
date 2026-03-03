import { useEffect, useRef, useState } from 'react';
import apiClient from '../api/apiClient';

function normalizePlan(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.revisionPlan)) {
    return data.revisionPlan;
  }

  if (Array.isArray(data?.schedule)) {
    return data.schedule;
  }

  const notes = data?.revisionNotes || data?.message || '';
  if (typeof notes === 'string' && notes.trim()) {
    return [
      {
        day: 1,
        topics: [notes.trim()],
        studyHours: '-',
        focusType: 'revision',
      },
    ];
  }

  return [];
}

function Revision({ onBack }) {
  const [examDate, setExamDate] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState('');
  const [loading, setLoading] = useState(false);
  const [revisionPlan, setRevisionPlan] = useState([]);
  const [error, setError] = useState('');
  const resultRef = useRef(null);

  useEffect(() => {
    if (revisionPlan.length > 0 && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [revisionPlan]);

  const generatePlan = async () => {
    if (!examDate || !hoursPerDay || loading) {
      return;
    }

    setLoading(true);
    setError('');
    setRevisionPlan([]);

    try {
      const response = await apiClient.post('/api/revision', {
        examDate,
        hoursPerDay: Number(hoursPerDay),
      });

      setRevisionPlan(normalizePlan(response.data));
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to generate revision plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ margin: 0 }}>Revision Planner</h1>
        <button type="button" onClick={onBack}>
          Back
        </button>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', maxWidth: '420px', marginBottom: '1rem' }}>
        <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} style={{ padding: '0.6rem' }} />
        <input
          type="number"
          min="1"
          max="12"
          placeholder="Hours per day"
          value={hoursPerDay}
          onChange={(e) => setHoursPerDay(e.target.value)}
          style={{ padding: '0.6rem' }}
        />
        <button type="button" onClick={generatePlan} disabled={!examDate || !hoursPerDay || loading}>
          Generate Plan
        </button>
        {loading ? <p>Generating plan...</p> : null}
        {error ? <p>{error}</p> : null}
      </div>

      {revisionPlan.length > 0 ? (
        <section ref={resultRef} style={{ display: 'grid', gap: '1rem' }}>
          {revisionPlan.map((dayPlan, index) => {
            const topics = Array.isArray(dayPlan.topics)
              ? dayPlan.topics
              : typeof dayPlan.topics === 'string' && dayPlan.topics
                ? [dayPlan.topics]
                : [];

            return (
              <article key={`day-${index}`} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '0.75rem' }}>
                <p style={{ marginTop: 0 }}>
                  <strong>Day {dayPlan.day || index + 1}</strong>
                </p>
                <p style={{ margin: '0.2rem 0' }}>
                  <strong>Topics:</strong>
                </p>
                <ul style={{ marginTop: 0 }}>
                  {topics.length ? topics.map((topic, i) => <li key={`topic-${index}-${i}`}>{topic}</li>) : <li>-</li>}
                </ul>
                <p style={{ margin: '0.2rem 0' }}>
                  <strong>Study hours:</strong> {dayPlan.studyHours ?? '-'}
                </p>
                <p style={{ marginBottom: 0 }}>
                  <strong>Focus type:</strong> {dayPlan.focusType ?? 'revision'}
                </p>
              </article>
            );
          })}
        </section>
      ) : null}
    </main>
  );
}

export default Revision;
