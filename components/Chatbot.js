import { useState } from 'react';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Du är en cybersäkerhetsassistent som hjälper användare förstå och skydda sig mot hot.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      const botMessage = {
        role: 'assistant',
        content: data.reply || 'Inget svar från AI:n.',
      };

      setMessages([...newMessages, botMessage]);
    } catch (error) {
      setMessages([
        ...newMessages,
        { role: 'assistant', content: 'Ett fel uppstod vid kontakt med servern.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h1>Cybersäkerhets-Chatbot</h1>
      <div
        style={{
          border: '1px solid #ccc',
          borderRadius: 8,
          padding: 10,
          height: 400,
          overflowY: 'auto',
          background: '#f9f9f9',
          marginBottom: 10,
        }}
      >
        {messages
          .filter((msg) => msg.role !== 'system')
          .map((msg, idx) => (
            <div key={idx} style={{ marginBottom: 10 }}>
              <strong>{msg.role === 'user' ? 'Du' : 'AI'}:</strong> {msg.content}
            </div>
          ))}
        {loading && <div><em>AI skriver...</em></div>}
      </div>
      <textarea
        rows={3}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Skriv din cybersäkerhetsfråga här..."
        style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc' }}
      />
      <button onClick={sendMessage} style={{ marginTop: 10, padding: '10px 20px' }}>
        Skicka
      </button>
    </div>
  );
}

