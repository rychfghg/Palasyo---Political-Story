import type { Effects, StoryEvent } from '@/features/narrative/types/event';
import { INHERITED_ARREARS } from '@/data/government/economy';
import { quick } from './chapter1/helpers';

/**
 * Every lever of the state, decided in the story rather than on a dashboard:
 * the inherited bills, the tax bureau, the Treasury, the central bank, and the
 * government corporations.
 */

// ═════════════ THE INHERITED BILLS ═════════════
const ARREARS: StoryEvent[] = [
  quick('d_arrears', -1, 'economy', 'Mga Utang ng Nakaraan', 'Department of Finance, transition office', [
    `The transition team hands you the first bill of your presidency. The Dela Paz administration left ₱${INHERITED_ARREARS.contractors}B unpaid to public-works contractors and ₱${INHERITED_ARREARS.healthInsurer}B to the national health insurer.`,
    'Hospitals are turning away patients. Contractors are calling their congressmen. Some of the projects may not even exist.',
  ], [
    ['Pay everything now', 'Clear the slate. Most of it will be borrowed.', 'The bills are paid. Hospitals and contractors breathe again — on borrowed money.', { spend: INHERITED_ARREARS.contractors + INHERITED_ARREARS.healthInsurer, spendLabel: 'Inherited arrears — paid in full', stats: { approval: 1 }, flags: { arrears_decision: 'pay_all' } }],
    ['Pay the hospitals only', 'Hospitals first. Contractors wait.', 'Hospitals are paid. The contractors’ congressmen are already calling.', { spend: INHERITED_ARREARS.healthInsurer, spendLabel: 'Inherited arrears — health insurer', stats: { approval: 2 }, flags: { arrears_decision: 'pay_health', contractors_unpaid: true } }],
    ['Freeze payments pending an audit', 'Pay nothing until COA verifies every claim.', 'The Commission on Audit starts checking every claim. Hospitals are furious.', { stats: { approval: -1, corruption: -1 }, flags: { arrears_decision: 'audit', contractors_unpaid: true } }],
  ], { priority: 9 }),
];

// ═════════════ THE TAX BUREAU (BIR) ═════════════
function bir(id: string, windows: [number, number][], title: string, body: string, yes: [string, string, string, Effects], no: [string, string, string, Effects], category: StoryEvent['category'] = 'economy'): StoryEvent[] {
  return windows.map((w, i) => quick(`${id}_${i + 1}`, w, category, title, 'Kawanihan ng Rentas Internas', body, [yes, no]));
}

const BIR: StoryEvent[] = [
  ...bir('d_bir_compliance', [[4, 9], [22, 28], [44, 50], [60, 66]], 'Kampanya ng BIR', 'The BIR Commissioner proposes a compliance drive: audit teams, text reminders, and a public list of the top taxpayers. It could raise about ₱45B a year.', ['Approve the drive', 'Costs ₱2B to run.', 'Collections rise. Some businesses grumble about the audits.', { spend: 2, spendLabel: 'Tax compliance drive', taxRate: 0.15, stats: { approval: -1 } }], ['Not now', 'Businesses are nervous enough.', 'The Commissioner files the plan away.', {}]),
  ...bir('d_bir_evaders', [[10, 16], [40, 48]], 'Habulin ang mga Umiiwas', 'The BIR has cases ready against the fifty biggest tax evaders — some of them your donors. Winning them would add about ₱60B a year.', ['File the cases', 'No one is above the tax code.', 'Fifty cases are filed. Your donors stop returning calls.', { taxRate: 0.2, stats: { investor: -2, corruption: -2, approval: 2 } }], ['Settle quietly with a tax amnesty', 'Money now, no fights.', 'A few billion comes in. Critics call it a gift to the rich.', { income: 12, spendLabel: 'Tax amnesty collections', stats: { corruption: 2 } }]),
  ...bir('d_bir_digital', [[6, 12]], 'Digital na BIR', 'The BIR wants to move all tax filing and payment online. It costs ₱5B but would add about ₱30B a year and cut the bribes at district offices.', ['Fund it', 'Modernize.', 'Online filing launches nationwide within a year.', { spend: 5, spendLabel: 'Digital tax filing', taxRate: 0.1, stats: { corruption: -2 } }], ['Not yet', 'Too many other priorities.', 'Filing stays on paper — and in envelopes.', {}]),
  ...bir('d_bir_vat', [[16, 24], [50, 58]], 'Dagdag na VAT?', '{sec:finance} proposes raising the VAT by one point to close the deficit: about ₱100B a year. Congress must approve it — and every family will feel it.', ['Send the VAT bill to Congress', 'Certify it as urgent.', 'The roll is called.', { stats: { capital: -5 }, vote: { bill: 'VAT Increase Act', appeal: -1, onPass: { taxRate: 0.35, stats: { inflation: 0.4, approval: -5 } }, onFail: { stats: { capital: -3 } } } }], ['Reject the idea', 'Not on the backs of the poor.', 'The deficit stays where it is.', { stats: { approval: 1 } }], 'congress'),
  ...bir('d_bir_cut', [[12, 20], [46, 54]], 'Bawas-Buwis sa Maliliit na Kumikita', 'Your allies want to cut income tax for low earners before the elections. It would cost about ₱60B a year. Congress must pass it.', ['Support the tax cut', 'Popular — and expensive.', 'The bill goes to a vote.', { vote: { bill: 'Tax Relief for Low Earners Act', appeal: 2, onPass: { taxRate: -0.2, stats: { approval: 4, poverty: -0.2 } } } }], ['Oppose it', 'We cannot afford it.', 'Your allies are disappointed.', { stats: { cohesion: -3 } }], 'congress'),
];

// ═════════════ THE TREASURY ═════════════
const TREASURY: StoryEvent[] = [18, 42, 62].map((m, i) =>
  quick(`d_prepay_${i + 1}`, [m, m + 5], 'economy', 'Bayaran ang Utang?', 'Bureau of the Treasury', '{sec:finance} reports that the Treasury has some cash to spare. Paying debt early lowers interest costs and pleases the rating agencies — but leaves less for emergencies.', [
    ['Pay ₱100B of debt early', 'Show discipline.', 'Interest costs fall. The rating agencies take note.', { spend: 100, spendLabel: 'Early debt repayment', debt: -100, stats: { investor: 3 } }],
    ['Pay ₱40B', 'A modest signal.', 'A small repayment is made.', { spend: 40, spendLabel: 'Early debt repayment', debt: -40, stats: { investor: 1 } }],
    ['Keep the cash', 'Typhoon season is coming.', 'The Treasury keeps its buffer.', {}],
  ]),
);

// ═════════════ THE CENTRAL BANK ═════════════
const MEETINGS: [number, number][] = [[3, 6], [12, 16], [24, 28], [38, 42], [52, 56], [63, 67]];
const BANK: StoryEvent[] = [
  ...MEETINGS.map((w, i) =>
    quick(`d_bsk_meeting_${i + 1}`, w, 'economy', 'Pulong sa Bangko Sentral', 'Bangko Sentral ng Kapuluan', [
      'Governor {bskGov} comes to the Palasyo for the regular briefing on prices and the peso.',
      '{sec:finance} whispers that a rate cut would help growth before the next election. The governor, as always, guards the bank’s independence.',
    ], [
      ['Ask the governor to cut interest rates', 'Faster growth — if the Monetary Board agrees.', 'You make your case. The governor listens politely.', { bank: 'cut' }],
      ['Ask the bank to defend the peso', 'Spend reserves to strengthen the peso.', 'The governor agrees to act in the markets.', { bank: 'defend' }],
      ['Publicly back the bank’s independence', 'Let the experts decide.', 'Your statement reassures investors.', { bank: 'hold' }],
    ]),
  ),
  quick('d_bsk_new_governor', 47, 'economy', 'Bagong Gobernador ng Bangko Sentral', 'Office of the President', [
    'Governor {bskGov}’s six-year term ends this month. You must appoint the next governor of the Bangko Sentral — the most important economic appointment you will make.',
    'The shortlist: {gov1}, a career central banker; {gov2}, chief economist of the largest bank; and {gov3}, your campaign’s economic adviser.',
  ], [
    ['Appoint {gov1}', 'Independent and respected by markets.', 'Markets welcome the appointment.', { governor: 0 }],
    ['Appoint {gov2}', 'A banker who knows the markets.', 'A safe choice.', { governor: 1 }],
    ['Appoint {gov3}', 'A governor who will listen to you.', 'The peso slips as markets doubt the bank’s independence.', { governor: 2 }],
  ], { priority: 8 }),
];

// ═════════════ GOVERNMENT CORPORATIONS ═════════════
interface Proposal {
  id: string;
  name: string;
  window: [number, number];
  proposer: string;
  pitch: string;
}

const PROPOSALS: Proposal[] = [
  { id: 'nrc', name: 'Kapuluan National Railways Corporation', window: [9, 15], proposer: '{sec:transportation}', pitch: 'a state railway corporation to build and run intercity trains, paid back over decades by fares and station land' },
  { id: 'kfc', name: 'Kapuluan Food Terminal Corporation', window: [5, 11], proposer: '{sec:agriculture}', pitch: 'a food terminal corporation that buys rice and vegetables from farmers at fair prices and sells them in city markets' },
  { id: 'kdi', name: 'Kapuluan Digital Infrastructure Corporation', window: [16, 22], proposer: 'the ICT Secretary', pitch: 'a digital infrastructure corporation that builds cell towers and data centers and rents them to every carrier' },
  { id: 'kwa', name: 'National Water Resources Corporation', window: [20, 28], proposer: '{sec:publicWorks}', pitch: 'a national water corporation that builds dams and treatment plants and sells bulk water to cities' },
  { id: 'kte', name: 'Tourism Infrastructure and Enterprise Zone Authority', window: [30, 36], proposer: 'the Tourism Secretary', pitch: 'a tourism enterprise authority that develops beach and heritage resorts and leases them to operators' },
  { id: 'kmd', name: 'Kapuluan Mining Development Corporation', window: [38, 46], proposer: '{sec:environment}', pitch: 'a mining development corporation that holds the state’s share of mines and sells nickel and copper abroad' },
  { id: 'kad', name: 'Kapuluan Airports Development Corporation', window: [44, 52], proposer: '{sec:transportation}', pitch: 'an airports development corporation to run provincial airports and collect terminal and landing fees' },
];

const CREATE: StoryEvent[] = PROPOSALS.map((p) =>
  quick(`d_gocc_new_${p.id}`, p.window, 'cabinet', 'Panukala: {gocc:' + p.id + '}', 'Cabinet Room, Palasyo', [
    `${p.proposer} proposes ${p.pitch}: the {gocc:${p.id}}. It needs a charter from Congress and capital from the Treasury.`,
    `The Cabinet is split. {sec:finance} warns about the cost; others say it will earn for a generation. For its chief, your advisers suggest {gc:${p.id}:1}, an industry veteran, or {gc:${p.id}:3}, a loyal ally.`,
  ], [
    [`Ask Congress for a charter, with {gc:${p.id}:1} as chief and a merit board`, 'Professional management. Needs the votes.', 'The charter goes to a vote in both chambers.', { stats: { capital: -3 }, vote: { bill: `Charter of the ${p.name}`, appeal: 2, onPass: { goccCreate: { id: p.id, ceo: 0, board: 'merit' } } } }],
    [`Ask Congress for a charter, with {gc:${p.id}:3} as chief and allies on the board`, 'Loyal management — and seats for your allies.', 'Your allies like the idea of board seats. The charter goes to a vote.', { stats: { capital: -2, corruption: 2 }, vote: { bill: `Charter of the ${p.name}`, appeal: 3, onPass: { goccCreate: { id: p.id, ceo: 2, board: 'allies' } } } }],
    ['Not now', 'The Treasury cannot spare the capital.', 'The proposal is shelved.', {}],
  ]),
);

const INHERITED_IDS = ['npc', 'kpa', 'kagc'] as const;

const GOCC_STATUS: StoryEvent[] = [
  // An early decision about each Dela Paz appointee.
  ...INHERITED_IDS.map((id, i) =>
    quick(`d_gocc_holdover_${id}`, [[2, 6], [5, 10], [3, 8]][i] as [number, number], 'cabinet', 'Tauhan ng Nakaraan: {gocc:' + id + '}', 'Office of the President', [
      'The {gocc:' + id + '} is still run by {ceo:' + id + '}, installed by Dela Paz with a fixed term. Your allies want the post; the law says you need a proven fault to remove a sitting chief.',
    ], [
      ['Order a COA special audit (₱200M)', 'If there is a fault, the auditors will find it.', 'The Commission on Audit opens the books.', { goccAudit: id }],
      ['Leave them alone', 'Respect the fixed term.', 'The chief stays. Your allies grumble.', { stats: { cohesion: -1, corruption: -1 } }],
      ['Pressure them to resign', 'Let it be known they are not welcome.', 'The chief refuses and goes to the press, calling it harassment.', { stats: { media: 4, courtTension: 2 } }],
    ]),
  ),
  // Replacing a chief once a fault is found (by audit or whistleblower). Works for every corporation.
  ...['npc', 'kpa', 'kagc', 'nrc', 'kfc', 'kdi', 'kwa', 'kte', 'kmd', 'kad'].map((id) =>
    quick(`gocc_replace_${id}`, null, 'cabinet', 'Palitan ang Pinuno: {gocc:' + id + '}', 'Office of the President', [
      'The findings against {ceo:' + id + '} are now official. You can remove the chief of the {gocc:' + id + '}.',
      'Your advisers put forward three names: {gc:' + id + ':1}, an industry veteran; {gc:' + id + ':2}, a former executive of a private competitor; and {gc:' + id + ':3}, a loyal campaign ally.',
    ], [
      ['Appoint {gc:' + id + ':1}', 'Experience and a clean record.', 'The new chief starts cleaning house.', { goccReplace: { id, pick: 0 }, stats: { corruption: -1 } }],
      ['Appoint {gc:' + id + ':2}', 'A private-sector manager.', 'The new chief promises profits.', { goccReplace: { id, pick: 1 } }],
      ['Appoint {gc:' + id + ':3}', 'Someone you can trust.', 'Critics call it a reward for loyalty.', { goccReplace: { id, pick: 2 }, stats: { corruption: 1, cohesion: 1 } }],
      ['Keep the chief despite the findings', 'Avoid a fight.', 'The findings go to the Ombudsman anyway.', { stats: { corruption: 3, ombudsman: 4 } }],
    ], { when: [{ flag: `gocc_fault_${id}` }], priority: 7 }),
  ),
  // Corruption and board issues through the term.
  quick('d_gocc_gaming_scandal', [14, 26], 'scandal', 'Iskandalo sa Sugalan', 'Kapuluan Amusement and Gaming Corporation', [
    'Reporters reveal that board members of the {gocc:kagc} paid themselves ₱400 million in bonuses while charity funds went unpaid.',
  ], [
    ['Reconstitute the board with professionals', 'Clean it up.', 'A new board is named.', { goccBoard: { id: 'kagc', style: 'merit' }, stats: { corruption: -3, approval: 2 } }],
    ['Replace the board with your allies', 'Loyal people this time.', 'Your allies take the seats. The media notices.', { goccBoard: { id: 'kagc', style: 'allies' }, stats: { corruption: 2, cohesion: 3 } }],
    ['Order an audit first', 'Get the facts.', 'COA begins an audit.', { goccAudit: 'kagc' }],
  ]),
  quick('d_gocc_power_rates', [20, 32], 'crisis', 'Taas-Singil ng Kuryente', 'Kapuluan National Power Corporation', [
    'The {gocc:npc} wants to raise electricity rates by 8% to cover losses at its old plants. {ceo:npc} says it is that or bankruptcy.',
  ], [
    ['Approve a smaller 4% increase', 'Share the pain.', 'Rates rise a little; the corporation stays afloat.', { stats: { inflation: 0.1, approval: -1 } }],
    ['Refuse and inject ₱10B in capital', 'Protect consumers.', 'Rates stay the same. The Treasury pays.', { spend: 10, spendLabel: 'Power corporation capital', stats: { approval: 1 } }],
    ['Order a COA audit of its losses', 'Where did the money go?', 'Auditors move in.', { goccAudit: 'npc' }],
  ]),
  quick('d_gocc_port_smuggling', [26, 40], 'scandal', 'Smuggling sa Pantalan', 'Kapuluan Ports Authority', [
    'Customs agents catch smuggled goods moving through a terminal run by the {gocc:kpa}. A port official is caught on camera taking cash.',
  ], [
    ['Reconstitute the board with professionals', 'Make an example.', 'A new board takes over.', { goccBoard: { id: 'kpa', style: 'merit' }, stats: { corruption: -2 } }],
    ['Audit the whole authority', 'Follow the money.', 'The auditors open the books.', { goccAudit: 'kpa' }],
    ['Treat it as one bad official', 'Do not overreact.', 'The official is fired. Nothing else changes.', { stats: { corruption: 1 } }],
  ]),
  quick('d_gocc_board_seats', [40, 56], 'congress', 'Mga Upuan sa Board', 'Batasan', [
    'Your coalition partners ask for seats on the boards of the state corporations in exchange for their votes on your remaining bills.',
  ], [
    ['Give them seats on the gaming corporation board', 'Votes for seats.', 'Your partners are pleased.', { goccBoard: { id: 'kagc', style: 'allies' }, stats: { cohesion: 5, corruption: 3 } }],
    ['Refuse', 'Boards are for managers.', 'Your partners sulk.', { stats: { cohesion: -4 } }],
  ]),
  quick('d_gocc_dividend_raid', [48, 62], 'economy', 'Kunin ang Kita?', 'Department of Finance', [
    '{sec:finance} proposes ordering every state corporation to send 75% of its profits to the Treasury this year instead of 50%.',
  ], [
    ['Order the higher dividends', 'The Treasury needs it.', '₱18B comes in. The corporations delay maintenance.', { income: 18, spendLabel: 'Special GOCC dividends', stats: { cabinetCohesion: -2 } }],
    ['Let them reinvest', 'They earn more later.', 'The corporations invest in upgrades.', { stats: { investor: 1 } }],
  ]),
];

export const INSTITUTION_EVENTS: StoryEvent[] = [...ARREARS, ...BIR, ...TREASURY, ...BANK, ...CREATE, ...GOCC_STATUS];
