import { useGameStore } from '@/features/game-engine/store/gameStore';
import { earned, historyBook } from '@/features/game-engine/engine/legacy';
import { monthLabel } from '@/features/game-engine/engine/calendar';
import type { CampaignState } from '@/features/game-engine/types/campaign';

/** The history book of this presidency, written from what actually happened. */
export function HistoryBook({ s }: { s: CampaignState }) {
  if (!s.economy) return null;
  const h = historyBook(s);
  return (
    <article className="history-book">
      <p className="history-book__chapter">Kasaysayan ng Republika · Chapter 14</p>
      <h3>{h.era}</h3>
      {h.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
    </article>
  );
}

export function RecordView() {
  const s = useGameStore() as unknown as CampaignState;
  const list = earned(s);
  const count = list.filter((a) => a.month !== undefined).length;
  return (
    <div className="stack">
      <header className="congress-banner record-banner">
        <div className="congress-banner__mace" aria-hidden>🏅</div>
        <div>
          <p className="kicker kicker--gold">Presidential Library</p>
          <h2>Mga Nakamit at Kasaysayan</h2>
          <p className="muted">{count} of {list.length} achievements earned. The history book below rewrites itself as your presidency unfolds.</p>
        </div>
      </header>
      <section className="card">
        <h3 className="section-title">Achievements</h3>
        <div className="badges">
          {list.map((a) => (
            <div key={a.id} className={`badge-card ${a.month !== undefined ? 'is-earned' : ''}`}>
              <span className="badge-card__icon">{a.icon}</span>
              <b>{a.title}</b>
              <small>{a.text}</small>
              <em>{a.month !== undefined ? `Earned ${monthLabel(a.month)}` : 'Locked'}</em>
            </div>
          ))}
        </div>
      </section>
      <HistoryBook s={s} />
    </div>
  );
}
