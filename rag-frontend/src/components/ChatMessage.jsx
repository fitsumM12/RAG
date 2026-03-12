import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatMessage({ role, content, sources }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-2xl rounded-2xl px-5 py-4 shadow-sm ${
          isUser
            ? "bg-moss text-white"
            : "bg-white/80 border border-white/60 text-ink"
        }`}
      >
        <div className={`prose prose-sm max-w-none ${isUser ? "text-white" : "text-ink"} marked`}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
        {!isUser && sources?.length ? (
          <div className="mt-4 space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-ink/40">Sources</p>
            {sources.map((source, idx) => (
              <div key={idx} className="rounded-xl bg-sand/60 px-4 py-3 text-xs text-ink/70">
                <p className="font-semibold text-ink/80">
                  {source?.metadata?.document_name || "Document"}
                </p>
                {source?.metadata?.page !== undefined && (
                  <p className="text-[11px] text-ink/50">Page {source.metadata.page}</p>
                )}
                <div className="mt-2 text-ink/70 marked">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {source.highlighted_text || source.text}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
