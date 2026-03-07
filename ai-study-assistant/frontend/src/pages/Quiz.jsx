import { useEffect, useRef, useState } from 'react';
import axios, { API_URL, getUserHeaders } from '../lib/http';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Spinner } from '../components/ui/spinner';
import { Sparkles, Target, ArrowRight, CheckCircle } from 'lucide-react';

function Quiz({ onBack }) {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [error, setError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
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
    setCurrentQuestion(0);

    try {
      const response = await axios.post(`${API_URL}/api/quiz`, { topic: value }, { headers: getUserHeaders() });
      setQuizData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  const quizLength = quizData?.quiz?.length || 0;
  const progressPercentage = quizLength > 0 ? ((currentQuestion + 1) / quizLength) * 100 : 0;

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
                <CardTitle className="text-xl font-semibold text-zinc-100">Quiz Generator</CardTitle>
                <p className="text-sm text-zinc-400">Generate quizzes from your study notes</p>
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
          {!quizData && (
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter topic or subject..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && topic.trim()) {
                      generateQuiz();
                    }
                  }}
                  className="rounded-xl border-zinc-800 bg-zinc-900/80 px-4 py-6 text-zinc-200 placeholder:text-zinc-500 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 backdrop-blur-xl transition-all duration-200"
                />
                <Target className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
              </div>
              <Button 
                type="button" 
                onClick={generateQuiz} 
                disabled={!topic.trim() || loading}
                className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-6 text-white shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-cyan-500/30 disabled:hover:translate-y-0 disabled:opacity-50"
              >
                {loading ? <Spinner className="mr-2" /> : <Sparkles className="mr-2" size={18} />}
                Generate Quiz
              </Button>
              {error ? <p className="text-sm text-red-400">{error}</p> : null}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quiz Results */}
      {quizData?.quiz?.length ? (
        <section ref={quizRef} className="mt-6 w-full max-w-2xl space-y-4">
          {/* Progress Bar */}
          <div className="rounded-xl border border-zinc-800/50 bg-zinc-950/80 p-4 backdrop-blur-xl">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-300">Quiz Progress</span>
              <span className="text-sm text-zinc-400">{currentQuestion + 1} / {quizLength}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {quizData.quiz.map((item, index) => (
            <Card 
              key={`quiz-${index}`}
              className={`rounded-2xl border border-zinc-800/50 bg-zinc-950/80 shadow-xl shadow-black/40 backdrop-blur-xl transition-all duration-300 ${index === currentQuestion ? 'opacity-100' : 'opacity-50'}`}
            >
              <CardHeader className="border-b border-zinc-800/50 px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                  <CardTitle className="text-lg font-semibold text-zinc-100">
                    <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400">
                      {index + 1}
                    </span>
                    {item.question}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 px-6 py-5">
                {['A', 'B', 'C', 'D'].map((option) => (
                  <div
                    key={option}
                    className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-300 transition-all duration-200 hover:border-cyan-500/50 hover:bg-zinc-800/50 cursor-pointer"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-800 text-xs font-medium text-zinc-400">
                      {option}
                    </span>
                    <span>{item.options?.[option]}</span>
                    {item.answer === option && (
                      <CheckCircle size={16} className="ml-auto text-emerald-400" />
                    )}
                  </div>
                ))}
                <div className="mt-4 flex items-center gap-2">
                  <Badge className="bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border-cyan-500/30">
                    Answer: {item.answer}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="rounded-xl border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-all duration-200 disabled:opacity-50"
            >
              Previous
            </Button>
            <Button
              type="button"
              onClick={() => setCurrentQuestion(Math.min(quizLength - 1, currentQuestion + 1))}
              disabled={currentQuestion === quizLength - 1}
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-cyan-500/30 disabled:hover:translate-y-0 disabled:opacity-50"
            >
              Next
              <ArrowRight className="ml-2" size={18} />
            </Button>
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default Quiz;

