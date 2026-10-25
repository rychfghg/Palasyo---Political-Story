import type { StoryEvent } from '@/features/narrative/types/event';

/**
 * Chapter 2 issues: the Southern Seas Community (SSC, the region’s bloc), investments and loans,
 * education and every other crisis, good news and bad, celebrities and family — and the Supreme Court.
 */
export const ISSUES_2: StoryEvent[] = [
  // ═════════════════════════ THE REGION & THE WORLD ═════════════════════════
  {
    id: 'ssc_chair', month: 37, priority: 6, category: 'diplomacy', title: 'Tagapangulo ng SSC', location: 'Southern Seas Community secretariat',
    body: ['The Kapuluan takes its turn as chair of the Southern Seas Community — the ten-nation bloc of Siamara, Malindra, Viettra, Indara, Singhapura, Khmerra, Laoria, Burmara, Brunaya, and the Kapuluan. Hosting the summit year will cost ₱15 billion.', 'It is a chance to lead the region on the West Sea — or an expensive party.'],
    choices: [
      { id: 'ssc_host_big', label: 'Host a grand summit year: ₱15B', description: 'New convention center in Sugbu City, 300 meetings.', outcome: 'The region comes to the Kapuluan. So do contractors’ invoices.', effects: { spend: 15, spendLabel: 'SSC chairmanship', stats: { investor: 4, approval: 2, corruption: 2 } } },
      { id: 'ssc_host_lean', label: 'A lean chairmanship: ₱4B', description: 'Existing venues, focused agenda.', outcome: 'Diplomats praise the efficiency; local officials hoped for more projects.', effects: { spend: 4, spendLabel: 'SSC chairmanship', stats: { investor: 2 } } },
    ],
  },
  {
    id: 'ssc_summit', month: 40, priority: 7, category: 'diplomacy', title: 'Ang SSC Summit', location: 'Sugbu City',
    body: ['Nine heads of government arrive. Your agenda must choose between a binding West Sea Code of Conduct (Haizhou will pressure half the members to block it) and a regional trade and investment pact.'],
    choices: [
      { id: 'summit_coc', label: 'Push a binding West Sea Code of Conduct', description: 'Lead on sovereignty.', outcome: 'Six members sign; four, under Haizhou pressure, do not. A partial victory — and a clear message.', headline: 'SIX NATIONS SIGN WEST SEA CODE', effects: { stats: { sovereignty: 6, military: 3, investor: -2 } } },
      { id: 'summit_trade', label: 'Push the Southern Seas Investment Pact', description: 'Lead on economics.', outcome: 'The pact is signed unanimously. Regional investment rises.', headline: 'SSC INVESTMENT PACT SIGNED IN SUGBU', effects: { stats: { investor: 8, growth: 0.3 } } },
      { id: 'summit_both', label: 'Try both', description: 'Ambition.', outcome: 'Haizhou’s friends block both. The summit ends with a vague statement.', effects: { stats: { investor: -1, approval: -1 } } },
    ],
  },
  {
    id: 'ssc_bank_loan', month: 43, priority: 6, category: 'economy', title: 'Utang mula sa SSC Development Bank', location: 'Finance Department',
    body: ['The SSC Development Bank offers ₱200 billion at 3% for railways and classrooms. The Haizhou Infrastructure Bank offers ₱300 billion at 2% — but Haizhou firms must build, and ports serve as collateral.'],
    choices: [
      { id: 'loan_ssc', label: 'Take the SSC loan for classrooms and rail', description: 'Moderate, transparent.', outcome: 'Projects begin under regional auditors.', effects: { income: 200, spendLabel: 'SSC Development Bank loan', debt: 200, project: { id: 'ssc_projects', name: 'SSC-financed classrooms and rail', region: 'National', cost: 200, months: 30 }, stats: { investor: 3 } } },
      { id: 'loan_haizhou', label: 'Take the bigger Haizhou loan', description: 'More money, cheaper, riskier.', outcome: 'Haizhou workers arrive. The port collateral clause makes headlines.', headline: 'PORTS AS COLLATERAL IN ₱300B HAIZHOU LOAN', effects: { income: 300, spendLabel: 'Haizhou Infrastructure Bank loan', debt: 300, project: { id: 'haizhou_projects', name: 'Haizhou-financed infrastructure', region: 'National', cost: 300, months: 30 }, stats: { sovereignty: -8, growth: 0.4, corruption: 3 }, flags: { haizhou_collateral: true } } },
      { id: 'loan_none', label: 'No new loans', description: 'The debt is high enough.', outcome: 'Projects wait. The debt stops growing so fast.', effects: { stats: { investor: 2, approval: -1 } } },
    ],
  },
  {
    id: 'haizhou_port', month: 45, priority: 6, category: 'diplomacy', title: 'Ang Daungan', location: 'Hilagang Luzara',
    body: ['A Haizhou state company offers to build and operate a deep-sea port near a naval base in Hilagang Luzara — ₱90 billion in investment. The military is alarmed.'],
    choices: [
      { id: 'port_yes', label: 'Approve it', description: 'Investment is investment.', outcome: 'The port rises. So do Haizhou “research vessels” in nearby waters.', effects: { stats: { investor: 5, sovereignty: -8, military: -8, growth: 0.2 } } },
      { id: 'port_no', label: 'Reject it on security grounds', description: 'Not near a naval base.', outcome: 'Haizhou cancels three other investments in retaliation.', effects: { stats: { sovereignty: 4, military: 4, investor: -4 } } },
      { id: 'port_ssc', label: 'Offer the site to an SSC consortium instead', description: 'Regional partners.', outcome: 'Singhapura and Indara investors take it. Slower, safer.', effects: { stats: { investor: 2, sovereignty: 2 } } },
    ],
  },
  {
    id: 'columbian_fta', month: 47, priority: 5, category: 'economy', title: 'Free Trade with the Columbian Union', location: 'Trade Department',
    body: ['The Columbian Union offers a free trade agreement: tariff-free access for Kapuluan electronics and fruit, in exchange for opening agriculture to Columbian pork, corn, and rice.'],
    choices: [
      { id: 'fta_sign', label: 'Sign it', description: 'Exporters win, farmers lose.', outcome: 'Exports jump. Hog and corn farmers protest at the Senate.', effects: { stats: { growth: 0.4, investor: 6, protest: 6 }, houseShift: -4 } },
      { id: 'fta_carveout', label: 'Negotiate a rice and pork carve-out', description: 'Protect farmers.', outcome: 'Talks drag on for a year; a smaller deal is signed.', effects: { stats: { growth: 0.1, investor: 2 } } },
      { id: 'fta_no', label: 'Decline', description: 'Protect agriculture.', outcome: 'Farmers thank you; exporters move factories to Viettra.', effects: { stats: { investor: -4, approval: 1 } } },
    ],
  },
  {
    id: 'foreign_education_funds', month: 48, priority: 5, category: 'society', title: 'Pondo para sa Edukasyon', location: 'Education Department',
    body: ['Two foreign offers for education: the Nordhavn Development Bank will fund ₱30B in teacher training with strict audits; the Haizhou government will fund 200 “language and culture centers” in public universities.'],
    choices: [
      { id: 'edu_nordhavn', label: 'Accept the Nordhavn teacher-training grant', description: 'Audited, focused.', outcome: '50,000 teachers retrained. Auditors find no leakage — a first.', effects: { income: 30, spendLabel: 'Nordhavn education grant', program: { id: 'teacher_training', label: 'Teacher training', monthly: 0.8, months: 36 }, stats: { corruption: -1 } } },
      { id: 'edu_haizhou', label: 'Accept the Haizhou culture centers', description: 'Free buildings.', outcome: 'Professors complain of “guidance” on what they can teach about the West Sea.', effects: { stats: { sovereignty: -4, investor: 1 } } },
      { id: 'edu_both', label: 'Accept both', description: 'All help is welcome.', outcome: 'Both arrive. So does a Senate inquiry on foreign influence in schools.', effects: { income: 30, spendLabel: 'Foreign education grants', stats: { sovereignty: -3 } } },
    ],
  },
  {
    id: 'ofw_gulf_war_2', month: 51, priority: 7, category: 'diplomacy', title: 'Muli, Digmaan sa Gulf', location: 'Department of Migrant Workers',
    body: ['A regional war engulfs the Gulf. 400,000 Kapuluan workers are in the war zone. Remittances drop sharply.'],
    variants: [{ when: [{ flag: 'law_b2_ofw_repatriation_fund' }], text: 'The OFW Emergency Repatriation Fund you signed into law is ready.' }],
    choices: [
      { id: 'gulf2_evac', label: 'Largest evacuation in history: ₱25B', description: 'Ships, planes, overland routes.', outcome: '180,000 workers come home. They need jobs.', effects: { spend: 25, spendLabel: 'Gulf evacuation', stats: { approval: 6, unemployment: 0.5 } } },
      { id: 'gulf2_shelter', label: 'Shelter in place, evacuate only the most endangered', description: 'Cheaper.', outcome: 'Twenty-three OFWs die in a missile strike.', effects: { spend: 5, spendLabel: 'Partial evacuation', stats: { approval: -7, protest: 6 } } },
    ],
  },
  {
    id: 'refugee_boats', month: 54, priority: 5, category: 'diplomacy', title: 'Mga Bangka ng Refugees', location: 'Mindara coast',
    body: ['Boats carrying 3,000 refugees fleeing Burmara’s civil war arrive on Mindara’s shores. Neighbors have pushed them back to sea.'],
    choices: [
      { id: 'ref_accept', label: 'Accept them, as the Kapuluan did in the 1970s and 1980s', description: 'An old tradition of refuge.', outcome: 'The world praises you. Local officials ask who will pay.', headline: 'KAPULUAN OPENS DOORS TO REFUGEES', effects: { spend: 3, spendLabel: 'Refugee processing', stats: { church: 6, approval: 1 } } },
      { id: 'ref_push', label: 'Push them back', description: 'We cannot afford it.', outcome: 'A boat capsizes. 140 drown. The photographs are unbearable.', effects: { stats: { church: -10, approval: -4, media: 8 } } },
    ],
  },
  {
    id: 'tariff_war', month: 57, priority: 6, category: 'economy', title: 'Taripa', location: 'Trade Department',
    body: ['The Columbian Union imposes 25% tariffs on Kapuluan electronics, accusing you of letting Haizhou goods be “transshipped” through your ports. 200,000 factory jobs are at risk.'],
    choices: [
      { id: 'tw_negotiate', label: 'Negotiate and crack down on transshipment', description: 'Concede.', outcome: 'Tariffs cut to 10%. Haizhou is annoyed.', effects: { stats: { investor: 2, sovereignty: 2, unemployment: 0.2 } } },
      { id: 'tw_retaliate', label: 'Retaliate with tariffs on Columbian goods', description: 'Stand up to bullies.', outcome: 'Prices rise at home. The Columbian Union doubles down.', effects: { stats: { inflation: 0.6, unemployment: 0.5, approval: 2 } } },
    ],
  },
  {
    id: 'west_sea_base', month: 59, priority: 8, category: 'diplomacy', title: 'Base sa Bahura', location: 'Bahura ng Kalayaan',
    body: ['Satellite images show Haizhou dredgers turning Bahura ng Kalayaan into an artificial island — with a runway.'],
    variants: [{ when: [{ flag: 'reef_lost' }], text: 'This is the reef you gave up in 2028.' }],
    choices: [
      { id: 'wsb_blockade', label: 'Blockade the dredgers with the coast guard', description: 'Risk a clash.', outcome: 'A Haizhou ship rams your coast guard vessel. Two crew are hurt. The dredging pauses — for now.', effects: { stats: { sovereignty: 12, military: 8, investor: -5, approval: 5 } } },
      { id: 'wsb_arbitration', label: 'File a new international case', description: 'Law, not ships.', outcome: 'The case will take years. The runway will take months.', effects: { stats: { sovereignty: 2 } } },
      { id: 'wsb_ssc', label: 'Rally the SSC for a joint statement', description: 'Regional pressure.', outcome: 'Seven members sign. Haizhou slows the work.', effects: { stats: { sovereignty: 5, investor: 1 } } },
    ],
  },
  {
    id: 'fishermen_sunk', month: 62, priority: 7, category: 'diplomacy', title: 'Lumubog ang Bangka', location: 'West Sea',
    body: ['A Haizhou maritime militia vessel rams and sinks a Kapuluan fishing boat at night, leaving 22 fishermen in the water. A Viettran boat rescues them. Haizhou calls it “a minor maritime accident.”'],
    choices: [
      { id: 'fs_demand', label: 'Demand an apology and compensation', description: 'Diplomatic fury.', outcome: 'Haizhou offers “condolences” but no apology.', effects: { stats: { sovereignty: 4, approval: 2 } } },
      { id: 'fs_downplay', label: 'Call it a maritime incident, avoid escalation', description: 'Protect trade.', outcome: 'The fishermen call you a coward on national TV.', headline: 'FISHERMEN: “THE PRESIDENT ABANDONED US”', effects: { stats: { approval: -6, military: -5 } } },
    ],
  },
  {
    id: 'remittance_crash', month: 63, priority: 5, category: 'economy', title: 'Bumagsak ang Padala', location: 'Central bank',
    body: ['A global recession hits. Remittances fall 18% — the first drop in decades. Consumer spending collapses; malls in the provinces empty.'],
    choices: [
      { id: 'rc_stimulus', label: 'A ₱80B stimulus package', description: 'Spend to fight recession.', outcome: 'The downturn is softened. The debt grows.', effects: { spend: 80, spendLabel: 'Recession stimulus', stats: { growth: 0.6, approval: 3 } } },
      { id: 'rc_austerity', label: 'Hold spending steady', description: 'Avoid more debt.', outcome: 'Growth stalls. Unemployment rises.', effects: { stats: { growth: -0.8, unemployment: 0.6, investor: 3 } } },
    ],
  },
  {
    id: 'ssc_bank_contagion', month: 65, priority: 6, category: 'economy', title: 'Krisis sa Bangko', location: 'Singhapura',
    body: ['A major Singhapura bank collapses. Panic spreads across the region. Depositors line up at Kapuluan banks.'],
    choices: [
      { id: 'bank_guarantee', label: 'Guarantee all deposits', description: 'Stop the panic.', outcome: 'The panic stops. The guarantee makes the Treasury liable for ₱1 trillion if things go wrong.', effects: { stats: { investor: 5 }, flags: { deposit_guarantee: true } } },
      { id: 'bank_limited', label: 'Keep the normal ₱1M insurance limit', description: 'No blank checks.', outcome: 'Two rural banks fail. Depositors lose savings above ₱1M.', effects: { stats: { investor: -3, approval: -3 } } },
    ],
  },
  {
    id: 'un_seat', month: 68, priority: 4, category: 'diplomacy', title: 'Upuan sa UN Security Council', location: 'United Nations General Assembly',
    body: ['The Kapuluan wins a non-permanent seat on the UN Security Council — the first time in 25 years.'],
    choices: [
      { id: 'un_celebrate', label: 'Celebrate — and put the West Sea on the agenda', description: 'Use the seat.', outcome: 'Haizhou protests. The world listens.', headline: 'KAPULUAN WINS UN SECURITY COUNCIL SEAT', effects: { stats: { approval: 3, sovereignty: 3 } } },
    ],
  },

  // ═════════════════════════ EDUCATION & THE STATE OF THE NATION ═════════════════════════
  {
    id: 'education_emergency', month: 38, priority: 7, category: 'society', title: 'Krisis sa Edukasyon', location: 'Education Department',
    body: ['The Education Secretary asks you to declare a national education emergency: a 165,000-classroom shortage, 90,000 unfilled teacher posts, and students who cannot read.'],
    variants: [{ when: [{ flag: 'sucs_defunded' }], text: 'State universities are still recovering from the defunding of 2029.' }],
    choices: [
      { id: 'ee_declare', label: 'Declare an education emergency: ₱60B', description: 'Hire, build, teach.', outcome: 'Classrooms and teachers — at last. The debt grows.', headline: 'EDUCATION EMERGENCY DECLARED', effects: { spend: 60, spendLabel: 'Education emergency', program: { id: 'edu_emergency', label: 'Education emergency hiring', monthly: 2, months: 36 }, stats: { approval: 4 } } },
      { id: 'ee_shifts', label: 'Triple-shift classes and online learning', description: 'Cheap and fast.', outcome: 'Students attend in three-hour shifts. Learning outcomes fall further.', effects: { stats: { approval: -2 } } },
      { id: 'ee_private', label: 'Vouchers for private schools', description: 'Let private schools absorb students.', outcome: 'Private schools boom. Public-school teachers protest.', effects: { spend: 20, spendLabel: 'Private school vouchers', stats: { protest: 4 } } },
    ],
  },
  {
    id: 'teacher_shortage', month: 41, priority: 5, category: 'society', title: 'Walang Guro', location: 'Public schools in Mindara',
    body: ['In remote Mindara schools, one teacher handles four grades at once. Teachers keep leaving to work abroad as caregivers.'],
    choices: [
      { id: 'ts_hardship', label: 'Hardship pay for remote teachers', description: '₱6B a year.', outcome: 'Teachers stay — some of them.', effects: { program: { id: 'hardship_pay', label: 'Remote teacher hardship pay', monthly: 0.5, months: 60 }, stats: { tribes: 2 } } },
      { id: 'ts_ban', label: 'Restrict deployment of teachers abroad', description: 'Keep them home.', outcome: 'Teachers call it a violation of their rights. The Supreme Court agrees.', effects: { stats: { courtTension: 4, protest: 4 } } },
    ],
  },
  {
    id: 'olympic_gold', month: 42, priority: 3, category: 'society', title: 'Ginto!', location: 'Olympic Games',
    body: ['Weightlifter Hidalia Diwata wins the Kapuluan’s first-ever Olympic gold medal. The country erupts in joy. She trained in a garage with equipment she built herself.'],
    choices: [
      { id: 'og_parade', label: 'A hero’s parade and a ₱10M reward', description: 'Share the moment.', outcome: 'A million people line the parade route. You stand beside her — and the photo is everywhere.', headline: 'FIRST OLYMPIC GOLD! HEROINE’S WELCOME FOR DIWATA', effects: { spend: 0.1, spendLabel: 'Olympic reward', stats: { approval: 3 } } },
      { id: 'og_institute', label: 'Fund a real sports program in her name', description: 'Less spectacle, more legacy.', outcome: 'Diwata says it is the best gift she could ask for.', effects: { spend: 2, spendLabel: 'Diwata sports program', stats: { approval: 2 } } },
    ],
  },
  {
    id: 'showbiz_senator', month: 43, priority: 3, category: 'media', title: 'Artista sa Senado', location: 'Entertainment news',
    body: ['Senator Marites Santos-Ochoa — former actress — is caught on video telling an OFW family to “just pray” instead of asking for aid. The clip becomes the country’s favorite meme, and her allies are yours.'],
    choices: [
      { id: 'ss_distance', label: 'Distance yourself', description: '“Senators speak for themselves.”', outcome: 'She feels abandoned and starts voting against you.', effects: { stats: { approval: 1 }, senators: { 'santos-ochoa': 'neutral' } } },
      { id: 'ss_defend', label: 'Defend her', description: 'She is an ally.', outcome: 'The meme now includes your face.', effects: { stats: { approval: -2, media: 3 } } },
    ],
  },
  {
    id: 'pandemic_scare', month: 44, priority: 7, category: 'crisis', title: 'Bagong Virus', location: 'Department of Health',
    body: ['A new respiratory virus spreads from abroad. Forty cases in Maynilad; two deaths. Doctors urge a lockdown. Business begs you not to.'],
    choices: [
      { id: 'ps_lockdown', label: 'Two-week lockdown of Maynilad', description: 'Stop it early.', outcome: 'The outbreak is contained. The economy loses ₱200B in output.', effects: { stats: { growth: -0.8, approval: 2, protest: 3 } } },
      { id: 'ps_targeted', label: 'Targeted testing and isolation', description: 'Keep the economy open.', outcome: 'It spreads to Sugbu and Davira before it is controlled. 600 deaths.', effects: { stats: { approval: -5, growth: -0.3 }, spend: 8, spendLabel: 'Outbreak response' } },
      { id: 'ps_none', label: 'Downplay it — “It’s just a flu”', description: 'Avoid panic.', outcome: 'Hospitals overflow. 4,000 deaths. The Senate opens an inquiry into your response.', headline: 'OUTBREAK DEATHS SOAR; PALASYO BLAMED', effects: { stats: { approval: -12, growth: -1.2, ombudsman: 6, media: 10 } } },
    ],
  },
  {
    id: 'maynilad_floods', month: 45, priority: 6, category: 'calamity', title: 'Lubog ang Maynilad', location: 'Maynilad',
    body: ['Monsoon rains flood 80% of Maynilad. Cars float down avenues. The ₱50B flood-control program of the past decade did almost nothing.'],
    variants: [{ when: [{ flag: 'flood_commission' }], text: 'Your flood-control commission warned this would happen.' }],
    choices: [
      { id: 'mf_relief', label: 'Massive relief and a new flood master plan: ₱20B', description: 'Help now, fix later.', outcome: 'Relief flows. Engineers finally plan a real drainage system.', effects: { spend: 20, spendLabel: 'Maynilad flood relief', stats: { approval: 3 } } },
      { id: 'mf_blame', label: 'Blame the previous administration’s ghost projects', description: 'It’s their fault.', outcome: 'True — but you’ve been President for four years.', effects: { stats: { approval: -3 } } },
    ],
  },
  {
    id: 'inflation_return', month: 46, priority: 5, category: 'economy', title: 'Mahal na Naman', location: 'Wet markets',
    body: ['Inflation returns: rice, fuel, and electricity up together. Your approval slides.'],
    choices: [
      { id: 'ir_subsidy', label: 'Targeted subsidies: ₱25B', description: 'Help the poorest.', outcome: 'The poorest are cushioned; the middle class grumbles.', effects: { spend: 25, spendLabel: 'Inflation subsidies', stats: { approval: 2, inflation: -0.3 } } },
      { id: 'ir_tariff', label: 'Cut tariffs on food imports', description: 'Cheaper food, angrier farmers.', outcome: 'Prices ease; farmers protest.', effects: { taxRate: -0.03, stats: { inflation: -0.6, protest: 4 } } },
    ],
  },
  {
    id: 'credit_upgrade', month: 48, priority: 5, category: 'economy', title: 'Mabuting Balita: Credit Upgrade', location: 'Rating agencies',
    when: [{ stat: 'investor', gte: 55 }],
    body: ['A major rating agency upgrades the Republic to BBB+, citing reforms and growth. Borrowing costs fall.'],
    choices: [{ id: 'cu_celebrate', label: 'Announce it proudly', description: 'Good news for once.', outcome: 'Markets rally.', headline: 'KAPULUAN UPGRADED TO BBB+', effects: { stats: { investor: 5, approval: 2 } } }],
  },
  {
    id: 'credit_downgrade', month: 48, priority: 5, category: 'economy', title: 'Masamang Balita: Downgrade', location: 'Rating agencies',
    when: [{ stat: 'investor', lte: 45 }],
    body: ['A rating agency downgrades the Republic to junk, citing runaway spending and political instability. Borrowing costs jump.'],
    choices: [
      { id: 'cd_austerity', label: 'Announce a deficit-cutting plan', description: 'Restore confidence.', outcome: 'Markets calm. Congress balks at the cuts.', effects: { budgetChange: -100, stats: { investor: 5, cohesion: -5 } } },
      { id: 'cd_blame', label: 'Blame foreign speculators', description: 'Nationalist defiance.', outcome: 'The peso falls further.', effects: { stats: { investor: -5, inflation: 0.5 } } },
    ],
  },
  {
    id: 'prison_riot', month: 50, priority: 5, category: 'crisis', title: 'Gulo sa Bilibid', location: 'National Penitentiary',
    body: ['A riot at the national penitentiary leaves 19 dead. Investigators find drug labs, mansions built inside cells, and guards on gang payrolls.'],
    choices: [
      { id: 'pr_marines', label: 'Send the Marines to take over the prison', description: 'Restore control.', outcome: 'The Marines seize the prison. Human-rights groups document abuses of inmates.', effects: { stats: { crime: -3, military: 3, church: -2 } } },
      { id: 'pr_new_prisons', label: 'Build new regional prisons: ₱30B', description: 'Break up the gang capital.', outcome: 'Construction starts; the gangs remain for now.', effects: { project: { id: 'prisons', name: 'Regional prisons', region: 'National', cost: 30, months: 30 }, stats: { crime: -1 } } },
    ],
  },
  {
    id: 'big_one', month: 52, priority: 9, category: 'calamity', title: 'Ang “Big One”', location: 'Kalakhang Maynilad',
    body: ['The West Lambak Fault ruptures: a magnitude 7.2 earthquake under Maynilad. Buildings collapse; fires burn for two days. The death toll passes 8,000.'],
    choices: [
      { id: 'bo_all', label: 'Full national mobilization and foreign help: ₱150B', description: 'Everything.', outcome: 'Rescue teams from twelve countries arrive. The rebuilding will take years.', headline: 'THE BIG ONE: 8,000 DEAD', effects: { spend: 150, spendLabel: 'Big One response', stats: { approval: 6, growth: -1.5 }, project: { id: 'maynilad_rebuild', name: 'Maynilad earthquake reconstruction', region: 'Kalakhang Maynilad', cost: 250, months: 48 } } },
      { id: 'bo_capital', label: 'Emergency response and move government offices out of Maynilad', description: 'A new capital, eventually.', outcome: 'Relocation begins to a new government center in Gitnang Kapatagan. Critics call it a land deal.', effects: { spend: 100, spendLabel: 'Big One response and relocation', stats: { approval: 3, corruption: 3, growth: -1.2 } } },
    ],
  },
  {
    id: 'record_growth', month: 54, priority: 4, category: 'economy', title: 'Mabuting Balita: Rekord na Paglago', location: 'Statistics authority',
    when: [{ stat: 'growth', gte: 6 }],
    body: ['The economy grows at its fastest rate in 40 years. Unemployment hits a record low.'],
    choices: [{ id: 'rg_share', label: 'Share the credit with the workers', description: 'Humble.', outcome: 'The country feels good about itself for a week.', headline: 'FASTEST GROWTH IN 40 YEARS', effects: { stats: { approval: 3, investor: 3 } } }],
  },
  {
    id: 'recession_warning', month: 54, priority: 4, category: 'economy', title: 'Masamang Balita: Paghina ng Ekonomiya', location: 'Statistics authority',
    when: [{ stat: 'growth', lte: 4 }],
    body: ['Growth slows to its weakest in a decade. Factories cut shifts.'],
    choices: [
      { id: 'rw_stimulus', label: 'Emergency stimulus: ₱40B', description: 'Spend.', outcome: 'Growth recovers slightly. The deficit widens.', effects: { spend: 40, spendLabel: 'Stimulus', stats: { growth: 0.5 } } },
      { id: 'rw_wait', label: 'Wait it out', description: 'Cycles pass.', outcome: 'It does not pass quickly.', effects: { stats: { approval: -3, unemployment: 0.4 } } },
    ],
  },
  {
    id: 'miss_universe', month: 56, priority: 3, category: 'society', title: 'Miss Universe!', location: 'Pageant stage',
    body: ['Miss Kapuluan wins Miss Universe. The whole country stops to watch.'],
    choices: [
      { id: 'mu_welcome', label: 'Welcome her at the Palasyo', description: 'Pageants are a national religion.', outcome: 'The photo op is worth more than any speech.', effects: { stats: { approval: 2 } } },
      { id: 'mu_skip', label: 'Skip it — “We have serious work to do”', description: 'Seriousness.', outcome: 'The internet does not forgive you.', effects: { stats: { approval: -2 } } },
    ],
  },
  {
    id: 'kidnapping_wave', month: 58, priority: 5, category: 'crisis', title: 'Mga Pagdukot', location: 'Maynilad',
    body: ['Kidnappings of businessmen’s children surge. The gangs are former offshore-casino enforcers.'],
    choices: [
      { id: 'kw_taskforce', label: 'A special anti-kidnapping task force', description: 'Intelligence-led.', outcome: 'Four gangs are dismantled.', effects: { spend: 2, spendLabel: 'Anti-kidnapping task force', stats: { crime: -4, investor: 2 } } },
      { id: 'kw_shoot', label: '“Shoot the kidnappers on sight”', description: 'Tough talk.', outcome: 'Police kill 30 suspects in a month. Some were not kidnappers.', effects: { stats: { crime: -3, church: -6, courtTension: 5 }, flags: { ch2_abuse: true } } },
    ],
  },
  {
    id: 'hospital_crisis', month: 60, priority: 5, category: 'society', title: 'Puno ang Ospital', location: 'Public hospitals',
    body: ['Patients sleep on floors and in hallways; two patients per bed. Nurses keep leaving for abroad.'],
    choices: [
      { id: 'hc_beds', label: '₱25B for beds and nurses', description: 'Fund it.', outcome: 'Relief, slowly.', effects: { spend: 25, spendLabel: 'Hospital capacity', stats: { approval: 3 } } },
      { id: 'hc_ppp', label: 'Let private operators run public hospitals', description: 'Efficiency.', outcome: 'Service improves; fees appear.', effects: { stats: { investor: 3, approval: -2 } } },
    ],
  },
  {
    id: 'youth_mental_health', month: 61, priority: 4, category: 'society', title: 'Ang mga Kabataan', location: 'Schools nationwide',
    body: ['A wave of student suicides shocks the nation. Schools have one guidance counselor per 2,000 students.'],
    choices: [
      { id: 'ymh_counselors', label: 'Hire 10,000 counselors', description: '₱5B a year.', outcome: 'It is a start.', effects: { program: { id: 'counselors', label: 'School counselors', monthly: 0.4, months: 60 }, stats: { approval: 2 } } },
      { id: 'ymh_hotline', label: 'A national hotline', description: 'Cheap and fast.', outcome: 'The hotline is overwhelmed in its first week.', effects: { spend: 0.3, spendLabel: 'Mental health hotline' } },
    ],
  },
  {
    id: 'drought_2032', month: 63, priority: 5, category: 'calamity', title: 'Tagtuyot', location: 'Farmlands nationwide',
    body: ['El Niño brings the worst drought in 50 years. Harvests fail. Rice prices climb.'],
    choices: [
      { id: 'dr_aid', label: 'Farm aid and cloud seeding: ₱15B', description: 'Save the harvest.', outcome: 'Some harvests are saved.', effects: { spend: 15, spendLabel: 'Drought response', stats: { inflation: -0.2, approval: 2 } } },
      { id: 'dr_import', label: 'Import rice massively', description: 'Feed the country.', outcome: 'Rice stays cheap; farmers are ruined twice.', effects: { stats: { inflation: -0.4, protest: 4 } } },
    ],
  },
  {
    id: 'national_artist_death', month: 65, priority: 2, category: 'society', title: 'Paalam, Pambansang Alagad ng Sining', location: 'Cultural Center',
    body: ['Beloved singer and National Artist Lea Magdangal dies. Millions mourn. Her family asks for a state funeral.'],
    choices: [
      { id: 'na_funeral', label: 'A state funeral', description: 'Honor her.', outcome: 'The country sings her songs together.', effects: { stats: { approval: 1 } } },
    ],
  },
  {
    id: 'final_rally', month: 66, priority: 6, category: 'society', title: 'Ang Huling Rally', location: 'Avenida Liwayway',
    body: ['Two enormous rallies fill Maynilad on the same Sunday: one for your successor, one for the opposition. Both are larger than anything in your term.'],
    choices: [
      { id: 'fr_join', label: 'Speak at your successor’s rally', description: 'Throw your weight behind them.', outcome: 'Your speech energizes the base — and makes the election a referendum on you.', effects: { stats: { cohesion: 4, media: 4 }, flags: { successor_boost: true } } },
      { id: 'fr_stay', label: 'Stay above the fray', description: 'Presidential neutrality.', outcome: 'Your successor wishes you had come.', effects: { stats: { media: -2 } } },
    ],
  },

  // ═════════════════════════ FAMILY ═════════════════════════
  {
    id: 'family_strain', month: 39, priority: 5, category: 'family', title: 'Sa Loob ng Palasyo', location: 'Private residence',
    body: ['Your spouse says it plainly: “You haven’t eaten dinner with us in four months.” Your youngest child has stopped talking to you.'],
    choices: [
      { id: 'fs_vacation', label: 'Take a week off with the family', description: 'The country can wait a week.', outcome: 'A week in Visara. The press calls it “the President’s vacation during the budget season.”', effects: { stats: { family: 15, media: 3 } } },
      { id: 'fs_later', label: '“After the budget”', description: 'Work first.', outcome: 'After the budget, there is always something else.', effects: { stats: { family: -10 } } },
    ],
  },
  {
    id: 'child_wedding', month: 47, priority: 4, category: 'family', title: 'Ang Kasal', location: 'A cathedral in Maynilad',
    body: ['Your daughter Bea is getting married. Your relatives want a wedding “fit for a President’s daughter.” The public is watching the price tag.'],
    choices: [
      { id: 'cw_simple', label: 'A simple wedding', description: 'No excess.', outcome: 'The photos of a simple wedding charm the country.', effects: { stats: { approval: 2, family: 4 } } },
      { id: 'cw_grand', label: 'A grand wedding — with 3,000 guests', description: 'Once in a lifetime.', outcome: 'Ambassadors, tycoons, and a ₱60M price tag. The comparison with the strongman’s daughter’s wedding writes itself.', headline: '₱60M WEDDING FOR PRESIDENT’S DAUGHTER', effects: { stats: { approval: -5, media: 8, family: 6 } } },
    ],
  },
  {
    id: 'affair_rumor', month: 53, priority: 5, category: 'family', title: 'Bulung-bulungan', location: 'Tabloids',
    body: ['A tabloid publishes photos suggesting you are having an affair with a Cabinet undersecretary. The photos are blurry. Your spouse has seen them.'],
    choices: [
      { id: 'ar_deny', label: 'Deny it publicly with your spouse at your side', description: 'United front.', outcome: 'Your spouse stands beside you — for the cameras.', effects: { stats: { family: -8, media: 3 } } },
      { id: 'ar_sue', label: 'Sue the tabloid for libel', description: 'Fight back.', outcome: 'Press-freedom groups criticize you; the story spreads.', effects: { stats: { media: 8, family: -4 } } },
      { id: 'ar_ignore', label: 'Ignore it', description: 'Don’t dignify it.', outcome: 'The story fades — slowly.', effects: { stats: { family: -5 } } },
    ],
  },
  {
    id: 'brother_arrest', month: 64, priority: 5, category: 'family', title: 'Hinuli ang Kapatid', location: 'NBI headquarters',
    when: [{ any: [{ flag: 'brother_customs' }, { flag: 'brother_adviser' }, { flag: 'brother_running' }] }],
    body: ['Your brother Carlito is arrested for graft related to his dealings during your first years in office.'],
    choices: [
      { id: 'ba_law', label: 'Let the law take its course', description: 'No special treatment.', outcome: 'Carlito spends the night in a detention cell. Your mother’s photograph watches from the wall.', effects: { stats: { family: -12, approval: 3 } } },
      { id: 'ba_intervene', label: 'Make a call', description: 'Get him out.', outcome: 'He is released “for lack of evidence” within hours. Nobody believes it.', effects: { stats: { family: 8, approval: -6, ombudsman: 8 }, flags: { ch2_cover_up: true } } },
    ],
  },
  {
    id: 'grandchild', month: 66, priority: 2, category: 'family', title: 'Apo', location: 'Hospital',
    when: [{ resolved: 'child_wedding' }],
    body: ['Your first grandchild is born.'],
    choices: [{ id: 'gc_hold', label: 'Hold the baby', description: 'For a moment, nothing else matters.', outcome: 'For one afternoon, you are not the President.', effects: { stats: { family: 12 } } }],
  },

  // ═════════════════════════ SUPREME COURT ═════════════════════════
  {
    id: 'court_chacha', category: 'court', title: 'Korte Suprema: Charter Change', location: 'Kataas-taasang Hukuman',
    when: [{ flag: 'law_b2_economic_chacha' }],
    body: ['The Court rules on whether Congress may amend the economic provisions of the Constitution without a constitutional convention.'],
    court: { title: 'Nationalist Alliance v. Congress (economic charter amendments)', kind: 'economic', soundness: 0.45, onStrike: { stats: { investor: -8 } }, onUphold: { stats: { investor: 4 } } },
    choices: [{ id: 'ccc_accept', label: 'Accept the ruling', description: 'Respect the Court.', outcome: 'The ruling is final.', effects: {} }],
  },
  {
    id: 'court_barangay_term', category: 'court', title: 'Korte Suprema: Barangay Elections', location: 'Kataas-taasang Hukuman',
    when: [{ flag: 'law_b2_barangay_term' }],
    body: ['The Court rules on the postponement of barangay elections and the extension of village officials’ terms.'],
    court: { title: 'Voters’ Rights Coalition v. COMELEC (barangay term extension)', kind: 'electoral', soundness: 0.3, onStrike: { stats: { cohesion: -4 } }, onUphold: { stats: { cohesion: 2 } } },
    choices: [{ id: 'cbt_accept', label: 'Accept the ruling', description: 'Respect the Court.', outcome: 'The ruling stands.', effects: {} }],
  },
  {
    id: 'court_immunity_law', category: 'court', title: 'Korte Suprema: Ang Batas ng Immunity', location: 'Kataas-taasang Hukuman',
    when: [{ flag: 'immunity_law' }],
    body: ['The Court rules on the Former Presidents Protection Act — the law that would shield you after your term.'],
    court: { title: 'Integrated Bar v. Executive Secretary (former presidents’ immunity)', kind: 'rights', soundness: 0.15, onStrike: { flags: { immunity_law: false } }, onUphold: { flags: { immunity_upheld: true } } },
    choices: [
      { id: 'cil_struck', label: 'Accept that the law is void', description: 'No special protection.', when: [{ ruling: 'struck' }], outcome: 'The Court rules unanimously: “No one is above the law, before or after their term.”', headline: 'SC VOIDS FORMER PRESIDENTS’ IMMUNITY LAW', effects: {} },
      { id: 'cil_upheld', label: 'Welcome the ruling', description: 'You are protected.', when: [{ ruling: 'upheld' }], outcome: 'Legal scholars are aghast.', effects: { stats: { media: 8 } } },
    ],
  },
  {
    id: 'court_midnight', category: 'court', title: 'Korte Suprema: Midnight Appointments', location: 'Kataas-taasang Hukuman',
    when: [{ flag: 'midnight_appointees' }],
    body: ['The Court rules on the validity of your 800 midnight appointments.'],
    court: { title: 'Good Government Coalition v. Executive Secretary (midnight appointments)', kind: 'executive', soundness: 0.3, onStrike: { flags: { midnight_voided: true } }, onUphold: { stats: { capital: 3 } } },
    choices: [{ id: 'cm_accept', label: 'Accept the ruling', description: 'Respect the Court.', outcome: 'The ruling is final.', effects: {} }],
  },
  {
    id: 'court_expropriation', month: 50, priority: 5, category: 'court', title: 'Korte Suprema: Ang Grid', location: 'Kataas-taasang Hukuman',
    when: [{ flag: 'grid_nationalized' }],
    body: ['The Haizhou-linked former grid owners challenge your takeover of the national grid as unconstitutional expropriation without just compensation.'],
    court: { title: 'Grid Holdings v. Republic (expropriation)', kind: 'economic', soundness: 0.55, onStrike: { spend: 40, spendLabel: 'Additional grid compensation', stats: { investor: -3 } }, onUphold: { stats: { sovereignty: 3 } } },
    choices: [{ id: 'ce_accept', label: 'Accept the ruling', description: 'Pay or proceed.', outcome: 'The ruling is implemented.', effects: {} }],
  },
  {
    id: 'court_confidential_funds', month: 53, priority: 5, category: 'court', title: 'Korte Suprema: Confidential Funds', location: 'Kataas-taasang Hukuman',
    body: ['Petitioners ask the Court to declare confidential and intelligence funds for civilian offices unconstitutional — including the Palasyo’s.'],
    court: { title: 'Taxpayers’ League v. Budget Secretary (confidential funds)', kind: 'executive', soundness: 0.5, onStrike: { stats: { corruption: -3, military: -2 } }, onUphold: { stats: { capital: 2 } } },
    choices: [
      { id: 'ccf_comply', label: 'Comply', description: 'Give up the funds.', when: [{ ruling: 'struck' }], outcome: 'Confidential funds for civilian offices end.', effects: {} },
      { id: 'ccf_upheld', label: 'Welcome the ruling', description: 'Keep the funds.', when: [{ ruling: 'upheld' }], outcome: 'The funds remain.', effects: {} },
    ],
  },
  {
    id: 'court_redtag_ruling', month: 57, priority: 4, category: 'court', title: 'Korte Suprema: Red-Tagging', location: 'Kataas-taasang Hukuman',
    body: ['The Court rules that red-tagging threatens the right to life and orders protection for the families of red-tagged teachers.'],
    court: { title: 'In re: Petitions for Writs of Amparo (red-tagged teachers)', kind: 'rights', soundness: 0.3, onStrike: { stats: { military: -4, church: 3 } } },
    choices: [
      { id: 'crr_implement', label: 'Order the military to comply', description: 'Obey the Court.', outcome: 'The task forces are reined in.', effects: {} },
      { id: 'crr_ignore', label: 'Let the military interpret it narrowly', description: 'Protect the soldiers.', outcome: 'The Court is not pleased.', effects: { stats: { courtTension: 6 } } },
    ],
  },
  {
    id: 'justice_impeach_2', month: 54, priority: 6, category: 'court', title: 'Impeach a Justice?', location: 'House Committee on Justice',
    when: [{ stat: 'courtTension', gte: 35 }],
    body: ['Your allies want to impeach an associate justice who has written three opinions against your administration, accusing her of undeclared wealth.'],
    choices: [
      { id: 'ji_go', label: 'Let them proceed', description: 'She is a political enemy.', outcome: 'The House impeaches her. The Senate trial becomes a war between branches.', effects: { stats: { courtTension: 15, media: 8, capital: -5 }, flags: { ch2_abuse: true } } },
      { id: 'ji_stop', label: 'Stop them', description: 'Leave the Court alone.', outcome: 'The justice keeps writing dissents. The Republic’s institutions remain intact.', effects: { stats: { courtTension: -5 } } },
    ],
  },
];
