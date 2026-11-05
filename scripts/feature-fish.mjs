// The fish (or critter) of each chapter: the one the chapter's text mentions most, from the
// gitignored manuscript. Writes `star: { kind, id }` into data/chapters.json; only the id leaves
// this computer. Fish or critter, whichever is talked about most; ties go to fish, then listed order. Run after changing a chapter's fish list.
//   node scripts/feature-fish.mjs          writes data/chapters.json and prints the counts
//   node scripts/feature-fish.mjs --dry    prints only
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { chapters } from './narrate.mjs';

const root = resolve(import.meta.dirname, '..');
const file = resolve(root, 'data/chapters.json');
const raw = JSON.parse(readFileSync(file, 'utf8'));
const list = Array.isArray(raw) ? raw : raw.chapters;

// how each id is said in the book; lowercase-only where a capital is a person (Snapper, Jack)
const FISH = {
  snook: /snook/gi, tarpon: /tarpon|silver king/gi, redfish: /redfish|red drum|spot-?tail/gi, trout: /trout/gi,
  snapper: /\bsnapper/g, grouper: /grouper|goliath|\bgag\b/gi, 'black-drum': /black drum/gi, cobia: /cobia/gi,
  yellowtail: /yellowtail/gi, ladyfish: /ladyfish/gi, flounder: /flounder/gi, sheepshead: /sheepshead/gi,
  pufferfish: /puffer/gi, jack: /\bjacks?\b|crevalle/g, mullet: /mullet/gi, pinfish: /pinfish/gi, catfish: /catfish/gi,
  bonefish: /bonefish/gi, amberjack: /amberjack/gi, brim: /\bbrim\b|bluegill/gi, lionfish: /lionfish/gi,
  'mako-shark': /\bmako/gi, 'hammerhead-shark': /hammerhead/gi,
};
const WILD = {
  pelican: /pelican/gi, dolphin: /dolphin|porpoise/gi, alligator: /alligator|\bgator/gi, 'water-moccasin': /moccasin|cottonmouth/gi,
  shark: /shark/gi, mangroves: /mangrove/gi, 'oyster-bar': /oyster/gi, cypress: /cypress/gi, banyan: /banyan|strangler/gi,
  mosquito: /mosquito|skeeter/gi, 'ghost-net': /\bnets?\b/gi, 'stone-crab': /stone crab/gi, 'grass-beds': /grass/gi,
  frogs: /frog|choir/gi, iguana: /iguana/gi, seagull: /\bgulls?\b|seagull/gi, birds: /\bbirds?\b/gi, 'sand-flea': /sand flea/gi, gnat: /gnat|no-see-um/gi,
};
const count = (text, re) => (text.match(re) || []).length;

const words = {};
for (const ch of chapters()) {
  const c = list.find((x) => x.n === ch.n);
  if (!c) continue;
  words[ch.n] = ch.body.split(/\s+/).filter(Boolean).length;
  const tally = (ids, table) => ids.map((id) => ({ id, n: table[id] ? count(ch.body, table[id]) : 0 }));
  const fish = tally(c.fish || [], FISH);
  const wild = tally(c.wildlife || [], WILD);
  const best = (arr) => arr.reduce((a, b) => (b.n > a.n ? b : a), arr[0]);
  const f = fish.length ? best(fish) : null;
  const w = wild.length ? best(wild) : null;
  // the star is whichever species the chapter talks about most, fish or critter; fish win ties.
  // A hand-set star with locked: true is kept.
  let star = f && (!w || f.n >= w.n) ? { kind: 'fish', id: f.id } : w ? { kind: 'wildlife', id: w.id } : null;
  if (c.star && c.star.locked) star = c.star;
  c.star = star;
  console.log(String(ch.n).padStart(2), String(words[ch.n]).padStart(5), 'w', star ? `${star.kind}:${star.id}` : '-', '|', fish.map((x) => `${x.id}=${x.n}`).join(' '), wild.length ? '| ' + wild.map((x) => `${x.id}=${x.n}`).join(' ') : '');
}
console.log('total words', Object.values(words).reduce((a, b) => a + b, 0));
if (!process.argv.includes('--dry')) {
  writeFileSync(file, JSON.stringify(raw, null, 2) + '\n');
  console.log('✓ data/chapters.json: star written');
}
