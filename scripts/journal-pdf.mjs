// The ready-made PDF of Matt's Fishing Journal (John, 2026-11-16), printed from the LIVE page by
// headless Chrome so it has the site's real fonts and pictures. Key holders download it from the
// Worker (GET /guide/:key/matts-fishing-journal.pdf, from R2) and the welcome email links to it.
//
//   node scripts/journal-pdf.mjs                 # → private/pdf/matts-fishing-journal.pdf (+ page shots for checking)
//   node scripts/journal-pdf.mjs --url http://127.0.0.1:4321/fishing-journal/?unlocked   # from the dev server
//   then, from worker/:  wrangler r2 object put lostmans-audio/guide/matts-fishing-journal.pdf \
//                          --file ../private/pdf/matts-fishing-journal.pdf --content-type application/pdf --remote
//
// The page's lock is client-side (a well-formed key in localStorage opens it), so the script puts
// a placeholder key in the headless browser and blocks the API and analytics hosts: nothing is
// sent, no event is counted, and no real purchase key is involved. Re-run after any change to the
// journal's copy, data or pictures, and upload again.
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { tmpdir } from 'node:os';

const root = resolve(import.meta.dirname, '..');
const argv = process.argv.slice(2);
const opt = (name, d) => (argv.includes(name) ? argv[argv.indexOf(name) + 1] : d);
const URL_ = opt('--url', 'https://lostmansriver.com/fishing-journal/');
const outDir = resolve(root, 'private/pdf');
const out = join(outDir, 'matts-fishing-journal.pdf');
const CHROME = [process.env.CHROME, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find((p) => p && existsSync(p));
if (!CHROME) {
  console.error('Chrome not found; set CHROME=<path to chrome>');
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });
const profile = join(tmpdir(), `lr-pdf-${Date.now()}`);
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

// a minimal DevTools-protocol client (Node's built-in WebSocket; no dependency)
const ws = new WebSocket(wsUrl);
await new Promise((ok, bad) => ((ws.onopen = ok), (ws.onerror = bad)));
let seq = 0;
const waiting = new Map();
const events = [];
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && waiting.has(m.id)) {
    const { ok, bad } = waiting.get(m.id);
    waiting.delete(m.id);
    m.error ? bad(new Error(m.error.message)) : ok(m.result);
  } else if (m.method) events.push(m);
};
const send = (method, params = {}, sessionId) =>
  new Promise((ok, bad) => {
    const id = ++seq;
    waiting.set(id, { ok, bad });
    ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
const until = async (pred, ms = 60000) => {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    const i = events.findIndex(pred);
    if (i >= 0) return events.splice(i, 1)[0];
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error('timed out waiting for the page');
};

let code = 0;
try {
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  const S = (m, p) => send(m, p, sessionId);
  await S('Page.enable');
  await S('Network.enable');
  await S('Network.setBlockedURLs', { urls: ['*api.lostmansriver.com*', '*cloudflareinsights.com*', '*facebook*', '*google-analytics*', '*googletagmanager*'] });
  // a placeholder in the purchase key's shape; it opens the client-side lock and is never sent anywhere
  await S('Page.addScriptToEvaluateOnNewDocument', { source: "try{localStorage.setItem('lr-key','PDFPDFPDFPDFPDFPDFPDFPDF')}catch(e){}" });
  await S('Emulation.setDeviceMetricsOverride', { width: 816, height: 1056, deviceScaleFactor: 1, mobile: false });
  await S('Page.navigate', { url: URL_ });
  await until((m) => m.method === 'Page.loadEventFired' && m.sessionId === sessionId);
  const evalJs = async (expression) => {
    const r = await S('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  };
  const state = await evalJs(`(async () => {
    const fj = document.getElementById('fj');
    if (!fj) return { error: 'no journal on this page' };
    if (fj.classList.contains('is-locked')) return { error: 'the journal is still locked' };
    const imgs = [...document.images];
    imgs.forEach((i) => { i.loading = 'eager'; i.decoding = 'sync'; });
    await Promise.all(imgs.map((i) => (i.complete && i.naturalWidth ? null : new Promise((r) => { i.addEventListener('load', r, { once: true }); i.addEventListener('error', r, { once: true }); }))));
    await document.fonts.ready;
    const fam = (sel) => { const el = document.querySelector(sel); return el ? getComputedStyle(el).fontFamily.split(',')[0].replace(/["']/g, '').trim() : null; };
    const fonts = [...new Set([fam('.fj p'), fam('.fj .hand'), fam('.fj h2')].filter(Boolean))];
    return {
      sections: document.querySelectorAll('.jp').length,
      images: imgs.length,
      broken: imgs.filter((i) => !i.naturalWidth).map((i) => i.currentSrc || i.src),
      fonts: fonts.map((f) => ({ f, loaded: document.fonts.check('16px "' + f + '"') && [...document.fonts].some((x) => x.family.replace(/["']/g, '') === f && x.status === 'loaded') })),
    };
  })()`);
  if (state.error) throw new Error(state.error);
  console.log(`${state.sections} sections, ${state.images} pictures, fonts: ${state.fonts.map((f) => `${f.f}${f.loaded ? '' : ' (NOT LOADED)'}`).join(', ')}`);
  if (state.broken.length) throw new Error('pictures did not load: ' + state.broken.join(', '));

  const pdf = await S('Page.printToPDF', { preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false, generateDocumentOutline: true, generateTaggedPDF: true });
  const bytes = Buffer.from(pdf.data, 'base64');
  writeFileSync(out, bytes);
  const pages = (bytes.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
  console.log(`→ ${out}: ${pages} pages, ${(bytes.length / 1048576).toFixed(1)} MB`);

  // a look at the print layout: how tall each section is on paper (7.4in x 9.9in of sheet at 96 px/in)
  await S('Emulation.setEmulatedMedia', { media: 'print' });
  await S('Emulation.setDeviceMetricsOverride', { width: 710, height: 950, deviceScaleFactor: 1.5, mobile: false });
  const rows = await evalJs(`[...document.querySelectorAll('.jp')].map((s) => { const r = s.getBoundingClientRect(); return { h: Math.round(r.height), y: Math.round(r.top + scrollY), t: (s.querySelector('h2')?.textContent || '').trim().slice(0, 40) }; })`);
  let sheets = 0;
  for (const r of rows) {
    const n = Math.max(1, Math.ceil((r.h - 4) / 950));
    sheets += n;
    console.log(`  ${String(r.h).padStart(5)} px  ${n} sheet${n > 1 ? 's' : ' '}  ${r.t}`);
  }
  console.log(`  measured ${sheets} sheets; the PDF has ${pages}`);
  if (argv.includes('--shots')) {
    for (const [i, r] of rows.entries()) {
      const shot = await S('Page.captureScreenshot', { format: 'jpeg', quality: 70, captureBeyondViewport: true, clip: { x: 0, y: r.y, width: 710, height: Math.min(r.h, 1900), scale: 1 } });
      writeFileSync(join(outDir, `section-${String(i + 1).padStart(2, '0')}.jpg`), Buffer.from(shot.data, 'base64'));
    }
    console.log(`  section pictures in ${outDir}`);
  }
} catch (e) {
  console.error('failed:', e.message);
  code = 1;
} finally {
  try {
    await send('Browser.close');
  } catch {}
  ws.close();
  chrome.kill();
  setTimeout(() => {
    try {
      rmSync(profile, { recursive: true, force: true });
    } catch {}
    process.exit(code);
  }, 800);
}
