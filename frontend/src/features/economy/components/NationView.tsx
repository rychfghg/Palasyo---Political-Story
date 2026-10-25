import { useMemo, useState } from 'react';
import { useGameStore } from '@/features/game-engine/store/gameStore';
import { assetPay } from '@/features/game-engine/engine/engine';
import { NEEDS, needs } from '@/features/game-engine/engine/world';
import { TREASURY_RESERVE, citizens, investmentLevel, provinceRanking, revenueBreakdown, type ActionResult } from '@/features/game-engine/engine/economyActions';
import { MAX_LEVEL_PER_SECTOR, SECTOR_ECONOMICS, SECTOR_LABEL, type Sector } from '@/data/world/provinces';
import { ArchipelagoMap, type MapMarker } from '@/features/map/components/ArchipelagoMap';
import { fiscalYear, monthLabel } from '@/features/game-engine/engine/calendar';
import type { Asset, YearBook } from '@/features/game-engine/types/campaign';
import type { CampaignState } from '@/features/game-engine/types/campaign';
import { debtToGdp, peso } from '../utils/finance';

const SECTORS: Sector[] = ['tech', 'manufacturing', 'farming', 'tourism', 'infra', 'energy'];
const m = (n: number) => `${n.toFixed(1)}M`;

/** Pesos for small amounts too: 0.35 → ₱350M. */
const pm = (b: number) => (Math.abs(b) < 1 && b !== 0 ? `₱${Math.round(b * 1000)}M` : peso(b));

function assetState(a: Asset, month: number): { label: string; cls: string } {
  if (a.failed) return { label: `Failed — ${a.failNote ?? 'closed'}`, cls: 'is-failed' };
  if (a.startedMonth > month) return { label: `Being built · opens ${monthLabel(a.startedMonth)}`, cls: 'is-building' };
  if ((a.troubleUntil ?? -1) > month) return { label: `Trouble: ${a.troubleNote ?? 'problems'} · until ${monthLabel(a.troubleUntil!)}`, cls: 'is-trouble' };
  return { label: `Earning since ${monthLabel(a.startedMonth)}`, cls: 'is-open' };
}

/** The investment side of the books, on its own scale so the earnings are easy to see. */
function InvestmentEarnings({ s, thisYear }: { s: CampaignState; thisYear: number }) {
  const assets = s.assets ?? [];
  const lifetime = assets.reduce((n, a) => n + (a.earned ?? 0), 0);
  const nowPerYear = assets.reduce((n, a) => n + assetPay(a, s.month) * 12, 0);
  const coming = assets.filter((a) => !a.failed && a.startedMonth > s.month).reduce((n, a) => n + a.monthlyIncome * 12, 0);
  const invested = assets.reduce((n, a) => n + (a.cost ?? 0), 0);
  const failed = assets.filter((a) => a.failed).length;
  return (
    <div className="earn">
      <h4>Kita mula sa Puhunan · What your investments earn</h4>
      <div className="earn__tiles">
        <div><small>Earned this year</small><b>{pm(thisYear)}</b></div>
        <div><small>Earned since you took office</small><b>{pm(lifetime)}</b></div>
        <div><small>Earning now, per year</small><b>{pm(nowPerYear)}</b></div>
        <div><small>Still being built, per year</small><b className="is-soon">{pm(coming)}</b></div>
        <div><small>Paid back so far</small><b>{invested > 0 ? `${Math.round((lifetime / invested) * 100)}%` : '—'}</b><em>of {pm(invested)} invested{failed ? ` · ${failed} failed` : ''}</em></div>
      </div>
      {assets.length === 0 && <p className="muted">Nothing yet. Offers come through the Agenda (Cabinet meetings, allied governments, the Speaker, governors, tycoons), or build in the provinces and court companies below.</p>}
    </div>
  );
}

const ZERO: YearBook = { taxes: 0, investments: 0, oneOffIncome: 0, operations: 0, interest: 0, projects: 0, oneOffSpend: 0, debtRepaid: 0, principal: 0, borrowed: 0 };

/** The year's books: everything that came in and everything that went out. */
function YearBooks({ s }: { s: CampaignState }) {
  const year = fiscalYear(Math.max(0, s.month));
  const years = Object.keys(s.yearBook ?? {}).map(Number).sort((a, b) => b - a);
  const [shown, setShown] = useState(year);
  const b = { ...ZERO, ...(s.yearBook?.[shown] ?? {}) };
  const income = [
    { label: 'Taxes (BIR and Customs)', value: b.taxes },
    { label: 'State investments and companies', value: b.investments },
    { label: 'One-off income (sales, fees, recoveries)', value: b.oneOffIncome },
  ];
  const spent = [
    { label: 'Government operations (budget)', value: b.operations },
    { label: 'Interest on the debt', value: b.interest },
    { label: 'Projects and programs', value: b.projects },
    { label: 'Decisions, calamities, and investments', value: b.oneOffSpend },
    { label: 'Debt installments (principal)', value: b.principal ?? 0 },
    { label: 'Debt paid early', value: b.debtRepaid },
  ];
  const tin = income.reduce((n, x) => n + x.value, 0);
  const tout = spent.reduce((n, x) => n + x.value, 0);
  const net = tin - tout;
  const max = Math.max(tin, tout, 1);
  return (
    <section className="card books">
      <header className="books__head">
        <h3 className="section-title">Kaban ng Bayan · The year’s books</h3>
        <div className="books__years">
          {(years.length ? years : [year]).slice(0, 6).map((y) => (
            <button key={y} className={y === shown ? 'is-active' : ''} onClick={() => setShown(y)}>{y}{y === year ? ' (so far)' : ''}</button>
          ))}
        </div>
      </header>
      <div className="books__totals">
        <div className="is-in"><small>Earned</small><b>{peso(tin)}</b></div>
        <div className="is-out"><small>Spent</small><b>{peso(tout)}</b></div>
        <div className={net >= 0 ? 'is-in' : 'is-out'}><small>{net >= 0 ? 'Surplus' : 'Deficit'}</small><b>{peso(Math.abs(net))}</b></div>
        <div className="is-out"><small>Borrowed</small><b>{peso(b.borrowed)}</b></div>
      </div>
      <div className="books__cols">
        <div>
          <h4>Kita · Income</h4>
          <ul className="bars">
            {income.map((x) => (
              <li key={x.label}><span>{x.label}</span><div className="bar"><i className="is-good" style={{ width: `${(x.value / max) * 100}%` }} /></div><b>{peso(x.value)}</b></li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Gastos · Spending</h4>
          <ul className="bars">
            {spent.map((x) => (
              <li key={x.label}><span>{x.label}</span><div className="bar"><i className="is-bad" style={{ width: `${(x.value / max) * 100}%` }} /></div><b>{peso(x.value)}</b></li>
            ))}
          </ul>
        </div>
      </div>
      <InvestmentEarnings s={s} thisYear={b.investments} />
      <p className="muted">{s.yearBook?.[shown] ? 'Updated every month and after every decision that earns or spends money.' : 'The books for this year start filling in when you end the month.'}</p>
    </section>
  );
}

/**
 * Where the national debt came from and where it went since the start of the term. Every line adds
 * up to the debt shown in the header, so the President can see that installments really are paid.
 */
function DebtTally({ s, onPay }: { s: CampaignState; onPay: (amount: number) => void }) {
  const e = s.economy!;
  const t = s.debtTally ?? { start: e.debt, principal: 0, prepaid: 0, revaluation: 0, loans: 0 };
  const borrowed = Object.values(s.yearBook ?? {}).reduce((n, b) => n + b.borrowed, 0);
  const known = t.start + borrowed + t.loans + t.revaluation - t.principal - t.prepaid;
  const other = e.debt - known;
  const year = fiscalYear(Math.max(0, s.month));
  const thisYear = s.yearBook?.[year];
  const monthly = e.debt * 0.0045;
  const spare = Math.max(0, e.treasury - TREASURY_RESERVE);
  const rows: { label: string; value: number; sign: '+' | '−' | '±' | '' }[] = [
    { label: 'Debt when you took office', value: t.start, sign: '' },
    { label: 'New borrowing to cover deficits', value: borrowed, sign: '+' },
    { label: 'Foreign and special loans', value: t.loans, sign: '+' },
    { label: 'Peso movements on foreign-currency debt', value: t.revaluation, sign: '±' },
    { label: 'Monthly installments paid (principal)', value: t.principal, sign: '−' },
    { label: 'Paid early', value: t.prepaid, sign: '−' },
  ];
  if (Math.abs(other) >= 1) rows.push({ label: 'Other adjustments', value: other, sign: '±' });
  const net = e.debt - t.start;

  return (
    <div className="debt-tally">
      <h3 className="section-title">Utang · The debt tally</h3>
      <ul>
        {rows.map((r) => (
          <li key={r.label} className={r.sign === '−' ? 'is-good' : r.sign === '+' ? 'is-bad' : ''}>
            <span>{r.label}</span>
            <b>{r.sign === '±' ? (r.value >= 0 ? '+' : '−') : r.sign}{peso(Math.abs(r.value))}</b>
          </li>
        ))}
        <li className="debt-tally__total">
          <span>National debt today ({debtToGdp(e).toFixed(1)}% of GDP)</span>
          <b>{peso(e.debt)}</b>
        </li>
      </ul>
      <p className={`debt-tally__net ${net > 0 ? 'is-bad' : 'is-good'}`}>
        {net > 0 ? `Up ${peso(net)} since you took office.` : `Down ${peso(-net)} since you took office.`} This month’s installment is about {peso(monthly)}
        {thisYear ? `; ${peso(thisYear.principal ?? 0)} paid in installments so far this year.` : '.'} The debt only falls when taxes and other income cover spending; otherwise the installment is re-borrowed.
      </p>
      <div className="debt-tally__pay">
        <span>Pay extra from the Treasury ({peso(spare)} spare above the {peso(TREASURY_RESERVE)} reserve):</span>
        <div className="row">
          {[25, 50, 100, 250].map((amt) => (
            <button key={amt} className="btn btn--ghost btn--small btn--light" disabled={amt > spare} onClick={() => onPay(amt)}>
              Pay {peso(amt)}
            </button>
          ))}
        </div>
        {spare < 25 && <small className="muted">No spare cash: this year’s spending is higher than income. Run a surplus — raise revenue, cut spending, or earn from investments — to pay the debt down faster.</small>}
      </div>
    </div>
  );
}

function Toast({ result, onClose }: { result: ActionResult | null; onClose: () => void }) {
  if (!result) return null;
  return (
    <div className={`nation-toast ${result.ok ? 'is-ok' : 'is-fail'}`} role="status">
      <span>{result.message}</span>
      <button onClick={onClose} aria-label="Dismiss">✕</button>
    </div>
  );
}

export function NationView() {
  const s = useGameStore() as unknown as CampaignState & ReturnType<typeof useGameStore.getState>;
  const { investProvince, prepayDebt } = useGameStore();
  const [result, setResult] = useState<ActionResult | null>(null);
  const [selected, setSelected] = useState<string>('maynilad');

  const people = citizens(s);
  const revenue = revenueBreakdown(s);
  const ranking = useMemo(() => provinceRanking(s), [s]);
  const province = ranking.find((p) => p.id === selected) ?? ranking[0];
  const e = s.economy;
  if (!e) return null;
  const assetIncome = (s.assets ?? []).reduce((n, a) => n + assetPay(a, s.month), 0);
  const maxTax = ranking[0]?.taxes ?? 1;

  const markers: MapMarker[] = ranking.map((p, i) => ({
    id: p.id,
    x: p.x,
    y: p.y,
    label: `#${i + 1} ${p.name} · ${peso(p.taxes)}`,
    color: i < 3 ? '#d6b25e' : i < 7 ? '#5a9bd4' : '#c0463c',
    order: i,
  }));

  const act = (r: ActionResult) => setResult(r);
  const peopleBar = [
    { label: 'Employed', value: people.employed, color: '#8fd19e' },
    { label: 'Unemployed', value: people.unemployed, color: '#e0806f' },
    { label: 'Students', value: people.students, color: '#5a9bd4' },
    { label: 'Children (under 5)', value: people.children, color: '#b38ad6' },
    { label: 'Seniors', value: people.seniors, color: '#d6b25e' },
    { label: 'Others not in the labor force', value: people.notInLabor, color: '#6b7684' },
  ];
  const peopleTotal = peopleBar.reduce((n, p) => n + p.value, 0);

  return (
    <div className="stack nation">
      <header className="view-head">
        <div>
          <h2>Ang Bansa</h2>
          <p className="muted">The people, the taxes, and where to put the country’s money to work. Investments here cost money now and earn income every month — while creating jobs.</p>
        </div>
      </header>
      <Toast result={result} onClose={() => setResult(null)} />
      <YearBooks s={s} />

      {/* ─── BIR & people ─── */}
      <div className="nation-grid">
        <section className="card">
          <h3 className="section-title">Kawanihan ng Rentas Internas (BIR) · Annual revenue {peso(revenue.total)}</h3>
          <ul className="bars">
            {revenue.parts.map((p) => (
              <li key={p.label}>
                <span>{p.label}</span>
                <div className="bar"><i style={{ width: `${(p.value / revenue.total) * 100}%` }} /></div>
                <b>{peso(p.value)}</b>
              </li>
            ))}
          </ul>
          <p className="muted">Tax measures — compliance drives, cases against evaders, VAT and income-tax changes — come to you as decisions on the Agenda, proposed by the BIR and the Finance Secretary.</p>
        </section>

        <section className="card">
          <h3 className="section-title">Mamamayan · Population {m(people.population)}</h3>
          <div className="stackbar">
            {peopleBar.map((p) => (
              <i key={p.label} style={{ flex: p.value / peopleTotal, background: p.color }} title={`${p.label}: ${m(p.value)}`} />
            ))}
          </div>
          <div className="people-tiles">
            {peopleBar.map((p) => (
              <div key={p.label}><i style={{ background: p.color }} /><span>{p.label}</span><b>{m(p.value)}</b></div>
            ))}
            <div><i style={{ background: '#2c8a7d' }} /><span>OFWs abroad (within employed)</span><b>{m(people.ofws)}</b></div>
            <div><i style={{ background: '#9c7a2c' }} /><span>Registered income-tax payers</span><b>{m(people.taxpayers)}</b></div>
          </div>
          <p className="muted">Labor force {m(people.laborForce)} · Unemployment {e.unemployment.toFixed(1)}%</p>

          <DebtTally s={s} onPay={(amt) => act(prepayDebt(amt))} />
        </section>
      </div>

      {/* ─── Provinces ─── */}
      <section className="card">
        <h3 className="section-title">Mga Lalawigan at Lungsod — ranked by taxes collected</h3>
        <div className="province-layout">
          <div className="province-map">
            <ArchipelagoMap embedded markers={markers} onMarkerClick={setSelected} showLabels={false} />
            <div className="province-map__legend"><span className="dot gold" /> Top 3 <span className="dot blue" /> Middle <span className="dot red" /> Poorest</div>
          </div>
          <ol className="ranking">
            {ranking.map((p, i) => (
              <li key={p.id} className={p.id === selected ? 'is-selected' : ''}>
                <button onClick={() => setSelected(p.id)}>
                  <span className="rank">#{i + 1}</span>
                  <span className="rank-name"><b>{p.name}</b><small>{p.kind} · pop. {p.population}M · unemployment {p.unemployment.toFixed(1)}%</small></span>
                  <span className="rank-bar"><i style={{ width: `${(p.taxes / maxTax) * 100}%` }} /></span>
                  <b>{peso(p.taxes)}</b>
                </button>
              </li>
            ))}
          </ol>
        </div>

        {province && (
          <div className="province-detail">
            <header>
              <h4>{province.name}</h4>
              <p className="muted">{province.note} Taxes: {peso(province.taxes)} a year · {province.jobs.toLocaleString()} jobs from your investments.</p>
            </header>
            <div className="action-grid">
              {SECTORS.map((sector) => {
                const econ = SECTOR_ECONOMICS[sector];
                const fit = province.fit[sector];
                const level = investmentLevel(s, province.id, sector);
                const cooling = (s.cooldowns?.[`inv:${province.id}`] ?? -99) > s.month;
                const maxed = level >= MAX_LEVEL_PER_SECTOR;
                const cost = Math.round(econ.cost * (1 + level * 0.2));
                const income = econ.monthlyIncome * fit * (1 - level * 0.15) * 12;
                return (
                  <button key={sector} className={`action-card fit-${fit >= 1.2 ? 'great' : fit >= 1 ? 'good' : 'poor'}`} disabled={cooling || maxed} onClick={() => act(investProvince(province.id, sector))}>
                    <b>{SECTOR_LABEL[sector]} {level > 0 && <em>Lv {level}</em>}</b>
                    <span>{econ.description}</span>
                    <small>
                      {maxed ? 'Fully developed' : `Cost ${peso(cost)} · ~${Math.round(econ.jobs * fit * (1 - level * 0.15)).toLocaleString()} jobs · +${peso(income)}/yr after ${econ.build} months`}
                      {econ.inflation < 0 && !maxed ? ' · lowers prices' : ''}
                    </small>
                    <small className="fit">{fit >= 1.2 ? 'Excellent fit' : fit >= 1 ? 'Good fit' : fit >= 0.8 ? 'Fair fit' : 'Poor fit'}</small>
                  </button>
                );
              })}
            </div>
            {(s.cooldowns?.[`inv:${province.id}`] ?? -99) > s.month && <p className="muted">One new state investment per province per month. Come back next month.</p>}
          </div>
        )}
      </section>

      {/* ─── What the country lacks ─── */}
      <section className="card">
        <h3 className="section-title">Ang Kulang sa Bansa · What the country lacks</h3>
        <p className="muted">How well the country is served. Coverage slowly wears down as the population grows; low coverage drags your approval and sparks crises. What to build is decided in planning meetings and when ministers bring proposals on the Agenda. Foreign companies also bring their own proposals there.</p>
        <div className="needs">
          {NEEDS.map((n) => {
            const v = Math.round(needs(s)[n.id] ?? n.start);
            return (
              <div key={n.id} className={`need ${v < 40 ? 'is-low' : v >= 70 ? 'is-good' : ''}`}>
                <span className="need__icon" aria-hidden>{n.icon}</span>
                <div>
                  <b>{n.label}</b>
                  <div className="need__bar"><i style={{ width: `${v}%` }} /></div>
                  <small>{v}% · {v < 40 ? 'critical shortage' : v < 55 ? 'lacking' : v < 70 ? 'adequate' : 'well served'} · {n.note}</small>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Portfolio ─── */}
      <section className="card">
        <h3 className="section-title">Portfolio ng Bayan · earning {pm(assetIncome)} a month ({pm(assetIncome * 12)} a year)</h3>
        {(s.assets ?? []).length === 0 ? (
          <p className="muted">No income-generating investments yet. Watch for offers from your Cabinet and allied governments on the Agenda, build in the provinces, or court a company above.</p>
        ) : (
          <ul className="portfolio">
            {[...(s.assets ?? [])].sort((a, b) => Number(!!a.failed) - Number(!!b.failed) || (b.earned ?? 0) - (a.earned ?? 0) || b.monthlyIncome - a.monthlyIncome).map((a) => {
              const st = assetState(a, s.month);
              const payback = a.cost ? Math.min(100, ((a.earned ?? 0) / a.cost) * 100) : null;
              return (
                <li key={a.id} className={st.cls}>
                  <div>
                    <b>{a.name}</b>
                    <small>{a.kind === 'company' ? 'Foreign company' : a.kind} · {a.jobs.toLocaleString()} jobs{a.cost ? ` · cost ${pm(a.cost)}` : ''}</small>
                    {payback !== null && <span className="payback" title="How much of the cost it has paid back"><i style={{ width: `${payback}%` }} /></span>}
                  </div>
                  <span className="portfolio__income">{pm(a.failed ? 0 : a.monthlyIncome * 12)}<small>/yr</small><em>earned {pm(a.earned ?? 0)}</em></span>
                  <span className={`portfolio__status ${st.cls}`}>{st.label}</span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
