import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/shared/components/layout/AppShell';
import { MainMenu } from '@/features/main-menu/components/MainMenu';
import { NameEntry } from '@/features/narrative/components/NameEntry';
import { PrologueScreen } from '@/features/narrative/components/PrologueScreen';
import { ElectionScreen } from '@/features/narrative/components/ElectionScreen';
import { InaugurationScreen } from '@/features/narrative/components/InaugurationScreen';
import { OfficePage } from '@/pages/game/OfficePage';
import { BriefingView } from '@/features/economy/components/BriefingView';
import { NationView } from '@/features/economy/components/NationView';
import { AgendaView } from '@/features/narrative/components/AgendaView';
import { LawsView } from '@/features/legislation/components/LawsView';
import { CabinetView } from '@/features/cabinet/components/CabinetView';
import { BudgetView } from '@/features/budget/components/BudgetView';
import { HouseView } from '@/features/congress/components/HouseView';
import { SenateView } from '@/features/congress/components/SenateView';
import { CourtView } from '@/features/supreme-court/components/CourtView';
import { CentralBankView } from '@/features/institutions/components/CentralBankView';
import { GoccView } from '@/features/institutions/components/GoccView';
import { WorldView } from '@/features/extras/components/WorldView';
import { RecordView } from '@/features/extras/components/RecordView';
import { LegacyGame } from '@/features/extras/components/LegacyGame';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<MainMenu />} />
          <Route path="new" element={<NameEntry />} />
          <Route path="prologue" element={<PrologueScreen />} />
          <Route path="election" element={<ElectionScreen />} />
          <Route path="inauguration" element={<InaugurationScreen />} />
          <Route path="office" element={<OfficePage />}>
            <Route index element={<AgendaView />} />
            <Route path="briefing" element={<BriefingView />} />
            <Route path="nation" element={<NationView />} />
            <Route path="laws" element={<LawsView />} />
            <Route path="cabinet" element={<CabinetView />} />
            <Route path="budget" element={<BudgetView />} />
            <Route path="house" element={<HouseView />} />
            <Route path="senate" element={<SenateView />} />
            <Route path="court" element={<CourtView />} />
            <Route path="bank" element={<CentralBankView />} />
            <Route path="goccs" element={<GoccView />} />
            <Route path="world" element={<WorldView />} />
            <Route path="record" element={<RecordView />} />
          </Route>
          <Route path="legacy" element={<LegacyGame />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
