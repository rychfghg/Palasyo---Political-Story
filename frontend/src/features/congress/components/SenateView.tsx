import { useState } from 'react';
import { useGameStore } from '@/features/game-engine/store/gameStore';
import { SENATORS } from '@/data/government/congress';
import { getParty } from '@/data/world/parties';
import { StanceBadge, STANCE_COLOR } from '@/shared/components/ui/StanceBadge';
import type { Stance } from '@/features/game-engine/types/government';
import { Portrait } from '@/shared/components/ui/Portrait';

// Seen from the rostrum: opposition on the left, the administration on the right.
const STANCES: Stance[] = ['opposition', 'neutral', 'ally'];
const BLOC: Record<Stance, string> = { ally: 'Administration bloc', neutral: 'Independents & swing votes', opposition: 'Opposition' };
const TEMPERAMENT_LABEL = { loyal: 'Party loyalist', independent: 'Independent-minded', maverick: 'Maverick' } as const;

export function SenateView() {
  const states = useGameStore((s) => s.government?.senators);
  const [picked, setPicked] = useState<string | null>(null);
  if (!states) return null;

  const rows = SENATORS.map((s) => ({ ...s, state: states.find((x) => x.id === s.id)! })).filter((r) => r.state);
  const count = (st: Stance) => rows.filter((r) => r.state.stance === st).length;
  const sp = rows.find((r) => r.state.isSenatePresident);
  const allies = count('ally');
  const detail = rows.find((r) => r.id === (picked ?? sp?.id)) ?? rows[0];
  const party = (id: string | null) => getParty(id);

  return (
    <div className="stack congress senate">
      <header className="congress-banner">
        <div className="congress-banner__mace" aria-hidden>⚖</div>
        <div>
          <p className="kicker kicker--gold">Senado ng Kapuluan · Maynilad</p>
          <h2>Senado</h2>
          <p className="muted">24 senators elected nationwide. They answer to the whole country, so party discipline is weak. The Senate tries impeachments and ratifies treaties.</p>
        </div>
      </header>

      <section className="congress-strip">
        <div><small>Senators</small><b>{rows.length}</b><em>{rows.length < 24 ? `${24 - rows.length} seat(s) vacant` : 'full chamber'}</em></div>
        <div><small>To pass a bill</small><b>13</b><em>a simple majority</em></div>
        <div className={allies >= 13 ? 'is-good' : 'is-bad'}><small>Your bloc</small><b>{allies}</b><em>{allies >= 13 ? `${allies - 12} to spare` : `${13 - allies} short`}</em></div>
        <div className={count('opposition') >= 9 ? 'is-good' : ''}><small>To convict / ratify</small><b>16</b><em>{count('opposition') >= 9 ? `opposition can block (${count('opposition')})` : `opposition has ${count('opposition')}`}</em></div>
        <div><small>Senate President</small><b className="congress-strip__name">{sp ? `Sen. ${sp.name}` : '—'}</b><em>{sp ? party(sp.partyId)?.abbreviation ?? 'Independent' : ''}</em></div>
      </section>

      <section className="session-hall senate-hall">
        <div className="senate-floor">
          {STANCES.map((st) => (
            <div key={st} className={`senate-bloc senate-bloc--${st}`}>
              <h4 style={{ color: STANCE_COLOR[st] }}>{BLOC[st]} · {count(st)}</h4>
              <div className="senate-seats">
                {rows
                  .filter((r) => r.state.stance === st)
                  .sort((a, b) => b.influence - a.influence)
                  .map((r) => (
                    <button key={r.id} className={`senate-seat ${detail?.id === r.id ? 'is-picked' : ''}`} style={{ borderColor: STANCE_COLOR[st] }} onClick={() => setPicked(r.id)} title={`Sen. ${r.name}`}>
                      <Portrait name={r.name} size={52} />
                      <b>{r.name.replace(/“[^”]*”\s*/, '')}</b>
                      <span className="badge" style={{ background: party(r.partyId)?.color ?? '#6b6b6b' }}>{party(r.partyId)?.abbreviation ?? 'IND'}</span>
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
        {sp && (
          <div className="rostrum">
            <div className="rostrum__seal" aria-hidden>⚜</div>
            <span className="rostrum__role">Senate President</span>
            <b>Sen. {sp.name}</b>
            <small>{party(sp.partyId)?.name ?? 'Independent'}</small>
          </div>
        )}
      </section>

      {detail && (
        <section className="card justice-detail">
          <Portrait name={detail.name} size={96} />
          <div>
            <span className="kicker">{detail.state.isSenatePresident ? 'Senate President' : 'Senator'} · term ends {detail.termEnds}</span>
            <h3>Sen. {detail.name}</h3>
            <p>{detail.bio}</p>
            <dl className="facts">
              <div><dt>Party</dt><dd>{party(detail.partyId)?.name ?? 'Independent'}</dd></div>
              <div><dt>Stance</dt><dd><StanceBadge stance={detail.state.stance} /></dd></div>
              <div><dt>Focus</dt><dd>{detail.focus}</dd></div>
              <div><dt>Influence</dt><dd>{'★'.repeat(detail.influence)}{'☆'.repeat(5 - detail.influence)}</dd></div>
              <div><dt>Style</dt><dd>{TEMPERAMENT_LABEL[detail.temperament]}</dd></div>
            </dl>
          </div>
        </section>
      )}
    </div>
  );
}
