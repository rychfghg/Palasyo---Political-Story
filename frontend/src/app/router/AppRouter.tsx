import { lazy, Suspense, type ComponentType } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/shared/components/layout/AppShell';
import { MainMenu } from '@/features/main-menu/components/MainMenu';
import { OfficePage } from '@/pages/game/OfficePage';
import { CabinetView } from '@/features/cabinet/components/CabinetView';
import { BudgetView } from '@/features/budget/components/BudgetView';
import { RecordView } from '@/features/extras/components/RecordView';
import { AgendaView } from '@/features/narrative/components/AgendaView';

// Screens other than the menu, the Agenda, and views the desk pop-ups already use load on first visit, keeping the first download small.
const load = <K extends string>(factory: () => Promise<Record<K, ComponentType>>, name: K) =>
  lazy(() => factory().then((m) => ({ default: m[name] })));

const NameEntry = load(() => import('@/features/narrative/components/NameEntry'), 'NameEntry');
const PrologueScreen = load(() => import('@/features/narrative/components/PrologueScreen'), 'PrologueScreen');
const ElectionScreen = load(() => import('@/features/narrative/components/ElectionScreen'), 'ElectionScreen');
const InaugurationScreen = load(() => import('@/features/narrative/components/InaugurationScreen'), 'InaugurationScreen');
const BriefingView = load(() => import('@/features/economy/components/BriefingView'), 'BriefingView');
const NationView = load(() => import('@/features/economy/components/NationView'), 'NationView');
const LawsView = load(() => import('@/features/legislation/components/LawsView'), 'LawsView');
const HouseView = load(() => import('@/features/congress/components/HouseView'), 'HouseView');
const SenateView = load(() => import('@/features/congress/components/SenateView'), 'SenateView');
const CourtView = load(() => import('@/features/supreme-court/components/CourtView'), 'CourtView');
const CentralBankView = load(() => import('@/features/institutions/components/CentralBankView'), 'CentralBankView');
const GoccView = load(() => import('@/features/institutions/components/GoccView'), 'GoccView');
const WorldView = load(() => import('@/features/extras/components/WorldView'), 'WorldView');
const LegacyGame = load(() => import('@/features/extras/components/LegacyGame'), 'LegacyGame');
const StatsView = load(() => import('@/features/extras/components/StatsView'), 'StatsView');

function Loading() {
  return (
    <div className="route-loading" role="status">
      <span className="route-loading__seal" aria-hidden />
      <span>Loading…</span>
    </div>
  );
}

const lazyEl = (C: ComponentType) => (
  <Suspense fallback={<Loading />}>
    <C />
  </Suspense>
);

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<MainMenu />} />
          <Route path="new" element={lazyEl(NameEntry)} />
          <Route path="prologue" element={lazyEl(PrologueScreen)} />
          <Route path="election" element={lazyEl(ElectionScreen)} />
          <Route path="inauguration" element={lazyEl(InaugurationScreen)} />
          <Route path="office" element={<OfficePage />}>
            <Route index element={<AgendaView />} />
            <Route path="briefing" element={lazyEl(BriefingView)} />
            <Route path="nation" element={lazyEl(NationView)} />
            <Route path="laws" element={lazyEl(LawsView)} />
            <Route path="cabinet" element={<CabinetView />} />
            <Route path="budget" element={<BudgetView />} />
            <Route path="house" element={lazyEl(HouseView)} />
            <Route path="senate" element={lazyEl(SenateView)} />
            <Route path="court" element={lazyEl(CourtView)} />
            <Route path="bank" element={lazyEl(CentralBankView)} />
            <Route path="goccs" element={lazyEl(GoccView)} />
            <Route path="world" element={lazyEl(WorldView)} />
            <Route path="record" element={<RecordView />} />
            <Route path="stats" element={lazyEl(StatsView)} />
          </Route>
          <Route path="legacy" element={lazyEl(LegacyGame)} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
