// Generative card art for the OneDosh Card Studio.
// Proxies to fal.ai (gpt-image-2) so the FAL_KEY never touches the client, then
// returns a self-contained data URL (fal's own URLs expire) the card can render.

// FLUX schnell is near-instant (~1-3s) and great for abstract card art, which
// keeps the studio feeling live. Override with FAL_CARD_MODEL if desired.
const FAL_MODEL = process.env.FAL_CARD_MODEL || "fal-ai/flux/schnell";
const FAL_ENDPOINT = `https://fal.run/${FAL_MODEL}`;

export function hasFalKey(): boolean {
  return Boolean(process.env.FAL_KEY);
}

// Wrap the user's vibe in art-direction that keeps every drop legible as a
// premium payment card: full-bleed, no text/logos/faces, works behind white ink.
function buildPrompt(vibe: string): string {
  const clean = vibe.trim().slice(0, 300) || "electric lime energy on deep black";
  return [
    `Full-bleed abstract art for a premium credit card face: ${clean}.`,
    "Edge-to-edge texture with NO text, NO letters, NO numbers, NO logos, NO faces, NO people, NO hands.",
    "Rich, tactile, high-end finish — like a limited-edition metal card. Cinematic depth, subtle grain.",
    "Composition must stay calm and uncluttered in the center-left so white overlaid text stays readable;",
    "keep it darker and moody overall with a few glowing highlights. Landscape, luxurious, collectible.",
  ].join(" ");
}

export async function generateCardArt(vibe: string): Promise<{ dataUrl: string }> {
  const body = JSON.stringify({
    prompt: buildPrompt(vibe),
    // Card-shaped landscape (~1.58:1, matches ISO credit-card ratio).
    image_size: { width: 1216, height: 768 },
    num_images: 1,
    num_inference_steps: 4,
    enable_safety_checker: true,
    output_format: "png",
  });

  const res = await fetch(FAL_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Key ${process.env.FAL_KEY}`,
      "Content-Type": "application/json",
    },
    body,
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`fal ${res.status}: ${detail.slice(0, 200)}`);
  }

  const json = (await res.json()) as { images?: { url: string }[] };
  const url = json.images?.[0]?.url;
  if (!url) throw new Error("fal returned no image");

  // Inline the result so it survives fal URL expiry and cross-origin fetches.
  const imgRes = await fetch(url);
  if (!imgRes.ok) throw new Error(`download ${imgRes.status}`);
  const buf = Buffer.from(await imgRes.arrayBuffer());
  const mime = imgRes.headers.get("content-type") || "image/png";
  return { dataUrl: `data:${mime};base64,${buf.toString("base64")}` };
}
