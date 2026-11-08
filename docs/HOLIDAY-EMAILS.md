# Holiday emails to the promo-code list

*Drafts for John to edit. The list is everyone who asked for the code on the site (stored as `w:<email>` with kind `offer`), plus the pre-launch waitlist. Send with `scripts/send-opening.mjs` once a `--template` switch is added (one line in the script), or paste into the Worker's `/admin/send-opening` body. Each goes out once; the Worker marks sends so nobody gets a duplicate.*

The code itself: `HOLIDAYPROMO`, 25% off orders of two or more copies (which is exactly "the second one half off" at quantity 2), through December 24, 11:59 PM Eastern. Buyers set the quantity to 2 on the Stripe page and enter the code.

---

## Email 1 · Send Tuesday, December 2

**Subject:** Order by Dec 22 and it's under the tree

Hi,

A quick one, because December goes fast.

The Summer Fishing Guide Experience arrives instantly with a printable gift card, so there is no shipping to worry about. But if you want the card printed, folded and under the tree, give yourself until **December 22**; after that you're printing on Christmas Eve like the rest of us.

Your holiday code still works: **HOLIDAYPROMO** makes the second copy half off, for the cousins or the grandkids across town. Set the quantity to 2 at checkout and enter the code.

Here's the link: https://lostmansriver.com/?utm_source=email&utm_medium=email&utm_campaign=holiday-1

What they get, in one line: the whole book to read and hear, 23 missions, 23 field missions done for real and signed off by a grown-up, a Field Journal to fill in by hand, and an Assistant Fishing Guide license at the end. About 25 hours, most of them outdoors.

Thanks for giving a kid a summer on the water.

Linda and John McKillop

---

## Email 2 · Send Saturday, December 20

**Subject:** Last call: it still arrives in time (and the code ends Wednesday)

Hi,

If you're down to the wire, this is the gift that still works: it arrives the minute you pay, with a printable gift card. Print it, fold it, done. Christmas morning they scan the code and they're aboard.

**HOLIDAYPROMO** ends Wednesday, December 24. Second copy half off; set the quantity to 2 at checkout.

Here's the link: https://lostmansriver.com/?utm_source=email&utm_medium=email&utm_campaign=holiday-2

That's the last email from us this year. Merry Christmas from the two of us, and from Matt, Dan, Snapper and Old Scarface.

Linda and John McKillop

---

### Notes for the send

- Both go from help@lostmansriver.com with the signed unsubscribe link in the footer, as the Worker already does.
- Exclude anyone who has bought (the Worker knows the purchase emails); nobody who paid should get a discount email.
- After Christmas, delete the list except buyers, as the privacy page promises.
