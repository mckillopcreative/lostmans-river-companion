// Chapter narration, generated once and shipped as static MP3s (no runtime cost, no key
// in the browser). Same provider and voice as the Socrates app (OpenAI gpt-4o-mini-tts,
// voice "fable"), with a storyteller instruction instead of the bar-host one.
//
//   OPENAI_API_KEY=... node scripts/narrate.mjs 1          # one chapter
//   OPENAI_API_KEY=... node scripts/narrate.mjs all        # all 23
//   OPENAI_KEY_FILE=../BedsideStories_Project/worker/.dev.vars node scripts/narrate.mjs 1
//
// Output: public/audio/ch-NN.mp3 (joined with ffmpeg when available) or
//         public/audio/ch-NN/seg-XX.mp3 + public/audio/ch-NN.json (a playlist) without ffmpeg.
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
const SEG_MAX = 1800; // chars per request; the model drops the tail of long inputs (Socrates, Oct 1)

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
  const parts = t.split(/\r?\n(?=Chapter \d+ [–-] )/).slice(1);
  return parts.map((p) => {
    const m = /^Chapter (\d+) [–-] ([^\r\n]+)/.exec(p);
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

// Paragraph-first packing, sentence split only for a paragraph longer than SEG_MAX.
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
    const units = p.length > SEG_MAX ? p.match(/[^.!?]+[.!?]+["’”]?\s*|[^.!?]+$/g) ?? [p] : [p];
    for (const u of units) {
      if ((cur + ' ' + u).length > SEG_MAX) push();
      cur += (cur ? ' ' : '') + u.trim();
    }
    if (p.length <= SEG_MAX && cur.length > SEG_MAX * 0.7) push(); // keep paragraph ends as natural seams
  }
  push();
  return out;
}

async function tts(apiKey, text) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
      body: JSON.stringify({ model: MODEL, voice: VOICE, instructions: INSTRUCTIONS, input: text, response_format: 'mp3' }),
      signal: AbortSignal.timeout(120000),
    });
    if (res.ok) {
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length > 2000) return buf;
    }
    console.warn(`  retry ${attempt}: status ${res.status}`);
    await new Promise((r) => setTimeout(r, 2000 * attempt));
  }
  throw new Error('TTS failed after 3 attempts');
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
  const dir = resolve(root, 'public/audio', `ch-${String(ch.n).padStart(2, '0')}`);
  mkdirSync(dir, { recursive: true });
  const segs = segments(ch);
  const stamp = join(dir, 'style.txt');
  const fresh = existsSync(stamp) && readFileSync(stamp, 'utf8') === `${VOICE}:${STYLE_V}`;
  console.log(`Chapter ${ch.n} — ${ch.title}: ${segs.length} segments, ${ch.body.length} chars`);
  for (let i = 0; i < segs.length; i++) {
    const f = join(dir, `seg-${String(i + 1).padStart(2, '0')}.mp3`);
    if (fresh && existsSync(f)) continue;
    process.stdout.write(`  seg ${i + 1}/${segs.length}… `);
    writeFileSync(f, await tts(apiKey, segs[i]));
    console.log('ok');
  }
  writeFileSync(stamp, `${VOICE}:${STYLE_V}`);
  writeFileSync(join(dir, 'segments.json'), JSON.stringify(segs.map((s, i) => ({ file: `seg-${String(i + 1).padStart(2, '0')}.mp3`, chars: s.length })), null, 2));
  if (hasFfmpeg()) {
    const list = join(dir, 'concat.txt');
    writeFileSync(list, readdirSync(dir).filter((f) => /^seg-\d+\.mp3$/.test(f)).sort().map((f) => `file '${join(dir, f).replace(/'/g, "'\\''")}'`).join('\n'));
    const out = resolve(root, 'public/audio', `ch-${String(ch.n).padStart(2, '0')}.mp3`);
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', out]);
    console.log(`  → ${out}`);
  } else {
    console.log('  (no ffmpeg: left as segments + segments.json; the player can play the list back to back)');
  }
}

const arg = process.argv[2];
if (!arg) {
  console.log('usage: node scripts/narrate.mjs <chapter number | all>');
  process.exit(0);
}
const apiKey = key();
const all = chapters();
const todo = arg === 'all' ? all : all.filter((c) => c.n === Number(arg));
if (!todo.length) {
  console.error('no such chapter');
  process.exit(1);
}
const chars = todo.reduce((a, c) => a + c.body.length, 0);
console.log(`${todo.length} chapter(s), ${chars} characters, voice ${VOICE}, est. cost $${((chars / 1e6) * 15).toFixed(2)}`);
for (const ch of todo) await narrate(ch, apiKey);
console.log('done');
