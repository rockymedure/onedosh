// OneDosh GRECO-FUTURIST — OFF-CENTER batch 2.
// Refines the batch-1 winners (meander column, arch hero, pediment, corner rays)
// and adds fresh off-center / architecture-led ideas. Same onyx / marble + gold
// hairline language. Circle stays relocated, shrunk to a mint-mark, or gone.
//
// NEW HARD RULE this round: the EMV chip is LEFT-aligned horizontally but sits on
// the card's VERTICAL MIDLINE (centered top-to-bottom) — not floating high.
//
// Model: fal-ai/bytedance/seedream/v4.5/edit
// Usage:  node scripts/gen-cards-greco-offcenter2.mjs
// Output: public/board/cards-greco-offcenter2/<name>.png (+ manifest.json)

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
const OC_DIR = join(APP_ROOT, "public", "board", "cards-greco-offcenter");
const GRECO_DIR = join(APP_ROOT, "public", "board", "cards-greco");
const OUT_DIR = join(APP_ROOT, "public", "board", "cards-greco-offcenter2");

// Anchor on batch-1 winners for material + composition continuity.
const REFS = {
  meander: join(OC_DIR, "oc07-meander-column.png"),
  arch: join(OC_DIR, "oc03-arch-hero.png"),
  pediment: join(OC_DIR, "oc06-pediment.png"),
  rays: join(OC_DIR, "oc10-diagonal-rays.png"),
  onyx: join(GRECO_DIR, "g07-onyx-gold.png"),
  portico: join(AUSTIN_DIR, "a2-marble-portico.png"),
  capital: join(AUSTIN_DIR, "a3-ionic-capital.png"),
};

const GENRE =
  "A premium payment card, front face only, 3:2 aspect with softly rounded corners, floating with a soft cinematic " +
  "studio shadow, photographed like a real high-end object. Include a small brushed-metal EMV chip and a subtle " +
  "circular contactless mark, integrated tastefully.";

const DIRECTION =
  "GRECO-FUTURIST, ABSTRACT & MINIMAL: deep onyx-black marble (or Carrara marble) with thin gold / bronze hairline " +
  "linework. Classical antiquity distilled into PURE GEOMETRY — fine parallel lines, fluting, arcs, a fragment of " +
  "Greek-key meander, an arch or pediment silhouette. Generous negative space, restraint over ornament. Same luxury " +
  "family as the reference cards. Expensive, quiet, modern, timeless.";

const COMPO =
  "COMPOSITION RULE — do NOT place a large glowing circle in the dead center. Break symmetry with off-center placement, " +
  "edge bleeds, rule-of-thirds, or an architectural hero. If a sun/eclipse mark appears, keep it SMALL and pushed to a " +
  "corner/edge like a coin mint-mark — never the centered focal point.";

// The specific fix requested this round.
const CHIP =
  "CHIP PLACEMENT — CRITICAL: the brushed-metal EMV chip is horizontally LEFT-aligned (near the left edge) BUT " +
  "vertically CENTERED on the card — its center sits exactly on the card's horizontal midline, top-to-bottom middle. " +
  "It must NOT float high or drift low. Standard, correctly-positioned card chip, aligned to the vertical center.";

const GUARD =
  "IMPORTANT: NO human figures, NO faces, NO statues, NO literal free-standing columns or photographed buildings, NO " +
  "laurel wreaths, NO collage of a real capital/statue. Fully drawn ABSTRACT geometric composition only. Use references " +
  "for MATERIAL, PALETTE and STYLE — not to copy a scene. No legible text, no numbers, no logos, no brand names. One " +
  "coherent minimalist luxury card family, gallery-quality.";

const JOBS = [
  {
    name: "oc11-meander-column",
    refs: ["meander", "onyx"],
    idea:
      "Refine the winner: onyx marble card, one bold vertical gold Greek-key MEANDER band down the right third, two thin " +
      "gold rules, chip left on the vertical midline, tiny bronze sun mint-mark lower-right. Confident, restrained.",
  },
  {
    name: "oc12-arch-hero",
    refs: ["arch", "onyx"],
    idea:
      "Refine the arch: onyx marble, a single tall slender neoclassical ARCH in fine gold hairline off-center to the right, " +
      "tiny bronze keystone dot at the apex, chip left on the vertical midline, small coin mint-mark. Elegant, architectural.",
  },
  {
    name: "oc13-pediment",
    refs: ["pediment", "onyx"],
    idea:
      "Refine the pediment: low wide triangular gold gable outline across the lower half filled with fine parallel lines " +
      "like a temple front, open onyx marble above, chip left on the vertical midline, small contactless ring upper-right.",
  },
  {
    name: "oc14-meander-left",
    refs: ["meander", "onyx"],
    idea:
      "Mirror variation: bold vertical gold meander band down the LEFT third with the chip to its right on the vertical " +
      "midline, vast open onyx marble to the right, one hairline rule, small bronze sun mint-mark upper-right.",
  },
  {
    name: "oc15-fluted-pilasters",
    refs: ["portico", "onyx"],
    idea:
      "Two slender fluted PILASTER strips of fine vertical gold lines framing the right third like a doorway, open onyx " +
      "marble field left with the chip on the vertical midline, small mint-mark. Architectural rhythm, no circle.",
  },
  {
    name: "oc16-crescent-topright",
    refs: ["arch", "onyx"],
    idea:
      "A single thin glowing gold crescent arc tucked into the TOP-RIGHT corner (an eclipse hinted, never a full disc), " +
      "fine radiating hairlines beneath it, open onyx marble, chip left on the vertical midline. Quiet, asymmetric.",
  },
  {
    name: "oc17-key-baseline",
    refs: ["meander", "onyx"],
    idea:
      "Ultra-minimal: mostly bare onyx marble, a single crisp gold Greek-key meander band running along the BASELINE only, " +
      "chip left on the vertical midline, a small bronze sun mint-mark in the upper-right. Maximum air.",
  },
  {
    name: "oc18-arch-colonnade",
    refs: ["arch", "portico"],
    idea:
      "A low arcade of three repeating slender gold arches (a colonnade) along the lower band, open onyx marble above, chip " +
      "left on the vertical midline, tiny contactless ring. Rhythmic, architectural, no dominant circle.",
  },
  {
    name: "oc19-diagonal-flutes",
    refs: ["rays", "onyx"],
    idea:
      "A clean sweep of fine gold fluting lines running on a DIAGONAL across onyx marble from lower-left to upper-right, a " +
      "small bronze quarter-sun in the lower-left corner, chip left on the vertical midline. Dynamic, minimal.",
  },
  {
    name: "oc20-volute-drawn",
    refs: ["capital", "onyx"],
    idea:
      "One elegant Ionic VOLUTE spiral drawn in pure fine gold linework (NOT a photo) anchored upper-right, unfurling " +
      "inward, vast empty onyx marble, chip left on the vertical midline, small mint-mark lower-left. Sculptural accent.",
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
    const prompt = `${GENRE} ${DIRECTION} ${COMPO} ${CHIP} CONCEPT — ${job.idea} ${GUARD}`;
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
