import { Outlet } from 'react-router-dom';
import { ArchipelagoMap } from '@/features/map/components/ArchipelagoMap';
import { useUiStore } from '@/app/store/uiStore';
import { SideNav } from './SideNav';
import { SidePanel } from './SidePanel';

/** Persistent frame: the 3D map lives behind every screen, with the tools rail on the left. */
export function AppShell() {
  const { mapFocus, mapHighlight } = useUiStore();
  return (
    <div className="shell">
      <ArchipelagoMap focus={mapFocus} highlight={mapHighlight} />
      <SideNav />
      <SidePanel />
      <main className="shell__main">
        <Outlet />
      </main>
    </div>
  );
}
