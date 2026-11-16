// Uncle Dan's lines for Wild Florida, one short MP3 per animal, in the book narrator's voice
// (Brian, ElevenLabs; John, 2026-11-16: "the narrator could be Uncle Dan, same voice").
//   OPENAI_KEY_FILE=<file with ELEVENLABS_API_KEY> TTS_ENGINE=elevenlabs node scripts/wild-voice.mjs [--dry] [id …]
// Writes public/audio/wild/<id>.mp3 (and intro.mp3). A line is recorded again only when its
// text has changed (public/audio/wild/lines.json keeps what each file says). About 16,000
// characters for the whole set.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { tts, key, ENGINE } from './narrate.mjs';

if (ENGINE !== 'elevenlabs') {
  console.error('set TTS_ENGINE=elevenlabs');
  process.exit(1);
}
const root = resolve(import.meta.dirname, '..');
const dry = process.argv.includes('--dry');
const only = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const data = JSON.parse(readFileSync(resolve(root, 'data/wild.json'), 'utf8'));
const dir = resolve(root, 'public/audio/wild');
mkdirSync(dir, { recursive: true });
const memo = join(dir, 'lines.json');
const said = existsSync(memo) ? JSON.parse(readFileSync(memo, 'utf8')) : {};
// how a word is written for the ear, where the voice would otherwise trip (none needed so far;
// listen to "largemouth bass" and "peacock bass" after a re-record: the voice must say the fish, not the guitar)
const forEar = (t) => t;
const lines = [{ id: 'intro', text: data.intro }, ...data.animals.map((a) => ({ id: a.id, text: a.dan }))].filter((l) => !only.length || only.includes(l.id));
const todo = lines.filter((l) => said[l.id] !== l.text || !existsSync(join(dir, `${l.id}.mp3`)));
console.log(`${lines.length} lines, ${todo.length} to record, ${todo.reduce((n, l) => n + l.text.length, 0)} characters`);
if (dry || !todo.length) process.exit(0);
const apiKey = key();
let next = 0;
const worker = async () => {
  while (next < todo.length) {
    const l = todo[next++];
    const buf = await tts(apiKey, forEar(l.text), l.id);
    writeFileSync(join(dir, `${l.id}.mp3`), buf);
    said[l.id] = l.text;
    writeFileSync(memo, JSON.stringify(said, null, 1));
    console.log(`  ${l.id} ok (${Math.round(buf.length / 1024)} KB)`);
  }
};
await Promise.all(Array.from({ length: 3 }, worker));
console.log('done');
