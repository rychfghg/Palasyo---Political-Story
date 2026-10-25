import { useState } from 'react';
import { decompress, discardPendingSaves, flushSaves } from '@/shared/utils/saveCodec';

const AUTOSAVE = 'palasyo-autosave';
const SLOTS = [1, 2, 3];
const key = (n: number) => `palasyo-slot-${n}`;

interface SlotInfo {
  name: string;
  date: string;
  where: string;
  savedAt: string;
  difficulty: string;
}

const PHASE: Record<string, string> = { prologue: 'Prologue', election: 'Election 2027', inauguration: 'Inauguration', presidency: 'In office' };
const DIFFICULTY: Record<string, string> = { easy: 'Honeymoon', normal: 'Normal', hard: 'Crisis Republic' };

function read(raw: string | null): SlotInfo | null {
  if (!raw) return null;
  try {
    const st = JSON.parse(decompress(raw)).state;
    if (!st?.player) return null;
    return {
      name: `${st.player.firstName} ${st.player.lastName}`,
      date: st.phase === 'presidency' ? st.gameDate : '',
      where: PHASE[st.phase] ?? 'Not started',
      savedAt: st.lastSavedAt ? new Date(st.lastSavedAt).toLocaleString() : '',
      difficulty: DIFFICULTY[String(st.flags?.difficulty ?? 'normal')] ?? 'Normal',
    };
  } catch {
    return null;
  }
}

function get(k: string) {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
}

/**
 * Three save slots in this browser, on top of the autosave. Saving copies the current game into a
 * slot; loading copies a slot back into the autosave and reloads the game from it.
 */
export function SaveSlots({ compact = false }: { compact?: boolean }) {
  const [, refresh] = useState(0);
  const [msg, setMsg] = useState('');
  const current = read(get(AUTOSAVE));

  const save = (n: number) => {
    flushSaves();
    const raw = get(AUTOSAVE);
    if (!raw || !current) return;
    try {
      localStorage.setItem(key(n), raw);
      setMsg(`Saved to slot ${n}.`);
    } catch {
      setMsg('Could not save — browser storage is full or blocked.');
    }
    refresh((x) => x + 1);
  };
  const load = (n: number) => {
    const raw = get(key(n));
    if (!raw) return;
    discardPendingSaves();
    try {
      localStorage.setItem(AUTOSAVE, raw);
      localStorage.removeItem('palasyo-cabinet-later');
    } catch {
      setMsg('Could not load — browser storage is blocked.');
      return;
    }
    window.location.assign('/');
  };
  const remove = (n: number) => {
    try {
      localStorage.removeItem(key(n));
    } catch {
      /* storage unavailable */
    }
    refresh((x) => x + 1);
  };

  return (
    <div className={`save-slots ${compact ? 'is-compact' : ''}`}>
      {SLOTS.map((n) => {
        const info = read(get(key(n)));
        return (
          <div key={n} className={`save-slot ${info ? '' : 'is-empty'}`}>
            <span className="save-slot__n">{n}</span>
            <div className="save-slot__info">
              {info ? (
                <>
                  <b>{info.name}</b>
                  <small>{info.where}{info.date ? ` · ${info.date}` : ''} · {info.difficulty}</small>
                  <small className="muted">Saved {info.savedAt}</small>
                </>
              ) : (
                <small className="muted">Empty slot</small>
              )}
            </div>
            <div className="save-slot__actions">
              <button className="btn btn--ghost btn--small btn--light" disabled={!current} onClick={() => save(n)} title={current ? `Save ${current.name}’s game here` : 'No game in progress'}>Save</button>
              <button className="btn btn--primary btn--small" disabled={!info} onClick={() => load(n)}>Load</button>
              {info && <button className="btn btn--ghost btn--small btn--light" onClick={() => remove(n)} aria-label={`Delete slot ${n}`}>✕</button>}
            </div>
          </div>
        );
      })}
      {msg && <p className="muted">{msg}</p>}
    </div>
  );
}
