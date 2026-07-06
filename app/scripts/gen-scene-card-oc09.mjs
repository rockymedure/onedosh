// OneDosh — HERO SCENE card faces from oc09 (dark marble, day + glowing night).
//
// Day card: a DARK onyx-marble card (oc09) so it pops against the lighter g11
// day background. Night card: the SAME card in near-darkness with its gold
// line-work glowing in soft photoluminescent watch-lume (Super-LumiNova) lime.
//
// Step 1 — crop oc09's floating card to a clean full-bleed face (card-day).
// Step 2 — feed that face to the edit model to render the glowing night twin,
//          at the card's aspect so the two align exactly (card-night).
//
// Model: fal-ai/bytedance/seedream/v4.5/edit  (custom image_size = card aspect)
// Usage:  node scripts/gen-scene-card-oc09.mjs
// Output: public/scene/card-day.png + card-night.png

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { PNG } from "pngjs";
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
const SRC = join(APP_ROOT, "public", "board", "cards-greco-offcenter", "oc09-stacked-arcs-left.png");
const LOGO = join(APP_ROOT, "public", "dosh-logo.png");
const OUT_DIR = join(APP_ROOT, "public", "scene");

// Card face crop within the 2880x1920 oc09 hero (inset from the detected bbox to
// drop the soft shadow + rounded-corner cream). Aspect ~1.593 (ISO card).
const CROP = { left: 650, top: 438, width: 1665, height: 1045 };

function cropFace(srcPath, rect) {
  const png = PNG.sync.read(readFileSync(srcPath));
  const out = new PNG({ width: rect.width, height: rect.height });
  for (let y = 0; y < rect.height; y++) {
    for (let x = 0; x < rect.width; x++) {
      const si = ((rect.top + y) * png.width + (rect.left + x)) * 4;
      const di = (y * rect.width + x) * 4;
      out.data[di] = png.data[si];
      out.data[di + 1] = png.data[si + 1];
      out.data[di + 2] = png.data[si + 2];
      out.data[di + 3] = png.data[si + 3];
    }
  }
  return PNG.sync.write(out);
}

const NIGHT = [
  "This image is the full-bleed FRONT FACE of a single black onyx-marble payment card that fills the ENTIRE frame edge to",
  "edge. The output MUST also be full-bleed: the card fills the whole frame and extends beyond all four edges — NO",
  "background, NO floating card, NO drop shadow, NO glow halo outside the card, NO border.",
  "Keep the EXACT SAME composition and geometry as the input: the concentric arc grooves wrapping the chip on the left,",
  "the fine vertical and horizontal hairline rules, the small etched triangle marks, the small engraved gold 'D' monogram",
  "in the BOTTOM-RIGHT corner, and the brushed-metal EMV chip in its same left-of-center position on the midline. Do NOT",
  "add a contactless symbol; keep the 'D' as the bottom-right mark (now softly glowing).",
  "NOW RENDER IT IN DEEP NEAR-DARKNESS. The engraved line-work holds photoluminescent Super-LumiNova and gives off an",
  "EXTREMELY SUBTLE, VERY DIM, LOW-INTENSITY afterglow — like a wristwatch dial that has been in the dark for an hour and",
  "has almost faded: a soft, hazy, DESATURATED olive / muted chartreuse (yellow-green) haze with NO bright white-hot",
  "cores, NO neon, NO laser sharpness, NO high saturation, NO bright tubes. Barely-there and quiet.",
  "CRITICAL INTENSITY: err strongly on the side of TOO DIM rather than too bright. At least 70% of the card stays in",
  "near-black shadow. The lines are a faint, low-brightness muted lime glow with only the gentlest soft halo — not vivid,",
  "not electric.",
  "The lume is confined strictly to the thin LINES — it must NEVER fill a solid area, block, or disc; any shape outline",
  "stays a thin dim glowing outline only. The black marble body stays dark and matte. The metal EMV chip stays metallic",
  "and does NOT glow.",
  "Full-bleed card face, identical framing, no text, no numbers, no logos.",
].join(" ");

// Engrave the OneDosh "D" monogram into the bottom-right of the day card.
const DAY_LOGO = [
  "The FIRST image is the full-bleed FRONT FACE of a black onyx-marble payment card that fills the ENTIRE frame edge to",
  "edge. Keep it EXACTLY as-is: same marble, same gold concentric arc grooves around the chip on the left, same fine gold",
  "hairline rules, same small etched triangle marks, same brushed-metal EMV chip in its position.",
  "The SECOND image is the OneDosh brand mark: a rounded, open-ended letter 'D' monogram. Use ONLY that 'D' letterform and",
  "IGNORE its dark circular background entirely.",
  "Engrave that exact 'D' monogram as a SMALL, FLAT, subtly INLAID gold mark in the BOTTOM-RIGHT corner of the card,",
  "rendered in the SAME fine polished GOLD as the existing thin line-work and sitting flush with the marble surface. It",
  "must be UNDERSTATED and DELICATE — NOT a large emblem, NOT a bulky or puffy 3D badge, NOT glossy or raised; a refined",
  "flush inlay, compact and elegantly inset from the bottom-right corner (roughly the height of the small triangle marks",
  "on the card). Replace the small concentric contactless ring currently in that corner with this D mark so the corner",
  "reads cleanly as the brand.",
  "Everything else on the card stays IDENTICAL. Full-bleed card face, same framing, no text, no numbers, no other logos.",
].join(" ");

async function edit(prompt, image_urls) {
  const res = await fal.subscribe(MODEL, {
    input: {
      prompt,
      image_urls,
      image_size: { width: 1536, height: 965 }, // ~1.592, ISO card aspect
      num_images: 1,
    },
  });
  const url = res?.data?.images?.[0]?.url || res?.images?.[0]?.url;
  if (!url) throw new Error("no image url in response");
  return Buffer.from(await (await fetch(url)).arrayBuffer());
}

const genNight = (image_url) => edit(NIGHT, [image_url]);

async function main() {
  if (!existsSync(SRC)) {
    console.error(`Missing source: ${SRC}`);
    process.exit(1);
  }

  // NIGHT_ONLY=1 reuses the existing card-day.png and only regenerates the glow.
  // NO_LOGO=1 skips engraving the brand mark (raw oc09 face).
  const withLogo = process.env.NO_LOGO !== "1";
  let dayBuf;
  if (process.env.NIGHT_ONLY === "1") {
    console.log("NIGHT_ONLY — reusing existing card-day.png…");
    dayBuf = readFileSync(join(OUT_DIR, "card-day.png"));
  } else {
    console.log("Cropping oc09 -> card-day face…");
    const faceBuf = cropFace(SRC, CROP);

    if (withLogo) {
      console.log("Engraving OneDosh 'D' mark into bottom-right…");
      const faceUrl = await fal.storage.upload(new Blob([faceBuf], { type: "image/png" }));
      const logoUrl = await fal.storage.upload(
        new Blob([readFileSync(LOGO)], { type: "image/png" }),
      );
      dayBuf = await edit(DAY_LOGO, [faceUrl, logoUrl]);
    } else {
      dayBuf = faceBuf;
    }
    writeFileSync(join(OUT_DIR, "card-day.png"), dayBuf);
    console.log(`  card-day.png saved (${(dayBuf.length / 1024).toFixed(0)} KB)`);
  }

  console.log("Uploading day face as edit source…");
  const dayUrl = await fal.storage.upload(new Blob([dayBuf], { type: "image/png" }));

  console.log("Generating glowing night twin…");
  const nightBuf = await genNight(dayUrl);
  writeFileSync(join(OUT_DIR, "card-night.png"), nightBuf);
  console.log(`  card-night.png saved (${(nightBuf.length / 1024).toFixed(0)} KB)`);

  console.log(`Done -> ${OUT_DIR}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
