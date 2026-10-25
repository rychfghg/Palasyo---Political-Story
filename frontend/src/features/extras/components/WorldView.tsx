import { useGameStore } from '@/features/game-engine/store/gameStore';
import { COUNTRIES, governors, relations } from '@/features/game-engine/engine/world';
import type { CampaignState } from '@/features/game-engine/types/campaign';
import { PROVINCES } from '@/data/world/provinces';
import { StanceBadge } from '@/shared/components/ui/StanceBadge';
import { Portrait } from '@/shared/components/ui/Portrait';

const mood = (v: number) => (v >= 70 ? 'Close ally' : v >= 55 ? 'Friendly' : v >= 40 ? 'Cool' : v >= 25 ? 'Tense' : 'Hostile');

/** Foreign capitals and provincial capitols: who is with you, and who is not. */
export function WorldView() {
  const s = useGameStore() as unknown as CampaignState;
  const rel = relations(s);
  const govs = governors(s);
  const allies = govs.filter((g) => g.stance === 'ally').length;

  return (
    <div className="stack">
      <header className="congress-banner world-banner">
        <div className="congress-banner__mace" aria-hidden>🌏</div>
        <div>
          <p className="kicker kicker--gold">Department of Foreign Affairs · League of Provinces</p>
          <h2>Ugnayang Panlabas at Panlalawigan</h2>
          <p className="muted">Relations with foreign governments shape loans, aid, and the West Sea. Governors decide whether your projects move in their provinces. Summits and local fights come to you on the Agenda.</p>
        </div>
      </header>

      <section className="card">
        <h3 className="section-title">Foreign relations</h3>
        <div className="relations">
          {COUNTRIES.map((c) => {
            const v = Math.round(rel[c.id] ?? 50);
            return (
              <div key={c.id} className="relation">
                <div className="relation__head">
                  <b>{c.name}</b>
                  <span className={`relation__mood ${v >= 55 ? 'is-good' : v < 40 ? 'is-bad' : ''}`}>{mood(v)} · {v}</span>
                </div>
                <div className="relation__bar"><i style={{ width: `${v}%` }} /></div>
                <small className="muted">{c.note}</small>
              </div>
            );
          })}
        </div>
      </section>

      <section className="card">
        <h3 className="section-title">Mga Gobernador · Governors ({allies} of {govs.length} allied)</h3>
        <p className="muted">Allied governors speed up your investments in their provinces (+5% income); opposition governors slow them down (−15%). Local elections in May 2030 and May 2033 can change them.</p>
        <div className="governors">
          {govs.map((g) => (
            <div key={g.province} className={`governor governor--${g.stance}`}>
              <Portrait name={g.name} size={44} />
              <div>
                <b>{g.name}</b>
                <small>{PROVINCES.find((p) => p.id === g.province)?.name ?? g.province} · since {g.since}</small>
              </div>
              <StanceBadge stance={g.stance} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
