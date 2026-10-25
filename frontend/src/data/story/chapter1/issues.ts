import type { Condition, StoryEvent } from '@/features/narrative/types/event';

/** Signs that the President has personally done wrong — these make impeachment trials far more dangerous. */
const GUILTY: Condition = { any: [{ flag: 'took_bribe' }, { flag: 'obstruction' }, { tag: 'compromised' }, { flag: 'hidden_debt', is: 'concealed' }, { flag: 'ordered_audits' }] };
const CLEAN: Condition = { none: [GUILTY] };

/**
 * Chapter 1 issues inspired by real controversies in Philippine government — every one fictionalized.
 * Many choices here are traps: the popular answer is often the one that ends in an investigation.
 */
export const ISSUES: StoryEvent[] = [
  // ═════════════════════════ YEAR 1 ═════════════════════════
  {
    id: 'jeepney_strike', month: 2, priority: 4, category: 'society', title: 'Welga ng mga Tsuper', location: 'Every major road in Maynilad',
    body: ['Jeepney drivers launch a three-day transport strike against the modernization program, which requires them to replace their old jeepneys with ₱2.8-million electric minibuses. Millions of commuters are stranded.', 'Your Transportation Secretary, {sec:transportation}, says backing down now would kill the program for good.'],
    choices: [
      { id: 'jeep_hold', label: 'Hold the line on modernization', description: 'Old jeepneys are unsafe and polluting.', outcome: 'The strike ends after three days. Forty thousand drivers lose their franchises by year’s end. Their families will vote.', headline: 'PALASYO WON’T BUDGE ON JEEPNEY PHASE-OUT', effects: { stats: { protest: 8, approval: -3, investor: 2 }, houseShift: -3 } },
      { id: 'jeep_subsidy', label: 'Subsidize the new vehicles: ₱20B', description: 'Make modernization affordable.', outcome: 'Drivers can now afford the minibuses. The Finance department cannot afford the subsidy.', headline: '₱20B SUBSIDY FOR JEEPNEY DRIVERS', effects: { spend: 20, spendLabel: 'Jeepney modernization subsidy', stats: { protest: -6, approval: 3 } } },
      { id: 'jeep_suspend', label: 'Suspend the phase-out indefinitely', description: 'Give the drivers what they want.', outcome: 'The drivers celebrate. The electric-bus makers who invested ₱30 billion sue the government.', headline: 'JEEPNEY PHASE-OUT SUSPENDED', effects: { stats: { approval: 4, investor: -5, courtTension: 2 } } },
    ],
  },
  {
    id: 'class_suspension', month: 3, priority: 3, category: 'calamity', title: 'Walang Pasok', location: 'Department of Education',
    body: ['This school year, classes have been suspended for 34 days because of typhoons, floods, and schools used as evacuation centers. Students in Silangang Visara have lost almost two months.', 'Your Education Secretary, {sec:education}, proposes three options.'],
    choices: [
      { id: 'classes_saturday', label: 'Make-up classes on Saturdays', description: 'Recover lost days. Teachers will work six days a week.', outcome: 'Learning time is recovered. Teachers are exhausted and file grievances.', effects: { stats: { approval: -1, protest: 3 } } },
      { id: 'classes_modular', label: 'Switch to take-home modules during storms', description: 'Printed lessons delivered to homes.', outcome: 'The modules arrive late and are full of errors. A viral page shows a math problem with no correct answer.', headline: 'MODULE ERRORS GO VIRAL', effects: { spend: 3, spendLabel: 'Printed learning modules', stats: { media: 3 } } },
      { id: 'classes_build', label: 'Build dedicated evacuation centers so schools stay open', description: '₱25B over three years.', outcome: 'Construction begins in the most typhoon-hit provinces.', effects: { project: { id: 'evac_centers', name: 'Dedicated evacuation centers', region: 'Silangang Visara', cost: 25, months: 30 }, stats: { approval: 2 } } },
    ],
  },
  {
    id: 'asf_outbreak', month: 4, priority: 4, category: 'economy', title: 'African Swine Fever', location: 'Hog farms of Gitnang Kapatagan',
    body: ['African swine fever spreads through hog farms in five regions. Pork prices jump 40%. Backyard raisers — millions of poor families — face ruin.'],
    choices: [
      { id: 'asf_cull_pay', label: 'Cull infected herds and pay farmers ₱5,000 per pig', description: '₱9B in compensation.', outcome: 'The outbreak is contained within months. Payments are slow in some provinces — and faster in the provinces of your allies.', effects: { spend: 9, spendLabel: 'ASF indemnification', stats: { inflation: 0.2, approval: 1 } } },
      { id: 'asf_import', label: 'Import pork at low tariffs', description: 'Bring prices down fast.', outcome: 'Prices fall. Hog raisers accuse you of killing the industry twice.', headline: 'PORK IMPORTS SURGE; HOG RAISERS PROTEST', effects: { taxRate: -0.02, stats: { inflation: -0.3, approval: 1 }, houseShift: -2 } },
      { id: 'asf_vaccine', label: 'Rush an unapproved foreign vaccine', description: 'Fast, but not fully tested.', outcome: 'The vaccine works on most pigs — and kills some. The Food and Drug agency chief resigns in protest.', headline: 'UNAPPROVED ASF VACCINE ROLLOUT STIRS ROW', effects: { stats: { inflation: -0.2, media: 5, courtTension: 2 } } },
    ],
  },
  {
    id: 'unemployment_surge', month: 5, priority: 5, category: 'economy', title: 'Walang Trabaho', location: 'Labor Department',
    body: ['Unemployment spikes as factories close and a million new graduates enter the job market. Two million young people are neither studying nor working. The “Trabaho” you promised is not arriving.'],
    variants: [{ when: [{ flag: 'law_bill_endo' }], text: 'Business groups blame your anti-contractualization law.' }],
    choices: [
      { id: 'jobs_emergency', label: 'Emergency employment: ₱15B for 10-day public jobs', description: 'Street sweeping, canal cleaning — cash now.', outcome: 'Half a million people get ten days of work. Critics say mayors chose who got the jobs.', effects: { spend: 15, spendLabel: 'Emergency employment program', stats: { unemployment: -0.4, approval: 2, corruption: 2 } } },
      { id: 'jobs_training', label: 'Skills training and job matching', description: 'Slower, lasting.', outcome: 'The results will take a year to show.', effects: { program: { id: 'skills_training', label: 'Skills training program', monthly: 0.6, months: 36 }, stats: { unemployment: -0.2 } } },
      { id: 'jobs_abroad', label: 'Expand overseas deployment', description: 'Send more workers abroad.', outcome: 'Deployments rise. So do the stories of workers abused abroad.', headline: 'GOVERNMENT’S JOB PLAN: LEAVE THE COUNTRY', effects: { stats: { unemployment: -0.3, approval: -2, media: 3 } } },
    ],
  },
  {
    id: 'hiv_surge', month: 6, priority: 5, category: 'society', title: 'Tahimik na Epidemya', location: 'Department of Health',
    body: ['HIV cases have risen 400% in a decade — the fastest-growing epidemic in the region. Half the new cases are aged 15 to 24. Your Health Secretary, {sec:health}, wants sex education in high schools and free condoms. The bishops call it “promoting promiscuity.”'],
    choices: [
      { id: 'hiv_full', label: 'Comprehensive sex education and free testing', description: 'Follow the science.', outcome: 'Testing centers open in every province. The Church denounces you from the pulpit.', headline: 'SEX ED IN HIGH SCHOOLS; BISHOPS OUTRAGED', effects: { spend: 4, spendLabel: 'HIV response', stats: { church: -12, approval: 1 }, flags: { hiv_response: 'full' } } },
      { id: 'hiv_quiet', label: 'Quietly fund treatment — no public campaign', description: 'Avoid the culture war.', outcome: 'Treatment improves; prevention does not. Cases keep rising.', effects: { spend: 2, spendLabel: 'HIV treatment', stats: { church: 1 }, flags: { hiv_response: 'quiet' } } },
      { id: 'hiv_morals', label: 'An abstinence and “values” campaign', description: 'Side with the Church.', outcome: 'The Church praises you. Epidemiologists predict the epidemic will double.', effects: { stats: { church: 6 }, flags: { hiv_response: 'abstinence' }, schedule: [{ event: 'hiv_crisis_worsens', inMonths: 12 }] } },
    ],
  },
  {
    id: 'hiv_crisis_worsens', category: 'society', title: 'Doble ang Kaso', location: 'Department of Health',
    body: ['A year after your abstinence campaign, new HIV infections have doubled. A teenager’s death — and his mother’s televised plea — makes it a national story.'],
    choices: [
      { id: 'hiv_reverse', label: 'Reverse course: full prevention program', description: 'Admit the mistake.', outcome: 'The Church feels betrayed; doctors feel vindicated.', effects: { spend: 6, spendLabel: 'HIV emergency response', stats: { church: -8, approval: 2 } } },
      { id: 'hiv_stay', label: 'Stay the course', description: 'Values take time.', outcome: 'The mother’s plea becomes an opposition campaign ad.', effects: { stats: { approval: -5, media: 5 } } },
    ],
  },
  {
    id: 'sugar_order', month: 7, priority: 5, category: 'scandal', title: 'Ang Sugar Order', location: 'Agriculture Department',
    body: ['An undersecretary signs an order to import 300,000 tons of sugar “on behalf of the President.” You never approved it. The importers chosen are all linked to one family — major donors to your coalition.'],
    choices: [
      { id: 'sugar_fire', label: 'Fire the undersecretary and void the order', description: '“Nobody signs for me.”', outcome: 'Sugar prices spike as the imports are cancelled. The donors stop returning calls.', headline: 'PRESIDENT VOIDS ‘ILLEGAL’ SUGAR IMPORT ORDER', effects: { stats: { inflation: 0.3, corruption: -3, approval: 2, cohesion: -3 } } },
      { id: 'sugar_let', label: 'Let the imports proceed — prices must fall', description: 'Deal with the paperwork later.', outcome: 'Sugar prices fall. The Senate opens an inquiry into who really authorized it.', headline: 'WHO SIGNED THE SUGAR ORDER? SENATE ASKS', effects: { stats: { inflation: -0.3, corruption: 4, ombudsman: 5 } } },
    ],
  },
  {
    id: 'pogo_mayor', month: 8, priority: 6, category: 'scandal', title: 'Ang Misteryosong Mayor', location: 'Senate hearing',
    body: ['Senators discover that Alicia Go, mayor of a small town in Gitnang Kapatagan, has no birth record, no school records, and fingerprints that match a Haizhou citizen. Her town hosts a fortified offshore casino where trafficked workers were tortured.', 'She is a member of your coalition. And she has just disappeared.'],
    choices: [
      { id: 'mayor_hunt', label: 'Order a nationwide manhunt and treat it as espionage', description: 'Find her, whoever protected her.', outcome: 'She is caught in a neighboring country three months later. Her testimony implicates officials of the previous administration — and two in yours.', headline: 'FUGITIVE MAYOR CAUGHT; NAMES OFFICIALS', effects: { stats: { sovereignty: 4, approval: 4, corruption: -2, cohesion: -3 } } },
      { id: 'mayor_downplay', label: 'Downplay it — “a local matter”', description: 'She is from your coalition.', outcome: 'She escapes the country on a fishing boat. The Senate report blames “protectors at the highest levels.”', headline: 'SPY MAYOR ESCAPES; SENATE CITES “HIGH-LEVEL PROTECTORS”', effects: { stats: { approval: -6, corruption: 5, sovereignty: -5, ombudsman: 6 } } },
    ],
  },
  {
    id: 'heat_classes', month: 9, priority: 3, category: 'calamity', title: '52°C', location: 'Weather bureau',
    body: ['The heat index reaches 52°C. Students faint in classrooms with no fans. Parents demand classes be suspended; teachers warn the school year is already too short.'],
    choices: [
      { id: 'heat_suspend', label: 'Suspend in-person classes during extreme heat', description: 'Safety first.', outcome: 'Classes move online — for students who have internet.', effects: { stats: { approval: 1 } } },
      { id: 'heat_calendar', label: 'Move the school calendar back to the rainy months', description: 'Old calendar: June to March.', outcome: 'Sensible. It also means more typhoon suspensions.', effects: { stats: { approval: 2 } } },
      { id: 'heat_fans', label: 'Buy fans and air-conditioners for 40,000 classrooms', description: '₱8B, fast procurement.', outcome: 'Fast procurement means expensive procurement. COA flags ₱1.2B in overpricing.', headline: 'CLASSROOM FAN DEAL OVERPRICED — COA', effects: { spend: 8, spendLabel: 'Classroom cooling', stats: { approval: 1, corruption: 3 } } },
    ],
  },
  {
    id: 'ofw_murder', month: 9, priority: 6, category: 'diplomacy', title: 'Si Liza', location: 'Department of Migrant Workers',
    body: ['Liza Ranola, a 35-year-old domestic worker, is found dead in a desert outside a Gulf city, burned. Her employer’s teenage son is arrested. Her body comes home in a sealed box.', 'The country is in mourning and in fury.'],
    choices: [
      { id: 'ofw_ban', label: 'Impose a deployment ban to that country', description: 'Until they sign a new labor agreement.', outcome: 'The ban hurts 30,000 workers who wanted to go. After four months, the host country signs a new agreement.', headline: 'DEPLOYMENT BAN AFTER OFW’S MURDER', effects: { stats: { approval: 4, unemployment: 0.1 } } },
      { id: 'ofw_justice', label: 'Send a special envoy and lawyers to pursue justice', description: 'Keep the jobs, demand the verdict.', outcome: 'The teenager is convicted — to 15 years. Families say that is not enough.', effects: { spend: 1, spendLabel: 'Legal assistance abroad', stats: { approval: 2 } } },
    ],
  },
  {
    id: 'lavish_lifestyle', month: 10, priority: 6, category: 'media', title: 'Ang Marangyang Buhay', location: 'Social media',
    body: ['A viral video shows your family’s birthday party at the Palasyo: a live orchestra, imported wagyu, designer bags as party favors. Estimated cost: ₱12 million. The same week, a family in Tondo-by-the-Bay is filmed eating reheated garbage (“pagpag”).'],
    variants: [{ when: [{ flag: 'family_dynasty' }], text: 'Your relatives who took party posts are in every frame.' }],
    choices: [
      { id: 'lavish_apologize', label: 'Apologize and donate the cost to feeding programs', description: 'Own it.', outcome: 'The apology helps. The video keeps circulating.', headline: 'PRESIDENT APOLOGIZES FOR LAVISH PARTY', effects: { spend: 0.012, spendLabel: 'Personal donation', stats: { approval: -2, family: -4, media: -2 } } },
      { id: 'lavish_private', label: '“It was paid with private money”', description: 'None of it was public funds.', outcome: 'Reporters start asking where the private money came from.', headline: '“PRIVATE MONEY” — FROM WHERE?', effects: { stats: { approval: -5, media: 6, ombudsman: 4 } } },
      { id: 'lavish_attack', label: 'Attack the “elitist media” that ignores the poor', description: 'Turn it around.', outcome: 'It works with your base. Everyone else sees a President defending wagyu.', effects: { stats: { approval: -4, media: 8 } } },
    ],
  },
  {
    id: 'hazing_death', month: 10, priority: 3, category: 'society', title: 'Hazing', location: 'University hospital',
    body: ['A first-year law student, Horacio Castillo-Ramos, dies after a fraternity initiation. The fraternity’s alumni include two senators and a Cabinet undersecretary, who are accused of helping cover it up.'],
    choices: [
      { id: 'hazing_prosecute', label: 'Prosecute everyone involved, including the alumni', description: 'No fraternity is above the law.', outcome: 'Twelve members and three alumni are charged.', headline: 'HAZING: ALUMNI CHARGED IN COVER-UP', effects: { stats: { approval: 3 }, senateShift: { from: 'neutral', to: 'opposition', count: 1 } } },
      { id: 'hazing_members', label: 'Charge only the members who were there', description: 'Leave the powerful alumni out.', outcome: 'The parents say you protected the powerful.', effects: { stats: { approval: -2 } } },
    ],
  },
  {
    id: 'pork_queen', month: 11, priority: 7, category: 'scandal', title: 'Ang Reyna ng Pork', location: 'Department of Justice',
    body: ['Businesswoman Divina Lim-Nazareno is arrested for running fake NGOs that funneled ₱10 billion of legislators’ “pork barrel” funds into her companies. She offers a tell-all affidavit: 17 senators and 80 congressmen, from every party — including yours.'],
    choices: [
      { id: 'pork_state_witness', label: 'Make her a state witness and file every case', description: 'Let the list fall where it falls.', outcome: 'The affidavit is released. Three allied senators are charged. Your coalition is in shock; the public is ecstatic.', headline: 'PORK QUEEN NAMES 97 LAWMAKERS', effects: { stats: { corruption: -8, approval: 6, cohesion: -12 }, senateShift: { from: 'ally', to: 'opposition', count: 2 }, houseShift: -10, flags: { pork_list_released: true } } },
      { id: 'pork_opposition_only', label: 'Release only the opposition names', description: 'A weapon, not a cleanup.', outcome: 'Opposition senators are charged. Then her lawyer leaks the full list.', headline: 'FULL PORK LIST LEAKED — PALASYO HID ALLIES’ NAMES', effects: { stats: { corruption: 6, media: 10, approval: -5, ombudsman: 8 }, flags: { impeachable_offense: true } } },
      { id: 'pork_bury', label: 'Keep the affidavit sealed', description: 'Too destabilizing.', outcome: 'She is found dead in her cell three months later. “Heart attack,” says the prison doctor.', headline: 'PORK QUEEN DIES IN DETENTION', effects: { stats: { corruption: 8, approval: -7, media: 10, ombudsman: 10 } } },
    ],
  },
  {
    id: 'volcano', month: 11, priority: 6, category: 'calamity', title: 'Bulkang Kanlayon', location: 'Kanlurang Visara',
    body: ['Mount Kanlayon erupts. Ash covers four provinces; 90,000 people must evacuate for months. Sugar plantations are buried.'],
    choices: [
      { id: 'volcano_full', label: 'Long-term relocation: ₱14B', description: 'New homes outside the danger zone.', outcome: 'Relocation sites rise — far from farms and jobs. Many families drift back to the volcano.', effects: { spend: 14, spendLabel: 'Kanlayon relocation', stats: { approval: 2 } } },
      { id: 'volcano_temp', label: 'Temporary evacuation and cash aid: ₱5B', description: 'Wait it out.', outcome: 'Evacuees spend five months in gymnasiums. Disease spreads.', effects: { spend: 5, spendLabel: 'Kanlayon evacuation', stats: { approval: -2 } } },
    ],
  },

  // ═════════════════════════ YEAR 2 ═════════════════════════
  {
    id: 'journalist_killed', month: 12, priority: 6, category: 'crisis', title: 'Pinatay ang Brodkaster', location: 'Maynilad',
    body: ['Radio commentator Percival “Kuya Percy” Lapaz, a fierce critic of corruption in the prisons bureau, is shot dead in his car. The gunman confesses: the order came from inside the national penitentiary — allegedly from the Director of Prisons himself.'],
    choices: [
      { id: 'journalist_arrest', label: 'Suspend the prisons chief and let NBI take over', description: 'Follow the trail upward.', outcome: 'The Director is charged with murder. He was appointed by you on the recommendation of an allied senator.', headline: 'PRISONS CHIEF CHARGED IN BROADCASTER’S MURDER', effects: { stats: { media: -8, approval: 3, cohesion: -3 } } },
      { id: 'journalist_protect', label: 'Wait for “solid evidence” before acting', description: 'He is an ally’s man.', outcome: 'Two witnesses die in custody while you wait.', headline: 'WITNESSES DIE AS PALASYO WAITS', effects: { stats: { media: 15, approval: -7, ombudsman: 8 }, flags: { obstruction: true } } },
    ],
  },
  {
    id: 'savings_realignment', month: 12, priority: 5, category: 'economy', title: 'Ang “Savings”', location: 'Budget Department',
    body: ['Your Budget Secretary, {sec:budget}, proposes a clever idea: declare ₱150 billion of slow-moving appropriations as “savings” and realign them to your priority projects — without asking Congress.', 'It is fast. It may also be unconstitutional: only Congress holds the power of the purse.'],
    choices: [
      { id: 'realign_yes', label: 'Do it — the people can’t wait for Congress', description: 'Declare savings, fund your projects.', outcome: '₱150 billion flows to your projects within weeks. Lawyers file petitions within days.', headline: '₱150B “SAVINGS” REALIGNED BY PALASYO', effects: { stats: { growth: 0.3, approval: 3, courtTension: 6 }, flags: { savings_realigned: true }, schedule: [{ event: 'dap_court', inMonths: 8 }] } },
      { id: 'realign_congress', label: 'Ask Congress for a supplemental budget', description: 'The proper way — and the slow way.', outcome: 'Congress demands its own projects in exchange.', effects: { budgetChange: 40, stats: { cohesion: 3, corruption: 2 } } },
      { id: 'realign_no', label: 'No — spend only what Congress approved', description: 'Constitutional caution.', outcome: 'Your projects wait. The Constitution is safe.', effects: { stats: { courtTension: -2 } } },
    ],
  },
  {
    id: 'onion_crisis', month: 13, priority: 4, category: 'economy', title: 'Sibuyas', location: 'Wet markets',
    body: ['Onions now cost ₱700 a kilo — more than beef. Flight attendants are caught smuggling onions in their luggage. A cartel controls cold storage and import permits.'],
    choices: [
      { id: 'onion_raid', label: 'Raid the cold-storage warehouses', description: 'Break the cartel.', outcome: 'Tons of hoarded onions are found and sold at cost. The cartel’s lawyers sue.', headline: 'RAIDS UNCOVER HOARDED ONIONS', effects: { stats: { inflation: -0.3, approval: 4, investor: -2 } } },
      { id: 'onion_import', label: 'Issue emergency import permits', description: 'Flood the market — permits to whom, though?', outcome: 'The permits go to three companies. Two of them are cartel fronts.', effects: { stats: { inflation: -0.2, corruption: 3 } } },
    ],
  },
  {
    id: 'president_threatens', month: 13, priority: 7, category: 'congress', title: 'Ang Banta', location: 'Your study',
    body: ['Twelve senators and forty representatives keep blocking your bills. Your Executive Secretary suggests a different kind of persuasion: “Every one of them has something. Tax records. Land titles. Old cases. We just have to let them know we know.”'],
    choices: [
      { id: 'threaten_audits', label: 'Order tax audits of those who oppose you', description: 'Let them feel the heat.', outcome: 'Within weeks, eight opponents discover the Bureau of Internal Revenue is auditing them. Five switch sides. Three go to the press.', headline: 'OPPOSITION SOLONS: PALASYO USING BIR AGAINST US', reactions: [{ who: 'Opposition senators', text: 'This is how dictatorships begin.', mood: 'neg' }], effects: { stats: { capital: 8, media: 12, ombudsman: 10, courtTension: 4 }, senateShift: { from: 'opposition', to: 'neutral', count: 2 }, houseShift: 8, flags: { ordered_audits: true, impeachable_offense: true } } },
      { id: 'threaten_quietly', label: 'Let them know — quietly — that you “know things”', description: 'No formal action. Just whispers.', outcome: 'A few legislators soften. One records the conversation.', effects: { stats: { capital: 4 }, houseShift: 4, flags: { whisper_threats: true }, schedule: [{ event: 'threat_recording', inMonths: 5 }] } },
      { id: 'threaten_no', label: 'Refuse — “We persuade, we don’t threaten”', description: 'Win votes honestly.', outcome: 'Slower. Cleaner.', effects: { stats: { corruption: -1 } } },
    ],
  },
  {
    id: 'threat_recording', category: 'scandal', title: 'Ang Recording', location: 'Opposition press conference',
    body: ['An opposition congressman plays a recording of your aide saying: “The President knows about your land in Bikolandia. It would be a shame if the BIR found out too.”'],
    choices: [
      { id: 'recording_fire', label: 'Fire the aide and deny involvement', description: 'The aide acted alone.', outcome: 'Few believe the aide acted alone.', effects: { stats: { approval: -4, media: 8, ombudsman: 6 } } },
      { id: 'recording_deny', label: 'Call the recording fake', description: 'Deny everything.', outcome: 'The aide, fired anyway, confirms it is real on a talk show.', effects: { stats: { approval: -7, media: 12 }, flags: { impeachable_offense: true } } },
    ],
  },
  {
    id: 'dengue_outbreak', month: 14, priority: 5, category: 'society', title: 'Dengue', location: 'Overflowing public hospitals',
    body: ['A dengue epidemic fills hospital hallways with children. Vaccination rates are at record lows since the old vaccine scandal of the 2010s destroyed trust. Measles is returning too.'],
    choices: [
      { id: 'dengue_emergency', label: 'Declare a national epidemic; ₱7B for hospitals and fogging', description: 'All hands.', outcome: 'Tent wards go up outside hospitals. The death rate falls.', effects: { spend: 7, spendLabel: 'Dengue response', stats: { approval: 3 } } },
      { id: 'dengue_vaccine_trust', label: 'Launch a campaign to rebuild vaccine trust', description: 'Long-term.', outcome: 'Doctors and priests appear together in ads. Vaccination rates slowly climb.', effects: { spend: 2, spendLabel: 'Vaccine confidence campaign', stats: { church: 2 } } },
    ],
  },
  {
    id: 'vp_confidential_funds', month: 14, when: [{ vpAlly: true }], priority: 6, category: 'scandal', title: 'Ang ₱125 Milyon sa 11 Araw', location: 'House Committee on Good Government',
    body: ['COA reports that the Office of the Vice President spent ₱125 million in confidential funds in 11 days. Receipts are signed by people with names like “Mary Grace Piattos” — who do not exist.', 'House allies want to summon Vice President {vp}. The VP asks you to stop them.'],
    choices: [
      { id: 'vpfunds_protect', label: 'Protect the VP — stop the hearings', description: 'Loyalty to your strongest ally.', outcome: 'The hearings are cancelled. The VP is grateful. The public is not.', headline: 'PALASYO BLOCKS PROBE OF VP FUNDS', effects: { stats: { approval: -4, corruption: 5 }, flags: { vp_loyalty: 'deep', protected_vp: true } } },
      { id: 'vpfunds_allow', label: 'Let the House investigate', description: 'No one is above accountability.', outcome: 'The VP testifies, badly. Relations between you cool noticeably.', headline: 'VP GRILLED OVER ₱125M', effects: { stats: { corruption: -3, approval: 2 }, flags: { vp_loyalty: 'tested', vp_rift_seed: true } } },
      { id: 'vpfunds_abolish', label: 'Abolish confidential funds for civilian offices — including yours', description: 'Remove the temptation.', outcome: 'A clean, popular reform. The VP feels singled out anyway.', headline: 'CONFIDENTIAL FUNDS SCRAPPED FOR CIVILIAN OFFICES', effects: { stats: { corruption: -4, approval: 3, military: -2 }, flags: { vp_rift_seed: true } } },
    ],
  },
  {
    id: 'magnetic_lifters', month: 14, priority: 4, category: 'scandal', title: 'Mga Magnetic Lifter', location: 'Port of Maynilad',
    body: ['Four industrial magnetic lifters that cleared customs last month were hollow. Inside: an estimated ₱11 billion in shabu, now on the streets. The customs officials who cleared them were promoted — by your appointee.'],
    choices: [
      { id: 'lifters_purge', label: 'Purge the Bureau of Customs', description: 'Replace 300 officials.', outcome: 'The purge is chaotic; the port slows for weeks. Smuggling drops.', effects: { stats: { corruption: -4, crime: -2, growth: -0.1 } } },
      { id: 'lifters_military', label: 'Put retired generals in charge of customs', description: 'Discipline over expertise.', outcome: 'The generals are honest and clueless. Critics warn of militarization.', effects: { stats: { military: 4, corruption: -2, media: 4 }, flags: { militarization: 1 } } },
    ],
  },
  {
    id: 'governor_assassinated', month: 15, priority: 7, category: 'crisis', title: 'Pinaslang ang Gobernador', location: 'Kanlurang Visara',
    body: ['Governor Rolando Degala is gunned down in his home with eight others during a public aid distribution. The gunmen are former soldiers. They name their employer: Congressman Arnie Teves-Villar, the governor’s political rival — and a member of your coalition. The congressman is abroad and refuses to come home.'],
    choices: [
      { id: 'gov_terrorist', label: 'Designate him a terrorist and cancel his passport', description: 'Maximum pressure.', outcome: 'He is arrested abroad and deported after a year. Your coalition learns you will not protect killers.', headline: 'FUGITIVE SOLON DESIGNATED TERRORIST', effects: { stats: { approval: 5, crime: -3, cohesion: -4 }, houseShift: -2 } },
      { id: 'gov_expel', label: 'Ask the House to expel him', description: 'Let Congress act.', outcome: 'The House expels him, 265–0. He remains free abroad.', effects: { stats: { approval: 2 } } },
    ],
  },
  {
    id: 'gcta_release', month: 16, priority: 6, category: 'scandal', title: 'Ang Maagang Paglaya', location: 'National Penitentiary',
    body: ['Under a new reading of the Good Conduct Time Allowance law, the prisons bureau has released 1,900 convicts early — including murderers and rapists. One of them, a former mayor convicted of rape and murder, was about to be released when a journalist exposed it. Families of victims are enraged.'],
    choices: [
      { id: 'gcta_rearrest', label: 'Order all 1,900 to surrender within 15 days', description: 'Or be hunted.', outcome: 'Most surrender. Some fight. Police kill 12 who resist. Lawyers say due process was violated.', headline: '1,900 FREED CONVICTS ORDERED BACK', effects: { stats: { approval: 3, crime: -2, courtTension: 6 } } },
      { id: 'gcta_fire', label: 'Fire the prisons chief and review each case', description: 'Proper process.', outcome: 'The review takes a year. The public wanted faster action.', effects: { stats: { approval: 1 } } },
    ],
  },
  {
    id: 'senate_coup', month: 16, priority: 6, category: 'congress', title: 'Kudeta sa Senado', location: 'Senate session hall, 10 p.m.',
    body: ['A late-night session: fifteen senators sign a resolution to replace Senate President {senatePresident}. The rebels’ candidate has quietly been talking to {rival}.'],
    choices: [
      { id: 'coup_back_incumbent', label: 'Rally your senators behind the Senate President', description: 'Call every ally before midnight.', outcome: 'You flip two signatures. The Senate President survives, for now.', effects: { stats: { capital: -5, cohesion: 3 } } },
      { id: 'coup_back_rebel', label: 'Make a deal with the rebels', description: 'Support the new Senate President in exchange for cooperation.', outcome: 'The new Senate President owes you. The old one never forgets.', effects: { stats: { cohesion: 2 }, senateShift: { from: 'neutral', to: 'ally', count: 1 }, senators: { villareal: 'opposition' } } },
      { id: 'coup_stay_out', label: 'Stay out — it is the Senate’s business', description: 'Separation of powers.', outcome: 'The rebels win. The new Senate President is independent and wary of you.', headline: 'SENATE PRESIDENT OUSTED IN MIDNIGHT COUP', effects: { senateShift: { from: 'ally', to: 'neutral', count: 2 } } },
    ],
  },
  {
    id: 'learning_crisis', month: 16, priority: 4, category: 'society', title: '9 sa 10', location: 'Department of Education',
    body: ['An international assessment ranks the Kapuluan near the bottom in reading, math, and science. Nine out of ten 10-year-olds cannot read a simple sentence. Your Education Secretary asks for a radical overhaul.'],
    choices: [
      { id: 'learn_overhaul', label: 'Overhaul the curriculum: fewer subjects, focus on reading and math', description: 'Back to basics.', outcome: 'Teachers welcome it. Textbook publishers lose billions and lobby Congress.', effects: { spend: 5, spendLabel: 'Curriculum overhaul', stats: { approval: 2 } } },
      { id: 'learn_blame', label: 'Blame the previous administration’s curriculum', description: 'Not your fault.', outcome: 'True, and useless.', effects: { stats: { media: 2 } } },
    ],
  },
  {
    id: 'suc_budget_cut', month: 17, priority: 6, category: 'congress', title: 'Zero para sa Pamantasan', location: 'Bicameral conference committee',
    when: [{ resolved: 'budget_2029' }],
    body: ['In the final FY2029 budget, the bicameral committee quietly cut ₱14 billion from state universities — and gave zero subsidy to the national health insurer — to fund ₱40 billion in new district projects.', 'Students and doctors are furious. The budget is on your desk.'],
    choices: [
      { id: 'suc_veto_projects', label: 'Line-item veto the projects and demand a supplemental for schools', description: 'Fight Congress.', outcome: 'Congress is furious. Students cheer. The universities get half their money back in a supplemental.', headline: 'PRESIDENT VETOES ₱40B PROJECTS TO SAVE UNIVERSITIES', effects: { budgetChange: -40, spend: 7, spendLabel: 'State university supplemental', stats: { cohesion: -8, approval: 4 }, houseShift: -5 } },
      { id: 'suc_sign', label: 'Sign it as is', description: 'A budget is a budget.', outcome: 'State universities freeze hiring. Two provincial campuses close. Nurses protest the zero subsidy.', headline: 'STATE UNIVERSITIES, HEALTH INSURER DEFUNDED', effects: { stats: { approval: -5, protest: 10, cohesion: 4 }, flags: { sucs_defunded: true } } },
    ],
  },
  {
    id: 'red_tagging', month: 17, priority: 5, category: 'crisis', title: 'Red-Tagging', location: 'A campus in Gitnang Kapatagan',
    body: ['A military task force posts that a public-school teacher and union leader, Ma’am Liza Dandan, is a “communist terrorist.” A week later, she is shot dead outside her school.'],
    choices: [
      { id: 'redtag_abolish', label: 'Abolish the task force', description: 'Stop the red-tagging.', outcome: 'The military is angered. Teachers and the Church are grateful.', headline: 'PRESIDENT ABOLISHES RED-TAGGING TASK FORCE', effects: { stats: { military: -8, church: 5, approval: 2 } } },
      { id: 'redtag_defend', label: 'Defend the task force — “counter-insurgency works”', description: 'Back the soldiers.', outcome: 'Human-rights groups file cases in the Supreme Court and abroad.', effects: { stats: { military: 5, courtTension: 6, media: 6, approval: -3 } } },
    ],
  },
  {
    id: 'senator_death', month: 17, priority: 5, category: 'congress', title: 'Paalam, Senador', location: 'Senate',
    body: ['Senator Crisanto Villareal — four decades in the Senate, the great operator — dies of a heart attack in his office. Under the Constitution, his seat stays empty until the next election. The Senate is one vote smaller.'],
    choices: [
      { id: 'senator_state_funeral', label: 'Give him a state funeral with full honors', description: 'Respect the institution.', outcome: 'Senators from every party attend. The gesture is noticed.', effects: { stats: { cohesion: 3 }, senators: { villareal: 'neutral' } } },
      { id: 'senator_quiet', label: 'Send a wreath', description: 'He was not your ally.', outcome: 'His protégés — and his daughter — take note.', effects: { senators: { villareal: 'neutral' }, stats: { cohesion: -2 } } },
    ],
  },
  {
    id: 'intl_court_warrant', month: 18, priority: 8, category: 'diplomacy', title: 'Ang Warrant mula sa Hague', location: 'Interpol liaison office',
    body: ['The International Criminal Tribunal issues an arrest warrant for former President Ramon Dela Paz for crimes against humanity: the killing of thousands in his “Oplan Tokhang” drug war. Interpol asks the Republic to arrest and surrender him.', 'The PBL says any surrender would be treason. The victims’ families say they have waited ten years.'],
    variants: [{ when: [{ flag: 'delapaz_arrested' }], text: 'He is already in your custody on plunder charges.' }],
    choices: [
      { id: 'icc_surrender', label: 'Arrest him and put him on a plane to The Hague', description: 'Honor international law.', outcome: 'Dela Paz is flown to The Hague within 24 hours. His supporters flood the streets. The victims’ families weep with relief.', headline: 'DELA PAZ FLOWN TO THE HAGUE', reactions: [{ who: 'Sen. Ramon “Jun-Jun” Dela Paz Jr.', text: 'You sold a Kapuluan president to foreigners. You will pay.', mood: 'neg' }, { who: 'Victims’ families', text: 'Salamat. Sa wakas.', mood: 'pos' }], effects: { stats: { approval: 3, protest: 12, military: -6, courtTension: 5, church: 6 }, flags: { delapaz_surrendered: true }, senateShift: { from: 'neutral', to: 'opposition', count: 2 }, houseShift: -10 } },
      { id: 'icc_refuse', label: 'Refuse — “We have our own courts”', description: 'Sovereignty.', outcome: 'The PBL is grateful. Human-rights groups abroad call you an accomplice.', headline: 'PALASYO REFUSES TO SURRENDER DELA PAZ', effects: { stats: { cohesion: 5, church: -5, investor: -2 }, houseShift: 5 } },
      { id: 'icc_flee', label: 'Look away while he leaves the country', description: 'Let him flee — problem solved.', outcome: 'He boards a private jet to a friendly country. Both sides accuse you of betrayal.', headline: 'DELA PAZ FLEES — PALASYO “DID NOT KNOW”', effects: { stats: { approval: -5, media: 10, corruption: 4 } } },
    ],
  },
  {
    id: 'health_fund_transfer', month: 18, priority: 6, category: 'economy', title: 'Ang Pondo ng Kalusugan', location: 'Department of Finance',
    body: ['Your Finance Secretary proposes “sweeping” ₱90 billion in “excess reserves” from the national health insurer into the general fund to cover the deficit. Doctors say the money belongs to members — and should pay for their care.'],
    choices: [
      { id: 'sweep_yes', label: 'Sweep the funds', description: 'Plug the deficit now.', outcome: 'The deficit narrows. Health groups file a case in the Supreme Court within a week.', headline: '₱90B HEALTH FUNDS SWEPT INTO TREASURY', effects: { income: 90, spendLabel: 'Health insurer fund transfer', stats: { approval: -4, courtTension: 5 }, flags: { health_funds_swept: true }, schedule: [{ event: 'court_health_fund', inMonths: 6 }] } },
      { id: 'sweep_no', label: 'Leave the funds for patients', description: 'Expand benefits instead.', outcome: 'Benefits expand. The deficit stays.', effects: { stats: { approval: 2 } } },
    ],
  },
  {
    id: 'power_blackout', month: 19, priority: 5, category: 'crisis', title: 'Blackout', location: 'Visara grid',
    body: ['A cascade failure blacks out all of Visara for four days. Hospitals run on generators; water pumps stop. The grid operator — partly Haizhou-owned — says it was “technical.” Security analysts are not sure.'],
    variants: [{ when: [{ flag: 'grid_nationalized' }], text: 'You nationalized the grid. This time, there is no one else to blame.' }],
    choices: [
      { id: 'blackout_probe', label: 'Investigate possible sabotage', description: 'Security first.', outcome: 'Investigators find a remote-access backdoor in the control system. Haizhou denies everything.', headline: 'BACKDOOR FOUND IN GRID CONTROLS', effects: { stats: { sovereignty: 6, investor: -3 } } },
      { id: 'blackout_restore', label: 'Focus on restoring power; ₱6B emergency repairs', description: 'People first.', outcome: 'Power returns. Questions remain.', effects: { spend: 6, spendLabel: 'Grid emergency repairs', stats: { approval: 1 } } },
    ],
  },
  {
    id: 'spouse_jet', month: 19, priority: 5, category: 'family', title: 'Ang Eroplano', location: 'Air Force base',
    body: ['Photos surface: your spouse used an Air Force jet for a weekend shopping trip to a neighboring capital. The Palasyo says it was an “official visit.” The shopping bags say otherwise.'],
    choices: [
      { id: 'jet_reimburse', label: 'Reimburse the cost and apologize', description: '₱4 million from your own pocket.', outcome: 'The apology is accepted, mostly.', effects: { stats: { approval: -2, family: -3 } } },
      { id: 'jet_defend', label: 'Defend it as an official trip', description: 'Protect your spouse.', outcome: 'The Senate asks for the itinerary. There is no itinerary.', headline: '“OFFICIAL VISIT” HAD NO OFFICIAL MEETINGS', effects: { stats: { approval: -5, media: 8, family: 5, ombudsman: 5 } } },
    ],
  },
  {
    id: 'riding_in_tandem', month: 20, priority: 4, category: 'crisis', title: 'Riding-in-Tandem', location: 'Maynilad streets',
    body: ['Motorcycle-riding gunmen have killed 40 people in two months — businessmen, a judge, a barangay captain. The police propose banning male back-riders on motorcycles.'],
    choices: [
      { id: 'tandem_ban', label: 'Ban male back-riders', description: 'Simple and visible.', outcome: 'Millions of commuting fathers and sons are inconvenienced. The killings continue with solo riders.', effects: { stats: { approval: -2, crime: -1 } } },
      { id: 'tandem_intel', label: 'Fund an intelligence task force against hired killers', description: 'Target the gun-for-hire networks.', outcome: 'Three syndicates are dismantled. The killings drop.', effects: { spend: 3, spendLabel: 'Anti-gun-for-hire task force', stats: { crime: -4, approval: 2 } } },
    ],
  },
  {
    id: 'ofw_levant', month: 20, priority: 6, category: 'diplomacy', title: 'Digmaan sa Levant', location: 'Department of Migrant Workers',
    body: ['War spreads in the Levant. 30,000 Kapuluan workers are trapped; some are caregivers who refuse to leave their elderly employers. Airports are closed.'],
    choices: [
      { id: 'levant_evac', label: 'Send navy ships and chartered buses: ₱6B', description: 'Get them out overland and by sea.', outcome: 'Twenty thousand come home. Four OFWs are killed before they can reach the ships.', effects: { spend: 6, spendLabel: 'Levant evacuation', stats: { approval: 4, military: 3 } } },
      { id: 'levant_wait', label: 'Advise them to shelter and wait', description: 'Evacuation is too dangerous.', outcome: 'A missile strike kills nine caregivers. Their families camp outside the Palasyo.', headline: 'NINE OFWS KILLED IN LEVANT', effects: { stats: { approval: -7, protest: 6 } } },
    ],
  },
  {
    id: 'teachers_strike', month: 20, priority: 4, category: 'society', title: 'Welga ng Guro', location: 'Public schools nationwide',
    body: ['Teachers walk out nationwide: they are forced to do clerical work, election duty, and buy their own supplies — for pay below the poverty line in some regions.'],
    variants: [{ when: [{ flag: 'law_bill_teacher_pay' }], text: 'The raise you signed has not reached them yet — the Budget department is still “processing” it.' }],
    choices: [
      { id: 'teach_deal', label: 'Meet them: remove clerical work and release allowances', description: '₱8B.', outcome: 'Classes resume after a week.', effects: { spend: 8, spendLabel: 'Teacher allowances', stats: { approval: 3, protest: -5 } } },
      { id: 'teach_nowork', label: 'Declare the strike illegal — no work, no pay', description: 'Government workers cannot strike.', outcome: 'The strike spreads. Parents side with the teachers.', headline: 'TEACHERS DEFY “NO WORK, NO PAY”', effects: { stats: { approval: -6, protest: 12 } } },
    ],
  },
  {
    id: 'dap_court', category: 'court', title: 'Korte Suprema: Ang “Savings”', location: 'Kataas-taasang Hukuman',
    when: [{ flag: 'savings_realigned' }],
    body: ['The Supreme Court rules on the petitions against your realignment of ₱150 billion in “savings.”'],
    court: { title: 'Budget Watch v. Budget Secretary (realignment of “savings”)', kind: 'executive', soundness: 0.25, onStrike: { stats: { capital: -8, approval: -3, courtTension: 5 }, flags: { savings_unconstitutional: true } }, onUphold: { stats: { capital: 5 } } },
    choices: [
      { id: 'dap_comply', label: 'Accept the ruling and stop the realignments', description: 'Respect the Court.', when: [{ ruling: 'struck' }], outcome: 'Projects funded by the realignment freeze. Opposition lawyers begin drafting an impeachment complaint on “culpable violation of the Constitution.”', headline: 'SC: PALASYO “SAVINGS” SCHEME UNCONSTITUTIONAL', effects: { stats: { courtTension: -3 }, flags: { impeachable_offense: true } } },
      { id: 'dap_defy', label: 'Say the ruling “does not apply” to completed projects', description: 'Keep spending.', when: [{ ruling: 'struck' }], outcome: 'The Chief Justice warns of a constitutional crisis.', headline: 'CONSTITUTIONAL CRISIS LOOMS OVER “SAVINGS”', effects: { stats: { courtTension: 15, media: 10 }, flags: { impeachable_offense: true, defied_court: true } } },
      { id: 'dap_won', label: 'Welcome the ruling', description: 'The realignment stands.', when: [{ ruling: 'upheld' }], outcome: 'A narrow win — the dissents are scathing.', effects: { stats: { capital: 3 } } },
    ],
  },
  {
    id: 'earthquake', month: 21, priority: 8, category: 'calamity', title: 'Lindol', location: 'Sugbu City',
    body: ['A magnitude 7.1 earthquake strikes Sugbu City at 10 a.m. on a school day. Three schools collapse. The death toll rises past 300 — 84 of them children. The collapsed schools were built by a contractor with political connections.'],
    choices: [
      { id: 'quake_all_in', label: 'Full mobilization and ₱30B for rebuilding with strict standards', description: 'Everything, and investigate the schools.', outcome: 'Rescuers work for a week. The contractor is arrested.', headline: '₱30B FOR SUGBU; SCHOOL CONTRACTOR ARRESTED', effects: { spend: 30, spendLabel: 'Sugbu earthquake response', stats: { approval: 5, corruption: -2 } } },
      { id: 'quake_limited', label: 'Standard response: ₱8B', description: 'Local government leads.', outcome: 'Aftershocks, tents, and anger that the collapsed-school contractor is still working.', effects: { spend: 8, spendLabel: 'Sugbu earthquake response', stats: { approval: -4, protest: 5 } } },
    ],
  },
  {
    id: 'vp_rift', month: 21, priority: 7, category: 'cabinet', title: 'Ang Lamat', location: 'Office of the Vice President',
    when: [{ vpAlly: true }, { any: [{ flag: 'vp_rift_seed' }, { flag: 'vp_loyalty', is: 'tested' }, { flag: 'endorsed_vp', not: true }] }],
    body: ['Vice President {vp} skips two Cabinet meetings. VP allies are telling reporters the VP will run in 2033 whether you endorse it or not — and that the VP “disagrees with the direction of the administration.”', 'Your advisers are split: some say the VP is already building a rival camp.'],
    choices: [
      { id: 'rift_mend', label: 'Invite the VP to a private dinner and mend it', description: 'Save the alliance.', outcome: 'You talk until midnight. The VP stays — with more authority and a promise of your support in 2033.', headline: undefined, effects: { stats: { cabinetCohesion: 4 }, flags: { endorsed_vp: true, vp_rift: 'mended' } } },
      { id: 'rift_freeze', label: 'Freeze the VP out', description: 'No more briefings, no more budget.', outcome: 'The VP’s office budget is cut by 60% in the next budget. The VP goes public.', headline: 'VP’S BUDGET SLASHED; “POLITICAL VENDETTA,” SAYS VP', effects: { stats: { media: 6 }, flags: { vp_rift: 'open', vp_is_ally: false }, schedule: [{ event: 'vp_threat', inMonths: 6 }] } },
      { id: 'rift_ignore', label: 'Ignore it', description: 'VPs always get restless.', outcome: 'The drift continues.', effects: { flags: { vp_rift: 'drifting' }, schedule: [{ event: 'vp_threat', inMonths: 6 }] } },
    ],
  },
  {
    id: 'people_initiative', month: 22, priority: 5, category: 'scandal', title: '₱100 Bawat Pirma', location: 'Barangay halls',
    body: ['Allies launch a “people’s initiative” to amend the Constitution — to shift to a parliamentary system that would let you stay in power as Prime Minister. Reporters find people were paid ₱100 per signature, and some did not know what they were signing.'],
    choices: [
      { id: 'pi_disown', label: 'Disown the initiative', description: '“I have no interest in staying beyond my term.”', outcome: 'The initiative collapses. Your allies feel abandoned.', headline: 'PRESIDENT DISOWNS CHARTER CHANGE DRIVE', effects: { stats: { approval: 3, cohesion: -4 } } },
      { id: 'pi_support', label: 'Support it — the Constitution is outdated', description: 'Push charter change.', outcome: 'The Senate unanimously resolves to block it. The Church calls it a power grab. Street protests begin.', headline: 'CHA-CHA POWER GRAB, CRIES SENATE', effects: { stats: { approval: -7, protest: 15, church: -8, courtTension: 8 }, flags: { term_extension_attempt: true, impeachable_offense: true }, senateShift: { from: 'neutral', to: 'opposition', count: 3 } } },
    ],
  },
  {
    id: 'mother_dies', month: 22, priority: 6, category: 'family', title: 'Paalam, Nanay', location: '{home}',
    body: ['Your mother dies in her sleep. The nation sends condolences; your family gathers for the first time in years.'],
    variants: [
      { when: [{ flag: 'brother_angry' }], text: 'Carlito comes to the wake. He stands across the coffin from you and does not speak.' },
      { when: [{ flag: 'brother_reconciled' }], text: 'Carlito holds your hand through the funeral mass.' },
    ],
    choices: [
      { id: 'mom_private', label: 'A private family funeral', description: 'Grieve as a child, not a President.', outcome: 'The nation respects your privacy. Your family is grateful.', effects: { stats: { family: 12, approval: 2 } } },
      { id: 'mom_state', label: 'A national day of mourning', description: 'Honor her publicly.', outcome: 'Critics call a national holiday for a private citizen excessive.', effects: { stats: { family: 5, media: 4, approval: -1 } } },
      { id: 'mom_reconcile', label: 'Use the moment to reconcile with your brother', description: 'Your mother would have wanted it.', when: [{ flag: 'brother_angry' }], outcome: 'At the cemetery, Carlito finally embraces you.', effects: { stats: { family: 18 }, flags: { brother_angry: false, brother_reconciled: true } } },
    ],
  },
  {
    id: 'pastor_standoff', month: 23, priority: 6, category: 'crisis', title: 'Ang Kompound ng Pastor', location: 'Davira City',
    body: ['Televangelist Pastor Apolinario Quimbo — “the Appointed Son of God” to his two million followers, and a close friend of Dela Paz — is wanted in the Kapuluan and abroad for child trafficking. He is hiding in his 30-hectare compound. His followers form human barricades.'],
    choices: [
      { id: 'pastor_siege', label: 'Order a police siege until he surrenders', description: 'Enforce the warrant.', outcome: 'A 16-day siege with 2,000 police. Tunnels are found. He surrenders. His followers vow revenge at the polls.', headline: 'PASTOR QUIMBO ARRESTED AFTER 16-DAY SIEGE', effects: { stats: { approval: 3, church: 2, protest: 6 }, houseShift: -3 } },
      { id: 'pastor_negotiate', label: 'Negotiate a quiet surrender', description: 'Avoid bloodshed.', outcome: 'He surrenders after two months — on his terms, and to a police general of his choosing.', effects: { stats: { approval: -1 } } },
      { id: 'pastor_leave', label: 'Leave him alone — two million votes', description: 'He is politically useful.', outcome: 'Victims’ testimonies air on every channel. You are seen as his protector.', headline: 'PALASYO PROTECTING PASTOR?', effects: { stats: { approval: -6, media: 10, church: -4 } } },
    ],
  },

  // ═════════════════════════ YEAR 3 ═════════════════════════
  {
    id: 'cj_quo_warranto', month: 24, priority: 7, category: 'court', title: 'Tanggalin ang Punong Mahistrado?', location: 'Palasyo strategy meeting',
    when: [{ stat: 'courtTension', gte: 30 }],
    body: ['The Court has ruled against you again. Your Solicitor General proposes a novel weapon: a quo warranto petition claiming Chief Justice Arcilla-Navarro was never validly appointed because of missing asset declarations — removing her without impeachment. House allies prefer impeaching her outright.'],
    choices: [
      { id: 'cj_quo', label: 'File the quo warranto petition', description: 'Let the other justices remove her.', outcome: 'The Court votes 8–6 to remove its own Chief Justice. Legal scholars call it the darkest day of the judiciary. You now choose the next Chief Justice — and every judge in the country has learned a lesson.', headline: 'CHIEF JUSTICE OUSTED VIA QUO WARRANTO', effects: { stats: { courtTension: 20, media: 15, approval: -5, capital: 5 }, flags: { cj_ousted: true, impeachable_offense: true } } },
      { id: 'cj_impeach', label: 'Have the House impeach her', description: 'The constitutional route.', outcome: 'The House impeaches her; the Senate trial becomes a months-long spectacle that paralyzes legislation.', effects: { stats: { courtTension: 15, capital: -8, media: 8 }, flags: { cj_impeached: true } } },
      { id: 'cj_leave', label: 'Leave the Court alone', description: 'Accept that you will sometimes lose.', outcome: 'You lose some cases. You keep the Republic’s institutions intact.', headline: undefined, effects: { stats: { courtTension: -8 } } },
    ],
  },
  {
    id: 'president_health', month: 24, priority: 6, category: 'family', title: 'Bumagsak ang Pangulo', location: 'A public event in Iloilanan',
    body: ['You collapse on stage during a speech. Doctors diagnose a heart condition requiring surgery. Your spokesperson asks: what should we tell the country?'],
    choices: [
      { id: 'health_disclose', label: 'Disclose everything', description: 'The Constitution requires it for serious illness.', outcome: 'The surgery goes well. Your honesty is respected. The VP’s allies quietly begin preparing “just in case.”', effects: { stats: { approval: 3, capital: -4 } } },
      { id: 'health_hide', label: 'Say it was dehydration', description: 'Avoid looking weak.', outcome: 'A nurse leaks your medical file. The cover-up becomes a bigger story than the illness.', headline: 'LEAKED FILE: PRESIDENT HID HEART SURGERY', effects: { stats: { approval: -6, media: 10 }, flags: { hid_illness: true } } },
    ],
  },
  {
    id: 'court_health_fund', category: 'court', title: 'Korte Suprema: Ang Pondo ng Kalusugan', location: 'Kataas-taasang Hukuman',
    when: [{ flag: 'health_funds_swept' }],
    body: ['The Supreme Court rules on the transfer of ₱90 billion in health-insurance funds to the national Treasury.'],
    court: { title: 'Doctors for Health v. Secretary of Finance (health fund transfer)', kind: 'economic', soundness: 0.3, onStrike: { spend: 60, spendLabel: 'Health funds returned per SC ruling', stats: { approval: -2 } }, onUphold: { stats: { capital: 3 } } },
    choices: [
      { id: 'hf_return', label: 'Return the money', description: 'Comply.', when: [{ ruling: 'struck' }], outcome: 'The remaining funds are returned. The deficit widens again.', headline: 'SC ORDERS HEALTH FUNDS RETURNED', effects: {} },
      { id: 'hf_upheld', label: 'The transfer stands', description: 'Proceed.', when: [{ ruling: 'upheld' }], outcome: 'Health advocates vow to campaign against your slate.', effects: { stats: { approval: -1 } } },
    ],
  },
  {
    id: 'bangsa_postpone', month: 24, priority: 4, category: 'election', title: 'Ipagpaliban ang Halalan sa Bangsa Lanao?', location: 'Bangsa Lanao',
    body: ['The first parliamentary elections of the Bangsa Lanao autonomous region are due. Your allies there are losing to former rebel commanders. They ask you to certify a bill postponing the elections by three years.'],
    choices: [
      { id: 'bangsa_hold', label: 'Hold the elections on schedule', description: 'Honor the peace agreement.', outcome: 'Former rebels win a majority. The peace process deepens; your allies lose.', effects: { stats: { tribes: 6, sovereignty: 0 }, houseShift: -2 } },
      { id: 'bangsa_postpone_yes', label: 'Postpone them', description: 'Keep your allies in charge.', outcome: 'Former commanders warn the peace deal is being betrayed. Clashes erupt in two provinces.', headline: 'BANGSA LANAO POLLS POSTPONED; CLASHES ERUPT', effects: { stats: { tribes: -12, crime: 5, military: 3, courtTension: 5 } } },
    ],
  },
  {
    id: 'insurgency_ambush', month: 25, priority: 6, category: 'crisis', title: 'Pananambang', location: 'Mountains of Bikolandia',
    body: ['Guerrillas of the Bagong Hukbo ambush an army convoy, killing twelve soldiers. The generals demand an all-out offensive. The Church and Norway-like mediators urge you to reopen peace talks.'],
    choices: [
      { id: 'insurg_war', label: 'All-out war', description: 'Crush the insurgency.', outcome: 'Aerial bombing in the mountains displaces 20,000 civilians.', headline: 'ALL-OUT WAR VS GUERRILLAS', effects: { spend: 10, spendLabel: 'Counter-insurgency offensive', stats: { military: 10, church: -6, tribes: -5, approval: 2 } } },
      { id: 'insurg_talks', label: 'Reopen peace talks', description: 'End a 60-year war at the table.', outcome: 'The generals feel betrayed. The talks begin in a neutral country.', headline: 'PEACE TALKS REOPEN', effects: { stats: { military: -8, church: 6, approval: 1 }, flags: { peace_talks: true } } },
    ],
  },
  {
    id: 'strongman_burial', month: 25, priority: 5, category: 'society', title: 'Libingan ng mga Bayani', location: 'Heroes’ Cemetery',
    body: ['The family of the strongman who ruled until 1986 — a family still powerful in Hilagang Luzara and allied with your coalition — asks that his remains be buried at the Heroes’ Cemetery.', 'Martial law survivors call it the ultimate insult.'],
    choices: [
      { id: 'burial_allow', label: 'Allow the burial', description: 'Heal old wounds, keep the northern vote.', outcome: 'The burial is held secretly at dawn. By noon, thousands of young people are marching.', headline: 'STRONGMAN BURIED AT HEROES’ CEMETERY; PROTESTS ERUPT', effects: { stats: { protest: 12, church: -6, cohesion: 6, approval: -4 }, houseShift: 4 } },
      { id: 'burial_deny', label: 'Refuse', description: 'Heroes’ Cemetery is for heroes.', outcome: 'The northern bloc cools toward you.', effects: { stats: { cohesion: -5, approval: 2 }, houseShift: -4 } },
    ],
  },
  {
    id: 'court_anti_terror', category: 'court', title: 'Korte Suprema: Anti-Terror Law', location: 'Kataas-taasang Hukuman',
    when: [{ flag: 'law_bill_anti_terror' }],
    body: ['The Supreme Court rules on 37 petitions against the amended Anti-Terrorism Act.'],
    court: { title: 'Lagman-Reyes v. Executive Secretary (Anti-Terrorism Act amendments)', kind: 'rights', soundness: 0.45, onStrike: { stats: { military: -4, media: -4 } }, onUphold: { stats: { military: 3 } } },
    choices: [
      { id: 'terror_accept', label: 'Accept the ruling', description: 'Respect the Court.', outcome: 'The ruling is noted.', effects: {} },
    ],
  },
  {
    id: 'war_threat', month: 26, priority: 9, category: 'diplomacy', title: 'Ultimatum', location: 'National Security Council',
    body: ['Haizhou issues an ultimatum: halt all gas exploration in the West Sea within 30 days “or bear the consequences.” Satellite images show amphibious ships massing across the sea. Your Defense Secretary asks for authority to call up reservists.'],
    variants: [{ when: [{ vpAlly: true }], text: 'Vice President {vp} joins the emergency meeting and urges caution: “Mobilize quietly. Talk loudly.”' }, { when: [{ vpAlly: false }], text: 'The Vice President, excluded from the National Security Council, tells reporters you are “dragging the nation to war.”' }],
    choices: [
      { id: 'war_mobilize', label: 'Mobilize reservists and continue drilling', description: 'Call their bluff.', outcome: 'Fifty thousand reservists report for duty. The peso falls 6%. Haizhou’s ships stay — for now.', headline: 'RESERVISTS MOBILIZED AS HAIZHOU MASSES SHIPS', effects: { spend: 12, spendLabel: 'Reservist mobilization', stats: { sovereignty: 15, military: 10, investor: -8, approval: 4 } } },
      { id: 'war_halt', label: 'Halt the drilling “temporarily”', description: 'Avoid war.', outcome: 'The crisis passes. Nationalists call it surrender; the gas stays under the sea.', headline: 'PALASYO HALTS WEST SEA DRILLING', effects: { stats: { sovereignty: -10, approval: -6, military: -6, investor: 3 } } },
      { id: 'war_allies', label: 'Call the Columbian Union and the regional allies', description: 'Internationalize the crisis.', outcome: 'Allied warships sail in. Haizhou backs down — and marks you as an enemy.', effects: { stats: { sovereignty: 8, military: 5 }, flags: { haizhou_enemy: true } } },
    ],
  },
  {
    id: 'child_accident', month: 26, priority: 6, category: 'family', title: 'Ang Aksidente', location: 'Maynilad, 3 a.m.',
    body: ['Your son, Miguel, 21, crashes his car into a street vendor’s stall after a party. The vendor, a 58-year-old grandmother, dies. Miguel’s blood alcohol is twice the limit. The police officer at the scene calls the Palasyo before writing his report.'],
    choices: [
      { id: 'miguel_law', label: '“Treat him like any other citizen”', description: 'Let the law take its course.', outcome: 'Miguel is charged with reckless imprudence resulting in homicide. Your spouse does not speak to you for weeks. The country is moved.', headline: 'PRESIDENT: “MY SON WILL FACE THE LAW”', effects: { stats: { family: -20, approval: 6, corruption: -2 } } },
      { id: 'miguel_cover', label: 'Make the report disappear', description: 'Protect your son.', outcome: 'The report changes: the vendor “suddenly crossed the road.” A dashcam video surfaces two weeks later.', headline: 'DASHCAM CONTRADICTS POLICE REPORT ON PRESIDENT’S SON', effects: { stats: { family: 10, approval: -12, media: 15, ombudsman: 12 }, flags: { obstruction: true, impeachable_offense: true } } },
      { id: 'miguel_settle', label: 'Pay the family a settlement', description: 'Justice, privately.', outcome: 'The family accepts ₱10 million and drops the complaint. Journalists call it “buying silence.”', effects: { stats: { family: 4, approval: -4, media: 6 } } },
    ],
  },
  {
    id: 'vp_threat', category: 'scandal', title: 'Ang Banta ng Bise', location: 'A late-night livestream',
    when: [{ any: [{ flag: 'vp_rift', is: 'open' }, { flag: 'vp_rift', is: 'drifting' }] }],
    body: ['In a rambling late-night livestream, Vice President {vp} says: “I’ve talked to someone. If anything happens to me, they will kill the President, the First Spouse, and the Speaker. No joke.”', 'The country is stunned. The Presidential Security Group calls it an “active threat.”'],
    choices: [
      { id: 'vpt_impeach', label: 'Tell the House to impeach the Vice President', description: 'One-third of the House is enough.', outcome: 'Your allies gather signatures overnight.', effects: { stats: { capital: -6 }, vote: { bill: 'Impeachment of the Vice President (House)', appeal: 1, houseOnly: true, houseThreshold: 106, onPass: { flags: { vp_impeached: true }, stats: { media: 5 }, schedule: [{ event: 'vp_impeach_court', inMonths: 3 }] }, onFail: { stats: { capital: -5 } } } } },
      { id: 'vpt_bribe', label: 'Offer ₱50B in “projects” to congressmen who sign', description: 'Make sure it passes.', outcome: 'The signatures come fast. So does the leak of who was promised what.', headline: 'PROJECTS FOR SIGNATURES? VP IMPEACHMENT RAISES QUESTIONS', effects: { budgetChange: 50, stats: { corruption: 8, ombudsman: 8 }, flags: { bribed_vp_impeachment: true, impeachable_offense: true }, vote: { bill: 'Impeachment of the Vice President (House)', appeal: 3, houseOnly: true, houseThreshold: 106, onPass: { flags: { vp_impeached: true }, schedule: [{ event: 'vp_impeach_court', inMonths: 3 }] } } } },
      { id: 'vpt_nbi', label: 'Refer it to the NBI as a criminal threat', description: 'Law enforcement, not politics.', outcome: 'The NBI subpoenas the VP, who refuses to appear. The standoff drags on.', effects: { stats: { media: 3, courtTension: 2 } } },
      { id: 'vpt_reconcile', label: 'Call the VP and try to talk them down', description: 'De-escalate.', outcome: 'The VP says it was “taken out of context.” Your security team is not reassured.', effects: { stats: { capital: -3 }, flags: { vp_rift: 'tense' } } },
    ],
  },
  {
    id: 'vp_impeach_court', category: 'court', title: 'Korte Suprema: Ang Impeachment ng Bise', location: 'Kataas-taasang Hukuman',
    when: [{ flag: 'vp_impeached' }],
    body: ['The Vice President petitions the Supreme Court, arguing the impeachment violated the one-year bar on multiple complaints and due process.'],
    court: { title: '{vp} v. House of Representatives', kind: 'electoral', soundness: 0.45, onStrike: { flags: { vp_impeachment_voided: true }, stats: { capital: -6 } }, onUphold: { flags: { vp_trial_pending: true } } },
    choices: [
      { id: 'vpc_accept', label: 'Accept the ruling', description: 'The Court has spoken.', outcome: 'Whatever the result, the Vice President is now your open enemy.', effects: { flags: { vp_open_war: true } } },
      { id: 'vpc_attack', label: 'Attack the Court for “protecting” the VP', description: 'Rally your base.', when: [{ ruling: 'struck' }], outcome: 'Your base rallies; the justices take note.', effects: { stats: { courtTension: 10 }, flags: { vp_open_war: true } } },
    ],
  },
  {
    id: 'contractor_couple', month: 27, priority: 8, category: 'scandal', title: 'Ang Mag-asawang Kontratista', location: 'Senate Blue Ribbon Committee',
    body: ['Contractors Sarah and Curly Diazco — owners of 28 luxury cars and nine flood-control companies — testify that they paid 20–30% kickbacks on every project to 30 congressmen and Public Works officials. They name names, including the Speaker’s relatives.'],
    variants: [{ when: [{ flag: 'pork_deal' }], text: 'Several of the projects came from the Speaker’s list you accepted in your first week.' }],
    choices: [
      { id: 'couple_independent', label: 'Create an independent commission with subpoena power', description: 'Let it go wherever it leads.', outcome: 'The Speaker resigns within a month. Your coalition is in chaos — and your approval rises.', headline: 'SPEAKER RESIGNS AMID FLOOD-CONTROL SCANDAL', effects: { stats: { corruption: -8, approval: 6, cohesion: -12 }, houseShift: -12, flags: { flood_commission: true } } },
      { id: 'couple_limit', label: 'Limit it to Public Works officials', description: 'Protect Congress.', outcome: 'Public Works officials are charged. The congressmen go free. The couple’s lawyer promises “volume two.”', effects: { stats: { corruption: 4, media: 6, ombudsman: 6 } } },
      { id: 'couple_discredit', label: 'Discredit the couple as liars', description: 'They are criminals themselves.', outcome: 'Their bank records confirm every payment.', headline: 'BANK RECORDS BACK CONTRACTORS’ KICKBACK CLAIMS', effects: { stats: { approval: -8, corruption: 8, ombudsman: 10 }, flags: { obstruction: true } } },
    ],
  },
  {
    id: 'rice_20', month: 27, priority: 4, category: 'economy', title: '₱20 na Bigas', location: 'Kadiwa stores',
    body: ['Your allies want to fulfill an old campaign promise before the midterms: ₱20 per kilo rice, sold in government stores. It would cost ₱40 billion — and would only reach a fraction of the poor.'],
    choices: [
      { id: 'rice20_go', label: 'Launch it nationwide before the elections', description: 'Deliver the promise.', outcome: 'Lines stretch around the block. The program runs out of rice in six weeks.', headline: '₱20 RICE LAUNCHED — AND RUNS OUT', effects: { spend: 40, spendLabel: '₱20 rice program', stats: { approval: 5, inflation: -0.3, investor: -4 } } },
      { id: 'rice20_pilot', label: 'Pilot it for the poorest families only', description: 'Targeted and affordable.', outcome: 'It works for those it reaches. Everyone else asks where their rice is.', effects: { spend: 8, spendLabel: '₱20 rice pilot', stats: { approval: 1 } } },
    ],
  },
  {
    id: 'marawira_siege', month: 28, priority: 9, category: 'crisis', title: 'Ang Pagkubkob sa Marawira', location: 'Marawira, Bangsa Lanao',
    body: ['Hundreds of extremist fighters seize the city of Marawira, raise a black flag over city hall, and take a cathedral’s priests hostage. The military says it needs martial law in Mindara to fight house to house.', 'Under the Constitution, you may declare it for 60 days. Congress may revoke it. The Supreme Court may review it.'],
    choices: [
      { id: 'siege_martial', label: 'Declare martial law over all of Mindara', description: 'The whole island group, 60 days.', outcome: 'Martial law is declared. The battle lasts five months; the city is flattened. Congress votes on an extension.', headline: 'MARTIAL LAW IN MINDARA', effects: { spend: 25, spendLabel: 'Marawira campaign', stats: { military: 12, courtTension: 10, tribes: -12, media: 8, crime: -3 }, flags: { martial_law_mindara: true }, vote: { bill: 'Extension of martial law in Mindara', appeal: 1, onPass: { stats: { military: 4 } }, onFail: { stats: { capital: -8 } } }, schedule: [{ event: 'martial_law_court', inMonths: 1 }, { event: 'marawira_rebuild', inMonths: 5 }] } },
      { id: 'siege_limited', label: 'A targeted military operation without martial law', description: 'Fight within ordinary law.', outcome: 'The generals complain of tied hands. The battle takes longer, but civilian rule holds.', headline: 'NO MARTIAL LAW: TROOPS FIGHT UNDER CIVILIAN RULE', effects: { spend: 20, spendLabel: 'Marawira operation', stats: { military: 2, tribes: 2, approval: 3 }, schedule: [{ event: 'marawira_rebuild', inMonths: 6 }] } },
    ],
  },
  {
    id: 'martial_law_court', category: 'court', title: 'Korte Suprema: Ang Batas Militar', location: 'Kataas-taasang Hukuman',
    when: [{ flag: 'martial_law_mindara' }],
    body: ['The Supreme Court reviews the factual basis of your martial law proclamation over all of Mindara.'],
    court: { title: 'In re: Proclamation of Martial Law in Mindara', kind: 'executive', soundness: 0.6, onStrike: { stats: { military: -6, courtTension: 5 }, flags: { martial_law_voided: true } }, onUphold: { stats: { capital: 4 } } },
    choices: [
      { id: 'ml_comply', label: 'Lift martial law as ordered', description: 'Obey the Court.', when: [{ ruling: 'struck' }], outcome: 'Martial law is lifted outside the battle zone.', effects: { stats: { courtTension: -3 } } },
      { id: 'ml_defy', label: 'Keep martial law in place anyway', description: '“The Court doesn’t understand the threat.”', when: [{ ruling: 'struck' }], outcome: 'The Republic has a President defying the Supreme Court. Every institution is now watching the military.', headline: 'PRESIDENT DEFIES SC ON MARTIAL LAW', effects: { stats: { courtTension: 25, military: 5, protest: 15 }, flags: { defied_court: true, impeachable_offense: true } } },
      { id: 'ml_upheld', label: 'Continue the operation', description: 'The Court has upheld it.', when: [{ ruling: 'upheld' }], outcome: 'Human-rights groups vow to document every abuse.', effects: {} },
    ],
  },
  {
    id: 'marawira_rebuild', category: 'economy', title: 'Pagbangon ng Marawira', location: 'Marawira',
    body: ['The battle is over. The city’s center is rubble. 200,000 residents are displaced.'],
    choices: [
      { id: 'rebuild_fast', label: 'Rebuild with a ₱35B national program', description: 'Big and fast — with national contractors.', outcome: 'Construction starts; residents complain they were not consulted about their own city.', effects: { project: { id: 'marawira_rebuild', name: 'Marawira reconstruction', region: 'Bangsa Lanao', cost: 35, months: 24 }, stats: { tribes: 2 } } },
      { id: 'rebuild_local', label: 'Let the Bangsa Lanao government lead, with ₱20B', description: 'Local ownership.', outcome: 'Slower, but trusted.', effects: { project: { id: 'marawira_rebuild', name: 'Marawira reconstruction (local-led)', region: 'Bangsa Lanao', cost: 20, months: 30 }, stats: { tribes: 8 } } },
    ],
  },
  {
    id: 'ofw_scam_hubs', month: 28, priority: 5, category: 'diplomacy', title: 'Mga Alipin ng Scam', location: 'Border of a neighboring country',
    body: ['800 Kapuluan citizens, lured by fake job offers, are held in scam compounds across the border of a war-torn neighboring country, forced to defraud people online. Escapees report beatings and electric shocks.'],
    choices: [
      { id: 'scam_rescue', label: 'Negotiate with the local militia and fly them home: ₱2B', description: 'Pay what it takes.', outcome: 'Six hundred come home. The recruiters, it turns out, used immigration officers at your own airport.', headline: '600 SCAM HUB VICTIMS RESCUED', effects: { spend: 2, spendLabel: 'Scam hub rescue', stats: { approval: 3 } } },
      { id: 'scam_airport', label: 'Rescue them and purge the airport immigration bureau', description: 'Cut off the pipeline.', outcome: 'Forty immigration officers are charged for a “pastillas” bribery scheme.', effects: { spend: 2, spendLabel: 'Scam hub rescue', stats: { approval: 4, corruption: -3 } } },
    ],
  },
  {
    id: 'blank_bicam', month: 29, priority: 7, category: 'congress', title: 'Mga Blangkong Linya', location: 'Your desk',
    body: ['Budget watchdogs discover the bicameral committee report for the FY2030 budget contains blank items — lines with no amounts, filled in after legislators signed. ₱240 billion was added in the blanks.'],
    choices: [
      { id: 'bicam_veto', label: 'Veto the blank items and demand a clean re-vote', description: 'Refuse to sign what nobody saw.', outcome: 'Congress is furious, but the watchdogs cheer. The re-vote removes most of the insertions.', headline: 'PRESIDENT VETOES ₱240B “BLANK” ITEMS', effects: { budgetChange: -150, stats: { cohesion: -8, approval: 5, corruption: -4 } } },
      { id: 'bicam_sign', label: 'Sign it — there is no time', description: 'The fiscal year starts in days.', outcome: 'Petitions reach the Supreme Court within a week, accusing you of signing a falsified budget.', headline: 'PRESIDENT SIGNS BUDGET WITH BLANKS', effects: { budgetChange: 90, stats: { corruption: 6, courtTension: 5, ombudsman: 6 } } },
    ],
  },
  {
    id: 'militarization', month: 30, priority: 6, category: 'cabinet', title: 'Mga Heneral sa Gabinete', location: 'Palasyo',
    body: ['Your Executive Secretary proposes appointing retired generals to head customs, the prisons bureau, the pandemic task force, and the housing agency. “They follow orders and they don’t steal as much.”', 'Critics warn you are militarizing civilian government.'],
    variants: [{ when: [{ flag: 'militarization' }], text: 'You already put generals in charge of customs.' }],
    choices: [
      { id: 'mil_appoint', label: 'Appoint the generals', description: 'Discipline and loyalty.', outcome: 'Twelve retired generals take civilian posts. The military’s loyalty to you deepens. So do comparisons with the martial-law years.', headline: '12 GENERALS TAKE CIVILIAN POSTS', effects: { stats: { military: 12, media: 8, corruption: -2, courtTension: 4 }, flags: { militarization: 2 } } },
      { id: 'mil_civilians', label: 'Keep civilian posts civilian', description: 'Professional civil servants.', outcome: 'The generals are politely disappointed.', effects: { stats: { military: -3 } } },
    ],
  },
  {
    id: 'delapaz_verdict', month: 30, priority: 7, category: 'court', title: 'Ang Hatol', location: 'Sandiganbayan (anti-graft court)',
    when: [{ flag: 'delapaz_arrested' }],
    body: ['The anti-graft court convicts former President Ramon Dela Paz of plunder and sentences him to reclusion perpetua — life imprisonment. He is taken to the national penitentiary.', 'Within hours, the PBL files a petition asking you to pardon him “for national unity.”'],
    choices: [
      { id: 'pardon_no', label: 'No pardon', description: 'Justice must be complete.', outcome: 'Dela Paz enters prison. The PBL declares total opposition to your government.', headline: 'EX-PRESIDENT DELA PAZ BEGINS LIFE SENTENCE', effects: { stats: { approval: 3, corruption: -4, cohesion: -6 }, senateShift: { from: 'neutral', to: 'opposition', count: 1 }, flags: { delapaz_imprisoned: true } } },
      { id: 'pardon_yes', label: 'Pardon him for “national reconciliation”', description: 'Win the PBL — and its votes.', outcome: 'He walks free in six weeks. Reformers call it the great betrayal of your presidency.', headline: 'DELA PAZ PARDONED', effects: { stats: { approval: -8, corruption: 6, cohesion: 8, media: 10 }, houseShift: 10, flags: { pardoned_delapaz: true } } },
    ],
  },

  // ═════════════════════════ CRISES THAT CAN END A PRESIDENCY ═════════════════════════
  {
    id: 'people_power', priority: 10, category: 'crisis', title: 'People Power', location: 'Avenida Liwayway',
    body: ['A million people fill Avenida Liwayway, where two presidents have fallen before. Bishops lead prayers on a stage; opposition senators link arms with students. The chant is one word: “Resign.”', 'Your approval is at {approval}. Your Defense Secretary calls: some units are wavering.'],
    choices: [
      { id: 'pp_resign', label: 'Resign', description: 'Spare the country.', outcome: 'You address the nation for the last time. At noon the next day, the Vice President takes the oath at the shrine on Avenida Liwayway. Your presidency is over.', headline: 'PRESIDENT RESIGNS', effects: { gameOver: 'resigned' } },
      { id: 'pp_reform', label: 'Accept their demands: fire the Cabinet, freeze projects, submit to investigations', description: 'Survive by surrendering power.', when: [{ stat: 'approval', gte: 12 }], outcome: 'You fire your entire senior Cabinet on live television and invite the Ombudsman into the Palasyo. The crowd, stunned, gives you one more chance.', headline: 'PRESIDENT FIRES CABINET, BOWS TO PROTESTERS', effects: { fireCabinet: 'executive', stats: { approval: 10, protest: -30, capital: -20, cabinetCohesion: -20, ombudsman: 10 }, flags: { survived_people_power: true } } },
      { id: 'pp_crackdown', label: 'Order the military to clear the avenue', description: 'Restore order by force.', when: [{ stat: 'military', gte: 60 }], outcome: 'The military obeys. Tear gas, water cannons, and 14 dead. The crowd scatters. You have survived — as a different kind of president.', headline: '14 DEAD AS TROOPS CLEAR AVENIDA LIWAYWAY', effects: { stats: { protest: -20, courtTension: 25, media: 25, church: -20, approval: -8, military: 5 }, flags: { crackdown: true, impeachable_offense: true } } },
      { id: 'pp_crackdown_fail', label: 'Order the military to clear the avenue', description: 'Restore order by force.', when: [{ stat: 'military', lte: 59 }], outcome: 'The Chief of Staff refuses. By evening, the generals appear on television at the shrine, withdrawing their support. A helicopter takes you and your family from the Palasyo that night.', headline: 'MILITARY WITHDRAWS SUPPORT; PRESIDENT FLEES PALASYO', effects: { gameOver: 'ousted' } },
    ],
  },
  {
    id: 'military_withdraws', priority: 10, category: 'crisis', title: 'Ang Pag-atras ng Militar', location: 'Camp Aguinaldo',
    body: ['The Chief of Staff of the Armed Forces and eleven generals hold a press conference: they “no longer recognize the authority” of a President who has “lost the trust of the people and the soldiers.” Protesters are gathering. Your security detail asks where you want to go.'],
    choices: [
      { id: 'mw_resign', label: 'Resign to avoid bloodshed', description: 'Hand power to the Vice President.', outcome: 'You leave the Palasyo by the river gate. The Vice President is sworn in before dawn.', headline: 'PRESIDENT RESIGNS AFTER MILITARY WITHDRAWS SUPPORT', effects: { gameOver: 'resigned' } },
      { id: 'mw_negotiate', label: 'Negotiate with the generals', description: 'Give them what they want.', outcome: 'The generals’ price: the Defense and Interior departments, a veto over security policy, and amnesty for past abuses. You survive — with a military looking over your shoulder.', headline: 'PRESIDENT, GENERALS STRIKE DEAL', effects: { fireCabinet: 'defense', stats: { military: 25, courtTension: 10, media: 15, capital: -15 }, flags: { military_deal: true, militarization: 3 } } },
      { id: 'mw_people', label: 'Appeal to the people to protect the Constitution', description: 'Call your supporters to the Palasyo.', when: [{ stat: 'approval', gte: 35 }], outcome: 'Hundreds of thousands answer — civilians ringing the Palasyo. The generals, facing the people, back down. The ringleaders are arrested.', headline: 'CIVILIANS RING PALASYO; GENERALS BACK DOWN', effects: { stats: { approval: 8, military: 10, protest: 10 }, flags: { coup_defeated: true } } },
      { id: 'mw_people_fail', label: 'Appeal to the people to protect the Constitution', description: 'Call your supporters to the Palasyo.', when: [{ stat: 'approval', lte: 34 }], outcome: 'Too few come. By midnight, soldiers surround the Palasyo. You are escorted out.', headline: 'PRESIDENT OUSTED', effects: { gameOver: 'coup' } },
    ],
  },
  {
    id: 'impeachment_second', priority: 10, category: 'congress', title: 'Ikalawang Impeachment', location: 'House of Representatives',
    body: ['A new impeachment complaint is filed, this time listing everything: culpable violation of the Constitution, betrayal of public trust, graft. Signatures pour in. If 106 representatives endorse it, you will face trial in the Senate.'],
    choices: [
      {
        id: 'imp2_fight', label: 'Fight in the House with everything you have', description: 'Hold at least 211 votes.', outcome: 'The vote is called.',
        effects: { stats: { capital: -10 }, vote: { bill: 'Motion to dismiss the impeachment complaint', appeal: 0, houseOnly: true, houseThreshold: 211, onPass: { flags: { impeachment: 'dismissed' } }, onFail: { flags: { impeachment: 'impeached' }, schedule: [{ event: 'senate_trial', inMonths: 2 }] } } },
      },
      { id: 'imp2_resign', label: 'Resign before the vote', description: 'Avoid the humiliation of a trial.', outcome: 'You resign. The Vice President becomes President.', headline: 'PRESIDENT RESIGNS AHEAD OF IMPEACHMENT', effects: { gameOver: 'resigned' } },
    ],
  },
  {
    id: 'senate_trial', priority: 10, category: 'congress', title: 'Ang Paglilitis', location: 'Senate, sitting as an impeachment court',
    when: [{ flag: 'impeachment', is: 'impeached' }],
    body: ['The Senate convenes as an impeachment court, the Chief Justice presiding. For weeks, witnesses testify. Bank records are opened on live television. Now the senators will vote. Sixteen votes remove you from office.'],
    variants: [
      { when: [GUILTY], text: 'Your lawyers know what is in the records. So do you.' },
      { when: [CLEAN], text: 'The prosecution’s evidence is thin. The question is whether the politics will matter more than the evidence.' },
    ],
    choices: [
      { id: 'trial_defend_clean', label: 'Defend yourself on the merits', description: 'Let the evidence speak.', when: [CLEAN], outcome: 'The senators rise one by one to vote.', effects: { trial: { severity: 0.3, onConvict: { gameOver: 'removed' }, onAcquit: { stats: { approval: 8, capital: 8 } } } } },
      { id: 'trial_defend_guilty', label: 'Fight the charges in court', description: 'Challenge every piece of evidence.', when: [GUILTY], outcome: 'The senators rise one by one to vote.', effects: { trial: { severity: 1.6, onConvict: { gameOver: 'removed' }, onAcquit: { stats: { approval: -4, corruption: 5 } } } } },
      { id: 'trial_buy', label: 'Secure the votes: projects and posts for wavering senators', description: 'Politics decides impeachments.', outcome: 'Your emissaries make offers. The senators rise to vote.', effects: { budgetChange: 60, stats: { corruption: 8 }, senateShift: { from: 'neutral', to: 'ally', count: 3 }, trial: { severity: 1.0, onConvict: { gameOver: 'removed' }, onAcquit: { stats: { approval: -6 } } } } },
      { id: 'trial_resign', label: 'Resign before the verdict', description: 'Leave on your own terms.', outcome: 'You resign an hour before the vote. The Vice President takes the oath.', headline: 'PRESIDENT RESIGNS BEFORE SENATE VERDICT', effects: { gameOver: 'resigned' } },
    ],
  },
  {
    id: 'ombudsman_inner_circle', priority: 9, category: 'scandal', title: 'Ang Kaso ng Ombudsman', location: 'Office of the Ombudsman',
    body: ['The President is immune from suit while in office — but your people are not. The Ombudsman files graft and plunder charges against your Executive Secretary, two Cabinet secretaries, and your closest political adviser. She says the evidence points “to the very top.”'],
    choices: [
      { id: 'omb_cooperate', label: 'Let them face the charges', description: 'Cut them loose.', outcome: 'Your closest aides are arrested. Some start to talk.', headline: 'PRESIDENT’S AIDES CHARGED WITH PLUNDER', effects: { fireCabinet: 'executive', stats: { ombudsman: -15, cabinetCohesion: -12, approval: 2 } } },
      { id: 'omb_fight', label: 'Defend them and attack the Ombudsman', description: 'Call it political persecution.', outcome: 'Your allies file an impeachment complaint against the Ombudsman. The public sees a President protecting his people.', headline: 'PALASYO ALLIES MOVE TO IMPEACH OMBUDSMAN', effects: { stats: { approval: -6, media: 10, courtTension: 5 }, flags: { impeachable_offense: true, obstruction: true } } },
    ],
  },
];
