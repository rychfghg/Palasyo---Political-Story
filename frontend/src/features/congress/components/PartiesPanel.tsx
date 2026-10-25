import { PARTIES } from '@/data/world/parties';

const HOUSE_TOTAL = 316;
const SENATE_TOTAL = 24;

function SeatBar({ total, get }: { total: number; get: (p: (typeof PARTIES)[number]) => number }) {
  const independents = total - PARTIES.reduce((n, p) => n + get(p), 0);
  return (
    <div className="seatbar">
      {PARTIES.map((p) => (
        <span key={p.id} style={{ flex: get(p), background: p.color }} title={`${p.abbreviation}: ${get(p)}`} />
      ))}
      {independents > 0 && <span style={{ flex: independents, background: '#6b6b6b' }} title={`Independent / others: ${independents}`} />}
    </div>
  );
}

export function PartiesPanel() {
  return (
    <div className="stack">
      <section>
        <h3 className="section-title">House of Representatives · {HOUSE_TOTAL}</h3>
        <SeatBar total={HOUSE_TOTAL} get={(p) => p.houseSeats} />
        <h3 className="section-title">Senate · {SENATE_TOTAL}</h3>
        <SeatBar total={SENATE_TOTAL} get={(p) => p.senateSeats} />
      </section>

      {PARTIES.map((p) => (
        <article key={p.id} className="card" style={{ borderLeftColor: p.color }}>
          <header className="card__head">
            <span className="badge" style={{ background: p.color }}>{p.abbreviation}</span>
            <div>
              <h4>{p.name}</h4>
              <p className="muted">{p.ideology}</p>
            </div>
          </header>
          <p>{p.description}</p>
          <dl className="facts">
            <div><dt>Leader</dt><dd>{p.leader}</dd></div>
            <div><dt>House</dt><dd>{p.houseSeats}</dd></div>
            <div><dt>Senate</dt><dd>{p.senateSeats}</dd></div>
          </dl>
        </article>
      ))}
    </div>
  );
}
