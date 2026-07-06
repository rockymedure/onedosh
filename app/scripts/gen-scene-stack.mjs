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
const BG = join(APP_ROOT, "public", "scene", "stack-bg.png");
const CARD = join(APP_ROOT, "public", "scene", "card-day.png");
const LAYOUT = join(APP_ROOT, "public", "board", "inspo", "05.png");
const OUT = join(APP_ROOT, "public", "scene", "card-stack.png");

const PROMPT = [
  "Premium fintech product hero, photorealistic, ultra-detailed, cinematic.",
  "Use the FIRST image as the SCENE and SETTING: a dramatic moonlit rock canyon whose towering eroded walls open upward",
  "to a soft blue twilight sky with a luminous MOON in the central opening. Keep this environment, its framing, its rock",
  "walls and its moon.",
  "Into the CENTRAL SKY OPENING (around and just below the moon), composite a floating EXPLODED STACK of premium payment",
  "cards, arranged and fanned diagonally with even offsets and overlap exactly like the layout of the THIRD image — several",
  "cards suspended in mid-air, each casting a soft realistic shadow on the one beneath it.",
  "The cards use the exact DESIGN of the SECOND image: a luxury MARBLE payment card with fine GOLD line-work — concentric",
  "gold arc grooves wrapping a brushed-metal EMV chip on the left, fine gold hairline rules, small etched triangle marks,",
  "and a small engraved GOLD 'D' monogram in the BOTTOM-RIGHT corner.",
  "Render a family of FOUR such cards in complementary MARBLE finishes — deep black onyx, pale Carrara white, warm",
  "honey/bronze-veined, and dark verde green — ALL sharing the SAME gold geometry, chip position, and gold 'D' mark.",
  "The floating cards catch cool MOONLIGHT with crisp reflections on the polished marble and gold; the moon stays subtly",
  "visible behind and between them. The rock walls remain sharp and dramatic, framing the cards as the hero.",
  "No text, no numbers, no other logos.",
].join(" ");

async function main() {
  for (const p of [BG, CARD, LAYOUT]) {
    if (!existsSync(p)) {
      console.error(`Missing reference: ${p}`);
      process.exit(1);
    }
  }
  console.log("Uploading references (scene bg, card, layout)…");
  const urls = [];
  for (const p of [BG, CARD, LAYOUT]) {
    const bytes = readFileSync(p);
    const type = p.endsWith(".jpg") || p.endsWith(".jpeg") ? "image/jpeg" : "image/png";
    urls.push(await fal.storage.upload(new Blob([bytes], { type })));
  }

  console.log("Generating card stack (4K)…");
  const res = await fal.subscribe(MODEL, {
    input: {
      prompt: PROMPT,
      image_urls: urls,
      aspect_ratio: "3:4",
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
