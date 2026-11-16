// The allowed analytics events, shared by the page (src/scripts/track.ts) and the Worker
// (worker/src/index.js). The Worker drops anything not listed here, and
// scripts/check-events.mjs fails the build if the page sends a name that is missing: a
// forgotten name would otherwise read as zero forever (lesson from the Socrates app).
//
// Each event may carry ONE short label and ONE number, nothing else. No names, emails,
// free text or identifiers: children use this app.
//   label: which prop becomes the text label   value: which prop becomes the number
export const EVENTS = {
  landing_view: { label: 'page' }, // one per visit to a grown-up page, with the campaign code
  scroll: { label: 'page', value: 'pct' }, // 50 and 90% of the landing page, once each
  sample_click: { label: 'page' }, // "Try the first chapter now"
  landing_click: { label: 'to' }, // any other link on the landing page, by where it goes (ch, app, map, fish, …)
  purchase: { label: 'src', value: 'usd' }, // written by the Worker at fulfilment, never by a page
  // buy_click and crew_click labels say where the button was: "/:card" = the landing offer card,
  // "<page>:sticky" = the floating button, "/:pill" = the landing hero pill, a bare page = any other Buy button
  buy_click: { label: 'page' }, // the Buy tap (opens the confirm sheet)
  crew_click: { label: 'page' }, // the Full Crew Experience ($39.99, up to five readers) handed to Stripe. Since 2026-11-15 that is the sheet's Continue with the Full Boat toggle on (label "<page>:sheet")
  hook_click: { label: 'page' }, // until 2026-11-15: the hero pill scrolling to the offer card. Now the pill is buy_click "/:pill"
  card_view: { label: 'page', value: 'step' }, // the offer card seen, once each per visit: step 1 = its heading on screen, step 2 = its buy buttons on screen
  pair_click: { label: 'page' }, // the "Keep one, give one" ($34.99, two Experiences) tap: straight to Stripe
  confirm_go: { label: 'page' }, // "Continue to secure checkout" on the sheet: the real hand-off to Stripe
  confirm_close: { label: 'page' }, // the sheet dismissed
  boat_toggle: { label: 'page', value: 'on' }, // the sheet's Full Boat bonus switch: value 1 = switched on, 0 = switched off
  wild_toggle: { label: 'page', value: 'on' }, // the sheet's Wild Florida add-on switch (+$9.99): value 1 = switched on, 0 = off
  wild_what: { label: 'page' }, // the sheet's "What's this?" under the add-on, opened
  wild_go: { label: 'page' }, // Continue with the add-on switched on (sent as well as confirm_go or crew_click)
  wild_add_click: { label: 'page' }, // "Add Wild Florida $9.99" on the Wild Florida page, by a family that has the Experience: straight to Stripe
  wild_sale: { label: 'src', value: 'usd' }, // written by the Worker: the add-on sold, with a purchase (by campaign) or on its own ("upgrade")
  waitlist_click: { label: 'page' },
  waitlist_join: { label: 'page' },
  offer_view: { label: 'page' }, // the holiday promo-code sheet shown
  offer_join: { label: 'page' }, // an email left for the code
  offer_close: { label: 'page' }, // the sheet dismissed
  amazon_click: { label: 'page' },
  checkout_return: {},
  tile_click: { label: 'tile' },
  audio_play: { label: 'ch' },
  audio_progress: { label: 'ch', value: 'pct' },
  read_more: { label: 'ch' },
  read_end: { label: 'ch' },
  read_pages: { label: 'ch' },
  mission_complete: { label: 'id' },
  badge_earned: { label: 'badge' },
  license_print: { value: 'missions' },
  field_signoff: { label: 'id' },
  journal_print: { value: 'signed' },
  fishid_finish: { label: 'level', value: 'score' },
  chart_finish: { value: 'score' },
  rig_finish: { label: 'level', value: 'score' }, // Rig It Right: a level of six scenarios finished (Guide School, 2026-11-15)
  wild_round: { label: 'mode', value: 'score' }, // Wild Florida: a round finished (name, clue, apart, speed), by mode
  wild_test: { label: 'result', value: 'score' }, // Wild Florida: the test finished, pass or fail
  keeper_finish: { label: 'level', value: 'score' }, // Keeper or Release? (Guide School, 2026-11-16): a level of eight fish finished
  manual_play: { label: 'lesson' }, // Training Manual: a lesson started (once per lesson per visit)
  manual_done: { label: 'lesson' }, // Training Manual: a lesson heard to the end for the first time on this device
  guide_pdf: {}, // Matt's Fishing Journal: the ready-made PDF opened from the page (key holders only)
  guide_print: {}, // Matt's Fishing Journal: the print / save-as-PDF button (key holders only)
  boat_lesson: { label: 'id' }, // Learn the Boat: a lesson passed for the first time on this device
};

/** The analytics endpoint on the Worker. */
export const EVENT_ENDPOINT = 'https://api.lostmansriver.com/ev';
