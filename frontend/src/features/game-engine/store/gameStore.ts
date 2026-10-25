import { EVENTS_BY_ID } from '@/data/story';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { batchedStorage } from '@/shared/utils/saveCodec';
import type { ChoiceEffects } from '@/features/narrative/types/prologue';
import { BUDGET_LINES, INHERITED_ECONOMY, TOTAL_FY2027 } from '@/data/government/economy';
import { INITIAL_POLITICS, buildQueue, monthTick, openEvent, resolveChoice } from '../engine/engine';
import { monthLabel } from '../engine/calendar';
import type { CampaignState, EventReport } from '../types/campaign';
import { answerMessage, applyLoose, deliverSona } from '../engine/extras';
import { CAMPAIGN_BUDGET, draftEffects, runCampaign, type CampaignBudget, type CampaignMessage } from '../engine/world';
import type { Effects } from '@/features/narrative/types/event';
import { appointGovernor, auditGocc, createGocc, initCentralBank, initGoccs, pressureBank, replaceCeo, type BankRequest } from '../engine/institutions';
import type { Official } from '../types/campaign';
import { birAction, courtCompany, investInProvince, prepayDebt, type ActionResult } from '../engine/economyActions';
import type { Sector } from '@/data/world/provinces';
import type { Offer } from '@/data/world/companies';
import { CABINET_POSTS, VP_NOMINEE_ID } from '@/data/government/cabinet';
import { generateGovernment } from '@/features/congress/utils/generateGovernment';
import { holdHearing, type HearingResult } from '@/features/appointments/utils/hearing';
import { applySpend } from '@/features/economy/utils/finance';
import type { CabinetSeat, Economy, GovernmentState, LedgerEntry } from '../types/government';
import {
  BASE_TRAITS,
  type Ideology,
  type LifeEvent,
  type PlayerProfile,
  type Traits,
} from '../types/player';

export type GamePhase = 'none' | 'prologue' | 'election' | 'inauguration' | 'presidency';

export type AppointResult = { outcome: 'confirmed' | 'rejected' | 'no_confirmation'; hearing?: HearingResult; cost: number; borrowed: number };

interface GameState extends Omit<CampaignState, 'player' | 'partyId' | 'tags' | 'flags' | 'economy' | 'ledger' | 'cabinet' | 'government' | 'budgetProposal' | 'budgetSubmitted' | 'gameDate'> {
  schemaVersion: number;
  phase: GamePhase;
  player: PlayerProfile | null;
  traits: Traits;
  ideology: Ideology;
  tags: string[];
  partyId: string | null;
  homeRegionId: string | null;
  platform: string | null;
  chapterIndex: number;
  lifeEvents: LifeEvent[];
  flags: Record<string, boolean | number | string>;
  lastSavedAt: string | null;

  // Presidency
  gameDate: string;
  economy: Economy | null;
  ledger: LedgerEntry[];
  cabinet: CabinetSeat[];
  government: GovernmentState | null;
  budgetProposal: Record<string, number> | null;
  budgetSubmitted: boolean;

  startNewGame: (player: PlayerProfile, difficulty?: Difficulty) => void;
  applyChoice: (event: LifeEvent, effects: ChoiceEffects) => void;
  advanceChapter: () => void;
  setPhase: (phase: GamePhase) => void;
  setFlag: (key: string, value: boolean | number | string) => void;
  resetGame: () => void;

  initPresidency: () => void;
  spend: (label: string, amount: number) => number;
  adjustApproval: (delta: number) => void;
  appoint: (postId: string, nomineeId: string) => AppointResult | null;
  setBudgetLine: (lineId: string, amount: number) => void;
  resetBudgetProposal: () => void;
  submitBudget: () => void;

  /** Opens the event at the head of the queue (resolves court rulings, midterms, etc.). */
  /** Opens a queued event (defaults to the head of the queue): resolves court rulings, midterms, etc. */
  openCurrentEvent: (eventId?: string) => void;
  refreshQueue: () => void;
  choose: (eventId: string, choiceId: string) => EventReport | null;
  /** Whether the decision just made can still be taken back (once, right after it is made). */
  canReconsider: () => boolean;
  /** Undo the decision just made and put the matter back on the desk. Costs a little political capital. */
  reconsider: () => boolean;
  dismissReport: () => void;
  endMonth: () => void;
  /** Closes Chapter 1 (June 2030) and opens the last three years of the term. */
  startChapter2: () => void;
  investProvince: (provinceId: string, sector: Sector) => ActionResult;
  courtCompany: (companyId: string, offer: Offer) => ActionResult;
  birAction: (id: string) => ActionResult;
  prepayDebt: (amount: number) => ActionResult;
  /** Adds anything a save from an older version is missing (new Cabinet posts, the central bank, GOCCs). */
  ensureInstitutions: () => void;
  /** Reply to a text message. Returns what happened. */
  replyMessage: (id: string, option: number) => string;
  markInboxRead: () => void;
  /** Run an election campaign. Returns what happened. */
  campaign: (stops: string[], budget: CampaignBudget, message: CampaignMessage) => string[];
  /** Decide a Cabinet scene: the backed secretary gains trust, the passed-over ones lose it. */
  sideWith: (eventId: string, choiceId: string, winner: string | null, losers: string[]) => void;
  /** Send a bill drafted at the drafting table to Congress. */
  submitDraft: (eventId: string, picks: number[]) => EventReport | null;
  /** Apply the results of a press conference. */
  finishPress: (effects: Effects[]) => void;
  /** Deliver the State of the Nation Address. */
  giveSona: (brags: string[], promises: string[], target: string) => string[];
  askBank: (request: BankRequest) => ActionResult;
  pickGovernor: (o: Official) => ActionResult;
  auditGocc: (id: string) => ActionResult;
  replaceGoccChief: (id: string, index: number) => ActionResult;
  createGocc: (templateId: string, ceoIndex: number, board: number[]) => ActionResult;
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export type Difficulty = 'easy' | 'normal' | 'hard';

/** What each difficulty changes about the country you inherit. */
export const DIFFICULTY_SETTINGS: Record<Difficulty, { label: string; text: string; debtFactor: number; inflation: number; treasury: number; approval: number; capital: number; cohesion: number; investor: number; hostileSenators: number; peso: number; reserves: number }> = {
  easy: { label: 'Honeymoon', text: 'A healthier Treasury, a friendlier Congress, and a public that wants you to succeed.', debtFactor: 0.88, inflation: -1.2, treasury: 200, approval: 8, capital: 12, cohesion: 10, investor: 8, hostileSenators: 0, peso: 56.5, reserves: 120 },
  normal: { label: 'Normal', text: 'The Republic as Dela Paz left it: growing, indebted, and restless.', debtFactor: 1, inflation: 0, treasury: 0, approval: 0, capital: 0, cohesion: 0, investor: 0, hostileSenators: 0, peso: 58.2, reserves: 102 },
  hard: { label: 'Crisis Republic', text: 'Debt near 75% of GDP, a hostile Congress, a weak peso, and inflation already out of hand.', debtFactor: 1.17, inflation: 2, treasury: -200, approval: -8, capital: -12, cohesion: -15, investor: -12, hostileSenators: 4, peso: 62.8, reserves: 74 },
};
const now = () => new Date().toISOString();

const initialState = {
  schemaVersion: 2,
  phase: 'none' as GamePhase,
  player: null,
  traits: BASE_TRAITS,
  ideology: { economic: 0, social: 0 },
  tags: [],
  partyId: null,
  homeRegionId: null,
  platform: null,
  chapterIndex: 0,
  lifeEvents: [],
  flags: {},
  lastSavedAt: null,

  gameDate: 'July 2027',
  economy: null,
  ledger: [],
  cabinet: [],
  government: null,
  budgetProposal: null,
  budgetSubmitted: false,

  month: 0,
  politics: INITIAL_POLITICS,
  taxRate: INHERITED_ECONOMY.revenueAnnual / INHERITED_ECONOMY.gdp,
  activeBudget: { fy: 2027, total: TOTAL_FY2027, debtServiceLine: 877 },
  queue: [] as string[],
  resolved: {} as Record<string, string>,
  scheduled: [] as { event: string; month: number }[],
  laws: [],
  projects: [],
  programs: [],
  news: [],
  courtRulings: [],
  justiceChanges: [],
  context: null,
  lastReport: null,
  monthReport: null,
  chapterComplete: false,
  chapter: 1,
  history: [] as CampaignState['history'],
  assets: [] as CampaignState['assets'],
  investLevels: {} as Record<string, number>,
  cooldowns: {} as Record<string, number>,
  yearBook: {} as NonNullable<CampaignState['yearBook']>,
  centralBank: undefined as CampaignState['centralBank'],
  goccs: undefined as CampaignState['goccs'],
  // Everything a new game must start without (none of it may carry over from the previous save).
  trust: undefined as CampaignState['trust'],
  polls: undefined as CampaignState['polls'],
  monthLog: undefined as CampaignState['monthLog'],
  lastMonthLog: undefined as CampaignState['lastMonthLog'],
  debtTally: undefined as CampaignState['debtTally'],
  inbox: undefined as CampaignState['inbox'],
  promises: undefined as CampaignState['promises'],
  relations: undefined as CampaignState['relations'],
  governors: undefined as CampaignState['governors'],
  needs: undefined as CampaignState['needs'],
  extraNominees: {} as CampaignState['extraNominees'],
};

const CAMPAIGN_KEYS = ['player', 'partyId', 'tags', 'flags', 'economy', 'ledger', 'cabinet', 'government', 'budgetProposal', 'budgetSubmitted', 'gameDate', 'month', 'politics', 'taxRate', 'activeBudget', 'queue', 'resolved', 'scheduled', 'laws', 'projects', 'programs', 'news', 'courtRulings', 'justiceChanges', 'context', 'lastReport', 'monthReport', 'chapterComplete', 'chapter', 'history', 'assets', 'investLevels', 'cooldowns', 'yearBook', 'centralBank', 'goccs', 'trust', 'polls', 'debtTally', 'inbox', 'promises', 'relations', 'governors', 'needs', 'monthLog', 'lastMonthLog', 'extraNominees'] as const;

/** A deep copy of the campaign slice the engine may mutate freely. */
/** The game as it was just before the last decision, kept in memory so the President can change their mind. */
let undo: { eventId: string; choiceId: string; state: CampaignState } | null = null;

const draftOf = (s: GameState & CampaignState): CampaignState =>
  structuredClone(Object.fromEntries(CAMPAIGN_KEYS.map((k) => [k, s[k]]))) as unknown as CampaignState;

/** The Budget department's baseline for FY2028: every line grows 8% to keep pace with prices and population. */
export const BASELINE_GROWTH = 1.08;
const defaultProposal = () => Object.fromEntries(BUDGET_LINES.map((l) => [l.id, Math.round(l.fy2027 * BASELINE_GROWTH)]));

/**
 * Single offline game store, persisted to the browser (localStorage) under one autosave slot.
 * Later this will sit behind a SaveRepository so saves can sync to the Spring Boot backend.
 */
export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,

      startNewGame: (player, difficulty = 'normal') => set({ ...initialState, player, phase: 'prologue', flags: { difficulty }, lastSavedAt: now() }),

      applyChoice: (event, effects) =>
        set((s) => {
          const traits = { ...s.traits };
          for (const [k, v] of Object.entries(effects.traits ?? {})) {
            const key = k as keyof Traits;
            traits[key] = clamp(traits[key] + (v ?? 0), 0, 10);
          }
          return {
            traits,
            ideology: {
              economic: clamp(s.ideology.economic + (effects.ideology?.economic ?? 0), -100, 100),
              social: clamp(s.ideology.social + (effects.ideology?.social ?? 0), -100, 100),
            },
            tags: Array.from(new Set([...s.tags, ...(effects.tags ?? [])])),
            partyId: effects.partyId ?? s.partyId,
            homeRegionId: effects.homeRegionId ?? s.homeRegionId,
            platform: effects.platform ?? s.platform,
            lifeEvents: [...s.lifeEvents, event],
            lastSavedAt: now(),
          };
        }),

      advanceChapter: () => set((s) => ({ chapterIndex: s.chapterIndex + 1 })),

      setPhase: (phase) => set({ phase, lastSavedAt: now() }),

      setFlag: (key, value) => set((s) => ({ flags: { ...s.flags, [key]: value } })),

      resetGame: () => set(initialState),

      /** Sets up the inherited government on inauguration day. Safe to call more than once. */
      initPresidency: () => {
        const s = get();
        if (s.government && s.economy) return;
        const partyId = s.partyId ?? 'lda';
        // Difficulty shapes the Republic you inherit.
        const level = (s.flags.difficulty as Difficulty) ?? 'normal';
        const D = DIFFICULTY_SETTINGS[level];
        const government = generateGovernment(partyId, { pendingCoalition: true, seed: `${s.player?.firstName}${s.player?.lastName}:${partyId}` });
        if (D.hostileSenators > 0) {
          let left = D.hostileSenators;
          government.senators = government.senators.map((x) => (left > 0 && x.stance !== 'opposition' && !x.isSenatePresident ? (left--, { ...x, stance: 'opposition' as const }) : x));
        }
        set({
          economy: {
            ...INHERITED_ECONOMY,
            debt: INHERITED_ECONOMY.debt * D.debtFactor,
            inflation: INHERITED_ECONOMY.inflation + D.inflation,
            treasury: INHERITED_ECONOMY.treasury + D.treasury,
            approval: INHERITED_ECONOMY.approval + D.approval + Math.round(((Number(s.flags.election_percent) || 40) - 40) / 2),
          },
          government,
          cabinet: CABINET_POSTS.map((p) => ({ postId: p.id, nomineeId: null, status: 'vacant', rejectedIds: [] })),
          budgetProposal: defaultProposal(),
          budgetSubmitted: false,
          ledger: [],
          gameDate: monthLabel(-1),
          month: -1,
          politics: { ...INITIAL_POLITICS, capital: INITIAL_POLITICS.capital + D.capital, cohesion: INITIAL_POLITICS.cohesion + D.cohesion, investor: INITIAL_POLITICS.investor + D.investor },
          taxRate: INHERITED_ECONOMY.revenueAnnual / INHERITED_ECONOMY.gdp,
          activeBudget: { fy: 2027, total: TOTAL_FY2027, debtServiceLine: 877 },
          resolved: {},
          scheduled: [],
          flags: { ...s.flags, home_region: s.homeRegionId ?? '' },
          lastSavedAt: now(),
        });
        get().refreshQueue();
      },

      refreshQueue: () => {
        const d = draftOf(get());
        const queue = buildQueue(d);
        set({ queue, scheduled: d.scheduled });
      },

      openCurrentEvent: (eventId) => {
        const s = get();
        const head = eventId && s.queue.includes(eventId) ? eventId : s.queue[0];
        if (!head || s.lastReport || s.context?.eventId === head) return;
        const d = draftOf(s);
        openEvent(d, head);
        set({ context: d.context });
      },

      choose: (eventId, choiceId) => {
        undo = { eventId, choiceId, state: draftOf(get()) };
        const d = draftOf(get());
        if (d.context?.eventId !== eventId) openEvent(d, eventId);
        const report = resolveChoice(d, eventId, choiceId);
        if (!report) return null;
        // Follow-ups scheduled for this very month join the queue immediately.
        const fresh = buildQueue(d).filter((id) => !d.queue.includes(id));
        // Keep the desk in priority order so a follow-up is not stuck behind the end of the chapter.
        const pri = (id: string) => EVENTS_BY_ID[id]?.priority ?? 0;
        const queue = [...d.queue, ...fresh].map((id, i) => ({ id, i })).sort((x, y) => pri(y.id) - pri(x.id) || x.i - y.i).map((x) => x.id);
        set({ ...d, queue, lastSavedAt: now() });
        return report;
      },

      canReconsider: () => {
        const s = get();
        return !!undo && !!s.lastReport && s.lastReport.eventId === undo.eventId && s.lastReport.choiceId === undo.choiceId && !s.flags[`reconsidered_${undo.eventId}`];
      },

      reconsider: () => {
        if (!get().canReconsider() || !undo) return false;
        const prev = undo.state;
        const id = undo.eventId;
        undo = null;
        set({
          ...prev,
          lastReport: null,
          queue: prev.queue.includes(id) ? prev.queue : [id, ...prev.queue],
          flags: { ...prev.flags, [`reconsidered_${id}`]: true },
          politics: { ...prev.politics, capital: Math.max(0, prev.politics.capital - 3), media: Math.min(100, prev.politics.media + 2) },
          lastSavedAt: now(),
        });
        return true;
      },


      dismissReport: () => set({ lastReport: null }),

      replyMessage: (id, option) => {
        const d = draftOf(get());
        const r = answerMessage(d, id, option);
        set({ ...d, lastSavedAt: now() });
        return r;
      },
      submitDraft: (eventId, picks) => {
        const ev = EVENTS_BY_ID[eventId];
        if (!ev?.draft) return null;
        const d = draftOf(get());
        if (d.context?.eventId !== eventId) openEvent(d, eventId);
        d.context = { ...(d.context ?? { eventId }), eventId, draftFx: draftEffects(ev.draft, picks) };
        const report = resolveChoice(d, eventId, ev.choices[0].id);
        if (!report) return null;
        undo = null;
        set({ ...d, lastSavedAt: now() });
        return report;
      },
      sideWith: (eventId, choiceId, winner, losers) => {
        get().choose(eventId, choiceId);
        const trust = { ...(get().trust ?? {}) };
        const bump = (k: string, d: number) => (trust[k] = Math.max(0, Math.min(100, (trust[k] ?? 55) + d)));
        if (winner) bump(winner, 4);
        losers.forEach((k) => bump(k, winner ? -4 : -2));
        set({ trust });
      },
      campaign: (stops, budget, message) => {
        const d = draftOf(get());
        const cost = CAMPAIGN_BUDGET[budget].cost;
        const lines = runCampaign(d, stops, budget, message);
        if (lines.length) applyLoose(d, { spend: cost, spendLabel: 'Election campaign' }, 'campaign');
        set({ ...d, lastSavedAt: now() });
        return lines;
      },
      markInboxRead: () => set((s) => ({ inbox: (s.inbox ?? []).map((m) => ({ ...m, read: true })) })),
      finishPress: (effects) => {
        const d = draftOf(get());
        effects.forEach((fx, i) => applyLoose(d, fx, `press:${i}`));
        d.flags = { ...d.flags, [`press_${d.month}`]: true };
        set({ ...d, lastSavedAt: now() });
      },
      giveSona: (brags, promises, target) => {
        const d = draftOf(get());
        const lines = deliverSona(d, brags, promises, target);
        set({ ...d, lastSavedAt: now() });
        return lines;
      },
      ensureInstitutions: () => {
        const s = get();
        if (!s.government || !s.player) return;
        const missing = CABINET_POSTS.filter((p) => !s.cabinet.some((c) => c.postId === p.id));
        if (!missing.length && s.centralBank && s.goccs && s.debtTally) return;
        const d = draftOf(s);
        d.cabinet = [...d.cabinet, ...missing.map((p) => ({ postId: p.id, nomineeId: null, status: 'vacant' as const, rejectedIds: [] }))];
        if (!d.centralBank) {
          d.centralBank = initCentralBank(d);
          const D = DIFFICULTY_SETTINGS[(d.flags.difficulty as Difficulty) ?? 'normal'] ?? DIFFICULTY_SETTINGS.normal;
          d.centralBank = { ...d.centralBank, peso: D.peso, reserves: D.reserves, pesoHistory: [D.peso] };
        }
        if (!d.goccs) d.goccs = initGoccs(d);
        if (!d.debtTally) d.debtTally = { start: d.economy?.debt ?? 0, principal: 0, prepaid: 0, revaluation: 0, loans: 0 };
        set({ cabinet: d.cabinet, centralBank: d.centralBank, goccs: d.goccs, debtTally: d.debtTally });
      },
      askBank: (request) => {
        const d = draftOf(get());
        const r = pressureBank(d, request);
        set({ ...d, lastSavedAt: now() });
        return r;
      },
      pickGovernor: (o) => {
        const d = draftOf(get());
        const r = appointGovernor(d, o);
        set({ ...d, lastSavedAt: now() });
        return r;
      },
      auditGocc: (id) => {
        const d = draftOf(get());
        const r = auditGocc(d, id);
        set({ ...d, lastSavedAt: now() });
        return r;
      },
      replaceGoccChief: (id, index) => {
        const d = draftOf(get());
        const r = replaceCeo(d, id, index);
        set({ ...d, lastSavedAt: now() });
        return r;
      },
      createGocc: (templateId, ceoIndex, board) => {
        const d = draftOf(get());
        const r = createGocc(d, templateId, ceoIndex, board);
        set({ ...d, lastSavedAt: now() });
        return r;
      },
      investProvince: (provinceId, sector) => {
        const d = draftOf(get());
        const r = investInProvince(d, provinceId, sector);
        set({ ...d, lastSavedAt: now() });
        return r;
      },
      courtCompany: (companyId, offer) => {
        const d = draftOf(get());
        const r = courtCompany(d, companyId, offer);
        set({ ...d, lastSavedAt: now() });
        return r;
      },
      birAction: (id) => {
        const d = draftOf(get());
        const r = birAction(d, id);
        set({ ...d, lastSavedAt: now() });
        return r;
      },
      prepayDebt: (amount) => {
        const d = draftOf(get());
        const r = prepayDebt(d, amount);
        set({ ...d, lastSavedAt: now() });
        return r;
      },

      startChapter2: () => {
        const s = get();
        if (s.chapter !== 1 || !s.chapterComplete || s.flags.game_over) return;
        const d = draftOf(s);
        const report = monthTick(d);
        d.chapter = 2;
        d.chapterComplete = false;
        d.month = 36;
        d.gameDate = monthLabel(36);
        d.context = null;
        d.lastReport = null;
        d.queue = [];
        d.queue = buildQueue(d);
        d.monthReport = report;
        set({ ...d, lastSavedAt: now() });
      },

      endMonth: () => {
        const s = get();
        if (s.queue.length > 0 || s.chapterComplete) return;
        const d = draftOf(s);
        // The transition month happens before you control the Treasury.
        const report = d.month >= 0 ? monthTick(d) : null;
        d.month += 1;
        d.gameDate = monthLabel(d.month);
        d.queue = [];
        d.queue = buildQueue(d);
        d.monthReport = report;
        d.context = null;
        set({ ...d, lastSavedAt: now() });
      },

      /** Every peso the administration spends goes through here. Returns the amount that had to be borrowed. */
      spend: (label, amount) => {
        const s = get();
        if (!s.economy || amount === 0) return 0;
        const { economy, borrowed } = applySpend(s.economy, amount);
        const entry: LedgerEntry = { id: `${Date.now()}-${s.ledger.length}`, date: s.gameDate, label, amount: -amount, borrowed };
        set({ economy, ledger: [entry, ...s.ledger], lastSavedAt: now() });
        return borrowed;
      },

      adjustApproval: (delta) =>
        set((s) => (s.economy ? { economy: { ...s.economy, approval: clamp(s.economy.approval + delta, 0, 100) } } : {})),

      appoint: (postId, nomineeId) => {
        const s = get();
        const post = CABINET_POSTS.find((p) => p.id === postId);
        const nominee = post?.nominees.find((n) => n.id === nomineeId) ?? s.extraNominees?.[postId]?.find((n) => n.id === nomineeId);
        if (!post || !nominee || !s.government || !s.player) return null;

        const isVp = nominee.id === VP_NOMINEE_ID;
        const needsHearing = post.requiresConfirmation && !isVp;
        const hearing = needsHearing ? holdHearing(nominee, s.government, `${s.player.firstName}${s.player.lastName}`) : undefined;
        const outcome: AppointResult['outcome'] = !needsHearing ? 'no_confirmation' : hearing!.confirmed ? 'confirmed' : 'rejected';

        set({
          cabinet: s.cabinet.map((seat) =>
            seat.postId !== postId
              ? seat
              : outcome === 'rejected'
                ? { ...seat, nomineeId: null, status: 'rejected', rejectedIds: [...seat.rejectedIds, nomineeId], caVote: hearing && { yes: hearing.yes, no: hearing.no } }
                : { ...seat, nomineeId, status: outcome, caVote: hearing && { yes: hearing.yes, no: hearing.no } },
          ),
          flags: { ...s.flags, [`cabinet_${postId}`]: outcome === 'rejected' ? '' : nomineeId, ...(isVp ? { vp_in_cabinet: postId } : {}) },
        });

        let cost = 0;
        let borrowed = 0;
        if (outcome !== 'rejected' && nominee.demand) {
          if (nominee.demand.cost) {
            cost = nominee.demand.cost;
            borrowed = get().spend(`${post.title}: ${nominee.demand.text}`, cost);
          }
          if (nominee.demand.approval) get().adjustApproval(nominee.demand.approval);
        }
        if (outcome === 'rejected') get().adjustApproval(-1);
        return { outcome, hearing, cost, borrowed };
      },

      setBudgetLine: (lineId, amount) =>
        set((s) => (s.budgetProposal && !s.budgetSubmitted && s.month < 1 ? { budgetProposal: { ...s.budgetProposal, [lineId]: Math.max(0, Math.round(amount)) } } : {})),

      resetBudgetProposal: () => set((s) => (s.budgetSubmitted ? {} : { budgetProposal: defaultProposal() })),

      submitBudget: () => set((s) => ({ budgetSubmitted: true, flags: { ...s.flags, nep_2028_submitted: true }, lastSavedAt: now() })),
    }),
    {
      name: 'palasyo-autosave',
      version: 2,
      // Saves are compressed and batched so long games fit within the browser's storage limit.
      storage: createJSONStorage(() => batchedStorage),
      // v1 saves simply lack the presidency fields; defaults fill them and initPresidency() builds them.
      migrate: (persisted) => persisted as GameState,
    },
  ),
);

export const fullName = (p: PlayerProfile | null) => (p ? `${p.firstName} ${p.lastName}` : '');
