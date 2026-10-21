// Cuts each knot drawing (assets/art/tackle/knot-<id>.webp: one strip of stage drawings joined by
// small arrows) into one image per stage, so the knot page can show the current step large.
// Writes assets/art/knot-stages/<id>-<n>.webp and prints what it found.
//   node scripts/split-knots.mjs [--dry]
import sharp from 'sharp';
import { mkdirSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const DRY = process.argv.includes('--dry');
const knots = JSON.parse(readFileSync(join(root, 'data/knots.json'), 'utf8'));
const list = Array.isArray(knots) ? knots : knots.knots;
const outDir = join(root, 'assets/art/knot-stages');
if (!DRY) mkdirSync(outDir, { recursive: true });

for (const k of list) {
  const file = join(root, `assets/art/tackle/knot-${k.id}.webp`);
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  // ink = opaque and darker than the paper
  const ink = (x, y) => {
    const i = (y * W + x) * 4;
    return data[i + 3] > 40 && data[i] + data[i + 1] + data[i + 2] < 600;
  };
  const colInk = new Array(W).fill(0);
  for (let x = 0; x < W; x++) for (let y = 0; y < H; y++) if (ink(x, y)) colInk[x]++;
  // runs of inked columns, merging gaps narrower than 12 px
  const runs = [];
  let start = -1, gap = 0;
  for (let x = 0; x < W; x++) {
    if (colInk[x] > 0) {
      if (start < 0) start = x;
      gap = 0;
    } else if (start >= 0 && ++gap > 12) {
      runs.push([start, x - gap]);
      start = -1;
      gap = 0;
    }
  }
  if (start >= 0) runs.push([start, W - 1]);
  // vertical extent of each run; arrows are short and thin, drawings are tall
  const boxes = runs.map(([x0, x1]) => {
    let y0 = H, y1 = 0;
    for (let x = x0; x <= x1; x++) for (let y = 0; y < H; y++) if (ink(x, y)) ((y0 = Math.min(y0, y)), (y1 = Math.max(y1, y)));
    return { x0, x1, y0, y1, w: x1 - x0 + 1, h: y1 - y0 + 1 };
  });
  const tallest = Math.max(...boxes.map((b) => b.h));
  if (process.argv.includes("--boxes")) console.log("   boxes", boxes.map((b) => `${b.w}x${b.h}@${b.x0}`).join(" "));
  const stages = boxes.filter((b) => b.h > Math.max(40, tallest * 0.2)); // arrows are ~14 px tall
  console.log(`${k.id}: ${runs.length} runs → ${stages.length} stages (${k.steps.length} steps) ` + stages.map((b) => `${b.w}x${b.h}`).join(' '));
  if (DRY) continue;
  // one shared frame height per knot so stages keep their relative scale
  const top = Math.min(...stages.map((b) => b.y0));
  const bottom = Math.max(...stages.map((b) => b.y1));
  const pad = 24;
  for (const [i, b] of stages.entries()) {
    const left = Math.max(0, b.x0 - pad);
    const right = Math.min(W - 1, b.x1 + pad);
    await sharp(file)
      .extract({ left, top: Math.max(0, top - pad), width: right - left + 1, height: Math.min(H - 1, bottom + pad) - Math.max(0, top - pad) + 1 })
      .webp({ quality: 92, alphaQuality: 95 })
      .toFile(join(outDir, `${k.id}-${i + 1}.webp`));
  }
}
