// OneDosh — ETCHED MARBLE with GLOW-IN-THE-DARK (photoluminescent) etching.
//
// Product constraint: the card must be MANUFACTURABLE. No internal electronics,
// no backlit channels, no neon. The card is SOLID MARBLE with a physically ETCHED
// face. Light / shadow / reflection is just the material responding to its
// environment. The "glow" is PHOTOLUMINESCENT pigment sitting in the etched
// grooves — so in the dark the etched lines emerge and glow.
//
// This maps to an app dark-mode reveal: switch the app to dark -> the card glows.
//
// Strategy: for each concept we render the LIGHT-MODE card first (etched marble,
// no glow), then feed THAT exact render back in as the reference to produce its
// matching DARK-MODE twin (etched lines glowing). So each pair actually matches.
//
// Model: fal-ai/bytedance/seedream/v4.5/edit
// Usage:  node scripts/gen-cards-marble-glow.mjs
// Output: public/board/cards-marble-glow/<name>-light.png + <name>-dark.png

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
const OC_DIR = join(APP_ROOT, "public", "board", "cards-greco-offcenter");
const OC2_DIR = join(APP_ROOT, "public", "board", "cards-greco-offcenter2");
const OUT_DIR = join(APP_ROOT, "public", "board", "cards-marble-glow");

// Material / composition references — our cleanest etched-marble winners.
const REFS = {
  meander: join(OC2_DIR, "oc11-meander-column.png"),
  baseline: join(OC2_DIR, "oc17-key-baseline.png"),
  arch: join(OC_DIR, "oc03-arch-hero.png"),
};

const GENRE =
  "A premium payment card, front face only, 3:2 aspect with softly rounded corners, floating with a soft cinematic " +
  "studio shadow, photographed like a real high-end object. Include a small brushed-metal EMV chip and a subtle " +
  "circular contactless mark, integrated tastefully.";

const MATERIAL =
  "MATERIAL — CRITICAL & MANUFACTURABLE: the card is a solid slab of honed CARRARA MARBLE with a real ETCHED / engraved " +
  "face. The geometry is physically INCISED into the marble as fine, shallow grooves — NOT printed, NOT inlaid glowing " +
  "tubes, NOT neon, NOT backlit. There are NO internal electronics and NO light hardware inside the card. Light, soft " +
  "shadow and gentle reflection are simply the natural response of the marble surface and its incised grooves to the " +
  "surrounding light. A physically real, producible object.";

const DIRECTION =
  "Classical antiquity distilled to PURE, MODERN GEOMETRY etched into the marble — fine parallel lines, fluting, a clean " +
  "arc, or a single fragment of Greek-key meander. Generous negative space, restraint over ornament. Feels contemporary " +
  "and globally resonant — as relatable to a 23-year-old in Lagos as to a millennial in London. Fresh and confident, " +
  "never stuffy, antique, or museum-fussy.";

const COMPO =
  "COMPOSITION RULE — NO large circle in the dead center. Break symmetry with off-center placement, edge bleeds, " +
  "rule-of-thirds, or asymmetric weight. If a small sun/coin mark appears, keep it tiny and pushed to a corner/edge.";

const CHIP =
  "CHIP PLACEMENT — CRITICAL: the EMV chip is horizontally LEFT-aligned (near the left edge) BUT vertically CENTERED — its " +
  "center sits exactly on the card's horizontal midline (top-to-bottom middle). It must NOT float high or drift low.";

const GUARD =
  "IMPORTANT: NO human figures, NO faces, NO statues, NO free-standing 3D columns, NO literal temples or photographed " +
  "buildings, NO laurel wreaths, NO photo collage, NO internal lighting hardware. Fully drawn ABSTRACT etched geometry " +
  "only. No legible text, no numbers, no logos, no brand names. One coherent, producible marble card, gallery-quality.";

const LIGHT_MODE =
  "LIGHT-MODE RENDER — bright, neutral studio lighting on pale Carrara marble against a soft warm-neutral backdrop. The " +
  "etched grooves read ONLY through subtle shadow and highlight in the stone. Understated, tactile, luxurious. Absolutely " +
  "NO glow and NO emitted light — the surface is inert marble catching daylight.";

const DARK_MODE =
  "DARK-MODE RENDER — the EXACT SAME card and composition as the reference image, but now in near-darkness on a deep " +
  "charcoal backdrop. The etched grooves are filled with photoluminescent LUME exactly like the SUPER-LUMINOVA / tritium " +
  "lume painted on the hands and markers of a fine wristwatch at night: a SOFT, DIM, DIFFUSE, LOW-INTENSITY afterglow — " +
  "calm and quiet, with only a subtle soft bloom around each line. It is NOT neon, NOT a laser, NOT bright electric tubes, " +
  "NOT a lightbulb — it is the gentle, muted glow of a charged watch dial in a dark room. The lume color is the app's " +
  "signature electric lime / highlighter chartreuse (a bright yellow-green), but MUTED and understated, as if softly " +
  "charged and slowly releasing light. The lume is confined strictly to the thin etched LINES — it must NEVER fill a solid " +
  "area, block, or disc; a shape outline stays a thin glowing outline only. Only the etched lines emit this faint " +
  "luminescence; the marble body stays dark and matte and much of the card falls into shadow. Keep the same layout, same " +
  "chip position, same marks — only the lighting and the soft glowing lume etch change. Restrained and premium.";

const JOBS = [
  {
    name: "mg1-meander",
    refs: ["meander"],
    idea:
      "One vertical Greek-key meander band etched down the right third, two fine etched hairline rules crossing the card, " +
      "chip left on the midline, a tiny etched sun coin-mark lower-right.",
  },
  {
    name: "mg2-baseline",
    refs: ["baseline"],
    idea:
      "Mostly bare marble, a single crisp Greek-key meander band etched along the BASELINE, two thin etched rules through " +
      "the chip on the midline, small etched sun coin-mark upper-right. Maximum air.",
  },
  {
    name: "mg3-rails",
    refs: ["baseline"],
    idea:
      "Very minimal and modern: two slim vertical etched rules just right of center crossing one horizontal etched rule " +
      "through the chip, otherwise open marble. Clean, universal, contemporary.",
  },
  {
    name: "mg4-fluting",
    refs: ["meander"],
    idea:
      "A field of fine vertical FLUTING etched across the right two-thirds, fading into open marble on the left where the " +
      "chip sits on the midline. Rhythmic, tactile, modern.",
  },
  {
    name: "mg5-arc",
    refs: ["arch"],
    idea:
      "A single large clean ARC etched sweeping in from the right edge (a fragment of a circle, not centered), open marble " +
      "on the left with the chip on the midline and one fine etched rule. Bold, minimal, global-modern.",
  },
  {
    name: "mg6-onyx",
    refs: ["meander"],
    idea:
      "Dark GRAPHITE / onyx marble slab instead of pale marble, with a vertical Greek-key meander etched down the right and " +
      "two fine etched rules, chip left on the midline. The naturally dark tier — its glow-in-the-dark twin will be the most " +
      "dramatic.",
  },
];

function detectType(buf) {
  return buf[0] === 0xff && buf[1] === 0xd8 ? "image/jpeg" : "image/png";
}

async function genImage(prompt, image_urls) {
  const res = await fal.subscribe(MODEL, {
    input: { prompt, image_urls, image_size: { width: 1536, height: 1024 }, num_images: 1 },
  });
  const url = res?.data?.images?.[0]?.url || res?.images?.[0]?.url;
  if (!url) throw new Error("no image url in response");
  return Buffer.from(await (await fetch(url)).arrayBuffer());
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

  // DARK_ONLY=1 reuses the existing <name>-light.png files and only regenerates
  // the glowing dark twins (e.g. after changing the glow color/intensity).
  // ONLY=mg3-rails,mg6-onyx  limits which jobs run.
  // VARIANTS=3  produces multiple dark takes: -dark, -dark-b, -dark-c …
  const darkOnly = process.env.DARK_ONLY === "1";
  const onlySet = process.env.ONLY
    ? new Set(process.env.ONLY.split(",").map((s) => s.trim()))
    : null;
  const variants = Math.max(1, parseInt(process.env.VARIANTS || "1", 10));
  const suffixes = ["", "-b", "-c", "-d", "-e"];
  const activeJobs = onlySet ? JOBS.filter((j) => onlySet.has(j.name)) : JOBS;

  async function worker(job) {
    try {
      let lightUrl;
      if (darkOnly) {
        const lightPath = join(OUT_DIR, `${job.name}-light.png`);
        if (!existsSync(lightPath)) {
          console.error(`  SKIP ${job.name}: no existing light render to match`);
          return;
        }
        const lightBuf = readFileSync(lightPath);
        lightUrl = await fal.storage.upload(new Blob([lightBuf], { type: "image/png" }));
      } else {
        // Phase 1 — LIGHT mode (etched marble, no glow).
        const lightPrompt = `${GENRE} ${MATERIAL} ${DIRECTION} ${COMPO} ${CHIP} ${LIGHT_MODE} CONCEPT — ${job.idea} ${GUARD}`;
        const lightRefs = job.refs.map((k) => urlByKey[k]).filter(Boolean);
        const lightBuf = await genImage(lightPrompt, lightRefs);
        writeFileSync(join(OUT_DIR, `${job.name}-light.png`), lightBuf);
        manifest[`${job.name}-light`] = lightPrompt;
        lightUrl = await fal.storage.upload(new Blob([lightBuf], { type: "image/png" }));
      }

      // Phase 2 — DARK mode (same card, etch glows in soft watch-lume lime).
      const darkPrompt = `${GENRE} ${MATERIAL} ${DARK_MODE} ${CHIP} ${GUARD}`;
      for (let v = 0; v < variants; v++) {
        const darkBuf = await genImage(darkPrompt, [lightUrl]);
        const outName = `${job.name}-dark${v < suffixes.length ? suffixes[v] : "-" + v}`;
        writeFileSync(join(OUT_DIR, `${outName}.png`), darkBuf);
        manifest[outName] = darkPrompt;
        console.log(`    ${outName} saved`);
      }

      writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      done++;
      console.log(`  [${done}/${activeJobs.length}] ${job.name} done`);
    } catch (e) {
      const detail = e?.body ? JSON.stringify(e.body) : "";
      console.error(`  FAILED ${job.name}: ${e.message} ${detail}`);
    }
  }

  await Promise.all(activeJobs.map(worker));
  console.log(`Done. ${done}/${JOBS.length} pairs generated -> ${OUT_DIR}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
