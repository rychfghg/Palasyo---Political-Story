/** The 20th Congress of the Republika ng Kapuluan, convened July 2027. */

export const HOUSE_DISTRICT_SEATS = 253;
export const HOUSE_PARTY_LIST_SEATS = 63; // 20% of the House, as in the constitutional model

/** District seats won by each party in the May 2027 election (before post-election party-switching). */
export const DISTRICT_RESULTS: Record<string, number> = {
  pbl: 108,
  lda: 44,
  kmb: 8,
  pbn: 52,
  pfk: 26,
  independent: 15,
};

/**
 * Coalition logic: which parties naturally join each president's majority.
 * Parties not listed (and not the president's own) form the opposition.
 */
export const NATURAL_ALLIES: Record<string, string[]> = {
  pbl: ['pbn', 'pfk'],
  lda: ['pbn', 'pfk'],
  kmb: ['lda', 'pfk'],
  pbn: ['pbl', 'pfk'],
  pfk: ['pbn', 'lda'],
};

/** Share of an opposition party’s district reps who switch to the president’s party (“balimbing”). */
export const DEFECTION_RATE: Record<string, number> = {
  pbl: 0.35,
  lda: 0.15,
  kmb: 0,
  pbn: 0.35,
  pfk: 0.3,
};

export type PartyListLean = 'administration' | 'left' | 'independent';

export interface PartyListGroup {
  name: string;
  sector: string;
  seats: number; // max 3 under the constitutional model
  lean: PartyListLean;
}

export const PARTY_LIST_GROUPS: PartyListGroup[] = [
  { name: 'Anak ng Dagat', sector: 'Fisherfolk', seats: 3, lean: 'administration' },
  { name: 'Bantay Magsasaka', sector: 'Farmers', seats: 3, lean: 'administration' },
  { name: 'OFW Pamilya', sector: 'Overseas workers', seats: 3, lean: 'administration' },
  { name: 'Guro Muna', sector: 'Teachers', seats: 3, lean: 'administration' },
  { name: 'Lolo’t Lola', sector: 'Senior citizens', seats: 3, lean: 'administration' },
  { name: 'Tsuper Alyansa', sector: 'Transport workers', seats: 3, lean: 'administration' },
  { name: 'Kababaihan Una', sector: 'Women', seats: 3, lean: 'administration' },
  { name: 'Negosyanteng Kapuluan', sector: 'Small business', seats: 3, lean: 'administration' },
  { name: 'Bantay Kalusugan', sector: 'Health workers', seats: 3, lean: 'administration' },
  { name: 'Kawal Reporma', sector: 'Veterans', seats: 3, lean: 'administration' },
  { name: 'Bayan Builders', sector: 'Construction', seats: 3, lean: 'administration' },
  { name: 'Barangay Tanod', sector: 'Village watchmen', seats: 3, lean: 'administration' },
  { name: 'Tindeg Mindara', sector: 'Southern farmers', seats: 3, lean: 'administration' },
  { name: 'Rider Party', sector: 'Motorcycle riders', seats: 3, lean: 'administration' },
  { name: 'Kabataan Ngayon', sector: 'Youth', seats: 3, lean: 'left' },
  { name: 'Maralita Kilos', sector: 'Urban poor', seats: 3, lean: 'left' },
  { name: 'Kasambahay Ko', sector: 'Domestic workers', seats: 3, lean: 'left' },
  { name: 'Sagip Kalikasan', sector: 'Environment', seats: 3, lean: 'independent' },
  { name: 'Kristiyanong Bayan', sector: 'Religious', seats: 3, lean: 'independent' },
  { name: 'Katutubong Tinig', sector: 'Indigenous peoples', seats: 3, lean: 'independent' },
  { name: 'Lingkod Kuryente', sector: 'Electric cooperatives', seats: 1, lean: 'administration' },
  { name: 'Bida Pinoy', sector: 'Entertainment workers', seats: 1, lean: 'administration' },
  { name: 'Mangingisda Visara', sector: 'Visara fisherfolk', seats: 1, lean: 'administration' },
];

export interface KeyRepresentative {
  name: string;
  district: string;
  partyId: string;
}

/** Notable representatives per party, used to fill leadership posts depending on who is president. */
export const KEY_REPRESENTATIVES: KeyRepresentative[] = [
  { name: 'Rep. Arnulfo “Arnie” Macaraeg', district: 'Kapatagan, 1st District', partyId: 'pbl' },
  { name: 'Rep. Dolores Villaflor', district: 'Bikolandia, 2nd District', partyId: 'pbl' },
  { name: 'Rep. Ernesto Lagunzad-Cruz', district: 'Maynilad, 5th District', partyId: 'pbl' },
  { name: 'Rep. Celeste Buenaflor', district: 'Maynilad, 3rd District', partyId: 'lda' },
  { name: 'Rep. Tomas Abueva', district: 'Iloilanan, Lone District', partyId: 'lda' },
  { name: 'Rep. Kristine Ledesma', district: 'Sugbu, 2nd District', partyId: 'lda' },
  { name: 'Rep. Teodoro “Ka Teddy” Lumbera', district: 'Gitnang Kapatagan, 4th District', partyId: 'kmb' },
  { name: 'Rep. Liza Masangkay', district: 'Maynilad, 1st District', partyId: 'kmb' },
  { name: 'Rep. Jaime “Jimboy” Aragon', district: 'Hilagang Luzara, 1st District', partyId: 'pbn' },
  { name: 'Rep. Maricar Ilagan-Reyes', district: 'Hilagang Luzara, 3rd District', partyId: 'pbn' },
  { name: 'Rep. Manuel Quimpo', district: 'Kanlurang Visara, 2nd District', partyId: 'pbn' },
  { name: 'Rep. Abdul Karim Salikan', district: 'Bangsa Lanao, 1st District', partyId: 'pfk' },
  { name: 'Rep. Rosalinda Dureza', district: 'Davira City, 1st District', partyId: 'pfk' },
  { name: 'Rep. Hernani Gaerlan', district: 'Hilagang Mindara, 2nd District', partyId: 'pfk' },
];

export type Temperament = 'loyal' | 'independent' | 'maverick';

export interface Senator {
  id: string;
  name: string;
  partyId: string | null;
  termEnds: 2030 | 2033;
  influence: number; // 1–5
  temperament: Temperament;
  focus: string;
  bio: string;
}

/**
 * 24 Senators. Half were elected in 2024 (term to 2030), half in 2027 alongside you (term to 2033).
 * Temperament decides how closely they follow their party’s stance toward the President:
 *  loyal → follows the party; independent → only sides with you if they’re in your party; maverick → always their own person.
 */
export const SENATORS: Senator[] = [
  { id: 'villareal', name: 'Crisanto Villareal', partyId: 'pbl', termEnds: 2030, influence: 5, temperament: 'loyal', focus: 'Appropriations', bio: 'Four-decade Senate operator. Knows where every bill is buried.' },
  { id: 'galvez', name: 'Ricardo “Dick” Galvez', partyId: 'pbn', termEnds: 2033, influence: 4, temperament: 'loyal', focus: 'National Defense', bio: 'Ex-Marine colonel. Hawk on the West Sea.' },
  { id: 'salcedo', name: 'Aurora “Rora” Salcedo', partyId: 'lda', termEnds: 2030, influence: 5, temperament: 'independent', focus: 'Justice & Human Rights', bio: 'Lost the presidency to you. Remains the conscience — and the thorn — of the Senate.' },
  { id: 'lim', name: 'Arturo Lim', partyId: 'lda', termEnds: 2030, influence: 3, temperament: 'loyal', focus: 'Basic Education', bio: 'Former teacher, patient legislator.' },
  { id: 'santos-ochoa', name: 'Marites Santos-Ochoa', partyId: 'pbl', termEnds: 2033, influence: 3, temperament: 'loyal', focus: 'Local Government', bio: 'Former actress turned senator. Topped the 2027 race.' },
  { id: 'tolentino', name: 'Rodrigo “Digoy” Tolentino', partyId: 'pbl', termEnds: 2030, influence: 3, temperament: 'loyal', focus: 'Labor', bio: 'Son of a movie-star senator. Charming, facing an old plunder case.' },
  { id: 'montenegro', name: 'Ramon Montenegro', partyId: 'pbl', termEnds: 2033, influence: 4, temperament: 'independent', focus: 'Ways & Means', bio: 'Economist-senator. Votes the numbers, not the party.' },
  { id: 'cayabyab', name: 'Pilar Cayabyab', partyId: 'pbl', termEnds: 2030, influence: 3, temperament: 'loyal', focus: 'Energy', bio: 'Political dynasty from Maynilad’s south.' },
  { id: 'dela-paz-jr', name: 'Ramon “Jun-Jun” Dela Paz Jr.', partyId: 'pbl', termEnds: 2033, influence: 3, temperament: 'loyal', focus: 'Public Order', bio: 'Son of the outgoing president. Guards his father’s legacy.' },
  { id: 'bong-reyes', name: 'Bong Reyes', partyId: 'pbl', termEnds: 2033, influence: 2, temperament: 'loyal', focus: 'Sports & Youth', bio: 'Former boxing champion. Rarely speaks on the floor.' },
  { id: 'hernandez', name: 'Luningning Hernandez', partyId: 'lda', termEnds: 2033, influence: 3, temperament: 'independent', focus: 'Women & Health', bio: 'Relentless investigator of government contracts.' },
  { id: 'pangan', name: 'Efren Pangan', partyId: 'lda', termEnds: 2033, influence: 3, temperament: 'loyal', focus: 'Agriculture', bio: 'Farmer-advocate, soft-spoken, stubborn.' },
  { id: 'aquilino', name: 'Joaquin “Kino” Aquilino', partyId: 'lda', termEnds: 2030, influence: 2, temperament: 'loyal', focus: 'Trade & Entrepreneurship', bio: 'Young reformer with a startup background.' },
  { id: 'manalastas', name: 'Rogelio “Ka Oli” Manalastas', partyId: 'kmb', termEnds: 2033, influence: 2, temperament: 'loyal', focus: 'Labor & Wages', bio: 'Union organizer. First KMB senator in twenty years.' },
  { id: 'cortez', name: 'Amihan Cortez', partyId: 'kmb', termEnds: 2030, influence: 2, temperament: 'loyal', focus: 'Human Rights', bio: 'Human-rights lawyer, a sharp interpellator.' },
  { id: 'aragon', name: 'Leonora Aragon', partyId: 'pbn', termEnds: 2030, influence: 4, temperament: 'loyal', focus: 'Finance', bio: 'Sister of PBN chief Leon Aragon. Controls the north’s senators.' },
  { id: 'zamora', name: 'Emmanuel “Manny” Zamora', partyId: 'pbn', termEnds: 2033, influence: 4, temperament: 'independent', focus: 'Rules', bio: 'Former Senate President. Deal-maker who counts votes for a living.' },
  { id: 'villaruel', name: 'Consuelo Villaruel', partyId: 'pbn', termEnds: 2030, influence: 3, temperament: 'loyal', focus: 'Environment', bio: 'Real-estate dynasty. Environment chair, ironically.' },
  { id: 'dimalanta', name: 'Sultan Omar Dimalanta', partyId: 'pfk', termEnds: 2033, influence: 3, temperament: 'loyal', focus: 'Peace Process', bio: 'Royal lineage of Bangsa Lanao. Champion of autonomy.' },
  { id: 'dureza', name: 'Yasmin Datu-Dureza', partyId: 'pfk', termEnds: 2030, influence: 2, temperament: 'loyal', focus: 'Federalism', bio: 'Davira’s voice in the Senate.' },
  { id: 'tuazon', name: 'Ernesto “Kuya Erning” Tuazon', partyId: null, termEnds: 2033, influence: 3, temperament: 'maverick', focus: 'Public Services', bio: 'Broadcaster who shames officials on live TV. Topped the polls.' },
  { id: 'ponce', name: 'Marisol Ponce', partyId: null, termEnds: 2030, influence: 4, temperament: 'maverick', focus: 'Public Information', bio: 'Daughter of a film legend. Popular, cautious, beholden to no party.' },
  { id: 'lagdameo', name: 'Anselmo Lagdameo', partyId: null, termEnds: 2033, influence: 4, temperament: 'maverick', focus: 'Budget Oversight', bio: 'Ex-police chief turned budget hawk. Hunts pork-barrel insertions.' },
  { id: 'gonzaga', name: 'Ricardo Gonzaga', partyId: null, termEnds: 2030, influence: 3, temperament: 'maverick', focus: 'Blue Ribbon (Accountability)', bio: 'Chairs the investigations committee. Loves a televised hearing.' },
];
