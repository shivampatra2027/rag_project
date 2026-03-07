import { GraduationCap, Moon, Sun, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';

function Navbar({ currentPage, onNavigate, onLogout, theme, onToggleTheme }) {
  const items = [
    { key: 'home', label: 'Home' },
    { key: 'upload', label: 'Upload' },
    { key: 'chat', label: 'Chat' },
    { key: 'quiz', label: 'Quiz' },
    { key: 'revision', label: 'Revision' },
    { key: 'prediction', label: 'Prediction' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 px-4 py-1.5 text-sm font-semibold tracking-wide shadow-lg shadow-cyan-500/5">
          <Sparkles className="h-4 w-4 text-cyan-400" />
          <span className="text-zinc-100">AI Study Assistant</span>
        </div>

        <div className="flex items-center gap-2">
          <nav className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-md">
            {items.map((item) => {
              const isActive = currentPage === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onNavigate(item.key)}
                  className={cn(
                    'rounded-xl px-4 py-1.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onToggleTheme}
            className="rounded-xl border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-zinc-100 backdrop-blur-md transition-all duration-200 hover:scale-105"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {typeof onLogout === 'function' ? (
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={onLogout}
              className="rounded-xl border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-zinc-100 transition-all duration-200"
            >
              Logout
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default Navbar;

