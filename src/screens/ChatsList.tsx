import { useState } from "react";
import { Avatar } from "../components/Avatar";
import { fetchCustomerMessages } from "../lib/api";
import { CUSTOMER_ID } from "../lib/customer";
import { usePolling } from "../lib/usePolling";
import { FAKE_CONTACTS } from "../lib/fakeContacts";
import type { CustomerMessage } from "../lib/types";

function formatPreviewTime(iso: string): string {
  try {
    const d = new Date(iso);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    return sameDay
      ? d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      : d.toLocaleDateString([], { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

function ReadTicks() {
  return (
    <svg viewBox="0 0 16 10" className="h-2.5 w-4 shrink-0 fill-none stroke-[#53BDEB]" strokeWidth={1.6}>
      <path d="M1 5.5L4 8.5L9.5 1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 5.5L9 8.5L14.5 1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// The customer's WhatsApp-style "Chats" list. Only the "Relationship Manager" row
// (the bank, pinned at top) is real and clickable — everything below it is
// decorative filler so the phone reads as a genuine, populated inbox rather
// than a single-purpose demo screen, matching how a real customer's WhatsApp
// would actually look.
export function ChatsList({ onOpenChat }: { onOpenChat: () => void }) {
  const [lastMessage, setLastMessage] = useState<CustomerMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"all" | "unread" | "groups">("all");
  const [search, setSearch] = useState("");

  usePolling(
    async () => {
      try {
        const res = await fetchCustomerMessages(CUSTOMER_ID, 1);
        setLastMessage(res.messages[res.messages.length - 1] ?? null);
      } catch (e) {
        console.warn("Failed to load latest message:", e);
      } finally {
        setLoading(false);
      }
    },
    6000,
    []
  );

  const q = search.trim().toLowerCase();
  const showBank = tab !== "groups" && (q === "" || "relationship manager".includes(q));
  const fakeRows = tab === "groups" ? [] : FAKE_CONTACTS
    .filter((c) => (tab === "unread" ? !!c.unread : true))
    .filter((c) => (q === "" ? true : c.name.toLowerCase().includes(q)));

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex shrink-0 items-center justify-between px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-2">
        <h1 className="text-2xl font-bold text-[#075E54]">WhatsApp</h1>
        <div className="flex items-center gap-4 text-[#54656F]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
            <path d="M4 8a2 2 0 0 1 2-2h1.2l.8-1.6A1 1 0 0 1 8.9 4h6.2a1 1 0 0 1 .9.6L16.8 6H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" strokeLinejoin="round" />
            <circle cx="12" cy="13" r="3.2" />
          </svg>
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <circle cx="5" cy="12" r="1.8" />
            <circle cx="12" cy="12" r="1.8" />
            <circle cx="19" cy="12" r="1.8" />
          </svg>
        </div>
      </div>

      <div className="shrink-0 px-3 pb-2">
        <div className="flex items-center gap-2 rounded-full bg-[#F0F2F5] px-3.5 py-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="#54656F" strokeWidth={2} className="h-4 w-4 shrink-0">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="w-full bg-transparent text-[14px] text-[#111] placeholder:text-[#54656F] focus:outline-none"
          />
        </div>
      </div>

      <div className="flex shrink-0 gap-2 px-3 pb-2">
        {([
          ["all", "All"],
          ["unread", "Unread"],
          ["groups", "Groups"],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
              tab === key ? "bg-[#075E54] text-white" : "bg-[#F0F2F5] text-[#111]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {showBank && (
          <button
            onClick={onOpenChat}
            className="flex w-full items-center gap-3 border-b border-[#F0F0F0] bg-[#E7F7F0] px-4 py-3 text-left hover:bg-[#DEF3EA]"
          >
            <Avatar name="Relationship Manager" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-[16px] font-semibold text-[#111]">Relationship Manager</p>
                {lastMessage && <p className="shrink-0 text-xs text-[#667781]">{formatPreviewTime(lastMessage.source_timestamp)}</p>}
              </div>
              <p className="mt-0.5 truncate text-[13px] text-[#667781]">
                {loading ? "Loading…" : lastMessage ? lastMessage.content : "Say hello to get started"}
              </p>
            </div>
            <svg viewBox="0 0 24 24" fill="#075E54" className="h-4 w-4 shrink-0 rotate-45">
              <path d="M12 2a1.5 1.5 0 0 1 1.5 1.5v7.29l3.6-3.6a1.5 1.5 0 1 1 2.12 2.13l-6.15 6.15a1.06 1.06 0 0 1-1.5 0L5.42 9.32a1.5 1.5 0 1 1 2.12-2.13l3.46 3.46V3.5A1.5 1.5 0 0 1 12 2Zm-6 18a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1Z" />
            </svg>
          </button>
        )}

        {/* Decorative only — not backed by real data, not clickable */}
        {fakeRows.map((c) => (
          <div key={c.name} className="flex w-full items-center gap-3 border-b border-[#F0F0F0] px-4 py-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[15px] font-bold text-white"
              style={{ backgroundColor: c.color }}
            >
              {c.name
                .split(/\s+/)
                .map((p) => p[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-[16px] font-semibold text-[#111]">{c.name}</p>
                <p className={`shrink-0 text-xs ${c.unread ? "font-semibold text-[#25D366]" : "text-[#667781]"}`}>{c.time}</p>
              </div>
              <div className="mt-0.5 flex items-center justify-between gap-2">
                <p className="flex min-w-0 items-center gap-1 truncate text-[13px] text-[#667781]">
                  {c.read && <ReadTicks />}
                  <span className="truncate">{c.preview}</span>
                </p>
                {c.unread && (
                  <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#25D366] px-1.5 text-[11px] font-bold text-white">
                    {c.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {tab === "groups" && (
          <div className="flex flex-col items-center justify-center gap-1 pt-16 text-center">
            <p className="text-[13px] text-[#667781]">No groups yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
