// Builds the favicon set from the titled journal (assets/art/emblems/journal-titled.webp):
// favicon.ico (16/32/48, PNG-in-ICO), favicon-32.png, favicon-64.png, apple-touch-icon.png
// (180, on paper, since iOS fills transparency with black) and icon-512.png.
//   node scripts/make-icons.mjs
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const src = resolve(root, 'assets/art/emblems/journal-titled.webp');
const pub = (f) => resolve(root, 'public', f);
const clear = { r: 0, g: 0, b: 0, alpha: 0 };
const paper = { r: 246, g: 241, b: 231, alpha: 1 };

// crop to the book itself so it fills the tiny square
const trimmed = await sharp(src).trim({ threshold: 10 }).png().toBuffer();
const square = (size, bg, pad = 0) =>
  sharp(trimmed)
    .resize(size - pad * 2, size - pad * 2, { fit: 'contain', background: bg })
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: bg })
    .png()
    .toBuffer();

const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((s) => square(s, clear)));
// ICO container with PNG payloads (supported by every current browser)
const header = Buffer.alloc(6 + 16 * pngs.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(pngs.length, 4);
let offset = header.length;
pngs.forEach((png, i) => {
  const e = 6 + i * 16;
  header.writeUInt8(sizes[i] % 256, e);
  header.writeUInt8(sizes[i] % 256, e + 1);
  header.writeUInt8(0, e + 2);
  header.writeUInt8(0, e + 3);
  header.writeUInt16LE(1, e + 4);
  header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(png.length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += png.length;
});
writeFileSync(pub('favicon.ico'), Buffer.concat([header, ...pngs]));
writeFileSync(pub('favicon-32.png'), pngs[1]);
writeFileSync(pub('favicon-64.png'), await square(64, clear));
writeFileSync(pub('apple-touch-icon.png'), await square(180, paper, 14));
writeFileSync(pub('icon-512.png'), await square(512, paper, 40));
console.log('✓ favicon.ico (16/32/48), favicon-32.png, favicon-64.png, apple-touch-icon.png, icon-512.png from the journal');
