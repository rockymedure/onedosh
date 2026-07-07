# Journey — From IDV to first-run: Cold Start vs. Rich State

> The moment identity verification finishes is the make-or-break of the whole product. Today it dumps you on a ₦0.00 dashboard with 16 buttons and no direction. This doc shows the **same surface in two states** — a **Cold Start** (you have *nothing* but a verified identity) and a **Rich State** (friends, money, history, memory) — to demonstrate one thing to the OneDosh team:
>
> **Dosh turns an empty account into forward progress.** An agent that already knows who you are can carry you from zero to your first real move — receiving or sending — without a single dead-end screen. And when the account fills up, the *same* agent gets more useful, not more cluttered.

See also: [`the-entity.md`](../the-entity.md) (why an agent, not a toolbox), [`design-dosh-ui.md`](../design-dosh-ui.md) (card + chip vocabulary), [`receiver-young-earner.md`](./receiver-young-earner.md) (the receive path in depth).

---

## Cast

**Tobi Adeyemi** · `@tobi` · 19 · Lagos. Edits video for US clients, small YouTube channel, freelance design. Not crypto-native. Just finished KYC. This is the persona the app is anchored on (see [`users-and-jobs.md`](../users-and-jobs.md)).

We follow Tobi through two versions of the same person:

- **State A — Cold Start:** Day zero. Verified, and *that's it.* ₦0 / $0, no contacts, no history, no squads, no card.
- **State B — Rich State:** The same Tobi ~3 months later. $350 landing from a client, ₦40k/month to Mum, a YouTube payout on the calendar, three squads, a live feed of friends moving money.

---

## The shared spine — everything before first-run

Both states walk the same identity path first. This part is unchanged; it's the OneDosh flow that already exists.

| Step | Screen (visual-reference) | What Tobi does |
|---|---|---|
| Sign up | `01-onboarding/01–02` | Get Started, accept OneDosh + Bridge agreements |
| Country | `01-onboarding/03–04` | Choose country (Nigeria) |
| Email OTP | `01-onboarding/05–06` | Verify email with a 6-digit code |
| PIN | `01-onboarding/07` | Set a 6-digit PIN |
| Biometrics | `01-onboarding/08–09` | Enable Face ID + notifications |
| Verify identity | `02-kyc/01–02` | Residency selection (US vs. rest) |
| PII | `02-kyc/03` | Name, DOB, SSN if US-facing (Sumsub) |
| Review | `02-kyc/04–05` | "Data accepted" → ~2 min under review |
| Phone | `02-kyc/06–07` | Verify phone number |
| Source of funds | `02-kyc/08` | Occupation + source-of-funds questionnaire |
| **Done** | `02-kyc/09` | "Your data has been accepted." |

### The handoff moment (the whole thesis in one beat)

The instant KYC clears, Dosh already holds a small, consented dossier — **not from surveillance, from the form Tobi just filled in:**

- **Name:** Tobi Adeyemi → `@tobi`
- **Occupation / source of funds:** freelance creative, paid from abroad → *this is a Receiver.*
- **Country / residency:** Nigeria → naira-side, US-corridor relevant
- **Rails provisioned:** USD virtual account (ACH) + Naira account + USDC wallet, all live and empty
- **Nothing else.** No contacts, no balance, no history.

> **Today:** this moment routes to `03-home-wallet/01` — ₦0.00, empty transaction list, "Send" highlighted, "Do more with OneDosh" carousel. The most important moment in the funnel is the emptiest screen in the app.
>
> **With Dosh:** this moment routes to the **Dosh feed** (see [`design-three-tabs.md`](../design-three-tabs.md)), and Dosh opens the conversation already knowing Tobi is here to get paid.

---

## STATE A — Cold Start (Day Zero)

**Everything is zero except identity.** No money, no friends, no card, no history. This is the hardest state to design for and the one that decides whether Tobi ever comes back. In a passive app, an empty account is an empty room. With an agent, an empty account is **a fresh conversation with someone who already knows why you're here.**

### A1 · First screen isn't a dashboard — it's Dosh

No ₦0.00 hero. No 16 buttons. The feed opens with one warm, oriented message and a *tiny* set of choices.

```
[Dosh]  You're verified, Tobi — your dollar and naira
        accounts are open and ready. I set them up.
        What brings you in first?

        [ Get paid ]   [ Send money ]   [ Just looking ]
```

- **One decision, not sixteen.** The chips are generated from what Dosh knows (a Receiver, Nigeria-side). "Get paid" is listed first *because the KYC form said freelancer.*
- **No empty balance shame.** The $0 exists in Money, but it is not the headline. The headline is *what do you want to do*, which an empty account can still answer.

### A2 · The cold-start receive (the wedge move)

Tobi taps **Get paid.** Dosh doesn't dump a rail picker; it asks the human question.

```
[Dosh]  Who's paying you this time?
        [ A client abroad ]  [ A platform (YouTube, TikTok) ]
        [ A friend / family ]

Tobi → A client abroad

[Dosh]  Got it. Here's your US account — send these
        details to your client and the money lands right
        here. I'll watch for it.

        ┌─ receive_usd ──────────────────────────┐
        │  Account holder   Tobi Adeyemi          │
        │  Bank             Lead Bank             │
        │  Account number   ••••  [copy]          │
        │  Routing          ••••  [copy]          │
        │  [ Copy all ]        [ Share ]          │
        └─────────────────────────────────────────┘

        Want me to write the message for you?
        [ Yes, draft it ]   [ I've got it ]

Tobi → Yes, draft it

[Dosh]  Paste this to your client:
        "Hi — here's where to pay me: [details].
        US bank transfer (ACH), my name on the account.
        Thanks!"     [ Copy message ]   [ Open WhatsApp ]
```

**What just happened from zero:**
- The agent generated the *right* card (`receive_usd`) for Tobi's exact situation — not a generic "Add funds" menu (`04-add-funds/01`), the specific ACH account view (`04-add-funds/03`), inline, with the paste-ready client message.
- Tobi never chose a "network," never saw a chain list, never learned the word "stablecoin." Dosh picked the rail (see [`the-entity.md`](../the-entity.md) §5).
- Tobi's first action produced a *shareable artifact he can send a client* — real forward progress on a $0 account.

### A3 · The cold-start wait (turning anxiety into confidence)

The dangerous gap in the old flow: money sent, nothing on screen, Tobi refreshes the app 12 times. Dosh fills it.

```
[Dosh]  status · Watching for your client's payment
        I'll ping you the second it lands. First transfers
        can take a day or two to clear — totally normal.
```

- A `status` card holds the space. Between sessions Dosh watches (ambient — [`the-entity.md`](../the-entity.md) §6).
- **Freeze shield, silent + critical for cold start:** a first large credit into a no-history account is the textbook freeze trigger. Because OneDosh owns the rails, Dosh pre-marks this as *expected income*, so Tobi's best day doesn't become a frozen account.

### A4 · The first dollar lands (the activation win)

```
[Dosh]  It landed. $350 from your client just hit your
        US account. 🎉  Nice — that's real.

        Want to do anything with it, or let it sit in
        dollars for now?
        [ Hold in dollars ]  [ Send some home ]  [ Convert to ₦ ]
```

- **Activation = first successful receive.** From a standing start, Dosh drove Tobi to it with zero jargon and zero dead ends.
- The next-step chips are *offered, not forced.* Hold is a legitimate first-class choice (naira is falling — holding USD is the value-preserving move).

### A5 · The cold-start *send* (the other entry door)

If Tobi had tapped **Send money** at A1 instead — with a ₦0 balance — the agent's job is to make an empty wallet honest and still useful:

```
Tobi → Send money

[Dosh]  Happy to. Quick heads-up: your balance is ₦0 / $0
        right now, so we'll need to fund first. Two fast ways:

        [ Get paid first ]   [ Add money via Cash App ]

        Who were you trying to send to? I'll set it up so
        it's ready the moment you have funds.
```

- Dosh doesn't let Tobi walk into a failed transfer. It **names the constraint plainly** and converts a dead end into a queued intent ("ready the moment you have funds").
- For a diaspora *Provider* persona (see [`users-and-jobs.md`](../users-and-jobs.md) §2), the same beat routes to Cash App funding → recipient → confirm, again with Dosh picking the rail and showing rate/fee up front.

### A6 · Cold-start protection (trust from move one)

Even on day zero, the guardrail is live. If Tobi's brand-new account gets an "overpayment, please refund the difference to a different account" request:

```
[Dosh]  interrupt · Hold on — don't send that.
        "Overpaid, refund the difference" is a classic
        scam, and it's aimed at new accounts like yours.
        Let's verify before anything moves.
        [ Show me why ]     [ Pause 24 hours ]
```

- A full-width `scam_warning` / interrupt that can't be dismissed by reflex. Confirm-before-move is non-negotiable ([`the-entity.md`](../the-entity.md) §7).

### Cold-start summary

At the end of day zero, from *literally nothing but a verified identity*, Tobi has: a US account he understands, a message sent to a client, a dollar balance that arrived without a freeze, and a first taste of Dosh having his back. **No empty dashboard was ever shown.**

---

## STATE B — Rich State (Established, ~3 months in)

Same person, same surfaces — now *full.* The test of the design: does the agent stay legible when there's a lot going on, and does it get *more* proactive without getting noisy? (This is the state the working prototype ships with — see `app/src/data.ts` and `app/src/social.ts`.)

**What Tobi now has:**
- **Money:** $350 USD balance, holding; naira converted on his rules. Rate context: ~₦1,418 / $1.
- **Relationships (the graph):** `@mike_edits` (US client, pays for editing), **Mum** (₦40k/month, Enugu, school fees), **YouTube AdSense** (~quarterly). Plus friends: `@ada`, `@kelvin`, `@zara`, `@deji`, and more — active now.
- **Squads:** Lead City Squad (weekly ajo, his week next), Studio Rent (monthly split), Detty December (trip fund).
- **Memory:** consented, editable — his clients, his cadences, his risk comfort.
- **History:** repeat receives, so pay-in details and preferences are remembered.

### B1 · First screen is a living relationship surface

No cold-start orientation message. The feed opens mid-relationship, already *doing* things.

```
[Dosh]  Morning, Tobi. Three things worth a look:

        • Mike's $350 is on the way — I'll confirm when it lands.
        • Mum's usual ₦40k is due in 3 days. Send now or wait?
        • Naira slipped ~2% this week. Good week to keep dollars.

        [ Confirm now ]  [ +6 friends active → Activity ]
```

- The **Activity** tab is alive (who's paying you, who's active — `@mike`, `@ada`, `@kelvin`, `@zara`, +6). The empty account's "Just looking" chip is gone; there's real social gravity.
- Balance is *present* but still not the whole screen — the surface is *what Dosh is doing and watching* ([`the-entity.md`](../the-entity.md) §6).

### B2 · Repeat receive — memory makes it one tap

```
[Dosh]  Mike's paying you again — same as last month?
        I've still got your US account details ready to resend.
        [ Resend details to Mike ]   [ New payer ]
```

- Contrast with A2: no "who's paying you?" from scratch. The graph *remembers Mike.* Setup friction drops every time (see [`receiver-young-earner.md`](./receiver-young-earner.md) Stage 7).

### B3 · Repeat send — proposed, not composed

```
[Dosh]  Mum, ₦40,000, like every month?
        Rate today ₦1,418/$ · fee shown · lands in her paga account.

        ┌─ confirm ───────────────────────────────┐
        │  To      Mum (Enugu)                      │
        │  Amount  ₦40,000                          │
        │  Rail    Naira transfer   Fee  ₦XX        │
        │  [ Confirm ]        [ Change ]            │
        └───────────────────────────────────────────┘
```

- Dosh *prepares the whole move* from memory; Tobi taps Confirm. Money still only moves on confirm.

### B4 · Ambient proactivity (the thing a cold account can't have yet)

The rich state unlocks between-session value that only exists once there's history and money:

```
[Dosh]  $3 is idle on your card and there's a maintenance
        fee Friday. Want me to sweep it back to dollars first?
        [ Sweep it ]   [ Leave it ]

[Dosh]  Your Lead City ajo — it's your week to collect
        ₦340k. I can nudge the two who haven't dropped yet.
        [ Nudge them ]   [ I'll wait ]
```

- Idle-balance sweeps, FX timing, squad cadences, payout predictions — proactivity that *compounds with data.* This is the payoff of retention: the agent's usefulness grows with the graph.

### B5 · Protection, now graph-aware

Same guardrail as A6, but smarter with context:

```
[Dosh]  interrupt · This refund request is going to a
        new account — not Mike's usual one. That pattern is
        how overpayment scams work. Want me to hold + verify?
        [ Verify with Mike ]   [ Pause 24 hours ]
```

- In the rich state the agent can say *"not Mike's usual account"* — the memory makes the warning sharper and more trustworthy.

---

## Side-by-side — same surfaces, two states

| Surface | Cold Start (Day Zero) | Rich State (~3 months) |
|---|---|---|
| **Opening feed** | Orientation: "What brings you in?" (3 chips) | Living brief: incoming, due, FX heads-up |
| **Receive** | Asks "who's paying you?" from scratch → generates `receive_usd` + drafts client message | "Mike again? Resend details" (one tap, from memory) |
| **Send** | Names the ₦0 constraint, queues the intent, offers funding | Proposes the recurring move (Mum, ₦40k) → `confirm` |
| **Balance** | $0 — present, not shamed | $350 holding; naira on rules |
| **Relationships** | None → no dead "add friends" prompt | Clients, family, friends, squads — Activity alive |
| **Proactivity** | Reactive + protective (freeze shield, scam guard) | Ambient: sweeps, FX timing, ajo nudges, payout predictions |
| **Protection** | Generic scam interrupt (aimed at new accounts) | Graph-aware ("not Mike's usual account") |
| **Nav** | Dosh feed only; full app graduates after first receive | Three tabs live (Activity · Dosh · Money) |

---

## What this proves to the OneDosh team

1. **The empty state is a feature, not a failure — if an agent owns it.** A passive app's worst screen (₦0.00, no history) becomes Dosh's best moment: a focused, one-decision conversation with someone who already knows why you're here.
2. **Forward progress from zero.** With only a verified identity, Tobi reaches a *shared client message*, a *received dollar*, and a *protected first transaction* — no dead ends, no jargon, no rail-picking.
3. **The same design scales up, not out.** The rich state doesn't add tabs and buttons to keep pace with complexity; it lets the *same* agent get more proactive. Complexity moves into Dosh's judgment, not the user's screen.
4. **Retention is the agent compounding.** Everything that makes the rich state delightful — memory, prediction, ambient sweeps, graph-aware scam catches — is *impossible* on day zero and *inevitable* with data. That's the retention flywheel, made visible.
5. **Trust is constant across both states.** Confirm-before-move, rail/rate/fee shown, nothing silent — identical on day zero and month three. Trust doesn't wait for a rich account.

---

## Success metrics (this journey)

| Metric | Cold Start focus | Rich State focus |
|---|---|---|
| **TTFA** (time to first action) | IDV done → first meaningful tap (receive setup / send intent) | — |
| **TTFR** (time to first receive) | IDV done → first dollar landed, no freeze | — |
| **Dead-end rate** | % of first sessions that hit an empty/failed screen (target: 0) | — |
| **Freeze rate on first credit** | First-receive holds / support tickets | — |
| **Proactive-action acceptance** | — | % of Dosh's ambient suggestions acted on |
| **Value preserved** | — | USD held vs. naive day-one naira payout |
| **Graph depth** | — | Payers + people + squads per active user |

---

## Open design questions

1. When exactly does the full three-tab nav graduate — first receive, or first balance > 0? (See [`design-dosh-ui.md`](../design-dosh-ui.md) "Graduation.")
2. Cold-start send with ₦0: is a queued "ready when funded" intent the right pattern, or does it over-promise?
3. How much of the KYC-derived dossier do we *show* Tobi up front ("I know you're a freelancer") vs. just *use* — where's the line before it feels like surveillance?
4. Default hold currency on first landing — USD/USDC until Tobi opts to convert?
5. How does the rich-state opening brief stay ≤3 items when a heavy user has 10 things Dosh could surface?

---

*v0.1 — first-run journey, cold start vs. rich state. A concept to react to and shape, not a spec.*
