import { Outlet, useLocation } from 'react-router-dom';
import { ArchipelagoMap } from '@/features/map/components/ArchipelagoMap';
import { useUiStore } from '@/app/store/uiStore';
import { SidePanel } from './SidePanel';
import { GameMenu } from './GameMenu';

/**
 * Persistent frame: the 3D map lives behind every screen. The game runs full screen with no side
 * bar; pause and home buttons sit in the desk header (or float in the corner on other screens).
 */
export function AppShell() {
  const { mapFocus, mapHighlight } = useUiStore();
  // Each screen fades in; tabs inside the office share one key so the desk does not flash.
  const screen = useLocation().pathname.split('/')[1] ?? '';
  return (
    <div className={`shell ${screen ? 'shell--dim' : 'shell--home'}`}>
      <ArchipelagoMap focus={mapFocus} highlight={mapHighlight} />
      <SidePanel />
      {screen && screen !== 'office' && <GameMenu floating />}
      <main className="shell__main">
        <div key={screen} className="route-fade">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
