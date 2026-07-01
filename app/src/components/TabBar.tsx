import { t } from "../theme";
import { DoshMark } from "./ui";
import type { Tab } from "../types";

// iOS 26 "Liquid Glass" tab bar (Figma node 3:70967) — a floating frosted pill.
// Icon-only: Activity, the Dosh logo, and Money. Active tab gets a lime pill.
export function TabBar({ tab, onSelect }: { tab: Tab; onSelect: (t: Tab) => void }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "6px 16px 16px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: 6,
          borderRadius: 296,
          background: "rgba(255,255,255,0.65)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
          border: "1px solid rgba(255,255,255,0.6)",
        }}
      >
        <TabItem label="Activity" active={tab === "activity"} onClick={() => onSelect("activity")}>
          <ActivityIcon active={tab === "activity"} />
        </TabItem>
        <TabItem label="Dosh" active={tab === "dosh"} onClick={() => onSelect("dosh")}>
          <DoshMark size={30} />
        </TabItem>
        <TabItem label="Money" active={tab === "money"} onClick={() => onSelect("money")}>
          <MoneyIcon active={tab === "money"} />
        </TabItem>
      </div>
    </div>
  );
}

// A live "pulse" waveform for Activity, with a lime beat dot.
function ActivityIcon({ active }: { active: boolean }) {
  return (
    <svg width={25} height={25} viewBox="0 0 24 24" fill="none" style={{ display: "block" }}>
      <path
        d="M2.5 12.5H7l2.2-6 3.4 11 2.4-5H21.5"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={9.2} cy={6.5} r={1.7} fill={t.lime} stroke="#fff" strokeWidth={0.6} className={active ? "coin-alive" : undefined} />
    </svg>
  );
}

// A centered wallet for Money, with a lime coin that glows when active.
function MoneyIcon({ active }: { active: boolean }) {
  return (
    <svg width={25} height={25} viewBox="0 0 24 24" fill="none" style={{ display: "block" }}>
      <rect x={3} y={6} width={18} height={12.5} rx={3.4} stroke="currentColor" strokeWidth={2} />
      <path d="M3 10.2H21" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      <circle cx={16.4} cy={14.4} r={1.9} fill={t.lime} stroke="#fff" strokeWidth={0.6} className={active ? "coin-alive" : undefined} />
    </svg>
  );
}

function TabItem({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      style={{
        position: "relative",
        border: "none",
        background: "none",
        width: 44,
        height: 44,
        display: "grid",
        placeItems: "center",
        cursor: "pointer",
        color: active ? t.navy : t.faint,
      }}
    >
      {active && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 22,
            background: "rgba(20,28,51,0.08)",
          }}
        />
      )}
      <span style={{ position: "relative", display: "grid", placeItems: "center" }}>{children}</span>
    </button>
  );
}
