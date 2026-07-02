import { m3, font, t as tokens } from "../theme";
import { Avatar, Ripple } from "./ui";
import { me } from "../data";
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
        label="Explore"
        active={tab === "activity"}
        onClick={() => onSelect("activity")}
        icon={(a) => <ActivityIcon active={a} />}
      />
      <NavItem
        label="Money"
        active={tab === "money"}
        onClick={() => onSelect("money")}
        icon={(a) => <MoneyIcon active={a} />}
      />
      <NavItem
        label="Profile"
        active={tab === "profile"}
        onClick={() => onSelect("profile")}
        icon={(a) => <ProfileIcon active={a} />}
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
        position: "relative",
        overflow: "hidden",
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
      <Ripple color="rgba(20,28,51,0.14)" />
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

// Profile — the user's own avatar, ringed in lime when active.
function ProfileIcon({ active }: { active: boolean }) {
  return (
    <div
      style={{
        width: 26,
        height: 26,
        borderRadius: 13,
        display: "grid",
        placeItems: "center",
        boxShadow: active ? `0 0 0 2px ${tokens.lime}` : "none",
      }}
    >
      <Avatar label={me.name} src={me.photo} size={24} />
    </div>
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
