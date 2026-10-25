import type { Effects, StatKey } from '@/features/narrative/types/event';

const STAT: Record<StatKey, string> = {
  capital: 'political capital', cohesion: 'your coalition', cabinetCohesion: 'Cabinet unity', media: 'the press', protest: 'the streets',
  corruption: 'corruption', crime: 'crime',
  approval: 'approval', inflation: 'prices', unemployment: 'jobs', poverty: 'poverty', growth: 'growth',
  church: 'the Church', tribes: 'indigenous peoples', military: 'the military', family: 'family',
  courtTension: 'the Court', ombudsman: 'graft probes', sovereignty: 'West Sea tension', investor: 'investors',
};

/** A short, spoiler-free list of what a choice touches ("affects: prices, approval"), without amounts. */
export function affectsOf(e: Effects): string[] {
  const out = new Set<string>();
  for (const k of Object.keys(e.stats ?? {}) as StatKey[]) out.add(STAT[k] ?? k);
  if (e.spend || e.program || e.project) out.add('the Treasury');
  if (e.income) out.add('revenue');
  if (e.taxRate) out.add('taxes');
  if (e.debt) out.add('the debt');
  if (e.asset || e.assetHit) out.add('investments');
  if (e.relations) out.add('foreign relations');
  if (e.need) out.add('public services');
  if (e.provGovernor) out.add('governors');
  if (e.senateShift || e.senators || e.removeSenator) out.add('the Senate');
  if (e.houseShift || e.coalition) out.add('the House');
  if (e.vote) out.add('a vote in Congress');
  if (e.law) out.add('the law');
  if (e.fireCabinet || e.betrayal || e.spy) out.add('your Cabinet');
  if (e.bank || e.governor) out.add('the central bank');
  if (e.goccCreate || e.goccAudit || e.goccReplace || e.goccBoard) out.add('state corporations');
  if (e.appointJustice) out.add('the Supreme Court');
  if (e.schedule?.length) out.add('what comes later');
  return [...out].slice(0, 6);
}
