import * as React from 'react';
import { cn } from '../../lib/utils';

function NavigationMenu({ className, ...props }) {
  return <nav className={cn('flex items-center gap-1', className)} {...props} />;
}

function NavigationMenuList({ className, ...props }) {
  return <div className={cn('flex flex-wrap items-center gap-1', className)} {...props} />;
}

function NavigationMenuItem({ className, ...props }) {
  return <div className={cn('', className)} {...props} />;
}

const NavigationMenuTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      'inline-flex h-9 items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
      className
    )}
    {...props}
  />
));
NavigationMenuTrigger.displayName = 'NavigationMenuTrigger';

export { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger };
