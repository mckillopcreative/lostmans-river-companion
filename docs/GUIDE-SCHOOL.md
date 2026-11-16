# Guide School

*Added 2026-11-15 at John's request: named, specific courses in place of the vague "challenges", as a selling point for the Experience.*

## What it is

| Course | Where | Content | Free taste | Data |
|---|---|---|---|---|
| **Rig It Right** | `/guide-school/rig-it-right/` | 18 "which rig?" scenarios in three levels (Deckhand, Mate, Guide), the seven rules of rigging, and the Rig Locker (8 rigs) | Deckhand level (6 scenarios) and the Rig Locker | `data/rigs.json` |
| **Learn the Boat** | `/guide-school/learn-the-boat/` | 10 lessons, each a picture, five to seven things to know, a guide's rule and three questions | Lessons 1 and 2; every lesson's picture and opening line | `data/boat-school.json` |
| **Keeper or Release?** (2026-11-16) | `/guide-school/keeper-or-release/` | A fish on a measuring board and a practice rule card: keep it or let it go. Three levels (smallest size; slots; the whole card with a season line and a limit), eight fish a round | Deckhand level | `data/keeper-game.json` |
| **Fish of the Everglades** | `/games/fish-id/` | The Fish ID game under its course name: 23 plates, three levels | All of it | `data/fish.json` |

The hub is `/guide-school/`. It is on the app home (a tile per course), in the offer card ("Guide School: four courses") and in a strip above the offer card on the landing page.

## How the paid part works

Same as the missions: the content is in the page, and the page shows it only when the device holds a purchase key (`html.has-key`). The lock panel is `src/components/SchoolLock.astro`. Scores and passed lessons stay on the device (`rig-best:<level>`, `lr-boat` in localStorage); they are not synced.

## Content rules

- The rigs are "what most guides reach for first", and the page says so. A scenario may name a second rig that also works (`also`).
- No regulations as fact. Rig It Right links to FWC for sizes, seasons and bag limits; Learn the Boat ends with links to FWC's boating safety courses and the National Park Service's Everglades boater course.
- Learn the Boat is written for crew learning beside an adult captain. Anything that differs by boat or engine says to follow the manual and the captain.
- Book ties (the small "In the book" lines and chapter pills) come from `data/gear.json` and `data/missions.json`. Check them there before adding one.
- `npm run validate` checks that every scenario's rigs exist and every lesson has three answerable questions.
- **Keeper or Release? never shows a real rule.** Every card is dealt at random by the page (`deal()`), is headed "Practice card · not the real rule", and the page says so again under the board. `min` and `max` in `data/keeper-game.json` are only how long a fish may be drawn; lengths never land exactly on a line. The fish is laid on the ruler from its plate's transparent outline, measured at build time (`box()`).

## Pictures

Made by Codex on John's ChatGPT plan, 2026-11-15:

```
node scripts/genbatch.mjs scripts/art-batches/guide-school.json 2
node scripts/import-art.mjs private/art-pack/assets/art
```

The prompts are in `scripts/art-batches/guide-school.json`. The PNG originals stay in `private/art-pack/` (not in the repo); the WebP masters are in `assets/art/rigs/`, `assets/art/boat-school/` and `assets/art/tiles/`. To redo one picture, delete its PNG and run the two commands again. The popping cork is the existing `assets/art/tackle/popping-cork.webp`.

## Analytics

`rig_finish` and `keeper_finish` (label = level, value = score) and `boat_lesson` (label = lesson id, first pass only). Hub and landing taps are `tile_click` / `landing_click` with a `school-…` label.

## Matt's Fishing Journal (the printable field guide)

*Added 2026-11-15, John's idea and title: "Matt's Fishing Journal: an essential guide to catching the big one".*

`/fishing-journal/` is a ten-chapter field guide read on screen, printed, or downloaded as a ready-made PDF. About 20 letter pages.

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
- Analytics: `guide_print`, `guide_pdf`.
- **The ready-made PDF (2026-11-16).** `node scripts/journal-pdf.mjs` prints the LIVE page with headless Chrome (real fonts; a placeholder key opens the client-side lock, the API and analytics hosts are blocked) into `private/pdf/matts-fishing-journal.pdf`; add `--shots` for a picture of each section. Upload it from `worker/` with `wrangler r2 object put lostmans-audio/guide/matts-fishing-journal.pdf --file ../private/pdf/matts-fishing-journal.pdf --content-type application/pdf --remote`. The Worker serves it to key holders at `/guide/<key>/matts-fishing-journal.pdf`; the journal page shows "Get the PDF" on a device with a key, and the welcome email links to it. **Re-run and re-upload after any change to the journal**, or the PDF goes stale.

## The Assistant Fishing Guide Training Manual (audio)

*Added 2026-11-16, John's idea: an audio companion that turns everything above into a listening course. His choices: the book's narrator speaks straight to the listener as a trainee and quotes Uncle Dan's rules; the same ElevenLabs voice (Brian).*

`/training-manual/` is fifteen lessons of about four minutes, each ending in three spoken questions with a two-second pause before the answer (none in the last lesson).

- Scripts: `data/manual/<id>.txt`, plain paragraphs, written for the ear. `[pause]` is the silence after a question. Order, titles and the "then do it" link are in `data/manual.json`.
- **Quotes** in curly quotation marks are word for word from `data/quotes.json`; anything else about the book is paraphrase and was checked against the data. No sizes, seasons or limits are spoken (the Keeper lesson says so out loud). The listener is crew beside a grown-up captain throughout.
- Words a voice can misread were avoided on purpose: no "lead" (the metal), no "wind" (to reel), "gunnels" not "gunwales", "F W C" spelled out.
- Audio: `OPENAI_KEY_FILE=<file with ELEVENLABS_API_KEY> TTS_ENGINE=elevenlabs node scripts/narrate.mjs manual all` (about 55,000 characters), then `node scripts/manual-publish.mjs --upload`: lesson 1 becomes `public/audio/tm-01.mp3` (committed, free to hear), lessons 2 to 15 go to R2 as `tm-NN.mp3` and stream from the Worker to key holders, and the minutes are written to `data/audio.json` (`manual`). `node scripts/silences.mjs <segment.mp3>` confirms the pauses came out silent.
- Changing a script means narrating that lesson again (`manual <n>`; unchanged segments are NOT reused within a lesson once its text shifts) and publishing again.
- The player: one audio element, a lesson list, 1.1x like the book, position remembered per lesson, rolls on to the next lesson, lock-screen controls (Media Session), "heard" marks kept on the device (`lr-manual`). The read-along text of lessons 2 to 15 is in the page, shown only with a key.
- Analytics: `manual_play`, `manual_done` (label = lesson number).

## Ideas not built

- A course on tides ("Pick the tide"), using the live Chokoloskee tide on `/tides/`.
- Knot School as a course: the five knots with a "tied it" check-off.
- A Guide School certificate or a fourth badge when every course is finished, and syncing course and manual progress with the purchase key.
- The Training Manual as a private podcast feed, so it plays in a podcast app.
- Labels on the boat picture in "Boat words" (tap a part to name it).
