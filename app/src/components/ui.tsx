import { useEffect, useRef, useState } from "react";
import { t } from "../theme";

export function DoshMark({ size = 34 }: { size?: number }) {
  return (
    <img
      src="/dosh-logo.png"
      alt="Dosh"
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        display: "block",
        flexShrink: 0,
      }}
    />
  );
}

// Distinct, on-brand gradient pairs. All are saturated/dark enough for white text.
const AVATAR_GRADIENTS: [string, string][] = [
  ["#2E79B5", "#173F73"], // blue
  ["#7B61FF", "#4B2FCC"], // violet
  ["#FF6A4D", "#C7381F"], // coral
  ["#10B981", "#0A7A5E"], // green
  ["#F5A623", "#B36B00"], // amber
  ["#EC4899", "#9D174D"], // pink
  ["#0EA5A5", "#0A6E6E"], // teal
  ["#141C33", "#33406A"], // navy
];

function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
}

// "Mike Alvarez" -> "MA", "@mike_edits" -> "MI", "Mum" -> "MU", "YouTube AdSense" -> "YA"
export function initialsFor(label: string) {
  const clean = label.replace(/^@/, "").replace(/[_\-.]/g, " ").trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return clean.slice(0, 2).toUpperCase();
}

export function Avatar({
  label,
  tone,
  src,
  size = 40,
  ring = false,
}: {
  label: string;
  /** Explicit solid color override. When omitted, a stable gradient is derived from the label. */
  tone?: string;
  /** Optional profile photo URL; falls back to initials on error/absence. */
  src?: string;
  size?: number;
  /** White ring — nice for overlapping stacks / stacked lists. */
  ring?: boolean;
}) {
  const [imgOk, setImgOk] = useState(true);
  // "+6" style overflow chips get a clean neutral treatment.
  const isOverflow = /^\+/.test(label.trim());
  const showImg = Boolean(src) && imgOk;
  const [g1, g2] = AVATAR_GRADIENTS[hashString(label) % AVATAR_GRADIENTS.length];

  const background = isOverflow
    ? "#EDEAE0"
    : tone
      ? tone
      : `linear-gradient(135deg, ${g1}, ${g2})`;

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        borderRadius: size / 2,
        background,
        color: isOverflow ? t.navy : "#fff",
        display: "grid",
        placeItems: "center",
        fontWeight: 700,
        fontSize: size * 0.38,
        letterSpacing: 0.2,
        flexShrink: 0,
        overflow: "hidden",
        border: isOverflow ? `1px solid ${t.border}` : "none",
        boxShadow: ring
          ? "0 0 0 2px #fff, 0 2px 6px rgba(20,28,51,0.18)"
          : "0 2px 6px rgba(20,28,51,0.14)",
      }}
    >
      {showImg ? (
        <img
          src={src}
          alt={label}
          onError={() => setImgOk(false)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        initialsFor(label)
      )}
      {!isOverflow && !showImg && (
        // subtle top highlight for depth
        <span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0) 55%)",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}

// Smoothly animates a number toward `value` — makes pots/totals feel alive.
export function CountUp({
  value,
  prefix = "",
  duration = 650,
  style,
}: {
  value: number;
  prefix?: string;
  duration?: number;
  style?: React.CSSProperties;
}) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const prog = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - prog, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (prog < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return (
    <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>
      {prefix}
      {display.toLocaleString()}
    </span>
  );
}

// Overlapping avatar row with an optional "+N" tail.
export function AvatarStack({
  people,
  size = 28,
  max = 4,
}: {
  people: { label: string; photo?: string }[];
  size?: number;
  max?: number;
}) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {shown.map((pp, i) => (
        <div key={i} style={{ marginLeft: i === 0 ? 0 : -(size * 0.34), zIndex: shown.length - i }}>
          <Avatar label={pp.label} src={pp.photo} size={size} ring />
        </div>
      ))}
      {extra > 0 && (
        <div
          style={{
            marginLeft: -(size * 0.34),
            width: size,
            height: size,
            borderRadius: size / 2,
            background: "#EDEAE0",
            color: t.navy,
            border: "2px solid #fff",
            display: "grid",
            placeItems: "center",
            fontSize: size * 0.34,
            fontWeight: 800,
            zIndex: 0,
          }}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}

export function LiveDot() {
  return (
    <span
      style={{
        width: 8,
        height: 8,
        borderRadius: 4,
        background: t.green,
        display: "inline-block",
        animation: "pulse 1.6s ease-in-out infinite",
      }}
    />
  );
}

export function Chip({
  label,
  onClick,
  tone = "light",
}: {
  label: string;
  onClick?: () => void;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <button
      onClick={onClick}
      style={{
        border: `1px solid ${dark ? t.navy : t.border}`,
        background: dark ? t.navy : "#fff",
        color: dark ? "#fff" : t.ink,
        borderRadius: 999,
        padding: "9px 14px",
        fontSize: 13,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

export function SectionLabel({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 0.4,
        textTransform: "uppercase",
        color: t.faint,
        margin: "6px 2px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
