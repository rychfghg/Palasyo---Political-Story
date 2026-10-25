import type { Stance } from '@/features/game-engine/types/government';
import type { Philosophy } from '@/data/government/supremeCourt';

export type FlagValue = boolean | number | string;

/** Political temperature gauges, 0–100. */
export type PoliticsKey =
  | 'capital' // political capital: your ability to push things through
  | 'cohesion' // coalition cohesion in Congress
  | 'cabinetCohesion'
  | 'media' // media hostility
  | 'protest' // street protest intensity
  | 'corruption' // corruption perception
  | 'crime'
  | 'church' // relationship with the Church
  | 'tribes' // relationship with indigenous peoples
  | 'military' // military confidence
  | 'family' // family harmony
  | 'courtTension' // friction with the Supreme Court
  | 'ombudsman' // heat from anti-graft investigators
  | 'sovereignty' // tension with Haizhou over the West Sea
  | 'investor'; // investor confidence

export type Politics = Record<PoliticsKey, number>;

export type EconomyKey = 'approval' | 'inflation' | 'unemployment' | 'poverty' | 'growth';

export type StatKey = PoliticsKey | EconomyKey;

export type Condition =
  | { flag: string; is?: FlagValue; not?: boolean }
  | { stat: StatKey; gte?: number; lte?: number }
  | { tag: string }
  | { cabinet: string; is?: string; filled?: boolean }
  | { resolved: string; choice?: string }
  | { ruling: 'upheld' | 'struck' }
  | { party: string }
  | { vpAlly: boolean }
  /** Deterministic dice roll per save: true with the given probability. */
  | { chance: number; key: string }
  /** Result of a special event resolved when it opens (successor election, post-term charges). */
  | { outcome: boolean }
  | { any: Condition[] }
  | { none: Condition[] };

export interface BillVote {
  bill: string;
  /** How attractive the bill is to legislators, −3 (toxic) … +3 (irresistible). */
  appeal: number;
  /** Separate appeal in the Senate if it differs (senators are more independent). */
  senateAppeal?: number;
  /** Only the House votes (e.g. impeachment). */
  houseOnly?: boolean;
  /** Votes needed in the House, if not a simple majority. */
  houseThreshold?: number;
  /** Votes needed in the Senate, if not 13 (e.g. 16 to override a veto). */
  senateThreshold?: number;
  onPass?: Effects;
  onFail?: Effects;
}

export interface CourtCase {
  title: string;
  kind: 'rights' | 'executive' | 'economic' | 'electoral';
  /** 0–1: how constitutionally sound the government’s position is. */
  soundness: number;
}

export interface Effects {
  stats?: Partial<Record<StatKey, number>>;
  /** One-off spending in ₱B (borrowed if the Treasury runs dry). */
  spend?: number;
  spendLabel?: string;
  /** One-off income in ₱B (e.g. privatization proceeds). */
  income?: number;
  /** Permanent change to the tax take, as % of GDP (e.g. 0.4 = +0.4% of GDP per year). */
  taxRate?: number;
  /**
   * An income-generating investment: pays `monthlyIncome` (₱B) every month once it opens
   * `delay` months from now. The upfront cost goes in `spend`.
   */
  asset?: { id: string; name: string; province: string; kind: string; monthlyIncome: number; jobs: number; delay?: number };
  /** Something goes wrong with an existing investment: `factor` 0 closes it for good; otherwise income is cut to `factor` for `months`. */
  assetHit?: { id: string; factor: number; months?: number; note: string };
  /** The spy plot: 'plant' a spy among the Cabinet, or accuse suspect 1–3 ({suspect1}…{suspect3}). */
  spy?: 'plant' | 1 | 2 | 3;
  /** What to do about the person who betrayed you (named by {betrayer}). */
  betrayal?: 'fire' | 'defect' | 'reconcile';
  /** A foreign company's proposal: answer with an offer. */
  company?: { id: string; offer: 'generous' | 'standard' | 'tough' };
  /** Build what the country lacks: coverage points for roads, hospitals, schools, power, water, internet, housing. */
  need?: Record<string, number>;
  /** Change relations with foreign governments (haizhou, columbia, nippara, qadir, bloc). */
  relations?: Record<string, number>;
  /** A provincial governor changes sides ('all' for every province). */
  provGovernor?: { province: string; to: Stance };
  /** A request to the central bank, made in a meeting with the governor. */
  bank?: 'cut' | 'defend' | 'hold';
  /** Appoint the next central bank governor: 0, 1 or 2 from the shortlist ({gov1}–{gov3}). */
  governor?: number;
  /** Create a government corporation by charter. `ceo` picks from its shortlist; the board is chosen for merit or loyalty. */
  goccCreate?: { id: string; ceo: number; board: 'merit' | 'allies' };
  /** Order a COA special audit of a corporation. */
  goccAudit?: string;
  /** Replace a corporation's chief (after a fault is found) with shortlist pick 0–2. */
  goccReplace?: { id: string; pick: number };
  /** Reconstitute a corporation's board. */
  goccBoard?: { id: string; style: 'merit' | 'allies' };
  /** Recurring monthly cost. */
  program?: { id: string; label: string; monthly: number; months: number };
  /** Infrastructure project: total cost spread over the build time. */
  project?: { id: string; name: string; region: string; cost: number; months: number };
  law?: { id: string; name: string; summary: string };
  flags?: Record<string, FlagValue>;
  schedule?: { event: string; inMonths: number }[];
  /** Move senators between camps (most influential first). */
  senateShift?: { from: Stance; to: Stance; count: number };
  /** Named senators change camp. */
  senators?: Record<string, Stance>;
  /** Seats moving to (+) or away from (−) the administration coalition in the House. */
  houseShift?: number;
  /** Remove a Cabinet secretary: a post id, or 'traitor' for the suspected leaker. */
  fireCabinet?: string;
  /** `replaces: 'random'` fills the seat named by the current random vacancy. */
  appointJustice?: { replaces: string; name: string; philosophy: Philosophy };
  /** Removes the senator named by the current random vacancy (the seat stays empty until the next election). */
  removeSenator?: boolean;
  vote?: BillVote;
  /** Senate impeachment trial of the President: 16 of 24 votes remove you from office. */
  trial?: { severity: number; onConvict?: Effects; onAcquit?: Effects };
  /** A criminal trial of the former President before the anti-graft court. */
  verdict?: { severity: number; onConvict?: Effects; onAcquit?: Effects };
  /** Ends the presidency (and the game) immediately. */
  gameOver?: 'removed' | 'resigned' | 'ousted' | 'coup';
  /** Coalition building: allied parties formally join ("all") or only the largest one does ("one"). */
  coalition?: 'all' | 'one';
  /** Hidden liabilities or windfalls added straight to the national debt (₱B). */
  debt?: number;
  /** Adjust the enacted budget total for the given fiscal year (₱B). */
  budgetChange?: number;
  /** Enact the budget for a fiscal year: 'proposal' uses your submitted NEP (plus changes); 'reenacted' repeats last year. */
  enactBudget?: { fy: number; mode: 'proposal' | 'reenacted' | 'growth'; growth?: number };
}

export interface Reaction {
  who: string;
  text: string;
  mood: 'pos' | 'neg' | 'neutral';
}

export interface Choice {
  id: string;
  label: string;
  description: string;
  outcome: string;
  headline?: string;
  reactions?: Reaction[];
  effects: Effects;
  when?: Condition[];
}

export type EventCategory =
  | 'family'
  | 'congress'
  | 'cabinet'
  | 'address'
  | 'crisis'
  | 'calamity'
  | 'media'
  | 'scandal'
  | 'diplomacy'
  | 'court'
  | 'economy'
  | 'society'
  | 'election'
  | 'chapter';

export type PinKey =
  | 'palasyo' | 'batasan' | 'senate' | 'court' | 'maynilad' | 'north' | 'kapatagan' | 'bikol'
  | 'iloilanan' | 'sugbu' | 'tacloban' | 'cagayan' | 'davira' | 'marawira' | 'westsea' | 'pagasa' | 'abroad';

/** A bill whose details the President drafts before it goes to a vote. */
export interface DraftSpec {
  bill: string;
  lawId: string;
  summary: string;
  appeal: number;
  senateAppeal?: number;
  knobs: { id: string; label: string; options: { label: string; note: string; appeal: number; senateAppeal?: number; effects: Effects }[] }[];
}

export interface StoryEvent {
  id: string;
  /** Opens the drafting table instead of plain choices. */
  draft?: DraftSpec;
  /** A range of months; each save picks its own month in the range, so every playthrough is shuffled. */
  window?: [number, number];
  /** Where the issue pops up on the map. Defaults by category. */
  where?: PinKey;
  /** Month index (0 = July 2027). Omit for events that only arrive via `schedule`. */
  month?: number;
  priority?: number; // higher shows first
  category: EventCategory;
  title: string;
  location: string;
  speaker?: string;
  when?: Condition[];
  body: string[];
  variants?: { when: Condition[]; text: string }[];
  /** Resolved as soon as the event opens; choices can react to the result via { ruling } conditions. */
  court?: CourtCase & { onUphold?: Effects; onStrike?: Effects };
  /** Special engine behaviours. */
  special?: 'midterm' | 'chapterEnd' | 'successor' | 'reckoning';
  choices: Choice[];
}
