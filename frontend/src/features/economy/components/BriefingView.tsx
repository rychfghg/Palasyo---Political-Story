import { useGameStore } from '@/features/game-engine/store/gameStore';
import { INHERITED_ARREARS, TOTAL_FY2027 } from '@/data/government/economy';
import { TIMELINE } from '@/shared/constants/world';
import { fiscalYear } from '@/features/game-engine/engine/calendar';
import type { CampaignState } from '@/features/game-engine/types/campaign';
import { creditRating, debtToGdp, peso } from '../utils/finance';

const ARREARS_LABEL: Record<string, string> = {
  pay_all: 'Paid everything — most of it borrowed',
  pay_health: 'Paid the hospitals only; contractors still wait',
  audit: 'Froze payments pending a COA audit',
};

export function BriefingView() {
  const s = useGameStore() as unknown as CampaignState;
  const { player, economy, flags, ledger } = s;
  if (!economy) return null;

  const ratio = debtToGdp(economy);
  const rating = creditRating(ratio);
  const interest = economy.debt * economy.interestRate;
  const deficit = TOTAL_FY2027 - economy.revenueAnnual;
  const year = fiscalYear(Math.max(0, s.month));
  const book = s.yearBook?.[year];
  const earned = book ? book.taxes + book.investments + book.oneOffIncome : 0;
  const spent = book ? book.operations + book.interest + book.projects + book.oneOffSpend + book.debtRepaid + (book.principal ?? 0) : 0;
  // The Treasury keeps a working reserve; below ₱50B every new peso is borrowed.
  const cashPct = Math.min(100, (economy.treasury / 600) * 100);
  const decided = flags.arrears_decision ? ARREARS_LABEL[String(flags.arrears_decision)] : null;

  return (
    <div className="stack treasury-office">
      <header className="congress-banner treasury-banner">
        <div className="congress-banner__mace" aria-hidden>₱</div>
        <div>
          <p className="kicker kicker--gold">Kawanihan ng Ingat-Yaman · Maynilad</p>
          <h2>Bureau of the Treasury</h2>
          <p className="muted">The government’s cash, its debts, and every peso that goes in and out. Decisions about paying debt come to you on the Agenda.</p>
        </div>
      </header>

      <section className="congress-strip">
        <div className={economy.treasury < 60 ? 'is-bad' : 'is-good'}><small>Cash on hand</small><b>{peso(economy.treasury)}</b><em>below ₱50B, everything is borrowed</em></div>
        <div className={ratio > 65 ? 'is-bad' : ''}><small>National debt</small><b>{peso(economy.debt)}</b><em>{ratio.toFixed(1)}% of GDP</em></div>
        <div className={rating.outlook === 'Negative' ? 'is-bad' : 'is-good'}><small>Credit rating</small><b>{rating.rating}</b><em>outlook {rating.outlook.toLowerCase()}</em></div>
        <div><small>Interest a year</small><b>{peso(interest)}</b><em>at {(economy.interestRate * 100).toFixed(2)}% average</em></div>
        <div className={earned - spent < 0 ? 'is-bad' : 'is-good'}><small>{year} so far</small><b>{book ? peso(Math.abs(earned - spent)) : '—'}</b><em>{book ? (earned - spent < 0 ? 'deficit' : 'surplus') : 'starts when a month ends'}</em></div>
      </section>

      <div className="bank-grid">
        <section className="card vault">
          <h3 className="section-title">Ang Kaban · The vault</h3>
          <div className="vault__door">
            <div className="vault__gauge"><i style={{ height: `${cashPct}%` }} /></div>
            <div>
              <b>{peso(economy.treasury)}</b>
              <p className="muted">in the Treasury’s accounts. A comfortable cushion is ₱300B–₱600B; typhoons and emergencies draw it down fast.</p>
            </div>
          </div>
          {book && (
            <dl className="vault__flow">
              <div><dt>Taken in this year</dt><dd className="is-good">{peso(earned)}</dd></div>
              <div><dt>Paid out this year</dt><dd className="is-bad">{peso(spent)}</dd></div>
              <div><dt>Borrowed this year</dt><dd>{peso(book.borrowed)}</dd></div>
            </dl>
          )}
          <div className="vault__arrears">
            <span className="kicker">Inherited unpaid bills · {peso(INHERITED_ARREARS.contractors + INHERITED_ARREARS.healthInsurer)}</span>
            <p>{decided ?? 'This decision is waiting for you on the Agenda.'}</p>
          </div>
        </section>

        <article className="paper memo">
          <p className="kicker">Confidential · Transition memo · {TIMELINE.inaugurationDate}</p>
          <h2 className="paper__title">The State of the Treasury</h2>
          <p>
            {player?.honorific === 'Ginoong' ? 'Mr.' : 'Madam'} President, you inherit a Republic that is growing but living beyond its means. The previous administration
            financed its infrastructure boom with borrowed money. We are not in crisis — yet.
          </p>
          <ul className="memo__list">
            <li><b>Deficit:</b> the FY2027 budget spends {peso(TOTAL_FY2027)} against about {peso(economy.revenueAnnual)} in revenue — a gap of {peso(deficit)}, all borrowed.</li>
            <li><b>Interest alone</b> costs more than Health, Defense, and Agriculture combined.</li>
            <li><b>Unpaid bills:</b> {peso(INHERITED_ARREARS.contractors)} to contractors and {peso(INHERITED_ARREARS.healthInsurer)} to the health insurer.</li>
          </ul>
          <p className="memo__sign">— Transition Team, Department of Finance</p>
        </article>
      </div>

      <section className="ledger-book">
        <header>
          <span>Talaan ng Kaban · Treasury ledger</span>
          <span>Amount</span>
        </header>
        {ledger.length === 0 ? (
          <p className="muted ledger-book__empty">No entries yet. Every decision that costs or earns money will appear here.</p>
        ) : (
          ledger.slice(0, 14).map((e) => (
            <div key={e.id} className="ledger-book__row">
              <span className="ledger-book__date">{e.date}</span>
              <span>{e.label}</span>
              <b className={e.amount < 0 ? 'is-bad' : 'is-good'}>{e.amount < 0 ? '−' : '+'}{peso(Math.abs(e.amount))}</b>
              <small>{e.borrowed > 0 ? `${peso(e.borrowed)} borrowed` : ''}</small>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
