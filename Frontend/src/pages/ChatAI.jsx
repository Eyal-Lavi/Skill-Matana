import React, { useState } from 'react';
import axios from 'axios';
import './ChatAI.scss'; // אם אתה עדיין משתמש ב-CSS רגיל, שנה ל- .css

function ChatAI() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);

  const sendQuestion = async () => {
    const trimmed = question.trim();
    if (!trimmed) return;

    const userMsg = { from: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion('');

    try {
      const res = await axios.post('http://localhost:3000/ask', {
        messages: [...messages, userMsg], // חשוב – שליחה של ההיסטוריה
      });

      const botMsg = { from: 'bot', text: res.data.answer };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: '❌ שגיאה בתקשורת עם השרת' },
      ]);
    }
  };

  return (
    <div className="app">
      <h1>🧠 LLM Chat</h1>
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={`msg ${msg.from}`}>
            <strong>{msg.from === 'user' ? '👤 אתה' : '🤖 מודל'}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendQuestion()}
          placeholder="מה תרצה לשאול?"
        />
        <button onClick={sendQuestion}>שלח</button>
      </div>
    </div>
  );
}

export default ChatAI;
