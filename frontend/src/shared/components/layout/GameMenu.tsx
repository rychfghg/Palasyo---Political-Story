import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUiStore, type PanelId } from '@/app/store/uiStore';
import { Modal } from '@/shared/components/ui/Modal';
import { SaveSlots } from '@/features/settings/components/SaveSlots';
import { flushSaves } from '@/shared/utils/saveCodec';

const PANELS: [PanelId, string, string][] = [
  ['parties', 'Parties', '🎌'],
  ['institutions', 'Government', '🏛️'],
  ['regions', 'Regions', '🗺️'],
  ['dossier', 'Dossier', '📁'],
  ['settings', 'Settings', '⚙️'],
];

/**
 * The game runs full screen; this is the way out. A pause button opens a small menu
 * (resume, reference panels, save slots, main menu) and a home button returns to the title.
 */
export function GameMenu({ floating = false }: { floating?: boolean }) {
  const navigate = useNavigate();
  const { togglePanel, closePanel } = useUiStore();
  const [open, setOpen] = useState(false);
  const [saves, setSaves] = useState(false);

  const home = () => {
    flushSaves();
    closePanel();
    setOpen(false);
    navigate('/');
  };

  return (
    <div className={`game-menu ${floating ? 'game-menu--floating' : ''}`}>
      <button className="game-btn" onClick={() => setOpen(true)} title="Pause" aria-label="Pause the game">⏸</button>
      <button className="game-btn" onClick={home} title="Main menu" aria-label="Return to the main menu">⌂</button>
      {open && (
        <Modal title={saves ? 'Saved games' : 'Paused'} kicker="Palasyo" onClose={() => { setOpen(false); setSaves(false); }} className="pause-modal">
          {saves ? (
            <>
              <SaveSlots compact />
              <button className="btn btn--ghost btn--light btn--small" onClick={() => setSaves(false)}>← Back</button>
            </>
          ) : (
            <div className="pause-menu">
              <button className="btn btn--primary" onClick={() => setOpen(false)}>▶ Resume</button>
              <div className="pause-menu__grid">
                {PANELS.map(([id, label, icon]) => (
                  <button key={id} className="pause-menu__item" onClick={() => { setOpen(false); togglePanel(id); }}>
                    <span aria-hidden>{icon}</span>
                    {label}
                  </button>
                ))}
                <button className="pause-menu__item" onClick={() => setSaves(true)}>
                  <span aria-hidden>💾</span>
                  Save / load
                </button>
              </div>
              <button className="btn btn--ghost btn--light" onClick={home}>⌂ Save and return to the main menu</button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
