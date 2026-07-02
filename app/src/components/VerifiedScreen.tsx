import { useMemo } from "react";
import { t, display, limeGlow } from "../theme";
import { Ripple } from "./ui";

// The END of the IDV flow — the moment Sumsub hands the user back to OneDosh.
// Reference: visual-reference KYC screen 09 ("Your data has been accepted") and
// the receiver journey's Stage 2 ("You're verified. Your dollar and naira
// wallets are open."). This is the seam into the just-verified cold start: it
// celebrates the win, shows both wallets opening, then drops them into Dosh.
export function VerifiedScreen({
  name,
  onEnter,
}: {
  name: string;
  onEnter: () => void;
}) {
  const firstName = name.trim().split(/\s+/)[0];
  const confetti = useConfetti();

  return (
    <div
      style={{
        position: "relative",
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background:
          "radial-gradient(120% 80% at 50% -10%, #1E294A 0%, #141C33 55%, #0E1526 100%)",
        color: "#fff",
      }}
    >
      {/* Confetti rains from the top over the celebration. */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {confetti.map((c) => (
          <span
            key={c.key}
            style={{
              position: "absolute",
              top: -12,
              left: `${c.left}%`,
              width: c.size,
              height: c.size * 0.55,
              borderRadius: 1.5,
              background: c.color,
              opacity: 0,
              animation: `fallFar ${c.dur}s cubic-bezier(0.3,0.6,0.4,1) ${c.delay}s both`,
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: "relative",
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "32px 26px",
        }}
      >
        <div
          className="seal-in"
          style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
        >
          {/* Verified seal — lime disc with a self-drawing tick + breathing halo. */}
          <div
            className="halo-pulse"
            style={{
              width: 96,
              height: 96,
              borderRadius: "50%",
              background: `linear-gradient(150deg, ${t.lime}, #B6DE1F)`,
              display: "grid",
              placeItems: "center",
              boxShadow: limeGlow,
            }}
          >
            <svg width={52} height={52} viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                className="draw-tick"
                d="M5 12.5l4.2 4.2L19 7"
                stroke={t.navy}
                strokeWidth={2.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div
            style={{
              marginTop: 24,
              fontFamily: display,
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            You're verified <span aria-hidden>🎉</span>
          </div>
          <p
            style={{
              margin: "10px 0 0",
              maxWidth: 300,
              fontSize: 15.5,
              lineHeight: 1.5,
              color: "rgba(255,255,255,0.72)",
              fontWeight: 500,
            }}
          >
            Nice one, {firstName}. Your dollar and naira wallets are open and
            ready to move money.
          </p>
        </div>

        {/* Both wallets, freshly opened. */}
        <div
          style={{
            width: "100%",
            maxWidth: 320,
            marginTop: 26,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <WalletRow
            flag="🇺🇸"
            title="US Dollar wallet"
            sub="Get paid from anywhere"
            delay={0.55}
          />
          <WalletRow flag="🇳🇬" title="Naira wallet" sub="Spend & send at home" delay={0.68} />
        </div>
      </div>

      {/* Hand-off — the only tap, straight into the Dosh cold start. */}
      <div style={{ position: "relative", padding: "0 22px 26px", flexShrink: 0 }}>
        <button
          onClick={onEnter}
          className="pop"
          style={{
            position: "relative",
            overflow: "hidden",
            width: "100%",
            border: "none",
            borderRadius: 999,
            background: t.lime,
            color: t.limeInk,
            padding: "16px 0",
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: "-0.01em",
            boxShadow: limeGlow,
          }}
        >
          Enter OneDosh →
          <Ripple color="rgba(20,28,51,0.22)" />
        </button>
        <div
          style={{
            marginTop: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            fontSize: 11.5,
            fontWeight: 600,
            letterSpacing: 0.3,
            color: "rgba(255,255,255,0.42)",
          }}
        >
          <ShieldTick />
          Identity verified securely with Sumsub
        </div>
      </div>
    </div>
  );
}

function WalletRow({
  flag,
  title,
  sub,
  delay,
}: {
  flag: string;
  title: string;
  sub: string;
  delay: number;
}) {
  return (
    <div
      className="dosh-enter"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 16,
        padding: "13px 15px",
        textAlign: "left",
        animationDelay: `${delay}s`,
      }}
    >
      <span
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: "rgba(255,255,255,0.09)",
          display: "grid",
          placeItems: "center",
          fontSize: 20,
          flexShrink: 0,
        }}
      >
        {flag}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14.5, fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>
          {sub}
        </div>
      </div>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          background: "rgba(207,242,63,0.16)",
          color: t.lime,
          borderRadius: 999,
          padding: "5px 10px",
          fontSize: 11.5,
          fontWeight: 800,
          flexShrink: 0,
        }}
      >
        <Dot /> Open
      </span>
    </div>
  );
}

function Dot() {
  return (
    <span style={{ width: 6, height: 6, borderRadius: 3, background: t.lime, display: "block" }} />
  );
}

function ShieldTick() {
  return (
    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2.5l7 3v5.5c0 4.6-3.1 7.9-7 9.5-3.9-1.6-7-4.9-7-9.5V5.5l7-3z"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <path
        d="M8.7 12.2l2.2 2.2 4.2-4.4"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// A stable burst of confetti pieces (computed once so re-renders don't reshuffle).
function useConfetti() {
  return useMemo(() => {
    const colors = [t.lime, t.gold, t.coral, t.violet, "#fff"];
    return Array.from({ length: 26 }, (_, i) => ({
      key: i,
      left: Math.round(Math.random() * 100),
      size: 6 + Math.round(Math.random() * 6),
      color: colors[i % colors.length],
      delay: +(Math.random() * 0.5).toFixed(2),
      dur: +(1.7 + Math.random() * 1.1).toFixed(2),
    }));
  }, []);
}
