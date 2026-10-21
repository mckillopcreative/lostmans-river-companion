// Build check: every event the pages send must be on the allow-list in src/lib/events.mjs,
// or the Worker will silently drop it and the dashboard will read zero forever.
// Run by `npm run validate`.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';
import { EVENTS } from '../src/lib/events.mjs';

const root = resolve(import.meta.dirname, '..');
const files = [];
const walk = (d) => {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(astro|ts|mjs|js)$/.test(n) && n !== 'track.ts') files.push(p); // track.ts only documents the call
  }
};
walk(join(root, 'src'));

const used = new Map();
const pats = [/\btrack\(\s*'([a-z_]+)'/g, /\blrTrack\?\.\(\s*'([a-z_]+)'/g, /data-track="([a-z_]+)"/g];
for (const f of files) {
  const s = readFileSync(f, 'utf8');
  for (const re of pats) for (const m of s.matchAll(re)) used.set(m[1], relative(root, f));
}
const missing = [...used].filter(([n]) => !Object.hasOwn(EVENTS, n));
if (missing.length) {
  console.error('✗ events sent but not allowed by the Worker (add them to src/lib/events.mjs):');
  for (const [n, f] of missing) console.error(`  ${n}  (${f})`);
  process.exit(1);
}
const unused = Object.keys(EVENTS).filter((n) => !used.has(n));
console.log(`✓ events: ${used.size} sent, all allowed${unused.length ? ` (allowed but unused: ${unused.join(', ')})` : ''}`);
