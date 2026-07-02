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

export type Job = {
  id: string;
  emoji: string;
  title: string;
  posterName: string;
  posterHandle: string;
  blurb: string;
  category: string;
  budgetUsd: number;
  cadence: string;
  location: string;
  tags: string[];
  inNetwork: boolean;
};

export type Booking = {
  id: string;
  jobId: string;
  title: string;
  posterName: string;
  posterHandle: string;
  emoji: string;
  agreedUsd: number;
  cadence: string;
  status: string;
  createdAt: string;
};

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
  cardLast4: string | null;
  contacts: Contact[];
  transactions: Txn[];
  bookings: Booking[];
};

// A single effect Dosh can apply to the world. Non-money effects run as soon as
// Dosh emits them; money moves ride on a confirm card and only apply on tap.
export type DoshEffect = {
  openAccount?: boolean;
  attachCard?: { last4?: string };
  addContact?: { tag?: string; name?: string; relationship?: string; note?: string };
  bookJob?: { jobId?: string };
  usdDelta?: number;
  ngnDelta?: number;
  watch?: string | null;
  kind?: string;
  note?: string;
};

const SEED: Record<Mode, Record<string, unknown>> = {
  new: { mode: "new", tag: "@chidi", name: "Chidi Okafor", usd: 0, ngn: 0, naira_per_usd: 1418, account_opened: false, just_verified: true, watching: null, card_last4: null },
  returning: { mode: "returning", tag: "@tobi", name: "Tobi Adeyemi", usd: 350, ngn: 0, naira_per_usd: 1418, account_opened: true, just_verified: false, watching: null, card_last4: "4821" },
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
  card_last4: string | null;
};

function toJob(r: any): Job {
  return {
    id: r.id,
    emoji: r.emoji || "💼",
    title: r.title,
    posterName: r.poster_name,
    posterHandle: r.poster_handle,
    blurb: r.blurb || "",
    category: r.category || "",
    budgetUsd: Number(r.budget_usd),
    cadence: r.cadence || "",
    location: r.location || "Remote",
    tags: Array.isArray(r.tags) ? r.tags : [],
    inNetwork: Boolean(r.in_network),
  };
}

export async function getJobs(): Promise<Job[]> {
  if (!db) return [];
  const { data } = await db.from("onedosh_jobs").select("*").order("sort", { ascending: true });
  return (data || []).map(toJob);
}

function toState(mode: Mode, p: ProfileRow, contacts: any[], txns: any[], bookings: any[]): AppState {
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
    cardLast4: p.card_last4 ?? null,
    contacts: contacts.map((c) => ({ tag: c.tag, name: c.name, relationship: c.relationship, note: c.note })),
    transactions: txns.map((t) => ({
      kind: t.kind,
      usdDelta: Number(t.usd_delta),
      ngnDelta: Number(t.ngn_delta),
      note: t.note,
      createdAt: t.created_at,
    })),
    bookings: bookings.map((b) => ({
      id: b.id,
      jobId: b.job_id,
      title: b.onedosh_jobs?.title ?? "",
      posterName: b.onedosh_jobs?.poster_name ?? "",
      posterHandle: b.onedosh_jobs?.poster_handle ?? "",
      emoji: b.onedosh_jobs?.emoji ?? "💼",
      cadence: b.onedosh_jobs?.cadence ?? "",
      agreedUsd: Number(b.agreed_usd),
      status: b.status,
      createdAt: b.created_at,
    })),
  };
}

export async function getState(mode: Mode): Promise<AppState> {
  if (!db) throw new Error("no_db");
  await ensureProfile(mode);
  const [profile, contacts, txns, bookings] = await Promise.all([
    db.from("onedosh_profiles").select("*").eq("mode", mode).single(),
    db.from("onedosh_contacts").select("*").eq("mode", mode).order("created_at", { ascending: true }),
    db.from("onedosh_transactions").select("*").eq("mode", mode).order("created_at", { ascending: false }).limit(12),
    db
      .from("onedosh_bookings")
      .select("*, onedosh_jobs(title, poster_name, poster_handle, emoji, cadence)")
      .eq("mode", mode)
      .order("created_at", { ascending: false }),
  ]);
  return toState(mode, profile.data as ProfileRow, contacts.data || [], txns.data || [], bookings.data || []);
}

export async function applyEffect(mode: Mode, e: DoshEffect): Promise<AppState> {
  if (!db) throw new Error("no_db");
  await ensureProfile(mode);
  const { data: p } = await db.from("onedosh_profiles").select("*").eq("mode", mode).single();
  if (!p) throw new Error("no_profile");

  // Booking a gig is a bundle: it commits to the work, saves the client as a
  // contact, opens the USD account so they can be paid, and starts a watch for
  // the agreed payment. It resolves to those primitive effects.
  let job: Job | null = null;
  if (e.bookJob?.jobId && db) {
    const { data: jr } = await db.from("onedosh_jobs").select("*").eq("id", e.bookJob.jobId).maybeSingle();
    if (jr) {
      job = toJob(jr);
      const { data: existingBooking } = await db
        .from("onedosh_bookings")
        .select("id")
        .eq("mode", mode)
        .eq("job_id", job.id)
        .maybeSingle();
      if (!existingBooking) {
        await db.from("onedosh_bookings").insert({ mode, job_id: job.id, agreed_usd: job.budgetUsd, status: "booked" });
      }
      // Save the client (if not already saved).
      const { data: existingContact } = await db
        .from("onedosh_contacts")
        .select("id")
        .eq("mode", mode)
        .ilike("tag", job.posterHandle)
        .maybeSingle();
      if (!existingContact) {
        await db.from("onedosh_contacts").insert({
          mode,
          tag: job.posterHandle,
          name: job.posterName,
          relationship: `client — ${job.title} ($${job.budgetUsd} ${job.cadence})`,
        });
      }
    }
  }

  const update: Record<string, unknown> = {};
  if (e.openAccount && !p.account_opened) update.account_opened = true;
  if (e.attachCard && !p.card_last4) {
    update.card_last4 = e.attachCard.last4 || String(Math.floor(1000 + Math.random() * 9000));
  }
  if (job) {
    if (!p.account_opened) update.account_opened = true;
    update.watching = `${job.posterName}'s payment for ${job.title}`;
  }
  if (typeof e.usdDelta === "number" && e.usdDelta !== 0) update.usd = Math.max(0, Number(p.usd) + e.usdDelta);
  if (typeof e.ngnDelta === "number" && e.ngnDelta !== 0) update.ngn = Math.max(0, Number(p.ngn) + e.ngnDelta);
  if (e.watch !== undefined) update.watching = e.watch;
  // First real action means they're no longer a blank just-verified user.
  if (p.just_verified && (update.account_opened || update.card_last4 || e.addContact || job || update.usd !== undefined || update.ngn !== undefined)) {
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
  await db.from("onedosh_bookings").delete().eq("mode", mode);
  await db.from("onedosh_transactions").delete().eq("mode", mode);
  await db.from("onedosh_contacts").delete().eq("mode", mode);
  await db.from("onedosh_profiles").delete().eq("mode", mode);
  await ensureProfile(mode);
  return getState(mode);
}
