import type { Condition, StoryEvent } from '@/features/narrative/types/event';
import { billEvent, quick, then } from '../chapter1/helpers';

const GENUINE: Condition = { any: [{ flag: 'took_bribe' }, { flag: 'pork_deal' }, { flag: 'infra_scandal', is: 'covered' }, { flag: 'infra_scandal', is: 'protected' }, { tag: 'compromised' }] };
const CLEAN: Condition = { none: [GENUINE] };

/** Chapter 2 story arcs: The Price of Power. Chapter 1 comes back — and every first choice decides the next. */
export const ARCS_2: StoryEvent[] = [
  // ═════════════ A NEW TERM FOR THE CABINET ═════════════
  quick('arc2_reshuffle', 36, 'cabinet', 'Ang Balasahan', 'Cabinet Room', 'A new Congress, a new half of the term. Your advisers say the Cabinet needs a reshuffle — replace the officials who failed or betrayed you.', [
    ['A deep reshuffle: bring in technocrats', 'Competence for the final stretch.', 'Five new secretaries. The ones you removed are bitter.', { stats: { cabinetCohesion: 8, investor: 4 }, ...then('arc2_former_ally', 3) }],
    ['A political reshuffle: reward loyal allies', 'Loyalty for the final stretch.', 'Your allies are happy. Competence suffers.', { stats: { cabinetCohesion: 4, cohesion: 5, corruption: 3 }, ...then('arc2_former_ally', 3) }],
    ['No reshuffle', 'Stability.', 'The team stays together — warts and all.', { stats: { cabinetCohesion: -3 } }],
  ], { priority: 7 }),
  quick('arc2_former_ally', null, 'congress', 'Dating Kaalyado, Ngayo’y Kalaban', 'Opposition press conference', 'A Cabinet secretary you removed joins the opposition and promises to reveal “what really happens inside the Palasyo.”', [
    ['Offer them an ambassadorship to keep them quiet', 'Buy silence.', 'They accept — for now.', { stats: { corruption: 2 } }],
    ['Let them talk', 'Nothing to hide.', 'Their revelations become a weekly segment on opposition TV.', { stats: { media: 6 }, ...then('arc2_docs_release', 4) }],
  ]),
  quick('arc2_docs_release', null, 'scandal', 'Mga Lihim na Dokumento', 'Opposition website', 'Your former secretary releases 2,000 pages of confidential Cabinet documents — minutes, memos, and your handwritten notes.', [
    ['Challenge their authenticity', 'Call them doctored.', 'Some are real, some aren’t. The debate rages.', { stats: { media: 4, approval: -2 } }],
    ['Acknowledge them and explain your decisions', 'Own your record.', 'The public respects the candor more than expected.', { stats: { media: -3, approval: 1 } }],
  ]),

  // ═════════════ THE OLD SCANDAL RETURNS ═════════════
  quick('arc2_scandal_reopens', [40, 48], 'scandal', 'Bumalik ang Iskandalo', 'Office of the Ombudsman', 'A contractor from the Chapter 1 infrastructure scandal agrees to become a state witness. He says he has recordings — and that the trail leads into the Palasyo.', [
    ['Guarantee the witness’s safety publicly', 'Let the truth come out.', 'The witness is protected. The recordings are coming.', { stats: { media: -3 }, ...then('arc2_recordings', 2) }],
    ['Question the witness’s credibility', 'He is a criminal himself.', 'The attacks make the witness a folk hero.', { stats: { media: 5, ombudsman: 5 }, ...then('arc2_recordings', 2) }],
  ], { priority: 7, when: [{ any: [{ flag: 'infra_scandal' }, { flag: 'pork_deal' }, { flag: 'insertions_accepted' }, { resolved: 'ghost_flood_control' }] }] }),
  quick('arc2_recordings', null, 'scandal', 'Ang mga Recording', 'Senate Blue Ribbon Committee', 'The recordings are played before the Senate on live television.', [
    ['Let forensic experts examine them', 'Trust the process.', 'The experts report their findings in a week.', { ...then('arc2_recordings_verdict', 1) }],
    ['Attack the Senate for “trial by publicity”', 'Go on offense.', 'Your base cheers. Everyone else waits for the forensics.', { stats: { media: 6 }, ...then('arc2_recordings_verdict', 1) }],
  ], { priority: 8 }),
  quick('arc2_recordings_verdict', null, 'scandal', 'Ang Hatol ng mga Eksperto', 'Forensic laboratory', 'The forensic report on the recordings is in.', [
    ['Respond to the findings', '', 'You respond.', {}],
  ], {
    priority: 8,
    variants: [
      { when: [GENUINE], text: 'The recordings are authentic. Your voice. Your words. The opposition begins drafting articles of impeachment.' },
      { when: [CLEAN], text: 'The recordings were manipulated: genuine clips of your voice, stitched together by editing software. The contractor admits he was paid to produce them.' },
    ],
    choices: [
      { id: 'arc2_rv_admit', label: 'Admit what is true and apologize', description: 'Only if they are genuine.', when: [GENUINE], outcome: 'An extraordinary apology. Some forgive; the opposition does not.', effects: { stats: { approval: -6, ombudsman: 10, church: 3 }, flags: { impeachable_offense: true } } },
      { id: 'arc2_rv_deny', label: 'Deny everything', description: 'Fight it.', when: [GENUINE], outcome: 'The denial collapses when a second recording surfaces.', effects: { stats: { approval: -10, ombudsman: 15 }, flags: { impeachable_offense: true, ch2_cover_up: true } } },
      { id: 'arc2_rv_expose', label: 'Expose who paid for the fabrication', description: 'Turn the tables.', when: [CLEAN], outcome: 'The trail leads to {opponent}’s allies. Your approval rebounds.', effects: { stats: { approval: 6, media: -6 }, flags: { opponent_weakened: true } } },
      { id: 'arc2_rv_forgive', label: 'Rise above it', description: 'Say nothing further.', when: [CLEAN], outcome: 'Your restraint is noticed.', effects: { stats: { approval: 3 } } },
    ],
  }),
  quick('arc2_speaker_demand', [42, 50], 'congress', 'Hiling ng Speaker', 'Speaker’s office', 'Speaker {speaker} demands that you abandon an ally — the Interior Secretary, who is feuding with the Speaker’s family in their home province — or lose the House’s support on the budget.', [
    ['Abandon the Interior Secretary', 'Keep the House.', 'The Secretary resigns, humiliated.', { fireCabinet: 'interior', stats: { cohesion: 6, cabinetCohesion: -5 } }],
    ['Refuse — you don’t take orders from the Speaker', 'Principle.', 'The House leadership drags its feet on everything.', { stats: { cohesion: -8, capital: 2 } }],
  ]),
  quick('arc2_opposition_defends', [48, 60], 'congress', 'Kalaban na Nagtanggol', 'House of Representatives', 'In a surprise, two opposition congressmen publicly defend you against a weak accusation: “We oppose this President, but we will not convict on rumors.”', [
    ['Thank them publicly', 'Grace.', 'A rare moment of decency in politics.', { stats: { media: -4, approval: 2 }, houseShift: 4 }],
  ]),

  // ═════════════ ECONOMY: BOOM, RECESSION, RECOVERY OR CRISIS ═════════════
  quick('arc2_boom', [38, 44], 'economy', 'Ang Paglago', 'National statistics', 'The investments of your first three years are paying off: factories are hiring, tourism is booming, farm output is up, and inflation has fallen to 3%.', [
    ['Use the boom to cut debt and build reserves', 'Prepare for the next storm.', 'Debt falls sharply; the reserves grow.', { debt: -120, stats: { investor: 6 }, flags: { shock_buffer: true } }, 'KAPULUAN ECONOMY BOOMING'],
    ['Use it to raise wages and pensions', 'Share the prosperity.', 'Families feel richer. Spending commitments grow.', { program: { id: 'boom_raises', label: 'Public wage and pension increases', monthly: 3, months: 60 }, stats: { approval: 6 } }],
    ['Use it for more infrastructure', 'Build on success.', 'A second wave of projects begins.', { project: { id: 'boom_infra', name: 'Second-wave infrastructure', region: 'National', cost: 150, months: 30 }, stats: { growth: 0.4 } }],
  ], { when: [{ stat: 'growth', gte: 4.8 }] }),
  quick('arc2_recession', [48, 52], 'economy', 'Pandaigdigang Resesyon', 'Economic cluster', [
    'A global recession hits. Exports collapse, the peso falls, foreign investors pull out, unemployment rises, and revenue drops by ₱300B. Debt payments suddenly look much harder.',
    'Your economic team lays out the options.',
  ], [
    ['Stimulus: borrow ₱250B for jobs and projects', 'Spend your way out.', 'Jobs are protected. Debt jumps.', { spend: 250, spendLabel: 'Recession stimulus', stats: { growth: 0.8, unemployment: -0.5, investor: -3 }, flags: { recession_path: 'stimulus' }, ...then('arc2_recession_outcome', 6) }],
    ['Austerity: cut spending and raise taxes', 'Protect the debt ratio.', 'The debt ratio holds. Unemployment soars; protests grow.', { taxRate: 0.3, budgetChange: -200, stats: { growth: -0.8, unemployment: 0.8, protest: 12, investor: 6 }, flags: { recession_path: 'austerity' }, ...then('arc2_recession_outcome', 6) }],
    ['Seek emergency help from the international lending fund', 'Cheap loans — with strict conditions.', 'The loans come with demands: sell state firms, cut subsidies, open markets.', { income: 200, spendLabel: 'International fund loan', debt: 200, stats: { sovereignty: -6, protest: 8, investor: 5 }, flags: { recession_path: 'fund' }, ...then('arc2_fund_conditions', 2) }],
    ['Restructure the debt: delay payments', 'Buy time.', 'Payments are delayed. Credit ratings fall.', { stats: { investor: -12, growth: 0.2 }, flags: { recession_path: 'restructure' }, ...then('arc2_recession_outcome', 6) }],
  ], {
    priority: 9,
    variants: [{ when: [{ flag: 'shock_buffer' }], text: 'You built a buffer during the good years. It gives you room to breathe.' }],
  }),
  quick('arc2_fund_conditions', null, 'economy', 'Ang mga Kondisyon', 'International lending fund', 'The lending fund’s conditions: privatize the power corporation, end rice subsidies, and raise VAT by 2%.', [
    ['Accept all conditions', 'The money is needed.', 'Markets recover quickly. The streets do not.', { taxRate: 0.3, stats: { investor: 8, protest: 12, approval: -6, inflation: 0.5 }, ...then('arc2_recession_outcome', 4) }],
    ['Negotiate softer terms', 'Protect the poor.', 'Some conditions are softened after months of talks.', { stats: { investor: 3, protest: 4 }, ...then('arc2_recession_outcome', 4) }],
  ]),
  quick('arc2_recession_outcome', null, 'economy', 'Paglabas sa Resesyon?', 'National statistics', 'Months later, the verdict on your recession strategy is in.', [
    ['See the numbers', '', 'You study the numbers.', {}],
  ], {
    priority: 8,
    variants: [
      { when: [{ stat: 'growth', gte: 4 }], text: 'The economy is recovering. Growth is back above 4% and jobs are returning.' },
      { when: [{ stat: 'growth', lte: 3.9 }], text: 'The economy has not recovered. Growth is weak, and the debt keeps rising.' },
    ],
    choices: [
      { id: 'arc2_ro_celebrate', label: 'Announce the recovery', description: 'Good news.', when: [{ stat: 'growth', gte: 4 }], outcome: 'Confidence returns.', effects: { stats: { approval: 5, investor: 5 } }, headline: 'THE RECOVERY IS HERE' },
      { id: 'arc2_ro_crisis', label: 'Declare a fiscal emergency', description: 'Face the debt crisis.', when: [{ stat: 'growth', lte: 3.9 }], outcome: 'Painful measures follow. The country is shaken.', effects: { taxRate: 0.3, budgetChange: -150, stats: { approval: -6, protest: 10 }, ...then('arc2_stagflation', 3) } },
      { id: 'arc2_ro_borrow', label: 'Borrow again and hope', description: 'Kick the can.', when: [{ stat: 'growth', lte: 3.9 }], outcome: 'Debt passes a dangerous threshold.', effects: { spend: 150, spendLabel: 'Emergency borrowing', stats: { investor: -8, inflation: 0.5 } } },
    ],
  }),
  quick('arc2_stagflation', null, 'economy', 'Stagflation', 'Everywhere', 'Prices are rising and the economy is shrinking at the same time. It is the worst of both worlds.', [
    ['Wage-price freeze for six months', 'Shock therapy.', 'Inflation stops; shortages start.', { stats: { inflation: -1, growth: -0.3, investor: -5, protest: 4 } }],
    ['Let the central bank act, cushion the poor', 'Orthodox medicine.', 'A painful year — then recovery.', { spend: 30, spendLabel: 'Social cushion', stats: { inflation: -0.6, growth: -0.4 } }],
  ]),
  quick('arc2_property_bubble', [52, 62], 'economy', 'Bubble sa Real Estate', 'Maynilad', 'Condo prices have tripled. Banks lent freely. Now buyers are defaulting and developers are halting projects.', [
    ['Let the bubble deflate slowly with bank guidance', 'Manage it.', 'A soft landing — mostly.', { stats: { growth: -0.2, investor: 2 } }],
    ['Bail out the developers', 'Save the jobs.', 'The tycoons are saved with public money.', { spend: 40, spendLabel: 'Developer bailout', stats: { corruption: 4, approval: -3 } }],
  ]),
  quick('arc2_corp_collapse', [50, 62], 'economy', 'Bumagsak ang Korporasyon', 'Stock exchange', 'The country’s largest conglomerate defaults on ₱300B of debt. 60,000 jobs are at risk. Its owner is a major donor to your coalition.', [
    ['A government rescue with strict conditions', 'Save the jobs, punish the owners.', 'The company survives under new management.', { spend: 60, spendLabel: 'Conglomerate rescue', stats: { unemployment: -0.2, investor: 2 } }],
    ['Let it go bankrupt', 'No bailouts.', 'Jobs are lost; markets respect the discipline.', { stats: { unemployment: 0.5, investor: 3, cohesion: -3 } }],
  ]),
  quick('arc2_national_strike', [50, 64], 'society', 'Pambansang Welga', 'Nationwide', 'Unions call a three-day national strike over wages and layoffs. Ports, factories, and transport stop.', [
    ['Negotiate a wage package', 'Meet them halfway.', 'The strike ends; business grumbles.', { stats: { protest: -10, investor: -3, inflation: 0.2 } }],
    ['Declare the strike illegal', 'Order.', 'The strike becomes a movement.', { stats: { protest: 12, approval: -5 } }],
  ], { when: [{ stat: 'unemployment', gte: 6.5 }] }),
  quick('arc2_energy_bailout', [46, 58], 'economy', 'Bailout ng Kuryente', 'Power corporation', 'The state power corporation cannot pay its fuel suppliers. Without ₱50B, blackouts begin next month.', [
    ['Bail it out', 'Keep the lights on.', 'The lights stay on. The debt grows.', { spend: 50, spendLabel: 'Power corporation bailout' }],
    ['Privatize it', 'Sell it to fix it.', 'A buyer takes over; power rates rise.', { income: 80, spendLabel: 'Power corporation sale', stats: { inflation: 0.4, investor: 4 } }],
    ['Let rates rise to cover costs', 'Consumers pay.', 'Bills jump 18%.', { stats: { inflation: 0.6, approval: -4 } }],
  ]),

  // ═════════════ CHAPTER 1’S PROJECTS, TESTED ═════════════
  quick('arc2_infra_tested', [55, 62], 'calamity', 'Nasubok ang mga Proyekto', 'Visara and Mindara', 'A mega-typhoon and a strong earthquake strike within weeks of each other. The bridges, dikes, and schools built in your first three years face their first real test.', [
    ['Survey the damage', '', 'You fly over the damage.', {}],
  ], {
    priority: 9,
    variants: [
      { when: [{ any: [{ flag: 'pork_deal' }, { flag: 'insertions_accepted' }, { flag: 'infra_scandal', is: 'protected' }, { flag: 'infra_scandal', is: 'covered' }] }], text: 'A flood-control dike built by a politically connected contractor collapses. 90 people drown. The substandard concrete is visible from the helicopter.' },
      { when: [{ none: [{ flag: 'pork_deal' }, { flag: 'insertions_accepted' }, { flag: 'infra_scandal', is: 'protected' }, { flag: 'infra_scandal', is: 'covered' }] }], text: 'Your projects hold. The new dikes and schools save thousands of lives. Engineers from abroad come to study them.' },
    ],
    choices: [
      { id: 'arc2_it_accountable', label: 'Demand accountability for every failed structure', description: 'Whoever built it, whoever approved it.', when: [{ any: [{ flag: 'pork_deal' }, { flag: 'insertions_accepted' }, { flag: 'infra_scandal', is: 'protected' }, { flag: 'infra_scandal', is: 'covered' }] }], outcome: 'The investigation reaches your old allies — and your own decisions.', effects: { stats: { approval: 2, ombudsman: 10, cohesion: -8 }, flags: { deaths_exposed_corruption: true } } },
      { id: 'arc2_it_blame', label: 'Blame the contractors alone', description: 'Protect the politicians.', when: [{ any: [{ flag: 'pork_deal' }, { flag: 'insertions_accepted' }, { flag: 'infra_scandal', is: 'protected' }, { flag: 'infra_scandal', is: 'covered' }] }], outcome: 'Families of the dead march on the Palasyo.', effects: { stats: { approval: -8, protest: 12, ombudsman: 8 }, flags: { ch2_cover_up: true } } },
      { id: 'arc2_it_pride', label: 'Honor the engineers who built well', description: 'Good work deserves credit.', when: [{ none: [{ flag: 'pork_deal' }, { flag: 'insertions_accepted' }, { flag: 'infra_scandal', is: 'protected' }, { flag: 'infra_scandal', is: 'covered' }] }], outcome: 'The country sees what honest construction can do.', effects: { stats: { approval: 6, corruption: -3 } }, headline: 'PROJECTS HOLD AS STORMS HIT' },
    ],
  }),

  // ═════════════ THE WEST SEA TURNS DEADLY ═════════════
  quick('arc2_vessel_fired', [50, 58], 'diplomacy', 'Pinaputukan', 'West Sea', 'A Haizhou navy ship fires on a Kapuluan coast guard vessel. One crewman, Petty Officer Ramon Alcaraz, 24, is killed. The country is in mourning and fury.', [
    ['Take the Defense Secretary’s advice: armed escorts and live-fire drills', 'Strength.', 'Haizhou mobilizes three more ships. The region holds its breath.', { stats: { sovereignty: 12, military: 10, investor: -6, approval: 5 }, ...then('arc2_sea_escalation', 2) }],
    ['Take Foreign Affairs’ advice: international condemnation and a UN case', 'Diplomacy.', 'The world condemns Haizhou. Haizhou shrugs.', { stats: { sovereignty: 4, approval: 1 }, ...then('arc2_sea_escalation', 3) }],
    ['Accept the allies’ offer of joint patrols', 'Deterrence by alliance.', 'Columbian and SSC ships join your patrols.', { stats: { sovereignty: 8, military: 6 }, flags: { columbian_bases: true } }],
  ], {
    priority: 9,
    variants: [
      { when: [{ vpAlly: true }], text: 'Vice President {vp} stands beside you at the funeral: “An attack on one of our sailors is an attack on the Republic.”' },
      { when: [{ vpAlly: false }], text: 'The Vice President accuses you of provoking Haizhou.' },
    ],
  }),
  quick('arc2_sea_escalation', null, 'diplomacy', 'Nagtitipon ang mga Barko', 'West Sea', 'Haizhou’s fleet gathers near Pag-asa. Its state media warns of “consequences.” Your generals ask for authority to put the Navy on war footing.', [
    ['War footing — but no first shot', 'Deterrence.', 'After ten tense days, Haizhou pulls back.', { stats: { sovereignty: 8, investor: -5, military: 6 } }],
    ['Back-channel talks through the SSC', 'De-escalate.', 'The fleets withdraw. Nationalists call it weakness.', { stats: { sovereignty: -4, investor: 3 } }],
  ]),

  // ═════════════ SECOND MARTIAL-LAW DEBATE ═════════════
  quick('arc2_coordinated_attacks', [54, 60], 'crisis', 'Sabay-sabay na Pag-atake', 'Five provinces', 'Insurgents launch coordinated attacks on police stations in five provinces. 60 dead. Governors ask for the military; the Armed Forces request extraordinary measures.', [
    ['Convene the National Security Council', 'Decide carefully.', 'The Council meets through the night.', { ...then('arc2_ml2_decision', 0) }],
  ], { priority: 9 }),
  quick('arc2_ml2_decision', null, 'cabinet', 'Ikalawang Batas Militar?', 'National Security Council', 'Civil-liberties groups warn against abuse. The opposition says you want a dictatorship before leaving office. Congress demands a briefing.', [
    ['Limited martial law in the three worst provinces, 60 days', 'Narrow.', 'Congress upholds it narrowly. The Court will review.', { stats: { crime: -4, military: 6, courtTension: 8, protest: 6 }, flags: { ml2: 'limited' }, vote: { bill: 'Joint resolution on limited martial law', appeal: 0, onFail: { stats: { capital: -8 }, flags: { ml2: 'revoked' } } }, ...then('arc2_ml2_aftermath', 2) }],
    ['Nationwide martial law', 'Total security.', 'The country is stunned. The Supreme Court receives 20 petitions.', { stats: { crime: -6, military: 10, courtTension: 25, protest: 20, media: 15, approval: -8 }, flags: { ml2: 'nationwide', impeachable_offense: true }, ...then('arc2_ml2_aftermath', 2) }],
    ['No martial law — deploy the military under civilian law', 'Restraint.', 'The operations are slower. Civilian rule holds.', { spend: 10, spendLabel: 'Security operations', stats: { crime: -2, approval: 3 }, flags: { ml2: 'none' } }],
  ], {
    priority: 9,
    variants: [{ when: [{ vpAlly: true }], text: 'Vice President {vp}, at the table, argues for the narrowest possible response.' }],
  }),
  quick('arc2_ml2_aftermath', null, 'crisis', 'Mga Maling Pag-aresto', 'Martial-law zones', 'Reports emerge: soldiers arrested 400 people without warrants, including journalists and a priest. A regional commander refuses your order to release them.', [
    ['Relieve the commander immediately', 'Civilian supremacy.', 'The commander is relieved — and his officers grumble about coups.', { stats: { military: -8, courtTension: -5, church: 4 }, ...then('arc2_coup_rumors', 2) }],
    ['Protect the commander', 'Stand by the military.', 'The Church and the Court turn against you.', { stats: { military: 6, church: -10, courtTension: 10 }, flags: { ch2_abuse: true } }],
  ], { priority: 8 }),
  quick('arc2_coup_rumors', null, 'crisis', 'Bulong ng Kudeta', 'Intelligence service', 'Your intelligence chief reports a coup plot among colonels loyal to the relieved commander. He presents intercepted messages.', [
    ['Arrest the colonels', 'Act on the intelligence.', 'The colonels are arrested. Later, it emerges the messages were partly fabricated by your intelligence chief to settle scores.', { stats: { military: -6, courtTension: 5 }, flags: { fabricated_intel: true } }],
    ['Verify the intelligence independently first', 'Trust, but verify.', 'An independent review finds the plot was exaggerated — and your intelligence chief was manipulating you.', { stats: { military: 3 }, flags: { intel_chief_exposed: true } }],
  ]),

  // ═════════════ THE MAJOR BETRAYAL (decided by your earlier choices) ═════════════
  quick('arc2_betrayal_speaker', [58, 64], 'congress', 'Ang Pagtataksil ng Speaker', 'House of Representatives', 'Speaker {speaker} — whom you once crossed — has secretly negotiated with {opponent}: the House will open an impeachment inquiry the week after the election if the opposition wins.', [
    ['Engineer the Speaker’s ouster first', 'Strike first.', 'A midnight vote removes the Speaker. The House is in chaos.', { stats: { capital: -8, cohesion: -5 }, houseShift: -10 }],
    ['Expose the deal publicly', 'Let the public judge.', 'The Speaker denies it; the public believes you.', { stats: { approval: 3, media: -2 } }],
  ], { when: [{ any: [{ flag: 'speaker_rival' }, { flag: 'speaker_hostile' }, { flag: 'speaker_owns_you' }] }], priority: 8 }),
  quick('arc2_betrayal_relative', [58, 64], 'family', 'Pagtataksil sa Pamilya', 'NBI', 'The NBI finds that a close relative secretly made ₱300M in deals — using your name — with contractors who won government projects.', [
    ['Let the NBI file charges', 'No exceptions.', 'Your family is shattered. Your credibility survives.', { stats: { family: -20, approval: 3, corruption: -3 } }],
    ['Shield your relative', 'Family first.', 'The shield holds — until the Senate subpoenas the bank records.', { stats: { family: 8, ombudsman: 12 }, flags: { ch2_cover_up: true } }],
  ], { when: [{ any: [{ flag: 'brother_customs' }, { flag: 'brother_adviser' }, { flag: 'family_dynasty' }, { resolved: 'arc_relative_contract' }] }], priority: 8 }),
  quick('arc2_betrayal_financier', [58, 64], 'scandal', 'Ang Financier', 'Leaked bank records', 'Your biggest campaign financier has been funding {opponent} too — and is now offering your secrets to the opposition in exchange for protection.', [
    ['Cut the financier off and brace for revelations', 'Let it come.', 'The revelations come. Some sting.', { stats: { approval: -3, ombudsman: 5 } }],
    ['Offer the financier a bigger deal', 'Outbid the opposition.', 'You pay. Everyone learns you pay.', { stats: { corruption: 6 }, flags: { ch2_plunder: true } }],
  ], { when: [{ any: [{ flag: 'took_bribe' }, { tag: 'compromised' }, { flag: 'tiu_enemy' }] }], priority: 8 }),
  quick('arc2_betrayal_defense', [58, 64], 'cabinet', 'Ang Ambisyosong Kalihim', 'Department of National Defense', 'Your Defense Secretary has been quietly building a political base among retired generals and governors — and has met with {opponent} twice.', [
    ['Fire the Defense Secretary', 'Remove the threat.', 'The Secretary leaves with a speech about “the President’s paranoia.”', { fireCabinet: 'defense', stats: { military: -5 } }],
    ['Keep them close and watch', 'Knowledge is power.', 'You learn much — and so do they.', { stats: { capital: 2 } }],
  ], { when: [{ any: [{ flag: 'military_deal' }, { flag: 'militarization' }, { flag: 'martial_law_mindara' }] }], priority: 8 }),
  quick('arc2_vp_courted', [50, 58], 'cabinet', 'Tinutukso ang Bise', 'Opposition offer', 'The opposition offers Vice President {vp} its full support in 2033 — if the VP breaks with you publicly now.', [
    ['Trust the VP to refuse', 'Loyalty.', 'The VP refuses — publicly — and stands beside you.', { stats: { approval: 2 }, flags: { vp_loyalty: 'deep' } }],
    ['Offer the VP your endorsement first', 'Seal the alliance.', 'The VP is moved. The alliance is sealed.', { flags: { successor_leaning: 'vp', vp_loyalty: 'deep' } }],
  ], {
    when: [{ vpAlly: true }],
    variants: [{ when: [{ flag: 'vp_loyalty', is: 'tested' }], text: 'After the way you treated the VP, you are no longer sure of the answer.' }],
  }),

  // ═════════════ SURVEILLANCE, CYBERATTACKS ═════════════
  quick('arc2_palace_surveillance', [52, 62], 'crisis', 'Nakikinig sa Palasyo', 'Presidential Security Group', 'A sweep of the Palasyo finds listening devices in the Cabinet Room and your private study. Some are foreign-made.', [
    ['Investigate quietly', 'Find the source.', 'The trail leads to a foreign embassy — and a staffer who let them in.', { stats: { sovereignty: 4 } }],
    ['Announce it publicly', 'Transparency.', 'The public is alarmed; the embassy denies everything.', { stats: { sovereignty: 6, media: -2 } }],
  ]),
  quick('arc2_cyberattack', [56, 64], 'crisis', 'Cyberattack', 'Government systems', 'A massive cyberattack shuts down government systems, disables part of the power grid, and freezes bank transfers for two days. Disinformation spreads panic.', [
    ['Emergency response and a Congress briefing', 'Coordinate.', 'Systems return in 48 hours.', { spend: 8, spendLabel: 'Cyber emergency response', stats: { investor: -2 } }],
    ['Blame a foreign state immediately', 'Nationalist response.', 'The attribution is premature; the blame game hurts investor confidence.', { stats: { sovereignty: 4, investor: -5 } }],
  ], {
    priority: 8,
    variants: [{ when: [{ flag: 'cyber_ready' }], text: 'The cybersecurity agency you funded in your first term contains the damage in hours instead of days.' }],
  }),

  // ═════════════ SUCCESSION & THE FINAL STRETCH ═════════════
  quick('arc2_cabinet_challenger', [54, 58], 'election', 'Hamon sa Bise', 'Party convention', 'Your Finance Secretary challenges the Vice President for the party’s nomination. The coalition splits into two camps.', [
    ['Back the Vice President', 'Loyalty.', 'The Finance Secretary resigns and takes business donors along.', { stats: { cohesion: -3 }, flags: { successor_leaning: 'vp' } }],
    ['Back the Finance Secretary', 'Competence.', 'The VP is hurt — deeply.', { flags: { vp_loyalty: 'tested', successor_leaning: 'technocrat' }, stats: { cohesion: -3 } }],
    ['Stay neutral', 'Let the party decide.', 'A bitter primary divides the coalition.', { stats: { cohesion: -6 } }],
  ], { when: [{ vpAlly: true }] }),
  quick('arc2_youth_party', [56, 64], 'election', 'Partido ng Kabataan', 'Social media', 'A youth-led third party, “Bagong Salinlahi,” surges to 20% in the polls — drawing voters from both sides.', [
    ['Court them with youth policies', 'Adapt.', 'Some young voters return to your successor.', { flags: { successor_boost: true }, spend: 5, spendLabel: 'Youth programs' }],
    ['Dismiss them', '“A social media fad.”', 'They grow.', { flags: { third_party_strong: true } }],
  ]),
  quick('arc2_governors_switch', [60, 66], 'election', 'Lumilipat ang mga Gobernador', 'Provincial capitols', 'Twelve governors — and the dynasties behind them — switch to {opponent}’s coalition, sensing the wind.', [
    ['Offer them projects to stay', '₱20B.', 'Eight stay.', { spend: 20, spendLabel: 'Projects for governors', stats: { corruption: 3, cohesion: 4 } }],
    ['Let them go', 'Dynasties follow power.', 'Your successor loses the machinery of twelve provinces.', { stats: { cohesion: -5 }, flags: { opponent_weakened: false } }],
  ]),
  quick('arc2_legacy_law_court', [60, 66], 'court', 'Ang Pamanang Batas sa Korte', 'Kataas-taasang Hukuman', 'The Supreme Court signals it may strike down the signature law of your presidency.', [
    ['Respect the Court whatever it decides', 'Institutions first.', 'Your restraint is noted by history.', { stats: { courtTension: -6 } }],
    ['Warn the Court publicly', 'Defend your legacy.', 'A constitutional confrontation looms.', { stats: { courtTension: 15, media: 8 }, flags: { ch2_abuse: true } }],
  ], { when: [{ any: [{ flag: 'law_tax_reform' }, { flag: 'law_rice_reform' }, { flag: 'law_sovereign_fund' }, { flag: 'law_bill_foi' }, { flag: 'law_b2_anti_dynasty_2' }] }] }),
  quick('arc2_final_foreign_crisis', 68, 'diplomacy', 'Huling Krisis', 'National Security Council', 'Days before the election, Haizhou seizes a Kapuluan research vessel. The crew of 20 is detained.', [
    ['Negotiate their release quietly', 'Bring them home.', 'The crew is freed after nine days.', { stats: { approval: 3 } }],
    ['Escalate with a naval response', 'Strength before the election.', 'The standoff dominates the final days of the campaign.', { stats: { sovereignty: 8, investor: -4 }, flags: { successor_boost: true } }],
    ['Leave it to the next administration', 'Do not bind your successor.', 'The crew waits.', { stats: { approval: -3 } }],
  ], { priority: 8 }),
  quick('arc2_final_address', 69, 'address', 'Huling Talumpati', 'Palasyo', 'Your final address to the nation as President.', [
    ['Thank the people and ask for unity', 'Grace.', 'Even critics call it a fine farewell.', { stats: { approval: 3, media: -4 } }],
    ['Defend every decision', 'No regrets.', 'Your base is moved; your critics are unmoved.', { stats: { approval: 1 } }],
    ['Apologize for your failures', 'Candor.', 'The apology is replayed for years.', { stats: { approval: 4, church: 3 } }],
  ], { priority: 7 }),
  quick('arc2_final_cabinet', 70, 'cabinet', 'Huling Pulong ng Gabinete', 'Cabinet Room', 'Your last Cabinet meeting. Each secretary speaks about six years. Some cry. One does not come.', [
    ['Thank each of them personally', 'A gracious end.', 'The photograph of your last Cabinet meeting hangs in many homes.', { stats: { cabinetCohesion: 10 } }],
    ['Ask them to protect each other after the term', 'Prepare for what comes.', 'They understand what you mean.', { flags: { ch2_cover_up: true } }],
  ], { priority: 6 }),

  // ═════════════ INVESTMENTS THAT MOVE PRICES ═════════════
  quick('inv2_rice_hybrid', [40, 56], 'economy', 'Hybrid na Palay', 'Agriculture Department', 'A hybrid rice program could raise yields 40%, cutting import dependence and rice prices — if seeds are subsidized.', [
    ['Subsidize hybrid seeds nationwide: ₱15B', 'Food security.', 'Harvests jump. Rice prices fall.', { spend: 15, spendLabel: 'Hybrid rice program', stats: { inflation: -0.5, poverty: -0.3 } }],
    ['Let seed companies sell at market price', 'No subsidy.', 'Only richer farmers adopt it.', { stats: { inflation: -0.1 } }],
  ]),
  quick('inv2_solar_rooftops', [44, 60], 'economy', 'Solar sa Bubong', 'Energy Department', 'A program to finance rooftop solar for 2 million homes would cut household power bills by a third.', [
    ['Finance it through the state banks', '₱30B in loans.', 'Bills fall; installers hire 40,000 workers.', { stats: { inflation: -0.3, unemployment: -0.2 } }],
    ['Fund it with new money from the central bank', 'Fast and free.', 'The program launches — and inflation rises.', { stats: { inflation: 0.6, investor: -5 } }],
  ]),
  quick('inv2_refinery', [46, 62], 'economy', 'Refinery', 'Energy Department', 'The country has no working oil refinery; every liter of fuel is imported refined. A ₱150B refinery would cut fuel costs — and tie the country to fossil fuels for decades.', [
    ['Build it with a Gulf partner', 'Energy security.', 'Fuel costs fall 8% once it opens.', { stats: { inflation: -0.3, investor: 4 } }],
    ['Invest in electric transport instead', 'The future.', 'Fuel stays expensive for now.', { stats: { inflation: 0.1, growth: 0.1 } }],
  ]),
  quick('inv2_money_printing', [48, 60], 'economy', 'Tukso ng Pag-imprenta', 'Department of Finance', 'Facing a revenue gap, allies propose having the central bank buy government bonds directly — “printing money” to fund projects without new taxes or debt.', [
    ['Refuse', 'Protect the currency.', 'The central bank thanks you quietly.', { stats: { investor: 4 } }],
    ['Do it — just this once', '₱200B for projects.', 'The projects are funded. Within months, prices are rising fast.', { income: 200, spendLabel: 'Central bank financing', stats: { inflation: 1.5, investor: -12 } }],
  ]),

  // ═════════════ FINAL BILLS FROM THE OUTLINE ═════════════
  billEvent({ id: 'b2_climate_adaptation', month: 49, title: 'Climate Adaptation', bill: 'Climate Adaptation Act', summary: 'A permanent fund to climate-proof roads, schools, and farms.', body: ['Every typhoon destroys what the last budget built.'], appeal: 2, onPass: { program: { id: 'climate_fund', label: 'Climate adaptation fund', monthly: 1.5, months: 60 } }, oppose: { label: 'Oppose it', description: 'Too costly.', outcome: 'The next typhoon will cost more.', effects: {} } }),
  billEvent({ id: 'b2_political_finance', month: 59, title: 'Political Finance Reform', bill: 'Political Finance Reform Act', summary: 'Public funding for parties; bans corporate donations.', body: ['Every campaign is bought by someone.'], appeal: -2, onPass: { stats: { corruption: -5, cohesion: -5 } }, oppose: { label: 'Oppose it', description: 'Protect the war chest.', outcome: 'Donors are pleased.', effects: {} } }),
  billEvent({ id: 'b2_national_security', month: 63, title: 'National Security Reform', bill: 'National Security Council Reform Act', summary: 'Congressional oversight of intelligence and surveillance.', body: ['After the surveillance and fabricated-intelligence scandals, Congress wants oversight.'], appeal: 1, onPass: { stats: { courtTension: -4, military: -3 } }, oppose: { label: 'Oppose it', description: 'Security first.', outcome: 'The intelligence services stay in the shadows.', effects: {} } }),
];
