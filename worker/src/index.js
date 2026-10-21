// api.lostmansriver.com: the Lostman's River Worker.
// Today: POST /ev, the analytics counter. Later (docs/LAUNCH-FLOW.md §4): the Stripe webhook,
// purchase keys, progress sync and restore.
//
// /ev accepts {n, l?, v?, s?, o?} as text/plain, checks n against the shared allow-list, and
// writes one Analytics Engine data point: index = event name, blobs = [name, label, campaign,
// own], doubles = [1, value]. Nothing else is stored; no IP, user agent or identifier.
import { EVENTS } from '../../src/lib/events.mjs';

const ORIGINS = [/^https:\/\/(www\.)?lostmansriver\.com$/, /^http:\/\/localhost(:\d+)?$/, /^http:\/\/127\.0\.0\.1(:\d+)?$/];
const clean = (s, n = 40) => String(s ?? '').replace(/[^\w .:/-]/g, '').slice(0, n);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('origin') || '';
    const cors = ORIGINS.some((re) => re.test(origin)) ? { 'access-control-allow-origin': origin, vary: 'origin' } : {};

    if (url.pathname === '/ev') {
      if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...cors, 'access-control-allow-methods': 'POST', 'access-control-allow-headers': 'content-type', 'access-control-max-age': '86400' } });
      if (request.method !== 'POST') return new Response('method', { status: 405, headers: cors });
      // only our own pages may count (beacons always send an Origin header)
      if (!cors['access-control-allow-origin']) return new Response(null, { status: 204 });
      let body;
      try {
        const text = await request.text();
        if (text.length > 500) return new Response(null, { status: 204, headers: cors });
        body = JSON.parse(text);
      } catch {
        return new Response(null, { status: 204, headers: cors });
      }
      const name = clean(body?.n, 32);
      if (!Object.hasOwn(EVENTS, name)) return new Response(null, { status: 204, headers: cors }); // not on the list: dropped
      const spec = EVENTS[name];
      const label = spec.label ? clean(body.l) : '';
      const value = spec.value ? Math.max(-1e6, Math.min(1e6, Number(body.v) || 0)) : 0;
      env.EVENTS?.writeDataPoint({
        indexes: [name],
        blobs: [name, label, clean(body.s, 32), body.o ? 'own' : ''],
        doubles: [1, value],
      });
      return new Response(null, { status: 204, headers: cors });
    }

    if (url.pathname === '/health') return new Response('ok', { headers: cors });
    return new Response('Lostman’s River', { status: 404 });
  },
};
