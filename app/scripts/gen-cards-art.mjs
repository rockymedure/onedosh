// OneDosh art-edition card series — openai/gpt-image-2/edit on fal.
//
// Feedback pass: keep the global concept + no-people rule, but bring back THE ART —
// full-bleed Afro-futurist collage, risograph grain, gradient bleeds, layered
// depth, painterly/surreal. Anchored on board/inspo/07, input_fidelity HIGH.
//
// Usage: node scripts/gen-cards-art.mjs
// Output: public/board/cards-gen3/<name>.png (+ manifest.json)

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
const OUT_DIR = join(APP_ROOT, "public", "board", "cards-gen3");
const REF_FILES = ["07.png", "04.png", "05.png"]; // art anchor + geometry + card object

const PALETTE =
  "Palette (warm, saturated): solar orange #F7941E, ember #EE6A2B, vermilion #E22B22, coral rose #F2887E, " +
  "teal #159A90, jade #1C8C63, desert sand #C88A52, bronze #9A5A2A, warm oxblood near-black #241008, " +
  "bone cream #F3E8D0, sparing cobalt #2A50C8.";

const GENRE =
  "A limited ART-EDITION payment card, front face, 3:2 with softly rounded corners, floating with a soft cinematic " +
  "shadow. The ENTIRE card face is a full-bleed piece of Afro-futurist COLLAGE ART. A small brushed-gold EMV chip is " +
  "integrated into the artwork.";

const ART =
  "THE ART MATTERS MOST: heavy risograph grain and halftone dithering, gritty gradient bleeds and light leaks, layered " +
  "cut-paper collage depth, painterly and surreal, expressive, warm and soulful — like fine art wrapped on a card. " +
  "NOT flat vector, NOT clean corporate minimalism. Visible texture, grade and tactile depth throughout.";

const SHARED_FORMS =
  "Composed from universal shared forms — the CIRCLE (sun/coin), the TRIANGLE (mountain/ascent), the LINE (horizon), " +
  "concentric ORBITS — as an abstract landscape.";

const GUARD =
  "IMPORTANT: NO people, NO faces, NO human figures anywhere. Abstract art only. Use the references as mood/colour/style " +
  "guidance, do not copy any scene. No legible text, no numbers, no brand names; at most an abstract embossed circular " +
  "mark. One coherent art-edition card family, gallery-quality.";

const JOBS = [
  {
    name: "a1-prime",
    prompt:
      `${GENRE} GLOBAL flagship "OneDosh Prime": a warm collaged sky bleeding from solar orange into teal, a huge grainy ` +
      `sun/eclipse disc, a bold triangle rising from a horizon, orbits arcing across. ${SHARED_FORMS} ${ART} ${PALETTE} ${GUARD}`,
  },
  {
    name: "a2-lagos",
    prompt:
      `${GENRE} LAGOS / Nigeria edition: hot solar orange and vermilion collaged dunes with adire-indigo and bronze, a ` +
      `dominant grainy sun disc, layered mountains, subtle Yoruba/Nsibidi-adjacent marks torn into the collage. ` +
      `${SHARED_FORMS} ${ART} ${PALETTE} ${GUARD}`,
  },
  {
    name: "a3-nyc",
    prompt:
      `${GENRE} NEW YORK edition: after-dark collage on warm oxblood-black, electric vermilion and a cobalt accent, a ` +
      `grainy eclipse disc, abstract triangular light-rays (a skyline only IMPLIED as geometry, no literal buildings), ` +
      `orbits streaking. ${SHARED_FORMS} ${ART} ${PALETTE} ${GUARD}`,
  },
  {
    name: "a4-seoul",
    prompt:
      `${GENRE} SEOUL edition: refined dancheong-inspired collage — jade/teal, vermilion and cobalt with fine gold lines ` +
      `on a grainy bone-cream ground, a serene eclipse disc, a single clean triangle, calm balance with rich texture. ` +
      `${SHARED_FORMS} ${ART} ${PALETTE} ${GUARD}`,
  },
  {
    name: "a5-shared-forms",
    prompt:
      `${GENRE} "SHARED FORMS" statement edition: reduced palette (oxblood ink + solar orange, one bone, one teal), a bold ` +
      `grainy near-poster collage of pure circle + triangle + horizon + concentric orbits, maximal graphic soul, heavy ` +
      `riso texture. ${SHARED_FORMS} ${ART} ${PALETTE} ${GUARD}`,
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
