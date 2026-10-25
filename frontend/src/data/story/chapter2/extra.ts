import type { StoryEvent } from '@/features/narrative/types/event';
import { quick, then } from '../chapter1/helpers';

/** Chapter 2 extras: more calamities, deeper investigations, and money-making investments to boom — or bust. */
export const EXTRA_2: StoryEvent[] = [
  // ═════════════ CALAMITIES ═════════════
  quick('cal2_supertyphoon', [37, 43], 'calamity', 'Super Bagyong Rosing', 'Visara', 'The strongest typhoon in a decade: 1,100 dead, ₱180B in damage. The budget has no room left.', [
    ['A ₱80B supplemental budget', 'Rebuild fast.', 'Rebuilding begins. The deficit balloons.', { spend: 80, spendLabel: 'Super Typhoon Rosing', stats: { approval: 5 } }],
    ['Seek foreign disaster loans', 'Cheap, long-term money.', 'Allies lend ₱60B at low rates.', { income: 60, spendLabel: 'Disaster loans', debt: 60, spend: 60, stats: { approval: 3 } }],
    ['Rebuild slowly with existing funds', 'Protect the budget.', 'Survivors live in tents for a year.', { spend: 20, spendLabel: 'Super Typhoon Rosing', stats: { approval: -6, protest: 8 } }],
  ], { priority: 8 }),
  quick('cal2_drought_fire', [46, 56], 'calamity', 'Sunog sa Kagubatan', 'Hilagang Luzara', 'Drought-fueled forest fires burn for three weeks. Farms and villages are destroyed.', [
    ['Fund firefighting aircraft and relief: ₱10B', 'Fight it.', 'The fires are contained.', { spend: 10, spendLabel: 'Forest fire response', stats: { approval: 2 } }],
    ['Local response', 'Governors lead.', 'Thousands of hectares are lost.', { stats: { approval: -3, growth: -0.1 } }],
  ]),
  quick('cal2_tsunami_scare', [56, 66], 'calamity', 'Babala ng Tsunami', 'Eastern seaboard', 'An offshore earthquake triggers a tsunami that hits three coastal towns. 240 dead.', [
    ['Rebuild with a coastal early-warning system: ₱15B', 'Prevent the next one.', 'Sirens and evacuation routes for 500 towns.', { spend: 15, spendLabel: 'Tsunami response and warning system', stats: { approval: 3 } }],
    ['Relief only', 'Budget constraints.', 'The next tsunami will find the same towns unprepared.', { spend: 5, spendLabel: 'Tsunami relief' }],
  ]),

  // ═════════════ INVESTIGATIONS ═════════════
  quick('probe2_delapaz_trial', [38, 50], 'court', 'Paglilitis kay Dela Paz', 'Sandiganbayan', 'The plunder trial of former President Dela Paz reaches its climax. A former aide testifies that some of the stolen money was used to buy congressmen — including members of your coalition.', [
    ['Let the testimony play out', 'Justice, wherever it leads.', 'Three of your allies are named. Your credibility rises; your coalition shrinks.', { stats: { corruption: -4, approval: 3, cohesion: -5 }, houseShift: -5 }],
    ['Quietly ask prosecutors to limit the scope', 'Protect your allies.', 'The scope narrows — and a prosecutor resigns in protest.', { stats: { corruption: 4, ombudsman: 8 }, flags: { ch2_cover_up: true } }],
  ], { when: [{ any: [{ flag: 'delapaz_arrested' }, { flag: 'witness_protected' }] }] }),
  quick('probe2_ombudsman_cabinet', [40, 56], 'scandal', 'Tatlong Kalihim sa Imbestigasyon', 'Office of the Ombudsman', 'The Ombudsman files graft charges against your Transportation, Energy, and Trade Secretaries over rigged contracts.', [
    ['Replace all three', 'Clean slate.', 'New candidates emerge for all three posts.', { fireCabinet: 'transportation', stats: { corruption: -3, cabinetCohesion: -6 }, ...then('probe2_second_firing', 0) }],
    ['Defend them', 'The charges are political.', 'The Ombudsman adds obstruction concerns about the Palasyo.', { stats: { ombudsman: 12, media: 6 } }],
  ]),
  quick('probe2_second_firing', null, 'cabinet', 'Balasahan ng Ekonomiya', 'Cabinet Room', 'With the Transportation Secretary gone, the Energy and Trade Secretaries wait for your decision.', [
    ['Replace them too', 'All three.', 'A full reset of the economic cluster.', { fireCabinet: 'energy', stats: { corruption: -2 } }],
    ['Keep them until the charges are proven', 'Due process.', 'The Ombudsman continues its work.', {}],
  ]),
  quick('probe2_coa_palasyo', [48, 62], 'scandal', 'COA sa Palasyo', 'Commission on Audit', 'The Commission on Audit flags ₱3.2B in the Office of the President’s own spending — travel, events, and “intelligence operations” with no receipts.', [
    ['Publish every receipt', 'Transparency.', 'Most items are explained; ₱400M is not.', { stats: { media: -4, ombudsman: 3 } }],
    ['Refuse — executive privilege', 'The Palasyo is not a department.', 'The refusal becomes the scandal.', { stats: { ombudsman: 12, approval: -4 }, flags: { ch2_cover_up: true } }],
  ]),

  // ═════════════ MONEY-MAKING INVESTMENTS ═════════════
  quick('inc2_sovereign_stakes', [37, 50], 'economy', 'Puhunan ng Gobyerno', 'Department of Finance', 'The Treasury can buy minority stakes in the new power plants and ports built by foreign investors — earning dividends for decades.', [
    ['Buy stakes worth ₱40B', 'Own a piece of the boom.', 'Dividends start flowing within a year.', { spend: 40, spendLabel: 'State equity stakes', taxRate: 0.12, stats: { investor: 2 } }],
    ['Stay out', 'Keep the cash.', 'Foreign owners keep all the profits.', {}],
  ]),
  quick('inc2_infra_bonds', [40, 58], 'economy', 'Bono para sa Imprastruktura', 'Bureau of the Treasury', 'Retail “infrastructure bonds” tied to specific toll roads and ports: citizens lend, the projects repay from their own revenue.', [
    ['Issue ₱100B in project bonds', 'Self-financing infrastructure.', 'Projects are built without touching the budget; the tolls repay the bonds.', { stats: { growth: 0.4, unemployment: -0.3, investor: 3 } }],
    ['No new bonds', 'Avoid more debt.', 'Projects wait.', {}],
  ]),
  quick('inc2_tourism_levy', [42, 60], 'economy', 'Bayad ng Turista', 'Tourism Department', 'A ₱1,000 tourism levy on every foreign arrival could raise ₱12B a year for conservation and local roads.', [
    ['Impose the levy', 'Visitors pay for what they enjoy.', 'Revenue flows; arrivals dip slightly.', { taxRate: 0.04, stats: { growth: -0.05 } }],
    ['No levy', 'Keep tourism cheap.', 'Arrivals keep growing.', { stats: { growth: 0.05 } }],
  ]),
  quick('inc2_mining_royalty_fund', [44, 62], 'economy', 'Pondo mula sa Mina', 'Finance Department', 'Nickel prices are at a record high. A windfall royalty on mining exports could raise ₱40B — or drive mining firms to cut investment.', [
    ['Impose a temporary windfall royalty', 'Share the boom.', '₱40B for the Treasury.', { income: 40, spendLabel: 'Mining windfall royalty', stats: { investor: -3 } }],
    ['Keep royalties stable', 'Predictability for investors.', 'Mining investment grows.', { stats: { investor: 3, growth: 0.1 } }],
  ]),
  quick('inc2_export_boom', [48, 66], 'economy', 'Boom ng Eksport', 'Trade Department', 'Electronics and processed-food exports hit a record. Exporters ask for help to go further: an export credit agency.', [
    ['Create an export credit agency: ₱10B', 'Double down.', 'Exports keep climbing; so does revenue.', { spend: 10, spendLabel: 'Export credit agency', taxRate: 0.06, stats: { growth: 0.3, unemployment: -0.2 } }, 'RECORD EXPORTS'],
    ['Let the boom run on its own', 'No new spending.', 'The boom slows as neighbors compete.', {}],
  ]),
  quick('inc2_doom_investment', [50, 64], 'economy', 'Ang Mapanganib na Puhunan', 'Pondo ng Bayan / State banks', 'A charismatic investor pitches a ₱150B “smart city” in Maynilad Bay, asking the state banks to finance half. Returns could be spectacular — or the whole thing could collapse.', [
    ['Finance it', 'Bet big.', 'Construction starts. Your advisers are split on whether it is genius or a bubble.', { spend: 75, spendLabel: 'Smart city financing', ...then('inc2_doom_outcome', 8) }],
    ['Decline', 'Too risky.', 'The investor goes to Indara.', {}],
  ]),
  quick('inc2_doom_outcome', null, 'economy', 'Ang Resulta', 'Maynilad Bay', 'The smart city’s fate is decided by the market.', [
    ['See what happened', '', 'You read the report.', {}],
  ], {
    variants: [
      { when: [{ stat: 'investor', gte: 55 }], text: 'It works: tenants flock in, and the state banks earn a handsome return.' },
      { when: [{ stat: 'investor', lte: 54 }], text: 'It collapses: tenants never came, and the state banks are left with ₱75B in bad loans.' },
    ],
    choices: [
      { id: 'inc2_do_boom', label: 'Collect the returns', description: 'A win.', when: [{ stat: 'investor', gte: 55 }], outcome: 'The Treasury earns ₱40B, and the smart city becomes a symbol of the boom.', effects: { income: 40, spendLabel: 'Smart city returns', taxRate: 0.05, stats: { approval: 3, growth: 0.3 } }, headline: 'MAYNILAD BAY SMART CITY A HIT' },
      { id: 'inc2_do_bust', label: 'Recapitalize the state banks', description: 'Clean up the mess.', when: [{ stat: 'investor', lte: 54 }], outcome: 'The banks survive; the Treasury absorbs the loss.', effects: { spend: 60, spendLabel: 'State bank recapitalization', stats: { approval: -4, investor: -4 } }, headline: '₱75B SMART CITY FLOP' },
    ],
  }),
];
