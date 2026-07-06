import React from "react";

const STACK = "/scene/card-stack.jpg";

// Full-bleed cinematic hero for the OneDosh marble card family — the exploded
// stack floating through a moonlit canyon opening. Presented as a poster so the
// full portrait composition reads without cropping on any screen.
export function StackHero() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background:
          "radial-gradient(120% 90% at 50% 8%, #14171d 0%, #0a0b0e 55%, #060708 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
        padding: "48px 20px",
        boxSizing: "border-box",
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial",
      }}
    >
      <header style={{ textAlign: "center", color: "#e9e6df" }}>
        <div
          style={{
            fontSize: 12,
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: "#c9a24a",
            fontWeight: 600,
          }}
        >
          OneDosh
        </div>
        <h1
          style={{
            margin: "10px 0 0",
            fontSize: "clamp(22px, 3vw, 34px)",
            fontWeight: 500,
            letterSpacing: "-0.01em",
          }}
        >
          The Marble Family
        </h1>
        <p
          style={{
            margin: "8px 0 0",
            fontSize: 14,
            color: "#8b8f98",
            maxWidth: 460,
          }}
        >
          Onyx, Carrara, honey-bronze and verde — one gold geometry, cast in
          four stones. Etched to glow after dark.
        </p>
      </header>

      <figure
        style={{
          margin: 0,
          maxWidth: "min(560px, 92vw)",
          width: "100%",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow:
            "0 40px 120px -30px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.06)",
        }}
      >
        <img
          src={STACK}
          alt="OneDosh marble card family floating through a moonlit canyon"
          style={{ display: "block", width: "100%", height: "auto" }}
        />
      </figure>
    </div>
  );
}

export default StackHero;
