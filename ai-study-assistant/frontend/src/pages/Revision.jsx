import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import axios, { API_URL, getUserHeaders } from '../lib/http';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Spinner } from '../components/ui/spinner';
import { Sparkles, Calendar, Clock, BookOpen, CheckCircle, ArrowRight } from 'lucide-react';

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
  const [completedDays, setCompletedDays] = useState([]);
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
    setCompletedDays([]);

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

  const toggleDayCompletion = (index) => {
    setCompletedDays(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const progressPercentage = dayCards.length > 0 
    ? Math.round((completedDays.length / dayCards.length) * 100) 
    : 0;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-90px)] w-full max-w-[900px] flex-col items-center px-3 py-4 sm:px-4 sm:py-6">
      <Card className="w-full max-w-2xl rounded-2xl border border-zinc-800/50 bg-zinc-950/80 shadow-2xl shadow-black/40 backdrop-blur-xl">
        <CardHeader className="border-b border-zinc-800/50 bg-zinc-950/60 px-6 py-5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25">
                <Sparkles size={24} />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-zinc-100">Revision Planner</CardTitle>
                <p className="text-sm text-zinc-400">Create a personalized study plan</p>
              </div>
            </div>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onBack}
              className="rounded-xl border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-all duration-200"
            >
              Back
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 px-6 py-6">
          {!revisionMarkdown && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                  <Input 
                    type="date" 
                    value={examDate} 
                    onChange={(e) => setExamDate(e.target.value)}
                    className="rounded-xl border-zinc-800 bg-zinc-900/80 pl-12 text-zinc-200 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 backdrop-blur-xl transition-all duration-200"
                  />
                </div>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                  <Input
                    type="number"
                    min="1"
                    max="12"
                    placeholder="Hours per day"
                    value={hoursPerDay}
                    onChange={(e) => setHoursPerDay(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && examDate && hoursPerDay) {
                        generatePlan();
                      }
                    }}
                    className="rounded-xl border-zinc-800 bg-zinc-900/80 pl-12 text-zinc-200 placeholder:text-zinc-500 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 backdrop-blur-xl transition-all duration-200"
                  />
                </div>
              </div>
              <Button 
                type="button" 
                onClick={generatePlan} 
                disabled={!examDate || !hoursPerDay || loading}
                className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-6 text-white shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-cyan-500/30 disabled:hover:translate-y-0 disabled:opacity-50"
              >
                {loading ? <Spinner className="mr-2" /> : <BookOpen className="mr-2" size={18} />}
                Generate Plan
              </Button>
              {error ? <p className="text-sm text-red-400">{error}</p> : null}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Revision Plan Results */}
      {dayCards.length > 0 && (
        <section ref={resultRef} className="mt-6 w-full space-y-4">
          {/* Progress Indicator */}
          <div className="rounded-xl border border-zinc-800/50 bg-zinc-950/80 p-4 backdrop-blur-xl">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-300">Overall Progress</span>
              <span className="text-sm text-zinc-400">{completedDays.length} / {dayCards.length} days completed</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {dayCards.map((section, index) => {
            const isCompleted = completedDays.includes(index);
            return (
              <Card 
                key={`day-section-${index}`}
                className={`rounded-2xl border border-zinc-800/50 bg-zinc-950/80 shadow-xl shadow-black/40 backdrop-blur-xl transition-all duration-300 ${isCompleted ? 'opacity-60' : ''}`}
              >
                <CardHeader className="border-b border-zinc-800/50 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-400'}`}>
                        {isCompleted ? <CheckCircle size={20} /> : <span className="font-bold">{index + 1}</span>}
                      </div>
                      <CardTitle className="text-lg font-semibold text-zinc-100">{section.title}</CardTitle>
                    </div>
                    <Button
                      type="button"
                      variant={isCompleted ? "outline" : "default"}
                      size="sm"
                      onClick={() => toggleDayCompletion(index)}
                      className={`rounded-xl transition-all duration-200 ${isCompleted ? 'border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800' : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:-translate-y-0.5'}`}
                    >
                      {isCompleted ? 'Completed' : 'Mark Done'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="px-6 py-5">
                  <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-headings:my-3 prose-ul:my-2 prose-ol:my-2 prose-li:my-1 prose-code:text-cyan-300 prose-code:bg-zinc-800/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-pre:bg-zinc-950/80 prose-pre:border prose-pre:border-zinc-800 prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline">
                    <ReactMarkdown>{section.content}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>
      )}

      {/* Single Card for non-day cards */}
      {revisionMarkdown && dayCards.length === 0 && (
        <section ref={resultRef} className="mt-6 w-full max-w-2xl">
          <Card className="rounded-2xl border border-zinc-800/50 bg-zinc-950/80 shadow-xl shadow-black/40 backdrop-blur-xl">
            <CardHeader className="border-b border-zinc-800/50 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-400">
                  <BookOpen size={20} />
                </div>
                <CardTitle className="text-lg font-semibold text-zinc-100">Revision Notes</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-6 py-5">
              <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-headings:my-3 prose-ul:my-2 prose-ol:my-2 prose-li:my-1 prose-code:text-cyan-300 prose-code:bg-zinc-800/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-pre:bg-zinc-950/80 prose-pre:border prose-pre:border-zinc-800 prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline">
                <ReactMarkdown>{revisionMarkdown}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}

export default Revision;

