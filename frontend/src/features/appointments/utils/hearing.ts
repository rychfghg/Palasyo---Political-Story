import type { Nominee } from '@/data/government/cabinet';
import type { GovernmentState, Stance } from '@/features/game-engine/types/government';
import { countStances } from '@/features/congress/utils/generateGovernment';
import { seededRandom } from '@/features/game-engine/utils/random';

export const CA_SENATE_MEMBERS = 12;
export const CA_HOUSE_MEMBERS = 12;

/** Largest-remainder apportionment of `seats` across stance shares. */
function apportion(counts: Record<Stance, number>, seats: number): Stance[] {
  const total = counts.ally + counts.neutral + counts.opposition;
  const stances: Stance[] = ['ally', 'neutral', 'opposition'];
  const quotas = stances.map((s) => ({ s, q: (counts[s] / total) * seats }));
  const alloc = quotas.map(({ s, q }) => ({ s, n: Math.floor(q), r: q - Math.floor(q) }));
  let left = seats - alloc.reduce((n, a) => n + a.n, 0);
  for (const a of [...alloc].sort((x, y) => y.r - x.r)) {
    if (left-- <= 0) break;
    a.n += 1;
  }
  return alloc.flatMap((a) => Array<Stance>(a.n).fill(a.s));
}

/** The Commission on Appointments: 12 senators + 12 representatives, proportional to each chamber’s blocs. */
export function commissionComposition(gov: GovernmentState): Stance[] {
  const senate = countStances(gov.senators.filter((s) => !s.isSenatePresident));
  const house = countStances(gov.house.blocs.map((b) => ({ stance: b.stance, weight: b.seats })));
  return [...apportion(senate, CA_SENATE_MEMBERS), ...apportion(house, CA_HOUSE_MEMBERS)];
}

function yesProbability(stance: Stance, n: Nominee): number {
  const merit = 0.03 * (n.competence - 6) + 0.03 * (n.integrity - 6);
  if (stance === 'ally') return 0.82 + 0.05 * n.caAppeal + merit;
  if (stance === 'neutral') return 0.5 + 0.1 * n.caAppeal + merit * 1.5;
  return 0.15 + 0.07 * n.caAppeal + merit;
}

export interface HearingResult {
  confirmed: boolean;
  yes: number;
  no: number;
  tieBrokenByChair: boolean;
}

/**
 * Holds a confirmation hearing. Each CA member votes independently according to their bloc’s
 * relationship with the President and the nominee’s record. The chair (Senate President) votes only on a tie.
 */
export function holdHearing(nominee: Nominee, gov: GovernmentState, seed: string): HearingResult {
  const rand = seededRandom(`${seed}:${nominee.id}`);
  let yes = 0;
  for (const stance of commissionComposition(gov)) {
    const p = Math.max(0.03, Math.min(0.97, yesProbability(stance, nominee)));
    if (rand() < p) yes++;
  }
  const no = CA_SENATE_MEMBERS + CA_HOUSE_MEMBERS - yes;
  if (yes === no) return { confirmed: true, yes: yes + 1, no, tieBrokenByChair: true };
  return { confirmed: yes > no, yes, no, tieBrokenByChair: false };
}
