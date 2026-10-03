# CLAUDE.md — Escape to Lostman's River companion site

Read `SPEC.md` first, then `docs/DESIGN.md`. Those two files are the brief; this file is conventions.

## What this repo is
A static Astro site that is the interactive companion to the novel *Escape to Lostman's River*. The printed book will carry QR codes pointing at `/ch/<n>/`. Content lives in `/data/*.json` (already extracted from the manuscript in `/source`). Illustrations are in `/assets/sketches` and are by Linda McKillop; credit her on every use.

## Ground rules
- Content comes from `/data`. Do not hand-write entity content into components. If something is missing, add it to the JSON and cite the chapter in `/source/manuscript.txt`.
- Chapter routes `/ch/1/` … `/ch/23/` are a print contract. Never rename them.
- Never reproduce chapter text on the site; summaries and the short lines in `data/quotes.json` only.
- Do not state fish regulations as current facts; link to FWC.
- Phone-first. Test every page at 375px width before desktop.
- Images: originals in `/assets` are never modified in place; derive web sizes at build.
- Only CC0 / public-domain / author-owned photos. Record every photo source in `docs/CREDITS.md`.
- No paid APIs at build or runtime. No cookies. Analytics must be cookieless.
- Keep dependencies minimal: Astro, Leaflet, a lightbox, that's about it.

## Workflow
- `npm run validate` must pass (JSON cross-reference check) before `npm run build`. Write the validator in step 1 if it does not exist.
- Commit per build-order step in `SPEC.md §9`; small, descriptive commits.
- When a decision needs the author (domain, coordinates, photo captions — see `SPEC.md §8`), use a clearly marked placeholder and add a line to `docs/OPEN-ITEMS.md`; do not invent.

## Voice
Warm, plain, a little funny. The narrator of the book, not a marketing department. Uncle Dan would read the copy and nod.
