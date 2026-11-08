// Checkout logo for Stripe branding: the houseboat painting, the Summer Fishing Guide Experience
// lettering across the top, and "Lostman's River" on a paper band along the bottom.
//   node scripts/brand-logo.mjs   → assets/brand/checkout-logo-1200x600.png (wide, 2:1),
//                                   assets/brand/checkout-logo-600x600.png (square),
//                                   assets/brand/checkout-icon-512.png (the site mark, for Stripe's icon slot)
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const out = resolve(root, 'assets/brand');
mkdirSync(out, { recursive: true });
const PAPER = '#f6f1e7', MANGROVE = '#2f5d50', SUNRISE = '#a04d12';

async function make(W, H, file, { titleW, bandH, nameSize, eyebrowSize, pos }) {
  const art = await sharp(resolve(root, 'assets/art/tiles/app-hero.webp')).resize(W, H, { fit: 'cover', position: pos }).toBuffer();
  const title = await sharp(resolve(root, 'assets/art/emblems/title-summer.webp')).resize({ width: titleW }).toBuffer();
  const tm = await sharp(title).metadata();
  const topScrim = Math.round(tm.height * 2.2);
  // scrims and the name band are SVG, so they scale cleanly
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="top" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${PAPER}" stop-opacity="0.92"/>
        <stop offset="0.6" stop-color="${PAPER}" stop-opacity="0.55"/>
        <stop offset="1" stop-color="${PAPER}" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="bot" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${PAPER}" stop-opacity="0"/>
        <stop offset="0.35" stop-color="${PAPER}" stop-opacity="0.9"/>
        <stop offset="1" stop-color="${PAPER}" stop-opacity="1"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="${W}" height="${topScrim}" fill="url(#top)"/>
    <rect x="0" y="${H - bandH}" width="${W}" height="${bandH}" fill="url(#bot)"/>
    <text x="${W / 2}" y="${H - bandH * 0.52}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="${eyebrowSize}" fill="${SUNRISE}">Escape to</text>
    <text x="${W / 2}" y="${H - bandH * 0.14}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="${nameSize}" fill="${MANGROVE}">Lostman’s River</text>
  </svg>`;
  await sharp(art)
    .composite([
      { input: Buffer.from(svg), top: 0, left: 0 },
      { input: title, top: Math.round(tm.height * 0.35), left: Math.round((W - tm.width) / 2) },
    ])
    .png()
    .toFile(resolve(out, file));
  console.log('✓', file);
}

await make(1200, 600, 'checkout-logo-1200x600.png', { titleW: 1000, bandH: 150, nameSize: 60, eyebrowSize: 28, pos: 'centre' });
await make(600, 600, 'checkout-logo-600x600.png', { titleW: 560, bandH: 150, nameSize: 58, eyebrowSize: 28, pos: 'centre' });
await sharp(resolve(root, 'assets/art/emblems/site-mark.webp')).resize(512, 512).flatten({ background: PAPER }).png().toFile(resolve(out, 'checkout-icon-512.png'));
console.log('✓ checkout-icon-512.png');
