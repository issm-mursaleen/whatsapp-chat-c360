import type { CustomerMessage, CustomerSummary } from "./types";

// A real browser, unlike Expo's native fetch, always runs on the same host
// the user typed into their address bar — no LAN-IP/device detection needed
// the way the old mobile app required. Just point at c360-api directly.
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed (${res.status})${text ? `: ${text}` : ""}`);
  }
  const json = await res.json();
  return (json?.data ?? json) as T;
}

export async function fetchCustomers(pageSize = 50): Promise<CustomerSummary[]> {
  return apiFetch<CustomerSummary[]>(`/api/v1/customers?page_size=${pageSize}`);
}

export async function fetchCustomerMessages(
  unifiedCustomerId: string,
  limit = 200
): Promise<{ messages: CustomerMessage[]; total: number }> {
  return apiFetch(`/api/v1/customers/${unifiedCustomerId}/messages?limit=${limit}`);
}

export async function rewindCustomerMessages(
  unifiedCustomerId: string
): Promise<{ messages: CustomerMessage[]; total: number }> {
  return apiFetch(`/api/v1/customers/${unifiedCustomerId}/messages/rewind`, { method: "POST" });
}

export async function sendCustomerMessage(
  unifiedCustomerId: string,
  content: string,
  channel = "whatsapp"
): Promise<CustomerMessage> {
  return apiFetch(`/api/v1/customers/${unifiedCustomerId}/messages`, {
    method: "POST",
    body: JSON.stringify({ direction: "inbound", channel, content }),
  });
}
