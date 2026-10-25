import { useEffect, useState } from 'react';

/** Tells the player if the browser refused to store the game, instead of failing silently. */
export function SaveWarning() {
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const on = () => setFailed(true);
    window.addEventListener('palasyo-save-failed', on);
    return () => window.removeEventListener('palasyo-save-failed', on);
  }, []);
  if (!failed) return null;
  return (
    <div className="save-warning" role="alert">
      <b>⚠ Your game could not be saved.</b>
      <span>This browser’s storage is full or blocked. Delete an old save slot in Settings, or export your save, then keep playing.</span>
      <button onClick={() => setFailed(false)} aria-label="Dismiss">✕</button>
    </div>
  );
}
