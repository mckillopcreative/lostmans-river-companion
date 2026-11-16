# Wild Florida

*Added 2026-11-16, John's idea: a game that teaches a reader, age 10 to teens, to name the major animals of Florida, with Uncle Dan as the guide. His decisions: Uncle Dan speaks in the book narrator's voice; Codex paints the plates; keep it simple (the major animals, not every sub-species); filters by kind of animal and by part of Florida.*

`/wild-florida/` · data `data/wild.json` · page `src/pages/wild-florida/index.astro`

## What is in it

119 animals: 40 fish, 19 sharks and rays (15 sharks), 25 reptiles (alligator, crocodile, 17 snakes, turtles, lizards), 22 birds, 13 mammals and shellfish. John asked for plenty of snakes and sharks, because children like those. Each has:

| Field | Use |
|---|---|
| `tell` | The one tell-tale, shown on screen and used as the clue in "Read the clue". It does not name the animal outright. |
| `dan` | Uncle Dan's line, shown and spoken (`public/audio/wild/<id>.mp3`). |
| `like` | Look-alikes, for "Tell them apart" and as the wrong answers in quizzes. |
| `type`, `regions` | The two filters. |
| `starter` | The free set (14). Everything else needs a purchase key. |
| `book` | A tie to the novel, taken from `fish.json` / `wildlife.json`. |
| `art`, `draw` | The plate, and what the painter was asked for. |
| `more` | Close-up plates with a caption, for a tell-tale one picture cannot show (John: "the distinguishability has to be able to be told by the image or images; could have several when needed"). The alligator's and crocodile's snouts from above, the coral snake's and scarlet kingsnake's bands and nose, a dolphin's fin beside a shark's, the snowy egret's feet. Shown on the Meet card and after a quiz answer. |

## How it teaches

Built on what the research on learning to tell categories apart supports:

- **One tell-tale per animal.** A learner needs the feature that separates this animal from its neighbours, not a full description.
- **Look-alikes side by side.** "Tell them apart" puts two similar animals next to each other; seeing them together is what makes the difference visible.
- **Mixed, not blocked.** Quizzes mix similar animals instead of drilling one kind at a time (interleaving beats blocking for look-alike categories, even though blocking feels easier).
- **Testing is the practice.** Most of the time is spent answering, with the tell-tale and Dan's line shown after each answer.
- **What you miss comes back.** Each animal sits in a box from 0 to 4 on the device. A right answer moves it up one, a miss down one; lower boxes are asked more often. Box 3 or higher counts as "known on sight".
- **A visible finish line.** Ranks (Deckhand at 10 known, Mate 30, Guide 60, Captain 100), a logbook grid, a test that needs 8 in 10, and a certificate to print from Deckhand up. The name typed on the certificate stays on the device.

Six ways to play: Meet them, Tell them apart, Name it, Read the clue, Speed round (60 seconds), The test.

## Rules for the content

- **Accuracy first.** A wrong plate teaches a wrong answer. Check every new plate against its `tell` before it ships. The two that matter most: the coral snake (red touches yellow, black nose) and the scarlet kingsnake (red touches black, red nose).
- **Safety.** Nothing invites a child to approach, handle or feed an animal. Venomous snakes are described so a child keeps away; the page says to leave every snake alone.
- **No regulations.** No sizes, seasons, limits or "it is illegal to". General conservation facts are fine.
- **Uncle Dan's lines are new writing in his voice.** Anything he says about Matt, Snapper or the dock pelicans must come from the book's data. No new stories about the characters without John and Linda.
- An animal whose plate is missing is left out of the game by the page, so plates can arrive in batches.

## Making the pictures

```
node scripts/wild-batch.mjs   # builds scripts/art-batches/wild.json from the `draw` fields
node scripts/genbatch.mjs scripts/art-batches/wild.json 2
node scripts/import-art.mjs private/art-pack/assets/art
node scripts/wild-trim.mjs
```

Plates are transparent PNGs in the fish plates' style, about 90 seconds each on John's ChatGPT plan. `wild-trim.mjs` cuts the empty margin so a long animal (an alligator, a gar) fills its card; it remembers what it has trimmed. To redo one plate, delete its PNG in `private/art-pack/assets/art/wild/` and run the three commands again. The 23 fish that were already in the book use their existing plates in `assets/art/fish/`.

## Making the voice

```
OPENAI_KEY_FILE=<file with ELEVENLABS_API_KEY> TTS_ENGINE=elevenlabs node scripts/wild-voice.mjs
```

One clip per animal plus `intro.mp3`, about 16,000 characters in all. A line is recorded again only when its text changes (`public/audio/wild/lines.json`). The clips are small and are committed.

## Not decided yet

- **How it is sold.** For now it is part of the Experience with the starter set free. John also raised a paid add-on at checkout and a stand-alone gift; both need a Stripe product and a way for the Worker to mark a key as holding it.
- A free "name these 12" quiz as an ad landing page.
- More animals: insects and spiders, frogs, more reef fish.
