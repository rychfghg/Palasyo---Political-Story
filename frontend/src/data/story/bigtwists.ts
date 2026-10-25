import type { Condition, StoryEvent } from '@/features/narrative/types/event';
import { quick, then } from './chapter1/helpers';

/**
 * The bigger twists: a coup, a hidden recording, a secret illness, a spy in the Cabinet,
 * and your own party breaking apart. Each is a chain; how it ends depends on what came before.
 */

// ═════════════ THE COUP ═════════════
const COUP_FAILS: Condition = { any: [{ stat: 'approval', gte: 42 }, { flag: 'coup_purged' }, { stat: 'military', gte: 50 }] };
const COUP_WINS: Condition = { none: [{ stat: 'approval', gte: 42 }, { flag: 'coup_purged' }, { stat: 'military', gte: 50 }] };

const COUP: StoryEvent[] = [
  quick('tw_coup_rumors', [14, 64], 'crisis', 'Bulung-bulungan sa Kampo', 'Intelligence Service of the Armed Forces', [
    'Your National Security Adviser brings a folder marked EYES ONLY. A group of colonels calling themselves “Kapatiran ng Bayan” has met four times this month. They say the Republic needs “a reset.”',
    'The generals swear loyalty. The colonels command the tanks.',
  ], [
    ['Quietly reassign and investigate the colonels', 'Break them up before they move.', 'Twelve colonels are moved to remote posts. Some go quietly. Some do not.', { stats: { military: -4 }, flags: { coup_purged: true }, ...then('tw_coup_night', 4) }],
    ['Raise soldiers’ pay and visit the camps: ₱8B', 'Win the barracks back.', 'You eat rice and adobo with privates in three camps. The applause sounds real.', { spend: 8, spendLabel: 'Military pay increase', stats: { military: 10, approval: 1 } }],
    ['Dismiss it as barracks gossip', 'Every President hears this.', 'The folder goes into a drawer.', { flags: { coup_ignored: true }, ...then('tw_coup_night', 3) }],
  ], { when: [{ stat: 'military', lte: 40 }], priority: 8 }),

  quick('tw_coup_night', null, 'crisis', 'Alas-Tres ng Madaling-Araw', 'Palasyo ng Malaya, 3:00 a.m.', [
    'Your phone rings at 3 a.m. Rebel troops have seized two television stations and are moving armored vehicles toward the Palasyo. A masked colonel is reading a statement on air: the government has “lost its mandate.”',
    'The Presidential Security Group is loyal. For now.',
  ], [
    ['Go on live television from the Palasyo', 'Face them. Call the people.', 'You appear on the one channel still broadcasting. Your voice does not shake.', { stats: { approval: 3 }, ...then('tw_coup_dawn', 0) }],
    ['Order loyal units to crush the rebellion', 'Force meets force.', 'Loyal marines move. Gunfire is heard near the bridges.', { stats: { military: 3, protest: 5 }, flags: { crackdown: true }, ...then('tw_coup_dawn', 0) }],
    ['Open talks with the rebel colonels', 'Buy time. Avoid bloodshed.', 'A back channel opens. The colonels have demands.', { stats: { capital: -8 }, flags: { coup_talks: true }, ...then('tw_coup_dawn', 0) }],
  ], { priority: 10 }),

  quick('tw_coup_dawn', null, 'crisis', 'Pagsikat ng Araw', 'Maynilad', 'Dawn breaks over a capital that did not sleep.', [['Look outside', '', 'You look.', {}]], {
    priority: 10,
    variants: [
      { when: [COUP_FAILS], text: 'The coup is collapsing. Crowds have formed a human wall around the Palasyo; units that joined the rebels at midnight are returning to barracks. The masked colonel has fled.' },
      { when: [COUP_WINS], text: 'The generals have gone silent. Rebel armor surrounds the Palasyo. The crowds that once saved presidents did not come out for you.' },
    ],
    choices: [
      { id: 'tw_cd_arrest', label: 'Arrest the plotters and try them', description: 'The law, fully applied.', when: [COUP_FAILS], outcome: 'Forty-two officers are charged with rebellion. The nation rallies around you — for now.', effects: { stats: { approval: 6, military: 4, capital: 6 }, flags: { coup_foiled: true } }, headline: 'COUP FAILS; PRESIDENT HOLDS' },
      { id: 'tw_cd_pardon', label: 'Pardon the young officers, punish the leaders', description: 'Heal the armed forces.', when: [COUP_FAILS], outcome: 'The pardons win you the barracks. Critics say you have taught soldiers that coups are cheap.', effects: { stats: { military: 10, approval: 2, courtTension: 3 }, flags: { coup_foiled: true } }, headline: 'COUP FAILS; PRESIDENT PARDONS JUNIOR OFFICERS' },
      { id: 'tw_cd_deal', label: 'Accept their terms: a “reform council” and new generals', description: 'Stay President — in name.', when: [COUP_WINS, { flag: 'coup_talks' }], outcome: 'You remain in the Palasyo. The generals now sit in every Cabinet meeting.', effects: { stats: { military: 15, approval: -10, courtTension: 10, capital: -15 }, flags: { military_council: true } }, headline: 'PRESIDENT BOWS TO REBEL COLONELS' },
      { id: 'tw_cd_leave', label: 'Leave the Palasyo to spare bloodshed', description: 'The end.', when: [COUP_WINS], outcome: 'A helicopter lifts off from the Palasyo lawn at 7:12 a.m.', effects: { gameOver: 'coup' }, headline: 'PRESIDENT OUSTED IN MILITARY COUP' },
    ],
  }),
];

// ═════════════ THE TAPE ═════════════
const TAPE: StoryEvent[] = [
  quick('tw_tape_found', [20, 52], 'scandal', 'Ang Nakatagong Kamera', 'Cabinet Room, Palasyo', [
    'During a routine sweep, the Presidential Security Group finds a tiny recording device inside the chandelier of the Cabinet Room. Its battery has been replaced at least twice. It has heard everything.',
  ], [
    ['Investigate quietly', 'Find out who before anyone knows.', 'A small team starts pulling visitor logs and CCTV footage.', { flags: { tape_known: true }, ...then('tw_tape_demand', 3) }],
    ['Announce the discovery publicly', 'Get ahead of whatever is on it.', 'The country is shocked. Everyone wonders what is on the recordings.', { stats: { media: 3, approval: 1 }, flags: { tape_public: true }, ...then('tw_tape_demand', 3) }],
    ['Remove it and say nothing', 'Maybe it never worked.', 'The device goes into an evidence bag. You try not to think about it.', { ...then('tw_tape_demand', 4) }],
  ], { priority: 7 }),

  quick('tw_tape_demand', null, 'scandal', 'Ang Sobre', 'Private residence, Palasyo', [
    'An envelope arrives with no return address. Inside is a transcript from the Cabinet Room — your own voice, on “{tapeTopic}”: “{tapeLine}.”',
    'The note says: ₱500 million, and a friend of theirs appointed to the Bureau of Customs. Otherwise, the full recording goes to every newsroom in Maynilad.',
  ], [
    ['Pay and appoint their friend', 'Make it go away.', 'The money moves through three banks. Their friend takes the Customs post.', { spend: 0.5, spendLabel: 'Undisclosed settlement', stats: { corruption: 6 }, flags: { blackmail_paid: true, obstruction: true }, ...then('tw_tape_again', 6) }],
    ['Refuse — and release the tape yourself', 'Take the hit on your own terms.', 'You hold a press conference and play the recording. It hurts. But no one owns you.', { stats: { approval: -4, media: -4, corruption: -2 }, flags: { tape_self_released: true } }, 'PRESIDENT RELEASES OWN SECRET TAPE'],
    ['Have the NBI trace the envelope', 'Find them first.', 'Agents begin tracing fingerprints, bank accounts, and the courier.', { stats: { capital: -2 }, ...then('tw_tape_source', 2) }],
  ], { priority: 8 }),

  quick('tw_tape_again', null, 'scandal', 'Muling Humingi', 'Private residence, Palasyo', 'A second envelope. They want ₱1 billion this time — and the recording is released anyway, a week later, “as insurance.” The payment is now part of the story.', [
    ['Admit everything', 'Stop the bleeding.', 'The admission is devastating, but it is over.', { stats: { approval: -8, ombudsman: 8 }, flags: { impeachable_offense: true } }, 'PRESIDENT ADMITS PAYING BLACKMAILERS'],
    ['Deny paying anything', 'They cannot prove it.', 'The bank records surface within a month.', { stats: { approval: -10, media: 10, ombudsman: 12 }, flags: { impeachable_offense: true } }],
  ], { priority: 8 }),

  quick('tw_tape_source', null, 'scandal', 'Ang Pinagmulan', 'National Bureau of Investigation', 'The NBI traces the courier to a security contractor — and the contractor to a senior figure in the opposition who installed the device during the Dela Paz years.', [
    ['File charges for wiretapping and extortion', 'Let the courts handle it.', 'The arrest dominates the news. The recording loses its power once people know who planted it.', { stats: { approval: 4, media: -3 }, flags: { tape_source_charged: true } }, 'BLACKMAIL PLOT TRACED TO OPPOSITION'],
    ['Trade silence for silence', 'Mutual destruction, avoided.', 'The recording never surfaces. Neither do the charges.', { stats: { corruption: 3 }, flags: { tape_truce: true } }],
  ], { priority: 8 }),
];

// ═════════════ THE ILLNESS ═════════════
const HEALTH: StoryEvent[] = [
  quick('tw_health_symptoms', [24, 50], 'family', 'Ang Resulta ng Pagsusuri', 'Presidential physician’s office', [
    'Your physician closes the door before speaking. The chest pains were not stress. You need heart surgery within three months — and at least three weeks of recovery.',
    'Your spokesperson asks what to tell the press. Your political adviser asks whether the Vice President needs to know.',
  ], [
    ['Tell the country the truth', 'The people deserve to know.', 'You announce it yourself. Get-well cards arrive by the sackful.', { stats: { approval: 3, capital: -3 }, flags: { illness_disclosed: true }, ...then('tw_health_surgery', 2) }],
    ['Keep it secret', 'Never look weak.', 'The surgery is booked under a false name at a private hospital.', { flags: { hid_illness: true }, ...then('tw_health_collapse', 5) }],
    ['Delay the surgery until the crisis passes', 'The country needs you now.', 'You take the pills and keep working.', { flags: { surgery_delayed: true }, ...then('tw_health_collapse', 7) }],
  ], { priority: 7 }),

  quick('tw_health_surgery', null, 'family', 'Ang Operasyon', 'Heart center, Maynilad', 'The surgery is tomorrow. The Constitution lets you transfer your powers to the Vice President while you are incapacitated.', [
    ['Transfer powers to {vp} in writing', 'Follow the Constitution.', 'For three weeks, {vp} is Acting President — and makes the most of the cameras.', { stats: { capital: -3 }, flags: { vp_acting: true } }],
    ['Keep power and govern from the hospital', 'No one else holds the pen.', 'You sign papers with an IV in your arm. Your family is furious.', { stats: { family: -5, capital: 2 } }],
  ]),

  quick('tw_health_collapse', null, 'crisis', 'Bumagsak sa Entablado', 'Live broadcast, Independence Day rites', [
    'In the middle of a speech on live television, you grip the podium and collapse. Security rushes you offstage. The footage plays on every channel for three days.',
    'The opposition demands your medical records. The Vice President calls to ask “if there is anything I can do.”',
  ], [
    ['Disclose everything now and have the surgery', 'Too late to hide.', 'The disclosure answers the questions — and raises one: what else have you hidden?', { stats: { approval: -4, media: 3 }, flags: { illness_disclosed: true } }],
    ['Call it exhaustion and keep hiding it', 'Hold the line.', 'A nurse leaks your file within a week. The Ombudsman opens a case.', { stats: { approval: -8, media: 8, ombudsman: 6 }, flags: { hid_illness: true } }, 'PALASYO HID PRESIDENT’S HEART CONDITION'],
    ['Resign for your health', 'Your life matters more than the office.', 'You announce your resignation from a hospital bed.', { gameOver: 'resigned' }, 'PRESIDENT RESIGNS FOR HEALTH REASONS'],
  ], { priority: 9 }),
];

// ═════════════ THE SPY ═════════════
const SPY: StoryEvent[] = [
  quick('tw_spy_warning', [8, 20], 'diplomacy', 'May Espiya sa Gabinete', 'National Intelligence Coordinating Agency', [
    'A Columbian intelligence officer meets you alone. Haizhou knew your Navy’s patrol schedule three days before your Cabinet approved it. Someone in the room is passing documents to Haizhou.',
  ], [
    ['Order a quiet mole hunt', 'Find them without spooking them.', 'A small counter-intelligence team begins watching your own Cabinet.', { spy: 'plant', ...then('tw_spy_clues', 3) }],
    ['Share nothing sensitive in Cabinet anymore', 'Starve the spy.', 'Your Cabinet meetings become strangely empty of substance. The secretaries notice.', { spy: 'plant', stats: { cabinetCohesion: -5 }, flags: { spy_starved: true }, ...then('tw_spy_clues', 6) }],
    ['Dismiss it as Columbian meddling', 'They want us afraid of Haizhou.', 'The Columbian officer leaves unhappy.', { spy: 'plant', flags: { spy_ignored: true }, ...then('tw_spy_damage', 6) }],
  ], { priority: 7 }),

  quick('tw_spy_clues', null, 'diplomacy', 'Tatlong Suspek', 'Situation Room, Palasyo', [
    'The mole hunt narrows it to three people who saw every leaked document: {suspect1} ({suspect1Role}), {suspect2} ({suspect2Role}), and {suspect3} ({suspect3Role}).',
    'Counter-intelligence adds one more detail: the documents were photographed with a phone that was switched off every Sunday — the day the spy met their handler.',
  ], [
    ['Accuse {suspect1}', 'Your instinct says it is them.', 'Agents move in.', { spy: 1, ...then('tw_spy_damage', 5) }],
    ['Accuse {suspect2}', 'The evidence points there.', 'Agents move in.', { spy: 2, ...then('tw_spy_damage', 5) }],
    ['Accuse {suspect3}', 'Trust no one.', 'Agents move in.', { spy: 3, ...then('tw_spy_damage', 5) }],
    ['Wait for one more leak', 'Be certain.', 'The watchers keep watching.', { ...then('tw_spy_second', 3) }],
  ], { priority: 8, when: [{ flag: 'spy_s1' }] }),

  quick('tw_spy_second', null, 'diplomacy', 'Isa Pang Tagas', 'Situation Room, Palasyo', [
    'Another document reaches Haizhou — this time, one that only the office of the {spyRole} had received in advance. The suspects are still {suspect1}, {suspect2}, and {suspect3}.',
  ], [
    ['Accuse {suspect1}', '', 'Agents move in.', { spy: 1, ...then('tw_spy_damage', 5) }],
    ['Accuse {suspect2}', '', 'Agents move in.', { spy: 2, ...then('tw_spy_damage', 5) }],
    ['Accuse {suspect3}', '', 'Agents move in.', { spy: 3, ...then('tw_spy_damage', 5) }],
  ], { priority: 8, when: [{ flag: 'spy_s1' }] }),

  quick('tw_spy_damage', null, 'diplomacy', 'Ang Pinsala', 'West Sea', 'Haizhou vessels appear exactly where your Navy planned a patrol — again. The spy is still inside.', [
    ['Admit to the public that there is a spy', 'Shake the tree.', 'The admission is humiliating, and every official is now a suspect.', { stats: { sovereignty: 6, approval: -3, cabinetCohesion: -6 } }],
    ['Reshuffle the entire national-security team', 'Clean house.', 'The reshuffle stops the leaks — and costs you months.', { stats: { sovereignty: 3, cabinetCohesion: -4, capital: -4 } }],
  ], { priority: 8, when: [{ any: [{ flag: 'spy_free' }, { flag: 'spy_ignored' }] }] }),
];

// ═════════════ THE PARTY SPLITS ═════════════
const SPLIT: StoryEvent[] = [
  quick('tw_party_split', [18, 62], 'congress', 'Hati ang Partido', 'Batasan', [
    'Forty representatives and three senators from your own coalition sign a manifesto: the administration has “abandoned its principles.” They plan to leave and form a new party, Bagong Bayan — with an eye on the next election.',
  ], [
    ['Offer their leaders Cabinet and committee posts', 'Keep the family together.', 'The rebels take the posts and stay — for now. Your loyalists feel cheated.', { stats: { cohesion: 10, cabinetCohesion: -4, capital: -5 }, flags: { split_bought: true } }],
    ['Let them go — and purge the rest', 'Better smaller and loyal.', 'Bagong Bayan is born. Your coalition is smaller and angrier.', { houseShift: -40, senateShift: { from: 'ally', to: 'opposition', count: 3 }, stats: { cohesion: 6, capital: -4 }, flags: { party_split: true } }, 'RULING COALITION SPLITS'],
    ['Call a party convention and fight for the leadership', 'Let the party decide.', 'Delegates gather. Both sides count votes.', { ...then('tw_party_convention', 2) }],
  ], { when: [{ stat: 'cohesion', lte: 38 }], priority: 7 }),

  quick('tw_party_convention', null, 'congress', 'Ang Kombensiyon', 'Party convention, Maynilad', 'Three thousand delegates, two factions, one vote.', [['Wait for the count', '', 'The count comes in.', {}]], {
    variants: [
      { when: [{ stat: 'capital', gte: 45 }], text: 'You win the vote 1,811 to 1,204. The rebel leaders concede on stage — some of them in tears.' },
      { when: [{ stat: 'capital', lte: 44 }], text: 'You lose. The rebels take the party’s name, funds, and machinery. You are now a President without a party.' },
    ],
    choices: [
      { id: 'tw_pc_win', label: 'Welcome the losers back', description: 'Magnanimity.', when: [{ stat: 'capital', gte: 45 }], outcome: 'The party is united, bruised, and yours.', effects: { stats: { cohesion: 12, approval: 2 } }, headline: 'PRESIDENT WINS PARTY SHOWDOWN' },
      { id: 'tw_pc_lose', label: 'Form a new party of your own', description: 'Start over.', when: [{ stat: 'capital', lte: 44 }], outcome: 'You found a new party with your loyalists. Most of your old coalition stays with the rebels.', effects: { houseShift: -60, senateShift: { from: 'ally', to: 'opposition', count: 4 }, stats: { cohesion: -5, capital: -8 }, flags: { party_split: true, party_lost: true } }, headline: 'PRESIDENT LOSES OWN PARTY' },
    ],
  }),
];

export const BIG_TWISTS: StoryEvent[] = [...COUP, ...TAPE, ...HEALTH, ...SPY, ...SPLIT];
