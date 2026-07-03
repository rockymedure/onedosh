// OneDosh GRECO-FUTURIST — ABSTRACT distillation of g07-onyx-gold.
// Keep the material world (onyx / marble / bronze-gold + eclipse ring) but
// abstract AWAY literal columns, arches, laurel, statues. Classical language
// reduced to pure geometry: line fields, arcs, fragments, primitives, veins.
// Model: fal-ai/bytedance/seedream/v4.5/edit — breadth over depth.
//
// Usage:  node scripts/gen-cards-greco-abstract.mjs
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
const GRECO_DIR = join(APP_ROOT, "public", "board", "cards-greco");
const OUT_DIR = join(APP_ROOT, "public", "board", "cards-greco-abstract");

const REFS = {
  onyx: join(GRECO_DIR, "g07-onyx-gold.png"), // the card being abstracted
  hall: join(AUSTIN_DIR, "a4-marble-hall.png"),
  capital: join(AUSTIN_DIR, "a3-ionic-capital.png"),
  eclipse: join(INSPO_DIR, "08.png"),
  card: join(INSPO_DIR, "05.png"),
};

const GENRE =
  "A premium payment card, front face only, 3:2 aspect with softly rounded corners, floating with a soft cinematic " +
  "studio shadow, photographed like a real high-end object. Include a small brushed-metal EMV chip and a subtle " +
  "circular contactless mark, integrated tastefully.";

const DIRECTION =
  "GRECO-FUTURIST but ABSTRACT & MINIMAL: keep the luxury material world of the reference — deep onyx-black or Carrara " +
  "marble with thin gold / bronze linework and a single glowing eclipse RING as the hero mark. Distill classical antiquity " +
  "into PURE GEOMETRY. NO literal columns, NO arches, NO buildings, NO laurel wreaths, NO statues, NO temple facades. " +
  "Reduce everything to essential abstract forms: fine parallel lines, arcs, circles, a fragment of Greek-key rhythm, " +
  "triangles. Enormous negative space. Restraint over ornament. Expensive, quiet, modern, timeless.";

const GUARD =
  "IMPORTANT: NO human figures, NO faces, NO statues, NO literal architecture. Abstract geometric composition only. " +
  "Use references for MATERIAL and PALETTE only. No legible text, no numbers, no logos, no brand names. " +
  "One coherent minimalist luxury card family, gallery-quality.";

const JOBS = [
  {
    name: "ab01-pure-ring",
    refs: ["onyx", "eclipse"],
    idea:
      "The purest reduction: deep onyx-black card with subtle gold veining and ONE thin luminous gold eclipse ring at " +
      "center. Nothing else. Vast emptiness. Absolute restraint.",
  },
  {
    name: "ab02-key-fragment",
    refs: ["onyx", "eclipse"],
    idea:
      "Onyx card, a single short fragment of an abstract gold Greek-key line entering from one edge toward a gold eclipse " +
      "ring — like a minimalist circuit. Mostly empty space.",
  },
  {
    name: "ab03-line-field",
    refs: ["onyx", "capital"],
    idea:
      "Column fluting abstracted into a field of fine vertical gold hairlines across black onyx, with a gold eclipse ring " +
      "floating over them. Rhythmic, precise, minimal.",
  },
  {
    name: "ab04-arc-primitive",
    refs: ["onyx", "eclipse"],
    idea:
      "Arch reduced to pure geometry: a single thin gold semicircle ARC and a solid gold disc, offset, on marble. " +
      "Bauhaus-clean, two elements only, lots of air.",
  },
  {
    name: "ab05-radiant-ticks",
    refs: ["onyx", "eclipse"],
    idea:
      "Laurel/sunburst abstracted into a ring of fine radiating gold TICK marks around a dark eclipse disc on onyx. " +
      "Precise, instrument-like, minimal.",
  },
  {
    name: "ab06-ripple-rings",
    refs: ["onyx", "card"],
    idea:
      "Concentric thin gold ripple rings expanding from one off-center point on black onyx (the contactless idea as hero). " +
      "Hypnotic, minimal, elegant.",
  },
  {
    name: "ab07-duotone-block",
    refs: ["onyx", "capital"],
    idea:
      "Abstract colour-block: card split into a matte black-onyx field and a warm bronze-gold field by one clean line, with " +
      "a single eclipse ring straddling the divide. Graphic, bold, no ornament.",
  },
  {
    name: "ab08-euclid-primitives",
    refs: ["onyx", "eclipse"],
    idea:
      "Principles of shared forms: a thin gold triangle, circle and line arranged in quiet Euclidean composition on white " +
      "marble, one form glowing as the sun. Intellectual, minimal, timeless.",
  },
  {
    name: "ab09-drum-bars",
    refs: ["onyx", "capital"],
    idea:
      "Column abstracted into three stacked gold horizontal bars (like column drums) beside a gold eclipse ring on onyx. " +
      "Reductive, architectural rhythm without literal columns.",
  },
  {
    name: "ab10-gold-vein-sun",
    refs: ["onyx", "hall"],
    idea:
      "Kintsugi-like: flowing molten gold veins running through black marble that converge to imply a glowing sun/ring at " +
      "one point. Organic, abstract, luxurious. No hard geometry.",
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
