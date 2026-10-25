import type { StoryEvent } from '@/features/narrative/types/event';
import { quick, then } from '../chapter1/helpers';
import { invest } from '../chapter1/ventures';

/**
 * Chapter 2 ventures: the second-term Cabinet fights over legacy money, allied governments
 * bring bigger offers, and the bills for earlier choices come due.
 */
export const VENTURES_2: StoryEvent[] = [
  // ═════════════ CABINET MEETINGS ═════════════
  quick('v2_cab_midterm_money', [37, 41], 'cabinet', 'Pulong: Ang Ikalawang Kalahati', 'Cabinet Room, Palasyo', [
    'The first Cabinet meeting of your second half. {sec:finance} is blunt: “Three years left. Whatever we build now either pays for itself by 2033, or your successor inherits the bill.”',
    '{sec:budget} lists the options: a sovereign wealth fund, selling minority stakes in state firms, or a new round of infrastructure.',
  ], [
    ['Create a sovereign wealth fund with ₱50B', 'Invest state cash for steady returns.', 'The fund buys stakes in ports, power, and bonds. Returns are modest but steady.', { spend: 50, spendLabel: 'Kapuluan Sovereign Fund seed capital', asset: invest('v2_swf', 'Kapuluan Sovereign Fund returns', 'maynilad', 'Sovereign fund', 3.5, 300, 6), stats: { investor: 4 } }, 'SOVEREIGN FUND LAUNCHED'],
    ['Sell 20% of the state power and water firms on the stock exchange', 'Cash now, still in control.', 'The share sale raises ₱70B. Dividends to the state shrink a little.', { income: 70, spendLabel: 'Partial listing of state firms', taxRate: -0.01, stats: { investor: 5, approval: -1 } }],
    ['A final burst of public works', 'Build what voters can see.', 'Cranes everywhere. Nothing earns until after you leave.', { spend: 40, spendLabel: 'Legacy public works', stats: { approval: 3, unemployment: -0.3 } }],
  ], { priority: 6 }),

  quick('v2_cab_airport_meeting', [40, 48], 'cabinet', 'Pulong: Ang Paliparan', 'Cabinet Room, Palasyo', [
    'The main Maynilad airport is ranked among the worst in the world. {sec:transportation} has two bids: a local tycoon offers ₱60B upfront for a 25-year concession, and a foreign operator offers ₱30B upfront plus 25% of revenue every year.',
  ], [
    ['Take the foreign operator’s revenue share', 'Less now, more every year.', 'The terminals are renovated. The Treasury earns every year.', { income: 30, spendLabel: 'Airport concession (upfront)', asset: invest('v2_airport_share', 'Maynilad airport revenue share', 'maynilad', 'Airport concession', 6, 6_000, 6), stats: { growth: 0.1, investor: 3 } }, 'AIRPORT PRIVATIZED'],
    ['Take the tycoon’s ₱60B', 'Cash now.', 'The money arrives at once. The tycoon now controls the gateway to the country.', { income: 60, spendLabel: 'Airport concession (tycoon)', stats: { corruption: 3, investor: 1 } }],
    ['Keep it state-run and renovate: ₱25B', 'Public asset, public profit.', 'Renovations drag on, but fees stay with the state.', { spend: 25, spendLabel: 'Airport renovation', asset: invest('v2_airport_state', 'Maynilad airport fees (state-run)', 'maynilad', 'Airport', 3.2, 4_000, 18) }],
  ]),

  quick('v2_cab_ecozones', [42, 52], 'cabinet', 'Pulong: Mga Economic Zone', 'Cabinet Room, Palasyo', [
    '{sec:trade} wants three new economic zones in the Visara and Mindara. Factories would get tax breaks; the state would collect lease rents and a 5% gross income tax.',
    '{sec:finance} warns that tax breaks are how the country lost ₱100B a year in the past.',
  ], [
    ['Three zones with strict, time-limited incentives: ₱18B', 'Jobs, rent, and tax after five years.', 'Locators arrive steadily. Rents start in a year.', { spend: 18, spendLabel: 'New economic zones', asset: invest('v2_ecozones', 'Visara and Mindara economic zones', 'sugbu', 'Economic zone rents', 3, 35_000, 12), stats: { unemployment: -0.4, growth: 0.2 } }, '35,000 JOBS IN NEW ECOZONES'],
    ['One zone, generous incentives', 'Attract the big names fast.', 'A famous chipmaker locates. The taxes are small.', { spend: 8, spendLabel: 'Economic zone (Sugbu)', asset: invest('v2_ecozone_one', 'Sugbu economic zone', 'sugbu', 'Economic zone rents', 0.8, 18_000, 10), stats: { unemployment: -0.2, investor: 3 } }],
    ['No new zones', 'Close the loopholes instead.', 'Revenue rises a little. Investors look elsewhere.', { taxRate: 0.03, stats: { investor: -2 } }],
  ]),

  quick('v2_cab_fisheries', [44, 56], 'cabinet', 'Pulong: Pangisdaan', 'Cabinet Room, Palasyo', [
    '{sec:agriculture} reports that foreign fleets take more fish from Kapuluan waters than Kapuluan fishermen do. Fish prices are rising.',
  ], [
    ['Build fishing ports and a patrol fleet: ₱20B', 'Protect the catch; charge landing fees.', 'The catch rises and fish prices ease.', { spend: 20, spendLabel: 'Fishing ports and patrol boats', asset: invest('v2_fishports', 'Fish ports and landing fees', 'tacloban', 'Fisheries', 1.6, 14_000, 12), stats: { inflation: -0.15, sovereignty: 3, poverty: -0.2 } }],
    ['Sell fishing licenses to foreign fleets', 'Make them pay to fish.', '₱9B a year in licenses. Local fishermen are furious.', { asset: invest('v2_fish_licenses', 'Foreign fishing licenses', 'palawira', 'Licenses', 9, 0, 2), stats: { protest: 5, approval: -3 } }],
    ['Do nothing', 'Other priorities.', 'Prices keep rising.', { stats: { inflation: 0.1 } }],
  ]),

  quick('v2_cab_health_meeting', [46, 58], 'cabinet', 'Pulong: Ospital', 'Cabinet Room, Palasyo', [
    '{sec:health} warns that provincial hospitals are collapsing. The national health insurer is sitting on ₱150B in reserves.',
  ], [
    ['Use ₱30B of reserves for 20 regional hospitals', 'Services now.', 'Hospitals rise in 20 provinces. Fees help run them.', { project: { id: 'v2_hospitals', name: '20 Regional Hospitals', region: 'tacloban', cost: 30, months: 24 }, asset: invest('v2_hospital_fees', 'Regional hospital fees', 'tacloban', 'Hospitals', 1.2, 12_000, 24), stats: { approval: 4, poverty: -0.3 } }, '20 NEW HOSPITALS'],
    ['Return the reserves to the Treasury', 'The money is idle.', 'The Treasury gets ₱60B. Doctors and patients protest.', { income: 60, spendLabel: 'Health insurer reserves', stats: { approval: -5, church: -3, protest: 4 } }],
    ['Leave the reserves alone', 'It is insurance money.', 'The hospitals stay as they are.', { stats: { approval: -1 } }],
  ]),

  quick('v2_cab_rail_revenue', [48, 60], 'cabinet', 'Pulong: Tren na Lugi', 'Cabinet Room, Palasyo', [
    'The state-run railways lose ₱6B a year. {sec:transportation} proposes letting a private operator run them and developing the land around the stations.',
  ], [
    ['Private operation plus station malls', 'Earn from the land.', 'The losses stop, and the station land earns rent.', { asset: invest('v2_station_land', 'Rail station property rents', 'maynilad', 'Transit property', 3.5, 9_000, 10), stats: { investor: 3, approval: -1 } }],
    ['Raise fares by 30%', 'Make riders pay.', 'The losses shrink; commuters are angry.', { income: 3, spendLabel: 'Rail fare increase', stats: { approval: -4, protest: 4 } }],
    ['Keep subsidizing', 'Transport is a public service.', 'The losses continue.', { spend: 6, spendLabel: 'Railway subsidy' }],
  ]),

  quick('v2_cab_legacy_fight', [52, 62], 'cabinet', 'Away sa Gabinete', 'Cabinet Room, Palasyo', [
    'The meeting ends in shouting. {sec:publicWorks} accuses {sec:finance} of starving the provinces to protect the credit rating. Both threaten to resign.',
  ], [
    ['Side with Finance', 'Discipline first.', 'The Public Works Secretary resigns in a huff.', { fireCabinet: 'publicWorks', stats: { investor: 3, cabinetCohesion: -4 } }],
    ['Side with Public Works: ₱30B more for roads', 'The provinces need it.', 'The Finance Secretary stays, but warns the markets will notice.', { spend: 30, spendLabel: 'Provincial roads', stats: { investor: -3, approval: 2, unemployment: -0.2 } }],
    ['Make them settle it', 'Grown-ups compromise.', 'A grudging truce.', { stats: { cabinetCohesion: -2 } }],
  ]),

  quick('v2_cab_final_budget', [60, 66], 'cabinet', 'Pulong: Huling Budget', 'Cabinet Room, Palasyo', [
    'Your last budget meeting. {sec:budget} asks the question no one wants to answer: “Do we leave the next President a healthy Treasury, or spend it all on your legacy?”',
  ], [
    ['Leave a surplus', 'Pay debt, earn trust.', 'Markets applaud. Your allies say you gave away the election.', { debt: -40, spend: 40, spendLabel: 'Debt reduction', stats: { investor: 5, approval: -2 } }],
    ['Spend on a final round of investments', 'Things that earn after you are gone.', 'Solar farms and cold storage across the provinces.', { spend: 35, spendLabel: 'Legacy investments', asset: invest('v2_legacy_assets', 'Legacy solar and cold-storage network', 'kapatagan', 'Energy and agriculture', 3.2, 10_000, 8), stats: { inflation: -0.1 } }],
    ['Cash handouts before the election', 'Help your successor win.', 'Voters are grateful. The Treasury empties.', { spend: 50, spendLabel: 'Pre-election cash aid', stats: { approval: 5, corruption: 3 } }],
  ]),

  // ═════════════ OFFERS FROM ALLIES ═════════════
  quick('v2_ally_nippara_subway', [38, 50], 'diplomacy', 'Ikalawang Alok ng Nippara', 'Embassy of Nippara', [
    'Nippara offers a second soft loan: a subway under Maynilad’s business district, with the state owning the stations and the land above them.',
  ], [
    ['Accept', 'Decades of fares and property income.', 'Tunnel boring begins. The station land will earn when it opens.', { debt: 90, project: { id: 'v2_subway', name: 'Maynilad Subway Line 2', region: 'maynilad', cost: 25, months: 30 }, asset: invest('v2_subway_income', 'Subway fares and station property', 'maynilad', 'Subway', 5, 15_000, 30), stats: { growth: 0.2, unemployment: -0.2 } }, 'SECOND SUBWAY LINE FUNDED'],
    ['Decline', 'The debt is high enough.', 'The traffic remains.', { stats: { approval: -1 } }],
  ]),

  quick('v2_ally_columbia_chips', [42, 54], 'diplomacy', 'Pabrika ng Chip', 'Columbian Embassy', [
    'Columbia wants to move chip-packaging plants out of Haizhou. A Columbian firm will build a ₱120B plant in the Kapatagan — if the state builds the power and water lines.',
  ], [
    ['Build the utilities: ₱15B', 'Win the plant.', 'The plant will employ 22,000 and pay taxes for decades.', { spend: 15, spendLabel: 'Chip plant utilities', asset: invest('v2_chip_plant', 'Columbian chip plant taxes', 'kapatagan', 'Semiconductors', 4.5, 22_000, 14), stats: { sovereignty: 3, investor: 5, unemployment: -0.3 } }, '₱120B CHIP PLANT COMING'],
    ['Make the firm pay for the utilities', 'No state money.', 'The firm builds a smaller plant.', { asset: invest('v2_chip_small', 'Chip plant taxes (smaller plant)', 'kapatagan', 'Semiconductors', 2, 9_000, 16), stats: { investor: 1 } }],
    ['Decline — do not anger Haizhou', 'Stay neutral.', 'Haizhou is pleased. Columbia is not.', { stats: { sovereignty: -2, investor: -3 } }],
  ]),

  quick('v2_ally_haizhou_railway', [44, 58], 'diplomacy', 'Riles ng Haizhou', 'Haizhou Embassy', [
    'Haizhou offers a loan at 3% to build a railway across Mindara. The contract says disputes go to Haizhou courts, and the railway is collateral.',
  ], [
    ['Accept', 'The railway is needed.', 'Construction begins. Critics warn of a debt trap.', { debt: 110, project: { id: 'v2_mindara_rail', name: 'Mindara Railway', region: 'davira', cost: 20, months: 30 }, asset: invest('v2_mindara_rail_fares', 'Mindara Railway freight and fares', 'marawira', 'Railway', 3.6, 18_000, 30), stats: { sovereignty: -6, unemployment: -0.3 } }],
    ['Renegotiate: local courts, no collateral', 'Better terms or nothing.', 'Haizhou walks away.', { stats: { sovereignty: 3 } }],
  ]),

  quick('v2_ally_asean_grid', [50, 64], 'diplomacy', 'Grid ng Rehiyon', 'Regional Summit', [
    'The regional bloc proposes an undersea power cable linking the Kapuluan to its neighbors. The state could sell surplus solar power abroad.',
  ], [
    ['Join, with a ₱20B state stake', 'Earn from exports of power.', 'The cable will carry power both ways by 2033.', { spend: 20, spendLabel: 'Regional power cable stake', asset: invest('v2_grid', 'Regional power cable (state stake)', 'palawira', 'Power exports', 1.8, 2_000, 20), stats: { investor: 3, inflation: -0.05 } }],
    ['Stay out', 'Keep the grid national.', 'The neighbors go ahead without you.', {}],
  ]),

  quick('v2_ally_qadir_refinery', [54, 66], 'diplomacy', 'Refinerya ng Qadir', 'Office of the President', [
    'Qadir offers to build an oil refinery in the Visara, 40% owned by the state, guaranteeing crude supply during crises.',
  ], [
    ['Take the 40% stake: ₱28B', 'Energy security and dividends.', 'Groundbreaking in the Visara.', { spend: 28, spendLabel: 'State refinery stake', asset: invest('v2_refinery', 'Visara refinery (40% state)', 'iloilanan', 'Refinery', 2.8, 6_000, 18), stats: { inflation: -0.1 } }],
    ['Decline', 'Fossil fuels are the past.', 'Fuel imports continue.', {}],
  ]),

  // ═════════════ DECISIONS AND ISSUES ═════════════
  quick('v2_issue_airport_delay', [52, 64], 'scandal', 'Delay sa Paliparan', 'Maynilad airport', [
    'The airport concessionaire is a year behind schedule and wants to cut the state’s revenue share from 25% to 15%.',
  ], [
    ['Refuse and threaten to cancel', 'A deal is a deal.', 'The operator backs down.', { stats: { investor: -1, approval: 1 } }],
    ['Agree to 20%', 'Keep the project moving.', 'The work speeds up; the state earns less.', { stats: { corruption: 1 } }],
  ], { when: [{ resolved: 'v2_cab_airport_meeting', choice: 'v2_cab_airport_meeting_0' }] }),
  quick('v2_issue_fund_raid', [50, 62], 'scandal', 'Ang Pondo ng Bayan', 'Senate', [
    'Senators want to use the sovereign fund’s money for their districts. The fund’s board resists.',
  ], [
    ['Protect the fund', 'It must earn, not be spent.', 'The fund stays intact. The senators sulk.', { stats: { investor: 3, cohesion: -3 } }],
    ['Release ₱20B for districts', 'Keep the Senate happy.', 'The fund shrinks and earns less.', { spend: 20, spendLabel: 'Districts from the sovereign fund', stats: { cohesion: 4, investor: -4 } }],
  ], { when: [{ resolved: 'v2_cab_midterm_money', choice: 'v2_cab_midterm_money_0' }] }),
  quick('v2_issue_nurses', [38, 50], 'society', 'Umaalis ang mga Nars', 'Department of Health', [
    'Fifteen thousand nurses leave for Columbia and Nippara every year. Public hospitals cannot fill their wards.',
  ], [
    ['Raise nurses’ pay: ₱12B a year', 'Keep them home.', 'Departures slow by half.', { program: { id: 'v2_nurse_pay', label: 'Nurse pay increase', monthly: 1, months: 36 }, stats: { approval: 2 } }],
    ['Negotiate a training deal with Nippara', 'They train more, we keep some.', 'Nippara pays for 5,000 new nursing scholarships a year.', { income: 4, spendLabel: 'Nippara nursing training grant', stats: { approval: 1 } }],
    ['Let them go — remittances help', 'Freedom of movement.', 'Remittances rise; the wards stay empty.', { stats: { growth: 0.05, approval: -2 } }],
  ]),
  quick('v2_issue_rice_cartel', [40, 54], 'crisis', 'Kartel ng Bigas', 'Kapatagan', [
    'Six traders are hoarding rice to drive up prices. Rice is up 20% in two months.',
  ], [
    ['Raid the warehouses and sell the rice cheaply', 'Break the cartel.', 'Prices fall within weeks.', { stats: { inflation: -0.3, approval: 3, crime: -2 } }],
    ['Import 500,000 tons to flood the market', 'Market forces.', 'Prices fall; farmers lose.', { spend: 10, spendLabel: 'Emergency rice imports', stats: { inflation: -0.2, approval: 1 } }],
    ['Price caps', 'Quick relief.', 'Rice disappears from the shelves.', { stats: { inflation: -0.1, approval: -2 } }],
  ]),
  quick('v2_issue_brownout', [56, 66], 'crisis', 'Brownout sa Mindara', 'Mindara grid', [
    'Rotating blackouts of eight hours a day hit Mindara in the dry season. Factories halt.',
  ], [
    ['Emergency modular power plants: ₱14B', 'State-owned, sells power.', 'The lights return in two months; the plants sell power at cost plus a margin.', { spend: 14, spendLabel: 'Modular power plants', asset: invest('v2_modular_power', 'State modular power plants', 'marawira', 'Power', 1.1, 1_500, 2), stats: { approval: 2, inflation: 0.05 } }],
    ['Ration power and wait for the rains', 'No money.', 'Factories lose ₱30B.', { stats: { growth: -0.2, approval: -3 } }],
  ]),
  quick('v2_issue_credit_rating', [58, 70], 'economy', 'Credit Rating', 'Rating agencies', [
    'A rating agency reviews the Kapuluan. {sec:finance} says the verdict depends on whether the state earns more than it borrows.',
  ], [
    ['Present the investment income and debt plan', 'Show the numbers.', 'The agency reads the report.', { ...then('v2_rating_result', 1) }],
  ]),
  quick('v2_rating_result', null, 'economy', 'Ang Hatol', 'Rating agencies', 'The rating agency announces its decision.', [
    ['Read the verdict', '', 'You read it.', {}],
  ], {
    variants: [
      { when: [{ stat: 'investor', gte: 58 }], text: 'An upgrade: the state’s investments and steady revenue impress the agency. Borrowing becomes cheaper.' },
      { when: [{ stat: 'investor', lte: 57 }], text: 'A negative outlook: the agency is not convinced the state can pay its debts.' },
    ],
    choices: [
      { id: 'v2_rating_up', label: 'Celebrate the upgrade', description: 'Cheaper money.', when: [{ stat: 'investor', gte: 58 }], outcome: 'Borrowing costs fall; investors take notice.', effects: { stats: { investor: 5, approval: 2 } }, headline: 'KAPULUAN UPGRADED' },
      { id: 'v2_rating_down', label: 'Promise reforms', description: 'Calm the markets.', when: [{ stat: 'investor', lte: 57 }], outcome: 'The markets wobble.', effects: { stats: { investor: -4 } }, headline: 'RATING OUTLOOK CUT' },
    ],
  }),
  quick('v2_issue_ofw_bond', [44, 60], 'economy', 'Bono para sa OFW', 'Bureau of the Treasury', [
    'Ten million workers abroad send money home. {sec:finance} proposes a small-denomination bond they can buy from their phones.',
  ], [
    ['Issue ₱50B in OFW bonds', 'Borrow from our own people, not foreign banks.', 'The bonds sell out in two days. Borrowing costs fall slightly.', { stats: { investor: 3, approval: 2 } }],
    ['Not now', 'Enough debt.', 'The idea is shelved.', {}],
  ]),
  quick('v2_issue_land_reclaim', [46, 60], 'scandal', 'Tambak sa Look', 'Maynilad Bay', [
    'A developer wants to reclaim 300 hectares of Maynilad Bay and will pay the state ₱40B. Environmentalists warn of floods.',
  ], [
    ['Approve with a flood-protection requirement', 'Money, with safeguards.', 'The state collects ₱40B. The fight moves to the courts.', { income: 40, spendLabel: 'Bay reclamation fees', stats: { tribes: -1, church: -3 } }],
    ['Reject it', 'The bay is not for sale.', 'Environmentalists cheer.', { stats: { church: 2, investor: -2 } }],
  ]),
];
