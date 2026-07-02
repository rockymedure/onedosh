import { t, display } from "../theme";
import { me } from "../data";
import { Avatar, Ripple } from "./ui";
import type { Tab } from "../types";

const titles: Record<Tab, string> = {
  activity: "Explore",
  work: "Work",
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
      <button
        title="Profile"
        aria-label="Profile"
        style={{
          position: "relative",
          overflow: "hidden",
          border: "none",
          background: "transparent",
          padding: 3,
          borderRadius: 999,
          cursor: "pointer",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Avatar label={me.name} src={me.photo} size={34} />
        <Ripple color="rgba(20,28,51,0.16)" />
      </button>
    </div>
  );
}
