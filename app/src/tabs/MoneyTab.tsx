import { t, glass, glassBorder, limeGlow } from "../theme";
import { SectionLabel } from "../components/ui";
import { context, discover } from "../data";

export function MoneyTab({ onOpenDosh }: { onOpenDosh: (prompt: string) => void }) {
  return (
    <div style={{ overflowY: "auto", height: "100%", paddingBottom: 8 }}>
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
            <span style={{ fontSize: 13, color: "#AEB8CC" }}>Total balance</span>
          </div>
          <div style={{ fontSize: 34, fontWeight: 800, marginTop: 4 }}>
            <span style={{ color: t.lime }}>$</span>
            {context.usdBalance.toFixed(2)}
          </div>
          <div style={{ fontSize: 13, color: "#AEB8CC", marginTop: 2 }}>
            ₦{context.ngnBalance.toLocaleString()} · rate{" "}
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

      <SectionLabel>Card</SectionLabel>
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg,#1E2E52,#15223D)",
          borderRadius: t.radiusCard,
          padding: 18,
          color: "#fff",
          height: 150,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <span
          aria-hidden
          style={{
            position: "absolute",
            bottom: -50,
            left: -30,
            width: 160,
            height: 160,
            borderRadius: 80,
            background: t.lime,
            opacity: 0.18,
            filter: "blur(30px)",
          }}
        />
        <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "inherit", fontWeight: 800, fontSize: 18, color: t.lime }}>Dosh</span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: t.limeInk,
              background: t.lime,
              borderRadius: 999,
              padding: "3px 9px",
            }}
          >
            Virtual · USD
          </span>
        </div>
        <div style={{ position: "relative", fontSize: 17, letterSpacing: 2 }}>••••  ••••  ••••  4921</div>
        <div style={{ position: "relative", display: "flex", justifyContent: "space-between", fontSize: 12, color: "#AEB8CC" }}>
          <span>{context.name}</span>
          <span style={{ color: t.lime, fontWeight: 700 }}>VISA</span>
        </div>
      </div>

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
