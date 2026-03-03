import { useEffect, useRef, useState } from 'react';
import apiClient from '../api/apiClient';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ScrollArea } from '../components/ui/scroll-area';
import { Spinner } from '../components/ui/spinner';
import { Textarea } from '../components/ui/textarea';

function Chat({ onBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const question = input.trim();
    if (!question || loading) {
      return;
    }

    const thinkingId = `thinking-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      { role: 'user', content: question },
      { role: 'assistant', content: 'Thinking...', id: thinkingId },
    ]);
    setInput('');
    setLoading(true);

    try {
      const response = await apiClient.post('/api/doubt', { question });
      const reply = response.data?.explanation || 'No response received.';

      setMessages((prev) =>
        prev.map((msg) => (msg.id === thinkingId ? { role: 'assistant', content: reply } : msg))
      );
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Failed to get response.';
      setMessages((prev) =>
        prev.map((msg) => (msg.id === thinkingId ? { role: 'assistant', content: message } : msg))
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-[70vh] max-h-[760px]">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Chat with AI Tutor</CardTitle>
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
      </CardHeader>
      <CardContent className="flex h-[calc(100%-80px)] flex-col gap-3">
        <ScrollArea className="flex-1 rounded-md border bg-slate-50 p-3">
          <div className="space-y-2">
            {messages.map((msg, idx) => (
              <div
                key={`${msg.role}-${idx}`}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm ${
                    msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'border bg-white'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="sticky bottom-0 flex gap-2 bg-white pt-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your doubt..."
            className="min-h-10 max-h-28"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button type="button" onClick={sendMessage} disabled={!input.trim() || loading}>
            {loading ? <Spinner className="mr-2" /> : null}
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default Chat;
