import { describe, expect, it } from 'vitest';
import { useGameStore } from '@/features/game-engine/store/gameStore';
import { availableChoices, EVENTS_BY_ID } from '@/features/game-engine/engine/engine';
import type { CampaignState } from '@/features/game-engine/types/campaign';

const BAD_TEXT = /undefined|NaN|\{[a-zA-Z_][a-zA-Z0-9_]*\}/;

/** Plays a whole term with a deterministic pseudo-random player and returns what happened. */
function play(difficulty: 'easy' | 'normal' | 'hard', seed: number) {
  let r = seed;
  const rand = () => ((r = (r * 1103515245 + 12345) % 2147483648) / 2147483648);
  const g = useGameStore;
  g.getState().resetGame();
  g.getState().startNewGame({ firstName: 'Test', lastName: 'Player', nickname: 'Testy', honorific: 'Mr.' } as never, difficulty);
  g.getState().setPhase('presidency');
  g.getState().initPresidency();
  g.getState().ensureInstitutions();
  g.getState().submitBudget();
  g.getState().refreshQueue();
  const bad: string[] = [];
  let decisions = 0;

  for (let month = 0; month < 90; month++) {
    let guard = 0;
    while (g.getState().queue.length && guard++ < 60) {
      const s = g.getState() as unknown as CampaignState;
      const id = s.queue[0];
      g.getState().openCurrentEvent(id);
      const ev = EVENTS_BY_ID[id];
      const choices = availableChoices(g.getState() as unknown as CampaignState, ev);
      const report = ev.draft
        ? g.getState().submitDraft(id, ev.draft.knobs.map(() => 0))
        : choices.length
          ? g.getState().choose(id, choices[Math.floor(rand() * choices.length)].id)
          : null;
      if (!report && !ev.draft && !choices.length) bad.push(`${id}: no choices available`);
      if (report && BAD_TEXT.test(JSON.stringify(report))) bad.push(`${id}: ${JSON.stringify(report).match(BAD_TEXT)?.[0]}`);
      g.getState().dismissReport();
      decisions++;
    }
    const s = g.getState();
    if (s.flags.game_over) break;
    if (s.chapterComplete) {
      if ((s.chapter ?? 1) >= 2) break;
      s.startChapter2();
      continue;
    }
    s.endMonth();
  }
  const s = g.getState();
  const lapsed = Object.keys(s.flags).filter((k) => k.startsWith("lapsed_")).length;
  return { bad, decisions, lapsed, month: s.month, approval: s.economy?.approval ?? NaN, over: s.flags.game_over };
}

describe('full playthrough', () => {
  for (const difficulty of ['easy', 'normal', 'hard'] as const) {
    it(`plays a ${difficulty} term without crashing or broken text`, () => {
      const res = play(difficulty, difficulty.length * 7919);
      expect(res.decisions).toBeGreaterThan(50);
      expect(Number.isFinite(res.approval)).toBe(true);
      expect(res.bad).toEqual([]);
      console.log(`${difficulty}: ${res.decisions} decisions, ${res.lapsed} lapsed, month ${res.month}, approval ${Math.round(res.approval)}%${res.over ? `, ended: ${res.over}` : ""}`);
    });
  }
});
