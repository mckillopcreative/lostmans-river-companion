// One call for every analytics event: track('mission_complete', { id: 'm03' }).
// Sends to whichever cookieless provider site.config.mjs enables (Umami, Plausible or
// GoatCounter); a no-op when none is set. Events carry only what happened, never who:
// no names, no emails, no free text, no device ids. The event list and funnel are in
// docs/ANALYTICS.md.
type Props = Record<string, string | number | boolean>;
type W = Window & {
  umami?: { track: (name: string, data?: Props) => void };
  plausible?: (name: string, opts?: { props?: Props }) => void;
  goatcounter?: { count?: (o: { path: string; title?: string; event: boolean }) => void };
  lrAds?: (name: string, props?: Props) => void;
};

const queue: [string, Props | undefined][] = [];

function send(name: string, props?: Props): boolean {
  const w = window as W;
  if (w.umami?.track) {
    w.umami.track(name, props);
    return true;
  }
  if (typeof w.plausible === 'function') {
    w.plausible(name, props ? { props } : undefined);
    return true;
  }
  if (w.goatcounter?.count) {
    const tail = props ? '/' + Object.values(props).join('/') : '';
    w.goatcounter.count({ path: `${name}${tail}`, title: name, event: true });
    return true;
  }
  return false;
}

export function track(name: string, props?: Props) {
  // the ad pixel (parent-facing landing page only, and only for ad-referred visits) mirrors
  // the few events it needs; on every other page lrAds does not exist
  (window as W).lrAds?.(name, props);
  if (!send(name, props)) queue.push([name, props]);
}

// provider scripts load deferred; flush anything tracked before they arrived
if (typeof window !== 'undefined') {
  let tries = 0;
  const flush = () => {
    while (queue.length && send(...queue[0])) queue.shift();
    if (queue.length && ++tries < 20) setTimeout(flush, 500);
  };
  window.addEventListener('load', () => setTimeout(flush, 300));
}

/** Declarative tracking: any element with data-track="name" (and optional data-track-*
 *  props) sends that event when clicked. Bound once, from the layout. */
export function bindClicks() {
  // inline game scripts call window.lrTrack rather than importing
  (window as unknown as { lrTrack: typeof track }).lrTrack = track;
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
