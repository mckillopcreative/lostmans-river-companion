// One call for every analytics event: track('mission_complete', { id: 'm03' }).
// Sends a fire-and-forget beacon to our own Worker (api.lostmansriver.com/ev), which counts
// only the event names in src/lib/events.mjs. Counts only: no names, emails, free text or
// device ids leave the device. Page views are counted separately by Cloudflare Web Analytics.
// See docs/ANALYTICS.md.
import { EVENTS, EVENT_ENDPOINT } from '../lib/events.mjs';

type Props = Record<string, string | number | boolean>;
type W = Window & { lrAds?: (name: string, props?: Props) => void };

// first-touch campaign code (utm_campaign, else utm_source), kept 30 days; and an "own traffic"
// flag set by visiting any page with ?own=1 (cleared with ?own=0) so the authors' own taps
// don't swamp the numbers
function context() {
  let src = '';
  let own = false;
  try {
    const q = new URLSearchParams(location.search);
    const code = (q.get('utm_campaign') || q.get('utm_source') || '').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 32);
    const saved = JSON.parse(localStorage.getItem('lr-src') || 'null') as { c: string; t: number } | null;
    if (saved && Date.now() - saved.t < 30 * 864e5) src = saved.c;
    else if (code) {
      src = code;
      localStorage.setItem('lr-src', JSON.stringify({ c: code, t: Date.now() }));
    }
    if (q.get('own') === '1') localStorage.setItem('lr-own', '1');
    if (q.get('own') === '0') localStorage.removeItem('lr-own');
    own = localStorage.getItem('lr-own') === '1';
  } catch {}
  return { src, own };
}

/** The first-touch campaign code, so a waitlist signup can say which ad brought it. */
export const campaign = () => context().src;

export function track(name: string, props?: Props) {
  // the ad pixel (parent-facing landing page only, ad-referred visits only) mirrors a few events
  (window as W).lrAds?.(name, props);
  const spec = (EVENTS as Record<string, { label?: string; value?: string }>)[name];
  if (!spec) return; // not an allowed event; scripts/check-events.mjs catches this at build
  const body: Record<string, string | number | boolean> = { n: name };
  if (spec.label && props?.[spec.label] !== undefined) body.l = String(props[spec.label]).slice(0, 40);
  if (spec.value && props?.[spec.value] !== undefined) body.v = Number(props[spec.value]) || 0;
  const { src, own } = context();
  if (src) body.s = src;
  if (own) body.o = true;
  const payload = JSON.stringify(body);
  try {
    // text/plain keeps it a "simple" request: no CORS preflight, nothing to wait for
    const blob = new Blob([payload], { type: 'text/plain' });
    if (!navigator.sendBeacon?.(EVENT_ENDPOINT, blob)) {
      fetch(EVENT_ENDPOINT, { method: 'POST', body: payload, keepalive: true, mode: 'no-cors', headers: { 'content-type': 'text/plain' } }).catch(() => {});
    }
  } catch {}
}

/** Declarative tracking: any element with data-track="name" (and optional data-track-*
 *  props) sends that event when clicked. Bound once, from the layout. */
export function bindClicks() {
  // inline game scripts call window.lrTrack rather than importing
  (window as unknown as { lrTrack: typeof track }).lrTrack = track;
  context(); // records a campaign code or own-traffic flag from the landing URL
  document.addEventListener(
    'click',
    (e) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>('[data-track]');
      if (!el) return;
      const props: Props = {};
      for (const [k, v] of Object.entries(el.dataset)) {
        if (k.startsWith('track') && k !== 'track' && v) props[k.slice(5).replace(/^./, (c) => c.toLowerCase())] = v;
      }
      track(el.dataset.track!, Object.keys(props).length ? props : undefined);
    },
    { capture: true },
  );
}
