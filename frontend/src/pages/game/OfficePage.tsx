import { useEffect } from 'react';
import { Navigate, NavLink, Outlet } from 'react-router-dom';
import { useGameStore } from '@/features/game-engine/store/gameStore';
import { useUiStore } from '@/app/store/uiStore';
import { TreasuryHud } from '@/features/economy/components/TreasuryHud';
import { Warnings } from '@/features/economy/components/Warnings';
import { CabinetWizard } from '@/features/cabinet/components/CabinetWizard';
import { BudgetModal } from '@/features/budget/components/BudgetModal';
import { COUNTRY } from '@/shared/constants/world';
import { OfficesMenu } from './OfficesMenu';
import { CrisisTint } from '@/features/extras/components/LiveWorld';
import { PressConference, Sona } from '@/features/extras/components/PressAndSona';

/** The main tabs are the branches of government; the executive offices sit behind one button. */
const TABS = [
  { to: '/office', label: 'Agenda', end: true },
  { to: '/office/house', label: 'Congress' },
  { to: '/office/senate', label: 'Senate' },
  { to: '/office/court', label: 'Supreme Court' },
  { to: '/office/bank', label: 'Bangko Sentral' },
];

/** The President’s desk: indicators on top, the machinery of government in tabs below. */
export function OfficePage() {
  const { player, phase, government, initPresidency, ensureInstitutions } = useGameStore();
  const setMap = useUiStore((s) => s.setMap);

  useEffect(() => setMap('all'), [setMap]);
  useEffect(() => {
    if (phase === 'presidency' && !government) initPresidency();
  }, [phase, government, initPresidency]);

  useEffect(() => {
    if (government) ensureInstitutions();
  }, [government, ensureInstitutions]);

  if (!player) return <Navigate to="/" replace />;
  if (!government) return null;

  return (
    <section className="office">
      <header className="office__top">
        <div>
          <p className="kicker kicker--gold">{COUNTRY.palace}</p>
          <h1 className="office__title">President {player.lastName}</h1>
        </div>
        <TreasuryHud />
      </header>
      <nav className="tabs" aria-label="Government">
        {TABS.map((t) => (
          <NavLink key={t.to} to={t.to} end={t.end} className={({ isActive }) => `tab ${isActive ? 'is-active' : ''}`}>
            {t.label}
          </NavLink>
        ))}
        <OfficesMenu />
        <Warnings />
      </nav>
      <div className="office__body">
        <Outlet />
      </div>
      <CabinetWizard />
      <BudgetModal />
      <CrisisTint />
      <Sona />
      <PressConference />
    </section>
  );
}
