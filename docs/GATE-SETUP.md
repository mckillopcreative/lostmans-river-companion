# Turning the purchase gate on

*Built and deployed 2026-10-21. The Worker at `api.lostmansriver.com` already issues keys, checks them, syncs progress, handles restore, serves the email's QR code and verifies Stripe signatures (all tested end to end). Three account steps remain; then flip one switch.*

## What's live now

| Piece | Status |
|---|---|
| Worker `lostmans-river-api` | live: keys, progress sync, restore, QR, Stripe signature check, admin issue |
| `/start/#<key>` | live: the reader's device opens the link and is in; resumes progress |
| `/restore/` | live: re-sends the link (once email sending is on) |
| Hand-off on `/app/?welcome=1&session_id=…` | live: QR to scan off the parent's screen, copy/text/email, start here |
| Privacy and Terms pages | live, footer-linked; have a children's-privacy attorney review before ads |
| Locks on missions 2–23 and chapter audio 2–23 | **built, switched off** (`site.config.mjs` → `gate.live: false`) |
| Chapter audio 2–23 | rendered, on this computer and backed up; waiting for R2 |
| Welcome email | written and previewed; waiting for Workers Paid + Email Sending |

## The three account steps (author)

1. **Workers Paid** ($5/month): Cloudflare → Workers & Pages → Plans → Paid. Needed to email buyers (Email Sending only reaches arbitrary inboxes on Paid). It also lifts Worker limits.
2. **R2**: Cloudflare → R2 Object Storage → enable (accept terms; the first 10 GB are free, the book is 218 MB).
3. **Stripe** (the Stripe Claude or the dashboard):
   - Developers → Webhooks → Add endpoint `https://api.lostmansriver.com/stripe/webhook`, events `checkout.session.completed` and `checkout.session.async_payment_succeeded`. Copy the signing secret (`whsec_…`).
   - Developers → API keys → Create restricted key: Checkout Sessions = Read, everything else None. Copy it (`rk_live_…`).
   - The Payment Link → After payment → Redirect to `https://lostmansriver.com/app/?welcome=1&session_id={CHECKOUT_SESSION_ID}`.
   - The Payment Link → Require customers to accept your terms of service, with Settings → Public details → Terms of service = `https://lostmansriver.com/terms/` and Privacy = `https://lostmansriver.com/privacy/`.

Put the two Stripe secrets on the Worker yourself, from the `worker` folder, so they never pass through chat:

```bash
npx wrangler secret put STRIPE_WEBHOOK_SECRET
```

```bash
npx wrangler secret put STRIPE_SECRET_KEY
```

(The webhook secret currently set is a temporary test value used to verify the signature check; the first command replaces it.)

## What I do after those (Claude)

1. Onboard `lostmansriver.com` in Email Sending (adds DKIM/SPF records), uncomment `[[send_email]]` in `worker/wrangler.toml`, deploy, send a test welcome email to you.
2. `npx wrangler r2 bucket create lostmans-audio`, upload chapters 2–23, uncomment `[[r2_buckets]]`, deploy, test streaming and seeking.
3. Set `gate.live: true`, build, deploy; run a real purchase with a 100%-off CREW code end to end on a phone and a tablet.

## Giving copies away (family, reviewers, teachers)

`POST https://api.lostmansriver.com/admin/issue` with header `x-admin-key` (the value is in `worker/.dev.vars`, never committed) and body `{"email": "...", "note": "reviewer"}` creates a key and emails the link; add `"send": false` to get the link back without emailing. Or just use the CREW coupon in Stripe.

## Test records in the key store

Three test keys exist from building this (notes: "gate smoke test", gate-test@example.com, e2e-test@example.com). They are harmless; delete them in Cloudflare → Workers KV → LR if you like.
