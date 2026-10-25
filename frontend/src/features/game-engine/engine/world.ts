import { PROVINCES } from '@/data/world/provinces';
import { randomName } from '@/data/government/generated';
import type { DraftSpec, Effects } from '@/features/narrative/types/event';
import type { Stance } from '../types/government';
import type { CampaignState } from '../types/campaign';
import { seededRandom } from '../utils/random';
import { pollResults } from './society';

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const seed = (s: CampaignState, extra: string) => `${s.player?.firstName}${s.player?.lastName}:${extra}`;

// ───────────────────────── Vote estimates (for the drafting table) ─────────────────────────

/** Expected yes votes in each chamber for a bill with this appeal — what the whips would tell you. */
export function estimateVote(s: CampaignState, appeal: number, senateAppeal = appeal) {
  const gov = s.government!;
  const cohesion = s.politics.cohesion / 100;
  const capital = (s.politics.capital - 50) / 250;
  const prob = (stance: Stance, a: number) =>
    stance === 'ally' ? clamp(0.55 + 0.4 * cohesion + 0.07 * a + capital, 0.05, 0.98) : stance === 'neutral' ? clamp(0.45 + 0.13 * a + capital, 0.03, 0.95) : clamp(0.1 + 0.08 * a, 0.01, 0.6);
  const house = Math.round(gov.house.blocs.reduce((n, b) => n + b.seats * prob(b.stance, appeal), 0));
  const senate = Math.round(gov.senators.reduce((n, x) => n + prob(x.stance, senateAppeal), 0));
  return { house, houseNeed: Math.floor(gov.house.totalSeats / 2) + 1, houseTotal: gov.house.totalSeats, senate, senateNeed: 13, senateTotal: gov.senators.length };
}

/** Turn the drafting table's picks into the bill's vote. */
export function draftEffects(spec: DraftSpec, picks: number[]): Effects {
  // Bills drafted by the President are certified as urgent, which helps in both chambers.
  let appeal = spec.appeal + 1;
  let senateAppeal = (spec.senateAppeal ?? spec.appeal) + 1;
  const merged: Effects = { stats: {} };
  const stats = merged.stats as Record<string, number>;
  let taxRate = 0;
  spec.knobs.forEach((k, i) => {
    const o = k.options[picks[i] ?? 0];
    appeal += o.appeal;
    senateAppeal += o.senateAppeal ?? o.appeal;
    for (const [key, v] of Object.entries(o.effects.stats ?? {})) stats[key] = (stats[key] ?? 0) + (v ?? 0);
    taxRate += o.effects.taxRate ?? 0;
  });
  const onPass: Effects = { ...merged, ...(taxRate ? { taxRate } : {}), law: { id: spec.lawId, name: spec.bill, summary: spec.summary } };
  return { stats: { capital: -4 }, vote: { bill: spec.bill, appeal, senateAppeal, onPass } };
}

export function draftAppeal(spec: DraftSpec, picks: number[]) {
  // Bills drafted by the President are certified as urgent, which helps in both chambers.
  let appeal = spec.appeal + 1;
  let senateAppeal = (spec.senateAppeal ?? spec.appeal) + 1;
  spec.knobs.forEach((k, i) => {
    const o = k.options[picks[i] ?? 0];
    appeal += o.appeal;
    senateAppeal += o.senateAppeal ?? o.appeal;
  });
  return { appeal, senateAppeal };
}

// ───────────────────────── Foreign relations ─────────────────────────

export const COUNTRIES = [
  { id: 'haizhou', name: 'Haizhou', note: 'The northern superpower. Loans, trade — and ships near your reefs.' },
  { id: 'columbia', name: 'Columbia', note: 'The old ally across the ocean. Military aid and markets.' },
  { id: 'nippara', name: 'Nippara', note: 'The biggest aid donor. Railways, scholarships, patience.' },
  { id: 'qadir', name: 'Qadir', note: 'The Gulf emirate where a million Kapuluan workers live.' },
  { id: 'bloc', name: 'Regional bloc', note: 'Your neighbors. Trade deals and a shared stand on the West Sea.' },
] as const;

export function relations(s: CampaignState): Record<string, number> {
  return s.relations ?? { haizhou: 45, columbia: 60, nippara: 65, qadir: 55, bloc: 55 };
}

export function shiftRelations(s: CampaignState, changes: Record<string, number>) {
  const cur = { ...relations(s) };
  for (const [k, v] of Object.entries(changes)) cur[k] = clamp((cur[k] ?? 50) + v, 0, 100);
  s.relations = cur;
}

// ───────────────────────── Governors and local elections ─────────────────────────

const PROVINCE_REGION: Record<string, string> = {
  maynilad: 'luzara', sanfernando: 'luzara', kapatagan: 'luzara', legazpira: 'luzara',
  sugbu: 'visara', iloilanan: 'visara', tacloban: 'visara', palawira: 'visara',
  cagayan: 'mindara', marawira: 'mindara',
};

export function initGovernors(s: CampaignState): NonNullable<CampaignState['governors']> {
  const r = seededRandom(seed(s, 'governors'));
  return PROVINCES.map((p) => ({ province: p.id, name: `Gov. ${randomName(seed(s, `gov:${p.id}`))}`, stance: (r() < 0.4 ? 'ally' : r() < 0.6 ? 'neutral' : 'opposition') as Stance, since: 2025 }));
}

export function governors(s: CampaignState) {
  return s.governors ?? initGovernors(s);
}

/** Opposition governors slow down your projects in their provinces; allies speed them along. */
export function governorFactor(s: CampaignState, province: string) {
  const g = s.governors?.find((x) => x.province === province);
  return !g ? 1 : g.stance === 'opposition' ? 0.85 : g.stance === 'ally' ? 1.05 : 1;
}

export function shiftGovernor(s: CampaignState, province: string, to: Stance) {
  s.governors = governors(s).map((g) => (province === 'all' || g.province === province ? { ...g, stance: to } : g));
}

/** Local elections in May 2030 and May 2033: each province votes on how it feels about you. */
export function localElections(s: CampaignState, notes: string[]) {
  const r = seededRandom(seed(s, `local:${s.month}`));
  const polls = pollResults(s);
  const year = s.month >= 60 ? 2033 : 2030;
  let won = 0;
  s.governors = governors(s).map((g) => {
    const region = PROVINCE_REGION[g.province] ?? 'luzara';
    const support = polls.find((p) => p.id === region)?.value ?? 50;
    const incumbentStays = r() < 0.55;
    const pAlly = clamp(0.15 + support / 110, 0.1, 0.85);
    const stance: Stance = r() < pAlly ? 'ally' : r() < 0.4 ? 'neutral' : 'opposition';
    if (stance === 'ally') won++;
    return incumbentStays && stance === g.stance ? g : { ...g, name: incumbentStays ? g.name : `Gov. ${randomName(seed(s, `gov:${g.province}:${year}`))}`, stance, since: year };
  });
  s.flags = { ...s.flags, [`local_${year}`]: won };
  notes.push(`Local elections ${year}: your allies now hold ${won} of ${s.governors.length} governorships.`);
}

export { PROVINCE_REGION };

// ───────────────────────── What the country lacks ─────────────────────────

export const NEEDS = [
  { id: 'roads', label: 'Roads & bridges', icon: '🛣️', start: 55, note: 'Farm-to-market roads, bridges, and highways.' },
  { id: 'hospitals', label: 'Hospitals & clinics', icon: '🏥', start: 45, note: 'Beds, doctors, and rural health centers.' },
  { id: 'schools', label: 'Classrooms & schools', icon: '🏫', start: 48, note: 'A shortage of 160,000 classrooms.' },
  { id: 'power', label: 'Electricity', icon: '⚡', start: 58, note: 'Brownouts every summer in the south.' },
  { id: 'water', label: 'Clean water', icon: '🚰', start: 52, note: 'Rationing in the cities, wells in the provinces.' },
  { id: 'internet', label: 'Internet', icon: '📶', start: 40, note: 'The slowest and priciest in the region.' },
  { id: 'housing', label: 'Housing', icon: '🏘️', start: 35, note: 'Six million families without a decent home.' },
] as const;

export function needs(s: CampaignState): Record<string, number> {
  return s.needs ?? Object.fromEntries(NEEDS.map((n) => [n.id, n.start]));
}

export function shiftNeeds(s: CampaignState, changes: Record<string, number>) {
  const cur = { ...needs(s) };
  for (const [k, v] of Object.entries(changes)) cur[k] = clamp((cur[k] ?? 50) + v, 0, 100);
  s.needs = cur;
}

/** A growing population wears down what exists; shortages show up as flags the story can react to. */
export function needsTick(s: CampaignState) {
  const cur = { ...needs(s) };
  for (const k of Object.keys(cur)) cur[k] = clamp(cur[k] - 0.12, 0, 100);
  s.needs = cur;
  const flags: Record<string, boolean> = {};
  for (const n of NEEDS) flags[`need_low_${n.id}`] = cur[n.id] < 40;
  s.flags = { ...s.flags, ...flags };
}

/** Average coverage nudges approval: people notice the roads, schools, and hospitals they lack. */
export function needsApproval(s: CampaignState) {
  const v = Object.values(needs(s));
  return ((v.reduce((n, x) => n + x, 0) / v.length) - 50) * 0.12;
}

// ───────────────────────── The economic-crisis clock ─────────────────────────

/** Counts months of runaway prices or debt. Long enough, and the streets fill. */
export function crisisClock(s: CampaignState, notes: string[]) {
  const e = s.economy!;
  const ratio = (e.debt / e.gdp) * 100;
  const bad = e.inflation > 6 || ratio > 72 || (e.inflation > 5 && e.unemployment > 7);
  const months = bad ? Number(s.flags.crisis_months ?? 0) + 1 : Math.max(0, Number(s.flags.crisis_months ?? 0) - 2);
  s.flags = { ...s.flags, crisis_months: months, econ_crisis_6: months >= 6, econ_crisis_12: months >= 12 };
  // The revolt arrives on the crisis clock, not on a calendar: rallies at six months, the gates at twelve.
  const n = s.month >= 36 ? 2 : 1;
  const stage = Number(s.flags[`revolt_stage_${n}`] ?? 0);
  const queueOnce = (event: string, next: number) => {
    if (event in s.resolved || s.scheduled.some((x) => x.event === event)) return;
    s.scheduled = [...s.scheduled, { event, month: s.month + 1 }];
    s.flags = { ...s.flags, [`revolt_stage_${n}`]: next };
  };
  if (months >= 6 && stage < 1) queueOnce(`rv_rallies_${n}`, 1);
  if (months >= 12 && stage < 2) queueOnce(`rv_storm_${n}`, 2);
  if (bad && months === 3) notes.push('Third straight month of runaway prices or debt. Unions and students are planning rallies.');
  if (bad && months === 9) notes.push('Nine months of economic crisis. Crowds chant for your resignation outside the Palasyo every night.');
}
