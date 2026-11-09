// Mail to help@ and hello@lostmansriver.com (Cloudflare Email Routing → this Worker's email()).
// Every message is forwarded to the author's inbox exactly as before; one that reads like a
// refund request also sends a flagged alert to the author's own address, so it can't sit
// unseen. Added 2026-11-09 at the author's request.
export const INBOX = 'mckillopcreative@gmail.com';
const STRIPE_ACCOUNT = 'acct_1USdgjR6rTUxNaU8'; // the Lostman's River Stripe account

// words people use when they want their money back (or say the charge was a mistake)
const REFUND_RE =
  /\b(refunds?|refunded|refunding|money back|reimburse\w*|charge ?backs?|dispute[ds]?|cancel(?:l?ed)? (?:my|the|this|our) (?:order|purchase|payment|subscription)|didn[’']?t (?:authori[sz]e|order|mean to (?:buy|order|purchase))|unauthori[sz]ed (?:charge|purchase|payment)|charged (?:twice|by mistake|in error)|bought (?:it )?by mistake|wrong (?:book|purchase|item))\b/i;
// our own addresses and robots never count (stops a reply to an alert from re-alerting)
const SKIP_FROM_RE = /(@lostmansriver\.com|mckillopx3@gmail\.com|mckillopcreative@gmail\.com|mailer-daemon|postmaster|no-?reply)/i;

const td = new TextDecoder();
function b64(s) {
  try {
    const bin = atob(s.replace(/[^A-Za-z0-9+/=]/g, ''));
    return td.decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
  } catch {
    return '';
  }
}
function qp(s) {
  const bytes = [];
  const t = s.replace(/=\r?\n/g, '');
  for (let i = 0; i < t.length; i++) {
    if (t[i] === '=' && /^[0-9A-F]{2}$/i.test(t.slice(i + 1, i + 3))) {
      bytes.push(parseInt(t.slice(i + 1, i + 3), 16));
      i += 2;
    } else bytes.push(...new TextEncoder().encode(t[i]));
  }
  return td.decode(new Uint8Array(bytes));
}
/** "=?UTF-8?B?…?=" and "=?UTF-8?Q?…?=" header words → plain text */
export function decodeWords(h) {
  return String(h || '')
    .replace(/\?=\s+=\?/g, '?==?')
    .replace(/=\?[^?]+\?([BbQq])\?([^?]*)\?=/g, (_, enc, txt) => (enc.toUpperCase() === 'B' ? b64(txt) : qp(txt.replace(/_/g, ' '))));
}
function decodePart(headers, body) {
  const enc = (/content-transfer-encoding:\s*([\w-]+)/i.exec(headers) || [])[1]?.toLowerCase();
  if (enc === 'base64') return b64(body);
  if (enc === 'quoted-printable') return qp(body);
  return body;
}
const stripHtml = (s) =>
  s.replace(/<(style|script)[\s\S]*?<\/\1>/gi, ' ').replace(/<br\s*\/?>|<\/p>/gi, '\n').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;|&rsquo;/g, '’').replace(/&quot;/g, '"');
/** The readable body of a raw email: the text/plain part, else the HTML part without tags. */
export function bodyText(raw) {
  const split = (s) => {
    const m = /\r?\n\r?\n/.exec(s);
    return m ? [s.slice(0, m.index), s.slice(m.index + m[0].length)] : [s, ''];
  };
  const [topHeaders, topBody] = split(raw);
  if (!/content-type:\s*multipart\//i.test(topHeaders)) {
    const t = decodePart(topHeaders, topBody);
    return /content-type:\s*text\/html/i.test(topHeaders) ? stripHtml(t) : t;
  }
  // every MIME boundary line starts with "--", so splitting on them reaches nested parts too
  const parts = topBody.split(/^--[^\r\n]+\r?$/m).map((p) => split(p.replace(/^\r?\n/, '')));
  const plain = parts.find(([h]) => /content-type:\s*text\/plain/i.test(h));
  if (plain) return decodePart(...plain);
  const html = parts.find(([h]) => /content-type:\s*text\/html/i.test(h));
  return html ? stripHtml(decodePart(...html)) : '';
}
/** Does this read like someone asking for their money back? */
export function looksLikeRefund(subject, text) {
  return REFUND_RE.test(`${subject}\n${String(text).slice(0, 20000)}`);
}
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

/** The flagged alert: who, what they wrote, and the three steps to handle it. */
export function refundAlert({ from, to, subject, text, when }) {
  const who = (/<([^>]+)>/.exec(from) || [])[1] || from;
  const snippet = text.replace(/\r/g, '').replace(/\n{3,}/g, '\n\n').trim().slice(0, 700);
  const stripe = `https://dashboard.stripe.com/${STRIPE_ACCOUNT}/search?query=${encodeURIComponent(who)}`;
  const subj = `🚩 Refund request: ${who}`;
  const steps = [
    `Find their payment in Stripe: ${stripe}`,
    'Refund it there (Payments → the payment → Refund). The promise on the site is a 30-day refund, no questions asked.',
    `Reply to ${who} so they know it's done. The full email is in ${INBOX}.`,
  ];
  const textOut = `A customer may be asking for a refund.\n\nFrom: ${from}\nTo: ${to}\nSubject: ${subject}\nReceived: ${when} ET\n\nWhat they wrote:\n${snippet}\n\nWhat to do:\n${steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n— Lostman's River`;
  const html = `<div style="font-family:Georgia,serif;max-width:560px;color:#1d2a24">
<p style="margin:0 0 4px;font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:#a4471c">Lostman’s River · refund flag</p>
<h2 style="margin:0 0 12px;font-size:20px">A customer may be asking for a refund</h2>
<table style="font-size:14px;border-collapse:collapse;margin-bottom:12px">
<tr><td style="padding:2px 10px 2px 0;color:#5b6b63">From</td><td>${esc(from)}</td></tr>
<tr><td style="padding:2px 10px 2px 0;color:#5b6b63">To</td><td>${esc(to)}</td></tr>
<tr><td style="padding:2px 10px 2px 0;color:#5b6b63">Subject</td><td>${esc(subject)}</td></tr>
<tr><td style="padding:2px 10px 2px 0;color:#5b6b63">Received</td><td>${esc(when)} ET</td></tr></table>
<p style="margin:0 0 4px;font-weight:bold">What they wrote</p>
<blockquote style="margin:0 0 14px;padding:10px 12px;background:#f6f1e6;border-left:3px solid #a4471c;white-space:pre-wrap;font-size:14px">${esc(snippet)}</blockquote>
<p style="margin:0 0 4px;font-weight:bold">What to do</p>
<ol style="margin:0 0 14px;padding-left:20px;font-size:14px">
<li><a href="${stripe}">Find their payment in Stripe</a></li>
<li>Refund it there (Payments → the payment → Refund). The promise on the site is a 30-day refund, no questions asked.</li>
<li>Reply to ${esc(who)} so they know it’s done. The full email is in ${INBOX}.</li></ol>
<p style="font-size:12px;color:#5b6b63">Sent by the Lostman’s River mail handler because the email mentioned a refund. Every email to help@ and hello@ still reaches ${INBOX} as before.</p></div>`;
  return { subject: subj, text: textOut, html };
}

/** Cloudflare Email Routing hands each message here. */
export async function handleEmail(message, env, ctx, { sendMail, notify }) {
  // forward first, always: the inbox must never miss mail because the check below failed
  await message.forward(INBOX);
  try {
    const from = message.headers.get('from') || message.from || '';
    if (SKIP_FROM_RE.test(from) || SKIP_FROM_RE.test(message.from || '')) return;
    const subject = decodeWords(message.headers.get('subject') || '(no subject)');
    const raw = message.rawSize > 2_000_000 ? '' : await new Response(message.raw).text();
    const text = raw ? bodyText(raw) : '';
    if (!looksLikeRefund(subject, text)) return;
    const when = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
    ctx.waitUntil(sendMail(env, notify, refundAlert({ from: decodeWords(from), to: message.to, subject, text, when })));
    env.EVENTS?.writeDataPoint({ indexes: ['refund_request'], blobs: ['refund_request', '', '', ''], doubles: [1, 0] });
  } catch (e) {
    console.log('refund check failed', String(e?.message || e).slice(0, 200));
  }
}
