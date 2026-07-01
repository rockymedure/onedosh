import { t } from "../theme";

// iOS 26 iPhone status bar (Figma node 5465:16807).
// Icons are inlined as SVG so they don't rely on expiring Figma asset URLs.
export function StatusBar({ time = "9:41" }: { time?: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 26px 4px",
        color: t.ink,
      }}
    >
      <div
        style={{
          fontFamily: '-apple-system, "SF Pro Text", "Segoe UI", sans-serif',
          fontSize: 16,
          fontWeight: 600,
          letterSpacing: "-0.01em",
        }}
      >
        {time}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <Cellular />
        <Wifi />
        <Battery />
      </div>
    </div>
  );
}

function Cellular() {
  const bars = [4, 6.5, 9, 11.5];
  return (
    <svg width="19" height="12" viewBox="0 0 19 12" fill="none" aria-hidden>
      {bars.map((h, i) => (
        <rect
          key={i}
          x={i * 4.6}
          y={12 - h}
          width="3"
          height={h}
          rx="1"
          fill={t.ink}
        />
      ))}
    </svg>
  );
}

function Wifi() {
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" fill="none" aria-hidden>
      <path
        d="M8.5 2.2c2.9 0 5.6 1.1 7.6 3l-1.3 1.3A9 9 0 0 0 8.5 4.1 9 9 0 0 0 2.2 6.5L.9 5.2A11 11 0 0 1 8.5 2.2Z"
        fill={t.ink}
      />
      <path
        d="M8.5 5.9c1.9 0 3.6.7 4.9 2l-1.4 1.4a5 5 0 0 0-7 0L3.6 7.9A6.9 6.9 0 0 1 8.5 5.9Z"
        fill={t.ink}
      />
      <path d="M8.5 9.4c.9 0 1.7.4 2.3 1L8.5 12 6.2 10.4c.6-.6 1.4-1 2.3-1Z" fill={t.ink} />
    </svg>
  );
}

function Battery() {
  return (
    <svg width="27" height="13" viewBox="0 0 27 13" fill="none" aria-hidden>
      <rect
        x="0.5"
        y="0.9"
        width="23"
        height="11.2"
        rx="3.2"
        stroke={t.ink}
        strokeOpacity="0.4"
        fill="none"
      />
      <rect x="2" y="2.4" width="18" height="8.2" rx="2" fill={t.ink} />
      <path
        d="M25.2 4.3c.8.3 1.3 1.1 1.3 2.2s-.5 1.9-1.3 2.2V4.3Z"
        fill={t.ink}
        fillOpacity="0.4"
      />
    </svg>
  );
}
