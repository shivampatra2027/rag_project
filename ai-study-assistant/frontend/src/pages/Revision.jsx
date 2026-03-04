import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import axios, { API_URL, getUserHeaders } from '../lib/http';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Spinner } from '../components/ui/spinner';

function toMarkdownFromPlan(plan) {
  return plan
    .map((dayPlan, index) => {
      const topics = Array.isArray(dayPlan.topics)
        ? dayPlan.topics
        : typeof dayPlan.topics === 'string' && dayPlan.topics
          ? [dayPlan.topics]
          : [];

      const heading = `## Day ${dayPlan.day || index + 1}`;
      const topicLines = topics.length ? topics.map((topic) => `- ${topic}`).join('\n') : '- No topics specified';
      const studyHours = dayPlan.studyHours ?? '-';
      const focusType = dayPlan.focusType ?? 'revision';

      return `${heading}\n\n### Topics\n${topicLines}\n\n- **Study hours:** ${studyHours}\n- **Focus type:** ${focusType}`;
    })
    .join('\n\n');
}

function normalizeRevisionMarkdown(data) {
  if (typeof data === 'string' && data.trim()) {
    return data.trim();
  }

  if (typeof data?.revisionNotes === 'string' && data.revisionNotes.trim()) {
    return data.revisionNotes.trim();
  }

  if (typeof data?.message === 'string' && data.message.trim()) {
    return data.message.trim();
  }

  if (Array.isArray(data)) {
    return toMarkdownFromPlan(data);
  }

  if (Array.isArray(data?.revisionPlan)) {
    return toMarkdownFromPlan(data.revisionPlan);
  }

  if (Array.isArray(data?.schedule)) {
    return toMarkdownFromPlan(data.schedule);
  }

  return '';
}

function splitMarkdownIntoDayCards(markdown) {
  const text = (markdown || '').trim();
  if (!text) {
    return [];
  }

  const sections = (`\n${text}`)
    .split(/\n(?=(?:#{1,6}\s*)?Day\s*\d+\b.*)/gi)
    .map((part) => part.trim())
    .filter(Boolean);

  if (!sections.length) {
    return [];
  }

  return sections.map((content, index) => {
    const titleMatch = content.match(/^(?:#{1,6}\s*)?(Day\s*\d+\b[^\n]*)/i);
    const fallbackTitle = sections.length === 1 ? 'Revision Notes' : `Day ${index + 1}`;

    return {
      title: titleMatch ? titleMatch[1].trim() : fallbackTitle,
      content,
    };
  });
}

function Revision({ onBack }) {
  const [examDate, setExamDate] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState('');
  const [loading, setLoading] = useState(false);
  const [revisionMarkdown, setRevisionMarkdown] = useState('');
  const [error, setError] = useState('');
  const resultRef = useRef(null);
  const dayCards = splitMarkdownIntoDayCards(revisionMarkdown);

  useEffect(() => {
    if ((dayCards.length > 0 || revisionMarkdown) && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [dayCards.length, revisionMarkdown]);

  const generatePlan = async () => {
    if (!examDate || !hoursPerDay || loading) {
      return;
    }

    setLoading(true);
    setError('');
    setRevisionMarkdown('');

    try {
      const response = await axios.post(
        `${API_URL}/api/revision`,
        {
          examDate,
          hoursPerDay: Number(hoursPerDay),
        },
        { headers: getUserHeaders() }
      );

      setRevisionMarkdown(normalizeRevisionMarkdown(response.data));
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to generate revision plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-2 sm:p-4">
      <Card className="mx-auto w-full">
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
          {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
        </CardContent>
      </Card>

      {dayCards.length > 0 ? (
        <section ref={resultRef} className="grid gap-4">
          {dayCards.map((section, index) => (
            <Card key={`day-section-${index}`} className="rounded-xl border border-cyan-200/70 bg-card shadow-md dark:border-cyan-900/70">
              <CardHeader>
                <CardTitle className="text-xl">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground dark:prose-invert sm:prose-base">
                  <ReactMarkdown>{section.content}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      ) : null}

      {revisionMarkdown && dayCards.length === 0 ? (
        <section ref={resultRef}>
          <Card className="rounded-xl border border-cyan-200/70 bg-card shadow-md dark:border-cyan-900/70">
            <CardHeader>
              <CardTitle className="text-xl">Revision Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground dark:prose-invert sm:prose-base">
                <ReactMarkdown>{revisionMarkdown}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </section>
      ) : null}
    </div>
  );
}

export default Revision;
