// Build the Codex picture batch for Wild Florida from data/wild.json: one plate for every animal
// whose art lives in assets/art/wild/ (the `draw` field says what to paint), one close-up for
// every entry in an animal's `more`, plus the tile.
//   node scripts/wild-batch.mjs   → scripts/art-batches/wild.json, and wild-1.json / wild-2.json
// Then: node scripts/genbatch.mjs scripts/art-batches/wild.json 2  (skips plates already painted)
// or run genbatch on wild-1.json and wild-2.json side by side: they hold every other picture.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const w = JSON.parse(readFileSync(resolve(root, 'data/wild.json'), 'utf8'));
const starters = new Set(w.animals.filter((a) => a.starter).map((a) => a.id));
// the order they are painted in: the free starters, then sharks and reptiles (what children ask
// for first), then the close-ups, then the rest
const rank = (a) => (starters.has(a.id) ? 0 : a.type === 'sharks' ? 1 : a.type === 'reptiles' ? 2 : 4);
const items = w.animals
  .filter((a) => a.art[0] === 'wild')
  .map((a) => {
    if (!a.draw) throw new Error(`${a.id} has no "draw"`);
    return { group: 'plate', out: `private/art-pack/assets/art/wild/${a.id}.png`, line: a.draw + '.', rank: rank(a) };
  });
// close-up plates ('more'): a detail of one animal, not the whole body
for (const a of w.animals)
  for (const m of a.more ?? []) {
    if (!m.draw) throw new Error(`${a.id}: a close-up has no "draw"`);
    items.push({ group: 'detail', out: `private/art-pack/assets/art/${m.art[0]}/${m.art[1]}.png`, line: m.draw + '.', rank: 3 });
  }
items.sort((x, y) => x.rank - y.rank);
for (const it of items) delete it.rank;
items.push({
  group: 'tile',
  out: 'private/art-pack/assets/art/tiles/wild-florida.png',
  line: 'an Everglades shoreline at sunrise packed with wildlife, each animal clear and separate: a great blue heron standing in the shallows, an alligator on the mud bank, a brown pelican on a piling, an osprey overhead with a fish, a dolphin’s back and fin in the channel, a snook with its black stripe just under the clear green water, and red mangroves behind. A weathered field notebook and a pair of binoculars sit in the lower corner.',
});
const accuracy =
  'Identification accuracy matters more than anything: the colours, markings, the order of any bands, fin shapes and proportions described must be exactly right, because children will learn to identify the animal from this picture.';
const batch = {
  note: "Wild Florida plates (John, 2026-11-16). Built by scripts/wild-batch.mjs from data/wild.json ('draw'); do not edit by hand. Check every plate against its tell-tale before it ships: the coral snake and scarlet kingsnake band order above all.",
  groups: {
    plate: {
      shape: 'square',
      refs: ['assets/art/fish/snook.webp'],
      prompt: `A detailed, accurate natural-history field-guide plate in the style of the attached reference: fine pen-and-ink line with rich, realistic watercolor wash. The animal floats on a TRANSPARENT background (PNG with alpha) with only the small perch, bank or bit of water named in the subject, if any: no full scene, no sky, no paper, no frame, no vignette, no drop shadow. No text, letters, numbers, labels, arrows, logos or signatures anywhere. ONE animal only, whole body in view, filling about 85% of the canvas, soft daylight from the upper left. Fish and sharks are shown in exact side view with the head to the LEFT. ${accuracy} Subject: {{line}}`,
    },
    detail: {
      shape: 'square',
      refs: ['assets/art/fish/snook.webp'],
      prompt: `A detailed, accurate natural-history field-guide plate in the style of the attached reference: fine pen-and-ink line with rich, realistic watercolor wash. This is a CLOSE-UP DETAIL plate that shows one identifying feature of an animal, not the whole animal. The subject floats on a TRANSPARENT background (PNG with alpha) with only the small bit of water, sand or leaf litter named in the subject, if any: no full scene, no sky, no paper, no frame, no vignette, no drop shadow. No text, letters, numbers, labels, arrows, logos or signatures anywhere. The feature fills most of the canvas, soft daylight from the upper left. ${accuracy} Subject: {{line}}`,
    },
    tile: {
      shape: 'square',
      refs: ['assets/art/tiles/app-hero.webp'],
      prompt:
        'A richly detailed ink-line and watercolor painting, a complete scene painted edge to edge, with no border, frame, vignette or blank paper showing. Match the attached reference in finish and quality: fine confident linework, layered washes, realistic light and water reflections, deep saturated Florida Everglades color. No text, letters, numbers, symbols, logos or signatures anywhere. No people. Scene: {{line}}',
    },
  },
  items,
};
const save = (name, b) => writeFileSync(resolve(root, 'scripts/art-batches', name), JSON.stringify(b, null, 2) + '\n');
save('wild.json', batch);
// two halves (every other picture), so two painters can run side by side without doing the same plate
for (const half of [0, 1]) save(`wild-${half + 1}.json`, { ...batch, items: items.filter((_, i) => i % 2 === half) });
console.log(`${items.length} pictures in scripts/art-batches/wild.json (and split across wild-1.json and wild-2.json)`);
