// OneDosh GRECO-FUTURIST — ABSTRACT, batch 2.
// More of the winning language: onyx/marble + gold + single glowing eclipse ring,
// classical reduced to pure geometry. Skewed toward the restrained standouts
// (pure ring, drum bars, radiant ticks, line field) with fresh variations.
// Model: fal-ai/bytedance/seedream/v4.5/edit
//
// Usage:  node scripts/gen-cards-greco-abstract2.mjs
// Output: public/board/cards-greco-abstract/<name>.png (+ manifest.json)

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
const ABS_DIR = join(APP_ROOT, "public", "board", "cards-greco-abstract");
const GRECO_DIR = join(APP_ROOT, "public", "board", "cards-greco");
const OUT_DIR = ABS_DIR;

// Anchor on the winners from batch 1 for material + composition consistency.
const REFS = {
  ring: join(ABS_DIR, "ab01-pure-ring.png"),
  drum: join(ABS_DIR, "ab09-drum-bars.png"),
  ticks: join(ABS_DIR, "ab05-radiant-ticks.png"),
  onyx: join(GRECO_DIR, "g07-onyx-gold.png"),
  eclipse: join(INSPO_DIR, "08.png"),
};

const GENRE =
  "A premium payment card, front face only, 3:2 aspect with softly rounded corners, floating with a soft cinematic " +
  "studio shadow, photographed like a real high-end object. Include a small brushed-metal EMV chip and a subtle " +
  "circular contactless mark, integrated tastefully.";

const DIRECTION =
  "GRECO-FUTURIST but ABSTRACT & MINIMAL: deep onyx-black or Carrara marble with thin gold / bronze linework and a single " +
  "glowing gold eclipse RING as the hero mark. Distill classical antiquity into PURE GEOMETRY — fine parallel lines, arcs, " +
  "circles, radiating rays, a small fragment of Greek-key rhythm. Generous negative space. Restraint over ornament. " +
  "Consistent luxury family with the reference cards. Expensive, quiet, modern, timeless.";

const GUARD =
  "IMPORTANT: NO human figures, NO faces, NO statues, NO literal columns/arches/buildings, NO laurel wreaths. " +
  "Abstract geometric composition only. Use references for MATERIAL, PALETTE and STYLE. No legible text, no numbers, " +
  "no logos, no brand names. One coherent minimalist luxury card family, gallery-quality.";

const JOBS = [
  {
    name: "ab11-bare-ring",
    refs: ["ring", "onyx"],
    idea:
      "Near-empty deep onyx card, faint gold veining, ONE glowing gold eclipse ring slightly above center, and nothing " +
      "else but a whisper of a thin gold baseline. Maximum restraint, maximum air.",
  },
  {
    name: "ab12-halo-rays",
    refs: ["ring", "ticks"],
    idea:
      "Eclipse ring with a soft halo of very fine gold rays fanning only from the TOP arc, like dawn light. Lower half " +
      "pure black marble emptiness. Elegant asymmetry.",
  },
  {
    name: "ab13-offset-ring",
    refs: ["drum", "ring"],
    idea:
      "Composition-forward: the gold eclipse ring pushed to the right third, two thin gold rule lines crossing the card, " +
      "chip on the left in calm space. Editorial, confident, minimal.",
  },
  {
    name: "ab14-twin-arcs",
    refs: ["ring", "onyx"],
    idea:
      "Two concentric thin gold arcs cradling the eclipse ring from below like a chalice of light, onyx marble ground. " +
      "Quiet, symmetrical, refined.",
  },
  {
    name: "ab15-fine-fluting",
    refs: ["drum", "ring"],
    idea:
      "Left third filled with ultra-fine vertical gold fluting lines, right two-thirds open black marble with the eclipse " +
      "ring. Balanced tension between rhythm and emptiness.",
  },
  {
    name: "ab16-meander-corner",
    refs: ["ring", "eclipse"],
    idea:
      "Onyx card, eclipse ring centered, and a single tasteful gold Greek-key meander fragment tucked in one corner only. " +
      "Everything else empty. Precise, understated.",
  },
  {
    name: "ab17-sun-tick-dial",
    refs: ["ticks", "ring"],
    idea:
      "Watch-dial precision: eclipse ring surrounded by a full circle of tiny graduated gold tick marks, four slightly " +
      "longer at the cardinal points. Instrument-grade, minimal, luxurious.",
  },
  {
    name: "ab18-marble-light",
    refs: ["onyx", "ring"],
    idea:
      "Warm variation: pale Carrara WHITE marble card with soft grey veining and a thin bronze eclipse ring, plus a single " +
      "faint bronze baseline. Bright, airy, museum-quiet counterpart to the black tier.",
  },
  {
    name: "ab19-eclipse-split",
    refs: ["drum", "ring"],
    idea:
      "One clean thin gold horizontal line splits the card; the eclipse ring sits exactly on the line, half above / half " +
      "below. Balanced, graphic, extremely simple.",
  },
  {
    name: "ab20-double-ring",
    refs: ["ring", "onyx"],
    idea:
      "Two nested gold rings (a bold glowing eclipse ring and a hairline outer ring) on black marble with vast empty space. " +
      "Calm, iconic, badge-like.",
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
