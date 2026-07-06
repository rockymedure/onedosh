import React from "react";
import { t } from "../theme";

// A Pixel-style Android device frame: a uniform dark bezel, a centered
// hole-punch selfie camera and side buttons (volume rocker + lime power key).
// Shared by the main app shell and the marketing hero scene. `screenBg` lets a
// caller (e.g. the day/night reveal) recolor the screen behind its children.
export function PhoneFrame({
  children,
  screenBg = t.bg,
  sideButtons = true,
}: {
  children: React.ReactNode;
  screenBg?: string;
  // The metallic volume rocker + power key on the right edge. Hidden in the
  // marketing hero scene so nothing distracts alongside the card.
  sideButtons?: boolean;
}) {
  return (
    <div
      style={{
        position: "relative",
        flexShrink: 0,
        padding: 7, // uniform bezel, Android-thin
        borderRadius: 44,
        background: "linear-gradient(150deg, #262B33 0%, #0B0E15 52%, #191D25 100%)",
        boxShadow:
          "0 44px 96px -24px rgba(12,18,32,0.55), 0 8px 24px rgba(12,18,32,0.28), inset 0 0 0 1px rgba(255,255,255,0.06)",
      }}
    >
      {/* Right-edge buttons */}
      {sideButtons && (
        <>
          <span
            aria-hidden
            style={{
              position: "absolute",
              right: -3,
              top: 156,
              width: 3.5,
              height: 92,
              borderRadius: 3,
              background: "linear-gradient(#2C313A, #12151C)",
            }}
          />
          <span
            aria-hidden
            style={{
              position: "absolute",
              right: -3,
              top: 266,
              width: 3.5,
              height: 54,
              borderRadius: 3,
              background: t.lime,
              boxShadow: "0 0 8px rgba(207,242,63,0.5)",
            }}
          />
        </>
      )}

      {/* Screen — fixed handset width; height shrinks to fit shorter windows so
          the frame is never clipped. The app inside scrolls. */}
      <div
        style={{
          position: "relative",
          // Lock true handset proportions (~9:19.5). Height is bounded by the
          // window; width is derived from it so the device never looks squat.
          height: "min(812px, calc(100dvh - 48px))",
          aspectRatio: "9 / 19.5",
          width: "auto",
          background: screenBg,
          borderRadius: 38,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "inset 0 0 0 2px rgba(0,0,0,0.55)",
          transition: "background 500ms ease",
        }}
      >
        {children}

        {/* Hole-punch selfie camera, centered in the status-bar gutter */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: 13,
            left: "50%",
            transform: "translateX(-50%)",
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 30%, #2E3A57 0%, #05070b 62%)",
            boxShadow: "0 0 0 2px rgba(0,0,0,0.5), inset 0 0 3px rgba(130,170,255,0.45)",
            zIndex: 50,
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}
