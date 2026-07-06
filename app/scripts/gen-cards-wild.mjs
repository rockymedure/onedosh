// OneDosh WILD exploration — go wide & broad across ALL references.
// Model: fal-ai/bytedance/seedream/v4.5/edit
//
// Goal: many DISTINCT card concepts, one idea each, pulling from the whole
// reference library (inspo 01-08). Breadth over depth — stumble on something great.
//
// Usage:  node scripts/gen-cards-wild.mjs
// Output: public/board/cards-wild/<name>.png (+ manifest.json)

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

const MODEL = "fal-ai/bytedance/seedream/v4.5/edit";
const INSPO_DIR = join(APP_ROOT, "public", "board", "inspo");
const OUT_DIR = join(APP_ROOT, "public", "board", "cards-wild");

// Every reference we might reach for.
const ALL_REFS = ["01.png", "02.png", "03.png", "04.png", "05.png", "06.png", "07.png", "08.png"];

const GENRE =
  "A premium payment card, front face only, 3:2 aspect with softly rounded corners, floating with a soft cinematic " +
  "studio shadow, photographed like a real high-end object. Include a small brushed-metal EMV chip and a subtle " +
  "circular contactless mark, integrated tastefully.";

const GUARD =
  "IMPORTANT: NO people, NO faces, NO human figures, NO hands. Abstract/graphic only. Use the references as mood, " +
  "palette and composition inspiration — do NOT copy any scene literally. No legible text, no numbers, no logos, " +
  "no brand names. Gallery-quality, cohesive as a single luxury payment brand.";

// name, refs (subset that steers this concept), idea
const JOBS = [
  {
    name: "w01-teal-orb",
    refs: ["01.png", "08.png"],
    idea:
      "COOL & SERENE: soft aqua-teal ground with a single luminous neon-orange eclipse RING glowing at center, " +
      "vast negative space, whisper-fine grain. Calm, futuristic, hypnotic. Two colours only: teal + hot orange.",
  },
  {
    name: "w02-jewel-regalia",
    refs: ["02.png", "05.png"],
    idea:
      "MAXIMALIST JEWELLED: a lavish bejewelled metal card — encrusted gemstone texture, gold filigree, emerald and " +
      "ruby cabochons arranged into one radiant sunburst medallion on deep cobalt. Opulent, regal, Afro-futurist couture.",
  },
  {
    name: "w03-solar-flare",
    refs: ["03.png", "05.png"],
    idea:
      "LIGHT & FLARE: a dark cobalt-night card with a real sharp six-point lens-flare starburst catching a shimmering " +
      "sequin/foil texture, a faint sun disc low on the card. Dramatic, cinematic, jewel-like sparkle.",
  },
  {
    name: "w04-orbit-poster",
    refs: ["04.png", "08.png"],
    idea:
      "MID-CENTURY ASTRONOMY: cream-on-midnight, concentric elliptical ORBIT rings with a few small solar-orange planet " +
      "dots travelling along them, one amber sun. Bauhaus/space-age poster elegance printed onto a card.",
  },
  {
    name: "w05-halftone-rain",
    refs: ["04.png", "07.png"],
    idea:
      "HALFTONE FIELD: deep indigo-violet card with a cascading field of graduated orange dots (halftone rain, big-to-" +
      "small), forming a soft implied sun glow. Rhythmic, textural, retro-print.",
  },
  {
    name: "w06-grid-tunnel",
    refs: ["04.png", "01.png"],
    idea:
      "PERSPECTIVE GRID: a teal wireframe grid tunnel receding to a vanishing point with a single amber sun disc " +
      "floating in it. Retro-futurist, hypnotic depth, minimal palette.",
  },
  {
    name: "w07-crescent-void",
    refs: ["04.png", "06.png"],
    idea:
      "EXTREME MINIMAL: near-black matte card, almost empty, with one razor-thin glowing orange CRESCENT eclipse offset " +
      "to a corner. Enormous negative space, stealthy and expensive.",
  },
  {
    name: "w08-moonphase-band",
    refs: ["04.png", "08.png"],
    idea:
      "MOON PHASES: a calm bone/sand card with a single quiet horizontal band of embossed moon-phase discs (new to full) " +
      "in bronze and cream. Systematic, serene, tactile deboss.",
  },
  {
    name: "w09-stealth-void",
    refs: ["06.png", "05.png"],
    idea:
      "BLACKED-OUT STEALTH: an all-black matte card where only a debossed concentric-ring sun mark catches a sliver of " +
      "warm light at a raking angle. Pure, monolithic, ultra-luxury. Almost no colour.",
  },
  {
    name: "w10-desert-horizon",
    refs: ["07.png", "04.png"],
    idea:
      "DESERT HORIZON: warm risograph-grain dunes with a big rising sun disc splitting a horizon line, gradient sky from " +
      "ember to coral. Soulful, cinematic, Afro-futurist warmth. 3 colours max.",
  },
  {
    name: "w11-bronze-relief",
    refs: ["02.png", "05.png"],
    idea:
      "SCULPTURAL BRONZE: a monochrome cast-bronze card with a bas-relief sun/eclipse medallion and fine engraved rays, " +
      "like an ancient coin reimagined. Metallic, weighty, tactile, single material.",
  },
  {
    name: "w12-gradient-field",
    refs: ["01.png", "07.png"],
    idea:
      "PURE COLOUR FIELD: no texture — a silky smooth gradient mesh from solar orange through coral into teal, with one " +
      "single crisp floating disc casting a soft shadow. Modern, clean, Apple-meets-sunset.",
  },
];

function detectType(buf) {
  return buf[0] === 0xff && buf[1] === 0xd8 ? "image/jpeg" : "image/png";
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  console.log("Uploading reference images…");
  const urlByFile = {};
  for (const f of ALL_REFS) {
    const p = join(INSPO_DIR, f);
    if (!existsSync(p)) continue;
    const bytes = readFileSync(p);
    urlByFile[f] = await fal.storage.upload(new Blob([bytes], { type: detectType(bytes) }));
    console.log(`  ${f} -> ok`);
  }

  const manifestPath = join(OUT_DIR, "manifest.json");
  const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : {};
  let done = 0;

  async function worker(job) {
    const prompt = `${GENRE} CONCEPT — ${job.idea} ${GUARD}`;
    const image_urls = job.refs.map((f) => urlByFile[f]).filter(Boolean);
    try {
      const res = await fal.subscribe(MODEL, {
        input: { prompt, image_urls, image_size: { width: 1536, height: 1024 }, num_images: 1 },
      });
      const url = res?.data?.images?.[0]?.url || res?.images?.[0]?.url;
      if (!url) throw new Error("no image url in response");
      const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
      writeFileSync(join(OUT_DIR, `${job.name}.png`), buf);
      manifest[job.name] = prompt;
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
