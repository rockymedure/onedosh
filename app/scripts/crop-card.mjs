// Crop a rectangular region out of a PNG.
// usage: node crop-card.mjs <in.png> <out.png> <x> <y> <w> <h>
import { PNG } from "pngjs";
import { readFileSync, writeFileSync } from "node:fs";

const [, , inPath, outPath, xs, ys, ws, hs] = process.argv;
const x = +xs, y = +ys, w = +ws, h = +hs;
const png = PNG.sync.read(readFileSync(inPath));
const { width: W } = png;
const out = new PNG({ width: w, height: h });
for (let j = 0; j < h; j++) {
  for (let i = 0; i < w; i++) {
    const si = ((y + j) * W + (x + i)) * 4;
    const di = (j * w + i) * 4;
    out.data[di] = png.data[si];
    out.data[di + 1] = png.data[si + 1];
    out.data[di + 2] = png.data[si + 2];
    out.data[di + 3] = 255;
  }
}
writeFileSync(outPath, PNG.sync.write(out));
console.log(`wrote ${outPath} (${w}x${h}, ratio ${(w / h).toFixed(3)})`);
