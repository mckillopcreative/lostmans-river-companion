// Imports the generated art pack into assets/art as web masters: WebP (alpha kept),
// max 1600 px on the long side, textures and badges untouched in size, social-share
// written as a 1200x630 JPG into public/. The full-size PNG originals stay outside the
// repo (the pack the author keeps). Usage: node scripts/import-art.mjs <pack>/assets/art
import sharp from 'sharp';
import { readdirSync, mkdirSync, statSync } from 'node:fs';
import { resolve, join, basename, extname } from 'node:path';

const src = resolve(process.argv[2]);
const root = resolve(import.meta.dirname, '..');
const dstRoot = join(root, 'assets', 'art');
const MAX = 1600;
let n = 0, bytes = 0;

for (const folder of readdirSync(src)) {
  const from = join(src, folder);
  if (!statSync(from).isDirectory()) continue;
  const to = join(dstRoot, folder);
  mkdirSync(to, { recursive: true });
  for (const file of readdirSync(from)) {
    if (!/\.png$/i.test(file)) continue;
    const id = basename(file, extname(file));
    const input = join(from, file);
    if (folder === 'emblems' && id === 'social-share') {
      await sharp(input).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 86 }).toFile(join(root, 'public', 'social-share.jpg'));
      n++;
      continue;
    }
    const meta = await sharp(input).metadata();
    const long = Math.max(meta.width, meta.height);
    const isTexture = /^texture-/.test(id);
    let img = sharp(input);
    if (long > MAX && !isTexture) img = img.resize({ width: meta.width >= meta.height ? MAX : undefined, height: meta.height > meta.width ? MAX : undefined, fit: 'inside' });
    const out = join(to, `${id}.webp`);
    const info = await img.webp({ quality: isTexture ? 80 : 88, alphaQuality: 90, effort: 4 }).toFile(out);
    bytes += info.size;
    n++;
  }
}
console.log(`✓ imported ${n} files → assets/art (${(bytes / 1048576).toFixed(1)} MB of WebP)`);
