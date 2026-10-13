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

const root = resolve(import.meta.dirname, '..');
const MODEL = 'gpt-4o-mini-tts';
const VOICE = 'fable'; // the Socrates voice — keep in step with BourbonBrother.app/docs/VOICE_PORT_DIRECTIONS.md
const INSTRUCTIONS =
  'You are narrating a middle-grade adventure novel for a listener aged ten to fifteen. Read like a good audiobook narrator: steady, clear, unhurried but never slow, with warmth and a little grit. Keep dialogue natural and lightly distinct per speaker without doing cartoon voices. Let tension build in action scenes and ease off in quiet ones. No dramatic pauses, no announcer cadence.';
const STYLE_V = 1; // bump when VOICE or INSTRUCTIONS change so stale files are regenerated
// Short requests: the model drops the tail of long inputs (Socrates, Oct 1) and a 1,800-char
// request took over two minutes on Oct 13. ~1,100 chars ≈ 75 s of audio per request.
const SEG_MAX = 1100;
const PARALLEL = 3;
const TIMEOUT_MS = 180000;
const DRY = process.argv.includes('--dry');

function key() {
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY;
  const f = process.env.OPENAI_KEY_FILE;
  if (f && existsSync(f)) {
    const m = /^\s*OPENAI_API_KEY\s*=\s*"?([^"\r\n]+)"?/m.exec(readFileSync(f, 'utf8'));
    if (m) return m[1].trim();
  }
  console.error('No key: set OPENAI_API_KEY or OPENAI_KEY_FILE=<path to a KEY=VALUE file>.');
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
  return out;
}

async function tts(apiKey, text, label) {
  let last = 'unknown';
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
        body: JSON.stringify({ model: MODEL, voice: VOICE, instructions: INSTRUCTIONS, input: text, response_format: 'mp3' }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length > 2000) return buf;
        last = `short body ${buf.length}B`;
      } else last = `status ${res.status}`;
    } catch (e) {
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
  const id = `ch-${String(ch.n).padStart(2, '0')}`;
  const segs = segments(ch);
  console.log(`Chapter ${ch.n} — ${ch.title}: ${segs.length} segments, ${ch.body.length} chars`);
  if (DRY) return;
  const dir = resolve(root, 'public/audio', id);
  mkdirSync(dir, { recursive: true });
  const stamp = join(dir, 'style.txt');
  const sig = `${VOICE}:${STYLE_V}:${SEG_MAX}`;
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
console.log(`${todo.length} chapter(s), ${chars} characters, voice ${VOICE}, est. cost $${((chars / 1e6) * 15).toFixed(2)}`);
const apiKey = DRY ? '' : key();
for (const ch of todo) await narrate(ch, apiKey);
console.log('done');
