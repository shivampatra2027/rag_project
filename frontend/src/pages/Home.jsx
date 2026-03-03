import { BookOpen, Brain, CalendarCheck2, FileUp, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

function Home({ onOpenUpload, onOpenChat, onOpenQuiz, onOpenRevision, onOpenPrediction }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">AI Study Assistant</CardTitle>
          <CardDescription>
            Upload notes, ask doubts, generate quizzes, build revision plans, and predict high-priority exam topics.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2 font-medium"><FileUp className="h-4 w-4" /> Upload Notes</div>
            <Button onClick={onOpenUpload}>Open</Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2 font-medium"><BookOpen className="h-4 w-4" /> Chat Tutor</div>
            <Button onClick={onOpenChat}>Open</Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2 font-medium"><Brain className="h-4 w-4" /> Quiz Generator</div>
            <Button onClick={onOpenQuiz}>Open</Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2 font-medium"><CalendarCheck2 className="h-4 w-4" /> Revision Planner</div>
            <Button onClick={onOpenRevision}>Open</Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2 font-medium"><Sparkles className="h-4 w-4" /> Exam Prediction</div>
            <Button onClick={onOpenPrediction}>Open</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Home;
