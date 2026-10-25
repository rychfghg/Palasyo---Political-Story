import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@/shared/components/ui/Modal';

/** When the presidency is over: start again, or leave. The player can also close it to read the record. */
export function EndGameModal({ title, text }: { title: string; text: string }) {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  // Starting a new game replaces the old save; the main menu clears it on exit.
  const restart = () => {
    try { localStorage.removeItem('palasyo-cabinet-later'); } catch { /* storage unavailable */ }
    navigate('/new');
  };
  const exit = () => navigate('/', { state: { clearSave: true } });

  if (!open) {
    return (
      <div className="row row--end endgame-bar">
        <button className="btn btn--ghost btn--light" onClick={() => navigate('/legacy')}>Chapter 3: The Next Generation</button>
        <button className="btn btn--ghost btn--light" onClick={exit}>Exit to main menu</button>
        <button className="btn btn--primary" onClick={restart}>Play again</button>
      </div>
    );
  }

  return (
    <Modal title={title} kicker="Tapos na ang Laro · The game is over" onClose={() => setOpen(false)} className="endgame-modal">
      <p>{text}</p>
      <p className="muted">Starting again or exiting deletes this save. Close this window to read your full record first.</p>
      <div className="wizard-foot">
        <button className="btn btn--ghost btn--small btn--light" onClick={() => setOpen(false)}>Read my record</button>
        <div className="row">
          <button className="btn btn--ghost btn--small btn--light" onClick={() => navigate('/legacy')}>Play Chapter 3: The Next Generation</button>
          <button className="btn btn--ghost btn--small btn--light" onClick={exit}>Exit to main menu</button>
          <button className="btn btn--primary btn--small" onClick={restart}>Play again</button>
        </div>
      </div>
    </Modal>
  );
}
