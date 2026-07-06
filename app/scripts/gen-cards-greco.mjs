// OneDosh GRECO-FUTURIST cards — inspired by Austin's (PM) references.
// Marble + bronze + neoclassical geometry (Ionic scroll, Greek-key meander,
// fluting, arches, laurel) fused with the OneDosh sun/eclipse mark.
// Model: fal-ai/bytedance/seedream/v4.5/edit — breadth over depth.
//
// Usage:  node scripts/gen-cards-greco.mjs
// Output: public/board/cards-greco/<name>.png (+ manifest.json)

import { readFileSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { fal } from "@fal-ai/client";

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = join(__dirname, "..");

function loadEnv() {
  try {
    const raw = readFileSync(join(APP_ROOT, ".env"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {}
}
loadEnv();
if (!process.env.FAL_KEY) {
  console.error("Missing FAL_KEY in app/.env");
  process.exit(1);
}
fal.config({ credentials: process.env.FAL_KEY });

const MODEL = "fal-ai/bytedance/seedream/v4.5/edit";
const INSPO_DIR = join(APP_ROOT, "public", "board", "inspo");
const AUSTIN_DIR = join(INSPO_DIR, "austin");
const OUT_DIR = join(APP_ROOT, "public", "board", "cards-greco");

// Reference pool: Austin's greco-futurist set + our card object + eclipse + warm art.
const REFS = {
  hero: join(AUSTIN_DIR, "a1-bronze-hero.png"),
  portico: join(AUSTIN_DIR, "a2-marble-portico.png"),
  capital: join(AUSTIN_DIR, "a3-ionic-capital.png"),
  hall: join(AUSTIN_DIR, "a4-marble-hall.png"),
  vault: join(AUSTIN_DIR, "a5-vaulted-gallery.png"),
  card: join(INSPO_DIR, "05.png"),
  eclipse: join(INSPO_DIR, "08.png"),
  warm: join(INSPO_DIR, "07.png"),
};

const GENRE =
  "A premium payment card, front face only, 3:2 aspect with softly rounded corners, floating with a soft cinematic " +
  "studio shadow, photographed like a real high-end object. Include a small brushed-metal EMV chip and a subtle " +
  "circular contactless mark, integrated tastefully.";

const DIRECTION =
  "GRECO-FUTURIST luxury: classical antiquity reimagined as clean modern fintech — Carrara marble, polished bronze, " +
  "travertine, warm ivory light. Neoclassical geometry rendered minimal and futuristic. Expensive, timeless, museum-grade.";

const GUARD =
  "IMPORTANT: NO human figures, NO faces, NO statues of people ON the card. Only architectural / sculptural / geometric " +
  "classical motifs (columns, fluting, Ionic volute scrolls, Greek-key meander, arches, laurel, bronze sun relief). " +
  "Use references for material, palette and mood only — do NOT copy a scene. No legible text, no numbers, no logos. " +
  "One coherent luxury payment family, gallery-quality.";

const JOBS = [
  {
    name: "g01-marble-eclipse",
    refs: ["capital", "eclipse", "card"],
    idea:
      "White Carrara marble card, soft grey veining, with a single polished bronze-inlay eclipse/sun disc as the hero and " +
      "vast negative space. Serene, pure, expensive.",
  },
  {
    name: "g02-bronze-laurel",
    refs: ["hero", "card", "eclipse"],
    idea:
      "Solid cast-bronze card, warm patina, a bas-relief sunburst disc at center encircled by a fine laurel wreath, like " +
      "an ancient coin reborn as a card. Tactile, weighty, single material.",
  },
  {
    name: "g03-ionic-scroll",
    refs: ["capital", "card"],
    idea:
      "Bone-ivory marble card with one elegant embossed Ionic volute scroll motif to the side and a small bronze sun disc. " +
      "Architectural, restrained, refined deboss detail.",
  },
  {
    name: "g04-meander-band",
    refs: ["capital", "eclipse", "card"],
    idea:
      "Pale marble card with a single crisp bronze Greek-key (meander) band running across it and a glowing eclipse disc " +
      "as the hero. Classic pattern, modern restraint, 2 colours.",
  },
  {
    name: "g05-fluted-column",
    refs: ["capital", "portico", "card"],
    idea:
      "The whole card face as vertical column FLUTING — precise parallel marble grooves catching light — with a bronze sun " +
      "disc rising at the top edge. Sculptural, tactile, minimal palette.",
  },
  {
    name: "g06-travertine-arch",
    refs: ["vault", "portico", "eclipse"],
    idea:
      "Warm travertine-stone card in ivory and honey light, a single softly glowing neoclassical ARCH deboss framing a warm " +
      "sun disc, gentle golden-hour gradient. Calm, temple-like, luminous.",
  },
  {
    name: "g07-onyx-gold",
    refs: ["hall", "eclipse", "card"],
    idea:
      "Black onyx-marble card with fine gold veining and a thin gold eclipse RING as the hero. Dark, dramatic, ultra-luxury " +
      "tier. Deep black + gold only.",
  },
  {
    name: "g08-portal-gateway",
    refs: ["hall", "portico", "eclipse"],
    idea:
      "Marble card with a single tall neoclassical PORTAL / doorway deboss, and a bright sun disc glowing through the opening " +
      "like a gateway. Aspirational, architectural, minimal.",
  },
  {
    name: "g09-travertine-minimal",
    refs: ["vault", "card", "eclipse"],
    idea:
      "Ultra-minimal warm travertine card, almost bare stone texture, with just a tiny inlaid bronze sun disc near the chip " +
      "and generous empty space. Quiet, tactile, confident.",
  },
  {
    name: "g10-bronze-marble-split",
    refs: ["hero", "capital", "card"],
    idea:
      "Bold duotone: one half polished bronze, one half white marble, split by a clean vertical seam, with an eclipse sun " +
      "disc straddling the seam (bronze on marble, marble on bronze). Striking, graphic, premium.",
  },
];

function detectType(buf) {
  return buf[0] === 0xff && buf[1] === 0xd8 ? "image/jpeg" : "image/png";
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  console.log("Uploading reference images…");
  const urlByKey = {};
  for (const [key, p] of Object.entries(REFS)) {
    if (!existsSync(p)) {
      console.log(`  ${key} -> MISSING (${p})`);
      continue;
    }
    const bytes = readFileSync(p);
    urlByKey[key] = await fal.storage.upload(new Blob([bytes], { type: detectType(bytes) }));
    console.log(`  ${key} -> ok`);
  }

  const manifestPath = join(OUT_DIR, "manifest.json");
  const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : {};
  let done = 0;

  async function worker(job) {
    const prompt = `${GENRE} ${DIRECTION} CONCEPT — ${job.idea} ${GUARD}`;
    const image_urls = job.refs.map((k) => urlByKey[k]).filter(Boolean);
    try {
      const res = await fal.subscribe(MODEL, {
        input: { prompt, image_urls, image_size: { width: 1536, height: 1024 }, num_images: 1 },
      });
      const url = res?.data?.images?.[0]?.url || res?.images?.[0]?.url;
      if (!url) throw new Error("no image url in response");
      const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
      writeFileSync(join(OUT_DIR, `${job.name}.png`), buf);
      manifest[job.name] = prompt;
      writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      done++;
      console.log(`  [${done}/${JOBS.length}] ${job.name} saved (${(buf.length / 1024).toFixed(0)} KB)`);
    } catch (e) {
      const detail = e?.body ? JSON.stringify(e.body) : "";
      console.error(`  FAILED ${job.name}: ${e.message} ${detail}`);
    }
  }

  await Promise.all(JOBS.map(worker));
  console.log(`Done. ${done}/${JOBS.length} generated -> ${OUT_DIR}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
