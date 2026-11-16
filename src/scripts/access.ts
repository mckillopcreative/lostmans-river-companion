// The purchase key on this device (docs/LAUNCH-FLOW.md). Set by /start/#<key> or the welcome
// page; stored in localStorage; used to unlock chapters 2–23, missions 2–23, and to sync
// progress through the Worker so the summer resumes on any device.
export const API = 'https://api.lostmansriver.com';
const KEY = 'lr-key';
const KEY_RE = /^[A-HJ-NP-Za-km-z2-9]{24}$/;

export function getKey(): string | null {
  try {
    const k = localStorage.getItem(KEY);
    return k && KEY_RE.test(k) ? k : null;
  } catch {
    return null;
  }
}
export function setKey(k: string) {
  try {
    localStorage.setItem(KEY, k);
  } catch {}
  document.documentElement.classList.add('has-key');
}
export function clearKey() {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem(WILD);
  } catch {}
  document.documentElement.classList.remove('has-key', 'has-wild');
}

// The Wild Florida add-on (2026-11-16): whether this device's key holds it. The Worker decides
// (GET /key/<key> → wild); the answer is remembered here so the page paints unlocked at once
// (the layout adds html.has-wild before first paint).
const WILD = 'lr-wild-ok';
export function setWild(on: boolean) {
  try {
    if (on) localStorage.setItem(WILD, '1');
    else localStorage.removeItem(WILD);
  } catch {}
  document.documentElement.classList.toggle('has-wild', on);
}
export function hasWild(): boolean {
  try {
    return !!getKey() && localStorage.getItem(WILD) === '1';
  } catch {
    return false;
  }
}
/** Ask the Worker, remember the answer. Offline or an error: keep what this device already knew. */
export async function syncWild(): Promise<boolean> {
  const k = getKey();
  if (!k) return false;
  try {
    const r = await fetch(`${API}/key/${k}`);
    if (r.ok) {
      const on = !!(await r.json()).wild;
      setWild(on);
      return on;
    }
  } catch {}
  return hasWild();
}
export const isKey = (k: string) => KEY_RE.test(k);

export async function checkKey(k: string): Promise<boolean> {
  try {
    const r = await fetch(`${API}/key/${k}`);
    return r.ok;
  } catch {
    // offline: trust a well-formed key; it is checked again next time
    return isKey(k);
  }
}

export function audioUrl(n: number): string | null {
  const k = getKey();
  return k ? `${API}/audio/${k}/ch-${String(n).padStart(2, '0')}.mp3` : null;
}

export function textUrl(n: number): string | null {
  const k = getKey();
  return k ? `${API}/text/${k}/ch-${String(n).padStart(2, '0')}.json` : null;
}

export function startLink(k: string) {
  return `${location.origin}/start/#${k}`;
}
