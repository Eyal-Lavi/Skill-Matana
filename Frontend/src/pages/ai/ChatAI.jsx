import React, { useState } from 'react';
import axios from 'axios';
import './ChatAI.scss'; 

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
        messages: [...messages, userMsg], 
      });

      const botMsg = { from: 'bot', text: res.data.answer };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: '❌ Error communicating with the server' },
      ]);
    }
  };

  return (
    <div className="app">
      <h1>🧠 LLM Chat</h1>
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={`msg ${msg.from}`}>
            <strong>{msg.from === 'user' ? '👤 You' : '🤖 Model'}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendQuestion()}
          placeholder="What would you like to ask?"
        />
        <button onClick={sendQuestion}>Send</button>
      </div>
    </div>
  );
}

export default ChatAI;
