import { useEffect, useState } from "react";
import { t, display } from "./theme";
import { StatusBar } from "./components/StatusBar";
import { Header } from "./components/Header";
import { TabBar } from "./components/TabBar";
import { ActivityTab } from "./tabs/ActivityTab";
import { DoshTab } from "./tabs/DoshTab";
import { MoneyTab } from "./tabs/MoneyTab";
import { health } from "./dosh/api";
import type { Tab } from "./types";

export default function App() {
  const [tab, setTab] = useState<Tab>("dosh");
  const [seed, setSeed] = useState<{ text: string; n: number } | undefined>();
  const [status, setStatus] = useState<{ key: boolean; model: string } | null>(null);

  useEffect(() => {
    health().then((h) => setStatus({ key: h.key, model: h.model }));
  }, []);

  function openDosh(prompt: string) {
    setSeed({ text: prompt, n: Date.now() });
    setTab("dosh");
  }

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
      <Phone>
        <StatusBar />
        <Header tab={tab} />
        <div style={{ flex: 1, minHeight: 0, padding: "0 16px 96px" }}>
          {tab === "activity" && <ActivityTab onOpenDosh={openDosh} />}
          {tab === "dosh" && <DoshTab seed={seed} />}
          {tab === "money" && <MoneyTab onOpenDosh={openDosh} />}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}>
          <TabBar tab={tab} onSelect={setTab} />
        </div>
      </Phone>

      <Legend status={status} />
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
        borderRadius: 42,
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

function Legend({ status }: { status: { key: boolean; model: string } | null }) {
  return (
    <div style={{ width: 300, color: "#3B4557", fontFamily: display }}>
      <div style={{ fontSize: 26, fontWeight: 700, color: "#12141C", letterSpacing: "-0.03em" }}>
        Meet Dosh<span style={{ color: t.coral }}>.</span>
      </div>
      <p style={{ fontSize: 14, lineHeight: 1.55, fontWeight: 500 }}>
        Not a fintech app with a chatbot bolted on — a money guy who happens to have a bank behind
        him. <b>Activity</b> is the network (alive). <b>Dosh</b> gets you paid, moves it, keeps you
        un-scammed. <b>Money</b> is balance, card, discover. Profile's top-right, always.
      </p>
      <p style={{ fontSize: 14, lineHeight: 1.55, fontWeight: 500 }}>
        Dosh runs on <b>Claude</b> ({status?.model || "…"}). He talks like a person and builds the UI
        he needs on the fly — receive details, confirm sheets, scam warnings. Money only moves when
        you tap Confirm. No exceptions.
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
        Try: "get me paid by a US client", "send ₦40k to Mum", "someone overpaid and wants a refund".
      </p>
    </div>
  );
}
