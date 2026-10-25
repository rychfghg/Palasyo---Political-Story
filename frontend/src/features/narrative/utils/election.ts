import { PARTIES } from '@/data/world/parties';
import type { Traits } from '@/features/game-engine/types/player';

export interface Candidate {
  name: string;
  partyId: string;
  votes: number;
  percent: number;
  isPlayer: boolean;
}

export interface ElectionResult {
  president: Candidate[];
  vicePresident: Candidate[];
  vpIsAlly: boolean;
  turnout: number;
}

const REGISTERED_VOTERS = 68_400_000;

/** Deterministic pseudo-random from a string so the same save always shows the same result. */
function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

/** The player always wins the presidency (the story begins there); margin and VP outcome depend on the life they led. */
export function computeElection(playerName: string, playerPartyId: string, traits: Traits, tags: string[]): ElectionResult {
  const rand = seeded(playerName + playerPartyId);
  const turnout = 0.8 + rand() * 0.06;
  const cast = Math.round(REGISTERED_VOTERS * turnout);

  const strength = traits.popularity * 1.4 + traits.charisma + traits.network * 0.8 + traits.grit * 0.4;
  const playerShare = Math.min(0.52, 0.31 + strength / 150 + rand() * 0.04);

  const rivalParties = PARTIES.filter((p) => p.id !== playerPartyId);
  const cuencaParty = playerPartyId === 'pbl' ? 'pbn' : 'pbl';
  const salcedoParty = playerPartyId === 'lda' ? 'kmb' : 'lda';
  const minorParty = rivalParties.find((p) => p.id !== cuencaParty && p.id !== salcedoParty)?.id ?? 'pfk';

  const rest = 1 - playerShare;
  const cuenca = Math.min(rest * (0.5 + rand() * 0.1), playerShare - 0.015 - rand() * 0.04);
  const salcedo = rest * (0.34 + rand() * 0.06);
  const minor = rest - cuenca - salcedo;

  const toCandidates = (rows: [string, string, number, boolean][]) =>
    rows
      .map(([name, partyId, share, isPlayer]) => ({
        name,
        partyId,
        votes: Math.round(cast * share),
        percent: Math.round(share * 1000) / 10,
        isPlayer,
      }))
      .sort((a, b) => b.votes - a.votes);

  const president = toCandidates([
    [playerName, playerPartyId, playerShare, true],
    // If the player took a rival's party, that party's usual candidate is replaced by the other party's leader.
    [cuencaParty === 'pbl' ? 'VP Emilio Cuenca' : 'Gov. Leonardo "Leon" Aragon', cuencaParty, cuenca, false],
    [salcedoParty === 'lda' ? 'Sen. Aurora "Rora" Salcedo' : 'Rep. Teodoro "Ka Teddy" Lumbera', salcedoParty, salcedo, false],
    ['Mayor Nestor Pangilinan-Uy', minorParty, minor, false],
  ]);

  // The Vice President is elected separately: a rival VP is a real possibility.
  const clean = tags.includes('compromised') ? -0.04 : tags.includes('whistleblower') ? 0.03 : 0;
  // Your running mate may or may not win — the vice presidency is a separate race.
  const allyShare = 0.3 + traits.network / 70 + traits.popularity / 200 + clean + rand() * 0.09;
  const rivalShare = 0.38 + rand() * 0.09;
  const thirdShare = Math.max(0.08, 1 - allyShare - rivalShare);
  const total = allyShare + rivalShare + thirdShare;

  const vicePresident = toCandidates([
    ['Sen. Paolo Benitez (your running mate)', playerPartyId, allyShare / total, false],
    ['Gov. Imelda "Mayet" Olivarez-Lim', cuencaParty, rivalShare / total, false],
    ['Rep. Jun Magbanua', salcedoParty, thirdShare / total, false],
  ]);

  return {
    president,
    vicePresident,
    vpIsAlly: vicePresident[0].partyId === playerPartyId,
    turnout: Math.round(turnout * 1000) / 10,
  };
}
