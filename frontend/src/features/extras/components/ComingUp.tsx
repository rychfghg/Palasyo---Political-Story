import { useGameStore } from '@/features/game-engine/store/gameStore';
import { monthLabel } from '@/features/game-engine/engine/calendar';
import type { CampaignState } from '@/features/game-engine/types/campaign';

const ELECTIONS = [
  { month: 34, label: 'Midterm elections' },
  { month: 70, label: 'Presidential election' },
];

/** What is already in motion: projects opening, promises falling due, elections, set-piece events. */
export function ComingUp() {
  const s = useGameStore() as unknown as CampaignState;
  const m = s.month;
  const items: { at: number; icon: string; text: string }[] = [];

  for (const a of s.assets ?? []) if (a.startedMonth > m) items.push({ at: a.startedMonth, icon: '🏗️', text: `${a.name} opens` });
  for (const p of s.promises ?? []) if (p.kept === undefined && p.due >= m) items.push({ at: p.due, icon: '🤝', text: 'A SONA promise falls due' });
  for (const e of ELECTIONS) if (e.month >= m) items.push({ at: e.month, icon: '🗳️', text: e.label });
  const sona = m < 12 ? 12 : Math.ceil(m / 12) * 12;
  items.push({ at: sona, icon: '🎙️', text: 'State of the Nation Address' });
  const press = m < 2 ? 2 : m + ((2 - (m % 3) + 3) % 3);
  items.push({ at: press, icon: '📸', text: 'Press conference' });
  const brewing = s.scheduled.filter((x) => x.month > m).length;

  const list = items.filter((i) => i.at - m <= 12).sort((a, b) => a.at - b.at).slice(0, 6);
  return (
    <section className="paper coming-up">
      <h3 className="section-title">Coming up</h3>
      <ul>
        {list.map((i, n) => (
          <li key={n}>
            <span aria-hidden>{i.icon}</span>
            <span>{i.text}</span>
            <small className="muted">{i.at === m ? 'this month' : i.at - m === 1 ? 'next month' : monthLabel(i.at)}</small>
          </li>
        ))}
      </ul>
      {brewing > 0 && <p className="muted">⏳ {brewing} consequence{brewing > 1 ? 's' : ''} of your decisions still brewing.</p>}
    </section>
  );
}
