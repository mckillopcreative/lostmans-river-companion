# Stripe: one product — Lostman’s River: Fishing Guide Experience

*Revised 2026-10-14. The author's call: launch a single experience and see whether it sells before adding anything else. The earlier four-product plan is kept at the bottom for later.*

## Account settings (once)

- **Statement descriptor:** `LOSTMANS RIVER` (max 22 characters; shows on the card statement).
- **Business name on receipts:** McKillop Creative, LLC.
- **Stripe Tax:** turn on; digital goods are taxed in many states and the EU, and Stripe calculates it.
- **Customer emails:** enable receipts; the receipt is the delivery mechanism until the app gate exists.
- **Branding:** icon `assets/art/emblems/site-mark.png` (the leaping tarpon), accent color `#e8873a`, background `#f6f1e7`.
- **Success URL:** `https://lostmansriver.com/app/?welcome=1` · **Cancel URL:** `https://lostmansriver.com/`
- **Refunds:** 30 days, no questions, stated on the page. Refund rate is the metric that tells you whether the product is honest.

## The product — Lostman’s River: Fishing Guide Experience

| Field | Value |
|---|---|
| Name | **Lostman’s River: Fishing Guide Experience** |
| Price | $24.99 one-time (launch: $19.99 with coupon `SUMMER`) |
| Tax category | Digital goods (e-book / audio) |
| Image | the titled journal, `assets/art/emblems/journal-titled.png` |
| Metadata | `product=experience`, `grants=read,listen,missions,downloads` |
| Paperback | Not sold here. Under the Buy button: “Want the paperback? It’s on Amazon.” linking to the Amazon listing (with the Associates tag once the account exists). Decided 2026-10-20: no shipping at launch; revisit a signed-book bundle if buyers ask for it. |

**Short description (Checkout, ≤ 250 chars):**
> A summer as an assistant fishing guide in the Everglades: the novel *Escape to Lostman’s River* to read and hear, 23 missions, real fishing skills, puzzles, and a license to earn and print. Ages 10 to 15. 15+ hours, much of it off the screen.

**Long description (Payment Link page):**
> Your child spends a summer in the Florida Everglades as an assistant fishing guide, the same job fifteen-year-old Matt Creek had in *Escape to Lostman’s River*, one of Joelbooks’ Top 8 Short Adventure Books for Teens.
>
> **Listen.** Every chapter read aloud, about 4½ hours: in the car, at bedtime, on the way to the water. Screen off.
> **Read.** All 23 chapters on the site, each with its chart, its fish, its crew and its tackle alongside. Or read the paperback and use the QR codes.
> **Do.** 23 missions set by Uncle Dan. Some are on the chart; some send them outside: tie the knots with a shoelace, read a real tide table, measure a real fish, draw what they saw.
> **Learn.** Real saltwater fishing: 23 fish, 19 critters, the boats of the Ten Thousand Islands, 34 tackle terms, five knots, how to read a tide.
> **Keep.** The Assistant Guide license to print and sign, fish cards, coloring pages from Linda McKillop’s sketches, a summer logbook to fill in by hand.
>
> Written by a mother and son. Illustrated by Mom. Nothing is collected from your child: progress stays on the device, and the license is filled in by hand.
>
> 30-day refund, no questions asked.

**Feature list (Stripe “features” bullets):**
- Full novel, read online, 23 chapters
- Narration, every chapter, ~4.5 hours, screen off
- 23 missions, 3 badges, a license to print and sign
- Field guide: 23 fish, 19 critters, boats, tackle, knots, tides
- Printables: fish cards, coloring pages, summer logbook
- Ages 10–15 · no accounts, no child data · 30-day refund

## Coupons

- `SUMMER` — 20% off at launch (ends on a date you choose).
- A 100%-off code for family and reviewers (limit redemptions).

## Delivery, until the gate is built

Stripe sends the receipt; add a custom receipt message:

> Welcome aboard. Your welcome email (arriving in a minute from help@lostmansriver.com) has a QR code: point your reader's own tablet or phone at it and they're in. Same code works again on any device, and the summer picks up where they left off. Questions: help@lostmansriver.com.

When the Cloudflare gate ships, the Stripe webhook (`checkout.session.completed`) writes the purchase key to KV and the receipt link carries it; nothing in the product copy changes.

## Ad-to-checkout copy

- Headline: **A summer in the Everglades. Half of it off the screen.**
- Sub: One of Joelbooks’ Top 8 teen adventure novels, read aloud, with real fishing skills to learn, knots to tie, tides to read and a license to earn.
- Proof line: Written by a mother and son. Illustrated by Mom.
- Button: **Hear Chapter 1 free** → lostmansriver.com (then **Get the Experience** on the page).

---

## Later, only if the single product sells

Kept from the first draft so nothing is lost. None of these should exist in Stripe at launch.

- **Signed paperback bundle** ($39.99, shipping included): add if buyers ask. Fulfilment math (2026-10-20): author copy ~$4, Media Mail via Pirate Ship ~$4.50, mailer ~$0.75, leaving ~$5 of the $15; order 20 author copies, sign in one sitting. Payment Links cannot collect shipping conditionally, so it would be its own link.
- **Classroom edition** ($99, 30 readers): adds the discussion guide, printables and a reading schedule; collect the school name at checkout. Worth building only after a teacher asks.
- **Audiobook only** ($9.99): `grants=listen`. Skip; the narration is the reason to buy the whole thing.
