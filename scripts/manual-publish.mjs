// After `narrate.mjs manual all`: put the Training Manual's audio where the site looks for it.
//   node scripts/manual-publish.mjs             # lesson 1 → public/audio/tm-01.mp3, minutes → data/audio.json
//   node scripts/manual-publish.mjs --upload    # also lessons 2+ → R2 (lostmans-audio/tm-NN.mp3), served by the Worker to key holders
// Wrangler: set WRANGLER=<path to wrangler.js>, or it uses the one in the Bourbon project (this machine).
import { readFileSync, writeFileSync, copyFileSync, existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { homedir } from 'node:os';

const root = resolve(import.meta.dirname, '..');
const manual = JSON.parse(readFileSync(resolve(root, 'data/manual.json'), 'utf8'));
const voice = (process.env.EL_VOICE || 'B').toLowerCase();
const file = (n) => resolve(root, 'public/audio', `tm-${String(n).padStart(2, '0')}-el-${voice}.mp3`);
const missing = manual.lessons.filter((l) => !existsSync(file(l.n)));
if (missing.length) {
  console.error('not narrated yet: lesson ' + missing.map((l) => l.n).join(', '));
  process.exit(1);
}
// the provider returns 128 kbps MP3 (16,000 bytes a second); the player runs at manual.rate
const minutes = {};
let secs = 0;
for (const l of manual.lessons) {
  const s = statSync(file(l.n)).size / 16000 / manual.rate;
  secs += s;
  minutes[l.n] = Math.max(1, Math.round(s / 60));
}
const audioPath = resolve(root, 'data/audio.json');
const audio = JSON.parse(readFileSync(audioPath, 'utf8'));
audio.manual = minutes;
writeFileSync(audioPath, JSON.stringify(audio, null, 2) + '\n');
copyFileSync(file(1), resolve(root, 'public/audio/tm-01.mp3'));
console.log(`minutes written (${Object.values(minutes).reduce((a, b) => a + b, 0)} in all; ${(secs / 60).toFixed(1)} exactly, at ${manual.rate}x); lesson 1 copied to public/audio/tm-01.mp3`);

if (process.argv.includes('--upload')) {
  const wrangler = process.env.WRANGLER || resolve(homedir(), 'Documents/BourbonBrother.app/node_modules/wrangler/bin/wrangler.js');
  for (const l of manual.lessons.filter((x) => x.n > 1)) {
    const name = `tm-${String(l.n).padStart(2, '0')}.mp3`;
    execFileSync(process.execPath, [wrangler, 'r2', 'object', 'put', `lostmans-audio/${name}`, '--file', file(l.n), '--content-type', 'audio/mpeg', '--remote'], { cwd: resolve(root, 'worker'), stdio: ['ignore', 'ignore', 'inherit'] });
    console.log(`  uploaded ${name}`);
  }
}
