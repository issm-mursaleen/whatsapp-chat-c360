// Purely decorative — makes the customer's phone look like a real, populated
// WhatsApp inbox (per the reference screenshot) rather than a single-contact
// demo screen. None of these are backed by real data or clickable; only the
// "Relationship Manager" row at the top is a real, functioning conversation.
export interface FakeContact {
  name: string;
  color: string;
  preview: string;
  time: string;
  unread?: number;
  read?: boolean;
}

export const FAKE_CONTACTS: FakeContact[] = [
  { name: "Bilal Mirza", color: "#8B5CF6", preview: "bro send the venue location", time: "9:41 AM", unread: 2 },
  { name: "Areeba & Cousins", color: "#F97316", preview: "Areeba: eid milne kab aa rahe ho", time: "9:12 AM" },
  { name: "Hamza Sheikh", color: "#0EA5E9", preview: "haan wahi wala bhej dena", time: "Yesterday", read: true },
  { name: "Zainab Tariq", color: "#EC4899", preview: "call me when you're free", time: "Yesterday", unread: 1 },
  { name: "Owais Malik", color: "#22C55E", preview: "🎥 Video", time: "Yesterday", read: true },
  { name: "Ammi", color: "#EF4444", preview: "khana kha liya?", time: "Tuesday", read: true },
  { name: "Danish Iqbal", color: "#6366F1", preview: "match dekh rahe ho?", time: "Monday" },
  { name: "Nimra Fatima", color: "#14B8A6", preview: "📷 Photo", time: "Monday", read: true },
];
