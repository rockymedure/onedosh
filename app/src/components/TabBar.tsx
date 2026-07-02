import { m3, font } from "../theme";
import { DoshMark } from "./ui";
import type { Tab } from "../types";

// Material 3 (Android) Navigation Bar.
// Full-width, anchored to the bottom, resting on a surface-container tone.
// Each destination shows an icon + always-on label; the active destination
// gets a pill-shaped "active indicator" (secondary container) behind a filled
// icon. This replaces the earlier iOS "Liquid Glass" floating pill.
export function TabBar({ tab, onSelect }: { tab: Tab; onSelect: (t: Tab) => void }) {
  return (
    <nav
      role="navigation"
      style={{
        display: "flex",
        alignItems: "stretch",
        background: m3.surfaceContainer,
        borderTop: `1px solid ${m3.outlineVariant}`,
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <NavItem
        label="Activity"
        active={tab === "activity"}
        onClick={() => onSelect("activity")}
        icon={(a) => <ActivityIcon active={a} />}
      />
      <NavItem
        label="Work"
        active={tab === "work"}
        onClick={() => onSelect("work")}
        icon={(a) => <WorkIcon active={a} />}
      />
      <NavItem
        label="Dosh"
        active={tab === "dosh"}
        onClick={() => onSelect("dosh")}
        icon={() => <DoshMark size={24} />}
      />
      <NavItem
        label="Money"
        active={tab === "money"}
        onClick={() => onSelect("money")}
        icon={(a) => <MoneyIcon active={a} />}
      />
    </nav>
  );
}

function NavItem({
  label,
  active,
  onClick,
  icon,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: (active: boolean) => React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      title={label}
      style={{
        flex: 1,
        border: "none",
        background: "none",
        cursor: "pointer",
        height: m3.navHeight,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        padding: "12px 0 16px",
        color: active ? m3.onSecondaryContainer : m3.onSurfaceVariant,
      }}
    >
      <span
        aria-hidden
        style={{
          position: "relative",
          width: m3.navIndicatorW,
          height: m3.navIndicatorH,
          display: "grid",
          placeItems: "center",
          borderRadius: m3.navIndicatorH / 2,
          background: active ? m3.secondaryContainer : "transparent",
          transition: "background 180ms ease",
        }}
      >
        {icon(active)}
      </span>
      <span
        style={{
          fontFamily: font,
          fontSize: 12,
          lineHeight: "16px",
          letterSpacing: "0.1px",
          fontWeight: active ? 700 : 500,
          color: active ? m3.onSurface : m3.onSurfaceVariant,
        }}
      >
        {label}
      </span>
    </button>
  );
}

// Activity — a pulse waveform. Stroke weight thickens when active.
function ActivityIcon({ active }: { active: boolean }) {
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

// Work — a briefcase. Fills (Material "filled" variant) when active.
function WorkIcon({ active }: { active: boolean }) {
  if (active) {
    return (
      <svg width={24} height={24} viewBox="0 0 24 24" fill="none" style={{ display: "block" }}>
        <rect x={2.5} y={7.5} width={19} height={12} rx={3} fill="currentColor" />
        <path
          d="M9 7.5V6.2A2 2 0 0111 4.2h2a2 2 0 012 2v1.3"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <path d="M2.5 12.5H21.5" stroke={m3.secondaryContainer} strokeWidth={2} strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" style={{ display: "block" }}>
      <rect x={2.5} y={7.5} width={19} height={12} rx={3} stroke="currentColor" strokeWidth={2} />
      <path
        d="M9 7.5V6.2A2 2 0 0111 4.2h2a2 2 0 012 2v1.3"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <path d="M2.5 12.5H21.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

// Money — a wallet. Fills (Material "filled" variant) when active.
function MoneyIcon({ active }: { active: boolean }) {
  if (active) {
    return (
      <svg width={24} height={24} viewBox="0 0 24 24" fill="none" style={{ display: "block" }}>
        <rect x={3} y={6} width={18} height={12.5} rx={3.4} fill="currentColor" />
        <circle cx={17.4} cy={13.5} r={1.5} fill={m3.secondaryContainer} />
      </svg>
    );
  }
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" style={{ display: "block" }}>
      <rect x={3} y={6} width={18} height={12.5} rx={3.4} stroke="currentColor" strokeWidth={2} />
      <path d="M3 10.2H21" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      <path
        d="M15 12.2h4a1.4 1.4 0 011.4 1.4v0a1.4 1.4 0 01-1.4 1.4h-4z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </svg>
  );
}
