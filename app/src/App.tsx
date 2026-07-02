import { useEffect, useState } from "react";
import { t, display, m3, limeGlow } from "./theme";
import { StatusBar } from "./components/StatusBar";
import { Header } from "./components/Header";
import { TabBar } from "./components/TabBar";
import { DoshMark, Ripple } from "./components/ui";
import { ActivityTab } from "./tabs/ActivityTab";
import { WorkTab } from "./tabs/WorkTab";
import { DoshTab } from "./tabs/DoshTab";
import { MoneyTab } from "./tabs/MoneyTab";
import { ProfileTab } from "./tabs/ProfileTab";
import { health, resetProfile } from "./dosh/api";
import type { Tab } from "./types";

type Mode = "returning" | "new";

const NEW_OPENER =
  "You're in 🎉 IDV done, account's live. I'm Dosh — your money guy. First move: let's put some money in your wallet from your own card so it's ready to go. Or if someone's about to pay you, we can set that up instead.";
const NEW_STARTERS = ["Add money", "💸 Get paid", "Just exploring"];

// True on phone-sized screens, where we drop the desktop presentation (device
// bezel + marketing panel) and let the app fill the whole viewport.
function useIsHandset() {
  const query = "(max-width: 820px)";
  const [isHandset, setIsHandset] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setIsHandset(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return isHandset;
}

export default function App() {
  const [tab, setTab] = useState<Tab>("activity");
  // Dosh is a layer that floats above every tab. Land in it on open.
  const [doshOpen, setDoshOpen] = useState(true);
  const [seed, setSeed] = useState<{ text: string; n: number } | undefined>();
  const [status, setStatus] = useState<{ key: boolean; model: string; db?: boolean } | null>(null);
  const [mode, setMode] = useState<Mode>("new");
  // Work lives inside Explore as a drill-in; this tracks whether we're on the
  // Explore home or pushed into the Work board (which shows a back arrow).
  const [showWork, setShowWork] = useState(false);
  // Bumped to force DoshTab to remount (fresh conversation + reloaded state).
  const [reloadKey, setReloadKey] = useState(0);
  const isHandset = useIsHandset();

  useEffect(() => {
    health().then((h) => setStatus({ key: h.key, model: h.model, db: h.db }));
  }, []);

  // Tapping a bottom-nav destination resets any drill-in (Android-style).
  function selectTab(next: Tab) {
    setShowWork(false);
    setTab(next);
  }

  function openDosh(prompt: string) {
    setSeed({ text: prompt, n: Date.now() });
    setDoshOpen(true);
  }

  async function reset() {
    await resetProfile(mode);
    setReloadKey((k) => k + 1);
    setShowWork(false);
    setTab("activity");
    setDoshOpen(true);
  }

  function changeMode(m: Mode) {
    setMode(m);
    setShowWork(false);
    setTab("activity");
    setDoshOpen(true);
  }

  const isNew = mode === "new";
  const doshProps = isNew
    ? { mode, opener: NEW_OPENER, starters: NEW_STARTERS }
    : { mode };

  const onWorkBoard = tab === "activity" && showWork;
  const shell = (
    <>
      {!isHandset && <StatusBar />}
      <Header
        tab={tab}
        onBack={onWorkBoard ? () => setShowWork(false) : undefined}
        title={onWorkBoard ? "Work" : undefined}
      />
      <div style={{ flex: 1, minHeight: 0, padding: "12px 16px 0" }}>
        {tab === "activity" &&
          (onWorkBoard ? (
            <WorkTab key={`work-${mode}-${reloadKey}`} mode={mode} onOpenDosh={openDosh} embedded />
          ) : (
            <ActivityTab justVerified={isNew} onOpenDosh={openDosh} onOpenWork={() => setShowWork(true)} />
          ))}
        {tab === "money" && <MoneyTab justVerified={isNew} onOpenDosh={openDosh} />}
        {tab === "profile" && <ProfileTab onOpenDosh={openDosh} />}
      </div>
      <TabBar tab={tab} onSelect={selectTab} />

      {/* Dosh floats above every tab — a button when closed, a full layer when open. */}
      {!doshOpen && <DoshFab onClick={() => setDoshOpen(true)} />}
      {doshOpen && (
        <DoshLayer onClose={() => setDoshOpen(false)}>
          <DoshTab key={`${mode}-${reloadKey}`} seed={seed} {...doshProps} />
        </DoshLayer>
      )}
    </>
  );

  // On a real phone, the app is the whole screen — no device bezel, no
  // marketing panel. That's the thing you actually use.
  if (isHandset) {
    return (
      <div
        style={{
        position: "fixed",
        inset: 0,
        height: "100dvh",
        background: t.bg,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        paddingTop: "env(safe-area-inset-top)",
      }}
      >
        {shell}
      </div>
    );
  }

  // On desktop, keep the framed presentation alongside the explainer.
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
        padding: 24,
        flexWrap: "wrap",
      }}
    >
      <Phone>{shell}</Phone>
      <Legend status={status} mode={mode} onMode={changeMode} onReset={reset} />
    </div>
  );
}

// Floating Dosh entry point — a branded button hovering above the tab bar.
function DoshFab({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="fab-in"
      onClick={onClick}
      aria-label="Open Dosh"
      title="Ask Dosh"
      style={{
        position: "absolute",
        right: 16,
        bottom: `calc(${m3.navHeight}px + 16px + env(safe-area-inset-bottom))`,
        width: 62,
        height: 62,
        borderRadius: 31,
        border: "3px solid #fff",
        background: t.lime,
        padding: 0,
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
        cursor: "pointer",
        zIndex: 60,
        boxShadow: `${limeGlow}, 0 6px 18px rgba(20,28,51,0.28)`,
      }}
    >
      <DoshMark size={44} />
      <Ripple color="rgba(20,28,51,0.2)" />
    </button>
  );
}

// Dosh as a full layer above all tabs, with its own top bar.
function DoshLayer({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      className="sheet-up"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 70,
        background: t.bg,
        display: "flex",
        flexDirection: "column",
        paddingTop: "env(safe-area-inset-top)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <DoshMark size={30} />
          <span style={{ fontFamily: display, fontSize: 22, fontWeight: 700, color: t.ink, letterSpacing: "-0.03em" }}>
            Dosh<span style={{ color: t.coral }}>.</span>
          </span>
        </div>
        <button
          onClick={onClose}
          aria-label="Minimize Dosh"
          title="Close"
          style={{
            position: "relative",
            overflow: "hidden",
            width: 38,
            height: 38,
            borderRadius: 19,
            border: "none",
            background: "rgba(20,28,51,0.06)",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
            color: t.ink,
          }}
        >
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none" aria-hidden style={{ display: "block" }}>
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <Ripple color="rgba(20,28,51,0.16)" />
        </button>
      </div>
      <div style={{ flex: 1, minHeight: 0, padding: "0 16px 10px" }}>{children}</div>
    </div>
  );
}

function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: 380,
        height: 780,
        background: t.bg,
        borderRadius: 32,
        border: "10px solid #0C1220",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 30px 80px rgba(12,18,32,0.35)",
      }}
    >
      {children}
    </div>
  );
}

function Legend({
  status,
  mode,
  onMode,
  onReset,
}: {
  status: { key: boolean; model: string; db?: boolean } | null;
  mode: Mode;
  onMode: (m: Mode) => void;
  onReset: () => void;
}) {
  return (
    <div style={{ width: 300, color: "#3B4557", fontFamily: display }}>
      <div style={{ fontSize: 26, fontWeight: 700, color: "#12141C", letterSpacing: "-0.03em" }}>
        Meet Dosh<span style={{ color: t.coral }}>.</span>
      </div>

      <div style={{ margin: "12px 0 4px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", color: "#98A2B3", marginBottom: 6 }}>
          Who's arriving
        </div>
        <div style={{ display: "inline-flex", background: "#EDEBE3", borderRadius: 999, padding: 3 }}>
          {(["new", "returning"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => onMode(m)}
              style={{
                border: "none",
                borderRadius: 999,
                padding: "7px 14px",
                fontSize: 12.5,
                fontWeight: 700,
                cursor: "pointer",
                background: mode === m ? t.navy : "transparent",
                color: mode === m ? "#fff" : "#667085",
              }}
            >
              {m === "new" ? "Just verified" : "Returning"}
            </button>
          ))}
        </div>
        <p style={{ fontSize: 12.5, lineHeight: 1.5, color: "#667085", marginTop: 8 }}>
          {mode === "new"
            ? "Cold start: ₦0, no contacts, fresh out of IDV. Watch Dosh drive to the first reliable win — getting paid."
            : "Returning user with balance, contacts and history."}
        </p>
        <button
          onClick={onReset}
          style={{
            marginTop: 8,
            border: "1px solid #D0D5DD",
            borderRadius: 999,
            padding: "6px 12px",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            background: "#fff",
            color: "#667085",
          }}
        >
          ↺ Reset this profile
        </button>
      </div>
      <p style={{ fontSize: 14, lineHeight: 1.55, fontWeight: 500 }}>
        Not a fintech app with a chatbot bolted on — a money guy who happens to have a bank behind
        him. <b>Dosh</b> floats above everything: tap the lime button any time to get paid, move
        money, or stay un-scammed. The tabs underneath — <b>Explore</b> (the live network + work),{" "}
        <b>Money</b> (balance, card, discover) and <b>Profile</b> — are always one tap away.
      </p>
      <p style={{ fontSize: 14, lineHeight: 1.55, fontWeight: 500 }}>
        Dosh runs on <b>Claude</b> ({status?.model || "…"}) with real tools — he opens your account,
        saves contacts, logs payments and moves money for real, persisted in{" "}
        <b>{status?.db ? "Supabase" : "memory"}</b>. Money only moves when you tap Confirm. No
        exceptions.
      </p>
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          padding: "8px 12px",
          borderRadius: 10,
          display: "inline-block",
          background: status?.key ? "#ECFDF3" : "#FEF3F2",
          color: status?.key ? "#027A48" : "#B42318",
        }}
      >
        {status === null
          ? "Checking connection…"
          : status.key
            ? "● Claude connected"
            : "● No API key — add ANTHROPIC_API_KEY to app/.env"}
      </div>
      <p style={{ fontSize: 12.5, lineHeight: 1.5, color: "#667085", marginTop: 14 }}>
        {mode === "new"
          ? 'Try: "Get paid", then "A client abroad" — watch Dosh set up your US account and save your first contact.'
          : 'Try: "get me paid by a US client", "send ₦40k to Mum", "someone overpaid and wants a refund".'}
      </p>
    </div>
  );
}
