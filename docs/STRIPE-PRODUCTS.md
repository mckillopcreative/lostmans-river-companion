# Stripe products and checkout copy

*Drafted 2026-10-13 for Stripe Payment Links / Checkout. Prices are the proposal from DIGITAL-EDITION-PLAN.md §7; change them in Stripe, not here.*

## Account settings (once)

- **Statement descriptor:** `LOSTMANS RIVER` (max 22 characters; shows on the card statement).
- **Business name on receipts:** McKillop Creative, LLC.
- **Stripe Tax:** turn on; digital goods are taxed in many states and the EU, and Stripe calculates it.
- **Customer emails:** enable receipts; the receipt is the delivery mechanism until the app gate exists.
- **Branding:** icon `assets/art/emblems/site-mark.png` (the leaping tarpon), accent color `#e8873a`, background `#f6f1e7`.
- **Success URL:** `https://lostmansriver.com/app/?welcome=1` · **Cancel URL:** `https://lostmansriver.com/`
- **Refunds:** 30 days, no questions, stated on every product page. Refund rate is the metric that tells you whether the product is honest.

## Product 1 — The Digital Adventure Edition

| Field | Value |
|---|---|
| Name | **Lostman’s River: Digital Adventure Edition** |
| Price | $24.99 one-time (launch: $19.99 with coupon `SUMMER`) |
| Tax category | Digital goods (e-book / audio) |
| Image | the titled journal, `assets/art/emblems/journal-titled.png` |
| Metadata | `product=edition`, `grants=read,listen,missions,downloads` |

**Short description (Checkout, ≤ 250 chars):**
> The complete novel *Escape to Lostman’s River* to read online and listen to, plus 23 Assistant Guide missions, three badges, a printable license, and the field guide, knots, chart puzzles and tides. For readers 10 to 15. 15+ hours of adventure.

**Long description (Payment Link page):**
> Your child spends a summer in the Florida Everglades as an assistant fishing guide, the same job fifteen-year-old Matt Creek had in *Escape to Lostman’s River*, one of Joelbooks’ Top 8 Short Adventure Books for Teens.
>
> **Read.** All 23 chapters on the site, each with its chart, its fish, its crew and its tackle alongside.
> **Listen.** Every chapter narrated, about 4½ hours, so they can listen while they explore the chart.
> **Learn.** Real saltwater fishing: 23 fish, 19 critters, the boats of the Ten Thousand Islands, 34 tackle terms, five knots, how to read a tide.
> **Play.** One mission per chapter set by Uncle Dan, three badges to earn, and a mystery to solve before Matt does.
> **Keep.** Download the book as PDF and EPUB, the audio as MP3, fish cards, coloring pages from Linda McKillop’s sketches, and the Assistant Guide license to print and sign.
>
> Written by a mother and son. Illustrated by Mom. Nothing is collected from your child: progress stays on the device, and the license is filled in by hand.
>
> 30-day refund, no questions asked.

**Feature list (Stripe “features” bullets):**
- Full novel, read online, 23 chapters
- Narration, every chapter, ~4.5 hours
- 23 missions, 3 badges, printable Assistant Guide license
- Field guide: 23 fish, 19 critters, boats, tackle, knots, tides
- PDF + EPUB + MP3 downloads, fish cards, coloring pages
- Ages 10–15 · no accounts, no child data · 30-day refund

## Product 2 — Gift Bundle (edition + signed paperback)

| Field | Value |
|---|---|
| Name | **Lostman’s River Gift Bundle** |
| Price | $39.99 one-time, shipping to US addresses included |
| Tax category | Mixed: physical book + digital goods |
| Checkout | collect shipping address; add a “gift message” custom field (optional, 120 chars) |
| Image | the paperback cover beside the journal |
| Metadata | `product=gift`, `grants=read,listen,missions,downloads`, `ships=paperback` |

**Short description:**
> The Digital Adventure Edition plus a signed paperback of *Escape to Lostman’s River*, shipped to the reader. Add a gift message at checkout.

**Long description:**
> Everything in the Digital Adventure Edition, and the real book in their hands: a paperback signed by the authors, with the QR codes at every chapter that open the adventure on their phone. We ship within three business days to US addresses. Write a gift message at checkout and we print it on the card.

## Product 3 — Classroom Edition

| Field | Value |
|---|---|
| Name | **Lostman’s River Classroom Edition (30 readers)** |
| Price | $99 one-time |
| Tax category | Digital goods |
| Checkout | collect school name (custom field) |
| Metadata | `product=classroom`, `seats=30`, `grants=read,listen,missions,downloads,guide` |

**Short description:**
> Thirty readers, the discussion guide, printable fish cards and chart puzzles, and a reading schedule. For grades 4 to 8, homeschool groups and libraries.

**Long description:**
> One purchase, thirty readers. Your class reads a real novel set in a real place, with the science and seamanship taught alongside it: tides, knots, fish identification, navigation on a chart, Everglades wildlife and conservation. Includes the teacher’s discussion guide by chapter, printables, and the classroom reading schedule. No student accounts and no student data.

## Product 4 — Audiobook only (optional, later)

| Field | Value |
|---|---|
| Name | **Escape to Lostman’s River — Audiobook** |
| Price | $9.99 |
| Metadata | `product=audio`, `grants=listen` |

**Short description:**
> The complete novel narrated, 23 chapters, about 4½ hours. Stream on the site or download the MP3s.

## Coupons

- `SUMMER` — 20% off the edition for launch (ends on a date you choose).
- `CLASSROOM10` — 10% off the classroom edition for a school that already bought one.
- A 100%-off code for family and reviewers (limit redemptions).

## Delivery, until the gate is built

Stripe sends the receipt; add a custom receipt message per product:

> Welcome aboard. Open your adventure at https://lostmansriver.com/app/ — bookmark it on the reader’s phone. Downloads are at https://lostmansriver.com/downloads/ (link valid for your purchase). Questions: hello@lostmansriver.com.

When the Cloudflare gate ships, the Stripe webhook (`checkout.session.completed`) writes the purchase key to KV and the receipt link carries it; nothing in the product copy changes.

## Ad-to-checkout copy that matches the products

- Headline: **A summer in the Everglades, read aloud.**
- Sub: One of Joelbooks’ Top 8 teen adventure novels, now a 15-hour read-and-listen adventure with real fishing skills, puzzles and a license to earn.
- Proof line: Written by a mother and son. Illustrated by Mom.
- Button: **Hear Chapter 1 free** → lostmansriver.com (then **Get the edition** on the page).
