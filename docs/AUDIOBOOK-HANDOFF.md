# Audiobook hand-off: narrate *Bourbon Brothers* with the Fable voice and deliver it by link

*Written 2026-10-15 in the Lostman's River session for the Bourbon Brothers session. Everything below was worked out and tested on the Lostman's River companion site (chapter 1 of that book is narrated and live at https://lostmansriver.com). Copy the two scripts, keep the settings, change the source file.*

## 1. The decision already made: the voice

| Setting | Value | Why |
|---|---|---|
| Provider / model | OpenAI `gpt-4o-mini-tts` (Speech API, `/v1/audio/speech`) | Same as the Socrates and Guided Pour voice. The `instructions` field is what makes it a narrator. |
| Voice | `fable` | The author's choice: "lower with more baritone". `tts-1-hd` was tried and rejected (higher pitch, flat). No voice cloning wanted. |
| Instructions (v2) | `You are the single narrator of a middle-grade adventure novel, reading an audiobook. Use ONE voice for the entire recording: your own natural adult narrator voice, the same pitch and timbre in every sentence, including all dialogue. Do not perform character voices, do not raise your pitch for women or children, do not whisper or shout. Steady audiobook pace, clear and warm with a little grit, tension carried by timing and emphasis only. No dramatic pauses, no announcer cadence.` | Version 1 invited character voices and the model drifted into a high female register about once a minute. v2 fixed it. **For Bourbon Brothers change only the first clause** ("…narrator of a novel for adults…" or whatever the book is); keep the ONE-voice sentences word for word. |
| Request size | ≤ 1,100 characters per request (`SEG_MAX`) | A 1,800-char request took over two minutes and sometimes dropped the tail. 1,100 chars ≈ 75 s of audio. |
| Parallelism / timeout | 3 requests at a time, 180 s timeout, 4 retries | Found by failure. |
| Format | MP3, byte-joined per chapter (no ffmpeg on this machine) | MP3 frames concatenate cleanly; players accept it. |
| Playback rate in the player | 1.05× | Reads slightly slow at 1.0. |

**Pitch QA.** Each segment is decoded (`mpg123-decoder`, pure JS) and its median fundamental is compared with the chapter median. A segment more than 22% above or 20% below the median is re-generated, up to three takes. Chapter 1 of Lostman's River measured 116–139 Hz across every segment after this. Expect a quarter of segments to re-roll; budget for it.

**Disclosure.** OpenAI's usage policy requires telling listeners the voice is AI-generated. One line on the product page and one spoken or printed line at the start of the book: "Narrated by an AI voice."

## 2. The scripts to copy

Both live in the Lostman's River repo, `C:\Users\mckil\Documents\Lostmans River Web Project\lostmans-river-companion\scripts\`:

- `narrate.mjs` — splits the manuscript into chapters, packs paragraphs into ≤ 1,100-char segments at sentence ends, calls the API 3-wide with retries, runs the pitch check, re-rolls outliers, byte-joins to `public/audio/ch-NN.mp3`, and keeps `ch-NN/seg-XX.mp3` so a single bad segment can be redone. Flags: `all`, a chapter number, `--dry` (count segments and estimate, no spend), `SEG_LIMIT=n` (first n segments only, for a voice test), `TTS_MODEL=…`.
- `pitch.mjs` — the pitch report for a chapter folder; `narrate.mjs` imports it.

What to change for Bourbon Brothers:

1. `chapters()` in `narrate.mjs` splits on `Chapter N –Title` lines, which is how the Lostman's manuscript is formatted. Point it at the Bourbon manuscript and adjust the regex to its chapter headings. Read the manuscript's first 200 lines before touching the regex.
2. The first clause of `INSTRUCTIONS`, as above. Bump `STYLE_V` to 3 so nothing stale is reused.
3. `npm i mpg123-decoder` in the Bourbon project (the only dependency; Node 24, no Python, no ffmpeg).

Key handling: never paste the key in chat or commit it. Run with

```bash
OPENAI_KEY_FILE="/c/Users/mckil/Documents/BourbonBrother.app/Guided Pour III/worker/.dev.vars" node scripts/narrate.mjs --dry
```

(`--dry` first; it prints the segment count and the estimate. Then `SEG_LIMIT=6 node scripts/narrate.mjs 1` for a two-minute voice test the author listens to before spending on the whole book.)

## 3. Cost and time, 250 pages

| | |
|---|---|
| Words | ~75,000 |
| Finished audio | ~8 to 8.5 hours |
| OpenAI cost at ~$0.015 per audio minute | ~$7.50, call it $10 with re-rolls |
| Wall clock at 3 parallel | 2 to 3 hours, unattended |
| MP3 at 128 kbps | ~450 MB total, 15–40 MB per chapter |
| Comparison | `tts-1-hd` ~$13 · ElevenLabs $100+ · human narrator $1,700–3,300 |

Audio goes to Cloudflare R2, never to git (the Lostman's repo commits only its chapter-1 sample; `.gitignore` has `public/audio/*` with one exception).

## 4. Delivery: what a buyer gets

The goal is "feels like a regular audiobook": chapter list, remembered position, speed, lock-screen controls with the screen off, download for a flight. Build it in this order.

### 4a. Storage and gate
- Chapter MP3s in an R2 bucket (`bourbon-audio/ch-NN.mp3`).
- The existing Guided Pour worker serves `/audio/:token/ch-NN.mp3`: look the token up in KV, 404 if missing or revoked, otherwise stream from R2 with `Accept-Ranges` so seeking works. Free egress.
- Token = the purchase. Stripe webhook `checkout.session.completed` → write `{email, created, product}` to KV under a random 24-char token.

### 4b. The player page (`/listen/:token`)
- Chapter list with durations; current chapter highlighted.
- Position memory per chapter in `localStorage`, resume on return.
- Speed control (0.8–1.5×, default 1.05×), a sleep timer (15/30/45 min, end of chapter).
- **Media Session API**: set `navigator.mediaSession.metadata` (title, chapter, cover art) and the `previoustrack`/`nexttrack`/`seekbackward`/`seekforward` handlers. This puts the book on the phone's lock screen and keeps it playing with the screen off. iOS needs the first play to come from a tap.
- `preload="none"` on every `<audio>`; only the current chapter loads.
- One line in the footer: "Narrated by an AI voice."
- The Lostman's `src/components/ChapterAudio.astro` has the position memory and speed already; the rest is a day.

### 4c. The private podcast feed (`/feed/:token.xml`)
This is what makes it native with no app to build. The worker renders RSS 2.0 with iTunes tags: one `<item>` per chapter, `<enclosure>` pointing at the tokened MP3 URL, cover art in `<itunes:image>`, episodes in chapter order with `<itunes:episodeType>full</itunes:episodeType>` and `<itunes:type>serial</itunes:type>`. The buyer taps "Add to Apple Podcasts / Overcast / Pocket Casts" on the player page and gets downloads, offline, speed and lock-screen controls in the app they already use. Companies like Supercast sell exactly this; it is ~80 lines in a worker. Revoking a buyer is deleting the token.

### 4d. The email
Yes, deliver by email; it is how everyone outside Audible does it. From the worker on the webhook (or the Stripe receipt's custom message once the token exists):

- Cover image, "Your audiobook is ready."
- **Listen** button → `/listen/:token`.
- "Or add it to your podcast app:" → the feed URL, plus the one-tap `podcast://` / `overcast://` links.
- "Narrated by an AI voice." · 30-day refund line · reply-to for help.
- Never attach the MP3s (10–40 MB each; mail servers reject over ~25 MB). The link is the product.
- Expect forwarding to a spouse; that is fine. Revoke only on abuse, and re-issue rather than argue. "I lost the email" = re-send the same link.

### 4e. Spotify and the free sample
- **Spotify audiobooks** go through Findaway Voices (Spotify-owned): a cut, their pricing, and AI-narration rules that change; check the current policy before relying on it. Not needed for a paid product sold from your own site.
- **Spotify / Apple podcasts** are free to publish through Spotify for Creators, but public, so no way to restrict to buyers. Use them for **chapter 1 as a free episode**, which is the ad. Audible's ACX will not take AI narration at all.

## 5. Rights and checks before selling
- Author-owned text: you can sell the audio however you like.
- KDP Select exclusivity (if the ebook is enrolled) covers the ebook only, not audio.
- AI disclosure as above.
- Stripe: statement descriptor, Stripe Tax on (digital goods), 30-day refund stated on the page.

## 6. Build order
1. Copy the two scripts, fix the chapter regex, `--dry`, then a 6-segment voice test for the author.
2. Narrate the whole book overnight; upload to R2.
3. Worker: token gate + range-serving MP3s.
4. Player page with Media Session.
5. RSS feed.
6. Stripe webhook → token → email.
7. Chapter 1 as a public podcast episode and on the landing page.


## 7. Update 2026-10-17, from the Bourbon session

- The Bourbon Brothers book shipped all 25 chapters on OpenAI `gpt-4o-mini-tts` (ash, 1.1x, the v2 one-voice instruction) and the author's verdict was **too flat, no intonation or intrigue**. The one-voice instruction cures the register drift by forbidding expression. ElevenLabs beat it on the same passage.
- Two ElevenLabs voices the author picked by ear: **A George** (`JBFqnCBsd6RMkjVDRZzb`, `eleven_v4`, stability 0.35, similarity 0.75, style 0, speaker boost) and **B Brian** (`nPczCjzI2devNBz1zQrb`, `eleven_multilingual_v2`, stability 0.30, similarity 0.75, style 0.45, speaker boost). No instructions field; stability is the expressiveness knob (low = more range).
- `scripts/narrate.mjs` in the Lostman's repo now supports `TTS_ENGINE=elevenlabs EL_VOICE=A|B` with the same chunking, retries, resume and byte-join; it stops on 401/402/429 instead of retrying, and it drops any segment with no letters or digits (a lone ":" once became two seconds of noise).
- **Budget:** ElevenLabs Creator is 131,000 characters a month, overage disabled, one account for both books. Bourbon needs ~301,000; Lostman's needs ~234,000 (chapter 1 alone is ~14,300, 11%). Whoever runs second in a month gets refused mid-job. Sequence with the author before any full run; use `--dry` to see the share.

- 2026-10-20: Lostman's chapter 1 was re-narrated with Brian (v2, stability 0.30, style 0.45); an A/B on three dialogue segments (v2 stability 0.20/style 0.60, and eleven_v3) did not beat it, so the original settings stand. It is live at 1.1x in the player. The OpenAI take is kept locally as public/audio/ch-01-openai-fable.mp3 (gitignored).
