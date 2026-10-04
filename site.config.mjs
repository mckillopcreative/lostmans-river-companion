// Site-wide settings the author controls. Everything here is safe to edit.
// After changing `domain`, re-run `npm run qr` to regenerate the printed QR codes.

export default {
  /** Canonical site URL. PLACEHOLDER until the author picks a domain (SPEC.md §8.1). */
  domain: process.env.SITE_URL || 'https://lostmansriver.example',

  /**
   * Base path. '/' for a custom domain or a user site (<user>.github.io).
   * For a GitHub *project* page without a custom domain, set BASE_PATH=/lostmans-river-companion
   * in the build environment. The QR contract assumes '/', so set a domain before printing.
   */
  base: process.env.BASE_PATH || '/',

  title: "Escape to Lostman's River",
  shortTitle: "Lostman's River",
  tagline: 'An Everglades adventure novel by Linda & John McKillop',
  authors: 'Linda & John McKillop',
  artist: 'Linda McKillop',
  /** Credit line under commissioned / generated art in assets/art (docs/VISUAL-BRIEF.md). */
  artCredit: 'Illustration for the companion site',
  /** About the authors. PLACEHOLDER: paste the bio from the back of the book (docs/OPEN-ITEMS.md). */
  authorsBio: null,

  /** Amazon listing. */
  buyUrl: 'https://www.amazon.com/dp/B0BVJ4XR65',
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

  /** Cookieless analytics. Set provider to 'plausible' or 'goatcounter' and the site id/code. */
  analytics: {
    provider: null, // 'plausible' | 'goatcounter' | null
    id: '',
  },

  /** Review pull-quotes for the Home page (SPEC.md §8.7 — author to confirm). */
  pullQuotes: [
    { text: "If you love fishing, you'll be hooked… if you don't, you'll still love it!", who: 'Amazon reviewer' },
    { text: 'The first time my son ever said he connected to the main character.', who: 'Amazon reviewer' },
  ],
  joelbooks: {
    text: "Named one of Joelbooks' Top Short Adventure Books for Teens",
    url: 'https://joelbooks.com/top-short-adventure-books-for-teens/',
  },
};
