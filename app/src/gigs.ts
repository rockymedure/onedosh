import { useEffect, useState } from "react";
import type { Job } from "./types";

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

// Full gig catalog, fetched once and cached, so chat cards can show accurate
// details (blurb, budget, cadence, location) by id — the model only supplies
// which gigs to show, not their data.
let cache: Job[] | null = null;
let inflight: Promise<Job[]> | null = null;

function toMap(jobs: Job[]): Record<string, Job> {
  return Object.fromEntries(jobs.map((j) => [j.id, j]));
}

export function useGigCatalog(): Record<string, Job> {
  const [map, setMap] = useState<Record<string, Job>>(() => (cache ? toMap(cache) : {}));
  useEffect(() => {
    if (cache) return;
    if (!inflight) {
      inflight = fetch("/api/jobs")
        .then((r) => r.json())
        .then((d) => (cache = (d?.jobs as Job[]) || []))
        .catch(() => (cache = []));
    }
    let alive = true;
    inflight.then((jobs) => alive && setMap(toMap(jobs)));
    return () => {
      alive = false;
    };
  }, []);
  return map;
}
