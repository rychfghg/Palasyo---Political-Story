import type { Effects, StoryEvent } from '@/features/narrative/types/event';
import { quick, later as then } from './helpers';

/**
 * An income-generating investment. Figures are kept realistic: a state asset returns roughly
 * 6–12% of its cost a year, and only after it is built.
 */
export const invest = (id: string, name: string, province: string, kind: string, perYear: number, jobs: number, delay = 0): Effects['asset'] => ({
  id,
  name,
  province,
  kind,
  monthlyIncome: Math.round((perYear / 12) * 100) / 100,
  jobs,
  delay,
});

/**
 * Chapter 1 ventures: Cabinet meetings where the money decisions are made, offers from allied
 * governments, and the issues that come with them.
 */
export const VENTURES_1: StoryEvent[] = [
  // ═════════════ CABINET MEETINGS ═════════════
  quick('v1_cab_revenue_plan', [3, 7], 'cabinet', 'Pulong: Saan Kukunin ang Pera?', 'Cabinet Room, Palasyo', [
    'Your first full economic-cluster meeting. {sec:finance} opens with the numbers: the deficit is too wide, and the promises you made on the campaign trail are not paid for.',
    '“We can tax, we can borrow, or we can make the state’s own assets earn,” the Finance Secretary says. “Government owns idle land, dormant corporations, and airports run at a loss. Put them to work.”',
  ], [
    ['Create an asset-management office for idle state land', 'Lease, do not sell. ₱2B to set up.', 'Surveyors find 14,000 hectares of idle government land. Leases start within a year.', { spend: 2, spendLabel: 'State asset-management office', asset: invest('v1_land_leases', 'Idle state land leased to developers', 'maynilad', 'Land leases', 9, 1_500, 10), stats: { investor: 2 } }],
    ['Order every state corporation to remit 50% of profits', 'The dividend law, enforced.', 'Government corporations grumble, then pay. ₱14B arrives this year.', { income: 14, spendLabel: 'GOCC dividends (50% rule)', taxRate: 0.02, stats: { cabinetCohesion: -2 } }],
    ['Sell idle land outright', 'Cash now.', 'Developers snap up prime lots. ₱35B now, nothing later.', { income: 35, spendLabel: 'Sale of idle state land', stats: { corruption: 3, media: 3 } }],
  ], { priority: 6 }),

  quick('v1_cab_dpwh_ppp', [8, 14], 'cabinet', 'Pulong: Kalsada o Toll?', 'Cabinet Room, Palasyo', [
    '{sec:publicWorks} and {sec:transportation} disagree in front of everyone. The Public Works Secretary wants ₱60B from the budget for a free expressway to the north. The Transportation Secretary wants it built by private partners and tolled.',
    '“A free road is a gift to voters,” one says. “A tolled road is a gift to the Treasury for thirty years,” says the other.',
  ], [
    ['Tolled public-private partnership, with a revenue share', 'The builder pays the state a concession fee.', 'The winning bidder pays ₱12B upfront and 5% of tolls every year.', { income: 12, spendLabel: 'NLEX-2 concession fee', asset: invest('v1_toll_north', 'Northern expressway toll share', 'sanfernando', 'Toll concession', 2.6, 4_000, 18), stats: { growth: 0.1, approval: -1 } }, 'TOLLWAY TO THE NORTH AWARDED'],
    ['State-built, but tolled', '₱60B now; the tolls come back to the Treasury.', 'Construction starts on the budget. In two years, the tolls will pay it back slowly.', { spend: 20, spendLabel: 'Northern expressway (first tranche)', project: { id: 'v1_north_express', name: 'Northern Expressway', region: 'north', cost: 40, months: 20 }, asset: invest('v1_toll_north_state', 'Northern expressway tolls (state-run)', 'sanfernando', 'Toll road', 5.2, 6_000, 24), stats: { unemployment: -0.1 } }],
    ['Free road from the budget', 'Popular, expensive, earns nothing.', 'Voters cheer; the Treasury carries it forever.', { spend: 20, spendLabel: 'Free northern expressway (first tranche)', project: { id: 'v1_north_free', name: 'Free Northern Highway', region: 'north', cost: 40, months: 20 }, stats: { approval: 3, unemployment: -0.1 } }],
  ]),

  quick('v1_cab_energy_meeting', [10, 18], 'cabinet', 'Pulong: Kuryente', 'Cabinet Room, Palasyo', [
    '{sec:energy} brings a map of the grid. Brownouts are coming in the south next summer. Private investors will only build if the state guarantees the price.',
    'The National Power Corporation still owns three old hydro dams. “Rehabilitate them and they earn again,” the Energy Secretary says.',
  ], [
    ['Rehabilitate the state dams: ₱18B', 'Clean power, and the state keeps the profit.', 'The dams reopen at full capacity in eighteen months.', { spend: 18, spendLabel: 'Hydro dam rehabilitation', asset: invest('v1_hydro', 'Rehabilitated state hydro dams', 'cagayan', 'Hydropower', 2.2, 1_200, 18), stats: { inflation: -0.1 } }],
    ['Auction the dams to private operators', 'Upfront cash, plus a yearly fee.', 'A consortium pays ₱25B and a yearly fee. Rates rise slightly.', { income: 25, spendLabel: 'Hydro dam concession', asset: invest('v1_hydro_fee', 'Hydro dam concession fee', 'cagayan', 'Concession fee', 0.8, 800, 6), stats: { inflation: 0.05, investor: 3 } }],
    ['Emergency diesel barges', 'Fast and expensive.', 'The lights stay on; power costs rise.', { spend: 6, spendLabel: 'Diesel power barges', stats: { inflation: 0.2 } }],
  ]),

  quick('v1_cab_agri_meeting', [5, 12], 'cabinet', 'Pulong: Palay at Presyo', 'Cabinet Room, Palasyo', [
    '{sec:agriculture} reports that a third of the rice harvest rots or spoils before reaching the market. There are not enough dryers, warehouses, or cold storage.',
    '“Build the post-harvest system,” the Agriculture Secretary says. “Farmers pay a small fee, prices fall, and the facilities pay for themselves.”',
  ], [
    ['Build 300 state dryers and warehouses: ₱14B', 'Fees repay the cost over time.', 'Spoilage drops by half within two harvests.', { spend: 14, spendLabel: 'Post-harvest facilities', asset: invest('v1_postharvest', 'State rice dryers and warehouses', 'kapatagan', 'Agri facilities', 1.3, 9_000, 10), stats: { inflation: -0.3, poverty: -0.3 } }],
    ['Cold-storage chain with a private partner', 'The state puts in land; the partner builds.', 'A cold chain opens in the Kapatagan. The state earns a small share.', { spend: 3, spendLabel: 'Cold-chain land and permits', asset: invest('v1_coldchain', 'Cold-storage chain (state share)', 'kapatagan', 'Cold storage', 0.7, 3_500, 12), stats: { inflation: -0.15 } }],
    ['Import more rice instead', 'Cheaper this year.', 'Prices fall; farmers protest.', { stats: { inflation: -0.2, approval: -1, protest: 3 } }],
  ]),

  quick('v1_cab_tourism_meeting', [12, 20], 'cabinet', 'Pulong: Turismo', 'Cabinet Room, Palasyo', [
    'The Tourism Secretary pitches a plan for Palawira: a new international airport terminal, and a limit on visitors to protect the reefs.',
    '{sec:environment} warns that without limits, the islands will be ruined in ten years.',
  ], [
    ['Build the terminal and charge an eco-fee', '₱16B, and a ₱500 fee per visitor.', 'Arrivals rise; the fees fund conservation and the Treasury.', { spend: 16, spendLabel: 'Palawira airport terminal', asset: invest('v1_palawira_air', 'Palawira terminal and eco-fees', 'palawira', 'Airport and eco-fees', 2.4, 5_000, 14), stats: { growth: 0.1 } }],
    ['Terminal only, no limits', 'Maximum arrivals.', 'Arrivals soar. So does the trash.', { spend: 16, spendLabel: 'Palawira airport terminal', asset: invest('v1_palawira_air2', 'Palawira terminal fees', 'palawira', 'Airport fees', 1.8, 6_000, 14), stats: { growth: 0.15, tribes: -3 } }],
    ['Not now', 'Other priorities.', 'Tourists go to neighboring countries instead.', {}],
  ]),

  quick('v1_cab_ict_meeting', [14, 24], 'cabinet', 'Pulong: Internet ng Bayan', 'Cabinet Room, Palasyo', [
    'The ICT Secretary presents a national fiber backbone. Two telecom companies control everything and charge the highest rates in the region.',
    '“The state builds the backbone and rents it to everyone,” the ICT Secretary says. “Prices fall, and rent comes in.”',
  ], [
    ['Build the backbone: ₱30B', 'Rent it to all carriers.', 'Carriers sign up within a year. Internet prices fall by a third.', { spend: 30, spendLabel: 'National fiber backbone', asset: invest('v1_fiber', 'National fiber backbone rentals', 'maynilad', 'Telecom infrastructure', 3.1, 3_000, 16), stats: { growth: 0.2, investor: 3 } }, 'STATE FIBER BACKBONE APPROVED'],
    ['Open the market to a third carrier instead', 'Let competition do it.', 'A foreign carrier pays ₱8B for a license.', { income: 8, spendLabel: 'Third telecom license', stats: { investor: 2 } }],
    ['Leave it to the two companies', 'Do not upset the tycoons.', 'The tycoons are pleased. Prices stay high.', { stats: { investor: 1, approval: -1 } }],
  ]),

  quick('v1_cab_budget_squeeze', [16, 22], 'cabinet', 'Pulong: Walang Pera', 'Cabinet Room, Palasyo', [
    '{sec:budget} puts a slide on the screen in red: spending is running ahead of revenue. “We either cut, or we find money that already belongs to the state.”',
    'The Budget Secretary has a list: ₱40B in unused funds sitting in state corporations, and ₱20B in unpaid taxes owed by a few big companies.',
  ], [
    ['Sweep the idle funds back to the Treasury', 'Legal, fast.', '₱40B returns to the Treasury. The corporations complain.', { income: 40, spendLabel: 'Idle GOCC funds returned', stats: { cabinetCohesion: -3 } }],
    ['Collect the big unpaid taxes', 'Take on the tycoons.', 'After a court fight, ₱14B is paid. The tycoons remember.', { income: 14, spendLabel: 'Collected tax arrears', stats: { corruption: -2, investor: -2, approval: 2 } }],
    ['Cut 5% from every department', 'Share the pain.', 'Every Secretary is angry. Services slow down.', { budgetChange: -60, stats: { cabinetCohesion: -6, approval: -2 } }],
  ]),

  quick('v1_cab_mining_meeting', [18, 28], 'cabinet', 'Pulong: Mina', 'Cabinet Room, Palasyo', [
    '{sec:environment} and {sec:finance} clash over mining. The Finance Secretary wants to reopen twelve suspended mines to raise royalties. The Environment Secretary wants stricter rules.',
  ], [
    ['Reopen them with higher royalties and a rehab bond', 'Earn, and make them pay for the damage.', 'Nine mines reopen under strict terms. Royalties flow.', { asset: invest('v1_mine_royalties', 'Mine royalties (reopened mines)', 'marawira', 'Mining royalties', 6, 7_000, 4), stats: { investor: 2, tribes: -2 } }],
    ['Reopen all twelve, normal royalties', 'Maximum output.', 'Output jumps. So do complaints about poisoned rivers.', { asset: invest('v1_mine_royalties2', 'Mine royalties (all mines)', 'marawira', 'Mining royalties', 7.5, 9_000, 3), stats: { tribes: -6, church: -3 } }],
    ['Keep them closed', 'Protect the watersheds.', 'The environment wins; the provinces lose jobs.', { stats: { tribes: 3, unemployment: 0.1 } }],
  ]),

  // ═════════════ OFFERS FROM ALLIES ═════════════
  quick('v1_ally_nippara_rail', [6, 16], 'diplomacy', 'Alok ng Nippara', 'Embassy of Nippara', [
    'The Ambassador of Nippara, your largest aid donor, offers a 40-year loan at 0.1% interest to build a commuter railway from Maynilad to the south. Nippara’s companies would build it.',
    '{sec:foreign} says the terms are the best in the world. {sec:finance} notes that the railway will run at a loss for years before fares cover costs.',
  ], [
    ['Accept the loan', 'Cheap money, a railway, and fares for decades.', 'Construction starts in a year. Fares will come in after it opens.', { debt: 60, project: { id: 'v1_south_rail', name: 'Maynilad–South Commuter Railway', region: 'maynilad', cost: 20, months: 30 }, asset: invest('v1_south_rail_fares', 'South Commuter Rail fares and property', 'maynilad', 'Railway', 3.4, 12_000, 30), stats: { growth: 0.2, unemployment: -0.2, sovereignty: 2 } }, 'NIPPARA FUNDS SOUTH RAILWAY'],
    ['Accept, but insist on local builders', 'More jobs at home, slower work.', 'Nippara agrees after months of talks. Local firms get 40% of the work.', { debt: 60, project: { id: 'v1_south_rail2', name: 'Maynilad–South Commuter Railway', region: 'maynilad', cost: 25, months: 36 }, asset: invest('v1_south_rail_fares2', 'South Commuter Rail fares and property', 'maynilad', 'Railway', 3.4, 16_000, 36), stats: { unemployment: -0.3 } }],
    ['Decline', 'No more debt.', 'Nippara is disappointed. The offer goes to Indara.', { stats: { investor: -2 } }],
  ]),

  quick('v1_ally_haizhou_port', [8, 18], 'diplomacy', 'Alok ng Haizhou', 'Haizhou Embassy', [
    'Haizhou offers to build a deep-sea port in Marawira — fully financed, operated by a Haizhou state company for 50 years, with 8% of the revenue paid to your government.',
    '{sec:defense} is alarmed: the port faces the West Sea. {sec:trade} says it would make Marawira a shipping hub.',
  ], [
    ['Accept the offer', 'Money and a port, at a strategic cost.', 'Construction begins. Columbia’s ambassador asks for an urgent meeting.', { asset: invest('v1_haizhou_port', 'Marawira port revenue share', 'marawira', 'Port concession', 2.5, 8_000, 20), stats: { sovereignty: -8, military: -6, investor: 2 }, flags: { haizhou_port: true } }, 'HAIZHOU TO BUILD MARAWIRA PORT'],
    ['Accept, but with a local partner holding 51%', 'Keep control.', 'After tough talks, Haizhou agrees to a minority stake. The state earns more.', { spend: 12, spendLabel: 'State share of Marawira port', asset: invest('v1_marawira_port', 'Marawira port (state majority)', 'marawira', 'Port', 4.2, 8_000, 24), stats: { sovereignty: -2 } }],
    ['Decline', 'Security first.', 'Haizhou calls the refusal “unfriendly”.', { stats: { sovereignty: 4, military: 3, investor: -1 } }],
  ]),

  quick('v1_ally_columbia_lng', [12, 22], 'diplomacy', 'Alok ng Columbia', 'Columbian Embassy', [
    'Columbia offers to finance an LNG import terminal in the Kapatagan, with the state owning 30%. It would replace dying gas fields and cut power prices.',
  ], [
    ['Take a 30% state stake: ₱22B', 'Own part of the country’s new energy source.', 'The terminal opens in two years. Dividends follow.', { spend: 22, spendLabel: 'State stake in LNG terminal', asset: invest('v1_lng', 'LNG terminal (30% state stake)', 'kapatagan', 'Energy', 2.4, 2_500, 22), stats: { inflation: -0.15, sovereignty: 2 } }],
    ['Let private firms own it all', 'No state money.', 'The terminal is built. The state earns only taxes.', { taxRate: 0.01, stats: { inflation: -0.1 } }],
    ['Decline', 'Gas is a fossil fuel.', 'The power shortage looms.', { stats: { inflation: 0.1 } }],
  ]),

  quick('v1_ally_koryeo_shipyard', [16, 28], 'diplomacy', 'Pagawaan ng Barko', 'Subic-style free port, Hilagang Luzara', [
    'A Koryeo shipbuilder wants to reopen an abandoned shipyard in the north. It asks the state for a 25-year lease and a ₱5B dredging job.',
  ], [
    ['Lease it and do the dredging', '₱5B. Lease fees and 20,000 jobs.', 'The shipyard reopens. The lease pays every year.', { spend: 5, spendLabel: 'Shipyard dredging', asset: invest('v1_shipyard', 'Northern shipyard lease', 'sanfernando', 'Shipyard lease', 1.4, 20_000, 10), stats: { unemployment: -0.3, growth: 0.1 } }, '20,000 JOBS AT REOPENED SHIPYARD'],
    ['Make them pay for the dredging too', 'A tougher deal.', 'The shipbuilder agrees, but hires fewer workers.', { asset: invest('v1_shipyard2', 'Northern shipyard lease', 'sanfernando', 'Shipyard lease', 1.1, 12_000, 12), stats: { unemployment: -0.15 } }],
  ]),

  quick('v1_ally_qadir_fund', [20, 32], 'diplomacy', 'Pondo ng Qadir', 'Office of the President', [
    'The sovereign wealth fund of the Emirate of Qadir offers to co-invest ₱100B in Kapuluan infrastructure. The state would put in ₱30B and share the returns.',
    '{sec:finance} likes it. The Senate opposition calls it “selling our roads to sheikhs”.',
  ], [
    ['Co-invest ₱30B', 'Shared returns, shared risk.', 'The joint fund buys stakes in airports and toll roads.', { spend: 30, spendLabel: 'Qadir co-investment fund', asset: invest('v1_qadir', 'Qadir–Kapuluan infrastructure fund (state share)', 'maynilad', 'Infrastructure fund', 2.7, 4_000, 8), stats: { investor: 4 } }],
    ['Let Qadir invest alone', 'No state money at risk.', 'Qadir buys stakes; the state earns only taxes.', { taxRate: 0.01, stats: { investor: 2 } }],
    ['Decline', 'Keep foreign money out of strategic assets.', 'The fund goes to Indara.', { stats: { investor: -2, sovereignty: 2 } }],
  ]),

  quick('v1_ally_europan_wind', [22, 34], 'diplomacy', 'Hangin mula Europa', 'Department of Energy', [
    'A Europan Union development bank offers cheap green financing for offshore wind farms off Iloilanan, with the state holding 20%.',
  ], [
    ['Take a 20% stake: ₱15B', 'Green power, and dividends.', 'The first turbines will turn in two years.', { spend: 15, spendLabel: 'Offshore wind stake', asset: invest('v1_wind', 'Iloilanan offshore wind (20% state)', 'iloilanan', 'Renewable energy', 1.5, 3_000, 24), stats: { inflation: -0.1, church: 1 } }],
    ['Private developers only', 'No state money.', 'The project goes ahead slowly.', {}],
  ]),

  // ═════════════ ISSUES ═════════════
  quick('v1_issue_pier_scam', null, 'scandal', 'Ang Kontrata sa Pantalan', 'Senate Blue Ribbon', [
    'A senator claims the Marawira port deal was steered to a company tied to your campaign donors.',
  ], [
    ['Order an independent audit', 'Nothing to hide.', 'The audit finds sloppy paperwork but no crime.', { stats: { corruption: -1, media: -2 } }],
    ['Dismiss it as politics', 'Move on.', 'The story runs for weeks.', { stats: { media: 5, corruption: 2 } }],
  ]),
  quick('v1_issue_toll_hike', [24, 34], 'society', 'Taas-Singil sa Toll', 'Expressways', [
    'Toll operators ask to raise rates by 12%. Commuters are furious. The Treasury’s toll share rises if you approve.',
  ], [
    ['Approve a smaller 5% increase', 'Compromise.', 'Operators accept; commuters grumble.', { income: 2, spendLabel: 'Toll share increase', stats: { approval: -1 } }],
    ['Approve the full 12%', 'The contracts allow it.', 'The Treasury earns more; drivers are angry.', { income: 5, spendLabel: 'Toll share increase', stats: { approval: -3, inflation: 0.05 } }],
    ['Freeze tolls for a year', 'Commuters first.', 'Operators threaten to sue.', { stats: { approval: 2, investor: -3 } }],
  ]),
  quick('v1_issue_jeepney', [4, 14], 'society', 'Welga ng Jeepney', 'Maynilad streets', [
    'Jeepney drivers strike against the forced replacement of old jeepneys with ₱2.5M minibuses they cannot afford.',
  ], [
    ['Subsidize the new vehicles: ₱9B', 'Help the drivers modernize.', 'Cooperatives form; the strike ends.', { spend: 9, spendLabel: 'Jeepney modernization subsidy', stats: { approval: 3, protest: -4 } }],
    ['Delay the phase-out two years', 'Buy time.', 'The strike ends. The air stays dirty.', { stats: { protest: -3 } }],
    ['Hold firm', 'Modernization cannot wait.', 'Commuters are stranded for a week.', { stats: { approval: -4, protest: 6 } }],
  ]),
  quick('v1_issue_teachers', [9, 20], 'society', 'Guro sa Lansangan', 'Mendiola', [
    'Public-school teachers march for a raise. They have not had one in six years.',
  ], [
    ['A phased raise: ₱25B a year', 'Teachers deserve it.', 'Teachers go home happy. The budget strains.', { program: { id: 'v1_teacher_raise', label: 'Teacher salary increase', monthly: 2, months: 60 }, stats: { approval: 3 } }],
    ['A one-time bonus: ₱6B', 'Something now.', 'The march ends, but the demand remains.', { spend: 6, spendLabel: 'Teacher bonus', stats: { approval: 1 } }],
    ['No money this year', 'The budget is set.', 'Teachers vow to campaign against your allies.', { stats: { approval: -3, protest: 4 } }],
  ]),
  quick('v1_issue_smuggling', [11, 26], 'crisis', 'Puslit na Asukal', 'Bureau of Customs', [
    'Smuggled sugar and onions flood the markets. The Bureau of Customs loses ₱30B a year in duties. The smugglers have friends in Congress.',
  ], [
    ['Install scanners and digitize customs: ₱6B', 'Plug the leak.', 'Collections rise by a fifth within a year.', { spend: 6, spendLabel: 'Customs modernization', taxRate: 0.08, stats: { corruption: -3 } }, 'CUSTOMS COLLECTIONS SURGE'],
    ['Raid the warehouses', 'A show of force.', 'Headlines, arrests — and the smuggling resumes elsewhere.', { stats: { approval: 2, corruption: -1 } }],
    ['Leave customs alone', 'Do not fight Congress.', 'The leak continues.', { stats: { corruption: 2 } }],
  ]),
  quick('v1_issue_pogo', [7, 17], 'crisis', 'Mga Online na Sugalan', 'Maynilad', [
    'Offshore online gambling hubs pay ₱20B a year in fees, but police tie them to kidnappings and scams.',
  ], [
    ['Ban them', 'Crime over cash.', 'Fees vanish; crime drops.', { taxRate: -0.05, stats: { crime: -5, church: 3, sovereignty: 2 } }],
    ['Regulate and tax them harder', 'Keep the money, add rules.', 'Fees rise; so do the scandals.', { taxRate: 0.04, stats: { crime: 3, church: -2 } }],
  ]),
  quick('v1_issue_water', [15, 27], 'crisis', 'Kulang ang Tubig', 'Maynilad', [
    'Dam levels fall. Water is rationed across Maynilad for six hours a day. {sec:publicWorks} says a new dam takes six years.',
  ], [
    ['Build a new state dam with a water fee: ₱28B', 'Solve it for a generation.', 'Construction starts. Water fees will repay it.', { spend: 10, spendLabel: 'New water dam (first tranche)', project: { id: 'v1_dam', name: 'New Maynilad Water Dam', region: 'maynilad', cost: 18, months: 30 }, asset: invest('v1_dam_fees', 'Maynilad water dam fees', 'maynilad', 'Water utility', 2.1, 5_000, 32), stats: { approval: 1 } }],
    ['Desalination plants by a private operator', 'Faster, pricier water.', 'Plants open in a year. Water bills rise.', { stats: { inflation: 0.05, approval: 1 } }],
    ['Rationing and appeals to save water', 'Wait for rain.', 'The rains come late. Tempers flare.', { stats: { approval: -4, protest: 3 } }],
  ]),

  // Follow-up to the Haizhou port
  quick('v1_haizhou_port_follow', [26, 34], 'diplomacy', 'Barkong Pandigma sa Pantalan', 'Marawira port', [
    'A Haizhou navy ship docks at the new Marawira port “for supplies”. Columbia protests.',
  ], [
    ['Order it to leave', 'It is our port.', 'The ship leaves. Haizhou threatens to slow construction.', { stats: { sovereignty: 3, military: 3, investor: -1 } }],
    ['Allow it quietly', 'Keep the peace.', 'The pictures are everywhere.', { stats: { sovereignty: -6, approval: -3, military: -4 }, ...then('v1_issue_pier_scam', 2) }],
  ], { when: [{ flag: 'haizhou_port' }] }),
];
