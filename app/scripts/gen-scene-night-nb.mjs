// OneDosh — NIGHT card face as a PIXEL-ALIGNED relight of the day face.
//
// Uses nano-banana-pro/edit (strong structural fidelity) to relight the exact
// current card-day.png into its glowing night twin WITHOUT moving any element,
// so the day/night crossfade lines up. Then the caller normalizes dimensions.
//
// Model: fal-ai/nano-banana-pro/edit
// Usage:  node scripts/gen-scene-night-nb.mjs
// Output: public/scene/card-night.png  (raw model output; normalize afterwards)

import { readFileSync, writeFileSync, existsSync } from "node:fs";
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

const MODEL = "fal-ai/nano-banana-pro/edit";
const DAY = join(APP_ROOT, "public", "scene", "card-day.png");
const OUT = join(APP_ROOT, "public", "scene", "card-night.png");

const PROMPT = [
  "Relight this exact payment-card face for NIGHT / dark mode. This is a PIXEL-FOR-PIXEL relight of the SAME image:",
  "KEEP every element in the EXACT same position, size, and shape — the concentric arc grooves on the left, the fine gold",
  "hairline rules, the small etched triangle marks, the brushed-metal EMV chip, and the engraved 'D' monogram in the",
  "bottom-right must NOT move, shift, rescale, or change at all. Do not re-compose or re-crop; identical framing, full-bleed",
  "card face filling the whole frame edge to edge.",
  "ONLY the lighting changes: plunge the black onyx marble into deep near-darkness — dark, matte, roughly 70% of the card",
  "staying in near-black shadow. Make the fine engraved GOLD line-work emit a SOFT, DIM, DESATURATED photoluminescent",
  "lime / olive glow (Super-LumiNova watch-lume): a gentle, low-intensity afterglow with only the faintest soft halo — NOT",
  "neon, NOT electric, NOT white-hot, NOT high-saturation. The glow is confined strictly to the thin LINES; it must never",
  "fill a solid area or disc.",
  "The brushed-metal EMV chip stays METALLIC and does NOT glow. The 'D' monogram glows softly like the lines.",
  "No text, no numbers, no logos, no background, no drop shadow, no border.",
].join(" ");

async function main() {
  if (!existsSync(DAY)) {
    console.error(`Missing ${DAY}`);
    process.exit(1);
  }
  console.log("Uploading current day face…");
  const url = await fal.storage.upload(new Blob([readFileSync(DAY)], { type: "image/png" }));
  console.log("Relighting to night (nano-banana-pro, aspect auto)…");
  const res = await fal.subscribe(MODEL, {
    input: {
      prompt: PROMPT,
      image_urls: [url],
      aspect_ratio: "auto",
      resolution: "2K",
      output_format: "png",
      num_images: 1,
    },
  });
  const out = res?.data?.images?.[0]?.url || res?.images?.[0]?.url;
  if (!out) throw new Error("no image url in response");
  const buf = Buffer.from(await (await fetch(out)).arrayBuffer());
  writeFileSync(OUT, buf);
  console.log(`  card-night.png saved (${(buf.length / 1024).toFixed(0)} KB)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
