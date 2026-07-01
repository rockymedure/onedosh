import { t, glass, glassBorder, glassDark } from "../theme";
import { Avatar, LiveDot, SectionLabel, Chip } from "../components/ui";
import { flows, activeNow, me, type Flow } from "../data";

export function ActivityTab({ onOpenDosh }: { onOpenDosh: (prompt: string) => void }) {
  return (
    <div style={{ overflowY: "auto", height: "100%", paddingBottom: 8 }}>
      <TagStrip />

      <SectionLabel>Active now</SectionLabel>
      <div style={{ display: "flex", gap: 14, overflowX: "auto", padding: "2px 2px 8px" }}>
        {activeNow.map((p) => (
          <div key={p.tag} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <div style={{ position: "relative" }}>
              <Avatar label={p.tag} src={p.photo} ring />
              {!p.tag.startsWith("+") && (
                <span style={{ position: "absolute", bottom: -1, right: -1, border: "2px solid #fff", borderRadius: 6 }}>
                  <LiveDot />
                </span>
              )}
            </div>
            <span style={{ fontSize: 11, color: t.sub }}>{p.tag}</span>
          </div>
        ))}
      </div>

      <SectionLabel>Your flows</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {flows.map((f) => (
          <FlowRow key={f.tag} flow={f} onOpenDosh={onOpenDosh} />
        ))}
      </div>

      <SectionLabel>Connect</SectionLabel>
      <div
        style={{
          ...glassDark,
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: t.radiusCard,
          padding: 16,
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: -30,
            right: -20,
            width: 120,
            height: 120,
            borderRadius: 60,
            background: t.lime,
            opacity: 0.22,
            filter: "blur(24px)",
          }}
        />
        <div style={{ fontSize: 15, fontWeight: 700 }}>12 creators at Lead City joined this week</div>
        <div style={{ fontSize: 13, color: "#C7CEDB", marginTop: 4, lineHeight: 1.4 }}>
          People you send to and receive from are on Dosh. Find them by @tag.
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <Chip label="Find by @tag" tone="light" />
          <Chip label="Invite a friend" tone="light" />
        </div>
      </div>
    </div>
  );
}

function TagStrip() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: t.lime,
        borderRadius: t.radiusInner,
        padding: "12px 14px",
        marginBottom: 14,
      }}
    >
      <div>
        <div style={{ fontSize: 12, color: "#5A6B1F", fontWeight: 700 }}>YOUR DOSH TAG</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: t.navy }}>{me.tag}</div>
      </div>
      <button
        style={{
          border: "none",
          background: t.navy,
          color: "#fff",
          borderRadius: 999,
          padding: "9px 16px",
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        Share tag
      </button>
    </div>
  );
}

function FlowRow({ flow, onOpenDosh }: { flow: Flow; onOpenDosh: (p: string) => void }) {
  const tone =
    flow.direction === "in" ? t.green : flow.direction === "out" ? t.navy : t.gold;
  const arrow = flow.direction === "in" ? "↓" : flow.direction === "out" ? "↑" : "≈";
  return (
    <button
      onClick={() =>
        onOpenDosh(
          flow.direction === "in"
            ? `Tell me about the money coming from ${flow.name}`
            : `I want to handle ${flow.name}`,
        )
      }
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        ...glass,
        border: glassBorder,
        borderRadius: t.radiusInner,
        padding: 12,
        textAlign: "left",
        width: "100%",
      }}
    >
      <Avatar label={flow.name} src={flow.photo} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 14.5, fontWeight: 700, color: t.ink }}>{flow.name}</span>
          {flow.live && <LiveDot />}
        </div>
        <div style={{ fontSize: 13, color: t.sub }}>{flow.line}</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: tone }}>{arrow}</div>
        <div style={{ fontSize: 11, color: t.faint }}>{flow.meta}</div>
      </div>
    </button>
  );
}
