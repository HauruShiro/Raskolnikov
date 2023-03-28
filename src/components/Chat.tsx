import { useEffect, useRef, useState } from 'react';
import React from 'react';

type Message = {
  text: string;
  user: 'human' | 'bot';
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const addBotMessage = async (text: string) => {
    setMessages([...messages, { text, user: 'bot' }]);
    const response = await fetch(
      `https://api.openai.com/v1/engines/davinci-codex/completions?prompt=${encodeURIComponent(
        `Conversation:\n\nUser: ${inputValue}\nAI:`
      )}&max_tokens=50&n=1&stop=\n\nUser:`
      , {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        method: 'POST',
      }
    );
    const data = await response.json();
    setMessages([...messages, { text: data.choices[0].text.trim(), user: 'bot' }]);
  };

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessages([...messages, { text: inputValue, user: 'human' }]);
    setInputValue('');
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-container" ref={chatContainerRef}>
      {messages.map((message, index) => (
        <p key={index} className={message.user}>
          {message.text}
        </p>
      ))}
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="chat-input"
        />
      </form>
    </div>
  );
};

export default Chat;
