// The OneDosh Card Studio catalog.
// Cards are collectibles: every design is a "drop" with a rarity. Template drops
// render as pure CSS (instant, zero-cost, always sharp). AI drops carry a
// generated image and mint as 1-of-1s.

export type Rarity = "Standard" | "Rare" | "Limited" | "1 of 1";

export type Overlay = "halftone" | "grid" | "confetti" | "waves" | "none";

export type CardArt =
  | {
      kind: "template";
      background: string;
      overlay: Overlay;
      ink: string; // primary text color on the card
      sub: string; // secondary text color
      accent: string; // chip / label fill
      accentInk: string; // text on the accent chip
      glow?: string; // ambient blob color
    }
  | {
      kind: "image";
      src: string;
      ink: string;
      sub: string;
      accent: string;
      accentInk: string;
    };

export type CardDesign = {
  id: string;
  name: string;
  rarity: Rarity;
  tagline: string;
  art: CardArt;
};

export type OwnedCard = {
  uid: string;
  design: CardDesign;
  last4: string;
  minted: string; // human label, e.g. "Founding drop" or "Jul 2026"
  edition?: string; // e.g. "#0042" or "1 of 1"
};

export const rarityColor: Record<Rarity, string> = {
  Standard: "#9AA0AC",
  Rare: "#7B61FF",
  Limited: "#F5C542",
  "1 of 1": "#CFF23F",
};

// ── Template drops ──────────────────────────────────────────────────────────
// Ordered loosely by "rarity ladder" so the gallery reads like a drop board.
export const TEMPLATES: CardDesign[] = [
  {
    id: "lime-static",
    name: "Lime Static",
    rarity: "1 of 1",
    tagline: "The founding OneDosh face — halftone dots, electric lime.",
    art: {
      kind: "template",
      background: "radial-gradient(120% 140% at 30% 20%, #1d2430 0%, #0b0e14 55%, #05070b 100%)",
      overlay: "halftone",
      ink: "#FFFFFF",
      sub: "#AEB8CC",
      accent: "#CFF23F",
      accentInk: "#3E4A00",
      glow: "#CFF23F",
    },
  },
  {
    id: "onyx",
    name: "Solid Onyx",
    rarity: "Standard",
    tagline: "Matte black. Nothing to prove.",
    art: {
      kind: "template",
      background: "linear-gradient(150deg, #17181c 0%, #0a0b0e 100%)",
      overlay: "none",
      ink: "#FFFFFF",
      sub: "#8A8F98",
      accent: "rgba(255,255,255,0.14)",
      accentInk: "#FFFFFF",
    },
  },
  {
    id: "naija-heat",
    name: "Naija Heat",
    rarity: "Limited",
    tagline: "Green-white-green, sun over Lagos.",
    art: {
      kind: "template",
      background:
        "linear-gradient(135deg, #0B6E4F 0%, #12A56B 42%, #F1EFE7 60%, #12A56B 78%, #0B6E4F 100%)",
      overlay: "waves",
      ink: "#0A2A1E",
      sub: "#134C38",
      accent: "#0A2A1E",
      accentInk: "#EAFBF2",
      glow: "#FFE39A",
    },
  },
  {
    id: "liquid-chrome",
    name: "Liquid Chrome",
    rarity: "Rare",
    tagline: "Brushed metal that catches the light.",
    art: {
      kind: "template",
      background:
        "linear-gradient(115deg, #d7dce4 0%, #a9b2c0 18%, #eef2f7 34%, #8f98a8 52%, #cfd6e0 70%, #7c8494 88%, #e7ecf3 100%)",
      overlay: "none",
      ink: "#1A2233",
      sub: "#4A5468",
      accent: "#1A2233",
      accentInk: "#EDEFF3",
    },
  },
  {
    id: "vaporwave",
    name: "Vaporwave",
    rarity: "Rare",
    tagline: "Sunset grid, dreamy and loud.",
    art: {
      kind: "template",
      background: "linear-gradient(160deg, #2B1055 0%, #7B2FF7 45%, #F857A6 100%)",
      overlay: "grid",
      ink: "#FFFFFF",
      sub: "#F4D7FF",
      accent: "#00F5D4",
      accentInk: "#062B27",
      glow: "#F857A6",
    },
  },
  {
    id: "detty-december",
    name: "Detty December",
    rarity: "Limited",
    tagline: "Seasonal drop — gold confetti, festival energy.",
    art: {
      kind: "template",
      background: "radial-gradient(130% 130% at 80% 0%, #14432f 0%, #0a2a1c 60%, #061a11 100%)",
      overlay: "confetti",
      ink: "#FFFFFF",
      sub: "#CDE6D6",
      accent: "#F5C542",
      accentInk: "#3A2A00",
      glow: "#F5C542",
    },
  },
  {
    id: "cowrie-gold",
    name: "Cowrie Gold",
    rarity: "Limited",
    tagline: "Old money, new rails.",
    art: {
      kind: "template",
      background: "linear-gradient(150deg, #6B4B1E 0%, #3E2C10 55%, #241708 100%)",
      overlay: "halftone",
      ink: "#FBEFD4",
      sub: "#D9BE8C",
      accent: "#F5C542",
      accentInk: "#3A2A00",
      glow: "#F5C542",
    },
  },
  {
    id: "aurora",
    name: "Aurora",
    rarity: "Rare",
    tagline: "Northern lights over midnight.",
    art: {
      kind: "template",
      background: "linear-gradient(160deg, #06121F 0%, #0B3B4A 45%, #14746B 75%, #1FA98C 100%)",
      overlay: "waves",
      ink: "#EAFBFF",
      sub: "#9FD8DE",
      accent: "#7B61FF",
      accentInk: "#FFFFFF",
      glow: "#1FA98C",
    },
  },
];

export const templateById = (id: string) => TEMPLATES.find((t) => t.id === id);

// Prompt ideas for the generative studio — of-the-moment vibes.
export const PROMPT_IDEAS = [
  "neon Lagos skyline at night, rain-slick streets",
  "liquid gold marble with black veins",
  "cowrie shells scattered on deep indigo",
  "iridescent oil-slick chrome, holographic",
  "afrofuturist circuit patterns, teal and violet",
  "sunset over the Atlantic, film grain",
];

// A last-4 that stays stable per card uid.
export function last4For(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return String(1000 + (h % 9000));
}
