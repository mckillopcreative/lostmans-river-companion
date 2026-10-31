// Reader progress. Kept on the device; when this device has a purchase key, also synced through
// the Worker so the summer picks up on any device. Only mission ids, field sign-off dates, badges
// and the start date are synced. The reader's name stays on this device only.
// Shape: { missions: { [id]: true }, field: { [id]: ISO date }, badges: string[], name: string, started: ISO date }
import { API, getKey } from './access';

const KEY = 'lr-progress';

export interface Progress {
  missions: Record<string, true>;
  /** Field missions a grown-up signed off, with the date. */
  field: Record<string, string>;
  badges: string[];
  name: string;
  started: string;
}

const empty = (): Progress => ({ missions: {}, field: {}, badges: [], name: '', started: '' });
const today = () => new Date().toISOString().slice(0, 10);

export function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...empty(), ...JSON.parse(raw) };
  } catch {}
  return empty();
}

export function save(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {}
  push(p);
}

// ---------- sync ----------
let timer: ReturnType<typeof setTimeout> | null = null;
function push(p: Progress) {
  const k = getKey();
  if (!k) return;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    const body = JSON.stringify({ missions: p.missions, field: p.field, badges: p.badges, started: p.started });
    fetch(`${API}/progress/${k}`, { method: 'PUT', body, keepalive: true }).catch(() => {});
  }, 400);
}

/** Field sign-offs from two devices: keep every one, and the earlier date when both have it. */
function mergeField(a: Record<string, string> = {}, b: Record<string, string> = {}) {
  const out = { ...a };
  for (const [id, d] of Object.entries(b)) if (!out[id] || d < out[id]) out[id] = d;
  return out;
}

/** Merge the server's copy into this device (never loses a mission on either side). */
export async function pull(): Promise<Progress> {
  const k = getKey();
  const local = load();
  if (!k) return local;
  try {
    const r = await fetch(`${API}/progress/${k}`);
    if (!r.ok) return local;
    const remote = (await r.json()) as Partial<Progress>;
    const merged: Progress = {
      missions: { ...(remote.missions || {}), ...local.missions },
      field: mergeField(remote.field, local.field),
      badges: [...new Set([...(remote.badges || []), ...local.badges])],
      name: local.name,
      started: [local.started, remote.started].filter(Boolean).sort()[0] || '',
    };
    localStorage.setItem(KEY, JSON.stringify(merged));
    // send back anything only this device had
    const n = (o?: object) => Object.keys(o || {}).length;
    if (n(merged.missions) > n(remote.missions) || n(merged.field) > n(remote.field) || merged.badges.length > (remote.badges || []).length) push(merged);
    return merged;
  } catch {
    return local;
  }
}

export function completeMission(id: string, badge?: string | null) {
  const p = load();
  if (!p.started) p.started = today();
  p.missions[id] = true;
  if (badge && !p.badges.includes(badge)) p.badges.push(badge);
  save(p);
  return p;
}

/** A grown-up saw the field mission done. */
export function signField(id: string) {
  const p = load();
  if (!p.started) p.started = today();
  if (!p.field[id]) p.field[id] = today();
  save(p);
  return p;
}

export function setName(name: string) {
  const p = load();
  p.name = name.trim().slice(0, 40);
  try {
    localStorage.setItem(KEY, JSON.stringify(p)); // the name is never synced
  } catch {}
  return p;
}

export function reset() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}

export function countDone(p: Progress) {
  return Object.keys(p.missions).length;
}

export function countField(p: Progress) {
  return Object.keys(p.field || {}).length;
}
