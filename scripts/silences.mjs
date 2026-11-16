// Lists the silent gaps in an MP3 (default: 1.2 s or longer), to check that the "[pause]" after a
// Training Manual quiz question really came out as silence.   node scripts/silences.mjs <file.mp3> [minSeconds]
import { readFileSync } from 'node:fs';
import { MPEGDecoder } from 'mpg123-decoder';

const [file, minArg] = process.argv.slice(2);
const MIN = Number(minArg) || 1.2;
const decoder = new MPEGDecoder();
await decoder.ready;
const { channelData, sampleRate } = decoder.decode(new Uint8Array(readFileSync(file)));
decoder.free();
const x = channelData[0];
const win = Math.round(sampleRate * 0.05);
const rms = [];
for (let s = 0; s + win <= x.length; s += win) {
  let e = 0;
  for (let i = 0; i < win; i++) e += x[s + i] * x[s + i];
  rms.push(Math.sqrt(e / win));
}
const loud = [...rms].sort((a, b) => a - b)[Math.floor(rms.length * 0.9)] || 0;
const thr = loud * 0.04;
const gaps = [];
let start = -1;
rms.forEach((r, i) => {
  if (r < thr) {
    if (start < 0) start = i;
  } else {
    if (start >= 0 && (i - start) * 0.05 >= MIN) gaps.push([start * 0.05, (i - start) * 0.05]);
    start = -1;
  }
});
const total = x.length / sampleRate;
console.log(`${file}: ${total.toFixed(1)} s, ${gaps.length} gap(s) of ${MIN} s or more${gaps.length ? ': ' + gaps.map(([t, d]) => `${d.toFixed(1)} s at ${t.toFixed(0)} s`).join(', ') : ''}`);
