import { useEffect, useRef } from 'react';
import { useGameStore } from '@/features/game-engine/store/gameStore';
import { EVENTS_BY_ID } from '@/features/game-engine/engine/engine';
import { pressDue } from '@/features/game-engine/engine/extras';
import type { CampaignState } from '@/features/game-engine/types/campaign';
import { buzz, cameras, crowd, gavel } from '@/shared/utils/sfx';

/** Plays sound effects when things happen on the desk (only with sound on). */
export function SoundCues() {
  const s = useGameStore() as unknown as CampaignState;
  const outcome = s.context?.outcome?.title ?? (s.context?.ruling ? `ruling:${s.context.eventId}` : '');
  const press = pressDue(s);
  const texts = (s.inbox ?? []).length;
  const current = s.queue[0] ?? '';
  const last = useRef({ outcome, press, texts, current });

  useEffect(() => {
    const p = last.current;
    if (outcome && outcome !== p.outcome) gavel();
    if (press && !p.press) cameras();
    if (texts > p.texts) buzz();
    if (current && current !== p.current) {
      const ev = EVENTS_BY_ID[current];
      if (ev && (current.startsWith('rv_') || /protest|rally|strike/i.test(`${ev.id} ${ev.title}`))) crowd();
    }
    last.current = { outcome, press, texts, current };
  }, [outcome, press, texts, current]);
  return null;
}
