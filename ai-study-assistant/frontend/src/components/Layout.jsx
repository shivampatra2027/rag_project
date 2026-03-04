import { Card, CardContent } from './ui/card';

function Layout({ children, header }) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-10 pt-8 sm:px-6">
      {header}
      <Card className="border-border/70 bg-card/80 shadow-lg shadow-black/5 backdrop-blur dark:shadow-black/25">
        <CardContent className="p-4 sm:p-7">{children}</CardContent>
      </Card>
    </main>
  );
}

export default Layout;
