export type TraitKey = 'charisma' | 'integrity' | 'intellect' | 'grit' | 'network' | 'popularity';

export type Traits = Record<TraitKey, number>;

/** -100..100 on each axis. Economic: left (-) ↔ right (+). Social: traditional (-) ↔ progressive (+). */
export interface Ideology {
  economic: number;
  social: number;
}

export type Honorific = 'Ginoong' | 'Ginang' | 'Binibining';

export interface PlayerProfile {
  firstName: string;
  lastName: string;
  nickname: string;
  honorific: Honorific;
}

export interface LifeEvent {
  chapterId: string;
  year: number;
  chapterTitle: string;
  choiceLabel: string;
}

export const TRAIT_LABELS: Record<TraitKey, string> = {
  charisma: 'Charisma',
  integrity: 'Integrity',
  intellect: 'Intellect',
  grit: 'Grit',
  network: 'Network',
  popularity: 'Popularity',
};

export const BASE_TRAITS: Traits = {
  charisma: 3,
  integrity: 3,
  intellect: 3,
  grit: 3,
  network: 3,
  popularity: 3,
};
