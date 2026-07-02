import { t, display } from "../theme";
import { Ripple } from "./ui";
import type { Tab } from "../types";

const titles: Record<Tab, string> = {
  activity: "Explore",
  money: "Money",
  profile: "Profile",
};

export function Header({
  tab,
  onBack,
  title,
}: {
  tab: Tab;
  onBack?: () => void;
  title?: string;
}) {
  const heading = title ?? titles[tab];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 16px 10px",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
        {onBack && (
          <button
            onClick={onBack}
            title="Back"
            aria-label="Back"
            style={{
              position: "relative",
              overflow: "hidden",
              border: "none",
              background: "transparent",
              padding: 0,
              width: 38,
              height: 38,
              marginLeft: -8,
              borderRadius: 999,
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
              color: t.ink,
            }}
          >
            <BackArrow />
            <Ripple color="rgba(20,28,51,0.16)" />
          </button>
        )}
        <div
          style={{
            fontFamily: display,
            fontSize: onBack ? 22 : 27,
            fontWeight: 700,
            color: t.ink,
            letterSpacing: "-0.03em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {heading}
          <span style={{ color: t.coral }}>.</span>
        </div>
      </div>
    </div>
  );
}

// Material 3 top-app-bar navigation icon (leading back arrow).
function BackArrow() {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden style={{ display: "block" }}>
      <path
        d="M20 12H5M12 19l-7-7 7-7"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
