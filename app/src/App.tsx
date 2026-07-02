import { useEffect, useState } from "react";
import { t, display } from "./theme";
import { StatusBar } from "./components/StatusBar";
import { Header } from "./components/Header";
import { TabBar } from "./components/TabBar";
import { ActivityTab } from "./tabs/ActivityTab";
import { WorkTab } from "./tabs/WorkTab";
import { GigDetail } from "./tabs/GigDetail";
import { DoshTab } from "./tabs/DoshTab";
import { MoneyTab } from "./tabs/MoneyTab";
import { ProfileTab } from "./tabs/ProfileTab";
import { VerifiedScreen } from "./components/VerifiedScreen";
import { IdvFlow } from "./idv/IdvFlow";
import { newUser } from "./data";
import { health, resetProfile } from "./dosh/api";
import type { Tab, Job } from "./types";

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
  // Work lives inside Explore as a drill-in; this tracks whether we're on the
  // Explore home or pushed into the Work board (which shows a back arrow).
  const [showWork, setShowWork] = useState(false);
  // Deeper drill-in: a single gig's detail page (pushed on top of the board).
  const [gig, setGig] = useState<{ job: Job; booked: boolean } | null>(null);
  // Profile opens from the header avatar as a drill-in over the current tab.
  const [showProfile, setShowProfile] = useState(false);
  // Bumped to force DoshTab to remount (fresh conversation + reloaded state).
  const [reloadKey, setReloadKey] = useState(0);
  // The just-verified persona plays the IDV flow, then its completion moment,
  // before dropping into Dosh. Returning users skip both. idvActive gates the
  // Sumsub steps; showVerified gates the OneDosh "you're verified" hand-off.
  const [idvActive, setIdvActive] = useState(true);
  const [showVerified, setShowVerified] = useState(true);
  const isHandset = useIsHandset();

  useEffect(() => {
    health().then((h) => setStatus({ key: h.key, model: h.model, db: h.db }));
  }, []);

  // Tapping a bottom-nav destination resets any drill-in (Android-style).
  function selectTab(next: Tab) {
    setShowWork(false);
    setGig(null);
    setShowProfile(false);
    setTab(next);
  }

  function openDosh(prompt: string) {
    setSeed({ text: prompt, n: Date.now() });
    setShowProfile(false);
    setTab("dosh");
  }

  async function reset() {
    await resetProfile(mode);
    setReloadKey((k) => k + 1);
    setShowWork(false);
    setGig(null);
    setShowProfile(false);
    setIdvActive(mode === "new");
    setShowVerified(mode === "new");
    setTab("dosh");
  }

  function changeMode(m: Mode) {
    setMode(m);
    setShowWork(false);
    setGig(null);
    setShowProfile(false);
    setIdvActive(m === "new");
    setShowVerified(m === "new");
    setTab("dosh");
  }

  // Same persona switch, but stays on the current screen (used by the Profile
  // toggle) so the module reflects the choice in place.
  function pickMode(m: Mode) {
    setMode(m);
    setReloadKey((k) => k + 1);
    setShowWork(false);
    setGig(null);
    setIdvActive(m === "new");
    setShowVerified(m === "new");
  }

  // Hand-off from the IDV completion screen into the cold-start Dosh feed.
  function enterApp() {
    setShowVerified(false);
    setShowProfile(false);
    setTab("dosh");
  }

  const isNew = mode === "new";
  const gateIdv = isNew && idvActive;
  const gateVerified = isNew && !idvActive && showVerified;
  const doshProps = isNew
    ? { mode, opener: NEW_OPENER, starters: NEW_STARTERS }
    : { mode };

  const onWorkBoard = tab === "activity" && showWork;
  // Header back + title for the drill-in stack (Profile, or Explore → Work → gig).
  const back = showProfile
    ? () => setShowProfile(false)
    : gig
      ? () => setGig(null)
      : onWorkBoard
        ? () => setShowWork(false)
        : undefined;
  const drillTitle = showProfile ? "Profile" : gig ? "Gig" : onWorkBoard ? "Work" : undefined;
  const shell = (
    <>
      {!isHandset && <StatusBar />}
      {gateIdv ? (
        <IdvFlow onComplete={() => setIdvActive(false)} />
      ) : gateVerified ? (
        <VerifiedScreen name={newUser.name} onEnter={enterApp} />
      ) : (
      <>
      <Header
        tab={tab}
        onBack={back}
        title={drillTitle}
        onProfile={back ? undefined : () => setShowProfile(true)}
      />
      <div style={{ flex: 1, minHeight: 0, padding: "12px 16px 0" }}>
        <div
          key={showProfile ? "profile" : gig ? "gig" : onWorkBoard ? "work" : tab}
          className="tab-switch"
        >
        {showProfile ? (
          <ProfileTab onOpenDosh={openDosh} mode={mode} onMode={pickMode} />
        ) : (
          <>
            {tab === "activity" &&
              (gig ? (
                <GigDetail job={gig.job} booked={gig.booked} onOpenDosh={openDosh} />
              ) : onWorkBoard ? (
                <WorkTab
                  key={`work-${mode}-${reloadKey}`}
                  mode={mode}
                  onOpenDosh={openDosh}
                  onOpenGig={(job, booked) => setGig({ job, booked })}
                />
              ) : (
                <ActivityTab
                  justVerified={isNew}
                  onOpenDosh={openDosh}
                  onOpenWork={() => setShowWork(true)}
                />
              ))}
            {tab === "dosh" && <DoshTab key={`${mode}-${reloadKey}`} seed={seed} {...doshProps} />}
            {tab === "money" && <MoneyTab justVerified={isNew} onOpenDosh={openDosh} />}
          </>
        )}
        </div>
      </div>
      <TabBar tab={tab} onSelect={selectTab} />
      </>
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
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        padding: "32px 24px",
        flexWrap: "wrap",
      }}
    >
      <Phone>{shell}</Phone>
      <Legend status={status} mode={mode} onMode={changeMode} onReset={reset} />
    </div>
  );
}

function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        // Fixed handset width, but the height shrinks to fit shorter desktop
        // windows so the frame is never clipped. The app inside scrolls.
        width: 380,
        flexShrink: 0,
        height: "min(780px, calc(100dvh - 64px))",
        maxHeight: "calc(100dvh - 64px)",
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
