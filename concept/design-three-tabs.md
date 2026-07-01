# Three-tab shell — Activity · Dosh · Money

> Replaces the current 5-tab nav (Home, Activity, center +, Cards, Profile). **Dosh is center.** Human-led, AI-accelerated. Social money graph on the left; balances and discover on the right.

---

## Why three tabs

| Current (5 tabs) | Problem | New tab |
|---|---|---|
| Home | Dashboard paralysis at ₦0 | **Money** (when you're ready) + **Dosh** (first-run) |
| Activity | Transaction list only — not social | **Activity** (people + flows) |
| Center + | Mystery action | **Dosh** (character + send/receive) |
| Cards | Siloed | Folded into **Money** |
| Profile | Siloed | Settings from any tab / Money header |

---

## Tab 1 — Activity (social)

**Job:** *Who am I moving money with — and who might I?*

This is the **relational layer** — not a transaction ledger. Centered on **OneDosh Tag** (`@username`), the handle you share instead of bank numbers (per onedosh.com/send-receive: "Share Your OneDosh Tag or Invoice").

### Sections (top → bottom)

**Active flows**
- People you're currently sending to or receiving from
- Status inline: pending, landed, recurring
- Example rows:
  - `@mike_edits` · sent you $350 · landed today
  - Mum · you send ₦40k · monthly · next due in 3 days
  - YouTube AdSense · payout expected ~Apr 28

**Recent**
- Chronological social feed — who, what, when, purpose if tagged
- Not "All Transactions" empty state — show *people* even before money moves

**Connect**
- Find / invite by tag
- Suggestions: contacts, campus (ambassador graph), "people who pay creators like you"
- Share your tag card: `@tobi` + QR + copy

**Groups / purpose** (later)
- Pool for wedding, school fees pot, creator collab split

### Design notes
- Avatar + **@tag** as primary identity (already in home mock header)
- Tap a person → their thread (history with them + quick send/receive)
- Feels closer to Cash App / Venmo social graph than a bank statement
- Receivers without the app appear as "invite to OneDosh" with tag reserved

---

## Tab 2 — Dosh (center, default)

**Job:** *Your money guy — get paid, send money, stay safe. Human-led, AI-accelerated.*

Always has **Send** and **Receive** one tap away. Dosh is the character; the feed is the home surface.

### Persistent chrome
```
┌─────────────────────────────────────┐
│  [Dosh mark]  Dosh                  │
├─────────────────────────────────────┤
│  FEED (scroll)                      │
│  messages · inline cards · status   │
├─────────────────────────────────────┤
│  [ Receive ]    [ Send ]            │  ← always visible, equal weight
│  Ask Dosh anything…           [↑]   │
└─────────────────────────────────────┘
```

### Human-led
- User taps Receive / Send / chips — no typing required
- User confirms every money move
- User can ignore Dosh and use quick actions only

### AI-accelerated
- Dosh proposes: pay-in details, payday plan, convert timing, scam warnings
- Dosh watches between sessions (push)
- Dosh picks rails (no network picker by default)
- Composer for edge cases: "how do I set up YouTube?"

### First-run lands here (not Money)
Post-IDV: Dosh feed + "Who pays you?" — not empty wallet dashboard.

### Sheets (reuse existing mocks)
- Receive → inline tag share OR virtual account card OR platform setup
- Send → pick person from Activity graph OR enter tag OR bank
- Confirm → existing send/convert sheets

---

## Tab 3 — Money

**Job:** *What's mine, how do I spend it, what else can I do?*

The **asset and discover** surface — calm, glanceable, no social noise.

### Top — Balance
- Swipeable wallets (NG / US / USDC) — from current home mock
- Eye toggle, held-as-USDC note
- Compact when zero; expands when funded

### Middle — Card
- Virtual card preview (from cards mocks)
- Freeze/unfreeze, details, add to Apple Pay
- Card gated states stay here

### Bottom — Discover
- Evolved "Do more with OneDosh" — but only product surfaces, not activation
- Increase limits · View rates · Get physical card · Convert · Cash App fund
- NOT the place for "what do I do first" — that's Dosh

### When balance is zero
- Still useful: card setup preview, rates, tag share shortcut
- Gentle link: "Get your first payment in →" jumps to **Dosh** tab

---

## Cross-tab flows

| Intent | Start | Finish |
|---|---|---|
| First receive | Dosh | Activity adds `@client` when paid |
| Send to Mum | Dosh Send OR Activity tap Mum | Money balance updates |
| Check balance | Money | — |
| See who paid me | Activity | Tap → Dosh thread detail |
| Share my tag | Activity Connect OR Dosh Receive | Copy `@tag` |
| Scam warning | Dosh interrupt | — |
| Get a card | Money discover | Card in Money |

---

## OneDosh Tag — naming

Website: **OneDosh Tag**  
App mock: **OneDosh ID** `@rockymedure`

Recommend unifying to **Dosh Tag** or **@tag** in UI copy — shorter, matches the character, matches "Have you been doshed?"

---

## Nav visual

```
   Activity          Dosh           Money
   (people)      (character)      (wallet)
      ○              ●               ○
```

Center tab visually distinct (filled Dosh mark, not generic +).

---

## Open questions

1. Default tab after IDV: **Dosh** (recommended) or Activity?
2. Activity before first transaction: show Connect + share tag, or empty with CTA to Dosh?
3. **Profile:** Avatar top-right all tabs → 07-profile push. Optional link on Money discover.

---

*v0.1 — three-tab architecture*
