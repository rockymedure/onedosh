# Process log — human judgment, running commentary

> A live record of *how* this prototype is being built, not just *what* changed.
>
> The product thesis is **human-led, AI-accelerated**: Dosh prepares and proposes, the person decides, money only moves on a tap. This log applies the same principle to the work itself — the AI can generate options, reproduce a Figma node, or scaffold a component in seconds, but every entry below is a **human judgment call** about taste, durability, brand, accessibility, and scope. AI is the accelerant; the decisions are mine.
>
> Format per entry: **What changed → The call → Why (and what was rejected)**. Newest at the bottom; appended as we go.

---

### 01 · Cut the "Dosh cooking…" vibe strip
**What changed.** Removed the `VibeStrip` header (avatar + "Dosh / cooking…") from the Dosh tab, including the component definition.

**The call.** Delete it rather than restyle it.

**Why.** It duplicated signal already carried by the app header and the typing indicator, and it ate ~54px of vertical space at the top of the most important screen. The judgment: on a phone-sized canvas, presence should be *felt through behavior* (Dosh replying, cards appearing), not asserted by a persistent "I'm here" banner. Less chrome, more conversation.

---

### 02 · iOS 26 status bar from Figma → inline SVG
**What changed.** Pulled the iOS 26 status bar (Figma node `5465:16807`) and mounted it at the top of the phone frame.

**The call.** Reproduce the icons as **inline SVG** instead of using the image URLs the Figma export handed back, and translate the Tailwind reference into the app's existing **inline-style** convention rather than adding Tailwind.

**Why.** Two durability/consistency judgments. (1) Figma's asset URLs expire in ~7 days — shipping them would mean a broken status bar next week; hand-drawn SVG is permanent and themeable. (2) Introducing Tailwind for one component would fork the styling system. Match the house style; don't let a tool's default output dictate the codebase.

---

### 03 · Hooked up the iOS 26 "Liquid Glass" tab bar
**What changed.** Restyled the tab bar (Figma node `3:70967`) into the floating frosted-glass pill, and made it **float over** the scrolling content (phone frame set to `position: relative`, content given bottom padding).

**The call.** Adopt the iOS 26 form, but **keep our three tabs and existing selection logic untouched**, and swap Apple's blue selection tint for our own brand ink.

**Why.** The reference is a component *set* with 2–5 tabs, search variants, minimized states — most of it irrelevant to us. Judgment was to take the *material and motion language* (glass, floating pill, selection highlight) and reject the parts that don't serve our IA. Floating over content (vs. sitting in a solid bar) is what makes the glass mean something — otherwise it's just a rounded rectangle.

---

### 04 · Icon-only tabs + the real Dosh logo
**What changed.** Removed the tab labels; tabs are now icon-only. The Dosh tab uses the actual uploaded brand logo instead of a typographic "D".

**The call.** Follow the explicit direction (no titles), and when the real logo art arrived, wire it through the shared `DoshMark` component so every usage upgrades at once — while keeping `aria-label`/`title` on each tab.

**Why.** Icon-only is cleaner and more confident for three well-understood destinations, and the real mark carries brand equity a letter can't. The accessibility judgment: dropping *visible* labels must not drop *semantic* labels — screen readers and tooltips still name every tab. Centralizing on `DoshMark` means the logo is defined once, not pasted around.

---

### 05 · Caught and reverted a conflicting edit
**What changed.** Discovered `TabBar.tsx` had been overwritten by a concurrent edit that reinstated text labels and a lime selection pill. Restored the icon-only + logo version.

**The call.** **Surface the conflict to the human and restore the stated preference** — don't silently re-apply and don't silently accept the overwrite.

**Why.** This is the clearest human-judgment moment: two divergent versions existed, and only a person could say which intent wins. The right move was to flag it plainly (so a parallel process could be reconciled) and default to the most recent *explicit* instruction, not to let last-writer-wins decide design.

---

### 06 · Lime accents on the Money balance card
**What changed.** Added brand-lime accents to the navy balance card: a live-status dot, the `$` glyph, the exchange rate, a subtle corner glow, and promoted **Add money** to a solid-lime primary button (Convert stays as glass).

**The call.** Apply lime as *emphasis and hierarchy*, not decoration — and make exactly one primary action per card.

**Why.** "Needs lime accents" could mean "paint it lime." Judgment was the opposite: lime is the loudest color in the system, so it should mark only what matters — you're connected (dot), your money is in dollars (`$`), the rate you're watching, and the one action we want you to take. Two equally-weighted buttons is a non-decision; promoting Add money and demoting Convert gives the card a point of view.

---

### 07 · Version control & the README
**What changed.** Initialized git, committed the work, created a GitHub repo, then flipped it public and added a README framed as the design exercise.

**The call.** Ship it **private first** with an explicit secrets/`node_modules` check, and only go public on request. Write the README to lead with the *thesis*, not the file tree.

**Why.** Money-app prototype + an API integration = treat secrets as guilty until proven ignored (verified `.env` was untracked before the first push). Public/private is a human decision, not a default. And for a design role, the repo's first impression should be the *argument* — why the entity reframing matters — with "how to run" as support, not the headline.

---

*Maintained as we work. Each new change gets an entry — the goal is to make the reasoning legible, so the judgment is as reviewable as the pixels.*
