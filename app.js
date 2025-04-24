import React, { useState, useRef, useEffect } from "react";
import ChatWindow from "./components/ChatWindow";
import './styles.css';  // Importing the custom CSS

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);

      // Voice Playback
      speak(data.answer);
    } catch (err) {
      console.error(err);
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="header">
        <header className="app-header">
          Learn.ai - Your AI Tutor
        </header>
        <button onClick={() => setDarkMode(!darkMode)} className="dark-mode-toggle">
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <div className="chat-container" ref={chatRef}>
        <ChatWindow messages={messages} />
      </div>

      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="input-box"
          placeholder="Ask a question..."
        />
        <button onClick={sendMessage} className="send-btn">
          Ask
        </button>
      </div>
    </div>
  );
}

export default App;
