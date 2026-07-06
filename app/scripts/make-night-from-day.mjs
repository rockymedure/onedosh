// Derive the NIGHT card face from the exact DAY pixels so the two register
// perfectly (no generative drift). We darken the whole card to near-black and
// make the gold line-work emit a soft, dim Super-LumiNova style lime glow,
// confined to the lines, with a blurred halo. The brushed-metal chip is warm
// but not gold, so it stays dark and does NOT glow.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { PNG } from "pngjs";

const APP_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(APP_ROOT, "public", "scene", "card-day.png");
const OUT = join(APP_ROOT, "public", "scene", "card-night.png");

const day = PNG.sync.read(readFileSync(SRC));
const { width: W, height: H, data } = day;
const N = W * H;

// 1) goldness mask: gold line-work is warm (high R, mid G, low B) and brighter
//    than the surrounding dark marble. Chip is metallic grey -> low goldness.
const gold = new Float32Array(N);
for (let i = 0; i < N; i++) {
  const r = data[i * 4] / 255;
  const g = data[i * 4 + 1] / 255;
  const b = data[i * 4 + 2] / 255;
  const warmth = r * 0.6 + g * 0.4 - b * 0.85; // gold - blue-ish
  const luma = 0.299 * r + 0.587 * g + 0.114 * b;
  let m = (warmth - 0.12) * 1.9 * (luma - 0.14);
  if (m < 0) m = 0;
  if (m > 1) m = 1;
  gold[i] = m;
}

// 2) separable box blur of the mask -> soft halo
function boxBlur(src, radius) {
  const tmp = new Float32Array(N);
  const out = new Float32Array(N);
  const norm = 1 / (radius * 2 + 1);
  for (let y = 0; y < H; y++) {
    let acc = 0;
    for (let x = -radius; x <= radius; x++) acc += src[y * W + Math.min(W - 1, Math.max(0, x))];
    for (let x = 0; x < W; x++) {
      tmp[y * W + x] = acc * norm;
      const add = src[y * W + Math.min(W - 1, x + radius + 1)];
      const sub = src[y * W + Math.max(0, x - radius)];
      acc += add - sub;
    }
  }
  for (let x = 0; x < W; x++) {
    let acc = 0;
    for (let y = -radius; y <= radius; y++) acc += tmp[Math.min(H - 1, Math.max(0, y)) * W + x];
    for (let y = 0; y < H; y++) {
      out[y * W + x] = acc * norm;
      const add = tmp[Math.min(H - 1, y + radius + 1) * W + x];
      const sub = tmp[Math.max(0, y - radius) * W + x];
      acc += add - sub;
    }
  }
  return out;
}
const halo = boxBlur(gold, Math.round(W * 0.006));

// 3) compose night: dark base + line glow + halo glow
const GLOW = [176, 198, 92]; // soft desaturated watch-lume lime/olive
const DARK = 0.16; // how much of the original tone survives in shadow
for (let i = 0; i < N; i++) {
  const base = i * 4;
  // deep, slightly cool near-black from the original tone
  let nr = data[base] * DARK * 0.9;
  let ng = data[base + 1] * DARK * 0.95;
  let nb = data[base + 2] * DARK * 1.05;

  const line = Math.min(1, gold[i] * 1.15); // crisp line core
  const soft = Math.min(1, halo[i] * 2.6); // dim halo

  // additive glow: strong on the line core, faint halo around it
  nr += GLOW[0] * (line * 0.85 + soft * 0.28);
  ng += GLOW[1] * (line * 0.9 + soft * 0.3);
  nb += GLOW[2] * (line * 0.75 + soft * 0.22);

  data[base] = Math.min(255, nr);
  data[base + 1] = Math.min(255, ng);
  data[base + 2] = Math.min(255, nb);
  // alpha preserved
}

writeFileSync(OUT, PNG.sync.write(day));
console.log(`night derived from day -> ${OUT} (${W}x${H})`);
