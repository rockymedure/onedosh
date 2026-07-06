// OneDosh "Sun Series" palette — sampled from the Afro-futurist reference
// (board/inspo/07). Warm, saturated, joyful; cool teal/jade for balance;
// oxblood ink + bone paper for contrast. Cobalt used sparingly.

export const SUN = {
  solar: "#F7941E", // primary — sky / sun / coin
  ember: "#EE6A2B", // warm secondary
  vermilion: "#E22B22", // signal / triangle
  coral: "#F2887E", // soft accent / planets
  teal: "#159A90", // cool balance
  jade: "#1C8C63", // cool secondary
  sand: "#C88A52", // neutral warm / dunes
  bronze: "#9A5A2A", // deep neutral / metal
  ink: "#241008", // warm near-black
  bone: "#F3E8D0", // paper / cream
  cobalt: "#2A50C8", // rare cool accent
} as const;

export type SunColor = keyof typeof SUN;
