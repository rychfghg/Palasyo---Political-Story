export type Faction = 'technocrat' | 'loyalist' | 'party' | 'activist' | 'military' | 'business' | 'clan' | 'vice-president';

export interface NomineeDemand {
  text: string;
  /** One-time cost charged to the treasury on appointment (₱B). */
  cost?: number;
  /** Change to presidential approval on appointment (percentage points). */
  approval?: number;
}

export interface Nominee {
  id: string;
  name: string;
  background: string;
  faction: Faction;
  partyId: string | null;
  competence: number; // 1–10
  loyalty: number; // 1–10
  integrity: number; // 1–10
  /** How the Commission on Appointments tends to see this person: −3 hostile … +3 friendly. */
  caAppeal: number;
  note: string;
  demand?: NomineeDemand;
}

export interface CabinetPost {
  id: string;
  title: string;
  department: string; // links to BUDGET_LINES id
  requiresConfirmation: boolean;
  description: string;
  nominees: Nominee[];
}

/** Posts that advise the President personally and react to every decision. */
export const ADVISER_POSTS = ['adviserEconomy', 'adviserPolitical', 'adviserSecurity', 'adviserLegal', 'spokesperson'] as const;

/** Special nominee id: the Vice President may be appointed to the Cabinet without confirmation. */
export const VP_NOMINEE_ID = 'vice-president';

export const CABINET_POSTS: CabinetPost[] = [
  {
    id: 'executive',
    title: 'Executive Secretary',
    department: 'officeOfPresident',
    requiresConfirmation: false,
    description: 'The “Little President.” Runs the Palasyo, controls your calendar, and signs orders by your authority.',
    nominees: [
      { id: 'es-dizon', name: 'Atty. Ramil Dizon', background: 'Your campaign manager and friend of twenty years', faction: 'loyalist', partyId: null, competence: 6, loyalty: 10, integrity: 6, caAppeal: 0, note: 'Knows your secrets. Knows everyone’s secrets.' },
      { id: 'es-yulo', name: 'Dr. Amparo Yulo', background: 'Former dean of public administration, Unibersidad ng Kapuluan', faction: 'technocrat', partyId: null, competence: 9, loyalty: 6, integrity: 9, caAppeal: 0, note: 'Brilliant and procedural. Will tell you “no.”' },
      { id: 'es-macaraeg', name: 'Rep. Bong Macaraeg', background: 'Five-term congressman, master dealmaker', faction: 'party', partyId: 'pbn', competence: 7, loyalty: 5, integrity: 4, caAppeal: 0, note: 'Brings forty House votes with him — and his own agenda.' },
    ],
  },
  {
    id: 'finance',
    title: 'Secretary of Finance',
    department: 'finance',
    requiresConfirmation: true,
    description: 'Collects taxes, manages the debt, faces the credit-rating agencies. The economic team captain.',
    nominees: [
      { id: 'fin-lacson', name: 'Estela Lacson-Ong', background: 'Former deputy governor of the Bangko Sentral ng Kapuluan', faction: 'technocrat', partyId: null, competence: 10, loyalty: 5, integrity: 9, caAppeal: 2, note: 'Markets love her. She will fight every unfunded promise.' },
      { id: 'fin-ventura', name: 'Carlo Ventura', background: 'Investment banker, top campaign donor', faction: 'business', partyId: null, competence: 7, loyalty: 7, integrity: 5, caAppeal: 1, note: 'Friendly to conglomerates.', demand: { text: 'Wants a ₱0 promise: no new taxes on the property sector.' } },
      { id: 'fin-abad', name: 'Rep. Nilo Abad', background: 'Chair of the House Ways & Means Committee', faction: 'party', partyId: 'pbl', competence: 6, loyalty: 5, integrity: 5, caAppeal: 2, note: 'Understands tax bills — and which ones never pass.' },
    ],
  },
  {
    id: 'budget',
    title: 'Secretary of Budget & Management',
    department: 'budgetMgmt',
    requiresConfirmation: true,
    description: 'Writes the National Expenditure Program and decides which funds are actually released.',
    nominees: [
      { id: 'dbm-soriano', name: 'Liza Soriano', background: 'Career budget officer, 28 years in the department', faction: 'technocrat', partyId: null, competence: 9, loyalty: 6, integrity: 8, caAppeal: 1, note: 'Knows where every hidden fund in the budget is buried.' },
      { id: 'dbm-reyes', name: 'Jojo Reyes', background: 'Your provincial budget officer', faction: 'loyalist', partyId: null, competence: 6, loyalty: 9, integrity: 7, caAppeal: -1, note: 'Loyal, green, and new to Maynilad’s games.' },
      { id: 'dbm-villareal', name: 'Mikaela Villareal', background: 'Daughter of Senator Crisanto Villareal', faction: 'clan', partyId: 'pbl', competence: 7, loyalty: 4, integrity: 5, caAppeal: 3, note: 'A gift to the Senate’s old guard.', demand: { text: 'Her father expects ₱15B in “priority projects” for his province.', cost: 15 } },
    ],
  },
  {
    id: 'foreign',
    title: 'Secretary of Foreign Affairs',
    department: 'foreignAffairs',
    requiresConfirmation: true,
    description: 'The West Sea dispute, 10 million overseas workers, and two superpowers courting you.',
    nominees: [
      { id: 'dfa-lozano', name: 'Amb. Teodora Lozano', background: 'Career diplomat, former UN ambassador', faction: 'technocrat', partyId: null, competence: 9, loyalty: 6, integrity: 8, caAppeal: 2, note: 'Firm on the West Sea. Trusted abroad.' },
      { id: 'dfa-chua', name: 'Victor Chua', background: 'Tycoon with deep trade ties to the northern superpower', faction: 'business', partyId: null, competence: 6, loyalty: 7, integrity: 4, caAppeal: -1, note: 'Can unlock billions in loans. At what price?' },
      { id: VP_NOMINEE_ID, name: 'The Vice President', background: 'Elected nationwide on their own mandate', faction: 'vice-president', partyId: null, competence: 6, loyalty: 5, integrity: 6, caAppeal: 0, note: 'The Vice President needs no confirmation. Keeps them close — or gives them a stage.' },
    ],
  },
  {
    id: 'defense',
    title: 'Secretary of National Defense',
    department: 'defense',
    requiresConfirmation: true,
    description: 'Commands the civilian side of the Armed Forces. Coups in this country start with a disgruntled defense establishment.',
    nominees: [
      { id: 'dnd-sarmiento', name: 'Gen. (Ret.) Abelardo Sarmiento', background: 'Former Chief of Staff of the Armed Forces', faction: 'military', partyId: null, competence: 8, loyalty: 6, integrity: 7, caAppeal: 2, note: 'The generals trust him. That cuts both ways.' },
      { id: 'dnd-galvez', name: 'Sen. Ricardo “Dick” Galvez', background: 'Ex-Marine colonel turned senator', faction: 'party', partyId: 'pbn', competence: 6, loyalty: 5, integrity: 6, caAppeal: 3, note: 'Senate ally. Hawkish.', demand: { text: 'Demands a ₱20B advance for jet-fighter acquisition.', cost: 20 } },
      { id: 'dnd-magsino', name: 'Prof. Helen Magsino', background: 'Security scholar, first civilian woman nominated', faction: 'technocrat', partyId: null, competence: 8, loyalty: 7, integrity: 9, caAppeal: -2, note: 'Reformer. The brass are uneasy.' },
    ],
  },
  {
    id: 'interior',
    title: 'Secretary of the Interior & Local Government',
    department: 'interior',
    requiresConfirmation: true,
    description: 'Controls the National Police and your relationship with 1,700 mayors and governors.',
    nominees: [
      { id: 'dilg-aragon', name: 'Gov. Rodel Aragon', background: 'Three-term governor, nephew of PBN chief Leon Aragon', faction: 'clan', partyId: 'pbn', competence: 6, loyalty: 5, integrity: 4, caAppeal: 2, note: 'The governors will follow him.' },
      { id: 'dilg-bautista', name: 'Mayor Joy Bautista', background: 'Reformist mayor who cut crime by half', faction: 'party', partyId: 'lda', competence: 8, loyalty: 7, integrity: 8, caAppeal: 0, note: 'Popular, clean, ambitious.' },
      { id: 'dilg-dela-cruz', name: 'P/Gen. (Ret.) Oscar Dela Cruz', background: 'Former National Police chief under Dela Paz', faction: 'military', partyId: null, competence: 7, loyalty: 6, integrity: 3, caAppeal: 1, note: 'Tied to the old drug-war abuses.', demand: { text: 'Human-rights groups will protest.', approval: -3 } },
    ],
  },
  {
    id: 'justice',
    title: 'Secretary of Justice',
    department: 'justice',
    requiresConfirmation: true,
    description: 'Prosecutes crimes, sits on the Judicial and Bar Council, and decides whom the state charges.',
    nominees: [
      { id: 'doj-panganiban', name: 'Atty. Remedios Panganiban', background: 'Human-rights lawyer, former bar president', faction: 'activist', partyId: null, competence: 8, loyalty: 6, integrity: 10, caAppeal: -1, note: 'Will prosecute anyone — including your allies.' },
      { id: 'doj-salonga', name: 'Atty. Gerardo Salonga', background: 'Your law school classmate and litigator', faction: 'loyalist', partyId: null, competence: 7, loyalty: 9, integrity: 6, caAppeal: 0, note: 'Will protect you. Critics will call him your lawyer.' },
      { id: 'doj-ferrer', name: 'Justice (Ret.) Amado Ferrer', background: 'Retired Court of Appeals justice', faction: 'technocrat', partyId: null, competence: 8, loyalty: 5, integrity: 8, caAppeal: 2, note: 'Respected, cautious, slow.' },
    ],
  },
  {
    id: 'education',
    title: 'Secretary of Education',
    department: 'education',
    requiresConfirmation: true,
    description: 'Runs the largest department: 27 million students, 900,000 teachers, and a classroom shortage of 160,000.',
    nominees: [
      { id: 'deped-santiago', name: 'Dr. Corazon Santiago', background: 'Former public-school teacher and education researcher', faction: 'technocrat', partyId: null, competence: 9, loyalty: 6, integrity: 9, caAppeal: 1, note: 'Teachers’ unions adore her.' },
      { id: 'deped-lim', name: 'Sen. Arturo Lim', background: 'Chair of the Senate Basic Education Committee', faction: 'party', partyId: 'lda', competence: 6, loyalty: 6, integrity: 6, caAppeal: 3, note: 'Would open a Senate seat for an ally of yours.' },
      { id: VP_NOMINEE_ID, name: 'The Vice President', background: 'Elected nationwide on their own mandate', faction: 'vice-president', partyId: null, competence: 5, loyalty: 5, integrity: 6, caAppeal: 0, note: 'A big department and a big platform for a would-be successor.' },
    ],
  },
  {
    id: 'health',
    title: 'Secretary of Health',
    department: 'health',
    requiresConfirmation: true,
    description: 'Hospitals, vaccines, dengue season, and a national health insurer ₱38B in arrears.',
    nominees: [
      { id: 'doh-herrera', name: 'Dr. Rosario Herrera', background: 'Epidemiologist who led the pandemic response in Sugbu', faction: 'technocrat', partyId: null, competence: 9, loyalty: 6, integrity: 9, caAppeal: 1, note: 'Blunt. Will correct you in public.' },
      { id: 'doh-uy', name: 'Dr. Manny Uy', background: 'Owner of a hospital chain', faction: 'business', partyId: null, competence: 7, loyalty: 7, integrity: 5, caAppeal: 1, note: 'Knows the system — and profits from it.' },
      { id: 'doh-ocampo', name: 'Rep. Tess Ocampo', background: 'Doctor, party-list representative for health workers', faction: 'activist', partyId: 'kmb', competence: 7, loyalty: 6, integrity: 8, caAppeal: -2, note: 'Nurses would march for her.' },
    ],
  },
  {
    id: 'publicWorks',
    title: 'Secretary of Public Works & Highways',
    department: 'publicWorks',
    requiresConfirmation: true,
    description: '₱900B a year in roads, bridges, and flood control. Every congressman wants a project; every contractor wants a cut.',
    nominees: [
      { id: 'dpwh-bonifacio', name: 'Engr. Rafael Bonifacio', background: 'Career civil engineer, 30 years in the department', faction: 'technocrat', partyId: null, competence: 8, loyalty: 6, integrity: 8, caAppeal: 0, note: 'Will expose ghost projects. Congressmen won’t like it.' },
      { id: 'dpwh-olivarez', name: 'Benjie Olivarez Jr.', background: 'Construction magnate, son of Governor Olivarez', faction: 'clan', partyId: 'pbl', competence: 6, loyalty: 6, integrity: 2, caAppeal: 2, note: 'The Olivarez machine delivered votes. This is the invoice.', demand: { text: 'Fast-tracks ₱25B in flood-control contracts to “friendly” firms.', cost: 25, approval: -2 } },
      { id: 'dpwh-rosales', name: 'Arch. Celine Rosales', background: 'Urban planner behind Sugbu’s bus rapid transit', faction: 'technocrat', partyId: null, competence: 8, loyalty: 7, integrity: 8, caAppeal: -1, note: 'Visionary but untested at this scale.' },
    ],
  },
  {
    id: 'agriculture',
    title: 'Secretary of Agriculture',
    department: 'agriculture',
    requiresConfirmation: true,
    description: 'Rice prices are up 18%. Farmers are poor, smugglers are rich.',
    nominees: [
      { id: 'da-manalo', name: 'Dr. Felipe Manalo', background: 'Agronomist, former rice research institute director', faction: 'technocrat', partyId: null, competence: 9, loyalty: 6, integrity: 8, caAppeal: 1, note: 'Long-term fixes; no quick price drops.' },
      { id: 'da-tan', name: 'Rolando Tan', background: 'Rice importer and trader', faction: 'business', partyId: null, competence: 7, loyalty: 6, integrity: 3, caAppeal: 0, note: 'Can flood the market with cheap imports. Farmers will riot.' },
      { id: 'da-lumbera', name: 'Ka Nestor Lumbera', background: 'Peasant federation leader', faction: 'activist', partyId: 'kmb', competence: 6, loyalty: 6, integrity: 9, caAppeal: -3, note: 'Wants land reform now. The Commission on Appointments will balk.', demand: { text: 'Immediate ₱10B fuel and fertilizer aid to farmers.', cost: 10, approval: 2 } },
    ],
  },
  {
    id: 'socialWelfare',
    title: 'Secretary of Social Welfare',
    department: 'socialWelfare',
    requiresConfirmation: true,
    description: 'Cash transfers for 4.4 million families and the first responder for every disaster.',
    nominees: [
      { id: 'dswd-gomez', name: 'Sister Mercy Gomez', background: 'Nun who ran relief operations after Typhoon Amihan', faction: 'activist', partyId: null, competence: 8, loyalty: 6, integrity: 10, caAppeal: 1, note: 'Nobody in the Senate dares vote against her.' },
      { id: VP_NOMINEE_ID, name: 'The Vice President', background: 'Elected nationwide on their own mandate', faction: 'vice-president', partyId: null, competence: 6, loyalty: 5, integrity: 6, caAppeal: 0, note: 'Handing out aid builds a national following.' },
      { id: 'dswd-ramos', name: 'Mayor Lito Ramos', background: 'Your campaign’s regional coordinator in Visara', faction: 'loyalist', partyId: null, competence: 6, loyalty: 9, integrity: 6, caAppeal: 0, note: 'Will make sure aid arrives with your name on it.' },
    ],
  },
  {
    id: 'transportation',
    title: 'Secretary of Transportation',
    department: 'transportation',
    requiresConfirmation: true,
    description: 'The subway is late, the airport is full, and the jeepney modernization protests never end.',
    nominees: [
      { id: 'dotr-sy', name: 'Engr. Patricia Sy', background: 'Former rail-operator CEO', faction: 'technocrat', partyId: null, competence: 8, loyalty: 6, integrity: 8, caAppeal: 1, note: 'Can finish the subway if funded.' },
      { id: 'dotr-cabral', name: 'Rep. Danilo Cabral', background: 'Transport committee chair', faction: 'party', partyId: 'pfk', competence: 6, loyalty: 6, integrity: 5, caAppeal: 2, note: 'Wants a southern railway first.', demand: { text: '₱12B feasibility and right-of-way for the Mindara Railway.', cost: 12 } },
      { id: 'dotr-mendoza', name: 'Ka Elmer Mendoza', background: 'Jeepney drivers’ union president', faction: 'activist', partyId: 'kmb', competence: 5, loyalty: 7, integrity: 8, caAppeal: -2, note: 'Would halt the phase-out of old jeepneys.' },
    ],
  },
  {
    id: 'trade',
    title: 'Secretary of Trade & Industry',
    department: 'trade',
    requiresConfirmation: true,
    description: 'Investment, exports, and 1 million small businesses.',
    nominees: [
      { id: 'dti-go', name: 'Andrea Go', background: 'Founder of a successful electronics exporter', faction: 'business', partyId: null, competence: 8, loyalty: 6, integrity: 7, caAppeal: 2, note: 'Investors will return her calls.' },
      { id: 'dti-francisco', name: 'Dr. Ben Francisco', background: 'Development economist', faction: 'technocrat', partyId: null, competence: 8, loyalty: 6, integrity: 8, caAppeal: 1, note: 'Pushes industrial policy over tax breaks.' },
      { id: 'dti-montelibano', name: 'Luis Montelibano', background: 'Heir to a sugar-and-telecom conglomerate', faction: 'clan', partyId: 'pbn', competence: 6, loyalty: 5, integrity: 4, caAppeal: 3, note: 'His family funds half the Senate.' },
    ],
  },
  {
    id: 'energy',
    title: 'Secretary of Energy',
    department: 'energy',
    requiresConfirmation: true,
    description: 'Rolling brownouts every summer and the highest power rates in the region.',
    nominees: [
      { id: 'doe-alonzo', name: 'Engr. Victor Alonzo', background: 'Grid operator executive', faction: 'technocrat', partyId: null, competence: 8, loyalty: 6, integrity: 7, caAppeal: 1, note: 'Pragmatic: gas now, renewables later.' },
      { id: 'doe-kalaw', name: 'Dr. Mara Kalaw', background: 'Climate scientist and renewable-energy advocate', faction: 'activist', partyId: null, competence: 8, loyalty: 6, integrity: 9, caAppeal: -1, note: 'Would ban new coal plants.' },
      { id: 'doe-ramos-dy', name: 'Enrique Ramos-Dy', background: 'Coal and power-plant tycoon', faction: 'business', partyId: null, competence: 7, loyalty: 6, integrity: 3, caAppeal: 2, note: 'Promises no brownouts. Conflict of interest obvious.' },
    ],
  },
  {
    id: 'labor',
    title: 'Secretary of Labor & Employment',
    department: 'labor',
    requiresConfirmation: true,
    description: 'Minimum wages, contractualization, and 10 million workers overseas.',
    nominees: [
      { id: 'dole-bernardo', name: 'Atty. Susan Bernardo', background: 'Labor arbiter and mediator', faction: 'technocrat', partyId: null, competence: 8, loyalty: 6, integrity: 8, caAppeal: 1, note: 'Trusted by unions and employers alike.' },
      { id: 'dole-ka-luis', name: 'Ka Luis Jalandoni', background: 'Trade-union federation chair', faction: 'activist', partyId: 'kmb', competence: 6, loyalty: 6, integrity: 9, caAppeal: -2, note: 'Would end contractual labor overnight.' },
      { id: 'dole-pacheco', name: 'Rep. Grace Pacheco', background: 'OFW Pamilya party-list representative', faction: 'party', partyId: null, competence: 7, loyalty: 7, integrity: 7, caAppeal: 1, note: 'The voice of overseas workers.' },
    ],
  },
  {
    id: 'environment',
    title: 'Secretary of Environment & Natural Resources',
    department: 'environment',
    requiresConfirmation: true,
    description: 'Mining permits, illegal logging, and the country that sits in the path of every super typhoon.',
    nominees: [
      { id: 'denr-paredes', name: 'Atty. Gina Paredes', background: 'Environmental lawyer who shut down illegal mines', faction: 'activist', partyId: null, competence: 8, loyalty: 6, integrity: 10, caAppeal: -3, note: 'Mining lobby will fight her confirmation hard.' },
      { id: 'denr-dimaculangan', name: 'Gen. (Ret.) Roy Dimaculangan', background: 'Former Armed Forces chief', faction: 'military', partyId: null, competence: 6, loyalty: 8, integrity: 6, caAppeal: 2, note: 'Enforcement over science.' },
      { id: 'denr-sison', name: 'Dr. Paolo Sison', background: 'Forestry scientist', faction: 'technocrat', partyId: null, competence: 8, loyalty: 6, integrity: 8, caAppeal: 1, note: 'Quiet competence.' },
    ],
  },
  // ═════════════ PRESIDENTIAL ADVISERS (no confirmation needed) ═════════════
  {
    id: 'adviserEconomy',
    title: 'Presidential Adviser on the Economy',
    department: 'officeOfPresident',
    requiresConfirmation: false,
    description: 'Your personal economist. Watches growth, prices, the peso, and the debt — and tells you when a decision will cost the country.',
    nominees: [
      { id: 'pae-villarama', name: 'Dr. Leonora Villarama', background: 'Former chief economist of a regional development bank', faction: 'technocrat', partyId: null, competence: 9, loyalty: 6, integrity: 9, caAppeal: 0, note: 'Blunt about deficits. Markets listen to her.' },
      { id: 'pae-dantes', name: 'Ramil Dantes', background: 'Your campaign’s economic spokesman', faction: 'loyalist', partyId: null, competence: 6, loyalty: 9, integrity: 7, caAppeal: 0, note: 'Will find the good news in any number.' },
      { id: 'pae-laotiangco', name: 'Victor Lao-Tiangco', background: 'Retail and property tycoon', faction: 'business', partyId: null, competence: 8, loyalty: 6, integrity: 5, caAppeal: 0, note: 'Thinks like a businessman. Especially about his own businesses.' },
    ],
  },
  {
    id: 'adviserPolitical',
    title: 'Presidential Adviser on Political Affairs',
    department: 'officeOfPresident',
    requiresConfirmation: false,
    description: 'Counts the votes in Congress, manages the parties, and warns you before a decision costs you allies.',
    nominees: [
      { id: 'papa-soliman', name: 'Rep. Tomas Soliman', background: 'Former Majority Floor Leader', faction: 'party', partyId: null, competence: 8, loyalty: 6, integrity: 5, caAppeal: 0, note: 'Knows every congressman’s price.' },
      { id: 'papa-reyes', name: 'Carmina Reyes', background: 'Your campaign manager in the provinces', faction: 'loyalist', partyId: null, competence: 7, loyalty: 9, integrity: 7, caAppeal: 0, note: 'Reads the barangays better than the polls do.' },
      { id: 'papa-abueva', name: 'Prof. Danilo Abueva', background: 'Political scientist and TV analyst', faction: 'technocrat', partyId: null, competence: 8, loyalty: 5, integrity: 8, caAppeal: 0, note: 'Sees the long game. Can be too honest.' },
    ],
  },
  {
    id: 'adviserSecurity',
    title: 'National Security Adviser',
    department: 'officeOfPresident',
    requiresConfirmation: false,
    description: 'The West Sea, insurgents, terror threats, and the loyalty of the armed forces.',
    nominees: [
      { id: 'nsa-ybanez', name: 'Gen. (Ret.) Rodolfo Ybañez', background: 'Former Armed Forces chief of staff', faction: 'military', partyId: null, competence: 8, loyalty: 6, integrity: 7, caAppeal: 0, note: 'The generals trust him — and report to him.' },
      { id: 'nsa-velasco', name: 'Amb. Corazon Velasco', background: 'Career diplomat, West Sea negotiator', faction: 'technocrat', partyId: null, competence: 9, loyalty: 6, integrity: 9, caAppeal: 0, note: 'Prefers treaties to warships.' },
      { id: 'nsa-dagohoy', name: 'Col. (Ret.) Rafael Dagohoy', background: 'Your former security chief', faction: 'loyalist', partyId: null, competence: 6, loyalty: 10, integrity: 7, caAppeal: 0, note: 'Loyal to you first, the institution second.' },
    ],
  },
  {
    id: 'adviserLegal',
    title: 'Chief Presidential Legal Counsel',
    department: 'officeOfPresident',
    requiresConfirmation: false,
    description: 'Tells you what is legal, what will survive the Supreme Court, and what could get you impeached.',
    nominees: [
      { id: 'cplc-arevalo', name: 'Atty. Consuelo Arevalo', background: 'Constitutional law professor', faction: 'technocrat', partyId: null, competence: 9, loyalty: 5, integrity: 10, caAppeal: 0, note: 'Will tell you “unconstitutional” to your face.' },
      { id: 'cplc-pineda', name: 'Atty. Salvador Pineda', background: 'Your personal lawyer for twenty years', faction: 'loyalist', partyId: null, competence: 7, loyalty: 10, integrity: 5, caAppeal: 0, note: 'Will find a legal way. Or a way that sounds legal.' },
      { id: 'cplc-lim', name: 'Justice (Ret.) Antonio Lim', background: 'Retired Court of Appeals justice', faction: 'technocrat', partyId: null, competence: 8, loyalty: 6, integrity: 8, caAppeal: 0, note: 'Knows how the justices think.' },
    ],
  },
  {
    id: 'spokesperson',
    title: 'Presidential Spokesperson',
    department: 'officeOfPresident',
    requiresConfirmation: false,
    description: 'Your voice to the press. Has to defend every decision — the good and the bad — on live television.',
    nominees: [
      { id: 'pcoo-bernal', name: 'Kaye Bernal', background: 'Former evening-news anchor', faction: 'technocrat', partyId: null, competence: 8, loyalty: 6, integrity: 8, caAppeal: 0, note: 'The public trusts her face.' },
      { id: 'pcoo-quimpo', name: 'Atty. Harold Quimpo', background: 'Combative trial lawyer and talk-show guest', faction: 'loyalist', partyId: null, competence: 6, loyalty: 9, integrity: 5, caAppeal: 0, note: 'Picks fights with reporters. Your base loves it.' },
      { id: 'pcoo-alvarez', name: 'Mica Alvarez', background: 'Social-media strategist of your campaign', faction: 'loyalist', partyId: null, competence: 7, loyalty: 8, integrity: 6, caAppeal: 0, note: 'Runs the online army. Knows what trends.' },
    ],
  },
];

/** Resolve a nominee on a post, filling in the Vice President’s real name. */
export function resolveNominee(post: CabinetPost, nomineeId: string | null, vpName: string): Nominee | undefined {
  const n = post.nominees.find((x) => x.id === nomineeId);
  if (!n) return undefined;
  return n.id === VP_NOMINEE_ID ? { ...n, name: `VP ${vpName}` } : n;
}
