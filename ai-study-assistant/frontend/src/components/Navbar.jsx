import { GraduationCap, Moon, Sun } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './ui/navigation-menu';
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
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2 rounded-full border border-border/80 bg-card/80 px-3 py-1.5 text-sm font-semibold tracking-wide shadow-sm">
          <GraduationCap className="h-4 w-4 text-primary" />
          AI Study Assistant
        </div>

        <div className="flex items-center gap-2">
          <NavigationMenu>
            <NavigationMenuList className="rounded-full border border-border/80 bg-card/80 p-1 shadow-sm">
              {items.map((item) => {
                const isActive = currentPage === item.key;
                return (
                  <NavigationMenuItem key={item.key}>
                    <NavigationMenuTrigger
                      type="button"
                      onClick={() => onNavigate(item.key)}
                      className={cn(isActive ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground' : '')}
                    >
                      {item.label}
                    </NavigationMenuTrigger>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {typeof onLogout === 'function' ? (
            <Button type="button" variant="outline" size="sm" onClick={onLogout}>
              Logout
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
