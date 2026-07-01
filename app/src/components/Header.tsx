import { t, display } from "../theme";
import { me } from "../data";
import { Avatar } from "./ui";
import type { Tab } from "../types";

const titles: Record<Tab, string> = {
  activity: "Activity",
  dosh: "Dosh",
  money: "Money",
};

export function Header({ tab }: { tab: Tab }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 16px 10px",
      }}
    >
      <div
        style={{
          fontFamily: display,
          fontSize: 27,
          fontWeight: 700,
          color: t.ink,
          letterSpacing: "-0.03em",
        }}
      >
        {titles[tab]}
        <span style={{ color: t.coral }}>.</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <IconButton label="Alerts" />
        <button
          title="Profile"
          style={{ border: "none", background: "transparent", padding: 0, cursor: "pointer" }}
        >
          <Avatar label={me.name} src={me.photo} size={34} />
        </button>
      </div>
    </div>
  );
}

function IconButton({ label }: { label: string }) {
  return (
    <button
      title={label}
      style={{
        width: 34,
        height: 34,
        borderRadius: 17,
        border: `1px solid ${t.border}`,
        background: "#fff",
        display: "grid",
        placeItems: "center",
        position: "relative",
      }}
    >
      <span style={{ fontSize: 15 }}>🔔</span>
      <span
        style={{
          position: "absolute",
          top: 7,
          right: 8,
          width: 7,
          height: 7,
          borderRadius: 4,
          background: t.red,
        }}
      />
    </button>
  );
}
