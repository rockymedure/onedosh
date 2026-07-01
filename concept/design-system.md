# OneDosh — Design System (from reference screens)

> Extracted from `visual-reference/screens/`. Build new Activity · Dosh · Money tabs **on top of** these patterns — don't invent a second visual language.

---

## Brand

| Token | Value | Source |
|---|---|---|
| Logo | Stylized **D** in circle, yellow-gold accent on navy | Splash, cards |
| Wordmark | **OneDosh** — clean sans | Splash, headers |
| Tagline | *OneDosh. One Click.* | Splash |
| Tag / ID | **@username** — "OneDosh ID" in app, "OneDosh Tag" on web | Home header, send-receive page |

---

## Color

| Role | Approx | Usage |
|---|---|---|
| **Primary / CTA** | Dark navy `#1B2B4B` (est.) | Send, Continue, Copy account details, Verify Identity, Get Started |
| **Background** | White `#FFFFFF` | Screen base |
| **Chrome / canvas** | Light gray `#F5F5F7` (est.) | Behind cards, sheets |
| **Card surface** | White | Wallet card, list rows, sheets |
| **Secondary button** | Light gray fill + dark text | Add, Share PDF, Maybe Later |
| **Disabled CTA** | Medium gray | Continue at ₦0 |
| **Accent lime** | Pale yellow-green `#E8F5A0` (est.) | Promo cards (Open Wallet, Verify), feature highlights |
| **Accent gold** | Yellow-gold | Logo ring, card art |
| **Success / credit** | Green | + amounts in marketing mock |
| **Notification** | Red dot on bell | Unread |
| **Link / info** | Blue | Support links in KYC copy |

**Rule:** One primary navy per screen. Lime/gold for marketing moments only — not money confirms.

---

## Typography

- **Family:** SF Pro (iOS system sans) — no custom display font in app
- **Screen title:** Bold ~22–28px, left-aligned with back chevron
- **Section label:** Gray ~13px ("Do more with OneDosh", "All Transactions")
- **Balance:** Bold ~32–40px, tabular nums
- **Body:** Regular ~15–17px gray for secondary
- **Button label:** Semibold ~15–17px, white on navy
- **@tag:** Semibold, inline with copy icon

---

## Radius & spacing

| Element | Radius |
|---|---|
| Primary buttons | Full pill (~999px) |
| Cards (wallet, promo) | ~16–20px |
| Bottom sheets | ~20px top corners only |
| Input / account detail block | ~12–16px |
| Avatar | Circle |
| Action chips (our addition) | ~12px |

**Padding:** 16px horizontal screen gutter; 16–20px card internal padding.

---

## Components (inventory → reuse)

### Global header (all tabs)
From home mock:
- Left: optional back OR tab title
- Right: **Help (headset)** + **Bell** + **Avatar** → Profile
- Profile moves here globally; remove Profile from bottom nav

### Wallet card
- Flag + wallet name + masked digits
- Balance + eye toggle
- Row: **Send** (navy) · **Add** (gray) · **⋮**
- Pagination dots for multi-wallet
- **Move to Money tab**; demote Send as primary when $0

### Bottom sheet
From Add funds, Get virtual account, Welcome verify:
- Title + X close
- Icon in circle (bank, verified badge)
- List rows: icon + title + subtitle + chevron
- Primary CTA full-width at bottom

### List row (settings, add funds, profile)
- 40px icon circle, light gray fill
- Title + optional subtitle
- Chevron or toggle

### Virtual account card
- Gray inner card with label/value rows
- Copy icon per row
- Navy **Copy account details** + outlined **Share PDF**

### Amount entry (send / convert)
- Large centered amount
- Wallet pill (flag + NG Wallet)
- Max link (blue text)
- Full numpad
- Gray disabled Continue → navy when valid

### Promo / feature card
- Lime background OR photo + overlay
- Bold title + gray subtitle + CTA

### Bottom nav (evolve)
Current: Home · Activity · **+** · Cards · Profile  
New: **Activity · Dosh · Money** — center tab = Dosh mark (filled when active)

### Profile menu
- Grouped list: Account, Security, Help, Settings, About, Logout
- Access via avatar (header) or Money tab footer link

---

## Motion & “alive network” (new — Activity tab)

Signals that the network is active (not a dead ledger):

| Signal | Treatment |
|---|---|
| **Live pulse** | Green dot on avatars with pending/active flow |
| **Relative time** | "2m ago", "Just now", "Expected Friday" |
| **Presence strip** | Horizontal avatar scroll: "Active now" / recent payers |
| **Activity count** | Subtle badge on Activity tab when new |
| **Social proof** | "@sarah and 3 others on OneDosh nearby" (campus) |
| **Typing / in-flight** | "Payment incoming…" with shimmer on row |

Use existing green for credits; avoid new colors. Subtle motion only — no casino.

---

## Sheet vs push vs inline

| Pattern | When |
|---|---|
| **Inline card in Dosh feed** | Receive setup, confirm convert |
| **Bottom sheet** | Pick send recipient, add-funds options |
| **Full screen push** | Send numpad, convert, KYC, virtual account detail |
| **Modal interrupt** | Scam, permissions |

---

## Build approach

1. **Tokenize** navy, grays, lime accent, radii — map to existing app theme if codebase exists
2. **Compose new tabs from existing components** — don't fork Button/Card
3. **Activity** = new `PersonRow`, `FlowRow`, `TagShareCard` using list row + avatar patterns
4. **Dosh** = new `DoshBubble`, `ActionChip` + existing sheets
5. **Money** = relocate WalletCard + Cards screen + Discover grid unchanged
6. **Delete** center + nav item, Home tab label, Profile tab — avatar → header

---

*v0.1 — from visual reference*
