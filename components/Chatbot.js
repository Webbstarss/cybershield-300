// components/Chatbot.js
import { useState } from 'react';

export default function Chatbot() {
  const [messages, setMessages] = useState([{ role: 'system', content: 'Du är en cybersäkerhetsexpert.' }]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async () => {
    if (!userInput.trim()) return;
    const newMessages = [...messages, { role: 'user', content: userInput }];
    setMessages(newMessages);
    setUserInput('');
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      console.error(err);
      setError('Något gick fel. Försök igen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages
          .filter((msg) => msg.role !== 'system')
          .map((msg, i) => (
            <div key={i} className={msg.role}>
              <strong>{msg.role === 'user' ? 'Du' : 'AI'}:</strong> {msg.content}
            </div>
          ))}
      </div>
      <textarea
        rows={3}
        placeholder="Skriv din fråga..."
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
      />
      <button onClick={sendMessage} disabled={loading}>
        {loading ? 'Svarar...' : 'Skicka'}
      </button>
      {error && <p className="error">{error}</p>}
      <style jsx>{`
        .chat-container {
          max-width: 600px;
          margin: auto;
          padding: 1rem;
        }
        .messages {
          background: #f1f1f1;
          padding: 1rem;
          border-radius: 8px;
          height: 300px;
          overflow-y: auto;
          margin-bottom: 1rem;
        }
        .user {
          text-align: right;
          margin-bottom: 0.5rem;
        }
        .assistant {
          text-align: left;
          margin-bottom: 0.5rem;
        }
        textarea {
          width: 100%;
          padding: 0.5rem;
        }
        button {
          margin-top: 0.5rem;
        }
        .error {
          color: red;
        }
      `}</style>
    </div>
  );
}
