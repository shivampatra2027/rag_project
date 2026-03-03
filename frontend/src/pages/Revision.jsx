import { useEffect, useRef, useState } from 'react';
import apiClient from '../api/apiClient';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Spinner } from '../components/ui/spinner';

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
    <div className="space-y-4">
      <Card className="max-w-2xl">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Revision Planner</CardTitle>
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} />
          <Input
            type="number"
            min="1"
            max="12"
            placeholder="Hours per day"
            value={hoursPerDay}
            onChange={(e) => setHoursPerDay(e.target.value)}
          />
          <Button type="button" onClick={generatePlan} disabled={!examDate || !hoursPerDay || loading}>
            {loading ? <Spinner className="mr-2" /> : null}
            Generate Plan
          </Button>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </CardContent>
      </Card>

      {revisionPlan.length > 0 ? (
        <section ref={resultRef} className="grid gap-3">
          {revisionPlan.map((dayPlan, index) => {
            const topics = Array.isArray(dayPlan.topics)
              ? dayPlan.topics
              : typeof dayPlan.topics === 'string' && dayPlan.topics
                ? [dayPlan.topics]
                : [];

            return (
              <Card key={`day-${index}`}>
                <CardHeader>
                  <CardTitle className="text-lg">Day {dayPlan.day || index + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {topics.length ? topics.map((topic, i) => <Badge key={`topic-${index}-${i}`} variant="secondary">{topic}</Badge>) : <Badge variant="outline">-</Badge>}
                  </div>
                  <p className="text-sm"><strong>Study hours:</strong> {dayPlan.studyHours ?? '-'}</p>
                  <p className="text-sm"><strong>Focus type:</strong> {dayPlan.focusType ?? 'revision'}</p>
                </CardContent>
              </Card>
            );
          })}
        </section>
      ) : null}
    </div>
  );
}

export default Revision;
