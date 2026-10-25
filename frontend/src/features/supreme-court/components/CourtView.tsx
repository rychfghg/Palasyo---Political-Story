import { useState } from 'react';
import { SUPREME_COURT, retirementYear, type Justice, type Philosophy } from '@/data/government/supremeCourt';
import { TIMELINE } from '@/shared/constants/world';
import { useGameStore } from '@/features/game-engine/store/gameStore';
import { Portrait } from '@/shared/components/ui/Portrait';

const PHILOSOPHY_NOTE: Record<Philosophy, string> = {
  Textualist: 'Reads the Constitution strictly by its words.',
  Progressive: 'Reads rights broadly; protective of the vulnerable.',
  Moderate: 'Seeks consensus and narrow rulings.',
  Pragmatist: 'Weighs practical consequences and stability.',
};

const PHILOSOPHY_COLOR: Record<Philosophy, string> = {
  Textualist: '#5a9bd4',
  Moderate: '#d6b25e',
  Pragmatist: '#8fd19e',
  Progressive: '#c98ad6',
};

const TERM_END = 2033;

function Seat({ j, chief, onPick, picked }: { j: Justice; chief?: boolean; onPick: () => void; picked: boolean }) {
  const retires = retirementYear(j);
  const surname = j.name.replace(/^(Justice|Chief Justice)\s*/, '');
  return (
    <button className={`bench-seat ${chief ? 'bench-seat--chief' : ''} ${picked ? 'is-picked' : ''}`} onClick={onPick} title={`${j.name} — ${j.philosophy}`}>
      <div className="bench-seat__robe">
        <Portrait name={j.name} size={chief ? 104 : 72} />
      </div>
      <b>{surname}</b>
      <span className="bench-seat__phil" style={{ color: PHILOSOPHY_COLOR[j.philosophy] }}>● {j.philosophy}</span>
      <small className={retires <= TERM_END ? 'retiring' : ''}>{j.appointedBy === 'You' ? 'Your appointee · ' : ''}retires {retires}</small>
    </button>
  );
}

export function CourtView() {
  const appointed = useGameStore((s) => s.justiceChanges);
  const rulings = useGameStore((s) => s.courtRulings);
  const justices: Justice[] = [...SUPREME_COURT]
    .map((j) => {
      const change = appointed.find((c) => c.replaces === j.id);
      return change ? { ...j, id: `new-${j.id}`, name: change.name, philosophy: change.philosophy, appointedBy: 'You', appointedYear: 2028, birthYear: 1972, background: `Your appointee, chosen from the Judicial and Bar Council shortlist. Replaced Justice ${j.name}.` } : j;
    })
    .sort((a, b) => Number(b.isChief) - Number(a.isChief) || a.appointedYear - b.appointedYear);
  const chief = justices.find((j) => j.isChief) ?? justices[0];
  // Seniority seats the associates: the most senior sit nearest the Chief Justice, alternating left and right.
  const associates = justices.filter((j) => j !== chief);
  const bench = (list: Justice[]) => {
    const left: Justice[] = [];
    const right: Justice[] = [];
    list.forEach((j, i) => (i % 2 === 0 ? right : left).push(j));
    return [...left.reverse(), ...right];
  };
  const upper = bench(associates.slice(0, 6));
  const lower = bench(associates.slice(6));
  const [picked, setPicked] = useState<string>(chief.id);
  const detail = justices.find((j) => j.id === picked) ?? chief;

  const vacancies = justices.filter((j) => retirementYear(j) <= TERM_END);
  const philosophies = (['Textualist', 'Moderate', 'Pragmatist', 'Progressive'] as Philosophy[]).map((p) => ({ p, n: justices.filter((j) => j.philosophy === p).length }));
  const won = rulings.filter((r) => r.upheld).length;

  return (
    <div className="stack court-office">
      <header className="court-banner">
        <div className="court-banner__seal" aria-hidden>⚖</div>
        <div>
          <p className="kicker kicker--gold">Republika ng Kapuluan · Maynilad</p>
          <h2>Kataas-taasang Hukuman</h2>
          <p className="muted">The Supreme Court sits en banc: one Chief Justice and fourteen Associate Justices. They serve until 70, owe nothing to you, and cannot be fired. They judge your laws and orders on the merits.</p>
        </div>
      </header>

      <section className="court-strip">
        <div><small>Chief Justice</small><b>{chief.name.replace(/^(Chief Justice|Justice)\s*/, '')}</b><em>since {chief.appointedYear}</em></div>
        <div><small>Your appointees</small><b>{appointed.length} of 15</b><em>{appointed.length ? 'still independent' : 'all appointed by predecessors'}</em></div>
        <div><small>Retiring in your term</small><b>{vacancies.length}</b><em>{vacancies.length ? `next: ${Math.min(...vacancies.map(retirementYear))}` : 'none'}</em></div>
        <div><small>Rulings on your acts</small><b>{won} upheld · {rulings.length - won} struck</b><em>{rulings.length ? 'so far' : 'no cases yet'}</em></div>
        <div className="court-strip__phil">
          <small>The bench</small>
          <p>{philosophies.map(({ p, n }) => <span key={p} style={{ color: PHILOSOPHY_COLOR[p] }}>● {n} {p}</span>)}</p>
        </div>
      </section>

      <section className="bench">
        <div className="bench__row bench__row--chief">
          <Seat j={chief} chief onPick={() => setPicked(chief.id)} picked={picked === chief.id} />
        </div>
        <div className="bench__desk" aria-hidden />
        <div className="bench__row">
          {upper.map((j) => <Seat key={j.id} j={j} onPick={() => setPicked(j.id)} picked={picked === j.id} />)}
        </div>
        <div className="bench__row">
          {lower.map((j) => <Seat key={j.id} j={j} onPick={() => setPicked(j.id)} picked={picked === j.id} />)}
        </div>
        <p className="muted bench__hint">Justices sit by seniority, the most senior nearest the Chief Justice. Select a justice to read their record.</p>
      </section>

      <section className="card justice-detail">
        <Portrait name={detail.name} size={96} />
        <div>
          <span className="kicker">{detail.isChief ? 'Chief Justice' : 'Associate Justice'}</span>
          <h3>{detail.name}</h3>
          <p>{detail.background}</p>
          <dl className="facts">
            <div><dt>Philosophy</dt><dd>{detail.philosophy} — {PHILOSOPHY_NOTE[detail.philosophy]}</dd></div>
            <div><dt>Appointed</dt><dd>{detail.appointedYear} by {detail.appointedBy === 'You' ? 'you' : detail.appointedBy.split(' (')[0]}</dd></div>
            <div><dt>Retires</dt><dd className={retirementYear(detail) <= TERM_END ? 'retiring' : ''}>{retirementYear(detail)}</dd></div>
            <div><dt>Stance</dt><dd>Independent</dd></div>
          </dl>
        </div>
      </section>

      <p className="alert alert--info">
        When a seat opens, the Judicial and Bar Council sends a shortlist of at least three names. You must choose from it — and your choice may still rule against you.
        Term of the current administration: {TIMELINE.inaugurationDate} – {TIMELINE.termEnds}.
      </p>
    </div>
  );
}
