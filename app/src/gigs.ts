// Gig thumbnails are curated art shipped in /public/gigs, keyed by job id.
// Kept as a frontend lookup so we never trust the model to emit image paths.
const KNOWN = new Set([
  "yt-editor",
  "tiktok",
  "thumbs",
  "ghost",
  "voiceover",
  "frontend",
  "va",
  "mix",
  "ugc-skincare",
  "bookkeeping",
]);

export function gigThumb(id?: string): string | undefined {
  if (id && KNOWN.has(id)) return `/gigs/${id}.png`;
  return undefined;
}
