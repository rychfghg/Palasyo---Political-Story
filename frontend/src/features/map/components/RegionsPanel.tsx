import { ISLAND_GROUPS, REGIONS, type IslandGroup } from '@/data/world/regions';
import { useGameStore } from '@/features/game-engine/store/gameStore';

export function RegionsPanel() {
  const home = useGameStore((s) => s.homeRegionId);
  const groups = Object.keys(ISLAND_GROUPS) as IslandGroup[];
  const total = REGIONS.reduce((n, r) => n + r.population, 0);

  return (
    <div className="stack">
      <p className="lede">Population: {total.toFixed(1)} million across ten regions and three island groups.</p>
      {groups.map((g) => (
        <section key={g} className="stack stack--tight">
          <h3 className="section-title">{ISLAND_GROUPS[g].name}</h3>
          <p className="muted">{ISLAND_GROUPS[g].description}</p>
          {REGIONS.filter((r) => r.islandGroup === g).map((r) => (
            <article key={r.id} className={`card ${home === r.id ? 'card--home' : ''}`}>
              <header className="card__row">
                <h4>{r.name}</h4>
                {home === r.id && <span className="tag">Home</span>}
              </header>
              <p>{r.note}</p>
              <dl className="facts">
                <div><dt>Center</dt><dd>{r.center}</dd></div>
                <div><dt>Population</dt><dd>{r.population}M</dd></div>
              </dl>
            </article>
          ))}
        </section>
      ))}
    </div>
  );
}
