// Puts the titled journal on a white "torn watercolor" cloud, like the place scenes' edges.
// Usage: node scripts/journal-card.mjs <repo> ; writes assets/art/emblems/journal-card.webp
import sharp from 'sharp';
import { join } from 'node:path';

const repo = process.argv[2];
const src = join(repo, 'assets/art/emblems/journal-titled.webp');
const out = join(repo, 'assets/art/emblems/journal-card.webp');
const W = 1254, H = 1254;

// deterministic wobble so the edge looks hand-torn, not geometric
let seed = 7;
const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
function blob(cx, cy, rx, ry, wob, n = 48) {
  const pts = [];
  const bumps = Array.from({ length: n }, () => 1 + (rnd() - 0.5) * wob);
  // smooth the bumps so the edge has lobes like a cloud, not spikes
  const sm = bumps.map((_, i) => (bumps[(i + n - 1) % n] + 2 * bumps[i] + bumps[(i + 1) % n]) / 4);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    pts.push([cx + Math.cos(a) * rx * sm[i], cy + Math.sin(a) * ry * sm[i]]);
  }
  // Catmull-Rom → cubic bezier for a soft outline
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i + n - 1) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d + 'Z';
}

const svg = (path, fill, opacity) =>
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><path d="${path}" fill="${fill}" fill-opacity="${opacity}"/></svg>`);

// journal subject sits at x 151–1145, y 123–1146 (measured); the cloud reaches ~70 px past it
const cx = 648, cy = 640;
const bleed = await sharp(svg(blob(cx, cy, 612, 622, 0.34, 18), '#bcd9ee', 0.5)).png().blur(22).toBuffer(); // outer watercolor bleed
const wash = await sharp(svg(blob(cx, cy, 586, 596, 0.3, 20), '#d9eefb', 0.75)).png().blur(9).toBuffer(); // pale-sky ring
const paper = await sharp(svg(blob(cx, cy, 556, 568, 0.26, 20), '#ffffff', 1)).png().blur(2).toBuffer(); // the white card, lobed like a cloud

await sharp({ create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
  .composite([{ input: bleed }, { input: wash }, { input: paper }, { input: src }])
  .webp({ quality: 88, alphaQuality: 90, effort: 4 })
  .toFile(out);
console.log('wrote', out);
