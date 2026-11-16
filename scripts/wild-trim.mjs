// Trim the empty margin round each Wild Florida plate so the animal fills its card.
//   node scripts/wild-trim.mjs          (run after scripts/import-art.mjs; safe to run again)
// Long, low animals (an alligator, a gar) come back from the painter as a thin strip across a
// square canvas; trimmed to the animal plus a little air, they show nearly twice as large.
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import sharp from 'sharp';

const dir = resolve(import.meta.dirname, '..', 'assets/art/wild');
// which files are already trimmed (by size in bytes), so a second run never re-compresses a plate
const memo = join(dir, 'trimmed.json');
const done = existsSync(memo) ? JSON.parse(readFileSync(memo, 'utf8')) : {};
let n = 0;
for (const f of readdirSync(dir).filter((x) => x.endsWith('.webp'))) {
  const file = join(dir, f);
  const src = readFileSync(file);
  if (done[f] === src.length) continue;
  const m = await sharp(src).metadata();
  const { data, info } = await sharp(src).trim({ threshold: 12 }).toBuffer({ resolveWithObject: true });
  if (info.width > m.width * 0.97 && info.height > m.height * 0.97) {
    done[f] = src.length; // already tight
    continue;
  }
  const pad = Math.round(Math.max(info.width, info.height) * 0.04);
  const out = await sharp(data).extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 0, g: 0, b: 0, alpha: 0 } }).webp({ quality: 88, alphaQuality: 90, effort: 4 }).toBuffer();
  writeFileSync(file, out);
  done[f] = out.length;
  n++;
}
writeFileSync(memo, JSON.stringify(done, null, 1));
console.log(`trimmed ${n} plate(s)`);
