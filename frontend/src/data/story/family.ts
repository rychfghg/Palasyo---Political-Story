import type { StoryEvent } from '@/features/narrative/types/event';
import { quick, then } from './chapter1/helpers';

/**
 * The First Family. Your son Migo, your daughter Bea, your sister Tessa, your brother Carlito,
 * and your spouse — each with a storyline that forces a choice between family and the law.
 */
export const FAMILY_EVENTS: StoryEvent[] = [
  // ═════════════ MIGO: THE CRASH ═════════════
  quick('fam_migo_crash', [8, 16], 'family', 'Ang Aksidente', 'An avenue in Maynilad, 2 a.m.', [
    'Your son Migo crashes his car into a fruit stand after a night out. The vendor, a mother of four, is in the hospital with a broken leg. Witnesses say Migo had been drinking.',
    'The police chief calls the Palasyo before the report is filed. “We can make this a simple traffic accident, {sirmaam}.”',
  ], [
    ['Let the law take its course', 'No special treatment — not even for your son.', 'The report is filed as it happened. Migo is charged with reckless driving under the influence. At home, the silence is heavy.', { stats: { family: -8, corruption: -2, approval: 2 }, flags: { migo_charged: true }, ...then('fam_migo_trial', 5) }, 'PRESIDENT’S SON CHARGED'],
    ['Make it a “simple accident”', 'Protect your son. Pay the vendor well.', 'The report says “mechanical failure.” The vendor’s family receives an envelope. For now, nothing leaks.', { stats: { family: 4, corruption: 3 }, flags: { migo_coverup: true }, ...then('fam_migo_leak', 6) }],
    ['Apologize publicly and pay for everything', 'Own it as a family.', 'You visit the vendor in the hospital. Migo apologizes on camera. The charges still go ahead.', { stats: { family: -2, approval: 1, media: -2 }, flags: { migo_charged: true }, ...then('fam_migo_trial', 5) }],
  ], { priority: 6 }),
  quick('fam_migo_trial', null, 'family', 'Ang Hatol kay Migo', 'Metropolitan Trial Court, Maynilad', 'The court finds Migo guilty and sentences him to probation and community service. Your allies whisper that a pardon would be easy.', [
    ['Respect the verdict', 'He serves the sentence like anyone else.', 'Migo spends his weekends sweeping streets in Tondo-by-the-Bay. The photos go viral — and people respect it.', { stats: { approval: 3, family: -3, corruption: -2 } }],
    ['Pardon him', 'He is your son.', 'The pardon is legal. It is also the only thing anyone talks about for a week.', { stats: { approval: -5, family: 5, corruption: 4, media: 6 } }, 'PRESIDENT PARDONS OWN SON'],
  ]),
  quick('fam_migo_leak', null, 'scandal', 'Ang Dashcam', 'Social media', 'A dashcam video of Migo’s crash surfaces online, along with a photo of the police report that called it “mechanical failure.” The vendor’s daughter tells reporters about the envelope.', [
    ['Admit it and let him face charges now', 'Too late for anything else.', 'The admission helps a little. Migo is charged; the police chief is suspended.', { stats: { approval: -3, family: -5, corruption: 1 }, flags: { migo_charged: true } }],
    ['Deny it — the video is fake', 'Hold the line.', 'Experts confirm the video is real. The Ombudsman opens a case for obstruction.', { stats: { approval: -7, media: 8, ombudsman: 8 }, flags: { obstruction: true } }, 'PALASYO COVER-UP OF SON’S CRASH'],
  ], { priority: 7 }),

  // ═════════════ TESSA: THE GOVERNORSHIP ═════════════
  quick('fam_tessa_governor', [14, 22], 'family', 'Tatakbo si Tessa', '{home}', [
    'Your sister Tessa wants to run for governor of {home}. She has the name, the money, and your party’s local machine — if you give her your blessing.',
    'Your political adviser says it would lock down the province. Your legal counsel reminds you that the Constitution frowns on dynasties.',
  ], [
    ['Endorse her', 'Family first — and a safe province.', 'Tessa files her candidacy with your photo on every tarpaulin.', { stats: { family: 6, corruption: 2, media: 3 }, flags: { tessa_running: true, family_dynasty: true }, ...then('fam_tessa_result', 8) }],
    ['Stay neutral', 'Let the voters decide.', 'Tessa runs anyway, without your name. She is hurt.', { stats: { family: -4 }, flags: { tessa_running: true }, ...then('fam_tessa_result', 8) }],
    ['Ask her not to run', 'One politician in the family is enough.', 'A long phone call. Tessa does not run, and does not call you on your birthday.', { stats: { family: -7, approval: 1 } }],
  ]),
  quick('fam_tessa_result', null, 'election', 'Ang Resulta sa Probinsya', '{home}', 'The provincial canvass is complete.', [['Read the result', '', 'You read it.', {}]], {
    variants: [
      { when: [{ stat: 'approval', gte: 48 }], text: 'Tessa wins in a landslide. The provincial capitol now has your family name on the door.' },
      { when: [{ stat: 'approval', lte: 47 }], text: 'Tessa loses narrowly to a local rival who ran against “the President’s dynasty.”' },
    ],
    choices: [
      { id: 'fam_tr_win', label: 'Congratulate Governor Tessa', description: 'A win for the family.', when: [{ stat: 'approval', gte: 48 }], outcome: 'Tessa takes her oath. Her first act is to hire three cousins.', effects: { stats: { family: 5, cohesion: 2 }, flags: { tessa_governor: true } }, headline: 'PRESIDENT’S SISTER WINS GOVERNORSHIP' },
      { id: 'fam_tr_loss', label: 'Console her', description: 'A family defeat.', when: [{ stat: 'approval', lte: 47 }], outcome: 'Tessa blames your unpopularity. Family dinners get colder.', effects: { stats: { family: -4, capital: -2 } } },
    ],
  }),
  quick('fam_tessa_contract', [30, 44], 'scandal', 'Kontrata ng Probinsya', '{home}', 'Governor Tessa awards a ₱1.2B road contract to a company owned by her husband. The Commission on Audit is asking questions.', [
    ['Let COA investigate her', 'The law applies to family.', 'Tessa calls you a traitor. The public calls you principled.', { stats: { family: -8, corruption: -3, approval: 2 } }],
    ['Ask her quietly to cancel the contract', 'Fix it before it grows.', 'The contract is cancelled. Nobody is charged. Reporters keep digging.', { stats: { family: -2, corruption: 1 } }],
    ['Defend her publicly', 'She won; she governs.', 'The opposition adds “dynasty corruption” to its campaign slogans.', { stats: { family: 4, corruption: 4, media: 5 } }],
  ], { when: [{ flag: 'tessa_governor' }] }),

  // ═════════════ YOUR SPOUSE: THE FOUNDATION ═════════════
  quick('fam_charity_probe', [24, 36], 'scandal', 'Ang Pundasyon', 'Commission on Audit', [
    'Your spouse’s foundation feeds 200,000 children a day. But COA reports that ₱400 million of its donations came from contractors who later won government projects.',
  ], [
    ['Return the donations and open the books', 'Transparency, even if it hurts.', 'An independent audit begins. Your spouse is furious — and then relieved.', { stats: { family: -3, corruption: -3 }, ...then('fam_charity_result', 4) }],
    ['Defend your spouse', 'Charity is not a crime.', 'The contractors are named one by one on the evening news.', { stats: { family: 5, corruption: 4, media: 5 }, flags: { spouse_foundation_probe: true } }],
    ['Close the foundation quietly', 'End the story.', 'The children’s meals stop. The story does not.', { stats: { family: -5, approval: -3, poverty: 0.1 } }],
  ]),
  quick('fam_charity_result', null, 'family', 'Ang Resulta ng Audit', 'Independent auditors', 'The independent audit of your spouse’s foundation is done.', [['Read the findings', '', 'You read them.', {}]], {
    variants: [
      { when: [{ stat: 'corruption', lte: 50 }], text: 'Every peso is accounted for. The contractors’ donations went to rice and milk. Your spouse is cleared.' },
      { when: [{ stat: 'corruption', gte: 51 }], text: 'Most of the money is accounted for — but ₱60 million went to “consultants” no one can find.' },
    ],
    choices: [
      { id: 'fam_cr_clean', label: 'Publish the audit', description: 'Vindication.', when: [{ stat: 'corruption', lte: 50 }], outcome: 'The audit is published. Your spouse’s approval rating passes yours.', effects: { stats: { approval: 3, family: 5 } }, headline: 'FIRST FAMILY FOUNDATION CLEARED' },
      { id: 'fam_cr_dirty', label: 'Refer the missing money to prosecutors', description: 'Even at home.', when: [{ stat: 'corruption', gte: 51 }], outcome: 'Two foundation officers are charged. Your spouse is not — but the marriage is strained.', effects: { stats: { family: -6, corruption: -2 } } },
    ],
  }),

  // ═════════════ BEA: THE PROTESTER ═════════════
  quick('fam_bea_arrested', [40, 52], 'family', 'Inaresto si Bea', 'Mendiola', 'Your daughter Bea is arrested with forty students at a protest against your own administration’s policy. The police ask whether to release her “as a courtesy.”', [
    ['Treat her like everyone else', 'Due process for all forty.', 'All forty are released on bail the next morning, Bea included. She does not speak to you for a month.', { stats: { family: -5, approval: 3 } }],
    ['Have her released tonight', 'Get your daughter home.', 'Bea is released alone. The other students are not. She is more furious with you than ever.', { stats: { family: -3, corruption: 2, media: 4 } }],
    ['Meet the students — with Bea', 'Listen to what they are angry about.', 'The dialogue is tense and televised. Some of their demands make it into policy.', { stats: { protest: -5, approval: 2, family: 4, military: -2 } }, 'PRESIDENT MEETS PROTESTERS — AND DAUGHTER'],
  ]),

  // ═════════════ MIGO: THE CONTRACT ═════════════
  quick('fam_migo_contract', [44, 58], 'scandal', 'Ang Startup ni Migo', 'Department of ICT', 'A tech startup co-founded by Migo wins a ₱3B government contract to build a citizens’ app. Its bid was the lowest — and its only experience is a food-delivery app.', [
    ['Cancel it and re-bid', 'No conflict of interest.', 'The contract is re-bid. Migo’s company loses. So does his trust in you.', { stats: { family: -5, corruption: -3 } }],
    ['Let it stand — the bid was fair', 'He earned it.', 'The app launches late and crashes on day one. The jokes write themselves.', { stats: { family: 3, corruption: 4, media: 5, approval: -2 } }],
    ['Ask Migo to sell his stake', 'Let the company keep it, without him.', 'Migo sells, grumbling. The contract stands on its merits.', { stats: { family: -2, corruption: -1 } }],
  ]),

  // ═════════════ THREATS AND ILLNESS ═════════════
  quick('fam_threat', [30, 62], 'crisis', 'Banta sa Pamilya', 'Presidential Security Group', 'The Presidential Security Group intercepts a credible plan to kidnap one of your children. The group behind it is unknown.', [
    ['Send the children abroad for a while', 'Safety first.', 'Bea and Migo leave for Nippara. The Palasyo is very quiet.', { stats: { family: -4 } }],
    ['Double their security: ₱1B', 'They stay home, guarded.', 'Security teams follow them to school and to parties. They hate it.', { spend: 1, spendLabel: 'First Family security', stats: { family: 1 } }],
    ['Go public about the threat', 'Let the country know.', 'Sympathy pours in. So do copycat threats.', { stats: { approval: 3, family: -1, crime: 1 } }],
  ]),
  quick('fam_mother_ill', [50, 64], 'family', 'May Sakit si Nanay', 'A hospital in {home}', 'Your mother has had a stroke. The doctors say the next two weeks matter. The Cabinet meets on Monday; a typhoon is forming east of Visara.', [
    ['Take two weeks off and be with her', 'Some things matter more.', 'You sit at her bedside. The Vice President runs the Cabinet meetings — and enjoys it.', { stats: { family: 10, capital: -4 }, flags: { vp_acting: true } }],
    ['Visit on weekends only', 'The country needs you.', 'You fly home every Saturday. Your siblings notice who was there every day.', { stats: { family: -3, approval: 1 } }],
    ['Bring her to Maynilad’s best hospital', 'Both at once.', 'She is moved by air ambulance. Critics ask who pays for it.', { spend: 0.05, spendLabel: 'Air ambulance', stats: { family: 5, media: 2 } }],
  ]),
  quick('fam_christmas', [60, 68], 'family', 'Pasko sa Palasyo', 'Palasyo ng Malaya', 'Your last Christmas in the Palasyo. The family gathers — almost all of them.', [
    ['Invite Carlito, whatever he has said', 'He is still your brother.', 'Carlito comes. It is awkward, then it isn’t. You both cry at the noche buena table.', { stats: { family: 8 }, flags: { brother_reconciled: true } }],
    ['Keep it to those who stood by you', 'Loyalty counts.', 'A warm, small Christmas. Carlito spends it with the opposition.', { stats: { family: 3 } }],
  ], { when: [{ flag: 'brother_running' }] }),
];
