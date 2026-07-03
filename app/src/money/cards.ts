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
    }
  | {
      // The greco-futurist "Eclipse" card, drawn natively in CSS so it carries
      // the real chip / number / name while keeping the onyx+gold aesthetic.
      kind: "eclipse";
      mode: "onyx" | "ivory";
      ink: string;
      sub: string;
      accent: string; // ring / rays / chip gold
      accentInk: string;
    };

export type CardDesign = {
  last4: string;
  art: CardArt;
};

// The OneDosh "Eclipse" card — greco-futurist distilled: onyx marble, gold
// sunburst + ring. Ships with a light (ivory) twin.
export const CARD_DESIGNS = {
  onyx: {
    last4: "4921",
    art: {
      kind: "eclipse",
      mode: "onyx",
      ink: "#F4ECD9",
      sub: "#C7B694",
      accent: "#E8C583",
      accentInk: "#2A2012",
    },
  },
  ivory: {
    last4: "4921",
    art: {
      kind: "eclipse",
      mode: "ivory",
      ink: "#2A2420",
      sub: "#7A6E5C",
      accent: "#B0794A",
      accentInk: "#FFFFFF",
    },
  },
} satisfies Record<string, CardDesign>;

export type CardMode = keyof typeof CARD_DESIGNS;

export const CARD: CardDesign = CARD_DESIGNS.onyx;
