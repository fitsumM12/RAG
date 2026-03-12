import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage.jsx";

export default function ChatWindow({ messages, loading }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="chat-scrollbar h-[40vh] overflow-y-auto rounded-3xl bg-white/50 p-6 shadow-inner">
      <div className="space-y-6">
        {messages.map((msg, index) => (
          <ChatMessage key={index} role={msg.role} content={msg.content} sources={msg.sources} />
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-ink/60">
            <span className="h-2 w-2 rounded-full bg-moss animate-pulse"></span>
            <span className="h-2 w-2 rounded-full bg-moss animate-pulse delay-150"></span>
            <span className="h-2 w-2 rounded-full bg-moss animate-pulse delay-300"></span>
            <span className="text-sm">Thinking...</span>
          </div>
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}
