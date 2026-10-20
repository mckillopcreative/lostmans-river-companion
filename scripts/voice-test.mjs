// A/B voice test on a few dialogue-heavy segments, so settings can be judged without
// re-rendering a chapter. Renders each variant below for the same passage and writes
// public/audio/voice-test/<variant>.mp3 (gitignored). The "current" file is joined from the
// chapter's existing segments at no cost.
//
//   OPENAI_KEY_FILE=<.dev.vars with ELEVENLABS_API_KEY> TTS_ENGINE=elevenlabs node scripts/voice-test.mjs [chapter=1] [segments=3]
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { chapters, segments, tts, key, EL_VOICES, ENGINE } from './narrate.mjs';

if (ENGINE !== 'elevenlabs') {
  console.error('set TTS_ENGINE=elevenlabs');
  process.exit(1);
}
const root = resolve(import.meta.dirname, '..');
const chN = Number(process.argv[2] || 1);
const nPick = Number(process.argv[3] || 3);
const ch = chapters().find((c) => c.n === chN);
const segs = segments(ch);
const base = EL_VOICES.B; // Brian, the author's pick
const variants = {
  'v2-loose': { ...base, voice_settings: { ...base.voice_settings, stability: 0.2, style: 0.6 } },
  v3: { ...base, model_id: 'eleven_v3', voice_settings: { stability: 0.5, similarity_boost: 0.75, use_speaker_boost: true } },
};

// the segments with the most quotation marks, kept in story order
const picked = segs
  .map((t, i) => ({ i, t, q: (t.match(/[“”"]/g) ?? []).length }))
  .sort((a, b) => b.q - a.q)
  .slice(0, nPick)
  .sort((a, b) => a.i - b.i);
const chars = picked.reduce((a, p) => a + p.t.length, 0);
console.log(`chapter ${chN}: segments ${picked.map((p) => p.i + 1).join(', ')} (${chars} chars) × ${Object.keys(variants).length} variants = ${chars * Object.keys(variants).length} characters`);

const out = resolve(root, 'public/audio/voice-test');
mkdirSync(out, { recursive: true });
const existing = resolve(root, 'public/audio', `ch-${String(chN).padStart(2, '0')}-el-b`);
if (existsSync(existing)) {
  writeFileSync(join(out, 'current.mp3'), Buffer.concat(picked.map((p) => readFileSync(join(existing, `seg-${String(p.i + 1).padStart(2, '0')}.mp3`)))));
  console.log('  current.mp3 joined from the existing take (no credits)');
}
const apiKey = key();
for (const [name, el] of Object.entries(variants)) {
  const parts = [];
  for (const p of picked) {
    parts.push(await tts(apiKey, p.t, `${name} seg ${p.i + 1}`, el));
    console.log(`  ${name}: seg ${p.i + 1} ok`);
  }
  writeFileSync(join(out, `${name}.mp3`), Buffer.concat(parts));
  console.log(`  → ${join(out, `${name}.mp3`)}`);
}
console.log('done');
