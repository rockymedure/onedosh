# OneDosh — “Dosh” concept & prototype

> A design exercise for the **Head of Product Design** role at OneDosh.

This repo reframes OneDosh from *a fintech app with a chatbot bolted on* into **an agent that happens to have a bank behind it**. “Dosh” is the money guy — the relationship layer *and* the infrastructure layer — not a feature buried in a tab.

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
- **Three tabs, one relationship.** `Activity` (the network — who’s paying you, alive), `Dosh` (get paid, move it, stay un-scammed), `Money` (balance, card, discover). Profile lives top-right, always.
- **Trust architecture, made visible.** Confirm-before-move, the rail/rate/fee shown up front, no silent conversions.
- **Craft details.** iOS 26 “Liquid Glass” status bar and a floating, icon-only tab bar; a warm-paper palette with an electric-lime accent instead of sterile fintech white.

---

## Run it

Requires Node 18+ and an [Anthropic API key](https://console.anthropic.com/).

```bash
cd app
npm install
cp .env.example .env      # then add your ANTHROPIC_API_KEY
npm run dev
```

- Web: http://localhost:5173
- API: http://localhost:8787 (`/api/health`, `/api/dosh`)

`npm run dev` runs the Vite client and the Express/Anthropic server together. Without a key the UI still loads and Dosh tells you it isn’t connected. `FAL_KEY` is optional and only powers generative card art.

Try: *“get me paid by a US client”*, *“send ₦40k to Mum”*, *“a client overpaid and wants a refund to a different account.”*

---

## Repo structure

```
app/                 React + Vite prototype
  src/
    tabs/            Activity, Dosh, Money
    dosh/            chat client + generative cards
    components/      StatusBar, TabBar, Header, shared UI
    theme.ts         design tokens (navy / paper / electric lime)
  server/            Express API + the Dosh system prompt (server/dosh.ts)
concept/             product thinking (start with the-entity.md)
visual-reference/    source screens the aesthetic was grounded in
```

## Tech

React 19 · Vite · TypeScript · Express · Anthropic Claude (`@anthropic-ai/sdk`, model configurable via `DOSH_MODEL`) · optional fal.ai for card art.

## Design notes

- [`concept/the-entity.md`](concept/the-entity.md) — the reframing and trust architecture
- [`concept/users-and-jobs.md`](concept/users-and-jobs.md) — who this is for and their real jobs
- [`concept/design-system.md`](concept/design-system.md) — tokens, type, and components
- [`concept/design-three-tabs.md`](concept/design-three-tabs.md) — why three tabs
- [`concept/design-dosh-ui.md`](concept/design-dosh-ui.md) — Dosh as generative UI

---

*Prototype — a concept to react to and shape, not a shipping spec.*
