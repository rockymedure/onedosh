import { useEffect, useRef, useState } from "react";
import { t, display, glass, glassBorder, limeGlow } from "../theme";
import { DoshMark } from "../components/ui";
import { CardStack } from "../dosh/Cards";
import { askDosh, type DoshContext } from "../dosh/api";
import { context as returningContext } from "../data";
import type { ChatMessage, FeedItem } from "../types";

const OPENER = "Ayy 👋 I'm Dosh — your money guy. Get you paid, move it, make sure nobody plays you. What we doing?";

// Smart defaults only used at the very start / if the agent returns none.
// Every other turn the chips come straight from Dosh, based on the last action.
const STARTERS = ["💸 Get paid", "Send money", "Check my rate"];

export function DoshTab({
  seed,
  ctx = returningContext,
  opener = OPENER,
  starters = STARTERS,
}: {
  seed?: { text: string; n: number };
  ctx?: DoshContext;
  opener?: string;
  starters?: string[];
}) {
  const [feed, setFeed] = useState<FeedItem[]>([{ kind: "dosh", text: opener }]);
  const [chips, setChips] = useState<string[]>(starters);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const lastSeed = useRef(0);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [feed, busy]);

  useEffect(() => {
    if (seed && seed.n !== lastSeed.current) {
      lastSeed.current = seed.n;
      send(seed.text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]);

  async function send(text: string) {
    const clean = text.trim().replace(/^💸\s*/, "");
    if (!clean || busy) return;
    setInput("");
    setChips([]);

    const nextFeed: FeedItem[] = [...feed, { kind: "user", text: clean }];
    setFeed(nextFeed);
    setBusy(true);

    const history: ChatMessage[] = nextFeed.map((f) => ({
      role: f.kind === "user" ? "user" : "assistant",
      content: f.text,
    }));

    const res = await askDosh(history, ctx);
    setBusy(false);
    setFeed((f) => [...f, { kind: "dosh", text: res.reply, cards: res.cards }]);
    // Chips come straight from Dosh so they track the dialog. No generic
    // fallback mid-conversation — stale starters would ignore the context.
    setChips(Array.isArray(res.chips) ? res.chips : []);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", paddingBottom: 84 }}>
      <div ref={scroller} style={{ flex: 1, overflowY: "auto", padding: "4px 2px 8px" }}>
        {feed.map((item, i) => (
          <div key={i} className="dosh-enter" style={{ marginBottom: 16 }}>
            {item.kind === "dosh" ? (
              <div>
                <DoshSay hero={i === 0}>{item.text}</DoshSay>
                <CardStack cards={item.cards} onAction={send} />
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div
                  style={{
                    background: t.navy,
                    color: "#fff",
                    borderRadius: "18px 18px 6px 18px",
                    padding: "10px 15px",
                    fontSize: 14.5,
                    fontWeight: 500,
                    maxWidth: "80%",
                  }}
                >
                  {item.text}
                </div>
              </div>
            )}
          </div>
        ))}
        {busy && <Typing />}
      </div>

      {chips.length > 0 && (
        <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "8px 2px 12px" }}>
          {chips.map((c, i) => (
            <button
              key={c}
              onClick={() => send(c)}
              className="pop"
              style={{
                ...(i === 0 ? {} : glass),
                border: i === 0 ? "none" : glassBorder,
                background: i === 0 ? t.lime : glass.background,
                color: i === 0 ? t.limeInk : t.navy,
                borderRadius: 999,
                padding: "10px 16px",
                fontSize: 13.5,
                fontWeight: 700,
                whiteSpace: "nowrap",
                boxShadow: i === 0 ? limeGlow : glass.boxShadow,
                animationDelay: `${i * 0.04}s`,
              }}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginTop: 2,
          ...glass,
          border: `1.5px solid ${t.navy}`,
          borderRadius: 999,
          padding: "5px 5px 5px 18px",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="talk to your money…"
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            fontSize: 14.5,
            background: "transparent",
            color: t.ink,
          }}
        />
        <button
          onClick={() => send(input)}
          disabled={busy}
          style={{
            border: "none",
            background: t.lime,
            color: t.limeInk,
            width: 40,
            height: 40,
            borderRadius: 20,
            fontSize: 18,
            fontWeight: 800,
            opacity: busy ? 0.4 : 1,
          }}
        >
          ↑
        </button>
      </div>
    </div>
  );
}

function DoshSay({ children, hero }: { children: React.ReactNode; hero?: boolean }) {
  return (
    <div
      style={{
        position: "relative",
        ...(hero ? {} : glass),
        background: hero ? t.navy : glass.background,
        color: hero ? "#fff" : t.ink,
        border: hero ? "none" : glassBorder,
        borderRadius: 20,
        padding: hero ? "18px 18px" : "14px 16px",
        fontSize: hero ? 20 : 15.5,
        fontWeight: hero ? 700 : 500,
        lineHeight: hero ? 1.25 : 1.45,
        fontFamily: hero ? display : "inherit",
        boxShadow: hero ? "0 10px 30px rgba(20,28,51,0.28)" : glass.boxShadow,
        overflow: "hidden",
      }}
    >
      {hero && (
        <span
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 6,
            height: "100%",
            background: t.lime,
          }}
        />
      )}
      {children}
    </div>
  );
}

function Typing() {
  return (
    <div
      style={{
        display: "inline-flex",
        gap: 5,
        ...glass,
        border: glassBorder,
        borderRadius: 16,
        padding: "12px 16px",
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: 4,
            background: t.lime,
            animation: `pulse 0.9s ${i * 0.15}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
