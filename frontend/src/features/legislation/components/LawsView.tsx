import { useGameStore } from '@/features/game-engine/store/gameStore';
import { monthLabel } from '@/features/game-engine/engine/calendar';
import { peso } from '@/features/economy/utils/finance';

export function LawsView() {
  const { laws, projects, programs, courtRulings, news } = useGameStore();

  return (
    <div className="stack">
      <header className="view-head">
        <div>
          <h2>Mga Batas at Proyekto</h2>
          <p className="muted">Everything your administration has signed, built, funded, and fought over in court.</p>
        </div>
      </header>

      <div className="laws-grid">
        <section className="card">
          <h3 className="section-title">Laws signed · {laws.length}</h3>
          {laws.length === 0 ? (
            <p className="muted">No laws yet. Bills must pass both the House and the Senate.</p>
          ) : (
            <ul className="law-list">
              {laws.map((l) => (
                <li key={l.id}>
                  <b>{l.name}</b>
                  <small>{monthLabel(l.month)}</small>
                  <p className="muted">{l.summary}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card">
          <h3 className="section-title">Infrastructure projects · {projects.length}</h3>
          {projects.length === 0 ? (
            <p className="muted">No projects yet.</p>
          ) : (
            <ul className="law-list">
              {projects.map((p) => {
                const total = Math.round(p.cost / p.monthly);
                const done = total - p.monthsLeft;
                return (
                  <li key={p.id}>
                    <b>{p.name}</b>
                    <small>{p.region} · {peso(p.cost)} · {p.monthsLeft > 0 ? `${p.monthsLeft} months left` : 'Completed'}</small>
                    <div className="gauge"><i className="is-good" style={{ width: `${(done / total) * 100}%` }} /></div>
                  </li>
                );
              })}
            </ul>
          )}
          {programs.length > 0 && (
            <>
              <h3 className="section-title">Recurring programs</h3>
              <ul className="law-list">
                {programs.map((p) => (
                  <li key={p.id}>
                    <b>{p.label}</b>
                    <small>{peso(p.monthly)} per month</small>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <section className="card">
          <h3 className="section-title">Supreme Court rulings · {courtRulings.length}</h3>
          {courtRulings.length === 0 ? (
            <p className="muted">The Court has not yet ruled on any of your actions.</p>
          ) : (
            <ul className="law-list">
              {courtRulings.map((r, i) => (
                <li key={i}>
                  <b>{r.title}</b>
                  <small className={r.upheld ? 'c-ally' : 'c-opp'}>
                    {r.upheld ? 'Upheld' : 'Struck down'} {r.yes}–{r.no} · {monthLabel(r.month)}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card">
          <h3 className="section-title">Headlines archive</h3>
          {news.length === 0 ? (
            <p className="muted">No headlines yet.</p>
          ) : (
            <ul className="news">
              {news.map((n, i) => (
                <li key={i}>
                  <small>{monthLabel(n.month)}</small>
                  <b>{n.headline}</b>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
