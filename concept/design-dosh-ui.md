# Dosh — UI Design Direction

> **Dosh is the character. UI is secondary.** Taps do the work; Dosh communicates when it adds value. Reuse OneDosh's existing visual language and screens as **sheets and inline cards**, not as a permanent dashboard.

---

## Design principle

| Layer | Role |
|---|---|
| **Dosh (feed + voice)** | Context, guidance, proactivity, warnings |
| **Action cards (inline)** | One-tap shortcuts — copy details, confirm, choose path |
| **Existing OneDosh screens (sheets)** | Amount entry, convert pad, virtual account full view |
| **System** | KYC, PIN, biometrics |

**Rule:** If the user can complete it in **one tap**, don't make them type. If they need to **see numbers or confirm money**, show UI. If they're **confused or edge-case**, Dosh talks.

---

## Reuse from current mocks (don't redesign these)

Pull these in as **full-screen sheets** or **embedded cards** when Dosh routes there:

| Mock | Use as |
|---|---|
| `04-add-funds/03-virtual-account-usd-ach` | Receive — US pay-in details |
| `04-add-funds/04-virtual-account-naira` | Receive — Naira pay-in |
| `04-add-funds/01-add-funds-options` | Only when user explicitly adds via Cash App / stablecoin |
| `04-add-funds/05-convert-to-usdc` | Convert — after Dosh proposes amount |
| `05-send/02-send-to-bank-account` | Send — amount + remarks |
| `05-send/01-select-network` | **Hide from default path** — Dosh picks rail; show only on "Advanced" |
| Bottom sheet pattern (`04-add-funds/01`) | Any "pick one of three" moment |

**Retire as default home:** `03-home-wallet/01` (empty dashboard), "Do more with OneDosh" carousel, 5-tab nav on day zero.

---

## OneDosh visual language (keep)

From reference mocks:

- **Background:** white / `#F5F5F7` light gray
- **Primary CTA:** dark navy filled pill (`Send`, `Copy account details`, `Continue`)
- **Secondary:** light gray fill, dark text (`Add`, `Share PDF`)
- **Cards:** white, ~16–20px radius, subtle border or shadow
- **Sheets:** white, top-rounded, slide up from bottom
- **Type:** clean sans (SF Pro on iOS), bold titles, gray secondary
- **Icons:** line icons in circles for list rows (bank, coin, etc.)
- **Inputs:** large amount display + numpad for money entry
- **Copy affordance:** duplicate icon on every copyable field

Dosh adds **one new element:** a persistent **Dosh mark** (avatar) on messages — not a cartoon mascot; a simple monogram or abstract mark in brand navy.

---

## App shell (three tabs)

See **`design-three-tabs.md`** for full architecture.

| Tab | Role |
|---|---|
| **Activity** | Social — who you send/receive with, OneDosh Tag (`@username`), connect |
| **Dosh** (center, default) | Character feed + always-on Receive / Send — human-led, AI-accelerated |
| **Money** | Balances, card, discover |

First-run lands on **Dosh**, not Money.

### Dosh tab layout (center)

```
┌──────────────────────────────────────┐
│  [Dosh mark]  Dosh                   │
├──────────────────────────────────────┤
│  FEED — messages, cards, status      │
├──────────────────────────────────────┤
│  [ Receive ]      [ Send ]           │  ← always, equal weight
│  Ask Dosh anything…            [↑]   │
└──────────────────────────────────────┘
     Activity          Dosh           Money
```

Convert and other actions live in **Money** discover or Dosh proposes them inline.

---

## Component catalog

### 1. Dosh message
- Left-aligned bubble, light gray background
- Dosh mark + short copy (2–3 lines max)
- Optional timestamp, no read receipts gimmick

### 2. Action chips
- Stacked or horizontal pills
- One tap → next step (no send button on chip itself)

### 3. Inline action card
Embeds existing patterns without leaving feed:

**Receive card** (from virtual account mock):
- Account holder, bank, number + copy icons
- Primary: "Copy all" · Secondary: "Share"
- Dosh line above: *"Send this to your client."*

**Confirm card** (convert / send):
- Amount, rate, fee, recipient
- Primary: "Confirm" · Secondary: "Change"

**Status card:**
- Pending / complete with amount
- No action needed — informational

### 4. Quick action bar (persistent)
Three icons max, always visible:
- **Receive** → Dosh asks who pays OR shows last pay-in card
- **Send** → sheet: send to bank / OneDosh user / etc.
- **Convert** → sheet: convert pad (mock 05)

Long-press or "More" for card, settings, activity.

### 5. Composer
- Placeholder: "Ask Dosh anything..."
- Used when: user is stuck, complex question, support
- **Not** the default way to send money

### 6. Interrupt (Dosh speaks loud)
Full-width banner or modal — scams, freeze warnings, policy:
- Cannot dismiss without choosing an option
- Plain language, not legal text

---

## When Dosh talks vs when UI takes over

| Moment | Dosh | UI |
|---|---|---|
| Post-IDV | "Who pays you?" | Chips |
| Setup receive | "Here's your US account — send this to them" | Inline account card |
| Waiting for payment | Push + feed: "On the way" | None |
| Payment landed | "Landed. Hold, spend, convert, or send home?" | Chips |
| Send ₦ to Mum | "Same as last month — ₦40k?" | Confirm card → send sheet if edit |
| Convert | "Need naira? $50 → ₦71,200 today" | Confirm → convert sheet |
| Scam | "Don't send that. Here's why." | Interrupt |
| User asks "how does YouTube work?" | Reply in thread | Optional link to steps |
| Amount entry | — | Full send/convert screen (mock) |
| KYC | — | Sumsub (unchanged) |

---

## Graduation (unlock full app)

After **first successful receive**, optionally reveal:
- Wallet swipe (NG / US) — from current home mock
- Activity tab
- Cards tab

Dosh feed **stays** as home; dashboard becomes secondary ("Accounts" from balance strip).

---

## Dosh voice (UI copy)

- Short. Plain. Nigerian English OK.
- No "stablecoin settlement layer."
- Examples:
  - ✅ "Your money's on the way — $350 from Mike."
  - ✅ "Naira dropped this week. Good week to hold dollars."
  - ✅ "That refund request looks off. Want me to hold 24 hours?"
  - ❌ "Please select your preferred funding rail."

---

## Screens to design next

1. **Post-IDV first-run** (feed only) — highest priority
2. **Inline receive card** (USD ACH)
3. **Payday feed** (landed + chips)
4. **Confirm send/convert card**
5. **Scam interrupt**
6. **Graduated home** (feed + balance strip + optional wallet peek)

---

*v0.1 — design direction*
