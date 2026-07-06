// Isolate the card face from a generated product mockup: run background
// removal on fal (BiRefNet), then alpha-trim the transparent result down to
// the tight card bounding box so it drops cleanly into the app card frame.
//
// Usage: node scripts/bg-remove.mjs
// Output: public/cards/onyx-face.png, public/cards/ivory-face.png (transparent)

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { fal } from "@fal-ai/client";
import { PNG } from "pngjs";

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

const MODEL = "fal-ai/birefnet/v2";
const BOARD = join(APP_ROOT, "public", "board");
const OUT = join(APP_ROOT, "public", "cards");

const JOBS = [
  { name: "onyx-face", src: join(BOARD, "cards-greco-abstract", "ab10-gold-vein-sun.png") },
  { name: "ivory-face", src: join(BOARD, "cards-ivory", "iv02-twin-arcs.png") },
];

// Trim fully/near transparent margins to the card bounding box.
function alphaTrim(buf) {
  const png = PNG.sync.read(buf);
  const { width: W, height: H, data } = png;
  const A = 40; // alpha threshold
  let minX = W, minY = H, maxX = 0, maxY = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (data[(y * W + x) * 4 + 3] > A) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  const w = maxX - minX + 1;
  const h = maxY - minY + 1;
  const out = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const si = ((minY + y) * W + (minX + x)) * 4;
      const di = (y * w + x) * 4;
      out.data[di] = data[si];
      out.data[di + 1] = data[si + 1];
      out.data[di + 2] = data[si + 2];
      out.data[di + 3] = data[si + 3];
    }
  }
  return { buf: PNG.sync.write(out), w, h };
}

async function run(job) {
  const bytes = readFileSync(job.src);
  const url = await fal.storage.upload(new Blob([bytes], { type: "image/png" }));
  const res = await fal.subscribe(MODEL, { input: { image_url: url } });
  const outUrl = res?.data?.image?.url || res?.image?.url || res?.data?.images?.[0]?.url;
  if (!outUrl) throw new Error(`no image url: ${JSON.stringify(res?.data ?? res).slice(0, 200)}`);
  const cut = Buffer.from(await (await fetch(outUrl)).arrayBuffer());
  const { buf, w, h } = alphaTrim(cut);
  const dest = join(OUT, `${job.name}.png`);
  writeFileSync(dest, buf);
  console.log(`  ${job.name}: ${w}x${h} (ratio ${(w / h).toFixed(3)}) -> ${dest}`);
}

const results = await Promise.allSettled(JOBS.map(run));
results.forEach((r, i) => {
  if (r.status === "rejected") console.error(`FAILED ${JOBS[i].name}: ${r.reason?.message || r.reason}`);
});
console.log("done");
