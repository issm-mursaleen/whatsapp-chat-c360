import { useState, type KeyboardEvent } from "react";

export function Composer({ onSend, sending }: { onSend: (text: string) => void; sending?: boolean }) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const disabled = !value.trim() || sending;

  return (
    <div className="flex items-end gap-2 bg-[#F0F0F0] px-2.5 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Message"
        rows={1}
        className="min-h-[40px] max-h-[100px] flex-1 resize-none rounded-full bg-white px-3.5 py-2 text-[15px] text-[#111] placeholder:text-[#8696A0] focus:outline-none"
      />
      <button
        onClick={handleSend}
        disabled={disabled}
        aria-label="Send message"
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#075E54] text-white transition-opacity ${
          disabled ? "opacity-40" : "opacity-100"
        }`}
      >
        {sending ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="h-4 w-4 -translate-x-px rotate-45">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    </div>
  );
}
