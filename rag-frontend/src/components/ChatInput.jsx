import { useState } from "react";

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!value.trim()) return;
    onSend(value.trim());
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex items-center gap-3">
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Ask a question about your documents"
        className="flex-1 rounded-full border border-secondary/60 bg-white px-5 py-3 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-primary"
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={disabled}
        className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-black shadow hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Send
      </button>
    </form>
  );
}
