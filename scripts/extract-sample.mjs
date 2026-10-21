// Writes the free reading sample (chapter 1 only) from the gitignored manuscript into
// data/sample-ch01.json, which the chapter page renders. KDP Select allows up to 10% of the
// book as a free sample while the ebook is enrolled; chapter 1 is about 6%. Do not extend this
// to other chapters before the Select term ends (2026-11-25; see docs/LAUNCH-FLOW.md §7).
//   node scripts/extract-sample.mjs
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { chapters } from './narrate.mjs';

const root = resolve(import.meta.dirname, '..');
const all = chapters();
const totalChars = all.reduce((a, c) => a + c.body.length, 0);
const ch = all.find((c) => c.n === 1);
const paragraphs = ch.body
  .split(/\n\s*\n/)
  .map((p) => p.replace(/\s+/g, ' ').trim())
  .filter((p) => /[\p{L}\p{N}]/u.test(p));
const share = ch.body.length / totalChars;
if (share > 0.1) throw new Error(`sample is ${(share * 100).toFixed(1)}% of the book; KDP Select allows 10%`);

const out = {
  n: ch.n,
  title: ch.title,
  welcome: 'Welcome to the Lostman’s River Summer Fishing Guide Experience. Let’s begin the book, Escape to Lostman’s River.',
  share: Number(share.toFixed(3)),
  paragraphs,
};
writeFileSync(resolve(root, 'data/sample-ch01.json'), JSON.stringify(out, null, 2) + '\n');
console.log(`✓ data/sample-ch01.json: chapter ${ch.n}, ${paragraphs.length} paragraphs, ${(share * 100).toFixed(1)}% of the book`);
