import type { DraftSpec, StoryEvent } from '@/features/narrative/types/event';
import { quick, later as then } from './chapter1/helpers';

/**
 * Statecraft: bills the President drafts line by line, televised congressional investigations,
 * summits with foreign governments, and the governors who run the provinces.
 */

// ═════════════ BILLS YOU DRAFT ═════════════
function drafted(id: string, window: [number, number], title: string, body: string[], draft: DraftSpec): StoryEvent {
  return {
    id,
    window,
    priority: 5,
    category: 'congress',
    title,
    location: 'Drafting room, Office of the Executive Secretary',
    body,
    draft,
    choices: [
      { id: `${id}_drafted`, label: 'Send the drafted bill to Congress', description: 'Use the drafting table.', outcome: 'The bill is filed in both chambers. The roll is called.', effects: {} },
      { id: `${id}_shelve`, label: 'Shelve the bill for now', description: 'Not this year.', outcome: 'The draft goes back in a drawer.', effects: { stats: { capital: 1 } } },
    ],
  };
}

const BILLS: StoryEvent[] = [
  drafted('dr_tax_reform', [8, 16], 'Ang Reporma sa Buwis', ['{sec:finance} lays out a comprehensive tax reform. Every line is a fight: who pays more, who pays less, and what gets exempted.', 'Use the drafting table to set the details. Your legislative team will tell you how the votes move as you change each one.'], {
    bill: 'Comprehensive Tax Reform Act', lawId: 'dr_tax_reform', summary: 'A rewrite of income, consumption, and corporate taxes.', appeal: 0,
    knobs: [
      { id: 'income', label: 'Personal income tax', options: [
        { label: 'Cut for everyone below ₱800k', note: 'Popular; costs revenue', appeal: 2, effects: { taxRate: -0.15, stats: { approval: 3, poverty: -0.2 } } },
        { label: 'Keep current rates', note: 'No change', appeal: 0, effects: {} },
        { label: 'Raise the top bracket to 40%', note: 'Revenue; the rich object', appeal: -1, senateAppeal: -2, effects: { taxRate: 0.12, stats: { investor: -2, approval: 1 } } },
      ] },
      { id: 'vat', label: 'Value-added tax exemptions', options: [
        { label: 'Remove most exemptions', note: '+₱90B; prices rise', appeal: -2, effects: { taxRate: 0.3, stats: { inflation: 0.3, approval: -3 } } },
        { label: 'Remove exemptions except food and medicine', note: 'Balanced', appeal: 0, effects: { taxRate: 0.15, stats: { inflation: 0.1 } } },
        { label: 'Keep all exemptions', note: 'Easy to pass', appeal: 1, effects: {} },
      ] },
      { id: 'corporate', label: 'Corporate income tax', options: [
        { label: 'Cut from 25% to 20%', note: 'Investors cheer', appeal: 1, effects: { taxRate: -0.1, stats: { investor: 5, growth: 0.2 } } },
        { label: 'Keep at 25%', note: 'No change', appeal: 0, effects: {} },
        { label: 'End tax holidays for big firms', note: '+revenue; lobbyists fight', appeal: -1, senateAppeal: -2, effects: { taxRate: 0.1, stats: { investor: -2, corruption: -1 } } },
      ] },
      { id: 'sin', label: 'Sin taxes (tobacco, alcohol, sugary drinks)', options: [
        { label: 'Raise sharply and fund health', note: '+revenue; doctors approve', appeal: 0, effects: { taxRate: 0.08, stats: { church: 2 } } },
        { label: 'Leave them', note: 'No change', appeal: 1, effects: {} },
      ] },
    ],
  }),
  drafted('dr_wage_bill', [20, 30], 'Dagdag-Sahod', ['Labor unions march for a national minimum wage increase. Employers warn of layoffs. {sec:labor} has a draft — the size of the raise is up to you.'], {
    bill: 'National Minimum Wage Act', lawId: 'dr_wage_bill', summary: 'A national minimum wage increase.', appeal: 0,
    knobs: [
      { id: 'size', label: 'Size of the increase', options: [
        { label: '₱150 a day', note: 'Unions cheer; businesses howl', appeal: -1, effects: { stats: { approval: 5, poverty: -0.5, investor: -4, inflation: 0.3, unemployment: 0.3 } } },
        { label: '₱75 a day', note: 'A middle path', appeal: 1, effects: { stats: { approval: 2, poverty: -0.2, inflation: 0.1 } } },
        { label: '₱35 a day', note: 'Token', appeal: 2, effects: { stats: { approval: -1, protest: 3 } } },
      ] },
      { id: 'small', label: 'Small businesses', options: [
        { label: 'Exempt firms with under 10 workers', note: 'Protects jobs', appeal: 1, effects: { stats: { unemployment: -0.1 } } },
        { label: 'No exemptions', note: 'Fair to all workers', appeal: -1, effects: { stats: { poverty: -0.1, unemployment: 0.1 } } },
      ] },
      { id: 'regional', label: 'Regional wage boards', options: [
        { label: 'Keep regional rates', note: 'Lower wages in the provinces', appeal: 1, effects: {} },
        { label: 'One national rate', note: 'Provinces gain; investors leave them', appeal: -1, effects: { stats: { poverty: -0.2, investor: -1 } } },
      ] },
    ],
  }),
  drafted('dr_anti_dynasty', [40, 52], 'Batas Laban sa Dinastiya', ['The Constitution bans political dynasties “as may be defined by law” — and Congress, full of dynasties, has never defined them. Reformers ask you to draft the law.'], {
    bill: 'Anti-Political Dynasty Act', lawId: 'dr_anti_dynasty', summary: 'Defines and limits political dynasties.', appeal: -2, senateAppeal: -1,
    knobs: [
      { id: 'scope', label: 'Who counts as a dynasty', options: [
        { label: 'Up to second-degree relatives', note: 'Strict; most of Congress is affected', appeal: -2, effects: { stats: { corruption: -6, approval: 4, cohesion: -6 } } },
        { label: 'Spouses and children only', note: 'Moderate', appeal: 0, effects: { stats: { corruption: -3, approval: 2, cohesion: -2 } } },
        { label: 'Only same-position succession', note: 'Weak', appeal: 2, effects: { stats: { corruption: -1 } } },
      ] },
      { id: 'start', label: 'When it takes effect', options: [
        { label: 'The next elections', note: 'Bold', appeal: -1, effects: { stats: { approval: 2 } } },
        { label: 'In 2036', note: 'Gives everyone time', appeal: 1, effects: {} },
      ] },
      { id: 'family', label: 'Your own family', options: [
        { label: 'It applies to your family too', note: 'Credibility', appeal: 1, effects: { stats: { approval: 2, family: -4 } } },
        { label: 'Grandfather current officials', note: 'Protects Tessa', appeal: 0, effects: { stats: { approval: -2, family: 2 } } },
      ] },
    ],
  }),
  drafted('dr_health', [44, 58], 'Kalusugan Para sa Lahat', ['{sec:health} proposes universal health coverage: every citizen covered by the national health insurer. The question is how much it covers, and who pays.'], {
    bill: 'Universal Health Care Act', lawId: 'dr_health', summary: 'Health coverage for every citizen.', appeal: 1,
    knobs: [
      { id: 'cover', label: 'What it covers', options: [
        { label: 'Full: hospital, outpatient, medicines', note: '₱90B a year', appeal: 1, effects: { stats: { approval: 6, poverty: -0.5 }, taxRate: -0.3 } },
        { label: 'Hospital stays only', note: '₱35B a year', appeal: 1, effects: { stats: { approval: 3, poverty: -0.2 }, taxRate: -0.12 } },
      ] },
      { id: 'fund', label: 'How to pay for it', options: [
        { label: 'Higher sin taxes', note: 'Fair, but the tobacco lobby fights', appeal: -1, effects: { taxRate: 0.15 } },
        { label: 'Higher premiums for the employed', note: 'Middle class grumbles', appeal: 0, effects: { taxRate: 0.1, stats: { approval: -1 } } },
        { label: 'Borrow', note: 'Easy now, costly later', appeal: 1, effects: {} },
      ] },
    ],
  }),
];

// ═════════════ CONGRESSIONAL INVESTIGATIONS ═════════════
const HEARINGS: StoryEvent[] = [
  quick('hr_blue_ribbon', [14, 30], 'congress', 'Pagdinig ng Blue Ribbon', 'Senate Blue Ribbon Committee, live on television', [
    'The Senate Blue Ribbon Committee subpoenas {sec:publicWorks} over ₱12B in flood-control contracts. The hearing will be broadcast live. Your legal counsel asks how you want to handle it.',
  ], [
    ['Let the secretary testify fully', 'Nothing to hide.', 'Six hours of testimony. Awkward moments, but no smoking gun.', { stats: { ombudsman: 2, corruption: -2, media: -1 } }],
    ['Invoke executive privilege', 'Keep Cabinet deliberations private.', 'The senators are furious. The Supreme Court may have to decide.', { stats: { media: 5, courtTension: 4, cohesion: -2 }, flags: { exec_privilege: true } }],
    ['Offer up an undersecretary as the scapegoat', 'Someone has to take the fall.', 'The undersecretary resigns in tears. The hearing loses steam — for now.', { stats: { corruption: 2, cabinetCohesion: -4 }, ...then('hr_scapegoat_talks', 5) }],
  ]),
  quick('hr_scapegoat_talks', null, 'scandal', 'Nagsalita ang Biktima', 'Senate', 'The undersecretary you sacrificed returns to the Senate — this time as a witness, with documents.', [
    ['Attack the witness’s credibility', 'Bitter ex-official.', 'The documents speak louder than your attacks.', { stats: { media: 6, approval: -4, ombudsman: 5 } }],
    ['Admit mistakes were made', 'Take the hit.', 'A rare admission. It costs you, but the story ends.', { stats: { approval: -2, corruption: -2 } }],
  ]),
  quick('hr_house_probe', [34, 50], 'congress', 'Imbestigasyon ng Kamara', 'House Committee on Good Government', [
    'With the new House after the midterms, the Committee on Good Government opens an inquiry into the Office of the President’s confidential funds.',
  ], [
    ['Release a full accounting', 'Open the books.', 'Most items check out. A few do not — and become headlines.', { stats: { corruption: -2, media: 2, approval: -1 } }],
    ['Refuse — confidential means confidential', 'National security.', 'The committee cites your budget secretary for contempt.', { stats: { media: 6, cohesion: -3, ombudsman: 4 } }],
    ['Ask your allies to end the inquiry', 'Use the majority.', 'The inquiry is “suspended indefinitely.”', { stats: { corruption: 3, cohesion: -1, capital: -3 } }],
  ]),
  quick('hr_family_probe', [46, 64], 'congress', 'Pagdinig Tungkol sa Pamilya', 'Senate', [
    'The opposition calls your relatives to testify about government contracts won by companies linked to the family.',
  ], [
    ['Let them testify', 'They have done nothing wrong.', 'A grueling day for your family. The hearing finds no crime — but plenty of awkward questions.', { stats: { family: -5, corruption: -1, media: 2 } }],
    ['Have them skip the hearing', 'Protect them.', 'The Senate orders their arrest for contempt. A circus follows.', { stats: { family: 3, media: 8, approval: -4 } }],
  ], { when: [{ any: [{ flag: 'family_dynasty' }, { flag: 'cronyism' }, { flag: 'tessa_governor' }] }] }),
];

// ═════════════ FOREIGN SUMMITS ═════════════
const SUMMITS: StoryEvent[] = [
  quick('sm_bloc_summit', [10, 18], 'diplomacy', 'Summit ng Rehiyon', 'Regional bloc summit, Indara', [
    'Leaders of the regional bloc meet in Indara. The host proposes a joint statement on the West Sea. Haizhou has quietly asked several leaders to water it down.',
  ], [
    ['Push for a strong joint statement', 'Stand together.', 'The statement names Haizhou. Your neighbors stand with you; Haizhou is angry.', { relations: { bloc: 10, haizhou: -12, columbia: 4 }, stats: { sovereignty: 4, approval: 2 } }],
    ['Accept a soft statement and sign a trade deal', 'Business first.', 'A free-trade deal on electronics is signed. The West Sea is barely mentioned.', { relations: { bloc: 5, haizhou: 4 }, stats: { investor: 3, growth: 0.1 } }],
    ['Skip the summit', 'Too much at home.', 'Your Foreign Secretary goes instead. Neighbors notice.', { relations: { bloc: -8 } }],
  ]),
  quick('sm_haizhou_visit', [16, 30], 'diplomacy', 'Pagbisita sa Haizhou', 'Haizhou capital', [
    'Haizhou invites you on a state visit. They promise ₱300B in investment pledges — and want a joint oil exploration deal in waters you claim.',
  ], [
    ['Go, and sign the investment deals only', 'Money without concessions.', 'You return with ₱120B in real deals. Haizhou is cool but polite.', { relations: { haizhou: 6, columbia: -3 }, stats: { investor: 3, growth: 0.1 } }],
    ['Go, and sign the joint exploration too', 'Big money, big risk.', 'The pledges pour in. At home, protesters call it treason.', { relations: { haizhou: 15, columbia: -10, bloc: -5 }, income: 25, spendLabel: 'Haizhou exploration signing bonus', stats: { sovereignty: -8, approval: -4, protest: 6 } }, 'PRESIDENT SIGNS JOINT EXPLORATION WITH HAIZHOU'],
    ['Decline the visit', 'Not on their terms.', 'Haizhou cancels two investment projects.', { relations: { haizhou: -8, columbia: 3 }, stats: { investor: -2, sovereignty: 2 } }],
  ]),
  quick('sm_columbia_visit', [22, 40], 'diplomacy', 'Pagbisita sa Columbia', 'Columbian capital', [
    'Columbia’s President hosts you at the presidential palace. On the table: a new defense pact, more access for Columbian troops, and a trade deal.',
  ], [
    ['Sign the defense pact', 'Security first.', 'Columbian ships will rotate through three bases. Haizhou warns of “consequences.”', { relations: { columbia: 12, haizhou: -10 }, stats: { military: 6, sovereignty: -3 } }],
    ['Sign only the trade deal', 'Prosperity without entanglement.', 'Exports to Columbia jump. The pact waits.', { relations: { columbia: 5 }, stats: { growth: 0.15, investor: 2 } }],
    ['Ask for more aid first', 'Drive a hard bargain.', 'Columbia adds ₱15B in aid. The talks drag on.', { relations: { columbia: -2 }, income: 15, spendLabel: 'Columbian development aid' }],
  ]),
  quick('sm_qadir_workers', [28, 46], 'diplomacy', 'Ang mga Manggagawa sa Qadir', 'Emirate of Qadir', [
    'A million Kapuluan workers live in Qadir. The Emir offers better protections — if you agree to send 50,000 more construction workers on lower wages.',
  ], [
    ['Accept the deal', 'More jobs, more remittances.', 'Remittances rise. Labor groups say you are exporting cheap labor.', { relations: { qadir: 10 }, stats: { unemployment: -0.2, approval: -1 } }],
    ['Demand a minimum wage for our workers', 'Dignity first.', 'The Emir agrees to a wage floor — for fewer workers.', { relations: { qadir: 2 }, stats: { approval: 3 } }],
    ['Suspend deployment until abuses stop', 'Make a stand.', 'Qadir is offended. Workers already there worry for their jobs.', { relations: { qadir: -15 }, stats: { approval: 2, unemployment: 0.1 } }],
  ]),
  quick('sm_nippara_summit', [50, 64], 'diplomacy', 'Pulong sa Nippara', 'Nippara', [
    'Nippara’s Prime Minister offers a ₱200B package for railways and disaster resilience — the largest in its history — in exchange for a strategic partnership.',
  ], [
    ['Sign the strategic partnership', 'A trusted friend.', 'The package is signed. Railways and sea walls will rise for a decade.', { relations: { nippara: 12, haizhou: -4 }, debt: 60, stats: { growth: 0.2, approval: 2 } }],
    ['Take the disaster money only', 'No new alliances.', 'A smaller package, no strings.', { relations: { nippara: 4 }, income: 20, spendLabel: 'Nippara disaster-resilience grant' }],
  ]),
  quick('sm_relations_crisis', [30, 66], 'diplomacy', 'Krisis sa Diplomasya', 'Department of Foreign Affairs', [
    'Haizhou detains a Kapuluan fishing boat and its crew of twelve near the reef. Columbia offers to escort your coast guard; the regional bloc offers to mediate.',
  ], [
    ['Accept Columbian escorts', 'Show of force.', 'The crew is released in a week — and the West Sea is more tense than ever.', { relations: { columbia: 5, haizhou: -10 }, stats: { sovereignty: 6, approval: 3 } }],
    ['Ask the regional bloc to mediate', 'Talk it out.', 'The crew comes home in three weeks. Everyone saves face.', { relations: { bloc: 6, haizhou: 2 }, stats: { approval: 1 } }],
    ['Negotiate directly and quietly', 'No cameras.', 'The crew is released after a month. Haizhou asks for a favor in return.', { relations: { haizhou: 6 }, stats: { sovereignty: -2 } }],
  ]),
];

// ═════════════ GOVERNORS ═════════════
const GOVERNORS: StoryEvent[] = [
  quick('gv_league', [6, 14], 'congress', 'Liga ng mga Gobernador', 'League of Provinces assembly', [
    'The League of Provinces meets. Opposition governors threaten to block national projects in their provinces unless they get a bigger share of national taxes.',
  ], [
    ['Raise the provinces’ tax share', 'Buy peace with the governors.', 'Every governor leaves happy. The national budget is tighter.', { taxRate: -0.08, provGovernor: { province: 'all', to: 'ally' }, stats: { cohesion: 3 } }],
    ['Bypass them: fund mayors directly', 'Go around the governors.', 'Mayors love it. Governors are furious.', { stats: { cohesion: -2, approval: 1 } }],
    ['Refuse', 'The budget is set.', 'Several projects stall in opposition provinces.', { stats: { cohesion: -3 } }],
  ]),
  quick('gv_sugbu_defiance', [18, 32], 'congress', 'Lumaban ang Sugbu', 'Sugbu Provincial Capitol', [
    'The Governor of Sugbu refuses to implement your national ID program in the province, calling it “Maynilad overreach.”',
  ], [
    ['Negotiate — give Sugbu its own rollout', 'Respect local autonomy.', 'The governor agrees. Sugbu becomes friendlier.', { provGovernor: { province: 'sugbu', to: 'ally' }, stats: { capital: -2 } }],
    ['Cut national funds to the province', 'Make an example.', 'The governor becomes your fiercest enemy.', { provGovernor: { province: 'sugbu', to: 'opposition' }, stats: { cohesion: -2, approval: -1 } }],
  ]),
  quick('gv_mindara_autonomy', [36, 56], 'congress', 'Awtonomiya ng Mindara', 'Marawira', [
    'Governors in Mindara ask for a referendum on wider regional autonomy — their own police, their own share of mining royalties.',
  ], [
    ['Support the referendum', 'Peace through autonomy.', 'The referendum passes. Mindara’s leaders become your allies.', { provGovernor: { province: 'marawira', to: 'ally' }, taxRate: -0.03, stats: { tribes: 6, military: -3 } }],
    ['Offer more funds, no autonomy', 'Money, not power.', 'A grudging truce.', { spend: 8, spendLabel: 'Mindara development fund', stats: { tribes: 2 } }],
    ['Refuse — one Republic', 'National unity.', 'The governors walk out. Insurgents cheer.', { provGovernor: { province: 'marawira', to: 'opposition' }, stats: { tribes: -6, military: 2 } }],
  ]),
];

export const STATECRAFT_EVENTS: StoryEvent[] = [...BILLS, ...HEARINGS, ...SUMMITS, ...GOVERNORS];
