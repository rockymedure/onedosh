import { useState } from "react";
import { t, display, limeGlow } from "../theme";
import { Avatar, AvatarStack, CountUp, LiveDot, SectionLabel } from "../components/ui";
import { me } from "../data";
import { earnedBoost, faces, nairaShort, nextMilestone, p, type FeedEvent, type GamePool, type Squad } from "../social";
import { useLiveSocial } from "../useLiveSocial";

export function ActivityTab({
  justVerified = false,
  onOpenDosh,
}: {
  justVerified?: boolean;
  onOpenDosh: (prompt: string) => void;
}) {
  const live = useLiveSocial();

  if (justVerified) {
    return (
      <div style={{ overflowY: "auto", height: "100%", paddingBottom: 20 }}>
        <TagHero />
        <EmptyNetwork onOpenDosh={onOpenDosh} />
      </div>
    );
  }

  return (
    <div style={{ overflowY: "auto", height: "100%", paddingBottom: 20 }}>
      <TagHero />

      <SectionLabel>Active now — tap to pay</SectionLabel>
      <ActiveRail ids={live.onlineIds} onOpenDosh={onOpenDosh} />

      <SectionLabel>Your squads</SectionLabel>
      <div style={{ display: "flex", gap: 12, overflowX: "auto", padding: "2px 2px 8px", marginBottom: 4 }}>
        {live.squads.map((s) => (
          <SquadCard key={s.id} squad={s} onChip={() => live.chip(s.id, 5000)} onOpenDosh={onOpenDosh} />
        ))}
        <NewSquadCard onOpenDosh={onOpenDosh} />
      </div>

      <SectionLabel>Tonight's pool 🎮</SectionLabel>
      <GamePoolCard pool={live.pool} total={live.poolTotal} onOpenDosh={onOpenDosh} />

      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "18px 2px 8px" }}>
        <LiveDot />
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", color: t.faint }}>
          Live · your network
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {live.feed.map((e) => (
          <FeedRow key={e.id} event={e} onReact={(emoji) => live.react(e.id, emoji)} onOpenDosh={onOpenDosh} />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Tag hero */

function TagHero() {
  return (
    <div
      style={{
        background: `linear-gradient(120deg, ${t.lime}, #DCF77A)`,
        borderRadius: t.radiusInner,
        padding: "13px 15px",
        marginBottom: 14,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 12, color: "#5A6B1F", fontWeight: 700, letterSpacing: 0.3 }}>YOUR DOSH TAG</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: t.navy, fontFamily: display }}>{me.tag}</div>
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
    </div>
  );
}

/* ------------------------------------------------------------ Empty network */

function EmptyNetwork({ onOpenDosh }: { onOpenDosh: (p: string) => void }) {
  const rows = [
    { emoji: "⚡", title: "Live network", body: "See who's active and pay them in a tap." },
    { emoji: "💰", title: "Squads", body: "Group savings pots that earn yield with friends." },
    { emoji: "🎮", title: "Prediction pools", body: "Stake on match nights — winners split the pot." },
  ];
  return (
    <div
      style={{
        border: `1px solid ${t.border}`,
        background: "#fff",
        borderRadius: t.radiusCard,
        padding: 20,
        marginTop: 4,
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 54,
          height: 54,
          borderRadius: 27,
          margin: "0 auto",
          background: `linear-gradient(135deg, ${t.lime}, #DCF77A)`,
          display: "grid",
          placeItems: "center",
          fontSize: 26,
        }}
      >
        🌱
      </div>
      <div style={{ fontSize: 18, fontWeight: 800, color: t.ink, fontFamily: display, marginTop: 12 }}>
        Your network starts here
      </div>
      <p style={{ fontSize: 13.5, color: t.sub, lineHeight: 1.5, margin: "6px auto 0", maxWidth: 260 }}>
        Get paid or pay someone and they show up here. Squads, pools and a live feed unlock as your circle grows.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, textAlign: "left", margin: "18px 0" }}>
        {rows.map((r) => (
          <div key={r.title} style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: t.bg,
                display: "grid",
                placeItems: "center",
                fontSize: 20,
                flexShrink: 0,
              }}
            >
              {r.emoji}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: t.ink }}>{r.title}</div>
              <div style={{ fontSize: 12.5, color: t.sub, lineHeight: 1.4 }}>{r.body}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => onOpenDosh("I want to get paid")}
          style={{
            flex: 1,
            border: "none",
            background: t.lime,
            color: t.limeInk,
            borderRadius: 12,
            padding: "12px",
            fontSize: 14,
            fontWeight: 800,
            boxShadow: limeGlow,
            cursor: "pointer",
          }}
        >
          Get paid
        </button>
        <button
          onClick={() => onOpenDosh("I want to invite a friend to OneDosh")}
          style={{
            flex: 1,
            border: `1px solid ${t.border}`,
            background: "#fff",
            color: t.ink,
            borderRadius: 12,
            padding: "12px",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Invite a friend
        </button>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- Active rail */

function ActiveRail({ ids, onOpenDosh }: { ids: string[]; onOpenDosh: (p: string) => void }) {
  return (
    <div style={{ display: "flex", gap: 14, overflowX: "auto", padding: "2px 2px 10px" }}>
      {ids.map((id) => {
        const person = p(id);
        return (
          <button
            key={id}
            onClick={() => onOpenDosh(`Send money to ${person.tag}`)}
            style={{ border: "none", background: "transparent", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}
          >
            <div style={{ position: "relative" }}>
              <Avatar label={person.name} src={person.photo} ring />
              <span
                className="presence"
                style={{
                  position: "absolute",
                  bottom: 1,
                  right: 1,
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: t.green,
                  border: "2.5px solid #fff",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <span style={{ fontSize: 11, color: t.sub, fontWeight: 600 }}>{person.tag}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------- Squad card */

function SquadCard({ squad, onChip, onOpenDosh }: { squad: Squad; onChip: () => void; onOpenDosh: (p: string) => void }) {
  const pct = Math.min(100, Math.round((squad.pot / squad.goal) * 100));
  const earned = earnedBoost(squad);
  const next = nextMilestone(squad);
  return (
    <div
      style={{
        minWidth: 236,
        maxWidth: 236,
        background: "#fff",
        border: `1px solid ${t.border}`,
        borderRadius: t.radiusInner,
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            background: squad.tone,
            display: "grid",
            placeItems: "center",
            fontSize: 19,
            flexShrink: 0,
          }}
        >
          {squad.emoji}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14.5, fontWeight: 800, color: t.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {squad.name}
          </div>
          <div style={{ fontSize: 11.5, color: t.sub, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{squad.kind}</div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
        <CountUp value={squad.pot} prefix="₦" style={{ fontSize: 21, fontWeight: 800, color: squad.tone, fontFamily: display }} />
        <span style={{ fontSize: 12, color: t.faint, fontWeight: 600 }}>/ {nairaShort(squad.goal)}</span>
        {earned > 0 && (
          <span style={{ fontSize: 11, fontWeight: 800, color: t.limeInk, background: "rgba(207,242,63,0.4)", borderRadius: 999, padding: "2px 7px" }}>
            +{nairaShort(earned)} boost
          </span>
        )}
      </div>

      <div style={{ position: "relative", height: 8, marginTop: 2 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 6, background: "#EFEDE4", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, width: `${pct}%`, background: squad.tone, borderRadius: 6, transition: "width 0.6s cubic-bezier(0.2,0.9,0.3,1.2)" }} />
          <div className="shimmer" style={{ position: "absolute", inset: 0, width: `${pct}%`, borderRadius: 6 }} />
        </div>
        {squad.milestones.map((m) => {
          const left = Math.min(100, (m.at / squad.goal) * 100);
          const hit = squad.pot >= m.at;
          const isNext = !!next && m.at === next.at;
          return (
            <span
              key={m.at}
              className={isNext ? "boost-next" : undefined}
              title={`+${nairaShort(m.boost)} boost at ${nairaShort(m.at)}`}
              style={{
                position: "absolute",
                top: "50%",
                left: `${left}%`,
                transform: "translate(-50%,-50%)",
                width: 16,
                height: 16,
                borderRadius: 8,
                display: "grid",
                placeItems: "center",
                zIndex: 2,
                background: hit ? t.lime : "#fff",
                border: `1.5px solid ${hit || isNext ? t.limeInk : t.faint}`,
                boxShadow: hit
                  ? "0 0 0 3px rgba(207,242,63,0.45)"
                  : isNext
                  ? "0 0 0 3px rgba(207,242,63,0.3)"
                  : "0 1px 3px rgba(20,28,51,0.15)",
              }}
            >
              <BoltIcon color={hit || isNext ? t.limeInk : t.faint} />
            </span>
          );
        })}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, minHeight: 20 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 800, color: t.limeInk, background: t.lime, borderRadius: 999, padding: "3px 8px" }}>
          ⚡ {(squad.apy * 100).toFixed(1)}% APY
        </span>
        {next ? (
          <span style={{ fontSize: 11.5, color: t.sub, fontWeight: 700 }}>
            +{nairaShort(next.boost)} boost at {nairaShort(next.at)}
          </span>
        ) : (
          <span style={{ fontSize: 11.5, color: t.limeInk, fontWeight: 800 }}>Fully boosted 🎉</span>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: t.sub, minHeight: 16 }}>
        <LiveDot />
        <span style={{ fontWeight: 600 }}>{squad.note}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 2 }}>
        <AvatarStack people={faces(squad.members)} size={26} max={4} />
        <button
          onClick={() => {
            onChip();
            onOpenDosh(`Chip ₦5,000 into ${squad.name}`);
          }}
          style={{ border: "none", background: t.navy, color: "#fff", borderRadius: 999, padding: "8px 15px", fontSize: 13, fontWeight: 700 }}
        >
          Chip in
        </button>
      </div>
    </div>
  );
}

function NewSquadCard({ onOpenDosh }: { onOpenDosh: (p: string) => void }) {
  return (
    <button
      onClick={() => onOpenDosh("Start a new squad savings pot with my friends")}
      style={{
        minWidth: 132,
        background: "transparent",
        border: `1.5px dashed ${t.faint}`,
        borderRadius: t.radiusInner,
        padding: 14,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        color: t.sub,
      }}
    >
      <div style={{ width: 38, height: 38, borderRadius: 12, background: t.bg, display: "grid", placeItems: "center", fontSize: 22, fontWeight: 700, color: t.navy }}>+</div>
      <span style={{ fontSize: 13, fontWeight: 700 }}>New squad</span>
    </button>
  );
}

/* ------------------------------------------------------------ Game pool card */

const STAKE_PRESETS = [1_000, 2_000, 5_000, 10_000];

function GamePoolCard({ pool, total, onOpenDosh }: { pool: GamePool; total: number; onOpenDosh: (p: string) => void }) {
  const [sel, setSel] = useState<string | null>(null);
  const [stake, setStake] = useState<number>(pool.entry);

  const picked = pool.options.find((o) => o.id === sel) ?? null;
  // Parimutuel payout: if your side wins, winners split the whole pot in
  // proportion to their stake. Your take = stake / (side total) × (pot).
  const toWin = picked ? Math.round((stake / (picked.stake + stake)) * (total + stake)) : 0;
  const multiple = picked && stake > 0 ? toWin / stake : 0;

  return (
    <div
      style={{
        background: "linear-gradient(150deg, #1B2E52 0%, #141C33 55%, #101728 100%)",
        borderRadius: t.radiusCard,
        padding: 16,
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Confetti />
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, position: "relative" }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, fontFamily: display }}>{pool.title}</div>
          <div style={{ fontSize: 12, color: "#AEB8CC", marginTop: 2 }}>{pool.subtitle}</div>
        </div>
        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: t.navy, background: t.gold, borderRadius: 999, padding: "5px 9px", whiteSpace: "nowrap" }}>
          ⏳ {pool.closesIn}
        </span>
      </div>

      <div style={{ margin: "12px 0 4px", position: "relative" }}>
        <CountUp value={total} prefix="₦" style={{ display: "block", fontSize: 30, fontWeight: 800, color: t.lime, fontFamily: display, lineHeight: 1.1 }} />
        <span style={{ fontSize: 12.5, color: "#AEB8CC", fontWeight: 600 }}>in the pot · winner takes all</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10, position: "relative" }}>
        {pool.options.map((o) => {
          const pct = total > 0 ? Math.round((o.stake / total) * 100) : 0;
          const active = sel === o.id;
          return (
            <button
              key={o.id}
              onClick={() => setSel(o.id)}
              style={{
                border: active ? `1.5px solid ${t.lime}` : "1.5px solid transparent",
                textAlign: "left",
                background: active ? "rgba(207,242,63,0.15)" : "rgba(255,255,255,0.08)",
                borderRadius: 12,
                padding: "10px 12px",
                color: "#fff",
                position: "relative",
                overflow: "hidden",
                boxShadow: active ? "0 0 0 3px rgba(207,242,63,0.22)" : "none",
                transition: "background 0.15s, box-shadow 0.15s, border-color 0.15s",
              }}
            >
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${pct}%`, background: "rgba(207,242,63,0.14)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative" }}>
                <span style={{ fontSize: 18 }}>{o.flag}</span>
                <span style={{ fontSize: 13.5, fontWeight: 700, flex: 1 }}>{o.label}</span>
                <AvatarStack people={faces(o.backers)} size={22} max={3} />
                <span style={{ fontSize: 13, fontWeight: 800, color: t.lime, minWidth: 34, textAlign: "right" }}>{pct}%</span>
                <span
                  aria-hidden
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                    border: active ? `5px solid ${t.lime}` : "2px solid rgba(255,255,255,0.35)",
                    transition: "border 0.15s",
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {picked ? (
        <div style={{ marginTop: 14, position: "relative", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "#AEB8CC", fontWeight: 600 }}>Your stake</span>
            <span style={{ fontSize: 12, color: t.lime, fontWeight: 700 }}>
              {picked.flag} {picked.label}
            </span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {STAKE_PRESETS.map((a) => {
              const on = stake === a;
              return (
                <button
                  key={a}
                  onClick={() => setStake(a)}
                  style={{
                    flex: 1,
                    border: "none",
                    borderRadius: 10,
                    padding: "9px 0",
                    fontSize: 13,
                    fontWeight: 800,
                    background: on ? t.lime : "rgba(255,255,255,0.08)",
                    color: on ? t.limeInk : "#fff",
                    transition: "background 0.15s",
                  }}
                >
                  {nairaShort(a)}
                </button>
              );
            })}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: "#AEB8CC", fontWeight: 600 }}>
                To win {multiple >= 1.05 ? `· ${multiple.toFixed(2)}×` : ""}
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: t.lime, fontFamily: display, lineHeight: 1.1 }}>
                ₦{toWin.toLocaleString()}
              </div>
            </div>
            <button
              onClick={() =>
                onOpenDosh(
                  `Back ${picked.label} with ₦${stake.toLocaleString()} in the ${pool.title} pool — to win about ₦${toWin.toLocaleString()}`,
                )
              }
              style={{ border: "none", background: t.lime, color: t.limeInk, borderRadius: 999, padding: "12px 22px", fontSize: 14, fontWeight: 800, boxShadow: limeGlow, whiteSpace: "nowrap" }}
            >
              Place {nairaShort(stake)}
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, position: "relative" }}>
          <span style={{ fontSize: 12, color: "#AEB8CC" }}>Winner takes the pot · {nairaShort(pool.entry)} min</span>
          <span style={{ fontSize: 12, color: t.lime, fontWeight: 700 }}>Pick a side to bet ↑</span>
        </div>
      )}
    </div>
  );
}

// Boost marker glyph — a lightning bolt, tinted to match locked/unlocked state.
function BoltIcon({ color, size = 9 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden style={{ display: "block" }}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  );
}

function Confetti() {
  const bits = ["#CFF23F", "#F5C542", "#FF6A4D", "#7B61FF", "#2E79B5"];
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {Array.from({ length: 14 }).map((_, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            top: -10,
            left: `${(i * 7 + 4) % 100}%`,
            width: 6,
            height: 9,
            background: bits[i % bits.length],
            borderRadius: 1,
            opacity: 0.7,
            animation: `fall ${2.6 + (i % 5) * 0.5}s linear ${(i % 7) * 0.4}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ Feed row */

function FeedRow({ event, onReact, onOpenDosh }: { event: FeedEvent; onReact: (emoji: string) => void; onOpenDosh: (p: string) => void }) {
  const actor = p(event.actor);
  const [bursts, setBursts] = useState<{ id: number; emoji: string }[]>([]);

  function react(emoji: string) {
    onReact(emoji);
    const id = Date.now() + Math.random();
    setBursts((b) => [...b, { id, emoji }]);
    setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 850);
  }

  const canPay = event.kind === "request" || event.kind === "send" || event.kind === "split";

  return (
    <div
      className={event.fresh ? "feed-fresh" : undefined}
      style={{
        position: "relative",
        display: "flex",
        gap: 11,
        background: "#fff",
        border: `1px solid ${t.border}`,
        borderLeft: event.fresh ? `3px solid ${event.tone}` : `1px solid ${t.border}`,
        borderRadius: 16,
        padding: "11px 12px",
      }}
    >
      <div style={{ position: "relative", flexShrink: 0 }}>
        <Avatar label={actor.name} src={actor.photo} size={40} />
        <span
          style={{
            position: "absolute",
            bottom: -3,
            right: -3,
            width: 20,
            height: 20,
            borderRadius: 10,
            background: "#fff",
            display: "grid",
            placeItems: "center",
            fontSize: 11,
            boxShadow: "0 1px 4px rgba(20,28,51,0.2)",
          }}
        >
          {event.emoji}
        </span>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, color: t.ink, lineHeight: 1.35 }}>
          <b style={{ fontWeight: 800 }}>{actor.name}</b>{" "}
          <span style={{ color: t.sub }}>{event.text}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 7, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: t.faint, marginRight: 2 }}>{event.ago}</span>
          {event.reactions.map((r) => (
            <button
              key={r.emoji}
              onClick={() => react(r.emoji)}
              style={{
                border: `1px solid ${t.border}`,
                background: t.bg,
                borderRadius: 999,
                padding: "3px 8px",
                fontSize: 12,
                fontWeight: 700,
                color: t.ink,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span>{r.emoji}</span>
              <span style={{ color: t.sub }}>{r.count}</span>
            </button>
          ))}
          <button
            onClick={() => react("🔥")}
            style={{ border: `1px dashed ${t.faint}`, background: "transparent", borderRadius: 999, width: 26, height: 24, fontSize: 13, color: t.sub, display: "grid", placeItems: "center" }}
          >
            +
          </button>
          {canPay && (
            <button
              onClick={() => onOpenDosh(payPrompt(event))}
              style={{ marginLeft: "auto", border: "none", background: t.navy, color: "#fff", borderRadius: 999, padding: "5px 12px", fontSize: 12, fontWeight: 700 }}
            >
              {event.kind === "request" ? "Pay" : "Send back"}
            </button>
          )}
        </div>
      </div>

      {bursts.map((b) => (
        <span key={b.id} className="burst" style={{ position: "absolute", left: 30, bottom: 14, fontSize: 20, pointerEvents: "none" }}>
          {b.emoji}
        </span>
      ))}
    </div>
  );
}

function payPrompt(e: FeedEvent) {
  const actor = p(e.actor);
  if (e.kind === "request") return `Pay ${actor.name} the ${e.amount ? nairaShort(e.amount) : ""} they requested`;
  if (e.kind === "split") return `Send ${actor.name} my share of ${e.amount ? nairaShort(e.amount) : "the split"}`;
  return `Send money back to ${actor.name}`;
}
