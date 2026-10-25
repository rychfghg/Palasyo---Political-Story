import type { StoryEvent } from '@/features/narrative/types/event';
import { quick, later as then } from './helpers';

/** Chapter 1 extras: calamities that strain the budget, investigations old and new, and income-generating investments. */
export const EXTRA_1: StoryEvent[] = [
  // ═════════════ CALAMITIES ═════════════
  quick('cal1_twin_typhoons', [2, 8], 'calamity', 'Kambal na Bagyo', 'Bikolandia and Silangang Visara', 'Two typhoons in ten days. Roads are cut, 80,000 homes destroyed, and the calamity fund is empty.', [
    ['Supplemental budget for relief and rebuilding: ₱35B', 'Borrow if needed.', 'Aid flows; the deficit widens.', { spend: 35, spendLabel: 'Twin typhoons response', stats: { approval: 4 } }],
    ['Realign ₱20B from infrastructure', 'No new borrowing.', 'Relief comes at the cost of delayed roads.', { spend: 20, spendLabel: 'Twin typhoons response (realigned)', stats: { growth: -0.2, approval: 2 } }],
    ['Minimum relief: ₱8B', 'Protect the budget.', 'Evacuees wait weeks.', { spend: 8, spendLabel: 'Twin typhoons response', stats: { approval: -5, protest: 5 } }],
  ], { priority: 8 }),
  quick('cal1_landslide', [10, 22], 'calamity', 'Guho sa Minahan', 'Hilagang Mindara', 'Heavy rains trigger a landslide at an illegal gold-mining village. 120 missing.', [
    ['Full rescue and a crackdown on illegal mines', '₱6B.', 'Rescuers work for two weeks. Illegal mines are shut.', { spend: 6, spendLabel: 'Landslide response', stats: { approval: 2, tribes: 2 } }],
    ['Rescue only', 'The mines are the livelihood.', 'The mines reopen within months.', { spend: 3, spendLabel: 'Landslide rescue' }],
  ]),
  quick('cal1_oil_spill', [14, 28], 'calamity', 'Tumagas ang Langis', 'Iloilanan coast', 'A tanker sinks, spilling 800,000 liters of oil along 200 km of coast. Fishing is banned; 30,000 families lose income.', [
    ['Cleanup plus cash aid, and sue the owners', '₱9B now, recovered later.', 'The coast is cleaned; the owners eventually pay ₱6B.', { spend: 9, spendLabel: 'Oil spill cleanup', income: 6, stats: { approval: 3 } }],
    ['Let the ship owners handle it', 'Their responsibility.', 'The owners stall; fishermen go hungry.', { stats: { approval: -4, protest: 4 } }],
  ]),
  quick('cal1_dengue_floods', [20, 32], 'calamity', 'Baha at Dengue', 'Maynilad', 'Floods followed by a dengue outbreak overwhelm hospitals in Maynilad.', [
    ['Emergency hospital funding: ₱7B', 'Save lives.', 'The outbreak peaks and fades.', { spend: 7, spendLabel: 'Flood and dengue response', stats: { approval: 2 } }],
    ['Standard response', 'Budget is tight.', '400 deaths. Doctors blame the budget.', { stats: { approval: -4 } }],
  ]),

  // ═════════════ INVESTIGATIONS: THE FORMER ADMINISTRATION ═════════════
  quick('probe1_delapaz_flood', [6, 14], 'scandal', 'Ang Flood Control ni Dela Paz', 'Commission on Audit', 'Auditors find ₱60B in Dela Paz-era flood-control projects that were paid for but never built. The contractors are still getting government work — some under your administration.', [
    ['Blacklist the contractors and file charges', 'Past and present.', 'Twelve contractors are blacklisted; three of your own projects stall.', { stats: { corruption: -4, growth: -0.1, approval: 3 }, ...then('probe1_delapaz_flood_money', 4) }],
    ['Charge only the old officials', 'Keep current projects moving.', 'The same contractors keep working for you.', { stats: { corruption: 2 } }],
  ]),
  quick('probe1_delapaz_flood_money', null, 'economy', 'Nabawing Pera', 'Anti-Money Laundering Council', 'Investigators freeze the flood-control contractors’ accounts. ₱18B can be recovered.', [
    ['Use the recovered money to finish real flood control', 'Build what was stolen.', 'Real dikes rise where ghost ones stood.', { income: 18, spendLabel: 'Recovered flood-control funds', project: { id: 'real_flood_control', name: 'Real flood control', region: 'Gitnang Kapatagan', cost: 18, months: 18 }, stats: { approval: 3 } }],
    ['Put it toward the debt', 'Close the books.', 'A small dent in the debt.', { debt: -18 }],
  ]),
  quick('probe1_confidential', [16, 26], 'scandal', 'Ang Lihim na Pondo ng Nakaraan', 'House Committee on Good Government', 'A House committee subpoenas the Dela Paz Palasyo’s ₱40B in confidential funds. Former officials refuse to appear.', [
    ['Back the subpoena — have the police bring them in', 'Enforce it.', 'Former officials are escorted to the hearing. The PBL calls it harassment.', { stats: { approval: 3, cohesion: -4 }, houseShift: -3 }],
    ['Stay neutral', 'It is Congress’s business.', 'The hearings fizzle.', {}],
  ]),

  // ═════════════ INVESTIGATIONS: YOUR OWN GOVERNMENT ═════════════
  quick('probe1_own_secretary', [12, 24], 'scandal', 'Imbestigasyon sa Kalihim', 'Office of the Ombudsman', 'The Ombudsman opens a graft investigation into your Health Secretary, {sec:health}, over a ₱6B medicine contract.', [
    ['Suspend the Secretary pending investigation', 'Let the process work.', 'New candidates for the post are already being floated.', { fireCabinet: 'health', stats: { corruption: -2, approval: 2 } }],
    ['Defend the Secretary', 'Presumption of innocence.', 'The investigation grows.', { stats: { ombudsman: 8, media: 5 } }],
  ]),
  quick('probe1_agri_secretary', [18, 30], 'scandal', 'Ang Kalihim ng Agrikultura', 'Senate Committee on Agriculture', 'Senators accuse your Agriculture Secretary, {sec:agriculture}, of approving import permits for a rice cartel.', [
    ['Ask for the Secretary’s resignation', 'Clean house.', 'The Secretary resigns; three candidates for the post emerge.', { fireCabinet: 'agriculture', stats: { corruption: -3 } }],
    ['Stand by the Secretary', 'Loyalty.', 'The cartel keeps its permits.', { stats: { corruption: 4, inflation: 0.2 } }],
  ]),

  // ═════════════ INCOME-GENERATING INVESTMENTS ═════════════
  quick('inc1_toll_concession', [8, 20], 'economy', 'Konsesyon ng Toll', 'Public Works', 'A consortium offers ₱120B upfront for a 30-year concession on three government-built expressways.', [
    ['Take the upfront payment and cut debt', '₱120B now.', 'Debt falls; motorists will pay higher tolls for decades.', { debt: -120, stats: { investor: 4, inflation: 0.1 } }, '₱120B EXPRESSWAY DEAL CUTS DEBT'],
    ['Keep them public and collect tolls yourself', 'Steady income.', 'The government earns about ₱9B a year from tolls.', { taxRate: 0.03 }],
  ]),
  quick('inc1_airport_fees', [12, 26], 'economy', 'Paliparan', 'Maynilad International Airport', 'The airport handles 50 million passengers a year. A private operator offers to run it — paying the government ₱30B upfront plus 30% of revenue.', [
    ['Privatize the operation', 'Upfront cash and better service.', 'The terminals improve; the government earns a steady share.', { income: 30, spendLabel: 'Airport concession', taxRate: 0.04, stats: { investor: 4 } }],
    ['Keep it public', 'A national asset.', 'The airport stays congested.', {}],
  ]),
  quick('inc1_ecozone_rent', [10, 30], 'economy', 'Economic Zone ng Gobyerno', 'Gitnang Kapatagan', 'Idle government land beside the expressway could become an industrial estate — leased to factories, earning rent and creating 40,000 jobs.', [
    ['Build it: ₱15B', 'Jobs and rent.', 'Factories sign leases within a year.', { spend: 15, spendLabel: 'Government industrial estate', taxRate: 0.06, stats: { unemployment: -0.3, growth: 0.2 } }, 'GOVERNMENT ESTATE TO HOST 40,000 JOBS'],
    ['Sell the land to developers instead', 'Cash now.', '₱25B for the Treasury.', { income: 25, spendLabel: 'Land sale' }],
  ]),
  quick('inc1_lottery', [6, 22], 'economy', 'Ang Lotto', 'Charity Sweepstakes', 'Modernizing the national lottery with online draws could double its ₱25B annual contribution to health programs.', [
    ['Modernize it', 'More money for health.', 'Revenue doubles; critics worry about gambling addiction.', { taxRate: 0.07, stats: { church: -2 } }],
    ['Leave it as is', 'Avoid promoting gambling.', 'Nothing changes.', {}],
  ]),
  quick('inc1_bpo_parks', [4, 18], 'economy', 'IT Parks sa Probinsya', 'Information Technology Department', 'The call-center industry wants to expand to provincial cities — if the government builds IT parks with fiber and backup power.', [
    ['Build six provincial IT parks: ₱18B', 'Jobs outside Maynilad.', '60,000 jobs in provincial cities within two years.', { spend: 18, spendLabel: 'Provincial IT parks', taxRate: 0.06, stats: { unemployment: -0.4, growth: 0.2 } }],
    ['Let the private sector do it', 'No public money.', 'The firms stay in Maynilad.', {}],
  ]),
  quick('inc1_geothermal', [16, 30], 'economy', 'Geothermal', 'Bikolandia', 'The volcano belt could generate cheap geothermal power. A state venture would sell electricity to the grid.', [
    ['Build a state geothermal plant: ₱20B', 'Cheap, clean power — and profits.', 'Power prices fall; the plant earns ₱3B a year.', { spend: 20, spendLabel: 'Geothermal plant', taxRate: 0.01, stats: { inflation: -0.3 } }],
    ['License private developers', 'No public risk.', 'Private developers take the profits; prices fall a little.', { stats: { inflation: -0.1, investor: 2 } }],
  ]),
];
