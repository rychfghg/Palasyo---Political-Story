import type { Effects, EventCategory, Reaction, StoryEvent } from '@/features/narrative/types/event';

interface BillSpec {
  id: string;
  month: number;
  title: string;
  /** Official name of the measure; becomes the law’s name if it passes. */
  bill: string;
  summary: string;
  body: string[];
  /** −3 (toxic in Congress) … +3 (irresistible). */
  appeal: number;
  senateAppeal?: number;
  onPass: Effects;
  onFail?: Effects;
  /** Optional watered-down version that passes more easily but does less. */
  amended?: { label: string; description: string; appealBonus: number; onPass: Effects };
  oppose: { label: string; description: string; outcome: string; headline?: string; effects: Effects };
  passHeadline?: string;
  reactions?: Reaction[];
  category?: EventCategory;
  when?: StoryEvent['when'];
}

/**
 * Builds a standard legislative fight: push it (spend capital), let Congress decide,
 * optionally water it down, or oppose it. The House and Senate vote for real.
 */
export function billEvent(b: BillSpec): StoryEvent {
  const law = { id: b.id, name: b.bill, summary: b.summary };
  const withLaw = (fx: Effects): Effects => ({ ...fx, law });
  const choices: StoryEvent['choices'] = [
    {
      id: `${b.id}_push`,
      label: 'Certify it as urgent and push hard',
      description: 'Spend political capital. Your allies whip every vote.',
      outcome: 'Your legislative team works every hallway of the Batasan and the Senate. The roll is called.',
      headline: b.passHeadline,
      reactions: b.reactions,
      effects: {
        stats: { capital: -7 },
        vote: { bill: b.bill, appeal: b.appeal + 1, senateAppeal: b.senateAppeal !== undefined ? b.senateAppeal + 1 : undefined, onPass: withLaw(b.onPass), onFail: b.onFail },
      },
    },
    {
      id: `${b.id}_free`,
      label: 'Let Congress decide on its own',
      description: 'No arm-twisting. A conscience vote.',
      outcome: 'Without Palasyo pressure, legislators vote their interests — and their donors’.',
      effects: { vote: { bill: b.bill, appeal: b.appeal - 1, senateAppeal: b.senateAppeal !== undefined ? b.senateAppeal - 1 : undefined, onPass: withLaw(b.onPass), onFail: b.onFail } },
    },
  ];
  if (b.amended) {
    choices.push({
      id: `${b.id}_amend`,
      label: b.amended.label,
      description: b.amended.description,
      outcome: 'The amended version is easier to swallow — and does less.',
      effects: {
        stats: { capital: -3 },
        vote: { bill: `${b.bill} (amended)`, appeal: b.appeal + b.amended.appealBonus, onPass: { ...b.amended.onPass, law: { ...law, name: `${b.bill} (amended)` } } },
      },
    });
  }
  choices.push({ id: `${b.id}_oppose`, label: b.oppose.label, description: b.oppose.description, outcome: b.oppose.outcome, headline: b.oppose.headline, effects: b.oppose.effects });

  return { id: b.id, month: b.month, priority: 3, category: b.category ?? 'congress', title: b.title, location: 'Congress', body: b.body, when: b.when, choices };
}

/** [label, description, outcome, effects, headline?] */
export type QuickChoice = [string, string, string, import('@/features/narrative/types/event').Effects, string?];

/**
 * A compact event. Give `at` as a month, a [from, to] window (shuffled per save), or null for a follow-up
 * that only appears when an earlier choice schedules it.
 */
export function quick(
  id: string,
  at: number | [number, number] | null,
  category: EventCategory,
  title: string,
  location: string,
  body: string | string[],
  choices: QuickChoice[],
  extra: Partial<StoryEvent> = {},
): StoryEvent {
  return {
    id,
    ...(typeof at === 'number' ? { month: at } : Array.isArray(at) ? { window: at } : {}),
    priority: extra.priority ?? (at === null ? 6 : 4),
    category,
    title,
    location,
    body: Array.isArray(body) ? body : [body],
    choices: choices.map(([label, description, outcome, effects, headline], i) => ({ id: `${id}_${i}`, label, description, outcome, effects, headline })),
    ...extra,
  };
}

/** Schedules a follow-up event a few months later. */
export const then = (event: string, inMonths = 2) => ({ schedule: [{ event, inMonths }] });
