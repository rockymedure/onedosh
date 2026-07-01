import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { t } from "../theme";
import { CardArt } from "./CardArt";
import { rarityColor, type OwnedCard } from "./cards";

const GAP = 16;

export function CardStack({
  name,
  cards,
  onOpenStudio,
}: {
  name: string;
  cards: OwnedCard[];
  onOpenStudio: () => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(320);
  const [active, setActive] = useState(0);
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});

  useLayoutEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Big, prominent cards — a slim peek hints there's more to swipe.
  const slideW = Math.max(240, width - 22);
  const pad = (width - slideW) / 2;
  const step = slideW + GAP;

  function onScroll() {
    const el = scroller.current;
    if (!el) return;
    setActive(Math.round(el.scrollLeft / step));
  }

  // Keep active dot correct after mint (new card appended) — snap to it.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    setActive(Math.min(active, cards.length));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards.length]);

  const total = cards.length + 1; // +1 for the "new drop" tile

  return (
    <div>
      <div
        ref={scroller}
        onScroll={onScroll}
        style={{
          display: "flex",
          gap: GAP,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          paddingLeft: pad,
          paddingRight: pad,
          paddingTop: 4,
          paddingBottom: 20,
          scrollbarWidth: "none",
        }}
      >
        {cards.map((c) => (
          <div
            key={c.uid}
            style={{ flex: `0 0 ${slideW}px`, scrollSnapAlign: "center" }}
            onClick={() => setFlipped((f) => ({ ...f, [c.uid]: !f[c.uid] }))}
          >
            <CardArt
              art={c.design.art}
              name={name}
              last4={c.last4}
              width={slideW}
              flipped={!!flipped[c.uid]}
              editionLabel={c.edition}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 10,
                padding: "0 4px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: t.ink }}>
                  {c.design.name}
                </span>
                <span
                  style={{
                    fontSize: 9.5,
                    fontWeight: 800,
                    letterSpacing: 0.4,
                    textTransform: "uppercase",
                    color: rarityColor[c.design.rarity] === "#9AA0AC" ? t.sub : rarityColor[c.design.rarity],
                    border: `1px solid ${rarityColor[c.design.rarity]}`,
                    borderRadius: 999,
                    padding: "2px 7px",
                  }}
                >
                  {c.design.rarity}
                </span>
              </div>
              <span style={{ fontSize: 11, color: t.faint }}>tap to flip</span>
            </div>
          </div>
        ))}

        {/* New drop tile */}
        <div style={{ flex: `0 0 ${slideW}px`, scrollSnapAlign: "center" }}>
          <button
            onClick={onOpenStudio}
            style={{
              width: slideW,
              height: Math.round(slideW * 0.628),
              borderRadius: 22,
              border: `2px dashed ${t.border}`,
              background: "rgba(255,255,255,0.5)",
              color: t.sub,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <span
              style={{
                width: 46,
                height: 46,
                borderRadius: 23,
                background: t.lime,
                color: t.limeInk,
                display: "grid",
                placeItems: "center",
                fontSize: 26,
                fontWeight: 800,
                boxShadow: "0 6px 18px rgba(207,242,63,0.5)",
              }}
            >
              +
            </span>
            <span style={{ fontSize: 14, fontWeight: 800, color: t.ink }}>Design a new card</span>
            <span style={{ fontSize: 12 }}>Templates or generate your own</span>
          </button>
        </div>
      </div>

      {/* Dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 8 }}>
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            style={{
              width: i === active ? 18 : 6,
              height: 6,
              borderRadius: 3,
              background: i === active ? t.navy : t.border,
              transition: "width 0.2s, background 0.2s",
            }}
          />
        ))}
      </div>
    </div>
  );
}
