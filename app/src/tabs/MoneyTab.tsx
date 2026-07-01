import { useLayoutEffect, useRef, useState } from "react";
import { t, glass, glassBorder, limeGlow } from "../theme";
import { SectionLabel } from "../components/ui";
import { context, discover } from "../data";
import { CardArt } from "../money/CardArt";
import { CARD } from "../money/cards";

export function MoneyTab({ onOpenDosh }: { onOpenDosh: (prompt: string) => void }) {
  return (
    <div style={{ overflowY: "auto", height: "100%", paddingBottom: 92 }}>
      <BalanceStack onOpenDosh={onOpenDosh} />

      <SectionLabel>Card</SectionLabel>
      <CardBlock />

      <SectionLabel>Discover</SectionLabel>
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
    <div>
      <div ref={ref}>
        <CardArt art={CARD.art} name={context.name} last4={CARD.last4} width={w} />
      </div>
      <ApplePayButton />
    </div>
  );
}

function ApplePayButton() {
  const [added, setAdded] = useState(false);
  return (
    <button
      onClick={() => setAdded(true)}
      disabled={added}
      style={{
        marginTop: 12,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        border: "none",
        borderRadius: 14,
        padding: "14px",
        background: "#000",
        color: "#fff",
        fontSize: 15,
        fontWeight: 600,
        letterSpacing: -0.2,
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
    <svg width={16} height={19} viewBox="0 0 17 21" fill="#fff" aria-hidden style={{ marginLeft: 2 }}>
      <path d="M14.2 11.1c0-2.2 1.8-3.3 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.6.8-3.3.8-.7 0-1.7-.8-2.9-.8-1.5 0-2.9.9-3.6 2.2-1.6 2.7-.4 6.7 1.1 8.9.7 1.1 1.6 2.3 2.7 2.2 1.1 0 1.5-.7 2.8-.7 1.3 0 1.6.7 2.8.7 1.2 0 1.9-1.1 2.6-2.1.8-1.2 1.2-2.4 1.2-2.4-.1 0-2.3-.9-2.3-3.5zM12 4.6c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.6.6-1.1 1.6-.9 2.6 1 .1 1.9-.5 2.5-1.2z" />
    </svg>
  );
}

const CARD_H = 170;
const PEEK = 76;

function BalanceStack({ onOpenDosh }: { onOpenDosh: (prompt: string) => void }) {
  const [front, setFront] = useState<0 | 1>(0);

  const cards = [
    {
      key: "usd" as const,
      label: "Dollar balance",
      symbol: "$",
      amount: context.usdBalance.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      sub: `≈ ₦${(context.usdBalance * context.nairaPerUsd).toLocaleString()} at today's rate`,
      background: t.navy,
      accent: t.lime,
      blob: t.lime,
      addPrompt: "I want to add dollars",
      convertPrompt: "Convert some dollars to naira",
    },
    {
      key: "ngn" as const,
      label: "Naira balance",
      symbol: "₦",
      amount: context.ngnBalance.toLocaleString(),
      sub: `Rate ₦${context.nairaPerUsd.toLocaleString()}/$`,
      background: "linear-gradient(135deg, #0B6B4F 0%, #10B981 100%)",
      accent: "#EFFCF6",
      blob: "#5EEAD4",
      addPrompt: "I want to add naira",
      convertPrompt: "Convert some naira to dollars",
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
  background,
  accent,
  blob,
  addPrompt,
  convertPrompt,
  isFront,
  peekOffset,
  onBringForward,
  onOpenDosh,
}: {
  label: string;
  symbol: string;
  amount: string;
  sub: string;
  background: string;
  accent: string;
  blob: string;
  addPrompt: string;
  convertPrompt: string;
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
        background,
        borderRadius: t.radiusCard,
        padding: 18,
        color: "#fff",
        zIndex: isFront ? 2 : 1,
        opacity: isFront ? 1 : 0.97,
        boxShadow: isFront
          ? "0 14px 34px rgba(20,28,51,0.30)"
          : "0 6px 16px rgba(20,28,51,0.16)",
        cursor: isFront ? "default" : "pointer",
        transition: "top 0.3s ease, left 0.3s ease, right 0.3s ease, opacity 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -60,
          right: -40,
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: blob,
          opacity: 0.16,
          filter: "blur(12px)",
        }}
      />
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
            <WalletBtn primary label="Add money" onClick={() => onOpenDosh(addPrompt)} />
            <WalletBtn label="Convert" onClick={() => onOpenDosh(convertPrompt)} />
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
