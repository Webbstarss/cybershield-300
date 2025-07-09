import { useState } from 'react';

export default function Chatbot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error('Kunde inte hämta svar:', error);
      setMessages([...newMessages, { role: 'assistant', content: 'Ett fel uppstod vid kontakt med AI.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ border: '1px solid #ccc', padding: '1rem', height: '400px', overflowY: 'auto' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: '1rem' }}>
            <strong>{msg.role === 'user' ? 'Du' : 'AI'}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <div style={{ marginTop: '1rem', display: 'flex' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Skriv ditt meddelande..."
          style={{ flex: 1, padding: '0.5rem' }}
        />
        <button onClick={sendMessage} disabled={loading} style={{ padding: '0.5rem 1rem' }}>
          {loading ? 'Skickar...' : 'Skicka'}
        </button>
      </div>
    </div>
  );
}

