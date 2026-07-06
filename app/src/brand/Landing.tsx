// OneDosh — "The Elements" brand direction (#brand)
//
// North star: Oliver Byrne's 1847 "Elements of Euclid" — Greek geometry rendered
// in bold primary colour, decades ahead of the Bauhaus. That IS greco-futurism:
// ancient content, radically modern form. OneDosh becomes the *Elements of money* —
// every product, card and proof is an element, drawn as a coloured diagram.
//
// Palette: warm cream + Byrne red / blue / yellow + ink. Bold and human, carrying
// West-African warmth, reading nothing like cold gold-luxury fintech.

import type { CSSProperties } from "react";

const C = {
  paper: "#EFE6CC",
  paper2: "#E7DBB8",
  panel: "#F5EED9",
  ink: "#211C17",
  sub: "#6E6350",
  faint: "#A99C7C",
  line: "#CDBE97",
  red: "#CB3E2E",
  blue: "#234A98",
  yellow: "#E7A928",
  night: "#1B1712",
  night2: "#241F19",
} as const;

const TITLE = '"Cinzel", Georgia, serif';
const SERIF = '"Cormorant Garamond", Georgia, serif';
const UI = '"Space Grotesk", -apple-system, "Segoe UI", Roboto, sans-serif';

/* ------------------------------------------------------------------ *
 * Figure library — small Euclidean "elements" in Byrne's four colours *
 * ------------------------------------------------------------------ */

type FigType =
  | "triSplit"
  | "sqQuad"
  | "circTri"
  | "semi"
  | "triInCirc"
  | "halfSq"
  | "circHalf"
  | "nestTri"
  | "pyth"
  | "chevron";

function Fig({
  type,
  a = C.red,
  b = C.blue,
  c = C.yellow,
  size = 56,
  stroke = C.ink,
}: {
  type: FigType;
  a?: string;
  b?: string;
  c?: string;
  size?: number;
  stroke?: string;
}) {
  const sw = 1.6;
  const common = { stroke, strokeWidth: sw, strokeLinejoin: "round" as const };
  const svg = (children: React.ReactNode) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden style={{ display: "block" }}>
      {children}
    </svg>
  );
  switch (type) {
    case "triSplit":
      return svg(
        <>
          <path d="M6 42 L6 8 L40 42 Z" fill={a} {...common} />
          <path d="M6 8 L40 42 L6 42" fill="none" {...common} />
          <path d="M6 25 L23 42" stroke={stroke} strokeWidth={sw} strokeDasharray="2 2.5" />
        </>,
      );
    case "sqQuad":
      return svg(
        <>
          <path d="M8 8 H40 V40 H8 Z" fill="none" {...common} />
          <path d="M8 8 L24 24 L8 40 Z" fill={a} {...common} />
          <path d="M8 8 L24 24 L40 8 Z" fill={c} {...common} />
          <path d="M40 8 L24 24 L40 40 Z" fill={b} {...common} />
          <path d="M8 40 L24 24 L40 40 Z" fill={stroke} {...common} />
        </>,
      );
    case "circTri":
      return svg(
        <>
          <circle cx="24" cy="24" r="17" fill="none" {...common} />
          <path d="M24 8 L39 33 L9 33 Z" fill={a} {...common} />
        </>,
      );
    case "semi":
      return svg(
        <>
          <path d="M7 34 A17 17 0 0 1 41 34" fill="none" {...common} />
          <path d="M7 34 H41" {...common} />
          <path d="M7 34 L24 17 L41 34 Z" fill={b} {...common} />
          <circle cx="24" cy="17" r="2.4" fill={a} stroke="none" />
        </>,
      );
    case "triInCirc":
      return svg(
        <>
          <path d="M24 7 L40 40 L8 40 Z" fill="none" {...common} />
          <circle cx="24" cy="29" r="9.5" fill={c} {...common} />
        </>,
      );
    case "halfSq":
      return svg(
        <>
          <path d="M9 9 H39 V39 H9 Z" fill="none" {...common} />
          <path d="M9 9 H39 V39 Z" fill={a} {...common} />
        </>,
      );
    case "circHalf":
      return svg(
        <>
          <circle cx="24" cy="24" r="16" fill="none" {...common} />
          <path d="M24 8 A16 16 0 0 1 24 40 Z" fill={b} {...common} />
        </>,
      );
    case "nestTri":
      return svg(
        <>
          <path d="M24 7 L41 40 L7 40 Z" fill={a} {...common} />
          <path d="M24 40 L15.5 23.5 L32.5 23.5 Z" fill={c} {...common} />
        </>,
      );
    case "pyth":
      return svg(
        <>
          <path d="M16 32 L32 32 L32 16 Z" fill="none" {...common} />
          <path d="M32 32 H44 V44 H32 Z" fill={b} {...common} />
          <path d="M16 32 V44 H4 V32 Z" fill={a} {...common} />
          <path d="M16 16 H32 V32 H16 Z" fill={c} {...common} />
        </>,
      );
    case "chevron":
      return svg(
        <>
          <path d="M14 8 L34 24 L14 40 Z" fill={a} {...common} />
        </>,
      );
  }
}

/* A shuffled ribbon of figures, Byrne-cover style. */
const FIG_TYPES: FigType[] = ["triSplit", "sqQuad", "circTri", "semi", "triInCirc", "halfSq", "circHalf", "nestTri", "pyth", "chevron"];
const PALS: [string, string, string][] = [
  [C.red, C.blue, C.yellow],
  [C.blue, C.yellow, C.red],
  [C.yellow, C.red, C.blue],
  [C.ink, C.red, C.yellow],
  [C.blue, C.ink, C.yellow],
  [C.red, C.yellow, C.blue],
];
function figAt(i: number, size = 56) {
  const t = FIG_TYPES[(i * 7 + 3) % FIG_TYPES.length];
  const p = PALS[(i * 5 + 1) % PALS.length];
  return <Fig type={t} a={p[0]} b={p[1]} c={p[2]} size={size} />;
}

/* ------------------------------------------------------------------ */

export function Landing() {
  return (
    <div style={{ background: C.paper, color: C.ink, fontFamily: UI, minHeight: "100vh" }}>
      <TopBar />
      <Hero />
      <Idea />
      <Palette />
      <Mark />
      <TypeSpec />
      <Cards />
      <Foot />
    </div>
  );
}

/* --- Nav --- */
function TopBar() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px clamp(20px,5vw,64px)",
        borderBottom: `1px solid ${C.line}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Fig type="semi" a={C.red} b={C.blue} size={30} />
        <span style={{ fontFamily: TITLE, letterSpacing: "0.28em", fontSize: 15 }}>ONEDOSH</span>
      </div>
      <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 16, color: C.sub }}>the elements of money</div>
    </div>
  );
}

/* --- Hero: homage to the Byrne cover --- */
function Hero() {
  const top = [0, 1, 2, 3, 4, 5];
  const bottom = Array.from({ length: 18 }, (_, i) => i + 6);
  return (
    <section style={{ padding: "clamp(28px,5vw,64px) clamp(20px,5vw,64px)" }}>
      <div
        style={{
          border: `1.5px solid ${C.ink}`,
          padding: "clamp(24px,4vw,52px) clamp(18px,4vw,48px)",
          position: "relative",
          background: C.panel,
        }}
      >
        {/* top ribbon */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
          {top.map((i) => (
            <div key={i}>{figAt(i, 54)}</div>
          ))}
        </div>

        {/* title block */}
        <div style={{ textAlign: "center", padding: "clamp(30px,6vw,70px) 0 clamp(24px,5vw,56px)" }}>
          <h1
            style={{
              fontFamily: TITLE,
              fontWeight: 700,
              fontSize: "clamp(34px,7vw,74px)",
              letterSpacing: "0.06em",
              margin: 0,
              lineHeight: 1.05,
            }}
          >
            ONEDOSH
          </h1>
          <div style={{ fontFamily: TITLE, fontSize: "clamp(18px,3.2vw,32px)", letterSpacing: "0.22em", margin: "10px 0 22px" }}>
            THE ELEMENTS
          </div>
          <div style={{ fontFamily: SERIF, fontSize: "clamp(15px,2vw,20px)", letterSpacing: "0.34em", color: C.sub, lineHeight: 2 }}>
            THE FIRST PRINCIPLES OF MONEY
            <br />
            IN FULL COLOUR
            <br />
            FOR EVERYONE
          </div>
          <div style={{ margin: "22px auto 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <span style={{ width: 40, height: 1, background: C.line }} />
            <Fig type="circTri" a={C.yellow} size={22} />
            <span style={{ width: 40, height: 1, background: C.line }} />
          </div>
          <div style={{ fontFamily: SERIF, letterSpacing: "0.3em", fontSize: 13, color: C.faint, marginTop: 14 }}>
            FIRST EDITION
          </div>
        </div>

        {/* bottom grid */}
        <div
          className="gf-el-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "clamp(10px,2vw,22px)", placeItems: "center" }}
        >
          {bottom.map((i) => (
            <div key={i}>{figAt(i, 52)}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --- The idea --- */
function Idea() {
  const pts = [
    {
      k: "The proof is the point",
      v: "Euclid gave the world its first system — small truths, drawn plainly, that everyone could follow. Byrne coloured them. OneDosh does the same for money: show the work, in full colour, so a first-time user trusts what's happening.",
    },
    {
      k: "Greco-futurist, done right",
      v: "Not columns and marble. Geometry. The Greeks' real gift was the diagram — and a diagram is timeless and future at once. It's the one classical language that never looks like a costume.",
    },
    {
      k: "An element for everything",
      v: "Each product is an element: send, save, the card, KYC-done. Each gets its own coloured figure. The system scales to infinity and still feels hand-set — the opposite of a template.",
    },
  ];
  return (
    <section style={{ padding: "clamp(30px,5vw,72px) clamp(20px,5vw,64px)", borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` }}>
      <SectionLabel n="I" t="The idea" />
      <div className="gf-el-grid3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "clamp(20px,3vw,48px)", marginTop: 30 }}>
        {pts.map((p, i) => (
          <div key={p.k}>
            <div style={{ marginBottom: 16 }}>{figAt(i * 3 + 2, 44)}</div>
            <h3 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 600, margin: "0 0 8px" }}>{p.k}</h3>
            <p style={{ fontFamily: UI, fontSize: 14, lineHeight: 1.6, color: C.sub, margin: 0 }}>{p.v}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* --- Palette --- */
function Palette() {
  const cols: { name: string; hex: string; text?: string }[] = [
    { name: "Papyrus", hex: C.paper, text: C.ink },
    { name: "Ink", hex: C.ink, text: C.paper },
    { name: "Cinnabar", hex: C.red, text: "#fff" },
    { name: "Ultramarine", hex: C.blue, text: "#fff" },
    { name: "Ochre", hex: C.yellow, text: C.ink },
  ];
  return (
    <section style={{ padding: "clamp(30px,5vw,72px) clamp(20px,5vw,64px)" }}>
      <SectionLabel n="II" t="Palette" note="Byrne's four inks on warm paper. Bold, human, unmistakably not another dark-mode fintech." />
      <div className="gf-swatches" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 14, marginTop: 28 }}>
        {cols.map((c) => (
          <div key={c.name} style={{ border: `1px solid ${C.line}`, borderRadius: 10, overflow: "hidden" }}>
            <div style={{ background: c.hex, height: 120, display: "flex", alignItems: "flex-end", padding: 12, color: c.text }}>
              <span style={{ fontFamily: TITLE, letterSpacing: "0.14em", fontSize: 13 }}>{c.name.toUpperCase()}</span>
            </div>
            <div style={{ padding: "8px 12px", fontFamily: UI, fontSize: 11.5, color: C.sub, background: C.panel }}>{c.hex}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* --- The mark + alternates --- */
function Mark() {
  return (
    <section style={{ padding: "clamp(30px,5vw,72px) clamp(20px,5vw,64px)", borderTop: `1px solid ${C.line}` }}>
      <SectionLabel n="III" t="The mark" note="The arch survives — but as a theorem, not a decoration. Thales: any triangle in a semicircle is right-angled. A gateway drawn as a proof." />
      <div className="gf-mark" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "clamp(24px,4vw,56px)", marginTop: 32, alignItems: "center" }}>
        {/* hero mark on ink */}
        <div style={{ background: C.ink, borderRadius: 14, padding: "48px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
          <Fig type="semi" a={C.red} b={C.blue} size={140} stroke={C.paper} />
          <span style={{ fontFamily: TITLE, letterSpacing: "0.32em", fontSize: 20, color: C.paper }}>ONEDOSH</span>
        </div>
        {/* alternates */}
        <div>
          <p style={{ fontFamily: UI, fontSize: 14, lineHeight: 1.6, color: C.sub, margin: "0 0 20px" }}>
            Three candidate marks — all pure Euclid. Pick one and I'll draw the full construction (compass + guides), lockups and app icon.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {([
              { t: "semi" as FigType, label: "Thales arch" },
              { t: "circTri" as FigType, label: "Coin + triangle" },
              { t: "pyth" as FigType, label: "Pythagoras" },
            ]).map((m) => (
              <div key={m.label} style={{ textAlign: "center" }}>
                <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, padding: 20 }}>
                  <Fig type={m.t} a={C.red} b={C.blue} c={C.yellow} size={72} />
                </div>
                <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 15, color: C.sub, marginTop: 8 }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --- Type --- */
function TypeSpec() {
  return (
    <section style={{ padding: "clamp(30px,5vw,72px) clamp(20px,5vw,64px)", borderTop: `1px solid ${C.line}` }}>
      <SectionLabel n="IV" t="Typography" note="Roman capitals for authority, an old-style serif for warmth, a modern grotesk for the app. Ancient + future in the type itself." />
      <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 26 }}>
        <TypeRow font={TITLE} label="Cinzel · display caps" sample="THE ELEMENTS OF MONEY" size="clamp(26px,5vw,52px)" ls="0.1em" />
        <TypeRow font={SERIF} label="Cormorant · editorial serif" sample="Small truths, drawn plainly." size="clamp(24px,4vw,44px)" italic />
        <TypeRow font={UI} label="Space Grotesk · product" sample="Send $200 to Lagos — proof shown." size="clamp(18px,3vw,30px)" />
      </div>
    </section>
  );
}
function TypeRow({ font, label, sample, size, ls, italic }: { font: string; label: string; sample: string; size: string; ls?: string; italic?: boolean }) {
  return (
    <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 18 }}>
      <div style={{ fontFamily: UI, fontSize: 11.5, letterSpacing: "0.14em", textTransform: "uppercase", color: C.faint, marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: font, fontSize: size, letterSpacing: ls, fontStyle: italic ? "italic" : "normal", lineHeight: 1.1 }}>{sample}</div>
    </div>
  );
}

/* --- The card system: "the Elements" --- */
function Cards() {
  return (
    <section style={{ padding: "clamp(30px,5vw,72px) clamp(20px,5vw,64px)", borderTop: `1px solid ${C.line}`, background: C.paper2 }}>
      <SectionLabel n="V" t="The element" note="Austin's brief — one visual element. Ours is the card, drawn as a page from the book. A collectible series: Element I, II, III — each its own proof, its own colour." />

      {/* flagship */}
      <div style={{ display: "flex", justifyContent: "center", margin: "36px 0 44px" }}>
        <ElementCard variant="ink" n="I" accent={C.red} fig="semi" tagline="ANY TRIANGLE IN A SEMICIRCLE IS RIGHT" big />
      </div>

      {/* series */}
      <div className="gf-cardrow" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "clamp(16px,3vw,32px)" }}>
        <ElementCard variant="paper" n="II" accent={C.blue} fig="circTri" tagline="THE WHOLE, DIVIDED FAIRLY" />
        <ElementCard variant="paper" n="III" accent={C.yellow} fig="pyth" tagline="THE PARTS EQUAL THE SUM" />
        <ElementCard variant="ink" n="IV" accent={C.blue} fig="sqQuad" tagline="ORDER FROM FOUR" />
      </div>
    </section>
  );
}

function ElementCard({
  variant,
  n,
  accent,
  fig,
  tagline,
  big,
}: {
  variant: "paper" | "ink";
  n: string;
  accent: string;
  fig: FigType;
  tagline: string;
  big?: boolean;
}) {
  const dark = variant === "ink";
  const bg = dark
    ? `linear-gradient(150deg, ${C.night2} 0%, ${C.night} 60%, #100D0A 100%)`
    : `linear-gradient(150deg, ${C.panel} 0%, ${C.paper} 55%, ${C.paper2} 100%)`;
  const fg = dark ? C.paper : C.ink;
  const subfg = dark ? "rgba(239,230,204,0.55)" : C.sub;
  const width = big ? "min(520px, 92vw)" : "100%";
  const wrap: CSSProperties = {
    width,
    aspectRatio: "1.586 / 1",
    borderRadius: 18,
    background: bg,
    border: dark ? "1px solid rgba(239,230,204,0.14)" : `1px solid ${C.line}`,
    boxShadow: "0 24px 60px -28px rgba(20,16,10,0.55)",
    padding: "clamp(16px,3vw,26px)",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };
  const strokeCol = dark ? C.paper : C.ink;
  return (
    <div style={wrap}>
      {/* big bleeding figure */}
      <div style={{ position: "absolute", right: -18, bottom: -22, opacity: dark ? 0.95 : 1 }}>
        <Fig type={fig} a={accent} b={dark ? C.paper : C.blue} c={C.yellow} size={big ? 240 : 150} stroke={strokeCol} />
      </div>

      {/* top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative", zIndex: 1 }}>
        <span style={{ fontFamily: TITLE, letterSpacing: "0.3em", fontSize: big ? 16 : 12.5, color: fg }}>ONEDOSH</span>
        <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: big ? 18 : 14, color: subfg }}>Element&nbsp;{n}</span>
      </div>

      {/* chip drawn as a small proof */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            width: big ? 46 : 34,
            height: big ? 34 : 26,
            borderRadius: 6,
            border: `1.4px solid ${accent}`,
            display: "grid",
            placeItems: "center",
          }}
        >
          <Fig type="chevron" a={accent} size={big ? 18 : 13} stroke={accent} />
        </div>
      </div>

      {/* bottom */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: UI, letterSpacing: "0.18em", fontSize: big ? 10.5 : 8.5, color: subfg }}>{tagline}</div>
        <div style={{ fontFamily: UI, letterSpacing: "0.22em", fontSize: big ? 11 : 9, color: fg, marginTop: 6 }}>0DOSH · 4917 22XX XXXX</div>
      </div>
    </div>
  );
}

/* --- shared --- */
function SectionLabel({ n, t, note }: { n: string; t: string; note?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 18, flexWrap: "wrap" }}>
      <span style={{ fontFamily: TITLE, letterSpacing: "0.2em", fontSize: 13, color: C.red }}>{n}</span>
      <h2 style={{ fontFamily: SERIF, fontSize: "clamp(24px,3.4vw,38px)", fontWeight: 600, margin: 0 }}>{t}</h2>
      {note && <p style={{ fontFamily: UI, fontSize: 13.5, color: C.sub, margin: 0, maxWidth: 560, lineHeight: 1.55 }}>{note}</p>}
    </div>
  );
}

function Foot() {
  return (
    <footer style={{ padding: "40px clamp(20px,5vw,64px)", borderTop: `1.5px solid ${C.ink}`, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Fig type="semi" a={C.red} b={C.blue} size={24} />
        <span style={{ fontFamily: TITLE, letterSpacing: "0.24em", fontSize: 13 }}>ONEDOSH · THE ELEMENTS</span>
      </div>
      <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 15, color: C.sub }}>after Byrne, 1847 — for OneDosh, 2026</span>
    </footer>
  );
}
