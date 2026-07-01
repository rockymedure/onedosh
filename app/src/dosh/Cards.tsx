import { useState } from "react";
import { t, glass, glassBorder, limeGlow } from "../theme";
import { Avatar } from "../components/ui";
import { photoFor } from "../data";
import type { DoshCard } from "../types";

export function CardStack({
  cards,
  onAction,
}: {
  cards?: DoshCard[];
  onAction: (text: string) => void;
}) {
  if (!cards || cards.length === 0) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
      {cards.map((c, i) => (
        <CardView key={i} card={c} onAction={onAction} />
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

function CardView({ card, onAction }: { card: DoshCard; onAction: (text: string) => void }) {
  const [done, setDone] = useState<string | null>(null);

  if (card.type === "receive_usd") {
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
            label={done === "copy" ? "Copied ✓" : "Copy details"}
            onClick={() => setDone("copy")}
          />
          <Ghost label="Share" onClick={() => onAction("Share my account details")} />
        </div>
      </Shell>
    );
  }

  if (card.type === "confirm") {
    const isSend = card.action === "send";
    if (done) {
      return (
        <Shell accent={t.green}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {card.recipient && <Avatar label={card.recipient} src={photoFor(card.recipient)} size={36} />}
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: t.ink }}>
                {isSend ? "Sent ✓" : "Done ✓"}
              </div>
              <div style={{ color: t.sub, fontSize: 13 }}>
                {card.recipient ? `${card.recipient} will be notified.` : "All set."}
              </div>
            </div>
          </div>
        </Shell>
      );
    }
    return (
      <Shell accent={t.navy}>
        <div style={{ fontWeight: 800, fontSize: 14, marginBottom: card.recipient ? 10 : 8 }}>
          {card.title || (isSend ? "Confirm send" : "Confirm")}
        </div>
        {card.recipient && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <Avatar label={card.recipient} src={photoFor(card.recipient)} size={36} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: t.ink }}>{card.recipient}</div>
              <div style={{ fontSize: 12, color: t.sub }}>{isSend ? "Recipient" : "Contact"}</div>
            </div>
          </div>
        )}
        {card.fromLabel && <Row k="From" v={card.fromLabel} />}
        {card.toLabel && <Row k="To" v={card.toLabel} />}
        {card.rateLabel && <Row k="Rate" v={card.rateLabel} />}
        {card.feeLabel && <Row k="Fee" v={card.feeLabel} />}
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <Primary
            label={isSend ? "Confirm & send" : "Confirm"}
            onClick={() => {
              setDone("ok");
              onAction(`Confirmed: ${card.title || card.action}`);
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
