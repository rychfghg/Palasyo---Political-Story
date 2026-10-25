import type { StoryEvent } from '@/features/narrative/types/event';
import { CHAPTER_1_EVENTS } from './chapter1';
import { CHAPTER_2_EVENTS } from './chapter2';
import { RANDOM_EVENTS } from './random';
import { INSTITUTION_EVENTS } from './institutions';
import { LOYALTY_EVENTS } from './loyalty';
import { FAMILY_EVENTS } from './family';
import { BIG_TWISTS } from './bigtwists';
import { STATECRAFT_EVENTS } from './statecraft';
import { CHAOS_EVENTS } from './chaos';

export const ALL_EVENTS: StoryEvent[] = [...CHAPTER_1_EVENTS, ...CHAPTER_2_EVENTS, ...RANDOM_EVENTS, ...INSTITUTION_EVENTS, ...LOYALTY_EVENTS, ...FAMILY_EVENTS, ...BIG_TWISTS, ...STATECRAFT_EVENTS, ...CHAOS_EVENTS];

export const EVENTS_BY_ID: Record<string, StoryEvent> = Object.fromEntries(ALL_EVENTS.map((e) => [e.id, e]));
