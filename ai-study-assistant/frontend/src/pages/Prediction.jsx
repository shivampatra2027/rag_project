import { useEffect, useRef, useState } from 'react';
import axios, { API_URL, getUserHeaders } from '../lib/http';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Separator } from '../components/ui/separator';
import { Spinner } from '../components/ui/spinner';
import { Sparkles, Target, TrendingUp, FileQuestion, ArrowRight, Lightbulb } from 'lucide-react';

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
      const response = await axios.post(
        `${API_URL}/api/predict`,
        { examName: value },
        { headers: getUserHeaders() }
      );
      setPredictionData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to predict exam topics');
    } finally {
      setLoading(false);
    }
  };

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
                <CardTitle className="text-xl font-semibold text-zinc-100">Exam Prediction</CardTitle>
                <p className="text-sm text-zinc-400">Predict likely exam topics and questions</p>
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
          {!predictionData && (
            <div className="space-y-4">
              <div className="relative">
                <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                <Input
                  type="text"
                  placeholder="Enter exam name (e.g., Computer Science, Mathematics...)"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && examName.trim()) {
                      runPrediction();
                    }
                  }}
                  className="rounded-xl border-zinc-800 bg-zinc-900/80 pl-12 py-6 text-zinc-200 placeholder:text-zinc-500 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 backdrop-blur-xl transition-all duration-200"
                />
              </div>
              <Button 
                type="button" 
                onClick={runPrediction} 
                disabled={!examName.trim() || loading}
                className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-6 text-white shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-cyan-500/30 disabled:hover:translate-y-0 disabled:opacity-50"
              >
                {loading ? <Spinner className="mr-2" /> : <TrendingUp className="mr-2" size={18} />}
                Predict Exam Topics
              </Button>
              {error ? <p className="text-sm text-red-400">{error}</p> : null}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Prediction Results */}
      {predictionData && (
        <section ref={resultRef} className="mt-6 w-full space-y-4">
          {/* Predicted Topics */}
          <Card className="rounded-2xl border border-zinc-800/50 bg-zinc-950/80 shadow-xl shadow-black/40 backdrop-blur-xl">
            <CardHeader className="border-b border-zinc-800/50 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-400">
                  <Target size={20} />
                </div>
                <CardTitle className="text-lg font-semibold text-zinc-100">Predicted Topics</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 px-6 py-5">
              {(predictionData.predictedTopics || []).map((item, index) => (
                <div 
                  key={`topic-${index}`} 
                  className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition-all duration-200 hover:border-cyan-500/50 hover:bg-zinc-800/50"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-zinc-200 group-hover:text-cyan-300 transition-colors">{item.topic}</h3>
                    <Badge className="bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border-cyan-500/30">
                      Score: {item.importanceScore}
                    </Badge>
                  </div>
                  <p className="text-sm text-zinc-400">{item.reason}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Likely Questions */}
          <Card className="rounded-2xl border border-zinc-800/50 bg-zinc-950/80 shadow-xl shadow-black/40 backdrop-blur-xl">
            <CardHeader className="border-b border-zinc-800/50 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-400">
                  <FileQuestion size={20} />
                </div>
                <CardTitle className="text-lg font-semibold text-zinc-100">Likely Questions</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-6 py-5">
              <ul className="space-y-3">
                {(predictionData.likelyQuestions || []).map((question, index) => (
                  <li 
                    key={`q-${index}`} 
                    className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-sm text-zinc-300 transition-all duration-200 hover:border-cyan-500/30"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-zinc-800 text-xs font-medium text-zinc-400">
                      {index + 1}
                    </span>
                    {question}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Revision Priority */}
          <Card className="rounded-2xl border border-zinc-800/50 bg-zinc-950/80 shadow-xl shadow-black/40 backdrop-blur-xl">
            <CardHeader className="border-b border-zinc-800/50 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-400">
                  <Lightbulb size={20} />
                </div>
                <CardTitle className="text-lg font-semibold text-zinc-100">Revision Priority</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-6 py-5">
              <Separator className="mb-4 bg-zinc-800" />
              <div className="flex flex-wrap gap-2">
                {(predictionData.revisionPriority || []).map((topic, index) => (
                  <Badge 
                    key={`priority-${index}`}
                    variant="secondary"
                    className="rounded-lg bg-zinc-800/80 px-3 py-1.5 text-zinc-300 transition-all duration-200 hover:bg-cyan-500/20 hover:text-cyan-400 cursor-default"
                  >
                    <ArrowRight className="mr-1 inline-block" size={12} />
                    {topic}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}

export default Prediction;

