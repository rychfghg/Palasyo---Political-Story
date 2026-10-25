export interface Institution {
  id: string;
  name: string;
  branch: 'Executive' | 'Legislative' | 'Judiciary' | 'Independent';
  composition: string;
  head: string;
  powers: string;
  playerControl: string;
}

export const INSTITUTIONS: Institution[] = [
  {
    id: 'presidency',
    name: 'Office of the President',
    branch: 'Executive',
    composition: 'President · 6-year term, no reelection',
    head: 'You (from June 30, 2027)',
    powers: 'Chief executive, Commander-in-Chief, signs or vetoes bills, nominates officials.',
    playerControl: 'Direct',
  },
  {
    id: 'vp',
    name: 'Office of the Vice President',
    branch: 'Executive',
    composition: 'Vice President · elected separately',
    head: 'To be decided by the 2027 election',
    powers: 'First in line of succession. May sit in the Cabinet without confirmation.',
    playerControl: 'None — may be a rival',
  },
  {
    id: 'cabinet',
    name: 'The Cabinet',
    branch: 'Executive',
    composition: '~20 department secretaries',
    head: 'Executive Secretary',
    powers: 'Run the departments and carry out policy.',
    playerControl: 'Appoint & dismiss — subject to CA confirmation',
  },
  {
    id: 'senate',
    name: 'Senado',
    branch: 'Legislative',
    composition: '24 Senators · elected nationally · 6-year terms',
    head: 'Senate President',
    powers: 'Passes laws, ratifies treaties, tries impeachment cases (16 votes to convict).',
    playerControl: 'Influence only',
  },
  {
    id: 'house',
    name: 'Kapulungan ng mga Kinatawan',
    branch: 'Legislative',
    composition: '316 Representatives · district + party-list · 3-year terms',
    head: 'Speaker of the House',
    powers: 'Originates budget bills and exclusively initiates impeachment.',
    playerControl: 'Influence only',
  },
  {
    id: 'ca',
    name: 'Commission on Appointments',
    branch: 'Legislative',
    composition: 'Senate President + 12 Senators + 12 Representatives',
    head: 'Senate President (ex officio)',
    powers: 'Confirms or rejects Cabinet secretaries, ambassadors, and senior officers.',
    playerControl: 'None',
  },
  {
    id: 'sc',
    name: 'Kataas-taasang Hukuman',
    branch: 'Judiciary',
    composition: 'Chief Justice + 14 Associate Justices · serve until 70',
    head: 'Chief Justice',
    powers: 'Final say on the Constitution. Can strike down your laws and orders.',
    playerControl: 'Appoint from JBC shortlist only — cannot fire',
  },
  {
    id: 'jbc',
    name: 'Judicial and Bar Council',
    branch: 'Judiciary',
    composition: 'Chief Justice, Justice Secretary, Congress rep, bar, academe, retired justice, private sector',
    head: 'Chief Justice (ex officio)',
    powers: 'Screens judicial candidates; submits a shortlist of at least three.',
    playerControl: 'None',
  },
  {
    id: 'ombudsman',
    name: 'Tanggapan ng Ombudsman',
    branch: 'Independent',
    composition: 'Ombudsman + deputies · 7-year term',
    head: 'Ombudsman',
    powers: 'Investigates and prosecutes graft — including your own officials.',
    playerControl: 'None',
  },
  {
    id: 'comelec',
    name: 'Commission on Elections',
    branch: 'Independent',
    composition: 'Chair + 6 Commissioners · 7-year term',
    head: 'COMELEC Chair',
    powers: 'Runs every election and rules on disqualification cases.',
    playerControl: 'Appoint when vacant — cannot direct',
  },
  {
    id: 'coa',
    name: 'Commission on Audit',
    branch: 'Independent',
    composition: 'Chair + 2 Commissioners · 7-year term',
    head: 'COA Chair',
    powers: 'Audits every peso the government spends.',
    playerControl: 'Appoint when vacant — cannot direct',
  },
  {
    id: 'csc',
    name: 'Civil Service Commission',
    branch: 'Independent',
    composition: 'Chair + 2 Commissioners · 7-year term',
    head: 'CSC Chair',
    powers: 'Governs the bureaucracy: hiring, merit, discipline.',
    playerControl: 'Appoint when vacant — cannot direct',
  },
];
