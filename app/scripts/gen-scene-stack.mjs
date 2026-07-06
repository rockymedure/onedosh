// OneDosh — CARD STACK hero.
//
// Recreates the floating exploded-stack layout of inspo/05 using OUR card design
// (onyx marble + gold line-work + engraved D), as a family of marble finishes,
// set against the moonlit rock/sky environment of g4.
//
// References (in order): layout (inspo/05), our card design (scene/card-day),
// background environment (greco/g4).
//
// Model: fal-ai/nano-banana-pro/edit  (4K)
// Usage:  node scripts/gen-scene-stack.mjs
// Output: public/scene/card-stack.png

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
const LAYOUT = join(APP_ROOT, "public", "board", "inspo", "05.png");
const CARD = join(APP_ROOT, "public", "scene", "card-day.png");
const BG = join(APP_ROOT, "public", "board", "greco", "g4.jpg");
const OUT = join(APP_ROOT, "public", "scene", "card-stack.png");

const PROMPT = [
  "Premium fintech product hero image, photorealistic, ultra-detailed, high-end studio photography.",
  "Recreate the floating EXPLODED CARD-STACK LAYOUT of the FIRST reference image: several identical-format payment cards",
  "fanned diagonally in mid-air, evenly offset and overlapping, each casting a soft realistic shadow on the one below.",
  "The cards use the exact DESIGN LANGUAGE of the SECOND reference image: a luxury MARBLE payment card with fine GOLD",
  "line-work — concentric gold arc grooves wrapping a brushed-metal EMV chip on the left, fine gold hairline rules, small",
  "etched triangle marks, and a small engraved GOLD 'D' monogram in the BOTTOM-RIGHT corner.",
  "Render a family of FOUR such cards in complementary MARBLE finishes — deep black onyx, pale Carrara white, warm",
  "honey/bronze-veined, and dark verde green — ALL sharing the SAME gold geometry, the same chip position, and the same",
  "gold 'D' mark.",
  "Set the stack against the moody moonlit environment of the THIRD reference image (pale eroded rock walls opening to a",
  "soft blue night sky with a luminous moon), softly blurred with shallow depth of field so the cards remain the hero.",
  "Cinematic light, crisp reflections on polished marble and gold, rich depth. No text, no numbers, no other logos.",
].join(" ");

async function main() {
  for (const p of [LAYOUT, CARD, BG]) {
    if (!existsSync(p)) {
      console.error(`Missing reference: ${p}`);
      process.exit(1);
    }
  }
  console.log("Uploading references (layout, card, background)…");
  const urls = [];
  for (const p of [LAYOUT, CARD, BG]) {
    const bytes = readFileSync(p);
    const type = p.endsWith(".jpg") || p.endsWith(".jpeg") ? "image/jpeg" : "image/png";
    urls.push(await fal.storage.upload(new Blob([bytes], { type })));
  }

  console.log("Generating card stack (4K)…");
  const res = await fal.subscribe(MODEL, {
    input: {
      prompt: PROMPT,
      image_urls: urls,
      aspect_ratio: "1:1",
      resolution: "4K",
      output_format: "png",
      num_images: 1,
    },
  });
  const url = res?.data?.images?.[0]?.url || res?.images?.[0]?.url;
  if (!url) throw new Error("no image url in response");
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  writeFileSync(OUT, buf);
  console.log(`  card-stack.png saved (${(buf.length / 1024).toFixed(0)} KB) -> ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
