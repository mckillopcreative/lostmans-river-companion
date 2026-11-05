# How a manuscript became the Lostman's River companion experience

*Written 2026-11-05 for the Bourbon Brothers session, so the same build can be done for the Tasting Compass. Everything below is what actually exists in `C:\Users\mckil\Documents\Lostmans River Web Project\lostmans-river-companion` (Astro 7, static, GitHub Pages) plus a Cloudflare Worker in `worker/`. File paths are real; read them before copying.*

## 1. The idea in one paragraph

The book is the spine. Every chapter gets its own page with a fixed address (`/ch/<n>/`, printed as a QR code in the paperback), and that page shows the reader what is *in* that chapter, pulled from structured data, not from the prose: the places on a chart, the species, the gear, the people, a vocabulary word, a quote, a mission. The reader reads or hears the chapter, does its mission on screen, then a field mission off screen that a grown-up signs off, and after 23 chapters earns a printable license. The product is therefore "the book, expanded": text + narration + a per-chapter dashboard + missions + a printable journal + a credential, sold once for the household.

For Bourbon Brothers the same spine works with different nouns. See §9.

## 2. Pipeline, start to finish

```
source/manuscript.txt  (private, gitignored; the .docx exported to text)
   │
   ├─ by hand + Claude: entity extraction into data/*.json   (§3)
   ├─ scripts/extract-sample.mjs  → data/sample-ch01.json    (the free chapter, in the repo)
   ├─ scripts/export-text.mjs     → private/text/ch-NN.json  → R2 (the paid chapters, never in the repo)
   ├─ scripts/narrate.mjs         → public/audio/ch-01.mp3 (free) and R2 ch-02..23 (paid)   ElevenLabs, 1.1× rate
   └─ scripts/feature-fish.mjs    → chapters.json `star` (the species each chapter talks about most, by counting mentions)

data/*.json ─ scripts/validate.mjs (cross-reference check, runs before every build)
   │
   └─ Astro pages + components read data via src/lib/data.ts (typed maps: chapterByN, fishById, …)
         ├─ /ch/<n>/  chapter page: ChapterDash (the panel) + ChapterText (reader) + the chapter's cards
         ├─ /missions/<id>/  mission + "Do it for real" field task + Captain's sign-off
         ├─ /field-journal/  printable 30-page journal (locked without a key)
         ├─ /license/  printable license, filled from progress
         ├─ /app/  the hub (tiles) ; /start/ (where the purchase email lands) ; /restore/ ; /waitlist/
         └─ reference sections: /fish/, /crew/, /critters/, /places/, /map/, /tackle/, /knots/, /tides/, /games/

worker/ (Cloudflare Worker at api.lostmansriver.com)
   keys (KV), progress sync, Stripe webhook → key + welcome email, R2 audio/text streaming to key holders,
   waitlist + opening email, Meta Conversions API for purchases, admin: issue comp keys
```

Build: `npm run build` = validate → check-events → trim sketches → `astro build` → sitemap. Push to `main` deploys.

## 3. The data model (what was extracted from the manuscript)

All in `data/`. Each file is an array of objects with a stable `id`. Everything the site shows comes from here; nothing is hand-written in components (CLAUDE.md rule).

| File | One record is… | Key fields |
|---|---|---|
| `chapters.json` | a chapter | `n, slug, title, summary, places[], fish[], wildlife[], characters[], boats[], gear[], word_of_day[], sketch, star{kind,id}, tactic` |
| `places.json` | a real place with coordinates | `id, name, lat, lng, kind, in_book, chapters[]` |
| `routes.json` | the chapter's trip as waypoints | `chapter, label, mode (boat/road/air), waypoints[]` |
| `fish.json` / `wildlife.json` | a species | `id, common, scientific, typical_size, in_book, chapters[], art` |
| `characters.json` | a person | `id, name, description, chapters[]` |
| `boats.json`, `boat-types.json`, `gear.json` | things | `id, term/name, definition, chapters[]` |
| `glossary.json` | word of the day | `word, definition, chapter` |
| `quotes.json` | a short line from the book (never long text) | `text, who, chapter` |
| `todo.json` | Matt's summer list, ticked as the book goes | `text, chapter_added, chapter_checked` |
| `knots.json` | a skill with step drawings | `id, name, use, steps[], chapter` (+ `public/knots/<id>-<step>.svg`) |
| `missions.json` | one per chapter | `id, chapter, title, skill, type (choice/order/text/fish/place/decide/sign), prompt, options…, field{title, do, need, home?, log, adult}` |
| `audio.json` | narration minutes per chapter | `voice, rate, minutes{n: min}` |
| `sketches.json` | the illustrator's drawings | `file, caption, chapters[]` |

Rules that mattered: ids are kebab-case and never change; every cross-reference is validated; chapter summaries are the only prose in the repo (the manuscript stays private); regulations/facts link out rather than being asserted.

**How the extraction was done.** One pass per entity type over the manuscript with Claude, chapter by chapter, writing JSON and citing the chapter. Then `validate.mjs` was written first (SPEC §9 step 1) so every later addition had to resolve. Counting-based scripts (`feature-fish.mjs`) replaced judgment calls where possible.

## 4. The chapter page, the heart of it (`src/pages/ch/[n].astro`)

Order on the page, top to bottom:

1. **ChapterDash** (`src/components/ChapterDash.astro`): painted banner with the book's name, a green "Chapter n" ribbon, the title, a one-line *tactic*, then cards two across: **Chart & route** (MiniMap, Leaflet, the chapter's waypoints) · **Fish of the chapter** (`star`) · **Knot of the chapter** (or "Keep practising" with the latest one) · **Audio guide** · **Tide & bite window, today** (live NOAA curve with the rule drawn on) · chapter arrows. Modelled on a GPT mock the author liked; phone-first.
2. **ChapterText**: chapter 1 is the free sample from `sample-ch01.json`; chapters 2–23 are fetched from the Worker only when the device holds a key. "Read it as pages →" opens **PageReader** (full-screen, CSS multi-column one page wide, swipe/tap/arrow keys, page position remembered, narration bar inside).
3. Mission card → `/missions/m<nn>/`.
4. "What happens" summary, places list, the chapter's sketch, margin notes (word of the day, quotes), then cards for fish/crew/critters/boats, the tackle box, Matt's list.

## 5. Missions, field missions, journal, license (the "off the screen" half)

- `/missions/<id>/`: one interactive mission per chapter (types above), answered in the browser; progress saved in `localStorage` and synced to the Worker when a key exists (`src/scripts/progress.ts`: `{missions, field, badges, started}`).
- **Do it for real** card on the same page: `field.title/do/need/log` plus a **Captain's sign-off** (a grown-up taps "Signed off", a stamp appears; `signField(id)`).
- Badges at milestones; `/license/` prints the Assistant Fishing Guide license with name and badges.
- `/field-journal/`: a 30-page printable journal, one page per field mission plus cover/log pages; locked without a key except the first three pages.
- Hours: ~41k words ≈ 4 h reading, 238 min narration, 23 missions ≈ 2 h, 23 field missions ≈ 12–16 h. More than half the experience is off screen, which is the marketing claim.

## 6. Gate, keys and money (`worker/src/index.js`, `docs/GATE-SETUP.md`)

- Stripe Payment Link → webhook `checkout.session.completed` → Worker verifies the signature, issues a key (KV), emails a welcome with `/start/#<key>` and a QR.
- `/start/` stores the key in `localStorage` (`lr-key`), pulls progress, shows one button (Open Chapter 1 / Pick up at Chapter n).
- Key holders get: `/text/<key>/ch-NN.json` and `/audio/<key>/ch-NN.mp3` from R2, progress sync, the journal and the license. No accounts, no passwords; `/restore/` re-sends the link to the purchase email.
- Admin: `POST /admin/issue` with `x-admin-key` mints a comp key (reviewers, test families, the author).
- Pre-launch switch: `site.config.mjs` `checkout.open:false` sends every Buy button to `/waitlist/`; `open:true` opens the store. Waitlist → KV, signed unsubscribe link, `/admin/send-opening` mails the opening in batches.

## 7. Narration

`scripts/narrate.mjs` splits the manuscript into chapters, sends each to ElevenLabs (voice "Brian"), writes MP3s, records minutes in `audio.json`. Chapter 1 is public; the rest go to R2 and stream only to key holders. The player is the native `<audio>` with playback rate 1.1 and a remembered position per chapter.

## 8. Analytics, ads, privacy

- Cookieless: Cloudflare Web Analytics + a tiny `track(event, props)` to the Worker's Analytics Engine; events whitelisted in `src/lib/events.mjs` and checked at build.
- Meta: pixel only on the two grown-up pages (`/` and `/waitlist/`) and only for ad-click visits; purchases reported server-side (Conversions API) with the fbclid carried through Stripe's `client_reference_id`. No pixels on any page a child uses.
- Ad plan lives on an editable artifact page (`docs/ads-review.html`) with the creatives; campaigns are built from it on "build it".

## 9. Mapping it to Bourbon Brothers / the Tasting Compass

Same spine, different nouns. The parts that transfer directly: per-chapter pages with fixed addresses, the data model + validator, the chapter panel, missions with an off-screen "do it for real" half and a sign-off, a printable journal and a credential, the key gate, the pages reader with narration, the waitlist/opening flow.

| Lostman's River | Tasting Compass equivalent (suggestion) |
|---|---|
| chapter page `/ch/n/` | one page per chapter or per bourbon/distillery stop |
| chart & route (places with coordinates) | the Bourbon Trail map: distilleries, towns, the route in the book |
| fish of the chapter | the bourbon (or distillery) of the chapter: name, proof, mash bill, a line from the book |
| knot of the chapter (a skill with step drawings) | a tasting skill: the nose, the Kentucky chew, reading the legs, the "compass" points (sweet/oak/spice/fruit) |
| tide & bite window (live data) | something live and local: distillery hours/tours today, weather at the next stop, or the "pour window" (a timer for airing a glass) |
| mission (on screen) | a tasting quiz: pick the note, order the steps, name the bourbon from the description |
| field mission + Captain's sign-off | a real tasting with a friend, logged on paper, signed by the "Brother" you tasted with |
| Field Journal (printable) | the Tasting Journal: one page per bourbon with the compass to fill in |
| Assistant Fishing Guide license | Tasting Compass certificate, with badges |
| audio guide | narration, if the book is narrated; otherwise skip |
| knots.json / missions.json | tastings.json / missions.json, same shapes |

Honest cautions from this build: the chapter panel only works once the data is complete and validated, so do the JSON first; keep the manuscript out of the repo and the public site; the field half is what makes it worth the price, so write the real-world tasks before the screens; and "no child pages carry ad pixels" has an adult-product mirror here (age gate on the public pages; no tracking inside the experience).
