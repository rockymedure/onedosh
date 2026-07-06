// OneDosh — animate the card-stack hero as a night TIME-LAPSE.
//
// Uses Google Veo 3.1 (image-to-video) at 1080p to bring the still moonlit-canyon
// stack to life: the sky moves through time while the floating cards stay
// stationary and cool light plays across the marble and gold.
//
// Model:  fal-ai/veo3.1/image-to-video  (1080p)
// Usage:  node scripts/gen-stack-video.mjs
// Output: public/scene/stack-wide.mp4
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { fal } from "@fal-ai/client";

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
if (!process.env.FAL_KEY) {
  console.error("Missing FAL_KEY in app/.env");
  process.exit(1);
}
fal.config({ credentials: process.env.FAL_KEY });

const MODEL = "fal-ai/veo3.1/image-to-video";
const SRC = join(APP_ROOT, "public", "scene", "stack-wide.jpg");
const OUT = join(APP_ROOT, "public", "scene", "stack-wide.mp4");

const PROMPT = [
  "Locked-off, perfectly STATIC camera. A slow, cinematic NIGHT TIME-LAPSE.",
  "The four floating marble payment cards remain COMPLETELY STATIONARY — they do not move, rotate, drift, wobble, or change",
  "position or size at all. They stay fixed, sharp, and centered as the hero.",
  "Only TIME and LIGHT move: the deep blue night sky slowly passes through time — faint stars gently wheel and drift, thin",
  "wisps of cloud slide by — while cool silver-blue moonlight gradually shifts direction and intensity. Soft light and",
  "gentle glints travel slowly across the polished marble faces and the fine gold line-work, making the texture and the",
  "engraved 'D' shimmer subtly as the light passes. The dark rock-canyon walls stay quiet in shadow.",
  "Elegant, slow, premium, subtle. No text, no people, no camera movement, no zoom.",
].join(" ");

async function main() {
  if (!existsSync(SRC)) {
    console.error(`Missing: ${SRC}`);
    process.exit(1);
  }
  console.log("Uploading still…");
  const bytes = readFileSync(SRC);
  const image_url = await fal.storage.upload(new Blob([bytes], { type: "image/jpeg" }));

  console.log("Generating night time-lapse (Veo 3.1, 1080p)…");
  const res = await fal.subscribe(MODEL, {
    input: {
      prompt: PROMPT,
      image_url,
      duration: "8s",
      aspect_ratio: "16:9",
      resolution: "1080p",
      generate_audio: false,
      negative_prompt:
        "camera movement, zoom, pan, dolly, parallax, cards moving, cards rotating, cards drifting, warping, morphing, text, watermark, people",
    },
    logs: true,
    onQueueUpdate: (u) => {
      if (u.status === "IN_PROGRESS") (u.logs || []).forEach((l) => console.log(l.message));
    },
  });

  const url = res.data?.video?.url;
  if (!url) {
    console.error("No video returned", JSON.stringify(res.data)?.slice(0, 400));
    process.exit(1);
  }
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  writeFileSync(OUT, buf);
  console.log(`stack-wide.mp4 saved (${Math.round(buf.length / 1024)} KB) -> ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
