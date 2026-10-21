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
  } catch {}
  document.documentElement.classList.remove('has-key');
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

export function startLink(k: string) {
  return `${location.origin}/start/#${k}`;
}
