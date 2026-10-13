// Pitch check for narration segments. Decodes each seg-XX.mp3, estimates the median
// fundamental frequency of the voiced frames, and reports segments that sit well above
// (or below) the chapter's median — the "voice flipped to a high register" failure.
//   node scripts/pitch.mjs public/audio/ch-01        # report
// Used by narrate.mjs to re-roll outliers automatically.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { MPEGDecoder } from 'mpg123-decoder';

const FRAME = 1024;
const HOP = 2048; // analyse every other frame; plenty for a median
const FMIN = 70;
const FMAX = 400;

export async function segmentPitch(file, decoder) {
  const { channelData, sampleRate } = decoder.decode(new Uint8Array(readFileSync(file)));
  const ch = channelData;
  const n = ch[0].length;
  const mono = new Float32Array(n);
  for (let i = 0; i < n; i++) mono[i] = ch.length > 1 ? (ch[0][i] + ch[1][i]) / 2 : ch[0][i];
  const minLag = Math.floor(sampleRate / FMAX);
  const maxLag = Math.ceil(sampleRate / FMIN);
  // energy threshold: frames below 25% of the loud-frame level are treated as silence
  const rms = [];
  for (let s = 0; s + FRAME <= n; s += HOP) {
    let e = 0;
    for (let i = 0; i < FRAME; i++) e += mono[s + i] * mono[s + i];
    rms.push(Math.sqrt(e / FRAME));
  }
  const loud = [...rms].sort((a, b) => a - b)[Math.floor(rms.length * 0.9)] || 0;
  const thr = loud * 0.25;
  const f0s = [];
  let fi = 0;
  for (let s = 0; s + FRAME + maxLag <= n; s += HOP, fi++) {
    if (rms[fi] < thr) continue;
    let e0 = 0;
    for (let i = 0; i < FRAME; i++) e0 += mono[s + i] * mono[s + i];
    let best = 0,
      bestLag = 0;
    for (let lag = minLag; lag <= maxLag; lag++) {
      let c = 0,
        e1 = 0;
      for (let i = 0; i < FRAME; i++) {
        c += mono[s + i] * mono[s + i + lag];
        e1 += mono[s + i + lag] * mono[s + i + lag];
      }
      const r = c / Math.sqrt(e0 * e1 + 1e-9);
      if (r > best) {
        best = r;
        bestLag = lag;
      }
    }
    if (best > 0.6 && bestLag) f0s.push(sampleRate / bestLag);
  }
  f0s.sort((a, b) => a - b);
  const med = f0s.length ? f0s[Math.floor(f0s.length / 2)] : 0;
  return { f0: med, voiced: f0s.length, secs: n / sampleRate };
}

export async function chapterReport(dir, decoder) {
  const own = !decoder;
  decoder = decoder ?? new MPEGDecoder();
  await decoder.ready;
  const files = readdirSync(dir)
    .filter((f) => /^seg-\d+\.mp3$/.test(f))
    .sort();
  const rows = [];
  for (const f of files) {
    const r = await segmentPitch(join(dir, f), decoder);
    rows.push({ file: f, ...r });
  }
  const f0s = rows.map((r) => r.f0).filter(Boolean).sort((a, b) => a - b);
  const median = f0s.length ? f0s[Math.floor(f0s.length / 2)] : 0;
  for (const r of rows) {
    r.ratio = median ? r.f0 / median : 1;
    r.flag = r.ratio > 1.22 ? 'HIGH' : r.ratio < 0.8 ? 'LOW' : '';
  }
  if (own) decoder.free();
  return { median, rows };
}

if (process.argv[1] && process.argv[1].endsWith('pitch.mjs')) {
  const dir = process.argv[2];
  if (!dir) {
    console.log('usage: node scripts/pitch.mjs <segment dir>');
    process.exit(0);
  }
  const { median, rows } = await chapterReport(dir);
  console.log(`chapter median F0 ≈ ${median.toFixed(0)} Hz`);
  for (const r of rows) console.log(`  ${r.file}  ${r.f0.toFixed(0).padStart(4)} Hz  ×${r.ratio.toFixed(2)}  ${r.secs.toFixed(0).padStart(3)}s  ${r.flag}`);
  const bad = rows.filter((r) => r.flag);
  console.log(bad.length ? `${bad.length} segment(s) out of register: ${bad.map((r) => r.file).join(', ')}` : 'all segments in register');
}
