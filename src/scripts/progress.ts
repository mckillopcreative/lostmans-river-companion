// Reader progress, kept on the device only (no accounts, no child data leaves the phone).
// Shape: { missions: { [id]: true }, badges: string[], name: string, started: ISO date }
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
  save(p);
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
