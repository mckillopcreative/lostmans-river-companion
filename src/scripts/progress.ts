// Reader progress. Kept on the device; when this device has a purchase key, also synced through
// the Worker so the summer picks up on any device. Only mission ids, badges and the start date
// are synced. The reader's name stays on this device only.
// Shape: { missions: { [id]: true }, badges: string[], name: string, started: ISO date }
import { API, getKey } from './access';

const KEY = 'lr-progress';

export interface Progress {
  missions: Record<string, true>;
  badges: string[];
  name: string;
  started: string;
}

export function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { missions: {}, badges: [], name: '', started: '', ...JSON.parse(raw) };
  } catch {}
  return { missions: {}, badges: [], name: '', started: '' };
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
    const body = JSON.stringify({ missions: p.missions, badges: p.badges, started: p.started });
    fetch(`${API}/progress/${k}`, { method: 'PUT', body, keepalive: true }).catch(() => {});
  }, 400);
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
      badges: [...new Set([...(remote.badges || []), ...local.badges])],
      name: local.name,
      started: [local.started, remote.started].filter(Boolean).sort()[0] || '',
    };
    localStorage.setItem(KEY, JSON.stringify(merged));
    // send back anything only this device had
    if (Object.keys(merged.missions).length > Object.keys(remote.missions || {}).length || merged.badges.length > (remote.badges || []).length) push(merged);
    return merged;
  } catch {
    return local;
  }
}

export function completeMission(id: string, badge?: string | null) {
  const p = load();
  if (!p.started) p.started = new Date().toISOString().slice(0, 10);
  p.missions[id] = true;
  if (badge && !p.badges.includes(badge)) p.badges.push(badge);
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
