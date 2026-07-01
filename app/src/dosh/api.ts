import type { AppState, ChatMessage, DoshEffect, DoshResponse } from "../types";

export type Mode = "new" | "returning";

// Kept for callers that still reference the old shape; the server now owns state.
export type DoshContext = {
  tag: string;
  name: string;
  usdBalance: number;
  ngnBalance: number;
  nairaPerUsd: number;
  people: { tag: string; relationship: string; note?: string }[];
  justVerified?: boolean;
};

export async function askDosh(messages: ChatMessage[], mode: Mode): Promise<DoshResponse> {
  const res = await fetch("/api/dosh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, mode }),
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

export async function getState(mode: Mode): Promise<AppState | null> {
  try {
    const res = await fetch(`/api/state?mode=${mode}`);
    const data = (await res.json()) as { state: AppState | null };
    return data.state;
  } catch {
    return null;
  }
}

export async function applyEffect(mode: Mode, effect: DoshEffect): Promise<AppState | null> {
  try {
    const res = await fetch("/api/effect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode, effect }),
    });
    const data = (await res.json()) as { state: AppState | null };
    return data.state;
  } catch {
    return null;
  }
}

export async function resetProfile(mode: Mode): Promise<AppState | null> {
  try {
    const res = await fetch("/api/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode }),
    });
    const data = (await res.json()) as { state: AppState | null };
    return data.state;
  } catch {
    return null;
  }
}

export async function health(): Promise<{
  ok: boolean;
  key: boolean;
  model: string;
  db?: boolean;
}> {
  try {
    const res = await fetch("/api/health");
    return await res.json();
  } catch {
    return { ok: false, key: false, model: "", db: false };
  }
}
