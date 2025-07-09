import { useState } from 'react';

export default function Chatbot() {
  const [messages, setMessages] = useState([{ role: 'system', content: 'Du är en cybersäkerhetsexpert.' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages }),
    });

    const data = await res.json();
    setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    setLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.slice(1).map((msg, i) => (
          <div key={i} className={msg.role}>{msg.content}</div>
        ))}
        {loading && <div className="assistant">Tänker...</div>}
      </div>
      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Skriv en fråga..."
        />
        <button onClick={sendMessage}>Skicka</button>
      </div>
    </div>
  );
}
