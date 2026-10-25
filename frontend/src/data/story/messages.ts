import type { Condition, Effects } from '@/features/narrative/types/event';

/** A text message to the President's phone. Some are offers, some threats; some expire if ignored. */
export interface MessageTemplate {
  id: string;
  from: string;
  role: string;
  text: string;
  options: { label: string; outcome: string; effects: Effects }[];
  /** What happens if the message is left unanswered until it expires. */
  ignore?: { note: string; effects: Effects };
  /** Months before it expires (default 2). */
  expires?: number;
  from_month?: number;
  to_month?: number;
  when?: Condition[];
}

export const MESSAGES: MessageTemplate[] = [
  // ─── Congress ───
  {
    id: 'speaker_pork', from: '{speaker}', role: 'Speaker of the House', from_month: 2,
    text: 'Good evening, {sirmaam}. The boys are restless. ₱3B in district projects would make the next votes much easier. Just saying. 🙏',
    options: [
      { label: 'Approve the projects', outcome: 'The Speaker sends a thumbs-up. The House is very friendly this month.', effects: { spend: 3, spendLabel: 'District projects (Speaker’s request)', houseShift: 6, stats: { cohesion: 4, corruption: 2 } } },
      { label: '“Not this time.”', outcome: '“Noted, {sirmaam}.” The Speaker’s replies get shorter.', effects: { stats: { cohesion: -3 } } },
    ],
    ignore: { note: 'The Speaker took your silence as a no. The House drags its feet.', effects: { stats: { cohesion: -2 } } },
  },
  {
    id: 'senpres_committee', from: '{senatePresident}', role: 'Senate President', from_month: 4,
    text: '{mrmadam} President, the Blue Ribbon Committee wants to look at your Transportation department. I can slow it down — if your people stop attacking my allies on social media.',
    options: [
      { label: 'Call off the online attacks', outcome: 'The trolls go quiet. So does the Blue Ribbon Committee.', effects: { stats: { media: -2, ombudsman: -3, cohesion: 2 } } },
      { label: 'Let the committee do its job', outcome: 'The hearings begin. You have nothing to hide — you hope.', effects: { stats: { ombudsman: 5, corruption: -1 } } },
    ],
  },
  {
    id: 'minority_deal', from: '{minorityLeader}', role: 'Minority Floor Leader', from_month: 10,
    text: 'Off the record: the opposition will support your infrastructure bill if you drop the case against our governor in the south.',
    options: [
      { label: 'Take the deal', outcome: 'The bill sails through. The case quietly stalls.', effects: { houseShift: 8, stats: { corruption: 4, capital: 4 } } },
      { label: 'Refuse', outcome: '“Your loss, {sirmaam}.”', effects: { stats: { corruption: -1 } } },
    ],
    ignore: { note: 'The Minority Leader tells reporters the Palasyo “won’t even pick up the phone.”', effects: { stats: { media: 2 } } },
  },
  // ─── Governors ───
  {
    id: 'gov_relief', from: 'Governor of Bikolandia', role: 'Provincial governor', from_month: 3, expires: 1,
    text: 'The floodwater is still at the rooftops in three towns. We need ₱2B for relief by the weekend. Please, {sirmaam}.',
    options: [
      { label: 'Release ₱2B now', outcome: 'Relief goods arrive in two days. The governor thanks you on live radio.', effects: { spend: 2, spendLabel: 'Bikolandia flood relief', stats: { approval: 2 } } },
      { label: '“Go through the disaster council process.”', outcome: 'The paperwork takes three weeks.', effects: { stats: { approval: -1 } } },
    ],
    ignore: { note: 'You never answered the Bikolandia governor. The province remembers.', effects: { stats: { approval: -2 } } },
  },
  {
    id: 'gov_mindara', from: 'Governor of Davira', role: 'Provincial governor', from_month: 8,
    text: 'Mindara feels forgotten, {sirmaam}. Every big project goes to Luzara. A visit and one hospital would change everything here.',
    options: [
      { label: 'Fund a ₱4B regional hospital', outcome: 'You break ground in Davira yourself. The crowd is enormous.', effects: { spend: 4, spendLabel: 'Davira regional hospital', stats: { approval: 2, tribes: 2 } } },
      { label: 'Promise a visit', outcome: 'You visit for an afternoon. Nice photos; few results.', effects: { stats: { approval: 0.5 } } },
    ],
  },
  {
    id: 'gov_switch', from: 'Governor of Sugbu', role: 'Provincial governor', from_month: 14,
    text: 'I’m thinking of joining your party before the midterms. I bring 40 mayors with me. All I ask is the next port project.',
    options: [
      { label: 'Welcome them aboard', outcome: 'Forty mayors switch parties in one ceremony.', effects: { stats: { cohesion: 4, corruption: 1 }, houseShift: 3 } },
      { label: 'Projects are not for sale', outcome: 'The governor stays independent — and a little colder.', effects: {} },
    ],
  },
  // ─── Business ───
  {
    id: 'tycoon_dinner', from: 'Lorenzo Tanjuatco', role: 'Tycoon', from_month: 5,
    text: 'A small dinner at my house Saturday? A few friends who want to invest ₱80B — if the rules on foreign ownership loosen a little.',
    options: [
      { label: 'Go to the dinner', outcome: 'Good wine, big promises. Reporters photograph your car outside.', effects: { stats: { investor: 4, corruption: 2, media: 2 } } },
      { label: 'Send your Trade Secretary instead', outcome: 'The tycoon is polite but disappointed.', effects: { stats: { investor: 1 } } },
      { label: 'Decline', outcome: 'You keep your distance.', effects: { stats: { investor: -1 } } },
    ],
  },
  {
    id: 'bank_ceo', from: 'CEO, Banco de Kapuluan', role: 'Banker', from_month: 12,
    text: 'The markets are nervous about the deficit. One sentence from you about fiscal discipline would calm them down tomorrow morning.',
    options: [
      { label: 'Issue a statement on discipline', outcome: 'Bond yields fall the next morning.', effects: { stats: { investor: 3 } } },
      { label: 'Ignore the bankers', outcome: 'The markets wobble.', effects: { stats: { investor: -2 } } },
    ],
    ignore: { note: 'Markets read your silence as indifference to the deficit.', effects: { stats: { investor: -2 } } },
  },
  {
    id: 'telco_threat', from: 'Telecom executive', role: 'Business', from_month: 16,
    text: 'If the new franchise tax passes, we will slow down our tower rollout in the provinces. Just so you know.',
    options: [
      { label: '“Then we open the market to a new carrier.”', outcome: 'The executive backs down within a week.', effects: { stats: { investor: -1, approval: 1 } } },
      { label: 'Promise to water down the tax', outcome: 'The towers keep going up. The tax raises less.', effects: { taxRate: -0.02, stats: { investor: 2 } } },
    ],
  },
  // ─── Family ───
  {
    id: 'spouse_dinner', from: 'Your spouse', role: 'Family', from_month: 3, expires: 1,
    text: 'You missed dinner again. The kids waited. Are you coming home tonight? ❤️',
    options: [
      { label: '“On my way.”', outcome: 'You leave a meeting early. It is the best night in weeks.', effects: { stats: { family: 5, capital: -1 } } },
      { label: '“Sorry, crisis meeting.”', outcome: 'A single “ok” comes back.', effects: { stats: { family: -3 } } },
    ],
    ignore: { note: 'You never answered your spouse’s message. The silence at breakfast is loud.', effects: { stats: { family: -5 } } },
  },
  {
    id: 'bea_text', from: 'Bea', role: 'Your daughter', from_month: 20,
    text: 'Did you even read the open letter my org sent you? You used to care about this stuff.',
    options: [
      { label: 'Meet her student group', outcome: 'An honest two-hour talk. Bea hugs you at the end.', effects: { stats: { family: 5, protest: -2 } } },
      { label: '“I’m doing my best, anak.”', outcome: 'She leaves you on read.', effects: { stats: { family: -2 } } },
    ],
  },
  {
    id: 'mom_text', from: 'Nanay', role: 'Your mother', from_month: 6,
    text: 'Anak, kumain ka na ba? You look tired on TV. Don’t forget who you are. 🙏',
    options: [
      { label: 'Call her', outcome: 'Twenty minutes of her voice. You feel human again.', effects: { stats: { family: 4 } } },
      { label: '“Busy, Nay. Love you.”', outcome: 'She sends three heart emojis anyway.', effects: { stats: { family: 1 } } },
    ],
  },
  // ─── Abroad ───
  {
    id: 'haizhou_amb', from: 'Ambassador of Haizhou', role: 'Diplomat', from_month: 6,
    text: 'My government would appreciate it if your Navy avoided the area near the reef this month. In return, our banks are ready to finance your railways.',
    options: [
      { label: 'Agree quietly', outcome: 'The loan offer arrives. So do the Haizhou ships.', effects: { debt: 30, stats: { sovereignty: -6, military: -5, investor: 2 } } },
      { label: 'Refuse publicly', outcome: 'You post the message on social media. The nation cheers; Haizhou fumes.', effects: { stats: { sovereignty: 6, approval: 3, investor: -2 } } },
      { label: 'Refuse privately', outcome: 'A firm, quiet no.', effects: { stats: { sovereignty: 2 } } },
    ],
  },
  {
    id: 'columbia_amb', from: 'Ambassador of Columbia', role: 'Diplomat', from_month: 10,
    text: 'Our President would like a call. There may be ₱20B in military aid on the table if your bases agreement is extended.',
    options: [
      { label: 'Take the call and extend', outcome: 'The aid package is announced. Haizhou protests.', effects: { income: 20, spendLabel: 'Columbian military aid', stats: { military: 6, sovereignty: 3 } } },
      { label: 'Stay neutral', outcome: 'You thank them and stall.', effects: { stats: { military: -1 } } },
    ],
  },
  {
    id: 'nippara_pm', from: 'Prime Minister of Nippara', role: 'Head of government', from_month: 18,
    text: 'Congratulations on your progress. We would like to double our scholarships for Kapuluan nurses and engineers. May I announce it at the summit?',
    options: [
      { label: '“Please do — and thank you.”', outcome: 'Five thousand new scholarships a year.', effects: { stats: { approval: 1, investor: 1 } } },
    ],
  },
  // ─── Cabinet & advisers ───
  {
    id: 'finsec_alarm', from: '{sec:finance}', role: 'Finance Secretary', from_month: 6, when: [{ stat: 'investor', lte: 45 }],
    text: '{sirmaam}, investors are pulling out. I need your OK to issue a statement and delay two big spending items.',
    options: [
      { label: 'Approve the delays', outcome: 'Markets calm down. Two projects slip a few months.', effects: { stats: { investor: 4, unemployment: 0.1 } } },
      { label: 'No delays', outcome: 'The Finance Secretary sighs audibly on the phone.', effects: { stats: { investor: -2, cabinetCohesion: -2 } } },
    ],
  },
  {
    id: 'es_leak', from: '{sec:executive}', role: 'Executive Secretary', from_month: 9,
    text: 'Someone is leaking our schedule to the press. I want permission to check everyone’s phones in the Palasyo.',
    options: [
      { label: 'Allow phone checks', outcome: 'The leaks stop. Staff morale drops.', effects: { stats: { cabinetCohesion: -4, media: 2 } } },
      { label: 'Refuse — trust your people', outcome: 'The leaks continue, a little.', effects: { stats: { media: 1, cabinetCohesion: 2 } } },
    ],
  },
  {
    id: 'spox_meme', from: 'Presidential Spokesperson', role: 'Adviser', from_month: 4,
    text: 'There is a meme of you trending. It is… actually kind of funny. Should we lean in?',
    options: [
      { label: 'Lean in — post it yourself', outcome: 'You repost it with a laughing emoji. Your approval among young voters jumps.', effects: { stats: { approval: 1.5, media: -2 } } },
      { label: 'Ignore it', outcome: 'It dies down in two days.', effects: {} },
    ],
  },
  {
    id: 'afp_chief', from: 'Chief of Staff, Armed Forces', role: 'Military', from_month: 12, when: [{ stat: 'military', lte: 50 }],
    text: 'The troops have not had a pay adjustment in four years. Morale is low. I am telling you as a friend.',
    options: [
      { label: 'Approve a ₱5B pay adjustment', outcome: 'The general salutes you at the next parade — properly.', effects: { spend: 5, spendLabel: 'Military pay adjustment', stats: { military: 7 } } },
      { label: '“Next year’s budget.”', outcome: '“Understood, {sirmaam}.”', effects: { stats: { military: -2 } } },
    ],
    ignore: { note: 'The Armed Forces chief’s message went unanswered. The barracks notice.', effects: { stats: { military: -4 } } },
  },
  // ─── Media & people ───
  {
    id: 'anchor_interview', from: 'Evening news anchor', role: 'Media', from_month: 7,
    text: 'One-on-one interview, prime time, no pre-screened questions. Are you brave enough? 😊',
    options: [
      { label: 'Accept', outcome: 'A tough hour on live TV. You hold your own.', effects: { stats: { media: -4, approval: 1 } } },
      { label: 'Decline', outcome: 'The anchor tells viewers you “declined to face the people.”', effects: { stats: { media: 3 } } },
    ],
  },
  {
    id: 'ofw_viral', from: 'OFW group, Gulf states', role: 'Citizens', from_month: 11, expires: 1,
    text: 'Our sister was arrested abroad for defending herself from her employer. Please help her, President. Please.',
    options: [
      { label: 'Send the Foreign Secretary personally', outcome: 'She is released after two weeks. The nation weeps with her family.', effects: { spend: 0.2, spendLabel: 'Repatriation and legal aid', stats: { approval: 3 } } },
      { label: '“The embassy will handle it.”', outcome: 'The case drags for months.', effects: { stats: { approval: -1 } } },
    ],
    ignore: { note: 'The OFW family’s plea went unanswered. The story goes viral.', effects: { stats: { approval: -3, media: 3 } } },
  },
  {
    id: 'bishop_call', from: 'Archbishop of Maynilad', role: 'Church', from_month: 8,
    text: 'The Church is concerned about the killings in the slums. Can we meet before Sunday’s homily?',
    options: [
      { label: 'Meet the Archbishop', outcome: 'A long, frank meeting. Sunday’s homily is gentler than expected.', effects: { stats: { church: 5, capital: -1 } } },
      { label: 'Decline', outcome: 'Sunday’s homily is not gentle.', effects: { stats: { church: -5, media: 2 } } },
    ],
    ignore: { note: 'The Archbishop was not answered. Sunday’s homily names the Palasyo.', effects: { stats: { church: -4 } } },
  },
  {
    id: 'farmer_leader', from: 'Ka Pedring, farmers’ federation', role: 'Sectoral leader', from_month: 13,
    text: 'Palay prices are down to ₱14 a kilo. Our members are losing their land. Will you buy our harvest?',
    options: [
      { label: 'Order the food agency to buy at ₱19: ₱6B', outcome: 'Farmers cheer. Rice in the cities gets a little dearer.', effects: { spend: 6, spendLabel: 'Palay procurement', stats: { approval: 2, inflation: 0.05, poverty: -0.2 } } },
      { label: '“Markets must decide.”', outcome: 'Farmers march on Mendiola.', effects: { stats: { protest: 4 } } },
    ],
  },
  {
    id: 'troll_offer', from: 'Unknown number', role: '???', from_month: 9,
    text: '50,000 accounts, all yours, ₱80M a month. Trending every day. No one will ever trace it to the Palasyo. Interested?',
    options: [
      { label: 'Hire them', outcome: 'Your hashtags trend every night. Somewhere, a reporter starts digging.', effects: { spend: 0.08, spendLabel: 'Digital consultants', stats: { approval: 2, media: -3, corruption: 3 }, flags: { troll_army: true } } },
      { label: 'Block the number', outcome: 'Blocked.', effects: {} },
    ],
  },
  {
    id: 'reporter_tip', from: 'Investigative reporter', role: 'Media', from_month: 18, when: [{ flag: 'troll_army' }],
    text: 'We have proof the Palasyo pays a troll farm. Comment before we publish Monday?',
    options: [
      { label: 'Admit it and shut it down', outcome: 'A painful admission — but it ends the story.', effects: { stats: { approval: -3, media: -2 }, flags: { troll_army: false } } },
      { label: '“No comment.”', outcome: 'The story runs. It is worse than you thought.', effects: { stats: { approval: -6, media: 6, corruption: 3 } } },
    ],
  },
  {
    id: 'old_friend', from: 'Old classmate', role: 'Friend', from_month: 15,
    text: 'Pare/Mare! Long time. My company is bidding for a government IT contract. A word from you? For old times’ sake. 😉',
    options: [
      { label: 'Put in a word', outcome: 'Your friend wins the contract. The bidding watchdog takes notice.', effects: { stats: { corruption: 4 }, flags: { cronyism: true } } },
      { label: '“Bid like everyone else.”', outcome: '“Of course, of course.” They do not text again.', effects: { stats: { corruption: -1 } } },
    ],
  },
  {
    id: 'vp_lunch', from: '{vp}', role: 'Vice President', from_month: 20,
    text: 'Lunch next week? Just us. I think we should talk about 2033.',
    options: [
      { label: 'Have lunch', outcome: 'A long, careful lunch. You understand each other better.', effects: { stats: { cohesion: 2 }, flags: { vp_lunch: true } } },
      { label: 'Decline', outcome: 'The Vice President takes note.', effects: { stats: { cohesion: -2 } } },
    ],
  },
];
