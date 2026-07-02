import type { DoshContext } from "./dosh/api";

export const me: { name: string; tag: string; photo?: string } = {
  name: "Tobi Adeyemi",
  tag: "@tobi",
  photo: "/avatars/tobi.png",
};

// Registry so any name/tag surfaced (incl. dynamic Dosh cards) resolves to a face.
const avatarPhotos: Record<string, string> = {
  "@tobi": "/avatars/tobi.png",
  "tobi adeyemi": "/avatars/tobi.png",
  "@mike": "/avatars/mike.png",
  "@mike_edits": "/avatars/mike.png",
  "mike alvarez": "/avatars/mike.png",
  mike: "/avatars/mike.png",
  mum: "/avatars/mum.png",
  "@ada": "/avatars/ada.png",
  ada: "/avatars/ada.png",
  "@kelvin": "/avatars/kelvin.png",
  kelvin: "/avatars/kelvin.png",
  "@zara": "/avatars/zara.png",
  zara: "/avatars/zara.png",
  youtube: "/avatars/youtube.png",
  "youtube adsense": "/avatars/youtube.png",
};

export function photoFor(label?: string): string | undefined {
  if (!label) return undefined;
  return avatarPhotos[label.trim().toLowerCase()];
}

export const context: DoshContext = {
  tag: me.tag,
  name: me.name,
  usdBalance: 350,
  ngnBalance: 0,
  nairaPerUsd: 1418,
  people: [
    { tag: "@mike_edits", relationship: "US-based, pays for video editing" },
    { tag: "Mum", relationship: "family in Enugu, monthly support + school fees" },
    { tag: "YouTube AdSense", relationship: "platform payout, roughly quarterly" },
  ],
};

// Cold start: someone who just finished IDV. No money, no saved people, no
// history — the make-or-break onboarding moment we want Dosh to own.
export const newUser: { name: string; tag: string; photo?: string } = {
  name: "Chidi Okafor",
  tag: "@chidi",
  photo: undefined,
};

export const newUserContext: DoshContext = {
  tag: newUser.tag,
  name: newUser.name,
  usdBalance: 0,
  ngnBalance: 0,
  nairaPerUsd: 1418,
  people: [],
  justVerified: true,
};

export const discover = ["View rates", "Increase limits", "Fund via Cash App", "Physical card"];
