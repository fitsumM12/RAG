import { useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import ChatMessage from "./ChatMessage.jsx";

export default function ChatWindow({ messages, loading }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="chat-scrollbar h-[400px] overflow-y-auto rounded-3xl bg-secondary/20 p-6 shadow-inner border border-secondary/40">
      <div className="space-y-6">
        {messages.map((msg, index) => (
          <ChatMessage key={index} role={msg.role} content={msg.content} sources={msg.sources} />
        ))}
        {loading && (
          <div className="flex items-center gap-3 text-black/60">
            <Icon icon="svg-spinners:3-dots-scale" className="text-primary text-2xl" />
            <span className="text-sm">Thinking...</span>
          </div>
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}
