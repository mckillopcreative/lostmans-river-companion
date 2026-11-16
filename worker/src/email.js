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

// The holiday news email (John, 2026-11-16): what has been added since they signed up, and the
// holiday specials. The people on the list were told "one reminder before Christmas and nothing
// else", so THIS IS THAT ONE EMAIL: do not send them another. The picture is the landing page's
// banner (public/email/hero.jpg). Sent by POST /admin/send-opening {template: 'news'}.
export function newsEmail(leave, why = 'asked for the holiday offer') {
  const subject = 'New at Lostman’s River: Guide School, and buy one, give one';
  const link = (c) => `${SITE}/${c}${c.includes('?') ? '&' : '?'}utm_source=email&utm_medium=email&utm_campaign=holiday-news`;
  const buy = link('#offer').replace('/#offer?', '/?').concat('#offer');
  const text = [
    'Hello from the two of us,',
    '',
    'When you asked for our holiday offer we promised one note before Christmas and nothing else. This is it, and we saved it until there was real news. There is: we have been building, and the Experience is a good deal bigger than the day you looked.',
    '',
    'WHAT’S NEW',
    '',
    '- It’s a Guide School now. Four courses: Rig It Right, Learn the Boat, Keeper or Release? and Fish of the Everglades. Which rig to tie on, how to be useful crew, which fish go back, and what just came over the side.',
    '- The Assistant Fishing Guide Training Manual. Fifteen short audio lessons, about an hour in all, read by the voice of the book. Good for the car. Lesson 1 is free to hear on the site.',
    '- Matt’s Fishing Journal. A 20-page field guide, ready as a PDF: name the fish, find the spot, pick the rig, tie the knot, set the hook.',
    '- Wild Florida, an add-on ($9.99). Uncle Dan teaches your reader to name Florida’s animals on sight: sharks, snakes, gators, fish and birds. The first animals are free to try, and more are on the way.',
    '',
    'THE HOLIDAY SPECIALS',
    '',
    '- Buy one, give one. Through December 31, every Experience ($24.99) comes with a second one to give, free, with its own gift card to print, email or text to anyone.',
    '- The Full Boat bonus. Add $15 at checkout and it covers up to five readers, each with their own link, missions, badges and license. Brothers, sisters, cousins, the kid next door.',
    '',
    `Have a look: ${buy}`,
    '',
    'It opens the minute you pay, so it works right up to Christmas Eve. If you want the gift card printed and under the tree, give yourself until December 22.',
    '',
    `Not sure yet? Chapter 1 is free, to read or to hear, no sign-up: ${link('ch/1/')}`,
    '',
    'Thank you for looking in on our book. It took us decades, and we finished it together.',
    '',
    'Linda and John McKillop',
    'mother and son, co-authors (Linda drew the pictures, too)',
    footerText(leave, why),
  ].join('\n');
  const p = (s, extra = '') => `<p style="margin:0 0 14px;font-size:16px;line-height:1.55;color:#1f2a2e;${extra}">${s}</p>`;
  const h = (s) => `<p style="margin:22px 0 10px;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;font-weight:bold;color:#a04d12;font-family:Georgia,'Times New Roman',serif;">${s}</p>`;
  const item = (title, body) => `<tr><td valign="top" style="padding:0 10px 12px 0;font-size:18px;line-height:1.3;color:#e8873a;">&#10022;</td><td style="padding:0 0 12px;font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.5;color:#1f2a2e;"><strong style="color:#2f5d50;">${title}</strong> ${body}</td></tr>`;
  const html = `<!doctype html><html><body style="margin:0;padding:0;background:#f6f1e7;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f1e7;"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;width:100%;background:#fbf8f1;border:1px solid #e2d9c7;border-radius:14px;overflow:hidden;">
<tr><td style="padding:0;line-height:0;">
  <a href="${esc(buy)}"><img src="${SITE}/email/hero.jpg" width="560" alt="Summer Fishing Guide Experience: Escape to Lostman’s River. A houseboat moored in the mangroves at dusk." style="display:block;width:100%;max-width:560px;height:auto;border:0;border-radius:14px 14px 0 0;"></a>
</td></tr>
<tr><td style="padding:24px 28px 22px;font-family:Georgia,'Times New Roman',serif;">
  <p style="margin:0 0 4px;font-size:14px;color:#a04d12;font-style:italic;">A note from Linda and John</p>
  <h1 style="margin:0 0 16px;font-size:25px;line-height:1.2;color:#2f5d50;">We’ve been busy. It’s a Guide School now.</h1>
  ${p('When you asked for our holiday offer we promised one note before Christmas and nothing else. This is it, and we saved it until there was real news. There is: we have been building, and the Experience is a good deal bigger than the day you looked.')}
  ${h('What’s new')}
  <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
  ${item('Guide School.', 'Four courses: Rig It Right, Learn the Boat, Keeper or Release? and Fish of the Everglades. Which rig to tie on, how to be useful crew, which fish go back, and what just came over the side.')}
  ${item('The Assistant Fishing Guide Training Manual.', `Fifteen short audio lessons, about an hour in all, read by the voice of the book. Good for the car. <a href="${esc(link('training-manual/'))}" style="color:#2a7f8e;">Lesson 1 is free to hear.</a>`)}
  ${item('Matt’s Fishing Journal.', 'A 20-page field guide, ready as a PDF: name the fish, find the spot, pick the rig, tie the knot, set the hook.')}
  ${item('Wild Florida, an add-on ($9.99).', `Uncle Dan teaches your reader to name Florida’s animals on sight: sharks, snakes, gators, fish and birds. <a href="${esc(link('wild-florida/'))}" style="color:#2a7f8e;">The first animals are free to try</a>, and more are on the way.`)}
  </table>
  ${h('The holiday specials')}
  <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="background:#e3efe6;border-radius:10px;"><tr><td style="padding:14px 16px 4px;">
  <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
  ${item('Buy one, give one.', 'Through December 31, every Experience ($24.99) comes with a second one to give, free, with its own gift card to print, email or text to anyone.')}
  ${item('The Full Boat bonus.', 'Add $15 at checkout and it covers up to five readers, each with their own link, missions, badges and license. Brothers, sisters, cousins, the kid next door.')}
  </table>
  </td></tr></table>
  <p style="margin:22px 0 20px;text-align:center;"><a href="${esc(buy)}" style="display:inline-block;background:#e8873a;color:#1f2a2e;font-family:Georgia,serif;font-weight:bold;font-size:17px;text-decoration:none;padding:13px 26px;border-radius:999px;">See what’s in it now</a></p>
  ${p('It opens the minute you pay, so it works right up to Christmas Eve. If you want the gift card printed and under the tree, give yourself until <strong>December 22</strong>.', 'font-size:15px;')}
  ${p(`<strong>Not sure yet?</strong> <a href="${esc(link('ch/1/'))}" style="color:#2a7f8e;">Chapter 1 is free</a>, to read or to hear, no sign-up.`, 'font-size:15px;background:#f1e7d6;padding:10px 12px;border-radius:8px;')}
  ${p('Thank you for looking in on our book. It took us decades, and we finished it together.')}
  <p style="margin:18px 0 0;font-size:16px;color:#2f5d50;font-style:italic;">Linda and John McKillop</p>
  <p style="margin:2px 0 0;font-size:13px;color:#6b7478;">mother and son, co-authors (Linda drew the pictures, too)</p>
  ${footer(leave, why)}
</td></tr>
</table></td></tr></table></body></html>`;
  return { subject, text, html };
}

// The holiday promo code, sent the moment a grown-up asks for it on the site (POST /offer).
export const HOLIDAY_CODE = 'HOLIDAYPROMO';
// Since 2026-11-11 the holiday offer is the Full Crew Experience ($39.99, up to five readers). The
// old HOLIDAYPROMO code is still honoured if someone uses it; no code in this email.
const CREW_URL = 'https://buy.stripe.com/eVqdRbdrZgW58Wbgw893y04';
export function offerEmail(leave) {
  const subject = 'Your Lostman’s River holiday gift offer';
  const buy = `${SITE}/?utm_source=email&utm_medium=email&utm_campaign=holiday-offer`;
  const crewBuy = `${CREW_URL}?client_reference_id=v2_holiday-offer_`;
  const text = [
    'Here’s the holiday offer you asked for.',
    '',
    'Reading and fishing are better together. The Full Crew Experience is $39.99 for up to five readers, each with their own link, missions, badges and license: brothers, sisters, cousins, friends.',
    '',
    `Build your crew: ${crewBuy}`,
    `Or just one reader ($24.99): ${buy}`,
    '',
    'Every reader’s link arrives instantly with its own printable gift card, so it works right up to Christmas Eve. Order by December 22 to have the cards under the tree.',
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
  <h1 style="margin:0 0 18px;font-size:26px;line-height:1.2;color:#2f5d50;">Build your crew</h1>
  ${p('Reading and fishing are better together. The Full Crew Experience is <strong>$39.99</strong> for up to five readers, each with their own link, missions, badges and license: brothers, sisters, cousins, friends.')}
  <p style="margin:6px 0 10px;text-align:center;"><a href="${esc(crewBuy)}" style="display:inline-block;background:#e8873a;color:#1f2a2e;font-family:Georgia,serif;font-weight:bold;font-size:17px;text-decoration:none;padding:13px 26px;border-radius:999px;">Build your crew: $39.99</a></p>
  <p style="margin:0 0 20px;text-align:center;font-size:15px;"><a href="${esc(buy)}" style="color:#2a7f8e;">Or just one reader, $24.99</a></p>
  ${p('Every reader’s link arrives instantly with its own printable gift card, so it works right up to Christmas Eve. Order by <strong>December 22</strong> to have the cards under the tree.', 'font-size:15px;background:#f1e7d6;padding:10px 12px;border-radius:8px;')}
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

/** The Full Crew Experience: the crew's other links in one email, each with its gift card. */
export function crewEmail(keys) {
  const rows = keys.map((k, i) => ({ n: i + 2, link: startLink(k), card: `${SITE}/gift/#${k}` }));
  const subject = 'Your crew’s links: Lostman’s River';
  const text = [
    'Reading and fishing are better together. Here is the rest of your crew.',
    '',
    'Your own link is in the other email. Below are the other crew members’ links. Each one has its own missions, badges and license, so hand one to each reader: a brother or sister, a cousin, a friend.',
    '',
    ...rows.flatMap((r) => [`Crew member ${r.n}`, `  Link: ${r.link}`, `  Printable gift card: ${r.card}`, '']),
    'Each reader opens their link on their own tablet or phone and Mission 1 is waiting. Keep each link to the reader it’s for.',
    '',
    'Questions? Just reply. 30-day refund, no questions asked.',
    '',
    'Linda and John McKillop',
  ].join('\n');
  const p = (s, extra = '') => `<p style="margin:0 0 14px;font-size:16px;line-height:1.5;color:#1f2a2e;${extra}">${s}</p>`;
  const list = rows
    .map(
      (r) => `<tr><td style="padding:10px 0;border-top:1px solid #e2d9c7;font-family:Georgia,serif;font-size:16px;color:#2f5d50;"><strong>Crew member ${r.n}</strong><br>
<a href="${esc(r.card)}" style="display:inline-block;margin-top:6px;background:#e8873a;color:#1f2a2e;font-weight:bold;font-size:14px;text-decoration:none;padding:8px 14px;border-radius:999px;">Print gift card</a>
<span style="font-size:13px;color:#4b5a60;margin-left:8px;">or send this link: <a href="${esc(r.link)}" style="color:#2a7f8e;word-break:break-all;">${esc(r.link)}</a></span></td></tr>`,
    )
    .join('');
  const html = `<!doctype html><html><body style="margin:0;padding:0;background:#f6f1e7;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f1e7;"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;width:100%;background:#fbf8f1;border:1px solid #e2d9c7;border-radius:14px;">
<tr><td style="padding:28px 28px 20px;font-family:Georgia,'Times New Roman',serif;">
  <p style="margin:0 0 4px;font-size:14px;color:#a04d12;font-style:italic;">The Full Crew Experience</p>
  <h1 style="margin:0 0 18px;font-size:26px;line-height:1.2;color:#2f5d50;">Here is the rest of your crew</h1>
  ${p('Your own link is in the other email. Each link below has its own missions, badges and license, so hand one to each reader: a brother or sister, a cousin, a friend.')}
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${list}</table>
  ${p('Each reader opens their link on their own tablet or phone and Mission 1 is waiting. Keep each link to the reader it’s for.', 'font-size:15px;margin-top:14px;')}
  ${p('Questions? Just reply; it comes to us. 30-day refund, no questions asked.', 'font-size:14px;color:#4b5a60;')}
  <p style="margin:18px 0 0;font-size:16px;color:#2f5d50;font-style:italic;">Linda and John McKillop</p>
</td></tr></table></td></tr></table></body></html>`;
  return { subject, text, html };
}

/** The second Experience (holiday "buy one, give one", or the older "Keep one, give one" link): everything the buyer needs to give it. */
export function giftEmail(key) {
  const link = startLink(key);
  const giftLink = `${SITE}/gift/#${key}`;
  const subject = 'Your second Experience, ready to give';
  const text = [
    'This is the one to give.',
    '',
    'Your purchase came with two Experiences: yours (in the other email) and this one, to give to another reader. Buy one, give one.',
    '',
    `Print its gift card, save it as a PDF, or send it by email or text with a note from you: ${giftLink}`,
    `Or simply pass on this link: ${link}`,
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
  <p style="margin:0 0 4px;font-size:14px;color:#a04d12;font-style:italic;">Buy one, give one</p>
  <h1 style="margin:0 0 18px;font-size:26px;line-height:1.2;color:#2f5d50;">This is the one to give</h1>
  ${p('Your purchase came with two Experiences: yours, in the other email, and this one to give to another reader.')}
  <p style="margin:0 0 18px;"><a href="${esc(giftLink)}" style="display:inline-block;background:#e8873a;color:#1f2a2e;font-weight:bold;font-size:16px;text-decoration:none;padding:12px 22px;border-radius:999px;">Print or send its gift card</a></p>
  ${p(`The gift card page prints the card, saves it as a PDF, or sends it by email or text with a note from you. Or simply pass on this link:<br><a href="${esc(link)}" style="color:#2a7f8e;word-break:break-all;">${esc(link)}</a>`)}
  ${p('It works just like yours: they open the link on the reader’s own tablet or phone and Mission 1 is waiting. Their progress is kept under this link, separate from yours.', 'font-size:15px;')}
  ${p('Keep this link for the family you give it to. Anyone with it can open that summer.', 'font-size:14px;color:#4b5a60;')}
  ${p('Questions? Just reply; it comes to us. 30-day refund, no questions asked.', 'font-size:14px;color:#4b5a60;')}
  <p style="margin:18px 0 0;font-size:16px;color:#2f5d50;font-style:italic;">Linda and John McKillop</p>
</td></tr></table></td></tr></table></body></html>`;
  return { subject, text, html };
}

/** Wild Florida added to a purchase that already has its Experience(s): n = how many links it unlocked. */
export function wildEmail(n = 1) {
  const where = n > 1 ? `all ${n} links from your purchase` : 'your reader’s link';
  const subject = 'Wild Florida is unlocked';
  const text = [
    'Wild Florida is unlocked.',
    '',
    `Uncle Dan’s field school is now open on ${where}. There is nothing new to install and no new link: on the reader’s own device, open ${SITE}/wild-florida/`,
    '',
    'Every animal, all six games, the logbook and the certificate are in it.',
    '',
    `On a device that has lost its link? Go to ${SITE}/restore/ and enter this email address.`,
    '',
    'Questions? Just reply. 30-day refund, no questions asked.',
    '',
    'Linda and John McKillop',
  ].join('\n');
  const p = (s, extra = '') => `<p style="margin:0 0 14px;font-size:16px;line-height:1.5;color:#1f2a2e;${extra}">${s}</p>`;
  const html = `<!doctype html><html><body style="margin:0;padding:0;background:#f6f1e7;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f1e7;"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;width:100%;background:#fbf8f1;border:1px solid #e2d9c7;border-radius:14px;">
<tr><td style="padding:28px 28px 24px;font-family:Georgia,'Times New Roman',serif;">
  <p style="margin:0 0 4px;font-size:14px;color:#a04d12;font-style:italic;">Uncle Dan’s field school</p>
  <h1 style="margin:0 0 18px;font-size:26px;line-height:1.2;color:#2f5d50;">Wild Florida is unlocked</h1>
  ${p(`It is now open on ${where}. There is nothing new to install and no new link.`)}
  <p style="margin:6px 0 18px;"><a href="${SITE}/wild-florida/" style="display:inline-block;background:#e8873a;color:#1f2a2e;font-family:Georgia,serif;font-weight:bold;font-size:16px;text-decoration:none;padding:12px 22px;border-radius:999px;">Open Wild Florida</a></p>
  ${p('Open it on the reader’s own device, the one that already has their link. Every animal, all six games, the logbook and the certificate are in it.', 'font-size:15px;')}
  ${p(`<strong>On a device that has lost its link?</strong> Go to <a href="${SITE}/restore/" style="color:#2a7f8e;">lostmansriver.com/restore</a> and enter this email address.`, 'font-size:15px;')}
  ${p('Questions? Just reply; it comes to us. 30-day refund, no questions asked.', 'font-size:14px;color:#4b5a60;')}
  <p style="margin:18px 0 0;font-size:16px;color:#2f5d50;font-style:italic;">Linda and John McKillop</p>
</td></tr>
</table></td></tr></table></body></html>`;
  return { subject, text, html };
}

export function welcomeEmail(key, { resend = false, gift = false, wild = false } = {}) {
  const link = startLink(key);
  const giftLink = `${SITE}/gift/#${key}`;
  const qr = `${API}/qr/${key}.png`;
  const pdf = `${API}/guide/${key}/matts-fishing-journal.pdf`;
  const subject = resend ? 'Your Lostman’s River link, again' : 'Your reader’s summer at Lostman’s River starts here';
  const text = [
    resend ? 'Here is your link again.' : 'Welcome aboard.',
    '',
    ...(gift ? ['Buy one, give one: your second Experience, the one to give, is in a separate email with its own gift card.', ''] : []),
    'Giving it as a gift? Forward this email to the reader’s family, or print a gift card with the code on it: ' + giftLink,
    '',
    'Get your reader started in under a minute, on their own device:',
    '1. On their tablet or phone, open the camera and point it at the code in this email.',
    '2. Tap the link that pops up. Mission 1 is waiting.',
    '3. That’s it. Their device remembers them. Next time they just open lostmansriver.com/app.',
    '',
    `No camera handy? Forward this email, or text them this link: ${link}`,
    '',
    'Also in the pack:',
    `- Matt’s Fishing Journal, a 20-page field guide to print and keep in the boat (PDF): ${pdf}`,
    `- The Assistant Fishing Guide Training Manual, fifteen short lessons to listen to: ${SITE}/training-manual/`,
    ...(wild ? [`- Wild Florida, your add-on: Uncle Dan’s field school, unlocked on every link in this purchase: ${SITE}/wild-florida/`] : []),
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
  ${gift ? p('<strong>Buy one, give one.</strong> Your second Experience, the one to give, is in a separate email with its own gift card.', 'font-size:15px;background:#e3efe6;padding:10px 12px;border-radius:8px;') : ''}
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
  ${p(`<strong>Also in the pack.</strong> <a href="${esc(pdf)}" style="color:#2a7f8e;">Matt’s Fishing Journal</a>, a 20-page field guide to print and keep in the boat (PDF). And <a href="${SITE}/training-manual/" style="color:#2a7f8e;">the Assistant Fishing Guide Training Manual</a>, fifteen short lessons to listen to in the car.`, 'font-size:15px;background:#f1e7d6;padding:10px 12px;border-radius:8px;')}
  ${wild ? p(`<strong>Your add-on: Wild Florida.</strong> <a href="${SITE}/wild-florida/" style="color:#2a7f8e;">Uncle Dan’s field school</a> is unlocked on every link in this purchase.`, 'font-size:15px;background:#e3efe6;padding:10px 12px;border-radius:8px;') : ''}
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
