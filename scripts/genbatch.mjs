// Generate a batch of pictures through the Codex desktop app on John's ChatGPT plan.
//   node scripts/genbatch.mjs scripts/art-batches/<batch>.json [concurrency 1|2]
// batch.json: { "groups": { "<name>": { "shape": "square|landscape|portrait", "refs": ["assets/art/…"], "prompt": "… {{line}}" } },
//               "items": [ { "group": "<name>", "out": "private/art-pack/assets/art/<folder>/<id>.png", "line": "…" } ] }
// Items whose output file already exists are skipped: re-run to fill gaps, delete a file to redo it.
// Then import the PNGs as web masters:  node scripts/import-art.mjs private/art-pack/assets/art
//
// Why Codex and not an API: CLAUDE.md says no paid APIs, and John's ChatGPT plan already covers
// Codex's built-in image tool (same method as SocratesWine/scripts/genbatch.mjs, proven there
// 2026-11-02). The child process is given no OpenAI key, so it cannot fall back to API billing.
// About 90 seconds a picture. The PNG originals land in private/ (gitignored); only the WebP
// masters from import-art.mjs go in the repo.
import { readFileSync, existsSync, readdirSync, statSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { homedir } from 'node:os';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const [batchPath, concArg] = process.argv.slice(2);
if (!batchPath) {
  console.error('usage: node scripts/genbatch.mjs <batch.json> [concurrency]');
  process.exit(1);
}

// the newest codex.exe the desktop app installed (the folder name is a build hash)
function findCodex() {
  if (process.env.CODEX_EXE && existsSync(process.env.CODEX_EXE)) return process.env.CODEX_EXE;
  const base = join(homedir(), 'AppData/Local/OpenAI/Codex/bin');
  if (!existsSync(base)) return null;
  const hits = readdirSync(base)
    .map((d) => join(base, d, 'codex.exe'))
    .filter(existsSync)
    .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
  return hits[0] || null;
}
const CODEX = findCodex();
if (!CODEX) {
  console.error('Codex desktop app not found (AppData/Local/OpenAI/Codex/bin/*/codex.exe).');
  process.exit(1);
}

const batch = JSON.parse(readFileSync(join(root, batchPath), 'utf8'));
const conc = Math.max(1, Math.min(2, Number(concArg) || 1));
const items = batch.items.filter((it) => !existsSync(join(root, it.out)));
console.log(`${batch.items.length} items, ${batch.items.length - items.length} already exist, generating ${items.length} (x${conc}) via Codex on the ChatGPT plan`);

const SHAPE = { square: 'a SQUARE', landscape: 'a LANDSCAPE (wider than tall, 3:2)', portrait: 'a PORTRAIT (taller than wide, 2:3)' };

function viaCodex(it) {
  return new Promise((resolve) => {
    const g = batch.groups[it.group];
    const env = { ...process.env };
    delete env.OPENAI_API_KEY;
    delete env.IMAGE_API_KEY; // the plan, never the API
    const refs = (g.refs || []).flatMap((r) => ['-i', join(root, r)]);
    mkdirSync(dirname(join(root, it.out)), { recursive: true });
    const ask =
      `Use your BUILT-IN image_gen tool (never the CLI fallback, never an API key) to generate exactly ONE image, ` +
      `then copy it into this repo at ${it.out} (create folders if needed) and reply with only that path. ` +
      `${refs.length ? 'Use the attached image(s) ONLY as a style reference. ' : ''}Make it ${SHAPE[g.shape] || SHAPE.square} image. ` +
      `Do not create, modify or delete any other file. The image: ${g.prompt.replace('{{line}}', it.line)}`;
    // the prompt goes in on stdin: `-i` takes several values and would swallow a trailing prompt
    const child = spawn(CODEX, ['exec', '-C', root, '-s', 'workspace-write', '-c', 'model_reasoning_effort="low"', ...refs], { env, stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true });
    child.stdin.end(ask);
    let tail = '';
    const keep = (d) => {
      tail = (tail + d.toString()).slice(-600);
    };
    child.stdout.on('data', keep);
    child.stderr.on('data', keep);
    const timer = setTimeout(() => child.kill(), 8 * 60 * 1000);
    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({ ok: code === 0 && existsSync(join(root, it.out)), tail });
    });
  });
}

async function one(it) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    const r = await viaCodex(it);
    if (r.ok) {
      console.log(`ok    ${it.out}`);
      return true;
    }
    console.log(`retry ${it.out} (${attempt}/2): ${r.tail.replace(/\s+/g, ' ').slice(-200)}`);
  }
  console.log(`FAIL  ${it.out}`);
  return false;
}
let i = 0;
let okN = 0;
await Promise.all(
  Array.from({ length: conc }, async () => {
    while (i < items.length) {
      const it = items[i++];
      if (await one(it)) okN++;
    }
  }),
);
console.log(`done: ${okN}/${items.length} generated`);
if (okN < items.length) process.exit(1);
