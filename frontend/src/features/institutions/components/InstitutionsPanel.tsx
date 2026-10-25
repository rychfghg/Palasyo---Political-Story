import { INSTITUTIONS, type Institution } from '@/data/world/institutions';

const BRANCHES: Institution['branch'][] = ['Executive', 'Legislative', 'Judiciary', 'Independent'];

export function InstitutionsPanel() {
  return (
    <div className="stack">
      <p className="lede">
        The President is powerful, but not all-powerful. Congress, the courts, and the constitutional commissions answer to the
        Constitution — not to you.
      </p>
      {BRANCHES.map((branch) => (
        <section key={branch} className="stack stack--tight">
          <h3 className="section-title">{branch}</h3>
          {INSTITUTIONS.filter((i) => i.branch === branch).map((i) => (
            <article key={i.id} className="card">
              <h4>{i.name}</h4>
              <p className="muted">{i.composition}</p>
              <p>{i.powers}</p>
              <dl className="facts">
                <div><dt>Head</dt><dd>{i.head}</dd></div>
                <div><dt>Your control</dt><dd>{i.playerControl}</dd></div>
              </dl>
            </article>
          ))}
        </section>
      ))}
    </div>
  );
}
