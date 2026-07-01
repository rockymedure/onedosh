// The OneDosh card design. One clean card, rendered by CardArt.

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
  last4: string;
  art: CardArt;
};

// The OneDosh card: deep black with a halftone dot field and electric lime.
export const CARD: CardDesign = {
  last4: "4921",
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
};
