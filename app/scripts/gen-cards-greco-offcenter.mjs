// OneDosh GRECO-FUTURIST — OFF-CENTER batch.
// Same winning language (onyx / Carrara marble + gold/bronze hairline geometry,
// classical distilled to pure form) but deliberately BREAKING the centered-circle
// habit. The eclipse disc is relocated, shrunk to a coin-sized mint-mark, bled off
// an edge, or replaced entirely by architecture-led heroes (arch, fluting, pediment,
// meander, Ionic volute, horizon split).
// Model: fal-ai/bytedance/seedream/v4.5/edit
//
// Usage:  node scripts/gen-cards-greco-offcenter.mjs
// Output: public/board/cards-greco-offcenter/<name>.png (+ manifest.json)

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
const OUT_DIR = join(APP_ROOT, "public", "board", "cards-greco-offcenter");

// Anchor material/palette on the winners; pull architecture from Austin's set.
const REFS = {
  drum: join(ABS_DIR, "ab09-drum-bars.png"),
  offset: join(ABS_DIR, "ab13-offset-ring.png"),
  onyx: join(GRECO_DIR, "g07-onyx-gold.png"),
  portico: join(AUSTIN_DIR, "a2-marble-portico.png"),
  capital: join(AUSTIN_DIR, "a3-ionic-capital.png"),
  hall: join(AUSTIN_DIR, "a4-marble-hall.png"),
};

const GENRE =
  "A premium payment card, front face only, 3:2 aspect with softly rounded corners, floating with a soft cinematic " +
  "studio shadow, photographed like a real high-end object. Include a small brushed-metal EMV chip and a subtle " +
  "circular contactless mark, integrated tastefully.";

const DIRECTION =
  "GRECO-FUTURIST, ABSTRACT & MINIMAL: deep onyx-black marble or Carrara marble with thin gold / bronze hairline " +
  "linework. Classical antiquity distilled into PURE GEOMETRY — fine parallel lines, arcs, fluting, a fragment of " +
  "Greek-key rhythm, an arch or pediment silhouette. Generous negative space, restraint over ornament. Same luxury " +
  "family as the reference cards. Expensive, quiet, modern, timeless.";

// The whole point of this batch: kill the dead-center circle.
const COMPO =
  "COMPOSITION RULE — do NOT place a large glowing circle in the dead center of the card. Break the symmetry: use " +
  "off-center placement, edge bleeds, the rule-of-thirds, asymmetric weight, or an architectural hero instead of a " +
  "disc. If any sun/eclipse mark appears at all, keep it SMALL and pushed to a corner or edge like a coin mint-mark — " +
  "never the centered focal point.";

const GUARD =
  "IMPORTANT: NO human figures, NO faces, NO statues, NO literal free-standing columns or buildings, NO laurel wreaths. " +
  "Abstract geometric composition only. Use references for MATERIAL, PALETTE and STYLE — not to copy a scene. No legible " +
  "text, no numbers, no logos, no brand names. One coherent minimalist luxury card family, gallery-quality.";

const JOBS = [
  {
    name: "oc01-corner-mint",
    refs: ["onyx", "drum"],
    idea:
      "Near-empty onyx marble card carried by negative space, with just a SMALL coin-sized bronze sun mint-mark tucked in " +
      "the lower-right corner and one hairline gold baseline. The circle is a quiet detail, not the hero.",
  },
  {
    name: "oc02-edge-bleed-arc",
    refs: ["offset", "onyx"],
    idea:
      "A large gold eclipse ring pushed far off the RIGHT edge so only a tall arc bleeds into frame; the left two-thirds " +
      "are open onyx marble with the chip and a single fine gold rule. Bold asymmetry, no centered disc.",
  },
  {
    name: "oc03-arch-hero",
    refs: ["portico", "onyx"],
    idea:
      "Architecture-led: a single tall slender neoclassical ARCH outline in gold hairline rising from the base, off-center " +
      "to the right third, onyx marble ground, chip left. A tiny bronze keystone dot at the arch apex. No big circle.",
  },
  {
    name: "oc04-fluting-field",
    refs: ["portico", "drum"],
    idea:
      "The whole card face as vertical column FLUTING — precise parallel gold-and-shadow grooves catching light across " +
      "onyx marble — with a slim Greek-key meander baseline. Pure rhythm, architectural, zero circle.",
  },
  {
    name: "oc05-horizon-split",
    refs: ["onyx", "drum"],
    idea:
      "A calm horizontal duotone: warm Carrara marble upper band over deep onyx lower band, split by one crisp gold line " +
      "like a horizon. A small bronze half-sun rises on the seam far to the RIGHT. Landscape-like, off-center, minimal.",
  },
  {
    name: "oc06-pediment",
    refs: ["portico", "onyx"],
    idea:
      "A low wide TRIANGULAR pediment / gable outline in gold hairline spanning the lower half, fine parallel lines filling " +
      "it like a temple front, onyx marble above. Chip upper-left. Geometric, architectural hero, no disc.",
  },
  {
    name: "oc07-meander-column",
    refs: ["onyx", "drum"],
    idea:
      "A single bold vertical Greek-key MEANDER band running top-to-bottom down the right third in gold, the rest open onyx " +
      "marble with the chip left and a whisper of fine lines. Strong off-center vertical anchor, no circle.",
  },
  {
    name: "oc08-volute-corner",
    refs: ["capital", "onyx"],
    idea:
      "One elegant Ionic VOLUTE spiral scroll in fine gold linework anchored in the upper-right corner, unfurling inward; " +
      "vast empty onyx marble field, chip lower-left. Sculptural corner accent as hero, no centered ring.",
  },
  {
    name: "oc09-stacked-arcs-left",
    refs: ["hall", "offset"],
    idea:
      "A stack of concentric gold arcs radiating from the LEFT edge like nested archway shadows, fading right into open " +
      "onyx marble with the chip and contactless mark. Directional, asymmetric, architectural — no full centered circle.",
  },
  {
    name: "oc10-diagonal-rays",
    refs: ["drum", "onyx"],
    idea:
      "Fine gold sun-rays fanning diagonally from the bottom-LEFT corner across onyx marble, resolving into a small bronze " +
      "quarter-sun in that corner. Upper-right left as open marble with the chip. Dynamic corner light, off-center.",
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
    const prompt = `${GENRE} ${DIRECTION} ${COMPO} CONCEPT — ${job.idea} ${GUARD}`;
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
