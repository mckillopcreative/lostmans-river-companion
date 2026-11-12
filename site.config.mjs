// Site-wide settings the author controls. Everything here is safe to edit.
// After changing `domain`, re-run `npm run qr` to regenerate the printed QR codes.

export default {
  /** Canonical site URL (lostmansriver.com, registered 2026-10-13 at Cloudflare). */
  domain: process.env.SITE_URL || 'https://lostmansriver.com',

  /**
   * Base path. '/' for a custom domain or a user site (<user>.github.io).
   * For a GitHub *project* page without a custom domain, set BASE_PATH=/lostmans-river-companion
   * in the build environment. The QR contract assumes '/', so set a domain before printing.
   */
  base: process.env.BASE_PATH || '/',

  title: "Escape to Lostman's River",
  shortTitle: "Lostman's River",
  tagline: 'A coming-of-age fishing adventure in the Everglades, by Linda & John McKillop',
  authors: 'Linda & John McKillop',
  artist: 'Linda McKillop',
  /** Credit line under commissioned / generated art in assets/art (docs/VISUAL-BRIEF.md). */
  artCredit: 'Companion-site illustration (AI-generated from the author’s brief)',
  /** About the authors. PLACEHOLDER: paste the bio from the back of the book (docs/OPEN-ITEMS.md). */
  authorsBio:
    'John is an MD, a children’s novelist, and a father of four. Years ago he wrote <em>Escape to Lostman’s River</em> with his mom, Linda, who drew every picture in it. The Lostman’s River Experience is what came after: a way for kids to step into the Florida Everglades through an immersive story adventure that blends the novel with real-life angling skills, puzzles, and the places where it all happens.',
  authorsHeadline: 'It took us decades. We finished it together.',
  authorsEyebrow: 'mother & son · co-authors · her illustrations',

  /** The paid product: Stripe Payment Link (created 2026-10-20). Price shown on the button; change both here. */
  /** `open: false` sends every Buy button to /waitlist/ instead of Stripe (pre-launch). Set
   *  `open: true` once Stripe is connected (docs/GATE-SETUP.md). `opens` is how the buttons and the
   *  waitlist page say when: no fixed date since 2026-11-03 (KDP released the ebook early). */
  // Two products since 2026-11-11 (John): "Just me", one reader ($29.99, this url/price), and the
  // Full Crew Experience (crew, below), which the page leads with. The old $24.99 link
  // (https://buy.stripe.com/28EaEZ73B49jegveo093y00) and the $34.99 pair are retired.
  checkout: { url: 'https://buy.stripe.com/14A6oJ2Nl7lv4FV93G93y03', price: '$29.99', name: 'Lostman’s River: Fishing Guide Experience', open: true, opens: 'soon',
    // confirm sheet before Stripe (BuyConfirm.astro). Off for a one-week test from 2026-11-10:
    // 19 Buy taps → 5 Continue with it on (Nov 6–10). Set back to true to restore it.
    confirmSheet: false,
    // The Full Crew Experience: up to five readers, each with their own link, missions, badges and
    // license. The Worker issues the four extra keys (CREW_LINK) and emails them with gift cards.
    crew: { url: 'https://buy.stripe.com/eVqdRbdrZgW58Wbgw893y04', price: '$39.99', size: 5 } },

  /** The purchase gate (docs/LAUNCH-FLOW.md). While false, missions 2–23 stay open and chapters
   *  2–23 show no player, so nobody can buy into locked content. Live from 2026-10-31 (built as if
   *  launched; the Buy buttons go to the waitlist until checkout.open). */
  gate: { live: true },

  /** Amazon listing. Replace with the Associates link (…?tag=xxx-20) once the account exists. */
  buyUrl: 'https://www.amazon.com/dp/B0BV41JY8N', // the paperback (QR-code edition); Kindle is B0BVJ4XR65
  // hardcover 9798375928548 (ASIN B0BVDYCW8G) unpublished on KDP 2026-10-28; republish from the KDP bookshelf
  isbn: { paperback: '9798374178890', hardcover: '9798375928548', kindle: 'B0BVJ4XR65' },

  /** FWC recreational saltwater regulations. */
  fwcUrl: 'https://myfwc.com/fishing/saltwater/recreational/',
  npsUrl: 'https://www.nps.gov/ever/index.htm',

  /** Email list. PLACEHOLDER: set provider to 'buttondown' or 'mailchimp' and fill the action URL (SPEC.md §8.4). */
  email: {
    provider: null, // 'buttondown' | 'mailchimp' | null
    action: '', // e.g. https://buttondown.com/api/emails/embed-subscribe/<list>
    listName: 'Next Summer',
  },

  /** Analytics (docs/ANALYTICS.md). In-app events go to our own Worker (src/lib/events.mjs,
   *  worker/). Page views: Cloudflare Web Analytics, cookieless; paste its JS-beacon token here. */
  analytics: {
    cfBeaconToken: 'f5ffd0630acc4263b113274e71762aa4', // public by design; Cloudflare → Analytics & Logs → Web Analytics → lostmansriver.com → token
  },

  /** Ad pixels. Loaded ONLY on pages that opt in with <Base ads> (the parent-facing landing
   *  page), and only for visits that arrived from an ad click (fbclid / gclid / utm_medium
   *  paid). Never on the app, chapters, missions or games: children use those (COPPA). */
  ads: {
    metaPixelId: '2258563668038674', // "Lostman's River website" dataset, Events Manager (created 2026-11-03)
    googleTagId: '', // Google Ads: 'AW-…' (or GA4 'G-…')
    googleBuyLabel: '', // the conversion label for the Buy click, from Google Ads
  },

  /** Search Console: paste the content="" value of Google's HTML-tag verification here, or
   *  verify with a DNS TXT record in Cloudflare instead and leave this blank. */
  googleSiteVerification: '',

  /** Amazon reviews (verified purchases, quoted short with the reviewer's display name; 2026-10-20). */
  reviews: {
    rating: 4.7,
    count: 20,
    url: 'https://www.amazon.com/product-reviews/B0BV41JY8N',
    quotes: [
      { text: 'If you love fishing, you’ll be hooked… if you don’t, you’ll still love it!', who: 'Jay Motley' },
      { text: 'My 14-year-old really doesn’t like to read at all. It was the first time my son ever said he connected to the main character.', who: 'a parent' },
      { text: 'Bought it for my 12-year-old son who loves fishing. He said it was the best book about fishing he’d ever read.', who: 'Inna' },
      { text: 'I couldn’t put this book down! Danger, suspense, and countless feel-good moments.', who: 'Rachel' },
      { text: 'Read to children by a grandparent, and made for many enjoyable discussions about family, friendships, and making memories.', who: 'DEL' },
      { text: 'Great book and story from locals.', who: 'BeachMan' },
    ],
  },
  joelbooks: {
    text: "One of Joelbooks' Top 8 Short Adventure Books for Teens",
    url: 'https://joelbooks.com/top-short-adventure-books-for-teens/',
  },
};
