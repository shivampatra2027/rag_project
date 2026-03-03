import { useEffect, useRef, useState } from 'react';
import apiClient from '../api/apiClient';

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
    <main style={{ padding: '1rem', fontFamily: 'sans-serif', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h1 style={{ margin: 0 }}>Chat with AI</h1>
        <button type="button" onClick={onBack}>
          Back
        </button>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '0.75rem',
          background: '#fafafa',
          marginBottom: '0.75rem',
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={`${msg.role}-${idx}`}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '0.5rem',
            }}
          >
            <div
              style={{
                maxWidth: '75%',
                padding: '0.6rem 0.8rem',
                borderRadius: '8px',
                background: msg.role === 'user' ? '#dbeafe' : '#e5e7eb',
                whiteSpace: 'pre-wrap',
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your doubt..."
          style={{ flex: 1, padding: '0.6rem' }}
        />
        <button type="button" onClick={sendMessage} disabled={!input.trim() || loading}>
          Send
        </button>
      </div>
    </main>
  );
}

export default Chat;
