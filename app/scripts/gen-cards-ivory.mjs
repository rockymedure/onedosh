// OneDosh — IVORY "light mode" family. Mirrors the winning onyx abstract cards
// but in pale Carrara-white marble + warm bronze / champagne-gold linework and a
// soft bronze eclipse ring. Same compositions -> a true light/dark card pair set.
// Model: fal-ai/bytedance/seedream/v4.5/edit
//
// Usage:  node scripts/gen-cards-ivory.mjs
// Output: public/board/cards-ivory/<name>.png (+ manifest.json)

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
const ABS_DIR = join(APP_ROOT, "public", "board", "cards-greco-abstract");
const OUT_DIR = join(APP_ROOT, "public", "board", "cards-ivory");

// Anchor each ivory card on its ONYX twin (for composition) + the ivory
// material reference (ab18 has the white-marble face we want).
const REFS = {
  split: join(ABS_DIR, "ab19-eclipse-split.png"),
  arcs: join(ABS_DIR, "ab14-twin-arcs.png"),
  ring2: join(ABS_DIR, "ab20-double-ring.png"),
  dial: join(ABS_DIR, "ab17-sun-tick-dial.png"),
  pure: join(ABS_DIR, "ab01-pure-ring.png"),
  drum: join(ABS_DIR, "ab09-drum-bars.png"),
  ticks: join(ABS_DIR, "ab05-radiant-ticks.png"),
  flute: join(ABS_DIR, "ab15-fine-fluting.png"),
  halo: join(ABS_DIR, "ab12-halo-rays.png"),
  ivory: join(ABS_DIR, "ab18-marble-light.png"), // white-marble material anchor
};

const GENRE =
  "A premium payment card, front face only, 3:2 aspect with softly rounded corners, floating with a soft cinematic " +
  "studio shadow, photographed like a real high-end object. Include a small brushed-metal EMV chip and a subtle " +
  "circular contactless mark, integrated tastefully.";

const DIRECTION =
  "LIGHT MODE / IVORY tier — the pale twin of an onyx card. Pure Carrara WHITE marble with soft cool-grey veining, warm " +
  "BRONZE and champagne-gold hairline linework, and a single soft glowing bronze eclipse RING as the hero mark. Distill " +
  "classical antiquity into PURE GEOMETRY: fine lines, arcs, radiating rays, a whisper of Greek-key. Bright, airy, " +
  "museum-quiet, expensive. It must clearly be the SAME design language as the onyx reference, just light.";

const GUARD =
  "IMPORTANT: keep it LIGHT — white/ivory marble ground, NOT black. NO human figures, NO faces, NO statues, NO literal " +
  "columns/arches/buildings, NO laurel wreaths. Abstract geometric composition only. Use the onyx reference for " +
  "COMPOSITION and the ivory reference for MATERIAL/PALETTE. No legible text, no numbers, no logos, no brand names. " +
  "One coherent minimalist luxury card, gallery-quality.";

const JOBS = [
  {
    name: "iv01-eclipse-split",
    refs: ["split", "ivory"],
    idea:
      "Ivory Carrara marble card, a single fine bronze rule line across the middle, the bronze eclipse ring sitting exactly " +
      "on the line, symmetric fine bronze sun-rays. The light twin of the eclipse-split hero.",
  },
  {
    name: "iv02-twin-arcs",
    refs: ["arcs", "ivory"],
    idea:
      "White marble card with a full field of fine bronze sun-rays behind a bronze eclipse ring, a thin Greek-key band, chip " +
      "left. Airy, elegant light version of the twin-arcs onyx card.",
  },
  {
    name: "iv03-double-ring",
    refs: ["ring2", "ivory"],
    idea:
      "Ivory marble, a bold bronze eclipse ring plus a hairline outer ring, fine radiating bronze lines, whisper of meander. " +
      "Calm, iconic, light.",
  },
  {
    name: "iv04-sun-dial",
    refs: ["dial", "ivory"],
    idea:
      "White marble card, bronze eclipse ring surrounded by graduated bronze tick marks like a watch dial, four longer at " +
      "the cardinal points. Instrument-grade, bright, premium.",
  },
  {
    name: "iv05-pure-ring",
    refs: ["pure", "ivory"],
    idea:
      "Ultra-clean ivory marble card, fine bronze radiating rays and a soft glowing bronze eclipse ring, thin Greek-key line. " +
      "The light twin of pure-ring.",
  },
  {
    name: "iv06-drum-bars",
    refs: ["drum", "ivory"],
    idea:
      "Pale marble card, bronze eclipse ring with three bronze horizontal bars to one side and fine vertical lines, tiny " +
      "meander. Restrained, modern, light.",
  },
  {
    name: "iv07-radiant-ticks",
    refs: ["ticks", "ivory"],
    idea:
      "White marble, bronze eclipse disc ringed by fine radiating bronze ticks, a couple of thin geometric lines. Precise, " +
      "airy, minimal light card.",
  },
  {
    name: "iv08-fine-fluting",
    refs: ["flute", "ivory"],
    idea:
      "Ivory marble card, left third of fine vertical bronze fluting lines, right two-thirds open marble with a half bronze " +
      "eclipse ring bleeding off the right edge. Bright, graphic, calm.",
  },
  {
    name: "iv09-halo-rays",
    refs: ["halo", "ivory"],
    idea:
      "White marble card, a bronze eclipse ring with a halo of fine bronze rays fanning only from the top, a thin Greek-key " +
      "band midway, lower half open marble. Dawn-light, elegant asymmetry.",
  },
  {
    name: "iv10-bare-ring",
    refs: ["pure", "ivory"],
    idea:
      "Near-empty pale Carrara marble card, faint grey veining, ONE soft glowing bronze eclipse ring slightly above center, " +
      "one thin bronze baseline. Maximum restraint, maximum air.",
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
