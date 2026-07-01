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
    { tag: "@mike_edits", relationship: "US client, pays for video editing" },
    { tag: "Mum", relationship: "family in Enugu, monthly support + school fees" },
    { tag: "YouTube AdSense", relationship: "platform payout, roughly quarterly" },
  ],
};

export type Flow = {
  tag: string;
  name: string;
  line: string;
  meta: string;
  live?: boolean;
  direction: "in" | "out" | "platform";
  photo?: string;
};

export const flows: Flow[] = [
  {
    tag: "@mike_edits",
    name: "Mike Alvarez",
    line: "Sending you $350",
    meta: "Incoming · just now",
    live: true,
    direction: "in",
    photo: "/avatars/mike.png",
  },
  {
    tag: "Mum",
    name: "Mum",
    line: "You send ₦40,000 monthly",
    meta: "Next in 3 days",
    direction: "out",
    photo: "/avatars/mum.png",
  },
  {
    tag: "YouTube",
    name: "YouTube AdSense",
    line: "Payout expected",
    meta: "~Apr 28",
    direction: "platform",
    photo: "/avatars/youtube.png",
  },
];

export type Person = { tag: string; photo?: string };

export const activeNow: Person[] = [
  { tag: "@mike", photo: "/avatars/mike.png" },
  { tag: "@ada", photo: "/avatars/ada.png" },
  { tag: "@kelvin", photo: "/avatars/kelvin.png" },
  { tag: "@zara", photo: "/avatars/zara.png" },
  { tag: "+6" },
];

export const discover = ["View rates", "Increase limits", "Fund via Cash App", "Physical card"];
