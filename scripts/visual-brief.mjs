// Writes docs/VISUAL-BRIEF.md: the hand-off document for an image model (GPT, Midjourney,
// a human illustrator). Style guide + every asset the site can use, with exact file paths
// the site picks up automatically (src/lib/images.ts). Re-run after editing data/*.json.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const load = (n) => JSON.parse(readFileSync(resolve(root, 'data', `${n}.json`), 'utf8'));
const fish = load('fish');
const characters = load('characters');
const wildlife = load('wildlife');
const boats = load('boats');
const gear = load('gear');
const places = load('places');
const chapters = load('chapters');

const esc = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const row = (...c) => `| ${c.map(esc).join(' | ')} |`;

const knots = [
  { id: 'improved-clinch', name: 'Improved clinch knot', note: 'The everyday hook-to-line knot; show the five wraps and the tag end tucked back.' },
  { id: 'loop-knot', name: 'Non-slip loop knot', note: 'Lets a lure swing freely; show the open loop at the lure eye.' },
  { id: 'uni-knot', name: 'Uni knot', note: 'Line to swivel, and doubled as a line-to-leader join.' },
  { id: 'palomar', name: 'Palomar knot', note: 'Strongest simple hook knot; show the doubled line passed over the hook.' },
  { id: 'albright', name: 'Albright knot', note: 'Main line to a heavier leader, as Matt ties for the big snook.' },
];

const sections = [];

sections.push(`# Visual brief — Escape to Lostman's River companion site

**Hand this file to an image model or an illustrator.** It describes the look, the file contract, and every picture the site can use. Files saved at the exact paths below appear on the site automatically on the next build; nothing else needs to change.

Generated from \`data/*.json\` by \`npm run brief\`. Counts: ${fish.length} fish, ${characters.length} crew, ${wildlife.length} critters, ${boats.length} boats, ${gear.length} tackle terms, ${knots.length} knots, ${places.length} places, ${chapters.length} chapters.

---

## 1. The look

The book cover is the reference: a **watercolor sky** in cover blue, a pale **seafoam** horizon, and **black ink silhouettes** of an angler casting from a flats boat with a seaplane overhead. Inside the book, every illustration is a **pen-and-ink sketch** by Linda McKillop. The site combines both: cream paper pages, ink drawings, and watercolor washes in the cover's colors.

Every new image must sit comfortably next to Linda's sketches. Think *field guide painted on the boat*, not *cartoon*, not *photoreal render*.

### Palette (use these, nothing neon)
| Token | Hex | Where it comes from / use |
|---|---|---|
| paper | \`#f6f1e7\` | page background; leave transparent, the site supplies it |
| ink | \`#1f2a2e\` | line work, lettering |
| silhouette | \`#0b1218\` | the cover's black figures |
| sky | \`#6ab8e8\` | cover sky, water washes |
| sky-pale | \`#d9eefb\` | high sky, highlights on water |
| seafoam | \`#cfeacb\` | the cover's horizon glow, mangrove light |
| mangrove | \`#2f5d50\` | foliage, deep shade |
| gulf | \`#2a7f8e\` | deeper water, teal |
| sunrise | \`#e8873a\` | the one warm accent: a lure flash, a float, a bobber, a sunrise |
| oyster | \`#b8b2a6\` | shell, sand, driftwood |

Fish get their own natural colors (listed per species below), kept muted and watercolor-soft.

### Medium and rendering rules
- **Pen-and-ink line + loose watercolor wash.** Visible paper grain in the wash is good; airbrush smoothness is not.
- **Transparent background (PNG with alpha).** No white or cream box behind the subject, no vignette, no frame, no drop shadow.
- **No text, no lettering, no logos, no watermarks, no signatures** inside any image. The site adds captions.
- **One subject, centered, with breathing room.** Fill about 80% of the canvas. No cropped edges.
- **Consistent light:** soft daylight from upper left.
- **Species accuracy matters.** Adult anglers will judge the fish. Fin counts, stripe placement, mouth shape and tail shape must be right for the species. Use the identification notes below.
- **People are drawn, never photoreal,** and never resemble a real public figure. Faces are kind, a little weathered, outdoors-people. No cartoon proportions.
- **No violence close-ups.** The shark, the gator and the moccasin are drawn as field-guide animals, not as attacks.
- **Square canvas, 2048 × 2048 px** for all subjects unless a size is given. The site resizes.

### File contract
Save each file as **\`assets/art/<folder>/<id>.png\`** using the folder and id in the tables. Lower-case, hyphens, no spaces. Ids are fixed; do not rename them.

A good prompt skeleton:

> Pen-and-ink line drawing with loose watercolor wash, field-guide style, on a transparent background. Subject: {subject}. {identification notes}. Muted natural colors: {colors}. Soft daylight from upper left. No text, no border, no background scenery, single subject centered, square.

For scenes (places, chapters) drop "single subject" and allow a horizon, still with no text.

---
`);

// ---- Priorities
sections.push(`## 2. Priorities

Make them in this order; the site improves with every batch.

1. **Six core fish** — snook, tarpon, redfish, spotted seatrout, mangrove snapper, grouper. These are on nearly every chapter page.
2. **The five crew portraits without a sketch** — Uncle Dan, Snapper, Rose, Rawley, Marge.
3. **Site emblems** — the site mark, section emblems, social share image.
4. **Lures and rigs**, then **knots**.
5. The remaining fish, critters, boats.
6. Place scenes and chapter spot illustrations.

---
`);

// ---- Fish
sections.push(`## 3. Fish — \`assets/art/fish/<id>.png\`

Side view, head to the left, full body including tail, as in a field guide plate. Slight three-quarter turn is fine. Wet, not glossy.

${row('id', 'Common name', 'Scientific', 'Identification (must be right)', 'Typical size', 'Color notes')}
${row('---', '---', '---', '---', '---', '---')}
${fish.map((f) => row(f.id, f.common, f.scientific, f.identify ?? '', f.typical_size ?? '', f.color ?? '')).join('\n')}

Notes: the \`mako-shark\` entry is what the book calls it; draw a shark that reads as a bull shark in shallow water at night. \`hammerhead-shark\`: great hammerhead, head-on view acceptable.

---
`);

// ---- Crew
sections.push(`## 4. Crew — \`assets/art/crew/<id>.png\`

Bust or three-quarter portrait, pen-and-ink with a light wash, like a sketch Matt made in the Guidebook margin. Plain transparent background. Clothing and props from the description. ${characters.filter((c) => c.sketch).map((c) => c.name).join(', ')} already have Linda's sketches; a portrait is still welcome for consistency but is lower priority.

${row('id', 'Name', 'Role', 'What to draw')}
${row('---', '---', '---', '---')}
${characters.map((c) => row(c.id, c.name, c.role, [c.age, c.description, c.traits ? 'Tells: ' + c.traits.join('; ') : ''].filter(Boolean).join(' '))).join('\n')}

Special cases: \`bertha-oscar\` is two brown pelicans on a dock piling; \`old-scarface\` is a huge tarpon with an old scar across the jaw, half out of the water; \`lobster\` is a red tabby cat; \`third-man\` can be a figure in a dark windbreaker seen from behind at the rail of a boat; \`josh-ben\` are ten-year-old twins, one curly-haired with freckles, one a little taller.

---
`);

// ---- Critters
sections.push(`## 5. Critters — \`assets/art/critters/<id>.png\`

Field-guide plates. Plants and habitats (mangroves, oyster bar, seagrass, cypress, banyan) as a representative clump or cross-section.

${row('id', 'Name', 'Scientific', 'Notes')}
${row('---', '---', '---', '---')}
${wildlife.map((w) => row(w.id, w.name, w.scientific ?? '', [w.in_book, (w.facts ?? [])[0]].filter(Boolean).join(' '))).join('\n')}

---
`);

// ---- Boats
sections.push(`## 6. Boats and vehicles — \`assets/art/boats/<id>.png\`

Three-quarter view from slightly above, afloat (no trailer), no people unless noted. Hull colors as described.

${row('id', 'Name', 'Type', 'What to draw')}
${row('---', '---', '---', '---')}
${boats.map((b) => row(b.id, b.name, b.type ?? '', [b.in_book, (b.facts ?? [])[0]].filter(Boolean).join(' '))).join('\n')}

---
`);

// ---- Tackle
const groups = { 'lures-bait': 'Lures & bait', 'line-rigging': 'Line & rigging', techniques: 'Techniques', 'reading-the-water': 'Reading the water', 'boat-safety': 'Boat & safety' };
sections.push(`## 7. Tackle box — \`assets/art/tackle/<id>.png\`

Objects as catalog drawings: the item alone, slightly larger than life, every part legible. Techniques and water-reading terms are small scene diagrams (a boat, a cast, an arrow or two is fine, still no text).

${Object.entries(groups)
  .map(
    ([g, label]) => `### ${label}
${row('id', 'Term', 'What to draw')}
${row('---', '---', '---')}
${gear
  .filter((t) => t.group === g)
  .map((t) => row(t.id, t.term, t.definition))
  .join('\n')}
`,
  )
  .join('\n')}
### Knots — \`assets/art/tackle/knot-<id>.png\`
Step diagrams in ink: three to four stages left to right, line drawn as a thick rope so the wraps read, hook or swivel in silhouette. No text; the site labels the steps.

${row('id (file is knot-<id>.png)', 'Knot', 'Notes')}
${row('---', '---', '---')}
${knots.map((k) => row(k.id, k.name, k.note)).join('\n')}

---
`);

// ---- Places
sections.push(`## 8. Places — \`assets/art/places/<id>.png\`

Landscape scenes, 2048 × 1365 px (3:2), watercolor with ink line. Low horizon, big Everglades sky in the cover's blue, mangroves in mangrove green. No people, no text. These sit behind the place popups on the chart and at the top of future place pages.

${row('id', 'Place', 'Type', 'In the book')}
${row('---', '---', '---', '---')}
${places.map((p) => row(p.id, p.name, p.type, p.in_book)).join('\n')}

---
`);

// ---- Chapters
sections.push(`## 9. Chapter spot illustrations — \`assets/art/chapters/ch-NN.png\`

A small ink spot illustration per chapter (a single object or moment, like a chapter-head vignette): 1024 × 1024, mostly line, a single wash of one color. These sit beside the chapter number on each QR landing page. Chapters marked "has sketch" already have one of Linda's drawings on the page; the spot should be a *different* object from that chapter.

${row('file', 'Chapter', 'Summary', 'Linda sketch on page?')}
${row('---', '---', '---', '---')}
${chapters.map((c) => row(`ch-${String(c.n).padStart(2, '0')}.png`, `${c.n} — ${c.title}`, c.summary, c.sketch ? 'yes' : 'no')).join('\n')}

---
`);

// ---- Emblems
sections.push(`## 10. Emblems and site furniture — \`assets/art/emblems/<id>.png\`

${row('id', 'Size', 'What it is')}
${row('---', '---', '---')}
${[
  ['site-mark', '1024 × 1024', 'The site mark: a leaping tarpon in a hand-drawn circle, ink only, one sunrise-orange dot for the eye. Must work at 32 px.'],
  ['site-mark-wordmark', '2400 × 800', 'The mark beside “Lostman’s River” — no, do NOT letter it; leave space to the right of the mark for the site’s own type.'],
  ['compass-rose', '1024 × 1024', 'Pen-and-ink compass rose like one drawn in a chart corner; the site already has an SVG version, this is the painted one for the chart page.'],
  ['emblem-chart', '1024 × 1024', 'Section emblem: a rolled chart and dividers.'],
  ['emblem-fish', '1024 × 1024', 'Section emblem: a snook silhouette.'],
  ['emblem-crew', '1024 × 1024', 'Section emblem: a weathered captain’s cap.'],
  ['emblem-critters', '1024 × 1024', 'Section emblem: a brown pelican on a piling.'],
  ['emblem-boats', '1024 × 1024', 'Section emblem: a center-console skiff, bow on.'],
  ['emblem-tackle', '1024 × 1024', 'Section emblem: an open tackle box with a popping cork and a spoon.'],
  ['emblem-list', '1024 × 1024', 'Section emblem: a pencil and a tick box.'],
  ['emblem-sketchbook', '1024 × 1024', 'Section emblem: a dip pen and an ink bottle.'],
  ['emblem-about', '1024 × 1024', 'Section emblem: the Guidebook itself, a thick water-stained book with a ribbon.'],
  ['qr-frame', '2048 × 2048', 'A hand-drawn frame for the printed QR codes: an open rectangle with a fishing line looping around it and a tiny hook; the center must stay empty and pure white; black ink only; print-safe.'],
  ['divider-wave', '2400 × 200', 'Horizontal ink divider: a water line with three mullet jumping.'],
  ['divider-line', '2400 × 200', 'Horizontal ink divider: a fishing line with a swivel in the middle and a hook at the right end.'],
  ['texture-watercolor-sky', '2400 × 1600', 'A plain watercolor sky wash in the cover blue fading to seafoam at the bottom, no subject; used as a page background. This one is NOT transparent.'],
  ['texture-paper', '2048 × 2048', 'Cream paper grain, seamless tile, very subtle. NOT transparent.'],
  ['social-share', '1200 × 630', 'Open-graph image: the cover composition reinterpreted — silhouetted angler casting from a skiff, seaplane high right, watercolor sky — with empty space on the left third for the title which the site overlays. NOT transparent.'],
  ['badge-snook', '512 × 512', 'Reader badge (future): a snook in a circle, “earned” look, ink and one wash.'],
  ['badge-tarpon', '512 × 512', 'Reader badge (future): a tarpon leaping in a circle.'],
  ['badge-captain', '512 × 512', 'Reader badge (future): a captain’s wheel in a circle.'],
]
  .map((e) => row(...e))
  .join('\n')}

---

## 11. Photos the family should supply (not for an image model)

- A high-resolution file of the printed cover (the KDP cover PDF or JPG). The site currently has only a 129 × 199 px thumbnail.
- A photo of Linda and John together → \`assets/photos/authors.jpg\`.
- Caption for the “For Dad” dedication photo.
- Any photos of the real Chokoloskee, the boats, the airboat. Record each in \`docs/CREDITS.md\`.

## 12. Checklist before dropping files in

- [ ] PNG, transparent (except the three textures and the social image)
- [ ] No text, logos, borders, signatures
- [ ] Filename exactly matches the id, lower-case, \`.png\`
- [ ] Fish anatomy checked against the identification column
- [ ] Looks right next to one of Linda’s sketches at the same size
`);

writeFileSync(resolve(root, 'docs', 'VISUAL-BRIEF.md'), sections.join('\n'));
console.log(`✓ docs/VISUAL-BRIEF.md written (${fish.length + characters.length + wildlife.length + boats.length + gear.length + knots.length + places.length + chapters.length + 22} assets described)`);
