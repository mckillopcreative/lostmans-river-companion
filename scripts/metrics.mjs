// Reads the analytics counts from Workers Analytics Engine (dataset lostmans_events).
//   node scripts/metrics.mjs [days=7] [--own]       counts per event and label
//   node scripts/metrics.mjs funnel [days=30]       the landing → purchase → summer funnel
// Auth: CLOUDFLARE_API_TOKEN (needs Account Analytics: Read), else the token wrangler stored
// when you ran `wrangler login`. Rows marked own (authors' devices, ?own=1) are excluded
// unless --own is passed.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ACCOUNT = '91cf99ba149df24d16edfbc523306bc8';
function token() {
  if (process.env.CLOUDFLARE_API_TOKEN) return process.env.CLOUDFLARE_API_TOKEN;
  const p = join(process.env.APPDATA || join(process.env.HOME || '', '.config'), 'xdg.config', '.wrangler', 'config', 'default.toml');
  const alt = join(process.env.HOME || process.env.USERPROFILE || '', '.wrangler', 'config', 'default.toml');
  for (const f of [p, alt]) if (existsSync(f)) {
    const m = /oauth_token\s*=\s*"([^"]+)"/.exec(readFileSync(f, 'utf8'));
    if (m) return m[1];
  }
  console.error('No Cloudflare token: set CLOUDFLARE_API_TOKEN or run `npx wrangler login`.');
  process.exit(1);
}
async function sql(q) {
  const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/analytics_engine/sql`, { method: 'POST', headers: { authorization: `Bearer ${token()}` }, body: q });
  const t = await r.text();
  if (!r.ok) throw new Error(`Analytics Engine ${r.status}: ${t.slice(0, 300)}`);
  return JSON.parse(t).data;
}

const args = process.argv.slice(2);
const own = args.includes('--own');
const funnel = args[0] === 'funnel';
const days = Number(args.find((a) => /^\d+$/.test(a)) || (funnel ? 30 : 7));
const where = `timestamp > NOW() - INTERVAL '${days}' DAY${own ? '' : " AND blob4 != 'own'"}`;

if (funnel) {
  const rows = await sql(`SELECT blob1 AS event, blob2 AS label, SUM(_sample_interval) AS n FROM lostmans_events WHERE ${where} GROUP BY event, label FORMAT JSON`);
  const get = (e, l) => rows.filter((r) => r.event === e && (l === undefined || r.label === l)).reduce((a, r) => a + Number(r.n), 0);
  const steps = [
    ['Heard chapter 1', get('audio_play', '1')],
    ['Listened to the end of ch 1', rows.filter((r) => r.event === 'audio_progress' && r.label === '1').length ? get('audio_progress', '1') : 0],
    ['Clicked Buy', get('buy_click')],
    ['Came back from checkout', get('checkout_return')],
    ['Mission 1 done', get('mission_complete', 'm01')],
    ['Snook badge (m06)', get('badge_earned', 'snook')],
    ['Tarpon badge (m19)', get('badge_earned', 'tarpon')],
    ['Mission 23 done', get('mission_complete', 'm23')],
    ['License printed', get('license_print')],
  ];
  console.log(`Funnel, last ${days} days${own ? ' (including own traffic)' : ''}`);
  for (const [k, n] of steps) console.log(`  ${String(n).padStart(6)}  ${k}`);
} else {
  const rows = await sql(`SELECT blob1 AS event, blob2 AS label, blob3 AS campaign, SUM(_sample_interval) AS n, SUM(_sample_interval * double2) AS total FROM lostmans_events WHERE ${where} GROUP BY event, label, campaign ORDER BY event, n DESC FORMAT JSON`);
  console.log(`Events, last ${days} days${own ? ' (including own traffic)' : ''}`);
  if (!rows.length) console.log('  (none yet)');
  for (const r of rows) console.log(`  ${String(r.n).padStart(6)}  ${r.event}${r.label ? ' · ' + r.label : ''}${r.campaign ? ' · from ' + r.campaign : ''}${Number(r.total) ? ' · Σvalue ' + r.total : ''}`);
}
