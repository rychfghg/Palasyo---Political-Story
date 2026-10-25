import type { Philosophy } from '@/data/government/supremeCourt';
import type { FlagValue, Politics } from '@/features/narrative/types/event';
import type { CabinetSeat, Economy, GovernmentState, LedgerEntry } from './government';
import type { Nominee } from '@/data/government/cabinet';
import type { PlayerProfile } from './player';

/** An income-generating state investment or foreign company operation. */
export interface Asset {
  id: string;
  name: string;
  province: string;
  kind: string;
  monthlyIncome: number;
  jobs: number;
  startedMonth: number;
  /** Upfront cost in ₱B, when known — used to show how much of it has been paid back. */
  cost?: number;
  /** Everything it has paid the Treasury so far, ₱B. */
  earned?: number;
  /** Running at reduced income until this month (a strike, a lawsuit, an outage). */
  troubleUntil?: number;
  troubleNote?: string;
  /** A failed investment earns nothing: the company left, or the project collapsed. */
  failed?: boolean;
  failNote?: string;
}

export interface InboxMessage {
  id: string;
  tpl: string;
  month: number;
  expires: number;
  read: boolean;
  answered?: number;
  expired?: boolean;
  outcome?: string;
}

/** One decision, remembered for the newspaper. */
export interface DecisionLog {
  eventId: string;
  title: string;
  choice: string;
  headline?: string;
  weight: number;
  approval: number;
}

/** Money in and out during one calendar year, in ₱B. */
export interface YearBook {
  taxes: number;
  investments: number;
  oneOffIncome: number;
  operations: number;
  interest: number;
  projects: number;
  oneOffSpend: number;
  debtRepaid: number;
  /** Scheduled principal installments on the debt. */
  principal?: number;
  borrowed: number;
}

/** A monthly snapshot for trend lines and warnings. */
export interface HistoryPoint {
  month: number;
  approval: number;
  inflation: number;
  growth: number;
  debtRatio: number;
  unemployment: number;
  peso?: number;
  luzara?: number;
  visara?: number;
  mindara?: number;
}

export interface Law {
  id: string;
  name: string;
  summary: string;
  month: number;
}

export interface Project {
  id: string;
  name: string;
  region: string;
  cost: number;
  monthly: number;
  monthsLeft: number;
  startedMonth: number;
}

export interface Program {
  id: string;
  label: string;
  monthly: number;
  monthsLeft: number;
}

export interface NewsItem {
  month: number;
  headline: string;
}

export interface CourtRuling {
  month: number;
  title: string;
  upheld: boolean;
  yes: number;
  no: number;
}

export interface JusticeChange {
  replaces: string;
  name: string;
  philosophy: Philosophy;
  month: number;
}

export interface ActiveBudget {
  fy: number;
  total: number;
  debtServiceLine: number;
}

export interface MidtermResult {
  senateBefore: Record<string, number>;
  senateAfter: Record<string, number>;
  seatsWon: number; // of the 12 contested Senate seats, won by administration candidates
  houseShift: number;
}

export interface EventContext {
  eventId: string;
  ruling?: { upheld: boolean; yes: number; no: number };
  traitorPost?: string;
  midterm?: MidtermResult;
  /** The drafted bill's effects, when the President used the drafting table. */
  draftFx?: import('@/features/narrative/types/event').Effects;
  /** Generic result shown with a special event (election, prosecution). */
  outcome?: { success: boolean; title: string; lines: string[] };
}

export interface Delta {
  label: string;
  value: string;
  good: boolean;
}

export interface VoteReport {
  bill: string;
  houseYes: number;
  houseNo: number;
  senateYes: number;
  senateNo: number;
  passed: boolean;
  failedIn?: 'House' | 'Senate';
}

export interface EventReport {
  eventId: string;
  choiceId: string;
  outcome: string;
  headline?: string;
  reactions: { who: string; text: string; mood: 'pos' | 'neg' | 'neutral' }[];
  deltas: Delta[];
  vote?: VoteReport;
  notes: string[];
}

export interface MonthReport {
  month: number;
  revenue: number;
  spending: number;
  borrowed: number;
  notes: string[];
}

/** Everything the story engine reads and writes. The store holds this plus UI actions. */
export interface CampaignState {
  player: PlayerProfile | null;
  partyId: string | null;
  tags: string[];
  flags: Record<string, FlagValue>;
  economy: Economy | null;
  ledger: LedgerEntry[];
  cabinet: CabinetSeat[];
  government: GovernmentState | null;
  budgetProposal: Record<string, number> | null;
  budgetSubmitted: boolean;
  gameDate: string;

  month: number;
  politics: Politics;
  taxRate: number;
  activeBudget: ActiveBudget;
  queue: string[];
  resolved: Record<string, string>;
  scheduled: { event: string; month: number }[];
  laws: Law[];
  projects: Project[];
  programs: Program[];
  news: NewsItem[];
  courtRulings: CourtRuling[];
  justiceChanges: JusticeChange[];
  context: EventContext | null;
  lastReport: EventReport | null;
  monthReport: MonthReport | null;
  chapterComplete: boolean;
  chapter: number;
  history: HistoryPoint[];
  assets: Asset[];
  investLevels: Record<string, number>;
  cooldowns: Record<string, number>;
  centralBank?: CentralBank;
  /** Hidden trust of each Cabinet member (cab:post:nominee) and senator (sen:id), 0–100. */
  trust?: Record<string, number>;
  /** Poll offsets from national approval, by region and class. */
  polls?: Record<string, number>;
  /** Decisions made this month, for the newspaper. */
  monthLog?: DecisionLog[];
  /** Last month's decisions, shown on the front page. */
  lastMonthLog?: DecisionLog[];
  goccs?: Gocc[];
  /** Where the national debt came from and where it went, since the start of the term (₱B). */
  debtTally?: { start: number; principal: number; prepaid: number; revaluation: number; loans: number };
  /** How well the country is served (0–100) for roads, hospitals, schools, power, water, internet, housing. */
  needs?: Record<string, number>;
  /** Relations with foreign governments, 0–100. */
  relations?: Record<string, number>;
  /** Provincial governors. */
  governors?: { province: string; name: string; stance: import('./government').Stance; since: number }[];
  /** Texts on the President’s phone. */
  inbox?: InboxMessage[];
  /** Promises made in State of the Nation Addresses. */
  promises?: { id: string; made: number; due: number; base: number; kept?: boolean }[];
  /** Income and spending for each calendar year. */
  yearBook?: Record<number, YearBook>;
  /** Newly generated candidates for Cabinet posts left vacant by firings and investigations. */
  extraNominees: Record<string, Nominee[]>;
}

/** Someone appointed to an institution: a central banker, a GOCC chief, a board member. */
export interface Official {
  name: string;
  background: string;
  competence: number; // 1–10
  integrity: number; // 1–10
  loyalty: number; // 1–10
}

/** Bangko Sentral ng Kapuluan: independent, sets interest rates, and defends the peso. */
export interface CentralBank {
  governor: Official;
  /** The Monetary Board: the governor plus six members. */
  board: Official[];
  governorTermEnds: number;
  /** Policy interest rate, %. */
  rate: number;
  /** Pesos per Columbian dollar. */
  peso: number;
  /** Foreign-exchange reserves, US-style dollars in billions. */
  reserves: number;
  /** 0–100: how free the bank is from Palasyo pressure. Markets trust an independent bank. */
  independence: number;
  /** The governor's latest advice to the President. */
  advice: string;
  adviceTone?: 'warn' | 'ok' | 'good';
  lastAction: string;
  pesoHistory: number[];
}

/** A government-owned and -controlled corporation. */
export interface Gocc {
  id: string;
  name: string;
  focus: string;
  description: string;
  ceo: Official;
  ceoTitle: string;
  board: Official[];
  /** 'previous' = installed by the Dela Paz administration: protected until a fault is found. */
  appointedBy: 'previous' | 'you';
  faultFound?: string;
  /** Base monthly dividend to the Treasury, ₱B, before the CEO's performance. */
  baseIncome: number;
  jobs: number;
  founded: number;
  opensMonth: number;
  earned: number;
  /** Candidates to replace the CEO, once a fault is found. */
  candidates?: Official[];
}
