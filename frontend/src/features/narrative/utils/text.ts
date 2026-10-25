import type { PlayerProfile } from '@/features/game-engine/types/player';

/** Replaces {name}, {nickname}, {lastName}, {honorific} tokens in story text. */
export function fillTokens(text: string, player: PlayerProfile | null): string {
  if (!player) return text;
  return text
    .replaceAll('{name}', `${player.firstName} ${player.lastName}`)
    .replaceAll('{nickname}', player.nickname || player.firstName)
    .replaceAll('{lastName}', player.lastName)
    .replaceAll('{honorific}', player.honorific);
}
