// The welcome email (docs/LAUNCH-FLOW.md §5): written for a parent reading on their own phone
// or computer while the reader plays on a different device. The QR code is in the email.
const SITE = 'https://lostmansriver.com';
const API = 'https://api.lostmansriver.com';
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

export function startLink(key) {
  return `${SITE}/start/#${key}`;
}

export function welcomeEmail(key, { resend = false } = {}) {
  const link = startLink(key);
  const qr = `${API}/qr/${key}.png`;
  const subject = resend ? 'Your Lostman’s River link, again' : 'Your reader’s summer at Lostman’s River starts here';
  const text = [
    resend ? 'Here is your link again.' : 'Welcome aboard.',
    '',
    'Get your reader started in under a minute, on their own device:',
    '1. On their tablet or phone, open the camera and point it at the code in this email.',
    '2. Tap the link that pops up. Mission 1 is waiting.',
    '3. That’s it. Their device remembers them. Next time they just open lostmansriver.com/app.',
    '',
    `No camera handy? Forward this email, or text them this link: ${link}`,
    '',
    'Switching devices, or the browser was cleared? Open the same link on the new device and the summer picks up where they left off.',
    `Lost this email? Go to ${SITE}/restore/ and enter this email address.`,
    '',
    'What we keep: your email, so we can send the link. Your reader’s missions and badges are saved under the link, not under their name. We never ask your child for their name, email or anything else.',
    '',
    'Keep this link to your family. Anyone with it can open your summer.',
    '',
    'Questions? Just reply. 30-day refund, no questions asked.',
    '',
    'Linda and John McKillop',
  ].join('\n');

  const p = (s, extra = '') => `<p style="margin:0 0 14px;font-size:16px;line-height:1.5;color:#1f2a2e;${extra}">${s}</p>`;
  const html = `<!doctype html><html><body style="margin:0;padding:0;background:#f6f1e7;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f1e7;"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;width:100%;background:#fbf8f1;border:1px solid #e2d9c7;border-radius:14px;">
<tr><td style="padding:28px 28px 8px;font-family:Georgia,'Times New Roman',serif;">
  <p style="margin:0 0 4px;font-size:14px;color:#a04d12;font-style:italic;">${resend ? 'Here it is again' : 'Welcome aboard'}</p>
  <h1 style="margin:0 0 18px;font-size:26px;line-height:1.2;color:#2f5d50;">Summer Fishing Guide Experience</h1>
  ${p('<strong>Get your reader started in under a minute, on their own device:</strong>')}
  ${p('<strong>1.</strong> On their tablet or phone, open the camera and point it at this code.')}
</td></tr>
<tr><td align="center" style="padding:4px 28px 12px;">
  <img src="${qr}" width="220" height="220" alt="QR code that opens the Experience" style="display:block;width:220px;height:220px;border:0;border-radius:8px;">
</td></tr>
<tr><td style="padding:8px 28px 8px;font-family:Georgia,'Times New Roman',serif;">
  ${p('<strong>2.</strong> Tap the link that pops up. Mission 1 is waiting.')}
  ${p('<strong>3.</strong> That’s it. Their device remembers them. Next time they just open lostmansriver.com/app.')}
  ${p(`No camera handy? Forward this email to a device they use, or text them this link:<br><a href="${esc(link)}" style="color:#2a7f8e;word-break:break-all;">${esc(link)}</a>`)}
</td></tr>
<tr><td align="center" style="padding:4px 28px 18px;">
  <a href="${esc(link)}" style="display:inline-block;background:#e8873a;color:#1f2a2e;font-family:Georgia,serif;font-weight:bold;font-size:16px;text-decoration:none;padding:12px 22px;border-radius:999px;">Open it on this device</a>
</td></tr>
<tr><td style="padding:0 28px 24px;font-family:Georgia,'Times New Roman',serif;">
  ${p('<strong>Switching devices, or the browser was cleared?</strong> Scan the same code or open the same link on the new device and the summer picks up exactly where they left off.', 'font-size:15px;')}
  ${p(`<strong>Lost this email?</strong> Go to <a href="${SITE}/restore/" style="color:#2a7f8e;">lostmansriver.com/restore</a> and enter this email address.`, 'font-size:15px;')}
  ${p('<strong>What we keep:</strong> your email, so we can send the link. Your reader’s missions and badges are saved under the link, not under their name. We never ask your child for their name, email or anything else, and there are no ads or trackers in the Experience.', 'font-size:14px;color:#4b5a60;')}
  ${p('Keep this link to your family. Anyone with it can open your summer.', 'font-size:14px;color:#4b5a60;')}
  ${p('Questions? Just reply; it comes to us. 30-day refund, no questions asked.', 'font-size:14px;color:#4b5a60;')}
  <p style="margin:18px 0 0;font-size:16px;color:#2f5d50;font-style:italic;">Linda and John McKillop</p>
</td></tr>
</table></td></tr></table></body></html>`;
  return { subject, text, html };
}
