import { useEffect, useState } from "react";
import { t, glass, glassBorder, limeGlow } from "../theme";
import { SectionLabel } from "../components/ui";
import { context, discover } from "../data";
import { health } from "../dosh/api";
import { CardStack } from "../money/CardStack";
import { CardStudio } from "../money/CardStudio";
import { templateById, last4For, type CardDesign, type OwnedCard } from "../money/cards";

const SEED_CARDS: OwnedCard[] = [
  {
    uid: "founding",
    design: templateById("lime-static")!,
    last4: "4921",
    minted: "Founding drop",
    edition: "Founding drop · 1 of 1",
  },
  {
    uid: "chrome",
    design: templateById("liquid-chrome")!,
    last4: last4For("chrome"),
    minted: "Jun 2026",
  },
  {
    uid: "naija",
    design: templateById("naija-heat")!,
    last4: last4For("naija"),
    minted: "Jun 2026",
    edition: "Limited · #0142",
  },
];

export function MoneyTab({ onOpenDosh }: { onOpenDosh: (prompt: string) => void }) {
  const [owned, setOwned] = useState<OwnedCard[]>(SEED_CARDS);
  const [studioOpen, setStudioOpen] = useState(false);
  const [canGenerate, setCanGenerate] = useState(false);

  useEffect(() => {
    health().then((h) => setCanGenerate(Boolean(h.cardStudio)));
  }, []);

  function mint(design: CardDesign) {
    const uid = `${design.id}-${Date.now()}`;
    setOwned((prev) => [
      ...prev,
      {
        uid,
        design,
        last4: last4For(uid),
        minted: "Just now",
        edition: design.rarity === "1 of 1" ? "1 of 1 · minted for you" : undefined,
      },
    ]);
    setStudioOpen(false);
  }

  return (
    <div style={{ overflowY: "auto", height: "100%", paddingBottom: 92 }}>
      <BalanceStack onOpenDosh={onOpenDosh} />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          margin: "6px 2px",
        }}
      >
        <SectionLabel>Your cards · {owned.length}</SectionLabel>
        <button
          onClick={() => setStudioOpen(true)}
          style={{
            border: "none",
            background: t.navy,
            color: "#fff",
            borderRadius: 999,
            padding: "6px 12px",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          ✨ New drop
        </button>
      </div>
      <CardStack name={context.name} cards={owned} onOpenStudio={() => setStudioOpen(true)} />

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

      {studioOpen && (
        <CardStudio
          name={context.name}
          last4={last4For("preview")}
          initial={owned[0]?.design ?? SEED_CARDS[0].design}
          canGenerate={canGenerate}
          onClose={() => setStudioOpen(false)}
          onMint={mint}
        />
      )}
    </div>
  );
}

const CARD_H = 186;
const PEEK = 30;

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
        return (
          <BalanceCard
            key={c.key}
            {...c}
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
        left: 0,
        right: 0,
        top: isFront ? 0 : peekOffset,
        height: CARD_H,
        overflow: "hidden",
        background,
        borderRadius: t.radiusCard,
        padding: 20,
        color: "#fff",
        zIndex: isFront ? 2 : 1,
        transform: isFront ? "scale(1)" : "scale(0.955)",
        transformOrigin: "top center",
        opacity: isFront ? 1 : 0.96,
        boxShadow: isFront
          ? "0 14px 34px rgba(20,28,51,0.30)"
          : "0 6px 16px rgba(20,28,51,0.18)",
        cursor: isFront ? "default" : "pointer",
        transition: "top 0.28s ease, transform 0.28s ease, opacity 0.28s ease",
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
        <div style={{ fontSize: 34, fontWeight: 800, marginTop: 4 }}>
          <span style={{ color: accent }}>{symbol}</span>
          {amount}
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.72)", marginTop: 2 }}>{sub}</div>

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
