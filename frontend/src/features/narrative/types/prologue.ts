import type { Ideology, TraitKey } from '@/features/game-engine/types/player';

export interface ChoiceEffects {
  traits?: Partial<Record<TraitKey, number>>;
  ideology?: Partial<Ideology>;
  tags?: string[];
  partyId?: string;
  homeRegionId?: string;
  platform?: string;
}

export interface PrologueChoice {
  id: string;
  label: string;
  description: string;
  /** Narration shown after picking. Supports {name}, {nickname}, {lastName} tokens. */
  outcome: string;
  effects: ChoiceEffects;
  /** Choice only appears if the player has at least one of these tags. */
  requiresAnyTag?: string[];
}

export interface PrologueChapter {
  id: string;
  year: number;
  title: string;
  subtitle: string;
  body: string[];
  /** Extra paragraph appended when the player has a given tag (first match wins). */
  tagVariants?: { tag: string; text: string }[];
  prompt: string;
  choices: PrologueChoice[];
}
