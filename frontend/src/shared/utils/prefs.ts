/** Display preferences kept in this browser: larger text and a colorblind-safe palette. */
export type Pref = 'large-text' | 'colorblind';

export function getPref(p: Pref): boolean {
  try {
    return localStorage.getItem(`palasyo-${p}`) === 'on';
  } catch {
    return false;
  }
}

export function setPref(p: Pref, on: boolean) {
  try {
    localStorage.setItem(`palasyo-${p}`, on ? 'on' : 'off');
  } catch {
    /* storage unavailable */
  }
  document.documentElement.classList.toggle(p, on);
}

export function applyPrefs() {
  for (const p of ['large-text', 'colorblind'] as Pref[]) document.documentElement.classList.toggle(p, getPref(p));
}
