# Opening campaign: November–December 2026

*The plan for the Meta ads that take the Summer Fishing Guide Experience from waitlist (now) to opening day (Friday, November 27) through Christmas. Built around the mother-and-son story. Image briefs for GPT: `docs/AD-BRIEF-FOR-GPT.md`.*

## The one idea

**A mother and son wrote a fishing adventure together. Now your kid can live it.**

Every ad says one of two things, and the best say both:
1. **Who made it:** a son and his mother, writer and illustrator, decades in the making. Real, local, family. (This is what no other book ad in the feed has.)
2. **What your kid does:** reads it, hears it, and does it for real: knots on real line, tides, a treasure map, a fishing day, a license at the end.

## Positioning (John's text, tightened)

> An authentic coming-of-age fishing adventure for young readers. A novel written by a mother and son, turned into an immersive Everglades beginner-angler experience: the whole book to read (about 4 hours) and to hear (4 hours of narration), 23 story missions and 23 real-world field missions, puzzles and games, and a chapter-by-chapter companion that brings the story to life.

Short form (40 characters or less): **A mother-and-son fishing adventure.** · **Read it. Hear it. Fish it.** · **Give them a summer job in the Everglades.**

## Proof points (all checked against the site, 2026-11-02)

| Claim | Number | Where |
|---|---|---|
| The book | ~41,000 words, 23 chapters; about 4 hours of reading for a 10–14-year-old | the manuscript |
| Narration | all 23 chapters, about 4 hours (AI voice; the site says so) | `data/audio.json` |
| Missions | 23 in the app, 23 field missions signed off by a grown-up | `data/missions.json` |
| Field Journal | 30 printable pages | `/field-journal/` |
| Real skills | 5 knots, tides for today, rigging, reading the water, catch and release | `/knots/`, `/tides/`, missions |
| The world | 23 fish, 17 characters, 29 places on a real chart, 19 critters, 12 boats, 34 tackle terms | `data/*.json` |
| Games | Fish ID (3 levels), Name that key (chart puzzle), knot stage shuffle | `/games/` |
| Finish line | three badges, a printable Assistant Fishing Guide license | `/license/` |
| Readers say | 4.7 stars from 20 Amazon reviewers; one of Joelbooks' Top 8 short adventure books for teens | `site.config.mjs` |
| Made by | Linda and John McKillop, mother and son; Linda drew every picture | About page |

Not to claim: "screen-free" (it isn't; say "off the screen" for field missions only), maps of every fish caught (we have a chart of every place, and a map per chapter), current fishing rules, anything about John being an MD helping children.

## Audiences (grown-ups only; never target or picture children's faces)

| Ad set | Who | Why |
|---|---|---|
| **Parents** | 30–55, US, interests: fishing, saltwater fishing, bass fishing, outdoors, boating, reading/children's books; or Advantage+ with these as suggestions | the core buyer |
| **Grandparents** | 55+, US, same interests plus grandparenting | the gift buyer; the mother-and-son story lands hardest here |
| **Florida** | 30+, Florida, fishing/boating/Everglades | local pride, the real places |
| Later: **lookalike** | 1% of waitlist signups (after ~100) | cheaper leads |

## Phases

| Dates | Goal | Objective in Meta | Daily budget (suggested) | Ads |
|---|---|---|---|---|
| **Nov 9–26** Waitlist | emails | Leads (website, the `Lead` event fires on signup) | $10–15 | 1 Then & now, 2 Decades, 3 Summer job |
| **Nov 27–30** Opening | first sales | Sales, or Landing page views until purchases are reported (below) | $20–25 | 3 Summer job, 5 Gift, 1 Then & now, + the opening email to the list |
| **Dec 1–24** Gift season | sales | same | $15–20, more on what works | 5 Gift, 4 Reluctant reader, 6 Smugglers, 8 Journal photo |
| **Dec 18–24** Last minute | sales | same | push the winner | 5 Gift with "arrives instantly" |

Total, if run as above: roughly $700–900. Check after the first week; move money to the ad with the cheapest signups.

Purchases: the Meta pixel never runs on the pages a child uses, so a sale isn't reported from the browser. To optimize for sales, the Worker can report each purchase to Meta's Conversions API from the Stripe webhook (email hashed, nothing about the child). Small build; do it before Nov 27 if Sales is the objective.

## The ads

Every link: `https://lostmansriver.com/?utm_source=meta&utm_medium=paid_social&utm_campaign=<code>` (or `/waitlist/` before opening). The code lands in the waitlist record and in `node scripts/metrics.mjs`, so we see which ad brought each signup.

### 1. Then & now (the founder ad) · code `lr-thennow`
- **Image:** `from-bedside-founder-story/creatives/then-now-4x5.png` (ready; John as a boy with Linda, and today). Shows the new cover.
- **Headline:** John wrote the summer. Linda drew it.
- **Primary text (draft in John's voice; John, edit it into your own words):**
  > Years ago my mom and I wrote a fishing adventure together. I wrote it, she drew it, and it took us decades to finish. Now we've turned it into a summer your kid can live: the whole book read aloud, real fishing skills, and 23 missions they do for real, from knots to a fishing day. Opens November 27. — John
- **Button:** Sign up (waitlist) → Learn more / Shop now (after opening)
- **Audience:** Grandparents, Parents

### 2. It took us decades · code `lr-decades`
- **Image:** `from-bedside-founder-story/creatives/authors-1x1.png` (ready; round selfie, "It took us decades. We finished it together.")
- **Headline:** A mother-and-son fishing adventure
- **Primary text:** Linda drew every picture. John wrote every word. *Escape to Lostman's River* is their Everglades adventure for readers 10 to 15, now a summer-long experience: read it, hear it, and earn a fishing guide license. Opens November 27.
- **Audience:** Grandparents

### 3. Give them a summer job in the Everglades · code `lr-summerjob`
- **Image:** GPT brief A (a painted skiff at sunrise, the book, headphones, a knotted line, the printed license; icon row Read it · Hear it · Tie it · Earn it).
- **Headline:** Read it. Hear it. Fish it.
- **Primary text:** Matt is fifteen and the new assistant fishing guide on Chokoloskee Island. So is your kid. The whole novel to read and hear, 23 missions, 23 real-world field missions signed off by you, a Field Journal to fill in by hand, and an Assistant Fishing Guide license at the end. Written by a mother and son.
- **Audience:** Parents, Florida

### 4. The reluctant reader · code `lr-reader`
- **Image:** GPT brief B (a teen's hands with headphones on a dock at dusk, the book beside them; no face).
- **Headline:** "The first time he connected to a book."
- **Primary text:** "My 14-year-old really doesn't like to read at all. It was the first time my son ever said he connected to the main character." — a parent, Amazon review. *Escape to Lostman's River*, 4.7 stars, now read aloud with missions and real fishing skills.
- **Audience:** Parents

### 5. For the kid who'd rather be fishing (gift) · code `lr-gift`
- **Image:** GPT brief C (the book wrapped with fishing line for ribbon, a lure as the bow, the printable gift card).
- **Headline:** The gift that lasts all summer
- **Primary text:** For the kid who'd rather be fishing. A mother-and-son Everglades adventure they read, hear and live: missions, real knots, a fishing day, and a license at the end. Arrives instantly, with a printable gift card. One price for the household.
- **Audience:** Grandparents, Parents (Dec)

### 6. Smugglers (the story) · code `lr-story`
- **Image:** GPT brief D (night water, a seaplane landing with no lights, three flashes, a skiff in the mangroves).
- **Headline:** Smugglers. A giant tarpon. And he's fifteen.
- **Primary text:** A seaplane lands without lights. A name in the dark. A tarpon called Old Scarface. *Escape to Lostman's River* is the coming-of-age Everglades adventure your reader solves chapter by chapter, with a case file to crack. Written by a mother and son.
- **Audience:** Parents (readers 11–14)

### 7. Can your kid earn this? · code `lr-license`
- **Image:** the printed license on a tackle box (photo, or GPT brief E).
- **Headline:** Can your kid earn this?
- **Primary text:** 23 missions. 23 field missions. 5 knots. 23 fish. One Assistant Fishing Guide license, signed by the captain (that's you).

### 8. The Field Journal, for real · code `lr-journal`
- **Image:** a **real photo** John takes: printed Field Journal pages on a dock or picnic table, a pencil, a spool of line, a clinch knot, sunlight. Hands only, never a child's face. This is the honest answer to "isn't it just screens?"
- **Headline:** Screens off. Rod in hand.
- **Primary text:** Every chapter ends with a field mission done for real, and a page to fill in by hand: tie the knot, read the tide, make the treasure map, clean up the lost line. A grown-up signs each one off.

## Rules for every ad
- Grown-ups only: 25+ in targeting; no interest targeting aimed at children; never a child's face or name (John's own children: voices, hands, silhouettes only).
- Credit Linda wherever her drawings or her story appear.
- Quote reviews word for word with the reviewer's display name.
- The MD credential is background, never a benefit for a child.
- Before opening day, every ad says "Opens November 27"; the button goes to `/waitlist/`.

## Organic posts (the Facebook page), twice a week
- **His words, her lines:** one of Linda's sketches beside the line from the book it illustrates (`data/quotes.json`, `data/sketches.json`). Ten ready-made posts.
- **The real places:** a place from the chart with one line from the book.
- **Countdown:** "26 days to opening" style posts, last week only.
- **Two voices (if they'd do it):** a 20-second clip of Linda reading one line and John the next.

## Corrections, 2026-11-03 evening (author)

- Linda and John **wrote the book together**; Linda illustrated it. Never "John wrote it, Linda drew it". The then/now image and the "decades" card were re-rendered with "We wrote it together. She drew every page." and "mother & son · co-authors · her illustrations".
- **No opening date.** KDP released the ebook, so the store opens the day Stripe is connected. "Opens November 27" is gone from the site, the buttons and the emails ("opens soon"); the waitlist stays as the fallback until then.
- **Plan before build.** The review page (https://claude.ai/artifact/6xud5uvS38GXetXtr9c2JV) is now the editable spec: John changes words, buttons, audiences and budgets there; Claude reads them (`ArtifactData`, collection `plan`) and builds only on "build it". The Meta drafts below were made before this and carry the old wording; they are not to be published and can be deleted on John's word.
- The plan now: one Sales campaign **LR - Launch** ($20/day, store-open day → Dec 24, Parents/Grandparents/Florida) and **LR - Gifts** ($15/day, Dec 1–24). The waitlist (Leads) campaign is dropped.

**Deleted 2026-11-03 evening** at John's request (from the Ads Manager table, two campaigns selected → Delete; the API cannot delete unpublished drafts, and "Discard drafts" would have taken Guided Recruit's draft too). The ids below are history. John added the ad account's payment method the same evening.

## Built in Meta earlier on 2026-11-03 (deleted; kept for the record)

Ad account McKillop Creative Ads 1825914471866172 · Page "Lostman's River" 1443510642172754 · dataset 2258563668038674. Advantage+ audience is on, so the age ranges are suggestions with a hard floor of 25.

| Campaign | Objective | Budget | Ad sets | Ads |
|---|---|---|---|---|
| LR - Waitlist (Nov 9-26) `52528758368729` | Leads (Lead event) | $12/day, CBO | Parents `52528758794729` · Grandparents `52528758810929` · Florida `52528758824129` | Then & now (all three), Decades (Grandparents) |
| LR - Opening and gifts (Nov 27-Dec 24) `52528758390129` | Sales (Purchase event) | $20/day, CBO | Parents `52528758829529` · Grandparents `52528758841529` · Florida `52528758848329` | Then & now (all three), Decades (Grandparents) |

Creatives: then-now waitlist `2405444780118340`, decades waitlist `972044015518507`, then-now opening `1144722481231377`, decades opening `1302000109187433`. Images on the site at `/ads/` (hosted only so Meta could fetch them).

Blockers before anything goes live: the ad account has **no payment method** (Ads Manager → Billing); the AI-content disclosure on each creative was left unset (the photos are real, not generated), John to confirm; ads 3–8 need their images. Review page: https://claude.ai/artifact/6xud5uvS38GXetXtr9c2JV

## To do
- **John:** save the ad account's time zone and card; send the mailing address; edit the ad 1 text into his own words; take the Field Journal photo (ad 8); create the Lostman's River Facebook page in the business portfolio if it isn't yet.
- **Claude:** GPT briefs A–E (`docs/AD-BRIEF-FOR-GPT.md`); the opening email; Conversions API purchase reporting (if Sales objective); build the campaigns paused in Meta for John's review once the account is ready.
