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
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          background: t.navy,
          borderRadius: t.radiusCard,
          padding: 20,
          color: "#fff",
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
            background: t.lime,
            opacity: 0.14,
            filter: "blur(12px)",
          }}
        />
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{ width: 7, height: 7, borderRadius: 4, background: t.lime, boxShadow: `0 0 8px ${t.lime}` }}
            />
            <span style={{ fontSize: 13, color: "#AEB8CC" }}>Your balances</span>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <BalanceCell
              label="Dollars"
              symbol="$"
              amount={context.usdBalance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            />
            <BalanceCell
              label="Naira"
              symbol="₦"
              amount={context.ngnBalance.toLocaleString()}
            />
          </div>
          <div style={{ fontSize: 12, color: "#AEB8CC", marginTop: 10 }}>
            Rate{" "}
            <span style={{ color: t.lime, fontWeight: 700 }}>
              ₦{context.nairaPerUsd.toLocaleString()}/$
            </span>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <WalletBtn primary label="Add money" onClick={() => onOpenDosh("I want to add money")} />
            <WalletBtn label="Convert" onClick={() => onOpenDosh("Convert some dollars to naira")} />
          </div>
        </div>
      </div>

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

function BalanceCell({
  label,
  symbol,
  amount,
}: {
  label: string;
  symbol: string;
  amount: string;
}) {
  return (
    <div
      style={{
        flex: 1,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: 14,
        padding: "12px 14px",
      }}
    >
      <div style={{ fontSize: 12, color: "#AEB8CC" }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800, marginTop: 2, whiteSpace: "nowrap" }}>
        <span style={{ color: t.lime }}>{symbol}</span>
        {amount}
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
