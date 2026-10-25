import type { StoryEvent } from '@/features/narrative/types/event';

const RIVAL_VP = { vpAlly: false } as const;

/**
 * Chapter 1 balance: investments, jobs, revenue and debt relief — each with a catch — plus priority-specific
 * tests, the rival Vice President storyline, and more fights with Congress, the Court, and traitors.
 * Most use a `window`, so each save gets them in a different month.
 */
export const GROWTH_1: StoryEvent[] = [
  // ═════════════════════════ INVESTMENTS & JOBS ═════════════════════════
  {
    id: 'inv_data_centers', window: [3, 12], priority: 5, category: 'economy', title: 'Mga Data Center', location: 'Board of Investments',
    body: ['Three global tech firms want to build ₱180B in data centers in Gitnang Kapatagan — 15,000 construction jobs and 4,000 permanent ones. The catch: they need as much electricity as a city of two million, and they want a 10-year tax holiday.'],
    choices: [
      { id: 'dc_full', label: 'Approve with the full tax holiday', description: 'Win the investment.', outcome: 'Groundbreaking in three months. Power prices tick up as the grid strains.', headline: '₱180B DATA CENTER BOOM', effects: { stats: { investor: 8, growth: 0.4, unemployment: -0.2, inflation: 0.1 }, taxRate: -0.02 } },
      { id: 'dc_power', label: 'Approve, but they must build their own solar farms', description: 'No burden on the grid.', outcome: 'Two of the three agree. Clean power, fewer jobs than hoped.', effects: { stats: { investor: 4, growth: 0.2, unemployment: -0.1 } } },
      { id: 'dc_tax', label: 'Approve, but with only a 4-year holiday', description: 'Protect revenue.', outcome: 'One firm walks away to Malindra. Two stay — and pay taxes sooner.', effects: { stats: { investor: 2, growth: 0.2 }, taxRate: 0.01 } },
    ],
  },
  {
    id: 'inv_battery_plant', window: [8, 20], priority: 5, category: 'economy', title: 'Planta ng Baterya', location: 'Hilagang Mindara',
    body: ['An electric-vehicle maker offers to build a ₱240B battery plant using Kapuluan nickel instead of exporting raw ore — 12,000 jobs. It needs guaranteed ore supply from mines on contested indigenous land.'],
    variants: [{ when: [{ flag: 'mine_denied' }], text: 'You once denied a mine on the Kalinaw mountain. The company knows it.' }],
    choices: [
      { id: 'bat_yes', label: 'Approve and guarantee the ore', description: 'Industrialize.', outcome: 'The Kapuluan moves up the value chain. Tribal groups warn of new mines.', headline: '₱240B EV BATTERY PLANT FOR MINDARA', effects: { stats: { growth: 0.5, investor: 8, unemployment: -0.3, tribes: -8 }, taxRate: 0.03 } },
      { id: 'bat_consent', label: 'Approve only with tribal consent and profit-sharing', description: 'Slower, fairer.', outcome: 'Negotiations take a year. The plant is smaller, but the tribes are partners.', effects: { stats: { growth: 0.2, investor: 3, tribes: 5 } } },
      { id: 'bat_no', label: 'Decline — keep exporting ore', description: 'No new mines.', outcome: 'The plant goes to Indara.', effects: { stats: { investor: -3 } } },
    ],
  },
  {
    id: 'inv_bpo_ai', window: [4, 14], priority: 4, category: 'economy', title: 'Call Centers at AI', location: 'IT-BPM Association',
    body: ['The call-center industry employs 1.7 million people. Now AI is replacing entry-level agents. A global firm offers a ₱50B “AI services hub” — 20,000 higher-skill jobs — if the government retrains workers.'],
    choices: [
      { id: 'bpo_retrain', label: 'Fund a ₱6B national retraining program', description: 'Prepare workers for AI jobs.', outcome: 'The hub opens. Retrained workers earn more; some older agents are left behind.', effects: { spend: 6, spendLabel: 'AI retraining program', stats: { growth: 0.3, unemployment: -0.2, investor: 5 } } },
      { id: 'bpo_protect', label: 'Tax AI replacements of workers', description: 'Protect current jobs.', outcome: 'Jobs are protected for now; the hub goes to Viettra.', effects: { stats: { investor: -4, approval: 2 }, taxRate: 0.01 } },
    ],
  },
  {
    id: 'inv_shipyard', window: [10, 22], priority: 5, category: 'economy', title: 'Ang Shipyard', location: 'Sibukan Bay',
    body: ['A shuttered shipyard — once one of the world’s largest — could reopen. A Columbian defense contractor offers ₱90B to build ships there; a Haizhou firm offers ₱110B. 10,000 jobs either way.'],
    choices: [
      { id: 'ship_columbian', label: 'Accept the Columbian offer', description: 'Jobs and security.', outcome: 'The shipyard reopens with navy contracts. Haizhou protests.', effects: { stats: { growth: 0.3, unemployment: -0.2, military: 6, sovereignty: 4 } } },
      { id: 'ship_haizhou', label: 'Accept the higher Haizhou offer', description: 'More money.', outcome: 'The military warns of a Haizhou foothold beside a naval base.', effects: { stats: { growth: 0.4, unemployment: -0.2, military: -8, sovereignty: -6 } } },
      { id: 'ship_state', label: 'Reopen it as a state shipyard', description: 'Build our own navy.', outcome: 'Expensive and slow — but it is yours.', effects: { spend: 30, spendLabel: 'State shipyard', stats: { military: 8, unemployment: -0.1 } } },
    ],
  },
  {
    id: 'inv_factory_relocation', window: [14, 28], priority: 5, category: 'economy', title: 'Lumilipat ang mga Pabrika', location: 'Economic zones',
    body: ['Tariffs between the superpowers are pushing factories out of Haizhou. Forty manufacturers are choosing between the Kapuluan, Viettra, and Indara. They want fast permits, cheap power, and no corruption at the ports.'],
    choices: [
      { id: 'fr_green_lane', label: 'Create a 30-day “green lane” for permits', description: 'Cut the red tape.', outcome: 'Twenty-two factories choose the Kapuluan. 60,000 jobs.', headline: '22 FACTORIES RELOCATE TO KAPULUAN', effects: { stats: { growth: 0.5, unemployment: -0.4, investor: 8, corruption: -2 } } },
      { id: 'fr_incentives', label: 'Offer big tax incentives', description: 'Outbid the neighbors.', outcome: 'Thirty factories come; the tax breaks cost ₱40B a year.', effects: { stats: { growth: 0.6, unemployment: -0.5, investor: 6 }, taxRate: -0.12 } },
      { id: 'fr_nothing', label: 'Let the market decide', description: 'No special treatment.', outcome: 'Viettra gets most of them.', effects: { stats: { investor: -2 } } },
    ],
  },
  {
    id: 'inv_offshore_wind', window: [16, 30], priority: 4, category: 'economy', title: 'Hangin sa Dagat', location: 'Energy Department',
    body: ['Nordhavn developers offer ₱300B for offshore wind farms — enough power for 5 million homes, and cheaper electricity within five years. Fishermen fear losing their grounds.'],
    choices: [
      { id: 'wind_yes', label: 'Approve with fishermen compensation', description: 'Clean, cheaper power.', outcome: 'Turbines rise off Kanlurang Luzara. Power prices begin to fall.', effects: { stats: { investor: 6, inflation: -0.3, growth: 0.2 }, spend: 3, spendLabel: 'Fishermen compensation' } },
      { id: 'wind_no', label: 'Protect the fishing grounds', description: 'Fishermen first.', outcome: 'The developers go to Viettra.', effects: { stats: { approval: 1, investor: -3 } } },
    ],
  },
  {
    id: 'inv_fake_investor', window: [6, 18], priority: 5, category: 'scandal', title: 'Pekeng Mamumuhunan', location: 'Board of Investments',
    body: ['A “Gulf sovereign fund” that promised ₱500B in investments — announced by your Trade Secretary at a televised signing — turns out to be two men in a rented office. The signing ceremony photos are everywhere.'],
    choices: [
      { id: 'fake_fire', label: 'Fire the Trade Secretary', description: 'Accountability.', outcome: 'The Secretary goes. Investors are reassured that someone checks now.', effects: { fireCabinet: 'trade', stats: { investor: 2, approval: -1 } } },
      { id: 'fake_blame', label: 'Blame “fraudsters” and move on', description: 'Protect your team.', outcome: 'The opposition uses the photos in every speech for a year.', effects: { stats: { approval: -4, media: 6 } } },
    ],
  },
  {
    id: 'factory_closures', window: [12, 26], priority: 5, category: 'economy', title: 'Nagsara ang mga Pabrika', location: 'Export zones',
    body: ['Three electronics factories close in a single month, laying off 18,000 workers. They blame high power costs and slow customs.'],
    choices: [
      { id: 'fc_rescue', label: 'Emergency power discounts to keep factories open', description: '₱10B.', outcome: 'Two factories reopen.', effects: { spend: 10, spendLabel: 'Industrial power subsidy', stats: { unemployment: -0.1 } } },
      { id: 'fc_retrain', label: 'Retrain the workers for new industries', description: 'Look forward.', outcome: 'Some find new jobs; many wait months.', effects: { spend: 3, spendLabel: 'Worker retraining', stats: { unemployment: 0.2 } } },
      { id: 'fc_nothing', label: 'Let them close', description: 'Creative destruction.', outcome: 'Unemployment rises in the export zones; so does anger.', effects: { stats: { unemployment: 0.4, protest: 4, approval: -2 } } },
    ],
  },
  {
    id: 'capital_flight', window: [18, 32], priority: 5, category: 'economy', when: [{ stat: 'investor', lte: 45 }], title: 'Tumatakas ang Kapital', location: 'Stock exchange',
    body: ['Foreign funds pull ₱120B out of the stock market in a month. The peso hits a record low. Import prices surge.'],
    choices: [
      { id: 'cf_reassure', label: 'An investor roadshow and a credible reform plan', description: 'Win back confidence.', outcome: 'The bleeding slows.', effects: { stats: { investor: 6, inflation: 0.3 } } },
      { id: 'cf_controls', label: 'Impose capital controls', description: 'Stop the outflow by force.', outcome: 'The outflow stops. So does new investment.', effects: { stats: { investor: -10, inflation: -0.2 } } },
    ],
  },

  // ═════════════════════════ REVENUE, DEBT & INFLATION ═════════════════════════
  {
    id: 'rev_diaspora_bonds', window: [5, 15], priority: 5, category: 'economy', title: 'Bono para sa mga OFW', location: 'Bureau of the Treasury',
    body: ['The Treasury proposes “Bayani Bonds” — small-denomination bonds sold to OFWs through their phones. Cheaper than foreign borrowing, and it keeps the interest at home.'],
    choices: [
      { id: 'dbonds_yes', label: 'Launch Bayani Bonds', description: 'Borrow from our own people.', outcome: 'OFWs buy ₱150B in a month. The Treasury retires expensive foreign debt with it, saving billions in interest.', headline: 'OFWS BUY ₱150B IN BAYANI BONDS', effects: { debt: -12, stats: { investor: 4, approval: 2 } } },
      { id: 'dbonds_no', label: 'Stick to regular borrowing', description: 'No experiments.', outcome: 'Nothing changes.', effects: {} },
    ],
  },
  {
    id: 'rev_debt_for_nature', window: [10, 24], priority: 5, category: 'economy', title: 'Utang Kapalit ng Kalikasan', location: 'Department of Finance',
    body: ['Nordhavn offers a “debt-for-nature swap”: it will cancel ₱120B of Kapuluan debt if the government protects 500,000 hectares of mangroves and reefs — no more mining or reclamation there.'],
    choices: [
      { id: 'dfn_yes', label: 'Accept the swap', description: 'Lower debt, protected coasts.', outcome: '₱120B of debt disappears. Developers with reclamation plans are furious.', headline: '₱120B DEBT CANCELLED IN NATURE SWAP', effects: { debt: -120, stats: { investor: 5, tribes: 4 }, houseShift: -2 } },
      { id: 'dfn_no', label: 'Decline — keep development options', description: 'Protect the reclamation projects.', outcome: 'The reclamation lobby is grateful.', effects: { stats: { corruption: 2 } } },
    ],
  },
  {
    id: 'rev_idle_lands', window: [12, 26], priority: 5, category: 'economy', title: 'Ang Lumang Kampo', location: 'Fuerte Santiago military camp, Maynilad',
    body: ['A 400-hectare military camp sits in the middle of Maynilad’s business district. Selling it would raise ₱250B — enough to pay off a big chunk of debt. The generals do not want to move.'],
    choices: [
      { id: 'land_sell', label: 'Sell it and use the money to cut debt', description: '₱250B.', outcome: 'The auction draws every tycoon in the country. The debt drops. The military sulks.', headline: '₱250B LAND SALE CUTS DEBT', effects: { income: 250, spendLabel: 'Fuerte Santiago land sale', stats: { investor: 6, military: -8 } } },
      { id: 'land_lease', label: 'Lease it long-term instead', description: '₱15B a year, keep ownership.', outcome: 'Steady revenue for decades.', effects: { taxRate: 0.05, stats: { military: -3 } } },
      { id: 'land_keep', label: 'Keep the camp', description: 'The military needs it.', outcome: 'The generals are grateful.', effects: { stats: { military: 4 } } },
    ],
  },
  {
    id: 'rev_customs_digital', window: [6, 18], priority: 4, category: 'economy', title: 'Digital na Aduana', location: 'Bureau of Customs',
    body: ['A fully digital, AI-assisted customs system could stop undervaluation and smuggling — and raise ₱80B a year. Customs brokers and some officials who profit from “facilitation fees” oppose it.'],
    choices: [
      { id: 'cus_digital', label: 'Digitize customs', description: '₱5B investment.', outcome: 'Collections jump within a year. Several brokers are arrested for trying to sabotage the system.', effects: { spend: 5, spendLabel: 'Customs digitalization', taxRate: 0.25, stats: { corruption: -4, inflation: -0.1 } } },
      { id: 'cus_delay', label: 'Delay — the brokers have a point about jobs', description: 'Avoid disruption.', outcome: 'Smuggling continues at its usual pace.', effects: { stats: { corruption: 2 } } },
    ],
  },
  {
    id: 'rev_bir_einvoice', window: [14, 30], priority: 4, category: 'economy', title: 'E-Invoicing', location: 'Bureau of Internal Revenue',
    body: ['The tax bureau wants mandatory e-invoicing for all businesses — every sale recorded in real time. It could raise ₱120B a year. Small businesses fear the paperwork; big evaders fear the transparency.'],
    choices: [
      { id: 'einv_all', label: 'Mandate it for all businesses', description: 'Maximum revenue.', outcome: 'Revenue rises. So do complaints from sari-sari stores.', effects: { taxRate: 0.35, stats: { approval: -2, corruption: -2 } } },
      { id: 'einv_large', label: 'Only for large businesses', description: 'Target the big evaders.', outcome: 'A smaller gain, fewer complaints.', effects: { taxRate: 0.18, stats: { corruption: -1 } } },
    ],
  },
  {
    id: 'rev_gocc_dividends', window: [8, 20], priority: 4, category: 'economy', title: 'Dibidendo ng mga GOCC', location: 'Department of Finance',
    body: ['Government corporations are sitting on ₱180B in profits — and paying their boards generous bonuses. The Finance Secretary wants them to remit 75% of profits to the Treasury.'],
    choices: [
      { id: 'goccdiv_yes', label: 'Order the remittance', description: '₱135B for the Treasury.', outcome: 'The Treasury gets its windfall. GOCC board members lose their bonuses — and their tempers.', effects: { income: 135, spendLabel: 'GOCC dividends', stats: { corruption: -2, cohesion: -2 } } },
      { id: 'goccdiv_half', label: 'Order 50% remittance', description: 'A compromise.', outcome: '₱90B for the Treasury.', effects: { income: 90, spendLabel: 'GOCC dividends' } },
    ],
  },
  {
    id: 'rev_gas_discovery', window: [18, 30], priority: 7, category: 'economy', title: 'Ang Kalampaya Gas Field', location: 'West Sea, 80 km offshore',
    body: ['Exploration confirms a major gas field — Kalampaya-2 — inside your waters. Royalties could bring ₱60B a year for twenty years. It is also inside the area Haizhou claims.'],
    variants: [{ when: [{ flag: 'west_sea', is: 'deal' }], text: 'Haizhou reminds you of your joint-exploration understanding.' }],
    choices: [
      { id: 'gas_develop', label: 'Develop it with a Nordhavn-Kapuluan consortium', description: 'Our gas, our partners.', outcome: 'Drilling begins under a naval escort. Haizhou coast guard ships circle.', headline: 'KALAMPAYA-2: GAS BONANZA IN THE WEST SEA', effects: { taxRate: 0.2, stats: { sovereignty: 10, growth: 0.3, investor: 5 } } },
      { id: 'gas_joint', label: 'Develop it jointly with Haizhou', description: 'Peace and profit.', outcome: 'Revenue flows, split 60–40. The Supreme Court gets a new petition.', effects: { taxRate: 0.12, stats: { sovereignty: -8, courtTension: 5 } } },
      { id: 'gas_wait', label: 'Wait for a better moment', description: 'Avoid provoking Haizhou.', outcome: 'The gas stays underground.', effects: {} },
    ],
  },
  {
    id: 'rev_illgotten_wealth', window: [10, 28], priority: 5, category: 'economy', title: 'Nakaw na Yaman', location: 'Presidential Commission on Good Government',
    body: ['Investigators trace ₱60B of the old strongman’s hidden wealth to accounts in Switzerland and a Singhapura trust. His family — your northern allies — would fight any recovery.'],
    choices: [
      { id: 'igw_recover', label: 'Pursue full recovery', description: 'Return the people’s money.', outcome: 'After a year of litigation, ₱45B is returned to the Treasury. The northern bloc turns cold.', headline: '₱45B OF STRONGMAN’S LOOT RECOVERED', effects: { income: 45, spendLabel: 'Recovered ill-gotten wealth', stats: { approval: 4, cohesion: -5 }, houseShift: -4 } },
      { id: 'igw_settle', label: 'Settle: the family returns half, keeps the rest', description: 'A compromise.', outcome: '₱30B returned. Martial-law victims call it a betrayal.', effects: { income: 30, spendLabel: 'Ill-gotten wealth settlement', stats: { approval: -1 } } },
      { id: 'igw_drop', label: 'Drop the case', description: 'Keep the northern bloc.', outcome: 'The family sends flowers.', effects: { stats: { cohesion: 4, corruption: 2 } } },
    ],
  },
  {
    id: 'rev_billionaire_donation', window: [4, 20], priority: 3, category: 'society', title: 'Ang Donasyon', location: 'Palasyo',
    body: ['The country’s richest man offers to donate ₱20B to build 30 provincial hospitals. His conglomerate also has a pending application to extend its water concession by 25 years.'],
    choices: [
      { id: 'don_accept', label: 'Accept with gratitude — no strings', description: 'Take the hospitals, decide the concession separately.', outcome: 'The hospitals rise. His concession application sits on your desk, awkwardly.', effects: { stats: { approval: 3 } } },
      { id: 'don_deal', label: 'Accept — and approve the concession', description: 'A mutual favor.', outcome: 'Critics call it a ₱20B bribe dressed as charity.', headline: 'HOSPITALS FOR A WATER CONCESSION?', effects: { stats: { approval: 1, corruption: 5, ombudsman: 4 } } },
      { id: 'don_decline', label: 'Decline until the concession is decided on its merits', description: 'Avoid any appearance of a deal.', outcome: 'He is offended; the hospitals wait.', effects: { stats: { corruption: -1 } } },
    ],
  },
  {
    id: 'infl_rate_cut', window: [14, 30], priority: 4, category: 'economy', when: [{ stat: 'inflation', lte: 4.5 }], title: 'Bumaba ang Interes', location: 'Bangko Sentral ng Kapuluan',
    body: ['With inflation easing, the central bank cuts interest rates by 50 basis points. Loans get cheaper; so does government borrowing.'],
    choices: [{ id: 'rc_welcome', label: 'Welcome it — and announce a small-business loan program', description: 'Ride the momentum.', outcome: 'Credit to small businesses jumps.', headline: 'RATE CUT: CHEAPER LOANS FOR ALL', effects: { stats: { growth: 0.3, investor: 3 }, spend: 2, spendLabel: 'Small business loan guarantees' } }],
  },
  {
    id: 'infl_price_watch', window: [4, 16], priority: 4, category: 'economy', title: 'Mga Mapagsamantala', location: 'Trade Department',
    body: ['Prices of canned goods, noodles, and cooking oil keep rising even though costs have fallen. Three distributors control most of the market.'],
    choices: [
      { id: 'pw_competition', label: 'Refer them to the Competition Commission', description: 'Break the cartel legally.', outcome: 'An investigation leads to fines — and lower prices within months.', effects: { stats: { inflation: -0.5, investor: -1, approval: 2 } } },
      { id: 'pw_caps', label: 'Impose price caps', description: 'Immediate relief.', outcome: 'Prices drop — and some goods vanish from shelves.', effects: { stats: { inflation: -0.4, investor: -3, courtTension: 2 } } },
    ],
  },

  // ═════════════════════════ YOUR PRIORITY, TESTED ═════════════════════════
  {
    id: 'prio_economy_test', window: [8, 16], priority: 6, category: 'economy', when: [{ flag: 'admin_priority', is: 'economy' }], title: 'Ang Pangako ng Trabaho', location: 'Economic cluster',
    body: ['You made the economy your first priority. A year in, growth is steady — but job creation lags, and critics say growth only reaches the rich.'],
    choices: [
      { id: 'pe_inclusive', label: 'Launch an inclusive-growth package for provinces', description: '₱20B for provincial industries.', outcome: 'Provincial factories open; the growth spreads.', effects: { spend: 20, spendLabel: 'Inclusive growth package', stats: { unemployment: -0.3, poverty: -0.3, approval: 2 } } },
      { id: 'pe_stay', label: 'Stay the course — trickle down takes time', description: 'Patience.', outcome: 'Business applauds; the poor wait.', effects: { stats: { investor: 3, approval: -2 } } },
    ],
  },
  {
    id: 'prio_infra_test', window: [8, 16], priority: 6, category: 'economy', when: [{ flag: 'admin_priority', is: 'infrastructure' }], title: 'Build, Build… Delay?', location: 'Public Works',
    body: ['Infrastructure was your priority. But right-of-way disputes, contractor delays, and cost overruns have stalled half your projects.'],
    choices: [
      { id: 'pi_crack', label: 'Blacklist delayed contractors and take over projects', description: 'Discipline.', outcome: 'Projects move faster. Blacklisted contractors sue — and some are donors.', effects: { stats: { growth: 0.3, corruption: -3, cohesion: -3 } } },
      { id: 'pi_money', label: 'Pour in more money to catch up', description: '₱40B supplemental.', outcome: 'Projects accelerate. So do the invoices.', effects: { spend: 40, spendLabel: 'Infrastructure catch-up', stats: { growth: 0.4, corruption: 2 } } },
    ],
  },
  {
    id: 'prio_agri_test', window: [8, 16], priority: 6, category: 'economy', when: [{ flag: 'admin_priority', is: 'agriculture' }], title: 'Ang Pangako sa Magsasaka', location: 'Agriculture Department',
    body: ['Agriculture was your priority. Harvests are up, but farmgate prices have collapsed because of a bumper crop — farmers are earning less than ever.'],
    choices: [
      { id: 'pa_buy', label: 'Government buys the surplus at a floor price', description: '₱15B.', outcome: 'Farmers are rescued. Warehouses fill with rice.', effects: { spend: 15, spendLabel: 'Palay floor-price buying', stats: { approval: 3, poverty: -0.3 } } },
      { id: 'pa_export', label: 'Open rice exports for the first time in decades', description: 'Sell the surplus abroad.', outcome: 'Farmers earn more; domestic prices rise slightly.', effects: { stats: { inflation: 0.2, growth: 0.2, approval: 1 } } },
    ],
  },
  {
    id: 'prio_health_test', window: [8, 16], priority: 6, category: 'society', when: [{ flag: 'admin_priority', is: 'health' }], title: 'Ang Pangako sa Kalusugan', location: 'Department of Health',
    body: ['Health was your priority. New hospitals are opening — but there are not enough doctors and nurses to staff them.'],
    choices: [
      { id: 'ph_scholar', label: 'Medical scholarships with return service', description: '₱8B a year.', outcome: 'A pipeline of doctors for the provinces — in five years.', effects: { program: { id: 'med_scholars', label: 'Medical scholarships', monthly: 0.7, months: 72 }, stats: { approval: 2 } } },
      { id: 'ph_import', label: 'Recruit foreign doctors', description: 'Fast.', outcome: 'Local medical associations protest. Wards open.', effects: { stats: { approval: 1, protest: 2 } } },
    ],
  },
  {
    id: 'prio_edu_test', window: [8, 16], priority: 6, category: 'society', when: [{ flag: 'admin_priority', is: 'education' }], title: 'Ang Pangako sa Edukasyon', location: 'Department of Education',
    body: ['Education was your priority. Reading scores have not moved. Teachers say they are drowning in paperwork.'],
    choices: [
      { id: 'pedu_admin', label: 'Hire 20,000 school administrative staff', description: 'Free teachers to teach.', outcome: 'Teachers finally have time to teach. Scores begin to rise.', effects: { program: { id: 'school_admin', label: 'School administrative staff', monthly: 0.9, months: 72 }, stats: { approval: 2 } } },
      { id: 'pedu_tests', label: 'National testing every year', description: 'Measure everything.', outcome: 'More paperwork. Teachers are furious.', effects: { stats: { protest: 4 } } },
    ],
  },
  {
    id: 'prio_security_test', window: [8, 16], priority: 6, category: 'crisis', when: [{ flag: 'admin_priority', is: 'security' }], title: 'Ang Pangako ng Kaayusan', location: 'National Police',
    body: ['Peace and order was your priority. Crime is down — but police are accused of planting evidence to meet quotas.'],
    choices: [
      { id: 'psec_audit', label: 'Order an audit of every arrest', description: 'Clean the numbers.', outcome: 'Hundreds of cases collapse. The police feel betrayed; the courts are relieved.', effects: { stats: { military: -5, courtTension: -4, crime: 2 } } },
      { id: 'psec_defend', label: 'Defend the police', description: 'Results matter.', outcome: 'Human-rights groups document the abuses.', effects: { stats: { military: 4, church: -4, courtTension: 4 } } },
    ],
  },
  {
    id: 'prio_payoff', window: [22, 32], priority: 5, category: 'economy', when: [{ flag: 'admin_priority' }], title: 'Bunga ng Priyoridad', location: 'National statistics',
    body: ['Two years of focus on your priority are starting to show results — the numbers finally move in your favor.'],
    choices: [
      { id: 'payoff_tour', label: 'Tour the country to show the results', description: 'Take credit.', outcome: 'Your approval ticks up where people can see the difference.', effects: { stats: { approval: 3, growth: 0.2, poverty: -0.2 } } },
      { id: 'payoff_double', label: 'Double down with more funding', description: '₱15B more.', outcome: 'The gains accelerate.', effects: { spend: 15, spendLabel: 'Priority program expansion', stats: { growth: 0.4, approval: 2 } } },
    ],
  },

  // ═════════════════════════ THE RIVAL VICE PRESIDENT ═════════════════════════
  {
    id: 'rvp_shadow', window: [1, 4], priority: 6, category: 'cabinet', when: [RIVAL_VP], title: 'Ang Bise ng Kalaban', location: 'Office of the Vice President',
    body: ['Vice President {vp} won on the rival ticket. The VP has set up a “shadow cabinet” of opposition figures and holds weekly press conferences criticizing you. Constitutionally, the VP is first in line to replace you.'],
    choices: [
      { id: 'rvp_invite', label: 'Offer the VP a Cabinet post', description: 'Keep your enemies closer.', outcome: 'The VP accepts Social Welfare — and uses it to build a national following.', effects: { flags: { rvp_in_cabinet: true }, stats: { protest: -3, cabinetCohesion: -4 } } },
      { id: 'rvp_isolate', label: 'Isolate the VP: no office budget beyond the minimum', description: 'Starve the rival.', outcome: 'The VP plays the victim — effectively.', effects: { stats: { media: 5 }, flags: { rvp_starved: true } } },
      { id: 'rvp_ignore', label: 'Ignore the VP', description: 'Govern.', outcome: 'The shadow cabinet keeps holding press conferences.', effects: {} },
    ],
  },
  {
    id: 'rvp_leaks', window: [8, 14], priority: 6, category: 'scandal', when: [RIVAL_VP], title: 'Tagas mula sa Bise', location: 'Opposition newspapers',
    body: ['Confidential security briefings keep appearing in opposition newspapers. They were shared with the Vice President under the law.'],
    choices: [
      { id: 'rvpl_cut', label: 'Cut the VP out of security briefings', description: 'Stop the leaks.', outcome: 'The leaks stop. The VP calls it unconstitutional.', effects: { stats: { courtTension: 3 } } },
      { id: 'rvpl_expose', label: 'Prove the leaks came from the VP’s office', description: 'Go public.', outcome: 'An aide of the VP is charged. The VP denies knowledge.', effects: { stats: { media: -3, approval: 2 } } },
    ],
  },
  {
    id: 'rvp_positioning', window: [16, 22], priority: 7, category: 'congress', when: [RIVAL_VP], title: 'Handa ang Kapalit', location: 'Opposition caucus',
    body: ['The Vice President is quietly telling congressmen: “If the President falls, I will remember who helped.” Impeachment suddenly looks like a path to power for a lot of people.'],
    choices: [
      { id: 'rvpp_court', label: 'Shore up the House with projects', description: '₱20B.', outcome: 'Your allies stay — for a price.', effects: { spend: 20, spendLabel: 'Projects for House allies', stats: { cohesion: 6, corruption: 3 } } },
      { id: 'rvpp_dig', label: 'Dig into the VP’s own finances', description: 'Fight fire with fire.', outcome: 'Your investigators find irregularities in the VP’s confidential funds.', effects: { flags: { rvp_dirt: true }, stats: { ombudsman: 2 }, schedule: [{ event: 'rvp_funds_scandal', inMonths: 3 }] } },
      { id: 'rvpp_ignore', label: 'Govern well and ignore it', description: 'The best defense.', outcome: 'Some congressmen start talking to the VP’s people.', effects: { houseShift: -8, stats: { ombudsman: 6 } } },
    ],
  },
  {
    id: 'rvp_funds_scandal', category: 'scandal', when: [{ flag: 'rvp_dirt' }], title: 'Ang Pondo ng Bise', location: 'House Committee on Good Government',
    body: ['Your allies expose ₱125M in confidential funds spent by the Vice President’s office in eleven days, with receipts signed by people who do not exist.'],
    choices: [
      { id: 'rvpf_impeach', label: 'Have the House impeach the Vice President', description: '106 votes needed.', outcome: 'The vote is called.', effects: { stats: { capital: -5 }, vote: { bill: 'Impeachment of the Vice President (House)', appeal: 1, houseOnly: true, houseThreshold: 106, onPass: { flags: { vp_impeached: true }, stats: { media: 4 }, schedule: [{ event: 'vp_impeach_court', inMonths: 3 }] }, onFail: { stats: { capital: -4 } } } } },
      { id: 'rvpf_leverage', label: 'Keep it as leverage', description: 'A quiet threat.', outcome: 'The VP’s press conferences become noticeably milder.', effects: { flags: { rvp_leverage: true }, stats: { capital: 4 } } },
    ],
  },

  // ═════════════════════════ CONGRESS, COURT & TRAITORS ═════════════════════════
  {
    id: 'house_rebels_1', window: [20, 27], priority: 6, category: 'congress', title: 'Rebelde sa Kamara', location: 'House of Representatives',
    body: ['Thirty-two congressmen from your own coalition form a “Reform Bloc” and announce they will vote independently — unless their provinces get the infrastructure you promised.'],
    choices: [
      { id: 'hr_deliver', label: 'Deliver their projects', description: '₱25B.', outcome: 'The Reform Bloc disbands, satisfied.', effects: { spend: 25, spendLabel: 'Promised provincial projects', stats: { cohesion: 6 } } },
      { id: 'hr_punish', label: 'Strip their committee chairs', description: 'Make an example.', outcome: 'They join the opposition.', effects: { houseShift: -32, stats: { capital: 3 } } },
      { id: 'hr_negotiate', label: 'Let them vote freely on some bills', description: 'Flexibility.', outcome: 'An uneasy peace.', effects: { stats: { cohesion: -2 } } },
    ],
  },
  {
    id: 'senate_walkout', window: [10, 20], priority: 5, category: 'congress', title: 'Walkout sa Senado', location: 'Senate',
    body: ['Opposition senators walk out of the session hall, denying the Senate a quorum, to protest your handling of a scandal. Nothing can pass until they return.'],
    choices: [
      { id: 'sw_dialogue', label: 'Invite the opposition senators to dialogue', description: 'Hear them out.', outcome: 'They return after a week, with concessions on committee chairmanships.', effects: { stats: { cohesion: -2, media: -3 } } },
      { id: 'sw_wait', label: 'Wait them out', description: 'They will tire.', outcome: 'Three weeks of paralysis. The public blames everyone.', effects: { stats: { approval: -2, capital: -3 } } },
    ],
  },
  {
    id: 'speaker_power_grab', window: [14, 24], priority: 6, category: 'congress', title: 'Ang Ambisyon ng Speaker', location: 'Speaker’s office',
    body: ['Speaker {speaker} is building a national machine — district projects branded with the Speaker’s name in 50 provinces. Insiders say the Speaker wants the presidency in 2033.'],
    choices: [
      { id: 'sp_rein', label: 'Rein in the Speaker’s budget', description: 'Cut the branded projects.', outcome: 'The Speaker smiles and says nothing. Enemies never forget.', effects: { stats: { cohesion: -5, corruption: -2 }, flags: { speaker_rival: true } } },
      { id: 'sp_embrace', label: 'Embrace the Speaker as a potential successor', description: 'Keep the House loyal.', outcome: 'The House is solidly yours — and the Speaker grows more powerful.', effects: { stats: { cohesion: 6 }, flags: { speaker_heir: true } } },
    ],
  },
  {
    id: 'sc_tro_flagship', window: [16, 28], priority: 6, category: 'court', when: [{ flag: 'flagship' }], title: 'TRO sa Flagship', location: 'Kataas-taasang Hukuman',
    body: ['Residents displaced by your flagship infrastructure project petition the Supreme Court, saying they were evicted without just compensation.'],
    court: { title: 'Displaced Residents v. Department of Public Works (flagship project)', kind: 'rights', soundness: 0.5, onStrike: { spend: 15, spendLabel: 'Court-ordered compensation', stats: { growth: -0.2 } }, onUphold: { stats: { growth: 0.1 } } },
    choices: [
      { id: 'tf_pay', label: 'Pay just compensation promptly', description: 'Respect the ruling — or be generous anyway.', outcome: 'The residents are paid. The project resumes.', effects: { stats: { approval: 1 } } },
      { id: 'tf_appeal', label: 'Fight it in court', description: 'The project must not stop.', when: [{ ruling: 'struck' }], outcome: 'The project stalls for another year.', effects: { stats: { growth: -0.2, courtTension: 4 } } },
    ],
  },
  {
    id: 'sc_ombudsman_power', window: [20, 30], priority: 5, category: 'court', title: 'Kapangyarihan ng Ombudsman', location: 'Kataas-taasang Hukuman',
    body: ['Your allies in Congress challenge the Ombudsman’s power to suspend elected officials without a hearing. The case could weaken every anti-corruption investigation — including those of your allies.'],
    court: { title: 'League of Governors v. Office of the Ombudsman', kind: 'executive', soundness: 0.45, onStrike: { stats: { corruption: 3, ombudsman: -8 } }, onUphold: { stats: { ombudsman: 4, corruption: -2 } } },
    choices: [
      { id: 'sop_neutral', label: 'Stay neutral publicly', description: 'Let the Court decide.', outcome: 'The ruling reshapes anti-corruption work for years.', effects: {} },
      { id: 'sop_celebrate', label: 'Welcome a weaker Ombudsman', description: 'Your allies are relieved.', when: [{ ruling: 'struck' }], outcome: 'Reformers call it a dark day.', effects: { stats: { media: 5, approval: -2 } } },
    ],
  },
  {
    id: 'traitor_undersecretary', window: [12, 26], priority: 6, category: 'cabinet', title: 'Ang Nagbebenta ng Impormasyon', location: 'Budget Department',
    body: ['An undersecretary has been selling advance copies of the budget to contractors — telling them which projects will be funded before the public knows. The NBI has recordings.'],
    choices: [
      { id: 'tu_charge', label: 'Charge him publicly', description: 'Zero tolerance.', outcome: 'He is arrested at his desk. The contractors who paid him are blacklisted.', effects: { stats: { corruption: -4, approval: 2 } } },
      { id: 'tu_quiet', label: 'Let him resign quietly', description: 'Avoid embarrassment.', outcome: 'He resigns — and goes to work for one of the contractors.', effects: { stats: { corruption: 3 } } },
      { id: 'tu_turn', label: 'Turn him into an informant', description: 'Use him to catch the contractors.', outcome: 'Six months later, a sting nets four contractors and two congressmen.', effects: { stats: { corruption: -5, cohesion: -4 }, houseShift: -2 } },
    ],
  },

  // ═════════════════════════ THE ECONOMY TALKS BACK (triggered by the numbers) ═════════════════════════
  {
    id: 'economic_rally', priority: 8, category: 'society', title: 'Rally ng Nagugutom', location: 'Avenida Liwayway',
    body: ['The economy has stalled. Prices are high, jobs are scarce, and 200,000 workers, farmers, and students march on the Palasyo under one banner: “Trabaho at Bigas, Hindi Pangako!” — Jobs and rice, not promises.'],
    choices: [
      { id: 'er_relief', label: 'Announce an emergency jobs and food package: ₱35B', description: 'Meet them halfway.', outcome: 'The crowd disperses. The deficit grows.', headline: '₱35B EMERGENCY PACKAGE AFTER MASSIVE RALLY', effects: { spend: 35, spendLabel: 'Emergency jobs and food package', stats: { protest: -12, unemployment: -0.3, approval: 3 } } },
      { id: 'er_reform', label: 'Promise structural reforms, no handouts', description: 'Fix causes, not symptoms.', outcome: 'The marchers are not impressed. The protest becomes a weekly event.', effects: { stats: { protest: 6, investor: 3 } } },
      { id: 'er_police', label: 'Keep them away from the Palasyo', description: 'Order first.', outcome: 'Scuffles with police. The photos travel far.', effects: { stats: { protest: 10, approval: -5, media: 6 } } },
    ],
  },
  {
    id: 'boom_times', priority: 6, category: 'economy', title: 'Masaganang Panahon', location: 'Department of Finance',
    body: ['Growth is strong and inflation is tame. Tax collections are ₱150B above target. For once, the Finance Secretary has good news — and a choice about what to do with it.'],
    choices: [
      { id: 'boom_debt', label: 'Use the windfall to pay down debt', description: 'Prudence.', outcome: 'The debt falls; the rating agencies take notice.', headline: 'WINDFALL USED TO CUT DEBT', effects: { debt: -120, stats: { investor: 6 } } },
      { id: 'boom_spend', label: 'Spend it on schools and hospitals', description: 'Share the prosperity.', outcome: 'Classrooms and wards open ahead of schedule.', effects: { income: 150, spendLabel: 'Revenue windfall', stats: { approval: 4, poverty: -0.3 }, project: { id: 'boom_social', name: 'Windfall schools and hospitals', region: 'National', cost: 150, months: 18 } } },
      { id: 'boom_tax_cut', label: 'Cut income taxes for the middle class', description: 'Give it back.', outcome: 'Take-home pay rises. Future revenue shrinks.', effects: { income: 150, spendLabel: 'Revenue windfall', taxRate: -0.2, stats: { approval: 5 } } },
    ],
  },
  {
    id: 'debt_alarm', priority: 8, category: 'economy', title: 'Babala sa Utang', location: 'Rating agencies',
    body: ['Debt has passed 68% of GDP. Rating agencies warn of a downgrade to junk within six months unless there is a credible plan. Interest costs are already eating the budget.'],
    choices: [
      { id: 'da_plan', label: 'A credible consolidation plan: new taxes and spending cuts', description: 'Painful, necessary.', outcome: 'The agencies hold the rating. Congress and the public are furious.', effects: { taxRate: 0.4, budgetChange: -120, stats: { investor: 8, approval: -5, cohesion: -5 } } },
      { id: 'da_assets', label: 'Sell state assets to pay down debt', description: 'Airports, power plants, land.', outcome: '₱300B raised. Nationalists protest the “selling of the nation.”', effects: { debt: -220, stats: { investor: 5, protest: 6 } } },
      { id: 'da_ignore', label: 'Dismiss the warning', description: 'Growth will fix it.', outcome: 'The downgrade comes. Interest rates jump.', headline: 'KAPULUAN DOWNGRADED TO JUNK', effects: { stats: { investor: -12, inflation: 0.5, growth: -0.4 } } },
    ],
  },
];
