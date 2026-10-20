// Chapter narration, generated once and shipped as static MP3s (no runtime cost, no key
// in the browser). Same provider and voice as the Socrates app (OpenAI gpt-4o-mini-tts,
// voice "fable"), with a storyteller instruction instead of the bar-host one.
//
//   OPENAI_API_KEY=... node scripts/narrate.mjs 1          # one chapter
//   OPENAI_API_KEY=... node scripts/narrate.mjs all        # all 23
//   OPENAI_KEY_FILE=<path to a KEY=VALUE file> node scripts/narrate.mjs 1
//   node scripts/narrate.mjs all --dry                     # segment counts and cost, no calls
//
// Output: public/audio/ch-NN.mp3 (joined with ffmpeg when available, byte-joined otherwise)
//         plus public/audio/ch-NN/seg-XX.mp3 and segments.json for the segmented player.
// The key is read from the environment or a KEY=VALUE file; it is never printed or logged.
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { MPEGDecoder } from 'mpg123-decoder';
import { chapterReport, segmentPitch } from './pitch.mjs';

const root = resolve(import.meta.dirname, '..');
const MODEL = process.env.TTS_MODEL || 'gpt-4o-mini-tts'; // tts-1-hd = older studio model, same voices, no instructions, steadier
const SEG_LIMIT = Number(process.env.SEG_LIMIT || 0); // for samples: only the first N segments
const VOICE = 'fable'; // the Socrates voice — keep in step with BourbonBrother.app/docs/VOICE_PORT_DIRECTIONS.md
const INSTRUCTIONS =
  'You are the single narrator of a middle-grade adventure novel, reading an audiobook. Use ONE voice for the entire recording: your own natural adult narrator voice, the same pitch and timbre in every sentence, including all dialogue. Do not perform character voices, do not raise your pitch for women or children, do not whisper or shout. Steady audiobook pace, clear and warm with a little grit, tension carried by timing and emphasis only. No dramatic pauses, no announcer cadence.';
const STYLE_V = 2; // bump when VOICE or INSTRUCTIONS change so stale files are regenerated
// Engine. 'openai' (default) is the stack above. 'elevenlabs' uses the two voices John picked
// by ear in the Bourbon Brothers session (2026-10-17) after the OpenAI render of that book came
// back "too flat": ElevenLabs has no instructions field; low stability = more expression.
// Budget: the Creator plan is 131,000 characters a month with overage disabled, shared with
// the Bourbon Brothers book, so run --dry first and sequence with John before a full run.
const ENGINE = process.env.TTS_ENGINE === 'elevenlabs' ? 'elevenlabs' : 'openai';
const EL_VOICES = {
  A: { name: 'George', voice_id: 'JBFqnCBsd6RMkjVDRZzb', model_id: 'eleven_v4', voice_settings: { stability: 0.35, similarity_boost: 0.75, style: 0.0, use_speaker_boost: true } },
  B: { name: 'Brian', voice_id: 'nPczCjzI2devNBz1zQrb', model_id: 'eleven_multilingual_v2', voice_settings: { stability: 0.3, similarity_boost: 0.75, style: 0.45, use_speaker_boost: true } },
};
const EL_VOICE = (process.env.EL_VOICE || 'B').toUpperCase(); // B Brian is the author's pick (2026-10-20: "5-brian-multi-low")
const EL = EL_VOICES[EL_VOICE] ?? EL_VOICES.A;
const EL_MONTHLY = 131000;
// Short requests: the model drops the tail of long inputs (Socrates, Oct 1) and a 1,800-char
// request took over two minutes on Oct 13. ~1,100 chars ≈ 75 s of audio per request.
const SEG_MAX = 1100;
const PARALLEL = 3;
const TIMEOUT_MS = 180000;
const DRY = process.argv.includes('--dry');

function key() {
  const name = ENGINE === 'elevenlabs' ? 'ELEVENLABS_API_KEY' : 'OPENAI_API_KEY';
  if (process.env[name]) return process.env[name];
  const f = process.env.OPENAI_KEY_FILE;
  if (f && existsSync(f)) {
    const m = new RegExp('^\\s*' + name + '\\s*=\\s*"?([^"\\r\\n]+)"?', 'm').exec(readFileSync(f, 'utf8'));
    if (m) return m[1].trim();
  }
  console.error(`No key: set ${name} or OPENAI_KEY_FILE=<path to a KEY=VALUE file that holds it>.`);
  process.exit(1);
}

function chapters() {
  const t = readFileSync(resolve(root, 'source/manuscript.txt'), 'utf8');
  // "Chapter 7 –A Tarpon" has no space after its dash in the manuscript, hence \s*.
  const parts = t.split(/\r?\n(?=Chapter \d+ [–-]\s*)/).slice(1);
  return parts.map((p) => {
    const m = /^Chapter (\d+) [–-]\s*([^\r\n]+)/.exec(p);
    const body = p
      .replace(/^[^\r\n]+\r?\n/, '')
      .replace(/\[[^\]]*Description automatically generated[^\]]*\]/g, '')
      .replace(/\r/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/^The End\s*$/m, '')
      .trim();
    return { n: Number(m[1]), title: m[2].trim(), body };
  });
}

// Paragraph-first packing; a paragraph longer than SEG_MAX is split at sentence ends.
function segments(ch) {
  const open = `Chapter ${ch.n}. ${ch.title}.`;
  const paras = [open, ...ch.body.split(/\n\s*\n/).map((p) => p.replace(/\s+/g, ' ').trim()).filter(Boolean)];
  const out = [];
  let cur = '';
  const push = () => {
    if (cur.trim()) out.push(cur.trim());
    cur = '';
  };
  for (const p of paras) {
    const units = p.length > SEG_MAX ? (p.match(/[^.!?]+[.!?]+["’”]?\s*|[^.!?]+$/g) ?? [p]) : [p];
    for (const u of units) {
      if ((cur + ' ' + u).length > SEG_MAX) push();
      cur += (cur ? ' ' : '') + u.trim();
    }
    if (p.length <= SEG_MAX && cur.length > SEG_MAX * 0.6) push(); // paragraph ends make natural seams
  }
  push();
  return out.filter((t) => /[\p{L}\p{N}]/u.test(t));
}

async function tts(apiKey, text, label) {
  let last = 'unknown';
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res =
        ENGINE === 'elevenlabs'
          ? await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${EL.voice_id}?output_format=mp3_44100_128`, {
              method: 'POST',
              headers: { 'xi-api-key': apiKey, 'content-type': 'application/json' },
              body: JSON.stringify({ text, model_id: EL.model_id, voice_settings: EL.voice_settings }),
              signal: AbortSignal.timeout(TIMEOUT_MS),
            })
          : await fetch('https://api.openai.com/v1/audio/speech', {
              method: 'POST',
              headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
              body: JSON.stringify({ model: MODEL, voice: VOICE, ...(MODEL.startsWith('gpt-') ? { instructions: INSTRUCTIONS } : {}), input: text, response_format: 'mp3' }),
              signal: AbortSignal.timeout(TIMEOUT_MS),
            });
      if (res.status === 401 || res.status === 402 || res.status === 429) {
        // quota or auth: retrying will not help, and on ElevenLabs a spent allowance refuses
        throw Object.assign(new Error(`${label}: ${ENGINE} refused with status ${res.status} (${(await res.text()).slice(0, 160)})`), { quota: true });
      }
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length > 2000) return buf;
        last = `short body ${buf.length}B`;
      } else last = `status ${res.status}`;
    } catch (e) {
      if (e.quota) throw e; // the quota/auth guard above must escape the retry loop
      last = e.name === 'TimeoutError' ? 'timeout' : e.message;
    }
    console.warn(`  ${label}: retry ${attempt} (${last})`);
    await new Promise((r) => setTimeout(r, 3000 * attempt));
  }
  throw new Error(`${label}: TTS failed after 4 attempts (${last})`);
}

function hasFfmpeg() {
  try {
    execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

async function narrate(ch, apiKey) {
  const id = `ch-${String(ch.n).padStart(2, '0')}${ENGINE === 'elevenlabs' ? '-el-' + EL_VOICE.toLowerCase() : MODEL === 'gpt-4o-mini-tts' ? '' : '-' + MODEL}`;
  const segs = SEG_LIMIT ? segments(ch).slice(0, SEG_LIMIT) : segments(ch);
  console.log(`Chapter ${ch.n} — ${ch.title}: ${segs.length} segments, ${ch.body.length} chars`);
  if (DRY) return;
  const dir = resolve(root, 'public/audio', id);
  mkdirSync(dir, { recursive: true });
  const stamp = join(dir, 'style.txt');
  const sig = ENGINE === 'elevenlabs' ? `el:${EL.voice_id}:${EL.model_id}:${JSON.stringify(EL.voice_settings)}:${SEG_MAX}` : `${MODEL}:${VOICE}:${STYLE_V}:${SEG_MAX}`;
  const fresh = existsSync(stamp) && readFileSync(stamp, 'utf8') === sig;
  const jobs = segs.map((text, i) => ({ i, text, file: join(dir, `seg-${String(i + 1).padStart(2, '0')}.mp3`) })).filter((j) => !(fresh && existsSync(j.file)));
  let next = 0;
  const worker = async () => {
    while (next < jobs.length) {
      const j = jobs[next++];
      const buf = await tts(apiKey, j.text, `seg ${j.i + 1}/${segs.length}`);
      writeFileSync(j.file, buf);
      console.log(`  seg ${j.i + 1}/${segs.length} ok (${Math.round(buf.length / 1024)} KB)`);
    }
  };
  await Promise.all(Array.from({ length: Math.min(PARALLEL, jobs.length) }, worker));

  // Register check (Oct 13: the voice flipped high about once a minute on the first render).
  // Measure every segment's median pitch; re-roll any that sit far from the chapter's
  // median, keeping the closest of up to three new takes.
  const decoder = new MPEGDecoder();
  await decoder.ready;
  let report = await chapterReport(dir, decoder);
  console.log(`  register: chapter median ${report.median.toFixed(0)} Hz, ${report.rows.filter((r) => r.flag).length} out of register`);
  for (const r of report.rows.filter((x) => x.flag)) {
    const idx = Number(r.file.match(/\d+/)[0]) - 1;
    const file = join(dir, r.file);
    let best = { ratio: r.ratio, buf: null };
    for (let take = 1; take <= 3; take++) {
      const buf = await tts(apiKey, segs[idx], `${r.file} re-roll ${take}`);
      const tmp = join(dir, `${r.file}.take`);
      writeFileSync(tmp, buf);
      const p = await segmentPitch(tmp, decoder);
      const ratio = p.f0 / report.median;
      console.log(`  ${r.file} take ${take}: ${p.f0.toFixed(0)} Hz ×${ratio.toFixed(2)}`);
      if (Math.abs(Math.log(ratio)) < Math.abs(Math.log(best.ratio))) best = { ratio, buf };
      if (ratio <= 1.22 && ratio >= 0.8) break;
    }
    if (best.buf) writeFileSync(file, best.buf);
    try {
      execFileSync(process.platform === 'win32' ? 'cmd' : 'rm', process.platform === 'win32' ? ['/c', 'del', '/q', join(dir, `${r.file}.take`)] : ['-f', join(dir, `${r.file}.take`)], { stdio: 'ignore' });
    } catch {}
  }
  if (report.rows.some((r) => r.flag)) {
    report = await chapterReport(dir, decoder);
    console.log(`  register after re-roll: ${report.rows.filter((r) => r.flag).length} still out (${report.rows.filter((r) => r.flag).map((r) => r.file).join(', ') || 'none'})`);
  }
  decoder.free();
  writeFileSync(stamp, sig);
  writeFileSync(join(dir, 'segments.json'), JSON.stringify(segs.map((s, i) => ({ file: `seg-${String(i + 1).padStart(2, '0')}.mp3`, chars: s.length })), null, 2));
  const files = readdirSync(dir)
    .filter((f) => /^seg-\d+\.mp3$/.test(f))
    .sort();
  const out = resolve(root, 'public/audio', `${id}.mp3`);
  if (hasFfmpeg()) {
    const list = join(dir, 'concat.txt');
    writeFileSync(list, files.map((f) => `file '${join(dir, f).replace(/'/g, "'\\''")}'`).join('\n'));
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', out]);
    console.log(`  → ${out}`);
  } else {
    // MP3 frames from the same encoder concatenate cleanly enough for a player; install
    // ffmpeg (winget install ffmpeg) for a proper join if a seam is ever audible.
    writeFileSync(out, Buffer.concat(files.map((f) => readFileSync(join(dir, f)))));
    console.log(`  → ${out} (byte-joined; no ffmpeg)`);
  }
}

const arg = process.argv.find((a, i) => i >= 2 && !a.startsWith('--'));
if (!arg) {
  console.log('usage: node scripts/narrate.mjs <chapter number | all> [--dry]');
  process.exit(0);
}
const all = chapters();
const todo = arg === 'all' ? all : all.filter((c) => c.n === Number(arg));
if (!todo.length) {
  console.error('no such chapter');
  process.exit(1);
}
const chars = todo.reduce((a, c) => a + c.body.length, 0);
if (ENGINE === 'elevenlabs') {
  const segChars = todo.reduce((a, c) => a + segments(c).reduce((x, t) => x + t.length, 0), 0);
  console.log(`${todo.length} chapter(s), ${segChars} characters to send, ElevenLabs voice ${EL_VOICE} (${EL.name}, ${EL.model_id}): ${((segChars / EL_MONTHLY) * 100).toFixed(0)}% of the ${EL_MONTHLY.toLocaleString()}-character monthly allowance, before any re-rolls`);
} else console.log(`${todo.length} chapter(s), ${chars} characters, voice ${VOICE}, est. cost ${((chars / 1e6) * 15).toFixed(2)}`);
const apiKey = DRY ? '' : key();
for (const ch of todo) await narrate(ch, apiKey);
console.log('done');
