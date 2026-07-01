import type { ChatMessage, DoshResponse } from "../types";

export type DoshContext = {
  tag: string;
  name: string;
  usdBalance: number;
  ngnBalance: number;
  nairaPerUsd: number;
  people: { tag: string; relationship: string; note?: string }[];
  justVerified?: boolean;
};

export async function askDosh(
  messages: ChatMessage[],
  context: DoshContext,
): Promise<DoshResponse> {
  const res = await fetch("/api/dosh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, context }),
  });
  if (!res.ok) {
    return {
      reply: "I couldn't reach the server. Is it running?",
      cards: [],
      chips: [],
      error: String(res.status),
    };
  }
  return (await res.json()) as DoshResponse;
}

export async function health(): Promise<{
  ok: boolean;
  key: boolean;
  model: string;
  cardStudio?: boolean;
}> {
  try {
    const res = await fetch("/api/health");
    return await res.json();
  } catch {
    return { ok: false, key: false, model: "", cardStudio: false };
  }
}
