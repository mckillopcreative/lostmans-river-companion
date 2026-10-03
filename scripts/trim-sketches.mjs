// Derives web-ready sketches from the untouched scans in /assets/sketches:
// cuts a small inset (drops scanner edge lines), trims the blank margins, adds an
// even paper border, and writes PNGs to src/assets/sketches/ (gitignored, regenerated
// on every dev/build). Originals are never modified (CLAUDE.md).
import sharp from 'sharp';
import { readdirSync, mkdirSync, statSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const srcDir = join(root, 'assets', 'sketches');
const outDir = join(root, 'src', 'assets', 'sketches');
mkdirSync(outDir, { recursive: true });

const PAD = 24; // px of paper left around the ink
const INSET = 0.03; // fraction of each edge discarded before trimming

let done = 0;
for (const file of readdirSync(srcDir).filter((f) => /\.png$/i.test(f))) {
  const input = join(srcDir, file);
  const output = join(outDir, file);
  if (existsSync(output) && statSync(output).mtimeMs >= statSync(input).mtimeMs) continue;

  const meta = await sharp(input).metadata();
  const ix = Math.round(meta.width * INSET);
  const iy = Math.round(meta.height * INSET);
  const inset = await sharp(input)
    .flatten({ background: '#ffffff' })
    .grayscale()
    .extract({ left: ix, top: iy, width: meta.width - 2 * ix, height: meta.height - 2 * iy })
    .toBuffer();
  const trimmed = await sharp(inset).trim({ background: '#ffffff', threshold: 70 }).toBuffer();
  await sharp(trimmed)
    .extend({ top: PAD, bottom: PAD, left: PAD, right: PAD, background: '#ffffff' })
    .png({ compressionLevel: 9, palette: true })
    .toFile(output);
  done++;
}
console.log(`✓ sketches trimmed (${done} regenerated) → src/assets/sketches/`);
