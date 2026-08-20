import type { CustomerMessage } from "../lib/types";

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  } catch {
    return "";
  }
}

export function MessageBubble({ message }: { message: CustomerMessage }) {
  // This app represents the customer: "inbound" = a message the customer sent
  // (from this device) to the bank, "outbound" = the RM's reply, seen from the
  // customer's side — same direction vocabulary the backend uses everywhere.
  const isMine = message.direction === "inbound";

  return (
    <div className={`flex w-full ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[78%] rounded-[10px] px-3 py-2 ${
          isMine
            ? "rounded-tr-[2px] bg-[#DCF8C6]"
            : "rounded-tl-[2px] bg-white shadow-[0_1px_1px_rgba(0,0,0,0.06)]"
        }`}
      >
        <p className="whitespace-pre-wrap break-words text-[15px] leading-5 text-[#111]">{message.content}</p>
        <p className="mt-0.5 text-right text-[10px] text-[#667781]">{formatTime(message.source_timestamp)}</p>
      </div>
    </div>
  );
}
