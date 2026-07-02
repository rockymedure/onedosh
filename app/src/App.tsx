import { useEffect, useState } from "react";
import { t, display } from "./theme";
import { StatusBar } from "./components/StatusBar";
import { Header } from "./components/Header";
import { TabBar } from "./components/TabBar";
import { ActivityTab } from "./tabs/ActivityTab";
import { WorkTab } from "./tabs/WorkTab";
import { DoshTab } from "./tabs/DoshTab";
import { MoneyTab } from "./tabs/MoneyTab";
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
  const [tab, setTab] = useState<Tab>("dosh");
  const [seed, setSeed] = useState<{ text: string; n: number } | undefined>();
  const [status, setStatus] = useState<{ key: boolean; model: string; db?: boolean } | null>(null);
  const [mode, setMode] = useState<Mode>("new");
  // Bumped to force DoshTab to remount (fresh conversation + reloaded state).
  const [reloadKey, setReloadKey] = useState(0);
  const isHandset = useIsHandset();

  useEffect(() => {
    health().then((h) => setStatus({ key: h.key, model: h.model, db: h.db }));
  }, []);

  function openDosh(prompt: string) {
    setSeed({ text: prompt, n: Date.now() });
    setTab("dosh");
  }

  async function reset() {
    await resetProfile(mode);
    setReloadKey((k) => k + 1);
    setTab("dosh");
  }

  const isNew = mode === "new";
  const doshProps = isNew
    ? { mode, opener: NEW_OPENER, starters: NEW_STARTERS }
    : { mode };

  const shell = (
    <>
      {!isHandset && <StatusBar />}
      <Header tab={tab} />
      <div style={{ flex: 1, minHeight: 0, padding: "12px 16px 0" }}>
        {tab === "activity" && <ActivityTab justVerified={isNew} onOpenDosh={openDosh} />}
        {tab === "work" && <WorkTab key={`work-${mode}-${reloadKey}`} mode={mode} onOpenDosh={openDosh} />}
        {tab === "dosh" && <DoshTab key={`${mode}-${reloadKey}`} seed={seed} {...doshProps} />}
        {tab === "money" && <MoneyTab justVerified={isNew} onOpenDosh={openDosh} />}
      </div>
      <TabBar tab={tab} onSelect={setTab} />
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
      <Legend status={status} mode={mode} onMode={setMode} onReset={reset} />
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
        him. <b>Activity</b> is the network (alive). <b>Dosh</b> gets you paid, moves it, keeps you
        un-scammed. <b>Money</b> is balance, card, discover. Profile's top-right, always.
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
