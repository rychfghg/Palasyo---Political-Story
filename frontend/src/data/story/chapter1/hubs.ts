import type { StoryEvent } from '@/features/narrative/types/event';
import { quick, later as then } from './helpers';
import { invest } from './ventures';

/**
 * Chapter 1 hubs: airports, ports, and new economic hubs. Most take two or more years to build,
 * so they start paying in Chapter 2 — the seeds of a recovery. Twists test whether the
 * government can hold its ground while they are built.
 */
export const HUBS_1: StoryEvent[] = [
  // ═════════════ AIRPORTS ═════════════
  quick('h1_new_maynilad_airport', [4, 10], 'economy', 'Bagong Paliparan ng Maynilad', 'Office of the President', [
    'The main airport is at 140% of capacity. A consortium of the country’s three biggest conglomerates offers to build a new international airport on reclaimed land north of Maynilad — if the state takes a 20% stake and builds the expressway to it.',
    '{sec:transportation} says it would be the biggest project in the country’s history. {sec:finance} asks who pays if it fails.',
  ], [
    ['Take the 20% stake and build the road: ₱45B', 'The gateway of the next thirty years.', 'Reclamation starts. The airport opens in three years.', { spend: 45, spendLabel: 'New Maynilad Airport (state stake and expressway)', asset: invest('h1_new_airport', 'New Maynilad International Airport (20% state)', 'maynilad', 'Airport', 5.2, 30_000, 34), stats: { investor: 4, growth: 0.15 } }, 'NEW MAYNILAD AIRPORT APPROVED'],
    ['Let the consortium build it alone', 'No state money, a smaller share.', 'The consortium agrees to pay the state 3% of revenue.', { asset: invest('h1_new_airport_fee', 'New Maynilad Airport revenue share', 'maynilad', 'Airport concession', 1.6, 25_000, 36), stats: { investor: 2 } }],
    ['Expand the old airport instead: ₱12B', 'Cheaper, sooner, smaller.', 'A new terminal opens in eighteen months.', { spend: 12, spendLabel: 'Old airport expansion', asset: invest('h1_old_airport', 'Expanded main airport terminal', 'maynilad', 'Airport', 1.1, 5_000, 18) }],
  ], { priority: 6 }),

  quick('h1_sugbu_airport', [9, 16], 'economy', 'Paliparan ng Sugbu', 'Sugbu', [
    'Sugbu’s airport is the country’s second gateway, and full. An Indara airport operator offers to build a second terminal and run it for 25 years.',
  ], [
    ['Concession with a 12% revenue share', 'The operator builds; the state earns.', 'The new terminal opens in two years.', { asset: invest('h1_sugbu_air', 'Sugbu airport terminal 2 (12% share)', 'sugbu', 'Airport concession', 1.3, 6_000, 24), stats: { growth: 0.05 } }],
    ['State-built terminal: ₱14B', 'Keep all the fees.', 'Slower, but the fees stay home.', { spend: 14, spendLabel: 'Sugbu airport terminal', asset: invest('h1_sugbu_air_state', 'Sugbu airport terminal 2 (state)', 'sugbu', 'Airport', 1.5, 6_000, 28) }],
  ]),

  quick('h1_mindara_airport', [18, 26], 'economy', 'Paliparan ng Davira', 'Davira City', [
    'Business leaders in the south want Davira’s airport to become an international hub for flights to Indara and the southern islands.',
  ], [
    ['Upgrade it: ₱10B', 'Open the south to the world.', 'International flights will start in two years.', { spend: 10, spendLabel: 'Davira airport upgrade', asset: invest('h1_davira_air', 'Davira international airport fees', 'marawira', 'Airport', 0.95, 4_000, 24), stats: { growth: 0.05, tribes: 1 } }],
    ['Not yet', 'Security in the south first.', 'The business leaders are disappointed.', { stats: { approval: -1 } }],
  ]),

  // ═════════════ PORTS ═════════════
  quick('h1_container_port', [6, 14], 'economy', 'Bagong Container Port', 'Batangira Bay', [
    'Maynilad’s port is so congested that ships wait a week to unload. A global port operator offers to build a container terminal south of the capital.',
  ], [
    ['Joint venture, state holds 30%: ₱18B', 'A share of every container.', 'The terminal will open in 26 months.', { spend: 18, spendLabel: 'Southern container port (state 30%)', asset: invest('h1_container', 'Southern container terminal (30% state)', 'maynilad', 'Port', 2, 9_000, 26), stats: { inflation: -0.1, growth: 0.1 } }],
    ['Concession only', 'No state money.', 'The operator pays a yearly fee.', { asset: invest('h1_container_fee', 'Southern container terminal fee', 'maynilad', 'Port concession', 0.7, 7_000, 28) }],
    ['Decline', 'Too much for now.', 'Ships keep waiting.', { stats: { inflation: 0.05 } }],
  ]),

  quick('h1_transshipment', [14, 22], 'economy', 'Transshipment Hub ng Mindara', 'Marawira Bay', [
    'Marawira sits on the busiest shipping route in the region. {sec:trade} proposes a transshipment hub where big ships transfer cargo — like the great ports of the region.',
  ], [
    ['Build it with a regional port operator: ₱24B', 'A bet on becoming a shipping crossroads.', 'Dredging starts. It will take three years.', { spend: 24, spendLabel: 'Marawira transshipment hub', asset: invest('h1_transship', 'Marawira transshipment hub', 'marawira', 'Port', 2.8, 14_000, 36), stats: { investor: 3 } }, 'MINDARA TRANSSHIPMENT HUB'],
    ['Too ambitious', 'Stay realistic.', 'The shipping lines go elsewhere.', {}],
  ]),

  quick('h1_fishport_network', [20, 30], 'economy', 'Mga Daungan ng Isda', 'Visara coast', [
    'Fish rot on beaches for lack of ports and ice plants. {sec:agriculture} asks for 30 modern fish ports with ice and cold storage.',
  ], [
    ['Build all 30: ₱12B', 'Cheaper fish, landing fees.', 'The ports open over two years.', { spend: 12, spendLabel: 'Fish ports network', asset: invest('h1_fishports', 'Fish ports and ice plants', 'tacloban', 'Fisheries', 1, 16_000, 20), stats: { inflation: -0.1, poverty: -0.2 } }],
    ['Build ten: ₱4B', 'Start small.', 'Ten ports open.', { spend: 4, spendLabel: 'Fish ports (ten)', asset: invest('h1_fishports_10', 'Fish ports (ten)', 'tacloban', 'Fisheries', 0.35, 5_000, 14) }],
  ]),

  // ═════════════ HUBS ═════════════
  quick('h1_it_park', [5, 12], 'economy', 'IT Park ng Sugbu', 'Sugbu', [
    'Call centers and software firms want to hire 60,000 more people in Sugbu but there is no office space left. {sec:trade} proposes a state IT park, leased to companies.',
  ], [
    ['Build it: ₱9B', 'Rent plus jobs.', 'Companies sign leases before it is finished.', { spend: 9, spendLabel: 'Sugbu IT park', asset: invest('h1_itpark', 'Sugbu IT park leases', 'sugbu', 'Office leases', 0.9, 40_000, 16), stats: { unemployment: -0.3 } }, '40,000 IT JOBS FOR SUGBU'],
    ['Give the land to a developer', 'Less money, same jobs.', 'A developer builds it; the state gets ground rent.', { asset: invest('h1_itpark_rent', 'Sugbu IT park ground rent', 'sugbu', 'Land lease', 0.35, 35_000, 18), stats: { unemployment: -0.25 } }],
  ]),

  quick('h1_logistics_hub', [10, 20], 'economy', 'Logistics Hub ng Kapatagan', 'Gitnang Kapatagan', [
    'Online shopping is booming, but parcels take a week. A state logistics hub by the new expressway could cut delivery times and rent space to couriers.',
  ], [
    ['Build it: ₱8B', 'Rent and faster deliveries.', 'Couriers move in within eighteen months.', { spend: 8, spendLabel: 'Kapatagan logistics hub', asset: invest('h1_logistics', 'Kapatagan logistics hub', 'kapatagan', 'Warehousing', 0.8, 9_000, 18), stats: { inflation: -0.05 } }],
    ['Leave it to the couriers', 'They can build their own.', 'Deliveries stay slow.', {}],
  ]),

  quick('h1_agro_hub', [12, 22], 'economy', 'Agro-Industrial Hub', 'Cagayan de Ilog', [
    'Banana, pineapple, and coconut exporters in the north of Mindara want processing plants near the farms so they can export more than raw fruit.',
  ], [
    ['State-built processing zone: ₱11B', 'Rent and exports.', 'Exporters sign up. It opens in two years.', { spend: 11, spendLabel: 'Agro-industrial hub', asset: invest('h1_agrohub', 'Cagayan agro-industrial hub', 'cagayan', 'Agro-processing', 1.1, 18_000, 22), stats: { poverty: -0.2, unemployment: -0.2 } }],
    ['Tax breaks for private processors instead', 'No state money.', 'A few plants open.', { taxRate: -0.01, stats: { unemployment: -0.1 } }],
  ]),

  quick('h1_medical_hub', [20, 30], 'economy', 'Medical Tourism Hub', 'Maynilad', [
    'Foreign patients already fly in for cheap surgery. A partnership with private hospitals could build a medical city that earns in dollars.',
  ], [
    ['Put in state land and ₱6B', 'Earn from foreign patients.', 'The medical city will open in two years.', { spend: 6, spendLabel: 'Medical city', asset: invest('h1_medcity', 'Medical tourism city (state share)', 'maynilad', 'Healthcare', 0.7, 8_000, 24), stats: { investor: 2 } }],
    ['Hospitals should serve our people first', 'No.', 'Doctors keep leaving for abroad.', { stats: { approval: 1 } }],
  ]),

  quick('h1_film_hub', [22, 32], 'economy', 'Studio ng Pelikula', 'Iloilanan', [
    'Foreign streaming studios want to film in the islands. A state film studio complex could rent sound stages and train crews.',
  ], [
    ['Build it: ₱4B', 'Rent from foreign productions.', 'The first productions arrive within a year.', { spend: 4, spendLabel: 'Film studio complex', asset: invest('h1_film', 'Iloilanan film studios', 'iloilanan', 'Studios', 0.4, 4_000, 14) }],
    ['Not a priority', 'Rice before cinema.', 'The studios film elsewhere.', {}],
  ]),

  quick('h1_clark_style_city', [26, 34], 'economy', 'Bagong Lungsod', 'Former air base, Hilagang Luzara', [
    'The old Columbian air base in the north is idle. {sec:publicWorks} proposes a new government city there — offices, homes, and an economic zone — financed by selling and leasing lots.',
  ], [
    ['Develop it: ₱20B', 'Lot sales and rents for decades.', 'Master planning begins. It will earn in three years.', { spend: 20, spendLabel: 'New Luzara City', asset: invest('h1_new_city', 'New Luzara City land sales and rents', 'sanfernando', 'Land development', 2.4, 20_000, 30), stats: { investor: 3, unemployment: -0.2 } }, 'A NEW CITY IN THE NORTH'],
    ['Lease the whole base to one developer', 'Quick and simple.', 'The developer pays ₱10B now and a small rent.', { income: 10, spendLabel: 'Air base lease', asset: invest('h1_base_rent', 'Former air base ground rent', 'sanfernando', 'Land lease', 0.5, 8_000, 12), stats: { corruption: 2 } }],
    ['Leave it', 'Maybe the next President.', 'The base stays idle.', {}],
  ]),

  quick('h1_geothermal_north', [28, 35], 'economy', 'Geothermal sa Hilaga', 'Hilagang Luzara', [
    'Engineers found a large geothermal field in the north. The state energy company can drill it and sell power for thirty years.',
  ], [
    ['Drill it: ₱14B', 'Cheap power and income.', 'The first wells will produce power in two years.', { spend: 14, spendLabel: 'Northern geothermal', asset: invest('h1_geo_north', 'Northern geothermal field', 'sanfernando', 'Geothermal power', 1.5, 2_000, 24), stats: { inflation: -0.1 } }],
    ['Auction it to a private firm', 'Money now.', 'A firm pays ₱6B for the rights.', { income: 6, spendLabel: 'Geothermal rights auction' }],
  ]),

  quick('h1_cruise_port', [16, 26], 'economy', 'Cruise Port ng Palawira', 'Palawira', [
    'Cruise lines want to stop in Palawira but there is no pier for big ships.',
  ], [
    ['Build a cruise pier: ₱5B', 'Port fees and tourists.', 'The first cruise ship docks in eighteen months.', { spend: 5, spendLabel: 'Palawira cruise pier', asset: invest('h1_cruise', 'Palawira cruise pier fees', 'palawira', 'Port', 0.45, 3_000, 18), stats: { growth: 0.03 } }],
    ['No — protect the reefs', 'Tourism has limits.', 'The environmental groups are grateful.', { stats: { tribes: 1 } }],
  ]),

  // ═════════════ TWISTS: TESTING THE GOVERNMENT ═════════════
  quick('h1_twist_airport_bribe', [14, 30], 'scandal', 'Suhol sa Paliparan', 'Senate Blue Ribbon Committee', [
    'A consortium executive tells a Senate hearing that a Palasyo official asked for ₱2B to “smooth” the new airport deal. The official is close to you.',
  ], [
    ['Fire the official and refer the case to the Ombudsman', 'No one is above the law.', 'Your coalition is shaken, but the public applauds.', { stats: { corruption: -4, approval: 3, cohesion: -4 } }],
    ['Deny everything', 'It is a lie.', 'Two more witnesses come forward.', { stats: { corruption: 5, approval: -5, ombudsman: 8 }, ...then('h1_twist_airport_bribe_2', 3) }],
  ], { when: [{ any: [{ resolved: 'h1_new_maynilad_airport', choice: 'h1_new_maynilad_airport_0' }, { resolved: 'h1_new_maynilad_airport', choice: 'h1_new_maynilad_airport_1' }] }] }),
  quick('h1_twist_airport_bribe_2', null, 'scandal', 'Mas Maraming Saksi', 'Senate', [
    'The new witnesses produce text messages. The consortium freezes the airport project until the scandal is settled.',
  ], [
    ['Settle it: apologize and fire the official', 'Save the project.', 'The project resumes six months late.', { stats: { approval: -2, corruption: -2 }, assetHit: { id: 'h1_new_airport', factor: 0.9, note: 'weaker terms after the bribery scandal' } }],
    ['Fight on', 'Never apologize.', 'The consortium pulls out. The airport is dead.', { assetHit: { id: 'h1_new_airport', factor: 0, note: 'the consortium pulled out over the bribery scandal' }, stats: { investor: -6, approval: -3 } }, 'AIRPORT DEAL COLLAPSES'],
  ]),

  quick('h1_twist_port_strike', [18, 32], 'crisis', 'Welga sa Pantalan', 'Maynilad port', [
    'Dockworkers strike over automation at the new terminals. Cargo piles up; prices of imported goods jump.',
  ], [
    ['Negotiate: retraining and a wage deal, ₱3B', 'End it fairly.', 'The strike ends in a week.', { spend: 3, spendLabel: 'Dockworker settlement', stats: { protest: -3 } }],
    ['Declare it illegal and send the police', 'The economy cannot wait.', 'The strike breaks — and a union leader is hurt.', { stats: { protest: 8, approval: -4, inflation: 0.1 } }],
  ]),

  quick('h1_twist_ally_withdraws', [22, 34], 'diplomacy', 'Umatras ang Kaalyado', 'Embassy of Nippara', [
    'Nippara’s new government reviews its overseas loans and asks to renegotiate the railway loan at higher interest.',
  ], [
    ['Accept the new terms', 'Keep the project going.', 'Interest costs rise.', { debt: 8, stats: { investor: -1 } }],
    ['Refuse and seek Haizhou financing instead', 'Play the powers against each other.', 'Nippara backs down — but relations cool.', { stats: { sovereignty: -3, investor: 1 } }],
  ], { when: [{ any: [{ resolved: 'v1_ally_nippara_rail', choice: 'v1_ally_nippara_rail_0' }, { resolved: 'v1_ally_nippara_rail', choice: 'v1_ally_nippara_rail_1' }] }] }),

  quick('h1_twist_bank_run', [20, 34], 'crisis', 'Takbuhan sa Bangko', 'Rural banks, Visara', [
    'Rumors on social media spark a run on three rural banks. Depositors line up for blocks. The Bangko Sentral governor asks for your support.',
  ], [
    ['Back the central bank: guarantee deposits', 'Stop the panic.', 'The run stops in two days.', { spend: 5, spendLabel: 'Deposit guarantee', stats: { investor: 3, approval: 1 } }],
    ['Say nothing — it is the bank’s problem', 'Stay out.', 'Two banks collapse. The peso wobbles.', { stats: { investor: -5, approval: -3, growth: -0.1 } }],
  ]),

  quick('h1_twist_governors_revolt', [24, 35], 'congress', 'Galit ang mga Gobernador', 'League of Provinces', [
    'Governors complain that every new hub goes to Maynilad and Sugbu. Twenty governors threaten to campaign against your allies.',
  ], [
    ['Promise a hub in every region: ₱15B', 'Spread the wealth.', 'The governors are placated.', { spend: 15, spendLabel: 'Regional development fund', stats: { cohesion: 4, approval: 2 } }],
    ['Explain that hubs go where they earn', 'Economics, not politics.', 'The governors campaign against you in the midterms.', { stats: { cohesion: -6 } }],
  ], { when: [{ any: [{ resolved: 'h1_new_maynilad_airport' }, { resolved: 'h1_it_park' }, { resolved: 'h1_container_port' }] }] }),

  quick('h1_twist_hub_typhoon', [26, 35], 'calamity', 'Tinamaan ang Hub', 'Eastern seaboard', [
    'A super typhoon slams into a province where the state is building new facilities. Construction sites are flooded.',
  ], [
    ['Rebuild quickly: ₱8B', 'Stay on schedule.', 'Work resumes within weeks.', { spend: 8, spendLabel: 'Typhoon repairs to projects', stats: { approval: 2 } }],
    ['Pause construction', 'Save money.', 'Several projects slip by months.', { assetHit: { id: 'h1_fishports', factor: 0.5, months: 6, note: 'typhoon damage' }, stats: { approval: -2 } }],
  ]),
];
