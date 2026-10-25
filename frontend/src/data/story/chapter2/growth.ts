import type { Condition, StoryEvent } from '@/features/narrative/types/event';

const RIVAL_VP = { vpAlly: false } as const;
/** Anything in your record that an investigator could build a case on. */
const HAS_DIRT: Condition = { any: [{ flag: 'took_bribe' }, { flag: 'obstruction' }, { flag: 'ordered_audits' }, { flag: 'impeachable_offense' }, { flag: 'ch2_abuse' }, { flag: 'ch2_cover_up' }, { flag: 'ch2_plunder' }, { stat: 'corruption', gte: 55 }] };

/**
 * Chapter 2 balance: investments and jobs to keep the last three years growing, revenue and debt relief,
 * the case being built against the President, and more fights with Congress, the Court, and traitors.
 */
export const GROWTH_2: StoryEvent[] = [
  // ═════════════════════════ INVESTMENTS & JOBS ═════════════════════════
  {
    id: 'inv2_chip_fab', window: [37, 48], priority: 5, category: 'economy', title: 'Planta ng Semiconductor', location: 'Board of Investments',
    body: ['A global chipmaker shortlists the Kapuluan for a ₱400B semiconductor fabrication plant — the biggest single investment in the nation’s history. It needs 24/7 power, water, and 5,000 engineers the country does not yet have.'],
    choices: [
      { id: 'fab_all', label: 'Win it: power guarantees, engineering scholarships, tax holiday', description: 'Go all in.', outcome: 'The chipmaker chooses the Kapuluan. Engineering enrollment doubles overnight.', headline: '₱400B CHIP PLANT: “A NEW ECONOMY”', effects: { spend: 15, spendLabel: 'Engineering scholarships and grid upgrades', taxRate: -0.03, stats: { investor: 12, growth: 0.7, unemployment: -0.3 } } },
      { id: 'fab_partial', label: 'Offer what you can without a tax holiday', description: 'Protect revenue.', outcome: 'The plant goes to Malindra — but two suppliers set up in Sugbu.', effects: { stats: { investor: 3, growth: 0.1 } } },
    ],
  },
  {
    id: 'inv2_green_hydrogen', window: [40, 55], priority: 4, category: 'economy', title: 'Green Hydrogen', location: 'Energy Department',
    body: ['A Nordhavn–Singhapura consortium wants to invest ₱200B in solar-powered hydrogen production in Mindara for export. 8,000 jobs; land needed on ancestral domain.'],
    choices: [
      { id: 'gh_yes', label: 'Approve with indigenous equity stakes', description: 'Partnership.', outcome: 'The tribes become shareholders. Construction begins.', effects: { stats: { growth: 0.3, tribes: 5, investor: 5 } } },
      { id: 'gh_fast', label: 'Approve fast, sort out land later', description: 'Speed.', outcome: 'Construction begins — and so do land protests.', effects: { stats: { growth: 0.4, tribes: -8, protest: 4 } } },
    ],
  },
  {
    id: 'inv2_japan_caregivers', window: [38, 50], priority: 4, category: 'diplomacy', title: 'Trabaho sa Ibang Bansa — Legal at Ligtas', location: 'Department of Migrant Workers',
    body: ['An aging East Asian ally offers 100,000 legal, well-paid jobs for Kapuluan caregivers and nurses, with language training paid for by their government. Hospitals at home fear another exodus.'],
    choices: [
      { id: 'jc_accept', label: 'Sign the deal with a “return and train” clause', description: 'Workers come back to teach after five years.', outcome: 'Remittances rise. The return clause softens the brain drain.', effects: { stats: { unemployment: -0.3, approval: 2, growth: 0.1 } } },
      { id: 'jc_limit', label: 'Cap nurses at 10,000', description: 'Protect our hospitals.', outcome: 'Hospitals keep their nurses; nurses resent the cap.', effects: { stats: { approval: -1 } } },
    ],
  },
  {
    id: 'inv2_tourism_boom', window: [42, 58], priority: 4, category: 'economy', title: 'Dagsa ng Turista', location: 'Tourism Department',
    body: ['A global travel ranking names Visara the world’s best island destination. Arrivals are up 40%. Resorts want to build on protected beaches; residents want the jobs.'],
    choices: [
      { id: 'tb_managed', label: 'Managed growth: visitor caps and local hiring rules', description: 'Sustainable.', outcome: 'The islands stay beautiful. Revenue grows steadily.', effects: { taxRate: 0.05, stats: { growth: 0.2, unemployment: -0.1 } } },
      { id: 'tb_open', label: 'Open the protected beaches to resorts', description: 'Maximum growth.', outcome: 'A building boom — and sewage in the lagoons within two years.', effects: { taxRate: 0.08, stats: { growth: 0.4, tribes: -3, corruption: 2 } } },
    ],
  },
  {
    id: 'inv2_jobs_fair', window: [44, 60], priority: 3, category: 'society', title: 'Ang Pinakamalaking Job Fair', location: 'Sugbu City Convention Center',
    body: ['Investors from your earlier deals are hiring. The Labor department proposes a national job fair: 300,000 openings in manufacturing, IT, and construction.'],
    choices: [
      { id: 'jf_go', label: 'Hold it nationwide, with free transport for applicants', description: '₱1B.', outcome: '120,000 people are hired on the spot.', headline: '120,000 HIRED AT NATIONAL JOB FAIR', effects: { spend: 1, spendLabel: 'National job fair', stats: { unemployment: -0.4, approval: 3 } } },
    ],
  },
  {
    id: 'inv2_ssc_ecozone', window: [46, 62], priority: 5, category: 'economy', title: 'SSC Ecozone', location: 'Southern Seas Community',
    body: ['The SSC proposes a cross-border economic zone linking Mindara with Malindra and Indara — tariff-free trade, shared ports. Mindara would boom; Maynilad businesses fear competition.'],
    choices: [
      { id: 'eco_join', label: 'Join the ecozone', description: 'Open the south.', outcome: 'Trade in Mindara surges. The federalists hail you.', effects: { stats: { growth: 0.4, tribes: 4, investor: 5 } } },
      { id: 'eco_no', label: 'Stay out', description: 'Protect domestic industry.', outcome: 'Mindara feels abandoned.', effects: { stats: { tribes: -4 } } },
    ],
  },
  {
    id: 'inv2_plant_closure', window: [48, 64], priority: 5, category: 'economy', title: 'Umalis ang Planta', location: 'Export zones',
    body: ['A major electronics maker announces it is moving its Kapuluan plant — 9,000 jobs — to Viettra, citing power costs and customs delays.'],
    choices: [
      { id: 'pc_match', label: 'Match Viettra’s offer: cheaper power, faster customs', description: '₱6B.', outcome: 'The company stays — and its competitors notice.', effects: { spend: 6, spendLabel: 'Retention package', stats: { investor: 3 } } },
      { id: 'pc_let', label: 'Let it go and retrain workers', description: 'No bidding wars.', outcome: '9,000 people lose their jobs.', effects: { stats: { unemployment: 0.3, approval: -2 } } },
    ],
  },

  // ═════════════════════════ REVENUE, DEBT & INFLATION ═════════════════════════
  {
    id: 'rev2_debt_buyback', window: [44, 60], priority: 5, category: 'economy', when: [{ stat: 'investor', gte: 50 }], title: 'Bilhin Pabalik ang Utang', location: 'Bureau of the Treasury',
    body: ['Bond prices are favorable. The Treasury proposes buying back ₱200B of expensive old debt using cheaper new bonds — saving ₱8B a year in interest.'],
    choices: [
      { id: 'buyback_yes', label: 'Do it', description: 'Lower interest costs.', outcome: 'Interest costs fall. The rating agencies praise the move.', effects: { debt: -40, stats: { investor: 4 } } },
      { id: 'buyback_no', label: 'Not now', description: 'Keep the cash buffer.', outcome: 'The opportunity passes.', effects: {} },
    ],
  },
  {
    id: 'rev2_tax_amnesty', window: [38, 52], priority: 4, category: 'economy', title: 'Tax Amnesty', location: 'Congress',
    body: ['Congress proposes a tax amnesty: evaders can settle old liabilities at a discount. It would bring ₱60B this year — and reward cheaters.'],
    choices: [
      { id: 'amnesty_yes', label: 'Sign it', description: 'Cash now.', outcome: '₱60B flows in. Honest taxpayers feel like fools.', effects: { income: 60, spendLabel: 'Tax amnesty collections', stats: { corruption: 2 } } },
      { id: 'amnesty_no', label: 'Veto it', description: 'Don’t reward evaders.', outcome: 'The tax bureau is pleased; Congress is not.', effects: { stats: { cohesion: -2, corruption: -1 } } },
    ],
  },
  {
    id: 'rev2_sovereign_returns', window: [46, 62], priority: 4, category: 'economy', when: [{ flag: 'law_sovereign_fund' }], title: 'Kita ng Pondo ng Bayan', location: 'Pondo ng Bayan Corporation',
    body: ['The sovereign fund reports its first big return: ₱40B from its stakes in a toll road and a power plant.'],
    choices: [
      { id: 'sr_remit', label: 'Remit the profits to the Treasury', description: 'Pay down debt.', outcome: 'The Treasury gets ₱40B.', effects: { income: 40, spendLabel: 'Sovereign fund dividends', stats: { investor: 2 } } },
      { id: 'sr_reinvest', label: 'Reinvest in new projects', description: 'Compound the growth.', outcome: 'The fund grows — and so do questions about who benefits.', effects: { stats: { growth: 0.2, corruption: 2 } } },
    ],
  },
  {
    id: 'rev2_gas_phase2', window: [50, 64], priority: 5, category: 'economy', when: [{ resolved: 'rev_gas_discovery', choice: 'gas_develop' }], title: 'Kalampaya-2, Ikalawang Yugto', location: 'West Sea',
    body: ['The gas field is producing. A second phase would double royalties — and require more drilling in waters Haizhou patrols.'],
    choices: [
      { id: 'gp2_go', label: 'Expand production', description: 'Double the royalties.', outcome: 'Revenue soars. So does the tension at sea.', effects: { taxRate: 0.15, stats: { sovereignty: 8, growth: 0.2 } } },
      { id: 'gp2_hold', label: 'Hold at current levels', description: 'Avoid provocation.', outcome: 'Steady revenue, steady nerves.', effects: {} },
    ],
  },
  {
    id: 'rev2_remittance_record', window: [38, 56], priority: 3, category: 'economy', title: 'Rekord na Padala', location: 'Central bank',
    when: [{ none: [{ resolved: 'remittance_crash' }] }],
    body: ['OFW remittances hit a record ₱2.3 trillion. The peso strengthens; consumer spending rises.'],
    choices: [{ id: 'rr_thank', label: 'Thank the OFWs in a national address', description: 'They carry the economy.', outcome: 'OFW families feel seen.', headline: 'RECORD REMITTANCES LIFT ECONOMY', effects: { stats: { growth: 0.3, approval: 2, inflation: -0.2 } } }],
  },
  {
    id: 'infl2_price_fall', window: [40, 60], priority: 4, category: 'economy', when: [{ stat: 'inflation', lte: 4 }], title: 'Bumaba ang Bilihin', location: 'Wet markets',
    body: ['For the first time in years, the price of rice, fuel, and vegetables falls together. Families notice.'],
    choices: [{ id: 'pf_credit', label: 'Credit the reforms — and the farmers', description: 'Share the win.', outcome: 'Your approval rises modestly.', effects: { stats: { approval: 3, inflation: -0.3 } } }],
  },
  {
    id: 'rev2_smuggling_bust', window: [40, 60], priority: 5, category: 'crisis', title: 'Malaking Huli', location: 'Port of Sugbu',
    body: ['Customs intercepts ₱18B in smuggled rice, sugar, and cigarettes — the biggest bust in history. The consignees are linked to a senator’s family.'],
    choices: [
      { id: 'sb_prosecute', label: 'Prosecute everyone, including the senator’s family', description: 'No exceptions.', outcome: 'Revenue from auctioned goods and fines: ₱12B. The senator becomes your enemy.', effects: { income: 12, spendLabel: 'Auctioned contraband and fines', stats: { corruption: -4, approval: 3 }, senateShift: { from: 'ally', to: 'opposition', count: 1 } } },
      { id: 'sb_spare', label: 'Prosecute only the brokers', description: 'Spare the senator.', outcome: 'The senator is grateful. Reporters are not fooled.', effects: { income: 12, spendLabel: 'Auctioned contraband', stats: { corruption: 3 } } },
    ],
  },

  // ═════════════════════════ THE CASE AGAINST YOU ═════════════════════════
  {
    id: 'case_ombudsman_dossier', window: [44, 52], priority: 8, category: 'scandal', when: [HAS_DIRT], title: 'Ang Dossier ng Ombudsman', location: 'Office of the Ombudsman',
    body: ['Sources inside the Ombudsman’s office tell your lawyers: a team has been quietly assembling a dossier on you for two years — bank records, testimonies, procurement documents. You cannot be charged while in office. On July 1, 2033, you can.'],
    choices: [
      { id: 'cod_cooperate', label: 'Instruct your officials to cooperate with every request', description: 'Nothing to hide — or at least act like it.', outcome: 'Your cooperation is noted — including by the investigators.', effects: { stats: { ombudsman: -5, media: -3 } } },
      { id: 'cod_budget', label: 'Cut the Ombudsman’s budget in the next GAA', description: 'Starve the investigation.', outcome: 'Congress goes along. The Ombudsman goes to the press.', headline: 'OMBUDSMAN: “PALASYO IS STRANGLING OUR INVESTIGATION”', effects: { stats: { ombudsman: 15, media: 10, courtTension: 4 }, flags: { ch2_cover_up: true, ombudsman_dossier: true } } },
      { id: 'cod_shred', label: 'Have loyalists “lose” certain documents', description: 'Destroy the evidence.', outcome: 'Boxes disappear from three agencies. A clerk photographs it all.', effects: { stats: { ombudsman: 20 }, flags: { ch2_cover_up: true, ombudsman_dossier: true, obstruction: true } } },
    ],
  },
  {
    id: 'case_senate_report', window: [52, 60], priority: 8, category: 'congress', when: [HAS_DIRT], title: 'Ulat ng Blue Ribbon', location: 'Senate',
    body: ['The Senate Blue Ribbon Committee releases its final report on corruption in your administration. It recommends plunder charges against three Cabinet secretaries — and “further investigation of the President upon the end of the term.”'],
    choices: [
      { id: 'csr_accept', label: 'Accept the report and let the secretaries face charges', description: 'Cut them loose.', outcome: 'Your former secretaries are furious — and some start talking to prosecutors.', effects: { stats: { approval: 2, cabinetCohesion: -8 }, flags: { senate_recommends_charges: true, aides_talking: true } } },
      { id: 'csr_fight', label: 'Have your Senate allies block its adoption', description: 'Kill the report.', outcome: 'The report fails adoption, 11–12. It is leaked in full the next morning.', effects: { stats: { media: 10, approval: -4 }, flags: { senate_recommends_charges: true, ch2_cover_up: true } } },
    ],
  },
  {
    id: 'case_house_impeach', window: [46, 58], priority: 9, category: 'congress', when: [HAS_DIRT, { stat: 'approval', lte: 50 }], title: 'Impeachment, Muli', location: 'House of Representatives',
    body: ['The opposition, joined by defectors from your coalition, files a new impeachment complaint listing everything from the past five years. One-third of the House — 106 signatures — would send you to trial.'],
    variants: [{ when: [RIVAL_VP], text: 'The Vice President’s allies are leading the signature drive. The VP is ready to take your place.' }],
    choices: [
      { id: 'chi_fight', label: 'Hold the House — at any cost', description: 'You need 211 votes.', outcome: 'The vote is called.', effects: { stats: { capital: -10 }, spend: 20, spendLabel: 'Projects for wavering congressmen', vote: { bill: 'Motion to dismiss the impeachment complaint', appeal: 0, houseOnly: true, houseThreshold: 211, onPass: { flags: { impeachment_ch2: 'dismissed' } }, onFail: { flags: { impeachment: 'impeached' }, schedule: [{ event: 'senate_trial_2', inMonths: 2 }] } } } },
      { id: 'chi_resign', label: 'Resign rather than face a trial', description: 'End it.', outcome: 'You resign. Your successor takes the oath.', headline: 'PRESIDENT RESIGNS AHEAD OF SECOND IMPEACHMENT', effects: { gameOver: 'resigned' } },
    ],
  },
  {
    id: 'case_amlc_freeze', window: [56, 66], priority: 7, category: 'scandal', when: [{ any: [{ flag: 'assets_abroad' }, { flag: 'took_bribe' }, { flag: 'ch2_plunder' }] }], title: 'Nakapirming Account', location: 'Anti-Money Laundering Council',
    body: ['The Anti-Money Laundering Council asks the Court of Appeals to freeze 14 bank accounts linked to your family and foundation. The request is leaked to the press.'],
    choices: [
      { id: 'caf_open', label: 'Open the accounts voluntarily', description: 'Prove there is nothing there.', outcome: 'Your lawyers explain the accounts one by one. Some explanations are better than others.', effects: { stats: { media: -3, ombudsman: 4 } } },
      { id: 'caf_fight', label: 'Fight the freeze in court', description: 'Due process.', outcome: 'The freeze order is granted. The headlines write themselves.', headline: 'COURT FREEZES PRESIDENT’S FAMILY ACCOUNTS', effects: { stats: { approval: -6, ombudsman: 10 }, flags: { accounts_frozen: true } } },
    ],
  },
  {
    id: 'case_aide_testifies', window: [60, 68], priority: 8, category: 'scandal', when: [{ any: [{ flag: 'aides_talking' }, { flag: 'traitor_fired' }, { flag: 'ch2_cover_up' }] }], title: 'Ang Dating Tauhan', location: 'Senate Blue Ribbon Committee',
    body: ['Your former Executive Secretary testifies under oath for nine hours — about meetings, envelopes, and instructions “from the very top.”'],
    choices: [
      { id: 'cat_rebut', label: 'Rebut every claim with documents', description: 'Line by line.', outcome: 'Some claims collapse; others do not.', effects: { stats: { media: -2, ombudsman: 5 } } },
      { id: 'cat_smear', label: 'Destroy the witness’s credibility', description: 'Expose their own crimes.', outcome: 'The witness is discredited — and more determined than ever.', effects: { stats: { media: 6, ombudsman: 8 }, flags: { ch2_abuse: true } } },
      { id: 'cat_deal', label: 'Quietly offer the witness a deal to recant', description: 'Everyone has a price.', outcome: 'The witness recants — and records your emissary’s offer.', effects: { stats: { ombudsman: 15, approval: -6 }, flags: { obstruction: true, ch2_cover_up: true } } },
    ],
  },

  // ═════════════════════════ CONGRESS, COURT & TRAITORS ═════════════════════════
  {
    id: 'traitor_ch2', window: [40, 54], priority: 7, category: 'cabinet', title: 'Isa Pang Taksil', location: 'Cabinet Room',
    body: ['Your security chief has proof: {traitor}, your {traitorPost}, has been meeting {opponent}’s campaign — and passing along your successor’s strategy.'],
    choices: [
      { id: 'tc2_fire', label: 'Fire them publicly', description: 'Loyalty matters.', outcome: 'They join the opposition campaign within a week.', effects: { fireCabinet: 'traitor', stats: { cabinetCohesion: 4, media: 4 } } },
      { id: 'tc2_feed', label: 'Feed them false strategy', description: 'Turn the leak into a weapon.', outcome: 'The opposition campaign walks into a trap in the final weeks.', effects: { flags: { successor_boost: true }, stats: { capital: 4 } } },
    ],
  },
  {
    id: 'house_budget_blackmail', window: [50, 60], priority: 6, category: 'congress', title: 'Ang Presyo ng Kamara', location: 'House leadership',
    body: ['The House leadership sends word: the FY2033 budget will not pass unless ₱120B in “district allocations” is added — in an election year.'],
    choices: [
      { id: 'hbb_pay', label: 'Pay it', description: 'A budget on time.', outcome: 'The budget passes. Watchdogs count every peso.', effects: { budgetChange: 120, stats: { cohesion: 6, corruption: 5 } } },
      { id: 'hbb_public', label: 'Go public: “The House is holding the budget hostage”', description: 'Shame them.', outcome: 'The public sides with you. The House leadership swears revenge.', effects: { stats: { approval: 3, cohesion: -8 } } },
    ],
  },
  {
    id: 'sc_budget_tro', window: [42, 56], priority: 6, category: 'court', title: 'TRO sa Budget', location: 'Kataas-taasang Hukuman',
    body: ['Petitioners ask the Supreme Court to stop the release of ₱200B in “unprogrammed appropriations” — standby funds released at your discretion.'],
    court: { title: 'Budget Watch v. Executive Secretary (unprogrammed appropriations)', kind: 'executive', soundness: 0.4, onStrike: { budgetChange: -80, stats: { capital: -4 } }, onUphold: { stats: { capital: 3 } } },
    choices: [
      { id: 'sbt_comply', label: 'Comply', description: 'Freeze the funds.', outcome: 'Several projects stall.', effects: { stats: { courtTension: -3 } } },
      { id: 'sbt_criticize', label: 'Criticize the Court', description: '“Judicial overreach.”', when: [{ ruling: 'struck' }], outcome: 'The Court notes your remarks.', effects: { stats: { courtTension: 8 } } },
    ],
  },
  {
    id: 'sc_election_case', window: [58, 68], priority: 6, category: 'court', title: 'Korte Suprema: Disqualification', location: 'Kataas-taasang Hukuman',
    body: ['A petition asks the Court to disqualify {opponent} from the 2033 race over a residency question. A ruling either way will be called political.'],
    court: { title: 'Citizens for Clean Elections v. COMELEC (disqualification of {opponent})', kind: 'electoral', soundness: 0.3, onStrike: { stats: { protest: 6 }, flags: { opponent_cleared: true } }, onUphold: { stats: { protest: 10 }, flags: { opponent_weakened: true, successor_boost: true } } },
    choices: [
      { id: 'sec_neutral', label: 'Say nothing', description: 'Stay out of it.', outcome: 'The ruling is what it is.', effects: {} },
      { id: 'sec_lobby', label: 'Quietly lobby your appointees on the Court', description: 'Tip the scales.', outcome: 'A justice reports the approach to the Chief Justice.', effects: { stats: { courtTension: 12 }, flags: { ch2_abuse: true } } },
    ],
  },
  {
    id: 'senate_ethics_ally', window: [40, 60], priority: 5, category: 'congress', title: 'Senador sa Ethics', location: 'Senate Ethics Committee',
    body: ['Your closest ally in the Senate faces expulsion for pocketing ₱200M in pork-barrel kickbacks. The ethics vote is close.'],
    choices: [
      { id: 'sea_save', label: 'Save your ally', description: 'Call in every favor.', outcome: 'The senator survives by one vote. Public trust does not.', effects: { stats: { corruption: 4, capital: -4, approval: -2 } } },
      { id: 'sea_let', label: 'Let the Senate decide', description: 'No interference.', outcome: 'The senator is expelled — the first in fifty years.', effects: { stats: { corruption: -3 }, senateShift: { from: 'ally', to: 'neutral', count: 1 } } },
    ],
  },
  {
    id: 'rvp_ch2_campaign', window: [44, 52], priority: 6, category: 'election', when: [RIVAL_VP], title: 'Ang Kampanya ng Bise', location: 'Office of the Vice President',
    body: ['Vice President {vp} launches a presidential campaign built entirely on attacking you. “Six years of this administration is enough.” The VP leads early polls.'],
    choices: [
      { id: 'rvc_counter', label: 'Counter with your record', description: 'Let the numbers speak.', outcome: 'The race tightens.', effects: { stats: { media: 3 } } },
      { id: 'rvc_audit', label: 'Have COA audit the VP’s office', description: 'Hit back.', outcome: 'Irregularities are found. The VP cries persecution.', effects: { stats: { media: 6 }, flags: { ch2_abuse: true, opponent_weakened: true } } },
    ],
  },

  // ═════════════════════════ PRIORITY, YEAR 5 ═════════════════════════
  {
    id: 'prio2_legacy', window: [52, 62], priority: 5, category: 'economy', when: [{ flag: 'admin_priority' }], title: 'Ang Pamana ng Priyoridad', location: 'Palasyo',
    body: ['Your priority program is either your greatest achievement or your biggest unfinished promise. The Finance Secretary says there is money for one last push — or for debt reduction.'],
    choices: [
      { id: 'p2l_push', label: 'One last push: ₱30B', description: 'Finish what you started.', outcome: 'The program reaches its targets. It will carry your name.', effects: { spend: 30, spendLabel: 'Priority program final push', stats: { approval: 3, growth: 0.2, poverty: -0.3 } } },
      { id: 'p2l_debt', label: 'Use it to pay down debt', description: 'Hand over clean books.', outcome: 'The debt falls; the program stops short.', effects: { debt: -30, stats: { investor: 4 } } },
    ],
  },
  {
    id: 'prio2_confusion', window: [40, 50], priority: 5, category: 'cabinet', when: [{ flag: 'admin_priority' }], title: 'Nalilitong Direksyon', location: 'Cabinet Room',
    body: ['Your Cabinet is split: half want to keep your original priority, half say the country’s needs have changed — the economy, security, and education are all in crisis at once.'],
    choices: [
      { id: 'p2c_stay', label: 'Stay focused on your priority', description: 'Consistency.', outcome: 'The focused departments thrive; the others feel neglected.', effects: { stats: { cabinetCohesion: -3, approval: 1 } } },
      { id: 'p2c_pivot_econ', label: 'Pivot to jobs and prices', description: 'What people feel first.', outcome: 'The pivot confuses some supporters — but voters notice lower prices.', effects: { flags: { admin_priority: 'economy' }, stats: { inflation: -0.3, growth: 0.2, cabinetCohesion: -2 } } },
      { id: 'p2c_everything', label: 'Try to prioritize everything', description: 'All at once.', outcome: 'Nothing gets done well.', effects: { stats: { cabinetCohesion: -6, capital: -4 } } },
    ],
  },

  // ═════════════════════════ MORE ISSUES — GOOD AND BAD ═════════════════════════
  {
    id: 'issue2_drug_return', window: [38, 50], priority: 5, category: 'crisis', title: 'Bumalik ang Shabu', location: 'Maynilad',
    body: ['A new drug syndicate — run from inside the penitentiary — floods the slums with cheap methamphetamine. Crime is rising again.'],
    choices: [
      { id: 'dr2_intel', label: 'Intelligence-led raids on the prison network', description: 'Cut the head off.', outcome: 'The syndicate is dismantled in six months.', effects: { stats: { crime: -4 }, spend: 3, spendLabel: 'Anti-drug intelligence' } },
      { id: 'dr2_hard', label: 'A new hard crackdown', description: 'Oplan Walis II.', outcome: 'Deaths in police operations spike again.', effects: { stats: { crime: -6, church: -8, courtTension: 5 }, flags: { ch2_abuse: true } } },
    ],
  },
  {
    id: 'issue2_typhoon', window: [39, 42], priority: 8, category: 'calamity', title: 'Bagyong Odette', location: 'Visara and Mindara',
    body: ['Super Typhoon Odette cuts across Visara and northern Mindara. 400 dead; 2 million displaced; power out for weeks.'],
    choices: [
      { id: 'ty2_all', label: 'Full response: ₱40B', description: 'Everything.', outcome: 'Relief and rebuilding begin quickly.', effects: { spend: 40, spendLabel: 'Typhoon Odette response', stats: { approval: 4 } } },
      { id: 'ty2_insurance', label: 'Use the disaster insurance fund', description: 'If you created it.', when: [{ flag: 'law_b2_disaster_insurance' }], outcome: 'Insurance pays out within days — the first time the system works as designed.', headline: 'DISASTER INSURANCE PAYS OUT IN DAYS', effects: { spend: 10, spendLabel: 'Typhoon Odette response (insured)', stats: { approval: 5 } } },
      { id: 'ty2_min', label: 'Standard response: ₱15B', description: 'Budget is tight.', outcome: 'Survivors wait weeks for aid.', effects: { spend: 15, spendLabel: 'Typhoon Odette response', stats: { approval: -4 } } },
    ],
  },
  {
    id: 'issue2_church_endorse', window: [58, 66], priority: 5, category: 'election', title: 'Ang Boto ng Simbahan', location: 'Religious leaders',
    body: ['A powerful religious group with 2 million bloc votes offers to endorse your successor — in exchange for government land for a new cathedral compound.'],
    choices: [
      { id: 'ce_accept', label: 'Accept', description: 'Two million votes.', outcome: 'The endorsement comes. So does a lawsuit over the land transfer.', effects: { flags: { successor_boost: true }, stats: { corruption: 3 } } },
      { id: 'ce_decline', label: 'Decline', description: 'Separation of Church and State.', outcome: 'The group endorses {opponent}.', effects: { stats: { corruption: -1 } } },
    ],
  },
  {
    id: 'issue2_celebrity_endorse', window: [60, 67], priority: 4, category: 'media', title: 'Artista para sa Kampanya', location: 'Showbiz',
    body: ['The country’s biggest movie star offers to campaign for your successor — for a Cabinet post in the next administration.'],
    choices: [
      { id: 'cen_accept', label: 'Promise the post', description: 'Star power.', outcome: 'The star draws huge crowds. Pundits wince.', effects: { flags: { successor_boost: true }, stats: { media: 3 } } },
      { id: 'cen_decline', label: 'Decline', description: 'Governance is not a movie.', outcome: 'The star campaigns for {opponent} instead.', effects: {} },
    ],
  },
  {
    id: 'issue2_transport_success', window: [50, 66], priority: 3, category: 'society', when: [{ any: [{ flag: 'flagship', is: 'subway' }, { flag: 'law_b2_mass_transit' }, { flag: 'flagship', is: 'haizhou' }] }], title: 'Tumatakbo na ang Tren', location: 'Maynilad',
    body: ['The first segment of the Maynilad Subway opens. Commuters who spent two hours in traffic now travel in twenty minutes.'],
    choices: [{ id: 'ts_ride', label: 'Ride the first train with commuters', description: 'A good day.', outcome: 'The photos of you standing among commuters go viral — for the right reasons.', headline: 'THE SUBWAY IS OPEN', effects: { stats: { approval: 4, growth: 0.2 } } }],
  },
  {
    id: 'issue2_heatwave_power', window: [45, 57], priority: 5, category: 'crisis', title: 'Rotating Brownouts', location: 'Luzara grid',
    body: ['A heat wave pushes power demand past supply. Rotating brownouts hit Maynilad for two weeks.'],
    choices: [
      { id: 'hw_emergency', label: 'Emergency power purchases: ₱12B', description: 'Keep the lights on.', outcome: 'The brownouts end; bills rise next month.', effects: { spend: 12, spendLabel: 'Emergency power purchases', stats: { inflation: 0.2 } } },
      { id: 'hw_conserve', label: 'Mandatory conservation', description: 'Everyone sacrifices.', outcome: 'Businesses lose output; households grumble.', effects: { stats: { growth: -0.2, approval: -2 } } },
    ],
  },
];
