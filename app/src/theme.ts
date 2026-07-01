// Tokens for OneDosh — youthful, high-energy take on the reference screens.
export const t = {
  navy: "#141C33",
  navyText: "#FFFFFF",
  bg: "#F1EFE7", // warm paper, not sterile white
  card: "#FFFFFF",
  ink: "#12141C",
  sub: "#5C6270",
  faint: "#9AA0AC",
  border: "#E7E4DA",

  // energy accents
  lime: "#CFF23F", // electric lime
  limeInk: "#3E4A00", // text on lime
  gold: "#F5C542",
  coral: "#FF6A4D",
  violet: "#7B61FF",
  blue: "#2E79B5",

  green: "#10B981",
  greenSoft: "#E7FBF1",
  red: "#F0453A",

  radiusCard: 24,
  radiusInner: 16,
  gutter: 16,
} as const;

export const font =
  '"Space Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

export const display = '"Space Grotesk", -apple-system, "Segoe UI", sans-serif';

// iOS 26 "Liquid Glass" surface — frosted, floating, translucent.
export const glass = {
  background: "rgba(255,255,255,0.55)",
  backdropFilter: "blur(20px) saturate(180%)",
  WebkitBackdropFilter: "blur(20px) saturate(180%)",
  boxShadow: "0 8px 30px rgba(20,28,51,0.10)",
} as const;

// Frosted navy for dark cards.
export const glassDark = {
  background: "rgba(20,28,51,0.82)",
  backdropFilter: "blur(20px) saturate(160%)",
  WebkitBackdropFilter: "blur(20px) saturate(160%)",
  boxShadow: "0 10px 34px rgba(20,28,51,0.30)",
} as const;

export const glassBorder = "1px solid rgba(255,255,255,0.75)";

// Lime glow for high-energy CTAs.
export const limeGlow = "0 6px 20px rgba(207,242,63,0.55)";
