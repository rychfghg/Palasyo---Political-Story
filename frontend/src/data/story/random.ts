import type { StoryEvent } from '@/features/narrative/types/event';

/** Templates for random vacancies. The engine fills in who left and who was nominated. */
const justiceVacancy = (n: number): StoryEvent => ({
  id: `sc_rand_vac_${n}`,
  priority: 7,
  category: 'court',
  title: 'Biglaang Bakante sa Korte Suprema',
  location: 'Judicial and Bar Council',
  body: [
    '{vacantJusticeRole} {vacantJustice} leaves the Supreme Court years before mandatory retirement — for reasons of health, family, or, some whisper, pressure. The Judicial and Bar Council sends you a shortlist of three.',
    'Whoever you choose will serve long after you leave the Palasyo — and owes you nothing once sworn in.',
  ],
  choices: [
    { id: `sc_rand_vac_${n}_a`, label: '{jbc1} (Moderate)', description: 'A career judge with a long record.', outcome: 'The legal community approves of a safe, respected choice.', effects: { appointJustice: { replaces: 'random', name: '{jbc1}', philosophy: 'Moderate' }, stats: { courtTension: -3 } } },
    { id: `sc_rand_vac_${n}_b`, label: '{jbc2} (Progressive)', description: 'A law dean and human-rights scholar.', outcome: 'Civil society applauds. Your allies worry the new justice will rule against you.', effects: { appointJustice: { replaces: 'random', name: '{jbc2}', philosophy: 'Progressive' }, stats: { church: 2, media: -3 } } },
    { id: `sc_rand_vac_${n}_c`, label: '{jbc3} (Pragmatist)', description: 'A former government lawyer, close to the Palasyo.', outcome: 'Critics call it court-packing. Your appointee promises independence.', effects: { appointJustice: { replaces: 'random', name: '{jbc3}', philosophy: 'Pragmatist' }, stats: { media: 5, courtTension: 2 } } },
  ],
});

const senateVacancy = (n: number): StoryEvent => ({
  id: `sen_vac_${n}`,
  priority: 7,
  category: 'congress',
  title: 'Bakanteng Upuan sa Senado',
  location: 'Senate',
  body: [
    'Senator {vacantSenator} leaves the Senate — a sudden illness, an appointment abroad, or a scandal too big to survive. Under the Constitution, the seat stays empty until the next election. The balance of the Senate shifts.',
  ],
  choices: [
    { id: `sen_vac_${n}_honor`, label: 'Pay tribute and move on', description: 'Respect for the institution.', outcome: 'The Senate now has one fewer vote — for everyone.', effects: { removeSenator: true, stats: { cohesion: 1 } } },
    { id: `sen_vac_${n}_court`, label: 'Court the senator’s allies in the chamber', description: 'Their votes are now up for grabs.', outcome: 'Two of the senator’s friends drift toward your camp.', effects: { removeSenator: true, stats: { capital: -3 }, senateShift: { from: 'neutral', to: 'ally', count: 1 } } },
  ],
});

export const RANDOM_EVENTS: StoryEvent[] = [
  ...Array.from({ length: 8 }, (_, i) => justiceVacancy(i + 1)),
  ...Array.from({ length: 5 }, (_, i) => senateVacancy(i + 1)),
];
