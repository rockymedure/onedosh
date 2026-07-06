// OneDosh GRECO-FUTURIST — "LUMINA" character batch.
// Same theme (greco-futurist luxury card, off-center, chip left + vertically
// centered, no dead-center circle) but a DIFFERENT CHARACTER: where the earlier
// runs were quiet / matte / engraved bronze, this tier is LUMINOUS & HIGH-TECH —
// pearl / Carrara marble with polished chrome-steel and recessed BACKLIT light
// channels glowing warm through the geometry. Sleeker, cooler, temple-of-the-future.
//
// Model: fal-ai/bytedance/seedream/v4.5/edit
// Usage:  node scripts/gen-cards-greco-lumina.mjs
// Output: public/board/cards-greco-lumina/<name>.png (+ manifest.json)

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
const OC2_DIR = join(APP_ROOT, "public", "board", "cards-greco-offcenter2");
const OUT_DIR = join(APP_ROOT, "public", "board", "cards-greco-lumina");

// Character refs: Austin's luminous futurist interiors + our off-center winners
// (for composition, chip placement and the off-center discipline).
const REFS = {
  hall: join(AUSTIN_DIR, "a4-marble-hall.png"),
  vault: join(AUSTIN_DIR, "a5-vaulted-gallery.png"),
  portico: join(AUSTIN_DIR, "a2-marble-portico.png"),
  meander: join(OC2_DIR, "oc11-meander-column.png"),
  arch: join(OC_DIR, "oc03-arch-hero.png"),
  baseline: join(OC2_DIR, "oc17-key-baseline.png"),
};

const GENRE =
  "A premium payment card, front face only, 3:2 aspect with softly rounded corners, floating with a soft cinematic " +
  "studio shadow, photographed like a real high-end object. Include a small brushed-metal EMV chip and a subtle " +
  "circular contactless mark, integrated tastefully.";

// The NEW character.
const CHARACTER =
  "CHARACTER — LUMINOUS FUTURIST tier: pearl-white or pale grey Carrara marble with POLISHED CHROME / stainless-steel " +
  "hairline inlays (cool silver, not matte bronze) and thin RECESSED BACKLIT light channels that glow a soft warm amber " +
  "from within the engraved lines, like the concealed lighting of a modern temple interior. Bright, clean, high-tech, " +
  "serene; cool marble + chrome balanced by warm glowing light. Sleeker and more futuristic than an engraved bronze card, " +
  "still unmistakably greco-futurist and gallery-grade.";

const DIRECTION =
  "Classical antiquity distilled into PURE GEOMETRY — fine parallel lines, fluting, arcs, a fragment of Greek-key meander, " +
  "an arch or pediment silhouette — but rendered as glowing light lines and chrome inlay on marble. Generous negative " +
  "space, restraint over ornament.";

const COMPO =
  "COMPOSITION RULE — NO large glowing circle in the dead center. Break symmetry with off-center placement, edge bleeds, " +
  "rule-of-thirds, or an architectural hero. If a sun/eclipse mark appears, keep it SMALL, pushed to a corner/edge like a " +
  "coin mint-mark — never the centered focal point.";

const CHIP =
  "CHIP PLACEMENT — CRITICAL: the EMV chip is horizontally LEFT-aligned (near the left edge) BUT vertically CENTERED — its " +
  "center sits exactly on the card's horizontal midline (top-to-bottom middle). It must NOT float high or drift low.";

const GUARD =
  "IMPORTANT: NO human figures, NO faces, NO statues, NO literal free-standing columns or photographed buildings, NO " +
  "laurel wreaths, NO photo collage. Fully drawn ABSTRACT geometric composition only. Use references for MATERIAL, LIGHT " +
  "and STYLE — not to copy a scene. No legible text, no numbers, no logos, no brand names. One coherent luminous luxury " +
  "card family, gallery-quality.";

const JOBS = [
  {
    name: "lm01-lit-meander",
    refs: ["meander", "hall"],
    idea:
      "Pearl-marble card, one vertical Greek-key meander band down the right third rendered as a GLOWING warm light channel " +
      "with chrome edges, two hairline chrome rules, chip left on the midline, tiny glowing sun mint-mark lower-right.",
  },
  {
    name: "lm02-backlit-arch",
    refs: ["arch", "vault"],
    idea:
      "Pale Carrara card, a tall slender neoclassical ARCH off-center right drawn as a thin recessed light channel glowing " +
      "warm amber, chrome keystone dot, chip left on the midline. Serene, temple-at-dusk glow.",
  },
  {
    name: "lm03-light-fluting",
    refs: ["portico", "vault"],
    idea:
      "The whole face as vertical column FLUTING, alternating polished-chrome grooves and thin warm glowing light lines on " +
      "pearl marble, a slim chrome meander baseline, chip left on the midline. Rhythmic, luminous, sleek.",
  },
  {
    name: "lm04-halo-corner",
    refs: ["hall", "meander"],
    idea:
      "Bright pearl-marble card, mostly open, with a small glowing warm halo ring tucked into the upper-right corner and " +
      "fine chrome radiating ticks, chip left on the midline. Minimal, futuristic, calm.",
  },
  {
    name: "lm05-lumen-baseline",
    refs: ["baseline", "hall"],
    idea:
      "Mostly bare pearl marble, a single crisp Greek-key meander band along the BASELINE glowing warm through chrome edges, " +
      "chip left on the midline sitting on the band, small glowing sun mint-mark upper-right. Maximum air.",
  },
  {
    name: "lm06-vault-arches",
    refs: ["vault", "arch"],
    idea:
      "A low arcade of three slender arches along the lower band, each outlined in a thin warm glowing light channel on cool " +
      "marble, chrome hairlines above, chip left on the midline, tiny contactless ring. Luminous colonnade.",
  },
  {
    name: "lm07-chrome-pediment",
    refs: ["portico", "hall"],
    idea:
      "A low wide triangular pediment across the lower half in polished chrome with fine warm-lit parallel lines beneath it, " +
      "open pearl marble above, chip left on the midline. Bright, architectural, high-tech.",
  },
  {
    name: "lm08-onyx-lumen",
    refs: ["meander", "vault"],
    idea:
      "Darker counterpart for the tier: deep graphite-onyx marble with COOL chrome hairlines and warm glowing light channels, " +
      "an off-center vertical meander of light on the right, chip left on the midline. The night version of the lumina card.",
  },
  {
    name: "lm09-edge-glow-arc",
    refs: ["arch", "hall"],
    idea:
      "Pearl-marble card, a large chrome ring pushed off the RIGHT edge so only a glowing warm arc bleeds in, open marble left " +
      "with the chip on the midline and one chrome rule. Crescent of light, bold asymmetry.",
  },
  {
    name: "lm10-lumen-portal",
    refs: ["vault", "arch"],
    idea:
      "A single tall neoclassical PORTAL / doorway off-center right, its opening filled with a soft warm luminous gradient like " +
      "a lit threshold, chrome frame, cool pearl marble around it, chip left on the midline. Aspirational, glowing gateway.",
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
    const prompt = `${GENRE} ${CHARACTER} ${DIRECTION} ${COMPO} ${CHIP} CONCEPT — ${job.idea} ${GUARD}`;
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
