// Checks every internal href/src in dist/ resolves to a built file, and that every <img>
// has non-empty alt (decorative images must use alt=""). External links are counted, not fetched.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import site from '../site.config.mjs';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
const base = (process.env.BASE_PATH || site.base).replace(/\/$/, '');

const htmlFiles = [];
(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.html')) htmlFiles.push(p);
  }
})(dist);

const errors = [];
let internal = 0,
  external = 0,
  imgs = 0;

for (const f of htmlFiles) {
  const html = readFileSync(f, 'utf8');
  for (const m of html.matchAll(/<(a|img|link|script|source)\b[^>]*?\s(?:href|src)="([^"]*)"/g)) {
    const [, tag, raw] = m;
    if (!raw || raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('data:')) continue;
    if (/^https?:\/\//.test(raw)) {
      external++;
      continue;
    }
    internal++;
    let path = raw.split('#')[0].split('?')[0];
    if (base && path.startsWith(base + '/')) path = path.slice(base.length);
    else if (base && path === base) path = '/';
    const abs = path.startsWith('/') ? join(dist, path) : join(dirname(f), path);
    const ok = existsSync(abs) || existsSync(join(abs, 'index.html')) || (path.endsWith('/') && existsSync(join(abs, 'index.html')));
    if (!ok) errors.push(`${f.replace(dist, '')}: <${tag}> → ${raw}`);
  }
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    imgs++;
    if (!/\salt(=|\s|>|\/)/.test(m[0])) errors.push(`${f.replace(dist, '')}: <img> without alt: ${m[0].slice(0, 80)}…`);
  }
}

if (errors.length) {
  console.error(`✗ linkcheck: ${errors.length} problem(s)`);
  errors.slice(0, 50).forEach((e) => console.error('  - ' + e));
  process.exit(1);
}
console.log(`✓ linkcheck: ${htmlFiles.length} pages, ${internal} internal links ok, ${imgs} images with alt, ${external} external links (not fetched)`);
