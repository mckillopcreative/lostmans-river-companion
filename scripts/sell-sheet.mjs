// The one-page pitch sheet for shops: sales/pitch-sheet.html → sales/pitch-sheet.pdf (US Letter)
// plus sales/pitch-sheet-preview.jpg for a quick look. Printed by headless Chrome, like the journal.
//   node scripts/sell-sheet.mjs
// Edit the words in sales/pitch-sheet.html and run this again. The pictures in sales/img/ are
// small copies made here from assets/ (cover, one of Linda's sketches, the home QR code).
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';

const root = resolve(import.meta.dirname, '..');
const dir = join(root, 'sales');
const img = join(dir, 'img');
mkdirSync(img, { recursive: true });

const argv = process.argv.slice(2);
const sketch = argv.includes('--sketch') ? argv[argv.indexOf('--sketch') + 1] : 'tarpon-leap-houseboat.png';
await sharp(join(root, 'assets/cover/cover-front.jpg')).resize({ width: 900 }).jpeg({ quality: 88 }).toFile(join(img, 'cover.jpg'));
// the trimmed copy (scripts/trim-sketches.mjs), so the drawing fills its box
await sharp(join(root, 'src/assets/sketches', sketch)).resize({ width: 900 }).png().toFile(join(img, 'sketch.png'));
await sharp(join(root, 'qr/home-back-cover.png')).resize({ width: 420 }).png().toFile(join(img, 'qr.png'));

const CHROME = [process.env.CHROME, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find((p) => p && existsSync(p));
if (!CHROME) {
  console.error('Chrome not found; set CHROME=<path to chrome>');
  process.exit(1);
}
const profile = join(tmpdir(), `lr-sheet-${Date.now()}`);
const chrome = spawn(CHROME, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
const wsUrl = await new Promise((ok, bad) => {
  let buf = '';
  const t = setTimeout(() => bad(new Error('Chrome did not start')), 30000);
  chrome.stderr.on('data', (d) => {
    buf += d;
    const m = /DevTools listening on (ws:\/\/\S+)/.exec(buf);
    if (m) (clearTimeout(t), ok(m[1]));
  });
});
const ws = new WebSocket(wsUrl);
await new Promise((ok) => (ws.onopen = ok));
let seq = 0;
const waiting = new Map();
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && waiting.has(m.id)) (waiting.get(m.id)(m.result ?? { error: m.error }), waiting.delete(m.id));
};
const send = (method, params = {}, sessionId) => new Promise((ok) => (waiting.set(++seq, ok), ws.send(JSON.stringify({ id: seq, method, params, ...(sessionId ? { sessionId } : {}) }))));
const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
const S = (m, p) => send(m, p, sessionId);
await S('Page.enable');
await S('Emulation.setDeviceMetricsOverride', { width: 816, height: 1056, deviceScaleFactor: 2, mobile: false });
await S('Page.navigate', { url: pathToFileURL(join(dir, 'pitch-sheet.html')).href });
// wait for the web fonts and the pictures, then report whether the page fits on one sheet
const fit = await S('Runtime.evaluate', {
  awaitPromise: true,
  returnByValue: true,
  expression: `(async () => { await new Promise((r) => setTimeout(r, 1500)); await document.fonts.ready; await Promise.all([...document.images].map((i) => i.decode().catch(() => {}))); const p = document.querySelector('.page'); const s = document.querySelector('.store').getBoundingClientRect(); const last = Math.max(...[...document.querySelectorAll('.cols *')].map((e) => e.getBoundingClientRect().bottom)); return { contentBottom: Math.round(last), storeTop: Math.round(s.top), fonts: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family + ' ' + f.weight + ' ' + f.style), pageHeight: p.scrollHeight, limit: 1056, storeBottom: Math.round(s.bottom), overflowing: p.scrollHeight > 1056 || s.bottom > 1056 || last > s.top }; })()`,
});
console.log(JSON.stringify(fit.result.value));
const pdf = await S('Page.printToPDF', { printBackground: true, preferCSSPageSize: true, marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0 });
writeFileSync(join(dir, 'pitch-sheet.pdf'), Buffer.from(pdf.data, 'base64'));
const shot = await S('Page.captureScreenshot', { format: 'jpeg', quality: 86 });
writeFileSync(join(dir, 'pitch-sheet-preview.jpg'), Buffer.from(shot.data, 'base64'));
console.log('sales/pitch-sheet.pdf, sales/pitch-sheet-preview.jpg');
await send('Browser.close');
ws.close();
chrome.kill();
setTimeout(() => {
  try {
    rmSync(profile, { recursive: true, force: true });
  } catch {}
  process.exit(0);
}, 500);
