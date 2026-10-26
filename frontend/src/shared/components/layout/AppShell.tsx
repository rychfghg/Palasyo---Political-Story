import { Outlet, useLocation } from 'react-router-dom';
import { ArchipelagoMap } from '@/features/map/components/ArchipelagoMap';
import { useUiStore } from '@/app/store/uiStore';
import { SideNav } from './SideNav';
import { SidePanel } from './SidePanel';

/** Persistent frame: the 3D map lives behind every screen, with the tools rail on the left. */
export function AppShell() {
  const { mapFocus, mapHighlight } = useUiStore();
  // Each screen fades in; tabs inside the office share one key so the desk does not flash.
  const screen = useLocation().pathname.split('/')[1] ?? '';
  return (
    <div className={`shell ${screen ? 'shell--dim' : ''}`}>
      <ArchipelagoMap focus={mapFocus} highlight={mapHighlight} />
      <SideNav />
      <SidePanel />
      <main className="shell__main">
        <div key={screen} className="route-fade">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
