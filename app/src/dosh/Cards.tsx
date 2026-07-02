import { useState } from "react";
import { t, glass, glassBorder, limeGlow } from "../theme";
import { Avatar } from "../components/ui";
import { photoFor } from "../data";
import { gigThumb, useGigCatalog } from "../gigs";
import type { DoshCard, DoshEffect, JobCardItem } from "../types";

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
      fund: "Confirm top-up",
      add_card: "Link card",
      book: "Book it",
    };
    const doneTitle: Record<string, string> = {
      send: "Sent ✓",
      convert: "Converted ✓",
      hold: "Done ✓",
      stake: "Bet placed 🎯",
      chip: "Chipped in ✓",
      join: "You're in ✓",
      fund: "Topped up ✓",
      add_card: "Card linked ✓",
      book: "Booked 🤝",
    };
    const doneSub: Record<string, string> = {
      stake: "Good luck — I'll watch the result.",
      chip: "Nice one. Pot's climbing.",
      join: "You're on the board.",
      fund: "Money's in your wallet.",
      add_card: "You can fund your wallet now.",
      book: "Saved them — I'll watch for the payment.",
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

  if (card.type === "job_board") {
    return <JobBoardCard card={card} onAction={onAction} />;
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

// Rich, image-forward gig cards for chat. The model picks which gigs to show
// (by id); we enrich each with the real catalog data so details are accurate.
function JobBoardCard({
  card,
  onAction,
}: {
  card: Extract<DoshCard, { type: "job_board" }>;
  onAction: (text: string) => void;
}) {
  const catalog = useGigCatalog();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {card.intro && (
        <div style={{ fontSize: 13.5, fontWeight: 700, color: t.sub, padding: "0 2px" }}>{card.intro}</div>
      )}
      {(card.jobs || []).map((j) => (
        <GigListing key={j.id} item={j} full={catalog[j.id]} onAction={onAction} />
      ))}
    </div>
  );
}

function GigListing({
  item,
  full,
  onAction,
}: {
  item: JobCardItem;
  full?: {
    title: string;
    posterName: string;
    posterHandle: string;
    blurb: string;
    location: string;
    budgetUsd: number;
    cadence: string;
    tags: string[];
    inNetwork: boolean;
  };
  onAction: (text: string) => void;
}) {
  const title = full?.title || item.title;
  const posterName = full?.posterName || item.poster || "Payer";
  const handle = full?.posterHandle || item.handle || "";
  const location = full?.location || "";
  const blurb = full?.blurb || "";
  const tags = (full?.tags || item.tags || []).slice(0, 3);
  const inNetwork = full?.inNetwork ?? item.inNetwork ?? false;
  // Budget comes ONLY from the trusted catalog — the model sometimes emits a
  // wrong figure, so we never show its number (avoids a bad-price flash).
  const budget = full ? `$${full.budgetUsd.toLocaleString()}` : "";
  const cadence = full?.cadence || "";
  const src = gigThumb(item.id);

  return (
    <div
      className="dosh-enter"
      style={{
        ...glass,
        border: inNetwork ? `1.5px solid ${t.lime}` : glassBorder,
        borderRadius: t.radiusCard,
        overflow: "hidden",
        boxShadow: inNetwork ? limeGlow : glass.boxShadow,
      }}
    >
      {/* Cover */}
      <div style={{ position: "relative", height: 150, background: t.navy }}>
        {src && <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(12,18,32,0.55) 0%, rgba(12,18,32,0) 45%)",
          }}
        />
        {inNetwork && (
          <span
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: 0.4,
              textTransform: "uppercase",
              color: t.limeInk,
              background: t.lime,
              borderRadius: 8,
              padding: "4px 8px",
              boxShadow: limeGlow,
            }}
          >
            In your circle
          </span>
        )}
        {budget && (
          <div
            style={{
              position: "absolute",
              bottom: 10,
              right: 10,
              display: "flex",
              alignItems: "baseline",
              gap: 4,
              color: "#fff",
              fontWeight: 800,
            }}
          >
            <span style={{ fontSize: 20, letterSpacing: "-0.02em" }}>{budget}</span>
            {cadence && <span style={{ fontSize: 12, fontWeight: 600, opacity: 0.9 }}>{cadence}</span>}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: 14 }}>
        <div style={{ fontWeight: 800, fontSize: 16, color: t.ink, letterSpacing: "-0.01em" }}>{title}</div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
          <Avatar label={posterName} src={photoFor(handle || posterName)} size={22} />
          <div style={{ fontSize: 12.5, color: t.sub, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            <span style={{ fontWeight: 700, color: t.ink }}>{posterName}</span>
            {handle ? ` · ${handle}` : ""}
            {location ? ` · ${location}` : ""}
          </div>
        </div>

        {blurb && (
          <div
            style={{
              fontSize: 13,
              color: t.sub,
              lineHeight: 1.45,
              marginTop: 8,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {blurb}
          </div>
        )}

        {tags.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
            {tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: t.sub,
                  background: "rgba(20,28,51,0.06)",
                  borderRadius: 7,
                  padding: "3px 8px",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div style={{ marginTop: 12 }}>
          <Primary
            label="Book with Dosh"
            onClick={() => onAction(`Book the "${title}" gig from ${posterName}${handle ? ` (${handle})` : ""}`)}
          />
        </div>
      </div>
    </div>
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
