import { useState } from "react";
import { t, limeGlow } from "../theme";
import { CardArt } from "./CardArt";
import { generateCard } from "./api";
import {
  TEMPLATES,
  PROMPT_IDEAS,
  rarityColor,
  type CardDesign,
} from "./cards";

export function CardStudio({
  name,
  last4,
  initial,
  canGenerate,
  onClose,
  onMint,
}: {
  name: string;
  last4: string;
  initial: CardDesign;
  canGenerate: boolean;
  onClose: () => void;
  onMint: (design: CardDesign) => void;
}) {
  const [tab, setTab] = useState<"drops" | "generate">("drops");
  const [selected, setSelected] = useState<CardDesign>(initial);
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [isFresh, setIsFresh] = useState(false); // preview just changed → pop

  function pick(design: CardDesign) {
    setSelected(design);
    setIsFresh(true);
    setTimeout(() => setIsFresh(false), 420);
  }

  async function runGenerate() {
    if (!prompt.trim() || generating) return;
    setGenerating(true);
    setGenError(null);
    const res = await generateCard(prompt.trim());
    setGenerating(false);
    if (res.dataUrl) {
      pick({
        id: `ai-${Date.now()}`,
        name: "Your 1 of 1",
        rarity: "1 of 1",
        tagline: prompt.trim(),
        art: {
          kind: "image",
          src: res.dataUrl,
          ink: "#FFFFFF",
          sub: "#D7DCE4",
          accent: t.lime,
          accentInk: t.limeInk,
        },
      });
    } else {
      setGenError(res.message || "Couldn't generate. Try another vibe.");
    }
  }

  return (
    <div
      className="sheet-up"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1000,
        background: "linear-gradient(180deg, #0C1220 0%, #141C33 100%)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 16px 10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.3 }}>
            Card Studio
          </div>
          <div style={{ fontSize: 12, color: "#AEB8CC" }}>
            Mint a drop that&apos;s only yours
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            width: 34,
            height: 34,
            borderRadius: 17,
            border: "none",
            background: "rgba(255,255,255,0.12)",
            color: "#fff",
            fontSize: 18,
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          ✕
        </button>
      </div>

      {/* Live preview */}
      <div
        style={{
          padding: "6px 16px 12px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <div className={isFresh ? "card-pop" : ""}>
          <div className="floaty">
            <CardArt
              art={selected.art}
              name={name}
              last4={last4}
              width={296}
              editionLabel={selected.rarity === "1 of 1" ? "1 of 1 · minted for you" : undefined}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 12,
          }}
        >
          <span style={{ fontSize: 15, fontWeight: 800 }}>{selected.name}</span>
          <RarityPill rarity={selected.rarity} />
        </div>
        <div style={{ fontSize: 12, color: "#AEB8CC", marginTop: 3, textAlign: "center", maxWidth: 280 }}>
          {selected.tagline}
        </div>
      </div>

      {/* Segmented control */}
      <div
        style={{
          margin: "0 16px 10px",
          display: "flex",
          background: "rgba(255,255,255,0.08)",
          borderRadius: 12,
          padding: 4,
          flexShrink: 0,
        }}
      >
        {(["drops", "generate"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            style={{
              flex: 1,
              border: "none",
              borderRadius: 9,
              padding: "9px",
              fontSize: 13.5,
              fontWeight: 700,
              background: tab === k ? "#fff" : "transparent",
              color: tab === k ? t.navy : "#AEB8CC",
              transition: "background 0.15s",
            }}
          >
            {k === "drops" ? "Drops" : "✨ Generate"}
          </button>
        ))}
      </div>

      {/* Body */}
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "0 16px 12px" }}>
        {tab === "drops" ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {TEMPLATES.map((d) => {
              const active = selected.id === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => pick(d)}
                  style={{
                    border: active ? `2px solid ${t.lime}` : "2px solid transparent",
                    background: "transparent",
                    borderRadius: 16,
                    padding: 4,
                    textAlign: "left",
                    boxShadow: active ? limeGlow : "none",
                  }}
                >
                  <CardArt art={d.art} name={name} last4={last4} width={140} />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: 7,
                      padding: "0 2px",
                    }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{d.name}</span>
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: 4,
                        background: rarityColor[d.rarity],
                        boxShadow: `0 0 6px ${rarityColor[d.rarity]}`,
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div>
            <div
              style={{
                position: "relative",
                background: "rgba(255,255,255,0.08)",
                borderRadius: 14,
                padding: 12,
              }}
            >
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your card… e.g. neon Lagos skyline at night, rain-slick streets"
                rows={3}
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  resize: "none",
                  background: "transparent",
                  color: "#fff",
                  fontSize: 14,
                  lineHeight: 1.4,
                }}
              />
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 10 }}>
              {PROMPT_IDEAS.map((idea) => (
                <button
                  key={idea}
                  onClick={() => setPrompt(idea)}
                  style={{
                    border: "1px solid rgba(255,255,255,0.18)",
                    background: "rgba(255,255,255,0.05)",
                    color: "#D7DCE4",
                    borderRadius: 999,
                    padding: "7px 11px",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {idea}
                </button>
              ))}
            </div>

            {!canGenerate && (
              <div
                style={{
                  marginTop: 12,
                  fontSize: 12.5,
                  color: "#F5C542",
                  background: "rgba(245,197,66,0.12)",
                  borderRadius: 10,
                  padding: "10px 12px",
                  lineHeight: 1.4,
                }}
              >
                Add <b>FAL_KEY</b> to <code>app/.env</code> and restart to mint AI cards. Template
                drops work regardless.
              </div>
            )}

            {genError && (
              <div
                style={{
                  marginTop: 12,
                  fontSize: 12.5,
                  color: "#FF9A8B",
                  background: "rgba(255,106,77,0.12)",
                  borderRadius: 10,
                  padding: "10px 12px",
                }}
              >
                {genError}
              </div>
            )}

            <button
              onClick={runGenerate}
              disabled={generating || !prompt.trim() || !canGenerate}
              style={{
                marginTop: 14,
                width: "100%",
                border: "none",
                borderRadius: 14,
                padding: "14px",
                fontSize: 15,
                fontWeight: 800,
                background: generating || !prompt.trim() || !canGenerate ? "rgba(255,255,255,0.14)" : t.lime,
                color: generating || !prompt.trim() || !canGenerate ? "#AEB8CC" : t.limeInk,
                boxShadow: generating || !prompt.trim() || !canGenerate ? "none" : limeGlow,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {generating ? (
                <span style={{ position: "relative", zIndex: 1 }}>Minting your 1 of 1…</span>
              ) : (
                "✨ Generate card art"
              )}
              {generating && (
                <span
                  className="scan-line"
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    height: "60%",
                    top: 0,
                    background:
                      "linear-gradient(180deg, transparent, rgba(207,242,63,0.35), transparent)",
                  }}
                />
              )}
            </button>
            <div style={{ fontSize: 11, color: "#7C879C", textAlign: "center", marginTop: 8 }}>
              Powered by generative AI · usually a few seconds
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "10px 16px 16px",
          flexShrink: 0,
          borderTop: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(12,18,32,0.6)",
          backdropFilter: "blur(8px)",
        }}
      >
        <button
          onClick={() => onMint(selected)}
          style={{
            width: "100%",
            border: "none",
            borderRadius: 14,
            padding: "15px",
            fontSize: 15.5,
            fontWeight: 800,
            background: t.lime,
            color: t.limeInk,
            boxShadow: limeGlow,
          }}
        >
          Mint “{selected.name}” to my wallet
        </button>
      </div>
    </div>
  );
}

function RarityPill({ rarity }: { rarity: CardDesign["rarity"] }) {
  const c = rarityColor[rarity];
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: 0.4,
        textTransform: "uppercase",
        color: c,
        border: `1px solid ${c}`,
        borderRadius: 999,
        padding: "3px 8px",
      }}
    >
      {rarity}
    </span>
  );
}
