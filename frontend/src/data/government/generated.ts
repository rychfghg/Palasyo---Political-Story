import type { Faction, Nominee } from './cabinet';
import type { Philosophy } from './supremeCourt';

const FIRST = ['Adelina', 'Benjamin', 'Carmela', 'Diosdado', 'Estrella', 'Fernando', 'Gloria', 'Hermogenes', 'Imelda', 'Jerome', 'Katrina', 'Leandro', 'Milagros', 'Nestor', 'Ofelia', 'Patricio', 'Rosalinda', 'Salvador', 'Teresita', 'Virgilio', 'Wilma', 'Zenaida', 'Arnel', 'Cristina', 'Danilo', 'Evangeline', 'Gregorio', 'Lourdes', 'Marlon', 'Perla'];
const LAST = ['Alcantara', 'Bacani', 'Cabrera', 'Dimaano', 'Escalona', 'Fajardo', 'Gamboa', 'Hilario', 'Ignacio', 'Javellana', 'Laxamana', 'Manalastas', 'Nepomuceno', 'Obando', 'Pascual', 'Quiambao', 'Rivera', 'Sarmiento', 'Tabora', 'Umali', 'Valdez', 'Yap', 'Zaldivar', 'Baltazar', 'Cortez', 'Dumlao', 'Evangelista', 'Galang', 'Lorenzo', 'Mercado'];

const BACKGROUNDS: [Faction, string, string][] = [
  ['technocrat', 'Career official with 25 years in the department', 'Competent and cautious.'],
  ['technocrat', 'University professor and former World Bank consultant', 'Brilliant on paper; untested in politics.'],
  ['party', 'Three-term congressman from your coalition', 'Brings votes — and debts to repay.'],
  ['business', 'Former chief executive of a major conglomerate', 'Efficient; the conflicts of interest are obvious.'],
  ['loyalist', 'Long-time aide from your campaign', 'Will never betray you. May never tell you no.'],
  ['activist', 'Civil-society leader and reform advocate', 'Clean, uncompromising, unpopular in Congress.'],
  ['military', 'Retired general with a spotless record', 'Discipline over nuance.'],
  ['clan', 'Scion of a provincial political family', 'A gift to a powerful clan.'],
];

/** Tiny deterministic generator so the same save always produces the same candidates. */
function rng(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

export function randomName(seed: string): string {
  const r = rng(seed);
  return `${FIRST[Math.floor(r() * FIRST.length)]} ${LAST[Math.floor(r() * LAST.length)]}`;
}

/** New candidates for a Cabinet post that has just been vacated. */
export function generateNominees(postId: string, seed: string, count = 2, taken?: Set<string>): Nominee[] {
  const r = rng(`${seed}:${postId}`);
  return Array.from({ length: count }, (_, i) => {
    const [faction, background, note] = BACKGROUNDS[Math.floor(r() * BACKGROUNDS.length)];
    const title = faction === 'military' ? 'Gen. (Ret.)' : faction === 'party' ? 'Rep.' : faction === 'technocrat' ? 'Dr.' : 'Atty.';
    const stat = (base: number) => Math.max(2, Math.min(10, Math.round(base + (r() - 0.5) * 5)));
    let who = randomName(`${seed}:${postId}:${i}`);
    for (let k = 1; taken?.has(who) && k < 40; k++) who = randomName(`${seed}:${postId}:${i}:${k}`);
    taken?.add(who);
    return {
      id: `gen-${postId}-${seed.length}-${i}-${Math.floor(r() * 1e6)}`,
      name: `${title} ${who}`,
      background,
      faction,
      partyId: null,
      competence: stat(faction === 'technocrat' ? 8 : 6),
      loyalty: stat(faction === 'loyalist' ? 9 : 6),
      integrity: stat(faction === 'activist' ? 9 : faction === 'clan' || faction === 'business' ? 5 : 7),
      caAppeal: faction === 'party' || faction === 'clan' ? 2 : faction === 'activist' ? -2 : Math.round((r() - 0.5) * 2),
      note,
    };
  });
}

/** Three JBC nominees for a sudden Supreme Court vacancy, one of each leaning. */
export function jbcShortlist(seed: string): { name: string; philosophy: Philosophy; background: string }[] {
  const r = rng(`jbc:${seed}`);
  const pick = <T,>(a: T[]) => a[Math.floor(r() * a.length)];
  return [
    { name: `Justice ${randomName(`${seed}:a`)}`, philosophy: pick(['Textualist', 'Moderate'] as Philosophy[]), background: 'Court of Appeals, 20 years on the bench.' },
    { name: `Dean ${randomName(`${seed}:b`)}`, philosophy: 'Progressive', background: 'Law dean and human-rights scholar.' },
    { name: `Atty. ${randomName(`${seed}:c`)}`, philosophy: 'Pragmatist', background: 'Former government lawyer, close to the Palasyo.' },
  ];
}
