import type { Effects, EventCategory, StoryEvent } from '@/features/narrative/types/event';

type Opt = [label: string, description: string, outcome: string, effects: Effects, headline?: string];

/** A compact issue: a situation and two or three realistic responses. */
function issue(id: string, window: [number, number], category: EventCategory, title: string, location: string, body: string, options: Opt[], when?: StoryEvent['when']): StoryEvent {
  return {
    id,
    window,
    priority: 4,
    category,
    title,
    location,
    when,
    body: [body],
    choices: options.map(([label, description, outcome, effects, headline], i) => ({ id: `${id}_${i}`, label, description, outcome, effects, headline })),
  };
}

/** More Chapter 2 issues, so that every month of the final three years is full of real problems — and real opportunities. */
export const MORE_2: StoryEvent[] = [
  // ─── Senate & House hearings ───
  issue('m2_nfa_rice', [37, 45], 'scandal', 'Ang Nabubulok na Bigas', 'Senate Committee on Agriculture', 'The Senate finds 300,000 sacks of government rice rotting in warehouses while officials sold “damaged” stocks cheaply to favored traders.', [
    ['Fire the food agency board and prosecute', 'Clean it out.', 'The board is charged; rice distribution improves.', { stats: { corruption: -3, inflation: -0.1, approval: 2 } }],
    ['Blame the previous management', 'Not our people.', 'The Senate report names officials you appointed.', { stats: { approval: -3, media: 4 } }],
  ]),
  issue('m2_fertilizer', [40, 52], 'scandal', 'Fertilizer Fund Scam', 'Senate Blue Ribbon Committee', 'Senators discover ₱3B meant for farmers’ fertilizer went to “farmer groups” that are fronts for local politicians — some in your coalition.', [
    ['Refer everyone to the Ombudsman', 'Allies included.', 'The coalition grumbles; farmers cheer.', { stats: { corruption: -3, cohesion: -4, approval: 2 } }],
    ['Quietly protect your allies', 'The coalition matters.', 'A Senate staffer leaks the list.', { stats: { corruption: 4, media: 6 } }],
  ]),
  issue('m2_speaker_cousin', [44, 58], 'scandal', 'Pinsan ng Speaker', 'House hearings', 'A construction company owned by the Speaker’s cousin won ₱22B in road contracts in the Speaker’s region.', [
    ['Order a Public Works audit', 'Even the Speaker’s family.', 'The Speaker is furious; the audit finds overpricing.', { stats: { corruption: -3, cohesion: -5 } }],
    ['Look away', 'You need the House.', 'The Speaker’s loyalty is secure — and so is the overpricing.', { stats: { cohesion: 4, corruption: 3 } }],
  ]),
  issue('m2_partylist_fraud', [48, 62], 'congress', 'Pekeng Party-list', 'House Committee on Suffrage', 'Investigators find a party-list group “representing tricycle drivers” is controlled entirely by a mining magnate.', [
    ['Push the COMELEC to cancel its registration', 'Protect the system.', 'The group loses its seats — and its three votes for you.', { stats: { corruption: -2 }, houseShift: -3 }],
    ['Leave it alone', 'Its votes are yours.', 'Reformers take note.', { stats: { corruption: 2 } }],
  ]),
  issue('m2_senate_budget_hearing_health', [50, 60], 'congress', 'Nasaan ang Pondo ng Kalusugan?', 'Senate Committee on Health', 'Senators grill your Health Secretary: ₱11B for vaccines expired in storage; hospitals still lack medicine.', [
    ['Accept responsibility and replace the Secretary', 'Accountability.', 'A new Secretary cleans house.', { fireCabinet: 'health', stats: { approval: 2 } }],
    ['Defend the Secretary', 'Loyalty.', 'The hearing becomes a weekly spectacle.', { stats: { approval: -3, media: 5 } }],
  ]),

  // ─── Supreme Court ───
  issue('m2_sc_reclamation', [40, 56], 'court', 'Korte Suprema: Reclamation sa Maynilad Bay', 'Kataas-taasang Hukuman', 'Fishermen and environmentalists ask the Court for a writ of kalikasan to stop 3,000 hectares of reclamation in Maynilad Bay — a ₱500B project by your allies’ conglomerates.', [
    ['Suspend the reclamation pending the ruling', 'Respect the petition.', 'The developers are furious; the fishermen hopeful.', { stats: { investor: -4, tribes: 2, courtTension: -3 } }],
    ['Let it continue — the Court hasn’t ruled', 'Investment first.', 'The Court issues a TRO anyway, and notes your haste.', { stats: { courtTension: 6, investor: 2 } }],
  ]),
  issue('m2_sc_rotc', [56, 66], 'court', 'Korte Suprema: Mandatory ROTC', 'Kataas-taasang Hukuman', 'Students challenge mandatory ROTC as a violation of academic freedom.', [
    ['Defend the law', 'National defense.', 'The case drags on.', { stats: { military: 3, protest: 3 } }],
    ['Signal openness to a voluntary program', 'Compromise.', 'The students claim victory.', { stats: { military: -2, approval: 1 } }],
  ], [{ flag: 'law_b2_mandatory_rotc' }]),
  issue('m2_sc_civil_union', [58, 68], 'court', 'Korte Suprema: Same-Sex Union', 'Kataas-taasang Hukuman', 'A same-sex couple asks the Court to recognize their union under the equal-protection clause.', [
    ['Stay neutral', 'It is for the Court.', 'The case becomes a national conversation.', { stats: { church: -2 } }],
    ['Have the Solicitor General oppose it', 'Side with the churches.', 'The churches are grateful; young voters are not.', { stats: { church: 4, approval: -1 } }],
  ]),
  issue('m2_sc_franchise', [46, 60], 'court', 'Korte Suprema: Ang Network', 'Kataas-taasang Hukuman', 'The KBN network asks the Court to void the “fairness conditions” on its franchise.', [
    ['Accept whatever the Court decides', 'Press freedom.', 'Journalists note your restraint.', { stats: { media: -4 } }],
    ['Defend the conditions', 'Fair coverage.', 'Media groups campaign against your successor.', { stats: { media: 6 } }],
  ], [{ resolved: 'network_franchise', choice: 'conditions_franchise' }]),

  // ─── Traitors & inner circle ───
  issue('m2_deputy_double_agent', [48, 64], 'cabinet', 'Ang Doble-Kara', 'Presidential Security Group', 'Your Deputy Executive Secretary has been secretly advising {opponent} while still attending your meetings.', [
    ['Confront and dismiss him', 'Quietly.', 'He joins the opposition openly.', { stats: { cabinetCohesion: 3 } }],
    ['Feed him disinformation', 'Use the leak.', 'The opposition makes a costly mistake.', { flags: { successor_boost: true }, stats: { capital: 3 } }],
  ]),
  issue('m2_cabinet_resigns_protest', [52, 66], 'cabinet', 'Nagbitiw sa Protesta', 'Cabinet Room', 'Your most respected Cabinet member resigns in protest, publishing an open letter: “I can no longer defend what this government has become.”', [
    ['Respond with respect', 'Thank them for their service.', 'The dignified response limits the damage.', { stats: { approval: -2, cabinetCohesion: -3 } }],
    ['Attack their motives', '“They want to run for office.”', 'The feud dominates the news for weeks.', { stats: { approval: -5, media: 6 } }],
  ], [{ stat: 'corruption', gte: 50 }]),

  // ─── Economy: good and bad ───
  issue('m2_coop_scam', [40, 54], 'scandal', 'Ponzi sa Probinsya', 'Mindara', 'A “cooperative” promising 30% monthly returns collapses, taking ₱20B from 400,000 poor families. Its founder donated to your campaign.', [
    ['Arrest the founder and freeze assets for victims', 'Justice for the poor.', 'Victims recover a third of their money.', { stats: { approval: 3, crime: -1 } }],
    ['Return his donation and stay out', 'Distance.', 'Victims camp outside the Palasyo.', { stats: { approval: -3, protest: 4 } }],
  ]),
  issue('m2_gulf_fund_real', [44, 60], 'economy', 'Tunay na Mamumuhunan', 'Board of Investments', 'A genuine Gulf sovereign fund commits ₱150B to Kapuluan airports and ports — after checking twice that you are not another fake investor story.', [
    ['Sign with full transparency', 'Publish the contracts.', 'The deal is praised as a model.', { stats: { investor: 6, growth: 0.3, corruption: -1 } }, 'GULF FUND COMMITS ₱150B'],
    ['Sign with confidential terms', 'Faster.', 'Critics ask what is being hidden.', { stats: { investor: 5, growth: 0.3, corruption: 3 } }],
  ]),
  issue('m2_bank_run_rural', [52, 64], 'economy', 'Takbuhan sa Bangko', 'Provincial banks', 'Rumors on social media trigger runs on three rural banks.', [
    ['Central bank liquidity support and a public statement', 'Calm the panic.', 'The runs stop in two days.', { stats: { investor: 2 } }],
    ['Let weak banks fail', 'Market discipline.', 'Depositors lose savings; trust falls.', { stats: { approval: -3, growth: -0.2 } }],
  ]),
  issue('m2_broadband', [46, 60], 'economy', 'Internet sa Bawat Isla', 'Information Technology Department', 'The national fiber backbone reaches its 1,000th island. Students on remote islands can finally take online classes.', [
    ['Celebrate with a live class from a remote island', 'Good news.', 'The live class goes viral.', { stats: { approval: 2, growth: 0.1 } }, 'INTERNET REACHES 1,000 ISLANDS'],
  ], [{ any: [{ flag: 'law_b2_digital_infra' }, { flag: 'law_bill_open_access' }] }]),
  issue('m2_satellite', [50, 66], 'society', 'Unang Satellite', 'Space Agency', 'The Kapuluan launches its first weather satellite, built by Kapuluan engineers.', [
    ['Celebrate it as a national milestone', 'Pride.', 'Schoolchildren watch the launch live.', { stats: { approval: 2 } }],
  ], [{ flag: 'law_b2_space_agency' }]),
  issue('m2_bridge_opening', [54, 68], 'economy', 'Binuksan ang Tulay', 'Visara', 'The Visara Link Bridge opens — two islands joined for the first time. Travel time drops from four hours to twenty minutes.', [
    ['Cut the ribbon with the workers who built it', 'Share the credit.', 'The image becomes the defining photo of your term.', { stats: { approval: 4, growth: 0.2 } }, 'VISARA LINK BRIDGE OPENS'],
  ], [{ flag: 'flagship', is: 'bridge' }]),
  issue('m2_rail_opening', [58, 69], 'economy', 'Ang Unang Tren sa Mindara', 'Davira City', 'The first train of the Mindara Railway runs from Davira City. Crowds line the tracks for 80 kilometers.', [
    ['Ride the first train', 'History.', 'Mindara will remember this.', { stats: { approval: 4, tribes: 4 } }, 'MINDARA’S FIRST TRAIN'],
  ], [{ flag: 'flagship', is: 'rail' }]),
  issue('m2_unemployment_record_low', [50, 66], 'economy', 'Pinakamababang Unemployment', 'Statistics authority', 'Unemployment falls to its lowest level in 30 years.', [
    ['Announce it humbly', 'Credit the workers.', 'A good week for the administration.', { stats: { approval: 3 } }, 'UNEMPLOYMENT AT 30-YEAR LOW'],
  ], [{ stat: 'unemployment', lte: 5 }]),
  issue('m2_poverty_drop', [56, 68], 'economy', 'Bumaba ang Kahirapan', 'Statistics authority', 'The poverty rate falls below 15% for the first time in the country’s history.', [
    ['Celebrate — and set the next target', 'Build on it.', 'Your successor inherits a proud number.', { stats: { approval: 4 } }],
  ], [{ stat: 'poverty', lte: 16 }]),
  issue('m2_diaspora_donation', [40, 60], 'society', 'Regalo mula sa Diaspora', 'Kapuluan communities abroad', 'Kapuluan communities abroad raise ₱3B to rebuild typhoon-hit schools.', [
    ['Match it peso for peso', 'Double the impact.', 'Six hundred classrooms are rebuilt.', { spend: 3, spendLabel: 'Diaspora school matching fund', stats: { approval: 2 } }],
    ['Accept with thanks', 'Simple gratitude.', 'The schools are rebuilt.', { stats: { approval: 1 } }],
  ]),
  issue('m2_foreign_disaster_aid', [42, 58], 'diplomacy', 'Tulong mula sa Mundo', 'Department of Foreign Affairs', 'After a string of disasters, allies pledge ₱25B in grants for climate adaptation.', [
    ['Accept and publish every peso', 'Transparency.', 'Donors pledge more next year.', { income: 25, spendLabel: 'Foreign climate grants', stats: { investor: 2 } }],
  ]),

  // ─── Crime, society, calamity ───
  issue('m2_scam_hubs_home', [44, 60], 'crisis', 'Scam Hub sa Sariling Bayan', 'Gitnang Kapatagan', 'Police raid a compound where 700 foreigners and Kapuluan citizens run online scams — protected by a local mayor.', [
    ['Arrest the mayor too', 'No protection.', 'The mayor is arrested; his clan swears revenge.', { stats: { crime: -3, approval: 2 } }],
    ['Deport the foreigners, leave the mayor', 'Local politics.', 'The compound reopens under a new name.', { stats: { crime: 1, corruption: 2 } }],
  ]),
  issue('m2_measles', [38, 50], 'society', 'Tigdas', 'Department of Health', 'A measles outbreak kills 90 children. Vaccination rates in poor areas are the lowest in the region.', [
    ['Door-to-door vaccination campaign', '₱3B.', 'The outbreak ends in three months.', { spend: 3, spendLabel: 'Measles vaccination', stats: { approval: 2 } }],
    ['Standard response', 'Clinics only.', 'The outbreak spreads to three more regions.', { stats: { approval: -3 } }],
  ]),
  issue('m2_volcano_mindara', [48, 62], 'calamity', 'Pumutok ang Bulkan', 'Hilagang Mindara', 'Mount Hibok erupts; 60,000 people evacuate.', [
    ['Full evacuation and relief', '₱8B.', 'No deaths.', { spend: 8, spendLabel: 'Volcano evacuation', stats: { approval: 2 } }],
    ['Local response', 'Governors lead.', 'Twelve die in a village that refused to leave.', { stats: { approval: -2 } }],
  ]),
  issue('m2_flash_floods', [53, 57], 'calamity', 'Biglaang Baha', 'Bikolandia', 'Flash floods and landslides kill 70 in Bikolandia. Illegal logging upstream is blamed.', [
    ['Relief and a logging crackdown', 'Treat the cause.', 'Loggers — and the officials they pay — are arrested.', { spend: 6, spendLabel: 'Flood relief', stats: { approval: 2, corruption: -2 } }],
    ['Relief only', 'Help now.', 'The loggers return next month.', { spend: 6, spendLabel: 'Flood relief' }],
  ]),
  issue('m2_hazing_again', [40, 58], 'society', 'Hazing, Muli', 'Military academy', 'A cadet dies after hazing at the national military academy. Upperclassmen are sons of generals.', [
    ['Prosecute everyone', 'No exceptions.', 'The generals are angry; parents are grateful.', { stats: { military: -4, approval: 3 } }],
    ['Let the academy handle it', 'Military justice.', 'The cadets are expelled — and quietly readmitted.', { stats: { military: 3, approval: -3 } }],
  ]),
  issue('m2_vlogger_arrest', [44, 62], 'media', 'Inaresto ang Vlogger', 'Maynilad', 'A popular vlogger critical of your administration is arrested for cyber-libel over a video calling your spouse corrupt.', [
    ['Ask for the case to be dropped', 'Free speech.', 'Press groups praise you.', { stats: { media: -5 } }],
    ['Let the case proceed', 'The law is the law.', 'Supporters of the vlogger march; the video gets ten times more views.', { stats: { media: 8, approval: -2 } }],
  ]),
  issue('m2_fake_news_deepfake', [58, 68], 'media', 'Deepfake ng Kandidato', 'Social media', 'A deepfake video shows your successor accepting a bribe. It gets 20 million views before being debunked.', [
    ['Trace and prosecute the creators', 'Protect the election.', 'The trail leads to a PR firm hired by {opponent}’s allies.', { flags: { opponent_weakened: true }, stats: { media: -3 } }],
    ['Respond with your own attack video', 'Fight fire with fire.', 'The campaign turns ugly. Everyone loses trust.', { stats: { media: 6 }, flags: { ch2_abuse: true } }],
  ]),
  issue('m2_jeepney_strike_2', [45, 60], 'society', 'Welga ng Tsuper, Muli', 'Maynilad', 'Transport groups strike against a fare freeze while fuel prices rise.', [
    ['Allow a ₱2 fare increase', 'Fair to drivers.', 'Commuters grumble; drivers return to work.', { stats: { inflation: 0.1, protest: -3 } }],
    ['Fuel subsidies for drivers', '₱5B.', 'Fares stay the same.', { spend: 5, spendLabel: 'Fuel subsidies for drivers', stats: { protest: -3 } }],
  ]),
  issue('m2_teachers_pay_protest', [54, 66], 'society', 'Guro sa Kalye', 'Education Department', 'Teachers march: the salary increase promised in your first SONA has not reached the lowest grades.', [
    ['Release the full increase', '₱18B.', 'Teachers celebrate.', { spend: 18, spendLabel: 'Teacher salary arrears', stats: { approval: 3 } }],
    ['Promise it next year', 'Budget constraints.', 'Teachers campaign against your successor.', { stats: { approval: -3 } }],
  ]),
  issue('m2_water_shortage', [60, 68], 'crisis', 'Walang Tubig', 'Maynilad', 'A summer water shortage leaves 4 million people with water only four hours a day.', [
    ['Emergency deep wells and water trucks', '₱4B.', 'Relief within a week.', { spend: 4, spendLabel: 'Water emergency', stats: { approval: 1 } }],
    ['Blame the concessionaires', 'Their failure.', 'True — and useless to thirsty families.', { stats: { approval: -2 } }],
  ]),

  // ─── Family ───
  issue('m2_child_graduation', [44, 56], 'family', 'Ang Pagtatapos', 'University', 'Your youngest graduates from college. The university invites you to speak — and students plan a walkout in protest.', [
    ['Attend quietly as a parent, not a speaker', 'It is their day.', 'Your child hugs you on stage. Nobody walks out.', { stats: { family: 10 } }],
    ['Give the commencement speech', 'A presidential moment.', 'Half the graduates walk out. Your child is mortified.', { stats: { family: -8, media: 4 } }],
  ]),
  issue('m2_spouse_foundation', [50, 64], 'scandal', 'Ang Foundation', 'Senate hearings', 'Senators investigate your spouse’s nutrition foundation: ₱2B in donations from contractors who later won government deals.', [
    ['Open the foundation’s books', 'Transparency.', 'Most of it checks out. Some of it does not.', { stats: { family: -4, ombudsman: 3 } }],
    ['Refuse — it is a private foundation', 'Protect your spouse.', 'The refusal becomes the story.', { stats: { family: 4, ombudsman: 8, media: 6 }, flags: { ch2_cover_up: true } }],
  ], [{ any: [{ flag: 'spouse_program' }, { flag: 'spouse_running' }] }]),
  issue('m2_grandmother_health', [60, 68], 'family', 'Si Lola', 'Hospital', 'Your spouse’s mother is gravely ill. The family asks you to be there — during the final month of the campaign.', [
    ['Go to the hospital', 'Family first.', 'You sit with her through her last night.', { stats: { family: 12 } }],
    ['Stay on the campaign trail', 'The election cannot wait.', 'Your spouse does not forgive you.', { stats: { family: -15 }, flags: { successor_boost: true } }],
  ]),
];
