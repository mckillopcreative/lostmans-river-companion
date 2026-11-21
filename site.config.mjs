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
  // 2026-11-15 (John): every Buy button starts at one reader, $24.99, and opens the confirm sheet,
  // where a toggle adds the Full Boat bonus (the crew product below, +$15). Why: from Nov 12 to 15
  // the page led with the $39.99 crew and Stripe logged checkouts opened and left with nothing
  // typed, and no sales; the $24.99 link had sold before. This is the launch $24.99 link, switched
  // back on in Stripe with tax collection and adjustable quantity off. The $29.99 link
  // (https://buy.stripe.com/14A6oJ2Nl7lv4FV93G93y03) is still active for emails already sent.
  checkout: { url: 'https://buy.stripe.com/28EaEZ73B49jegveo093y00', price: '$24.99', name: 'Lostman’s River: Fishing Guide Experience', open: true, opens: 'soon',
    // confirm sheet before Stripe (BuyConfirm.astro). It was off Nov 10–15 (19 Buy taps → 5 Continue
    // with it on, Nov 6–10); back on 2026-11-15 because it now carries the Full Boat toggle.
    confirmSheet: true,
    // Holiday "buy one, give one" (John, 2026-11-16): every one-reader purchase also gets a second
    // Experience to give, with its own link and gift card. It ends by itself at `until` (the pages
    // hide the offer in the browser after that moment, and stop building it in). The Worker gives
    // the second key by its own BOGO_UNTIL in worker/wrangler.toml: KEEP THE TWO THE SAME. To end
    // it early, delete this line, deploy, and set BOGO_UNTIL to a past date.
    bogo: { until: '2027-01-01T05:00:00Z', through: 'December 31' },
    // The Full Crew Experience: up to five readers, each with their own link, missions, badges and
    // license. The Worker issues the four extra keys (CREW_LINK) and emails them with gift cards.
    // Since 2026-11-15 nobody is sent straight to this link from the page: it is the sheet's
    // "Full Boat bonus" toggle. `tag` is the small label on that toggle (John, 2026-11-13).
    // Delete the tag (or set it to '') when the holidays are over.
    crew: { url: 'https://buy.stripe.com/eVqdRbdrZgW58Wbgw893y04', price: '$39.99', size: 5, tag: 'Holiday Special' },
    // Wild Florida, the add-on (John, 2026-11-16): a second switch on the confirm sheet, with a
    // "What's this?" drop-down. One price covers every seat in the boat: the buyer's key, the
    // buy-one-give-one key and a full crew all get it. `url` = one reader + Wild Florida ($34.98),
    // `crewUrl` = the Full Crew + Wild Florida ($49.98), `addUrl` = Wild Florida alone, for a
    // family that already has the Experience (the Wild Florida page sends their key with it).
    // The Worker knows the same three links and the product (worker/wrangler.toml WILD_*).
    wild: {
      price: '$9.99',
      url: 'https://buy.stripe.com/6oU8wRew30X70pFfs493y05',
      crewUrl: 'https://buy.stripe.com/00w14pcnVfS14FV3Jm93y06',
      addUrl: 'https://buy.stripe.com/bJe14pew3gW55JZcfS93y07',
    } },

  /** The purchase gate (docs/LAUNCH-FLOW.md). While false, missions 2–23 stay open and chapters
   *  2–23 show no player, so nobody can buy into locked content. Live from 2026-10-31 (built as if
   *  launched; the Buy buttons go to the waitlist until checkout.open). */
  gate: { live: true },

  /** Amazon listing. Replace with the Associates link (…?tag=xxx-20) once the account exists. */
  buyUrl: 'https://www.amazon.com/dp/B0BV41JY8N', // the paperback (QR-code edition); Kindle is B0BVJ4XR65
  // The paperback as the Crew Pass edition ($34.99, the Experience for five readers unlocked from its
  // last page at /pass/). Submitted to KDP 2026-11-20; it shows on Amazon when KDP's review ends (up to
  // 72 hours). Set this to true THAT day and deploy: the landing page's Amazon card then says what the
  // book includes and links to /pass/. While it is false the card describes the plain book.
  // Turned on 2026-11-20: KDP shows the paperback Live at $34.99 with the new interior and description.
  amazonCrewPass: true,
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
    googleTagId: 'AW-18571980846', // Google Ads account 427-546-3184 (created 2026-11-12)
    googleBuyLabel: 'GjaDCI3Pr7cdEK7g55dF', // conversion "Checkout tap (to Stripe)", Begin checkout category
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
      // A comment on the Facebook ad post, 2026-11-13; Dan gave John permission to quote it (2026-11-15).
      // `source` replaces the default "Amazon review" label so it is never mistaken for one.
      { text: 'I’m getting in the guts of this book, and it’s really good!', who: 'Dan T.', source: 'reader, on Facebook' },
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
