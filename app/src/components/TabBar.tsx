import { t } from "../theme";
import { DoshMark } from "./ui";
import type { Tab } from "../types";

// iOS 26 "Liquid Glass" tab bar (Figma node 3:70967) — a floating frosted pill.
// Icon-only: Activity, the Dosh logo, and Money.
export function TabBar({ tab, onSelect }: { tab: Tab; onSelect: (t: Tab) => void }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "12px 25px 22px" }}>
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
          <span style={{ fontSize: 22, lineHeight: "44px" }}>◎</span>
        </TabItem>
        <TabItem label="Dosh" active={tab === "dosh"} onClick={() => onSelect("dosh")}>
          <DoshMark size={30} />
        </TabItem>
        <TabItem label="Money" active={tab === "money"} onClick={() => onSelect("money")}>
          <span style={{ fontSize: 22, lineHeight: "44px" }}>◧</span>
        </TabItem>
      </div>
    </div>
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
