// One-off: generate fun, youth-culture balance-card art via fal (FLUX schnell)
// and save to public/cards/. Run: node scripts/gen-balance-cards.mjs
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = join(__dirname, "..");

// Load FAL_KEY from .env without extra deps.
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

const FAL_KEY = process.env.FAL_KEY;
if (!FAL_KEY) {
  console.error("Missing FAL_KEY in app/.env");
  process.exit(1);
}

const MODEL = "fal-ai/flux/schnell";
const ENDPOINT = `https://fal.run/${MODEL}`;

const base = [
  "Seamless full-bleed abstract wallpaper texture, edge to edge, filling the entire frame.",
  "NO credit card, NO chip, NO card, NO rounded rectangle border, NO device, NO frame.",
  "NO text, NO letters, NO numbers, NO logos, NO faces, NO people, NO hands.",
  "Bold African wax-print / Ankara / kente-inspired geometric pattern reimagined for Gen-Z street culture.",
  "Playful, fun, high-energy, modern Lagos/Nairobi youth vibe. Subtle film grain, cinematic depth.",
  "Keep the upper-left region calmer, darker and less busy so white overlaid text stays perfectly readable. Landscape.",
].join(" ");

const CARDS = [
  {
    name: "dollar",
    prompt:
      `Deep midnight-navy (#141C33) base with glowing chartreuse electric-lime yellow-green (#CFF23F) neon accents, ` +
      `Afrofuturist flowing geometric shapes, bold and youthful, mostly dark navy with lime highlights. ${base}`,
  },
  {
    name: "naira",
    prompt:
      `Deep violet/purple (#241452 to #6D4BFF) base with glowing chartreuse electric-lime yellow-green (#CFF23F) neon accents, ` +
      `Afrobeats amapiano neon-night energy, bold flowing geometric shapes, mostly violet with lime highlights. ${base}`,
  },
];

async function gen({ name, prompt }) {
  console.log(`Generating ${name}…`);
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Key ${FAL_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      image_size: { width: 1216, height: 768 },
      num_images: 1,
      num_inference_steps: 4,
      enable_safety_checker: true,
      output_format: "png",
    }),
  });
  if (!res.ok) {
    throw new Error(`fal ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
  const json = await res.json();
  const url = json.images?.[0]?.url;
  if (!url) throw new Error(`no image for ${name}`);
  const img = await fetch(url);
  const buf = Buffer.from(await img.arrayBuffer());
  const outDir = join(APP_ROOT, "public", "cards");
  mkdirSync(outDir, { recursive: true });
  const out = join(outDir, `${name}.png`);
  writeFileSync(out, buf);
  console.log(`  saved ${out} (${(buf.length / 1024).toFixed(0)} KB)`);
}

for (const card of CARDS) {
  await gen(card);
}
console.log("Done.");
