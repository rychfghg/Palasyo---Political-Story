import { MESSAGES, type MessageTemplate } from '@/data/story/messages';
import type { Effects } from '@/features/narrative/types/event';
import type { CampaignState, EventReport } from '../types/campaign';
import { seededRandom } from '../utils/random';
import { applyEffects, check, fill, tokens } from './engine';
import { monthLabel } from './calendar';

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const seed = (s: CampaignState, extra: string) => `${s.player?.firstName}${s.player?.lastName}:${extra}`;

/** Applies a set of effects outside a story event and returns the notes it produced. */
export function applyLoose(s: CampaignState, fx: Effects, id: string): string[] {
  const report: EventReport = { eventId: id, choiceId: id, outcome: '', reactions: [], deltas: [], notes: [] };
  applyEffects(s, fx, report, seed(s, `${id}:${s.month}`));
  return report.notes;
}

// ───────────────────────── The phone ─────────────────────────

export function messageTemplate(id: string): MessageTemplate | undefined {
  return MESSAGES.find((m) => m.id === id);
}

/** Each month: unanswered texts expire (with consequences), and one or two new ones arrive. */
export function messagesTick(s: CampaignState, notes: string[]) {
  const inbox = [...(s.inbox ?? [])];
  for (const msg of inbox) {
    if (msg.answered !== undefined || msg.expired || msg.expires > s.month) continue;
    msg.expired = true;
    const tpl = messageTemplate(msg.tpl);
    if (tpl?.ignore) {
      notes.push(...applyLoose(s, tpl.ignore.effects, `msg:${tpl.id}:ignored`));
      notes.push(fill(tpl.ignore.note, tokens(s)));
    }
  }
  const r = seededRandom(seed(s, `inbox:${s.month}`));
  const eligible = MESSAGES.filter((m) => !s.flags[`msg_${m.id}`] && s.month >= (m.from_month ?? 0) && s.month <= (m.to_month ?? 99) && (m.when ?? []).every((c) => check(s, c)));
  const count = r() < 0.55 ? 1 : r() < 0.8 ? 2 : 0;
  const picked = [...eligible].sort(() => r() - 0.5).slice(0, count);
  for (const m of picked) {
    inbox.unshift({ id: `${m.id}:${s.month}`, tpl: m.id, month: s.month, expires: s.month + (m.expires ?? 2), read: false });
    s.flags = { ...s.flags, [`msg_${m.id}`]: true };
  }
  s.inbox = inbox.slice(0, 40);
}

export function answerMessage(s: CampaignState, id: string, option: number): string {
  const msg = s.inbox?.find((m) => m.id === id);
  const tpl = msg && messageTemplate(msg.tpl);
  if (!msg || !tpl || msg.answered !== undefined || msg.expired) return '';
  const opt = tpl.options[option];
  if (!opt) return '';
  const notes = applyLoose(s, opt.effects, `msg:${tpl.id}:${option}`);
  const outcome = fill(opt.outcome, tokens(s));
  s.inbox = (s.inbox ?? []).map((m) => (m.id === id ? { ...m, answered: option, read: true, outcome } : m));
  return [outcome, ...notes].join(' ');
}

// ───────────────────────── Press conferences ─────────────────────────

export type Tone = 'honest' | 'dodge' | 'attack' | 'joke';
export interface PressQuestion {
  reporter: string;
  outlet: string;
  text: string;
  topicGood: boolean;
}

const REPORTERS = [
  ['Lia Navarro', 'Pahayagang Liwayway'],
  ['Dante Ocampo', 'Tinig ng Bayan'],
  ['Mara Quiogue', 'Kapuluan Daily Herald'],
  ['Jun Sevilla', 'Radyo Bayan 990'],
  ['Kat Mendiola', 'Agos Online'],
];

/** Three questions: the month's biggest decisions, plus whatever the country is worried about. */
export function pressQuestions(s: CampaignState): PressQuestion[] {
  const t = tokens(s);
  const r = seededRandom(seed(s, `press:${s.month}`));
  const qs: PressQuestion[] = [];
  const log = [...(s.lastMonthLog ?? []), ...(s.monthLog ?? [])].sort((a, b) => b.weight - a.weight);
  for (const d of log.slice(0, 2)) {
    const title = fill(d.title, t);
    const choice = fill(d.choice, t).replace(/[“”"]/g, '');
    qs.push({ reporter: '', outlet: '', topicGood: d.approval >= 0, text: d.approval >= 0 ? `On “${title}”, you chose to ${choice.charAt(0).toLowerCase() + choice.slice(1)}. Critics say it was for show. What do you say?` : `On “${title}”, your decision to ${choice.charAt(0).toLowerCase() + choice.slice(1)} is unpopular. Will you reconsider?` });
  }
  const e = s.economy!;
  const topical: [boolean, string][] = [
    [e.inflation > 4, `Prices are up ${e.inflation.toFixed(1)}% this year. Families are cutting meals. What is the Palasyo doing?`],
    [s.politics.corruption > 55, 'Surveys say most people think corruption is worse under you. Are they wrong?'],
    [(e.debt / e.gdp) * 100 > 65, `Debt is now ${((e.debt / e.gdp) * 100).toFixed(0)}% of GDP. Are you mortgaging our children’s future?`],
    [s.politics.sovereignty > 70, 'Haizhou ships are back near Pag-asa Island. Are we going to war — or giving up?'],
    [e.unemployment > 6.5, `Unemployment is ${e.unemployment.toFixed(1)}%. Where are the jobs you promised?`],
    [true, `Your approval is ${Math.round(e.approval)}%. Do you read the surveys?`],
  ];
  for (const [ok, text] of topical) if (ok && qs.length < 3) qs.push({ reporter: '', outlet: '', topicGood: false, text });
  return qs.slice(0, 3).map((q) => {
    const [reporter, outlet] = REPORTERS[Math.floor(r() * REPORTERS.length)];
    return { ...q, reporter, outlet };
  });
}

/** The effect of one answer. Spokesperson skill softens the blows; jokes can backfire. */
export function pressAnswer(s: CampaignState, q: PressQuestion, tone: Tone, index: number): { line: string; fx: Effects } {
  const r = seededRandom(seed(s, `press-answer:${s.month}:${index}`))();
  const fx: Effects = { stats: {} };
  const st = fx.stats as Record<string, number>;
  let line = '';
  if (tone === 'honest') {
    st.media = -2;
    st.approval = q.topicGood ? 1 : -0.5;
    st.capital = 1;
    line = 'Your candor wins grudging respect in the newsrooms.';
  } else if (tone === 'dodge') {
    st.media = 2;
    line = 'You talk for two minutes and say nothing. Reporters notice.';
  } else if (tone === 'attack') {
    st.media = 5;
    st.approval = -1;
    st.cohesion = 1;
    line = 'Your base loves it. The press corps closes ranks against you.';
  } else if (r < 0.3) {
    st.media = 4;
    st.approval = -2;
    line = 'The joke lands badly. By evening it is a meme — and not the good kind.';
  } else {
    st.media = -1;
    st.approval = 1.5;
    line = 'The room laughs. The clip goes viral for the right reasons.';
  }
  return { line, fx };
}

// ───────────────────────── State of the Nation Address ─────────────────────────

export interface Brag {
  id: string;
  label: string;
  true: boolean;
}

/** What you could claim in the speech — and whether it is actually true. */
export function sonaBrags(s: CampaignState): Brag[] {
  const e = s.economy!;
  const p = s.politics;
  const start = s.debtTally?.start ?? e.debt;
  return [
    { id: 'growth', label: `“Our economy is booming”`, true: (e.growth ?? 5) >= 5.5 },
    { id: 'prices', label: '“Prices are under control”', true: e.inflation <= 4 },
    { id: 'jobs', label: '“There are more jobs than ever”', true: e.unemployment <= 5.8 },
    { id: 'investments', label: '“Investors are pouring in”', true: (s.assets ?? []).filter((a) => !a.failed).length >= 6 },
    { id: 'laws', label: `“This Congress has passed historic laws”`, true: s.laws.length >= 5 },
    { id: 'clean', label: '“We are winning the war on corruption”', true: p.corruption <= 50 },
    { id: 'debt', label: '“We are paying down the debt”', true: e.debt <= start },
    { id: 'westsea', label: '“Our seas are secure”', true: p.sovereignty <= 55 },
  ];
}

export const SONA_PROMISES = [
  { id: 'inflation', label: 'Inflation below 4% by next year', check: (s: CampaignState) => s.economy!.inflation < 4 },
  { id: 'jobs', label: 'Unemployment below 5.5% by next year', check: (s: CampaignState) => s.economy!.unemployment < 5.5 },
  { id: 'debt', label: 'A lower debt ratio by next year', check: (s: CampaignState, base: number) => (s.economy!.debt / s.economy!.gdp) * 100 < base },
  { id: 'corruption', label: 'Cut corruption sharply', check: (s: CampaignState, base: number) => s.politics.corruption <= base - 5 },
  { id: 'investments', label: 'Five new income-earning investments', check: (s: CampaignState, base: number) => (s.assets ?? []).filter((a) => !a.failed).length >= base + 5 },
  { id: 'notax', label: 'No new taxes', check: (s: CampaignState, base: number) => s.taxRate <= base + 0.0005 },
  { id: 'growth', label: 'Growth above 6%', check: (s: CampaignState) => (s.economy!.growth ?? 5) > 6 },
];

const baseline = (s: CampaignState, id: string) =>
  id === 'debt' ? (s.economy!.debt / s.economy!.gdp) * 100 : id === 'corruption' ? s.politics.corruption : id === 'investments' ? (s.assets ?? []).filter((a) => !a.failed).length : id === 'notax' ? s.taxRate : 0;

export const SONA_TARGETS = [
  { id: 'none', label: 'Attack no one — unite the country', fx: { stats: { media: -2, cohesion: 1 } } as Effects },
  { id: 'opposition', label: 'The opposition', fx: { stats: { cohesion: 3, protest: 3, approval: -0.5 } } as Effects },
  { id: 'oligarchs', label: 'The oligarchs', fx: { stats: { approval: 2, investor: -3 } } as Effects },
  { id: 'haizhou', label: 'Haizhou', fx: { stats: { approval: 2, sovereignty: 5, investor: -1 } } as Effects },
  { id: 'delapaz', label: 'The Dela Paz administration', fx: { stats: { approval: 1, cohesion: -1 } } as Effects },
];

export function sonaDue(s: CampaignState) {
  return s.month >= 12 && s.month % 12 === 0 && !s.flags[`sona_${s.month}`];
}

export function deliverSona(s: CampaignState, brags: string[], promises: string[], target: string): string[] {
  const all = sonaBrags(s);
  const lines: string[] = [];
  const st: Record<string, number> = {};
  for (const id of brags) {
    const b = all.find((x) => x.id === id);
    if (!b) continue;
    if (b.true) { st.approval = (st.approval ?? 0) + 1.5; lines.push(`${b.label} — fact-checkers agree.`); }
    else { st.approval = (st.approval ?? 0) - 2; st.media = (st.media ?? 0) + 3; lines.push(`${b.label} — fact-checkers call it false.`); }
  }
  const tgt = SONA_TARGETS.find((x) => x.id === target) ?? SONA_TARGETS[0];
  applyLoose(s, { stats: st }, 'sona');
  applyLoose(s, tgt.fx, 'sona-target');
  s.promises = [...(s.promises ?? []), ...promises.map((id) => ({ id, made: s.month, due: s.month + 12, base: baseline(s, id) }))];
  s.flags = { ...s.flags, [`sona_${s.month}`]: true };
  s.news = [{ month: s.month, headline: `SONA: PRESIDENT PROMISES ${promises.length ? SONA_PROMISES.find((p) => p.id === promises[0])?.label.toUpperCase() : 'UNITY'}` }, ...s.news].slice(0, 60);
  if (promises.length) lines.push(`You promised: ${promises.map((id) => SONA_PROMISES.find((p) => p.id === id)?.label).join('; ')}. The country will check in a year.`);
  return lines;
}

/** Promises fall due a year later: kept or broken. */
export function promisesTick(s: CampaignState, notes: string[]) {
  const due = (s.promises ?? []).filter((p) => p.due === s.month && p.kept === undefined);
  if (!due.length) return;
  s.promises = (s.promises ?? []).map((p) => {
    if (p.due !== s.month || p.kept !== undefined) return p;
    const def = SONA_PROMISES.find((x) => x.id === p.id);
    const kept = !!def?.check(s, p.base);
    notes.push(kept ? `Promise kept: ${def?.label}.` : `Promise broken: ${def?.label}. The opposition replays your speech.`);
    applyLoose(s, kept ? { stats: { approval: 3, capital: 3 } } : { stats: { approval: -4, media: 4 } }, `promise:${p.id}`);
    return { ...p, kept };
  });
}

export function promiseLabel(id: string) {
  return SONA_PROMISES.find((p) => p.id === id)?.label ?? id;
}

export function pressDue(s: CampaignState) {
  return s.month >= 2 && s.month % 3 === 2 && !s.flags[`press_${s.month}`];
}

export { clamp, monthLabel };
