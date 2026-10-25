import { ADVISER_POSTS, CABINET_POSTS } from '@/data/government/cabinet';
import { randomName } from '@/data/government/generated';
import { EVENTS_BY_ID } from '@/data/story';
import { peso } from '@/features/economy/utils/finance';
import type { Effects } from '@/features/narrative/types/event';
import type { Mood } from '@/shared/components/ui/Portrait';
import type { CampaignState, CentralBank, Gocc, Official } from '../types/campaign';
import { seededRandom } from '../utils/random';
import { monthLabel } from './calendar';
import { findNominee, spendMoney, tallyDebt } from './engine';

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const seed = (s: CampaignState, extra: string) => `${s.player?.firstName}${s.player?.lastName}:${extra}`;

export interface ActionResult {
  ok: boolean;
  message: string;
}

// ───────────────────────── People ─────────────────────────

const TITLES = ['Dr.', 'Atty.', '', '', 'Engr.'];
const BACKGROUNDS = [
  'Career central banker, 30 years in the bank',
  'Former chief economist of a big commercial bank',
  'Economics professor at the state university',
  'Former finance undersecretary',
  'Investment banker who managed a regional fund',
  'Accountant and former audit commissioner',
  'Former executive of a family conglomerate',
  'Ally of the previous administration',
];

/** A random name nobody else in the game has. */
function uniqueName(key: string, taken?: Set<string>) {
  let n = randomName(`${key}:name`);
  for (let i = 1; taken && taken.has(n) && i < 40; i++) n = randomName(`${key}:name:${i}`);
  taken?.add(n);
  return n;
}

/** A randomly generated official. `bias` shifts their integrity and loyalty. */
const bare = (n: string) => n.replace(/^(Atty.|Dr.|Engr.|Gen. (Ret.)|Col. (Ret.)|Justice (Ret.)|Gen.|Sen.|Rep.|Gov.|Mayor|Prof.|Amb.|Justice|Dean|Ka)s*/, '').trim();

/** Every name already in use, so a new official never shares a name with someone else. */
export function takenNames(s: CampaignState): Set<string> {
  const out = new Set<string>();
  const put = (n?: string) => n && out.add(bare(n));
  for (const p of CABINET_POSTS) p.nominees.forEach((n) => put(n.name));
  Object.values(s.extraNominees ?? {}).forEach((l) => l.forEach((n) => put(n.name)));
  s.government?.house.leaders.forEach((l) => put(l.name));
  if (s.centralBank) { put(s.centralBank.governor.name); s.centralBank.board.forEach((b) => put(b.name)); }
  (s.goccs ?? []).forEach((g) => { put(g.ceo.name); g.board.forEach((b) => put(b.name)); (g.candidates ?? []).forEach((b) => put(b.name)); });
  return out;
}

export function makeOfficial(key: string, opts: { title?: string; background?: string; competence?: number; integrity?: number; loyalty?: number } = {}, taken?: Set<string>): Official {
  const r = seededRandom(key);
  const stat = (base: number | undefined, def: number) => clamp(Math.round((base ?? def) + (r() - 0.5) * 4), 2, 10);
  const title = opts.title ?? TITLES[Math.floor(r() * TITLES.length)];
  return {
    name: `${title ? `${title} ` : ''}${uniqueName(key, taken)}`,
    background: opts.background ?? BACKGROUNDS[Math.floor(r() * BACKGROUNDS.length)],
    competence: stat(opts.competence, 7),
    integrity: stat(opts.integrity, 7),
    loyalty: stat(opts.loyalty, 5),
  };
}

// ───────────────────────── Central bank ─────────────────────────

export function initCentralBank(s: CampaignState): CentralBank {
  const k = seed(s, 'bsk');
  const taken = takenNames(s);
  return {
    governor: makeOfficial(`${k}:gov`, { title: 'Dr.', background: 'Appointed by President Dela Paz in 2025; a career central banker', competence: 8, integrity: 8, loyalty: 4 }, taken),
    board: Array.from({ length: 6 }, (_, i) => makeOfficial(`${k}:board:${i}`, { loyalty: 4 }, taken)),
    // Governors serve six-year terms; this one was appointed in mid-2025.
    governorTermEnds: 47,
    rate: 5.75,
    peso: 58.2,
    reserves: 102,
    independence: 75,
    advice: 'The Bangko Sentral will keep prices stable. We ask the Palasyo to keep borrowing in check so we do not have to raise rates.',
    lastAction: 'Rates held at 5.75%.',
    pesoHistory: [58.2],
  };
}

/**
 * The Monetary Board meets every month: it sets rates by the book (a Taylor rule) and defends the
 * peso with reserves. The governor tells the President what the numbers mean.
 */
export function centralBankTick(s: CampaignState, notes: string[], borrowed: number) {
  if (!s.centralBank) s.centralBank = initCentralBank(s);
  const cb = { ...s.centralBank };
  const e = s.economy!;
  const p = s.politics;
  const r = seededRandom(seed(s, `bsk:${s.month}`));
  const ratio = (e.debt / e.gdp) * 100;
  const deficitPct = ((borrowed * 12) / e.gdp) * 100;
  const growth = e.growth ?? 5.5;
  const hist = cb.pesoHistory;
  const sixAgo = hist[Math.max(0, hist.length - 6)] ?? cb.peso;
  const slide = ((cb.peso - sixAgo) / sixAgo) * 100; // % the peso weakened in six months

  // ─── Interest rates ───
  // A Taylor-style rule on inflation (target 3%) and growth, plus defense of a sliding peso.
  // Neutral rate ~5.25% at 3% inflation and normal growth, matching how the economy responds to rates.
  const target = clamp(5.25 + 1.5 * (e.inflation - 3) - 0.5 * (5.5 - growth) + Math.max(0, slide) * 0.35, 2, 12);
  const gap = target - cb.rate;
  let move = 0;
  if (Math.abs(gap) >= 0.4) move = gap > 0 ? (gap > 1.2 ? 0.5 : 0.25) : gap < -1.2 ? -0.5 : -0.25;
  const why =
    move > 0
      ? e.inflation > 4
        ? `inflation at ${e.inflation.toFixed(1)}% is above the 2–4% target`
        : slide > 2
          ? `the peso has lost ${slide.toFixed(1)}% in six months`
          : 'prices are rising faster than the economy can absorb'
      : move < 0
        ? growth < 4.5
          ? `growth has slowed to ${growth.toFixed(1)}%`
          : `inflation at ${e.inflation.toFixed(1)}% leaves room to ease`
        : '';
  if (move !== 0) {
    cb.rate = Math.round((cb.rate + move) * 100) / 100;
    cb.lastAction = `${monthLabel(s.month)}: the Monetary Board ${move > 0 ? 'raised' : 'cut'} rates by ${Math.abs(move * 100)} basis points to ${cb.rate.toFixed(2)}% because ${why}.`;
    notes.push(`Bangko Sentral ${move > 0 ? 'raises' : 'cuts'} its policy rate to ${cb.rate.toFixed(2)}% — ${why}.`);
  } else cb.lastAction = `${monthLabel(s.month)}: rates held at ${cb.rate.toFixed(2)}% — inflation ${e.inflation.toFixed(1)}%, growth ${growth.toFixed(1)}%.`;

  // ─── The peso ───
  // Weakened by inflation, debt, deficits, nervous investors, and West Sea tension; strengthened by higher rates,
  // confident investors, remittances, and a credible central bank.
  const drift =
    (e.inflation - 3) * 0.0012 +
    Math.max(0, ratio - 60) * 0.0005 +
    Math.min(0.006, Math.max(0, deficitPct - 3) * 0.0012) -
    (cb.rate - 5.5) * 0.0008 -
    (p.investor - 50) * 0.00015 +
    Math.max(0, p.sovereignty - 70) * 0.0002 -
    (cb.independence - 60) * 0.00005 -
    0.0003 + // steady remittances from workers abroad
    (r() - 0.5) * 0.01;
  // Markets pull the peso back toward a fair value that drifts with how much faster prices rise at home than abroad.
  const months = Math.max(0, s.month);
  const fair = 58.2 * Math.pow(1 + (e.inflation - 2.5) / 1200, months);
  const pull = ((fair - cb.peso) / cb.peso) * 0.04;
  let next = cb.peso * (1 + clamp(drift + pull, -0.015, 0.015));
  // Intervention: the bank sells reserves to stop a fast slide.
  const threeAgo = hist[Math.max(0, hist.length - 3)] ?? cb.peso;
  let sold = 0;
  if (next > threeAgo * 1.025 && cb.reserves > 60) {
    sold = Math.round((2 + r() * 3) * 10) / 10;
    next = next - (next - cb.peso) * 0.6;
    notes.push(`The Bangko Sentral sold $${sold}B of reserves to defend the peso.`);
    cb.lastAction += ` It also sold $${sold}B of reserves to steady the peso.`;
  }
  // Reserves: remittances and exports add; investor flight and interventions drain.
  const inflow = 0.35 + (p.investor - 50) * 0.012 + (growth - 5) * 0.05 + (r() - 0.5) * 0.4;
  cb.reserves = Math.round(clamp(cb.reserves + inflow - sold, 20, 250) * 10) / 10;

  // A weaker peso makes the foreign-currency share of the debt (about 30%) more expensive in pesos.
  const pesoChange = (next - cb.peso) / cb.peso;
  if (s.economy && Math.abs(pesoChange) > 0.0005) {
    const reval = Math.round(e.debt * 0.3 * pesoChange * 10) / 10;
    s.economy = { ...s.economy, debt: s.economy.debt + reval };
    tallyDebt(s, { revaluation: reval });
    if (Math.abs(reval) >= 20) notes.push(`${reval > 0 ? 'The weaker' : 'The stronger'} peso ${reval > 0 ? 'added' : 'took'} ${peso(Math.abs(reval))} ${reval > 0 ? 'to' : 'off'} the foreign-currency debt.`);
  }
  cb.peso = Math.round(next * 100) / 100;
  cb.pesoHistory = [...hist, cb.peso].slice(-36);
  cb.independence = clamp(cb.independence + (75 - cb.independence) * 0.03, 0, 100);

  // ─── The governor's advice: the most pressing issue, not a random one ───
  const g = cb.governor.name;
  const issues: { weight: number; tone: 'warn' | 'ok' | 'good'; text: string }[] = [];
  if (e.inflation > 4) issues.push({ weight: (e.inflation - 4) * 3, tone: 'warn', text: `“Inflation at ${e.inflation.toFixed(1)}% is above our 2–4% target. We are keeping rates at ${cb.rate.toFixed(2)}%. Please do not add new spending while we fight it.”` });
  if (slide > 2) issues.push({ weight: slide * 1.5, tone: 'warn', text: `“The peso has lost ${slide.toFixed(1)}% in six months, to ₱${cb.peso.toFixed(2)}. Imported fuel and rice now cost more. A credible plan to cut the deficit is the best defense.”` });
  if (deficitPct > 3.5) issues.push({ weight: deficitPct - 3, tone: 'warn', text: `“The government borrowed ${peso(borrowed)} last month — a deficit near ${deficitPct.toFixed(1)}% of GDP. If this continues, the peso weakens and we must raise rates.”` });
  if (ratio > 65) issues.push({ weight: (ratio - 65) * 0.6, tone: 'warn', text: `“Debt at ${ratio.toFixed(1)}% of GDP worries investors. Every new loan pushes the peso down and your borrowing costs up.”` });
  if (cb.reserves < 75) issues.push({ weight: (75 - cb.reserves) * 0.3, tone: 'warn', text: `“Reserves are down to $${cb.reserves.toFixed(1)}B. We cannot keep defending the peso forever.”` });
  if (p.investor < 40) issues.push({ weight: (40 - p.investor) * 0.2, tone: 'warn', text: `“Foreign investors are pulling money out. Capital flight weakens the peso faster than anything we can do.”` });
  if (growth < 3.5) issues.push({ weight: (3.5 - growth) * 2, tone: 'warn', text: `“Growth has slowed to ${growth.toFixed(1)}% and unemployment is ${e.unemployment.toFixed(1)}%. We are easing rates — the government should spend on things that create jobs.”` });
  if (p.sovereignty > 75) issues.push({ weight: (p.sovereignty - 75) * 0.15, tone: 'warn', text: '“Tension in the West Sea is scaring shipping insurers and investors. It shows up in the peso.”' });
  if (!issues.length) {
    if (e.inflation < 2.2) issues.push({ weight: 0, tone: 'ok', text: `“Prices are calm at ${e.inflation.toFixed(1)}%. We have room to cut rates and help growth.”` });
    else if (slide < -1.5) issues.push({ weight: 0, tone: 'good', text: `“The peso has strengthened to ₱${cb.peso.toFixed(2)}. Investor confidence is paying off.”` });
    else issues.push({ weight: 0, tone: 'good', text: `“Inflation is ${e.inflation.toFixed(1)}%, within target, and the peso is steady at ₱${cb.peso.toFixed(2)}. Keep the deficit where it is.”` });
  }
  const top = issues.sort((a, b) => b.weight - a.weight)[0];
  cb.advice = `Governor ${g}: ${top.text}`;
  cb.adviceTone = top.tone;

  // The governor's term ends: the President appoints a new one on the Agenda.
  if (s.month === cb.governorTermEnds) {
    s.flags = { ...s.flags, bsk_governor_vacant: true };
    notes.push(`Governor ${g}’s six-year term has ended. Choosing the next governor is on your Agenda.`);
  }
  s.centralBank = cb;
}

/** How the central bank changes the economy's pull (used by the monthly drift). */
export function monetaryEffect(s: CampaignState) {
  const cb = s.centralBank;
  if (!cb) return { inflation: 0, growth: 0 };
  return {
    // High rates cool prices and growth; a weak peso makes imports dearer.
    inflation: -(cb.rate - 5.5) * 0.35 + (cb.peso - 58) * 0.08,
    growth: -(cb.rate - 5.5) * 0.25,
  };
}

export type BankRequest = 'cut' | 'defend' | 'hold';

/** Ask the independent central bank for something. It may say no — and markets watch. */
export function pressureBank(s: CampaignState, request: BankRequest): ActionResult {
  const cb = s.centralBank;
  if (!cb) return { ok: false, message: 'No central bank.' };
  if ((s.cooldowns?.bsk ?? -99) > s.month) return { ok: false, message: 'The governor already met you recently. Try again next quarter.' };
  s.cooldowns = { ...(s.cooldowns ?? {}), bsk: s.month + 3 };
  const r = seededRandom(seed(s, `bsk-ask:${request}:${s.month}`))();
  const g = cb.governor;
  if (request === 'hold') {
    s.centralBank = { ...cb, independence: clamp(cb.independence + 6, 0, 100), advice: `Governor ${g.name}: “Thank you, ${s.player?.honorific === 'Ginoong' ? 'Mr.' : 'Madam'} President. The markets noticed.”` };
    s.politics = { ...s.politics, investor: clamp(s.politics.investor + 2, 0, 100) };
    return { ok: true, message: 'You publicly back the bank’s independence. Investors are reassured.' };
  }
  if (request === 'cut') {
    const chance = clamp(0.15 + (g.loyalty - 5) * 0.08 + (100 - cb.independence) / 200 - (s.economy!.inflation - 3.5) * 0.1, 0.03, 0.85);
    if (r < chance) {
      s.centralBank = { ...cb, rate: Math.round((cb.rate - 0.5) * 100) / 100, independence: clamp(cb.independence - 15, 0, 100), lastAction: `The board cut rates by 50 basis points after meeting the President.` };
      s.politics = { ...s.politics, investor: clamp(s.politics.investor - 3, 0, 100) };
      return { ok: true, message: `The Monetary Board cuts rates to ${(cb.rate - 0.5).toFixed(2)}%. Growth will get a lift — but markets now doubt the bank’s independence, and the peso may slide.` };
    }
    s.centralBank = { ...cb, advice: `Governor ${g.name}: “With respect, the Monetary Board will not cut rates while inflation is at ${s.economy!.inflation.toFixed(1)}%. Cutting now would weaken the peso.”` };
    return { ok: false, message: `The governor refuses: “Cutting now would weaken the peso and raise prices.” The refusal leaks to the press.` };
  }
  // defend
  if (cb.reserves < 55) return { ok: false, message: `The governor says reserves ($${cb.reserves}B) are too low to spend on the peso.` };
  s.centralBank = { ...cb, reserves: Math.round((cb.reserves - 6) * 10) / 10, peso: Math.round(cb.peso * 0.98 * 100) / 100, lastAction: 'At the President’s request, the bank sold $6B in reserves to strengthen the peso.' };
  return { ok: true, message: 'The bank sells $6B of reserves. The peso strengthens 2% — for now.' };
}

/** Candidates when the governor's term ends. */
export function governorCandidates(s: CampaignState): Official[] {
  const taken = takenNames(s);
  return [0, 1, 2].map((i) => makeOfficial(seed(s, `bsk-cand:${s.month}:${i}`), { title: 'Dr.', competence: [9, 7, 6][i], integrity: [9, 7, 5][i], loyalty: [4, 6, 9][i], background: ['Deputy governor, career central banker', 'Chief economist of the largest bank', 'Your campaign’s economic adviser'][i] }, taken));
}

export function appointGovernor(s: CampaignState, o: Official): ActionResult {
  if (!s.centralBank || !s.flags.bsk_governor_vacant) return { ok: false, message: 'There is no vacancy.' };
  const indep = clamp(40 + o.integrity * 4 + o.competence * 2 - o.loyalty * 3, 20, 95);
  s.centralBank = { ...s.centralBank, governor: o, governorTermEnds: s.month + 72, independence: indep, advice: `Governor ${o.name}: “I will keep prices stable and the peso steady.”` };
  s.flags = { ...s.flags, bsk_governor_vacant: false };
  s.politics = { ...s.politics, investor: clamp(s.politics.investor + (o.loyalty >= 8 ? -4 : 3), 0, 100) };
  return { ok: true, message: `${o.name} is the new Bangko Sentral governor.${o.loyalty >= 8 ? ' Markets fear a governor too close to the Palasyo.' : ''}` };
}

// ───────────────────────── Government-owned corporations ─────────────────────────

interface GoccTemplate {
  id: string;
  name: string;
  focus: string;
  description: string;
  ceoTitle: string;
  cost: number;
  baseIncome: number;
  jobs: number;
  build: number;
}

const INHERITED: GoccTemplate[] = [
  { id: 'npc', name: 'Kapuluan National Power Corporation', focus: 'Energy', description: 'Runs the old state dams and power plants and sells electricity to the grid.', ceoTitle: 'President and CEO', cost: 0, baseIncome: 0.9, jobs: 9_000, build: 0 },
  { id: 'kpa', name: 'Kapuluan Ports Authority', focus: 'Ports and shipping', description: 'Manages 120 ports, collects cargo and passenger fees.', ceoTitle: 'General Manager', cost: 0, baseIncome: 1.2, jobs: 7_500, build: 0 },
  { id: 'kagc', name: 'Kapuluan Amusement and Gaming Corporation', focus: 'Casinos and lottery', description: 'Licenses casinos and runs the national lottery. Its profits fund health and charity — and tempt every politician.', ceoTitle: 'Chairman and CEO', cost: 0, baseIncome: 2.4, jobs: 5_000, build: 0 },
];

export const NEW_GOCCS: GoccTemplate[] = [
  { id: 'nrc', name: 'Kapuluan National Railways Corporation', focus: 'Railways', description: 'Builds and runs intercity trains. Fares and station land pay it back slowly.', ceoTitle: 'General Manager', cost: 30, baseIncome: 0.22, jobs: 12_000, build: 12 },
  { id: 'kdi', name: 'Kapuluan Digital Infrastructure Corporation', focus: 'Internet and data', description: 'Builds cell towers and data centers and rents them to every carrier.', ceoTitle: 'President and CEO', cost: 20, baseIncome: 0.18, jobs: 4_000, build: 9 },
  { id: 'kfc', name: 'Kapuluan Food Terminal Corporation', focus: 'Food supply', description: 'Buys rice and vegetables from farmers at fair prices and sells them in city markets.', ceoTitle: 'Administrator', cost: 10, baseIncome: 0.07, jobs: 8_000, build: 6 },
  { id: 'kte', name: 'Tourism Infrastructure and Enterprise Zone Authority', focus: 'Tourism', description: 'Develops beach and heritage resorts and leases them to operators.', ceoTitle: 'Chief Operating Officer', cost: 14, baseIncome: 0.12, jobs: 9_000, build: 10 },
  { id: 'kmd', name: 'Kapuluan Mining Development Corporation', focus: 'Mining', description: 'Holds the state’s share of mines and sells nickel and copper abroad.', ceoTitle: 'President and CEO', cost: 18, baseIncome: 0.2, jobs: 6_000, build: 8 },
  { id: 'kwa', name: 'National Water Resources Corporation', focus: 'Water', description: 'Builds dams and treatment plants and sells bulk water to cities.', ceoTitle: 'Administrator', cost: 16, baseIncome: 0.13, jobs: 5_000, build: 14 },
  { id: 'kad', name: 'Kapuluan Airports Development Corporation', focus: 'Airports', description: 'Runs provincial airports and charges terminal and landing fees.', ceoTitle: 'General Manager', cost: 22, baseIncome: 0.2, jobs: 7_000, build: 12 },
];

export function initGoccs(s: CampaignState): Gocc[] {
  const taken = takenNames(s);
  return INHERITED.map((t) => ({
    id: t.id,
    name: t.name,
    focus: t.focus,
    description: t.description,
    ceoTitle: t.ceoTitle,
    // Installed by the previous administration: competent enough, but not always clean.
    ceo: makeOfficial(seed(s, `gocc:${t.id}:ceo`), { background: 'Appointed in the final year of the Dela Paz administration', integrity: 5, loyalty: 2 }, taken),
    board: Array.from({ length: 5 }, (_, i) => makeOfficial(seed(s, `gocc:${t.id}:board:${i}`), { loyalty: 3 }, taken)),
    appointedBy: 'previous',
    baseIncome: t.baseIncome,
    jobs: t.jobs,
    founded: -60,
    opensMonth: -1,
    earned: 0,
  }));
}

/** A corporation's dividend this month: good managers earn more, crooked ones leak money. */
export function goccPay(g: Gocc, month: number) {
  if (g.opensMonth > month) return 0;
  const boardAvg = g.board.reduce((n, b) => n + b.competence + b.integrity, 0) / Math.max(1, g.board.length) / 2;
  const perf = 0.55 + g.ceo.competence * 0.05 + (g.ceo.integrity - 5) * 0.04 + (boardAvg - 6) * 0.03;
  return Math.max(0, g.baseIncome * perf);
}

export function goccTick(s: CampaignState, notes: string[]): number {
  if (!s.goccs) s.goccs = initGoccs(s);
  let total = 0;
  s.goccs = s.goccs.map((g) => {
    const pay = goccPay(g, s.month);
    total += pay;
    if (g.opensMonth === s.month) notes.push(`${g.name} begins operations.`);
    return pay > 0 ? { ...g, earned: g.earned + pay } : g;
  });
  // A crooked chief tends to get caught eventually.
  for (const g of s.goccs) {
    if (g.faultFound || g.ceo.integrity >= 6) continue;
    const r = seededRandom(seed(s, `gocc-leak:${g.id}:${s.month}`))();
    if (r < (6 - g.ceo.integrity) * 0.012) {
      const found = `A whistleblower exposes ₱${(0.3 + r * 10).toFixed(1)}B in overpriced contracts approved by ${g.ceo.name}.`;
      s.goccs = s.goccs.map((x) => (x.id === g.id ? { ...x, faultFound: found, candidates: goccCandidates(s, g.id) } : x));
      faultFound(s, g.id);
      notes.push(`${g.name}: ${found}`);
    }
  }
  if (total > 0) notes.push(`Government corporations paid ${peso(total)} in dividends this month.`);
  return total;
}

export function goccCandidates(s: CampaignState, id: string): Official[] {
  const taken = takenNames(s);
  return [0, 1, 2].map((i) =>
    makeOfficial(seed(s, `gocc-cand:${id}:${s.month}:${i}`), {
      competence: [9, 7, 6][i],
      integrity: [8, 6, 8][i],
      loyalty: [5, 7, 9][i],
      background: ['Industry veteran with thirty years of experience', 'Former executive of a private competitor', 'Loyal campaign ally'][i],
    }, taken),
  );
}

/** Order the Commission on Audit to look for a fault. Honest chiefs are hard to catch. */
export function auditGocc(s: CampaignState, id: string): ActionResult {
  const g = s.goccs?.find((x) => x.id === id);
  if (!g) return { ok: false, message: 'Unknown corporation.' };
  if (g.faultFound) return { ok: false, message: 'A fault has already been found. You can replace the chief.' };
  if ((s.cooldowns?.[`audit:${id}`] ?? -99) > s.month) return { ok: false, message: 'An audit is already under way.' };
  s.cooldowns = { ...(s.cooldowns ?? {}), [`audit:${id}`]: s.month + 6 };
  spendMoney(s, `COA special audit — ${g.name}`, 0.2);
  const r = seededRandom(seed(s, `audit:${id}:${s.month}`))();
  const chance = clamp(0.08 + (10 - g.ceo.integrity) * 0.09 + (10 - g.ceo.competence) * 0.02, 0.05, 0.9);
  if (r < chance) {
    const faults = [
      `COA finds ₱${(0.4 + r * 3).toFixed(1)}B in unliquidated cash advances approved by ${g.ceo.name}.`,
      `COA finds that ${g.ceo.name} awarded contracts to a relative's company without bidding.`,
      `COA finds ₱${(0.2 + r * 2).toFixed(1)}B in bonuses paid to the board in violation of the law.`,
    ];
    const found = faults[Math.floor(r * 30) % faults.length];
    s.goccs = s.goccs!.map((x) => (x.id === id ? { ...x, faultFound: found, candidates: goccCandidates(s, id) } : x));
    s.politics = { ...s.politics, corruption: clamp(s.politics.corruption - 1, 15, 100) };
    return { ok: true, message: `${found} You may now replace the ${g.ceoTitle}.` };
  }
  s.politics = { ...s.politics, media: clamp(s.politics.media + 2, 0, 100) };
  return { ok: false, message: `The audit finds nothing wrong. Critics call it harassment of a Dela Paz appointee. You can try again in six months.` };
}

export function replaceCeo(s: CampaignState, id: string, index: number): ActionResult {
  const g = s.goccs?.find((x) => x.id === id);
  if (!g) return { ok: false, message: 'Unknown corporation.' };
  if (g.appointedBy === 'previous' && !g.faultFound) return { ok: false, message: `${g.ceo.name} has a fixed term. You need a proven fault to remove them.` };
  const pick = (g.candidates ?? goccCandidates(s, id))[index];
  if (!pick) return { ok: false, message: 'Pick a candidate.' };
  const old = g.ceo.name;
  s.goccs = s.goccs!.map((x) => (x.id === id ? { ...x, ceo: pick, appointedBy: 'you', faultFound: undefined, candidates: undefined } : x));
  return { ok: true, message: `${old} is out. ${pick.name} is the new ${g.ceoTitle} of ${g.name}.` };
}

/** Board candidates for a new corporation. */
export function boardCandidates(s: CampaignState, id: string): Official[] {
  const taken = takenNames(s);
  goccCandidates(s, id).forEach((o) => taken.add(bare(o.name)));
  return Array.from({ length: 7 }, (_, i) => makeOfficial(seed(s, `new-board:${id}:${i}`), {}, taken));
}

export function createGocc(s: CampaignState, templateId: string, ceoIndex: number, boardIdx: number[]): ActionResult {
  const t = NEW_GOCCS.find((x) => x.id === templateId);
  if (!t) return { ok: false, message: 'Unknown corporation.' };
  if (s.goccs?.some((g) => g.id === t.id)) return { ok: false, message: `${t.name} already exists.` };
  if (boardIdx.length < 3 || boardIdx.length > 5) return { ok: false, message: 'Choose three to five board members.' };
  const ceo = goccCandidates(s, t.id)[ceoIndex];
  const pool = boardCandidates(s, t.id);
  const borrowed = spendMoney(s, `Capital for ${t.name}`, t.cost);
  s.goccs = [
    ...(s.goccs ?? []),
    { id: t.id, name: t.name, focus: t.focus, description: t.description, ceoTitle: t.ceoTitle, ceo, board: boardIdx.map((i) => pool[i]), appointedBy: 'you', baseIncome: t.baseIncome, jobs: t.jobs, founded: s.month, opensMonth: s.month + t.build, earned: 0 },
  ];
  if (s.economy) s.economy = { ...s.economy, unemployment: clamp(s.economy.unemployment - t.jobs / 520_000, 2.5, 30) };
  return { ok: true, message: `${t.name} is created with ${peso(t.cost)} in capital${borrowed > 0 ? ` (${peso(borrowed)} borrowed)` : ''}. ${ceo.name} will lead it. Operations begin in ${t.build} months.` };
}

export function goccTemplate(id: string) {
  return NEW_GOCCS.find((t) => t.id === id);
}

// ───────────────────────── Adviser reactions ─────────────────────────

export interface AdviserReaction {
  post: string;
  role: string;
  name: string;
  mood: Mood;
  text: string;
}

const FOCUS: Record<string, Partial<Record<string, number>>> = {
  adviserEconomy: { growth: 3, inflation: -3, unemployment: -2, investor: 1, poverty: -1 },
  adviserPolitical: { approval: 1, cohesion: 1, capital: 1, protest: -0.5 },
  adviserSecurity: { sovereignty: -1, military: 1, crime: -1 },
  adviserLegal: { corruption: -1, ombudsman: -1, courtTension: -1 },
  spokesperson: { approval: 1, media: -1, protest: -0.5 },
};

const LINES: Record<string, Record<'good' | 'bad' | 'mixed', string[]>> = {
  adviserEconomy: {
    good: ['That will help the economy. The numbers will thank you.', 'Good for jobs and prices. I can sell this to the markets.'],
    bad: ['This will cost us. Watch inflation and the deficit.', 'I advised against this. The economy will feel it.'],
    mixed: ['It could go either way for the economy.', 'Neutral for the numbers. Fine.'],
  },
  adviserPolitical: {
    good: ['Congress will like this. Our allies are happy.', 'Smart politics, sir/ma’am. The provinces will notice.'],
    bad: ['We will lose votes over this. I will have to make calls tonight.', 'Our allies are furious. This will cost us.'],
    mixed: ['Some will cheer, some will grumble. Manageable.', 'No big political cost. For now.'],
  },
  adviserSecurity: {
    good: ['The armed forces will stand firmer behind you.', 'This strengthens our position.'],
    bad: ['This worries me. We look weaker now.', 'The generals will not like this.'],
    mixed: ['No security impact that I can see.', 'Nothing alarming. I will keep watching.'],
  },
  adviserLegal: {
    good: ['Clean and defensible in court.', 'This will survive any legal challenge.'],
    bad: ['This could come back to haunt you — legally.', 'I would not want to defend this before the Ombudsman.'],
    mixed: ['Legally fine.', 'No legal red flags.'],
  },
  spokesperson: {
    good: ['I can defend this all day on television.', 'Great headline. The press will be kind tomorrow.'],
    bad: ['Tomorrow’s press briefing is going to be brutal.', 'How do I explain this to the cameras?'],
    mixed: ['I can spin this.', 'A quiet news day. Fine by me.'],
  },
};

const ROLE: Record<string, string> = { adviserEconomy: 'Economic Adviser', adviserPolitical: 'Political Adviser', adviserSecurity: 'National Security Adviser', adviserLegal: 'Legal Counsel', spokesperson: 'Spokesperson' };

/** How each seated adviser (and the central bank governor) feels about a decision. */
export function adviserReactions(s: CampaignState, eventId: string, choiceId: string): AdviserReaction[] {
  const choice = EVENTS_BY_ID[eventId]?.choices.find((c) => c.id === choiceId);
  if (!choice) return [];
  const fx: Effects = choice.effects;
  const stats = { ...(fx.stats ?? {}) } as Record<string, number>;
  const out: AdviserReaction[] = [];
  const r = seededRandom(seed(s, `react:${eventId}:${choiceId}`));
  for (const post of ADVISER_POSTS) {
    const seat = s.cabinet.find((c) => c.postId === post);
    if (!seat?.nomineeId) continue;
    const n = findNominee(s, post, seat.nomineeId);
    if (!n) continue;
    let score = 0;
    for (const [k, w] of Object.entries(FOCUS[post])) score += (stats[k] ?? 0) * (w ?? 0);
    if (post === 'adviserEconomy') {
      score -= (fx.spend ?? 0) / 20 + Math.max(0, fx.debt ?? 0) / 25;
      score += (fx.income ?? 0) / 20 + (fx.asset ? 2 : 0) + (fx.taxRate ?? 0) * 5;
    }
    if (post === 'adviserLegal' && fx.flags && Object.keys(fx.flags).some((f) => /bribe|cover|abuse|obstruct|plunder|defied|crackdown|martial/.test(f))) score -= 4;
    if (post === 'adviserPolitical' && fx.houseShift) score += fx.houseShift / 5;
    // Loyalists see the bright side.
    score += (n.loyalty - 6) * 0.15;
    const kind = score > 0.8 ? 'good' : score < -0.8 ? 'bad' : 'mixed';
    const mood: Mood = kind === 'good' ? (score > 3 ? 'happy' : 'relieved') : kind === 'bad' ? (score < -4 ? 'angry' : 'disappointed') : 'neutral';
    const lines = LINES[post][kind];
    const role = ROLE[post] ?? CABINET_POSTS.find((p) => p.id === post)!.title;
    out.push({ post, role, name: n.name, mood, text: lines[Math.floor(r() * lines.length)].replace('sir/ma’am', s.player?.honorific === 'Ginoong' ? 'sir' : 'ma’am') });
  }
  // The central bank governor weighs in on anything that borrows or spends big.
  const cb = s.centralBank;
  const heavy = (fx.spend ?? 0) + Math.max(0, fx.debt ?? 0);
  if (cb && (heavy >= 15 || (stats.inflation ?? 0) > 0.1)) {
    out.push({ post: 'bsk', role: 'Bangko Sentral Governor', name: cb.governor.name, mood: heavy >= 40 ? 'angry' : 'worried', text: heavy >= 15 ? `Another ${peso(heavy)} of spending and borrowing will weaken the peso. We may have to raise rates.` : 'This will push prices up. The Monetary Board is watching.' });
  } else if (cb && ((fx.income ?? 0) >= 20 || (fx.debt ?? 0) < 0 || (fx.taxRate ?? 0) > 0)) {
    out.push({ post: 'bsk', role: 'Bangko Sentral Governor', name: cb.governor.name, mood: 'relieved', text: 'Good for the peso. Less borrowing means we can keep rates low.' });
  }
  return out;
}

// ───────────────────────── Decisions made in the story ─────────────────────────

/** Names the story can use: the governor, the shortlist for governor, each corporation, its chief, and replacement candidates. */
export function institutionTokens(s: CampaignState): Record<string, string> {
  const out: Record<string, string> = {};
  if (s.centralBank) {
    out.bskGov = s.centralBank.governor.name;
    governorCandidates(s).forEach((o, i) => (out[`gov${i + 1}`] = o.name));
  }
  for (const g of s.goccs ?? []) {
    out[`gocc:${g.id}`] = g.name;
    out[`ceo:${g.id}`] = g.ceo.name;
    (g.candidates ?? goccCandidates(s, g.id)).forEach((o, i) => (out[`gc:${g.id}:${i + 1}`] = o.name));
  }
  for (const t of NEW_GOCCS) {
    if (!out[`gocc:${t.id}`]) out[`gocc:${t.id}`] = t.name;
    if (!(s.goccs ?? []).some((g) => g.id === t.id)) goccCandidates(s, t.id).forEach((o, i) => (out[`gc:${t.id}:${i + 1}`] = o.name));
  }
  return out;
}

/** A corrupt or careless chief has been caught: flag it and put the replacement on the President's desk. */
function faultFound(s: CampaignState, id: string) {
  s.flags = { ...s.flags, [`gocc_fault_${id}`]: true };
  s.scheduled = [...s.scheduled.filter((x) => x.event !== `gocc_replace_${id}`), { event: `gocc_replace_${id}`, month: s.month + 1 }];
}

export function applyInstitutionEffects(s: CampaignState, fx: Effects, notes: string[]) {
  if (fx.bank) {
    s.cooldowns = { ...(s.cooldowns ?? {}), bsk: -99 };
    notes.push(pressureBank(s, fx.bank).message);
  }
  if (fx.governor !== undefined && s.centralBank) {
    const pick = governorCandidates(s)[fx.governor];
    if (pick) {
      s.flags = { ...s.flags, bsk_governor_vacant: true };
      notes.push(appointGovernor(s, pick).message);
    }
  }
  if (fx.goccCreate) {
    const { id, ceo, board } = fx.goccCreate;
    const pool = boardCandidates(s, id);
    const ranked = pool.map((o, i) => ({ o, i })).sort((a, b) => (board === 'merit' ? b.o.competence + b.o.integrity - (a.o.competence + a.o.integrity) : b.o.loyalty - a.o.loyalty));
    notes.push(createGocc(s, id, ceo, ranked.slice(0, 5).map((x) => x.i)).message);
  }
  if (fx.goccAudit) {
    s.cooldowns = { ...(s.cooldowns ?? {}), [`audit:${fx.goccAudit}`]: -99 };
    const r = auditGocc(s, fx.goccAudit);
    notes.push(r.message);
    if (r.ok) faultFound(s, fx.goccAudit);
  }
  if (fx.goccReplace) {
    const r = replaceCeo(s, fx.goccReplace.id, fx.goccReplace.pick);
    notes.push(r.message);
    if (r.ok) s.flags = { ...s.flags, [`gocc_fault_${fx.goccReplace.id}`]: false, [`gocc_mine_${fx.goccReplace.id}`]: true };
  }
  if (fx.goccBoard) {
    const g = s.goccs?.find((x) => x.id === fx.goccBoard!.id);
    if (g) {
      const style = fx.goccBoard.style;
      const pool = Array.from({ length: 8 }, (_, i) => makeOfficial(seed(s, `reboard:${g.id}:${s.month}:${i}`), style === 'allies' ? { loyalty: 9, integrity: 5 } : { competence: 8, integrity: 8 }, takenNames(s)));
      const board = pool.sort((a, b) => (style === 'merit' ? b.competence + b.integrity - (a.competence + a.integrity) : b.loyalty - a.loyalty)).slice(0, 5);
      s.goccs = s.goccs!.map((x) => (x.id === g.id ? { ...x, board } : x));
      notes.push(`${g.name} has a new board: ${board.map((b) => b.name).join(', ')}.`);
    }
  }
}
