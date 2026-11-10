// Meta Conversions API: tells Meta "a purchase happened" so ads can be measured and optimized,
// without any pixel on the pages a child uses. Reported only for purchases that began with an
// ad click: the landing page keeps the ad's fbclid for 7 days, and the Buy link carries it to
// Stripe as client_reference_id "fb1_<ms>_<fbclid>" (src/scripts/track.ts). Sent: the event,
// the price, the click id and the buyer's email as a SHA-256 hash (Meta's required form). Never
// anything about the reader.
//
// Needs META_DATASET_ID (the Lostman's River dataset / pixel id) and the secret META_CAPI_TOKEN
// (Events Manager → the dataset → Settings → Conversions API → Generate access token).
// Optional META_TEST_EVENT_CODE sends to Events Manager → Test events instead of live.
const GRAPH = 'https://graph.facebook.com/v22.0';

async function sha256(s) {
  const d = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)));
  return Array.from(d, (b) => b.toString(16).padStart(2, '0')).join('');
}

/** fb1_<ms>_<fbclid> → Meta's fbc cookie format, or null when the purchase didn't start from an ad. */
export function fbcFrom(ref) {
  // "fb1_<ms>_<fbclid>" (first form) or "v2_<campaign code>_fb1_<ms>_<fbclid>" (since 2026-11-06)
  const m = /(?:^|^v2_[a-z0-9-]*_)fb1_(\d{10,13})_([A-Za-z0-9_-]{10,180})$/.exec(ref || '');
  return m ? `fb.1.${m[1]}.${m[2]}` : null;
}

/** The first-touch campaign code carried through Stripe ("v2_<code>_…"), or ''. */
export function srcFrom(ref) {
  const m = /^v2_([a-z0-9-]{0,32})_/.exec(ref || '');
  return m ? m[1] : '';
}

/** "Started checkout" from the server, for a Buy hand-off that began with a Meta ad click. Sent:
 *  the event, the price, the ad click, the device's IP address and browser string (Meta's
 *  matching fields). No email, nothing about the reader. Same event id as the browser pixel. */
export async function reportCheckout(env, { ref, eventId, ip, ua }) {
  if (!env.META_DATASET_ID || !env.META_CAPI_TOKEN) return { sent: false, why: 'not configured' };
  const fbc = fbcFrom(ref);
  if (!fbc || !/^ic_[a-z0-9_]{6,40}$/.test(eventId || '')) return { sent: false, why: 'not from an ad' };
  const user_data = { fbc };
  if (ip) user_data.client_ip_address = ip;
  if (ua) user_data.client_user_agent = String(ua).slice(0, 400);
  const body = {
    data: [
      {
        event_name: 'InitiateCheckout',
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: 'website',
        event_source_url: 'https://lostmansriver.com/',
        user_data,
        custom_data: { value: 24.99, currency: 'USD', content_name: 'Lostman’s River: Fishing Guide Experience', content_type: 'product' },
      },
    ],
  };
  if (env.META_TEST_EVENT_CODE) body.test_event_code = env.META_TEST_EVENT_CODE;
  try {
    const r = await fetch(`${GRAPH}/${encodeURIComponent(env.META_DATASET_ID)}/events?access_token=${encodeURIComponent(env.META_CAPI_TOKEN)}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    const j = await r.json().catch(() => ({}));
    return r.ok ? { sent: true, received: j.events_received } : { sent: false, why: `meta ${r.status}: ${String(j.error?.message || '').slice(0, 160)}` };
  } catch (e) {
    return { sent: false, why: String(e.message || e).slice(0, 160) };
  }
}

export async function reportPurchase(env, session) {
  if (!env.META_DATASET_ID || !env.META_CAPI_TOKEN) return { sent: false, why: 'not configured' };
  const fbc = fbcFrom(session?.client_reference_id);
  if (!fbc) return { sent: false, why: 'not from an ad' };
  const email = String(session.customer_details?.email || session.customer_email || '').trim().toLowerCase();
  const user_data = { fbc };
  if (email) user_data.em = [await sha256(email)];
  const body = {
    data: [
      {
        event_name: 'Purchase',
        event_time: Number(session.created) || Math.floor(Date.now() / 1000),
        event_id: session.id, // one report per checkout, whichever path (webhook or welcome page) gets there first
        action_source: 'website',
        event_source_url: 'https://lostmansriver.com/',
        user_data,
        custom_data: {
          value: (Number(session.amount_total) || 0) / 100,
          currency: String(session.currency || 'usd').toUpperCase(),
          content_name: 'Lostman’s River: Fishing Guide Experience',
          content_type: 'product',
        },
      },
    ],
  };
  if (env.META_TEST_EVENT_CODE) body.test_event_code = env.META_TEST_EVENT_CODE;
  try {
    const r = await fetch(`${GRAPH}/${encodeURIComponent(env.META_DATASET_ID)}/events?access_token=${encodeURIComponent(env.META_CAPI_TOKEN)}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    const j = await r.json().catch(() => ({}));
    return r.ok ? { sent: true, received: j.events_received } : { sent: false, why: `meta ${r.status}: ${String(j.error?.message || '').slice(0, 160)}` };
  } catch (e) {
    return { sent: false, why: String(e.message || e).slice(0, 160) };
  }
}
