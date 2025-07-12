"use client";
import { useState, useRef } from "react";
import { query } from "../app/api/chatbase-auth/route";
import { X, Mic } from "lucide-react";

export default function FlowisePopup() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const recognitionRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const response = await query({
      question: input,
      overrideConfig: {
        systemMessage: "You are a helpful assistant.",
        maxIterations: 1,
        enableDetailedStreaming: false,
      },
    });

    const botMsg = {
      role: "bot",
      content: response?.text || response?.output || "No response.",
    };
    setMessages((prev) => [...prev, botMsg]);
  };

  const startListening = () => {
    const SpeechRecognition =
      typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    let recognition;

    if (!recognitionRef.current) {
      recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };

      recognition.onend = () => {
        recognitionRef.current.isListening = false;
      };

      recognition.isListening = false;
      recognitionRef.current = recognition;
    } else {
      recognition = recognitionRef.current;
    }

    if (!recognition.isListening) {
      recognition.isListening = true;
      recognition.start();
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const userMsg = {
      role: "user",
      content: `📁 Uploaded file: ${file.name}`,
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      const botMsg = {
        role: "bot",
        content: result?.message || result?.error || "Upload complete.",
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Upload failed:", err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "❌ File upload failed." },
      ]);
    }
  };

  return (
    <div className="fixed top-1/2 left-1/2 w-[32rem] h-[38rem] -translate-x-1/2 -translate-y-1/2 pt-8 bg-zinc-900 text-white border border-zinc-700 rounded-xl shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className="flex justify-between items-center bg-blue-700 text-white px-4 py-2 rounded-t-xl">
        <span className="font-semibold">AskMyDocs</span>
        <button onClick={() => window.location.reload()}>
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-2 rounded-lg max-w-[80%] ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-800 text-zinc-100"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input + Upload */}
      <div className="flex items-center border-t border-zinc-700 px-3 py-3 bg-zinc-800 rounded-b-xl gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 text-sm px-2 py-1 rounded bg-zinc-700 text-white placeholder-zinc-400 focus:outline-none focus:ring focus:ring-blue-500"
          placeholder="Ask something..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        {/* Speech Button */}
        <button
          onClick={startListening}
          className="bg-zinc-700 hover:bg-zinc-600 text-white px-2 py-1 rounded"
          title="Speak"
        >
          <Mic size={16} />
        </button>

        {/* File Upload */}
        <label className="bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1 rounded text-sm cursor-pointer">
          Upload
          <input
            type="file"
            accept=".pdf,.txt,.docx,.json,.csv"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        {/* Send Button */}
        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}
