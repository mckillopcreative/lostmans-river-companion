// Fails the build if any cross-reference in /data points at an unknown id,
// or any referenced sketch file is missing. Run with `npm run validate`.
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const load = (n) => JSON.parse(readFileSync(resolve(root, 'data', `${n}.json`), 'utf8'));

const chapters = load('chapters');
const routes = load('routes');
const sketches = load('sketches');
const entity = {
  characters: load('characters'),
  fish: load('fish'),
  wildlife: load('wildlife'),
  boats: load('boats'),
  gear: load('gear'),
  places: load('places'),
};
const glossary = load('glossary');
const errors = [];
const ids = Object.fromEntries(Object.entries(entity).map(([k, v]) => [k, new Set(v.map((e) => e.id))]));
const words = new Set(glossary.map((g) => g.word));
const sketchFiles = new Set(sketches.map((s) => s.file));

// 1. ids unique within each file
for (const [k, v] of Object.entries(entity)) {
  const seen = new Set();
  for (const e of v) {
    if (!e.id) errors.push(`${k}: entry without id (${e.name ?? e.common ?? e.term})`);
    if (seen.has(e.id)) errors.push(`${k}: duplicate id ${e.id}`);
    seen.add(e.id);
  }
}

// 2. chapters: 1..23 contiguous, references resolve
if (chapters.length !== 23) errors.push(`chapters: expected 23, got ${chapters.length}`);
chapters.forEach((c, i) => {
  if (c.n !== i + 1) errors.push(`chapters: expected n=${i + 1}, got ${c.n}`);
  for (const key of ['places', 'fish', 'wildlife', 'characters', 'boats', 'gear']) {
    for (const id of c[key] ?? []) if (!ids[key].has(id)) errors.push(`ch${c.n}.${key}: unknown id "${id}"`);
  }
  for (const w of c.word_of_day ?? []) if (!words.has(w)) errors.push(`ch${c.n}.word_of_day: unknown word "${w}"`);
  if (c.sketch && !sketchFiles.has(c.sketch)) errors.push(`ch${c.n}.sketch: not in sketches.json "${c.sketch}"`);
});

// 3. routes
for (const r of routes) {
  if (!chapters.find((c) => c.n === r.chapter)) errors.push(`routes: unknown chapter ${r.chapter}`);
  for (const w of r.waypoints) if (!ids.places.has(w)) errors.push(`routes ch${r.chapter}: unknown place "${w}"`);
  if (!['boat', 'road', 'air'].includes(r.mode)) errors.push(`routes ch${r.chapter}: bad mode ${r.mode}`);
}

// 4. entity.sketch and entity.chapters resolve; sketch files exist on disk
for (const [k, v] of Object.entries(entity)) {
  for (const e of v) {
    if (e.sketch && !sketchFiles.has(e.sketch)) errors.push(`${k}/${e.id}.sketch: not in sketches.json "${e.sketch}"`);
    for (const n of e.chapters ?? []) if (n < 1 || n > 23) errors.push(`${k}/${e.id}.chapters: out of range ${n}`);
    if (e.chapter && (e.chapter < 1 || e.chapter > 23)) errors.push(`${k}/${e.id}.chapter: out of range ${e.chapter}`);
  }
}
for (const s of sketches) {
  if (!existsSync(resolve(root, 'assets/sketches', s.file))) errors.push(`sketches: missing file assets/sketches/${s.file}`);
  for (const n of s.chapters) if (n < 1 || n > 23) errors.push(`sketches/${s.file}: chapter out of range ${n}`);
}

// 5. places have numeric coordinates
for (const p of entity.places) {
  if (typeof p.lat !== 'number' || typeof p.lng !== 'number') errors.push(`places/${p.id}: lat/lng must be numbers`);
}

if (errors.length) {
  console.error(`✗ data validation failed with ${errors.length} error(s):`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
const counts = Object.entries(entity)
  .map(([k, v]) => `${v.length} ${k}`)
  .join(', ');
console.log(`✓ data ok — 23 chapters, ${routes.length} routes, ${sketches.length} sketches, ${counts}`);
