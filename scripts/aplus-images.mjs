// The picture panels for the book's Amazon page (A+ Content, KDP > Marketing), built from the
// site's own art and the two author photos. No web address, QR code, price or holiday wording in
// any of them: A+ Content bans all four.   node scripts/aplus-images.mjs <out-dir>
//   header-970x600.jpg          mother and son, then and now, over the houseboat painting
//   inside-1…3 (600x600)        read aloud · Guide School · Wild Florida
//   pass-1…4  (440x440)         one book · one pass · five readers · a summer on the water
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
const out = process.argv[2];
if (!out) throw new Error('usage: aplus-images.mjs <out-dir>');
mkdirSync(out, { recursive: true });
const A = (p) => join('assets', p);
const jpg = (img, name) => img.flatten({ background: '#f6f1e7' }).jpeg({ quality: 88, chromaSubsampling: '4:4:4' }).toFile(join(out, name)).then((i) => console.log(name, `${i.width}x${i.height}`, Math.round(i.size / 1024) + ' KB'));
const svg = (w, h, body) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${body}</svg>`);

// ---- 1. header, 1940 x 1200 (shown at 970 x 600)
{
  const W = 1940, H = 1200;
  const bg = await sharp(A('art/tiles/app-hero.webp')).resize(W, H, { fit: 'cover', position: 'centre' }).modulate({ brightness: 0.82 }).toBuffer();
  const shade = svg(W, H, `<defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#10221d" stop-opacity="0.86"/><stop offset="0.52" stop-color="#10221d" stop-opacity="0.6"/><stop offset="1" stop-color="#10221d" stop-opacity="0.2"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/>`);
  // the photos stay at or under their own size doubled once, framed like prints
  const frame = async (file, w, h, rot) => {
    const pic = await sharp(A(file)).resize(w, h, { fit: 'cover', kernel: 'lanczos3' }).toBuffer();
    const pad = 22;
    const card = await sharp({ create: { width: w + pad * 2, height: h + pad * 2 + 70, channels: 4, background: '#fbf8f1' } }).composite([{ input: pic, left: pad, top: pad }]).png().toBuffer();
    return sharp(card).rotate(rot, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  };
  const then = await frame('photos/john-and-linda-then.jpg', 430, 430, -4);
  const now = await frame('photos/authors.jpg', 430, 574, 3);
  const text = svg(W, H, `
    <style>.h{font-family:Georgia,'Times New Roman',serif;font-weight:700;fill:#fbf8f1}.s{font-family:Georgia,serif;font-style:italic;fill:#f3c48f}.c{font-family:Georgia,serif;font-style:italic;fill:#2f5d50}</style>
    <text x="110" y="360" class="s" font-size="54">Mother and son, co-authors</text>
    <text x="110" y="480" class="h" font-size="84">It took us decades.</text>
    <text x="110" y="590" class="h" font-size="84">We finished it</text>
    <text x="110" y="700" class="h" font-size="84">together.</text>
    <text x="110" y="810" class="s" font-size="50">Linda and John McKillop</text>`);
  const cap = (t, x, y, rot) => ({ input: svg(300, 90, `<text x="150" y="62" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="54" fill="#2f5d50" transform="rotate(${rot} 150 45)">${t}</text>`), left: x, top: y });
  await jpg(
    sharp(bg).composite([
      { input: shade },
      { input: text },
      { input: then, left: 1000, top: 330 },
      cap("then", 1090, 790, -4),
      { input: now, left: 1410, top: 230 },
      cap('now', 1530, 840, 3),
    ]),
    'header-970x600.jpg',
  );
}

// ---- squares: a crop of a painting, exactly as painted (no text in the picture)
const square = (file, size, opts = {}) => sharp(A(file)).extract(opts.extract ?? undefined).resize(size, size, { fit: 'cover', position: opts.position ?? 'centre' });
const meta = async (f) => sharp(A(f)).metadata();
const cropOf = async (f, fx, fy, fs) => {
  const m = await meta(f);
  const s = Math.round(Math.min(m.width, m.height) * fs);
  const left = Math.max(0, Math.min(m.width - s, Math.round(m.width * fx - s / 2)));
  const top = Math.max(0, Math.min(m.height - s, Math.round(m.height * fy - s / 2)));
  return sharp(A(f)).extract({ left, top, width: s, height: s });
};

// ---- 2. what's inside, 600 x 600
await jpg((await cropOf('art/tiles/listen.webp', 0.5, 0.5, 1)).resize(600, 600), 'inside-1-read-aloud.jpg');
await jpg(sharp(A('art/tiles/guide-school.webp')).resize(600, 600, { fit: 'cover' }), 'inside-2-guide-school.jpg');
{
  // four plates on cream, the way the trainer shows them
  const ids = ['alligator', 'spoonbill', 'bull-shark', 'panther'];
  const cell = 280;
  const tiles = await Promise.all(ids.map((id) => sharp(A(`art/wild/${id}.webp`)).trim({ background: '#ffffff', threshold: 12 }).resize(cell - 24, cell - 60, { fit: 'contain', background: '#fbf8f1' }).flatten({ background: '#fbf8f1' }).toBuffer()));
  const comp = tiles.map((input, i) => ({ input, left: 20 + (i % 2) * cell + 12, top: 20 + Math.floor(i / 2) * cell + 30 }));
  await jpg(sharp({ create: { width: 600, height: 600, channels: 3, background: '#fbf8f1' } }).composite(comp), 'inside-3-wild-florida.jpg');
}

// ---- 3. how the pass works, 440 x 440
await jpg(sharp(A('art/tiles/read-open.webp')).resize(440, 440, { fit: 'cover' }), 'pass-1-one-book.jpg');
await jpg((await cropOf('art/tiles/missions.webp', 0.5, 0.42, 1)).resize(440, 440), 'pass-2-one-pass.jpg');
await jpg((await cropOf('art/tiles/crew.webp', 0.5, 0.36, 0.72)).resize(440, 440), 'pass-3-five-readers.jpg');
await jpg((await cropOf('art/tiles/fishing-journal.webp', 0.62, 0.5, 1)).resize(440, 440), 'pass-4-summer.jpg');
