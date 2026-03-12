import { useEffect, useState } from "react";
import ChatWindow from "../components/ChatWindow.jsx";
import ChatInput from "../components/ChatInput.jsx";
import { askQuestion, askQuestionStream } from "../services/api.js";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Upload documents and ask anything about them. I will cite the most relevant chunks.",
      sources: []
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(
    () => window.localStorage.getItem("ragConversationId") || null
  );
  const [streaming, setStreaming] = useState(true);

  useEffect(() => {
    if (conversationId) {
      window.localStorage.setItem("ragConversationId", conversationId);
    }
  }, [conversationId]);

  const handleSend = async (question) => {
    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: question }]);

    const basePayload = {
      question,
      conversation_id: conversationId ? Number(conversationId) : undefined
    };

    if (!streaming) {
      try {
        const response = await askQuestion(basePayload);
        setConversationId(response.data.conversation_id);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: response.data.answer, sources: response.data.sources }
        ]);
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Error generating response.", sources: [] }
        ]);
      } finally {
        setLoading(false);
      }
      return;
    }

    let assistantIndex = null;
    setMessages((prev) => {
      assistantIndex = prev.length;
      return [...prev, { role: "assistant", content: "", sources: [] }];
    });

    askQuestionStream(
      basePayload,
      (token) => {
        setMessages((prev) => {
          const next = [...prev];
          next[assistantIndex] = {
            ...next[assistantIndex],
            content: `${next[assistantIndex].content}${token}`
          };
          return next;
        });
      },
      (data) => {
        setConversationId(data.conversation_id);
        setMessages((prev) => {
          const next = [...prev];
          next[assistantIndex] = {
            role: "assistant",
            content: data.answer,
            sources: data.sources
          };
          return next;
        });
        setLoading(false);
      },
      () => {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Streaming failed.", sources: [] }
        ]);
        setLoading(false);
      }
    );
  };

  const handleReset = () => {
    setConversationId(null);
    window.localStorage.removeItem("ragConversationId");
    setMessages([
      {
        role: "assistant",
        content: "New session started. Ask about your documents.",
        sources: []
      }
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-2xl text-ink">Chat Interface</h2>
          <p className="text-sm text-ink/70">
            Responses are grounded in your uploaded content and include citations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setStreaming((prev) => !prev)}
            className="rounded-full border border-white/70 bg-white/70 px-4 py-2 text-xs font-semibold text-ink"
          >
            {streaming ? "Streaming: On" : "Streaming: Off"}
          </button>
          <button
            onClick={handleReset}
            className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white"
          >
            New Session
          </button>
        </div>
      </div>
      <ChatWindow messages={messages} loading={loading} />
      <ChatInput onSend={handleSend} disabled={loading} />
    </div>
  );
}
