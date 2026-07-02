import { t, display } from "../theme";
import { Avatar } from "../components/ui";
import { me } from "../data";

type IconName = "tag" | "card" | "globe" | "bell" | "lock" | "shield" | "chat" | "doc";
type Row = { icon: IconName; label: string; sub?: string; prompt?: string };

const GROUPS: { title: string; rows: Row[] }[] = [
  {
    title: "Account",
    rows: [
      { icon: "tag", label: "Your Dosh tag", sub: me.tag },
      { icon: "card", label: "Cards & banks", sub: "Manage linked cards" },
      { icon: "globe", label: "US receiving account", sub: "Get paid from abroad" },
    ],
  },
  {
    title: "Preferences",
    rows: [
      { icon: "bell", label: "Notifications" },
      { icon: "lock", label: "Security & PIN" },
      { icon: "shield", label: "Limits & verification" },
    ],
  },
  {
    title: "Support",
    rows: [
      { icon: "chat", label: "Ask Dosh for help", prompt: "I need help with my account" },
      { icon: "doc", label: "Terms & privacy" },
    ],
  },
];

// Stroke icons matching the tab-bar / header style (24-grid, currentColor).
function RowIcon({ name }: { name: IconName }) {
  const p = { stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  const paths: Record<IconName, React.ReactNode> = {
    tag: (
      <>
        <path d="M4 12.5V5.5A1.5 1.5 0 015.5 4h7l7.5 7.5a1.6 1.6 0 010 2.3l-5.2 5.2a1.6 1.6 0 01-2.3 0L4 12.5z" {...p} />
        <circle cx={8.5} cy={8.5} r={1.3} {...p} />
      </>
    ),
    card: (
      <>
        <rect x={3} y={5.5} width={18} height={13} rx={2.6} {...p} />
        <path d="M3 9.5h18" {...p} />
      </>
    ),
    globe: (
      <>
        <circle cx={12} cy={12} r={8.2} {...p} />
        <path d="M3.8 12h16.4M12 3.8c2.4 2.2 2.4 14 0 16.4-2.4-2.4-2.4-14 0-16.4z" {...p} />
      </>
    ),
    bell: (
      <>
        <path d="M6.5 10a5.5 5.5 0 0111 0c0 4 1.5 5.5 1.5 5.5H5s1.5-1.5 1.5-5.5z" {...p} />
        <path d="M10.2 19a2 2 0 003.6 0" {...p} />
      </>
    ),
    lock: (
      <>
        <rect x={4.5} y={10.5} width={15} height={9} rx={2.2} {...p} />
        <path d="M8 10.5V8a4 4 0 018 0v2.5" {...p} />
      </>
    ),
    shield: (
      <>
        <path d="M12 3.5l6.5 2.4v5c0 4.6-3 7.9-6.5 9.1-3.5-1.2-6.5-4.5-6.5-9.1v-5L12 3.5z" {...p} />
        <path d="M9.3 12l1.9 1.9L15 9.9" {...p} />
      </>
    ),
    chat: <path d="M20 12a7.5 7.5 0 01-10.8 6.7L4.5 20l1.3-4.4A7.5 7.5 0 1120 12z" {...p} />,
    doc: (
      <>
        <path d="M6.5 3.5h7l4 4v13a1 1 0 01-1 1H6.5a1 1 0 01-1-1v-16a1 1 0 011-1z" {...p} />
        <path d="M13 3.5v4.5h4.5M8.5 13h7M8.5 16.5h5" {...p} />
      </>
    ),
  };
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" aria-hidden style={{ display: "block" }}>
      {paths[name]}
    </svg>
  );
}

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
                <div style={{ width: 34, height: 34, borderRadius: 10, background: t.bg, display: "grid", placeItems: "center", color: t.navy, flexShrink: 0 }}>
                  <RowIcon name={r.icon} />
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
