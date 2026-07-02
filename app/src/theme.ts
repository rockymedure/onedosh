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

// Material 3 (Android) color roles, mapped onto the OneDosh brand rather than
// the default purple "Material You" palette. Used by the Android chrome
// (navigation bar, status bar) so the system reflects the target platform.
export const m3 = {
  // Surfaces — subtle tonal elevation over the warm paper background.
  surface: "#F1EFE7",
  surfaceContainer: "#EDEAE0", // nav bar rests here (one step up from surface)
  surfaceContainerHigh: "#E7E4DA",
  onSurface: "#12141C", // active label / high-emphasis text
  onSurfaceVariant: "#5C6270", // inactive icon + label

  // Secondary container = the pill behind the active nav item.
  secondaryContainer: "#E6EFBE", // soft lime tint
  onSecondaryContainer: "#141C33", // active icon on the pill

  outline: "#79747E",
  outlineVariant: "#CFCCC2",
  scrim: "rgba(18,20,28,0.32)",

  // Nav bar geometry (dp ~= px here).
  navHeight: 80,
  navIndicatorW: 64,
  navIndicatorH: 32,
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
