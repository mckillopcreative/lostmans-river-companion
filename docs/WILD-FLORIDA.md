# Wild Florida

*Added 2026-11-16, John's idea: a game that teaches a reader, age 10 to teens, to name the major animals of Florida, with Uncle Dan as the guide. His decisions: Uncle Dan speaks in the book narrator's voice; Codex paints the plates; keep it simple (the major animals, not every sub-species); filters by kind of animal and by part of Florida.*

`/wild-florida/` · data `data/wild.json` · page `src/pages/wild-florida/index.astro`

## What is in it

201 animals in seven kinds: 55 fish, 22 sharks and rays, 41 reptiles and frogs (alligator, crocodile, caiman, 19 snakes, turtles, lizards, frogs and toads), 36 birds, 17 mammals, 17 sea creatures (crabs, lobster, shrimp, octopus, squid, jellyfish, man-o’-war, conch, sea star, urchin, seahorse) and 13 bugs and spiders. John asked for plenty of snakes and sharks, and for whatever a 10-to-15-year-old would want to tell apart ("If there's more than 106, then so be it"). Each has:

| Field | Use |
|---|---|
| `tell` | The one tell-tale, shown on screen and used as the clue in "Read the clue". It does not name the animal outright. |
| `dan` | Uncle Dan's line, shown and spoken (`public/audio/wild/<id>.mp3`). |
| `like` | Look-alikes, for "Tell them apart" and as the wrong answers in quizzes. |
| `type`, `regions` | The two filters. |
| `starter` | The free set (18 once painted). Everything else is the paid add-on (below). |
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
- **A visible finish line.** Ranks (Deckhand at 10 known, Mate 30, Guide 75, Captain 150; never more than the number painted), a logbook grid, a test that needs 8 in 10, and a certificate to print from Deckhand up. The name typed on the certificate stays on the device.

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

## How it is sold: an add-on (John, 2026-11-16)

Wild Florida is a **$9.99 add-on, once, and it covers every seat in the boat**: the buyer's key, the buy-one-give-one key and every key of a Full Crew. The price was Claude's pick; John asked for "whatever $ cost add on you think". The starter set stays free for everyone.

| Piece | Where |
|---|---|
| Stripe product | `prod_VdkojOlgfrWsSh`, "Wild Florida: Uncle Dan's field school (add-on)", $9.99 one-off, in the Lostman's River account |
| One reader + Wild Florida, $34.98 | `plink_1UcTNDR6rTUxNaU8VEZawk9Y` · buy.stripe.com/6oU8wRew30X70pFfs493y05 |
| Full Crew + Wild Florida, $49.98 | `plink_1UcTPDR6rTUxNaU8uZg39hWk` · buy.stripe.com/00w14pcnVfS14FV3Jm93y06 |
| Wild Florida alone, $9.99 (a family that already has the Experience) | `plink_1UcTRaR6rTUxNaU8VrUQwSCv` · buy.stripe.com/bJe14pew3gW55JZcfS93y07 · returns to `/wild-florida/?added=1&session_id=…` |
| Site | `site.config.mjs` → `checkout.wild`; the confirm sheet's second switch and its "What's this?" drop-down (`BuyConfirm.astro`); the lock on the Wild Florida page |
| Worker | `wrangler.toml` `WILD_PRODUCT`, `WILD_LINK`, `WILD_CREW_LINK`, `WILD_ADD_LINK`, `WILD_SINCE`; `orderOf`, `addWild`, `hasWild` in `worker/src/index.js` |

How a key comes to hold it: (1) bought with the purchase: every key of that checkout is written with `wild: true`; (2) added later through the $9.99 link: the Wild Florida page puts the reader's key on the link (`client_reference_id=wild_<key>`, with the purchase email as the fallback) and the Worker marks **every key of that purchase**; (3) comps; (4) any key created before `WILD_SINCE` (2026-11-16 17:50 UTC), because Wild Florida was part of the Experience for the few hours before it became an add-on.

The page asks the Worker (`GET /key/<key>` → `wild`) and remembers the answer on the device (`lr-wild-ok`, `html.has-wild`). The lock under the board has two faces: no key → "Get the Experience + Wild Florida" (opens the confirm sheet with the add-on switched on); key without the add-on → "Add Wild Florida $9.99".

If an add-on is paid and no purchase can be matched (no key on the link, different email), nothing is unlocked and John gets an email headed "NO KEY FOUND" to fix by hand or refund.

**New links were made by duplicating the live ones** in the Stripe dashboard and swapping the copied products for the real ones (Duplicate copies the product too; the three stray "(Copy)" products it left were archived). They carry the same settings: promotion codes on, automatic tax off, no terms box, redirect to the welcome page.

Tests kept in the session scratchpad, worth re-creating if this is touched again: a Worker fulfilment test (signed pretend webhooks against an in-memory KV: single + add-on, crew + add-on, later upgrade by key and by email, repeat webhook, unmatched upgrade, Stripe line items unreadable, old keys) and a headless-Chrome run of the pages with stand-in keys.

## Not decided yet

- The price ($9.99) and whether to sell Wild Florida on its own to people without the Experience (a stand-alone gift). Today the $9.99 link only attaches to an existing purchase.
- A free "name these 12" quiz as an ad landing page.
- Ads do not mention the add-on.
