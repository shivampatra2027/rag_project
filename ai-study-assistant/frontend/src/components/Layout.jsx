import { Card, CardContent } from './ui/card';

function Layout({ children, header }) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-8 pt-6 sm:px-6">
      {header}
      <Card className="border-border/80 bg-white/90 shadow-sm">
        <CardContent className="p-4 sm:p-6">{children}</CardContent>
      </Card>
    </main>
  );
}

export default Layout;
