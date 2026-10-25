/** The look of each fate: an emblem, a tagline, and a color theme for the ending screen. */
export const ENDING_THEMES: Record<string, { icon: string; tag: string; theme: string }> = {
  imprisoned: { icon: '⛓️', tag: 'Convicted of plunder', theme: 'prison' },
  plea: { icon: '🏠', tag: 'House arrest', theme: 'prison' },
  exile: { icon: '✈️', tag: 'Exile', theme: 'exile' },
  self_exile: { icon: '🧳', tag: 'A life abroad', theme: 'exile' },
  pardoned: { icon: '📜', tag: 'Pardoned', theme: 'grey' },
  acquitted: { icon: '⚖️', tag: 'Acquitted', theme: 'grey' },
  senator: { icon: '🏛️', tag: 'Senator', theme: 'senate' },
  legislator: { icon: '🏛️', tag: 'Representative', theme: 'senate' },
  free: { icon: '🌳', tag: 'Private citizen', theme: 'free' },
  beloved: { icon: '🌅', tag: 'Beloved statesman', theme: 'beloved' },
  martial: { icon: '🪖', tag: 'Martial-law ruler', theme: 'martial' },
  removed: { icon: '🔨', tag: 'Impeached and removed', theme: 'fall' },
  resigned: { icon: '✉️', tag: 'Resigned', theme: 'grey' },
  ousted: { icon: '🚁', tag: 'Driven out by the people', theme: 'fall' },
  coup: { icon: '🎖️', tag: 'Overthrown', theme: 'martial' },
};

/** Which ending theme applies, refining the story's fate with how the term actually went. */
export function endingKey(fate: string, approval: number, flags: Record<string, unknown>): string {
  if (flags.martial_law_national && !flags.martial_law_revoked && !['imprisoned', 'exile', 'removed', 'ousted', 'coup'].includes(fate)) return 'martial';
  if (['free', 'senator', 'legislator'].includes(fate) && approval >= 65) return 'beloved';
  return ENDING_THEMES[fate] ? fate : 'free';
}

export function EndingBanner({ ending }: { ending: string }) {
  const e = ENDING_THEMES[ending] ?? ENDING_THEMES.free;
  return (
    <div className="ending-banner" aria-hidden>
      <span className="ending-banner__icon">{e.icon}</span>
      <span className="ending-banner__tag">{e.tag}</span>
    </div>
  );
}
