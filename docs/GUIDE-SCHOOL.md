# Guide School

*Added 2026-11-15 at John's request: named, specific courses in place of the vague "challenges", as a selling point for the Experience.*

## What it is

| Course | Where | Content | Free taste | Data |
|---|---|---|---|---|
| **Rig It Right** | `/guide-school/rig-it-right/` | 18 "which rig?" scenarios in three levels (Deckhand, Mate, Guide), the seven rules of rigging, and the Rig Locker (8 rigs) | Deckhand level (6 scenarios) and the Rig Locker | `data/rigs.json` |
| **Learn the Boat** | `/guide-school/learn-the-boat/` | 10 lessons, each a picture, five to seven things to know, a guide's rule and three questions | Lessons 1 and 2; every lesson's picture and opening line | `data/boat-school.json` |
| **Fish of the Everglades** | `/games/fish-id/` | The Fish ID game under its course name: 23 plates, three levels | All of it | `data/fish.json` |

The hub is `/guide-school/`. It is on the app home (three tiles), in the offer card ("Guide School: three courses") and in a strip above the offer card on the landing page.

## How the paid part works

Same as the missions: the content is in the page, and the page shows it only when the device holds a purchase key (`html.has-key`). The lock panel is `src/components/SchoolLock.astro`. Scores and passed lessons stay on the device (`rig-best:<level>`, `lr-boat` in localStorage); they are not synced.

## Content rules

- The rigs are "what most guides reach for first", and the page says so. A scenario may name a second rig that also works (`also`).
- No regulations as fact. Rig It Right links to FWC for sizes, seasons and bag limits; Learn the Boat ends with links to FWC's boating safety courses and the National Park Service's Everglades boater course.
- Learn the Boat is written for crew learning beside an adult captain. Anything that differs by boat or engine says to follow the manual and the captain.
- Book ties (the small "In the book" lines and chapter pills) come from `data/gear.json` and `data/missions.json`. Check them there before adding one.
- `npm run validate` checks that every scenario's rigs exist and every lesson has three answerable questions.

## Pictures

Made by Codex on John's ChatGPT plan, 2026-11-15:

```
node scripts/genbatch.mjs scripts/art-batches/guide-school.json 2
node scripts/import-art.mjs private/art-pack/assets/art
```

The prompts are in `scripts/art-batches/guide-school.json`. The PNG originals stay in `private/art-pack/` (not in the repo); the WebP masters are in `assets/art/rigs/`, `assets/art/boat-school/` and `assets/art/tiles/`. To redo one picture, delete its PNG and run the two commands again. The popping cork is the existing `assets/art/tackle/popping-cork.webp`.

## Analytics

`rig_finish` (label = level, value = score) and `boat_lesson` (label = lesson id, first pass only). Hub and landing taps are `tile_click` / `landing_click` with a `school-…` label.

## Matt's Fishing Journal (the printable field guide)

*Added 2026-11-15, John's idea and title: "Matt's Fishing Journal: an essential guide to catching the big one".*

`/fishing-journal/` is a ten-chapter field guide read on screen or printed (the print button opens the browser's print window; "Save as PDF" makes the PDF). About 20 letter pages.

| Chapter | Comes from |
|---|---|
| 1 Know your fish | `data/fish.json` (tell-tale, where it lives, how Matt fishes it) |
| 2 Keeper or release? | `data/fishing-journal.json`: how to measure, a rules table the reader fills in from FWC, releasing a fish |
| 3 Find the spot | `fishing-journal.json`: six kinds of spot, six signs of fish, the tide |
| 4 Rig it right | `data/rigs.json` |
| 5 Five knots | `data/knots.json` |
| 6 Set the hook, land the fish | `fishing-journal.json` |
| 7 On the boat, and running aground | `data/boat-school.json` (each lesson's rule; the aground lesson) |
| 8 The pack list | `fishing-journal.json` |
| 9 End of the day | `fishing-journal.json` |
| 10 The big one | `fishing-journal.json` (a fill-in record page) |

- **No sizes, seasons, bag limits or licence rules are printed.** `npm run validate` fails if a size appears in the Keeper chapter. The reader writes today's rule in the table.
- Without a key: the cover, the contents and chapter 1. The rest and the print button need the key (same client-side gate as the Field Journal).
- The opening note is written in Matt's voice and signed "Matt". It is new writing, not a line from the novel.
- Print check: on the dev server only, `/fishing-journal/?unlocked` opens every chapter without a key. `chrome --headless=new --print-to-pdf=out.pdf http://127.0.0.1:4321/fishing-journal/?unlocked` makes a test PDF. Each chapter is tuned to end on a whole sheet; if copy grows, measure again.
- It is not the Field Journal (`/field-journal/`), which is the fill-in workbook for the 23 field missions.
- Pictures: `scripts/art-batches/fishing-journal.json` (cover, keeper, spots, landing, big-one) into `assets/art/journal/`; the app-home tile is a band cut from the cover.
- Analytics: `guide_print`.

## Ideas not built

- A fourth course on tides ("Pick the tide"), using the live Chokoloskee tide on `/tides/`.
- A Guide School certificate or a fourth badge when all three are finished, and syncing course progress with the purchase key.
- Labels on the boat picture in "Boat words" (tap a part to name it).
