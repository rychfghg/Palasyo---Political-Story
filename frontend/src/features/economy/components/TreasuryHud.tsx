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

  const stats: { label: string; value: string; sub?: string; warn?: boolean; good?: boolean }[] = [
    { label: 'Date', value: gameDate },
    {
      label: 'Treasury cash',
      value: peso(economy.treasury),
      sub: b && b.borrowed > 0 ? `${peso(b.borrowed)} borrowed in ${year}` : atFloor ? 'at minimum reserve' : 'available',
      warn: atFloor || economy.treasury < 150,
    },
    {
      label: `${year} balance`,
      value: balance === null ? '—' : `${balance < 0 ? '−' : '+'}${peso(Math.abs(balance))}`,
      sub: balance === null ? 'after the first month' : balance < 0 ? 'deficit so far' : 'surplus so far',
      warn: balance !== null && balance < 0,
      good: balance !== null && balance >= 0,
    },
    { label: 'National debt', value: peso(economy.debt), warn: true },
    { label: 'Debt / GDP', value: `${ratio.toFixed(1)}%`, warn: ratio > 60 },
    { label: 'Credit rating', value: `${rating} · ${outlook}`, warn: outlook === 'Negative' },
    { label: 'Inflation', value: `${economy.inflation.toFixed(1)}%`, warn: economy.inflation > 4 },
    { label: 'Approval', value: `${Math.round(economy.approval)}%`, good: economy.approval >= 50 },
  ];

  return (
    <div className="hud" role="status" aria-label="National indicators">
      {stats.map((st) => (
        <div key={st.label} className={`hud__stat ${st.warn ? 'is-warn' : ''} ${st.good ? 'is-good' : ''}`}>
          <span>{st.label}</span>
          <b>{st.value}</b>
          {st.sub && <small className="hud__sub">{st.sub}</small>}
        </div>
      ))}
    </div>
  );
}
