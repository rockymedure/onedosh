# OneDosh — Agentic Foundation (architecture sketch)

> Agentic = sense → decide → act over a relationship-first money graph. **Agent is primary; UI is secondary** — surfaces appear on demand, not as a permanent dashboard.

---

## Agent-primary, UI-secondary

**Principle:** The product is not a wallet app with a chatbot. It is a **money agent** that renders UI only when the user must see, copy, or confirm something. Persistent chrome (tabs, carousels, empty states) is minimized or deferred.

| Agent handles | UI handles (when necessary) |
|---|---|
| What to do next | KYC / identity (Sumsub — regulatory) |
| Which rail to use | PIN / biometrics |
| Drafting payment instructions | **Confirm** before money moves (amount, rate, fee, recipient) |
| Watching for inflows | Display credentials (account #, routing — copy affordances) |
| Warnings (scam, freeze, fees) | Receipt / transaction status |
| Proactive push between sessions | Settings, legal, support escalation |

**What we can delete or defer:** multi-tab nav on day one, wallet carousel, "Do more" feature grid, manual network picker, empty transaction lists, Send-as-primary on ₦0 balance.

**Home = agent surface:** a living thread of messages + inline action cards (not a dashboard). Chat is one rendering of the agent; proactive cards and push are others.

---

## Stack

```
SURFACES          Home = living feed (proposals + protection status)
                  Push between sessions · inline confirm UI · optional chat

ACTION            prepare → propose → CONFIRM → execute → verify
                  Idempotent · reversible where possible

DECISION          Signals + graph state → ranked Intents
                  Rules-first · confidence + explanation + confirm level

SENSING           Inflow landed · idle balance · fee window · FX move
                  Freeze-risk · scam pattern · recurring due · payout predicted

MONEY GRAPH       Nodes: you · counterparties · goals · instruments
                  Edges: flows with purpose, cadence, obligation

RAILS             USD/NGN/USDC wallets · ACH · Naira virtual · chains
                  Visa · FX · payouts · KYC/AML · MMO license
```

---

## Segmentation (dynamic, not signup dropdown)

Inferred from: KYC purpose, first inflow source, amounts, cadence, recipient graph.

**Beachhead segment:** Young earner in Nigeria — receives from platforms/gigs worldwide, may send to family, spends on card.

---

## First-run vs returning home

**Problem:** Same home for ₦0 new user and power user → paralysis (~16 choices).

**Fix:** First-run collapses to one question + one action; full dashboard is **graduated into** after first receive or explicit "explore."

---

## Intent lifecycle (every money action)

`prepare → propose → user confirms → execute → verify`

Nothing moves silently. Anti-Chipper. Compliance boundary: suggest, don't advise.

---

## Future offerings (enabled by graph + loop)

- Auto-hold / auto-convert rules
- Standing support to family (with confirm)
- Purpose-tagged sends (school fees direct pay)
- Creator income splitting
- Freeze shielding · scam detection · idle sweeps
- Advances against predictable inflow (later)

---

*v0.1 — architecture sketch*
