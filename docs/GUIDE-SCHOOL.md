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

## Ideas not built

- A fourth course on tides ("Pick the tide"), using the live Chokoloskee tide on `/tides/`.
- A Guide School certificate or a fourth badge when all three are finished, and syncing course progress with the purchase key.
- Labels on the boat picture in "Boat words" (tap a part to name it).
