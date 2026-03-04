import { useEffect, useRef, useState } from 'react';
import axios, { API_URL, getUserHeaders } from '../lib/http';
import { Bot, SendHorizonal } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ScrollArea } from '../components/ui/scroll-area';
import { Textarea } from '../components/ui/textarea';

function Chat({ onBack }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome-ai',
      role: 'assistant',
      content: 'Hi! I am your AI resume tutor. Ask anything about your resume and I will help.',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTimestamp = (dateValue) =>
    new Date(dateValue).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

  const sendMessage = async () => {
    const question = input.trim();
    if (!question || loading) {
      return;
    }

    const thinkingId = `thinking-${Date.now()}`;
    const userId = `user-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      { id: userId, role: 'user', content: question, timestamp: new Date().toISOString() },
      { id: thinkingId, role: 'assistant', content: '', typing: true, timestamp: new Date().toISOString() },
    ]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/doubt`, { question }, { headers: getUserHeaders() });
      const reply = response.data?.explanation || 'No response received.';

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === thinkingId
            ? { id: thinkingId, role: 'assistant', content: reply, typing: false, timestamp: new Date().toISOString() }
            : msg
        )
      );
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Failed to get response.';
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === thinkingId
            ? { id: thinkingId, role: 'assistant', content: message, typing: false, timestamp: new Date().toISOString() }
            : msg
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-90px)] w-full max-w-[900px] px-3 py-4 sm:px-4 sm:py-6">
      <Card className="flex w-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xl shadow-slate-900/10">
        <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-slate-200 px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2563eb] text-white shadow-sm">
              <Bot size={20} />
            </div>
            <div className="min-w-0">
              <CardTitle className="truncate text-lg font-semibold text-slate-900">AI Resume Tutor</CardTitle>
              <p className="truncate text-sm text-slate-500">Ask anything about your resume</p>
            </div>
          </div>
          <Button type="button" variant="outline" onClick={onBack} className="rounded-xl">
            Back
          </Button>
        </CardHeader>

        <CardContent className="flex min-h-0 flex-1 flex-col gap-0 bg-[#f8fafc] p-0">
          <ScrollArea className="chat-scroll flex-1 px-3 py-4 sm:px-6 sm:py-5">
            <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={msg.id || `${msg.role}-${idx}`}
                className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' ? (
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-base shadow-sm">
                    🤖
                  </span>
                ) : null}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[75%] ${
                    msg.role === 'user'
                      ? 'rounded-br-md bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white shadow-md shadow-blue-900/20'
                      : 'rounded-bl-md bg-[#f1f5f9] text-slate-800'
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">
                    {msg.typing ? (
                      <div className="flex items-center gap-1.5 py-1">
                        <span className="typing-dot" />
                        <span className="typing-dot [animation-delay:0.15s]" />
                        <span className="typing-dot [animation-delay:0.3s]" />
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                  <div
                    className={`mt-1 text-[11px] ${
                      msg.role === 'user' ? 'text-blue-100' : 'text-slate-500'
                    }`}
                  >
                    {formatTimestamp(msg.timestamp)}
                  </div>
                </div>

                {msg.role === 'user' ? (
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-base shadow-sm">
                    👤
                  </span>
                ) : null}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

          <div className="sticky bottom-0 border-t border-slate-200 bg-white/95 px-3 py-3 backdrop-blur sm:px-6">
            <div className="flex items-end gap-2 sm:gap-3">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="min-h-[46px] max-h-32 resize-none rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 leading-5 focus-visible:ring-[#2563eb]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <Button
                type="button"
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                size="icon"
                className="h-11 w-11 shrink-0 rounded-2xl bg-[#2563eb] text-white shadow-md shadow-blue-900/20 transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 disabled:hover:translate-y-0"
                aria-label="Send message"
              >
                <SendHorizonal size={18} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Chat;
