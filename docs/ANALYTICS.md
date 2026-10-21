# Analytics, search and ad pixels

*Live 2026-10-21. Modelled on the Socrates app's setup. No outside analytics company, no account to sign up for, no cookies, no identifiers.*

## 1. How it works

- **Page views and referrers:** Cloudflare Web Analytics, site `lostmansriver.com` (Cloudflare dashboard → Analytics & Logs → Web Analytics). The beacon token is in `site.config.mjs` → `analytics.cfBeaconToken`; it is public by design.
- **In-app events:** our own Worker at `https://api.lostmansriver.com/ev` (code in `worker/`, deploy with `npm run deploy:api`). The page sends a fire-and-forget beacon; the Worker writes one row to Workers Analytics Engine (dataset `lostmans_events`) only if the event name is on the allow-list in `src/lib/events.mjs`, and only from lostmansriver.com or localhost. Each row holds the event name, one short label, one number, a campaign code and an own-traffic flag. Nothing else: no IP, no device, no name.
- **The allow-list trap** (Socrates learned this one the hard way): an event missing from the list reads as zero forever. `scripts/check-events.mjs` runs in `npm run validate` and fails the build if a page sends a name the Worker would drop.
- **Your own traffic:** open any page once with `?own=1` on each of your devices (`?own=0` undoes it). Those events are tagged and left out of the numbers by default.
- **Campaigns:** the first `utm_campaign` (or `utm_source`) a browser arrives with is kept 30 days and attached to its events, so funnels split by ad.
- **Reading it:** `node scripts/metrics.mjs` (counts, last 7 days), `node scripts/metrics.mjs 30`, `node scripts/metrics.mjs funnel`. Add `--own` to include your own devices. It signs in with the existing `wrangler login`.
- **Cost:** free tier (100,000 Analytics Engine rows a day).

## 2. Events

Events say what happened, never who.

| Event | Where | Label / number |
|---|---|---|
| `buy_click` | the Buy button (landing page, app home, end of chapter 1) | page |
| `amazon_click` | the Amazon links | page |
| `checkout_return` | `/app/?welcome=1`, i.e. Stripe sent the buyer back | |
| `tile_click` | each tile on the app home | tile |
| `audio_play` | first play of a chapter's narration | chapter |
| `audio_progress` | 25 / 50 / 75 / 100% through a chapter | chapter / percent |
| `read_more` | "Keep reading" opened on the chapter 1 sample | chapter |
| `read_end` | reached the end of the chapter 1 sample | chapter |
| `mission_complete` | a mission done | mission id |
| `badge_earned` | snook, tarpon, captain | badge |
| `license_print` | the license printed | / missions done |
| `fishid_finish`, `chart_finish` | a game finished | level / score |

To add one: put it in `src/lib/events.mjs`, then call `track('name', { … })` or put `data-track="name"` on a link or button, then `npm run deploy:api` so the Worker accepts it.

## 3. The funnels

`node scripts/metrics.mjs funnel` prints these, own traffic excluded:

1. **Landing → purchase:** chapter 1 heard → chapter 1 finished → Buy clicked → back from checkout.
2. **The summer:** Mission 1 → snook badge (m06) → tarpon badge (m19) → Mission 23 → license printed.

Tag every ad link with `?utm_source=facebook&utm_medium=paid&utm_campaign=<name>` and the counts split by campaign.

## 4. Search (Google)

Built: canonical links, descriptions and share cards on every page; structured data on the landing page (the book with its three editions, and the Experience as a product with its price); `noindex` on the license and 404; `sitemap.xml` and `robots.txt` generated at every build (`scripts/sitemap.mjs`).

To do once: **Google Search Console** → add property `lostmansriver.com` → verify with the DNS TXT record (Cloudflare → DNS → add TXT) or paste the HTML-tag code into `site.config.mjs` → `googleSiteVerification` → submit `https://lostmansriver.com/sitemap.xml`.

No star ratings in the structured data on purpose: Google does not allow ratings gathered from another site, and Amazon's 4.7 is that.

## 5. Ad pixels (Meta, Google Ads)

Set `site.config.mjs` → `ads.metaPixelId`, `ads.googleTagId` and `ads.googleBuyLabel` when the ad accounts exist. The pixel then loads only when all three hold: the page opted in with `<Base ads>` (today only the landing page `/`); an id is set; and the visit came from an ad click (`fbclid`, `gclid`, `wbraid`/`gbraid`, or `utm_medium=paid|cpc|ppc|paid_social`).

**Never on child pages.** The app, chapters, missions, games and license never load a pixel, and children arriving by the book's QR codes never carry an ad click id. This is the COPPA line in `docs/LAUNCH-FLOW.md` §6.

**Report the purchase server-side.** The Socrates app found ad blockers stopped about nine in ten browser pixel events. When the Stripe webhook lands on the Worker, relay the purchase to Meta's Conversions API and Google's offline conversions from there.

## 6. Author to-do

1. Open `lostmansriver.com/?own=1` once on each of your own phones, tablets and computers.
2. Google Search Console: verify and submit the sitemap.
3. When ads start: the Meta pixel id and Google Ads tag id + Buy conversion label.
