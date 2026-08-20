import { useState } from "react";
import { ChatsList } from "./screens/ChatsList";
import { Chat } from "./screens/Chat";
import { CUSTOMER_ID } from "./lib/customer";

type View = "list" | "chat";

// Below md (768px, phone): single pane at a time, exactly like a real phone
// app — the list and the open chat are separate full-screen views, and
// `view` decides which one is showing. At md and up (tablet/desktop): both
// panes are always visible side by side, list on the left, conversation on
// the right — the same master-detail layout WhatsApp Web and iPad's
// Messages/Mail apps use, so the app actually uses the available width
// instead of shrinking into a small card floating in empty space.
function AppShell() {
  const [view, setView] = useState<View>("list");

  return (
    <div className="flex h-full w-full">
      <div className={`h-full w-full shrink-0 md:block md:w-[380px] md:border-r md:border-[#E9EDEF] ${view === "chat" ? "hidden" : "block"}`}>
        <ChatsList onOpenChat={() => setView("chat")} />
      </div>
      <div className={`h-full w-full md:block md:flex-1 ${view === "chat" ? "block" : "hidden"}`}>
        <Chat customerId={CUSTOMER_ID} onBack={() => setView("list")} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="h-dvh w-full bg-white">
      <AppShell />
    </div>
  );
}
