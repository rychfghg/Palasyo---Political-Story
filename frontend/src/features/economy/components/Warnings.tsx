import { useState } from 'react';
import { useGameStore } from '@/features/game-engine/store/gameStore';
import { monthLabel } from '@/features/game-engine/engine/calendar';
import type { CampaignState } from '@/features/game-engine/types/campaign';
import { Modal } from '@/shared/components/ui/Modal';
import { useUiStore } from '@/app/store/uiStore';

interface Warning {
  id: string;
  level: 'danger' | 'warn';
  title: string;
  text: string;
}

/** The state of the nation, in plain alarms. */
export function warningsFor(s: CampaignState): Warning[] {
  const e = s.economy;
  if (!e) return [];
  const out: Warning[] = [];
  const ratio = (e.debt / e.gdp) * 100;
  if (e.inflation >= 6) out.push({ id: 'infl', level: 'danger', title: 'Inflation is too high', text: `Prices are rising ${e.inflation.toFixed(1)}% a year. Families are hurting and protests are building. Invest in farming, logistics, or energy on the Nation tab, or let the central bank act.` });
  else if (e.inflation >= 4.5) out.push({ id: 'infl', level: 'warn', title: 'Inflation is creeping up', text: `Inflation is at ${e.inflation.toFixed(1)}%. Watch food and fuel prices.` });
  if (ratio >= 68) out.push({ id: 'debt', level: 'danger', title: 'Debt is dangerously high', text: `Debt is ${ratio.toFixed(1)}% of GDP. A downgrade to junk is near. Raise revenue, build income-earning investments, or repay debt from the Treasury.` });
  else if (ratio >= 64) out.push({ id: 'debt', level: 'warn', title: 'Debt is rising', text: `Debt is ${ratio.toFixed(1)}% of GDP. Interest costs are eating the budget.` });
  if ((e.growth ?? 5) < 3.5) out.push({ id: 'growth', level: 'danger', title: 'The economy is stalling', text: `Growth is only ${(e.growth ?? 0).toFixed(1)}%. Without investment and jobs, rallies will follow.` });
  if (e.unemployment >= 7.5) out.push({ id: 'jobs', level: 'danger', title: 'Too many people without work', text: `Unemployment is ${e.unemployment.toFixed(1)}%. Build economic zones, court companies, or fund infrastructure.` });
  if (e.approval < 30) out.push({ id: 'approval', level: 'danger', title: 'The people are losing faith', text: `Approval has fallen to ${Math.round(e.approval)}%. Impeachment and People Power become real threats below 20%.` });
  if (e.treasury <= 60) out.push({ id: 'cash', level: 'warn', title: 'The Treasury is running on empty', text: 'Every new expense is being borrowed.' });

  const h = s.history ?? [];
  if (h.length >= 7) {
    const now = h[h.length - 1];
    const then = h[h.length - 7];
    if (now.inflation >= then.inflation - 0.1 && now.debtRatio >= then.debtRatio - 0.1 && now.approval <= then.approval + 1 && now.growth <= then.growth + 0.1)
      out.push({ id: 'stagnant', level: 'warn', title: 'No improvement in six months', text: 'Inflation, debt, growth, and approval have all failed to improve since six months ago. The country is waiting for results.' });
  }
  return out.sort((a, b) => (a.level === b.level ? 0 : a.level === 'danger' ? -1 : 1));
}

/**
 * Warnings open as a centered dialog once each month when something is wrong.
 * After acknowledging, a small chip on the desk reopens them.
 */
export function Warnings() {
  const s = useGameStore() as unknown as CampaignState;
  const [acknowledged, setAcknowledged] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const reviewSeen = useUiStore((u) => u.reviewSeen);
  const reviewPending = !!s.monthReport && s.monthReport.month === s.month - 1 && reviewSeen < s.monthReport.month;
  const cabinetOpen = useUiStore((u) => u.cabinetWizardOpen);
  const list = warningsFor(s);
  if (!list.length) return null;

  const budgetPending = useGameStore.getState().phase === 'presidency' && !s.budgetSubmitted && s.month < 1;
  // Warnings are listed in the month summary; this chip reopens them on demand.
  void acknowledged; void reviewPending; void cabinetOpen; void budgetPending;
  const showModal = open;
  const close = () => {
    setAcknowledged(s.month);
    setOpen(false);
  };
  const dangers = list.filter((w) => w.level === 'danger').length;

  return (
    <>
      <button className={`warn-chip ${dangers ? 'is-danger' : ''}`} onClick={() => setOpen(true)} title="Open the warnings">
        ⚠ {list.length}
        <span>warning{list.length > 1 ? 's' : ''}</span>
      </button>
      {showModal && (
        <Modal title="Babala · Warning" kicker={`State of the nation · ${monthLabel(s.month)}`} onClose={close} className="warn-modal">
          <div className="warning-list">
            {list.map((w) => (
              <div key={w.id} className={`warning warning--${w.level}`}>
                <span className="warning__icon">{w.level === 'danger' ? '!' : 'i'}</span>
                <div>
                  <b>{w.title}</b>
                  <p>{w.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="warn-modal__foot">
            <button className="btn btn--primary" onClick={close}>Understood</button>
          </div>
        </Modal>
      )}
    </>
  );
}
