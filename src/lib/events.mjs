// The allowed analytics events, shared by the page (src/scripts/track.ts) and the Worker
// (worker/src/index.js). The Worker drops anything not listed here, and
// scripts/check-events.mjs fails the build if the page sends a name that is missing: a
// forgotten name would otherwise read as zero forever (lesson from the Socrates app).
//
// Each event may carry ONE short label and ONE number, nothing else. No names, emails,
// free text or identifiers: children use this app.
//   label: which prop becomes the text label   value: which prop becomes the number
export const EVENTS = {
  buy_click: { label: 'page' },
  waitlist_click: { label: 'page' },
  waitlist_join: { label: 'page' },
  amazon_click: { label: 'page' },
  checkout_return: {},
  tile_click: { label: 'tile' },
  audio_play: { label: 'ch' },
  audio_progress: { label: 'ch', value: 'pct' },
  read_more: { label: 'ch' },
  read_end: { label: 'ch' },
  mission_complete: { label: 'id' },
  badge_earned: { label: 'badge' },
  license_print: { value: 'missions' },
  field_signoff: { label: 'id' },
  journal_print: { value: 'signed' },
  fishid_finish: { label: 'level', value: 'score' },
  chart_finish: { value: 'score' },
};

/** The analytics endpoint on the Worker. */
export const EVENT_ENDPOINT = 'https://api.lostmansriver.com/ev';
