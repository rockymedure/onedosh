// Generate OneDosh card designs with openai/gpt-image-2/edit on fal, using
// Rocky's saved inspiration (public/board/inspo/*.png) as MOOD/STYLE reference.
//
// Genre: greco-futurist × afro-futurist, warm & regal — the sun/orb, jewelled
// royalty, sequin light, mid-century geometric astronomy, premium metal cards.
//
// Usage:
//   node scripts/gen-cards.mjs [count] [startIndex]
//   e.g.  node scripts/gen-cards.mjs 5        -> first 5 designs
//         node scripts/gen-cards.mjs 45 5     -> the remaining 45
//
// Output: public/board/cards-gen/card-XX.png  (+ manifest.json of prompts)

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

const MODEL = "openai/gpt-image-2/edit";
const INSPO_DIR = join(APP_ROOT, "public", "board", "inspo");
const OUT_DIR = join(APP_ROOT, "public", "board", "cards-gen");
const REF_FILES = ["01.png", "02.png", "03.png", "04.png", "05.png"]; // skip 06 (solid black)

/* -------- genre building blocks -------- */
const MATERIALS = [
  "obsidian black metal with a soft matte finish and fine machined edge",
  "brushed sun-gold metal, warm and radiant",
  "warm ivory-cream lacquer with a thin polished gold rim",
  "deep cobalt-blue enamel over metal, glossy and rich",
  "terracotta / oxblood matte metal, earthy and warm",
  "patinated teal-green metal with subtle age and depth",
  "rose-copper brushed metal, pink-warm sheen",
  "sandstone-beige matte with a suede-like texture",
  "iridescent oil-slick holographic metal that shifts colour",
  "translucent frosted amber acrylic over metal",
];
const MOTIFS = [
  "a radiant rising sun orb with concentric halo glow, offset to one side",
  "a total solar eclipse — a dark disc with a single luminous rim",
  "concentric orbital rings and small planets, mid-century astronomy diagram",
  "a serene classical head in profile, silhouetted against a large sun disc halo",
  "a slim crescent with one bright star-glint",
  "a minimalist sunrise over a single horizon line with fine engraved rays",
  "a jewelled encrusted corner detail, tiny gemstones catching light like royalty",
  "an all-over sequin / fish-scale shimmer texture scattering light",
  "a geometric row of moon phases across the lower third",
  "a radial sunburst of fine rays emanating from a single point",
];
const EXTRAS = [
  "engraved hairline guilloché lines",
  "a small brushed-gold EMV chip integrated into the geometry",
  "deep embossed relief, tactile",
  "a faint West-African adire / kente rhythm woven subtly into the surface",
  "soft cinematic rim light and a long premium shadow",
];

const GENRE =
  "Ultra-premium payment card, front face of a credit/debit card, 3:2 with softly rounded corners, " +
  "floating on a soft warm neutral studio backdrop, luxury fintech, greco-futurist fused with afro-futurist, " +
  "regal, warm and human, cinematic lighting, extremely refined and expensive-looking.";
const GUARD =
  "IMPORTANT: use the supplied reference images ONLY as mood, colour and style guidance — do NOT copy any person, " +
  "face, or scene from them. The output is a CARD OBJECT, no people. No legible text, no brand names, no real card " +
  "numbers; at most an abstract embossed circular mark. Clean, iconic, gallery-quality.";

function promptFor(i) {
  const material = MATERIALS[i % MATERIALS.length];
  const motif = MOTIFS[(i * 3) % MOTIFS.length];
  const extra = EXTRAS[(i * 2) % EXTRAS.length];
  return `${GENRE} The card is ${material}. Hero motif: ${motif}. Detail: ${extra}. ${GUARD}`;
}

/* -------- run -------- */
const count = parseInt(process.argv[2] || "50", 10);
const start = parseInt(process.argv[3] || "0", 10);
const CONCURRENCY = 3;

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  console.log("Uploading reference images…");
  const refUrls = [];
  for (const f of REF_FILES) {
    const p = join(INSPO_DIR, f);
    if (!existsSync(p)) continue;
    const blob = new Blob([readFileSync(p)], { type: "image/png" });
    const url = await fal.storage.upload(blob);
    refUrls.push(url);
    console.log(`  ${f} -> ok`);
  }
  if (!refUrls.length) throw new Error("no reference images found");

  const jobs = [];
  for (let k = 0; k < count; k++) {
    const idx = start + k;
    jobs.push({ idx, prompt: promptFor(idx) });
  }

  const manifestPath = join(OUT_DIR, "manifest.json");
  const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : {};

  let done = 0;
  async function worker(job) {
    const label = `card-${String(job.idx + 1).padStart(2, "0")}`;
    try {
      const res = await fal.subscribe(MODEL, {
        input: {
          prompt: job.prompt,
          image_urls: refUrls,
          image_size: { width: 1536, height: 1024 },
          quality: "high",
          input_fidelity: "low",
          num_images: 1,
          output_format: "png",
        },
      });
      const url = res?.data?.images?.[0]?.url || res?.images?.[0]?.url;
      if (!url) throw new Error("no image url in response");
      const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
      writeFileSync(join(OUT_DIR, `${label}.png`), buf);
      manifest[label] = job.prompt;
      writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      done++;
      console.log(`  [${done}/${jobs.length}] ${label} saved (${(buf.length / 1024).toFixed(0)} KB)`);
    } catch (e) {
      const detail = e?.body ? JSON.stringify(e.body) : e?.status ? `status ${e.status}` : "";
      console.error(`  FAILED ${label}: ${e.message} ${detail}`);
    }
  }

  // simple concurrency pool
  const queue = [...jobs];
  const runners = Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
    while (queue.length) await worker(queue.shift());
  });
  await Promise.all(runners);
  console.log(`Done. ${done}/${jobs.length} generated -> ${OUT_DIR}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
