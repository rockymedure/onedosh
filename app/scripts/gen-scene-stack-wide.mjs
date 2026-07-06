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
const BASE = join(APP_ROOT, "public", "scene", "stack-wide.png");
const OUT = join(APP_ROOT, "public", "scene", "stack-wide.png");

const PROMPT = [
  "Edit this image with a SINGLE change: fix the MOON so it is strictly BEHIND the floating cards.",
  "There is currently a bright moon disc overlapping and sitting ON TOP OF the pale white marble card in the center —",
  "REMOVE that overlapping disc entirely. The moon must only be visible in the OPEN SKY behind the card stack and must be",
  "fully hidden wherever any card covers it. Cards are always the frontmost layer; nothing from the sky renders in front of",
  "a card face.",
  "Keep EVERYTHING ELSE identical: the same four marble cards (onyx, Carrara, honey-bronze, verde) in the exact same",
  "positions, the same gold line-work and 'D' monograms, the same rock-canyon walls, the same wide 16:9 framing, the same",
  "soft blue twilight sky and cool moonlight. Photorealistic, cinematic. No text, no numbers, no logos.",
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
    urls.push(await fal.storage.upload(new Blob([bytes], { type: "image/png" })));
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
