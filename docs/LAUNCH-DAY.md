# Opening the Experience (November 2026)

*Since 2026-10-31 the site runs as if launched: the purchase gate is on (missions 2–23, their field missions, chapters 2–23 audio and the Field Journal need a key), and every Buy button goes to `/waitlist/` instead of Stripe. Two switches remain.*

## Now until opening day

- Buy buttons → `/waitlist/` (`site.config.mjs` → `checkout.open: false`). Grown-ups leave an email; the Worker stores it (`w:<email>` in KV) and sends one confirmation with a one-click "take me off the list" link.
- See the list: `GET https://api.lostmansriver.com/admin/waitlist` with header `x-admin-key` (value in `worker/.dev.vars`).
- Test families: issue free keys with `POST /admin/issue` (see `GATE-SETUP.md`) or the CREW coupon once Stripe is connected.
- Ads: the Meta pixel loads only on `/` and `/waitlist/`, only for ad-click visits; a signup reports `Lead`.

## November 26 (KDP Select ends 2026-11-25)

From the project folder:

```bash
node scripts/export-text.mjs --upload
```

It writes the text of chapters 2–23 from the manuscript and puts it in R2 (`lostmans-audio/text/`). It refuses to run before November 26 in Florida, and the Worker refuses to serve the text before midnight that night (`READER_OPENS`). Then open any chapter 2–23 on a device with a key: the text appears under the audio player.

## November 27, opening morning

1. Stripe connected and tested (`GATE-SETUP.md`: webhook, restricted key, terms checkbox, a CREW-code purchase end to end).
2. `site.config.mjs` → `checkout.open: true`; build and push. Every button now goes to Stripe; `/waitlist/` says "It's open" with the link.
3. Send the opening email to the waitlist (to build: needs the mailing address for the footer, see `OPEN-ITEMS.md`).
4. Watch: `node scripts/metrics.mjs 1 funnel`.

## After opening week

Delete the waitlist except buyers (the privacy page promises this).
