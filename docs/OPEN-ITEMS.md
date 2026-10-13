# Open items for the author
See SPEC.md §8. Placeholders used during the build are listed here with where they live.

## Needed before printing QR codes
- [x] **Domain name** — lostmansriver.com, registered at Cloudflare 2026-10-13. GitHub side done: `public/CNAME`, repo variables `SITE_URL`/`BASE_PATH`, Pages custom domain set, QR codes regenerated.
- [x] **Cloudflare DNS** — nine records added 2026-10-13 (4 A, 4 AAAA, CNAME www), all DNS only; SSL/TLS mode Full. Records for reference (dash.cloudflare.com → lostmansriver.com → DNS → Records), all with the proxy OFF (grey cloud, “DNS only”):
  - A `@` → 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153 (four records)
  - AAAA `@` → 2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153, 2606:50c0:8003::153
  - CNAME `www` → mckillopcreative.github.io
  - Cloudflare → SSL/TLS → set mode to **Full** (not Flexible), and leave “Always use HTTPS” off until GitHub’s certificate is issued.
  Then in GitHub (Settings → Pages) wait for the DNS check to pass and tick **Enforce HTTPS**, or run `gh api -X PUT repos/mckillopcreative/lostmans-river-companion/pages -f https_enforced=true`.

## Content placeholders on the live site
- [ ] **Dedication photo caption** — `src/pages/about.astro`, marked `[Caption to come from the author.]`. Who are the three anglers?
- [ ] **Email sign-up** — `site.config.mjs` → `email.provider` and `email.action`. Forms show "Sign-up opens soon." until set. Buttondown is simplest (free tier, no cookies): the action URL is `https://buttondown.com/api/emails/embed-subscribe/<username>`.
- [ ] **Analytics** — `site.config.mjs` → `analytics`. Plausible (paid) or GoatCounter (free). Both cookieless. QR landings show up as visits to `/ch/<n>/`.
- [ ] **Review pull-quotes** — `site.config.mjs` → `pullQuotes`. Two suggested quotes are in place; confirm wording and attribution, or remove.
- [ ] **Joelbooks mention** — kept on Home and About; remove from `site.config.mjs` if unwanted.

## The chart
- [ ] **Verify coordinates** in `data/places.json`. Real places were placed from memory of the chart and need a check against NOAA chart 11430 / USGS GNIS. Fictional spots to pin by hand: `dans-cottage`, `docs-house`, `south-point`, `anglers-motel-dock`, `port-of-the-everglades`, `backcountry`, `crooked-creek`.
- [ ] **Hand-drawn map overlay bounds** — `src/pages/map.astro`, `data.overlay.bounds`. Toggle "Linda's hand-drawn map" on the chart and nudge the south/west/north/east numbers until the river mouth lines up. In the browser console `lostmansMap.getBounds().toBBoxString()` prints the current view as `west,south,east,north`, which helps find good numbers.
- [ ] Basemap is OpenStreetMap. If a nautical look is wanted, the Esri Ocean basemap looks right but check its terms before switching the tile URL.

## Assets
- [ ] Higher-resolution scans of the eleven sketches (current scans are 900–1300 px; the site trims and serves them at up to 1600 px wide).
- [ ] Any additional sketches not in the manuscript — drop them in `assets/sketches/`, add an entry to `data/sketches.json`, and reference the file from the chapter or entity that should show it.
- [ ] Family photos of the real places and boats for the Boats and Critters pages (record each in `docs/CREDITS.md`).

## Text decisions
- [ ] The book's title page says 1992 but the story has a cell phone, Instagram and Alexa. The site shows no year; decide for the reprint.
- [ ] Characters with no sketch show a plain line-drawing placeholder and the note "No sketch yet." Fine to leave, or commission Linda for Dan, Snapper and Rose.

## Visuals (added 2026-10-03)
- [ ] **Hi-res cover file.** `assets/cover/cover-thumbnail.png` is 129 × 199 px; drop the KDP cover JPG/PDF export in `assets/cover/` (any name without "thumb") and the site uses it.
- [ ] **Author photo** → `assets/photos/authors.jpg` (Linda and John). The About page shows a dashed slot until it exists.
- [ ] **Author bio** → `authorsBio` in `site.config.mjs` (paste the back-of-book bio).
- [x] **Generated art installed** (183 files, 2026-10-11) as WebP web masters. Re-import from the pack with `node scripts/import-art.mjs <pack>/assets/art` if GPT delivers corrections.
- [ ] **Knot diagrams** are drafts: have an angler trace each one before the Tackle Box is used as instruction. Steps and links are in `data/knots.json`.
- [ ] **Review the portraits and places** for anything that contradicts the book (hair, boats, buildings). Replacements go in the same path with the same id.
- [ ] **Wording of the art credit** — `artCredit` in `site.config.mjs` and the Credits page.
