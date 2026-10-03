# Escape to Lostman's River — Interactive Companion: Build Spec

**Book:** *Escape to Lostman's River* by John and Linda McKillop (Amazon KDP, 2023; paperback ISBN 9798374178890, hardcover 9798375928548, Kindle B0BVJ4XR65).
**Audience of this document:** a Claude Code session (or any developer) building the site from this repo.
**Status:** v1 spec. Everything in `/data` was extracted from the manuscript in `/source`; treat it as the content source of truth, and the manuscript as the fallback.

---

## 1. What we are building and why

A free, public companion website for a published middle-grade novel. The printed book will be reissued with QR codes (one per chapter plus one on the back cover) that open the matching page of this site. The site also serves as the book's marketing hub: it's what the author links to from the Amazon listing, outreach emails, and social posts.

The novel: fifteen-year-old Matt Creek spends the summer after his father's death as an assistant fishing guide in Chokoloskee, in the Ten Thousand Islands of the Florida Everglades. Fishing lore, a smuggling plot, a houseboat escape to Lostman's River, a legendary tarpon called Old Scarface, and a coming-of-age arc. Illustrated with pen sketches by the author's mother.

### Who uses it

1. **Kids 10–15 who fish** (the reader). Often reluctant readers. Phone in one hand, book in the other, scanning a QR mid-chapter. Needs: pictures, the map, "is that a real fish," fast.
2. **Parents and grandparents who bought the book as a gift** (the buyer). Reviews show grandparents reading it aloud. Needs: something to show the kid, discussion questions, confidence that it's wholesome.
3. **Adult anglers** who read it themselves. Needs: the tackle box, tides, real places, lures. Will judge accuracy.
4. **Teachers and librarians** (secondary). Needs: a printable guide and a clean "about the book" page.

Design for #1 first, #3 second. Never make it feel like a school assignment.

### The organizing conceit: the site is the Guidebook

In the novel, Matt's late father's *South Florida Fishing Guidebook* has blank note pages that Matt fills with sketches, tide charts, his summer to-do list, and finally his brothers' signatures. **The site is that Guidebook.** Sections are tabs in the book; Linda McKillop's sketches are "Matt's sketches in the margins"; the hand-drawn Lostman's River map is literally a page from it. Navigation language should follow: "Fish," "Charts," "Tackle Box," "Crew," "Critters," "Boats," "Matt's List," "Sketchbook," "Next Summer."

---

## 2. Scope and phases

### Phase 1 — MVP (ship this, print the QR codes)

| Page | Route | Content source |
|---|---|---|
| Home | `/` | Hero with the tarpon sketch; one-paragraph pitch; "Named one of Joelbooks' Top 8 Short Adventure Books for Teens"; three entry cards (Map, Fish, Crew); Buy on Amazon button; email signup. |
| Chapter pages (23) | `/ch/1` … `/ch/23` | `data/chapters.json`. Title, 2–4 sentence summary (NOT the chapter text), the chapter's sketch if any, then cards linking to every fish / place / critter / boat / gear item that appears, plus the chapter's word of the day and any quote. A "where we are" mini-map showing that chapter's route. Prev/next. **These are the QR landing pages.** |
| The Chart (map) | `/map` | `data/places.json` + `data/routes.json`. Full-screen Leaflet map with a chapter slider/stepper that draws each chapter's route and highlights its places. Clicking a marker opens a card with the `in_book` text and links. Toggle to overlay Linda's hand-drawn map (`lostmans-river-hand-map.png`) as a georeferenced image layer over the Lostman's River area. |
| Fish | `/fish` and `/fish/:id` | `data/fish.json`. Grid of species cards (sketch or placeholder silhouette), detail page with identify / typical size / habitat / how Matt fishes it / in the book / regulation note / chapters. |
| Crew (characters) | `/crew` and `/crew/:id` | `data/characters.json`. |
| Critters (wildlife) | `/critters` and `/critters/:id` | `data/wildlife.json`. |
| Boats | `/boats` and `/boats/:id` | `data/boats.json`. |
| Tackle Box | `/tackle` | `data/gear.json`. Glossary-style, grouped: Lures & bait / Line & rigging / Techniques / Reading the water / Boat & safety. Include an animated or static SVG rig diagram (main line → swivel → weight → leader → lure). |
| Matt's List | `/list` | `data/todo.json`. The summer to-do list as a checklist readers can tick (localStorage); shows which chapter Matt checked each item. A second blank list for the reader's own summer. |
| Sketchbook | `/sketchbook` | `data/sketches.json` + `/assets/sketches`. Gallery with lightbox; each sketch links to its chapter. Credit Linda McKillop on every image. |
| About / Next Summer | `/about` | The authors, the dedication photo (`for-dad-three-anglers.jpg`, caption TBD by author), the real Chokoloskee, buy links, the sequel teaser ("Next summer: the airboat, and the last dock at the Chokoloskee marina"), email signup. |
| 404 | — | "You got lost in the Ten Thousand Islands." Link to map. |

### Phase 2 — after the reprint ships

- Quotes wall (`data/quotes.json`) and Word-of-the-day feature on chapter pages (`data/glossary.json`).
- Teacher & book-club guide (`/guide`): discussion questions by chapter (grief, trust, Dan's secret, choosing to release Old Scarface, Doc's discharge), printable PDF.
- Recipes page (`data/recipes.json`).
- Printables: coloring pages from the sketches, fish-ID cards, blank Guidebook page.
- Conservation page: snook season, ghost nets, lionfish, gator poaching, links to FWC and Everglades National Park.
- Live tide widget for Chokoloskee (NOAA CO-OPS station 8725110 Naples or nearest Everglades station — verify) on the Tackle Box page.
- Audio: short Everglades soundscape clips; optional chapter read-aloud.

### Phase 3 — maybe

- "Ask Uncle Dan" chat grounded only in the book text (needs a backend; design guardrails first).
- Reader catch log with photo upload and shared map (needs backend + moderation).
- Quizzes / badges per chapter.

---

## 3. Tech stack

- **Astro** (static output) with vanilla TypeScript islands where interactivity is needed. Content collections read `/data/*.json` directly. No React unless a specific component needs it.
- **Leaflet** with OpenStreetMap or Esri Ocean/NatGeo basemap tiles (the Esri Oceans basemap looks right for a nautical feel; check the attribution/usage terms). Marker clustering not needed at this scale. Use `L.imageOverlay` for the hand-drawn map.
- **Hosting:** GitHub Pages from `main` via Actions (same pattern as the author's existing charity site). Custom domain via CNAME — domain TBD by author (suggestions: `lostmansriver.com`, `escapetolostmansriver.com`). Enforce HTTPS.
- **Short links for QR codes:** GitHub Pages has no server redirects, so the chapter pages themselves must be the QR targets at stable paths: `https://<domain>/ch/7/`. Never rename these routes once printed. If a redirect layer is wanted later, Cloudflare in front of Pages gives free redirect rules.
- **Email capture:** a simple form posting to Buttondown or Mailchimp (author to pick; stub with a config variable). No backend.
- **Analytics:** Plausible or GoatCounter (privacy-friendly, no cookie banner needed). Track QR landings by chapter via the path.
- **Images:** keep the original scans in `/assets/sketches` untouched; generate web sizes (800px, 1600px, WebP + PNG fallback) at build time with Astro's image pipeline. Lazy-load everything below the fold.
- **No** build-time dependence on any paid API. Everything must work as static files.

---

## 4. Design direction

Read `docs/DESIGN.md` for the full brief. Summary:

- **Feel:** a well-used field guide left in a boat. Paper, pen, salt, sun. Not a kids' cartoon site, not a corporate author site.
- **Palette:** off-white paper (`#f6f1e7`), ink (`#1f2a2e`), mangrove green (`#2f5d50`), Gulf teal (`#2a7f8e`), sunrise orange (`#e8873a`) as the single accent, oyster gray (`#b8b2a6`). Dark mode = night fishing: deep navy paper (`#121b22`), moonlight text, same accent.
- **Type:** a humanist serif for body (e.g. Source Serif 4 or Lora via Google Fonts), a hand-lettered or marker-style display face used *sparingly* for section titles to echo Linda's annotations on the hand-drawn map, and a monospace for tide tables / specs. Garamond-adjacent serif is fine; it matches the printed book.
- **Imagery rules:** the sketches are the art. Show them large, on paper-colored backgrounds, with generous whitespace, never cropped tight or stretched. Photos (Everglades, fish, boats) are supporting: use only images the author owns or public-domain / CC0 sources (NPS, USFWS, NOAA, Wikimedia Commons with license noted) and keep a credits page.
- **Layout:** phone-first; QR scans are phones. 16px gutters, no horizontal scroll, tap targets ≥ 44px. Chapter pages must load fast on a weak signal at a marina.
- **Motion:** minimal. Route drawing on the map, lightbox fades, nothing else.
- **Accessibility:** alt text on every sketch (from `data/sketches.json` subject), WCAG AA contrast in both modes, keyboard-navigable map controls, reduced-motion respected.

---

## 5. Data model

All in `/data`. IDs are kebab-case and are referenced across files; `chapters.json` is the hub.

- `chapters.json` — 23 entries: `n`, `slug`, `title`, `summary`, and arrays of `places`, `fish`, `wildlife`, `characters`, `boats`, `gear` IDs, `word_of_day` (glossary words), `sketch` (filename or null).
- `characters.json`, `fish.json`, `wildlife.json`, `boats.json`, `gear.json` — entity files with `id`, display fields, `chapters` (ints), `sketch`.
- `places.json` — `id`, `name`, `lat`, `lng`, `type`, `in_book`. **Coordinates are approximate and must be verified** (see §8).
- `routes.json` — per-chapter ordered `waypoints` (place IDs) and `mode` (`boat`/`road`/`air`) for the map stepper. Straight lines between waypoints are acceptable for v1; curve boat routes through water if time allows.
- `quotes.json`, `todo.json`, `glossary.json`, `recipes.json`, `sketches.json` — self-explanatory.

A validation script should fail the build if any chapter references an unknown ID. (One exists conceptually: every ID referenced in `chapters.json` and `routes.json` currently resolves.)

---

## 6. QR code spec (for the printed book)

- One code per chapter heading, target `https://<domain>/ch/<n>/`, plus one on the back cover and one on the copyright page targeting `/`.
- Generate at print resolution as vector (SVG/EPS) with error-correction level M, quiet zone ≥ 4 modules, printed size ≥ 0.75 in (19 mm). Print the short URL in small type beneath each code for readers without a scanner.
- Provide a script `scripts/make-qr.ts` (or Python with `segno`) that emits all 25 codes to `/qr/` from the domain in `site.config`.
- Chapter routes are a contract: once printed they never change.

---

## 7. Content rules

- Chapter pages summarize; they do not reproduce chapter text. Quotes are limited to the short lines in `quotes.json`.
- Every sketch and the photo carry the credit "Illustration © Linda McKillop" / "Photo courtesy of the McKillop family."
- Fish regulation notes must say "check current FWC rules" and link to https://myfwc.com/fishing/saltwater/recreational/ — never state a specific limit as current.
- The book is set in 1992 per its title page but includes a cell phone, Instagram, and Alexa; the site does not need to resolve this. Do not put a year on the site. (The author is deciding this for the reprint.)
- Tone: warm, a little funny, never cute. Dan would read it and nod.

---

## 8. Open items for the author (do not block the build; use placeholders)

1. **Domain name** — needed before QR generation.
2. **Verify coordinates** in `places.json`. Real places (Chokoloskee, Everglades City, Lostman's River, Pavilion Key, Rabbit Key, Comer Key, Indian Key, Sandfly Pass, Lopez River, Barron River, Crooked Creek, Shark River, Key Largo, Naples, Fort Lauderdale) can be checked against USGS GNIS / NOAA charts. Fictional or fictionalized spots (Dan's cottage, Doc's house, South Point post office, "Port of the Everglades Lodge") need the author to point at a spot on the map.
3. **Caption for the dedication photo** ("For Dad" — who are the three anglers?).
4. **Email provider** (Buttondown vs. Mailchimp) and list name.
5. **Any additional sketches** by Linda not in the manuscript; high-resolution scans of the existing eleven if available (current files are 900–1300 px).
6. **Photos** the family owns of the real places and boats, for the Boats and Critters pages.
7. Whether to include the Joelbooks mention and which review pull-quotes to show on the Home page (suggested: "If you love fishing, you'll be hooked… if you don't, you'll still love it!" and "The first time my son ever said he connected to the main character").

---

## 9. Build order

1. Scaffold Astro, load `/data` as content collections, write the validation script, set up GitHub Pages deploy. Confirm `/ch/1/` renders from JSON.
2. Design tokens + base layout + typography + dark mode. One chapter page looking right on a phone.
3. All 23 chapter pages with cross-link cards and prev/next.
4. Fish, Crew, Critters, Boats index + detail pages (one shared card/detail component).
5. Map page: markers, chapter stepper, route drawing, hand-drawn overlay toggle.
6. Tackle Box with rig diagram; Matt's List with localStorage.
7. Sketchbook gallery with lightbox; About page with signup form stub.
8. Home page last, once the components exist to compose it.
9. QR generation script; `/qr/` output; README on how to re-run after domain is set.
10. Lighthouse pass (target ≥ 95 performance/accessibility on chapter pages on mobile), link check, alt-text audit.

---

## 10. Acceptance criteria for Phase 1

- Every `/ch/<n>/` loads in under 2 s on a throttled 4G profile, renders the summary, sketch (if any), and working links to every referenced entity.
- Map stepper walks all 13 routes without console errors; hand-drawn overlay aligns with Lostman's River within reason.
- All 23 fish, 17 crew, 19 critters, 12 boats, 34 gear items render from JSON without hand-edited HTML.
- Every image has alt text and a credit.
- Site passes the link checker and builds with zero warnings in CI.
- No tracking cookies; no third-party scripts beyond fonts, tiles, and the analytics snippet.
