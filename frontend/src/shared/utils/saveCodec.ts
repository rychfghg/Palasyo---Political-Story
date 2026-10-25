/**
 * Save compression. Game saves are large, repetitive JSON; browsers allow only about 5 MB per site.
 * Saves are stored LZW-compressed into a compact string (typically 4–6× smaller). Older plain-JSON
 * saves still load.
 */

const PREFIX = 'LZ1:';
// Codes are stored as characters starting at 0x20 and stopping before the surrogate range,
// so the result is always a valid string for localStorage.
const OFFSET = 0x20;
const MAX_CODE = 0xd7ff - OFFSET;

export function compress(text: string): string {
  const bytes = new TextEncoder().encode(text);
  const dict = new Map<string, number>();
  for (let i = 0; i < 256; i++) dict.set(String.fromCharCode(i), i);
  let next = 256;
  let w = '';
  const out: number[] = [];
  for (let i = 0; i < bytes.length; i++) {
    const c = String.fromCharCode(bytes[i]);
    const wc = w + c;
    if (dict.has(wc)) {
      w = wc;
    } else {
      out.push(dict.get(w)!);
      if (next < MAX_CODE) dict.set(wc, next++);
      w = c;
    }
  }
  if (w) out.push(dict.get(w)!);
  let s = PREFIX;
  for (let i = 0; i < out.length; i += 4096) s += String.fromCharCode(...out.slice(i, i + 4096).map((c) => c + OFFSET));
  return s;
}

export function decompress(data: string): string {
  if (!data.startsWith(PREFIX)) return data; // an old, uncompressed save
  const codes: number[] = [];
  for (let i = PREFIX.length; i < data.length; i++) codes.push(data.charCodeAt(i) - OFFSET);
  if (!codes.length) return '';
  const dict: number[][] = [];
  for (let i = 0; i < 256; i++) dict.push([i]);
  let w = dict[codes[0]];
  const out: number[] = [...w];
  for (let i = 1; i < codes.length; i++) {
    const k = codes[i];
    const entry = k < dict.length ? dict[k] : k === dict.length ? [...w, w[0]] : null;
    if (!entry) throw new Error('Corrupt save data');
    for (const b of entry) out.push(b);
    if (dict.length < MAX_CODE) dict.push([...w, entry[0]]);
    w = entry;
  }
  return new TextDecoder().decode(new Uint8Array(out));
}

/** Reads a save (compressed or not) as plain JSON text. */
export function readSave(key: string): string | null {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? null : decompress(raw);
  } catch {
    return null;
  }
}

/** Shrinks the heaviest history if the browser refuses to store a save. */
function trimSave(json: string, hard: boolean): string {
  try {
    const data = JSON.parse(json);
    const st = data.state ?? {};
    const keep = (k: string, n: number) => { if (Array.isArray(st[k])) st[k] = st[k].slice(0, n); };
    keep('ledger', hard ? 30 : 80);
    keep('news', hard ? 15 : 30);
    keep('inbox', hard ? 10 : 20);
    if (Array.isArray(st.history)) st.history = st.history.slice(hard ? -24 : -48);
    if (hard) { st.monthLog = []; st.lastMonthLog = []; }
    return JSON.stringify(data);
  } catch {
    return json;
  }
}

/** Storage for the game store: compressed, with trimming and a warning if saving still fails. */
export const compressedStorage = {
  getItem: (key: string) => readSave(key),
  setItem: (key: string, value: string) => {
    for (const attempt of [0, 1, 2]) {
      try {
        const json = attempt === 0 ? value : trimSave(value, attempt === 2);
        localStorage.setItem(key, compress(json));
        return;
      } catch {
        /* try a smaller save */
      }
    }
    window.dispatchEvent(new CustomEvent('palasyo-save-failed'));
  },
  removeItem: (key: string) => {
    try { localStorage.removeItem(key); } catch { /* storage unavailable */ }
  },
};

// Saving is batched: the game writes about half a second after the last change, and immediately
// when the page is hidden or closed, so compression never slows down play.
const pending = new Map<string, string>();
let timer: ReturnType<typeof setTimeout> | null = null;

function flush() {
  if (timer) clearTimeout(timer);
  timer = null;
  for (const [k, v] of pending) compressedStorage.setItem(k, v);
  pending.clear();
}

if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', flush);
  window.addEventListener('beforeunload', flush);
  document.addEventListener('visibilitychange', () => document.visibilityState === 'hidden' && flush());
}

/** The store's storage: batched and compressed. */
export const batchedStorage = {
  getItem: (key: string) => pending.get(key) ?? compressedStorage.getItem(key),
  setItem: (key: string, value: string) => {
    pending.set(key, value);
    if (timer) clearTimeout(timer);
    timer = setTimeout(flush, 500);
  },
  removeItem: (key: string) => {
    pending.delete(key);
    compressedStorage.removeItem(key);
  },
};

/** Write any pending save right now (before copying it to a slot, for example). */
export const flushSaves = flush;

/** Drop any unsaved change (used when loading a different save, so it is not overwritten). */
export function discardPendingSaves() {
  if (timer) clearTimeout(timer);
  timer = null;
  pending.clear();
}
