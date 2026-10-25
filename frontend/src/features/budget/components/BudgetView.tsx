import { BUDGET_LINES, TOTAL_FY2027 } from '@/data/government/economy';
import { useGameStore } from '@/features/game-engine/store/gameStore';
import { creditRating, peso } from '@/features/economy/utils/finance';

const STEP = 5; // ₱B per click

export function BudgetView() {
  const { economy, budgetProposal, budgetSubmitted: submittedFlag, month, setBudgetLine, resetBudgetProposal, submitBudget } = useGameStore();
  // Once the House hearings begin (August 2027), the draft is in Congress’s hands.
  const budgetSubmitted = submittedFlag || month >= 1;
  if (!economy || !budgetProposal) return null;

  // Interest is automatically appropriated and rises with every peso borrowed.
  const debtService = Math.round(economy.debt * economy.interestRate);
  const value = (id: string) => (id === 'debtService' ? debtService : budgetProposal[id] ?? 0);

  const total = BUDGET_LINES.reduce((n, l) => n + value(l.id), 0);
  const revenue = economy.projectedRevenueNextYear;
  const deficit = total - revenue;
  const deficitPct = (deficit / (economy.gdp * 1.07)) * 100;
  const debtEnd2028 = economy.debt + Math.max(0, deficit);
  const ratioEnd2028 = (debtEnd2028 / (economy.gdp * 1.07)) * 100;
  const rating = creditRating(ratioEnd2028);
  const max = Math.max(...BUDGET_LINES.map((l) => Math.max(value(l.id), l.fy2027)));

  const groups: { title: string; kind: string }[] = [
    { title: 'Executive departments', kind: 'department' },
    { title: 'Mandatory (cannot be cut)', kind: 'mandatory' },
    { title: 'Other offices', kind: 'other' },
  ];

  return (
    <div className="stack">
      <header className="congress-banner budget-banner">
        <div className="congress-banner__mace" aria-hidden>📑</div>
        <div>
          <p className="kicker kicker--gold">Kagawaran ng Badyet at Pamamahala · Maynilad</p>
          <h2>Pambansang Badyet</h2>
          <p className="muted">
            The FY2028 National Expenditure Program. The Budget department’s baseline raises every line 8% to keep pace with prices. Congress debates and amends it — the House first, then the Senate.
            Anything above revenue is borrowed.
          </p>
        </div>
      </header>

      <section className="congress-strip">
        <div><small>FY2027 (inherited)</small><b>{peso(TOTAL_FY2027)}</b><em>the Dela Paz budget</em></div>
        <div><small>{budgetSubmitted ? 'Your proposal (sent)' : 'Your FY2028 proposal'}</small><b>{peso(total)}</b><em>{total >= TOTAL_FY2027 ? '+' : ''}{peso(total - TOTAL_FY2027)} vs FY2027</em></div>
        <div><small>Projected revenue</small><b>{peso(revenue)}</b><em>taxes and fees next year</em></div>
        <div className={deficit > 0 ? 'is-bad' : 'is-good'}><small>{deficit > 0 ? 'Deficit (borrowed)' : 'Surplus'}</small><b>{peso(Math.abs(deficit))}</b><em>{deficitPct.toFixed(1)}% of GDP</em></div>
        <div className={ratioEnd2028 > 65 ? 'is-bad' : ''}><small>Debt by end-2028</small><b>{peso(debtEnd2028)}</b><em>{ratioEnd2028.toFixed(1)}% of GDP · {rating.rating}</em></div>
      </section>

      <section className="card">
        <h3 className="section-title">Saan Napupunta ang Pera · Where the money goes</h3>
        <div className="alloc-bar">
          {[...BUDGET_LINES].sort((a, b) => value(b.id) - value(a.id)).map((l, i) => (
            <i key={l.id} style={{ flex: value(l.id), background: `hsl(${(i * 37) % 360} 45% ${i < 8 ? 52 : 38}%)` }} title={`${l.short}: ${peso(value(l.id))} (${((value(l.id) / total) * 100).toFixed(1)}%)`} />
          ))}
        </div>
        <div className="alloc-legend">
          {[...BUDGET_LINES].sort((a, b) => value(b.id) - value(a.id)).slice(0, 8).map((l, i) => (
            <span key={l.id}><i style={{ background: `hsl(${(i * 37) % 360} 45% 52%)` }} />{l.short} <b>{((value(l.id) / total) * 100).toFixed(0)}%</b></span>
          ))}
        </div>
      </section>

      {deficitPct > 5 && <p className="alert">Rating agencies warn that a deficit above 5% of GDP could trigger a downgrade, raising interest costs.</p>}

      {groups.map((g) => (
        <section key={g.kind} className="card">
          <h3 className="section-title">{g.title}</h3>
          <ul className="budget-lines">
            {BUDGET_LINES.filter((l) => l.kind === g.kind).map((l) => {
              const v = value(l.id);
              const delta = v - l.fy2027;
              const locked = l.kind === 'mandatory' || budgetSubmitted;
              return (
                <li key={l.id}>
                  <div className="budget-lines__name">
                    <b>{l.short}</b>
                    <small>{l.note}</small>
                  </div>
                  <div className="budget-lines__bar">
                    <i className="prev" style={{ width: `${(l.fy2027 / max) * 100}%` }} />
                    <i className="curr" style={{ width: `${(v / max) * 100}%` }} />
                  </div>
                  <div className="budget-lines__value">
                    <b>{peso(v)}</b>
                    {delta !== 0 && <small className={delta > 0 ? 'up' : 'down'}>{delta > 0 ? '+' : ''}{peso(delta)}</small>}
                  </div>
                  <div className="budget-lines__ctrl">
                    {!locked && (
                      <>
                        <button onClick={() => setBudgetLine(l.id, v - Math.max(STEP, Math.round(v * 0.05)))} aria-label={`Cut ${l.short}`}>−</button>
                        <button onClick={() => setBudgetLine(l.id, v + Math.max(STEP, Math.round(v * 0.05)))} aria-label={`Raise ${l.short}`}>+</button>
                      </>
                    )}
                    {l.kind === 'mandatory' && <span className="lock">Locked</span>}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <div className="row row--end">
        {budgetSubmitted ? (
          <p className="alert alert--ok">The FY2028 National Expenditure Program is with Congress. Follow its fate in the Agenda.</p>
        ) : (
          <>
            <button className="btn btn--ghost btn--light" onClick={resetBudgetProposal}>Reset to DBM baseline (+8%)</button>
            <button className="btn btn--primary" onClick={submitBudget}>Submit to Congress</button>
          </>
        )}
      </div>
    </div>
  );
}
