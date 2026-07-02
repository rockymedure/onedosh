import { m3 } from "../theme";

// Android (Material 3) status bar.
// Clock sits on the left (Android convention); the right cluster carries the
// system icons — mobile signal, Wi-Fi and a portrait battery. Icons are inlined
// SVG so they don't depend on expiring Figma asset URLs.
export function StatusBar({ time = "9:41", battery = 84 }: { time?: string; battery?: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "calc(10px + env(safe-area-inset-top)) 16px 4px",
        color: m3.onSurface,
        height: "auto",
      }}
    >
      <div
        style={{
          fontFamily: 'Roboto, "Segoe UI", -apple-system, sans-serif',
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: "0.1px",
        }}
      >
        {time}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Signal />
        <Wifi />
        <BatteryPct pct={battery} />
      </div>
    </div>
  );
}

// Android signal — a solid ascending "staircase" of bars.
function Signal() {
  const bars = [
    { x: 0, h: 4 },
    { x: 4, h: 6.5 },
    { x: 8, h: 9 },
    { x: 12, h: 11.5 },
  ];
  return (
    <svg width="15" height="12" viewBox="0 0 15 12" fill="none" aria-hidden>
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y={12 - b.h} width="3" height={b.h} rx="0.6" fill="currentColor" />
      ))}
    </svg>
  );
}

// Android Wi-Fi — a filled fan (sector) with a small dot at the base.
function Wifi() {
  return (
    <svg width="15" height="12" viewBox="0 0 15 12" fill="none" aria-hidden>
      <path
        d="M7.5 1.2C10.4 1.2 13 2.4 14.8 4.3L7.5 12 0.2 4.3C2 2.4 4.6 1.2 7.5 1.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Android battery — portrait cell with a top nub, plus a percentage label.
function BatteryPct({ pct }: { pct: number }) {
  const clamped = Math.max(0, Math.min(100, pct));
  const fillH = (7.8 * clamped) / 100;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
      <span
        style={{
          fontFamily: 'Roboto, "Segoe UI", -apple-system, sans-serif',
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.1px",
        }}
      >
        {clamped}%
      </span>
      <svg width="9" height="14" viewBox="0 0 9 14" fill="none" aria-hidden>
        <rect x="3" y="0" width="3" height="1.8" rx="0.6" fill="currentColor" />
        <rect
          x="0.6"
          y="1.8"
          width="7.8"
          height="11.6"
          rx="1.8"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
        />
        <rect
          x="1.8"
          y={3 + (7.8 - fillH)}
          width="5.4"
          height={fillH}
          rx="0.8"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
