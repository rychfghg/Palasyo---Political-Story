import { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useGameStore, fullName } from '@/features/game-engine/store/gameStore';
import { useUiStore } from '@/app/store/uiStore';
import { getParty } from '@/data/world/parties';
import { TIMELINE } from '@/shared/constants/world';
import { computeElection, type Candidate } from '../utils/election';

const COUNT_DURATION_MS = 5000;

function Tally({ rows, progress }: { rows: Candidate[]; progress: number }) {
  const max = rows[0].votes;
  return (
    <ul className="tally">
      {rows.map((c) => {
        const party = getParty(c.partyId);
        return (
          <li key={c.name} className={c.isPlayer ? 'is-player' : ''}>
            <div className="tally__name">
              <span className="badge" style={{ background: party?.color }}>{party?.abbreviation}</span>
              {c.name}
            </div>
            <div className="tally__bar">
              <i style={{ width: `${(c.votes / max) * 100 * progress}%`, background: party?.color }} />
            </div>
            <div className="tally__votes">
              {Math.round(c.votes * progress).toLocaleString()}
              <small>{(c.percent * progress).toFixed(1)}%</small>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function ElectionScreen() {
  const navigate = useNavigate();
  const { player, partyId, traits, tags, setPhase, setFlag, initPresidency } = useGameStore();
  const setMap = useUiStore((s) => s.setMap);
  const [progress, setProgress] = useState(0);

  const result = useMemo(
    () => (player && partyId ? computeElection(fullName(player), partyId, traits, tags) : null),
    [player, partyId, traits, tags],
  );

  useEffect(() => setMap('all'), [setMap]);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / COUNT_DURATION_MS);
      setProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!player || !result) return <Navigate to="/" replace />;

  const done = progress >= 1;
  const winner = result.president[0];
  const margin = winner.votes - result.president[1].votes;
  const vp = result.vicePresident[0];

  const proceed = () => {
    setFlag('vp_is_ally', result.vpIsAlly);
    setFlag('vp_name', vp.name.replace(' (your running mate)', '').replace(/^(Sen\.|Gov\.|Rep\.)\s*/, ''));
    setFlag('election_percent', winner.percent);
    const runnerUp = result.president[1];
    setFlag('rival_name', runnerUp.name.replace(/^(VP|Sen\.|Gov\.|Rep\.|Mayor)\s*/, ''));
    setFlag('rival_party', runnerUp.partyId);
    // The weeks between proclamation and inauguration are played on the President’s desk.
    setPhase('presidency');
    initPresidency();
    navigate('/office');
  };

  return (
    <section className="center-stage">
      <article className="paper election">
        <p className="kicker">Halalan 2027 · {TIMELINE.electionDate}</p>
        <h2 className="paper__title">{done ? 'Official Canvass' : 'Partial, Unofficial Results'}</h2>
        <p className="paper__subtitle">Voter turnout {result.turnout}% · {Math.round(progress * 100)}% of precincts reporting</p>

        <h3 className="section-title">President</h3>
        <Tally rows={result.president} progress={progress} />

        <h3 className="section-title">Vice President</h3>
        <Tally rows={result.vicePresident} progress={progress} />

        {done && (
          <div className="election__verdict">
            <p className="headline">
              {player.lastName.toUpperCase()} WINS PRESIDENCY
            </p>
            <p>
              Congress, sitting as the national board of canvassers, proclaims {fullName(player)} President-elect of the Republic by a margin of{' '}
              {margin.toLocaleString()} votes.
            </p>
            <p>
              {result.vpIsAlly
                ? `Your running mate, ${vp.name.replace(' (your running mate)', '')}, wins the vice presidency. For now, the executive speaks with one voice.`
                : `But the vice presidency goes to ${vp.name} — an ally of your rivals. The person first in line to replace you does not want you to succeed.`}
            </p>
            <div className="row row--end">
              <button className="btn btn--primary" onClick={proceed}>Begin the transition →</button>
            </div>
          </div>
        )}
      </article>
    </section>
  );
}
