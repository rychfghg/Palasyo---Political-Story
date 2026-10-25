import type { Effects, StoryEvent } from '@/features/narrative/types/event';

/** One year’s budget cycle: House hearings, Senate hearings, and the signing. */
function budgetCycle(fy: number, m: number): StoryEvent[] {
  return [
    {
      id: `budget_house_${fy}`, month: m, priority: 8, category: 'congress', title: `FY${fy} Budget: The House Hearings`, location: 'House Committee on Appropriations', speaker: '{appropriationsChair}',
      body: [`The FY${fy} National Expenditure Program goes before the House. Your Budget Secretary, {sec:budget}, faces fourteen hours of questioning.`, 'The opposition targets the Palasyo’s confidential funds. Allies want their districts’ projects restored. Everyone wants something.'],
      variants: [{ when: [{ flag: 'house_lost' }], text: 'The House is no longer yours. The committee chair is openly hostile.' }],
      choices: [
        { id: `bh${fy}_defend`, label: 'Defend the budget line by line', description: 'No insertions, no cuts.', outcome: 'Your Budget Secretary holds firm. The hearings drag on; the committee sends the budget to the floor with grumbling.', effects: { stats: { cohesion: -3, corruption: -1 } } },
        { id: `bh${fy}_trade`, label: 'Trade: accept ₱60B in district projects', description: 'Smooth passage.', outcome: 'The budget sails through the House in record time.', effects: { budgetChange: 60, stats: { cohesion: 5, corruption: 3 } } },
        { id: `bh${fy}_confidential`, label: 'Give up the Palasyo’s confidential funds to buy goodwill', description: 'A public sacrifice.', outcome: 'The opposition is disarmed. The Presidential Security Group is not happy.', headline: `PALASYO GIVES UP CONFIDENTIAL FUNDS IN FY${fy} BUDGET`, effects: { stats: { media: -5, military: -3, corruption: -2, approval: 1 } } },
      ],
    },
    {
      id: `budget_senate_${fy}`, month: m + 1, priority: 8, category: 'congress', title: `FY${fy} Budget: The Senate`, location: 'Senate Committee on Finance',
      body: ['In the Senate, the budget faces its toughest critics. Senator Anselmo Lagdameo presents a 90-slide deck of “questionable items.” Education and health advocates pack the gallery demanding more money for schools and hospitals.'],
      choices: [
        { id: `bs${fy}_schools`, label: 'Realign ₱40B to schools and hospitals', description: 'Cut roads, fund classrooms.', outcome: 'Teachers and doctors cheer. Road contractors call their congressmen.', headline: `₱40B REALIGNED TO SCHOOLS, HOSPITALS`, effects: { stats: { approval: 3, cohesion: -3 } } },
        { id: `bs${fy}_hold`, label: 'Hold the House version', description: 'Avoid a bicameral fight.', outcome: 'The Senate grudgingly concedes. Lagdameo votes no.', effects: { stats: { cohesion: 2 } } },
        { id: `bs${fy}_cut`, label: 'Cut ₱80B to reduce the deficit', description: 'Fiscal discipline.', outcome: 'The rating agencies approve. Every district loses something.', effects: { budgetChange: -80, stats: { investor: 5, cohesion: -5 } } },
      ],
    },
    {
      id: `budget_sign_${fy}`, month: m + 3, priority: 9, category: 'congress', title: `Signing the FY${fy} Budget`, location: 'Rizal Hall, Palasyo ng Malaya',
      body: [`The bicameral conference report for FY${fy} is on your desk.`, fy === 2033 ? 'It is an election-year budget. Your party’s candidates want spending everywhere.' : 'The deficit is still wide. Congress wants more.'],
      choices: [
        { id: `sign${fy}_lean`, label: 'Sign a lean budget: +4%', description: 'Protect the debt ceiling.', outcome: 'The budget is signed. Economists nod; congressmen sulk.', effects: { vote: { bill: `General Appropriations Act of ${fy}`, appeal: 0, onPass: { enactBudget: { fy, mode: 'growth', growth: 0.04 }, law: { id: `gaa${fy}`, name: `General Appropriations Act of ${fy}`, summary: 'A lean budget, +4%.' }, stats: { investor: 4 } }, onFail: { enactBudget: { fy, mode: 'reenacted' }, stats: { capital: -5 } } } } },
        { id: `sign${fy}_normal`, label: 'Sign a normal budget: +8%', description: 'Keep pace with the economy.', outcome: 'The budget is signed without drama.', effects: { vote: { bill: `General Appropriations Act of ${fy}`, appeal: 2, onPass: { enactBudget: { fy, mode: 'growth', growth: 0.08 }, law: { id: `gaa${fy}`, name: `General Appropriations Act of ${fy}`, summary: 'A standard budget, +8%.' } }, onFail: { enactBudget: { fy, mode: 'reenacted' } } } } },
        { id: `sign${fy}_big`, label: 'Sign a big-spending budget: +14%', description: fy === 2033 ? 'Win the 2033 election.' : 'Build everything.', outcome: 'Congress is delighted. The Finance department is not.', effects: { vote: { bill: `General Appropriations Act of ${fy}`, appeal: 3, onPass: { enactBudget: { fy, mode: 'growth', growth: 0.14 }, law: { id: `gaa${fy}`, name: `General Appropriations Act of ${fy}`, summary: 'An expansionary budget, +14%.' }, stats: { cohesion: 6, investor: -6, growth: 0.3 } }, onFail: { enactBudget: { fy, mode: 'reenacted' } } } } },
      ],
    },
  ];
}

const sona = (id: string, m: number, title: string, text: string): StoryEvent => ({
  id, month: m, priority: 6, category: 'address', title, location: 'Session Hall, Batasang Pambansa',
  body: [text, 'Your approval stands at {approval}. The hall is full; so is Avenida Liwayway outside.'],
  choices: [
    { id: `${id}_record`, label: 'Tout your record', description: 'Roads, laws, jobs.', outcome: 'Your allies applaud 110 times. Fact-checkers get to work.', effects: { stats: { approval: 2, media: 3, cohesion: 3 } } },
    { id: `${id}_humble`, label: 'Speak honestly about what failed', description: 'A rare humility.', outcome: 'The gallery applauds. The opposition has nothing to attack.', effects: { stats: { approval: 3, media: -6, church: 3 } } },
    { id: `${id}_fight`, label: 'Go on the attack', description: 'Name the obstructionists.', outcome: 'Thrilling television. Guaranteed war.', effects: { stats: { approval: 2, media: 10, cohesion: 2 }, senateShift: { from: 'neutral', to: 'opposition', count: 1 } } },
  ],
});

const guiltyTrial: Effects = { flags: { final_fate: 'imprisoned' } };

export const POLITICS_2: StoryEvent[] = [
  // ═════════════════════════ 2030: A NEW CONGRESS ═════════════════════════
  {
    id: 'ch2_new_congress', month: 36, priority: 10, category: 'congress', title: 'Ang Bagong Kongreso', location: 'Batasang Pambansa',
    body: ['The Congress elected in May convenes. The first vote of the House is for Speaker; the first of the Senate, for Senate President. Both will decide what the last three years of your presidency look like.'],
    variants: [
      { when: [{ flag: 'senate_control', is: 'administration' }], text: 'Your coalition won enough Senate seats to control the chamber — if it stays united.' },
      { when: [{ flag: 'senate_control', is: 'opposition' }], text: 'The opposition has the numbers in the Senate. The new Senate President will be your adversary.' },
    ],
    choices: [
      { id: 'nc_loyal', label: 'Install loyalists as Speaker and Senate President', description: 'Spend everything to control both chambers.', outcome: 'You win the Speakership. The Senate vote is closer — and costs promises you will have to keep.', effects: { stats: { capital: -10, corruption: 3, cohesion: 6 }, houseShift: 6, senateShift: { from: 'neutral', to: 'ally', count: 2 } } },
      { id: 'nc_deal', label: 'Cut a deal with the independents', description: 'Share the committee chairmanships.', outcome: 'A power-sharing Congress: slower, but less hostile.', effects: { stats: { cohesion: 3 }, senateShift: { from: 'opposition', to: 'neutral', count: 1 } } },
      { id: 'nc_stay_out', label: 'Let each chamber choose its own leaders', description: 'Respect separation of powers.', outcome: 'Both chambers choose leaders who owe you nothing.', headline: 'CONGRESS ELECTS INDEPENDENT LEADERS', effects: { stats: { cohesion: -6, courtTension: -2 }, senateShift: { from: 'ally', to: 'neutral', count: 2 } } },
    ],
  },
  sona('sona_2030', 37, 'The Fourth SONA', 'Your fourth State of the Nation Address — the first of the second half.'),
  ...budgetCycle(2031, 38),
  {
    id: 'blue_ribbon_admin', month: 40, priority: 7, category: 'scandal', title: 'Ang MediKit Hearings', location: 'Senate Blue Ribbon Committee',
    body: ['The Senate investigates the ₱28 billion purchase of medical kits by your Health department from MediKit Solutions — a company whose incorporators include a former aide of your Executive Secretary. The kits were overpriced by 300%.'],
    choices: [
      { id: 'mk_cooperate', label: 'Order full cooperation and suspend the officials', description: 'Clean house publicly.', outcome: 'Four officials are suspended. The trail stops at the Executive Secretary’s former aide — for now.', effects: { stats: { corruption: -3, approval: 2, cabinetCohesion: -4 } } },
      { id: 'mk_privilege', label: 'Bar officials from testifying', description: 'Executive privilege.', outcome: 'The Senate cites three officials for contempt. The story grows.', headline: 'PALASYO BLOCKS MEDIKIT PROBE', effects: { stats: { media: 8, ombudsman: 10 }, flags: { ch2_cover_up: true } } },
      { id: 'mk_scapegoat', label: 'Blame the procurement agency and dissolve it', description: 'A new agency, a fresh start.', outcome: 'The agency is dissolved. The money is not recovered.', effects: { stats: { corruption: 2 } } },
    ],
  },
  {
    id: 'speaker_ouster', month: 42, priority: 7, category: 'congress', title: 'Kudeta sa Kamara', location: 'House of Representatives',
    body: ['A faction led by {minorityLeader} and disgruntled allies moves to oust Speaker {speaker}. They claim 170 signatures. The new Speaker would be friendlier to {rival}.'],
    choices: [
      { id: 'so_defend', label: 'Defend the Speaker with everything', description: 'Projects, posts, promises.', outcome: 'The vote is called.', effects: { spend: 15, spendLabel: '“Development funds” to hold the Speakership', stats: { capital: -8, corruption: 3 }, vote: { bill: 'Motion to retain the Speaker', appeal: 1, houseOnly: true, onPass: { stats: { cohesion: 5 } }, onFail: { houseShift: -25, flags: { house_lost_2: true } } } } },
      { id: 'so_switch', label: 'Back a new Speaker from your coalition', description: 'Sacrifice the Speaker to keep the House.', outcome: 'The old Speaker falls; your new Speaker owes you — and so do the rebels.', effects: { stats: { capital: -4, cohesion: 3 } } },
      { id: 'so_neutral', label: 'Stay out of it', description: 'The House chooses its own leaders.', outcome: 'The rebels win. The House is now led by {rival}’s allies.', headline: 'SPEAKER OUSTED; OPPOSITION-FRIENDLY SPEAKER ELECTED', effects: { houseShift: -30, stats: { cohesion: -10 }, flags: { house_lost_2: true } } },
    ],
  },
  {
    id: 'vp_2033', month: 44, priority: 7, category: 'cabinet', title: 'Ang Ambisyon ng Bise', location: 'Office of the Vice President',
    body: ['Vice President {vp} tells you privately that they will run for President in 2033 — with or without your blessing.'],
    variants: [{ when: [{ flag: 'vp_open_war' }], text: 'Given everything between you, this is less a courtesy than a declaration of war.' }],
    choices: [
      { id: 'vp33_bless', label: 'Give your blessing', description: 'The VP has earned it.', when: [{ vpAlly: true }, { none: [{ flag: 'vp_open_war' }] }], outcome: 'The VP embraces you. Two Cabinet secretaries with their own ambitions begin looking for other patrons.', effects: { flags: { successor_leaning: 'vp' }, stats: { cabinetCohesion: -4 } } },
      { id: 'vp33_wait', label: 'Say it is too early', description: 'Keep options open.', outcome: 'The VP nods and begins building a separate machine.', effects: { flags: { vp_independent_run: true } } },
      { id: 'vp33_oppose', label: 'Tell the VP you will back someone else', description: 'Your successor will be your own choice.', outcome: 'The VP leaves without a word. By evening, the VP’s allies are briefing reporters against you.', effects: { flags: { vp_open_war: true, vp_is_ally: false }, stats: { cohesion: -5, media: 4 } } },
    ],
  },
  {
    id: 'spouse_politics', month: 46, priority: 7, category: 'family', title: 'Ang Asawa ng Pangulo', location: 'Private residence, Palasyo',
    body: ['Over breakfast, your spouse announces a decision: “I’m running for the Senate in 2033. Or for President, if you’ll back me.” Party leaders say the First Spouse polls surprisingly well — especially among women and the poor who received the nutrition program.'],
    choices: [
      { id: 'sp_senate', label: 'Support a Senate run', description: 'A political family is born.', outcome: 'Your spouse begins touring the provinces. Critics call it the birth of a new dynasty.', headline: 'FIRST SPOUSE EYES SENATE SEAT', effects: { flags: { spouse_running: true }, stats: { family: 8, media: 5, corruption: 2 } } },
      { id: 'sp_president', label: 'Back your spouse for President', description: 'Keep the Palasyo in the family.', outcome: 'Your party is split. The VP is furious. The opposition cannot believe its luck: “a conjugal dictatorship.”', headline: '“CONJUGAL DICTATORSHIP”? FIRST SPOUSE FOR PRESIDENT', effects: { flags: { successor_leaning: 'spouse', vp_open_war: true }, stats: { family: 12, media: 12, cohesion: -8 } } },
      { id: 'sp_no', label: 'Ask your spouse not to run', description: 'One politician in the family is enough.', outcome: 'Your spouse agrees — coldly. The marriage becomes quieter.', effects: { stats: { family: -15 } } },
    ],
  },
  sona('sona_2031', 49, 'The Fifth SONA', 'Your second-to-last State of the Nation Address.'),
  ...budgetCycle(2032, 50),
  {
    id: 'senate_president_coup_2', month: 55, priority: 7, category: 'congress', title: 'Bagong Pinuno ng Senado', location: 'Senate',
    body: ['Thirteen senators sign a resolution replacing {senatePresident}. The new Senate President will control the Blue Ribbon Committee — and any investigation of your administration after 2033.'],
    choices: [
      { id: 'spc_counter', label: 'Flip two signatures back', description: 'Offer them committee chairs.', outcome: 'You hold the Senate — for now.', effects: { stats: { capital: -6, corruption: 2 } } },
      { id: 'spc_accept', label: 'Accept the new leadership', description: 'Work with whoever leads.', outcome: 'The new Senate President is cordial — and independent.', effects: { senateShift: { from: 'ally', to: 'neutral', count: 2 } } },
    ],
  },
  {
    id: 'successor_choice', month: 56, priority: 9, category: 'election', title: 'Ang Papalit', location: '{party} national convention',
    body: ['You cannot run again. The Constitution forbids it. But the party needs a presidential candidate for 2033 — and your endorsement will matter more than anything else.'],
    choices: [
      { id: 'succ_vp', label: 'Endorse Vice President {vp}', description: 'Continuity.', when: [{ vpAlly: true }, { none: [{ flag: 'vp_open_war' }] }], outcome: 'The VP accepts your endorsement to thunderous applause.', effects: { flags: { successor_choice: 'vp', successor_name: '{vp}' } } },
      { id: 'succ_spouse', label: 'Endorse your spouse', description: 'Keep it in the family.', when: [{ flag: 'successor_leaning', is: 'spouse' }], outcome: 'The convention nominates your spouse. The VP walks out.', headline: 'FIRST SPOUSE NOMINATED', effects: { flags: { successor_choice: 'spouse', successor_name: 'your spouse' }, stats: { cohesion: -6 } } },
      { id: 'succ_technocrat', label: 'Endorse your Finance Secretary', description: 'A competent technocrat with no base.', outcome: 'Economists applaud. Voters ask who that is.', effects: { flags: { successor_choice: 'technocrat', successor_name: 'Sec. Estela Lacson-Ong' } } },
      { id: 'succ_party', label: 'Endorse the party’s most popular governor', description: 'Governor Joy Bautista — a proven vote-getter.', outcome: 'The governor accepts, and immediately starts distancing from your unpopular policies.', effects: { flags: { successor_choice: 'party', successor_name: 'Gov. Joy Bautista' } } },
      { id: 'succ_rival_deal', label: 'Secretly deal with {rival}: endorse them in exchange for protection', description: 'Guarantee your safety after 2033.', outcome: 'The deal is sealed in a hotel suite. {rival} will not prosecute you. Your party will never forgive you — if it finds out.', headline: undefined, effects: { flags: { successor_choice: 'rival_deal', successor_name: '{rival}', rival_protection: true }, stats: { cohesion: -12 }, schedule: [{ event: 'rival_deal_leak', inMonths: 5 }] } },
      { id: 'succ_none', label: 'Stay neutral', description: 'Let the voters decide.', outcome: 'Your party splits into three camps.', effects: { flags: { successor_choice: 'none', successor_name: 'The administration’s divided candidates' }, stats: { cohesion: -8 } } },
    ],
  },
  {
    id: 'rival_deal_leak', category: 'scandal', title: 'Ang Lihim na Kasunduan', location: 'Leaked recording',
    when: [{ flag: 'rival_protection' }],
    body: ['A recording leaks of your meeting with {rival}: you promising your endorsement in exchange for a guarantee that you will never be prosecuted.'],
    choices: [
      { id: 'rdl_deny', label: 'Deny it', description: 'It’s fake.', outcome: 'Few believe you. Your party’s base is in revolt.', effects: { stats: { approval: -8, cohesion: -10, media: 10 }, flags: { ch2_cover_up: true } } },
      { id: 'rdl_admit', label: 'Admit it: “I did it for national unity”', description: 'Spin it as reconciliation.', outcome: 'Some believe you. Most see self-protection.', effects: { stats: { approval: -5, cohesion: -8 } } },
    ],
  },
  {
    id: 'opposition_candidate', month: 57, priority: 7, category: 'election', title: 'Ang Kalaban', location: 'Opposition convention',
    body: ['The opposition chooses its candidate for 2033.'],
    choices: [
      { id: 'opp_rival', label: '{rival} runs again', description: 'The rematch.', when: [{ none: [{ flag: 'rival_protection' }] }], outcome: '{rival} launches the campaign at the same grandstand where the Bantay Bayan movement began.', effects: { flags: { opposition_candidate: '{rival}' } } },
      { id: 'opp_broadcaster', label: 'Senator Ernesto “Kuya Erning” Tuazon', description: 'The populist broadcaster. Tops every poll.', outcome: 'Tuazon promises to “jail the corrupt — starting with the President.”', headline: 'TUAZON: “I WILL JAIL THE PRESIDENT”', effects: { flags: { opposition_candidate: 'Sen. Ernesto Tuazon', prosecution_promise: true } } },
      { id: 'opp_salcedo', label: 'Senator Aurora “Rora” Salcedo', description: 'The reformer.', outcome: 'Salcedo promises “accountability, not vengeance.”', effects: { flags: { opposition_candidate: 'Sen. Aurora Salcedo' } } },
    ],
  },
  {
    id: 'turncoats', month: 58, priority: 6, category: 'congress', title: 'Mga Balimbing', location: 'Every party headquarters',
    body: ['The polls for 2033 are tightening. Allies who owe their careers to you are quietly negotiating with the opposition. Forty congressmen and three senators are rumored to be ready to switch.'],
    choices: [
      { id: 'tc_projects', label: 'Hold them with projects', description: '₱25B in last-year projects.', outcome: 'Most stay. Some take the money and switch anyway.', effects: { spend: 25, spendLabel: 'Projects to hold allies', stats: { cohesion: 5, corruption: 4 } } },
      { id: 'tc_threat', label: 'Threaten investigations', description: '“Remember what we know.”', outcome: 'It works — and gets recorded again.', effects: { stats: { cohesion: 4, ombudsman: 8 }, flags: { ch2_abuse: true } } },
      { id: 'tc_let_go', label: 'Let them go', description: 'Loyalty cannot be bought.', outcome: 'Thirty congressmen switch. Your candidate’s machinery weakens.', effects: { houseShift: -30, stats: { cohesion: -6 } } },
    ],
  },
  {
    id: 'lame_duck', month: 59, priority: 5, category: 'cabinet', title: 'Lame Duck', location: 'Cabinet Room',
    body: ['Five Cabinet secretaries resign to run for office. The ones who remain are updating their résumés. Government slows to a crawl.'],
    choices: [
      { id: 'ld_technocrats', label: 'Fill the posts with career officials', description: 'Competence for the final year.', outcome: 'Quiet, capable caretakers. The machine keeps running.', effects: { stats: { cabinetCohesion: 5 } } },
      { id: 'ld_loyalists', label: 'Fill them with loyalists who will protect you later', description: 'Think about after 2033.', outcome: 'Your loyalists quietly begin shredding documents.', effects: { stats: { cabinetCohesion: 3, corruption: 4 }, flags: { ch2_cover_up: true } } },
    ],
  },
  {
    id: 'new_chief_justice', month: 60, priority: 7, category: 'court', title: 'Bagong Punong Mahistrado', location: 'Judicial and Bar Council',
    body: ['Chief Justice Arcilla-Navarro turns 70 and retires. The JBC sends you its shortlist for Chief Justice. Whoever you choose will lead the Court that hears any case against you after 2033.'],
    variants: [{ when: [{ flag: 'cj_ousted' }], text: 'Your earlier removal of a Chief Justice hangs over this appointment.' }],
    choices: [
      { id: 'cj_senior', label: 'The most senior justice — Antonio Benedicto’s successor, Justice Ramon Estrellado', description: 'Tradition: seniority.', outcome: 'The legal community applauds the respect for tradition.', effects: { stats: { courtTension: -8 } } },
      { id: 'cj_ally', label: 'Your own appointee on the Court', description: 'A Chief Justice who owes you.', when: [{ flag: 'cj_ousted', not: true }], outcome: 'Critics say you are preparing your defense. Your appointee says only: “I owe my loyalty to the Constitution.”', headline: 'PRESIDENT’S APPOINTEE NAMED CHIEF JUSTICE', effects: { stats: { courtTension: 5, media: 6 }, flags: { cj_ally: true } } },
      { id: 'cj_outsider', label: 'An outsider: a respected law dean', description: 'A reformer from outside the Court.', outcome: 'The justices are offended to be passed over. The public likes it.', effects: { stats: { courtTension: 3, approval: 1 } } },
    ],
  },
  sona('sona_2032', 61, 'The Last SONA', 'Your final State of the Nation Address. Six years, one last speech.'),
  ...budgetCycle(2033, 62),
  {
    id: 'comelec_controversy', month: 61, priority: 6, category: 'election', title: 'Ang Kontrata ng COMELEC', location: 'Commission on Elections',
    body: ['The COMELEC awards the ₱18B contract for 2033 counting machines to a company whose owner is a godparent to your Executive Secretary’s child. The opposition warns of a rigged election.'],
    choices: [
      { id: 'cc_cancel', label: 'Publicly ask the COMELEC to rebid the contract', description: 'Protect the election’s legitimacy.', outcome: 'The COMELEC rebids. The opposition loses its best argument.', effects: { stats: { approval: 2, media: -3 } } },
      { id: 'cc_silent', label: 'Stay silent — the COMELEC is independent', description: 'Technically correct.', outcome: 'The fraud narrative has fresh fuel for 2033.', effects: { flags: { fraud_narrative: true }, stats: { protest: 5 } } },
    ],
  },
  {
    id: 'campaign_resources', month: 64, priority: 7, category: 'election', title: 'Pondo ng Gobyerno sa Kampanya', location: 'Campaign headquarters',
    body: ['Your successor’s campaign manager asks for help: government cash-aid releases timed to campaign rallies, ambulances with the candidate’s face, and police escorts for the convoy.'],
    choices: [
      { id: 'cr_yes', label: 'Use the machinery of government', description: 'Everyone does it.', outcome: 'The campaign surges. So do the COMELEC complaints and the Ombudsman’s files.', effects: { spend: 30, spendLabel: 'Election-season ayuda', stats: { approval: 2, corruption: 6, ombudsman: 10 }, flags: { ch2_abuse: true, successor_boost: true } } },
      { id: 'cr_no', label: 'Refuse — no government resources for the campaign', description: 'Clean elections.', outcome: 'Your successor’s manager is furious. Good-government groups praise you.', effects: { stats: { corruption: -3, cohesion: -4 } } },
    ],
  },
  {
    id: 'midnight_appointments', month: 67, priority: 7, category: 'court', title: 'Midnight Appointments', location: 'Palasyo',
    body: ['The Constitution bans presidential appointments two months before the election. Your Executive Secretary brings a stack of 800 appointments — ambassadors, board members, judges, the next Ombudsman’s deputies — to sign before the ban takes effect tonight.'],
    choices: [
      { id: 'ma_sign', label: 'Sign all 800', description: 'Leave loyalists everywhere.', outcome: 'You sign until 3 a.m. The opposition vows to void them all.', headline: '800 MIDNIGHT APPOINTMENTS', effects: { stats: { media: 8, courtTension: 5, corruption: 3 }, flags: { midnight_appointees: true }, schedule: [{ event: 'court_midnight', inMonths: 2 }] } },
      { id: 'ma_few', label: 'Sign only essential vacancies', description: 'Keep government running.', outcome: 'A handful of appointments. No controversy.', effects: {} },
    ],
  },
  {
    id: 'hide_wealth', month: 68, priority: 6, category: 'family', title: 'Ang Kayamanan sa Labas', location: 'A private bank in Singhapura',
    body: ['Your family’s lawyer suggests moving your assets abroad “before the next administration starts looking.” Trust funds in Singhapura, a condo in a Gulf city, gold.'],
    choices: [
      { id: 'hw_move', label: 'Move the assets abroad', description: 'Protect your family’s future.', outcome: 'Transfers are made quietly. The Anti-Money Laundering Council flags three of them.', effects: { stats: { ombudsman: 8, family: 4 }, flags: { assets_abroad: true, ch2_plunder: true } } },
      { id: 'hw_stay', label: 'Keep everything at home and declared', description: 'Nothing to hide.', outcome: 'Your lawyer thinks you are naïve.', effects: {} },
    ],
  },
  {
    id: 'last_pardons', month: 69, priority: 6, category: 'scandal', title: 'Mga Huling Pardon', location: 'Palasyo',
    body: ['Allies and friends facing charges ask for pardons before you leave office: two convicted governors, a general, and your former Executive Secretary.'],
    choices: [
      { id: 'lp_all', label: 'Pardon them all', description: 'Loyalty to the end.', outcome: 'The pardons are signed on a Friday night. By Monday, they are the only story.', headline: 'PRESIDENT’S LAST-MINUTE PARDONS SPARK OUTRAGE', effects: { stats: { approval: -8, corruption: 8, media: 12 }, flags: { ch2_abuse: true } } },
      { id: 'lp_none', label: 'No pardons', description: 'Let the courts finish their work.', outcome: 'Some allies will never speak to you again.', effects: { stats: { cohesion: -4 } } },
    ],
  },
  {
    id: 'post_term_plan', month: 69, priority: 9, category: 'election', title: 'Pagkatapos ng Palasyo', location: 'Your study',
    body: ['You cannot run for President again. But you can run for something — and filing of candidacies for May 2033 closes this week.', 'Others advise you to think about “contingencies” — a house abroad, just in case.'],
    choices: [
      { id: 'ptp_house', label: 'Run for Congress in your home district', description: 'A seat in the House — and a platform.', outcome: 'You file your candidacy in {home}. The crowd at the provincial capitol is enormous.', effects: { flags: { post_plan: 'house' } } },
      { id: 'ptp_senate', label: 'Run for the Senate', description: 'A national race, a national voice.', outcome: 'You join the Senate race. Your opponents make it a referendum on your presidency.', effects: { flags: { post_plan: 'senate' } } },
      { id: 'ptp_retire', label: 'Retire from politics', description: 'Go home.', outcome: 'You announce you will return to private life. Your family is relieved.', effects: { flags: { post_plan: 'retire' }, stats: { family: 8 } } },
      { id: 'ptp_escape', label: 'Quietly prepare a home abroad for your family', description: 'Just in case.', outcome: 'A villa is leased in a country with no extradition treaty. Your family does not ask why.', effects: { flags: { post_plan: 'escape_ready' }, stats: { family: -4 } } },
    ],
  },
  {
    id: 'election_2033', month: 70, priority: 10, category: 'election', title: 'Halalan 2033', location: 'Command center, Palasyo ng Malaya',
    special: 'successor',
    body: ['Election night, May 2033. For the first time in six years, your own name is not on the presidential ballot. But everything you did is.'],
    choices: [
      { id: 'e33_concede', label: 'Accept the results', description: 'Whatever they are.', outcome: 'You address the nation at midnight: “The people have spoken.” Whatever comes next, the transfer of power will be peaceful.', effects: { stats: { media: -4 } } },
      { id: 'e33_contest', label: 'Question the results', description: 'Only if your candidate lost.', when: [{ outcome: false }], outcome: 'You call the result “questionable.” Protesters and counter-protesters fill the streets. The COMELEC proclaims the winner anyway.', headline: 'OUTGOING PRESIDENT QUESTIONS ELECTION', effects: { stats: { protest: 15, approval: -6 }, flags: { contested_2033: true } } },
    ],
  },
  {
    id: 'the_reckoning', month: 71, priority: 10, category: 'court', title: 'Pagkatapos ng Tanghali ng Hunyo 30', location: 'Your home, July 2033',
    special: 'reckoning',
    body: ['At noon on June 30, 2033, your successor takes the oath. Presidential immunity ends with your term.', 'Weeks later, your lawyer calls.'],
    variants: [
      { when: [{ flag: 'own_race', is: 'won' }, { flag: 'post_plan', is: 'senate' }], text: 'You are no longer President — but you are Senator-elect. Your oath is set for the opening of the new Congress.' },
      { when: [{ flag: 'own_race', is: 'won' }, { flag: 'post_plan', is: 'house' }], text: 'You are no longer President — but you are Representative-elect of {home}. Your oath is set for the opening of the new Congress.' },
      { when: [{ flag: 'own_race', is: 'lost' }], text: 'You lost your own race in May. For the first time in decades, you hold no office at all.' },
      { when: [{ none: [{ flag: 'own_race' }] }], text: 'You are a private citizen now.' },
      { when: [{ flag: 'successor_won' }], text: 'Your own candidate is in the Palasyo. That should make you safe. Should.' },
      { when: [{ flag: 'successor_won', is: false }], text: 'The opposition holds the Palasyo — and the Justice Department, and the prosecutors.' },
    ],
    choices: [
      { id: 'rk_trial', label: 'Face the charges in court', description: 'Trust your lawyers — and the truth.', when: [{ outcome: true }], outcome: 'The trial lasts eighteen months. You attend every hearing.', effects: { verdict: { severity: 1, onConvict: guiltyTrial, onAcquit: { flags: { final_fate: 'acquitted' } } } } },
      { id: 'rk_flee', label: 'Leave the country with your family', description: 'Before the warrant is served.', when: [{ outcome: true }], outcome: 'A private plane leaves at dawn. By the time the warrant is issued, you are in another country. You will read about your homeland in the news for the rest of your life.', effects: { flags: { final_fate: 'exile' } } },
      { id: 'rk_pardon', label: 'Ask your successor for a pardon', description: 'Only possible if your candidate won.', when: [{ outcome: true }, { flag: 'successor_won' }], outcome: 'Your successor hesitates for months — then pardons you, at great political cost to both of you.', effects: { flags: { final_fate: 'pardoned' } } },
      { id: 'rk_plea', label: 'Negotiate a plea bargain', description: 'Return money, plead to a lesser offense.', when: [{ outcome: true }], outcome: 'You return ₱900 million and plead guilty to a lesser charge. House arrest for four years.', effects: { flags: { final_fate: 'plea' } } },
      { id: 'rk_serve_fight', label: 'Take your seat and fight the charges from there', description: 'The voters chose you. Let the court decide the rest.', when: [{ outcome: true }, { flag: 'own_race', is: 'won' }], outcome: 'You take your oath with prosecutors watching from the gallery. The trial runs alongside your first session.', effects: { verdict: { severity: 1, onConvict: { flags: { final_fate: 'imprisoned', expelled: true } }, onAcquit: { flags: { final_fate: 'legislator', served_through_trial: true }, schedule: [{ event: 'post_career', inMonths: 0 }] } } } },
      { id: 'rk_free_senate', label: 'Take your seat in the Senate', description: 'You won a national race.', when: [{ outcome: false }, { flag: 'own_race', is: 'won' }, { flag: 'post_plan', is: 'senate' }], outcome: 'You take the oath as Senator — the first former President in the Senate in generations.', effects: { flags: { final_fate: 'senator' }, schedule: [{ event: 'post_career', inMonths: 0 }] } },
      { id: 'rk_free_serve', label: 'Take your seat in the House', description: 'You won your district.', when: [{ outcome: false }, { flag: 'own_race', is: 'won' }, { flag: 'post_plan', is: 'house' }], outcome: 'You take the oath as the Representative of {home} — a former President in the back rows of the Batasan.', effects: { flags: { final_fate: 'legislator' }, schedule: [{ event: 'post_career', inMonths: 0 }] } },
      { id: 'rk_free_retire', label: 'Return home to private life', description: 'Write your memoirs. Tend your garden.', when: [{ outcome: false }, { none: [{ flag: 'own_race', is: 'won' }] }], outcome: 'You go home. The phone rings less each week.', effects: { flags: { final_fate: 'free' } } },
      { id: 'rk_free_abroad', label: 'Move abroad anyway, just to be safe', description: 'Investigations can start any time.', when: [{ outcome: false }], outcome: 'You move your family abroad. At home, people ask what you are afraid of.', effects: { flags: { final_fate: 'self_exile' } } },
    ],
  },
  {
    id: 'post_career', priority: 5, category: 'election', title: 'Bagong Kabanata', location: 'The new Congress, July 2033',
    body: ['Your first weeks as a legislator. Reporters follow you everywhere; colleagues who once waited hours outside your office now sit beside you.', 'You have to decide what kind of legislator a former President should be.'],
    variants: [
      { when: [{ flag: 'successor_won' }], text: 'Your successor is from your own camp — and would love your help, or your silence.' },
      { when: [{ flag: 'successor_won', is: false }], text: 'The new President is from the opposition, and your old allies look to you to lead them.' },
    ],
    choices: [
      { id: 'pc_lead_opposition', label: 'Lead the opposition to the new government', description: 'Hold them to account.', when: [{ flag: 'successor_won', is: false }], outcome: 'You become the loudest critic of the new Palasyo. Your speeches fill the gallery again.', effects: { flags: { post_role: 'opposition_leader' } } },
      { id: 'pc_ally', label: 'Be your successor’s strongest ally', description: 'Finish what you started.', when: [{ flag: 'successor_won' }], outcome: 'You shepherd your unfinished bills through Congress, one by one.', effects: { flags: { post_role: 'ally' } } },
      { id: 'pc_leader', label: 'Run for Senate President', description: 'Take the chamber.', when: [{ flag: 'final_fate', is: 'senator' }], outcome: 'You count the votes for weeks. The chamber elects you its President.', effects: { flags: { post_role: 'senate_president' } } },
      { id: 'pc_speaker', label: 'Run for Speaker of the House', description: 'Take the chamber.', when: [{ flag: 'final_fate', is: 'legislator' }], outcome: 'Your old allies deliver the votes. A former President now holds the Speaker’s gavel.', effects: { flags: { post_role: 'speaker' } } },
      { id: 'pc_statesman', label: 'Be an independent voice', description: 'Above the fray.', outcome: 'You vote your conscience and write long columns. Both sides quote you when it suits them.', effects: { flags: { post_role: 'statesman' } } },
    ],
  },
  {
    id: 'term_end', month: 71, priority: 1, category: 'chapter', title: 'Ang Wakas', location: 'The Palasyo gates, June 30, 2033',
    special: 'chapterEnd',
    body: ['On your last morning, you walk out of the Palasyo through the front gate, not the river gate. Six years ago you walked in.', 'What will the history books say?'],
    choices: [
      { id: 'te_proud', label: '“I did my best.”', description: 'Leave with your head up.', outcome: 'You do not look back.', effects: {} },
      { id: 'te_regret', label: '“I should have done more.”', description: 'Leave with regrets.', outcome: 'You look back once.', effects: {} },
    ],
  },
];
