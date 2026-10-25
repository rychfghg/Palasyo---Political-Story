import type { StoryEvent } from '@/features/narrative/types/event';
import { billEvent, quick, later as then } from './helpers';

/**
 * Chapter 1 story arcs: every first decision schedules what comes next.
 * Events with `null` timing only appear when an earlier choice leads to them.
 */
export const ARCS_1: StoryEvent[] = [
  // ═════════════ DEBT: pay it down, or borrow to build ═════════════
  quick('arc_debt_due', [3, 6], 'economy', 'Ang Bayarin', 'Bureau of the Treasury', [
    'The Treasury warns that ₱600B of Dela Paz-era loans fall due this year. You can pay them aggressively, refinance, or split the difference.',
    'What you choose will shape the next three years.',
  ], [
    ['Pay aggressively: cut spending by ₱150B', 'Shrink the debt, whatever it costs.', 'Debt falls. Hospitals and road projects are delayed. Unions call it “austerity for the poor.”', { debt: -150, budgetChange: -150, stats: { investor: 8, approval: -4, growth: -0.3 }, flags: { debt_path: 'austerity' }, ...then('arc_debt_anger', 3) }, '₱150B CUT TO PAY DELA PAZ DEBTS'],
    ['Refinance everything and keep spending', 'Development first.', 'The bonds roll over. Interest costs creep up.', { debt: 40, stats: { growth: 0.2, investor: -3 }, flags: { debt_path: 'borrow' }, ...then('arc_debt_rates', 4) }],
    ['Pay half, refinance half', 'A balanced path.', 'Neither side is thrilled. The numbers slowly improve.', { debt: -60, budgetChange: -50, stats: { investor: 3 }, flags: { debt_path: 'balanced' }, ...then('arc_debt_steady', 6) }],
  ], { priority: 7 }),
  quick('arc_debt_anger', null, 'society', 'Galit sa Pagtitipid', 'Public hospitals and schools', 'Austerity bites: a provincial hospital closes a ward, and a viral video shows students in a flooded, unrepaired classroom.', [
    ['Hold the line — the pain is temporary', 'Stay the course.', 'The anger simmers. The debt keeps falling.', { stats: { approval: -3, protest: 6 }, ...then('arc_debt_payoff', 6) }],
    ['Restore hospital and school funds', 'Protect the essentials.', 'The anger eases. Some of the savings are lost.', { spend: 40, spendLabel: 'Restored essential services', stats: { approval: 3, investor: -2 }, ...then('arc_debt_steady', 5) }],
  ]),
  quick('arc_debt_payoff', null, 'economy', 'Bunga ng Pagtitipid', 'Rating agencies', 'The discipline pays off: the rating outlook is raised to positive, interest costs fall, and investors return.', [
    ['Use the savings to restore services', 'Share the reward.', 'Services return — funded now by lower interest costs.', { stats: { approval: 5, investor: 4 }, debt: -40 }, 'KAPULUAN OUTLOOK RAISED TO POSITIVE'],
    ['Keep cutting the debt', 'Even more discipline.', 'Debt falls faster. Patience wears thin.', { debt: -80, stats: { investor: 6, approval: -2 } }],
  ]),
  quick('arc_debt_rates', null, 'economy', 'Tumaas ang Interes', 'Bond market', 'Investors demand higher yields on Kapuluan bonds. Interest payments are rising faster than revenue.', [
    ['Announce a fiscal-discipline plan now', 'Change course.', 'Markets calm, slowly.', { budgetChange: -80, stats: { investor: 5, approval: -2 }, ...then('arc_debt_steady', 5) }],
    ['Keep borrowing — growth will fix it', 'Stay the course.', 'The bill arrives later — with interest.', { debt: 60, stats: { investor: -5, inflation: 0.3 }, flags: { debt_spiral_risk: true } }],
  ]),
  quick('arc_debt_steady', null, 'economy', 'Dahan-dahang Pagbuti', 'Department of Finance', 'Debt ratios have stopped rising. Revenue is catching up with spending.', [
    ['Stay balanced', 'Slow and steady.', 'Quiet progress.', { stats: { investor: 3 }, debt: -20 }],
  ]),

  // ═════════════ INFLATION: shock, fight, recovery, and relapse ═════════════
  quick('arc_fuel_shock', [6, 10], 'economy', 'Tumaas ang Presyo ng Langis', 'Energy cluster', 'Global oil jumps 40%. Fuel, fares, electricity, and food prices follow. Inflation is heading toward 7%.', [
    ['Subsidize fuel for everyone: ₱60B', 'Stop the price spike now.', 'Prices at the pump freeze. The subsidy bill is enormous.', { spend: 60, spendLabel: 'Universal fuel subsidy', stats: { inflation: -0.8, approval: 4 }, ...then('arc_currency_fall', 3) }],
    ['Targeted aid only; let prices adjust', 'Help the poorest, let markets work.', 'Prices rise; drivers and farmers get cash cards.', { spend: 12, spendLabel: 'Targeted fuel aid', stats: { inflation: 0.6, approval: -2 }, ...then('arc_cb_tension', 2) }],
    ['Cut fuel taxes temporarily', 'Lower prices, lower revenue.', 'Prices ease. The tax bureau loses ₱70B.', { taxRate: -0.25, stats: { inflation: -0.5, approval: 2 }, ...then('arc_cb_tension', 3) }],
  ], { priority: 7 }),
  quick('arc_currency_fall', null, 'economy', 'Bumabagsak ang Piso', 'Foreign exchange markets', 'Markets worry about the fuel subsidy. The peso falls 9% — making every import, from oil to rice, more expensive.', [
    ['Defend the peso with reserves', 'Stop the slide.', 'The peso steadies. Reserves shrink.', { stats: { inflation: -0.3, investor: 2 }, ...then('arc_cb_tension', 2) }],
    ['Let it fall — exports will benefit', 'A weaker peso helps exporters and OFW families.', 'OFW families cheer; import prices surge.', { stats: { inflation: 0.8, growth: 0.2 }, ...then('arc_cb_tension', 2) }],
  ]),
  quick('arc_cb_tension', null, 'economy', 'Palasyo vs. Bangko Sentral', 'Bangko Sentral ng Kapuluan', 'The central bank plans a big rate hike to crush inflation. Your economic team warns it will slow growth before the midterms. You cannot order the independent central bank — but you can pressure it.', [
    ['Respect its independence publicly', 'Let it fight inflation.', 'Rates rise. Growth slows — and inflation begins to fall.', { stats: { growth: -0.4, inflation: -0.8, investor: 5 }, ...then('arc_inflation_recovery', 5) }],
    ['Publicly pressure it to hold rates', 'Growth first.', 'The central bank holds — and markets lose faith in its independence.', { stats: { growth: 0.2, inflation: 0.6, investor: -6 }, ...then('arc_inflation_return', 5) }],
  ]),
  quick('arc_inflation_recovery', null, 'economy', 'Bumababa ang Bilihin', 'Wet markets and malls', 'Inflation is falling. Wages are outpacing prices for the first time in two years. Businesses announce new investments, and tax collections rise.', [
    ['Spend the extra revenue on projects', 'Build while the going is good.', 'New projects break ground. The recovery feels real.', { stats: { approval: 5, growth: 0.3, investor: 4 }, taxRate: 0.1, project: { id: 'recovery_projects', name: 'Recovery dividend projects', region: 'National', cost: 60, months: 18 } }, 'INFLATION FALLS; PRESIDENT’S APPROVAL RISES'],
    ['Save it: pay down debt and build a buffer', 'Prepare for the next storm.', 'Less excitement, more resilience.', { stats: { approval: 3, investor: 6 }, taxRate: 0.1, debt: -60, flags: { shock_buffer: true } }],
  ]),
  quick('arc_inflation_return', null, 'economy', 'Bumalik ang Implasyon', 'Statistics authority', 'Inflation is back above 6%. The central bank’s credibility was damaged, and it now has to hike even harder.', [
    ['Apologize and let the central bank act', 'Restore credibility.', 'Painful rate hikes follow. Inflation starts to fall again — slowly.', { stats: { inflation: -0.5, growth: -0.5, approval: -3, investor: 4 } }],
    ['Impose price controls', 'Fight it directly.', 'Shortages appear on shelves.', { stats: { inflation: -0.3, investor: -5, protest: 5, courtTension: 3 } }],
  ]),
  quick('arc_external_shock', [24, 30], 'economy', 'Dagok mula sa Labas', 'Global markets', 'A banking crisis in a major economy sends shockwaves worldwide. Exports fall, oil spikes again, and the recovery is threatened.', [
    ['Deploy the fiscal buffer you built', 'This is what it was for.', 'The Kapuluan rides out the storm better than its neighbors.', { stats: { inflation: -0.2, growth: 0.3, approval: 3 } }],
    ['Emergency stimulus: ₱80B', 'Borrow to protect jobs.', 'Jobs are protected. Debt rises again.', { spend: 80, spendLabel: 'Shock stimulus', stats: { growth: 0.4, inflation: 0.3 } }],
    ['Tighten belts and wait', 'Avoid new debt.', 'Unemployment rises; inflation creeps back.', { stats: { unemployment: 0.5, inflation: 0.4, approval: -3 } }],
  ], { priority: 7 }),

  // ═════════════ INFRASTRUCTURE: jobs, overruns, and ghosts ═════════════
  quick('arc_infra_program', [4, 8], 'economy', 'Buo ang Kapuluan', 'NEDA Board', 'Your planners present a national infrastructure program: expressways, airport modernization, seaports, provincial hospitals, and irrigation. The question is how big — and how to pay.', [
    ['Go big: ₱900B over six years, mostly borrowed', 'Transform the country.', '200,000 construction jobs. Debt climbs. Contractors multiply.', { project: { id: 'build_kapuluan', name: 'Buo ang Kapuluan infrastructure program', region: 'National', cost: 300, months: 36 }, debt: 150, stats: { growth: 0.8, unemployment: -0.5, corruption: 3 }, ...then('arc_cost_overrun', 8) }, '₱900B BUILD PROGRAM LAUNCHED'],
    ['Moderate: ₱400B, funded by the budget', 'Build what you can afford.', 'Steady construction, steady jobs.', { project: { id: 'build_kapuluan', name: 'Moderate infrastructure program', region: 'National', cost: 150, months: 36 }, stats: { growth: 0.4, unemployment: -0.3 }, ...then('arc_infra_jobs', 6) }],
    ['Public-private partnerships', 'Let private investors build and charge tolls.', 'Investors line up. So do toll booths.', { stats: { growth: 0.4, investor: 6 }, ...then('arc_ppp_tolls', 8) }],
  ], { priority: 7 }),
  quick('arc_cost_overrun', null, 'scandal', 'Lumobo ang Gastos', 'Public Works', 'Half the program is running 30–60% over budget. Contractors blame materials; auditors blame “change orders.”', [
    ['Pay the overruns to finish on time', '₱60B more.', 'Projects continue. So do the change orders.', { spend: 60, spendLabel: 'Infrastructure overruns', stats: { corruption: 3 }, ...then('arc_ghost_audit', 6) }],
    ['Freeze and renegotiate every contract', 'Stop the bleeding.', 'Projects stall for months; savings are real.', { stats: { growth: -0.3, corruption: -3 }, ...then('arc_ghost_audit', 8) }],
  ]),
  quick('arc_infra_jobs', null, 'economy', 'Trabaho sa Konstruksyon', 'Labor Department', 'The infrastructure program has created 120,000 jobs. Provincial economies are buzzing.', [
    ['Train workers for permanent jobs after construction', '₱3B.', 'A skilled workforce for the long term.', { spend: 3, spendLabel: 'Construction skills training', stats: { unemployment: -0.2, approval: 2 } }, '120,000 CONSTRUCTION JOBS'],
  ]),
  quick('arc_ppp_tolls', null, 'society', 'Mahal na Toll', 'Expressways', 'The new expressways are fast — and expensive. A toll hike triggers protests from truckers, who pass the cost to food prices.', [
    ['Subsidize tolls for trucks carrying food', '₱5B a year.', 'Food prices stay stable.', { program: { id: 'toll_subsidy', label: 'Food truck toll subsidy', monthly: 0.4, months: 60 }, stats: { inflation: -0.1 } }],
    ['Let tolls rise', 'The contracts are the contracts.', 'Food prices tick up; truckers protest.', { stats: { inflation: 0.3, protest: 4 } }],
  ]),
  quick('arc_ghost_audit', null, 'scandal', 'Mga Multong Proyekto', 'Commission on Audit', 'The Commission on Audit finds ₱38B in “completed” projects that do not exist. The trail leads to your Public Works Secretary, a governor, and nine legislators — six of them allies.', [
    ['Sacrifice them all', 'File every case.', 'Your coalition bleeds, but your credibility soars.', { fireCabinet: 'publicWorks', stats: { corruption: -7, cohesion: -10, approval: 6 }, houseShift: -9, flags: { infra_scandal: 'prosecuted' } }, 'PALASYO CHARGES OWN ALLIES OVER GHOST PROJECTS'],
    ['Prosecute only the officials, protect the legislators', 'Keep the coalition.', 'The officials go to court. The legislators remember they owe you.', { stats: { corruption: 2, cohesion: 4 }, flags: { infra_scandal: 'protected' } }],
    ['Dispute the audit', 'Call it a paperwork issue.', 'The audit becomes a scandal of its own.', { stats: { corruption: 6, ombudsman: 10, media: 8 }, flags: { infra_scandal: 'covered', obstruction: true } }],
  ], { priority: 8 }),

  // ═════════════ ANTI-SMUGGLING: revenue, popularity, and the fall ═════════════
  quick('arc_antismuggling', [9, 14], 'crisis', 'Giyera Laban sa Smuggling', 'Bureau of Customs', 'Smuggling costs ₱200B a year in lost revenue — and the tax bureau has its own “fixers.” You can launch an all-out campaign.', [
    ['All-out campaign: purge customs and the tax bureau', 'Take on the cartels.', 'Hundreds of officials are removed. Collections begin to rise.', { stats: { corruption: -5, capital: -5 }, taxRate: 0.2, ...then('arc_revenue_up', 5) }],
    ['A targeted campaign against the biggest syndicates', 'Focused.', 'Several kingpins are arrested. Smaller operators adapt.', { stats: { corruption: -2 }, taxRate: 0.08 }],
    ['Leave it to the bureaus', 'They know their work.', 'Smuggling continues.', { stats: { corruption: 2 } }],
  ]),
  quick('arc_revenue_up', null, 'economy', 'Lumaki ang Kita', 'Department of Finance', 'Revenue is up 14%. For the first time in a decade, the deficit is shrinking while spending grows. Investors notice.', [
    ['Announce it — and cut income taxes for workers', 'Share the gains.', 'Your approval surges.', { taxRate: -0.1, stats: { approval: 6, investor: 4 }, ...then('arc_peak', 4) }, 'REVENUE UP 14%: DEFICIT SHRINKING'],
    ['Use it to cut debt and fund schools', 'Invest the gains.', 'Debt falls; classrooms rise.', { debt: -80, stats: { approval: 4, investor: 6 }, ...then('arc_peak', 4) }],
  ]),
  quick('arc_peak', null, 'address', 'Sa Tuktok', 'Palasyo', 'Your approval is at its highest. Allies urge you to spend this political capital while you have it.', [
    ['Push your hardest reform now', 'Use the moment.', 'You spend your capital on a reform your allies hate.', { stats: { capital: -10, corruption: -3, cohesion: -5 }, ...then('arc_peak_scandal', 3) }],
    ['Reward your allies while you can', 'Loyalty pays.', 'Allies get their projects. Reporters start digging.', { stats: { cohesion: 8, corruption: 4 }, ...then('arc_peak_scandal', 3) }],
  ]),
  quick('arc_peak_scandal', null, 'scandal', 'Ang Pagbagsak mula sa Tuktok', 'Pahayagang Liwayway', 'At the height of your popularity, a scandal breaks: a Palasyo aide took ₱80M from a smuggler you had just arrested — to tip him off before the raid.', [
    ['Hand the aide over to the NBI immediately', 'No mercy.', 'The fall is short. The public sees you acted fast.', { stats: { approval: -3, corruption: -1 } }],
    ['Deny the aide was close to you', 'Distance.', 'Photos of the aide at your family dinners surface.', { stats: { approval: -8, media: 8 } }],
  ]),

  // ═════════════ A VETO — AND AN OVERRIDE ═════════════
  quick('arc_veto_fund', [12, 22], 'congress', 'Ang Pondo ng Kongreso', 'Your desk', 'Congress passes the Congressional Development Fund Act, giving every legislator ₱100M a year to spend in their districts — pork barrel by another name.', [
    ['Sign it', 'Keep Congress happy.', 'Congress is delighted. Watchdogs are not.', { stats: { cohesion: 10, corruption: 6 }, law: { id: 'cdf', name: 'Congressional Development Fund Act', summary: '₱100M a year per legislator.' } }],
    ['Veto it', 'No pork.', 'Congress immediately moves to override your veto.', { stats: { approval: 3, cohesion: -8 }, ...then('arc_veto_override', 1) }, 'PRESIDENT VETOES ₱30B PORK FUND'],
  ]),
  quick('arc_veto_override', null, 'congress', 'Override', 'Batasang Pambansa', 'Congress needs two-thirds of both chambers to override your veto: 211 representatives and 16 senators.', [
    ['Lobby hard to sustain the veto', 'Every vote counts.', 'The override vote is called.', { stats: { capital: -6 }, vote: { bill: 'Override of the veto on the Congressional Development Fund', appeal: 2, houseThreshold: 211, senateThreshold: 16, onPass: { law: { id: 'cdf', name: 'Congressional Development Fund Act (over the President’s veto)', summary: 'Enacted over your veto.' }, stats: { capital: -8, corruption: 5 } }, onFail: { stats: { capital: 8, approval: 3 } } } }],
    ['Let the chips fall', 'Your veto speaks for itself.', 'The override vote is called without your lobbying.', { vote: { bill: 'Override of the veto on the Congressional Development Fund', appeal: 3, houseThreshold: 211, senateThreshold: 16, onPass: { law: { id: 'cdf', name: 'Congressional Development Fund Act (over the President’s veto)', summary: 'Enacted over your veto.' }, stats: { capital: -10, corruption: 5 } }, onFail: { stats: { capital: 6 } } } }],
  ], { priority: 8 }),

  // ═════════════ THE LEAK — AND THE WRONG ACCUSATION ═════════════
  quick('arc_leak_found', [8, 14], 'cabinet', 'Natuklasan ang Tagas', 'Justice Secretary’s office', 'Your Justice Secretary, {sec:justice}, comes to you with a folder: “I found your leaker. It’s {traitor}.” The evidence is circumstantial — and the two have a long-running feud.', [
    ['Fire {traitor} on the spot', 'Trust your Justice Secretary.', '{traitor} is gone. Whether the leaks stop will tell you if it was the right call.', { fireCabinet: 'traitor', flags: { leak_accusation: 'acted' }, ...then('arc_leak_truth', 4) }],
    ['Order an independent investigation first', 'Evidence before action.', 'The NBI begins a quiet investigation.', { flags: { leak_accusation: 'investigated' }, ...then('arc_leak_truth', 3) }],
  ]),
  quick('arc_leak_truth', null, 'cabinet', 'Ang Katotohanan', 'NBI report', 'The investigation is complete.', [
    ['Read the report', 'Whatever it says.', 'The leaks were real, the accusation partly wrong: the documents came from a Justice Department aide — and the Justice Secretary knew. The feud was a cover.', { flags: { justice_sec_compromised: true }, stats: { cabinetCohesion: -5 }, ...then('arc_leak_resolution', 1) }],
  ]),
  quick('arc_leak_resolution', null, 'cabinet', 'Dalawang Taksil?', 'Palasyo', 'Your Justice Secretary covered for a leaker — to damage a rival in your own Cabinet.', [
    ['Fire the Justice Secretary', 'Clean house.', 'A second resignation in a month. The opposition mocks your “Cabinet of knives.”', { fireCabinet: 'justice', stats: { media: 5, cabinetCohesion: 4 } }],
    ['Keep them — but on a short leash', 'You know their secret now.', 'The Justice Secretary becomes very loyal. And very afraid.', { stats: { capital: 4 }, flags: { justice_sec_leverage: true } }],
  ]),

  // ═════════════ FAMILY & CRONIES ═════════════
  quick('arc_relative_contract', [10, 22], 'scandal', 'Kontrata ng Kamag-anak', 'Procurement records', 'A company owned by your cousin won ₱4.5B in school-building contracts — through bidding that lasted one day.', [
    ['Order an investigation of your own cousin', 'No special treatment.', 'The contracts are voided. Your family is furious.', { stats: { corruption: -3, family: -10, approval: 3 } }],
    ['Defend the bidding as legal', 'Protect the family.', 'The Senate opens an inquiry.', { stats: { family: 6, corruption: 5, ombudsman: 6 }, ...then('arc_relative_hearing', 4) }],
  ]),
  quick('arc_relative_hearing', null, 'congress', 'Kamag-anak sa Senado', 'Senate Blue Ribbon Committee', 'Your cousin testifies — and says the contracts were “arranged” by someone in the Palasyo.', [
    ['Throw your cousin under the bus', 'Cut your losses.', 'The family feud goes public.', { stats: { family: -15, approval: -2 } }],
    ['Stand by your cousin', 'Blood is thicker.', 'The Senate report names you as a “person of interest.”', { stats: { approval: -6, ombudsman: 10 }, flags: { impeachable_offense: true } }],
  ]),

  // ═════════════ CRIME & SECURITY ═════════════
  quick('arc_police_syndicate', [14, 24], 'crisis', 'Pulis sa Sindikato', 'National Police', 'Intelligence reports reveal a drug syndicate has infiltrated a regional police command — officers recycle seized drugs and sell them back.', [
    ['Purge the entire regional command', 'Replace 1,200 officers.', 'The command is rebuilt. Crime rises briefly during the transition.', { stats: { crime: 2, corruption: -4, military: -3 }, ...then('arc_police_after', 5) }],
    ['A quiet internal investigation', 'Avoid a scandal.', 'The syndicate learns of the investigation.', { stats: { crime: 3 } }],
  ]),
  quick('arc_police_after', null, 'crisis', 'Malinis na Kapulisan', 'National Police', 'Six months after the purge, crime in the region has fallen 30%. Other regions ask for the same reform.', [
    ['Extend the reform nationwide', '₱8B.', 'A cleaner police force — and a lot of angry retired generals.', { spend: 8, spendLabel: 'National police reform', stats: { crime: -5, military: -3, approval: 3 } }],
    ['Declare victory', 'Enough reform.', 'The other regions stay as they are.', { stats: { crime: -1 } }],
  ]),
  quick('arc_database_hack', [18, 26], 'crisis', 'Na-hack ang Gobyerno', 'Department of Information Technology', 'Hackers breach the national ID database — 80 million records — and post your own private information online: medical records, bank details, your children’s school.', [
    ['Blame a foreign state and retaliate diplomatically', 'Haizhou is suspected.', 'Diplomatic storm. The hackers are never caught.', { stats: { sovereignty: 5 } }],
    ['Fund a national cybersecurity agency: ₱6B', 'Fix the weakness.', 'Stronger defenses for the future.', { spend: 6, spendLabel: 'Cybersecurity agency', flags: { cyber_ready: true } }],
    ['Downplay the breach', 'Avoid panic.', 'Scammers use the leaked data for months.', { stats: { crime: 3, approval: -3 } }],
  ]),
  quick('arc_bombing', [20, 26], 'crisis', 'Pagsabog', 'A cathedral in Davira City', 'A bomb explodes during Sunday Mass in Davira City. 34 dead. An extremist group claims responsibility and promises more.', [
    ['Convene an emergency Cabinet meeting', 'Decide the response together.', 'Your Cabinet assembles within the hour.', { ...then('arc_ml_debate', 0) }],
  ], { priority: 9 }),
  quick('arc_ml_debate', null, 'cabinet', 'Batas Militar?', 'Cabinet Room, 2 a.m.', [
    'Your Defense Secretary wants martial law over Mindara. Your Justice Secretary warns: the Constitution allows it only for invasion or rebellion, for 60 days, and Congress and the Supreme Court will review it.',
  ], [
    ['Declare limited martial law in the province only', 'Narrow and time-bound.', 'Congress narrowly upholds it. The Supreme Court will review.', { stats: { crime: -3, military: 6, courtTension: 6, tribes: -4 }, flags: { limited_ml: true }, vote: { bill: 'Joint resolution on martial law in Davira province', appeal: 1, onFail: { stats: { capital: -6 } } }, ...then('arc_ml_outcome', 3) }],
    ['No martial law — a targeted counter-terror operation', 'Use ordinary law.', 'Special forces hunt the cell under civilian rule.', { spend: 5, spendLabel: 'Counter-terror operation', stats: { crime: -2, approval: 2, military: -2 }, ...then('arc_ml_outcome', 3) }],
    ['Martial law over all of Mindara', 'Overwhelming force.', 'Critics call it disproportionate. The Supreme Court receives six petitions.', { stats: { crime: -4, military: 8, courtTension: 12, tribes: -10, media: 8 }, flags: { martial_law_mindara: true }, ...then('arc_ml_outcome', 3) }],
  ], {
    variants: [
      { when: [{ vpAlly: true }], text: 'Vice President {vp} urges caution: “Limit it in time and place. The whole world is watching.”' },
      { when: [{ vpAlly: false }], text: 'The Vice President, not invited, tells reporters that martial law would be “the first step to dictatorship.”' },
    ],
    priority: 9,
  }),
  quick('arc_ml_outcome', null, 'crisis', 'Pagkatapos ng Pagsabog', 'Mindara', 'The bombers’ cell is dismantled. The question now is what the response left behind.', [
    ['Hold a public accounting of the operation', 'Transparency.', 'Some abuses come to light and are punished. Trust grows.', { stats: { courtTension: -4, church: 3, approval: 2 } }],
    ['Keep the details classified', 'Security first.', 'Rumors of abuses spread unchecked.', { stats: { media: 6, tribes: -3 } }],
  ]),

  // ═════════════ INVESTORS LEAVE — AND OTHERS ARRIVE ═════════════
  quick('arc_investor_exit', [20, 32], 'economy', 'Umatras ang Mamumuhunan', 'Board of Investments', 'A Columbian auto maker cancels a ₱60B plant, citing political instability and street protests.', [
    ['Court a replacement investor from the SSC', 'Diversify.', 'Talks begin with a Singhapura group.', { ...then('arc_replacement_investor', 3) }],
    ['Blame the opposition for scaring investors', 'Politics.', 'Investors see a government blaming others.', { stats: { investor: -4 } }],
  ], { when: [{ stat: 'protest', gte: 35 }] }),
  quick('arc_replacement_investor', null, 'economy', 'Bagong Mamumuhunan', 'Sugbu City', 'A Singhapura consortium takes over the abandoned site with a ₱70B electronics plant — bigger than the one lost.', [
    ['Sign — with local hiring rules', 'Jobs for Kapuluan workers.', '14,000 jobs.', { stats: { investor: 6, growth: 0.3, unemployment: -0.2 } }, 'SINGHAPURA GROUP REPLACES LOST INVESTMENT'],
  ]),

  // ═════════════ INVESTMENTS THAT MOVE PRICES — UP OR DOWN ═════════════
  quick('inv_food_terminal', [6, 18], 'economy', 'Food Terminal', 'Agriculture Department', 'Middlemen take up to half of what consumers pay for vegetables. A network of regional food terminals would connect farmers directly to markets.', [
    ['Build them with the budget: ₱25B', 'Cut out the middlemen.', 'Vegetable prices fall 15% within a year.', { project: { id: 'food_terminals', name: 'Regional food terminals', region: 'National', cost: 25, months: 18 }, stats: { inflation: -0.5, approval: 2 } }],
    ['Fund them by printing money through the state banks', 'Fast money.', 'The terminals get built — and the extra money pushes prices up elsewhere.', { stats: { inflation: 0.4, investor: -4 } }],
    ['Let private traders build them', 'No public money.', 'The same middlemen build them — and keep their margins.', { stats: { inflation: -0.1 } }],
  ]),
  quick('inv_lng_terminal', [10, 24], 'economy', 'LNG Terminal', 'Energy Department', 'With the old gas field running dry, power prices could spike. An LNG import terminal would secure fuel for power plants — tying prices to global gas markets.', [
    ['Approve the terminal', 'Secure supply.', 'Power supply is secure; prices follow world gas prices.', { stats: { investor: 4, inflation: -0.2 } }],
    ['Bet on renewables instead', 'Solar and wind.', 'Cheaper in the long run; brownouts in the short run.', { stats: { inflation: 0.2, investor: 2 }, ...then('arc_power_gap', 6) }],
  ]),
  quick('arc_power_gap', null, 'crisis', 'Kulang ang Kuryente', 'Luzara grid', 'Renewable projects are delayed. Summer demand exceeds supply; rotating brownouts begin.', [
    ['Emergency diesel generators: ₱10B', 'Keep the lights on.', 'Expensive power, but power.', { spend: 10, spendLabel: 'Emergency generators', stats: { inflation: 0.2 } }],
    ['Accelerate solar permits', 'Fix the cause.', 'Brownouts last one more summer; then prices fall.', { stats: { approval: -3, inflation: -0.2 } }],
  ]),
  quick('inv_roro_ferries', [8, 22], 'economy', 'Mga RoRo Ferry', 'Transportation Department', 'Shipping costs between islands make Kapuluan goods more expensive than imports. A national roll-on/roll-off ferry network would slash logistics costs.', [
    ['Subsidize new ferry routes: ₱12B', 'Connect the islands.', 'Shipping costs fall; prices in the islands drop.', { spend: 12, spendLabel: 'RoRo ferry network', stats: { inflation: -0.3, growth: 0.2 } }],
    ['Deregulate shipping to let new operators in', 'Competition.', 'New ferries arrive — and one sinks in its first year.', { stats: { inflation: -0.2, approval: -1 } }],
  ]),
  quick('inv_fertilizer_plant', [14, 28], 'economy', 'Planta ng Pataba', 'Agriculture Department', 'Fertilizer prices have doubled. A domestic fertilizer plant using local natural gas would cut farm costs.', [
    ['Build it as a joint venture: ₱18B', 'Food security.', 'Fertilizer prices fall; rice becomes cheaper to grow.', { spend: 18, spendLabel: 'Fertilizer plant', stats: { inflation: -0.3, poverty: -0.2 } }],
    ['Import more fertilizer with subsidies', 'Faster.', 'Relief this season, the same problem next year.', { spend: 8, spendLabel: 'Fertilizer subsidies', stats: { inflation: -0.1 } }],
  ]),

  // ═════════════ MORE CHAPTER 1 ISSUES FROM THE LIST ═════════════
  quick('arc_sugar_shortage', [10, 20], 'economy', 'Kulang ang Asukal', 'Sugar Regulatory Administration', 'Sugar prices double after a poor harvest. Soft-drink makers threaten layoffs.', [
    ['Import 200,000 tons', 'Stabilize prices.', 'Prices fall; sugar farmers protest.', { stats: { inflation: -0.3, protest: 3 } }],
    ['Support farmers to replant', '₱6B.', 'Prices stay high for a season, then fall.', { spend: 6, spendLabel: 'Sugar farm support', stats: { inflation: 0.2, approval: 1 } }],
  ]),
  quick('arc_quarry_disaster', [15, 27], 'calamity', 'Guho sa Quarry', 'Bikolandia', 'An illegal quarry collapses after heavy rains, burying 40 homes. The quarry’s permit was signed by a governor in your coalition.', [
    ['Charge the governor', 'Accountability.', 'The governor is suspended. The coalition sulks.', { stats: { corruption: -3, cohesion: -3, approval: 2 } }],
    ['Blame the rains', 'An act of God.', 'Survivors know better.', { stats: { approval: -3 } }],
  ]),
  quick('arc_fishermen_protest', [12, 24], 'society', 'Protesta ng mga Mangingisda', 'Maynilad Bay', 'Fishermen blockade Maynilad Bay with 500 boats, protesting reclamation projects and foreign trawlers.', [
    ['Halt reclamation pending review', 'Listen to them.', 'The fishermen go home. Developers are angry.', { stats: { approval: 2, investor: -2 } }],
    ['Clear the bay', 'Ports must operate.', 'The coast guard tows the boats. The images are brutal.', { stats: { protest: 6, approval: -3 } }],
  ]),
  quick('arc_opposition_support', [8, 20], 'congress', 'Hindi Inaasahang Suporta', 'Senate', 'Three opposition senators announce they will vote for your health reform bill — “because it is right, whoever proposed it.”', [
    ['Thank them publicly and invite them to the signing', 'Build bridges.', 'A rare moment of bipartisanship.', { stats: { media: -4 }, senateShift: { from: 'opposition', to: 'neutral', count: 2 } }],
    ['Say nothing — don’t help the opposition look good', 'Politics.', 'They notice.', {} ],
  ]),
  quick('arc_ally_turns_critic', [16, 28], 'congress', 'Kaalyadong Naging Kritiko', 'Senate floor', 'An administration senator delivers a scorching privilege speech against your government — and announces she will vote independently from now on.', [
    ['Invite her to lunch and listen', 'Win her back.', 'She stays critical but fair.', { stats: { cohesion: 1 } }],
    ['Strip her committee chairmanship', 'Discipline.', 'She becomes your fiercest critic.', { senateShift: { from: 'ally', to: 'opposition', count: 1 }, stats: { capital: 2 } }],
  ]),
  quick('arc_gov_bank_loans', [12, 24], 'economy', 'Masasamang Pautang', 'State development bank', 'The state development bank lent ₱22B to companies owned by political donors. Most of the loans are not being repaid.', [
    ['Recapitalize the bank and prosecute', 'Fix it and punish.', 'The bank is saved; donors are angry.', { spend: 22, spendLabel: 'State bank recapitalization', stats: { corruption: -3 } }],
    ['Quietly restructure the loans', 'Avoid scandal.', 'The bad loans are hidden — for now.', { stats: { corruption: 3 }, flags: { hidden_bad_loans: true } }],
  ]),
  quick('arc_pension_gap', [16, 28], 'economy', 'Kulang ang Pondo ng Pensyon', 'Social Security System', 'The social security fund will run out in 12 years unless contributions rise or benefits fall.', [
    ['Raise contributions by 2%', 'Save the fund.', 'Workers grumble; the fund is safe.', { stats: { approval: -2, investor: 3 }, taxRate: 0.05 }],
    ['Let the budget cover the gap later', 'Not now.', 'The problem grows.', { stats: { investor: -2 } }],
  ]),
  quick('arc_defense_procurement', [14, 26], 'scandal', 'Korapsyon sa Armas', 'Department of National Defense', 'The Navy’s new frigates were bought at twice the market price, with “consultancy fees” paid to a retired general’s firm.', [
    ['Cancel the contract and investigate', 'Clean procurement.', 'The Navy loses two years. Officers complain of political interference.', { stats: { corruption: -3, military: -6 } }],
    ['Let the contract proceed', 'The Navy needs ships.', 'Ships arrive. So do audit findings.', { stats: { corruption: 4, military: 3 } }],
  ]),

  // ═════════════ NEW BILLS FROM THE OUTLINE ═════════════
  billEvent({ id: 'bill_energy_reform', month: 13, title: 'Energy Reform', bill: 'Energy Market Reform Act', summary: 'Separates power generation from distribution; opens retail competition.', body: ['Electricity bills are among the highest in the region. Reform would break the grip of a few conglomerates.'], appeal: 0, onPass: { stats: { inflation: -0.4, investor: -2, approval: 3 } }, oppose: { label: 'Oppose it', description: 'Avoid a fight with the conglomerates.', outcome: 'The conglomerates are grateful.', effects: { stats: { corruption: 2 } } } }),
  billEvent({ id: 'bill_digital_gov', month: 16, title: 'Digital Government', bill: 'E-Governance Act', summary: 'All government services online; paper transactions phased out.', body: ['A business permit requires 14 offices and a week of lines. Every line is a chance for a bribe.'], appeal: 2, onPass: { stats: { corruption: -3, investor: 3 }, spend: 8, spendLabel: 'E-governance systems' }, oppose: { label: 'Oppose it', description: 'Too expensive.', outcome: 'The lines remain.', effects: {} } }),
  billEvent({ id: 'bill_cybercrime', month: 19, title: 'Online Scams', bill: 'Anti-Online Fraud Act', summary: 'Makes banks and telcos liable for failing to block scams.', body: ['Scammers stole ₱20B from Kapuluan citizens last year.'], appeal: 2, onPass: { stats: { crime: -2, approval: 2 } }, oppose: { label: 'Oppose it', description: 'Burdens business.', outcome: 'Banks are relieved; victims are not.', effects: {} } }),
  billEvent({ id: 'bill_transport_reform', month: 22, title: 'Public Transport Reform', bill: 'Public Transport Modernization Act', summary: 'Route rationalization, fleet consolidation, and subsidies for drivers.', body: ['Commuters spend four hours a day in transit. Drivers fear losing their livelihoods.'], appeal: 0, onPass: { stats: { growth: 0.1, protest: 4, approval: 1 } }, oppose: { label: 'Oppose it', description: 'Protect the drivers.', outcome: 'Drivers are grateful; commuters keep waiting.', effects: {} } }),
  billEvent({ id: 'bill_education_reform', month: 24, category: 'society', title: 'Education Reform', bill: 'Basic Education Reform Act', summary: 'Smaller classes, fewer subjects, and teacher career paths.', body: ['Learning scores are among the lowest in the world.'], appeal: 2, onPass: { program: { id: 'edu_reform', label: 'Basic education reform', monthly: 1.5, months: 72 }, stats: { approval: 2 } }, oppose: { label: 'Oppose it', description: 'Too costly.', outcome: 'Teachers’ unions add you to their list.', effects: { stats: { approval: -1 } } } }),
  billEvent({ id: 'bill_agri_modernization', month: 26, title: 'Agriculture Modernization', bill: 'Agricultural Modernization Act', summary: 'Mechanization, crop insurance, and farm-to-market roads.', body: ['The average farmer is 57 years old and farms by hand.'], appeal: 2, onPass: { program: { id: 'agri_modern', label: 'Agricultural modernization', monthly: 1.2, months: 72 }, stats: { inflation: -0.3, poverty: -0.2 } }, oppose: { label: 'Oppose it', description: 'Not now.', outcome: 'Farmers wait.', effects: {} } }),
  billEvent({ id: 'bill_infra_dev', month: 28, title: 'Infrastructure Development Act', bill: 'Infrastructure Development Act', summary: 'A 10-year infrastructure plan that survives changes in administration.', body: ['Every president starts new projects and abandons the last one’s.'], appeal: 1, onPass: { stats: { investor: 5, growth: 0.2 } }, oppose: { label: 'Oppose it', description: 'Keep flexibility.', outcome: 'The next president can cancel your projects.', effects: {} } }),
  billEvent({ id: 'bill_wealth_tax', month: 30, title: 'Wealth Tax', bill: 'Wealth Tax Act', summary: '1% annual tax on net worth above ₱500 million.', body: ['The richest fifty families own as much as the poorest 60 million people. A wealth tax could raise ₱90B a year — or drive capital abroad.'], appeal: -2, senateAppeal: -1, onPass: { taxRate: 0.3, stats: { investor: -8, approval: 4 } }, oppose: { label: 'Oppose it', description: 'Protect investment.', outcome: 'The tycoons are relieved.', effects: { stats: { investor: 2 } } } }),
];
