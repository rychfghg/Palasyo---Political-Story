export interface Party {
  id: string;
  name: string;
  abbreviation: string;
  color: string;
  ideology: string;
  leader: string;
  description: string;
  houseSeats: number;
  senateSeats: number;
}

/** Composition of Congress entering the 2027 election. House = 316 seats, Senate = 24. */
export const PARTIES: Party[] = [
  {
    id: 'pbl',
    name: 'Partido Bagong Lakas',
    abbreviation: 'PBL',
    color: '#c8452f',
    ideology: 'Populist · Centre-right',
    leader: 'Pres. Ramon "Monching" Dela Paz',
    description:
      'The outgoing ruling party. Built on patronage, infrastructure ribbon-cuttings, and a promise of iron-fisted order. Rich, sprawling, and loyal only to whoever holds the Palasyo.',
    houseSeats: 142,
    senateSeats: 9,
  },
  {
    id: 'lda',
    name: 'Liberal-Demokratikong Alyansa',
    abbreviation: 'LDA',
    color: '#e0b43a',
    ideology: 'Liberal · Reformist',
    leader: 'Sen. Aurora "Rora" Salcedo',
    description:
      'Heirs of the democracy movement. Strong with the urban middle class, the Church, and the press — weak in the provinces and forever accused of elitism.',
    houseSeats: 58,
    senateSeats: 6,
  },
  {
    id: 'kmb',
    name: 'Kilusang Makabayan',
    abbreviation: 'KMB',
    color: '#b3262e',
    ideology: 'Left · Nationalist',
    leader: 'Rep. Teodoro "Ka Teddy" Lumbera',
    description:
      'A coalition of labor, farmer, and student movements born in the streets. Small in seats, loud in rallies, uncompromising on land reform and foreign bases.',
    houseSeats: 21,
    senateSeats: 2,
  },
  {
    id: 'pbn',
    name: 'Partido ng Bayang Nagkakaisa',
    abbreviation: 'PBN',
    color: '#2f5fa7',
    ideology: 'Conservative · Traditionalist',
    leader: 'Gov. Leonardo "Leon" Aragon',
    description:
      'The party of the provincial clans. Its governors deliver votes in blocs, and in return it asks only to be left alone — and funded.',
    houseSeats: 61,
    senateSeats: 5,
  },
  {
    id: 'pfk',
    name: 'Pederalistang Kapuluan',
    abbreviation: 'PFK',
    color: '#3f8f5b',
    ideology: 'Federalist · Regionalist',
    leader: 'Mayor Samira Datumanong',
    description:
      'A southern-rooted movement demanding that power and money leave Maynilad. Kingmakers in Mindara, outsiders everywhere else.',
    houseSeats: 34,
    senateSeats: 2,
  },
];

export const getParty = (id: string | null | undefined) => PARTIES.find((p) => p.id === id);
