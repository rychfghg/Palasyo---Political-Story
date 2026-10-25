import type { Stance } from '@/features/game-engine/types/government';

export const STANCE_LABEL: Record<Stance, string> = {
  ally: 'Administration',
  neutral: 'Independent',
  opposition: 'Opposition',
};

export const STANCE_COLOR: Record<Stance, string> = {
  ally: '#d6b25e',
  neutral: '#8a95a3',
  opposition: '#c0463c',
};

export function StanceBadge({ stance }: { stance: Stance }) {
  return (
    <span className={`stance stance--${stance}`}>
      <i />
      {STANCE_LABEL[stance]}
    </span>
  );
}
