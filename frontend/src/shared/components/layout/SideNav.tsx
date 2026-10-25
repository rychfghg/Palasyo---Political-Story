import { useNavigate } from 'react-router-dom';
import { useUiStore, type PanelId } from '@/app/store/uiStore';
import { Icon, type IconName } from '@/shared/components/ui/Icon';
import { useGameStore } from '@/features/game-engine/store/gameStore';
import { Phone } from '@/features/extras/components/Phone';
import { AmbientSound } from '@/features/extras/components/LiveWorld';

const ITEMS: { id: PanelId; label: string; icon: IconName }[] = [
  { id: 'parties', label: 'Parties', icon: 'parties' },
  { id: 'institutions', label: 'Government', icon: 'institutions' },
  { id: 'regions', label: 'Regions', icon: 'regions' },
  { id: 'dossier', label: 'Dossier', icon: 'dossier' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

export function SideNav() {
  const navigate = useNavigate();
  const { openPanel, togglePanel, closePanel } = useUiStore();
  const inOffice = useGameStore((s) => s.phase === 'presidency' && !!s.government);

  return (
    <nav className="sidenav" aria-label="Tools">
      <button
        className="sidenav__btn sidenav__btn--home"
        onClick={() => {
          closePanel();
          navigate('/');
        }}
        title="Main menu"
      >
        <Icon name="home" />
        <span>Menu</span>
      </button>
      <div className="sidenav__divider" />
      {ITEMS.map((item) => (
        <button
          key={item.id}
          className={`sidenav__btn ${openPanel === item.id ? 'is-active' : ''}`}
          onClick={() => togglePanel(item.id)}
          aria-pressed={openPanel === item.id}
          title={item.label}
        >
          <Icon name={item.icon} />
          <span>{item.label}</span>
        </button>
      ))}
      {inOffice && (
        <>
          <div className="sidenav__divider" />
          <AmbientSound />
          <Phone />
        </>
      )}
    </nav>
  );
}
