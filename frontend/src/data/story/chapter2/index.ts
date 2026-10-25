import type { StoryEvent } from '@/features/narrative/types/event';
import { ISSUES } from '../chapter1/issues';
import { GROWTH_1 } from '../chapter1/growth';
import { GROWTH_2 } from './growth';
import { MORE_2 } from './more';
import { ARCS_2 } from './arcs';
import { EXTRA_2 } from './extra';
import { VENTURES_2 } from './ventures';
import { OFFERS_2 } from '../offers';
import { BILLS_2 } from './bills';
import { ISSUES_2 } from './issues';
import { POLITICS_2 } from './politics';

export const CHAPTER_2_TITLE = 'Kabanata 2: Pamana at Paghuhukom';
export const CHAPTER_2_SUBTITLE = 'Legacy and Judgment · July 2030 – June 2033';

/** Crisis events that can end a presidency get a second copy for Chapter 2, so they can strike again. */
const CRISIS_IDS = ['people_power', 'military_withdraws', 'impeachment_second', 'ombudsman_inner_circle', 'senate_trial', 'economic_rally', 'boom_times', 'debt_alarm'];

function secondCopy(e: StoryEvent): StoryEvent {
  let json = JSON.stringify(e);
  for (const id of CRISIS_IDS) json = json.split(`"${id}"`).join(`"${id}_2"`);
  return JSON.parse(json) as StoryEvent;
}

const CRISES_2 = [...ISSUES, ...GROWTH_1].filter((e) => CRISIS_IDS.includes(e.id)).map(secondCopy);

export const CHAPTER_2_EVENTS: StoryEvent[] = [...POLITICS_2, ...ISSUES_2, ...GROWTH_2, ...MORE_2, ...ARCS_2, ...EXTRA_2, ...VENTURES_2, ...OFFERS_2, ...BILLS_2, ...CRISES_2];
