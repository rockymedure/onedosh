import { useLayoutEffect, useRef, useState } from "react";
import { t, glass, glassBorder, limeGlow } from "../theme";
import { SectionLabel } from "../components/ui";
import { context, discover } from "../data";
import { CardArt } from "../money/CardArt";
import { CARD, CARD_DESIGNS, type CardMode } from "../money/cards";

export function MoneyTab({
  justVerified = false,
  onOpenDosh,
}: {
  justVerified?: boolean;
  onOpenDosh: (prompt: string) => void;
}) {
  return (
    <div style={{ overflowY: "auto", height: "100%", paddingBottom: 20 }}>
      <BalanceStack justVerified={justVerified} onOpenDosh={onOpenDosh} />

      <SectionLabel style={{ marginTop: 22 }}>Card</SectionLabel>
      {justVerified ? <EmptyCard onOpenDosh={onOpenDosh} /> : <CardBlock />}

      <SectionLabel style={{ marginTop: 22 }}>Discover</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {discover.map((d) => (
          <button
            key={d}
            onClick={() => onOpenDosh(d)}
            style={{
              ...glass,
              border: glassBorder,
              borderRadius: t.radiusInner,
              padding: "16px 14px",
              fontSize: 14,
              fontWeight: 600,
              color: t.ink,
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            {d}
          </button>
        ))}
      </div>

      <div style={{ textAlign: "center", color: t.faint, fontSize: 12, marginTop: 16 }}>
        Account & settings live in your profile (top right).
      </div>
    </div>
  );
}

function CardBlock() {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(328);
  const [mode, setMode] = useState<CardMode>("onyx");
  const design = CARD_DESIGNS[mode];

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setW(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div ref={ref} style={{ position: "relative", zIndex: 2, width: "100%" }}>
        <CardArt art={design.art} name={context.name} last4={design.last4} width={w} editionLabel="Eclipse" />
      </div>
      <ApplePayButton />
      <CardModeToggle mode={mode} onChange={setMode} />
    </div>
  );
}

function CardModeToggle({ mode, onChange }: { mode: CardMode; onChange: (m: CardMode) => void }) {
  const opts: { id: CardMode; label: string; dot: string }[] = [
    { id: "onyx", label: "Onyx", dot: "#0d0b08" },
    { id: "ivory", label: "Ivory", dot: "#efe8db" },
  ];
  return (
    <div
      role="tablist"
      aria-label="Card finish"
      style={{
        display: "inline-flex",
        gap: 4,
        marginTop: 14,
        padding: 4,
        borderRadius: 999,
        background: glass.background,
        border: glassBorder,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {opts.map((o) => {
        const active = o.id === mode;
        return (
          <button
            key={o.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.id)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              border: "none",
              cursor: "pointer",
              borderRadius: 999,
              padding: "7px 14px",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 0.2,
              color: active ? t.ink : t.sub,
              background: active ? "#fff" : "transparent",
              boxShadow: active ? "0 4px 12px rgba(20,28,51,0.12)" : "none",
              transition: "background 0.2s ease, color 0.2s ease",
            }}
          >
            <span
              aria-hidden
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: o.dot,
                border: "1px solid rgba(20,28,51,0.18)",
              }}
            />
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

// The card before the first payment lands. It is a *real* OneDosh card — same
// dark face and geometry as the live one — shown inactive (dimmed, not-yet-
// activated) but fully action-oriented: your name is already on it, and one tap
// gets your first payment to activate it. It should feel almost yours.
function EmptyCard({ onOpenDosh }: { onOpenDosh: (prompt: string) => void }) {
  return (
    <button
      onClick={() => onOpenDosh("I want to get paid")}
      aria-label="Activate your OneDosh card — get your first payment"
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1.586 / 1",
        borderRadius: t.radiusCard,
        border: "none",
        padding: 18,
        overflow: "hidden",
        cursor: "pointer",
        textAlign: "left",
        color: "#fff",
        background: CARD.art.kind === "template" ? CARD.art.background : t.navy,
        boxShadow: "0 12px 28px rgba(20,28,51,0.20)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Inactive scrim — dims the face so it reads as not-yet-activated, without
          killing its color. */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(160deg, rgba(5,7,11,0.28), rgba(5,7,11,0.58))",
        }}
      />
      {/* A soft lime glow, breathing slowly — the card is inactive but alive,
          waiting to light up. */}
      <span
        aria-hidden
        className="card-breathe"
        style={{
          position: "absolute",
          bottom: -60,
          left: -40,
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: t.lime,
          filter: "blur(48px)",
          pointerEvents: "none",
        }}
      />

      {/* Header: brand (dimmed) + "Not active yet" status */}
      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: -0.3, opacity: 0.6 }}>
          One<span style={{ color: t.lime }}>Dosh</span>
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: 0.4,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.78)",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.16)",
            borderRadius: 999,
            padding: "3px 9px",
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.4)" }} />
          Not active yet
        </span>
      </div>

      {/* Chip — dimmed, present, waiting */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10, opacity: 0.5 }}>
        <span
          aria-hidden
          style={{
            width: 34,
            height: 26,
            borderRadius: 5,
            background: "linear-gradient(135deg, #F7E7A8, #C9A34B 55%, #E8D08A)",
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.18)",
          }}
        />
      </div>

      {/* Footer: your name already on it + masked number, with a live CTA */}
      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 15,
              letterSpacing: 2.5,
              fontWeight: 600,
              fontVariantNumeric: "tabular-nums",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            ••••&nbsp;&nbsp;••••&nbsp;&nbsp;••••&nbsp;&nbsp;••••
          </div>
          <div
            style={{
              fontSize: 12.5,
              fontWeight: 700,
              color: "#fff",
              textTransform: "uppercase",
              letterSpacing: 0.6,
              marginTop: 8,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {context.name}
          </div>
        </div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            fontSize: 12.5,
            fontWeight: 800,
            color: t.limeInk,
            background: t.lime,
            borderRadius: 999,
            padding: "8px 13px",
            boxShadow: limeGlow,
            flexShrink: 0,
          }}
        >
          Activate →
        </span>
      </div>
    </button>
  );
}

function ApplePayButton() {
  const [added, setAdded] = useState(false);
  return (
    <button
      onClick={() => setAdded(true)}
      disabled={added}
      style={{
        position: "relative",
        zIndex: 1,
        marginTop: -18,
        width: "58%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        border: `1px solid ${t.border}`,
        borderTop: "none",
        borderRadius: "0 0 16px 16px",
        padding: "26px 14px 11px",
        background: "rgba(255,255,255,0.66)",
        backdropFilter: "blur(12px) saturate(160%)",
        WebkitBackdropFilter: "blur(12px) saturate(160%)",
        color: t.sub,
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: -0.1,
        boxShadow: "0 10px 18px rgba(20,28,51,0.08)",
        cursor: added ? "default" : "pointer",
      }}
    >
      {added ? (
        "Added to Apple Wallet ✓"
      ) : (
        <>
          Add to
          <AppleLogo />
          Pay
        </>
      )}
    </button>
  );
}

function AppleLogo() {
  return (
    <svg width={13} height={16} viewBox="0 0 17 21" fill="currentColor" aria-hidden style={{ marginLeft: 1 }}>
      <path d="M14.2 11.1c0-2.2 1.8-3.3 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.6.8-3.3.8-.7 0-1.7-.8-2.9-.8-1.5 0-2.9.9-3.6 2.2-1.6 2.7-.4 6.7 1.1 8.9.7 1.1 1.6 2.3 2.7 2.2 1.1 0 1.5-.7 2.8-.7 1.3 0 1.6.7 2.8.7 1.2 0 1.9-1.1 2.6-2.1.8-1.2 1.2-2.4 1.2-2.4-.1 0-2.3-.9-2.3-3.5zM12 4.6c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.6.6-1.1 1.6-.9 2.6 1 .1 1.9-.5 2.5-1.2z" />
    </svg>
  );
}

const CARD_H = 170;
const PEEK = 76;

function BalanceStack({
  justVerified,
  onOpenDosh,
}: {
  justVerified: boolean;
  onOpenDosh: (prompt: string) => void;
}) {
  const [front, setFront] = useState<0 | 1>(0);

  const usd = justVerified ? 0 : context.usdBalance;
  const ngn = justVerified ? 0 : context.ngnBalance;

  const cards = [
    {
      key: "usd" as const,
      label: "Dollar balance",
      symbol: "$",
      amount: usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      sub: justVerified
        ? "Your first payment lands here"
        : `≈ ₦${(usd * context.nairaPerUsd).toLocaleString()} at today's rate`,
      base: t.navy,
      image: "/cards/dollar.png",
      scrim:
        "linear-gradient(112deg, rgba(20,28,51,0.94) 0%, rgba(20,28,51,0.78) 38%, rgba(20,28,51,0.30) 70%, rgba(20,28,51,0.05) 100%)",
      accent: t.lime,
      actions: justVerified
        ? [
            { label: "Get paid", prompt: "I want to get paid", primary: true },
            { label: "Add money", prompt: "I want to add dollars" },
          ]
        : [
            { label: "Add money", prompt: "I want to add dollars", primary: true },
            { label: "Convert", prompt: "Convert some dollars to naira" },
          ],
    },
    {
      key: "ngn" as const,
      label: "Naira balance",
      symbol: "₦",
      amount: ngn.toLocaleString(),
      sub: `Rate ₦${context.nairaPerUsd.toLocaleString()}/$`,
      base: "#241452",
      image: "/cards/naira.png",
      scrim:
        "linear-gradient(112deg, rgba(36,20,82,0.95) 0%, rgba(36,20,82,0.82) 40%, rgba(36,20,82,0.38) 72%, rgba(36,20,82,0.08) 100%)",
      accent: t.lime,
      actions: justVerified
        ? [
            { label: "Get paid", prompt: "I want to get paid", primary: true },
            { label: "Add money", prompt: "I want to add naira" },
          ]
        : [
            { label: "Add money", prompt: "I want to add naira", primary: true },
            { label: "Convert", prompt: "Convert some naira to dollars" },
          ],
    },
  ];

  return (
    <div style={{ position: "relative", height: CARD_H + PEEK }}>
      {cards.map((c, i) => {
        const isFront = i === front;
        const { key, ...rest } = c;
        return (
          <BalanceCard
            key={key}
            {...rest}
            isFront={isFront}
            peekOffset={PEEK}
            onBringForward={() => setFront(i as 0 | 1)}
            onOpenDosh={onOpenDosh}
          />
        );
      })}
    </div>
  );
}

function BalanceCard({
  label,
  symbol,
  amount,
  sub,
  base,
  image,
  scrim,
  accent,
  actions,
  isFront,
  peekOffset,
  onBringForward,
  onOpenDosh,
}: {
  label: string;
  symbol: string;
  amount: string;
  sub: string;
  base: string;
  image: string;
  scrim: string;
  accent: string;
  actions: { label: string; prompt: string; primary?: boolean }[];
  isFront: boolean;
  peekOffset: number;
  onBringForward: () => void;
  onOpenDosh: (prompt: string) => void;
}) {
  return (
    <div
      onClick={isFront ? undefined : onBringForward}
      style={{
        position: "absolute",
        left: isFront ? 0 : 10,
        right: isFront ? 0 : 10,
        top: isFront ? peekOffset : 0,
        height: CARD_H,
        overflow: "hidden",
        backgroundColor: base,
        backgroundImage: `${scrim}, url(${image})`,
        backgroundSize: "cover, cover",
        backgroundPosition: "center, center",
        backgroundRepeat: "no-repeat, no-repeat",
        borderRadius: t.radiusCard,
        padding: 18,
        color: "#fff",
        zIndex: isFront ? 2 : 1,
        opacity: isFront ? 1 : 0.97,
        boxShadow: isFront
          ? "0 10px 26px -10px rgba(20,28,51,0.22)"
          : "0 6px 16px -8px rgba(20,28,51,0.14)",
        cursor: isFront ? "default" : "pointer",
        transition: "top 0.3s ease, left 0.3s ease, right 0.3s ease, opacity 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{ width: 7, height: 7, borderRadius: 4, background: accent, boxShadow: `0 0 8px ${accent}` }}
          />
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.72)" }}>{label}</span>
        </div>
        <div style={{ fontSize: 32, fontWeight: 800, marginTop: 4 }}>
          <span style={{ color: accent }}>{symbol}</span>
          {amount}
        </div>
        {isFront && (
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.72)", marginTop: 2 }}>{sub}</div>
        )}

        {isFront && (
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            {actions.map((a) => (
              <WalletBtn key={a.label} primary={a.primary} label={a.label} onClick={() => onOpenDosh(a.prompt)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function WalletBtn({
  label,
  onClick,
  primary,
}: {
  label: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        border: "none",
        background: primary ? t.lime : "rgba(255,255,255,0.12)",
        color: primary ? t.limeInk : "#fff",
        borderRadius: 12,
        padding: "11px",
        fontSize: 14,
        fontWeight: primary ? 800 : 700,
        boxShadow: primary ? limeGlow : "none",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}
