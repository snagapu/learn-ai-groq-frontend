import React from "react";

const ChatWindow = ({ messages }) => {
  return (
    <div className="chat-window">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`message ${msg.role === "user" ? "user-message" : "assistant-message"}`}
        >
          <p>{msg.content}</p>
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;
