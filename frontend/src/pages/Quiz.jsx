import { useEffect, useRef, useState } from 'react';
import apiClient from '../api/apiClient';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Spinner } from '../components/ui/spinner';

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
    <div className="space-y-4">
      <Card className="max-w-2xl">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Quiz Generator</CardTitle>
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            type="text"
            placeholder="Enter topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <Button type="button" onClick={generateQuiz} disabled={!topic.trim() || loading}>
            {loading ? <Spinner className="mr-2" /> : null}
            Generate Quiz
          </Button>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </CardContent>
      </Card>

      {quizData?.quiz?.length ? (
        <section ref={quizRef} className="grid gap-3">
          {quizData.quiz.map((item, index) => (
            <Card key={`quiz-${index}`}>
              <CardHeader>
                <CardTitle className="text-lg">{index + 1}. {item.question}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <p>A. {item.options?.A}</p>
                <p>B. {item.options?.B}</p>
                <p>C. {item.options?.C}</p>
                <p>D. {item.options?.D}</p>
                <Badge className="mt-2">Answer: {item.answer}</Badge>
              </CardContent>
            </Card>
          ))}
        </section>
      ) : null}
    </div>
  );
}

export default Quiz;
