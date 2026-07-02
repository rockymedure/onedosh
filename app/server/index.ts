import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import { runDosh, hasKey, type ChatMessage, type DoshContext } from "./dosh.ts";
import {
  hasDb,
  getState,
  getJobs,
  applyEffect,
  applyEffects,
  resetProfile,
  type AppState,
  type DoshEffect,
  type Job,
  type Mode,
} from "./db.ts";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const PORT = Number(process.env.PORT || 8787);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    key: hasKey(),
    model: process.env.DOSH_MODEL || "claude-sonnet-5",
    db: hasDb(),
  });
});

function asMode(v: unknown): Mode {
  return v === "returning" ? "returning" : "new";
}

// Build Dosh's grounding context from the persisted state.
function contextFromState(s: AppState, jobs: Job[]): DoshContext {
  const bookedIds = new Set(s.bookings.map((b) => b.jobId));
  return {
    tag: s.tag,
    name: s.name,
    usdBalance: s.usd,
    ngnBalance: s.ngn,
    nairaPerUsd: s.nairaPerUsd,
    people: s.contacts.map((c) => ({
      tag: c.tag,
      relationship: c.relationship || "",
      note: c.note,
    })),
    justVerified: s.justVerified,
    accountOpened: s.accountOpened,
    watching: s.watching,
    cardOnFile: s.cardLast4,
    jobs: jobs.map((j) => ({
      id: j.id,
      title: j.title,
      poster: `${j.posterName} (${j.posterHandle})`,
      budget: `$${j.budgetUsd.toLocaleString()} ${j.cadence}`,
      tags: j.tags,
      inNetwork: j.inNetwork,
      booked: bookedIds.has(j.id),
    })),
  };
}

// Fallback context when no DB is configured (keeps local dev usable).
function fallbackContext(mode: Mode): { ctx: DoshContext; state: null } {
  const ctx: DoshContext =
    mode === "returning"
      ? {
          tag: "@tobi",
          name: "Tobi Adeyemi",
          usdBalance: 350,
          ngnBalance: 0,
          nairaPerUsd: 1418,
          people: [
            { tag: "@mike_edits", relationship: "US-based, pays for video editing" },
            { tag: "Mum", relationship: "family in Enugu" },
          ],
          justVerified: false,
          accountOpened: true,
          watching: null,
          cardOnFile: "4821",
        }
      : {
          tag: "@chidi",
          name: "Chidi Okafor",
          usdBalance: 0,
          ngnBalance: 0,
          nairaPerUsd: 1418,
          people: [],
          justVerified: true,
          accountOpened: false,
          watching: null,
          cardOnFile: null,
        };
  return { ctx, state: null };
}

app.get("/api/jobs", async (_req, res) => {
  if (!hasDb()) {
    res.json({ jobs: [], db: false });
    return;
  }
  try {
    const jobs = await getJobs();
    res.json({ jobs, db: true });
  } catch (err: any) {
    console.error("Jobs error:", err?.message || err);
    res.status(500).json({ error: err?.message || "jobs_failed" });
  }
});

app.get("/api/state", async (req, res) => {
  const mode = asMode(req.query.mode);
  if (!hasDb()) {
    res.json({ state: null, db: false });
    return;
  }
  try {
    const state = await getState(mode);
    res.json({ state, db: true });
  } catch (err: any) {
    console.error("State error:", err?.message || err);
    res.status(500).json({ error: err?.message || "state_failed" });
  }
});

app.post("/api/effect", async (req, res) => {
  const { mode, effect } = req.body as { mode?: string; effect?: DoshEffect };
  if (!hasDb()) {
    res.json({ state: null, db: false });
    return;
  }
  try {
    const state = await applyEffect(asMode(mode), effect || {});
    res.json({ state, db: true });
  } catch (err: any) {
    console.error("Effect error:", err?.message || err);
    res.status(500).json({ error: err?.message || "effect_failed" });
  }
});

app.post("/api/reset", async (req, res) => {
  const { mode } = req.body as { mode?: string };
  if (!hasDb()) {
    res.json({ state: null, db: false });
    return;
  }
  try {
    const state = await resetProfile(asMode(mode));
    res.json({ state, db: true });
  } catch (err: any) {
    console.error("Reset error:", err?.message || err);
    res.status(500).json({ error: err?.message || "reset_failed" });
  }
});

app.post("/api/dosh", async (req, res) => {
  const { messages, mode: modeInput } = req.body as {
    messages: ChatMessage[];
    mode?: string;
  };
  const mode = asMode(modeInput);

  if (!hasKey()) {
    res.status(200).json({
      reply:
        "I'm not connected yet — add your ANTHROPIC_API_KEY to app/.env and restart. Then I'll actually think.",
      cards: [],
      chips: [],
      offline: true,
    });
    return;
  }

  try {
    let state: AppState | null = null;
    let ctx: DoshContext;
    if (hasDb()) {
      const [s, jobs] = await Promise.all([getState(mode), getJobs()]);
      state = s;
      ctx = contextFromState(s, jobs);
    } else {
      ctx = fallbackContext(mode).ctx;
    }

    const result = await runDosh(messages, ctx);

    // Non-money effects Dosh performed this turn apply immediately.
    const actions = Array.isArray(result.actions) ? (result.actions as DoshEffect[]) : [];
    if (hasDb() && actions.length) {
      state = await applyEffects(mode, actions);
    }

    res.json({ reply: result.reply, cards: result.cards, chips: result.chips, state });
  } catch (err: any) {
    console.error("Dosh error:", err?.message || err);
    res.status(500).json({
      reply: "Something went wrong on my end. Try again in a moment.",
      cards: [],
      chips: [],
      error: err?.message || "unknown",
    });
  }
});

// In production, serve the built Vite frontend from the same service and let
// client-side routing fall back to index.html for non-API GET requests.
const clientDir = path.resolve(__dirname, "../dist");
if (fs.existsSync(clientDir)) {
  app.use(express.static(clientDir));
  app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api")) {
      res.sendFile(path.join(clientDir, "index.html"));
      return;
    }
    next();
  });
  console.log(`Serving static frontend from ${clientDir}`);
}

app.listen(PORT, () => {
  console.log(`Dosh server on http://localhost:${PORT}  (key: ${hasKey() ? "yes" : "MISSING"})`);
});
