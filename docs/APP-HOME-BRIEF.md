# The Lostman's River Experience — app home

*Design brief and GPT tile directions, 2026-10-13. Built at `/app/`. GPT delivered all 18 tiles plus a Types-of-boats tile on 2026-10-13 (pack kept at `../assets/GPT assets/Lostmans_River_Oct13/`); they are installed as WebP in `assets/art/tiles/`. Still open from §5: `app-hero.png` and `license-blank.png`. From §9: only jon-boat, flats-skiff, bay-boat and deep-v arrived; the other 13 boat-type slots and `boat-types-hero.png` are still wanted.*

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


## 9. Visual build request: Types of boats (added 2026-10-13)

A new free section at `/boats/types/` teaches the real-life boats of the Ten Thousand Islands, cross-referenced to the boats in the book. One picture per entry. Save each as **`assets/art/boat-types/<id>.png`**; the page picks them up automatically (a line-drawing placeholder shows until then).

> **Style:** the same pen-and-ink line and loose watercolor wash as the fish plates and place scenes, soft daylight from upper left, muted palette (paper #f6f1e7, ink #1f2a2e, mangrove #2f5d50, gulf #2a7f8e, sky #6ab8e8, seafoam #cfeacb, one warm accent #e8873a). **Landscape 3:2, 2048 × 1365, filled edge to edge** (these are card images, not cut-outs), no text, no logos, no people unless the subject says a guide or hands. Boats must be mechanically right: an outboard has its propeller below the transom, an airboat has a caged propeller above the stern and nothing below the hull, a jet drive has no propeller, a poling skiff is low and flat with a stern platform.

| id | Name | Group | What to paint |
|---|---|---|---|
| `jon-boat` | Jon boat (flat-bottom) | Hulls | A 14-foot aluminum jon boat, flat bottom, three bench seats, a small tiller outboard, tied to mangrove roots on a tea-colored creek. |
| `flats-skiff` | Flats skiff (technical poling skiff) | Hulls | A pale-green poling skiff at rest on glassy flats, a guide on the stern platform leaning on a long push pole, an empty casting deck forward, seagrass visible through the water. |
| `bay-boat` | Bay boat (center console) | Hulls | A classic Mako-style center console bay boat, white hull, running across a bay at sunrise with a light wake, rods in holders, no people. |
| `deep-v` | Deep-V offshore boat | Hulls | A 22-foot deep-V center console offshore boat cutting through Gulf chop, bow lifting, twin outboards, dark water, no people. |
| `houseboat` | Houseboat | Hulls | A weathered small houseboat, cabin with square windows and a covered rear deck, anchored in a mangrove-lined river at dusk, a skiff tied alongside, no people. |
| `airboat` | Airboat | Hulls | A fire-engine-red airboat with a white bow and a caged propeller, parked on a sawgrass flat with water and sky behind, slight rust, no people. |
| `jet-boat` | Jet boat (jet drive) | Hulls | A dark, low jet-drive powerboat at speed in a shallow bay throwing a rooster tail of spray, the water behind it churned to mud, no people. |
| `fishing-kayak` | Fishing kayak | Hulls | A wide olive-green sit-on-top fishing kayak with a pedal drive, two rod holders behind the seat and a milk crate in the tank well, nosed into a mangrove tunnel, a rod across the deck, dappled light on dark water, no people. |
| `canoe` | Canoe | Hulls | An aluminum canoe pulled up on a shell beach on a small key, two paddles across the thwarts, dry bags inside, mangroves and open water beyond, no people. |
| `outboard` | Outboard motor | Power | A modern four-stroke outboard motor tilted up on a boat's transom, propeller clear of the water, barnacled dock piling behind, cutaway not needed. |
| `trolling-motor` | Trolling motor | Power | A bow-mounted electric trolling motor deployed off the front of a skiff, foot pedal on the deck, calm water, no people. |
| `push-pole` | Push pole | Power | A long graphite push pole with a forked foot, resting across the stern platform of a skiff, the foot close to the viewer, shallow water beyond. |
| `inboard` | Inboard and sterndrive | Power | The stern of a houseboat with a sterndrive unit visible at the waterline, dock lines, mangroves behind, no people. |
| `kayak-setup` | How a fishing kayak is rigged | Gear and words | Top-down view of a rigged fishing kayak on calm water: raised seat, rod holders with two rods, a milk crate with tackle boxes, a paddle leashed alongside, an anchor trolley line along one side, a net and pliers on the deck, no people, no text. |
| `shallow-anchor` | Shallow-water anchors and stakes | Gear and words | A skiff held still on a flat by a stake-out pole pushed into the sand off the stern, light chop, no people. |
| `safety-kit` | What every boat carries | Gear and words | A flat lay on a boat deck: an orange life jacket, a handheld VHF radio, a whistle, a small fire extinguisher, a folded chart, and an anchor, ink and watercolor. |
| `hull-words` | Boat words worth knowing | Gear and words | A simple labeled-free ink diagram of a center console boat seen from above and from the side, with small arrows at bow, stern, both sides and the transom, no text. |

**Also:** `boat-types-hero.png` (2048 × 1024): the Chokoloskee marina at first light with four boats side by side at the dock, a poling skiff, a center console, a jon boat and a kayak on the beach, a houseboat anchored beyond; bottom third calm water for a title.
