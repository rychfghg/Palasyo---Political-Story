import { useMemo } from 'react';
import { CABINET_POSTS, ADVISER_POSTS } from '@/data/government/cabinet';
import { useGameStore } from '@/features/game-engine/store/gameStore';
import { fill, findNominee, tokens } from '@/features/game-engine/engine/engine';
import type { CampaignState } from '@/features/game-engine/types/campaign';
import type { Choice, StoryEvent } from '@/features/narrative/types/event';
import { seededRandom } from '@/features/game-engine/utils/random';
import { peso } from '@/features/economy/utils/finance';
import { Portrait } from '@/shared/components/ui/Portrait';

interface Advocate {
  key: string;
  name: string;
  role: string;
}

const LINES = ['I’ve looked at the numbers, {sirmaam}. We should', 'With respect — the right call is to', 'My department’s view is clear: we must', 'If you want my honest advice,', 'The people expect us to'];

/** Up to three seated secretaries, each arguing for one option. Same meeting, same people every time. */
function advocates(s: CampaignState, event: StoryEvent): Advocate[] {
  const r = seededRandom(`${s.player?.firstName}${s.player?.lastName}:scene:${event.id}`);
  const seated = CABINET_POSTS.filter((p) => !(ADVISER_POSTS as readonly string[]).includes(p.id))
    .map((p) => ({ p, seat: s.cabinet.find((c) => c.postId === p.id) }))
    .filter((x) => x.seat?.nomineeId && x.seat.nomineeId !== 'vice-president')
    .sort(() => r() - 0.5);
  return seated.slice(0, 3).map(({ p, seat }) => ({
    key: `cab:${p.id}:${seat!.nomineeId}`,
    name: findNominee(s, p.id, seat!.nomineeId)?.name ?? p.title,
    role: p.title.replace('Secretary of ', '').replace('Secretary', ''),
  }));
}

/** A Cabinet meeting as a scene: secretaries argue, and the President sides with one. */
export function CabinetScene({ event, choices }: { event: StoryEvent; choices: Choice[] }) {
  const s = useGameStore() as unknown as CampaignState;
  const sideWith = useGameStore((x) => x.sideWith);
  const t = tokens(s);
  const people = useMemo(() => advocates(s, event), [event.id, s.cabinet]); // eslint-disable-line react-hooks/exhaustive-deps
  if (people.length < 2) return null;
  const pitched = choices.slice(0, people.length);
  const rest = choices.slice(people.length);
  const r = seededRandom(`lines:${event.id}`);

  return (
    <div className="scene">
      <p className="scene__intro">Around the table, your secretaries make their case.</p>
      <div className="scene__table">
        {pitched.map((c, i) => {
          const a = people[i];
          const line = fill(LINES[Math.floor(r() * LINES.length)], t);
          return (
            <article key={c.id} className="scene__seat">
              <Portrait name={a.name} size={72} mood="neutral" />
              <b>{a.name}</b>
              <small>{a.role}</small>
              <q>{line} {fill(c.label, t).charAt(0).toLowerCase() + fill(c.label, t).slice(1)}.</q>
              <span className="scene__why">{fill(c.description, t)}{c.effects.spend ? ` · ${peso(c.effects.spend)}` : ''}</span>
              <button className="btn btn--primary btn--small" onClick={() => sideWith(event.id, c.id, a.key, people.filter((x) => x !== a).map((x) => x.key))}>
                Side with {a.name.split(' ').slice(-1)[0]}
              </button>
            </article>
          );
        })}
      </div>
      {rest.length > 0 && (
        <div className="scene__other">
          <span className="muted">Or decide something else (everyone at the table is passed over):</span>
          {rest.map((c) => (
            <button key={c.id} className="btn btn--ghost btn--small" onClick={() => sideWith(event.id, c.id, null, people.map((x) => x.key))}>{fill(c.label, t)}</button>
          ))}
        </div>
      )}
      <p className="muted scene__note">The secretary you back will trust you more. Those you pass over will remember.</p>
    </div>
  );
}
