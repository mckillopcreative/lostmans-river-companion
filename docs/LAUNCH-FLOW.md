# Launch flow: purchase → child's device → restore anywhere

*Drafted 2026-10-21. How a parent's purchase becomes a child playing within a minute, how progress survives a new phone, and what the parent agrees to. Not legal advice; see §6.*

## 1. The idea in one line

**The purchase is a key, not an account.** Stripe checkout creates one secret link. Whoever opens that link is in, and their summer progress is saved against the key, not against a person. The parent's email is only the place the key is delivered and re-delivered.

No passwords, no child profiles, no verification codes, nothing the child types about themselves.

## 2. What the parent and child experience

1. **Parent buys** on lostmansriver.com (Stripe Payment Link). Stripe already has the parent's email from checkout.
2. **Parent lands on the welcome page** (`/app/?welcome=1`) and sees, straight away:
   - **"Hand it to your reader"**: a large QR code of their personal link to scan with the child's phone or tablet, a **Copy link** button, and **Text it / Email it** buttons that open the parent's own messages app with the link filled in.
   - "Or start here on this device."
3. **Within a minute the same link arrives by email** (§5), so the parent has it even if they closed the page.
4. **Child opens the link** on their device. The page saves the key on that device, shows "Welcome aboard," and drops them on Mission 1. From then on, `lostmansriver.com/app/` on that device just works; the link is not needed again.
5. **Progress saves itself.** Every mission ticked or badge earned is saved on the device and quietly copied to the server under the key.
6. **New phone, cleared browser, second device:** open the same link again (from the email) and the summer is exactly where it was.
7. **Lost the email:** the app's "Restore my summer" asks for **the email used to buy it** and re-sends the link to that inbox. Always replies "If that email bought the Experience, the link is on its way," so it reveals nothing.

That is the "restore with an email" you asked for: the email never logs anyone in; it only receives the link again, which is the same security a password reset has, without the password.

## 3. What is stored, and where

| Data | Where | Why |
|---|---|---|
| Parent email, purchase date, Stripe customer id | Server (Cloudflare KV), from the Stripe webhook | deliver and re-deliver the link; refunds |
| The key | Server and the child's device | the purchase itself |
| Missions done, badges, start date | Device, copied to the server under the key | restore on a new device |
| Child's first name (for the license) | **Device only, never synced** | keeps the server free of anything about the child |
| Mission answers, the signature | Device only (already the case) | |

So the server holds an adult's email and an anonymous progress record. Nothing it holds identifies a child.

One key = one summer. Two children sharing one key share one progress record; a "second reader" option can come later if parents ask.

## 4. The pieces to build

All on Cloudflare, free tier, at `api.lostmansriver.com` (a Worker on a subdomain, so the main site can stay on GitHub Pages).

1. **Stripe webhook** `checkout.session.completed` → make a 24-character random key, store `{email, created, session}`, send the welcome email.
2. **Start page** `/start/#<key>` (static, on the main site; the key sits after `#` so it is never sent in server logs or referrers) → checks the key with the API, saves it on the device, redirects to `/app/`.
3. **Progress sync** `GET/PUT /progress/<key>` → the missions/badges blob, newest wins; the app falls back to device-only if offline.
4. **Restore** `POST /restore {email}` → re-sends the link; rate-limited.
5. **Gate** on the paid parts: chapter narration 2–23 from R2 and, when allowed, the online reader text (§7). The tile grid, field guide, games and chapter 1 stay free; they are the advert.
6. **Welcome page** "Hand it to your reader" block with QR, copy, text and email buttons.
7. **Email sending**: Cloudflare Email Sending (author's choice, 2026-10-21), from `help@lostmansriver.com`, replies forwarded to Gmail (forwarding is already set up).
8. **Legal pages**: `/privacy/` and `/terms/`, linked from checkout and the footer (§6).

Estimate: two to three working sessions, then a full test purchase with a 100%-off code.

## 5. The welcome email (draft)

**Subject:** Your summer at Lostman's River starts here

> Welcome aboard.
>
> **Your link:** [Start the Summer Fishing Guide Experience] ← the button carries your personal link
>
> **Getting your reader started takes about a minute:**
> 1. Send this link to the device they'll use: forward this email, text the link, or open it on your phone and let them scan the code on the welcome page.
> 2. They tap it, and they're in. Mission 1 is waiting.
> 3. That device remembers them. They won't need the link again unless they switch devices.
>
> **New phone or cleared browser?** Open the same link and the summer picks up exactly where they left off. Lost this email? Go to lostmansriver.com/restore and enter this email address; we'll send the link again.
>
> **What we keep:** your email, so we can send the link. Your reader's progress (missions and badges) is saved under the link, not under their name. We never ask your child for their name, email or anything else, and there are no ads or trackers in the Experience.
>
> **Keep this link to your family.** Anyone with it can open your summer.
>
> Questions? Just reply; it comes to us. 30-day refund, no questions asked.
>
> Linda and John McKillop

## 6. The guardian question

**Yes, add one checkbox at checkout, and publish a short privacy policy and terms.** In detail:

- **Checkout consent.** Stripe Payment Links can require "I agree to the Terms of Service" (Stripe → Settings → Public details → Terms of service URL, then turn on consent collection on the link). Our terms say: *I'm 18 or older and the parent or legal guardian of the reader, or buying for a reader with their guardian's permission.* That is the toggle you are thinking of, and Stripe records it with the payment.
- **Privacy policy: required regardless.** Any site that collects an email address from US residents needs one (California's CalOPPA is the strictest and applies nationally in practice). Ours is short because we collect so little; §3 is most of it.
- **Children's privacy (COPPA).** COPPA governs collecting personal information *from children under 13*. This design collects nothing from the child: no name, email, photo or free text leaves the device, and the key is used only to run the service. That keeps us outside the parental-consent machinery, **as long as three rules hold**:
  1. **No ad pixels or trackers on any child-facing page** (`/app/`, `/missions/`, chapter pages, games). The Meta/Google ad pixels for the campaign go only on the landing page and checkout, which are for parents. This one matters most, because the ad campaign will tempt someone to add the pixel site-wide.
  2. **Analytics stay cookieless and aggregate** (GoatCounter or Plausible), no user IDs.
  3. **The child's first name never leaves the device** (the license is filled in locally).
- **Before spending on ads, a one-hour review by an attorney who does children's privacy** is worth the money. The plan above is designed to make that review short.

## 7. Dependencies that set the launch date

- **KDP Select:** the ebook is enrolled until **2026-11-25**, auto-renew already off. The full online reader launches 2026-11-26; until then chapter 1 is the free text sample (about 6% of the book, under Select's 10% limit). Until then the Experience is narration + missions + field guide + games + license, and the product copy must say "listen" rather than "read online".
- **Narration chapters 2–23** on ElevenLabs (Brian): ~220,000 characters, shared with the Bourbon Brothers book on one 131,000-a-month allowance. One Pro month covers it.
- **Stripe:** consent collection on, terms and privacy URLs set, webhook endpoint added once the Worker exists, coupons SUMMER and CREW.

## 8. What the author needs to provide

1. Cloudflare: log in in the browser pane again when the Worker is built (Workers, KV, R2), or an API token with those rights.
3. The Stripe webhook signing secret, put in a `.dev.vars` file, never in chat.
4. A decision on narration timing (Pro month or two Creator months).
5. The KDP Select end date.
