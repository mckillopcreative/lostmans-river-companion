// Opening morning: sends the opening email to everyone on the waitlist, once each, through the
// Worker (POST /admin/send-opening, 25 addresses per call, repeated until none remain).
//   node scripts/send-opening.mjs --dry          how many are on the list and still unsent
//   node scripts/send-opening.mjs --to you@x.com  one copy to that address, to check it in a real inbox
//   node scripts/send-opening.mjs                send to the list
//   add  --template news   to any of the three for the holiday news email (worker/src/email.js newsEmail)
//        instead of the opening-day one. Each template goes to an address once; buyers are skipped for "news".
// Reads ADMIN_KEY from worker/.dev.vars (never committed, never printed).
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const vars = readFileSync(resolve(root, 'worker/.dev.vars'), 'utf8');
const ADMIN = /^ADMIN_KEY=(.*)$/m.exec(vars)?.[1].trim().replace(/^"|"$/g, '');
if (!ADMIN) throw new Error('ADMIN_KEY not found in worker/.dev.vars');
const API = 'https://api.lostmansriver.com';

const call = async (body) => {
  const r = await fetch(`${API}/admin/send-opening`, { method: 'POST', headers: { 'x-admin-key': ADMIN, 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`${r.status} ${JSON.stringify(j)}`);
  return j;
};

const args = process.argv.slice(2);
const tIdx = args.indexOf('--template');
const template = tIdx >= 0 ? args[tIdx + 1] : undefined;
const base = template ? { template } : {};
const toIdx = args.indexOf('--to');
if (toIdx >= 0) {
  console.log(JSON.stringify(await call({ ...base, to: args[toIdx + 1] })));
} else if (args.includes('--dry')) {
  console.log(JSON.stringify(await call({ ...base, dry: true })));
} else {
  const d = await call({ ...base, dry: true });
  console.log(`on the list: ${d.list}, unsent: ${d.unsent}`);
  let total = 0;
  for (;;) {
    const r = await call({ ...base, limit: 25 });
    total += r.sent;
    if (r.failed.length) console.log('failed:', JSON.stringify(r.failed));
    console.log(`sent ${r.sent}, remaining ${r.remaining}`);
    if (r.remaining <= 0 || r.sent === 0) break;
  }
  console.log(`✓ ${template || 'opening'} email sent to ${total}`);
}
