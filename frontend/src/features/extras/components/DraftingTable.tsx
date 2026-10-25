import { useState } from 'react';
import { useGameStore } from '@/features/game-engine/store/gameStore';
import { draftAppeal, estimateVote } from '@/features/game-engine/engine/world';
import { fill, tokens } from '@/features/game-engine/engine/engine';
import type { CampaignState } from '@/features/game-engine/types/campaign';
import type { StoryEvent } from '@/features/narrative/types/event';

/** Write the bill line by line and watch the whip count move before it goes to the floor. */
export function DraftingTable({ event }: { event: StoryEvent }) {
  const s = useGameStore() as unknown as CampaignState;
  const { submitDraft, choose } = useGameStore();
  const spec = event.draft!;
  const [picks, setPicks] = useState<number[]>(spec.knobs.map((k) => Math.floor((k.options.length - 1) / 2)));
  const { appeal, senateAppeal } = draftAppeal(spec, picks);
  const est = estimateVote(s, appeal, senateAppeal);
  const houseOk = est.house >= est.houseNeed;
  const senateOk = est.senate >= est.senateNeed;
  const t = tokens(s);
  const shelve = event.choices.find((c) => c.id.endsWith('_shelve'));

  return (
    <div className="drafting">
      <h3 className="section-title">Drafting table · {spec.bill}</h3>
      {spec.knobs.map((k, ki) => (
        <div key={k.id} className="drafting__knob">
          <b>{k.label}</b>
          <div className="drafting__options">
            {k.options.map((o, oi) => (
              <button key={oi} className={`drafting__opt ${picks[ki] === oi ? 'is-picked' : ''}`} onClick={() => setPicks(picks.map((p, i) => (i === ki ? oi : p)))}>
                <span>{o.label}</span>
                <small>{o.note} · {o.appeal > 0 ? `+${o.appeal}` : o.appeal} votes appeal</small>
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className="whip">
        <span className="kicker">Whip count (expected)</span>
        <div className={`whip__row ${houseOk ? 'is-ok' : 'is-bad'}`}>
          <span>House</span>
          <div className="whip__bar"><i style={{ width: `${(est.house / est.houseTotal) * 100}%` }} /><em style={{ left: `${(est.houseNeed / est.houseTotal) * 100}%` }} /></div>
          <b>{est.house} / {est.houseNeed} needed</b>
        </div>
        <div className={`whip__row ${senateOk ? 'is-ok' : 'is-bad'}`}>
          <span>Senate</span>
          <div className="whip__bar"><i style={{ width: `${(est.senate / est.senateTotal) * 100}%` }} /><em style={{ left: `${(est.senateNeed / est.senateTotal) * 100}%` }} /></div>
          <b>{est.senate} / {est.senateNeed} needed</b>
        </div>
        <small className="muted">An estimate — the real roll call can surprise you. Sending the bill costs a little political capital.</small>
      </div>
      <div className="row row--end">
        {shelve && <button className="btn btn--ghost btn--light" onClick={() => choose(event.id, shelve.id)}>{fill(shelve.label, t)}</button>}
        <button className="btn btn--primary" onClick={() => submitDraft(event.id, picks)}>Send to Congress</button>
      </div>
    </div>
  );
}
