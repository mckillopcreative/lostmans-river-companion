# Opening the Experience (November 2026)

*LIVE since 2026-11-06, 9:10 AM: Stripe connected in the Lostman's River Stripe account (webhook, restricted key, terms), a CREW-code purchase tested end to end, and `checkout.open: true` pushed. The notes below are kept for the record.*

## Now until opening day

- Buy buttons → `/waitlist/` (`site.config.mjs` → `checkout.open: false`). Grown-ups leave an email; the Worker stores it (`w:<email>` in KV) and sends one confirmation with a one-click "take me off the list" link.
- See the list: `GET https://api.lostmansriver.com/admin/waitlist` with header `x-admin-key` (value in `worker/.dev.vars`).
- Test families: issue free keys with `POST /admin/issue` (see `GATE-SETUP.md`) or the CREW coupon once Stripe is connected.
- Ads: the Meta pixel loads only on `/` and `/waitlist/`, only for ad-click visits; a signup reports `Lead`.

## The reader: done 2026-11-02

KDP released the ebook from Select early (confirmed on the bookshelf). The text of chapters 2–23 is in R2 (`lostmans-audio/text/`) and appears under the audio player on any chapter page opened with a key. After editing the manuscript, re-run from the project folder:

```bash
node scripts/export-text.mjs --upload
```

## Meta purchase reporting: live since 2026-11-03

The Worker reports each purchase that began with a Meta ad click to the Conversions API (`worker/src/meta.js`). Set up 2026-11-03: dataset "Lostman's River website" (2258563668038674) under the McKillop Creative portfolio, connected to the McKillop Creative Ads account; `META_DATASET_ID` in `worker/wrangler.toml` and `site.config.mjs` → `ads.metaPixelId`; `META_CAPI_TOKEN` added as a Worker secret in the Cloudflare dashboard (wrangler's `secret put` tripped Norton); a test Purchase of $24.99 reached Events Manager → Test events.

To re-test after a change: Test events → Website → "Confirm your server's events" → copy the code, then `POST /admin/meta-test` with `{"test_code": "<code>"}` and the `x-admin-key` header.

Also 2026-11-03: hello@lostmansriver.com forwards to the author's Gmail (Cloudflare Email Routing) and is the Meta portfolio's contact email; the portfolio's business details are filled in.

## November 27, opening morning

1. Stripe connected and tested (`GATE-SETUP.md`: webhook, restricted key, terms checkbox, a CREW-code purchase end to end).
2. `site.config.mjs` → `checkout.open: true`; build and push. Every button now goes to Stripe; `/waitlist/` says "It's open" with the link.
3. Send the opening email to the waitlist: `node scripts/send-opening.mjs --dry` to see the count, `--to <your email>` to check one copy in a real inbox, then `node scripts/send-opening.mjs`. It sends 25 at a time through the Worker and never emails the same address twice (`ws:<email>` in KV).
4. Watch: `node scripts/metrics.mjs 1 funnel`.

## After opening week

Delete the waitlist except buyers (the privacy page promises this).
