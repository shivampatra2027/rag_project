import { BookOpen, Brain, CalendarCheck2, FileUp, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

function Home({ onOpenUpload, onOpenChat, onOpenQuiz, onOpenRevision, onOpenPrediction }) {
  const tools = [
    {
      title: 'Upload Notes',
      hint: 'Index your PDF notes and create your personal study base.',
      icon: FileUp,
      onOpen: onOpenUpload,
    },
    {
      title: 'Chat Tutor',
      hint: 'Ask doubts and get context-aware explanations from your notes.',
      icon: BookOpen,
      onOpen: onOpenChat,
    },
    {
      title: 'Quiz Generator',
      hint: 'Generate exam-style quizzes from your uploaded material.',
      icon: Brain,
      onOpen: onOpenQuiz,
    },
    {
      title: 'Revision Planner',
      hint: 'Create a time-boxed revision plan aligned to your exam date.',
      icon: CalendarCheck2,
      onOpen: onOpenRevision,
    },
    {
      title: 'Exam Prediction',
      hint: 'Identify high-priority topics and likely question patterns.',
      icon: Sparkles,
      onOpen: onOpenPrediction,
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="animate-rise overflow-hidden border-cyan-100/70 bg-gradient-to-br from-cyan-50 via-white to-amber-50">
        <CardHeader className="space-y-3">
          <CardTitle className="text-3xl sm:text-4xl">Study Fast. Recall Better.</CardTitle>
          <CardDescription>
            Upload notes, ask doubts, generate quizzes, build revision plans, and predict high-priority exam topics from one workspace.
          </CardDescription>
          <div className="flex flex-wrap gap-2 pt-1">
            <Button onClick={onOpenUpload}>Start by Uploading PDF</Button>
            <Button variant="outline" onClick={onOpenChat}>
              Open Tutor Chat
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <Card key={tool.title} className="animate-rise border-cyan-100/70" style={{ animationDelay: `${index * 50}ms` }}>
              <CardContent className="space-y-4 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="flex items-center gap-2 font-semibold">
                      <Icon className="h-4 w-4 text-cyan-700" /> {tool.title}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{tool.hint}</p>
                  </div>
                </div>
                <Button onClick={tool.onOpen}>Open</Button>
              </CardContent>
            </Card>
          );
        })}
        <Card className="animate-rise border-amber-200/80 bg-amber-50/70 sm:col-span-2 lg:col-span-1" style={{ animationDelay: '250ms' }}>
          <CardContent className="space-y-3 p-4">
            <p className="font-semibold text-amber-900">Tip</p>
            <p className="text-sm text-amber-900/80">
              Upload at least one strong subject PDF first. Every other tool performs better once your notes are indexed.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Home;
