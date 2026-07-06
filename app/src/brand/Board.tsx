// OneDosh — reference board (#board).
//
// A working moodboard of real work worth reacting to, in two conversations that
// meet at the OneDosh card: (1) greco / hellenofuturist aesthetic, (2) premium
// card & fintech design, (3) gold/dark luxury identity. Images are references
// pulled for internal study — not shipping assets, not committed to the repo.

const C = {
  bg: "#121418",
  panel: "#1A1D23",
  line: "#2A2E37",
  ink: "#EDEAE2",
  sub: "#9A9587",
  gold: "#D8A24A",
  lime: "#CFF23F",
} as const;

const CAPS = '"Cinzel", Georgia, serif';
const SERIF = '"Cormorant Garamond", Georgia, serif';
const UI = '"Space Grotesk", -apple-system, "Segoe UI", Roboto, sans-serif';

const GRECO = Array.from({ length: 12 }, (_, i) => `/board/greco/g${i + 1}.jpg`);
const CARDS = Array.from({ length: 14 }, (_, i) => `/board/cards/c${i + 1}.jpg`);
const LUXE = Array.from({ length: 11 }, (_, i) => `/board/luxe/l${i + 1}.jpg`);

export function Board() {
  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: UI, minHeight: "100vh" }}>
      <header
        style={{
          padding: "40px clamp(20px, 5vw, 72px) 30px",
          borderBottom: `1px solid ${C.line}`,
          position: "sticky",
          top: 0,
          background: "rgba(18,20,24,0.9)",
          backdropFilter: "blur(12px)",
          zIndex: 10,
        }}
      >
        <div style={{ fontFamily: CAPS, fontSize: 12, letterSpacing: "0.4em", color: C.gold, textTransform: "uppercase" }}>
          OneDosh · Reference Board
        </div>
        <h1 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(28px, 4vw, 46px)", margin: "10px 0 6px" }}>
          What's interesting in the space
        </h1>
        <p style={{ fontFamily: UI, fontSize: 15, color: C.sub, margin: 0, maxWidth: 640 }}>
          Real work worth reacting to — where greco-futurism meets money. Tell me what's pulling you
          and what to kill, and I'll steer the fresh brand take and the card from there.
        </p>
      </header>

      <BoardSection
        label="I · Greco / Hellenofuturist"
        note="The aesthetic itself: classical form reinterpreted with future materials. Watch for the ones that feel designed, not just AI-rendered — proportion, restraint, one hero idea."
        images={GRECO}
      />
      <BoardSection
        label="II · Premium card design"
        note="The element we're building. Metal, matte black, engraved marks, minimal faces, unexpected materials. What makes a card feel like an object you'd show off?"
        images={CARDS}
      />
      <BoardSection
        label="III · Gold / dark luxury identity"
        note="Type, gold treatment, meander detailing, and how brands earn 'premium' without tropes. Reference for the fresh brand take."
        images={LUXE}
      />

      <footer style={{ padding: "40px clamp(20px, 5vw, 72px)", borderTop: `1px solid ${C.line}`, color: C.sub, fontSize: 12.5, fontFamily: UI }}>
        References gathered for internal study · not shipping assets · OneDosh brand exploration
      </footer>
    </div>
  );
}

function BoardSection({ label, note, images }: { label: string; note: string; images: string[] }) {
  return (
    <section style={{ padding: "40px clamp(20px, 5vw, 72px) 8px" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 18, flexWrap: "wrap", marginBottom: 18 }}>
        <h2 style={{ fontFamily: CAPS, fontSize: 16, letterSpacing: "0.22em", color: C.gold, margin: 0, textTransform: "uppercase" }}>
          {label}
        </h2>
        <p style={{ fontFamily: UI, fontSize: 13.5, color: C.sub, margin: 0, maxWidth: 620, lineHeight: 1.5 }}>{note}</p>
      </div>
      <div style={{ columnCount: 4, columnGap: 14 }} className="gf-board-grid">
        {images.map((src, i) => (
          <figure
            key={src}
            style={{
              margin: "0 0 14px",
              breakInside: "avoid",
              borderRadius: 12,
              overflow: "hidden",
              border: `1px solid ${C.line}`,
              background: C.panel,
              position: "relative",
            }}
          >
            <img src={src} alt="" loading="lazy" style={{ width: "100%", display: "block" }} />
            <figcaption
              style={{
                position: "absolute",
                top: 8,
                left: 8,
                fontFamily: UI,
                fontSize: 10,
                fontWeight: 700,
                color: C.ink,
                background: "rgba(18,20,24,0.7)",
                borderRadius: 6,
                padding: "3px 7px",
                backdropFilter: "blur(4px)",
              }}
            >
              {label.split(" ")[0]}·{i + 1}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
