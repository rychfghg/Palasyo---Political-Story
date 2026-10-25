import { CABINET_POSTS, VP_NOMINEE_ID, resolveNominee, type Nominee } from '@/data/government/cabinet';
import { generateNominees, jbcShortlist } from '@/data/government/generated';
import { NATURAL_ALLIES, PARTY_LIST_GROUPS, SENATORS } from '@/data/government/congress';
import { BUDGET_LINES } from '@/data/government/economy';
import { SUPREME_COURT, retirementYear, type Philosophy } from '@/data/government/supremeCourt';
import { getParty } from '@/data/world/parties';
import { REGIONS } from '@/data/world/regions';
import { ALL_EVENTS, EVENTS_BY_ID } from '@/data/story';
import { applySpend, peso } from '@/features/economy/utils/finance';
import type { Choice, Condition, CourtCase, Effects, Politics, PoliticsKey, StatKey, StoryEvent } from '@/features/narrative/types/event';
import type { Stance } from '../types/government';
import type { Asset, CampaignState, YearBook, Delta, EventReport, MidtermResult, MonthReport, VoteReport } from '../types/campaign';
import { seededRandom } from '../utils/random';
import { CHAPTER_LAST_MONTH, fiscalYear, monthLabel } from './calendar';
import { messagesTick, promisesTick } from './extras';
import { achievementsTick } from './legacy';
import { crisisClock, governorFactor, localElections, needsApproval, needsTick, shiftGovernor, shiftNeeds, shiftRelations } from './world';
import { courtCompany } from './economyActions';
import { pollResults } from './society';
import { accuseSpy, afterDecision, betrayalTokens, electoralApproval, plantSpy, resolveBetrayal, societyTick, twistTokens } from './society';
import { applyInstitutionEffects, centralBankTick, goccTick, institutionTokens, monetaryEffect, takenNames } from './institutions';

export const INITIAL_POLITICS: Politics = {
  capital: 60,
  cohesion: 65,
  cabinetCohesion: 60,
  media: 35,
  protest: 25,
  corruption: 55,
  crime: 55,
  church: 55,
  tribes: 45,
  military: 60,
  family: 70,
  courtTension: 20,
  ombudsman: 15,
  sovereignty: 40,
  investor: 50,
};

export const POLITICS_LABELS: Record<PoliticsKey, { label: string; higherIsGood: boolean }> = {
  capital: { label: 'Political capital', higherIsGood: true },
  cohesion: { label: 'Coalition cohesion', higherIsGood: true },
  cabinetCohesion: { label: 'Cabinet unity', higherIsGood: true },
  media: { label: 'Media hostility', higherIsGood: false },
  protest: { label: 'Street protests', higherIsGood: false },
  corruption: { label: 'Corruption perception', higherIsGood: false },
  crime: { label: 'Crime', higherIsGood: false },
  church: { label: 'Church relations', higherIsGood: true },
  tribes: { label: 'Indigenous relations', higherIsGood: true },
  military: { label: 'Military confidence', higherIsGood: true },
  family: { label: 'Family harmony', higherIsGood: true },
  courtTension: { label: 'Tension with the Court', higherIsGood: false },
  ombudsman: { label: 'Ombudsman scrutiny', higherIsGood: false },
  sovereignty: { label: 'West Sea tension', higherIsGood: false },
  investor: { label: 'Investor confidence', higherIsGood: true },
};

const ECONOMY_LABELS: Record<Exclude<StatKey, PoliticsKey>, { label: string; higherIsGood: boolean; unit: string }> = {
  approval: { label: 'Approval', higherIsGood: true, unit: '%' },
  inflation: { label: 'Inflation', higherIsGood: false, unit: ' pts' },
  unemployment: { label: 'Unemployment', higherIsGood: false, unit: ' pts' },
  poverty: { label: 'Poverty', higherIsGood: false, unit: ' pts' },
  growth: { label: 'GDP growth', higherIsGood: true, unit: ' pts' },
};

const isPoliticsKey = (k: string): k is PoliticsKey => k in INITIAL_POLITICS;
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const seedOf = (s: CampaignState, extra: string) => `${s.player?.firstName}${s.player?.lastName}:${extra}`;

/** Finds a nominee for a post, including candidates generated after firings. */
export function findNominee(s: CampaignState, postId: string, nomineeId: string | null): Nominee | undefined {
  if (!nomineeId) return undefined;
  const post = CABINET_POSTS.find((p) => p.id === postId);
  const vpName = String(s.flags.vp_name ?? 'the Vice President');
  return (post && resolveNominee(post, nomineeId, vpName)) ?? s.extraNominees?.[postId]?.find((n) => n.id === nomineeId);
}

// ───────────────────────── Text tokens ─────────────────────────

export function tokens(s: CampaignState): Record<string, string> {
  const gov = s.government;
  // Titles like “Speaker” are written in the story text, so drop the “Rep.” prefix here.
  const leader = (role: string) => gov?.house.leaders.find((l) => l.role === role)?.name.replace(/^Rep\.\s*/, '') ?? 'the House leadership';
  const sp = SENATORS.find((x) => gov?.senators.find((g) => g.isSenatePresident)?.id === x.id);
  const vpName = String(s.flags.vp_name ?? 'the Vice President');
  const out: Record<string, string> = {
    name: s.player ? `${s.player.firstName} ${s.player.lastName}` : 'the President',
    lastName: s.player?.lastName ?? '',
    nickname: s.player?.nickname || s.player?.firstName || '',
    mrmadam: s.player?.honorific === 'Ginoong' ? 'Mr.' : 'Madam',
    sirmaam: s.player?.honorific === 'Ginoong' ? 'sir' : 'ma’am',
    speaker: leader('Speaker of the House'),
    minorityLeader: leader('Minority Floor Leader'),
    appropriationsChair: leader('Chair, Committee on Appropriations'),
    justiceChair: leader('Chair, Committee on Justice (impeachment)'),
    senatePresident: sp ? `Senator ${sp.name}` : 'the Senate President',
    vp: vpName,
    party: getParty(s.partyId)?.abbreviation ?? 'your party',
    home: REGIONS.find((r) => r.id === s.flags.home_region)?.name ?? 'your home province',
    date: monthLabel(s.month),
    approval: `${Math.round(s.economy?.approval ?? 50)}%`,
    rival: String(s.flags.rival_name ?? 'the defeated candidate'),
    vacantJustice: String(s.flags.vacancy_justice_name ?? 'a justice'),
    vacantJusticeRole: s.flags.vacancy_justice_chief ? 'Chief Justice' : 'Associate Justice',
    vacantSenator: String(s.flags.vacancy_senator_name ?? 'a senator'),
    jbc1: String(s.flags.jbc1 ?? 'the first nominee'),
    jbc2: String(s.flags.jbc2 ?? 'the second nominee'),
    jbc3: String(s.flags.jbc3 ?? 'the third nominee'),
    jbc1p: String(s.flags.jbc1p ?? 'Moderate'),
    successor: fillName(s, s.flags.successor_name, 'the administration candidate'),
    opponent: fillName(s, s.flags.opposition_candidate, String(s.flags.rival_name ?? 'the opposition candidate')),
    rivalParty: getParty(String(s.flags.rival_party ?? ''))?.abbreviation ?? 'the opposition',
  };
  for (const post of CABINET_POSTS) {
    const seat = s.cabinet.find((c) => c.postId === post.id);
    const n = seat?.nomineeId ? findNominee(s, post.id, seat.nomineeId) : undefined;
    out[`sec:${post.id}`] = n ? n.name : `the acting ${post.title.replace('Secretary of ', '').replace('Secretary', '').trim()} chief`;
  }
  Object.assign(out, institutionTokens(s), betrayalTokens(s), twistTokens(s));
  const traitorPost = s.context?.traitorPost;
  if (traitorPost) {
    const post = CABINET_POSTS.find((p) => p.id === traitorPost);
    out.traitor = out[`sec:${traitorPost}`];
    out.traitorPost = post?.title ?? '';
  } else {
    // With no Cabinet secretaries seated, the betrayal comes from the acting officials.
    out.traitor = 'your acting Executive Secretary';
    out.traitorPost = 'acting Executive Secretary';
  }
  return out;
}

/** Flags may store names as tokens (e.g. "{vp}"); resolve them against the simple name flags. */
function fillName(s: CampaignState, v: unknown, fallback: string): string {
  if (!v) return fallback;
  return String(v).replace('{vp}', String(s.flags.vp_name ?? 'the Vice President')).replace('{rival}', String(s.flags.rival_name ?? 'the opposition leader'));
}

export function fill(text: string, t: Record<string, string>): string {
  return text.replace(/\{([a-zA-Z0-9:]+)\}/g, (m, k: string) => t[k] ?? m);
}

// ───────────────────────── Conditions ─────────────────────────

function statValue(s: CampaignState, key: StatKey): number {
  if (isPoliticsKey(key)) return s.politics[key];
  const e = s.economy;
  if (!e) return 0;
  return key === 'growth' ? e.growth ?? 5.6 : e[key];
}

export function check(s: CampaignState, c: Condition): boolean {
  if ('any' in c) return c.any.some((x) => check(s, x));
  if ('none' in c) return !c.none.some((x) => check(s, x));
  if ('flag' in c) {
    const v = s.flags[c.flag];
    const hit = c.is === undefined ? !!v : v === c.is;
    return c.not ? !hit : hit;
  }
  if ('stat' in c) {
    const v = statValue(s, c.stat);
    return (c.gte === undefined || v >= c.gte) && (c.lte === undefined || v <= c.lte);
  }
  if ('tag' in c) return s.tags.includes(c.tag);
  if ('cabinet' in c) {
    const seat = s.cabinet.find((x) => x.postId === c.cabinet);
    if (c.is) return seat?.nomineeId === c.is;
    if (c.filled !== undefined) return !!seat?.nomineeId === c.filled;
    return false;
  }
  if ('resolved' in c) return c.choice ? s.resolved[c.resolved] === c.choice : c.resolved in s.resolved;
  if ('ruling' in c) return !!s.context?.ruling && s.context.ruling.upheld === (c.ruling === 'upheld');
  if ('party' in c) return s.partyId === c.party;
  if ('vpAlly' in c) return (s.flags.vp_is_ally !== false) === c.vpAlly;
  if ('outcome' in c) return !!s.context?.outcome && s.context.outcome.success === c.outcome;
  if ('chance' in c) return seededRandom(seedOf(s, `chance:${c.key}`))() < c.chance;
  return true;
}

export const checkAll = (s: CampaignState, cs?: Condition[]) => !cs || cs.every((c) => check(s, c));

export const availableChoices = (s: CampaignState, e: StoryEvent): Choice[] => e.choices.filter((c) => checkAll(s, c.when));

// ───────────────────────── Queue ─────────────────────────

/** The month an event appears in this save: fixed, or drawn from its window. */
export function eventMonth(s: CampaignState, e: StoryEvent): number | undefined {
  if (e.month !== undefined) return e.month;
  if (!e.window) return undefined;
  const [from, to] = e.window;
  return from + Math.floor(seededRandom(seedOf(s, `window:${e.id}`))() * (to - from + 1));
}

const MAX_MATTERS_PER_MONTH = 9;

/** Difficulty is a headwind (or tailwind) for the whole term, not just the starting numbers. */
const DIFF_PULL: Record<string, { growth: number; inflation: number; approval: number }> = {
  easy: { growth: 0.4, inflation: -0.4, approval: 5 },
  normal: { growth: 0, inflation: 0, approval: 0 },
  hard: { growth: -0.6, inflation: 1.2, approval: -7 },
};
const MAX_BILLS_PER_MONTH = 2;
const isBill = (e: StoryEvent) => e.id.startsWith('bill_') || e.id.startsWith('b2_');
/** Crises, elections, budgets, and chapter beats are never postponed. */
const isFixedBeat = (e: StoryEvent) => (e.priority ?? 0) >= 8 || !!e.special || e.category === 'chapter';

/**
 * Builds this month’s agenda. Order is shuffled per save (after priority), and a month is kept balanced:
 * at most two bills and about seven matters — the rest carry over to next month.
 */
export function buildQueue(s: CampaignState): string[] {
  // Ordinary matters that have waited more than eight months past their moment lapse: the world moved on.
  // Follow-ups (no month of their own), high-priority beats, and chained events are never dropped.
  const lapsed = s.scheduled.filter((x) => {
    const e = EVENTS_BY_ID[x.event];
    const m = e ? eventMonth(s, e) : undefined;
    return !!e && m !== undefined && x.month <= s.month && s.month - m > 8 && (e.priority ?? 0) <= 5 && !isFixedBeat(e);
  });
  if (lapsed.length) {
    const ids = new Set(lapsed.map((x) => x.event));
    s.scheduled = s.scheduled.filter((x) => !ids.has(x.event));
    s.flags = { ...s.flags, ...Object.fromEntries([...ids].map((id) => [`lapsed_${id}`, true])) };
  }
  const due = new Set(s.scheduled.filter((x) => x.month <= s.month).map((x) => x.event));
  const queued = new Set(s.queue);
  // Events already carried over to a later month stay there.
  const carried = new Set(s.scheduled.filter((x) => x.month > s.month).map((x) => x.event));
  // The longer a matter has waited, the higher it climbs on the desk.
  const urgency = (e: StoryEvent) => (e.priority ?? 0) + Math.min(3, Math.max(0, s.month - (eventMonth(s, e) ?? s.month)) * 0.5);
  const shuffleKey = (e: StoryEvent) => seededRandom(seedOf(s, `order:${s.month}:${e.id}`))();
  const events = ALL_EVENTS.filter(
    (e) => !queued.has(e.id) && !carried.has(e.id) && !(e.id in s.resolved) && !s.flags[`lapsed_${e.id}`] && (eventMonth(s, e) === s.month || due.has(e.id)) && checkAll(s, e.when),
  ).sort((a, b) => urgency(b) - urgency(a) || shuffleKey(a) - shuffleKey(b));

  const kept: StoryEvent[] = [];
  const deferred: StoryEvent[] = [];
  let bills = s.queue.filter((id) => isBill(EVENTS_BY_ID[id] ?? ({ id } as StoryEvent))).length;
  let count = s.queue.length;
  for (const e of events) {
    if (isFixedBeat(e)) {
      kept.push(e);
      count++;
    } else if (isBill(e) ? bills >= MAX_BILLS_PER_MONTH || count >= MAX_MATTERS_PER_MONTH : count >= MAX_MATTERS_PER_MONTH) {
      deferred.push(e);
    } else {
      kept.push(e);
      count++;
      if (isBill(e)) bills++;
    }
  }
  if (deferred.length) {
    const ids = new Set(deferred.map((e) => e.id));
    s.scheduled = [...s.scheduled.filter((x) => !ids.has(x.event)), ...deferred.map((e) => ({ event: e.id, month: s.month + 1 }))];
  }
  return kept.map((e) => e.id);
}

// ───────────────────────── Opening an event ─────────────────────────

/** The Cabinet member most likely to betray you: lowest loyalty, and a rival VP counts as very disloyal. */
export function findTraitor(s: CampaignState): string | undefined {
  let worst: { post: string; loyalty: number } | undefined;
  for (const seat of s.cabinet) {
    if (!seat.nomineeId) continue;
    const n = findNominee(s, seat.postId, seat.nomineeId);
    if (!n) continue;
    const loyalty = n.id === VP_NOMINEE_ID && s.flags.vp_is_ally === false ? 1 : n.loyalty;
    if (!worst || loyalty < worst.loyalty) worst = { post: seat.postId, loyalty };
  }
  return worst?.post;
}

export function openEvent(s: CampaignState, eventId: string): void {
  const e = EVENTS_BY_ID[eventId];
  s.context = { eventId, traitorPost: (s.flags.traitor_post as string) || findTraitor(s) };
  if (e?.court) {
    const r = runCourt(s, e.court, seedOf(s, e.id));
    s.context.ruling = r;
  }
  if (e?.special === 'midterm') s.context.midterm = runMidterm(s);
  if (e?.special === 'successor') s.context.outcome = runSuccessor(s);
  if (e?.special === 'reckoning') s.context.outcome = runReckoning(s);
}

// ───────────────────────── Supreme Court ─────────────────────────

const PHILOSOPHY_BIAS: Record<CourtCase['kind'], Partial<Record<Philosophy, number>>> = {
  rights: { Progressive: -0.25, Textualist: 0.05, Pragmatist: 0.1 },
  executive: { Pragmatist: 0.15, Textualist: -0.1, Progressive: -0.05 },
  economic: { Moderate: 0.1, Pragmatist: 0.1, Progressive: -0.05 },
  electoral: { Textualist: -0.1, Moderate: 0.05 },
};

export function currentCourt(s: CampaignState): { id: string; philosophy: Philosophy }[] {
  const year = fiscalYear(s.month);
  return SUPREME_COURT.map((j) => {
    const change = s.justiceChanges.find((c) => c.replaces === j.id);
    if (change) return { id: `new-${j.id}`, philosophy: change.philosophy };
    // A retired seat not yet filled by you is filled by a stand-in moderate for simplicity.
    return { id: j.id, philosophy: retirementYear(j) < year ? 'Moderate' : j.philosophy };
  });
}

function runCourt(s: CampaignState, c: CourtCase, seed: string) {
  const rand = seededRandom(seed);
  let yes = 0;
  for (const j of currentCourt(s)) {
    const p = clamp(c.soundness + (PHILOSOPHY_BIAS[c.kind][j.philosophy] ?? 0) - s.politics.courtTension / 400, 0.03, 0.97);
    if (rand() < p) yes++;
  }
  return { upheld: yes >= 8, yes, no: 15 - yes };
}

// ───────────────────────── Congress votes ─────────────────────────

function runVote(s: CampaignState, v: NonNullable<Effects['vote']>, seed: string): VoteReport {
  const gov = s.government!;
  const rand = seededRandom(seed);
  const cohesion = s.politics.cohesion / 100;
  const capital = (s.politics.capital - 50) / 250;
  const prob = (stance: Stance, appeal: number) => {
    if (stance === 'ally') return clamp(0.55 + 0.4 * cohesion + 0.07 * appeal + capital, 0.05, 0.98);
    if (stance === 'neutral') return clamp(0.45 + 0.13 * appeal + capital, 0.03, 0.95);
    return clamp(0.1 + 0.08 * appeal, 0.01, 0.6);
  };

  let houseYes = 0;
  for (const b of gov.house.blocs) {
    // Blocs vote with some cohesion: a shared swing, plus individual noise.
    const p = clamp(prob(b.stance, v.appeal) + (rand() - 0.5) * 0.12, 0, 1);
    for (let i = 0; i < b.seats; i++) if (rand() < p) houseYes++;
  }
  const houseTotal = gov.house.totalSeats;
  const houseNo = houseTotal - houseYes;
  const houseMajority = v.houseThreshold ?? Math.floor(houseTotal / 2) + 1;
  if (v.houseOnly) return { bill: v.bill, houseYes, houseNo, senateYes: 0, senateNo: 0, passed: houseYes >= houseMajority, failedIn: houseYes >= houseMajority ? undefined : 'House' };

  let senateYes = 0;
  const sAppeal = v.senateAppeal ?? v.appeal;
  for (const sen of gov.senators) if (rand() < prob(sen.stance, sAppeal)) senateYes++;
  const senateNo = gov.senators.length - senateYes;

  if (houseYes < houseMajority) return { bill: v.bill, houseYes, houseNo, senateYes: 0, senateNo: 0, passed: false, failedIn: 'House' };
  if (senateYes < (v.senateThreshold ?? 13)) return { bill: v.bill, houseYes, houseNo, senateYes, senateNo, passed: false, failedIn: 'Senate' };
  return { bill: v.bill, houseYes, houseNo, senateYes, senateNo, passed: true };
}

/**
 * Senate impeachment trial. Each senator votes to convict according to their camp, the gravity of the charges,
 * your approval, and how united your coalition is. Conviction needs 16 of 24.
 */
function runTrial(s: CampaignState, severity: number, seed: string): VoteReport {
  const rand = seededRandom(seed);
  // Senators are politicians: a popular President is very hard to convict, an unpopular one very easy.
  const approvalPull = (45 - (s.economy?.approval ?? 50)) / 90;
  const cohesion = (s.politics.cohesion - 50) / 200;
  let convict = 0;
  for (const sen of s.government!.senators) {
    const p =
      sen.stance === 'ally' ? 0.05 + severity * 0.12 + approvalPull - cohesion
      : sen.stance === 'neutral' ? 0.3 + severity * 0.18 + approvalPull
      : 0.85 + severity * 0.05;
    if (rand() < clamp(p, 0.02, 0.98)) convict++;
  }
  return { bill: 'Senate impeachment trial — votes to convict', houseYes: 0, houseNo: 0, senateYes: convict, senateNo: 24 - convict, passed: convict >= 16 };
}

// ───────────────────────── Effects ─────────────────────────

function shiftHouse(s: CampaignState, n: number) {
  const gov = s.government!;
  const blocs = gov.house.blocs.map((b) => ({ ...b }));
  let rebels = blocs.find((b) => b.label === 'Rebel bloc');
  if (!rebels) {
    rebels = { label: 'Rebel bloc', kind: 'independent', partyId: null, seats: 0, stance: 'opposition' };
    blocs.push(rebels);
  }
  if (n < 0) {
    let left = -n;
    // Defectors come from the largest allied blocs that are not the President's own party first.
    const donors = blocs.filter((b) => b.stance === 'ally' && b !== rebels).sort((a, b) => Number(a.partyId === s.partyId) - Number(b.partyId === s.partyId) || b.seats - a.seats);
    for (const d of donors) {
      const take = Math.min(left, Math.floor(d.seats * 0.4));
      d.seats -= take;
      rebels.seats += take;
      left -= take;
      if (left <= 0) break;
    }
  } else if (n > 0) {
    const own = blocs.find((b) => b.partyId === s.partyId)!;
    let left = n;
    const donors = [rebels, ...blocs.filter((b) => b.stance !== 'ally' && b !== rebels).sort((a, b) => b.seats - a.seats)];
    for (const d of donors) {
      const take = Math.min(left, d === rebels ? d.seats : Math.floor(d.seats * 0.3));
      d.seats -= take;
      own.seats += take;
      left -= take;
      if (left <= 0) break;
    }
  }
  gov.house = { ...gov.house, blocs: blocs.filter((b) => b.seats > 0 || b.kind !== 'independent' || b.label !== 'Rebel bloc') };
}

function shiftSenate(s: CampaignState, from: Stance, to: Stance, count: number) {
  const gov = s.government!;
  const candidates = gov.senators
    .filter((x) => x.stance === from && !x.isSenatePresident)
    .map((x) => ({ x, influence: SENATORS.find((y) => y.id === x.id)?.influence ?? 1 }))
    .sort((a, b) => b.influence - a.influence)
    .slice(0, count)
    .map((c) => c.x.id);
  gov.senators = gov.senators.map((x) => (candidates.includes(x.id) ? { ...x, stance: to } : x));
  return candidates;
}

function fireCabinet(s: CampaignState, target: string): string | undefined {
  const postId = target === 'traitor' ? s.context?.traitorPost : target === 'vp' ? (s.flags.vp_in_cabinet as string) || undefined : target;
  if (!postId) return undefined;
  const seat = s.cabinet.find((c) => c.postId === postId);
  if (!seat?.nomineeId) return undefined;
  const name = tokens(s)[`sec:${postId}`];
  s.cabinet = s.cabinet.map((c) => (c.postId === postId ? { ...c, nomineeId: null, status: 'vacant', rejectedIds: [...c.rejectedIds, seat.nomineeId!] } : c));
  s.flags = { ...s.flags, [`fired_${postId}`]: true, [`cabinet_${postId}`]: '' };
  if (seat.nomineeId === VP_NOMINEE_ID) s.flags = { ...s.flags, vp_in_cabinet: '', vp_fired: true };
  // New names surface for the vacated post.
  const fresh = generateNominees(postId, seedOf(s, `${postId}:${s.month}:${s.ledger.length}`), 2, takenNames(s));
  s.extraNominees = { ...(s.extraNominees ?? {}), [postId]: [...(s.extraNominees?.[postId] ?? []), ...fresh] };
  return name;
}

const EMPTY_BOOK: YearBook = { taxes: 0, investments: 0, oneOffIncome: 0, operations: 0, interest: 0, projects: 0, oneOffSpend: 0, debtRepaid: 0, principal: 0, borrowed: 0 };

/** Adds to the running tally of what moved the national debt. */
export function tallyDebt(s: CampaignState, entries: Partial<{ principal: number; prepaid: number; revaluation: number; loans: number }>) {
  const t = s.debtTally ?? { start: s.economy?.debt ?? 0, principal: 0, prepaid: 0, revaluation: 0, loans: 0 };
  s.debtTally = { ...t, principal: t.principal + (entries.principal ?? 0), prepaid: t.prepaid + (entries.prepaid ?? 0), revaluation: t.revaluation + (entries.revaluation ?? 0), loans: t.loans + (entries.loans ?? 0) };
}

/** Adds to this calendar year's books. */
export function book(s: CampaignState, entries: Partial<YearBook>) {
  const y = fiscalYear(Math.max(0, s.month));
  const cur = { ...EMPTY_BOOK, ...(s.yearBook?.[y] ?? {}) };
  for (const [k, v] of Object.entries(entries) as [keyof YearBook, number][]) cur[k] = (cur[k] ?? 0) + v;
  s.yearBook = { ...(s.yearBook ?? {}), [y]: cur };
}

/** Investments pay only once they have opened, and not after they fail. */
export const earningAssets = (s: CampaignState): Asset[] => (s.assets ?? []).filter((a) => a.startedMonth <= s.month && !a.failed);

/** What an investment pays this month: troubled ones earn 40% until the trouble ends. */
export const assetPay = (a: Asset, month: number) => (a.failed || a.startedMonth > month ? 0 : (a.troubleUntil ?? -1) > month ? a.monthlyIncome * 0.4 : a.monthlyIncome);

const TROUBLES: Record<string, string[]> = {
  company: ['workers strike over pay', 'a tax dispute with the local government', 'a data-privacy lawsuit', 'a power outage that halts operations'],
  default: ['a contractor walks off the job', 'a court order stops collections', 'a typhoon damages the facility', 'a local official demands a cut'],
};
const FAILURES: Record<string, string[]> = {
  company: ['the company pulls out of the Kapuluan, citing corruption and instability', 'the parent company goes bankrupt abroad and closes the operation'],
  default: ['the project collapses under unpaid debts and a graft case', 'the operator walks away and the facility sits idle'],
};

/** Each month, investments face real risks. Corruption, protests, low investor confidence, and West Sea tension raise them. */
function investmentRisks(s: CampaignState, notes: string[]) {
  const p = s.politics;
  const ec = s.economy!;
  const risk = 0.006 + Math.max(0, p.corruption - 45) * 0.0005 + Math.max(0, p.protest - 40) * 0.0003 + Math.max(0, 50 - p.investor) * 0.0006 + Math.max(0, p.sovereignty - 70) * 0.0003 + Math.max(0, ec.inflation - 6) * 0.002;
  s.assets = (s.assets ?? []).map((a) => {
    if (a.failed || a.startedMonth > s.month || (a.troubleUntil ?? -1) > s.month) return a;
    const r = seededRandom(seedOf(s, `risk:${a.id}:${s.month}`));
    if (r() >= risk) return a;
    const kind = a.kind === 'company' ? 'company' : 'default';
    // Most problems are temporary; one in four is fatal (more likely when confidence is low).
    const fatal = r() < 0.18 + Math.max(0, 45 - p.investor) * 0.01;
    if (fatal) {
      const why = FAILURES[kind][Math.floor(r() * FAILURES[kind].length)];
      notes.push(`FAILED: ${a.name} — ${why}. It will earn nothing more.`);
      s.news = [{ month: s.month, headline: `${a.name.split(':')[0].toUpperCase()} INVESTMENT COLLAPSES` }, ...s.news].slice(0, 60);
      if (s.economy) s.economy = { ...s.economy, unemployment: clamp(s.economy.unemployment + a.jobs / 520_000, 2.5, 30) };
      s.politics = { ...s.politics, investor: clamp(s.politics.investor - 2, 0, 100) };
      return { ...a, failed: true, failNote: why };
    }
    const why = TROUBLES[kind][Math.floor(r() * TROUBLES[kind].length)];
    const months = 2 + Math.floor(r() * 5);
    notes.push(`Trouble at ${a.name}: ${why}. Income is cut for ${months} months.`);
    return { ...a, troubleUntil: s.month + months, troubleNote: why };
  });
}

/**
 * Inflation moves like the real thing: pulled toward a level set by the state of the economy
 * (jobs, growth, debt, deficits, the peso), and pushed around by food, fuel, and weather shocks.
 */
function nextInflation(s: CampaignState, growth: number, borrowed: number): number {
  const ec = s.economy!;
  const p = s.politics;
  const ratio = (ec.debt / ec.gdp) * 100;
  const deficitPct = ((borrowed * 12) / ec.gdp) * 100;
  const target =
    3.3 +
    (5.8 - ec.unemployment) * 0.35 + // tight job market pushes wages and prices up; slack pulls them down
    (growth - 5.5) * 0.3 + // an overheating economy
    Math.max(0, ratio - 60) * 0.07 + // heavy debt weakens the peso
    Math.min(2, deficitPct * 0.25) - // borrowing to spend
    (p.investor - 50) * 0.012 + // confident investors mean a stronger peso
    Math.max(0, p.sovereignty - 70) * 0.02 + // shipping disruptions in the West Sea
    monetaryEffect(s).inflation + // central bank rates and the peso
    DIFF_PULL[String(s.flags.difficulty ?? 'normal')].inflation; // the Republic you inherited
  // Supply shocks: a persistent random component, plus the odd oil or rice spike.
  const r = seededRandom(seedOf(s, `inflation-shock:${s.month}`));
  let shock = Number(s.flags.inflation_shock ?? 0) * 0.82 + (r() - 0.5) * 0.5;
  const roll = r();
  const calendarMonth = (s.month + 6) % 12; // 0 = January
  if (roll < 0.035) { shock += 1.1 + r(); s.flags = { ...s.flags, inflation_news: 'Oil prices spike on world markets.' }; }
  else if (roll < 0.06) { shock += 0.6 + r() * 0.6; s.flags = { ...s.flags, inflation_news: 'A poor harvest pushes rice and vegetable prices up.' }; }
  else if (roll < 0.085) { shock -= 0.6 + r() * 0.6; s.flags = { ...s.flags, inflation_news: 'World oil prices fall sharply.' }; }
  else s.flags = { ...s.flags, inflation_news: '' };
  s.flags = { ...s.flags, inflation_shock: Math.round(shock * 100) / 100 };
  const seasonal = calendarMonth === 11 ? 0.25 : calendarMonth >= 7 && calendarMonth <= 9 ? 0.2 : calendarMonth <= 2 ? -0.15 : 0;
  const next = ec.inflation + (target + shock + seasonal - ec.inflation) * 0.22;
  return clamp(next, 0.4, 25);
}


export function spendMoney(s: CampaignState, label: string, amount: number) {
  if (!s.economy || amount <= 0) return 0;
  const { economy, borrowed } = applySpend(s.economy, amount);
  book(s, { oneOffSpend: amount, borrowed });
  s.economy = economy;
  s.ledger = [{ id: `${s.month}-${s.ledger.length}-${label.length}`, date: monthLabel(s.month), label, amount: -amount, borrowed }, ...s.ledger].slice(0, 200);
  return borrowed;
}

export function applyEffects(s: CampaignState, fx: Effects, report: EventReport, seed: string) {
  if (!s.economy || !s.government) return;

  for (const [k, v] of Object.entries(fx.stats ?? {})) {
    if (v === undefined) continue;
    // No administration ever gets corruption perception below 15.
    if (isPoliticsKey(k)) s.politics = { ...s.politics, [k]: clamp(s.politics[k] + v, k === 'corruption' ? 15 : 0, 100) };
    // Individual events move approval less than the long-run fundamentals do.
    else if (k === 'approval') {
      // Diminishing returns: the more popular you are, the harder it is to gain; the less popular, the harder you fall.
      const a: number = s.economy.approval;
      const scaled = v > 0 ? v * 0.45 * clamp((90 - a) / 45, 0.1, 1) : v * 0.6 * Math.min(1.3, (110 - a) / 60);
      s.economy = { ...s.economy, approval: clamp(a + scaled, 0, 100) };
    }
    else if (k === 'growth') s.economy = { ...s.economy, growth: clamp((s.economy.growth ?? 5.6) + v, -8, 12) };
    // Prices never fall below ~1% inflation; unemployment and poverty keep a realistic floor too.
    else s.economy = { ...s.economy, [k]: clamp((s.economy[k as 'inflation'] ?? 0) + v, k === 'inflation' ? 1 : k === 'unemployment' ? 2.5 : 5, 60) };
  }
  if (fx.spend) {
    const b = spendMoney(s, fx.spendLabel ?? EVENTS_BY_ID[report.eventId]?.title ?? 'Government spending', fx.spend);
    if (b > 0) report.notes.push(`${peso(b)} had to be borrowed.`);
  }
  if (fx.income && s.economy) {
    s.economy = { ...s.economy, treasury: s.economy.treasury + fx.income };
    book(s, { oneOffIncome: fx.income });
    s.ledger = [{ id: `${s.month}-inc-${s.ledger.length}`, date: monthLabel(s.month), label: fx.spendLabel ?? 'One-off income', amount: fx.income, borrowed: 0 }, ...s.ledger];
  }
  if (fx.taxRate) s.taxRate = clamp(s.taxRate + fx.taxRate / 100, 0.12, 0.24);
  if (fx.program) s.programs = [...s.programs.filter((p) => p.id !== fx.program!.id), { id: fx.program.id, label: fx.program.label, monthly: fx.program.monthly, monthsLeft: fx.program.months }];
  if (fx.asset && !(s.assets ?? []).some((a) => a.id === fx.asset!.id)) {
    const a = fx.asset;
    const opens = s.month + (a.delay ?? 0);
    s.assets = [...(s.assets ?? []), { id: a.id, name: a.name, province: a.province, kind: a.kind, monthlyIncome: a.monthlyIncome, jobs: a.jobs, startedMonth: opens, cost: fx.spend ?? (fx.project ? fx.project.cost : undefined), earned: 0 }];
    report.notes.push(`New investment: ${a.name}. It will earn about ${peso(a.monthlyIncome * 12)} a year and employ ${a.jobs.toLocaleString()} people${a.delay ? `, starting ${monthLabel(opens)}` : ''}.`);
  }
  if (fx.assetHit) {
    const h = fx.assetHit;
    const target = (s.assets ?? []).find((a) => a.id === h.id && !a.failed);
    if (target) {
      s.assets = s.assets.map((a) => (a !== target ? a : h.factor <= 0 ? { ...a, failed: true, failNote: h.note } : h.months ? { ...a, troubleUntil: s.month + h.months, troubleNote: h.note } : { ...a, monthlyIncome: Math.round(a.monthlyIncome * h.factor * 100) / 100 }));
      report.notes.push(h.factor <= 0 ? `${target.name} has failed. It will earn nothing more.` : h.months ? `${target.name} will earn less for ${h.months} months.` : `${target.name} will now earn ${Math.round(h.factor * 100)}% of what it did.`);
    }
  }
  if (fx.project && !s.projects.some((p) => p.id === fx.project!.id)) {
    const p = fx.project;
    s.projects = [...s.projects, { ...p, monthly: p.cost / p.months, monthsLeft: p.months, startedMonth: s.month }];
    report.notes.push(`Project started: ${p.name} (${peso(p.cost)} over ${p.months} months).`);
  }
  if (fx.law && !s.laws.some((l) => l.id === fx.law!.id)) {
    s.laws = [...s.laws, { ...fx.law, month: s.month }];
    s.flags = { ...s.flags, [`law_${fx.law.id}`]: true };
    report.notes.push(`Signed into law: ${fx.law.name}.`);
  }
  if (fx.flags) s.flags = { ...s.flags, ...fx.flags };
  if (fx.schedule) s.scheduled = [...s.scheduled, ...fx.schedule.map((x) => ({ event: x.event, month: s.month + x.inMonths }))];
  if (fx.senateShift) {
    const moved = shiftSenate(s, fx.senateShift.from, fx.senateShift.to, fx.senateShift.count);
    if (moved.length) report.notes.push(`${moved.map((id) => `Sen. ${SENATORS.find((x) => x.id === id)?.name}`).join(', ')} moved to the ${fx.senateShift.to === 'ally' ? 'administration' : fx.senateShift.to === 'neutral' ? 'independent' : 'opposition'} camp.`);
  }
  if (fx.senators) {
    const gov = s.government;
    gov.senators = gov.senators.map((x) => (fx.senators![x.id] ? { ...x, stance: fx.senators![x.id] } : x));
    for (const [id, st] of Object.entries(fx.senators)) report.notes.push(`Sen. ${SENATORS.find((x) => x.id === id)?.name} is now ${st === 'ally' ? 'with the administration' : st === 'neutral' ? 'independent' : 'in the opposition'}.`);
  }
  if (fx.houseShift) {
    shiftHouse(s, fx.houseShift);
    report.notes.push(fx.houseShift > 0 ? `${fx.houseShift} representatives joined your coalition.` : `${-fx.houseShift} representatives bolted from your coalition.`);
  }
  if (fx.fireCabinet) {
    const name = fireCabinet(s, fx.fireCabinet);
    if (name) report.notes.push(`${name} is out of the Cabinet.`);
  }
  if (fx.appointJustice) {
    const replaces = fx.appointJustice.replaces === 'random' ? String(s.flags.vacancy_justice ?? '') : fx.appointJustice.replaces;
    const name = fill(fx.appointJustice.name, tokens(s));
    if (replaces) {
      s.justiceChanges = [...s.justiceChanges, { replaces, name, philosophy: fx.appointJustice.philosophy, month: s.month }];
      report.notes.push(`${name} takes the oath as ${s.flags.vacancy_justice_chief && fx.appointJustice.replaces === 'random' ? 'Chief Justice' : 'Associate Justice'}.`);
    }
  }
  if (fx.removeSenator && s.flags.vacancy_senator) {
    const id = String(s.flags.vacancy_senator);
    s.government = { ...s.government!, senators: s.government!.senators.filter((x) => x.id !== id) };
    report.notes.push(`The Senate now has ${s.government!.senators.length} members until the next election.`);
  }
  if (fx.coalition) joinCoalition(s, fx.coalition, report);
  applyInstitutionEffects(s, fx, report.notes);
  if (fx.relations) shiftRelations(s, fx.relations);
  if (fx.need) shiftNeeds(s, fx.need);
  if (fx.company) report.notes.push(courtCompany(s, fx.company.id, fx.company.offer).message);
  if (fx.provGovernor) {
    shiftGovernor(s, fx.provGovernor.province, fx.provGovernor.to);
    report.notes.push(fx.provGovernor.province === 'all' ? 'The governors line up behind you.' : `The governor of ${fx.provGovernor.province} is now ${fx.provGovernor.to === 'ally' ? 'an ally' : fx.provGovernor.to === 'opposition' ? 'in the opposition' : 'independent'}.`);
  }
  if (fx.spy === 'plant') plantSpy(s);
  else if (fx.spy) {
    const { post, right } = accuseSpy(s, fx.spy);
    if (post) {
      const name = fireCabinet(s, post);
      report.notes.push(right ? `${name} is arrested. Counter-intelligence confirms: you caught the spy.` : `${name} is out — but the leaks continue. You accused the wrong person.`);
    }
  }
  if (fx.betrayal) {
    const post = resolveBetrayal(s, fx.betrayal, report.notes);
    if (post && fx.betrayal !== 'reconcile') {
      const name = fireCabinet(s, post);
      if (name) report.notes.push(`${name} is out of the Cabinet.`);
    }
  }
  if (fx.debt && s.economy) {
    s.economy = { ...s.economy, debt: s.economy.debt + fx.debt };
    tallyDebt(s, fx.debt > 0 ? { loans: fx.debt } : { prepaid: -fx.debt });
    report.notes.push(fx.debt > 0 ? `${peso(fx.debt)} added to the national debt.` : `${peso(-fx.debt)} removed from the national debt.`);
  }
  if (fx.budgetChange) s.flags = { ...s.flags, budget_adjust: Number(s.flags.budget_adjust ?? 0) + fx.budgetChange };
  if (fx.enactBudget) enactBudget(s, fx.enactBudget, report);
  if (fx.trial) {
    const result = runTrial(s, fx.trial.severity, `${seed}:trial`);
    report.vote = result;
    s.flags = { ...s.flags, impeachment: result.passed ? 'convicted' : 'acquitted' };
    const next = result.passed ? fx.trial.onConvict : fx.trial.onAcquit;
    if (next) applyEffects(s, next, report, `${seed}:verdict`);
  }
  if (fx.verdict) {
    const convicted = seededRandom(`${seed}:verdict`)() < convictionChance(s, fx.verdict.severity);
    s.flags = { ...s.flags, final_verdict: convicted ? 'convicted' : 'acquitted' };
    report.notes.push(convicted ? 'The court finds you GUILTY.' : 'The court ACQUITS you.');
    const next = convicted ? fx.verdict.onConvict : fx.verdict.onAcquit;
    if (next) applyEffects(s, next, report, `${seed}:after-verdict`);
  }
  if (fx.gameOver) {
    s.flags = { ...s.flags, game_over: fx.gameOver };
    s.chapterComplete = true;
  }
  if (fx.vote) {
    const result = runVote(s, fx.vote, `${seed}:vote`);
    report.vote = result;
    const next = result.passed ? fx.vote.onPass : fx.vote.onFail;
    if (next) applyEffects(s, next, report, `${seed}:after`);
  }
}

/** Allied parties that were waiting for a deal formally join the administration coalition. */
function joinCoalition(s: CampaignState, mode: 'all' | 'one', report: EventReport) {
  const gov = s.government!;
  const allies = NATURAL_ALLIES[s.partyId ?? ''] ?? [];
  const pending = gov.house.blocs.filter((b) => b.partyId && allies.includes(b.partyId) && b.stance === 'neutral').sort((a, b) => b.seats - a.seats);
  const joining = (mode === 'all' ? pending : pending.slice(0, 1)).map((b) => b.partyId as string);
  if (!joining.length) return;
  // A deal is never airtight: only part of each partner party follows its leaders, and each
  // pro-administration party-list group decides for itself. A majority is possible, never guaranteed.
  const rand = seededRandom(seedOf(s, 'coalition'));
  const adminLists = new Set(PARTY_LIST_GROUPS.filter((g) => g.lean === 'administration').map((g) => g.name));
  const blocs: typeof gov.house.blocs = [];
  let joined = 0;
  for (const b of gov.house.blocs) {
    if (b.partyId && joining.includes(b.partyId)) {
      const share = 0.3 + rand() * 0.55;
      const inSeats = Math.round(b.seats * share);
      joined += inSeats;
      blocs.push({ ...b, stance: 'ally', seats: inSeats });
      if (b.seats - inSeats > 0) blocs.push({ ...b, label: `${b.label} holdouts`, stance: 'neutral', seats: b.seats - inSeats });
    } else if (b.kind === 'party-list' && adminLists.has(b.label) && rand() < 0.5) {
      joined += b.seats;
      blocs.push({ ...b, stance: 'ally' });
    } else blocs.push(b);
  }
  gov.house = { ...gov.house, blocs };
  gov.senators = gov.senators.map((x) => {
    const sen = SENATORS.find((y) => y.id === x.id);
    return sen?.partyId && joining.includes(sen.partyId) && sen.temperament === 'loyal' && x.stance === 'neutral' && rand() < 0.75 ? { ...x, stance: 'ally' } : x;
  });
  const allySeats = blocs.filter((b) => b.stance === 'ally').reduce((n, b) => n + b.seats, 0);
  const majority = Math.floor(gov.house.totalSeats / 2) + 1;
  s.flags = { ...s.flags, coalition_formed: mode, coalition_parties: joining.join(','), house_majority: allySeats >= majority };
  report.notes.push(`${joining.map((p) => getParty(p)?.name).join(' and ')} joined your coalition — but not all their members followed. ${joined} representatives came over.`);
  report.notes.push(allySeats >= majority ? `Your coalition now has ${allySeats} of ${gov.house.totalSeats} seats: a majority, for now.` : `Your coalition has only ${allySeats} of ${gov.house.totalSeats} seats — still ${majority - allySeats} short of a majority.`);
}

function enactBudget(s: CampaignState, b: NonNullable<Effects['enactBudget']>, report: EventReport) {
  const adjust = Number(s.flags.budget_adjust ?? 0);
  const debtService = Math.round((s.economy?.debt ?? 0) * (s.economy?.interestRate ?? 0.049));
  let total: number;
  if (b.mode === 'proposal' && s.budgetProposal) {
    total = BUDGET_LINES.reduce((n, l) => n + (l.id === 'debtService' ? debtService : s.budgetProposal![l.id] ?? l.fy2027), 0) + adjust;
  } else if (b.mode === 'growth') {
    total = Math.round(s.activeBudget.total * (1 + (b.growth ?? 0.05))) + adjust;
  } else {
    total = s.activeBudget.total;
  }
  s.activeBudget = { fy: b.fy, total, debtServiceLine: debtService };
  s.flags = { ...s.flags, budget_adjust: 0, [`budget_${b.fy}`]: b.mode };
  report.notes.push(`FY${b.fy} budget: ${peso(total)}${b.mode === 'reenacted' ? ' (reenacted — last year’s budget repeats)' : ''}.`);
}

// ───────────────────────── Resolving a choice ─────────────────────────

function snapshot(s: CampaignState) {
  return { e: { ...s.economy! }, p: { ...s.politics } };
}

function diff(before: ReturnType<typeof snapshot>, s: CampaignState): Delta[] {
  const out: Delta[] = [];
  const e = s.economy!;
  if (Math.abs(e.treasury - before.e.treasury) >= 0.5) out.push({ label: 'Treasury', value: `${e.treasury > before.e.treasury ? '+' : ''}${peso(e.treasury - before.e.treasury)}`, good: e.treasury > before.e.treasury });
  if (Math.abs(e.debt - before.e.debt) >= 0.5) out.push({ label: 'Debt', value: `+${peso(e.debt - before.e.debt)}`, good: false });
  for (const [k, meta] of Object.entries(ECONOMY_LABELS)) {
    const a = k === 'growth' ? before.e.growth ?? 5.6 : before.e[k as 'approval'];
    const b = k === 'growth' ? e.growth ?? 5.6 : e[k as 'approval'];
    const d = Math.round((b - a) * 10) / 10;
    if (d !== 0) out.push({ label: meta.label, value: `${d > 0 ? '+' : ''}${d}${meta.unit}`, good: meta.higherIsGood ? d > 0 : d < 0 });
  }
  for (const [k, meta] of Object.entries(POLITICS_LABELS)) {
    const d = Math.round(s.politics[k as PoliticsKey] - before.p[k as PoliticsKey]);
    if (d !== 0) out.push({ label: meta.label, value: `${d > 0 ? '+' : ''}${d}`, good: meta.higherIsGood ? d > 0 : d < 0 });
  }
  return out;
}

export function resolveChoice(s: CampaignState, eventId: string, choiceId: string): EventReport | null {
  const e = EVENTS_BY_ID[eventId];
  const c = e?.choices.find((x) => x.id === choiceId);
  if (!e || !c || !s.economy) return null;
  const t = tokens(s);
  const report: EventReport = {
    eventId,
    choiceId,
    outcome: fill(c.outcome, t),
    headline: c.headline ? fill(c.headline, t) : undefined,
    reactions: (c.reactions ?? []).map((r) => ({ ...r, who: fill(r.who, t), text: fill(r.text, t) })),
    deltas: [],
    notes: [],
  };
  const before = snapshot(s);
  if (e.court && s.context?.ruling) {
    const fx = s.context.ruling.upheld ? e.court.onUphold : e.court.onStrike;
    s.courtRulings = [...s.courtRulings, { month: s.month, title: fill(e.court.title, t), upheld: s.context.ruling.upheld, yes: s.context.ruling.yes, no: s.context.ruling.no }];
    if (fx) applyEffects(s, fx, report, seedOf(s, `${eventId}:court`));
  }
  if (e.special === 'midterm' && s.context?.midterm) applyMidterm(s, s.context.midterm, report);
  if (e.special === 'successor' && s.context?.outcome) {
    s.flags = { ...s.flags, successor_won: s.context.outcome.success };
    report.notes.push(...s.context.outcome.lines);
  }
  if (e.special === 'reckoning' && s.context?.outcome) s.flags = { ...s.flags, charged: s.context.outcome.success };
  if (s.context?.traitorPost && !s.flags.traitor_post && eventId === 'cabinet_leak') s.flags = { ...s.flags, traitor_post: s.context.traitorPost };
  // A drafted bill carries the details the President chose at the drafting table.
  const fx = e.draft && s.context?.draftFx ? s.context.draftFx : c.effects;
  applyEffects(s, fx, report, seedOf(s, `${eventId}:${choiceId}`));
  afterDecision(s, eventId, choiceId, report.headline);
  report.deltas = diff(before, s);
  if (report.headline) s.news = [{ month: s.month, headline: report.headline }, ...s.news].slice(0, 60);
  s.resolved = { ...s.resolved, [eventId]: choiceId };
  s.queue = s.queue.filter((id) => id !== eventId);
  s.scheduled = s.scheduled.filter((x) => x.event !== eventId);
  s.lastReport = report;
  s.context = null;
  if (e.special === 'chapterEnd') s.chapterComplete = true;
  return report;
}

// ───────────────────────── Midterm elections (May 2030) ─────────────────────────

/** The 12 senators whose terms end in 2030 are replaced; each seat goes to an administration candidate with a probability driven by approval. */
function midtermSenate(s: CampaignState) {
  const rand = seededRandom(seedOf(s, 'midterm'));
  // Elections are won region by region and class by class, not on the national average.
  const approval = electoralApproval(s);
  const slate = s.flags.midterm_slate === 'celebrities' ? 0.06 : s.flags.midterm_slate === 'reformers' ? 0.02 : 0;
  const pAlly = clamp(0.2 + approval / 140 + (s.politics.cohesion - 50) / 400 + slate, 0.1, 0.9);
  return s.government!.senators.map((x) => {
    if (SENATORS.find((y) => y.id === x.id)?.termEnds !== 2030) return x;
    const r = rand();
    const stance: Stance = r < pAlly ? 'ally' : r < pAlly + (1 - pAlly) * 0.35 ? 'neutral' : 'opposition';
    return { ...x, stance };
  });
}

function runMidterm(s: CampaignState): MidtermResult {
  const count = (list: { stance: Stance }[]) => list.reduce<Record<string, number>>((acc, x) => ({ ...acc, [x.stance]: (acc[x.stance] ?? 0) + 1 }), {});
  const after = midtermSenate(s);
  const seatsWon = after.filter((x) => x.stance === 'ally' && SENATORS.find((y) => y.id === x.id)?.termEnds === 2030).length;
  const houseShift = Math.round((electoralApproval(s) - 50) * 1.4 + (s.politics.cohesion - 60) * 0.5);
  return { senateBefore: count(s.government!.senators), senateAfter: count(after), seatsWon, houseShift };
}

function applyMidterm(s: CampaignState, m: MidtermResult, report: EventReport) {
  const gov = s.government!;
  gov.senators = midtermSenate(s);
  // The new Senate re-elects its leadership.
  const allies = gov.senators.filter((x) => x.stance === 'ally');
  const leaderPool = allies.length >= 13 ? allies : gov.senators.filter((x) => x.stance !== 'ally');
  const top = leaderPool.map((x) => ({ x, i: SENATORS.find((y) => y.id === x.id)?.influence ?? 1 })).sort((a, b) => b.i - a.i)[0]?.x.id;
  gov.senators = gov.senators.map((x) => ({ ...x, isSenatePresident: x.id === top }));
  if (m.houseShift) shiftHouse(s, m.houseShift);
  s.flags = { ...s.flags, midterm_senate_won: m.seatsWon, midterm_house_shift: m.houseShift, senate_control: allies.length >= 13 ? 'administration' : 'opposition' };
  report.notes.push(`Administration candidates won ${m.seatsWon} of 12 Senate seats.`);
}

// ───────────────────────── Monthly tick ─────────────────────────

export function monthTick(s: CampaignState): MonthReport {
  const e = s.economy!;
  const notes: string[] = [];

  // Budget for the calendar year
  const fy = fiscalYear(s.month);
  if (s.activeBudget.fy < fy) {
    // A reenacted budget repeats last year's appropriations in pesos.
    s.activeBudget = { fy, total: s.activeBudget.total, debtServiceLine: s.activeBudget.debtServiceLine };
    s.flags = { ...s.flags, [`budget_${fy}`]: 'reenacted' };
    notes.push(`No new budget was enacted for FY${fy}; last year’s budget was reenacted.`);
  }

  const revenue = (e.gdp * s.taxRate) / 12;
  const interest = (e.debt * e.interestRate) / 12;
  const operations = (s.activeBudget.total - s.activeBudget.debtServiceLine) / 12;
  // Projects and programs above the budget are funded from supplemental appropriations.
  let extra = 0;
  let projectSpend = 0;
  s.projects = s.projects.map((p) => {
    if (p.monthsLeft <= 0) return p;
    extra += p.monthly;
    projectSpend += p.monthly;
    if (p.monthsLeft === 1) notes.push(`Completed: ${p.name}.`);
    return { ...p, monthsLeft: p.monthsLeft - 1 };
  });
  s.programs = s.programs
    .map((p) => {
      extra += p.monthly;
      projectSpend += p.monthly;
      return { ...p, monthsLeft: p.monthsLeft - 1 };
    })
    .filter((p) => p.monthsLeft > 0);

  // The debt is paid in monthly installments — about 5.4% of the principal a year — from taxes and other income.
  // Whatever revenue cannot cover is borrowed again (a rollover), so the debt only falls when the books run a surplus.
  const principal = Math.round(e.debt * 0.0045 * 10) / 10;
  const spending = operations + interest + extra + principal;
  // State investments and foreign companies pay taxes and fees every month.
  investmentRisks(s, notes);
  // Governors help or hinder the investments in their provinces.
  const assetIncome = (s.assets ?? []).reduce((n, a) => n + assetPay(a, s.month) * governorFactor(s, a.province), 0) + goccTick(s, notes);
  s.assets = (s.assets ?? []).map((a) => {
    const pay = assetPay(a, s.month);
    return pay > 0 ? { ...a, earned: (a.earned ?? 0) + pay } : a;
  });
  for (const a of s.assets ?? []) if (a.startedMonth === s.month && a.startedMonth > 0 && !a.failed) notes.push(`Now open and earning: ${a.name}.`);
  const net = revenue + assetIncome - spending;
  let borrowed = 0;
  if (net >= 0) {
    s.economy = { ...e, treasury: e.treasury + net };
  } else {
    const r = applySpend(e, -net);
    s.economy = r.economy;
    borrowed = r.borrowed;
  }
  s.economy = { ...s.economy!, debt: s.economy!.debt - principal };
  tallyDebt(s, { principal });
  book(s, { taxes: revenue, investments: assetIncome, operations, interest, projects: projectSpend, principal, borrowed });
  s.ledger = [{ id: `tick-${s.month}`, date: monthLabel(s.month), label: `Monthly operations (revenue ${peso(revenue)} − spending ${peso(spending)}, incl. ${peso(principal)} debt installment)`, amount: Math.round(net * 10) / 10, borrowed }, ...s.ledger].slice(0, 200);

  // Economy drifts
  const ec = s.economy!;
  const p = s.politics;
  const growthTarget = 4.9 + DIFF_PULL[String(s.flags.difficulty ?? 'normal')].growth + monetaryEffect(s).growth + (p.investor - 50) * 0.04 - Math.max(0, ec.inflation - 4) * 0.3 - Math.max(0, p.sovereignty - 70) * 0.03;
  const growth = (ec.growth ?? 5.6) + (growthTarget - (ec.growth ?? 5.6)) * 0.15;
  // Re-borrowing an installment (a rollover) is not new deficit spending; only the rest counts.
  const deficitBorrow = Math.max(0, borrowed - principal);
  const inflation = nextInflation(s, growth, deficitBorrow);
  if (s.flags.inflation_news) notes.push(String(s.flags.inflation_news));
  const unemployment = ec.unemployment + (5.5 - (growth - 5) * 0.3 - ec.unemployment) * 0.08;
  // Approval is pulled toward a "fundamentals" baseline, so single events matter but do not run away.
  const honeymoon = s.month < 12 ? -0.4 : -0.1;
  const baseline =
    46 + DIFF_PULL[String(s.flags.difficulty ?? 'normal')].approval + needsApproval(s) - (inflation - 4) * 2.8 - (p.crime - 50) * 0.2 - (p.corruption - 50) * 0.2 - (p.protest - 30) * 0.15 - (p.media - 40) * 0.1 + (growth - 5) * 1.5 - (unemployment - 6) * 1.6;
  // Very high approval is hard to sustain: the pull above 60 is softened, and six years in office wear any President down.
  const soft = baseline > 60 ? 60 + (baseline - 60) * 0.45 : baseline;
  const fatigue = Math.max(0, s.month) * 0.1;
  const approval = clamp(ec.approval + (soft - fatigue - ec.approval) * 0.16 + honeymoon, 3, 85);
  // Borrowing costs rise with the debt ratio and with investor nervousness.
  const ratio = (ec.debt / ec.gdp) * 100;
  // Borrowing costs follow the central bank's policy rate, the debt ratio, and investor nerves.
  const policy = s.centralBank ? (s.centralBank.rate - 5.75) * 0.002 : 0;
  const interestRate = clamp(0.049 + policy + Math.max(0, ratio - 60) * 0.002 + Math.max(0, 50 - p.investor) * 0.0004, 0.03, 0.12);
  s.economy = {
    ...ec,
    gdp: ec.gdp * (1 + (growth + inflation) / 100 / 12),
    growth,
    inflation,
    unemployment,
    approval,
    interestRate,
    revenueAnnual: ec.gdp * s.taxRate,
  };
  s.politics = {
    ...p,
    protest: p.protest + (20 - p.protest) * 0.05,
    media: p.media + (40 - p.media) * 0.04,
    capital: clamp(p.capital + (s.economy.approval - 50) * 0.04, 0, 100),
  };

  centralBankTick(s, notes, deficitBorrow);
  societyTick(s, notes);
  if (s.month === 34 || s.month === 70) localElections(s, notes);
  needsTick(s);
  crisisClock(s, notes);
  messagesTick(s, notes);
  promisesTick(s, notes);
  achievementsTick(s, notes);
  scheduleCrises(s);
  scheduleVacancies(s);
  const ec2 = s.economy!;
  s.history = [...(s.history ?? []), { month: s.month, approval: ec2.approval, inflation: ec2.inflation, growth: ec2.growth ?? 5, debtRatio: (ec2.debt / ec2.gdp) * 100, unemployment: ec2.unemployment, peso: s.centralBank?.peso, ...Object.fromEntries(pollResults(s).filter((p) => p.kind === 'region').map((p) => [p.id, Math.round(p.value)])) }].slice(-80);
  if (assetIncome > 0) notes.push(`State investments and companies earned ${peso(assetIncome)} this month.`);
  return { month: s.month, revenue: revenue + assetIncome, spending, borrowed, notes };
}

// ───────────────────────── After the presidency ─────────────────────────

const GUILT_FLAGS = ['took_bribe', 'obstruction', 'ordered_audits', 'impeachable_offense', 'defied_court', 'crackdown', 'bribed_vp_impeachment', 'term_extension_attempt', 'hid_illness', 'pardoned_delapaz', 'savings_realigned', 'martial_law_mindara', 'ch2_plunder', 'ch2_cover_up', 'ch2_abuse', 'ombudsman_dossier', 'senate_recommends_charges', 'accounts_frozen'];

/** How much there is to find, if someone goes looking. */
export function guiltScore(s: CampaignState): number {
  let g = GUILT_FLAGS.filter((f) => s.flags[f]).length;
  if (s.tags.includes('compromised')) g += 1;
  if (s.flags.hidden_debt === 'concealed') g += 1;
  g += Math.max(0, (s.politics.corruption - 50) / 15);
  return g;
}

export function successorChance(s: CampaignState): number {
  const e = s.economy!;
  const p = s.politics;
  const pick = String(s.flags.successor_choice ?? 'none');
  const pickBonus: Record<string, number> = { vp: s.flags.vp_is_ally === false ? -0.08 : 0.06, spouse: -0.04, technocrat: 0.02, party: 0.03, none: -0.12, rival_deal: 0.08 };
  return clamp(
    0.12 + electoralApproval(s) / 110 + (p.cohesion - 50) / 300 - (p.corruption - 50) / 250 + (pickBonus[pick] ?? 0) - (s.flags.rival_movement === 'growing' ? 0.05 : 0) + ((e.growth ?? 5) - 5) * 0.01,
    0.05,
    0.92,
  );
}

/** The May 2033 elections: your successor’s race, and your own if you run for Congress or the Senate. */
function runSuccessor(s: CampaignState) {
  const rand = seededRandom(seedOf(s, 'successor2033'));
  const p = clamp(successorChance(s) + (s.flags.successor_boost ? 0.05 : 0) + (s.flags.opponent_weakened ? 0.05 : 0), 0.05, 0.92);
  const success = rand() < p;
  const allyPct = Math.round((success ? 38 + p * 14 + rand() * 6 : 26 + p * 12 + rand() * 5) * 10) / 10;
  const oppPct = Math.round((success ? allyPct - 2 - rand() * 8 : allyPct + 2 + rand() * 9) * 10) / 10;
  const ally = fillName(s, s.flags.successor_name, 'The administration candidate');
  const opp = fillName(s, s.flags.opposition_candidate, String(s.flags.rival_name ?? 'The opposition candidate'));
  const lines = [`President: ${ally} ${allyPct}% — ${opp} ${oppPct}%. ${success ? ally : opp} wins.`];
  const plan = s.flags.post_plan;
  if (plan === 'house' || plan === 'senate') {
    const a = s.economy!.approval;
    const q = plan === 'house' ? 0.35 + a / 160 + s.politics.family / 400 : 0.05 + a / 95 - (s.politics.corruption - 50) / 200;
    const won = rand() < clamp(q, 0.05, 0.95);
    s.flags = { ...s.flags, own_race: won ? 'won' : 'lost' };
    lines.push(plan === 'house' ? `Your race for Congress in your home district: ${won ? 'WON' : 'LOST'}.` : `Your race for the Senate: ${won ? 'WON — you placed in the top twelve' : 'LOST'}.`);
  }
  if (s.flags.spouse_running) {
    const won = rand() < clamp(0.2 + s.economy!.approval / 120, 0.05, 0.9);
    s.flags = { ...s.flags, spouse_race: won ? 'won' : 'lost' };
    lines.push(`Your spouse’s race for the Senate: ${won ? 'WON' : 'LOST'}.`);
  }
  return { success, title: success ? 'Your successor wins' : 'The opposition takes the Palasyo', lines };
}

/** After June 30, 2033, immunity ends. Whether you are charged depends on who won — and what there is to find. */
function runReckoning(s: CampaignState) {
  const g = guiltScore(s);
  const friendly = s.flags.successor_won === true;
  // A deal with the rival or a surviving immunity law protects you — unless the new president promised to jail you.
  const shield = (s.flags.rival_protection && !friendly ? 0.5 : 0) + (s.flags.immunity_upheld ? 0.3 : 0);
  const vengeance = s.flags.prosecution_promise && !friendly ? 0.15 : 0;
  const p = (friendly ? 0.03 + g * 0.06 : 0.18 + g * 0.14 + s.politics.ombudsman / 300 + vengeance) - shield;
  const success = seededRandom(seedOf(s, 'reckoning'))() < clamp(p, 0.02, 0.95);
  return {
    success,
    title: success ? 'Charges are filed' : 'No charges — for now',
    lines: [success ? 'The Ombudsman files plunder and graft charges against you before the anti-graft court.' : 'The new administration decides not to pursue charges against you.'],
  };
}

function convictionChance(s: CampaignState, severity: number): number {
  return clamp(0.1 + guiltScore(s) * 0.12 + severity * 0.15 - (s.economy!.approval - 50) / 250 - s.justiceChanges.length * 0.03, 0.03, 0.95);
}

/**
 * Justices and senators do not always leave on schedule: illness, scandal, or death can open a seat any month.
 * Each vacancy uses the next unused copy of a template event.
 */
function scheduleVacancies(s: CampaignState) {
  const rand = seededRandom(seedOf(s, `vacancy:${s.month}`));
  const nextFree = (prefix: string, max: number) => {
    for (let i = 1; i <= max; i++) {
      const id = `${prefix}${i}`;
      if (!(id in s.resolved) && !s.scheduled.some((x) => x.event === id)) return id;
    }
    return null;
  };
  const busy = s.scheduled.some((x) => x.event.startsWith('sc_rand_vac_') || x.event.startsWith('sen_vac_'));
  if (busy) return;
  if (rand() < 0.035) {
    const year = fiscalYear(s.month);
    const candidates = SUPREME_COURT.filter((j) => !s.justiceChanges.some((c) => c.replaces === j.id) && retirementYear(j) > year);
    const slot = nextFree('sc_rand_vac_', 8);
    if (candidates.length && slot) {
      const j = candidates[Math.floor(rand() * candidates.length)];
      const list = jbcShortlist(seedOf(s, `jbc:${s.month}`));
      s.flags = { ...s.flags, vacancy_justice: j.id, vacancy_justice_name: j.name, vacancy_justice_chief: j.isChief && !s.justiceChanges.some((c) => c.replaces === j.id), jbc1: list[0].name, jbc1p: list[0].philosophy, jbc2: list[1].name, jbc3: list[2].name };
      s.scheduled = [...s.scheduled, { event: slot, month: s.month + 1 }];
      return;
    }
  }
  if (rand() < 0.015) {
    const pool = (s.government?.senators ?? []).filter((x) => !x.isSenatePresident);
    const slot = nextFree('sen_vac_', 5);
    if (pool.length > 18 && slot) {
      const pick = pool[Math.floor(rand() * pool.length)];
      s.flags = { ...s.flags, vacancy_senator: pick.id, vacancy_senator_name: SENATORS.find((x) => x.id === pick.id)?.name ?? pick.id, vacancy_senator_stance: pick.stance };
      s.scheduled = [...s.scheduled, { event: slot, month: s.month + 1 }];
    }
  }
}

/** When the country boils over, the story forces a reckoning — the presidency itself can end. */
function scheduleCrises(s: CampaignState) {
  const e = s.economy!;
  const p = s.politics;
  const pending = (id: string) => id in s.resolved || s.scheduled.some((x) => x.event === id);
  const add = (base: string) => {
    // Each chapter has its own copy of the crisis events, so they can happen again.
    const id = (s.chapter ?? 1) >= 2 ? `${base}_2` : base;
    if (!pending(id)) s.scheduled = [...s.scheduled, { event: id, month: s.month + 1 }];
  };
  if (e.approval <= 20 && p.protest >= 60) add('people_power');
  if (p.military <= 25 && p.protest >= 55) add('military_withdraws');
  if (s.month >= 20 && e.approval <= 35 && (s.flags.impeachable_offense || p.ombudsman >= 60) && s.flags.impeachment !== 'impeached') add('impeachment_second');
  if (p.ombudsman >= 70) add('ombudsman_inner_circle');
  // The economy talks back: stagnation brings people to the streets, a boom brings windfalls.
  const ec = s.economy!;
  if ((ec.growth ?? 5) < 3.8 && (ec.unemployment > 6.3 || ec.inflation > 5)) add('economic_rally');
  if ((ec.growth ?? 5) >= 6 && ec.inflation <= 4.2) add('boom_times');
  if (e.debt / e.gdp > 0.68) add('debt_alarm');
}

export function isChapterOver(s: CampaignState) {
  return s.chapterComplete || s.month > CHAPTER_LAST_MONTH[s.chapter ?? 1];
}

export { EVENTS_BY_ID };
