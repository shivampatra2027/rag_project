import { BookOpen, Brain, CalendarCheck2, FileUp, Sparkles, ArrowRight, Lightbulb } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

function Home({ onOpenUpload, onOpenChat, onOpenQuiz, onOpenRevision, onOpenPrediction }) {
  const tools = [
    {
      title: 'Upload Notes',
      hint: 'Index your PDF notes and create your personal study base.',
      icon: FileUp,
      onOpen: onOpenUpload,
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      title: 'Chat Tutor',
      hint: 'Ask doubts and get context-aware explanations from your notes.',
      icon: BookOpen,
      onOpen: onOpenChat,
      gradient: 'from-blue-500 to-indigo-500',
    },
    {
      title: 'Quiz Generator',
      hint: 'Generate exam-style quizzes from your uploaded material.',
      icon: Brain,
      onOpen: onOpenQuiz,
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      title: 'Revision Planner',
      hint: 'Create a time-boxed revision plan aligned to your exam date.',
      icon: CalendarCheck2,
      onOpen: onOpenRevision,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Exam Prediction',
      hint: 'Identify high-priority topics and likely question patterns.',
      icon: Sparkles,
      onOpen: onOpenPrediction,
      gradient: 'from-pink-500 to-rose-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="overflow-hidden rounded-2xl border border-zinc-800/50 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 shadow-2xl shadow-black/40 backdrop-blur-xl">
        <CardHeader className="space-y-4 px-6 py-8 sm:px-8 sm:py-12">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
              <Sparkles className="h-4 w-4 text-white" size={16} />
            </div>
            <span className="text-sm font-medium text-zinc-400">AI Study Assistant</span>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl lg:text-5xl">
              Study Fast.
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"> Recall Better.</span>
            </CardTitle>
            <CardDescription className="max-w-xl text-base text-zinc-400">
              Upload notes, ask doubts, generate quizzes, build revision plans, and predict high-priority exam topics from one workspace.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button 
              onClick={onOpenUpload} 
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-6 text-white shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:-translate-y-1 hover:brightness-110 hover:shadow-cyan-500/30"
            >
              Start by Uploading PDF
              <ArrowRight className="ml-2" size={18} />
            </Button>
            <Button 
              variant="outline" 
              onClick={onOpenChat}
              className="rounded-xl border-zinc-700 bg-zinc-800/50 px-6 py-6 text-zinc-300 transition-all duration-200 hover:bg-zinc-800 hover:text-zinc-100"
            >
              Open Tutor Chat
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Tools Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <Card
              key={tool.title}
              className="group cursor-pointer rounded-2xl border border-zinc-800/50 bg-zinc-950/80 shadow-xl shadow-black/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/10"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={tool.onOpen}
            >
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${tool.gradient} text-white shadow-lg`}>
                    <Icon size={24} />
                  </div>
                  <ArrowRight className="h-5 w-5 text-zinc-600 opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100" />
                </div>
                <div>
                  <p className="font-semibold text-zinc-200">{tool.title}</p>
                  <p className="mt-1 text-sm text-zinc-400">{tool.hint}</p>
                </div>
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    tool.onOpen();
                  }}
                  className="w-full rounded-xl bg-zinc-800/80 text-zinc-300 transition-all duration-200 hover:bg-zinc-700 hover:text-zinc-100"
                >
                  Open
                </Button>
              </CardContent>
            </Card>
          );
        })}
        
        {/* Tip Card */}
        <Card
          className="rounded-2xl border border-amber-500/20 bg-amber-500/5 shadow-xl shadow-amber-500/10 sm:col-span-2 lg:col-span-1"
        >
          <CardContent className="space-y-3 p-5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                <Lightbulb size={18} />
              </div>
              <p className="font-semibold text-amber-200">Pro Tip</p>
            </div>
            <p className="text-sm text-zinc-400">
              Upload at least one strong subject PDF first. Every other tool performs better once your notes are indexed.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Home;

