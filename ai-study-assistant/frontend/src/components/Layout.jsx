import { Card, CardContent } from './ui/card';

function Layout({ children, header }) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-10 pt-8 sm:px-6">
      {header}
      <Card className="border-white/70 bg-white/80 shadow-lg shadow-cyan-900/5 backdrop-blur">
        <CardContent className="p-4 sm:p-7">{children}</CardContent>
      </Card>
    </main>
  );
}

export default Layout;
