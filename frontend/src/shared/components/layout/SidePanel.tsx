import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useUiStore, type PanelId } from '@/app/store/uiStore';
import { Icon } from '@/shared/components/ui/Icon';
import { PartiesPanel } from '@/features/congress/components/PartiesPanel';
import { InstitutionsPanel } from '@/features/institutions/components/InstitutionsPanel';
import { RegionsPanel } from '@/features/map/components/RegionsPanel';
import { DossierPanel } from '@/features/characters/components/DossierPanel';
import { SettingsPanel } from '@/features/settings/components/SettingsPanel';

const PANELS: Record<PanelId, { title: string; kicker: string; render: () => ReactNode }> = {
  parties: { title: 'Mga Partido', kicker: 'Political parties', render: () => <PartiesPanel /> },
  institutions: { title: 'Pamahalaan', kicker: 'Institutions of the Republic', render: () => <InstitutionsPanel /> },
  regions: { title: 'Mga Rehiyon', kicker: 'The archipelago', render: () => <RegionsPanel /> },
  dossier: { title: 'Dossier', kicker: 'Your life on record', render: () => <DossierPanel /> },
  settings: { title: 'Settings', kicker: 'Game & save data', render: () => <SettingsPanel /> },
};

export function SidePanel() {
  const { openPanel, closePanel } = useUiStore();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closePanel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closePanel]);

  const panel = openPanel ? PANELS[openPanel] : null;

  return (
    <aside className={`sidepanel ${panel ? 'is-open' : ''}`} aria-hidden={!panel}>
      {panel && (
        <>
          <header className="sidepanel__header">
            <div>
              <p className="kicker">{panel.kicker}</p>
              <h2>{panel.title}</h2>
            </div>
            <button className="icon-btn" onClick={closePanel} aria-label="Close panel">
              <Icon name="close" />
            </button>
          </header>
          <div className="sidepanel__body">{panel.render()}</div>
        </>
      )}
    </aside>
  );
}
