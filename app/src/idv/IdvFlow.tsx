import { useEffect, useState } from "react";
import { t } from "../theme";
import { Ripple } from "../components/ui";

// Faithful reproduction of the production KYC flow (visual-reference
// screens/02-kyc-verification) — the Sumsub-powered screens the team already
// knows. Deliberately NOT the prototype's warm-paper/lime language: KYC is
// Sumsub-owned and stays visually "unchanged" so it reads as familiar. When
// Sumsub hands back ("Your data has been accepted"), OneDosh takes over with
// its own celebratory VerifiedScreen.
//
// Thin slice: Verify Identity → Residency → data accepted → onComplete().

type Step = "entry" | "residency" | "accepted";

// Sumsub palette — a clean, near-iOS white flow.
const s = {
  ink: "#1C1C1E",
  sub: "#6B7280",
  field: "#F2F2F4",
  border: "#E5E5EA",
  radio: "#C7C7CC",
  navy: t.navy,
  disabled: "#B9BEC9",
  footer: "#B0B4BC",
  seal: "#2F6BF3",
  req: "#FF3B30",
};

export function IdvFlow({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<Step>("entry");

  // Sumsub auto-advances from the "data accepted" state once review clears.
  useEffect(() => {
    if (step !== "accepted") return;
    const id = window.setTimeout(onComplete, 2000);
    return () => window.clearTimeout(id);
  }, [step, onComplete]);

  // ✕ steps back; closing the first sheet dismisses the whole prompt.
  const close = () => {
    if (step === "residency") setStep("entry");
    else onComplete();
  };

  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {step === "entry" && <Entry onClose={close} onStart={() => setStep("residency")} />}
      {step === "residency" && (
        <Residency onClose={close} onContinue={() => setStep("accepted")} />
      )}
      {step === "accepted" && <DataAccepted />}
    </div>
  );
}

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", padding: "8px 12px 0" }}>
      <button
        onClick={onClose}
        aria-label="Close"
        style={{
          position: "relative",
          overflow: "hidden",
          width: 34,
          height: 34,
          borderRadius: 999,
          border: "none",
          background: "#F2F2F4",
          color: s.ink,
          display: "grid",
          placeItems: "center",
          cursor: "pointer",
        }}
      >
        <svg width={15} height={15} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" />
        </svg>
        <Ripple color="rgba(0,0,0,0.12)" />
      </button>
    </div>
  );
}

function NavyButton({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        border: "none",
        borderRadius: 999,
        background: disabled ? s.disabled : s.navy,
        color: "#fff",
        padding: "16px 0",
        fontSize: 16,
        fontWeight: 700,
        cursor: disabled ? "default" : "pointer",
        transition: "background 160ms ease",
      }}
    >
      {label}
      {!disabled && <Ripple color="rgba(255,255,255,0.25)" />}
    </button>
  );
}

function Sumsub() {
  return (
    <div
      style={{
        textAlign: "center",
        fontSize: 11.5,
        fontWeight: 500,
        color: s.footer,
        padding: "14px 0 16px",
      }}
    >
      Powered by Sumsub
    </div>
  );
}

// Screen 01 — the "Welcome to OneDosh / Verify Identity" prompt sheet.
function Entry({ onClose, onStart }: { onClose: () => void; onStart: () => void }) {
  return (
    <>
      <CloseButton onClose={onClose} />
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 24px",
        }}
      >
        <VerifiedSeal />
        <div
          style={{
            marginTop: 22,
            fontSize: 26,
            fontWeight: 800,
            color: s.ink,
            letterSpacing: "-0.02em",
          }}
        >
          Welcome to OneDosh!
        </div>
        <p style={{ margin: "12px 0 0", fontSize: 15.5, lineHeight: 1.55, color: s.sub, fontWeight: 500 }}>
          We're excited to have you on board! To unlock all features, and ensure
          the security of your account, we need to quickly verify your identity.
        </p>
      </div>
      <div style={{ padding: "0 24px 22px" }}>
        <NavyButton label="Verify Identity  →" onClick={onStart} />
      </div>
    </>
  );
}

// The blue scalloped "verified" badge from the welcome sheet.
function VerifiedSeal() {
  const points = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    const r = i % 2 === 0 ? 24 : 20;
    return `${24 + r * Math.cos(a)},${24 + r * Math.sin(a)}`;
  }).join(" ");
  return (
    <svg width={52} height={52} viewBox="0 0 48 48" aria-hidden>
      <polygon points={points} fill={s.seal} />
      <path
        d="M16 24.5l5 5 11-11"
        stroke="#fff"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

// Screen 02 — residency selection with radio rows.
function Residency({ onClose, onContinue }: { onClose: () => void; onContinue: () => void }) {
  const [choice, setChoice] = useState<"row" | "us" | null>(null);
  const options: { id: "row" | "us"; flag: string; label: string }[] = [
    { id: "row", flag: "🌍", label: "All countries except USA" },
    { id: "us", flag: "🇺🇸", label: "United States of America" },
  ];
  return (
    <>
      <CloseButton onClose={onClose} />
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "24px 22px 0" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
          <GlobeGlyph />
        </div>
        <div
          style={{
            textAlign: "center",
            fontSize: 22,
            fontWeight: 700,
            color: s.ink,
            letterSpacing: "-0.02em",
            marginBottom: 22,
          }}
        >
          I'm a resident of or live in:
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {options.map((o) => {
            const on = choice === o.id;
            return (
              <button
                key={o.id}
                onClick={() => setChoice(o.id)}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  width: "100%",
                  textAlign: "left",
                  background: "#fff",
                  border: `1.5px solid ${on ? s.navy : s.border}`,
                  borderRadius: 14,
                  padding: "16px 16px",
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: 20 }}>{o.flag}</span>
                <span style={{ flex: 1, fontSize: 15.5, fontWeight: 600, color: s.ink }}>
                  {o.label}
                </span>
                <Radio on={on} />
                <Ripple color="rgba(0,0,0,0.06)" />
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ padding: "0 22px" }}>
        <NavyButton label="Continue" onClick={onContinue} disabled={!choice} />
      </div>
      <Sumsub />
    </>
  );
}

function Radio({ on }: { on: boolean }) {
  return (
    <span
      style={{
        width: 22,
        height: 22,
        borderRadius: 999,
        border: `2px solid ${on ? s.navy : s.radio}`,
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
      }}
    >
      {on && <span style={{ width: 11, height: 11, borderRadius: 999, background: s.navy }} />}
    </span>
  );
}

function GlobeGlyph() {
  const p = { stroke: s.radio, strokeWidth: 1.6, fill: "none" as const };
  return (
    <svg width={54} height={54} viewBox="0 0 48 48" aria-hidden>
      <circle cx={24} cy={24} r={18} {...p} />
      <ellipse cx={24} cy={24} rx={8} ry={18} {...p} />
      <path d="M6 24h36M9 15h30M9 33h30" {...p} />
    </svg>
  );
}

// Screen 04 — the ghosted "Your data has been accepted" loading state.
function DataAccepted() {
  return (
    <>
      <CloseButton onClose={() => {}} />
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
        }}
      >
        <div style={{ position: "relative", width: 88, height: 88, display: "grid", placeItems: "center" }}>
          <svg width={88} height={88} viewBox="0 0 88 88" style={{ position: "absolute", opacity: 0.12 }} aria-hidden>
            <circle cx={44} cy={44} r={30} fill="#7FBF9E" />
            <path d="M32 45l8 8 16-17" stroke="#fff" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <Spinner />
        </div>
        <div style={{ fontSize: 17, fontWeight: 500, color: "#C9CDD4" }}>
          Your data has been accepted
        </div>
      </div>
      <Sumsub />
    </>
  );
}

function Spinner() {
  return (
    <svg className="spin" width={30} height={30} viewBox="0 0 24 24" aria-hidden>
      <circle cx={12} cy={12} r={9} stroke="#E5E5EA" strokeWidth={2.4} fill="none" />
      <path d="M21 12a9 9 0 00-9-9" stroke="#9AA0AC" strokeWidth={2.4} strokeLinecap="round" fill="none" />
    </svg>
  );
}
