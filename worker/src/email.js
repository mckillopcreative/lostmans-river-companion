// The welcome email (docs/LAUNCH-FLOW.md §5): written for a parent reading on their own phone
// or computer while the reader plays on a different device. The QR code is in the email.
const SITE = 'https://lostmansriver.com';
const API = 'https://api.lostmansriver.com';
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// When it opens, as the waitlist email says it. No fixed date since 2026-11-03; keep in step
// with site.config.mjs → checkout.opens.
export const OPENS = 'soon';
// The postal address US law requires on marketing email (the author's P.O. box, 2026-11-03).
export const POSTAL = 'McKillop Creative, LLC · PO Box 8292, Greenville, SC 29604';

const footer = (leave, why = 'joined the opening-day list') =>
  `<p style="margin:22px 0 0;font-size:12px;line-height:1.5;color:#6b7478;">${POSTAL}<br>You’re getting this because you ${why} at lostmansriver.com. <a href="${esc(leave)}" style="color:#6b7478;">Take me off the list</a>.</p>`;
const footerText = (leave, why = 'joined the opening-day list') => ['', '—', POSTAL, `You’re getting this because you ${why} at lostmansriver.com.`, `Take me off the list: ${leave}`].join('\n');

// Opening morning: the one email the list was promised. Sent by POST /admin/send-opening.
export function openingEmail(leave) {
  const subject = 'It’s open: your reader’s summer at Lostman’s River';
  const buy = `${SITE}/?utm_source=email&utm_medium=email&utm_campaign=opening`;
  const text = [
    'The Summer Fishing Guide Experience is open.',
    '',
    `Get it here: ${buy}`,
    '',
    'One price, $24.99, for the household. Your reader gets the whole book to read and to hear read aloud, 23 missions in the app and 23 field missions done for real and signed off by you, the printable Field Journal, three badges, and an Assistant Fishing Guide license at the end.',
    '',
    'It arrives in a minute: you buy on your phone or computer, your reader scans the code in the welcome email on their own device, and they’re aboard. No account, no app to install.',
    '',
    'Giving it for Christmas? It comes with a printable gift card, so it works right up to the last minute.',
    '',
    'Questions? Just reply; it comes to us.',
    '',
    'Linda and John McKillop',
    footerText(leave),
  ].join('\n');
  const p = (s, extra = '') => `<p style="margin:0 0 14px;font-size:16px;line-height:1.5;color:#1f2a2e;${extra}">${s}</p>`;
  const html = `<!doctype html><html><body style="margin:0;padding:0;background:#f6f1e7;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f1e7;"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;width:100%;background:#fbf8f1;border:1px solid #e2d9c7;border-radius:14px;">
<tr><td style="padding:28px 28px 20px;font-family:Georgia,'Times New Roman',serif;">
  <p style="margin:0 0 4px;font-size:14px;color:#a04d12;font-style:italic;">Opening day</p>
  <h1 style="margin:0 0 18px;font-size:26px;line-height:1.2;color:#2f5d50;">The Summer Fishing Guide Experience is open</h1>
  ${p('One price, <strong>$24.99</strong>, for the household. Your reader gets the whole book to read and to hear read aloud, 23 missions in the app and 23 field missions done for real and signed off by you, the printable Field Journal, three badges, and an Assistant Fishing Guide license at the end.')}
  <p style="margin:6px 0 20px;text-align:center;"><a href="${esc(buy)}" style="display:inline-block;background:#e8873a;color:#1f2a2e;font-family:Georgia,serif;font-weight:bold;font-size:17px;text-decoration:none;padding:13px 26px;border-radius:999px;">Get the Experience</a></p>
  ${p('<strong>It arrives in a minute.</strong> You buy on your phone or computer, your reader scans the code in the welcome email on their own device, and they’re aboard. No account, no app to install.')}
  ${p('<strong>Giving it for Christmas?</strong> It comes with a printable gift card, so it works right up to the last minute.', 'font-size:15px;background:#f1e7d6;padding:10px 12px;border-radius:8px;')}
  ${p('Questions? Just reply; it comes to us.', 'font-size:15px;color:#4b5a60;')}
  <p style="margin:18px 0 0;font-size:16px;color:#2f5d50;font-style:italic;">Linda and John McKillop</p>
  ${footer(leave)}
</td></tr>
</table></td></tr></table></body></html>`;
  return { subject, text, html };
}

// The holiday promo code, sent the moment a grown-up asks for it on the site (POST /offer).
export const HOLIDAY_CODE = 'HOLIDAYPROMO';
// Since 2026-11-10 the holiday offer is "Keep one, give one" ($34.99 for two Experiences), better
// than the old code (still honoured if someone uses it). No code in this email any more.
const PAIR_URL = 'https://buy.stripe.com/7sY7sN73BbBL5JZ1Be93y02';
export function offerEmail(leave) {
  const subject = 'Your Lostman’s River holiday gift offer';
  const buy = `${SITE}/?utm_source=email&utm_medium=email&utm_campaign=holiday-offer`;
  const pairBuy = `${PAIR_URL}?client_reference_id=v2_holiday-offer_`;
  const text = [
    'Here’s the holiday offer you asked for.',
    '',
    'Keep one, give one: two Summer Fishing Guide Experiences for $34.99, one for your family and one to give to another. Bought separately, two are $49.98.',
    '',
    `Get the pair: ${pairBuy}`,
    `Or just one ($24.99): ${buy}`,
    '',
    'One price covers a whole household, so the second one is for the cousins, the grandkids across town, or a friend’s family. Each arrives instantly with its own printable gift card, so it works right up to Christmas Eve. Order by December 22 to have the card under the tree.',
    '',
    'What they get: the whole book, to read and to hear read aloud, chapter by chapter; 23 missions in the app and 23 field missions done for real, each signed off by a grown-up; a printable Field Journal; three badges; and an Assistant Fishing Guide license at the end.',
    '',
    'We’ll send one reminder before Christmas and nothing else.',
    '',
    'Linda and John McKillop',
    footerText(leave, 'asked for the holiday offer'),
  ].join('\n');
  const p = (s, extra = '') => `<p style="margin:0 0 14px;font-size:16px;line-height:1.5;color:#1f2a2e;${extra}">${s}</p>`;
  const html = `<!doctype html><html><body style="margin:0;padding:0;background:#f6f1e7;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f1e7;"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;width:100%;background:#fbf8f1;border:1px solid #e2d9c7;border-radius:14px;">
<tr><td style="padding:28px 28px 20px;font-family:Georgia,'Times New Roman',serif;">
  <p style="margin:0 0 4px;font-size:14px;color:#a04d12;font-style:italic;">Your holiday gift offer</p>
  <h1 style="margin:0 0 18px;font-size:26px;line-height:1.2;color:#2f5d50;">Keep one, give one</h1>
  ${p('Two Summer Fishing Guide Experiences for <strong>$34.99</strong>: one for your family and one to give to another. Bought separately, two are $49.98.')}
  <p style="margin:6px 0 10px;text-align:center;"><a href="${esc(pairBuy)}" style="display:inline-block;background:#e8873a;color:#1f2a2e;font-family:Georgia,serif;font-weight:bold;font-size:17px;text-decoration:none;padding:13px 26px;border-radius:999px;">Keep one, give one: $34.99</a></p>
  <p style="margin:0 0 20px;text-align:center;font-size:15px;"><a href="${esc(buy)}" style="color:#2a7f8e;">Or just one, $24.99</a></p>
  ${p('One price covers a whole household, so the second one is for the cousins, the grandkids across town, or a friend’s family. Each arrives instantly with its own printable gift card, so it works right up to Christmas Eve. Order by <strong>December 22</strong> to have the card under the tree.', 'font-size:15px;background:#f1e7d6;padding:10px 12px;border-radius:8px;')}
  ${p('<strong>What they get:</strong> the whole book, to read and to hear read aloud, chapter by chapter; 23 missions in the app and 23 field missions done for real, each signed off by a grown-up; a printable Field Journal; three badges; and an Assistant Fishing Guide license at the end.')}
  ${p('We’ll send one reminder before Christmas and nothing else.', 'font-size:15px;color:#4b5a60;')}
  <p style="margin:18px 0 0;font-size:16px;color:#2f5d50;font-style:italic;">Linda and John McKillop</p>
  ${footer(leave, 'asked for the holiday offer')}
</td></tr>
</table></td></tr></table></body></html>`;
  return { subject, text, html };
}

// The one email a waitlist signup gets before opening day.
export function waitlistEmail(leave) {
  const subject = 'You’re on the list for Lostman’s River';
  const text = [
    'Thanks. You’re on the list.',
    '',
    `The Summer Fishing Guide Experience opens ${OPENS}. We’ll email you once, the morning it does, with the link.`,
    '',
    'What your reader gets: the whole book, to read and to hear read aloud, chapter by chapter; 23 missions in the app and 23 field missions done for real, each signed off by a grown-up; a printable Field Journal; three badges; and an Assistant Fishing Guide license at the end.',
    '',
    'Buying it as a gift? It arrives instantly, with a printable gift card, so it works right up to the last minute.',
    '',
    'Until then, chapter 1 is free to read and hear at https://lostmansriver.com/ch/1/',
    '',
    'Linda and John McKillop',
    footerText(leave),
  ].join('\n');
  const p = (s, extra = '') => `<p style="margin:0 0 14px;font-size:16px;line-height:1.5;color:#1f2a2e;${extra}">${s}</p>`;
  const html = `<!doctype html><html><body style="margin:0;padding:0;background:#f6f1e7;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f1e7;"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;width:100%;background:#fbf8f1;border:1px solid #e2d9c7;border-radius:14px;">
<tr><td style="padding:28px 28px 20px;font-family:Georgia,'Times New Roman',serif;">
  <p style="margin:0 0 4px;font-size:14px;color:#a04d12;font-style:italic;">You’re on the list</p>
  <h1 style="margin:0 0 18px;font-size:26px;line-height:1.2;color:#2f5d50;">Summer Fishing Guide Experience</h1>
  ${p(`It opens <strong>${OPENS}</strong>. We’ll email you once, the morning it does, with the link.`)}
  ${p('<strong>What your reader gets:</strong> the whole book, to read and to hear read aloud, chapter by chapter; 23 missions in the app and 23 field missions done for real, each signed off by a grown-up; a printable Field Journal; three badges; and an Assistant Fishing Guide license at the end.')}
  ${p('<strong>Buying it as a gift?</strong> It arrives instantly, with a printable gift card, so it works right up to the last minute.', 'font-size:15px;background:#f1e7d6;padding:10px 12px;border-radius:8px;')}
  ${p(`Until then, <a href="${SITE}/ch/1/" style="color:#2a7f8e;">chapter 1 is free to read and hear</a>.`)}
  <p style="margin:18px 0 0;font-size:16px;color:#2f5d50;font-style:italic;">Linda and John McKillop</p>
  ${footer(leave)}
</td></tr>
</table></td></tr></table></body></html>`;
  return { subject, text, html };
}

export function startLink(key) {
  return `${SITE}/start/#${key}`;
}

/** The second Experience from "Keep one, give one": everything the buyer needs to give it. */
export function giftEmail(key) {
  const link = startLink(key);
  const giftLink = `${SITE}/gift/#${key}`;
  const subject = 'Your second Experience, ready to give';
  const text = [
    'This is the one to give.',
    '',
    'You bought Keep one, give one, so there are two Experiences: yours (in the other email) and this one, for another family.',
    '',
    `Print its gift card (it has its own code on it): ${giftLink}`,
    `Or forward this email to the family, or send them this link: ${link}`,
    '',
    'It works the same way as yours: they open the link on the reader’s own tablet or phone and Mission 1 is waiting. Their progress is kept under this link, separate from yours.',
    '',
    'Keep this link for the family you give it to. Anyone with it can open that summer.',
    '',
    'Questions? Just reply. 30-day refund, no questions asked.',
    '',
    'Linda and John McKillop',
  ].join('\n');
  const p = (s, extra = '') => `<p style="margin:0 0 14px;font-size:16px;line-height:1.5;color:#1f2a2e;${extra}">${s}</p>`;
  const html = `<!doctype html><html><body style="margin:0;padding:0;background:#f6f1e7;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f1e7;"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;width:100%;background:#fbf8f1;border:1px solid #e2d9c7;border-radius:14px;">
<tr><td style="padding:28px 28px 20px;font-family:Georgia,'Times New Roman',serif;">
  <p style="margin:0 0 4px;font-size:14px;color:#a04d12;font-style:italic;">Keep one, give one</p>
  <h1 style="margin:0 0 18px;font-size:26px;line-height:1.2;color:#2f5d50;">This is the one to give</h1>
  ${p('You have two Experiences: yours, in the other email, and this one for another family.')}
  <p style="margin:0 0 18px;"><a href="${esc(giftLink)}" style="display:inline-block;background:#e8873a;color:#1f2a2e;font-weight:bold;font-size:16px;text-decoration:none;padding:12px 22px;border-radius:999px;">Print its gift card</a></p>
  ${p(`Or forward this email to the family, or send them this link:<br><a href="${esc(link)}" style="color:#2a7f8e;word-break:break-all;">${esc(link)}</a>`)}
  ${p('It works just like yours: they open the link on the reader’s own tablet or phone and Mission 1 is waiting. Their progress is kept under this link, separate from yours.', 'font-size:15px;')}
  ${p('Keep this link for the family you give it to. Anyone with it can open that summer.', 'font-size:14px;color:#4b5a60;')}
  ${p('Questions? Just reply; it comes to us. 30-day refund, no questions asked.', 'font-size:14px;color:#4b5a60;')}
  <p style="margin:18px 0 0;font-size:16px;color:#2f5d50;font-style:italic;">Linda and John McKillop</p>
</td></tr></table></td></tr></table></body></html>`;
  return { subject, text, html };
}

export function welcomeEmail(key, { resend = false } = {}) {
  const link = startLink(key);
  const giftLink = `${SITE}/gift/#${key}`;
  const qr = `${API}/qr/${key}.png`;
  const subject = resend ? 'Your Lostman’s River link, again' : 'Your reader’s summer at Lostman’s River starts here';
  const text = [
    resend ? 'Here is your link again.' : 'Welcome aboard.',
    '',
    'Giving it as a gift? Forward this email to the reader’s family, or print a gift card with the code on it: ' + giftLink,
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
  ${p(`<strong>Giving it as a gift?</strong> Forward this email to the reader’s family, or <a href="${esc(giftLink)}" style="color:#2a7f8e;">print a gift card</a> with the code on it.`, 'font-size:15px;background:#f1e7d6;padding:10px 12px;border-radius:8px;')}
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
