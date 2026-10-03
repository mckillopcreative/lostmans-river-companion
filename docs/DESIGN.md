# Design brief — "The Guidebook"

## One sentence
A salt-stained field guide a kid filled in over one summer, opened on a phone at a marina.

## References (feel, not copy)
- Old Peterson / Golden field guides: species on cream paper, one drawing, a few facts.
- NOAA nautical charts: the teal water, the pencil soundings, the compass rose.
- Linda McKillop's own hand-drawn Lostman's River map in `/assets/sketches/lostmans-river-hand-map.png` — its lettering and annotations ("Matt caught giant grouper here") are the site's native voice. Echo it; don't imitate it with a fake handwriting font everywhere.

## Tokens
```
--paper:        #f6f1e7   /* page */
--paper-2:      #ede5d5   /* cards, inset panels */
--ink:          #1f2a2e   /* body text */
--ink-soft:     #4b5a60
--mangrove:     #2f5d50   /* nav, headings, links */
--gulf:         #2a7f8e   /* map water, interactive states */
--sunrise:      #e8873a   /* the ONE accent: CTAs, active chapter, "fish on" */
--oyster:       #b8b2a6   /* rules, borders, muted */

dark ("night fishing"):
--paper:        #121b22
--paper-2:      #1a2730
--ink:          #e9e2d3
--ink-soft:     #a9b2b5
--mangrove:     #8fc1ad
--gulf:         #5fb3c2
--sunrise:      #f0a05c
--oyster:       #4a5559
```
Define on `:root` and redefine under `:root[data-theme="dark"]` only. Paper is the default for everyone regardless of OS setting; night mode is opt-in from the header toggle and remembered in localStorage. (Decided 2026-10-03: the OS dark default made the first impression a chalkboard, not a guidebook.) Give `body` an explicit background.

## Type
- Body: Source Serif 4 (Google Fonts), 17px/1.6 on mobile, 18px desktop. Two spaces after periods are NOT preserved on the web; don't try.
- Display: Caveat or Patrick Hand for section headers and map annotations only — think marker pen on a chart. Never for body copy or buttons.
- Mono: JetBrains Mono or system mono for tide tables, sizes, coordinates.
- Scale: 1.25 ratio. H1 ≈ 40px mobile / 56px desktop.

## Components
- **Entity card**: sketch or silhouette on paper-2, name, one-line hook, chapter pills ("Ch. 6"). Same component for fish/crew/critters/boats.
- **Chapter pill**: small rounded tag, sunrise fill when it's the current chapter.
- **Guidebook page frame**: subtle paper texture (SVG noise at ~4% opacity, not a JPEG), a faint margin rule on the left like a notebook. Use on chapter and detail pages, not on the map.
- **Map**: fills the viewport minus the header on mobile. Stepper is a bottom sheet listing chapters; current route in sunrise, past routes in oyster at 40%. Markers are small ink dots with a hover/tap label; chapter places pulse once when stepped to.
- **Rig diagram**: inline SVG, ink strokes on paper, labels in the display face. Animate the line drawing in on load (respect reduced motion).
- **Sketch display**: never on white — always on paper. Max width 900px. Caption in mono: "Ch. 9 — Linda McKillop."

## Layout
- Single column on mobile, 16px gutters. Max content width 720px for reading pages, 1100px for grids.
- Header: wordmark left ("Lostman's River" in the serif, small "a Guidebook" in display face), hamburger right. On chapter pages, a thin progress bar in sunrise showing n/23.
- Footer: Buy on Amazon, Sign up for next summer, credits, FWC link.

## Don'ts
- No stock photos of generic fishermen. No clip-art fish. No gradients.
- No cartoon mascot. The pelicans are drawn by Linda or not at all.
- No parallax, no scroll-jacking, no autoplaying audio.
- No "Welcome to…" hero copy. Open with the tarpon.
