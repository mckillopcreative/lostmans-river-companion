# Open items for the author
See SPEC.md §8. Placeholders used during the build are listed here with where they live.

## Needed before printing QR codes
- [ ] **Domain name.** Set `domain` in `site.config.mjs` (currently `https://lostmansriver.example`), add a `CNAME` file in `public/` with the bare domain, point DNS at GitHub Pages, then run `npm run qr`. Until a custom domain is set, GitHub builds the site under `/<repo-name>/`, which does not match the printed `/ch/<n>/` paths.

## Content placeholders on the live site
- [ ] **Dedication photo caption** — `src/pages/about.astro`, marked `[Caption to come from the author.]`. Who are the three anglers?
- [ ] **Email sign-up** — `site.config.mjs` → `email.provider` and `email.action`. Forms show "Sign-up opens soon." until set. Buttondown is simplest (free tier, no cookies): the action URL is `https://buttondown.com/api/emails/embed-subscribe/<username>`.
- [ ] **Analytics** — `site.config.mjs` → `analytics`. Plausible (paid) or GoatCounter (free). Both cookieless. QR landings show up as visits to `/ch/<n>/`.
- [ ] **Review pull-quotes** — `site.config.mjs` → `pullQuotes`. Two suggested quotes are in place; confirm wording and attribution, or remove.
- [ ] **Joelbooks mention** — kept on Home and About; remove from `site.config.mjs` if unwanted.

## The chart
- [ ] **Verify coordinates** in `data/places.json`. Real places were placed from memory of the chart and need a check against NOAA chart 11430 / USGS GNIS. Fictional spots to pin by hand: `dans-cottage`, `docs-house`, `south-point`, `anglers-motel-dock`, `port-of-the-everglades`, `backcountry`, `crooked-creek`.
- [ ] **Hand-drawn map overlay bounds** — `src/pages/map.astro`, `data.overlay.bounds`. Toggle "Linda's hand-drawn map" on the chart and nudge the south/west/north/east numbers until the river mouth lines up.
- [ ] Basemap is OpenStreetMap. If a nautical look is wanted, the Esri Ocean basemap looks right but check its terms before switching the tile URL.

## Assets
- [ ] Higher-resolution scans of the eleven sketches (current scans are 900–1300 px; the site trims and serves them at up to 1600 px wide).
- [ ] Any additional sketches not in the manuscript — drop them in `assets/sketches/`, add an entry to `data/sketches.json`, and reference the file from the chapter or entity that should show it.
- [ ] Family photos of the real places and boats for the Boats and Critters pages (record each in `docs/CREDITS.md`).

## Text decisions
- [ ] The book's title page says 1992 but the story has a cell phone, Instagram and Alexa. The site shows no year; decide for the reprint.
- [ ] Characters with no sketch show a plain line-drawing placeholder and the note "No sketch yet." Fine to leave, or commission Linda for Dan, Snapper and Rose.
