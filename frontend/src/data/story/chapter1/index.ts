import type { StoryEvent } from '@/features/narrative/types/event';
import { YEAR_1 } from './year1';
import { YEAR_2 } from './year2';
import { YEAR_3 } from './year3';
import { TWISTS } from './twists';
import { BILLS } from './bills';
import { ISSUES } from './issues';
import { GROWTH_1 } from './growth';
import { ARCS_1 } from './arcs';
import { EXTRA_1 } from './extra';
import { VENTURES_1 } from './ventures';
import { HUBS_1 } from './hubs';
import { OFFERS_1 } from '../offers';

export const CHAPTER_1_TITLE = 'Kabanata 1: Ang Mabigat na Korona';
export const CHAPTER_1_SUBTITLE = 'The Heavy Crown · May 2027 – June 2030';

export const CHAPTER_1_EVENTS: StoryEvent[] = [...TWISTS, ...YEAR_1, ...YEAR_2, ...YEAR_3, ...ISSUES, ...GROWTH_1, ...ARCS_1, ...EXTRA_1, ...VENTURES_1, ...HUBS_1, ...OFFERS_1, ...BILLS];

export const EVENTS_BY_ID: Record<string, StoryEvent> = Object.fromEntries(CHAPTER_1_EVENTS.map((e) => [e.id, e]));
