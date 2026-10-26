import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { COUNTRY, TIMELINE } from '@/shared/constants/world';
import { useGameStore, fullName, type GamePhase } from '@/features/game-engine/store/gameStore';
import { useUiStore } from '@/app/store/uiStore';
import { SaveSlots } from '@/features/settings/components/SaveSlots';
import { Modal } from '@/shared/components/ui/Modal';
import { SettingsPanel } from '@/features/settings/components/SettingsPanel';

const ROUTE_BY_PHASE: Record<GamePhase, string> = {
  none: '/new',
  prologue: '/prologue',
  election: '/election',
  inauguration: '/inauguration',
  presidency: '/office',
};

export function MainMenu() {
  const navigate = useNavigate();
  const { phase, player, resetGame } = useGameStore();
  const location = useLocation();
  const setMap = useUiStore((s) => s.setMap);
  const [confirmNew, setConfirmNew] = useState(false);
  const [dialog, setDialog] = useState<'load' | 'settings' | null>(null);
  const hasSave = phase !== 'none' && !!player;

  useEffect(() => setMap('all'), [setMap]);
  // Arriving from the end-of-game pop-up: the finished presidency is cleared.
  useEffect(() => {
    if ((location.state as { clearSave?: boolean } | null)?.clearSave) {
      resetGame();
      try { localStorage.removeItem('palasyo-cabinet-later'); } catch { /* storage unavailable */ }
      navigate('/', { replace: true, state: null });
    }
  }, [location.state, resetGame, navigate]);

  return (
    <section className="menu">
      <header className="menu__title">
        <p className="kicker kicker--gold">{COUNTRY.name}</p>
        <h1>Palasyo</h1>
        <p className="menu__subtitle">A Political Story</p>
        <p className="menu__tagline">
          Anim na taon. Isang bayan. Bawat desisyon ay may kapalit.
          <br />
          <span>Six years. One nation. Every decision has a price.</span>
        </p>
      </header>

      <div className="menu__actions">
        {hasSave && (
          <button className="btn btn--primary" onClick={() => navigate(ROUTE_BY_PHASE[phase])}>
            Continue
            <small>{fullName(player)}</small>
          </button>
        )}
        {confirmNew ? (
          <div className="menu__confirm">
            <p>Starting a new game will overwrite your current save.</p>
            <div className="row">
              <button className="btn btn--danger" onClick={() => navigate('/new')}>Overwrite</button>
              <button className="btn btn--ghost" onClick={() => setConfirmNew(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <button className={`btn ${hasSave ? 'btn--ghost' : 'btn--primary'}`} onClick={() => (hasSave ? setConfirmNew(true) : navigate('/new'))}>
            New Game
          </button>
        )}
        <div className="menu__minor">
          <button className="btn btn--ghost btn--light" onClick={() => setDialog('load')}>Load game</button>
          <button className="btn btn--ghost btn--light" onClick={() => setDialog('settings')}>Settings</button>
        </div>
      </div>
      {dialog === 'load' && (
        <Modal title="Mga Naka-save" kicker="Saved games" onClose={() => setDialog(null)}>
          <SaveSlots compact />
        </Modal>
      )}
      {dialog === 'settings' && (
        <Modal title="Settings" kicker="Game & display" onClose={() => setDialog(null)} className="settings-modal">
          <SettingsPanel />
        </Modal>
      )}

      <footer className="menu__footer">
        <span>Halalan · {TIMELINE.electionDate}</span>
        <span className="dot">◆</span>
        <span>A work of fiction inspired by Philippine politics</span>
      </footer>
    </section>
  );
}
