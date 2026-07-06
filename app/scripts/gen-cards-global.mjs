// OneDosh global card series — openai/gpt-image-2/edit on fal.
//
// Anchored on board/inspo/07 (bold Afro-futurist collage), with nods to basic
// geometry / shared universal forms, and the "Sun Series" palette. Explores how
// ONE OneDosh card system flexes across markets: a global flagship, Lagos, NYC,
// Seoul, plus a "Shared Forms" statement card.
//
// Usage: node scripts/gen-cards-global.mjs
// Output: public/board/cards-gen2/<name>.png (+ manifest.json)

import { readFileSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
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

const MODEL = "openai/gpt-image-2/edit";
const INSPO_DIR = join(APP_ROOT, "public", "board", "inspo");
const OUT_DIR = join(APP_ROOT, "public", "board", "cards-gen2");
const REF_FILES = ["07.png", "04.png", "05.png"]; // anchor(07) + geometry(04) + card object(05)

const PALETTE =
  "Palette (use these, warm and saturated): solar orange #F7941E, ember #EE6A2B, vermilion #E22B22, " +
  "coral rose #F2887E, teal #159A90, jade #1C8C63, desert sand #C88A52, bronze #9A5A2A, " +
  "warm near-black oxblood #241008, bone cream #F3E8D0, and a sparing cobalt #2A50C8 accent.";

const GENRE =
  "Ultra-premium payment card, front face, 3:2 with softly rounded corners, floating on a soft warm studio " +
  "backdrop with a long cinematic shadow. Bold, flat, graphic Afro-futurist energy with risograph-style gradients — " +
  "joyful and confident, not corporate. A small brushed-gold EMV chip integrated tastefully.";

const SHARED_FORMS =
  "Built from the universal forms every culture shares: the CIRCLE (sun / coin), the TRIANGLE (mountain / ascent), " +
  "the LINE (horizon), concentric ORBITS. Clean geometry as a shared human language.";

const GUARD =
  "IMPORTANT: use the reference images ONLY as mood/colour/style guidance — do NOT copy any person, face, or scene. " +
  "Output is a CARD OBJECT only, no people. No legible text, no numbers, no brand names; at most an abstract embossed " +
  "circular mark. One coherent premium card family. Gallery-quality, iconic.";

const JOBS = [
  {
    name: "g1-prime",
    prompt:
      `${GENRE} This is the GLOBAL flagship "OneDosh Prime". A warm gradient sky from solar orange into teal, a large ` +
      `rising sun / eclipse disc offset right, a single bold triangle and a horizon line beneath it. ${SHARED_FORMS} ` +
      `Feels universal and warm — a card for the whole world. ${PALETTE} ${GUARD}`,
  },
  {
    name: "g2-lagos",
    prompt:
      `${GENRE} The LAGOS / Nigeria edition. Hot solar orange and vermilion with adire indigo and bronze; a dominant sun ` +
      `disc over dune-warm gradients, subtle Yoruba/Nsibidi-adjacent geometric marks woven into the surface as texture. ` +
      `${SHARED_FORMS} Vibrant, joyful, proud. ${PALETTE} ${GUARD}`,
  },
  {
    name: "g3-nyc",
    prompt:
      `${GENRE} The NEW YORK edition. Night energy: warm oxblood-black ground with electric vermilion and a cobalt accent, ` +
      `the triangle abstracted into skyline rays, a small bright sun/eclipse disc, sharp and electric but still warm. ` +
      `${SHARED_FORMS} Urban, confident, after-dark premium. ${PALETTE} ${GUARD}`,
  },
  {
    name: "g4-seoul",
    prompt:
      `${GENRE} The SEOUL edition. Refined dancheong-inspired balance: jade/teal, vermilion and cobalt with fine gold ` +
      `linework on a bone-cream ground, calm minimal geometry, a serene eclipse disc and a single clean triangle. ` +
      `${SHARED_FORMS} Precise, elegant, harmonious. ${PALETTE} ${GUARD}`,
  },
  {
    name: "g5-shared-forms",
    prompt:
      `${GENRE} The "SHARED FORMS" statement card. Reduced palette — oxblood ink and solar orange with one bone and one ` +
      `teal — a bold near-poster composition of pure circle + triangle + horizon line + concentric orbits, maximal graphic ` +
      `clarity, minimal ornament. ${SHARED_FORMS} The thesis card: the same forms, everywhere. ${PALETTE} ${GUARD}`,
  },
];

function detectType(buf) {
  if (buf[0] === 0xff && buf[1] === 0xd8) return "image/jpeg";
  return "image/png";
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  console.log("Uploading reference images…");
  const refUrls = [];
  for (const f of REF_FILES) {
    const p = join(INSPO_DIR, f);
    if (!existsSync(p)) continue;
    const bytes = readFileSync(p);
    const url = await fal.storage.upload(new Blob([bytes], { type: detectType(bytes) }));
    refUrls.push(url);
    console.log(`  ${f} -> ok`);
  }
  if (!refUrls.length) throw new Error("no reference images found");

  const manifestPath = join(OUT_DIR, "manifest.json");
  const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : {};
  let done = 0;

  async function worker(job) {
    try {
      const res = await fal.subscribe(MODEL, {
        input: {
          prompt: job.prompt,
          image_urls: refUrls,
          image_size: { width: 1536, height: 1024 },
          quality: "high",
          input_fidelity: "low",
          num_images: 1,
          output_format: "png",
        },
      });
      const url = res?.data?.images?.[0]?.url || res?.images?.[0]?.url;
      if (!url) throw new Error("no image url in response");
      const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
      writeFileSync(join(OUT_DIR, `${job.name}.png`), buf);
      manifest[job.name] = job.prompt;
      writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      done++;
      console.log(`  [${done}/${JOBS.length}] ${job.name} saved (${(buf.length / 1024).toFixed(0)} KB)`);
    } catch (e) {
      const detail = e?.body ? JSON.stringify(e.body) : "";
      console.error(`  FAILED ${job.name}: ${e.message} ${detail}`);
    }
  }

  // all 5 in parallel
  await Promise.all(JOBS.map(worker));
  console.log(`Done. ${done}/${JOBS.length} generated -> ${OUT_DIR}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
