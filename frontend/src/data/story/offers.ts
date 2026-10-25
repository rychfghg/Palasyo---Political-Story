import type { StoryEvent } from '@/features/narrative/types/event';
import { quick, then } from './chapter1/helpers';
import { invest } from './chapter1/ventures';

/**
 * Projects that someone brings to the President — a Speaker, a governor, a tycoon, a state bank —
 * at the start, middle, and end of each chapter. Plus the things that go wrong afterward.
 */

// ═══════════════════════════ CHAPTER 1 ═══════════════════════════
export const OFFERS_1: StoryEvent[] = [
  // ─── Start ───
  quick('o1_speaker_bulkwater', [1, 3], 'congress', 'Endorso ng Speaker: Tubig ng Sugbu', 'Speaker’s office, Batasan', [
    'Speaker {speaker} slides a folder across the table. “A bulk-water project for Sugbu. A private builder, the state takes 30%, and the water district buys every liter for 25 years.”',
    'It would end Sugbu’s water shortage. The builder is a longtime donor of the Speaker.',
  ], [
    ['Take the 30% stake: ₱9B', 'Water for a million people, and a steady dividend.', 'The plant goes up in a year. The Speaker is pleased.', { spend: 9, spendLabel: 'Sugbu bulk water (state stake)', asset: invest('o1_bulkwater', 'Sugbu bulk water (30% state)', 'sugbu', 'Water utility', 0.85, 1_800, 12), stats: { cohesion: 3, approval: 1 } }],
    ['Open it to public bidding first', 'Fair, but slower — and the Speaker’s favored builder may lose.', 'A different company wins with a better price. The Speaker is cold for weeks.', { spend: 9, spendLabel: 'Sugbu bulk water (state stake)', asset: invest('o1_bulkwater', 'Sugbu bulk water (30% state, competitive bid)', 'sugbu', 'Water utility', 1.05, 1_800, 16), stats: { cohesion: -4, corruption: -2 } }],
    ['Decline', 'Not the state’s business.', 'Sugbu stays dry. The Speaker remembers.', { stats: { cohesion: -2 } }],
  ], { priority: 6 }),

  quick('o1_tycoon_terminal', [2, 5], 'economy', 'Alok ng Tycoon: Terminal ng Bus', 'Makati-style business district', [
    'Tycoon Lorenzo Tanjuatco offers to build an integrated bus terminal on idle state land at the edge of Maynilad, clearing buses from the city center. He pays rent and shares 10% of revenue.',
  ], [
    ['Lease the land to him', 'Rent plus a revenue share — and less traffic.', 'The terminal opens in 18 months. Traffic eases on the main avenue.', { asset: invest('o1_terminal', 'Maynilad bus terminal (rent and share)', 'maynilad', 'Land lease', 1.2, 3_500, 18), stats: { approval: 1 } }],
    ['Build it as a state project: ₱7B', 'Keep all the revenue.', 'Slower, but the fees stay with the state.', { spend: 7, spendLabel: 'State bus terminal', asset: invest('o1_terminal_state', 'Maynilad bus terminal (state-run)', 'maynilad', 'Transport terminal', 0.75, 2_500, 24) }],
    ['Decline', 'He has enough.', 'The buses stay on the avenue.', {}],
  ]),

  // ─── Middle ───
  quick('o1_governor_airport', [15, 19], 'economy', 'Endorso ng Gobernador: Paliparan', 'Legazpira Provincial Capitol', [
    'The Governor of Legazpira, a key ally, lobbies for a new international airport near the volcano — a tourist magnet. A private operator would run it and pay the state a concession fee.',
  ], [
    ['Build the runway, let the operator run it: ₱12B', 'Concession fees and tourists.', 'The airport opens in two years. The province names a road after you.', { spend: 12, spendLabel: 'Legazpira airport runway', asset: invest('o1_legazpira_air', 'Legazpira airport concession', 'legazpira', 'Airport concession', 1.1, 4_500, 20), stats: { growth: 0.05, cohesion: 2 } }],
    ['Only if the operator pays for everything', 'No state money.', 'The operator agrees to a smaller airport.', { asset: invest('o1_legazpira_air_small', 'Legazpira airport fee', 'legazpira', 'Airport concession', 0.4, 1_500, 24) }],
    ['Decline', 'The province can wait.', 'The governor sulks. Tourists fly elsewhere.', { stats: { cohesion: -2 } }],
  ]),

  quick('o1_senator_geothermal', [17, 21], 'economy', 'Endorso ng Senador: Geothermal', 'Senate', [
    '{senatePresident} endorses a geothermal expansion in the Visara by the state energy company. It would cut power prices and sell to the grid.',
  ], [
    ['Fund the expansion: ₱16B', 'Cheap, clean power the state owns.', 'The new wells come online in eighteen months.', { spend: 16, spendLabel: 'Geothermal expansion', asset: invest('o1_geothermal', 'Visara geothermal expansion', 'iloilanan', 'Geothermal power', 1.6, 1_500, 18), stats: { inflation: -0.1 } }],
    ['Partner with a private firm (state keeps 40%)', 'Less money, less income.', 'The firm drills; the state earns a share.', { spend: 6, spendLabel: 'Geothermal (state 40%)', asset: invest('o1_geothermal_jv', 'Visara geothermal (40% state)', 'iloilanan', 'Geothermal power', 0.6, 1_200, 18), stats: { inflation: -0.05 } }],
    ['Decline', 'Not now.', 'The Senate President is annoyed.', { senateShift: { from: 'ally', to: 'neutral', count: 1 } }],
  ]),

  // ─── End ───
  quick('o1_housing_jv', [29, 33], 'economy', 'Alok ng Kongklomerado: Pabahay', 'Office of the President', [
    'A conglomerate proposes a joint venture: 100,000 low-cost homes on state land, with the state earning a share of the sales and rent.',
  ], [
    ['Put in the land and ₱10B', 'Homes and income.', 'The first 20,000 homes are handed over in a year.', { spend: 10, spendLabel: 'Housing joint venture', asset: invest('o1_housing', 'Housing joint venture (state share)', 'kapatagan', 'Housing', 1.1, 25_000, 12), stats: { approval: 3, poverty: -0.3 } }, '100,000 HOMES JOINT VENTURE'],
    ['Put in the land only', 'No cash.', 'A smaller project, a smaller share.', { asset: invest('o1_housing_land', 'Housing joint venture (land only)', 'kapatagan', 'Housing', 0.45, 10_000, 14), stats: { approval: 1 } }],
    ['Decline', 'The state should build its own.', 'The conglomerate goes to the provinces instead.', {}],
  ]),

  quick('o1_senate_roro', [31, 35], 'economy', 'Endorso: Mga Pantalan ng Ro-Ro', 'Senate', [
    'A bloc of senators from the islands pushes for twelve roll-on/roll-off ports, run by the Ports Authority. Trucks could cross the archipelago by sea.',
  ], [
    ['Build them: ₱18B', 'Port fees and cheaper food.', 'The first ports open within a year.', { spend: 18, spendLabel: 'Ro-ro ports', asset: invest('o1_roro', 'Ro-ro port network fees', 'tacloban', 'Ports', 1.7, 6_000, 14), stats: { inflation: -0.15, cohesion: 2 } }],
    ['Build six: ₱9B', 'Half the plan.', 'Six ports open.', { spend: 9, spendLabel: 'Ro-ro ports (half)', asset: invest('o1_roro_half', 'Ro-ro port network fees (six ports)', 'tacloban', 'Ports', 0.8, 3_000, 12), stats: { inflation: -0.05 } }],
    ['Decline', 'No money.', 'The senators vote against your next bill.', { stats: { cohesion: -3 } }],
  ]),

  // ─── When investments go wrong ───
  quick('o1_fiber_overrun', [24, 34], 'scandal', 'Lumobo ang Gastos', 'Fiber backbone site', [
    'The fiber backbone is ₱8B over budget. The contractor blames inflation; auditors suspect padding. Carriers say they will not pay the agreed rent until it is finished.',
  ], [
    ['Pay the ₱8B and finish it', 'Protect the investment.', 'The backbone is completed.', { spend: 8, spendLabel: 'Fiber backbone overrun' }],
    ['Refuse and sue the contractor', 'No blank checks.', 'Work stops for months. Rent is cut in half until it resumes.', { assetHit: { id: 'v1_fiber', factor: 0.5, months: 8, note: 'construction stopped by a lawsuit' }, stats: { corruption: -2 } }],
  ], { when: [{ resolved: 'v1_cab_ict_meeting', choice: 'v1_cab_ict_meeting_0' }] }),

  quick('o1_toll_default', [26, 35], 'economy', 'Ayaw Magbayad ng Operator', 'Northern expressway', [
    'The northern expressway operator stops paying the state its 5% share, claiming traffic is lower than promised. It wants the share cut to 2%.',
  ], [
    ['Accept 2%', 'Keep the road running.', 'The share is cut.', { assetHit: { id: 'v1_toll_north', factor: 0.4, note: 'share cut to 2%' } }],
    ['Take them to arbitration', 'A contract is a contract.', 'The case takes a year; payments stop meanwhile.', { assetHit: { id: 'v1_toll_north', factor: 0, months: 12, note: 'payments frozen during arbitration' }, stats: { investor: -1 } }],
  ], { when: [{ resolved: 'v1_cab_dpwh_ppp', choice: 'v1_cab_dpwh_ppp_0' }] }),

  quick('o1_factory_cancel', [14, 34], 'economy', 'Umatras ang Pabrika', 'Board of Investments', [
    'A foreign electronics maker cancels a ₱40B factory it had promised. Its letter cites corruption and “unpredictable policy”.',
  ], [
    ['Fly to its headquarters and plead: ₱1B in incentives', 'Try to save it.', 'They agree to a smaller plant.', { spend: 1, spendLabel: 'Factory rescue incentives', asset: invest('o1_factory_saved', 'Electronics plant (scaled down)', 'kapatagan', 'company', 0.3, 5_000, 8) }],
    ['Let it go', 'There will be others.', 'Headlines call it a vote of no confidence.', { stats: { investor: -4, growth: -0.1 } }],
  ], { when: [{ any: [{ stat: 'corruption', gte: 58 }, { stat: 'investor', lte: 42 }] }] }),

  quick('o1_haizhou_sanction', [20, 35], 'diplomacy', 'Galit ang Columbia', 'Columbian Embassy', [
    'Because of the Haizhou port, two Columbian firms freeze their Kapuluan plans. Columbia’s ambassador asks you to “reconsider your friends”.',
  ], [
    ['Give Columbia a naval visit at the same port', 'Balance the powers.', 'The firms unfreeze one project.', { stats: { sovereignty: 2, investor: 2 } }],
    ['Refuse to be lectured', 'We choose our partners.', 'The firms go to Indara.', { stats: { investor: -5, growth: -0.1 } }],
  ], { when: [{ flag: 'haizhou_port' }] }),
];

// ═══════════════════════════ CHAPTER 2 ═══════════════════════════
export const OFFERS_2: StoryEvent[] = [
  // ─── Start ───
  quick('o2_speaker_solar', [36, 39], 'congress', 'Endorso ng Speaker: Solar sa Lupang Idle', 'Batasan', [
    'The Speaker endorses solar farms on 5,000 hectares of idle state land, built by a private developer who pays rent and sells the power.',
  ], [
    ['Lease the land and take a 25% stake: ₱8B', 'Rent, dividends, and cheaper power.', 'The panels go up within a year.', { spend: 8, spendLabel: 'Solar farm stake', asset: invest('o2_solar', 'Solar farms on state land (rent and 25% stake)', 'kapatagan', 'Solar power', 1, 3_000, 10), stats: { inflation: -0.1, cohesion: 2 } }],
    ['Lease the land only', 'Rent without risk.', 'A modest rent comes in.', { asset: invest('o2_solar_rent', 'Solar farm land rent', 'kapatagan', 'Land lease', 0.4, 2_000, 8) }],
    ['Decline', 'Farmland first.', 'Farmers approve.', { stats: { tribes: 1 } }],
  ], { priority: 6 }),

  quick('o2_bank_offer', [37, 40], 'economy', 'Alok ng Bangko ng Estado', 'Land Bank-style state bank', [
    'The state development bank proposes lending ₱60B to provinces for markets, slaughterhouses, and bus terminals that repay from their own fees — with the bank earning interest.',
  ], [
    ['Recapitalize the bank with ₱15B', 'The bank lends, the Treasury earns dividends.', 'Provincial projects start sprouting.', { spend: 15, spendLabel: 'Development bank capital', asset: invest('o2_devbank', 'Development bank dividends', 'maynilad', 'State bank', 1.3, 8_000, 6), stats: { unemployment: -0.2 } }],
    ['Let it lend from its own capital', 'No new money.', 'A smaller program.', { asset: invest('o2_devbank_small', 'Development bank dividends (small)', 'maynilad', 'State bank', 0.5, 3_000, 6) }],
  ]),

  // ─── Middle ───
  quick('o2_governors_ports', [50, 54], 'economy', 'Endorso ng mga Gobernador: Daungan', 'League of Provinces', [
    'The League of Provinces endorses a fishing-and-cargo port in each of eight coastal provinces, managed by the Ports Authority.',
  ], [
    ['Build all eight: ₱16B', 'Fees and jobs along the coasts.', 'The ports open over two years.', { spend: 16, spendLabel: 'Provincial ports', asset: invest('o2_provports', 'Provincial port fees', 'tacloban', 'Ports', 1.5, 9_000, 18), stats: { cohesion: 3 } }],
    ['Build three in the best locations: ₱6B', 'Focus the money.', 'Three ports open.', { spend: 6, spendLabel: 'Provincial ports (three)', asset: invest('o2_provports3', 'Provincial port fees (three ports)', 'tacloban', 'Ports', 0.7, 3_000, 14) }],
    ['Decline', 'No money.', 'The governors grumble.', { stats: { cohesion: -2 } }],
  ]),

  quick('o2_tycoon_rail', [51, 56], 'economy', 'Alok ng Tycoon: Airport Express', 'Office of the President', [
    'A tycoon offers to build an airport express railway at no cost to the state — in exchange for a 35-year concession and the right to develop the stations.',
  ], [
    ['Accept, with 8% of revenue to the state', 'Free railway and a share.', 'Construction starts. The share will come in after it opens.', { asset: invest('o2_airport_express', 'Airport express (8% share)', 'maynilad', 'Railway concession', 1.4, 7_000, 24), stats: { growth: 0.1 } }, 'AIRPORT EXPRESS APPROVED'],
    ['Accept, but ask for 15%', 'Drive a harder bargain.', 'The tycoon may walk away.', { ...then('o2_tycoon_rail_answer', 2) }],
    ['Decline', 'Too long a concession.', 'The idea dies.', {}],
  ]),
  quick('o2_tycoon_rail_answer', null, 'economy', 'Sagot ng Tycoon', 'Office of the President', 'The tycoon replies to your counter-offer.', [['Read the reply', '', 'You read it.', {}]], {
    variants: [
      { when: [{ stat: 'investor', gte: 55 }], text: 'The tycoon agrees to 15%. The railway will earn the state nearly twice as much.' },
      { when: [{ stat: 'investor', lte: 54 }], text: 'The tycoon walks away. “The Kapuluan is not attractive enough to ask for that,” the tycoon tells reporters.' },
    ],
    choices: [
      { id: 'o2_tr_yes', label: 'Sign the deal', description: '15%.', when: [{ stat: 'investor', gte: 55 }], outcome: 'The deal is signed.', effects: { asset: invest('o2_airport_express', 'Airport express (15% share)', 'maynilad', 'Railway concession', 2.6, 7_000, 24) } },
      { id: 'o2_tr_no', label: 'Accept the loss', description: 'The tycoon turned you down.', when: [{ stat: 'investor', lte: 54 }], outcome: 'No railway.', effects: { stats: { investor: -2 } }, headline: 'TYCOON WALKS AWAY FROM AIRPORT RAIL' },
    ],
  }),

  // ─── End ───
  quick('o2_last_water', [64, 68], 'economy', 'Huling Alok: Planta ng Tubig', 'Office of the President', [
    'Before your term ends, a Nippara-backed consortium offers a sewage and water-treatment plant for Maynilad Bay, with the state holding 35%.',
  ], [
    ['Take the stake: ₱14B', 'Your successor inherits the income.', 'Construction begins. It will earn after you leave — and some before.', { spend: 14, spendLabel: 'Water treatment plant stake', asset: invest('o2_watertreat', 'Maynilad Bay water treatment (35% state)', 'maynilad', 'Water utility', 1.3, 4_000, 6), stats: { approval: 1 } }],
    ['Leave it to your successor', 'Not your decision anymore.', 'The offer waits.', {}],
  ]),

  quick('o2_sell_stakes', [66, 70], 'economy', 'Ibenta ang mga Stake?', 'Department of Finance', [
    '{sec:finance} suggests selling some of the state’s investments before you leave, to show a smaller deficit.',
  ], [
    ['Sell ₱40B worth of stakes', 'A healthy-looking Treasury.', 'The books look better; future income falls.', { income: 40, spendLabel: 'Sale of state stakes', stats: { investor: 1 } }],
    ['Keep them', 'They earn for the next generation.', 'The next President inherits a portfolio.', { stats: { investor: 2 } }],
  ]),

  // ─── When investments go wrong ───
  quick('o2_swf_crash', [48, 66], 'economy', 'Bumagsak ang Merkado', 'Kapuluan Sovereign Fund', [
    'Global markets crash. The sovereign fund loses 18% of its value, and senators demand to know who approved it.',
  ], [
    ['Hold on and wait for recovery', 'Markets come back.', 'Returns are cut for a year.', { assetHit: { id: 'v2_swf', factor: 0.2, months: 12, note: 'market crash' }, stats: { approval: -1 } }],
    ['Sell and cut losses', 'Stop the bleeding.', 'The fund is closed. ₱38B comes back to the Treasury.', { assetHit: { id: 'v2_swf', factor: 0, note: 'fund liquidated after the crash' }, income: 38, spendLabel: 'Sovereign fund liquidation', stats: { investor: -2 } }],
  ], { when: [{ resolved: 'v2_cab_midterm_money', choice: 'v2_cab_midterm_money_0' }] }),

  quick('o2_chip_freeze', [48, 68], 'diplomacy', 'Umatras ang Chip Plant?', 'Columbian Embassy', [
    'The Columbian chipmaker threatens to leave. It cites West Sea tension, corruption, and power outages.',
  ], [
    ['Offer ₱5B in power guarantees', 'Keep them.', 'They stay — for now.', { spend: 5, spendLabel: 'Chip plant power guarantee', stats: { investor: 2 } }],
    ['Let them go', 'We will not be blackmailed.', 'The plant closes. 22,000 jobs are lost.', { assetHit: { id: 'v2_chip_plant', factor: 0, note: 'the company left the country' }, stats: { unemployment: 0.3, investor: -5, approval: -3 } }, 'CHIPMAKER LEAVES'],
  ], { when: [{ resolved: 'v2_ally_columbia_chips', choice: 'v2_ally_columbia_chips_0' }, { any: [{ stat: 'sovereignty', gte: 70 }, { stat: 'corruption', gte: 55 }, { stat: 'investor', lte: 45 }] }] }),

  quick('o2_airport_collapse', [54, 70], 'economy', 'Nalugi ang Operator', 'Maynilad airport', [
    'The airport operator’s parent company files for bankruptcy abroad. Payments to the state stop.',
  ], [
    ['Take the airport back: ₱10B', 'Run it ourselves.', 'The state runs the airport at lower income.', { spend: 10, spendLabel: 'Airport takeover', assetHit: { id: 'v2_airport_share', factor: 0.6, note: 'taken back and run by the state' } }],
    ['Find a new operator', 'Months without income.', 'Payments stop until a new operator is found.', { assetHit: { id: 'v2_airport_share', factor: 0, months: 10, note: 'no operator' } }],
  ], { when: [{ resolved: 'v2_cab_airport_meeting', choice: 'v2_cab_airport_meeting_0' }, { chance: 0.5, key: 'airport_collapse' }] }),

  quick('o2_investor_flight', [44, 68], 'economy', 'Umaalis ang mga Mamumuhunan', 'Board of Investments', [
    'Three foreign firms announce they are shrinking their Kapuluan operations. Foreign investment falls 30% this year.',
  ], [
    ['A package of reforms: faster permits, anti-graft courts', 'Win them back slowly.', 'Confidence steadies.', { spend: 3, spendLabel: 'Investment reforms', stats: { investor: 4, corruption: -2 } }],
    ['Blame the opposition', 'It is politics.', 'The firms keep leaving.', { stats: { investor: -3, growth: -0.2, unemployment: 0.2 } }],
  ], { when: [{ any: [{ stat: 'investor', lte: 40 }, { stat: 'corruption', gte: 62 }] }] }),
];
