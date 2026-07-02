import { useLayoutEffect, useRef, useState } from "react";
import { t, glass, glassBorder, limeGlow } from "../theme";
import { SectionLabel } from "../components/ui";
import { context, discover } from "../data";
import { CardArt } from "../money/CardArt";
import { CARD } from "../money/cards";

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
        <CardArt art={CARD.art} name={context.name} last4={CARD.last4} width={w} />
      </div>
      <ApplePayButton />
    </div>
  );
}

function EmptyCard({ onOpenDosh }: { onOpenDosh: (prompt: string) => void }) {
  return (
    <button
      onClick={() => onOpenDosh("I want to get paid")}
      style={{
        width: "100%",
        aspectRatio: "1.586 / 1",
        borderRadius: t.radiusCard,
        border: `2px dashed ${t.border}`,
        background: "rgba(255,255,255,0.5)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        cursor: "pointer",
        color: t.sub,
        textAlign: "center",
        padding: 20,
      }}
    >
      <span
        style={{
          width: 46,
          height: 46,
          borderRadius: 23,
          background: t.navy,
          display: "grid",
          placeItems: "center",
          fontSize: 22,
        }}
      >
        🔒
      </span>
      <span style={{ fontSize: 15, fontWeight: 800, color: t.ink }}>Your card unlocks when money lands</span>
      <span style={{ fontSize: 12.5, maxWidth: 240, lineHeight: 1.4 }}>
        Get your first payment and Dosh spins up your OneDosh card — tap to start.
      </span>
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
