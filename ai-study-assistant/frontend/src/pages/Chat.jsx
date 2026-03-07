import { useEffect, useRef, useState } from 'react';
import axios, { API_URL, getUserHeaders } from '../lib/http';
import { Bot, SendHorizonal, UserRound, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ScrollArea } from '../components/ui/scroll-area';
import { Textarea } from '../components/ui/textarea';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
      <Card className="flex w-full flex-col overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-950/80 shadow-2xl shadow-black/40 backdrop-blur-xl">
        <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-zinc-800/50 bg-zinc-950/60 px-4 py-4 sm:px-6 backdrop-blur-md">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25">
              <Sparkles size={20} />
            </div>
            <div className="min-w-0">
              <CardTitle className="truncate text-lg font-semibold text-zinc-100">AI Resume Tutor</CardTitle>
              <p className="truncate text-sm text-zinc-400">Ask anything about your resume</p>
            </div>
          </div>
          <Button type="button" variant="outline" onClick={onBack} className="rounded-xl border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100">
            Back
          </Button>
        </CardHeader>

        <CardContent className="flex min-h-0 flex-1 flex-col gap-0 bg-transparent p-0">
          <ScrollArea className="chat-scroll flex-1 px-3 py-4 sm:px-6 sm:py-5">
            <div className="space-y-5">
              {messages.map((msg, idx) => (
                <div
                  key={msg.id || `${msg.role}-${idx}`}
                  className={`flex items-end gap-2 animate-fadeIn ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' ? (
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-zinc-800 text-zinc-400 shadow-sm">
                      <Bot size={16} className="text-cyan-400" />
                    </span>
                  ) : null}

                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'rounded-br-md bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-blue-900/25 rounded-2xl'
                        : 'rounded-bl-md bg-zinc-900/80 border border-zinc-800/60 text-zinc-200 backdrop-blur-xl'
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words">
                      {msg.typing ? (
                        <div className="flex items-center gap-1.5 py-1">
                          <span className="typing-dot" style={{ animationDelay: '0ms' }} />
                          <span className="typing-dot" style={{ animationDelay: '160ms' }} />
                          <span className="typing-dot" style={{ animationDelay: '320ms' }} />
                        </div>
                      ) : msg.role === 'assistant' ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ children }) => <p className="my-2">{children}</p>,
                            h1: ({ children }) => <h1 className="my-3 text-lg font-bold">{children}</h1>,
                            h2: ({ children }) => <h2 className="my-3 text-base font-bold">{children}</h2>,
                            h3: ({ children }) => <h3 className="my-2 text-sm font-bold">{children}</h3>,
                            ul: ({ children }) => <ul className="my-2 list-disc list-inside">{children}</ul>,
                            ol: ({ children }) => <ol className="my-2 list-decimal list-inside">{children}</ol>,
                            li: ({ children }) => <li className="my-1">{children}</li>,
                            code: ({ className, children, ...props }) => {
                              const match = /language-(\w+)/.exec(className || '');
                              const isInline = !match && !className;
                              return isInline ? (
                                <code className="bg-zinc-800/50 px-1.5 py-0.5 rounded-md text-cyan-300" {...props}>
                                  {children}
                                </code>
                              ) : (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              );
                            },
                            a: ({ children, href }) => (
                              <a href={href} className="text-cyan-400 no-underline hover:underline" target="_blank" rel="noopener noreferrer">
                                {children}
                              </a>
                            ),
                            pre: ({ children }) => (
                              <pre className="bg-zinc-950/80 border border-zinc-800 rounded-lg p-3 my-2 overflow-x-auto">
                                {children}
                              </pre>
                            ),
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-2 border-zinc-700 pl-3 my-2 text-zinc-400 italic">
                                {children}
                              </blockquote>
                            ),
                            hr: () => <hr className="my-4 border-zinc-800" />,
                            table: ({ children }) => (
                              <table className="w-full my-3 border-collapse">
                                {children}
                              </table>
                            ),
                            th: ({ children }) => (
                              <th className="border border-zinc-700 px-2 py-1 bg-zinc-800/50">{children}</th>
                            ),
                            td: ({ children }) => (
                              <td className="border border-zinc-700 px-2 py-1">{children}</td>
                            ),
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      ) : (
                        msg.content
                      )}
                    </div>
                    <div className={`mt-1.5 text-[11px] ${msg.role === 'user' ? 'text-blue-100/70' : 'text-zinc-500'}`}>
                      {formatTimestamp(msg.timestamp)}
                    </div>
                  </div>

                  {msg.role === 'user' ? (
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800/60 border border-zinc-700 text-zinc-400 shadow-sm">
                      <UserRound size={16} />
                    </span>
                  ) : null}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="sticky bottom-0 border-t border-zinc-800/50 bg-zinc-950/80 px-3 py-3 backdrop-blur-xl sm:px-6">
            <div className="flex items-end gap-2 sm:gap-3">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="min-h-[46px] max-h-32 resize-none rounded-2xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 leading-5 text-zinc-200 placeholder:text-zinc-500 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 focus-visible:ring-primary backdrop-blur-xl"
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
                className="h-11 w-11 shrink-0 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-cyan-500/30 disabled:hover:translate-y-0 disabled:opacity-50"
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

