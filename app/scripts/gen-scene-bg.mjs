// OneDosh — HERO SCENE ambient background pair (day + night).
//
// Distills all five of Austin's inspiration images into ONE calm, abstract,
// low-contrast greco environment that can sit BEHIND a phone mockup. Generates a
// matched day/night pair so the scene can crossfade between them.
//
//   day   — warm ivory marble daylight, soft bronze/stone, airy, gentle depth.
//   night — same composition at night: deep onyx marble, faint warm ambience and
//           a whisper of lime so it rhymes with the card's Luminova glow.
//
// The night version is generated FROM the day render so the two match exactly.
//
// Model: fal-ai/nano-banana-pro/edit (Google Gemini 3 Pro Image)
// Usage:  node scripts/gen-scene-bg.mjs
// Output: public/board/scene/bg-day.png + bg-night.png (+ manifest.json)

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
const AUSTIN_DIR = join(APP_ROOT, "public", "board", "inspo", "austin");
const OUT_DIR = join(APP_ROOT, "public", "board", "scene");

const REFS = {
  hero: join(AUSTIN_DIR, "a1-bronze-hero.png"),
  portico: join(AUSTIN_DIR, "a2-marble-portico.png"),
  capital: join(AUSTIN_DIR, "a3-ionic-capital.png"),
  hall: join(AUSTIN_DIR, "a4-marble-hall.png"),
  vault: join(AUSTIN_DIR, "a5-vaulted-gallery.png"),
};

const SCENE =
  "A calm, abstract, high-end greco-futurist ENVIRONMENT / backdrop — an atmospheric interior mood, not a specific " +
  "building. It blends the feeling of all the reference images (marble halls, a vaulted gallery, an ionic capital, a " +
  "portico, a bronze figure) into one soft, unified, minimal scene. Shot like an ambient editorial backdrop: shallow " +
  "depth of field, gentle blur, generous EMPTY NEGATIVE SPACE through the MIDDLE of the frame where a phone will be " +
  "placed on top. Low contrast, understated, expensive, serene. Landscape 3:2.";

const GUARD =
  "IMPORTANT: keep it SIMPLE and quiet — no busy detail, no strong focal subject in the center, no text, no logos, no " +
  "people's faces in the center, no harsh highlights. It must read as a subtle background that never competes with a " +
  "phone placed over its middle. Soft, tasteful, out-of-focus architectural suggestion only.";

const DAY =
  "DAY VERSION — warm IVORY marble daylight: pale Carrara and travertine tones, soft bronze and stone accents, warm " +
  "diffused sunlight, airy and bright, faint long shadows. Gallery-at-golden-hour calm.";

const NIGHT =
  "NIGHT VERSION — the EXACT SAME composition and framing as the reference image, but at NIGHT: deep onyx / charcoal " +
  "marble, dim and moody, lit only by faint warm pools of light, with a subtle whisper of soft LIME-green ambient glow " +
  "in the shadows (echoing photoluminescent watch-lume). Keep the same layout and negative space; only the lighting and " +
  "time of day change. Dark, quiet, premium.";

function detectType(buf) {
  return buf[0] === 0xff && buf[1] === 0xd8 ? "image/jpeg" : "image/png";
}

async function genImage(prompt, image_urls) {
  const res = await fal.subscribe(MODEL_EDIT, {
    input: {
      prompt,
      image_urls,
      aspect_ratio: "3:2",
      resolution: "2K",
      output_format: "png",
      num_images: 1,
    },
  });
  const url = res?.data?.images?.[0]?.url || res?.images?.[0]?.url;
  if (!url) throw new Error("no image url in response");
  return Buffer.from(await (await fetch(url)).arrayBuffer());
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  console.log("Uploading reference images…");
  const urls = [];
  for (const [key, p] of Object.entries(REFS)) {
    if (!existsSync(p)) {
      console.log(`  ${key} -> MISSING (${p})`);
      continue;
    }
    const bytes = readFileSync(p);
    urls.push(await fal.storage.upload(new Blob([bytes], { type: detectType(bytes) })));
    console.log(`  ${key} -> ok`);
  }

  const manifestPath = join(OUT_DIR, "manifest.json");
  const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : {};

  // Phase 1 — DAY, distilled from all five refs.
  const dayPrompt = `${SCENE} ${DAY} ${GUARD}`;
  console.log("Generating bg-day…");
  const dayBuf = await genImage(dayPrompt, urls);
  writeFileSync(join(OUT_DIR, "bg-day.png"), dayBuf);
  manifest["bg-day"] = dayPrompt;
  console.log(`  bg-day saved (${(dayBuf.length / 1024).toFixed(0)} KB)`);

  // Phase 2 — NIGHT, generated from the day render so the pair matches.
  const dayUrl = await fal.storage.upload(new Blob([dayBuf], { type: "image/png" }));
  const nightPrompt = `${SCENE} ${NIGHT} ${GUARD}`;
  console.log("Generating bg-night…");
  const nightBuf = await genImage(nightPrompt, [dayUrl]);
  writeFileSync(join(OUT_DIR, "bg-night.png"), nightBuf);
  manifest["bg-night"] = nightPrompt;
  console.log(`  bg-night saved (${(nightBuf.length / 1024).toFixed(0)} KB)`);

  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`Done -> ${OUT_DIR}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
