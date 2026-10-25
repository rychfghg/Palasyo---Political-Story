import { create } from 'zustand';
import type { IslandGroup } from '@/data/world/regions';

export type PanelId = 'parties' | 'institutions' | 'regions' | 'dossier' | 'settings';
export type MapFocus = IslandGroup | 'all';

interface UiState {
  openPanel: PanelId | null;
  mapFocus: MapFocus;
  mapHighlight: IslandGroup | null;
  togglePanel: (id: PanelId) => void;
  closePanel: () => void;
  setMap: (focus: MapFocus, highlight?: IslandGroup | null) => void;
  /** The last month whose "in review" pop-up was closed. */
  reviewSeen: number;
  setReviewSeen: (month: number) => void;
  /** The vacancies the player chose to decide later (as a key), so the pop-up does not nag. */
  cabinetPutOff: string;
  cabinetWizardForced: boolean;
  /** True while the cabinet pop-up is on screen (other pop-ups wait). */
  cabinetWizardOpen: boolean;
  setCabinetWizardOpen: (open: boolean) => void;
  putOffCabinet: (key: string) => void;
  openCabinetWizard: () => void;
  /** The last decision whose adviser reactions were closed. */
  reactionSeen: string;
  setReactionSeen: (key: string) => void;
}

/** Remembers "Decide later" for the current vacancies across reloads. */
function readPutOff(): string {
  try { return localStorage.getItem('palasyo-cabinet-later') ?? ''; } catch { return ''; }
}

export const useUiStore = create<UiState>((set) => ({
  openPanel: null,
  mapFocus: 'all',
  mapHighlight: null,
  togglePanel: (id) => set((s) => ({ openPanel: s.openPanel === id ? null : id })),
  closePanel: () => set({ openPanel: null }),
  setMap: (mapFocus, mapHighlight = null) => set({ mapFocus, mapHighlight }),
  reviewSeen: -99,
  setReviewSeen: (reviewSeen) => set({ reviewSeen }),
  cabinetPutOff: readPutOff(),
  cabinetWizardForced: false,
  cabinetWizardOpen: false,
  setCabinetWizardOpen: (cabinetWizardOpen) => set({ cabinetWizardOpen }),
  putOffCabinet: (cabinetPutOff) => {
    try { localStorage.setItem('palasyo-cabinet-later', cabinetPutOff); } catch { /* storage unavailable */ }
    set({ cabinetPutOff, cabinetWizardForced: false });
  },
  openCabinetWizard: () => set({ cabinetWizardForced: true }),
  reactionSeen: '',
  setReactionSeen: (reactionSeen) => set({ reactionSeen }),
}));
