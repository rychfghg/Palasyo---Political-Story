import { ADVISER_POSTS, CABINET_POSTS, type Faction } from '@/data/government/cabinet';
import { SENATORS } from '@/data/government/congress';
import { REGIONS } from '@/data/world/regions';
import { EVENTS_BY_ID } from '@/data/story';
import type { Effects, StoryEvent } from '@/features/narrative/types/event';
import type { CampaignState } from '../types/campaign';
import { seededRandom } from '../utils/random';
import { fill, findNominee } from './engine';

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const seed = (s: CampaignState, extra: string) => `${s.player?.firstName}${s.player?.lastName}:${extra}`;

// ───────────────────────── Polls by region and class ─────────────────────────

export const SEGMENTS = [
  { id: 'luzara', label: 'Luzara', kind: 'region', weight: 0.55 },
  { id: 'visara', label: 'Visara', kind: 'region', weight: 0.2 },
  { id: 'mindara', label: 'Mindara', kind: 'region', weight: 0.25 },
  { id: 'classAB', label: 'Class A–B (rich)', kind: 'class', weight: 0.08 },
  { id: 'classC', label: 'Class C (middle)', kind: 'class', weight: 0.25 },
  { id: 'classD', label: 'Class D (working poor)', kind: 'class', weight: 0.5 },
  { id: 'classE', label: 'Class E (poorest)', kind: 'class', weight: 0.17 },
] as const;

const PROVINCE_REGION: Record<string, string> = {
  maynilad: 'luzara', sanfernando: 'luzara', kapatagan: 'luzara', legazpira: 'luzara',
  sugbu: 'visara', iloilanan: 'visara', tacloban: 'visara', palawira: 'visara',
  cagayan: 'mindara', marawira: 'mindara',
};
const PLACE_REGION: [RegExp, string][] = [
  [/Luzara|Maynilad|Kapatagan|Bikol|Legazpira|San Fernando|Batangira/i, 'luzara'],
  [/Visara|Sugbu|Iloilanan|Tacloban|Palawira|Visayas/i, 'visara'],
  [/Mindara|Davira|Marawira|Cagayan|Bangsa/i, 'mindara'],
];

function initPolls(s: CampaignState): Record<string, number> {
  const home = REGIONS.find((r) => r.id === s.flags.home_region);
  const group = String(home?.islandGroup ?? '');
  return {
    luzara: group === 'luzara' ? 6 : 0,
    visara: group === 'visara' ? 6 : -1,
    mindara: group === 'mindara' ? 6 : -2,
    classAB: -6,
    classC: -1,
    classD: 2,
    classE: 4,
  };
}

/** Approval in each group: national approval plus that group's lean. */
export function pollResults(s: CampaignState): { id: string; label: string; kind: string; value: number }[] {
  const base = s.economy?.approval ?? 50;
  const off = s.polls ?? centre(initPolls(s));
  return SEGMENTS.map((g) => ({ id: g.id, label: g.label, kind: g.kind, value: clamp(base + (off[g.id] ?? 0), 2, 98) }));
}

/** What elections actually count: the regions and classes, weighted by how many voters they hold. */
const TURNOUT: Record<string, number> = { luzara: 0.5, visara: 0.22, mindara: 0.28, classAB: 0.06, classC: 0.22, classD: 0.52, classE: 0.2 };

export function electoralApproval(s: CampaignState): number {
  const r = pollResults(s);
  // The poor and the provinces vote in larger numbers than they answer polls.
  const avg = (kind: string) => SEGMENTS.filter((g) => g.kind === kind).reduce((n, g) => n + TURNOUT[g.id] * (r.find((x) => x.id === g.id)?.value ?? 50), 0);
  return (avg('region') + avg('class')) / 2;
}

function pollShift(s: CampaignState, e: StoryEvent, fx: Effects) {
  const off = { ...(s.polls ?? initPolls(s)) };
  const st = (fx.stats ?? {}) as Record<string, number>;
  const add = (k: string, v: number) => (off[k] = clamp((off[k] ?? 0) + v * 0.5, -20, 20));
  if (st.inflation) { add('classD', -st.inflation * 6); add('classE', -st.inflation * 8); add('classC', -st.inflation * 3); }
  if (fx.taxRate) { add('classAB', -fx.taxRate * 18); add('classC', -fx.taxRate * 10); add('classD', fx.taxRate < 0 ? -fx.taxRate * 8 : 0); }
  if (st.poverty) { add('classD', -st.poverty * 4); add('classE', -st.poverty * 6); }
  if (st.investor) add('classAB', st.investor * 0.3);
  if (st.unemployment) { add('classD', -st.unemployment * 5); add('classC', -st.unemployment * 2); }
  if (st.corruption) { add('classAB', -st.corruption * 0.25); add('classC', -st.corruption * 0.35); }
  if (st.crime) add('classC', -st.crime * 0.25);
  if (st.protest) add('classC', -st.protest * 0.1);
  // Where the decision lands: projects, relief, or neglect in a region.
  const where = `${e.location ?? ''} ${e.title}`;
  const region = fx.asset ? PROVINCE_REGION[fx.asset.province] : PLACE_REGION.find(([re]) => re.test(where))?.[1];
  if (region) {
    const good = (fx.spend ?? 0) > 0 || !!fx.asset || (st.approval ?? 0) > 0;
    const bad = (st.approval ?? 0) < 0;
    if (good) add(region, 2);
    if (bad) add(region, -2);
  }
  s.polls = centre(off);
}

/** Offsets are relative to the national number, so they average out to zero across the population. */
function centre(off: Record<string, number>): Record<string, number> {
  const out = { ...off };
  for (const kind of ['region', 'class']) {
    const group = SEGMENTS.filter((g) => g.kind === kind);
    const mean = group.reduce((n, g) => n + g.weight * (out[g.id] ?? 0), 0);
    for (const g of group) out[g.id] = (out[g.id] ?? 0) - mean;
  }
  return out;
}

function pollsTick(s: CampaignState) {
  const e = s.economy!;
  const off = { ...(s.polls ?? initPolls(s)) };
  for (const k of Object.keys(off)) off[k] *= 0.95;
  const add = (k: string, v: number) => (off[k] = clamp((off[k] ?? 0) + v, -20, 20));
  if (e.inflation > 4) { add('classD', -(e.inflation - 4) * 0.3); add('classE', -(e.inflation - 4) * 0.4); }
  if (e.unemployment > 6) { add('classD', -(e.unemployment - 6) * 0.25); add('classC', -(e.unemployment - 6) * 0.1); }
  if ((e.growth ?? 5) > 6) add('classAB', 0.2);
  if (s.politics.crime > 60) add('classC', -0.2);
  s.polls = centre(off);
}

// ───────────────────────── Loyalty and betrayal ─────────────────────────

const PREFS: Record<Faction, Record<string, number>> = {
  technocrat: { investor: 0.4, corruption: -0.6, growth: 3, inflation: -2 },
  loyalist: { approval: 0.3, capital: 0.2 },
  party: { cohesion: 0.5, capital: 0.3, approval: 0.1 },
  activist: { corruption: -0.8, protest: -0.2, tribes: 0.4, poverty: -2 },
  military: { military: 0.6, sovereignty: -0.4, crime: -0.4 },
  business: { investor: 0.6, growth: 2 },
  clan: { cohesion: 0.4, corruption: 0.15, capital: 0.2 },
  'vice-president': { approval: 0.3, cohesion: 0.2 },
};
const DIRTY = /bribe|cover|abuse|obstruct|plunder|defied|crackdown|martial|hid_|term_extension/;

interface Person {
  key: string;
  name: string;
  role: string;
  kind: 'cabinet' | 'senator';
  post?: string;
  faction?: Faction;
  base: number;
}

function people(s: CampaignState): Person[] {
  const out: Person[] = [];
  for (const post of CABINET_POSTS) {
    const seat = s.cabinet.find((c) => c.postId === post.id);
    if (!seat?.nomineeId) continue;
    const n = findNominee(s, post.id, seat.nomineeId);
    if (!n) continue;
    const vp = seat.nomineeId === 'vice-president';
    out.push({ key: `cab:${post.id}:${seat.nomineeId}`, name: vp ? String(s.flags.vp_name ?? 'the Vice President') : n.name, role: post.title, kind: 'cabinet', post: post.id, faction: n.faction, base: vp && s.flags.vp_is_ally === false ? 30 : 20 + n.loyalty * 6 });
  }
  for (const x of s.government?.senators ?? []) {
    if (x.stance === 'opposition') continue;
    const sen = SENATORS.find((y) => y.id === x.id);
    if (sen) out.push({ key: `sen:${sen.id}`, name: `Sen. ${sen.name}`, role: x.stance === 'ally' ? 'administration senator' : 'independent senator', kind: 'senator', base: x.stance === 'ally' ? 62 : 48 });
  }
  return out;
}

function trustShift(s: CampaignState, fx: Effects) {
  const st = (fx.stats ?? {}) as Record<string, number>;
  const dirty = Object.keys(fx.flags ?? {}).some((f) => DIRTY.test(f));
  const trust = { ...(s.trust ?? {}) };
  for (const p of people(s)) {
    const cur = trust[p.key] ?? p.base;
    let d = 0;
    if (p.kind === 'cabinet') {
      for (const [k, w] of Object.entries(PREFS[p.faction ?? 'party'])) d += (st[k] ?? 0) * w;
      if (p.faction === 'technocrat') d -= (fx.spend ?? 0) / 20 + Math.max(0, fx.debt ?? 0) / 30;
      if (dirty && (p.faction === 'technocrat' || p.faction === 'activist')) d -= 6;
      if (fx.fireCabinet) d -= 1.5; // firing a colleague makes everyone nervous
    } else {
      d += (st.cohesion ?? 0) * 0.4 + (st.capital ?? 0) * 0.15 + (st.approval ?? 0) * 0.3 - (st.corruption ?? 0) * 0.2;
      if (dirty) d -= 3;
    }
    trust[p.key] = clamp(cur + clamp(d * 0.45, -3, 2), 0, 100);
  }
  s.trust = trust;
}

const HINTS_CAB = ['{name} skipped this morning’s Cabinet meeting.', '{name} was seen having dinner with opposition leaders.', 'Reporters say {name} has been “unusually quiet” in Cabinet.', '{name} stopped answering the Executive Secretary’s calls.'];
const HINTS_SEN = ['{name} skipped the coalition caucus.', '{name} was photographed at an opposition fundraiser.', '{name} voted against the leadership on a procedural motion.'];

/** Each month: trust drifts back toward each person's nature, hints appear, and the most disloyal may act. */
function trustTick(s: CampaignState, notes: string[]) {
  const trust = { ...(s.trust ?? {}) };
  const list = people(s);
  for (const p of list) trust[p.key] = (trust[p.key] ?? p.base) + (p.base - (trust[p.key] ?? p.base)) * 0.03;
  s.trust = trust;
  const r = seededRandom(seed(s, `trust:${s.month}`));
  let hinted = 0;
  for (const p of list) {
    if (hinted >= 2) break; // at most two whispers a month
    if (trust[p.key] < 40 && !s.flags[`hint_${p.key}`]) {
      hinted++;
      const pool = p.kind === 'cabinet' ? HINTS_CAB : HINTS_SEN;
      notes.push(pool[Math.floor(r() * pool.length)].replace('{name}', p.name));
      s.flags = { ...s.flags, [`hint_${p.key}`]: true };
    }
  }
  // Nobody moves against a new President in the honeymoon, and betrayals come at most every six months.
  if (s.flags.betrayer_pending || s.month < 6 || Number(s.flags.last_betrayal ?? -99) > s.month - 6) return;
  const worst = list.filter((p) => trust[p.key] < 22 && !s.flags[`betrayed_${p.key}`]).sort((a, b) => trust[a.key] - trust[b.key])[0];
  if (!worst || r() > 0.25) return;
  const guilty = Object.keys(s.flags).some((f) => DIRTY.test(f) && s.flags[f]);
  const kind = worst.kind === 'senator' ? 'defect' : guilty && r() < 0.5 ? 'testify' : 'leak';
  const copy = [1, 2, 3, 4, 5].map((i) => `b_${kind}_${i}`).find((id) => !(id in s.resolved) && !s.scheduled.some((x) => x.event === id));
  if (!copy) return;
  s.flags = { ...s.flags, betrayer_pending: true, last_betrayal: s.month, betrayer_key: worst.key, betrayer_name: worst.name, betrayer_role: worst.role, [`betrayed_${worst.key}`]: true };
  s.scheduled = [...s.scheduled, { event: copy, month: s.month + 1 }];
}

/** Carry out what the President decided about a betrayal. Returns the Cabinet post to vacate, if any. */
export function resolveBetrayal(s: CampaignState, action: NonNullable<Effects['betrayal']>, notes: string[]): string | undefined {
  const key = String(s.flags.betrayer_key ?? '');
  const name = String(s.flags.betrayer_name ?? 'The official');
  s.flags = { ...s.flags, betrayer_pending: false };
  if (action === 'reconcile') {
    s.trust = { ...(s.trust ?? {}), [key]: 55 };
    notes.push(`${name} is back in the fold — for now.`);
    return undefined;
  }
  if (key.startsWith('sen:')) {
    const id = key.slice(4);
    if (s.government) s.government = { ...s.government, senators: s.government.senators.map((x) => (x.id === id ? { ...x, stance: 'opposition' as const, isSenatePresident: false } : x)) };
    notes.push(`${name} crosses over to the opposition.`);
    return undefined;
  }
  return key.split(':')[1];
}

export function betrayalTokens(s: CampaignState): Record<string, string> {
  return { betrayer: String(s.flags.betrayer_name ?? 'one of your people'), betrayerRole: String(s.flags.betrayer_role ?? 'official') };
}

// ───────────────────────── The month's decisions, for the newspaper ─────────────────────────

function logDecision(s: CampaignState, e: StoryEvent, choiceId: string, headline?: string) {
  const c = e.choices.find((x) => x.id === choiceId);
  if (!c) return;
  const fx = c.effects;
  const st = (fx.stats ?? {}) as Record<string, number>;
  const weight = Object.values(st).reduce((n, v) => n + Math.abs(v), 0) + (fx.spend ?? 0) / 5 + Math.abs(fx.debt ?? 0) / 10 + (fx.vote ? 6 : 0) + (fx.gameOver ? 50 : 0) + (e.priority ?? 0) + (headline ? 4 : 0);
  const t = (x: string) => x; // text is filled at display time with fresh names
  s.monthLog = [...(s.monthLog ?? []), { eventId: e.id, title: t(e.title), choice: t(c.label), headline, weight, approval: st.approval ?? 0 }];
}

/** Called after every decision. */
export function afterDecision(s: CampaignState, eventId: string, choiceId: string, headline?: string) {
  const e = EVENTS_BY_ID[eventId];
  const c = e?.choices.find((x) => x.id === choiceId);
  if (!e || !c) return;
  trustShift(s, c.effects);
  pollShift(s, e, c.effects);
  logDecision(s, e, choiceId, headline);
}

/** Called at the start of each month's accounting. */
export function societyTick(s: CampaignState, notes: string[]) {
  s.lastMonthLog = s.monthLog ?? [];
  s.monthLog = [];
  pollsTick(s);
  trustTick(s, notes);
}

export { fill };
export const isAdviser = (post: string) => (ADVISER_POSTS as readonly string[]).includes(post);

// ───────────────────────── The spy and the tape ─────────────────────────

/** Plant a Haizhou spy among the seated Cabinet and pick three suspects, one of them guilty. */
export function plantSpy(s: CampaignState) {
  if (s.flags.spy_post) return;
  const seated = s.cabinet.filter((c) => c.nomineeId && c.postId !== 'executive' && c.nomineeId !== 'vice-president').map((c) => c.postId);
  if (seated.length < 3) return;
  const r = seededRandom(seed(s, 'spy'));
  const pool = [...seated].sort(() => r() - 0.5);
  const spy = pool[0];
  const suspects = [pool[0], pool[1], pool[2]].sort(() => r() - 0.5);
  s.flags = { ...s.flags, spy_post: spy, spy_s1: suspects[0], spy_s2: suspects[1], spy_s3: suspects[2] };
}

/** Accuse suspect 1, 2 or 3. Returns the post to vacate and whether you were right. */
export function accuseSpy(s: CampaignState, which: 1 | 2 | 3): { post?: string; right: boolean } {
  const post = String(s.flags[`spy_s${which}`] ?? '');
  const right = !!post && post === s.flags.spy_post;
  s.flags = { ...s.flags, spy_accused: post, spy_caught: right, spy_free: !right };
  return { post: post || undefined, right };
}

export function twistTokens(s: CampaignState): Record<string, string> {
  const out: Record<string, string> = {};
  const who = (post: string) => {
    const seat = s.cabinet.find((c) => c.postId === post);
    const n = seat?.nomineeId ? findNominee(s, post, seat.nomineeId) : undefined;
    const title = CABINET_POSTS.find((p) => p.id === post)?.title ?? 'an official';
    return { name: n?.name ?? `the acting ${title}`, title };
  };
  for (const i of [1, 2, 3]) {
    const post = String(s.flags[`spy_s${i}`] ?? '');
    if (post) {
      const w = who(post);
      out[`suspect${i}`] = w.name;
      out[`suspect${i}Role`] = w.title;
    }
  }
  if (s.flags.spy_post) {
    out.spy = who(String(s.flags.spy_post)).name;
    out.spyRole = who(String(s.flags.spy_post)).title;
  }
  if (s.flags.spy_accused) out.accused = who(String(s.flags.spy_accused)).name;
  // The tape: the most damning thing you have decided so far, in your own words.
  const past = Object.entries(s.resolved)
    .map(([eid, cid]) => ({ e: EVENTS_BY_ID[eid], c: EVENTS_BY_ID[eid]?.choices.find((x) => x.id === cid) }))
    .filter((x) => x.e && x.c);
  const score = (x: (typeof past)[number]) => {
    const fx = x.c!.effects;
    const st = (fx.stats ?? {}) as Record<string, number>;
    return (Object.keys(fx.flags ?? {}).some((f) => DIRTY.test(f)) ? 20 : 0) + (st.corruption ?? 0) * 2 - (st.approval ?? 0);
  };
  const worst = [...past].sort((a, b) => score(b) - score(a))[0];
  // Names inside the quote are replaced with plain words (the tape is filled before names are known).
  out.tapeLine = worst ? worst.c!.label.replace(/{[^}]+}/g, 'them').replace(/[“”"]/g, '') : 'Handle it quietly';
  out.tapeTopic = worst ? worst.e!.title.replace(/{[^}]+}/g, 'the matter') : 'a Cabinet matter';
  return out;
}
