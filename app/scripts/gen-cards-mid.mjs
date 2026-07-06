// OneDosh middle-ground card series — openai/gpt-image-2/edit on fal.
//
// Feedback pass:
//  (1) Find the MIDDLE GROUND between the restrained eclipse card (elegant
//      geometry, negative space, 2-3 colours, premium material — board/inspo/08)
//      and the warm Afro-futurist art (board/inspo/07). Give the model latitude.
//  (2) Make each CITY unmistakably its own — real, recognizable cultural cues so
//      someone from Lagos / NYC / Seoul thinks "that's MY city."
//
// Usage: node scripts/gen-cards-mid.mjs
// Output: public/board/cards-gen4/<name>.png (+ manifest.json)

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
const OUT_DIR = join(APP_ROOT, "public", "board", "cards-gen4");
const REF_FILES = ["08.png", "07.png", "05.png"]; // restraint pole + art pole + card object

const PALETTE =
  "Warm palette, used sparingly (2-3 dominant colours per card): solar orange #F7941E, ember #EE6A2B, " +
  "vermilion #E22B22, coral rose #F2887E, teal #159A90, jade #1C8C63, desert sand #C88A52, bronze #9A5A2A, " +
  "warm oxblood near-black #241008, bone cream #F3E8D0, sparing cobalt #2A50C8.";

const GENRE =
  "A premium payment card, front face, 3:2 with softly rounded corners, floating with a soft cinematic shadow, " +
  "photographed like a real luxury object. A small brushed-gold EMV chip and a subtle circular contactless mark.";

const MIDGROUND =
  "Strike a refined MIDDLE GROUND: the restraint, elegance, generous NEGATIVE SPACE and premium material feel of a " +
  "minimal card (like a single glowing eclipse on warm sand) FUSED with the warmth, soul, subtle grain and colour of " +
  "Afro-futurist art. Fewer elements than a busy collage — ONE hero geometric idea (a sun/eclipse disc, or a single " +
  "triangle + horizon), 2-3 colours, quiet composition — but with real artistry, fine grain and emotional warmth. " +
  "Tasteful, expensive, understated. Let the material and light do the work.";

const GUARD =
  "IMPORTANT: NO people, NO faces, NO human figures. Abstract only. Use references as mood/style guidance, don't copy a " +
  "scene. No legible text, no numbers, no brand names. One coherent premium card family, gallery-quality.";

const JOBS = [
  {
    name: "m1-prime-quiet",
    prompt:
      `${GENRE} GLOBAL flagship, restraint-leaning: warm sand / bone ground with lots of negative space, a single glowing ` +
      `eclipse-sun disc and one faint embossed triangle, whisper-fine grain, deboss detail. Calm and expensive. ` +
      `${MIDGROUND} ${PALETTE} ${GUARD}`,
  },
  {
    name: "m2-prime-warm",
    prompt:
      `${GENRE} GLOBAL flagship, art-leaning within restraint: a deep warm oxblood-to-ember ground, a luminous eclipse ` +
      `disc and a single bold triangle rising, gentle risograph grain and a soft gradient bleed, still lots of breathing ` +
      `room. Soulful but disciplined. ${MIDGROUND} ${PALETTE} ${GUARD}`,
  },
  {
    name: "m3-lagos",
    prompt:
      `${GENRE} LAGOS / Nigeria edition — must feel unmistakably Nigerian: deep adire INDIGO with terracotta and Benin-` +
      `bronze, authentic Yoruba / Nsibidi-style geometric symbols and aso-oke stripe rhythm set in one restrained band, a ` +
      `warm bronze sun/eclipse disc as the hero. Proud, warm, rooted. Someone from Lagos should see home. ${MIDGROUND} ${PALETTE} ${GUARD}`,
  },
  {
    name: "m4-nyc",
    prompt:
      `${GENRE} NEW YORK edition — unmistakably NYC: 1930s ART-DECO geometry (Chrysler-building fan/sunburst, stepped ` +
      `ziggurat chevrons, fine engraved grid lines) in cool graphite and ink with ONE warm gold eclipse/sunburst as the ` +
      `hero, restrained and elegant, after-dark luxe. Someone from New York should feel the deco city. ${MIDGROUND} ${PALETTE} ${GUARD}`,
  },
  {
    name: "m5-seoul",
    prompt:
      `${GENRE} SEOUL edition — unmistakably Korean: dancheong obangsaek accents (cobalt, vermilion, jade, bone) and a ` +
      `changsal wooden-lattice geometric pattern in one quiet panel, on a calm bone ground, with a serene eclipse disc as ` +
      `the hero and fine gold linework. Refined, harmonious, minimal. Someone from Seoul should see home. ${MIDGROUND} ${PALETTE} ${GUARD}`,
  },
];

function detectType(buf) {
  return buf[0] === 0xff && buf[1] === 0xd8 ? "image/jpeg" : "image/png";
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
          input_fidelity: "high",
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

  await Promise.all(JOBS.map(worker));
  console.log(`Done. ${done}/${JOBS.length} generated -> ${OUT_DIR}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
