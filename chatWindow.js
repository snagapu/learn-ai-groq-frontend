import React from "react";

const ChatWindow = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`max-w-[75%] p-3 rounded-2xl shadow-md ${
            msg.role === "user" ? "bg-blue-100 self-end ml-auto" : "bg-gray-100"
          }`}
        >
          <p className="text-sm text-gray-800">{msg.content}</p>
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;
