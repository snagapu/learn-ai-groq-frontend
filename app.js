import React, { useState, useRef, useEffect } from "react";
import ChatWindow from "./components/ChatWindow";

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
    <div className={`flex flex-col h-screen ${darkMode ? "dark:bg-gray-900" : "bg-gray-50"} text-gray-900 dark:text-gray-100`}>
      <div className="flex justify-between p-4">
        <header className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4 text-center text-xl font-bold shadow-md flex-1">
          Learn.ai - Your AI Tutor
        </header>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-gray-700 text-white px-3 py-2 rounded-full"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col" ref={chatRef}>
        <ChatWindow messages={messages} />
      </div>

      <div className="p-4 flex flex-col sm:flex-row gap-2 border-t bg-white dark:bg-gray-800">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded-xl p-2 shadow"
          placeholder="Ask a question..."
        />
        <button
          onClick={sendMessage}
          className="bg-purple-600 text-white px-4 py-2 rounded-xl shadow hover:bg-purple-700"
        >
          Ask
        </button>
      </div>
    </div>
  );
}

export default App;
