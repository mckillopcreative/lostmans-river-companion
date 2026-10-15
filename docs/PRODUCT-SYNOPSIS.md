# Lostman's River Fishing Guide Experience — product synopsis for review

*Written 2026-10-15 so that other models (or people) can evaluate the product and suggest improvements, especially ways to improve revenue. Everything marked **built** is live at https://lostmansriver.com. Everything marked **planned** is not. Nothing has been sold yet; there is no checkout. Please be blunt.*

## 1. One paragraph

A paid web product for children aged roughly 10 to 15 and the parents who buy for them. The child spends "a summer" as an assistant fishing guide in the Florida Everglades, the job the fifteen-year-old hero has in the middle-grade novel *Escape to Lostman's River*. They read the novel on the site (or in the paperback), listen to it narrated, learn real saltwater fishing (fish, boats, tackle, knots, tides, the chart), complete 23 missions, earn three badges, and print and sign an Assistant Guide license. Proposed price $24.99 one time, with the signed paperback as a +$15 add-on. The marketing angle is "your child learns the basics of saltwater fishing in the Everglades," with the ad promise that much of it happens off the screen (narration in the car, missions done outside, printables).

## 2. The underlying book

- *Escape to Lostman's River*, by Linda McKillop and John McKillop (mother and son; Linda drew the illustrations). Paperback on Amazon (ASIN B0BVJ4XR65); 23 chapters; about 4½ hours read aloud.
- Named one of Joelbooks' "Top 8 Short Adventure Books for Teens." This is the only third-party credential and is used on the landing page and in the planned ads.
- Setting: Chokoloskee, the Ten Thousand Islands and Lostman's River in Everglades National Park. Real places; a real chart; real fish. The plot involves a summer job on a charter boat, a fishing tournament and a mystery.
- A print reissue will carry a QR code at every chapter pointing to `/ch/N/` on the site, so the paperback and the site are designed as one object.

## 3. The audience and the buyer

- **User:** a 10-to-15-year-old who likes fishing, boats, the outdoors, or adventure stories, or whose parent wishes they did.
- **Buyer:** a parent or grandparent, found by Facebook/Instagram/Google ads, in Florida and the Gulf coast first, then anyone with a kid and a tackle box. Secondary: homeschool families, teachers, libraries (not pursued at launch).
- **Jobs the buyer is hiring it for:** a summer activity that is not a video game; a way to share fishing with a child; a gift that is more than a book; "get them off the screen" (which the product only partly delivers; see §8).

## 4. What is built and live

The site is a static Astro build on GitHub Pages behind Cloudflare at lostmansriver.com, phone-first, no cookies, no accounts, no analytics yet. Progress lives in the browser's localStorage; no child data leaves the device.

**Landing page (`/`) — "Matt's working journal".** A single long page: hero with the painted, titled journal, a free player for the narrated chapter 1, and inline previews of every section with a sticky chip nav. This is the ad landing page.

**The Experience home (`/app/`).** A tile grid with painted art for every tile, a sunrise banner, progress pills (missions done, badges, next mission), the chapter-1 player, and the authors' card. Intended to be the post-purchase home.

**Content, all from the novel and all illustrated** (183 watercolor plates plus 30 tiles and scenes, generated to a brief, plus 11 of Linda's original sketches):

| Section | Count | What it is |
|---|---|---|
| Chapters | 23 | one page per chapter: summary (never the text), the chart with that chapter's route, the fish, crew, critters, boats and tackle that appear, the mission, the audio player |
| Fish | 23 | species pages: field-guide plate, identification notes, how it is caught in the book, regulations link to FWC (never stated as fact) |
| Crew (characters) | 17 | portraits and who they are |
| Critters (wildlife) | 19 | |
| Boats in the book | 12 | |
| Types of boats | 17 | real-world reference: jon boat, flats skiff, bay boat, deep-V, houseboat, airboat, jet boat, kayak and rigging, outboard, trolling motor, push pole, anchors, safety kit, hull words |
| Tackle terms | 34 | illustrated glossary, rig diagrams, five knots, how to read a tide |
| Places | 29 | painted scenes on an interactive chart (Leaflet) |
| Routes | 13 | chapter-by-chapter boat routes on the chart |
| Missions | 23 | one per chapter, set by "Uncle Dan": multiple choice, ordering, short text, pick-the-fish, find-the-place, decisions, and a signature; three badges (snook, tarpon, captain) |
| Games | 3 | Fish ID (10 rounds, three levels), Name That Key (place a painted scene on the real chart, within two miles scores), knot trainer with stage shuffle |
| Live data | 1 | today's tides from NOAA with the "fish an hour either side of the high" window drawn on |
| Printables | 1 | the Assistant Guide license: painted certificate, name and badges filled from progress, prints on landscape letter |
| Other | | Matt's list (18 items), quotes, 7 recipes, sketchbook, about, credits, 404 |

**Narration.** Chapter 1 (15 minutes) is narrated and live. Voice: OpenAI `gpt-4o-mini-tts`, voice "fable," a single steady narrator, with an automated pitch check that re-records segments that drift. The author approved the voice. The other 22 chapters cost about $4 to generate and are not yet made.

## 5. What is planned, in order

1. **Checkout.** Stripe Payment Link, one product, paperback add-on, success URL to `/app/?welcome=1`. Copy is written (`docs/STRIPE-PRODUCTS.md`). No gate exists: today `/app/` is public.
2. **The gate.** Cloudflare Worker + KV: Stripe webhook writes a purchase token; `/app/` and the audio check it. Until then the plan is honour-system delivery by receipt email.
3. **Narrate chapters 2–23**, host on Cloudflare R2, player on every chapter page (already built; it shows only when the file exists).
4. **Field missions and the summer logbook** (see §8): a third of the missions become off-screen tasks with a "done, a grown-up saw it" checkbox; a printable logbook, fish cards, coloring pages, knot cards, the chart at letter size.
5. **Downloads page:** PDF/EPUB of the novel (pending a KDP Select check), MP3s.
6. **Ads:** Facebook/Instagram first, creative built from the authors' photo, the journal, the license, the knot tile; headline "A summer in the Everglades. Half of it off the screen."; button "Hear Chapter 1 free."

Parked until the single product proves itself: gift bundle, classroom edition (30 seats, discussion guide), audiobook-only.

## 6. Pricing and the funnel

- $24.99 one time; launch coupon 20% off; 30-day no-questions refund. Paperback add-on +$15, US shipping, signed.
- Funnel: ad → `/` (hear chapter 1, see the art, read the authors' story) → Stripe → `/app/`.
- "15+ hours of adventure" is the ad number: reading 4.5 h, listening 4.5 h, missions and games ~6 h, printables and field tasks ~5 h, counted conservatively (the internal tally is ~21 h).
- No sales data. No ad spend yet. No email list (a "sign up for next summer" form exists with no provider behind it).

## 7. Costs and economics

- Build to date: author time plus AI tooling; art generated from a brief; no contractors. Hosting is free (GitHub Pages, Cloudflare free tier, R2 free egress).
- Marginal cost per sale: Stripe fees (~$1) and, with the paperback add-on, print cost plus postage (~$8–10) against the $15.
- Narration of the whole book: ~$4 once.
- The main unknowns are customer acquisition cost and refund rate.

## 8. Known weaknesses (the author's own list)

1. **It is mostly on a screen.** Unless the paperback is in the cart, reading happens on a phone. Narration and the printed license are the only off-screen pieces today. The field-mission and logbook plan is the answer but is not built, so the ad line "half of it off the screen" is not yet true.
2. **No gate.** Everything, including the paid home, is public right now. A buyer is paying for convenience and the narration, not for access.
3. **One narrated chapter.** The listen promise is 4.5 hours; 15 minutes exist.
4. **AI illustration.** The 213 plates are AI-generated to the author's brief, credited as such. Linda's 11 original sketches are shown first on detail pages. Some buyers will mind.
5. **Thin social proof.** One list mention, no reviews on the product itself, no classroom pilot.
6. **Missions are light.** Most are two-minute quizzes. The three badges and the license carry the motivation; there is no streak, no leaderboard, nothing social, by design (no accounts).
7. **The audience may be narrower than hoped.** "Kids who like fishing" is specific; the product leans on the parent wanting it for them.
8. **Discoverability.** No SEO work, no content marketing, no presence on fishing or homeschool communities.

## 9. Constraints that are fixed

- No accounts, no cookies, no child data (COPPA avoidance by design). Progress stays on the device; a new phone starts over.
- Chapter URLs `/ch/1/` … `/ch/23/` are printed in the book and can never change.
- The novel's text is never reproduced on the public site; summaries and short quotes only.
- Fish regulations are linked to the state agency, never stated.
- Static site, no paid APIs at runtime; the only backend will be a small Cloudflare Worker.
- Windows machine, Node, no Python, no ffmpeg.

## 10. Revenue: the model as it stands, and the levers on the table

**The model.** One-time $24.99 digital sale, sold direct, driven by paid social. No subscription, no in-app purchases, no ads inside the product. The paperback add-on is the only second line.

**Working assumptions (unproven):**

| | |
|---|---|
| Price | $24.99 (launch $19.99) |
| Net after Stripe | ~$23.90 |
| Target cost per sale from ads | ≤ $12 (breaks even above ~$22 with refunds) |
| Refund rate tolerated | ≤ 8% |
| Paperback add-on take rate guessed | 25%, margin ~$5–7 each |
| Season | spring and early summer (gift and "summer activity" buying), December gifts |

**Levers being considered, none decided.** Reviewers are asked to rank these or add to them.

1. **Make the paperback default**: a $39.99 physical-plus-digital product. Higher ticket, higher perceived value, a real object in the ad, but shipping work and a $8–10 unit cost.
2. **Tiering**: a $14.99 "read and listen" tier and a $29.99 "guide" tier with missions, license and printables. Risk: the cheap tier cannibalises.
3. **Gift framing**: a gift card to print, a "from Grandpa" line on the license, gift-season ads. Gifts tolerate higher prices.
4. **Classroom and homeschool**: $99 for 30 readers with a discussion guide; sold by email to Florida teachers and homeschool co-ops. Few sales, big tickets, slow.
5. **Affiliate and partner**: tackle shops and fishing guides in SW Florida sell or hand out a code; bait-shop counter cards with the QR; a cut to the shop.
6. **The free layer as the funnel**: the fish guide, tides, knots and boat types stay free (SEO for "how to tie a uni knot," "snook identification," "tides Chokoloskee") and the paid product is the novel, narration, missions and license. Slow, cheap traffic that compounds.
7. **A second book**: the pipeline (data, art, narration, missions) is reusable; a sequel or a second title doubles the catalogue for a fraction of the first build.
8. **Audiobook as a separate SKU** on the author's own site ($9.99) for adults who just want the story.
9. **Seasonal "summer cohorts"**: open enrolment in May, a shared start date, a weekly email with the next mission, so parents have a reason to buy now. No accounts needed; the email list does the work.
10. **Licensing the format** to other children's authors (a companion-site-plus-missions kit). Far off.

**What the author wants to avoid:** subscriptions for a children's product, accounts and data collection, anything that makes the site worse for the kid in order to make the number better.

## 11. Questions for the reviewer

Revenue first:

1. Given §4 as it stands, what is the most money this can make in its first year, and what is the one change that would most raise that number?
2. Is $24.99 right? What would have to be true for $34.99 or $14.99? Should the paperback be in the box by default?
3. Which of the levers in §10 would you pull first, which never, and what is missing from the list?
4. Which ad angle converts a parent: "learn real saltwater fishing," "a summer off the screen," "a novel read aloud with the places on a chart," or "a gift from a mother-and-son author team"? Write the headline you would run.
5. What is the cheapest way to get the first 50 paying customers without ads?

Then product:

6. What is the single highest-leverage thing to build before the first ad dollar: the gate, the full narration, the logbook, or something not listed?
7. What would make a 12-year-old come back on day three, and does that matter for a one-time purchase?
8. What is the biggest risk in this plan that the author is not seeing?
9. Which parts of §4 would you cut, and which would you make the headline?

## 12. Pointers

- Live site: https://lostmansriver.com · Experience home: https://lostmansriver.com/app/ · license: https://lostmansriver.com/license/ · a chapter: https://lostmansriver.com/ch/7/
- Repo: https://github.com/mckillopcreative/lostmans-river-companion (public; the manuscript is not in it)
- Internal plans: `docs/DIGITAL-EDITION-PLAN.md` (the full product plan, §15 is the off-screen plan), `docs/APP-HOME-BRIEF.md` (the app home and art brief), `docs/STRIPE-PRODUCTS.md`, `docs/OPEN-ITEMS.md`.
