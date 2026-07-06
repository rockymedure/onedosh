// OneDosh — HERO SCENE background from g11 (image-to-image).
//
// Takes the g11 reference (a luminous greco portico receding to a sea horizon
// with soft cumulus and a prismatic light path) and renders a matched day/night
// pair sized for the hero (landscape 3:2) with calm central negative space where
// the phone sits. Day is generated FROM g11; night is generated FROM the day
// render so the two align for the crossfade.
//
// Model: fal-ai/nano-banana-pro/edit
// Usage:  node scripts/gen-scene-bg-g11.mjs
// Output: public/scene/bg-g11-day.png + bg-g11-night.png (+ manifest-g11.json)

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

const MODEL_EDIT = "fal-ai/nano-banana-pro/edit";
const OUT_DIR = join(APP_ROOT, "public", "scene");
const SRC = join(APP_ROOT, "public", "board", "greco", "g11.jpg");

const KEEP =
  "Reimagine this scene as a breathtaking, ultra-detailed WIDESCREEN 16:9 hero " +
  "backdrop, gallery-grade and cinematic. Preserve its identity — a grand greco " +
  "colonnade of fluted columns opening onto a luminous SEA horizon with soft " +
  "cumulus and the delicate prismatic light along the central path — but let the " +
  "image breathe with rich depth and atmosphere. Keep the CENTER of the frame " +
  "calm and OPEN — just clear marble floor, open sea and sky. ABSOLUTELY NO " +
  "device, NO phone, NO tablet, NO laptop, NO pedestal, NO plinth, NO object, NO " +
  "figure and NO text anywhere in the frame — only the empty architectural scene.";

const DAY =
  "DAY — bright, airy, sunlit: pale marble, warm stone, a calm turquoise-to-ivory " +
  "sea, gentle cumulus, a subtle tasteful rainbow shimmer on the path. Serene, " +
  "expensive, high dynamic range.";

const NIGHT =
  "NIGHT — the EXACT SAME composition and framing, at night: deep onyx and indigo " +
  "marble, a dim moonlit sea and dusky clouds, faint cool light, and a subtle " +
  "whisper of soft LIME-green glow along the central path (photoluminescent " +
  "watch-lume). Only lighting and time of day change. Dark, quiet, premium.";

async function genImage(prompt, image_url) {
  const res = await fal.subscribe(MODEL_EDIT, {
    input: {
      prompt,
      image_urls: [image_url],
      aspect_ratio: "16:9",
      resolution: "4K",
      output_format: "png",
      num_images: 1,
    },
  });
  const url = res?.data?.images?.[0]?.url || res?.images?.[0]?.url;
  if (!url) throw new Error("no image url in response");
  return Buffer.from(await (await fetch(url)).arrayBuffer());
}

async function main() {
  if (!existsSync(SRC)) {
    console.error(`Missing source: ${SRC}`);
    process.exit(1);
  }
  mkdirSync(OUT_DIR, { recursive: true });

  console.log("Uploading g11 as edit source…");
  const srcBytes = readFileSync(SRC);
  const srcUrl = await fal.storage.upload(new Blob([srcBytes], { type: "image/jpeg" }));

  const manifestPath = join(OUT_DIR, "manifest-g11.json");
  const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : {};

  // Phase 1 — DAY from g11.
  const dayPrompt = `${KEEP} ${DAY}`;
  console.log("Generating bg-g11-day…");
  const dayBuf = await genImage(dayPrompt, srcUrl);
  writeFileSync(join(OUT_DIR, "bg-g11-day.png"), dayBuf);
  manifest["bg-g11-day"] = dayPrompt;
  console.log(`  saved bg-g11-day.png (${(dayBuf.length / 1024).toFixed(0)} KB)`);

  // Phase 2 — NIGHT from the day render so the pair matches.
  const dayUrl = await fal.storage.upload(new Blob([dayBuf], { type: "image/png" }));
  const nightPrompt = `${KEEP} ${NIGHT}`;
  console.log("Generating bg-g11-night…");
  const nightBuf = await genImage(nightPrompt, dayUrl);
  writeFileSync(join(OUT_DIR, "bg-g11-night.png"), nightBuf);
  manifest["bg-g11-night"] = nightPrompt;
  console.log(`  saved bg-g11-night.png (${(nightBuf.length / 1024).toFixed(0)} KB)`);

  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`Done -> ${OUT_DIR} (bg-g11-day.png + bg-g11-night.png)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
