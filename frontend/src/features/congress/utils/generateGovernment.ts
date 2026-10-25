import {
  DEFECTION_RATE,
  DISTRICT_RESULTS,
  HOUSE_DISTRICT_SEATS,
  HOUSE_PARTY_LIST_SEATS,
  KEY_REPRESENTATIVES,
  NATURAL_ALLIES,
  PARTY_LIST_GROUPS,
  SENATORS,
  type Senator,
} from '@/data/government/congress';
import { getParty } from '@/data/world/parties';
import { seededRandom } from '@/features/game-engine/utils/random';
import type { GovernmentState, HouseBloc, HouseLeader, HouseState, SenatorState, Stance } from '@/features/game-engine/types/government';

const INDEPENDENT_JOIN_RATE = 0.6;

/**
 * When a new President takes office, natural allies have not yet signed a coalition deal:
 * they sit as uncommitted ('neutral') until the story’s coalition negotiations resolve.
 */
let pendingAllies = false;

export function partyStance(partyId: string | null, presidentPartyId: string): Stance {
  if (!partyId) return 'neutral';
  if (partyId === presidentPartyId) return 'ally';
  if (NATURAL_ALLIES[presidentPartyId]?.includes(partyId)) return pendingAllies ? 'neutral' : 'ally';
  return 'opposition';
}

/**
 * Builds the House after the 2027 election. As in real Philippine politics, district representatives
 * flock to the new president’s party, and most party-list groups join the administration — so the
 * president starts with a working majority, though never a unanimous one.
 */
/** Randomizes 2027 district results (±25%) while keeping 253 district seats. */
function randomizedResults(seed?: string): Record<string, number> {
  if (!seed) return { ...DISTRICT_RESULTS };
  const rand = seededRandom(`house:${seed}`);
  const raw = Object.fromEntries(Object.entries(DISTRICT_RESULTS).map(([k, v]) => [k, v * (0.75 + rand() * 0.5)]));
  const total = Object.values(raw).reduce((a, b) => a + b, 0);
  const out: Record<string, number> = {};
  let assigned = 0;
  for (const k of Object.keys(raw)) {
    out[k] = Math.max(2, Math.round((raw[k] / total) * HOUSE_DISTRICT_SEATS));
    assigned += out[k];
  }
  out.pbl += HOUSE_DISTRICT_SEATS - assigned;
  return out;
}

export function generateHouse(presidentPartyId: string, seed?: string): HouseState {
  const seats: Record<string, number> = randomizedResults(seed);

  for (const partyId of Object.keys(seats)) {
    if (partyId === 'independent' || partyStance(partyId, presidentPartyId) !== 'opposition') continue;
    const defectors = Math.round(seats[partyId] * (DEFECTION_RATE[partyId] ?? 0));
    seats[partyId] -= defectors;
    seats[presidentPartyId] += defectors;
  }
  const joiningIndependents = Math.round(seats.independent * INDEPENDENT_JOIN_RATE);
  seats.independent -= joiningIndependents;
  seats[presidentPartyId] += joiningIndependents;

  const partyBlocs: HouseBloc[] = Object.entries(seats)
    .filter(([, n]) => n > 0)
    .map(([partyId, n]) =>
      partyId === 'independent'
        ? { label: 'Independents', kind: 'independent', partyId: null, seats: n, stance: 'neutral' }
        : { label: getParty(partyId)?.abbreviation ?? partyId, kind: 'party', partyId, seats: n, stance: partyStance(partyId, presidentPartyId) },
    );

  const partyListBlocs: HouseBloc[] = PARTY_LIST_GROUPS.map((g) => ({
    label: g.name,
    kind: 'party-list',
    partyId: null,
    seats: g.seats,
    stance: g.lean === 'administration' ? (pendingAllies ? 'neutral' : 'ally') : g.lean === 'left' ? (presidentPartyId === 'kmb' ? 'ally' : 'opposition') : 'neutral',
  }));

  const order: Record<Stance, number> = { ally: 0, neutral: 1, opposition: 2 };
  const blocs = [...partyBlocs, ...partyListBlocs].sort((a, b) => order[a.stance] - order[b.stance] || b.seats - a.seats);

  return {
    totalSeats: HOUSE_DISTRICT_SEATS + HOUSE_PARTY_LIST_SEATS,
    districtSeats: HOUSE_DISTRICT_SEATS,
    partyListSeats: HOUSE_PARTY_LIST_SEATS,
    blocs,
    leaders: assignHouseLeaders(presidentPartyId, partyBlocs),
  };
}

function assignHouseLeaders(presidentPartyId: string, partyBlocs: HouseBloc[]): HouseLeader[] {
  const reps = (partyId: string) => KEY_REPRESENTATIVES.filter((r) => r.partyId === partyId);
  const allies = NATURAL_ALLIES[presidentPartyId] ?? [];
  const opposition = partyBlocs
    .filter((b) => b.stance === 'opposition' && b.partyId)
    .sort((a, b) => b.seats - a.seats)
    .map((b) => b.partyId as string);

  const own = reps(presidentPartyId);
  const allyA = reps(allies[0] ?? '');
  const allyB = reps(allies[1] ?? '');
  const oppA = reps(opposition[0] ?? '');
  const oppB = reps(opposition[1] ?? '');

  const slots: [string, (typeof own)[number] | undefined][] = [
    ['Speaker of the House', own[0]],
    ['Senior Deputy Speaker', own[1]],
    ['Majority Floor Leader', allyA[0]],
    ['Chair, Committee on Appropriations', own[2] ?? allyA[1]],
    ['Chair, Committee on Ways & Means', allyB[0]],
    ['Chair, Committee on Justice (impeachment)', allyB[1] ?? allyA[1]],
    ['Minority Floor Leader', oppA[0]],
    ['Deputy Minority Leader', oppB[0] ?? oppA[1]],
  ];

  return slots
    .filter((s): s is [string, NonNullable<(typeof s)[1]>] => !!s[1])
    .map(([role, r]) => ({ role, name: r.name, district: r.district, partyId: r.partyId, stance: partyStance(r.partyId, presidentPartyId) }));
}

export function senatorStance(s: Senator, presidentPartyId: string): Stance {
  if (s.temperament === 'maverick' || !s.partyId) return 'neutral';
  if (s.partyId === presidentPartyId) return 'ally';
  if (s.temperament === 'independent') return 'neutral';
  return partyStance(s.partyId, presidentPartyId);
}

export function generateSenate(presidentPartyId: string, seed?: string): SenatorState[] {
  const rand = seed ? seededRandom(`senate:${seed}`) : null;
  // A few senators break from their party’s line each term.
  const drift = (st: Stance): Stance => {
    if (!rand) return st;
    const r = rand();
    if (r < 0.12) return st === 'ally' ? 'neutral' : st === 'neutral' ? 'opposition' : 'neutral';
    if (r < 0.22) return st === 'opposition' ? 'neutral' : st === 'neutral' ? 'ally' : st;
    return st;
  };
  const states = SENATORS.map((s) => ({ id: s.id, stance: drift(senatorStance(s, presidentPartyId)), isSenatePresident: false }));
  // The Senate elects its own President; the administration bloc usually wins it with its most influential member.
  const president = SENATORS.filter((s) => states.find((x) => x.id === s.id)?.stance === 'ally').sort((a, b) => b.influence - a.influence)[0];
  return states.map((s) => ({ ...s, isSenatePresident: s.id === president?.id }));
}

export function generateGovernment(presidentPartyId: string, opts: { pendingCoalition?: boolean; seed?: string } = {}): GovernmentState {
  pendingAllies = !!opts.pendingCoalition;
  try {
    return { house: generateHouse(presidentPartyId, opts.seed), senators: generateSenate(presidentPartyId, opts.seed) };
  } finally {
    pendingAllies = false;
  }
}

export function countStances(items: { stance: Stance; weight?: number }[]): Record<Stance, number> {
  const out: Record<Stance, number> = { ally: 0, neutral: 0, opposition: 0 };
  for (const i of items) out[i.stance] += i.weight ?? 1;
  return out;
}
