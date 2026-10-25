import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore, fullName } from '@/features/game-engine/store/gameStore';
import { useUiStore } from '@/app/store/uiStore';
import { SaveSlots } from './SaveSlots';
import { flushSaves, readSave } from '@/shared/utils/saveCodec';
import { getPref, setPref, type Pref } from '@/shared/utils/prefs';

export function SettingsPanel() {
  const navigate = useNavigate();
  const { player, lastSavedAt, resetGame } = useGameStore();
  const closePanel = useUiStore((s) => s.closePanel);
  const [confirming, setConfirming] = useState(false);
  const [prefs, setPrefs] = useState({ 'large-text': getPref('large-text'), colorblind: getPref('colorblind') });
  const toggle = (p: Pref) => {
    setPref(p, !prefs[p]);
    setPrefs({ ...prefs, [p]: !prefs[p] });
  };

  const exportSave = () => {
    flushSaves();
    const raw = readSave('palasyo-autosave') ?? '{}';
    const url = URL.createObjectURL(new Blob([raw], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `palasyo-save-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="stack">
      <section className="card">
        <h4>Offline save</h4>
        <p className="muted">
          Your progress is saved automatically in this browser. Online accounts and cloud sync will come later.
        </p>
        <dl className="facts">
          <div><dt>Slot</dt><dd>{player ? fullName(player) : 'Empty'}</dd></div>
          <div><dt>Last saved</dt><dd>{lastSavedAt ? new Date(lastSavedAt).toLocaleString() : '—'}</dd></div>
        </dl>
        <div className="row">
          <button className="btn btn--ghost" onClick={exportSave} disabled={!player}>Export save (.json)</button>
        </div>
      </section>

      <section className="card">
        <h4>Display &amp; accessibility</h4>
        <label className="pref-toggle"><input type="checkbox" checked={prefs['large-text']} onChange={() => toggle('large-text')} /> Larger text</label>
        <label className="pref-toggle"><input type="checkbox" checked={prefs.colorblind} onChange={() => toggle('colorblind')} /> Colorblind-safe colors (blue for good, orange for bad)</label>
        <p className="muted">Tip: press 1–4 to pick a choice on the Agenda.</p>
      </section>
      <section className="card">
        <h4>Save slots</h4>
        <p className="muted">Keep up to three games in this browser. Loading a slot replaces the game in progress.</p>
        <SaveSlots />
      </section>

      <section className="card">
        <h4>Start over</h4>
        <p className="muted">Deletes your current save from this browser. This cannot be undone.</p>
        {confirming ? (
          <div className="row">
            <button
              className="btn btn--danger"
              onClick={() => {
                resetGame();
                setConfirming(false);
                closePanel();
                navigate('/');
              }}
            >
              Yes, delete save
            </button>
            <button className="btn btn--ghost" onClick={() => setConfirming(false)}>Cancel</button>
          </div>
        ) : (
          <button className="btn btn--ghost" onClick={() => setConfirming(true)} disabled={!player}>Delete save</button>
        )}
      </section>
    </div>
  );
}
