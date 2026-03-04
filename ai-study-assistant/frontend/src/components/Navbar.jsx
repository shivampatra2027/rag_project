import { GraduationCap } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './ui/navigation-menu';
import { cn } from '../lib/utils';
import { Button } from './ui/button';

function Navbar({ currentPage, onNavigate, onLogout }) {
  const items = [
    { key: 'home', label: 'Home' },
    { key: 'upload', label: 'Upload' },
    { key: 'chat', label: 'Chat' },
    { key: 'quiz', label: 'Quiz' },
    { key: 'revision', label: 'Revision' },
    { key: 'prediction', label: 'Prediction' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2 text-sm font-semibold tracking-wide">
          <GraduationCap className="h-5 w-5" />
          AI Study Assistant
        </div>

        <div className="flex items-center gap-3">
          <NavigationMenu>
            <NavigationMenuList>
              {items.map((item) => {
                const isActive = currentPage === item.key;
                return (
                  <NavigationMenuItem key={item.key}>
                    <NavigationMenuTrigger
                      type="button"
                      onClick={() => onNavigate(item.key)}
                      className={cn(
                        isActive ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground' : ''
                      )}
                    >
                      {item.label}
                    </NavigationMenuTrigger>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
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
