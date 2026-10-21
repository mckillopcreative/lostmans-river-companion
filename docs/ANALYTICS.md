# Analytics, search and ad pixels

*Built 2026-10-21. Everything is wired; nothing reports until an id is set in `site.config.mjs`.*

## 1. Turning analytics on

Pick one cookieless provider, create the site, and paste its id into `site.config.mjs` → `analytics`:

| Provider | Cost | Funnels | Set |
|---|---|---|---|
| **Umami Cloud** (recommended) | free up to 100k events/month | yes, built in | `provider: 'umami'`, `id: '<website id>'` |
| Plausible | from $9/month | yes, on paid plans | `provider: 'plausible'`, `id: 'lostmansriver.com'` |
| GoatCounter | free | no (events show as paths) | `provider: 'goatcounter'`, `id: '<code>'` |

All three are cookieless and need no consent banner. Page views are automatic on every page. The custom events below come from `src/scripts/track.ts`.

## 2. Events

Events say what happened, never who. No names, emails, free text or device ids.

| Event | Where | Props |
|---|---|---|
| `buy_click` | the Buy button (landing page, app home) | `page` |
| `amazon_click` | "It's on Amazon" link | `page` |
| `checkout_return` | `/app/?welcome=1`, i.e. Stripe sent the buyer back | |
| `tile_click` | each tile on the app home | `tile` |
| `audio_play` | first play of a chapter's narration | `ch` |
| `audio_progress` | 25 / 50 / 75 / 100% through a chapter | `ch`, `pct` |
| `read_more` | "Keep reading" opened on the chapter 1 sample | `ch` |
| `read_end` | reached the end of the chapter 1 sample | `ch` |
| `mission_complete` | a mission done | `id` |
| `badge_earned` | snook, tarpon, captain | `badge` |
| `license_print` | the license printed | `missions` (count done) |
| `fishid_finish`, `chart_finish` | a game finished | `score` (+ `level`) |

Add a new one anywhere with `track('name', { … })`, or on a link or button with `data-track="name" data-track-foo="bar"`.

## 3. The funnels to set up in Umami

1. **Landing → purchase:** page `/` → `audio_play` (ch 1) → `buy_click` → `checkout_return`. Shows where the ad traffic stops.
2. **Listen-through:** `audio_play` ch 1 → `audio_progress` 50 → 100. Tells you whether the free chapter hooks people.
3. **The summer:** `checkout_return` → `mission_complete` m01 → m06 (snook badge) → m19 (tarpon) → m23 → `license_print`. The drop-off chart for the product itself.

Use UTM tags on every ad link (`?utm_source=facebook&utm_medium=paid&utm_campaign=launch`) so Umami can split the funnels by campaign.

## 4. Search (Google)

Built: canonical links, descriptions and share cards on every page; `og:image` sizes and `twitter:image`; structured data on the landing page (the book with its three editions, and the Experience as a product with its price); `noindex` on the license and 404; `sitemap.xml` and `robots.txt` generated at every build (`scripts/sitemap.mjs`).

To do once: **Google Search Console** → add property `lostmansriver.com` → verify with the DNS TXT record (Cloudflare → DNS → add TXT, takes two minutes) or paste the HTML-tag code into `site.config.mjs` → `googleSiteVerification` → then submit `https://lostmansriver.com/sitemap.xml`.

No star ratings in the structured data on purpose: Google does not allow ratings gathered from another site, and Amazon's 4.7 is that.

## 5. Ad pixels (Meta, Google Ads)

Set `site.config.mjs` → `ads.metaPixelId`, `ads.googleTagId` and `ads.googleBuyLabel` when the ad accounts exist. The pixel then loads under three conditions, all required:

1. the page opted in (`<Base ads>`), which today is **only the landing page `/`**;
2. an id is set;
3. the visit came from an ad click (`fbclid`, `gclid`, `wbraid`/`gbraid`, or `utm_medium=paid|cpc|ppc|paid_social`), remembered for that browser tab.

Events sent to the ad platforms: `PageView`; `ViewContent` on the first chapter 1 play; `InitiateCheckout` and the Google Ads conversion on `buy_click`.

**Never on child pages.** The app, chapters, missions, games and license never load a pixel, and children arriving by the book's QR codes never carry an ad click id. This is the COPPA line in `docs/LAUNCH-FLOW.md` §6; do not add `ads` to any other page.

**The actual purchase** should be reported server-side, from the Stripe webhook to Meta's Conversions API and Google's offline conversions, when the Cloudflare Worker is built. That gives the ad platforms the sale without a pixel on `/app/`.

## 6. Author to-do

1. Create the Umami Cloud site and send me the website id (it is not secret).
2. Google Search Console: verify and submit the sitemap.
3. When ads start: the Meta pixel id and Google Ads tag id + Buy conversion label.
