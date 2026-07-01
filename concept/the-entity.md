# OneDosh — The Entity (v0.1 proposal)

> Reframing OneDosh from *a fintech app with an agent inside it* to *an agent that happens to have a bank behind it.* The agent is the infrastructure **and** the relationship layer — not a feature.

---

## 1. The core user (grounded)

**Primary:** The Nigerian who earns in dollars — freelancers, remote workers, global professionals working with foreign (esp. US) clients.
**Secondary:** Diaspora senders and the families who receive from them, on the US↔Nigeria corridor.

They are not crypto natives. They are people trying to get paid, protect what they earned, spend it, and not get burned.

## 2. Their real jobs (from research, 2026)

**A. Get money in, and keep its value**
- PayPal can't receive in Nigeria ("send-only"); Stripe won't onboard NG entities. Getting paid is a maze.
- Naira: ~30% inflation, repeated devaluation. Holding USD is survival.
- **CBN Naira-only remittance policy (May 1, 2026):** remittances now pay out in naira only, at official rate. Fear: a multi-day naira slide erases value before you touch it. → Stablecoins become the only way to receive-and-hold value in dollars on your own terms. This is OneDosh's structural tailwind.

**B. Don't get burned ("keep it safe")**
- **Freezes:** textbook trigger is "no history + sudden large credit" = a freelancer's first big payment. The system punishes your best day.
- **Silent fee-draining:** documented cases of USD cards bled dry by maintenance fees; NGN auto-converted without consent to cover charges.
- **Fraud/scams:** fake platforms, overpayment scams, brutal 72-hour fraud-report window.

## 3. Why the standard fintech shape fails them

The decade-standard shape (wallet + card + Send/Add + transaction list) is a **passive toolbox**. It gives you rails and buttons, then leaves *you* to time FX, dodge freezes, catch silent fees, and smell scams. For this user, **the passivity is the pain.** Nobody watches your back between sessions.

## 4. The entity — "Dosh" (working name)

**One-line:** A friend who knows how to move your money and keep it safe.

**North Star metric:** Dollars earned that (a) arrive, (b) hold their value, and (c) are never lost to freeze, fee, or fraud. (Proxy: activation = first successful receive; retention = value preserved vs. naive naira payout.)

### Personality
Not a peppy mascot, not a corporate assistant. A **calm, savvy older-sibling energy**: has done this before, reads the fine print, watches the naira, tells you the truth including when the truth is "don't." Plain-spoken, code-switches to how *you* talk (Nigerian English/pidgin register where natural). Protective without being preachy. Earns trust by being *right* and *transparent*, never by hype.

### Two hats (the vision, made concrete)
1. **Relationship layer (the friend):** persistent, consented memory of you — your clients, your goals, your risk comfort. Proactive: it initiates. Protective: it watches between sessions.
2. **Infrastructure layer (moves money):** executes across every rail — US virtual account (ACH), Naira account, stablecoin networks, card, convert — and *chooses the right one for you* so you never pick a chain blind.

## 5. What it does — mapped to the real jobs

| Real problem | What a passive app does | What the entity does |
|---|---|---|
| Can't get paid (PayPal dead end) | Buries a "create US account" flow 3 taps deep | Provisions your US account, generates the exact "pay me here" details/message for your client, then **watches for the payment and confirms arrival** |
| First big payment triggers a freeze | Freezes you, notifies in 5 days | Knows this pattern is a freeze risk; because OneDosh owns the rails, treats it as *expected income*; warns you before you do anything that looks fraudulent |
| Naira devaluation + forced naira conversion | Leaves timing to you | **Holds value in USDC by default**; watches the rate; tells you *when* to convert or converts on rules you set ("keep 80% in dollars") |
| Silent fee-draining / idle card | Quietly deducts, maybe converts without consent | **Never moves money silently**; sweeps idle card balances *before* a fee hits; every deduction is announced first |
| Scams / fraud | Processes the transfer, sorry for your loss | Vets suspicious requests ("this 'overpayment refund' is a classic scam"); enforces the 72-hour rule; flags anomalies |
| Rail/network complexity ("wrong network = loss of funds") | Makes you choose a chain from a scary list | You state intent; it picks USDC-on-Base vs ACH vs Naira and abstracts the risk |

## 6. How it reshapes the app

- **Home becomes a relationship surface, not a dashboard.** Balance is present, but the primary surface is *what Dosh is doing, watching, and suggesting* — a living feed of protection and next-best-actions, not a static transaction list + "Do more" cards.
- **Onboarding → first action is the entity's opening act.** Post-IDv, Dosh greets you already knowing (from KYC) you're a freelancer, and drives you to your first *receive* in a few taps — no empty state, no dead-end ₦0.00 screen.
- **It's ambient.** Between sessions it works: "Your client usually pays around now." "Naira dropped 4% today — good day to hold." "$3 idle on your card — sweep it before Friday's fee?"

## 7. Trust architecture (non-negotiable for money + a "friend")

1. **Confirm before money moves.** The entity *prepares and proposes*; you approve. Especially given the fraud/freeze reality.
2. **Radical transparency.** Always shows the rail, the rate, the fee, and its reasoning. The anti-Chipper: nothing silent, ever.
3. **Suggests, doesn't advise (compliance).** It can surface options and risks; it does not give regulated financial advice. Clear boundary.
4. **Consented memory.** You can see and delete what it knows.

## 8. Why now / why this wins

Every fintech of the last decade is a **tool you operate.** For a dollar-earning Nigerian in 2026 — squeezed by devaluation, a naira-only remittance mandate, freeze-happy banks, and fee-draining apps — a passive tool is the problem, not the product. An entity that is **proactive, protective, and executes across rails** inverts the model: the app works *for* you, between sessions, with your back covered. That is the 10x, and OneDosh's stablecoin rails + owned corridor are exactly what make it buildable.

---
*v0.1 — a proposal to react to and shape, not a spec.*
