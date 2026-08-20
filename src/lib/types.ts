export interface CustomerMessage {
  event_id: string;
  direction: "inbound" | "outbound";
  channel: string;
  content: string;
  source_timestamp: string;
}

export interface CustomerSummary {
  unified_customer_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
}
