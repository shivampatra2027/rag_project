import { useEffect, useRef, useState } from 'react';
import apiClient from '../api/apiClient';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Separator } from '../components/ui/separator';
import { Spinner } from '../components/ui/spinner';

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
    <div className="space-y-4">
      <Card className="max-w-2xl">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Exam Prediction</CardTitle>
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            type="text"
            placeholder="Enter exam name"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
          />
          <Button type="button" onClick={runPrediction} disabled={!examName.trim() || loading}>
            {loading ? <Spinner className="mr-2" /> : null}
            Predict Exam Topics
          </Button>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </CardContent>
      </Card>

      {predictionData ? (
        <section ref={resultRef} className="grid gap-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Predicted Topics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(predictionData.predictedTopics || []).map((item, index) => (
                <div key={`topic-${index}`} className="rounded-md border p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold">{item.topic}</h3>
                    <Badge>Score: {item.importanceScore}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.reason}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Likely Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {(predictionData.likelyQuestions || []).map((question, index) => (
                  <li key={`q-${index}`}>{question}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Revision Priority</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Separator />
              <div className="flex flex-wrap gap-2">
                {(predictionData.revisionPriority || []).map((topic, index) => (
                  <Badge key={`priority-${index}`} variant="secondary">{topic}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      ) : null}
    </div>
  );
}

export default Prediction;
