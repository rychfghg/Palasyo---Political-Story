import { useGameStore } from '@/features/game-engine/store/gameStore';
import { fiscalYear } from '@/features/game-engine/engine/calendar';
import type { CampaignState } from '@/features/game-engine/types/campaign';
import { creditRating, debtToGdp, peso, TREASURY_FLOOR } from '../utils/finance';

/** Always-visible national indicators across the Palasyo screens. */
export function TreasuryHud() {
  const s = useGameStore() as unknown as CampaignState;
  const { economy, gameDate } = s;
  if (!economy) return null;
  const ratio = debtToGdp(economy);
  const { rating, outlook } = creditRating(ratio);

  // The real position this year: everything that came in minus everything that went out.
  const year = fiscalYear(Math.max(0, s.month));
  const b = s.yearBook?.[year];
  const balance = b ? b.taxes + b.investments + b.oneOffIncome - (b.operations + b.interest + b.projects + b.oneOffSpend + b.debtRepaid + (b.principal ?? 0)) : null;
  const atFloor = economy.treasury <= TREASURY_FLOOR + 0.5;

  const stats: { label: string; value: string; sub?: string; warn?: boolean; good?: boolean; tip?: string }[] = [
    { label: 'Date', value: gameDate, tip: 'The current month of your term (July 2027 to June 2033).' },
    {
      label: 'Treasury cash',
      value: peso(economy.treasury),
      sub: b && b.borrowed > 0 ? `${peso(b.borrowed)} borrowed in ${year}` : atFloor ? 'at minimum reserve' : 'available',
      warn: atFloor || economy.treasury < 150,
      tip: 'Cash the government holds. Below the ₱50B reserve, every new peso spent is borrowed and added to the debt.',
    },
    {
      label: `${year} balance`,
      value: balance === null ? '—' : `${balance < 0 ? '−' : '+'}${peso(Math.abs(balance))}`,
      sub: balance === null ? 'after the first month' : balance < 0 ? 'deficit so far' : 'surplus so far',
      warn: balance !== null && balance < 0,
      good: balance !== null && balance >= 0,
      tip: 'Everything that came in this year minus everything that went out, including debt installments. Positive means a surplus.',
    },
    { label: 'National debt', value: peso(economy.debt), warn: true, tip: 'Everything the government owes. It grows when you borrow and falls when installments and early payments exceed new borrowing.' },
    { label: 'Debt / GDP', value: `${ratio.toFixed(1)}%`, warn: ratio > 60, tip: 'Debt compared with the whole economy. Above 60% worries investors; above 72% for months can spark a revolt.' },
    { label: 'Credit rating', value: `${rating} · ${outlook}`, warn: outlook === 'Negative', tip: 'How rating agencies judge your ability to repay. A downgrade makes borrowing more expensive.' },
    { label: 'Inflation', value: `${economy.inflation.toFixed(1)}%`, warn: economy.inflation > 4, tip: 'How fast prices rise. The central bank targets 2–4%. Above 6% for months fills the streets with protesters.' },
    { label: 'Approval', value: `${Math.round(economy.approval)}%`, good: economy.approval >= 50, tip: 'Share of the public that approves of you. Low approval invites impeachment, protests, and defeats in Congress.' },
  ];

  return (
    <div className="hud" role="status" aria-label="National indicators">
      {stats.map((st) => (
        <div key={st.label} className={`hud__stat ${st.warn ? 'is-warn' : ''} ${st.good ? 'is-good' : ''}`} data-tip={st.tip} tabIndex={st.tip ? 0 : undefined}>
          <span>{st.label}</span>
          <b>{st.value}</b>
          {st.sub && <small className="hud__sub">{st.sub}</small>}
        </div>
      ))}
    </div>
  );
}
