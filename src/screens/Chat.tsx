import { useEffect, useRef, useState } from "react";
import { Composer } from "../components/Composer";
import { MessageBubble } from "../components/MessageBubble";
import { fetchCustomerMessages, sendCustomerMessage, rewindCustomerMessages } from "../lib/api";
import { usePolling } from "../lib/usePolling";
import type { CustomerMessage } from "../lib/types";

export function Chat({ customerId, onBack }: { customerId: string; onBack: () => void }) {
  const [messages, setMessages] = useState<CustomerMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [rewinding, setRewinding] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  usePolling(
    async () => {
      try {
        const res = await fetchCustomerMessages(customerId);
        setMessages(res.messages);
      } catch (e) {
        console.warn("Failed to load messages:", e);
      }
    },
    4000,
    [customerId]
  );

  // Scroll to bottom on new messages / mount, not on every poll tick that
  // finds nothing new (a full-array replacement every 4s would otherwise
  // yank the view down while the customer is reading older messages).
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = async (text: string) => {
    setSending(true);
    try {
      const sent = await sendCustomerMessage(customerId, text);
      setMessages((prev) => [...prev, sent]);
    } catch (e) {
      console.warn("Failed to send message:", e);
    } finally {
      setSending(false);
    }
  };

  // Resets the conversation back to its default starting point — deletes
  // everything sent since that customer's baseline marker, so the demo can
  // be replayed from a clean slate.
  const handleRewind = async () => {
    if (rewinding) return;
    if (!window.confirm("Rewind this conversation back to the start? Everything sent since then will be deleted.")) return;
    setRewinding(true);
    try {
      const res = await rewindCustomerMessages(customerId);
      setMessages(res.messages);
    } catch (e) {
      console.warn("Failed to rewind conversation:", e);
    } finally {
      setRewinding(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#ECE5DD]">
      <div className="flex shrink-0 items-center gap-2.5 border-b border-[#E9EDEF] bg-white px-2 py-2.5 pt-[calc(0.625rem+env(safe-area-inset-top))]">
        <button onClick={onBack} aria-label="Back" className="p-1 text-[#54656F] md:hidden">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} className="h-5 w-5">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#075E54] text-[13px] font-bold text-white">
          RM
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[16px] font-semibold leading-tight text-[#111]">Relationship Manager</h1>
          <p className="text-[12.5px] leading-tight text-[#25D366]">online</p>
        </div>

        <div className="flex items-center gap-4 pr-2 text-[#54656F]">
          <button onClick={handleRewind} disabled={rewinding} aria-label="Rewind conversation to default" title="Rewind to default conversation">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={`h-[18px] w-[18px] ${rewinding ? "animate-spin" : ""}`}>
              <path d="M3 12a9 9 0 1 0 3-6.7" strokeLinecap="round" />
              <path d="M3 4v5h5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
            <rect x="2.5" y="6" width="13" height="12" rx="2.5" />
            <path d="m21 8-5 3.2v1.6l5 3.2V8Z" strokeLinejoin="round" />
          </svg>
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8Z" />
          </svg>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2.5 py-2.5">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center pt-14">
            <p className="text-[13px] text-[#667781]">No messages yet. Say hello!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {messages.map((m) => (
              <MessageBubble key={m.event_id} message={m} />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <Composer onSend={handleSend} sending={sending} />
    </div>
  );
}
