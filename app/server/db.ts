import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";

const url = process.env.SUPABASE_URL || "";
const key = process.env.SUPABASE_ANON_KEY || "";

export function hasDb(): boolean {
  return Boolean(url && key);
}

// supabase-js always spins up a realtime client, which needs a WebSocket
// implementation. Node < 22 has no native one, so hand it `ws`. We only use
// PostgREST here, so this is purely to satisfy the constructor.
const db =
  url && key
    ? createClient(url, key, {
        auth: { persistSession: false },
        realtime: { transport: WebSocket as unknown as never },
      })
    : null;

export type Mode = "new" | "returning";
export type Contact = { tag: string; name?: string; relationship?: string; note?: string };
export type Txn = { kind: string; usdDelta: number; ngnDelta: number; note?: string; createdAt: string };

export type AppState = {
  mode: Mode;
  tag: string;
  name: string;
  usd: number;
  ngn: number;
  nairaPerUsd: number;
  accountOpened: boolean;
  justVerified: boolean;
  watching: string | null;
  contacts: Contact[];
  transactions: Txn[];
};

// A single effect Dosh can apply to the world. Non-money effects run as soon as
// Dosh emits them; money moves ride on a confirm card and only apply on tap.
export type DoshEffect = {
  openAccount?: boolean;
  addContact?: { tag?: string; name?: string; relationship?: string; note?: string };
  usdDelta?: number;
  ngnDelta?: number;
  watch?: string | null;
  kind?: string;
  note?: string;
};

const SEED: Record<Mode, Record<string, unknown>> = {
  new: { mode: "new", tag: "@chidi", name: "Chidi Okafor", usd: 0, ngn: 0, naira_per_usd: 1418, account_opened: false, just_verified: true, watching: null },
  returning: { mode: "returning", tag: "@tobi", name: "Tobi Adeyemi", usd: 350, ngn: 0, naira_per_usd: 1418, account_opened: true, just_verified: false, watching: null },
};

const SEED_CONTACTS: Record<Mode, Contact[]> = {
  new: [],
  returning: [
    { tag: "@mike_edits", name: "Mike", relationship: "US client, pays for video editing" },
    { tag: "Mum", name: "Mum", relationship: "family in Enugu, monthly support + school fees" },
    { tag: "YouTube AdSense", name: "YouTube AdSense", relationship: "platform payout, roughly quarterly" },
  ],
};

async function ensureProfile(mode: Mode): Promise<void> {
  if (!db) return;
  const { data } = await db.from("onedosh_profiles").select("mode").eq("mode", mode).maybeSingle();
  if (!data) {
    await db.from("onedosh_profiles").insert(SEED[mode]);
    if (SEED_CONTACTS[mode].length) {
      await db.from("onedosh_contacts").insert(SEED_CONTACTS[mode].map((c) => ({ mode, ...c })));
    }
  }
}

type ProfileRow = {
  tag: string;
  name: string;
  usd: number | string;
  ngn: number | string;
  naira_per_usd: number | string;
  account_opened: boolean;
  just_verified: boolean;
  watching: string | null;
};

function toState(mode: Mode, p: ProfileRow, contacts: any[], txns: any[]): AppState {
  return {
    mode,
    tag: p.tag,
    name: p.name,
    usd: Number(p.usd),
    ngn: Number(p.ngn),
    nairaPerUsd: Number(p.naira_per_usd),
    accountOpened: p.account_opened,
    justVerified: p.just_verified,
    watching: p.watching,
    contacts: contacts.map((c) => ({ tag: c.tag, name: c.name, relationship: c.relationship, note: c.note })),
    transactions: txns.map((t) => ({
      kind: t.kind,
      usdDelta: Number(t.usd_delta),
      ngnDelta: Number(t.ngn_delta),
      note: t.note,
      createdAt: t.created_at,
    })),
  };
}

export async function getState(mode: Mode): Promise<AppState> {
  if (!db) throw new Error("no_db");
  await ensureProfile(mode);
  const [profile, contacts, txns] = await Promise.all([
    db.from("onedosh_profiles").select("*").eq("mode", mode).single(),
    db.from("onedosh_contacts").select("*").eq("mode", mode).order("created_at", { ascending: true }),
    db.from("onedosh_transactions").select("*").eq("mode", mode).order("created_at", { ascending: false }).limit(12),
  ]);
  return toState(mode, profile.data as ProfileRow, contacts.data || [], txns.data || []);
}

export async function applyEffect(mode: Mode, e: DoshEffect): Promise<AppState> {
  if (!db) throw new Error("no_db");
  await ensureProfile(mode);
  const { data: p } = await db.from("onedosh_profiles").select("*").eq("mode", mode).single();
  if (!p) throw new Error("no_profile");

  const update: Record<string, unknown> = {};
  if (e.openAccount && !p.account_opened) update.account_opened = true;
  if (typeof e.usdDelta === "number" && e.usdDelta !== 0) update.usd = Math.max(0, Number(p.usd) + e.usdDelta);
  if (typeof e.ngnDelta === "number" && e.ngnDelta !== 0) update.ngn = Math.max(0, Number(p.ngn) + e.ngnDelta);
  if (e.watch !== undefined) update.watching = e.watch;
  // First real action means they're no longer a blank just-verified user.
  if (p.just_verified && (update.account_opened || e.addContact || update.usd !== undefined || update.ngn !== undefined)) {
    update.just_verified = false;
  }
  if (Object.keys(update).length) {
    update.updated_at = new Date().toISOString();
    await db.from("onedosh_profiles").update(update).eq("mode", mode);
  }

  if (e.addContact && (e.addContact.tag || e.addContact.name)) {
    const tag = e.addContact.tag || "@" + (e.addContact.name || "friend").toLowerCase().replace(/\s+/g, "");
    const { data: existing } = await db.from("onedosh_contacts").select("id").eq("mode", mode).ilike("tag", tag).maybeSingle();
    if (!existing) {
      await db.from("onedosh_contacts").insert({
        mode,
        tag,
        name: e.addContact.name,
        relationship: e.addContact.relationship,
        note: e.addContact.note,
      });
    }
  }

  if ((typeof e.usdDelta === "number" && e.usdDelta !== 0) || (typeof e.ngnDelta === "number" && e.ngnDelta !== 0)) {
    await db.from("onedosh_transactions").insert({
      mode,
      kind: e.kind || "move",
      usd_delta: e.usdDelta || 0,
      ngn_delta: e.ngnDelta || 0,
      note: e.note,
    });
  }

  return getState(mode);
}

export async function applyEffects(mode: Mode, effects: DoshEffect[]): Promise<AppState> {
  let latest: AppState | null = null;
  for (const e of effects) latest = await applyEffect(mode, e);
  return latest || getState(mode);
}

export async function resetProfile(mode: Mode): Promise<AppState> {
  if (!db) throw new Error("no_db");
  await db.from("onedosh_transactions").delete().eq("mode", mode);
  await db.from("onedosh_contacts").delete().eq("mode", mode);
  await db.from("onedosh_profiles").delete().eq("mode", mode);
  await ensureProfile(mode);
  return getState(mode);
}
