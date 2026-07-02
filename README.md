# OneDosh — “Dosh” concept & prototype

> A design exercise for the **Head of Product Design** role at OneDosh.

This repo reframes OneDosh from *a fintech app with a chatbot bolted on* into **an agent that happens to have a bank behind it**. “Dosh” is the money guy — the relationship layer *and* the infrastructure layer — not a feature buried in a tab.

> **Live demo:** **[onedosh-production.up.railway.app](https://onedosh-production.up.railway.app)** — a real, Claude-powered Dosh. On desktop it’s presented as a single Android handset; on a phone it fills the screen.

It contains three things:

1. **A working prototype** — a React + Vite app with a live, Claude-powered Dosh agent.
2. **The thinking** — concept docs covering the entity, the users and their jobs, and the design system.
3. **Visual reference** — the source screens that grounded the aesthetic.

> **See the reasoning as it happened:** [`PROCESS-LOG.md`](PROCESS-LOG.md) is a running commentary on the human judgment behind each change — the same *human-led, AI-accelerated* principle the product is built on, applied to how it’s built.

---

## The thesis in one minute

The standard fintech shape (wallet + card + Send/Add + transaction list) is a **passive toolbox**. For a Nigerian earning in dollars in 2026 — squeezed by ~30% inflation, a naira-only remittance mandate, freeze-happy banks, and fee-draining cards — **the passivity is the pain.** Nobody watches your back between sessions.

Dosh inverts the model. You state intent in plain language; Dosh prepares the move, picks the rail, watches the rate, and catches the scam — but **money only moves when you tap Confirm.** Human-led, AI-accelerated.

Full argument in [`concept/the-entity.md`](concept/the-entity.md).

---

## What the prototype demonstrates

- **Dosh as generative UI.** The agent doesn’t just chat — it renders the *right* card for the moment: a `receive_usd` account with a paste-ready message for your client, a `confirm` sheet before any transfer, a `scam_warning` when a request smells like an overpayment trap, a `status` update while it watches for a payment. The quick-action chips are generated to match exactly what Dosh just said.
- **Three tabs, one relationship.** `Explore` (the live network + work — who’s paying you, and gigs to pick up), `Dosh` (get paid, move it, stay un-scammed), `Money` (balance, card, discover). Profile lives top-right, always.
- **Trust architecture, made visible.** Confirm-before-move, the rail/rate/fee shown up front, no silent conversions.
- **Craft details.** An Android **Material 3** chrome — status bar plus a full-width, labelled navigation bar with a lime active indicator — over a warm-paper palette with an electric-lime accent instead of sterile fintech white. On desktop the whole app is framed as a single, centered Android device.

---

## Run it

Requires Node 20.19+ (22.x recommended) and an [Anthropic API key](https://console.anthropic.com/).

```bash
cd app
npm install
cp .env.example .env      # then add your ANTHROPIC_API_KEY
npm run dev
```

- Web: http://localhost:5173
- API: http://localhost:8787 (`/api/health`, `/api/dosh`)

`npm run dev` runs the Vite client and the Express/Anthropic server together. Without a key the UI still loads and Dosh tells you it isn’t connected. `SUPABASE_URL` / `SUPABASE_ANON_KEY` persist profiles, contacts, gigs and transactions (otherwise Dosh falls back to an in-memory context); `FAL_KEY` is optional and only powers generative card art.

Try: *“get me paid by a US client”*, *“send ₦40k to Mum”*, *“a client overpaid and wants a refund to a different account.”*

## Deploy

Deployed on **Railway** with the [Railpack](https://railpack.com/) builder. The app lives in `app/`, so a small root `package.json` delegates the build/start into it (`npm --prefix app …`) — the build (`tsc -b && vite build`) is served by the same Express server that hosts the API, on Railway’s `$PORT`. Set `ANTHROPIC_API_KEY` (and optionally `SUPABASE_*`, `FAL_KEY`, `DOSH_MODEL`) as service variables.

---

## Repo structure

```
package.json         root manifest — delegates build/start into app/ (for Railpack)
app/                 React + Vite prototype
  src/
    tabs/            Explore (Activity/Work/GigDetail), Dosh, Money, Profile
    dosh/            chat client + generative cards
    money/           the OneDosh card (CardArt) + card designs
    idv/             the just-verified identity-verification flow
    components/      StatusBar, TabBar, Header, VerifiedScreen, shared UI
    theme.ts         design tokens (navy / paper / electric lime + Material 3 roles)
  server/            Express API + the Dosh system prompt (server/dosh.ts) + Supabase (db.ts)
concept/             product thinking (start with the-entity.md)
visual-reference/    source screens the aesthetic was grounded in
```

## Tech

React 19 · Vite · TypeScript · Express · Anthropic Claude (`@anthropic-ai/sdk`, model configurable via `DOSH_MODEL`) · Supabase for persistence · deployed on Railway · optional fal.ai for card art.

## Design notes

- [`concept/the-entity.md`](concept/the-entity.md) — the reframing and trust architecture
- [`concept/users-and-jobs.md`](concept/users-and-jobs.md) — who this is for and their real jobs
- [`concept/design-system.md`](concept/design-system.md) — tokens, type, and components
- [`concept/design-three-tabs.md`](concept/design-three-tabs.md) — why three tabs
- [`concept/design-dosh-ui.md`](concept/design-dosh-ui.md) — Dosh as generative UI

---

*Prototype — a concept to react to and shape, not a shipping spec.*
