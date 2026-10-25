export type Philosophy = 'Textualist' | 'Progressive' | 'Moderate' | 'Pragmatist';

export interface Justice {
  id: string;
  name: string;
  isChief: boolean;
  birthYear: number; // mandatory retirement at 70
  appointedBy: string;
  appointedYear: number;
  philosophy: Philosophy;
  background: string;
}

export const MANDATORY_RETIREMENT_AGE = 70;

/** Former presidents of the Republic, for the appointment record. */
export const FORMER_PRESIDENTS = {
  mercado: 'Pres. Rafael Mercado (2009–2015)',
  garrido: 'Pres. Lorenzo Garrido (2015–2021)',
  delaPaz: 'Pres. Ramon Dela Paz (2021–2027)',
};

/**
 * The Kataas-taasang Hukuman. Justices are not partisans: they rule on the law and their own philosophy,
 * owe nothing to the president who appointed them, and cannot be removed except by impeachment.
 */
export const SUPREME_COURT: Justice[] = [
  { id: 'arcilla', name: 'Teresita Arcilla-Navarro', isChief: true, birthYear: 1962, appointedBy: FORMER_PRESIDENTS.garrido, appointedYear: 2018, philosophy: 'Moderate', background: 'Former Court of Appeals presiding justice. Guards the Court’s independence above all.' },
  { id: 'benedicto', name: 'Antonio Benedicto', isChief: false, birthYear: 1958, appointedBy: FORMER_PRESIDENTS.mercado, appointedYear: 2013, philosophy: 'Textualist', background: 'Senior associate justice. The Constitution means what it says — nothing more.' },
  { id: 'villacorta', name: 'Alfredo Villacorta', isChief: false, birthYear: 1965, appointedBy: FORMER_PRESIDENTS.garrido, appointedYear: 2016, philosophy: 'Progressive', background: 'Former human-rights litigator. Frequent dissenter.' },
  { id: 'dumalagan', name: 'Mariano Dumalagan', isChief: false, birthYear: 1969, appointedBy: FORMER_PRESIDENTS.mercado, appointedYear: 2012, philosophy: 'Progressive', background: 'Former law dean. Writes long, fiery dissents on indigenous and labor rights.' },
  { id: 'estrellado', name: 'Ramon Estrellado', isChief: false, birthYear: 1966, appointedBy: FORMER_PRESIDENTS.garrido, appointedYear: 2019, philosophy: 'Moderate', background: 'Career judge from Visara. Consensus-builder.' },
  { id: 'saguisag', name: 'Amelia Saguisag-Tolosa', isChief: false, birthYear: 1964, appointedBy: FORMER_PRESIDENTS.garrido, appointedYear: 2019, philosophy: 'Pragmatist', background: 'Former Solicitor General’s office litigator. Deferential to the executive — within limits.' },
  { id: 'magbanua', name: 'Henri Magbanua', isChief: false, birthYear: 1959, appointedBy: FORMER_PRESIDENTS.garrido, appointedYear: 2019, philosophy: 'Textualist', background: 'Criminal-law specialist. Retires in 2029.' },
  { id: 'quiambao', name: 'Rodil Quiambao', isChief: false, birthYear: 1965, appointedBy: FORMER_PRESIDENTS.garrido, appointedYear: 2020, philosophy: 'Moderate', background: 'Commercial-law expert. Cautious on economic cases.' },
  { id: 'abalos', name: 'Mario Abalos-Ferrer', isChief: false, birthYear: 1958, appointedBy: FORMER_PRESIDENTS.garrido, appointedYear: 2020, philosophy: 'Pragmatist', background: 'Oldest member. Retires in 2028 — likely your first Supreme Court vacancy.' },
  { id: 'cabatingan', name: 'Samuel Cabatingan', isChief: false, birthYear: 1967, appointedBy: FORMER_PRESIDENTS.delaPaz, appointedYear: 2021, philosophy: 'Pragmatist', background: 'Former anti-graft court justice. Tough on corruption, whoever the accused.' },
  { id: 'soliven', name: 'Ricardo Soliven', isChief: false, birthYear: 1966, appointedBy: FORMER_PRESIDENTS.delaPaz, appointedYear: 2022, philosophy: 'Textualist', background: 'Quiet, methodical, unpredictable on political cases.' },
  { id: 'lucero', name: 'Josefina Lucero', isChief: false, birthYear: 1970, appointedBy: FORMER_PRESIDENTS.delaPaz, appointedYear: 2022, philosophy: 'Moderate', background: 'Former Mindara regional trial judge.' },
  { id: 'macabangon', name: 'Jamal Macabangon', isChief: false, birthYear: 1964, appointedBy: FORMER_PRESIDENTS.delaPaz, appointedYear: 2022, philosophy: 'Moderate', background: 'First justice from Bangsa Lanao. Expert in Shari’a law.' },
  { id: 'evangelista', name: 'Jose Evangelista', isChief: false, birthYear: 1966, appointedBy: FORMER_PRESIDENTS.delaPaz, appointedYear: 2022, philosophy: 'Pragmatist', background: 'Former court administrator. Knows the judiciary from the inside.' },
  { id: 'villegas', name: 'Antonio Villegas-Uy', isChief: false, birthYear: 1968, appointedBy: FORMER_PRESIDENTS.delaPaz, appointedYear: 2023, philosophy: 'Textualist', background: 'Former election commissioner. Youngest justice.' },
];

export const retirementYear = (j: Justice) => j.birthYear + MANDATORY_RETIREMENT_AGE;
