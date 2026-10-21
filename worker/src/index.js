// api.lostmansriver.com: the Lostman's River Worker (docs/LAUNCH-FLOW.md).
//
// The purchase is a key, not an account. Stripe's checkout.session.completed webhook (or the
// buyer's return to /app/?session_id=…) creates one random key, stores the parent's email
// against it, and emails the start link. Whoever opens /start/#<key> is in; their missions and
// badges sync under the key. Nothing about the child is stored here.
//
// Routes
//   POST /ev                    analytics counter (allow-listed events, Analytics Engine)
//   POST /stripe/webhook        Stripe → key + welcome email
//   GET  /session/:id           the key for a finished checkout (the welcome page polls this)
//   GET  /key/:key              is this key valid?
//   GET|PUT /progress/:key      the reader's missions, badges, start date
//   POST /restore               {email} → re-send the link (same answer whether or not it exists)
//   GET  /audio/:key/ch-NN.mp3  chapters 2–23 from R2, with Range support
//   GET  /qr/:key.png           the start-link QR code for the email
//   POST /admin/issue           {email, note?, send?} with x-admin-key: comps, reviewers, tests
//
// KV (binding LR): k:<key> → {email, created, session, comp}; e:<email> → key;
// s:<session> → key; p:<key> → progress; rl:<email> → restore count (1 h TTL)
import { EVENTS } from '../../src/lib/events.mjs';
import { qrPng } from './qr.js';
import { welcomeEmail } from './email.js';

const ORIGINS = [/^https:\/\/(www\.)?lostmansriver\.com$/, /^http:\/\/localhost(:\d+)?$/, /^http:\/\/127\.0\.0\.1(:\d+)?$/];
const KEY_RE = /^[A-HJ-NP-Za-km-z2-9]{24}$/; // no 0/O/1/I/l, so it survives being read aloud or retyped
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
const BADGES = new Set(['snook', 'tarpon', 'captain']);
const FROM = { email: 'help@lostmansriver.com', name: 'Lostman’s River' };

const clean = (s, n = 40) => String(s ?? '').replace(/[^\w .:/-]/g, '').slice(0, n);
const normEmail = (e) => String(e || '').trim().toLowerCase();
const okEmail = (e) => /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,}$/i.test(e);

function newKey() {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('');
}

function corsFor(request) {
  const origin = request.headers.get('origin') || '';
  return ORIGINS.some((re) => re.test(origin)) ? { 'access-control-allow-origin': origin, vary: 'origin' } : {};
}
const json = (data, status, cors) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...cors } });

// ---------- keys ----------
async function issueKey(env, { email, session = null, comp = false, note = '' }) {
  if (session) {
    const existing = await env.LR.get(`s:${session}`);
    if (existing) return { key: existing, created: false };
  }
  const key = newKey();
  const rec = { email: normEmail(email), created: new Date().toISOString(), session, comp, note: clean(note, 80) };
  await env.LR.put(`k:${key}`, JSON.stringify(rec));
  if (rec.email) await env.LR.put(`e:${rec.email}`, key);
  if (session) await env.LR.put(`s:${session}`, key);
  return { key, created: true };
}
const getKey = async (env, key) => (KEY_RE.test(key) ? JSON.parse((await env.LR.get(`k:${key}`)) || 'null') : null);

async function sendWelcome(env, email, key, opts) {
  const m = welcomeEmail(key, opts);
  // Resend (the author's existing account; free tier 3,000/month) when its key is set
  if (env.RESEND_API_KEY) {
    try {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
        body: JSON.stringify({ from: `${FROM.name} <${FROM.email}>`, to: [email], reply_to: FROM.email, subject: m.subject, html: m.html, text: m.text }),
      });
      const j = await r.json().catch(() => ({}));
      return r.ok ? { sent: true, id: j.id, via: 'resend' } : { sent: false, why: `resend ${r.status}: ${String(j.message || '').slice(0, 120)}` };
    } catch (e) {
      return { sent: false, why: `resend: ${String(e.message || e).slice(0, 120)}` };
    }
  }
  // Cloudflare Email Sending (needs Workers Paid) as the fallback
  if (!env.EMAIL) return { sent: false, why: 'no email provider: set RESEND_API_KEY' };
  try {
    const r = await env.EMAIL.send({ from: FROM, to: email, replyTo: FROM.email, subject: m.subject, html: m.html, text: m.text });
    return { sent: true, id: r?.messageId };
  } catch (e) {
    return { sent: false, why: `${e.code || 'error'}: ${String(e.message || e).slice(0, 120)}` };
  }
}

// ---------- Stripe ----------
async function verifyStripe(request, secret) {
  const sig = request.headers.get('stripe-signature') || '';
  const body = await request.text();
  const parts = Object.fromEntries(sig.split(',').map((kv) => kv.split('=')).filter((a) => a.length === 2).map(([k, v]) => [k, v]));
  const t = parts.t;
  const v1s = sig.split(',').filter((s) => s.startsWith('v1=')).map((s) => s.slice(3));
  if (!t || !v1s.length || Math.abs(Date.now() / 1000 - Number(t)) > 600) return null;
  const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const mac = new Uint8Array(await crypto.subtle.sign('HMAC', k, new TextEncoder().encode(`${t}.${body}`)));
  const hex = Array.from(mac, (b) => b.toString(16).padStart(2, '0')).join('');
  // constant-time compare against each v1
  const ok = v1s.some((v) => v.length === hex.length && [...v].reduce((a, c, i) => a | (c.charCodeAt(0) ^ hex.charCodeAt(i)), 0) === 0);
  return ok ? JSON.parse(body) : null;
}

async function fulfil(env, session) {
  if (!session || session.payment_status !== 'paid') return null;
  const email = session.customer_details?.email || session.customer_email || '';
  const { key, created } = await issueKey(env, { email, session: session.id });
  if (created && email) await sendWelcome(env, email, key);
  return key;
}

// ---------- progress ----------
function cleanProgress(p) {
  const missions = {};
  for (const id of Object.keys(p?.missions || {})) if (/^m\d{2}$/.test(id)) missions[id] = true;
  const badges = (Array.isArray(p?.badges) ? p.badges : []).filter((b) => BADGES.has(b));
  const started = /^\d{4}-\d{2}-\d{2}$/.test(p?.started || '') ? p.started : '';
  return { missions, badges: [...new Set(badges)], started, updated: new Date().toISOString() };
}

// ---------- audio ----------
async function audio(request, env, key, file, cors) {
  if (!(await getKey(env, key))) return new Response('not found', { status: 404, headers: cors });
  if (!/^ch-(0[2-9]|1\d|2[0-3])\.mp3$/.test(file)) return new Response('not found', { status: 404, headers: cors });
  if (!env.AUDIO) return new Response('audio storage not set up yet', { status: 503, headers: cors });
  const range = request.headers.get('range');
  let obj;
  if (range) {
    const m = /bytes=(\d*)-(\d*)/.exec(range);
    const head = await env.AUDIO.head(file);
    if (!head) return new Response('not found', { status: 404, headers: cors });
    const size = head.size;
    let start = m && m[1] ? Number(m[1]) : 0;
    let end = m && m[2] ? Number(m[2]) : size - 1;
    if (m && !m[1] && m[2]) (start = size - Number(m[2])), (end = size - 1);
    end = Math.min(end, size - 1);
    obj = await env.AUDIO.get(file, { range: { offset: start, length: end - start + 1 } });
    return new Response(obj.body, { status: 206, headers: { 'content-type': 'audio/mpeg', 'accept-ranges': 'bytes', 'content-range': `bytes ${start}-${end}/${size}`, 'content-length': String(end - start + 1), 'cache-control': 'private, max-age=86400', ...cors } });
  }
  obj = await env.AUDIO.get(file);
  if (!obj) return new Response('not found', { status: 404, headers: cors });
  return new Response(obj.body, { headers: { 'content-type': 'audio/mpeg', 'accept-ranges': 'bytes', 'content-length': String(obj.size), 'cache-control': 'private, max-age=86400', ...cors } });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const cors = corsFor(request);
    if (request.method === 'OPTIONS')
      return new Response(null, { status: 204, headers: { ...cors, 'access-control-allow-methods': 'GET, PUT, POST', 'access-control-allow-headers': 'content-type, range', 'access-control-max-age': '86400' } });

    // ---- analytics ----
    if (path === '/ev') {
      if (request.method !== 'POST' || !cors['access-control-allow-origin']) return new Response(null, { status: 204, headers: cors });
      let body;
      try {
        const text = await request.text();
        if (text.length > 500) return new Response(null, { status: 204, headers: cors });
        body = JSON.parse(text);
      } catch {
        return new Response(null, { status: 204, headers: cors });
      }
      const name = clean(body?.n, 32);
      if (!Object.hasOwn(EVENTS, name)) return new Response(null, { status: 204, headers: cors });
      const spec = EVENTS[name];
      env.EVENTS?.writeDataPoint({
        indexes: [name],
        blobs: [name, spec.label ? clean(body.l) : '', clean(body.s, 32), body.o ? 'own' : ''],
        doubles: [1, spec.value ? Math.max(-1e6, Math.min(1e6, Number(body.v) || 0)) : 0],
      });
      return new Response(null, { status: 204, headers: cors });
    }

    // ---- Stripe webhook ----
    if (path === '/stripe/webhook' && request.method === 'POST') {
      if (!env.STRIPE_WEBHOOK_SECRET) return new Response('webhook secret not set', { status: 503 });
      const event = await verifyStripe(request, env.STRIPE_WEBHOOK_SECRET);
      if (!event) return new Response('bad signature', { status: 400 });
      if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') await fulfil(env, event.data?.object);
      return new Response('ok');
    }

    // ---- the welcome page asks for its key ----
    let m;
    if ((m = /^\/session\/(cs_[A-Za-z0-9_]{10,200})$/.exec(path))) {
      let key = await env.LR.get(`s:${m[1]}`);
      // the webhook may be a few seconds behind the buyer; ask Stripe directly if we can
      if (!key && env.STRIPE_SECRET_KEY) {
        const r = await fetch(`https://api.stripe.com/v1/checkout/sessions/${m[1]}`, { headers: { authorization: `Bearer ${env.STRIPE_SECRET_KEY}` } });
        if (r.ok) key = await fulfil(env, await r.json());
      }
      return key ? json({ key }, 200, cors) : json({ pending: true }, 202, cors);
    }

    if ((m = /^\/key\/([A-Za-z0-9]+)$/.exec(path))) {
      const rec = await getKey(env, m[1]);
      return rec ? json({ ok: true, since: rec.created.slice(0, 10) }, 200, cors) : json({ ok: false }, 404, cors);
    }

    if ((m = /^\/progress\/([A-Za-z0-9]+)$/.exec(path))) {
      if (!(await getKey(env, m[1]))) return json({ ok: false }, 404, cors);
      if (request.method === 'GET') return json(JSON.parse((await env.LR.get(`p:${m[1]}`)) || '{}'), 200, cors);
      if (request.method === 'PUT') {
        const text = await request.text();
        if (text.length > 8000) return json({ ok: false }, 413, cors);
        let incoming;
        try {
          incoming = JSON.parse(text);
        } catch {
          return json({ ok: false }, 400, cors);
        }
        // merge, never lose a mission: two devices can both be playing
        const prev = JSON.parse((await env.LR.get(`p:${m[1]}`)) || '{}');
        const merged = cleanProgress({
          missions: { ...(prev.missions || {}), ...(incoming.missions || {}) },
          badges: [...(prev.badges || []), ...(incoming.badges || [])],
          started: [prev.started, incoming.started].filter(Boolean).sort()[0] || '',
        });
        await env.LR.put(`p:${m[1]}`, JSON.stringify(merged));
        return json(merged, 200, cors);
      }
    }

    if (path === '/restore' && request.method === 'POST') {
      const same = json({ ok: true, message: 'If that email bought the Experience, the link is on its way.' }, 200, cors);
      let email;
      try {
        email = normEmail((await request.json()).email);
      } catch {
        return same;
      }
      if (!okEmail(email)) return same;
      const n = Number((await env.LR.get(`rl:${email}`)) || 0);
      if (n >= 3) return same;
      await env.LR.put(`rl:${email}`, String(n + 1), { expirationTtl: 3600 });
      const key = await env.LR.get(`e:${email}`);
      if (key) await sendWelcome(env, email, key, { resend: true });
      return same;
    }

    if ((m = /^\/audio\/([A-Za-z0-9]+)\/([\w.-]+)$/.exec(path))) return audio(request, env, m[1], m[2], cors);

    if ((m = /^\/qr\/([A-Za-z0-9]+)\.png$/.exec(path))) {
      if (!(await getKey(env, m[1]))) return new Response('not found', { status: 404 });
      const png = await qrPng(`https://lostmansriver.com/start/#${m[1]}`, 8);
      return new Response(png, { headers: { 'content-type': 'image/png', 'cache-control': 'private, max-age=31536000, immutable' } });
    }

    if (path === '/admin/issue' && request.method === 'POST') {
      if (!env.ADMIN_KEY || request.headers.get('x-admin-key') !== env.ADMIN_KEY) return new Response('no', { status: 403 });
      const b = await request.json().catch(() => ({}));
      const email = normEmail(b.email);
      if (email && !okEmail(email)) return json({ ok: false, why: 'bad email' }, 400);
      const { key } = await issueKey(env, { email, comp: true, note: b.note || 'comp' });
      const mail = email && b.send !== false ? await sendWelcome(env, email, key) : { sent: false, why: 'not requested' };
      return json({ ok: true, key, link: `https://lostmansriver.com/start/#${key}`, mail }, 200);
    }

    if (path === '/health') return new Response('ok', { headers: cors });
    return new Response('Lostman’s River', { status: 404 });
  },
};
