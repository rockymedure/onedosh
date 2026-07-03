import type { CSSProperties } from "react";
import type { CardArt as Art, Overlay } from "./cards";

const RATIO = 0.628; // ISO credit-card aspect (height / width)

// Rough perceptual luminance of a #rrggbb color (0–255).
function hexLuma(hex: string) {
  const h = hex.replace("#", "");
  if (h.length < 6) return 200;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Decorative pattern layers, drawn purely in CSS so template drops are instant.
function overlayLayer(overlay: Overlay, accent: string): CSSProperties | null {
  const base: CSSProperties = { position: "absolute", inset: 0, pointerEvents: "none" };
  switch (overlay) {
    case "halftone":
      return {
        ...base,
        backgroundImage: "radial-gradient(rgba(255,255,255,0.22) 1.1px, transparent 1.3px)",
        backgroundSize: "9px 9px",
        // cluster the dots toward the center like the founding card's halftone face
        WebkitMaskImage: "radial-gradient(80% 90% at 42% 45%, #000 0%, transparent 72%)",
        maskImage: "radial-gradient(80% 90% at 42% 45%, #000 0%, transparent 72%)",
        opacity: 0.9,
      };
    case "grid":
      return {
        ...base,
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)",
        backgroundSize: "26px 26px",
        WebkitMaskImage: "linear-gradient(to top, #000 0%, transparent 78%)",
        maskImage: "linear-gradient(to top, #000 0%, transparent 78%)",
        opacity: 0.6,
      };
    case "confetti":
      return {
        ...base,
        backgroundImage: [
          `radial-gradient(${accent} 1.6px, transparent 2px)`,
          "radial-gradient(rgba(255,255,255,0.7) 1.2px, transparent 1.6px)",
          `radial-gradient(${accent} 1.2px, transparent 1.6px)`,
        ].join(","),
        backgroundSize: "38px 38px, 52px 52px, 70px 70px",
        backgroundPosition: "0 0, 18px 22px, 40px 8px",
        opacity: 0.85,
      };
    case "waves":
      return {
        ...base,
        backgroundImage:
          "radial-gradient(120% 60% at 10% 110%, rgba(255,255,255,0.22), transparent 60%), radial-gradient(120% 60% at 90% -10%, rgba(255,255,255,0.18), transparent 55%)",
        opacity: 0.9,
      };
    default:
      return null;
  }
}

// The "Eclipse" card face, drawn in CSS: marble ground + a gold sunburst
// annulus + a glowing eclipse ring + a thin center rule. Sits behind the card
// content (chip / number / name).
function EclipseDecor({ mode, scale }: { mode: "onyx" | "ivory"; scale: number }) {
  const isOnyx = mode === "onyx";
  const cx = 68; // % — hero pushed right, chip stays clear on the left
  const cy = 47;
  const ring = 128 * scale;
  const rays = isOnyx ? "rgba(226,190,120,0.55)" : "rgba(176,121,74,0.5)";
  const ringGold = isOnyx ? "#E8C583" : "#B0794A";
  const glow = isOnyx ? "rgba(232,197,131,0.55)" : "rgba(176,121,74,0.4)";
  const rule = isOnyx ? "rgba(226,190,120,0.42)" : "rgba(176,121,74,0.4)";

  return (
    <>
      {/* fine sunburst rays, masked to an annulus around the ring */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `repeating-conic-gradient(from 0deg at ${cx}% ${cy}%, ${rays} 0deg 0.4deg, transparent 0.4deg 3deg)`,
          WebkitMaskImage: `radial-gradient(circle at ${cx}% ${cy}%, transparent ${ring / 2 - 1}px, #000 ${ring / 2}px, #000 ${ring}px, transparent ${ring * 1.18}px)`,
          maskImage: `radial-gradient(circle at ${cx}% ${cy}%, transparent ${ring / 2 - 1}px, #000 ${ring / 2}px, #000 ${ring}px, transparent ${ring * 1.18}px)`,
          opacity: 0.75,
        }}
      />
      {/* thin center rule line — the "eclipse-split" device */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: `${cy}%`,
          height: Math.max(1, 1 * scale),
          background: `linear-gradient(90deg, transparent, ${rule} 12%, ${rule} 88%, transparent)`,
          pointerEvents: "none",
        }}
      />
      {/* the eclipse ring — transparent center lets the marble show through */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: `${cx}%`,
          top: `${cy}%`,
          width: ring,
          height: ring,
          transform: "translate(-50%,-50%)",
          borderRadius: "50%",
          border: `${Math.max(1.4, 1.6 * scale)}px solid ${ringGold}`,
          boxShadow: `0 0 ${16 * scale}px ${glow}, inset 0 0 ${10 * scale}px ${glow}`,
          pointerEvents: "none",
        }}
      />
    </>
  );
}

const ECLIPSE_BG = {
  onyx: "radial-gradient(150% 130% at 62% 30%, #262019 0%, #14110c 52%, #0a0806 100%)",
  ivory: "radial-gradient(150% 130% at 50% 24%, #ffffff 0%, #f3ede2 58%, #e7ded0 100%)",
} as const;

function Chip({ scale }: { scale: number }) {
  return (
    <div
      aria-hidden
      style={{
        width: 34 * scale,
        height: 26 * scale,
        borderRadius: 5 * scale,
        background: "linear-gradient(135deg, #F7E7A8, #C9A34B 55%, #E8D08A)",
        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.18)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <span
        style={{
          position: "absolute",
          inset: "30% 12%",
          borderTop: "1px solid rgba(0,0,0,0.25)",
          borderBottom: "1px solid rgba(0,0,0,0.25)",
        }}
      />
      <span
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          bottom: 0,
          width: 1,
          background: "rgba(0,0,0,0.25)",
        }}
      />
    </div>
  );
}

function Contactless({ color, scale }: { color: string; scale: number }) {
  return (
    <svg
      width={16 * scale}
      height={16 * scale}
      viewBox="0 0 24 24"
      fill="none"
      style={{ opacity: 0.85 }}
      aria-hidden
    >
      {[6, 10, 14].map((r, i) => (
        <path
          key={i}
          d={`M ${8 + i * 0} 4 A ${r} ${r} 0 0 1 ${8} 20`}
          transform={`translate(${i * 3} 0)`}
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

export function CardArt({
  art,
  name,
  last4,
  width = 328,
  flipped = false,
  editionLabel,
}: {
  art: Art;
  name: string;
  last4: string;
  width?: number;
  flipped?: boolean;
  editionLabel?: string;
}) {
  const scale = width / 328;
  const height = Math.round(width * RATIO);
  const overlay = art.kind === "template" ? overlayLayer(art.overlay, art.accent) : null;

  // A "printed" image face already carries its own chip + artwork, so we drop
  // the synthetic chrome and keep only a quiet cardholder footer.
  const printed = art.kind === "image" && art.printed === true;
  const lightInk = art.kind !== "template" ? hexLuma(art.ink) > 140 : true;
  // Fill behind a transparent (background-removed) printed face so its rounded
  // corners + any letterbox blend seamlessly with the card body.
  const faceBg = printed ? (lightInk ? "#0f0b07" : "#f4efe6") : undefined;
  const imgShadow =
    art.kind === "image"
      ? lightInk
        ? "0 1px 8px rgba(0,0,0,0.55)"
        : "0 1px 6px rgba(255,255,255,0.65)"
      : "none";

  const background =
    art.kind === "image"
      ? printed
        ? `url(${art.src}) center/cover no-repeat ${faceBg}`
        : `url(${art.src}) center/cover no-repeat`
      : art.kind === "eclipse"
        ? ECLIPSE_BG[art.mode]
        : art.background;

  const radius = 24 * scale;
  const face: CSSProperties = {
    position: "absolute",
    inset: 0,
    borderRadius: radius,
    padding: 18 * scale,
    color: art.ink,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    overflow: "hidden",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
  };

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        perspective: 1200,
        // One clean, soft shadow on the frame — not on each flip face (which
        // stacked into a muddy double-shadow before).
        borderRadius: radius,
        boxShadow: "0 12px 28px rgba(20,28,51,0.20)",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRONT */}
        <div style={{ ...face, background }}>
          {art.kind === "image" && !printed && (
            <span
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.55) 100%)",
              }}
            />
          )}
          {/* Printed face: only a whisper of a scrim under the footer so the
              cardholder name stays legible over the artwork. */}
          {printed && (
            <span
              aria-hidden
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: "42%",
                background: lightInk
                  ? "linear-gradient(180deg, transparent, rgba(0,0,0,0.42))"
                  : "linear-gradient(180deg, transparent, rgba(255,255,255,0.40))",
              }}
            />
          )}
          {overlay && <span style={overlay} />}
          {art.kind === "eclipse" && <EclipseDecor mode={art.mode} scale={scale} />}
          {art.kind === "template" && art.glow && (
            <span
              aria-hidden
              style={{
                position: "absolute",
                bottom: -70 * scale,
                left: -50 * scale,
                width: 180 * scale,
                height: 180 * scale,
                borderRadius: "50%",
                background: art.glow,
                opacity: 0.2,
                filter: `blur(${40 * scale}px)`,
              }}
            />
          )}
          {/* soft top sheen for depth — subtle, not a harsh diagonal band */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 34%)",
            }}
          />

          {!printed && (
            <div
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  fontWeight: 800,
                  fontSize: 17 * scale,
                  letterSpacing: -0.3,
                  color: art.ink,
                  textShadow: art.kind === "image" ? "0 1px 8px rgba(0,0,0,0.5)" : "none",
                }}
              >
                One<span style={{ color: art.accent }}>Dosh</span>
              </span>
              <span
                style={{
                  fontSize: 10 * scale,
                  fontWeight: 800,
                  letterSpacing: 0.3,
                  color: art.accentInk,
                  background: art.accent,
                  borderRadius: 999,
                  padding: `${3 * scale}px ${9 * scale}px`,
                }}
              >
                Virtual · USD
              </span>
            </div>
          )}
          {/* printed face: nudge the footer to the very bottom */}
          {printed && <div style={{ flex: 1 }} />}

          {!printed && (
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 10 * scale,
              }}
            >
              <Chip scale={scale} />
              <Contactless color={art.ink} scale={scale} />
            </div>
          )}

          <div style={{ position: "relative" }}>
            {!printed && (
              <div
                style={{
                  fontSize: 17 * scale,
                  letterSpacing: 2.5 * scale,
                  fontWeight: 600,
                  fontVariantNumeric: "tabular-nums",
                  textShadow: art.kind === "image" ? "0 1px 8px rgba(0,0,0,0.5)" : "none",
                }}
              >
                ••••&nbsp;&nbsp;••••&nbsp;&nbsp;••••&nbsp;&nbsp;{last4}
              </div>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginTop: 8 * scale,
              }}
            >
              <div style={{ minWidth: 0 }}>
                {editionLabel && (
                  <div
                    style={{
                      fontSize: 8.5 * scale,
                      letterSpacing: 1.2,
                      textTransform: "uppercase",
                      color: art.sub,
                      fontWeight: 700,
                    }}
                  >
                    {editionLabel}
                  </div>
                )}
                <div
                  style={{
                    fontSize: 12.5 * scale,
                    fontWeight: 700,
                    color: art.ink,
                    textTransform: "uppercase",
                    letterSpacing: 0.6,
                    textShadow: imgShadow,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {name}
                </div>
                {printed && (
                  <div
                    style={{
                      fontSize: 11 * scale,
                      fontWeight: 600,
                      color: art.ink,
                      letterSpacing: 2 * scale,
                      fontVariantNumeric: "tabular-nums",
                      textShadow: imgShadow,
                      marginTop: 3 * scale,
                      opacity: 0.9,
                    }}
                  >
                    ••••&nbsp;{last4}
                  </div>
                )}
              </div>
              <span
                style={{
                  fontStyle: "italic",
                  fontWeight: 800,
                  fontSize: 16 * scale,
                  letterSpacing: -0.5,
                  color: art.ink,
                  textShadow: imgShadow,
                }}
              >
                VISA
              </span>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div
          style={{
            ...face,
            transform: "rotateY(180deg)",
            background:
              art.kind === "image"
                ? "linear-gradient(150deg, #12141C, #05070b)"
                : art.kind === "eclipse"
                  ? ECLIPSE_BG[art.mode]
                  : art.background,
            justifyContent: "flex-start",
            padding: 0,
          }}
        >
          {overlay && <span style={{ ...overlay, opacity: 0.35 }} />}
          <div
            style={{
              marginTop: 16 * scale,
              height: 34 * scale,
              background: "rgba(0,0,0,0.72)",
            }}
          />
          <div style={{ padding: `${14 * scale}px ${18 * scale}px 0` }}>
            <div
              style={{
                background: "rgba(255,255,255,0.9)",
                borderRadius: 5 * scale,
                height: 26 * scale,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingRight: 10 * scale,
                color: "#12141C",
                fontSize: 12 * scale,
                fontWeight: 700,
                fontVariantNumeric: "tabular-nums",
                letterSpacing: 1,
              }}
            >
              837
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 12 * scale,
                fontSize: 11 * scale,
                color: art.sub,
              }}
            >
              <span>
                Exp <b style={{ color: art.ink }}>08/29</b>
              </span>
              <span>
                CVV <b style={{ color: art.ink }}>•••</b>
              </span>
              <span style={{ color: art.accent, fontWeight: 800 }}>OneDosh</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
