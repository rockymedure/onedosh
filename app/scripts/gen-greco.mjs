// One-off: generate greco-futuristic brand explorations for OneDosh via fal
// (FLUX schnell) and save to public/greco/. Run: node scripts/gen-greco.mjs
//
// Direction: Greco-classical STRUCTURE fused with West African WARMTH.
// Classical bones (arch/gateway, column, coin, laurel, Hermes wing, Greek key),
// but warm stone / Benin-bronze gold / indigo — never cold Eurocentric marble —
// lit by OneDosh electric lime (#CFF23F) as the "future spark", over deep
// navy (#141C33). No text (wordmark is built in code).
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

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

const FAL_KEY = process.env.FAL_KEY;
if (!FAL_KEY) {
  console.error("Missing FAL_KEY in app/.env");
  process.exit(1);
}

const MODEL = "fal-ai/flux/schnell";
const ENDPOINT = `https://fal.run/${MODEL}`;

const NO_TEXT =
  "NO text, NO letters, NO numbers, NO watermark, NO signature.";
const PALETTE =
  "Deep midnight navy (#141C33) background, warm brushed gold and Benin-bronze, warm sandstone, " +
  "one electric chartreuse lime (#CFF23F) glow as the single future-accent. Warm, not cold. Cinematic, premium.";
const FUSION =
  "Greco-classical structure fused with subtle West African / Nigerian geometry (adire indigo, Nsibidi-like glyphs, kente rhythm) " +
  "so Greek meander and African pattern read as one language. Heritage meets future. Luxury fintech, not gaudy.";

const JOBS = [
  // ---- App icon / emblem concepts (square) ----
  {
    name: "icon-arch-gateway",
    size: { width: 1024, height: 1024 },
    prompt:
      `App icon emblem, centered, single symbol on deep navy. A luminous classical ARCH / GATEWAY carved from warm gold, ` +
      `its opening glowing with electric lime light like a portal to the future. Engraved, minimal, iconic, app-store ready, ` +
      `soft studio lighting, rounded-square composition. ${FUSION} ${PALETTE} ${NO_TEXT}`,
  },
  {
    name: "icon-coin-medallion",
    size: { width: 1024, height: 1024 },
    prompt:
      `App icon emblem, centered. A polished golden COIN / MEDALLION with an engraved winged motif (Hermes wing) and a ` +
      `Greek-key border, one electric-lime edge highlight, floating on deep navy, premium fintech mark, iconic and simple. ` +
      `${FUSION} ${PALETTE} ${NO_TEXT}`,
  },
  {
    name: "icon-monogram-column",
    size: { width: 1024, height: 1024 },
    prompt:
      `App icon emblem, centered. A geometric monogram formed from a fluted classical COLUMN that also reads as the letter O, ` +
      `carved gold with an electric-lime inlay seam, deep navy ground, engraved, minimal, confident, iconic. ` +
      `${FUSION} ${PALETTE} ${NO_TEXT}`,
  },
  // ---- Landing hero key visuals (landscape) ----
  {
    name: "hero-portal",
    size: { width: 1216, height: 832 },
    prompt:
      `Cinematic hero key visual: a monumental luminous classical ARCHWAY / colonnade made of warm sandstone and brushed gold, ` +
      `stretched tall and futuristic, opening onto a glowing electric-lime horizon, deep navy night, volumetric light, chrome/glass ` +
      `futurist edges, subtle African adire pattern in the stone. Vast negative space on the left for headline text. ` +
      `${FUSION} ${PALETTE} ${NO_TEXT}`,
  },
  {
    name: "hero-hermes-flow",
    size: { width: 1216, height: 832 },
    prompt:
      `Cinematic hero key visual: an abstract flowing river of golden light and coins moving through a futuristic classical ` +
      `colonnade, evoking money moving fast across borders (Hermes, commerce, speed), electric-lime spark trails, deep navy, ` +
      `warm gold, glass reflections. Calm darker region upper-left for overlaid white text. ${FUSION} ${PALETTE} ${NO_TEXT}`,
  },
  {
    name: "texture-meander",
    size: { width: 1216, height: 832 },
    prompt:
      `Seamless premium background texture: a Greek-key meander pattern morphing into West African kente/Nsibidi geometry, ` +
      `embossed in warm gold on deep navy, faint electric-lime glow in the seams, subtle film grain, elegant and restrained, ` +
      `edge to edge. ${NO_TEXT}`,
  },
];

async function gen({ name, prompt, size }) {
  console.log(`Generating ${name}…`);
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Key ${FAL_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      image_size: size,
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
  const outDir = join(APP_ROOT, "public", "greco");
  mkdirSync(outDir, { recursive: true });
  const out = join(outDir, `${name}.png`);
  writeFileSync(out, buf);
  console.log(`  saved ${out} (${(buf.length / 1024).toFixed(0)} KB)`);
}

for (const job of JOBS) {
  try {
    await gen(job);
  } catch (e) {
    console.error(`  FAILED ${job.name}: ${e.message}`);
  }
}
console.log("Done.");
