import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { t, greco, display, font } from "../theme";
import { PhoneFrame } from "../components/PhoneFrame";
import { useClock } from "../components/useClock";
import { CardArt } from "../money/CardArt";
import type { CardArt as Art } from "../money/cards";
import { context, me } from "../data";
import { Avatar, DoshMark } from "../components/ui";

// Money Screen Day/Night Reveal — a standalone hero scene.
//
// One master `night` flag drives three synchronized layers: the ambient greco
// background (day <-> night crossfade), the phone's Money screen (scoped dark
// theme), and the card face (ivory marble <-> Luminova glow). The screen mirrors
// the real Money tab; nothing here touches the live app.

const BG_DAY = "/scene/bg-day.png";
const BG_NIGHT = "/scene/bg-night.png";
const CARD_DAY_SRC = "/scene/card-day.png";
const CARD_NIGHT_SRC = "/scene/card-night.png";

type Palette = {
  screenBg: string;
  ink: string;
  sub: string;
  faint: string;
  border: string;
  surfaceUsd: string;
  surfaceNgn: string;
  tileBg: string;
  tileBorder: string;
  accent: string; // dots, symbols, discover rule
  primaryBg: string; // primary wallet button
  primaryText: string;
  headerDot: string; // the coral "." after the title
  // bottom navigation
  navBg: string;
  navBorder: string;
  navIndicator: string;
  navActiveIcon: string;
  navActiveLabel: string;
  navInactive: string;
};

function sceneTheme(night: boolean): Palette {
  return night
    ? {
        screenBg: "#0C0E0A",
        ink: "#E9EEDE",
        sub: "#8A936C",
        faint: "#5A6047",
        border: "rgba(207,242,63,0.16)",
        surfaceUsd: "#15180F",
        surfaceNgn: "#111409",
        tileBg: "linear-gradient(155deg, #181C11 0%, #12150C 100%)",
        tileBorder: "rgba(207,242,63,0.16)",
        accent: "#CFF23F",
        primaryBg: "#CFF23F",
        primaryText: "#161A0B",
        headerDot: "#CFF23F",
        navBg: "#101309",
        navBorder: "rgba(207,242,63,0.16)",
        navIndicator: "rgba(207,242,63,0.20)",
        navActiveIcon: "#CFF23F",
        navActiveLabel: "#E9EEDE",
        navInactive: "#6B7355",
      }
    : {
        screenBg: t.bg,
        ink: greco.ink,
        sub: greco.sub,
        faint: greco.faint,
        border: t.border,
        surfaceUsd: "#FFFFFF",
        surfaceNgn: "#F6F4EE",
        tileBg: greco.marbleWarm,
        tileBorder: greco.hairline,
        accent: greco.gold,
        primaryBg: greco.onyx,
        primaryText: greco.ivory,
        headerDot: t.coral,
        navBg: "#EDEAE0",
        navBorder: "#CFCCC2",
        navIndicator: "#E6EFBE",
        navActiveIcon: "#141C33",
        navActiveLabel: "#12141C",
        navInactive: "#5C6270",
      };
}

const cardDay: Art = {
  kind: "image",
  src: CARD_DAY_SRC,
  printed: true,
  ink: "#F2ECE0",
  sub: "#C9BCA3",
  accent: "#D9B36A",
  accentInk: "#1A140D",
};

const cardNight: Art = {
  kind: "image",
  src: CARD_NIGHT_SRC,
  printed: true,
  ink: "#E9EEDE",
  sub: "#8A936C",
  accent: "#CFF23F",
  accentInk: "#12141C",
};

function usePrefersReducedMotion() {
  const query = "(prefers-reduced-motion: reduce)";
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setReduced(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

// A sun/moon switch that floats on the background, top-right of the scene.
function DayNightToggle({
  night,
  onToggle,
  reduced,
}: {
  night: boolean;
  onToggle: () => void;
  reduced: boolean;
}) {
  const trackW = 64;
  const trackH = 34;
  const knob = 28;
  const dur = reduced ? "0ms" : "420ms";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={night ? "Switch to day" : "Switch to night"}
      aria-pressed={night}
      style={{
        position: "relative",
        width: trackW,
        height: trackH,
        borderRadius: 999,
        border: "none",
        cursor: "pointer",
        padding: 0,
        background: night ? "rgba(18,22,12,0.72)" : "rgba(255,255,255,0.55)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        boxShadow: night
          ? "inset 0 0 0 1px rgba(207,242,63,0.4), 0 6px 20px rgba(0,0,0,0.35)"
          : "inset 0 0 0 1px rgba(255,255,255,0.7), 0 6px 20px rgba(20,28,51,0.18)",
        transition: `background ${dur} ease, box-shadow ${dur} ease`,
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: 11,
          top: 12,
          fontSize: 9,
          lineHeight: 1,
          color: "#CFF23F",
          opacity: night ? 0.9 : 0,
          transition: `opacity ${dur} ease`,
        }}
      >
        ✦
      </span>
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: (trackH - knob) / 2,
          left: night ? trackW - knob - 3 : 3,
          width: knob,
          height: knob,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          fontSize: 14,
          background: night
            ? "radial-gradient(circle at 35% 30%, #EAF7A6, #CFF23F 70%)"
            : "radial-gradient(circle at 35% 30%, #FFF3C4, #F5C542 75%)",
          boxShadow: night ? "0 0 12px rgba(207,242,63,0.6)" : "0 1px 5px rgba(0,0,0,0.3)",
          transition: `left ${dur} cubic-bezier(0.22,1,0.36,1), background ${dur} ease`,
        }}
      >
        {night ? "🌙" : "☀️"}
      </span>
    </button>
  );
}

function SectionLabel({ children, c, reduced }: { children: string; c: Palette; reduced: boolean }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: 1.4,
        textTransform: "uppercase",
        color: c.sub,
        margin: "22px 0 10px",
        transition: reduced ? "none" : "color 500ms ease",
      }}
    >
      {children}
    </div>
  );
}

const CARD_H = 166;
const PEEK = 58;

function BalanceStack({ c, reduced }: { c: Palette; reduced: boolean }) {
  const usd = context.usdBalance;
  const ngn = context.ngnBalance;
  const trans = reduced ? "none" : "background 500ms ease, border-color 500ms ease, color 500ms ease";

  const usdAmount = usd.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Back card (Naira) peeks above the front card (Dollars).
  return (
    <div style={{ position: "relative", height: CARD_H + PEEK, marginTop: 6 }}>
      {/* back — Naira */}
      <div
        style={{
          position: "absolute",
          left: 10,
          right: 10,
          top: 0,
          height: CARD_H,
          overflow: "hidden",
          background: c.surfaceNgn,
          border: `1px solid ${c.border}`,
          borderRadius: t.radiusCard,
          padding: 18,
          zIndex: 1,
          boxShadow: "0 6px 16px -10px rgba(20,28,51,0.14)",
          transition: trans,
        }}
      >
        <BalanceHead label="Naira balance" symbol="₦" amount={ngn.toLocaleString()} c={c} reduced={reduced} />
      </div>

      {/* front — Dollars */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: PEEK,
          height: CARD_H,
          overflow: "hidden",
          background: c.surfaceUsd,
          border: `1px solid ${c.border}`,
          borderRadius: t.radiusCard,
          padding: 18,
          zIndex: 2,
          boxShadow: "0 12px 26px -14px rgba(20,28,51,0.22)",
          transition: trans,
        }}
      >
        <BalanceHead label="Dollar balance" symbol="$" amount={usdAmount} c={c} reduced={reduced} />
        <div style={{ fontSize: 12, color: c.sub, marginTop: 2, transition: trans }}>
          ≈ ₦{(usd * context.nairaPerUsd).toLocaleString()} at today's rate
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 13 }}>
          <WalletBtn label="Add money" primary c={c} reduced={reduced} />
          <WalletBtn label="Convert" c={c} reduced={reduced} />
        </div>
      </div>
    </div>
  );
}

function BalanceHead({
  label,
  symbol,
  amount,
  c,
  reduced,
}: {
  label: string;
  symbol: string;
  amount: string;
  c: Palette;
  reduced: boolean;
}) {
  const trans = reduced ? "none" : "color 500ms ease, background 500ms ease";
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            background: c.accent,
            transition: trans,
          }}
        />
        <span style={{ fontSize: 13, fontWeight: 600, color: c.sub, transition: trans }}>{label}</span>
      </div>
      <div
        style={{
          fontFamily: display,
          fontSize: 32,
          fontWeight: 800,
          lineHeight: 1.05,
          marginTop: 6,
          letterSpacing: "-0.02em",
          fontVariantNumeric: "tabular-nums",
          color: c.ink,
          transition: trans,
        }}
      >
        <span style={{ color: c.accent, marginRight: 3, fontWeight: 700, transition: trans }}>{symbol}</span>
        {amount}
      </div>
    </>
  );
}

function WalletBtn({
  label,
  primary,
  c,
  reduced,
}: {
  label: string;
  primary?: boolean;
  c: Palette;
  reduced: boolean;
}) {
  const trans = reduced ? "none" : "background 500ms ease, color 500ms ease, border-color 500ms ease";
  return (
    <div
      style={{
        flex: 1,
        textAlign: "center",
        border: primary ? "none" : `1px solid ${c.tileBorder}`,
        background: primary ? c.primaryBg : "transparent",
        color: primary ? c.primaryText : c.ink,
        borderRadius: 11,
        padding: "11px",
        fontSize: 13.5,
        fontWeight: 700,
        letterSpacing: 0.2,
        transition: trans,
      }}
    >
      {label}
    </div>
  );
}

// Android status bar — themed clock + system icons (mirrors StatusBar.tsx).
function StatusBarThemed({ c, reduced }: { c: Palette; reduced: boolean }) {
  const time = useClock();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 16px 4px",
        color: c.ink,
        transition: reduced ? "none" : "color 500ms ease",
      }}
    >
      <div style={{ fontFamily: font, fontSize: 14, fontWeight: 600, letterSpacing: "0.1px" }}>
        {time}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <svg width="15" height="12" viewBox="0 0 15 12" fill="none" aria-hidden>
          {[
            { x: 0, h: 4 },
            { x: 4, h: 6.5 },
            { x: 8, h: 9 },
            { x: 12, h: 11.5 },
          ].map((b, i) => (
            <rect key={i} x={b.x} y={12 - b.h} width="3" height={b.h} rx="0.6" fill="currentColor" />
          ))}
        </svg>
        <svg width="15" height="12" viewBox="0 0 15 12" fill="none" aria-hidden>
          <path d="M7.5 1.2C10.4 1.2 13 2.4 14.8 4.3L7.5 12 0.2 4.3C2 2.4 4.6 1.2 7.5 1.2Z" fill="currentColor" />
        </svg>
        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
          <span style={{ fontFamily: font, fontSize: 12, fontWeight: 600 }}>84%</span>
          <svg width="9" height="14" viewBox="0 0 9 14" fill="none" aria-hidden>
            <rect x="3" y="0" width="3" height="1.8" rx="0.6" fill="currentColor" />
            <rect x="0.6" y="1.8" width="7.8" height="11.6" rx="1.8" stroke="currentColor" strokeWidth="1.2" fill="none" />
            <rect x="1.8" y={3 + 7.8 - (7.8 * 84) / 100} width="5.4" height={(7.8 * 84) / 100} rx="0.8" fill="currentColor" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// Top app bar — "Money." + profile avatar (mirrors Header.tsx).
function HeaderThemed({ c, reduced }: { c: Palette; reduced: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px 8px",
        gap: 8,
      }}
    >
      <div
        style={{
          fontFamily: display,
          fontSize: 27,
          fontWeight: 700,
          color: c.ink,
          letterSpacing: "-0.03em",
          transition: reduced ? "none" : "color 500ms ease",
        }}
      >
        Money
        <span style={{ color: c.headerDot }}>.</span>
      </div>
      <div style={{ padding: 3, display: "grid", placeItems: "center" }}>
        <Avatar label={me.name} src={me.photo} size={34} />
      </div>
    </div>
  );
}

// Bottom navigation — Explore / Dosh / Money, Money active (mirrors TabBar.tsx).
function TabBarThemed({ c, reduced }: { c: Palette; reduced: boolean }) {
  const items: { label: string; active: boolean; icon: (active: boolean) => React.ReactNode }[] = [
    { label: "Explore", active: false, icon: (a) => <NavActivityIcon active={a} /> },
    { label: "Dosh", active: false, icon: () => <DoshMark size={24} /> },
    { label: "Money", active: true, icon: (a) => <NavMoneyIcon active={a} indicator={c.navIndicator} /> },
  ];
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "stretch",
        background: c.navBg,
        borderTop: `1px solid ${c.navBorder}`,
        transition: reduced ? "none" : "background 500ms ease, border-color 500ms ease",
      }}
    >
      {items.map((it) => (
        <div
          key={it.label}
          style={{
            flex: 1,
            height: 76,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            padding: "12px 0 16px",
            color: it.active ? c.navActiveIcon : c.navInactive,
          }}
        >
          <span
            aria-hidden
            style={{
              position: "relative",
              width: 64,
              height: 32,
              display: "grid",
              placeItems: "center",
              borderRadius: 16,
              background: it.active ? c.navIndicator : "transparent",
              transition: reduced ? "none" : "background 500ms ease",
            }}
          >
            {it.icon(it.active)}
          </span>
          <span
            style={{
              fontFamily: font,
              fontSize: 12,
              lineHeight: "16px",
              fontWeight: it.active ? 700 : 500,
              color: it.active ? c.navActiveLabel : c.navInactive,
              transition: reduced ? "none" : "color 500ms ease",
            }}
          >
            {it.label}
          </span>
        </div>
      ))}
    </nav>
  );
}

function NavActivityIcon({ active }: { active: boolean }) {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" style={{ display: "block" }}>
      <path
        d="M2.5 12.5H7l2.2-6 3.4 11 2.4-5H21.5"
        stroke="currentColor"
        strokeWidth={active ? 2.4 : 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NavMoneyIcon({ active, indicator }: { active: boolean; indicator: string }) {
  if (active) {
    return (
      <svg width={24} height={24} viewBox="0 0 24 24" fill="none" style={{ display: "block" }}>
        <rect x={3} y={6} width={18} height={12.5} rx={3.4} fill="currentColor" />
        <circle cx={17.4} cy={13.5} r={1.5} fill={indicator} />
      </svg>
    );
  }
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" style={{ display: "block" }}>
      <rect x={3} y={6} width={18} height={12.5} rx={3.4} stroke="currentColor" strokeWidth={2} />
      <path d="M3 10.2H21" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

function MoneyScreen({
  night,
  reduced,
  cardWidth,
  contentRef,
}: {
  night: boolean;
  reduced: boolean;
  cardWidth: number;
  contentRef: React.RefObject<HTMLDivElement | null>;
}) {
  const c = sceneTheme(night);
  const ease = "cubic-bezier(0.22,1,0.36,1)";
  const discover = ["View rates", "Increase limits"];

  return (
    <div
      style={{
        position: "relative",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: c.screenBg,
        color: c.ink,
        fontFamily: display,
        transition: reduced ? "none" : "background 500ms ease, color 500ms ease",
        overflow: "hidden",
      }}
    >
      <StatusBarThemed c={c} reduced={reduced} />
      <HeaderThemed c={c} reduced={reduced} />

      <div ref={contentRef} style={{ padding: "4px 16px 16px", flex: 1, overflowY: "auto" }}>
        <BalanceStack c={c} reduced={reduced} />

        <SectionLabel c={c} reduced={reduced}>
          Card
        </SectionLabel>

        {/* card — day/night crossfade + a lume charge-in, nothing under it */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ position: "relative", width: cardWidth, height: Math.round(cardWidth * 0.628) }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: night ? 0 : 1,
                transition: reduced ? "none" : `opacity 600ms ${ease}`,
              }}
            >
              <CardArt art={cardDay} name={context.name} last4="4921" width={cardWidth} editionLabel="OneDosh" hideNetwork />
            </div>
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: night ? 1 : 0,
                transition: reduced ? "none" : `opacity 600ms ${ease} 150ms`,
              }}
            >
              <CardArt art={cardNight} name={context.name} last4="4921" width={cardWidth} editionLabel="OneDosh" hideNetwork />
            </div>
            <span
              aria-hidden
              style={{
                position: "absolute",
                inset: -14,
                borderRadius: 34,
                pointerEvents: "none",
                background:
                  "radial-gradient(58% 55% at 62% 55%, rgba(207,242,63,0.28), rgba(207,242,63,0) 70%)",
                opacity: night ? 1 : 0,
                transform: night ? "scale(1)" : "scale(0.82)",
                transition: reduced
                  ? "none"
                  : `opacity 700ms ${ease} 200ms, transform 900ms ${ease} 200ms`,
              }}
            />
          </div>
        </div>

        <SectionLabel c={c} reduced={reduced}>
          Discover
        </SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {discover.map((d) => (
            <div
              key={d}
              style={{
                position: "relative",
                overflow: "hidden",
                background: c.tileBg,
                border: `1px solid ${c.tileBorder}`,
                borderRadius: t.radiusInner,
                padding: "16px 14px 16px 18px",
                fontSize: 14,
                fontWeight: 600,
                color: c.ink,
                transition: reduced ? "none" : "background 500ms ease, border-color 500ms ease, color 500ms ease",
              }}
            >
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  left: 0,
                  top: 12,
                  bottom: 12,
                  width: 2,
                  borderRadius: 2,
                  background: c.accent,
                  opacity: 0.7,
                }}
              />
              {d}
            </div>
          ))}
        </div>

      </div>

      <TabBarThemed c={c} reduced={reduced} />
    </div>
  );
}

export function MoneyReveal() {
  const [night, setNight] = useState(false);
  const reduced = usePrefersReducedMotion();
  const bgDur = reduced ? "0ms" : "700ms";

  const contentRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(300);
  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    // clientWidth includes the 16px horizontal padding on each side; the card
    // fills the full inner width so it sits flush within the screen gutters.
    const measure = () => setCardWidth(Math.max(180, el.clientWidth - 32));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        overflow: "hidden",
        background: "#0B0908",
      }}
    >
      {/* ambient background crossfade */}
      <img
        src={BG_DAY}
        alt=""
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: night ? 0 : 1,
          transition: `opacity ${bgDur} ease`,
        }}
      />
      <img
        src={BG_NIGHT}
        alt=""
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: night ? 1 : 0,
          transition: `opacity ${bgDur} ease`,
        }}
      />
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(72% 62% at 50% 46%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.30) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* day/night toggle — floats on the background, top-right of the scene */}
      <div style={{ position: "absolute", top: 28, right: 28, zIndex: 6 }}>
        <DayNightToggle night={night} onToggle={() => setNight((v) => !v)} reduced={reduced} />
      </div>

      {/* phone, centered — no metallic side buttons in the hero */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <PhoneFrame screenBg={sceneTheme(night).screenBg} sideButtons={false}>
          <MoneyScreen night={night} reduced={reduced} cardWidth={cardWidth} contentRef={contentRef} />
        </PhoneFrame>
      </div>
    </div>
  );
}
