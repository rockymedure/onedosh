import { fal } from "@fal-ai/client";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const APP_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

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
if (process.env.FAL_KEY) fal.config({ credentials: process.env.FAL_KEY });

const MODEL = "fal-ai/nano-banana-pro/edit";
const BASE = join(APP_ROOT, "public", "scene", "stack-wide.jpg");
const OUT = join(APP_ROOT, "public", "scene", "stack-wide.png");

const PROMPT = [
  "Convert this scene to deep NIGHTTIME so it feels calm and uncluttered, not busy.",
  "Plunge the rock-canyon walls into DARK, near-black shadow with only faint rim moonlight on their edges, so the busy rock",
  "texture recedes and quiets down. Turn the sky into a deep dark blue night with the luminous MOON as the main light source",
  "behind the cards, casting a soft glow into the opening.",
  "Keep the floating STACK of four marble cards as the clear hero, in the EXACT same positions and design — onyx-black,",
  "pale Carrara, honey-bronze and verde-green marble with fine gold line-work and the engraved 'D' monogram. The cards are",
  "moonlit and the gold line-work reads softly luminous against the dark scene. Cards remain the frontmost layer; the moon",
  "stays strictly BEHIND them.",
  "Preserve the same wide 16:9 framing and composition. Photorealistic, cinematic, moody and minimal. No text, no numbers,",
  "no logos.",
].join(" ");

async function main() {
  if (!process.env.FAL_KEY) {
    console.error("FAL_KEY missing");
    process.exit(1);
  }
  if (!existsSync(BASE)) {
    console.error(`Missing: ${BASE}`);
    process.exit(1);
  }
  console.log("Uploading base…");
  const urls = [];
  {
    const bytes = readFileSync(BASE);
    const type = BASE.endsWith(".png") ? "image/png" : "image/jpeg";
    urls.push(await fal.storage.upload(new Blob([bytes], { type })));
  }
  console.log("Fixing moon behind cards (4K)…");
  const res = await fal.subscribe(MODEL, {
    input: {
      prompt: PROMPT,
      image_urls: urls,
      aspect_ratio: "16:9",
      resolution: "4K",
      output_format: "png",
      num_images: 1,
    },
  });
  const url = res.data?.images?.[0]?.url;
  if (!url) {
    console.error("No image returned", JSON.stringify(res.data)?.slice(0, 400));
    process.exit(1);
  }
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  writeFileSync(OUT, buf);
  console.log(`stack-wide.png saved (${Math.round(buf.length / 1024)} KB) -> ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
