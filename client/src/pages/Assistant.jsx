// src/pages/Assistant.jsx
import React, { useState } from "react";
import { askGemini } from "../services/gemini";

export default function Assistant() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "👋 Hi! I’m your Tamil Assistant. Ask me anything regarding Tamil queries!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle sending message
  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Call Gemini API
      const reply = await askGemini(input);

      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "❌ Error connecting to Gemini API." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Send message on Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-purple-700 text-white p-4 text-lg font-bold shadow-md">
        💬 Tamil AI Assistant
      </div>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg max-w-lg ${
              msg.role === "user"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-200 text-gray-900"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="bg-gray-300 text-gray-800 p-3 rounded-lg w-fit">
            ⏳ Thinking...
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t flex gap-2">
        <textarea
          className="flex-1 border rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-purple-600"
          rows={1}
          placeholder="Ask anything regarding Tamil queries..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={sendMessage}
          className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 transition"
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}
