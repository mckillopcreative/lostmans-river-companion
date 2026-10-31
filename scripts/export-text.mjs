// The full-book reader's text: one JSON file per chapter (2–23) from the gitignored manuscript,
// written to private/text/ (gitignored; never under public/). The Worker serves them from R2 to
// purchase-key holders only, and only from READER_OPENS (worker/src/index.js).
//
//   node scripts/export-text.mjs            writes private/text/ch-02.json … ch-23.json
//   node scripts/export-text.mjs --upload   also puts them in the R2 bucket (refuses before 2026-11-26:
//                                           the ebook's KDP Select exclusivity runs through 2026-11-25)
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { chapters } from './narrate.mjs';

const OPENS = '2026-11-26';
const BUCKET = 'lostmans-audio';
const root = resolve(import.meta.dirname, '..');
const dir = resolve(root, 'private/text');
mkdirSync(dir, { recursive: true });

const files = [];
for (const ch of chapters().filter((c) => c.n >= 2)) {
  const paragraphs = ch.body
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter((p) => /[\p{L}\p{N}]/u.test(p));
  const name = `ch-${String(ch.n).padStart(2, '0')}.json`;
  writeFileSync(resolve(dir, name), JSON.stringify({ n: ch.n, title: ch.title, paragraphs }) + '\n');
  files.push(name);
}
console.log(`✓ private/text: ${files.length} chapters`);

if (process.argv.includes('--upload')) {
  // the date in Florida, not UTC
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date());
  if (today < OPENS) {
    console.error(`Not uploading: it is ${today} in Florida and the text may not leave this computer before ${OPENS} (KDP Select).`);
    process.exit(1);
  }
  for (const f of files) {
    execFileSync('npx', ['wrangler@4', 'r2', 'object', 'put', `${BUCKET}/text/${f}`, '--file', resolve(dir, f), '--content-type', 'application/json', '--remote'], {
      cwd: resolve(root, 'worker'),
      stdio: 'inherit',
      shell: true,
    });
  }
  console.log(`✓ uploaded ${files.length} chapters to r2://${BUCKET}/text/`);
}
