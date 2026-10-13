# Escape to Lostman's River — the digital edition

*A working plan, 2026-10-13. Everything here is a proposal for John and Linda to edit; nothing is built yet except the pieces marked* **exists**.

## 1. What it is, in one line

**A wildlife adventure for teenagers: a real novel you can read and listen to, with the fishing, the places and the animals taught alongside the story, and a mystery to solve as you go.**

Not a worksheet pack, not a game with a story bolted on. The book is the spine; everything else hangs off it chapter by chapter.

## 2. Positioning

- **Name (working):** *Summer at Lostman's River — the digital adventure edition.*
- **For:** readers 10 to 15 who like fishing, boats, animals, or getting into a little trouble. Bought by parents and grandparents, often as a gift.
- **Proof points to lead with:**
  - Named one of Joelbooks' **Top 8 Short Adventure Books for Teens** (keep the number; it is the credential).
  - Written by a **mother and son**; every drawing is Linda's.
  - **Real places, real fish.** The Ten Thousand Islands, Chokoloskee, Lostman's River. Adult anglers vouch for the details.
  - Reading first. Audio, lessons and puzzles support the reading; they never replace it.
- **The promise to a parent:** your kid reads a whole novel, learns how tides and tackle and knots actually work, and finishes with something to show for it.

## 3. The five pillars

| Pillar | What the reader gets | Status |
|---|---|---|
| **Read** | The full novel on the site, one chapter per page, with the chapter's chart, fish, crew and tackle beside it. | Companion pages **exist**; the chapter text is not on the site yet. |
| **Listen** | Narration of every chapter, play while you read or while you tinker with the chart. Same voice across all 23 chapters. | Script ready (`scripts/narrate.mjs`), audio not yet generated. |
| **Learn** | The field guide: 23 fish, 19 critters, 12 boats, 34 tackle terms, five knots, the tide explainer, 29 places. | **Exists.** |
| **Play** | The Assistant Guide trail: one task per chapter, badges, a printable guide's license at the end. | Designed below, not built. |
| **Keep** | Downloads: PDF and EPUB of the book, the audio, fish cards, coloring pages from Linda's sketches, the certificate. | Not built. |

## 4. The Assistant Guide trail (the "mystery" layer)

The frame: Dan takes Matt on as his assistant guide. The reader is hired too. Each chapter sets one task drawn from what happens in it; finishing the trail earns the license. The smuggling plot gives the mystery its shape: the reader gathers the same clues Matt does and names the informant before Chapter 20.

| Ch. | Task (working) | Skill | Uses |
|---|---|---|---|
| 1 | Find starboard on the 737 and on the Mako. | Boat sense | word of the day |
| 2 | Rig the eight poles: drag swivel, weight, leader and lure into order. | Rigging | rig diagram |
| 3 | Pick the lure for grass beds vs. mangroves. | Reading the water | fish guide |
| 4 | Read the tide chart: when is the water over the bars at South Point? | Tides | tide explainer |
| 5 | Log what you saw at the night meeting: two boats, one car, one name. | Observation (clue 1) | — |
| 6 | Revive the snook: order the steps. | Catch and release | reviving-a-fish |
| 7 | Identify the fish from the cooler: trout, redfish, snapper, black drum. | Fish ID | fish plates |
| 8 | Camp safety: moccasin, lantern, sand pipes. Which is the real risk? | Wildlife | critters |
| 9 | Plot the seaplane's drop on the chart. | Navigation (clue 2) | the chart |
| 10 | Decode the channel 16 call: what time, which boat, where to. | Radio (clue 3) | marine-radio |
| 11 | Provision the Sea Belle for a week for two. | Planning | provisioning |
| 12 | Storm tie-off: bow to mangrove, stern anchor. Draw it. | Seamanship | storm-tie-off |
| 13 | Why did the gator come? Spot the splash. | Wildlife | alligator |
| 14 | What took the Bonefisher across the channel? Estimate the weight. | Fish | grouper |
| 15 | Name the Everglades choir: mullet, frogs, birds. | Listening | soundscape |
| 16 | Ghost net rescue: cut order, and why the dolphin charged the shark. | Wildlife | dolphin |
| 17 | Doc's bag: what you need to close a cut. | First aid | medical-bag |
| 18 | Push and pull: which tide floats the Sea Belle? | Tides | tides |
| 19 | Old Scarface: weigh it or release it? Make the call and defend it. | Ethics | tournament-rules |
| 20 | Name the informant before Rawley does. | The mystery | clues 1–3 |
| 21 | Where did the reward money go? Follow it. | Reading | — |
| 22 | Airboat: what makes it run on inches of water? | Boats | airboat |
| 23 | Sign the Guidebook. Print the license. | Finish | certificate |

Badges: **snook** (Chapter 6), **tarpon** (Chapter 19), **captain's wheel** (Chapter 23). All three are already drawn in `assets/art/emblems/`.

Rules: no scores against other kids, no timers, no streaks. Progress is saved on the device (and in the purchase account once accounts exist). A parent can print the license without the child entering any personal data; the name is typed into the printable, not stored.

## 5. Narration

**Voice:** OpenAI `gpt-4o-mini-tts`, voice **`fable`**, the Socrates voice John picked by ear. A new delivery instruction for a novel (steady audiobook pace, warm, a little grit, light dialogue distinction, no announcer cadence); the instruction string lives in `scripts/narrate.mjs` and is versioned so a change regenerates everything.

**Pipeline:** generated once, shipped as static MP3s under `public/audio/`, one file per chapter (segments joined with ffmpeg). No API key in the browser, no per-listen cost. Lessons carried over from Socrates: the model drops the tail of long inputs, so requests stay under 1,800 characters and break at paragraph ends; iOS and in-app browsers need a user tap before audio and a Web Audio path for gapless play; playback rate 1.05 reads better than 1.0.

**Size and cost:** about 41,000 words, roughly 4.5 hours of audio, about 235,000 characters. One-time generation ≈ $3.50. Re-rolling a chapter after an edit costs cents.

**Player:** a chapter page gets a "Listen" button under the title; a sticky mini-player while scrolling; remembers position per chapter on the device; "play while you browse" keeps going across the field-guide links from that chapter.

**Alternative:** a human recording by John (or John and Linda alternating) would be the stronger marketing story. It is also 20 to 30 hours of work and a quiet room. A reasonable middle: generate the `fable` edition now, and record a human "author's reading" of three chapters as a bonus and as the ad audio.

## 6. What else AI can build for this product

Things that raise the value without needing a studio or a staff:

- **Discussion guide** for teachers and book clubs: questions per chapter on grief, trust, the choice to release Old Scarface, Doc's discharge. From the chapter data; a day's work.
- **Fish ID game**: which fish is this, from the 23 plates; three difficulties; on the site, no account.
- **Tide puzzle** with live Chokoloskee tides from NOAA, so a kid can check tonight's high.
- **Chart quiz**: drop the pin where Comer Key is; plot the escape route.
- **Printables**: fish cards, knot cards, coloring pages (Linda's sketches convert cleanly), the guide's license, a blank Guidebook page.
- **Chapter spot illustrations as stickers** (print sheet).
- **Ask Uncle Dan**: a chat grounded only in the book and the field guide, in Dan's voice. Needs a backend and careful guardrails; Phase 3.
- **Ad creative**: the social-share painting, the fish plates and the portraits are ready-made ad images; copy variants in the voice of the site.
- **The Kindle and PDF editions** themselves: typeset from the manuscript with Linda's sketches at chapter heads; EPUB via Pandoc; a print-ready PDF with the QR codes in place.

## 7. Product tiers and price

| Tier | Includes | Price (proposal) |
|---|---|---|
| **Free** | The companion site as it is today, Chapter 1 to read and listen, the first trail task, email sign-up. | $0 |
| **Digital adventure edition** | Full novel on the site, all narration, the full trail with badges and license, PDF + EPUB + MP3 downloads, printables. | **$24.99** (introductory $19.99) |
| **Gift bundle** | The digital edition plus the signed paperback shipped. | $39.99 |
| **Classroom** | 30 seats, the discussion guide, printables. | $99 |

Anchoring: the paperback is $14.99 and Kindle would be $4.99, so the edition must visibly be *more* than the book as a file. Audio and the trail are the difference. Always sell the paperback as an add-on, never as a rival.

## 8. Marketing

- **Headline direction:** "A summer in the Everglades, read aloud." / "One of Joelbooks' Top 8 teen adventure novels, now a 4-hour read-and-listen adventure." / "Written by a mother and son. Illustrated by Mom."
- **The ads you saved** (Riddle Rovers, Printed Adventures, Pip's Puzzle Trail) win on: a parent-pain headline, "no prep, start tonight," a visible bundle, a refund promise, and social proof counts. Borrow the mechanics, not the look. Our look is the watercolor and the sketches, and our difference is "an actual novel."
- **Funnel:** ad → Chapter 1 free (read + listen + first task) for an email → three emails (Dan's rules of fishing, the real Chokoloskee, the trail) → the edition. The site already has the sign-up form; pick Buttondown or Mailchimp.
- **Channels:** Facebook/Instagram to parents 35–55 interested in fishing, boating, Florida, homeschool; Florida fishing groups; Everglades City and Chokoloskee businesses (QR cards at the marina); school librarians via the classroom tier; the Joelbooks list itself.
- **Measure:** cost per email, email-to-purchase rate, refunds. Decide on scaling ads only after 100 emails and 10 sales.

## 9. Technical shape

Today the site is static on GitHub Pages behind the Cloudflare domain. A paid edition needs three things static files cannot do: a purchase check, protected chapter text and audio, and saved trail progress.

- **Hosting:** move to **Cloudflare Pages** (same domain, already at Cloudflare). Static site unchanged.
- **Checkout:** **Lemon Squeezy** or **Payhip** (both handle sales tax/VAT, refunds, and digital delivery). A webhook writes a license key to **Workers KV**.
- **Gate:** a small **Cloudflare Worker** serves `/read/ch/N/` and `/audio/ch-NN.mp3` only with a valid key cookie; the key is entered once from the purchase email. No accounts, no passwords.
- **Progress:** on the device first (as Matt's List does today); synced to KV under the key later.
- **Privacy:** parents buy; the site never asks a child for a name, email or photo. The printable license is filled in by hand. Keep the no-cookies promise for the free site; the paid gate uses one functional cookie, disclosed.
- **KDP:** before selling a PDF/EPUB directly, confirm the Kindle edition is **not** enrolled in KDP Select (exclusivity). Selling the web edition and the audio is unaffected either way.

## 10. Roadmap

1. **Sample (one week).** Narrate Chapter 1 with the script. Put the chapter text and the player on `/ch/1/` behind nothing. Add trail task 1. Turn on the email form. This is the ad landing page.
2. **Full narration (a day of compute, a few evenings of listening).** All 23 chapters generated, spot-checked, re-rolled where the read is wrong.
3. **The trail (two to three weeks).** The 23 tasks as small interactive pages, badges, the license printable.
4. **Gate and checkout (one to two weeks).** Cloudflare Pages + Worker + Lemon Squeezy. Test with a $1 product first.
5. **Downloads (one week).** EPUB and PDF typeset, MP3 bundle, printables.
6. **Launch.** Introductory price, the funnel, 100-email checkpoint.

## 11. Decisions John and Linda need to make

- Generated voice, human recording, or both? (Recommendation: both; generated now, three author-read chapters as a bonus.)
- Price and introductory price.
- KDP Select status.
- Whether the trail's mystery may reveal the informant inside the product (it is the book's twist; the task is designed so the reader guesses, the book confirms).
- The product name.
