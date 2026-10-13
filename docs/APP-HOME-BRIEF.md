# The Lostman's River Experience — app home

*Design brief and GPT tile directions, 2026-10-13. A first build of this page is at `/app/` using the section emblems as stand-ins; drop tile art into `assets/art/tiles/<tile-id>.png` and it replaces them.*

## 1. The idea in one line

**You are the assistant fishing guide this summer, the same job Matt Creek had.** Everything on the home screen is something a guide's apprentice would open: the book, the chart, the tackle box, the fish, the crew, the missions Dan sets, and at the end, your license.

## 2. The funnel this page sits in

```
ad (Facebook / Instagram / Google)            "A summer in the Everglades, read aloud. 15+ hours of adventure."
  → landing page  lostmansriver.com           the journal page: hear Chapter 1, see the art, buy
    → checkout     Lemon Squeezy / Payhip      edition $24.99 · gift bundle · classroom
      → the app    lostmansriver.com/app/     THIS PAGE: the tile grid, your progress, everything unlocked
```

The app page is also the thing the buyer comes back to every day, so it must answer "what should I do next" in one glance, with almost no reading.

## 3. The screen, top to bottom

1. **Welcome strip** (short): "You're the assistant guide this summer." Three pills: missions done, badges, the chapter you're on. A one-line player: "Start listening: Chapter 1." No paragraphs.
2. **The tile grid**: the whole product as pictures. Two columns on a phone, four on a tablet, six on a desktop. The first tile is double size. Labels are one to three words; a tiny mono sub-line carries a count ("23 species"). Tiles not built yet carry a small hand-lettered "soon."
3. **The authors card**: the photo of John and Linda in a ring, the headline, three sentences. This is the trust moment and the mother-son story.
4. Footer as on the rest of the site.

Behaviours: tiles fade up on scroll like the rest of the site; a tile with progress shows a thin orange bar along its bottom edge; the "next thing to do" tile gets a subtle pulse once.

## 4. The tiles

| id | Label | Sub-line | Size | What the picture is | Status |
|---|---|---|---|---|---|
| read | Read the book | 23 chapters | big (2×2) | the Guidebook lying open on a boat seat, a pencil in the gutter, mangrove water beyond | exists (chapter pages) |
| listen | Listen to the book | Chapter 1 ready | wide (2×1) | a pair of worn headphones hanging on a rod holder, the Guidebook beneath | exists (ch. 1) |
| missions | Your summer | 23 missions · 3 badges | tall (1×2) | a blank Assistant Guide license card, the three badge stamps beside it, one inked | to build |
| chart | The Chart | | 1×1 | the folded chart with dividers and a pencil route | exists |
| fish | Fish | 23 species | 1×1 | a snook plate, side view, as the field guide shows it | exists |
| crew | Crew | | 1×1 | Dan's captain's cap on a dock post | exists |
| critters | Critters | | 1×1 | a brown pelican on a piling | exists |
| boats | Boats | | 1×1 | the Mako bow-on, throwing a little spray | exists |
| tackle | Tackle Box | | 1×1 | the open tackle box, popping cork on top | exists |
| knots | Knots | five to master | 1×1 | a length of mono mid-knot around a hook, two hands | to build |
| fish-id | Fish ID game | | 1×1 | three fish silhouettes with one lit up, a question mark drawn in ink | to build |
| chart-puzzles | Chart puzzles | plot the routes | 1×1 | the chart with a dotted route and a pin being placed by a hand | to build |
| tides | Tides | today at Chokoloskee | 1×1 | a tide pole on an oyster bar at half tide, sun low | to build |
| places | Places | 29 painted | wide (2×1) | Lostman's River mouth from the water, the painted-scene style | exists |
| list | Matt's List | 18 items | 1×1 | the to-do list page in the Guidebook with two ticks | exists |
| sketchbook | Sketchbook | | 1×1 | Linda's pen and ink bottle on a sketch | exists |
| printables | Printables | cards · coloring · license | 1×1 | a fan of fish cards and a coloring page | to build |
| catch-log | Catch log | your own | 1×1 | a tape measure across a redfish on a cooler lid | to build |

## 5. Directions for GPT (tile art)

Paste this section to GPT with the fish and crew plates from the earlier pack as style references.

> **Style.** Same hand as the Lostman's River field-guide art: pen-and-ink line with loose watercolor wash, visible paper grain, soft daylight from upper left. Palette: cream paper #f6f1e7, ink #1f2a2e, mangrove #2f5d50, gulf #2a7f8e, sky #6ab8e8, seafoam #cfeacb, one warm accent #e8873a. Muted, never neon.
>
> **Format.** These are *tiles*, not plates: the picture fills the whole frame edge to edge (no transparent background, no vignette, no border). Compose with the **bottom 25 percent quiet** (water, sand, paper) because a label sits there. No text, no lettering, no logos. Square **1024 × 1024** unless the table says wide (**2048 × 1024**) or tall (**1024 × 2048**); the big tile is square at 2048 × 2048.
>
> **Subject per tile:** use the "What the picture is" column above, one subject, centered or slightly left, close enough to read at 150 px wide on a phone. No people's faces (hands and backs are fine). Fish must match their species plates.
>
> **File names:** exactly the id in the table, lower-case, `.png`, saved to `assets/art/tiles/`.
>
> **Also make:** `app-hero.png` (2048 × 1024): the view from the Mako's console at sunrise heading out of Chokoloskee Bay, a rod tip in the lower right, the bottom third calm water for text; and `license-blank.png` (2048 × 1365): the Assistant Guide license as a printable certificate, blank name line, the three badge circles empty, ink and one wash, print-safe.

## 6. "Hours of imagination time" (the number for the ad)

Honest tally for one reader, counting each activity once:

| Activity | Basis | Hours |
|---|---|---|
| Reading the novel | 41,000 words at a young reader's 140 wpm | 4.9 |
| Listening instead of reading (not additive) | 4.6 h of narration | — |
| Re-listening while browsing the chart and fish | half the book, typical | 2.3 |
| 23 missions | 8–12 minutes each | 3.8 |
| Fish ID, right-lure, keeper-or-release games | three games, several rounds | 1.5 |
| Chart puzzles: 13 routes, name-that-key, find the Sea Belle, dead reckoning | | 2.0 |
| Knot trainer, five knots, with rope in hand | 15 min each plus practice | 1.5 |
| Tides, today's window, checked across a week | | 0.5 |
| Printables: coloring pages, fish cards, the license | | 3.0 |
| Reading the field guide for its own sake | 29 places, 23 fish, 19 critters, 12 boats | 1.5 |
| **Total** | | **≈ 21 hours** |

Ad-safe claims: **"15+ hours of adventure"** (conservative, leaves out re-listening and printables) or **"a summer's worth of adventures."** Do not claim more than 20 without the printables being real. Puzzle sellers advertise "45 min to 3 hours per game"; our single product is a full summer by comparison, which is the point of the comparison.

## 7. The authors card (copy, approved draft)

**Built by a son and his mother, children's-book co-authors.**

John is an MD, a children's novelist, and a father of four. Years ago he wrote *Escape to Lostman's River* with his mom, Linda, who drew every picture in it. The Lostman's River Experience is what came after: a way for kids to step into the Florida Everglades through an immersive story adventure that blends the novel with real-life angling skills, puzzles, and the places where it all happens.

(Optional second line for the ad: *Two generations of one family's fishing summers in the Everglades, written down.*)

## 8. Build order from here

1. `/app/` tile page with emblem stand-ins — **done**.
2. Author photo and card — **done** (`assets/photos/authors.jpg`).
3. GPT tile art → drop in, no code.
4. Missions page and badge progress (local first, then account-bound after the gate).
5. Knots trainer, Fish ID, chart puzzles, tides — one each, in that order.
6. Gate + checkout, then `/app/` becomes the post-purchase home and `/` the landing page.
