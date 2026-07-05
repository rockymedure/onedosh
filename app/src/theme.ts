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

// Greco-futurist palette — warm marble, bronze-gold, deep onyx. Kept light and
// restrained: the accent is a thin gold line, never a fill.
export const greco = {
  marbleWarm: "linear-gradient(155deg, #FBF7F0 0%, #F3ECE0 60%, #ECE3D4 100%)",
  marbleCool: "linear-gradient(155deg, #F8F7F3 0%, #EEEDE7 58%, #E6E5DD 100%)",
  onyx: "linear-gradient(150deg, #211B14 0%, #14110C 60%, #0B0908 100%)",
  ink: "#241E17", // onyx-brown text on marble
  sub: "#8A7C67",
  faint: "#B4A88F",
  gold: "#B0794A", // bronze-gold accent line
  goldBright: "#C79155",
  goldSoft: "rgba(176,121,74,0.55)",
  goldFaint: "rgba(176,121,74,0.16)",
  hairline: "rgba(176,121,74,0.28)",
  ivory: "#F5EFE4",
} as const;

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
