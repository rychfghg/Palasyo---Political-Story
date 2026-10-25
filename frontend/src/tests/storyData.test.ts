import { describe, expect, it } from 'vitest';
import { EVENTS_BY_ID } from '@/features/game-engine/engine/engine';
import type { Condition, Effects } from '@/features/narrative/types/event';

const events = Object.values(EVENTS_BY_ID);

function scheduled(e: Effects | undefined, out: string[]) {
  if (!e) return;
  for (const s of e.schedule ?? []) out.push(s.event);
  scheduled(e.trial?.onConvict, out);
  scheduled(e.trial?.onAcquit, out);
  scheduled(e.verdict?.onConvict, out);
  scheduled(e.verdict?.onAcquit, out);
}

function resolvedRefs(conds: Condition[] | undefined, out: string[]) {
  for (const c of conds ?? []) {
    if ('resolved' in c) out.push(c.resolved);
    if ('any' in c) resolvedRefs(c.any as Condition[], out);
    if ('none' in c) resolvedRefs(c.none as Condition[], out);
  }
}

describe('story data', () => {
  it('has hundreds of events', () => {
    expect(events.length).toBeGreaterThan(500);
  });

  it('every event has a title, body and unique choice ids', () => {
    for (const e of events) {
      expect(e.title, e.id).toBeTruthy();
      expect(e.body.length, e.id).toBeGreaterThan(0);
      const ids = e.choices.map((c) => c.id);
      expect(new Set(ids).size, `${e.id} has duplicate choice ids`).toBe(ids.length);
    }
  });

  it('every scheduled follow-up exists', () => {
    const missing: string[] = [];
    for (const e of events)
      for (const c of e.choices) {
        const refs: string[] = [];
        scheduled(c.effects, refs);
        for (const r of refs) if (!EVENTS_BY_ID[r]) missing.push(`${e.id}/${c.id} → ${r}`);
      }
    expect(missing).toEqual([]);
  });

  it('every "resolved" condition points to a real event', () => {
    const missing: string[] = [];
    for (const e of events) {
      const refs: string[] = [];
      resolvedRefs(e.when, refs);
      for (const c of e.choices) resolvedRefs(c.when, refs);
      for (const r of refs) if (!EVENTS_BY_ID[r]) missing.push(`${e.id} → ${r}`);
    }
    expect(missing).toEqual([]);
  });

  it('event windows are valid', () => {
    for (const e of events) if (e.window) expect(e.window[0], e.id).toBeLessThanOrEqual(e.window[1]);
  });
});
