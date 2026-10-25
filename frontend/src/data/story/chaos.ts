import type { Condition, StoryEvent } from '@/features/narrative/types/event';
import { COMPANIES } from '@/data/world/companies';
import { quick, later as then } from './chapter1/helpers';
import { invest } from './chapter1/ventures';

/**
 * A more chaotic presidency: foreign companies pitching you directly, the roads and hospitals the
 * country lacks, enemies filing case after case, more investment offers — and, if prices and debt
 * will not come down, a revolt at the gates of the Palasyo.
 */

// ═════════════ FOREIGN COMPANIES PROPOSE ═════════════
const PITCH_WINDOWS: [number, number][] = [[4, 12], [8, 18], [12, 24], [16, 28], [20, 34], [26, 40], [32, 46], [38, 52], [44, 58], [50, 64], [54, 66], [58, 68]];

const COMPANY_PITCHES: StoryEvent[] = COMPANIES.map((c, i) =>
  quick(`co_pitch_${c.id}`, PITCH_WINDOWS[i % PITCH_WINDOWS.length], 'economy', `Alok ng ${c.name}`, 'Board of Investments', [
    `Executives of ${c.name} (${c.industry.toLowerCase()}) come to the Palasyo with a proposal: ${c.pitch.charAt(0).toLowerCase() + c.pitch.slice(1)}`,
    `The project: ${c.project}, about ${c.jobs.toLocaleString()} jobs. {sec:trade} says the terms you offer will decide whether they come — and how much tax they pay.`,
  ], [
    ['Offer generous terms: tax holiday and free land', 'Most likely to win them; least tax.', 'The negotiators go to work.', { company: { id: c.id, offer: 'generous' } }],
    ['Offer the standard incentives', 'A fair deal.', 'The negotiators go to work.', { company: { id: c.id, offer: 'standard' } }],
    ['Offer tough terms: full taxes from day one', 'Most tax; they may walk away.', 'The negotiators go to work.', { company: { id: c.id, offer: 'tough' } }],
    ['Decline', 'Not this company.', 'The executives fly home.', { stats: { investor: -1 } }],
  ], { when: [{ stat: 'investor', gte: c.minConfidence }] }),
);

// ═════════════ WHAT THE COUNTRY LACKS ═════════════
const lowFlag = (id: string): Condition => ({ flag: `need_low_${id}` });

const PLANNING: StoryEvent[] = ([[3, 7], [13, 17], [24, 28], [37, 41], [49, 53], [60, 64]] as [number, number][]).map((w, i) =>
  quick(`pl_meeting_${i + 1}`, w, 'cabinet', 'Pulong sa Pagpaplano', 'Cabinet Room, Palasyo', [
    'The planning secretary unrolls a map covered in red marks: where the roads end, where children study under trees, where the nearest hospital is three hours away.',
    'There is money for one big push this quarter. {sec:budget} asks what it will be.',
  ], [
    ['Roads and bridges: ₱25B', 'Connect the farms to the markets.', 'Three hundred kilometers of farm-to-market roads and forty bridges are funded.', { spend: 25, spendLabel: 'Roads and bridges program', need: { roads: 9 }, stats: { growth: 0.1, unemployment: -0.1 } }],
    ['Classrooms: ₱18B', '12,000 new classrooms.', 'Classrooms rise in the provinces with the worst shortages.', { spend: 18, spendLabel: 'Classroom building program', need: { schools: 10 }, stats: { approval: 1 } }],
    ['Hospitals and rural health units: ₱22B', 'Doctors within reach.', 'Forty district hospitals are upgraded and 500 rural health units built.', { spend: 22, spendLabel: 'Hospitals program', need: { hospitals: 10 }, stats: { approval: 1.5, poverty: -0.1 } }],
    [i % 2 === 0 ? 'Water systems: ₱14B' : 'Mass housing: ₱20B', i % 2 === 0 ? 'Clean water for 2 million families.' : 'Homes for 80,000 families.', i % 2 === 0 ? 'Water systems are built in 600 towns.' : 'Housing projects break ground in five cities.', i % 2 === 0 ? { spend: 14, spendLabel: 'Water systems program', need: { water: 10 }, stats: { approval: 1 } } : { spend: 20, spendLabel: 'Mass housing program', need: { housing: 9 }, asset: invest(`pl_housing_${i}`, 'Mass housing amortization', 'kapatagan', 'Housing', 0.9, 12_000, 12), stats: { approval: 1, poverty: -0.2 } }],
  ]),
);

const SHORTAGES: StoryEvent[] = [
  quick('ns_schools', [6, 60], 'society', 'Klase sa Ilalim ng Puno', 'A barrio school, Visara', 'A photo of sixty pupils studying under a mango tree because their classroom collapsed goes viral. The caption: “Where is the President?”', [
    ['Emergency classroom program: ₱10B', 'Fix it now.', 'Modular classrooms arrive within months.', { spend: 10, spendLabel: 'Emergency classrooms', need: { schools: 7 }, stats: { approval: 2 } }],
    ['Ask the private sector to adopt schools', 'Bayanihan.', 'Companies adopt 2,000 schools. It helps, slowly.', { need: { schools: 3 }, stats: { approval: 1 } }],
  ], { when: [lowFlag('schools')] }),
  quick('ns_hospital', [6, 66], 'crisis', 'Puno ang Ospital', 'Provincial hospital, Mindara', 'Patients lie on the floor of a provincial hospital; a mother dies waiting for a bed. Doctors walk out in protest.', [
    ['Emergency hospital funds and hire nurses: ₱12B', 'Save lives.', 'Beds and nurses arrive. The doctors return.', { spend: 12, spendLabel: 'Emergency hospital funding', need: { hospitals: 7 }, stats: { approval: 2 } }],
    ['Promise reforms next year', 'The budget is set.', 'The doctors stay out for a month.', { stats: { approval: -3, protest: 4 } }],
  ], { when: [lowFlag('hospitals')] }),
  quick('ns_brownout', [6, 66], 'crisis', 'Walang Kuryente', 'Mindara grid', 'Twelve-hour brownouts across Mindara. Factories close; hospitals run on generators.', [
    ['Emergency power plants: ₱15B', 'Turn the lights on.', 'The lights return in weeks.', { spend: 15, spendLabel: 'Emergency power', need: { power: 8 }, stats: { approval: 2 } }],
    ['Ration power fairly', 'No money left.', 'The south suffers through the summer.', { stats: { approval: -3, growth: -0.1 } }],
  ], { when: [lowFlag('power')] }),
  quick('ns_water', [6, 66], 'crisis', 'Walang Tubig', 'Maynilad', 'Taps run dry for days in poor districts of Maynilad. Families line up at fire trucks for water.', [
    ['Water trucks and an emergency treatment plant: ₱8B', 'Act now.', 'The taps flow again in three weeks.', { spend: 8, spendLabel: 'Emergency water', need: { water: 7 }, stats: { approval: 1 } }],
    ['Blame the private water firms', 'It is their job.', 'The firms blame the government. Nothing changes.', { stats: { approval: -2 } }],
  ], { when: [lowFlag('water')] }),
  quick('ns_internet', [10, 66], 'society', 'Mabagal na Internet', 'Social media', 'A study ranks the Kapuluan’s internet last in the region. Online students and freelancers are furious.', [
    ['Free Wi-Fi in every town plaza: ₱6B', 'Connect the people.', 'Hotspots go up in 1,400 towns.', { spend: 6, spendLabel: 'Free public Wi-Fi', need: { internet: 8 }, stats: { approval: 1.5 } }],
    ['Open the market to new carriers', 'Competition.', 'Two new carriers enter. Prices start to fall.', { need: { internet: 5 }, stats: { investor: 2 } }],
  ], { when: [lowFlag('internet')] }),
  quick('ns_housing', [10, 66], 'society', 'Demolisyon', 'Informal settlement, Maynilad', 'A demolition team arrives to clear 3,000 informal settlers for a mall project. Families barricade the road.', [
    ['Stop the demolition and build relocation housing: ₱9B', 'People first.', 'The families are moved to new homes nearby.', { spend: 9, spendLabel: 'Relocation housing', need: { housing: 6 }, stats: { approval: 2, investor: -1 } }],
    ['Let the demolition proceed', 'The court order stands.', 'Water cannons and tears on the evening news.', { stats: { approval: -4, protest: 6, investor: 1 } }],
  ], { when: [lowFlag('housing')] }),
  quick('ns_roads', [10, 66], 'society', 'Daang Lubak', 'Provincial highway', 'A bus falls into a sinkhole on a highway that was “completed” two years ago. Eleven dead.', [
    ['Audit every road project and rebuild: ₱10B', 'Never again.', 'Contractors are blacklisted; roads are rebuilt.', { spend: 10, spendLabel: 'Road rebuilding', need: { roads: 6 }, stats: { corruption: -2, approval: 1 } }],
    ['Blame the contractor only', 'One bad company.', 'The other bad roads stay bad.', { stats: { approval: -2 } }],
  ], { when: [lowFlag('roads')] }),
];

// ═════════════ THE REVOLT ═════════════
function revolt(n: 1 | 2): StoryEvent[] {
  return [
    quick(`rv_rallies_${n}`, null, 'crisis', 'Galit ng Bayan', 'The main avenue, Maynilad', [
      'Half a million people fill the avenue: jeepney drivers, students, nurses, vendors. Rice costs twice what it did. The placards say “BABA” — step down.',
      'Your security adviser says the crowd is still peaceful. For now.',
    ], [
      ['Announce emergency price controls and subsidies: ₱30B', 'Give them relief.', 'Rice and fuel subsidies are announced on live TV. The crowd thins — slowly.', { spend: 30, spendLabel: 'Emergency subsidies', stats: { protest: -10, approval: 3, inflation: -0.3 } }],
      ['Meet the protest leaders', 'Listen.', 'A tense, televised meeting. They want results, not talk.', { stats: { protest: -4, approval: 1, capital: -3 } }],
      ['Send the riot police to clear the avenue', 'Order must be restored.', 'Water cannons and tear gas. The images go around the world.', { stats: { protest: 12, approval: -6, military: 2, media: 8 }, flags: { crackdown: true }, ...then(`rv_storm_${n}`, 2) }],
    ], { priority: 8 }),

    quick(`rv_storm_${n}`, null, 'crisis', 'Sinugod ang Palasyo', 'The gates of the Palasyo, 11 p.m.', [
      'The crowd breaks through the outer fence. Thousands surge toward the gates of the Palasyo, chanting your name — not in praise. Helicopters circle. The Presidential Security Group asks for orders.',
      'Your Cabinet is split: half say declare martial law, half say it is time to go.',
    ], [
      ['Declare martial law', 'Save the Republic — or yourself.', 'Troops clear the streets before dawn. Curfew. Arrests. The Constitution’s clock starts: Congress has 48 hours.', { stats: { protest: -15, approval: -10, military: 4, courtTension: 15, media: 15 }, flags: { martial_law_national: true, crackdown: true }, ...then(`rv_martial_${n}`, 1) }, 'MARTIAL LAW DECLARED'],
      ['Step down', 'Spare the country.', 'At 2 a.m., you announce your resignation. The Vice President is sworn in at dawn.', { gameOver: 'resigned' }, 'PRESIDENT RESIGNS AS CROWDS STORM PALASYO'],
      ['Go out and face the crowd', 'A desperate gamble.', 'You walk to the gates with a megaphone. Some boo; some listen.', { ...then(`rv_face_${n}`, 0) }],
      ['Promise a new Cabinet and an emergency program', 'Buy time.', 'You fire your economic team on live TV and announce a ₱50B emergency program. The crowd hesitates.', { spend: 50, spendLabel: 'Emergency economic program', fireCabinet: 'finance', stats: { protest: -8, approval: 2, investor: -4 } }],
    ], { priority: 10 }),

    quick(`rv_face_${n}`, null, 'crisis', 'Sa Harap ng Bayan', 'The gates of the Palasyo', 'You stand before the crowd with a megaphone.', [['Speak', '', 'You speak.', {}]], {
      priority: 10,
      variants: [
        { when: [{ stat: 'approval', gte: 35 }], text: 'Your voice carries. You promise to cut your own office budget, freeze prices, and come back in thirty days. Slowly, the crowd begins to go home.' },
        { when: [{ stat: 'approval', lte: 34 }], text: 'A bottle flies. Then another. Your security team drags you back inside. The crowd has heard enough from you.' },
      ],
      choices: [
        { id: `rv_face_ok_${n}`, label: 'Keep your promises', description: 'Thirty days.', when: [{ stat: 'approval', gte: 35 }], outcome: 'You survive the night — and a deadline now hangs over you.', effects: { stats: { protest: -12, approval: 4 }, flags: { thirty_day_promise: true } }, headline: 'PRESIDENT FACES CROWD, SURVIVES THE NIGHT' },
        { id: `rv_face_bad_ml_${n}`, label: 'Declare martial law', description: 'There is no other way now.', when: [{ stat: 'approval', lte: 34 }], outcome: 'Martial law is declared at 3 a.m.', effects: { stats: { protest: -15, approval: -10, courtTension: 15 }, flags: { martial_law_national: true }, schedule: [{ event: `rv_martial_${n}`, inMonths: 1 }] } },
        { id: `rv_face_bad_go_${n}`, label: 'Resign', description: 'It is over.', when: [{ stat: 'approval', lte: 34 }], outcome: 'You resign before sunrise.', effects: { gameOver: 'resigned' } },
      ],
    }),

    quick(`rv_martial_${n}`, null, 'crisis', 'Ang Batas Militar', 'Batasan, joint session of Congress', [
      'Under the Constitution, Congress meets in joint session to decide whether martial law stands. Petitions have already been filed at the Supreme Court. The world is watching.',
    ], [
      ['Ask Congress to extend martial law', 'Finish the job.', 'The vote is called.', { vote: { bill: 'Extension of Martial Law', appeal: -1, onPass: { stats: { protest: -8, approval: -6, investor: -8 }, flags: { martial_law_extended: true } }, onFail: { stats: { capital: -10, approval: -4 }, flags: { martial_law_revoked: true } } } }],
      ['Lift martial law after 60 days', 'Order restored.', 'Martial law ends. The country exhales — and remembers.', { stats: { protest: -5, approval: 2, courtTension: -5 }, flags: { martial_law_lifted: true } }],
      ['Defy Congress and the Court', 'Rule by decree.', 'You ignore the joint session. Generals look at each other.', { stats: { military: -12, courtTension: 25, approval: -12 }, flags: { defied_court: true, impeachable_offense: true } }, 'PRESIDENT DEFIES CONGRESS ON MARTIAL LAW'],
    ], { priority: 10 }),
  ];
}

// ═════════════ ENEMIES AND CASES ═════════════
const ENEMIES: StoryEvent[] = [
  quick('en_plunder_complaint', [12, 40], 'scandal', 'Kaso ng Pandarambong', 'Office of the Ombudsman', '{rival} files a plunder complaint against you at the Ombudsman, with 2,000 pages of “evidence” about the Speaker’s district funds.', [
    ['Answer every allegation point by point', 'Let the facts speak.', 'Your lawyers file a 3,000-page reply. The case drags on, quietly.', { stats: { ombudsman: 3, media: -1 } }],
    ['Counter-sue for libel', 'Hit back.', 'The libel case dominates the news — keeping the plunder story alive.', { stats: { media: 5, approval: -1 } }],
    ['Ignore it', 'It is politics.', 'The Ombudsman opens a preliminary investigation anyway.', { stats: { ombudsman: 6 } }],
  ]),
  quick('en_disbarment', [16, 50], 'scandal', 'Disbarment', 'Supreme Court', 'A group of lawyers allied with the opposition files a disbarment case against your Chief Legal Counsel for advising you on a “clearly illegal” order.', [
    ['Defend your counsel publicly', 'Loyalty.', 'Your counsel survives. The legal community is divided.', { stats: { courtTension: 3, cabinetCohesion: 2 } }],
    ['Accept your counsel’s resignation', 'Cut the cord.', 'Your counsel resigns. The opposition claims a scalp.', { fireCabinet: 'adviserLegal', stats: { courtTension: -2 } }],
  ]),
  quick('en_icc', [24, 60], 'scandal', 'Reklamo sa Pandaigdigang Hukuman', 'International Criminal Court', 'Human-rights groups file a complaint at the International Criminal Court over killings during your crackdowns.', [
    ['Cooperate with the court', 'Nothing to hide.', 'Investigators arrive. Your allies call it surrender of sovereignty.', { stats: { media: -3, military: -4, approval: 1 } }],
    ['Withdraw from the court', 'We have our own courts.', 'The withdrawal is condemned abroad and cheered by your base.', { stats: { investor: -4, media: 6 }, relations: { columbia: -6, bloc: -4 } }],
  ], { when: [{ any: [{ flag: 'crackdown' }, { flag: 'martial_law_national' }, { flag: 'martial_law' }] }] }),
  quick('en_impeach_citizens', [20, 60], 'congress', 'Reklamo ng Mamamayan', 'House of Representatives', 'A coalition of citizens’ groups files an impeachment complaint, endorsed by three opposition congressmen, for “betrayal of public trust.”', [
    ['Have your allies bury it in committee', 'Use the majority.', 'The Justice Committee finds it “insufficient in substance.”', { stats: { cohesion: -2, capital: -3, media: 3 } }],
    ['Welcome the hearing — clear your name', 'Confidence.', 'Weeks of hearings. Your approval holds; the complaint dies on the floor.', { stats: { approval: 1, capital: -6 } }],
  ], { when: [{ stat: 'approval', lte: 45 }] }),
  quick('en_fake_news', [6, 66], 'media', 'Pekeng Balita', 'Social media', 'A deepfake video of you mocking the poor goes viral: 8 million views in a day. It is fake — but it looks real.', [
    ['Release the original footage and file cybercrime charges', 'Fight with facts.', 'Forensics prove it is fake. Some people still believe it.', { stats: { approval: -1, media: -2 } }],
    ['Hire your own online army to drown it out', 'Fight fire with fire.', 'The fake fades. Your new troll army will cost you later.', { spend: 0.1, spendLabel: 'Online response team', stats: { approval: 1, corruption: 2 }, flags: { troll_army: true } }],
    ['Ignore it', 'It will pass.', 'It does not pass for a week.', { stats: { approval: -3 } }],
  ]),
  quick('en_tell_all', [30, 66], 'scandal', 'Ang Aklat', 'Bookstores nationwide', 'A former aide publishes a tell-all book: “The Palasyo Diaries.” It describes your temper, your favorites, and a few deals.', [
    ['Laugh it off on national TV', 'Grace under fire.', 'Your good humor blunts the book. Sales soar anyway.', { stats: { approval: 1, media: -1 } }],
    ['Sue the author and publisher', 'Stop the lies.', 'The lawsuit puts the book at the top of the bestseller list.', { stats: { media: 5, approval: -2 } }],
    ['Have allies attack the author’s credibility', 'Discredit.', 'The author releases audio recordings to prove the book is true.', { stats: { approval: -4, media: 6 } }],
  ]),
  quick('en_rival_documentary', [40, 66], 'media', 'Ang Dokumentaryo', 'Streaming service', '{rival} produces a documentary about your rise — and the friends who got rich along the way. It tops the streaming charts.', [
    ['Ask the streaming company to pull it', 'Pressure.', 'They refuse and publicize your request. Views triple.', { stats: { media: 6, approval: -3 } }],
    ['Release your own documentary', 'Tell your story.', 'Dueling documentaries. The country picks sides.', { spend: 0.3, spendLabel: 'Presidential documentary', stats: { approval: 1, media: 2 } }],
    ['Say nothing', 'Dignity.', 'The documentary runs its course.', { stats: { approval: -1 } }],
  ]),
  quick('en_tax_case', [26, 62], 'scandal', 'Kaso sa Buwis', 'Court of Tax Appeals', 'An opposition senator reveals that your family’s farm has not paid real-estate taxes in eight years and files a complaint.', [
    ['Pay everything with penalties, publicly', 'Own it.', 'You pay ₱18 million. The story ends in a day.', { stats: { approval: 1, family: -2 } }],
    ['Call it a clerical error', 'Minimize.', 'Reporters find two more properties.', { stats: { approval: -3, corruption: 3 } }],
  ]),
  quick('en_whistleblower', [34, 66], 'scandal', 'Ang Whistleblower', 'Senate', 'A former bodyguard testifies to delivering envelopes of cash from the Palasyo to three congressmen before a key vote.', [
    ['Deny and demand evidence', 'Prove it.', 'The bodyguard produces photos.', { stats: { approval: -5, ombudsman: 8, media: 6 }, flags: { impeachable_offense: true } }],
    ['Say the envelopes were “legitimate assistance”', 'Spin.', 'Nobody believes it.', { stats: { approval: -3, corruption: 5 } }],
    ['Order an independent investigation of your own office', 'Clean house.', 'The investigation names a former aide. You survive, bruised.', { stats: { approval: -1, corruption: -2 } }],
  ], { when: [{ any: [{ flag: 'took_bribe' }, { flag: 'obstruction' }, { flag: 'cronyism' }, { stat: 'corruption', gte: 60 }] }] }),
];

// ═════════════ MORE INVESTMENTS ═════════════
const MORE_INVESTMENTS: StoryEvent[] = [
  quick('mi_semicon_park', [10, 30], 'economy', 'Semiconductor Park', 'Gitnang Kapatagan', 'A consortium of chipmakers wants a dedicated semiconductor park with its own power and water. The state would own the land and earn rent.', [
    ['Build the park: ₱16B', 'Rent and high-tech jobs.', 'The park opens in eighteen months.', { spend: 16, spendLabel: 'Semiconductor park', asset: invest('mi_semicon', 'Semiconductor park rents', 'kapatagan', 'Industrial park', 1.6, 18_000, 18), need: { power: 2 }, stats: { investor: 3 } }],
    ['Decline', 'Too costly.', 'The chipmakers go to Indara.', {}],
  ]),
  quick('mi_wind_farm', [14, 40], 'economy', 'Wind Farm sa Hilaga', 'Hilagang Luzara', 'A state wind farm on the northern coast could sell power to the grid for twenty-five years.', [
    ['Build it: ₱12B', 'Clean power, steady income.', 'Turbines rise along the coast.', { spend: 12, spendLabel: 'Northern wind farm', asset: invest('mi_wind_north', 'Northern wind farm', 'sanfernando', 'Wind power', 1.2, 1_500, 18), need: { power: 4 }, stats: { inflation: -0.05 } }],
    ['Let a private firm build it', 'No state money.', 'A firm builds it and pays a small royalty.', { asset: invest('mi_wind_royalty', 'Wind farm royalty', 'sanfernando', 'Royalty', 0.3, 1_000, 20), need: { power: 3 } }],
  ]),
  quick('mi_cold_chain', [18, 46], 'economy', 'Cold Chain ng Bansa', 'Department of Agriculture', 'A national cold-storage network would cut food waste by a third and charge fees to traders.', [
    ['Build it: ₱9B', 'Cheaper food, fees for the state.', 'Cold storage opens in 40 provinces.', { spend: 9, spendLabel: 'National cold chain', asset: invest('mi_coldchain', 'National cold-chain fees', 'kapatagan', 'Cold storage', 0.85, 7_000, 12), stats: { inflation: -0.15 } }],
    ['Not now', 'Other priorities.', 'Food keeps rotting in transit.', {}],
  ]),
  quick('mi_tollway_south', [22, 50], 'economy', 'Tollway sa Timog', 'Southern Luzara', 'A tollway to the southern provinces, built by a private operator who pays the state a concession fee and a share of tolls.', [
    ['Award the concession', 'Fees and faster travel.', 'Construction begins. Tolls will flow in two years.', { income: 8, spendLabel: 'Southern tollway concession fee', asset: invest('mi_toll_south', 'Southern tollway toll share', 'legazpira', 'Toll concession', 1.5, 9_000, 24), need: { roads: 5 } }],
    ['Build it as a free road: ₱30B', 'For the people.', 'A free highway. It earns nothing.', { spend: 30, spendLabel: 'Southern highway', need: { roads: 7 }, stats: { approval: 2 } }],
  ]),
  quick('mi_halal_hub', [26, 54], 'economy', 'Halal Hub ng Mindara', 'Marawira', 'Gulf investors want a halal food processing hub in Mindara, exporting to the Muslim world, with the state as a partner.', [
    ['Take a 30% stake: ₱6B', 'Exports and peace dividends.', 'The hub opens within a year.', { spend: 6, spendLabel: 'Halal hub stake', asset: invest('mi_halal', 'Mindara halal hub (30% state)', 'marawira', 'Food processing', 0.65, 9_000, 12), relations: { qadir: 6 }, stats: { tribes: 3 } }],
    ['Let the investors go it alone', 'No state money.', 'A smaller hub opens.', { taxRate: 0.01 }],
  ]),
  quick('mi_spaceport', [44, 66], 'economy', 'Spaceport', 'Eastern seaboard', 'A Nippara aerospace firm proposes a satellite launch site on the eastern coast, paying the state a lease.', [
    ['Lease the land', 'High-tech prestige and rent.', 'The first launch is set for 2034.', { asset: invest('mi_spaceport', 'Spaceport lease', 'tacloban', 'Land lease', 0.5, 2_500, 14), relations: { nippara: 5 }, stats: { investor: 3 } }],
    ['Decline', 'Fishermen first.', 'The fishing towns are relieved.', {}],
  ]),
  quick('mi_eco_resort', [30, 60], 'economy', 'Eco-Resort ng Estado', 'Palawira', 'The tourism agency proposes state-owned eco-resorts on three islands, run by a hotel operator under a revenue-sharing contract.', [
    ['Build and lease them: ₱7B', 'Earn from tourists.', 'The resorts open to rave reviews.', { spend: 7, spendLabel: 'State eco-resorts', asset: invest('mi_resorts', 'State eco-resorts revenue share', 'palawira', 'Tourism', 0.75, 4_000, 14) }],
    ['Keep the islands untouched', 'Conservation.', 'Environmentalists cheer.', { stats: { tribes: 1 } }],
  ]),
  quick('mi_data_center', [36, 64], 'economy', 'Data Center ng Bayan', 'Sugbu', 'A government data center could host all agencies’ systems — and rent spare capacity to private firms.', [
    ['Build it: ₱8B', 'Savings and rent.', 'Agencies move in; private tenants follow.', { spend: 8, spendLabel: 'Government data center', asset: invest('mi_datacenter', 'Government data center rentals', 'sugbu', 'Data center', 0.8, 1_200, 12), need: { internet: 4 }, stats: { corruption: -1 } }],
    ['Keep renting from private firms', 'No upfront cost.', 'The rental bills keep coming.', {}],
  ]),
];

export const CHAOS_EVENTS: StoryEvent[] = [...COMPANY_PITCHES, ...PLANNING, ...SHORTAGES, ...revolt(1), ...revolt(2), ...ENEMIES, ...MORE_INVESTMENTS];
