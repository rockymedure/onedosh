import { useState } from "react";
import { t, glass, glassBorder, limeGlow } from "../theme";
import { Avatar } from "../components/ui";
import { photoFor } from "../data";
import type { DoshCard, DoshEffect } from "../types";

export function CardStack({
  cards,
  onAction,
  onEffect,
}: {
  cards?: DoshCard[];
  onAction: (text: string) => void;
  onEffect?: (effect: DoshEffect) => void;
}) {
  if (!cards || cards.length === 0) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
      {cards.map((c, i) => (
        <CardView key={i} card={c} onAction={onAction} onEffect={onEffect} />
      ))}
    </div>
  );
}

function Shell({ children, accent }: { children: React.ReactNode; accent?: string }) {
  return (
    <div
      className="dosh-enter"
      style={{
        ...glass,
        border: glassBorder,
        borderLeft: accent ? `3px solid ${accent}` : glassBorder,
        borderRadius: t.radiusInner,
        padding: 14,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

function Row({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0" }}>
      <span style={{ color: t.sub, fontSize: 13 }}>{k}</span>
      <span style={{ color: t.ink, fontSize: 13, fontWeight: strong ? 800 : 600 }}>{v}</span>
    </div>
  );
}

function CardView({
  card,
  onAction,
  onEffect,
}: {
  card: DoshCard;
  onAction: (text: string) => void;
  onEffect?: (effect: DoshEffect) => void;
}) {
  const [done, setDone] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [shareState, setShareState] = useState<null | "shared" | "copied">(null);

  if (card.type === "receive_usd") {
    const details = [
      card.accountHolder && `Name: ${card.accountHolder}`,
      `Bank: ${card.bank || "Lead Bank"}`,
      card.accountNumber && `Account: ${card.accountNumber}`,
      card.routingNumber && `Routing: ${card.routingNumber}`,
    ]
      .filter(Boolean)
      .join("\n");
    const shareText = card.shareMessage || `Pay me here 👇\n${details}`;
    return (
      <Shell accent={t.green}>
        <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 8 }}>
          Your US account for getting paid
        </div>
        <Row k="Account name" v={card.accountHolder || "—"} />
        <Row k="Bank" v={card.bank || "Lead Bank"} />
        <Row k="Account no." v={card.accountNumber || "••••"} strong />
        <Row k="Routing no." v={card.routingNumber || "••••"} />
        {card.shareMessage && (
          <div
            style={{
              marginTop: 10,
              background: "rgba(20,28,51,0.05)",
              borderRadius: 10,
              padding: 10,
              fontSize: 12.5,
              color: t.sub,
              lineHeight: 1.4,
            }}
          >
            {card.shareMessage}
          </div>
        )}
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <Primary
            label={copied ? "Copied ✓" : "Copy details"}
            onClick={async () => {
              await copyText(details);
              setCopied(true);
              setTimeout(() => setCopied(false), 1800);
            }}
          />
          <Ghost
            label={shareState === "shared" ? "Shared ✓" : shareState === "copied" ? "Copied ✓" : "Share"}
            onClick={async () => {
              const res = await systemShare(shareText, "Get paid on OneDosh");
              if (res !== "cancelled") {
                setShareState(res);
                setTimeout(() => setShareState(null), 1800);
              }
            }}
          />
        </div>
      </Shell>
    );
  }

  if (card.type === "confirm") {
    const action = card.action || "send";
    const cta: Record<string, string> = {
      send: "Confirm & send",
      convert: "Confirm",
      hold: "Confirm",
      stake: "Place bet",
      chip: "Chip in",
      join: "Join",
    };
    const doneTitle: Record<string, string> = {
      send: "Sent ✓",
      convert: "Converted ✓",
      hold: "Done ✓",
      stake: "Bet placed 🎯",
      chip: "Chipped in ✓",
      join: "You're in ✓",
    };
    const doneSub: Record<string, string> = {
      stake: "Good luck — I'll watch the result.",
      chip: "Nice one. Pot's climbing.",
      join: "You're on the board.",
    };
    if (done) {
      return (
        <Shell accent={t.green}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {card.recipient && <Avatar label={card.recipient} src={photoFor(card.recipient)} size={36} />}
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: t.ink }}>
                {doneTitle[action] || "Done ✓"}
              </div>
              <div style={{ color: t.sub, fontSize: 13 }}>
                {doneSub[action] || (card.recipient ? `${card.recipient} will be notified.` : "All set.")}
              </div>
            </div>
          </div>
        </Shell>
      );
    }
    return (
      <Shell accent={t.navy}>
        <div style={{ fontWeight: 800, fontSize: 14, marginBottom: card.recipient ? 10 : 8 }}>
          {card.title || (action === "send" ? "Confirm send" : "Confirm")}
        </div>
        {card.recipient && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <Avatar label={card.recipient} src={photoFor(card.recipient)} size={36} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: t.ink }}>{card.recipient}</div>
              <div style={{ fontSize: 12, color: t.sub }}>{action === "send" ? "Recipient" : "Contact"}</div>
            </div>
          </div>
        )}
        {card.fromLabel && <Row k="From" v={card.fromLabel} />}
        {card.toLabel && <Row k="To" v={card.toLabel} />}
        {card.rateLabel && <Row k="Rate" v={card.rateLabel} />}
        {card.feeLabel && <Row k="Fee" v={card.feeLabel} />}
        {card.note && (
          <div style={{ marginTop: 8, fontSize: 12.5, fontWeight: 700, color: t.limeInk, background: "rgba(207,242,63,0.4)", borderRadius: 10, padding: "8px 10px" }}>
            {card.note}
          </div>
        )}
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <Primary
            label={cta[action] || "Confirm"}
            onClick={() => {
              setDone("ok");
              // Money moves only on this explicit tap — apply the gated effect now.
              if (card.effect && onEffect) onEffect(card.effect);
              onAction(`Confirmed: ${card.title || action}`);
            }}
          />
          <Ghost label="Not now" onClick={() => onAction("Not now")} />
        </div>
      </Shell>
    );
  }

  if (card.type === "scam_warning") {
    return (
      <Shell accent={t.red}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <span style={{ fontSize: 16 }}>⚠️</span>
          <span style={{ fontWeight: 800, fontSize: 14, color: t.red }}>Heads up</span>
        </div>
        <div style={{ color: t.ink, fontSize: 13, lineHeight: 1.45 }}>{card.reason}</div>
        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          {(card.options || ["Hold 24h", "Report", "Ignore"]).map((o) => (
            <Ghost key={o} label={o} onClick={() => onAction(o)} />
          ))}
        </div>
      </Shell>
    );
  }

  // status
  return (
    <Shell accent={t.green}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            background: t.green,
            animation: "pulse 1.6s infinite",
          }}
        />
        <span style={{ fontWeight: 800, fontSize: 14 }}>{card.title || "Status"}</span>
      </div>
      {card.subtitle && (
        <div style={{ color: t.sub, fontSize: 13, marginTop: 4 }}>{card.subtitle}</div>
      )}
    </Shell>
  );
}

function Primary({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        border: "none",
        background: t.lime,
        color: t.limeInk,
        borderRadius: 12,
        padding: "12px",
        fontSize: 13.5,
        fontWeight: 800,
        boxShadow: limeGlow,
      }}
    >
      {label}
    </button>
  );
}

// Fire the native OS share sheet (Web Share API). Falls back to the clipboard
// on desktop / unsupported browsers. Returns what actually happened so the UI
// can confirm it.
async function systemShare(text: string, title = "OneDosh"): Promise<"shared" | "copied" | "cancelled"> {
  const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
  if (typeof nav.share === "function") {
    try {
      await nav.share({ title, text });
      return "shared";
    } catch (err) {
      // User dismissed the sheet — don't fall back, just no-op.
      if (err instanceof DOMException && err.name === "AbortError") return "cancelled";
    }
  }
  return (await copyText(text)) ? "copied" : "cancelled";
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function Ghost({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...glass,
        border: glassBorder,
        color: t.ink,
        borderRadius: 12,
        padding: "12px 14px",
        fontSize: 13.5,
        fontWeight: 700,
      }}
    >
      {label}
    </button>
  );
}
