import { t, display } from "../theme";
import { Avatar } from "../components/ui";
import { me } from "../data";

type Row = { icon: string; label: string; sub?: string; prompt?: string };

const GROUPS: { title: string; rows: Row[] }[] = [
  {
    title: "Account",
    rows: [
      { icon: "🏷️", label: "Your Dosh tag", sub: me.tag },
      { icon: "💳", label: "Cards & banks", sub: "Manage linked cards" },
      { icon: "🌍", label: "US receiving account", sub: "Get paid from abroad" },
    ],
  },
  {
    title: "Preferences",
    rows: [
      { icon: "🔔", label: "Notifications" },
      { icon: "🔒", label: "Security & PIN" },
      { icon: "🎯", label: "Limits & verification" },
    ],
  },
  {
    title: "Support",
    rows: [
      { icon: "💬", label: "Ask Dosh for help", prompt: "I need help with my account" },
      { icon: "📄", label: "Terms & privacy" },
    ],
  },
];

type Mode = "new" | "returning";

export function ProfileTab({
  onOpenDosh,
  mode,
  onMode,
}: {
  onOpenDosh: (prompt: string) => void;
  mode: Mode;
  onMode: (m: Mode) => void;
}) {
  return (
    <div style={{ height: "100%", overflowY: "auto", paddingBottom: 24 }}>
      {/* Identity */}
      <div
        style={{
          background: `linear-gradient(135deg, ${t.lime} 0%, #DCF77A 100%)`,
          borderRadius: t.radiusCard,
          padding: "22px 18px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 16,
        }}
      >
        <Avatar label={me.name} src={me.photo} size={64} ring />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: t.navy, fontFamily: display, letterSpacing: "-0.02em" }}>
            {me.name}
          </div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "#5A6B1F" }}>{me.tag}</div>
        </div>
      </div>

      {/* Prototype control: swap between a cold-start and returning persona. */}
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 0.5,
            textTransform: "uppercase",
            color: t.faint,
            margin: "0 2px 8px",
          }}
        >
          Prototype
        </div>
        <div style={{ background: "#fff", border: `1px solid ${t.border}`, borderRadius: t.radiusInner, padding: 14 }}>
          <div style={{ fontSize: 14.5, fontWeight: 700, color: t.ink }}>Account state</div>
          <div style={{ fontSize: 12.5, color: t.sub, marginTop: 2, marginBottom: 12 }}>
            Preview the app as a brand-new or a returning user.
          </div>
          <div
            style={{
              display: "flex",
              gap: 4,
              background: t.bg,
              border: `1px solid ${t.border}`,
              borderRadius: 999,
              padding: 4,
            }}
          >
            {([
              { id: "new", label: "Just verified" },
              { id: "returning", label: "Returning" },
            ] as { id: Mode; label: string }[]).map((opt) => {
              const on = mode === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => onMode(opt.id)}
                  aria-pressed={on}
                  style={{
                    flex: 1,
                    border: "none",
                    borderRadius: 999,
                    padding: "9px 0",
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: "pointer",
                    background: on ? t.navy : "transparent",
                    color: on ? "#fff" : t.sub,
                    transition: "background 150ms ease, color 150ms ease",
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {GROUPS.map((g) => (
        <div key={g.title} style={{ marginBottom: 16 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              color: t.faint,
              margin: "0 2px 8px",
            }}
          >
            {g.title}
          </div>
          <div style={{ background: "#fff", border: `1px solid ${t.border}`, borderRadius: t.radiusInner, overflow: "hidden" }}>
            {g.rows.map((r, i) => (
              <button
                key={r.label}
                onClick={() => r.prompt && onOpenDosh(r.prompt)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  border: "none",
                  background: "transparent",
                  borderTop: i === 0 ? "none" : `1px solid ${t.border}`,
                  padding: "13px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  cursor: "pointer",
                }}
              >
                <div style={{ width: 34, height: 34, borderRadius: 10, background: t.bg, display: "grid", placeItems: "center", fontSize: 17, flexShrink: 0 }}>
                  {r.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: t.ink }}>{r.label}</div>
                  {r.sub && <div style={{ fontSize: 12.5, color: t.sub, marginTop: 1 }}>{r.sub}</div>}
                </div>
                <span style={{ color: t.faint, fontSize: 18, fontWeight: 400 }}>›</span>
              </button>
            ))}
          </div>
        </div>
      ))}

      <button
        style={{
          width: "100%",
          border: `1px solid ${t.border}`,
          background: "#fff",
          color: t.red,
          borderRadius: t.radiusInner,
          padding: "13px",
          fontSize: 14.5,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Sign out
      </button>
    </div>
  );
}
