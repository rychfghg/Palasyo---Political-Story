import { COMPANIES, OFFER_TERMS, type Offer } from '@/data/world/companies';
import { MAX_LEVEL_PER_SECTOR, PROVINCES, SECTOR_ECONOMICS, SECTOR_LABEL, type Sector } from '@/data/world/provinces';
import { peso } from '@/features/economy/utils/finance';
import type { CampaignState } from '../types/campaign';
import type { Effects } from '@/features/narrative/types/event';
import { seededRandom } from '../utils/random';
import { monthLabel } from './calendar';
import { applyEffects, assetPay, book, spendMoney, tallyDebt } from './engine';

export interface ActionResult {
  ok: boolean;
  message: string;
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const LABOR_FORCE_MILLIONS = 52;

/** Jobs created lower unemployment (with a multiplier for indirect jobs). */
function addJobs(s: CampaignState, jobs: number) {
  if (!s.economy) return;
  const drop = (jobs / (LABOR_FORCE_MILLIONS * 1_000_000)) * 100 * 3;
  s.economy = { ...s.economy, unemployment: clamp(s.economy.unemployment - drop, 2.5, 30) };
}

function nudge(s: CampaignState, growth: number, inflation: number) {
  if (!s.economy) return;
  s.economy = { ...s.economy, growth: clamp((s.economy.growth ?? 5) + growth, -8, 12), inflation: clamp(s.economy.inflation + inflation, 1, 60) };
}

const onCooldown = (s: CampaignState, key: string) => (s.cooldowns?.[key] ?? -99) > s.month;
const setCooldown = (s: CampaignState, key: string, months: number) => {
  s.cooldowns = { ...(s.cooldowns ?? {}), [key]: s.month + months };
};

// ───────────────────────── Provinces ─────────────────────────

export function investmentLevel(s: CampaignState, provinceId: string, sector: Sector): number {
  return s.investLevels?.[`${provinceId}:${sector}`] ?? 0;
}

/** A state investment in a province: costs money now, earns tax and fee income every month after. */
export function investInProvince(s: CampaignState, provinceId: string, sector: Sector): ActionResult {
  const p = PROVINCES.find((x) => x.id === provinceId);
  if (!p || !s.economy) return { ok: false, message: 'Unknown province.' };
  const level = investmentLevel(s, provinceId, sector);
  if (level >= MAX_LEVEL_PER_SECTOR) return { ok: false, message: `${p.name} already has the maximum ${SECTOR_LABEL[sector].toLowerCase()} investment.` };
  if (onCooldown(s, `inv:${provinceId}`)) return { ok: false, message: `${p.name} can take only one new state investment per month.` };

  const econ = SECTOR_ECONOMICS[sector];
  const fit = p.fit[sector];
  const diminishing = 1 - level * 0.15;
  const cost = Math.round(econ.cost * (1 + level * 0.2));
  const borrowed = spendMoney(s, `${SECTOR_LABEL[sector]} — ${p.name}`, cost);
  const monthlyIncome = Math.round(econ.monthlyIncome * fit * diminishing * 100) / 100;
  const jobs = Math.round(econ.jobs * fit * diminishing);

  s.assets = [...(s.assets ?? []), { id: `${provinceId}:${sector}:${level + 1}`, name: `${SECTOR_LABEL[sector]} (${p.name})`, province: provinceId, kind: sector, monthlyIncome, jobs, startedMonth: s.month + econ.build, cost, earned: 0 }];
  s.investLevels = { ...(s.investLevels ?? {}), [`${provinceId}:${sector}`]: level + 1 };
  setCooldown(s, `inv:${provinceId}`, 1);
  addJobs(s, jobs);
  nudge(s, econ.growth * fit * diminishing, econ.inflation * fit);
  s.politics = { ...s.politics, investor: clamp(s.politics.investor + 1, 0, 100) };

  const fitWord = fit >= 1.2 ? 'an excellent fit' : fit >= 1 ? 'a good fit' : fit >= 0.8 ? 'a so-so fit' : 'a poor fit';
  return {
    ok: true,
    message: `${SECTOR_LABEL[sector]} launched in ${p.name} (${fitWord}): ${peso(cost)} invested${borrowed > 0 ? ` (${peso(borrowed)} borrowed)` : ''}, ${jobs.toLocaleString()} jobs, about ${peso(monthlyIncome * 12)} a year in new revenue once it opens in ${econ.build} months.`,
  };
}

// ───────────────────────── Foreign companies ─────────────────────────

/** What makes a company nervous about the Kapuluan right now, and how much each worry costs you. */
export function companyConcerns(s: CampaignState): { text: string; penalty: number }[] {
  const out: { text: string; penalty: number }[] = [];
  const e = s.economy;
  const f = s.flags;
  if (e && e.inflation >= 6) out.push({ text: 'High inflation', penalty: 0.1 });
  if (e && (e.debt / e.gdp) * 100 >= 65) out.push({ text: 'Heavy public debt', penalty: 0.07 });
  if (e && e.approval < 35) out.push({ text: 'An unpopular government', penalty: 0.08 });
  if (s.politics.protest >= 60) out.push({ text: 'Street protests', penalty: 0.06 });
  if (s.politics.corruption >= 60) out.push({ text: 'Corruption', penalty: 0.1 });
  if (f.took_bribe || f.ch2_cover_up || f.ch2_plunder) out.push({ text: 'Graft scandals at the Palasyo', penalty: 0.12 });
  if (f.haizhou_port) out.push({ text: 'The Haizhou port deal worries Western firms', penalty: 0.06 });
  if (f.martial_law_mindara || f.crackdown) out.push({ text: 'Crackdowns and martial law', penalty: 0.1 });
  const failed = (s.assets ?? []).filter((a) => a.failed).length;
  if (failed) out.push({ text: `${failed} failed investment${failed > 1 ? 's' : ''}`, penalty: Math.min(0.15, failed * 0.05) });
  return out;
}

export function companyChance(s: CampaignState, companyId: string, offer: Offer): number {
  const c = COMPANIES.find((x) => x.id === companyId);
  if (!c) return 0;
  const p = s.politics;
  const worries = companyConcerns(s).reduce((n, w) => n + w.penalty, 0);
  return clamp(0.4 + OFFER_TERMS[offer].chance + (p.investor - 50) / 70 + (45 - p.corruption) / 150 - (p.protest - 30) / 150 - (p.sovereignty - 60) / 300 - worries, 0.03, 0.92);
}

/** Court a foreign company with a package of incentives. Success brings jobs and a new income stream. */
export function courtCompany(s: CampaignState, companyId: string, offer: Offer): ActionResult {
  const c = COMPANIES.find((x) => x.id === companyId);
  if (!c || !s.economy) return { ok: false, message: 'Unknown company.' };
  if (s.assets?.some((a) => a.id === `co:${c.id}`)) return { ok: false, message: `${c.name} is already operating here.` };
  if (onCooldown(s, `co:${c.id}`)) return { ok: false, message: `${c.name} is not taking calls from the Palasyo right now. Try again later.` };
  if (s.politics.investor < c.minConfidence) return { ok: false, message: `${c.name} will not consider the Kapuluan until investor confidence reaches ${c.minConfidence}.` };

  const terms = OFFER_TERMS[offer];
  spendMoney(s, `Investment roadshow and incentives — ${c.name}`, terms.cost);
  const won = seededRandom(`${s.player?.firstName}${s.player?.lastName}:co:${c.id}:${s.month}`)() < companyChance(s, companyId, offer);
  if (!won) {
    setCooldown(s, `co:${c.id}`, 6);
    const worst = companyConcerns(s).sort((a, b) => b.penalty - a.penalty)[0];
    return { ok: false, message: `${c.name} turned you down${worst ? `, citing ${worst.text.charAt(0).toLowerCase() + worst.text.slice(1)}` : ' and chose another country'}. They may listen again in six months.` };
  }
  const monthlyIncome = Math.round(c.monthlyIncome * terms.incomeFactor * 100) / 100;
  s.assets = [...(s.assets ?? []), { id: `co:${c.id}`, name: `${c.name}: ${c.project}`, province: c.province, kind: 'company', monthlyIncome, jobs: c.jobs, startedMonth: s.month + 4, cost: terms.cost, earned: 0 }];
  addJobs(s, c.jobs);
  nudge(s, c.growth, c.inflation);
  s.politics = { ...s.politics, investor: clamp(s.politics.investor + 4, 0, 100) };
  if (s.economy) s.economy = { ...s.economy, approval: clamp(s.economy.approval + 1.5, 0, 100) };
  s.news = [{ month: s.month, headline: `${c.name.toUpperCase()} TO BUILD ${c.project.toUpperCase()} — ${c.jobs.toLocaleString()} JOBS` }, ...s.news].slice(0, 60);
  return { ok: true, message: `${c.name} signs! ${c.project}: ${c.jobs.toLocaleString()} jobs and about ${peso(monthlyIncome * 12)} a year in taxes once it opens in four months.` };
}

// ───────────────────────── Tax bureau (BIR) ─────────────────────────

export interface BirAction {
  id: string;
  label: string;
  description: string;
  cooldown: number;
  effects: Effects;
}

export const BIR_ACTIONS: BirAction[] = [
  { id: 'compliance', label: 'Tax compliance drive', description: 'Audit teams, text reminders, and a public list of top taxpayers. About +₱45B a year.', cooldown: 6, effects: { spend: 2, spendLabel: 'Tax compliance drive', taxRate: 0.15, stats: { approval: -1 } } },
  { id: 'evaders', label: 'Go after big tax evaders', description: 'Criminal cases against the fifty biggest evaders. About +₱60B a year.', cooldown: 12, effects: { taxRate: 0.2, stats: { investor: -2, corruption: -2, approval: 2 } } },
  { id: 'digital', label: 'Digitalize tax filing', description: 'Online filing and e-payments nationwide. About +₱30B a year and less corruption.', cooldown: 999, effects: { spend: 5, spendLabel: 'Digital tax filing', taxRate: 0.1, stats: { corruption: -2 } } },
  { id: 'vat', label: 'Raise VAT by one point', description: 'About +₱100B a year — and higher prices for everyone.', cooldown: 24, effects: { taxRate: 0.35, stats: { inflation: 0.4, approval: -5 } } },
  { id: 'cut_low', label: 'Cut income tax for low earners', description: 'Popular — costs about ₱60B a year.', cooldown: 24, effects: { taxRate: -0.2, stats: { approval: 4, poverty: -0.2 } } },
];

export function birAction(s: CampaignState, id: string): ActionResult {
  const a = BIR_ACTIONS.find((x) => x.id === id);
  if (!a) return { ok: false, message: 'Unknown measure.' };
  if (onCooldown(s, `bir:${id}`)) return { ok: false, message: `${a.label} is not available again until ${monthLabel(s.cooldowns[`bir:${id}`])}.` };
  applyEffects(s, a.effects, { eventId: `bir_${id}`, choiceId: id, outcome: '', reactions: [], deltas: [], notes: [] }, `bir:${id}:${s.month}`);
  setCooldown(s, `bir:${id}`, a.cooldown);
  return { ok: true, message: `${a.label}: done.` };
}

// ───────────────────────── Debt ─────────────────────────

export const TREASURY_RESERVE = 100;

/** Use cash in the Treasury to pay debt down early. */
export function prepayDebt(s: CampaignState, amount: number): ActionResult {
  if (!s.economy) return { ok: false, message: 'No economy.' };
  if (s.economy.treasury - amount < TREASURY_RESERVE) return { ok: false, message: `The Treasury must keep at least ${peso(TREASURY_RESERVE)} in reserve.` };
  s.economy = { ...s.economy, treasury: s.economy.treasury - amount, debt: s.economy.debt - amount };
  tallyDebt(s, { prepaid: amount });
  book(s, { debtRepaid: amount });
  s.ledger = [{ id: `prepay-${s.month}-${s.ledger.length}`, date: monthLabel(s.month), label: 'Early debt repayment', amount: -amount, borrowed: 0 }, ...s.ledger];
  s.politics = { ...s.politics, investor: clamp(s.politics.investor + amount / 50, 0, 100) };
  return { ok: true, message: `${peso(amount)} of debt repaid early. Interest costs fall.` };
}

// ───────────────────────── Statistics ─────────────────────────

/** The country’s people, as the statistics authority would count them. Millions. */
export function citizens(s: CampaignState) {
  const years = Math.max(0, s.month) / 12;
  const population = 118 * Math.pow(1.013, years);
  const children = population * 0.1;
  const students = population * 0.24;
  const seniors = population * 0.09;
  const laborForce = LABOR_FORCE_MILLIONS * Math.pow(1.015, years);
  const unemploymentRate = s.economy?.unemployment ?? 6;
  const unemployed = (laborForce * unemploymentRate) / 100;
  const employed = laborForce - unemployed;
  const ofws = 10.2;
  const taxpayers = employed * 0.38;
  const notInLabor = Math.max(0, population - children - students - seniors - laborForce);
  return { population, children, students, seniors, laborForce, employed, unemployed, ofws, taxpayers, notInLabor };
}

/** Where the money comes from. ₱B per year. */
export function revenueBreakdown(s: CampaignState) {
  const total = (s.economy?.gdp ?? 0) * s.taxRate;
  const assets = (s.assets ?? []).reduce((n, a) => n + assetPay(a, s.month) * 12, 0);
  return {
    total: total + assets,
    parts: [
      { label: 'Personal income tax', value: total * 0.27 },
      { label: 'Value-added tax (VAT)', value: total * 0.3 },
      { label: 'Corporate income tax', value: total * 0.17 },
      { label: 'Customs duties', value: total * 0.14 },
      { label: 'Excise (sin, fuel, cars)', value: total * 0.09 },
      { label: 'Other taxes and fees', value: total * 0.03 },
      { label: 'State investments & companies', value: assets },
    ],
  };
}

/** Provinces with their current tax collections, ranked from richest. */
export function provinceRanking(s: CampaignState) {
  const scale = (s.economy?.gdp ?? 28_500) / 28_500;
  return PROVINCES.map((p) => {
    const levels = Object.entries(s.investLevels ?? {}).filter(([k]) => k.startsWith(`${p.id}:`)).reduce((n, [, v]) => n + v, 0);
    const assetIncome = (s.assets ?? []).filter((a) => a.province === p.id).reduce((n, a) => n + a.monthlyIncome * 12, 0);
    const jobs = (s.assets ?? []).filter((a) => a.province === p.id).reduce((n, a) => n + a.jobs, 0);
    const taxes = p.taxBase * scale * (1 + levels * 0.06) + assetIncome;
    const unemployment = Math.max(2.5, p.unemployment + ((s.economy?.unemployment ?? 6.1) - 6.1) - (jobs / (p.population * 1_000_000 * 0.45)) * 100);
    return { ...p, taxes, levels, jobs, unemployment, perCapita: (taxes * 1_000) / p.population };
  }).sort((a, b) => b.taxes - a.taxes);
}
