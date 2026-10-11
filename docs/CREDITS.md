# Credits and sources

Every image and third-party resource used on the site, with its license. Keep this current (CLAUDE.md).

## Illustrations
| File | Subject | Artist | License |
|---|---|---|---|
| assets/sketches/*.png (11 files) | See data/sketches.json | Linda McKillop | © Linda McKillop, used with permission |

## Field-guide art (assets/art, 183 files)
| Folder | Count | Source | License / notes |
|---|---|---|---|
| fish, crew, critters, boats, tackle, places, chapters, emblems | 183 | Generated 2026-10 with OpenAI's image tool from docs/VISUAL-BRIEF.md; 14 corrections applied by the author | Author-directed generated work, separate from Linda McKillop's originals. Stored as 1600 px WebP web masters (scripts/import-art.mjs); the 2048 px PNG originals stay in the author's pack outside the repo. Knot diagrams are drafts pending an angler's review. `grouper` depicts a goliath; `mako-shark` is drawn as a bull shark per the brief. |

## Photographs
| File | Subject | Source | License |
|---|---|---|---|
| assets/photos/for-dad-three-anglers.jpg | Dedication photo ("For Dad") | McKillop family | © McKillop family, used with permission |

No other photographs are used yet. When adding Everglades / fish / boat photos, use only author-owned, public-domain (NPS, USFWS, NOAA) or CC0 images and record each one here.

## Map
- Tiles and data: © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors, ODbL. Standard tile server; usage is light and attributed per the [tile usage policy](https://operations.osmfoundation.org/policies/tiles/).
- Library: [Leaflet](https://leafletjs.com) 1.9, BSD-2-Clause.
- Hand-drawn Lostman's River overlay: Linda McKillop (above). Georeference bounds are approximate.

## Type
- [Source Serif 4](https://github.com/adobe-fonts/source-serif) — Adobe, SIL OFL 1.1. Self-hosted at build via Astro's fonts API.
- [Caveat](https://fonts.google.com/specimen/Caveat) — Pablo Impallari, SIL OFL 1.1. Self-hosted at build.

## Code
- [Astro](https://astro.build) (MIT), [sharp](https://sharp.pixelplumbing.com) (Apache-2.0), [qrcode](https://github.com/soldair/node-qrcode) (MIT).

## Natural-history facts
Species notes in `data/fish.json` and `data/wildlife.json` were written for this site from public information published by the Florida Fish and Wildlife Conservation Commission and the National Park Service. Regulations are never stated as current; the site links to FWC instead.
