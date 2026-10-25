const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** Month index 0 = July 2027 (inauguration). Chapter 1 spans months 0–35 (to June 2030). */
export const CHAPTER_1_LAST_MONTH = 35;
/** Last month index of each chapter. Chapter 2 ends with the end of the term, June 2033. */
export const CHAPTER_LAST_MONTH: Record<number, number> = { 1: 35, 2: 71 };

export function monthDate(m: number): { month: number; year: number } {
  const abs = 6 + m; // July = index 6
  return { month: abs % 12, year: 2027 + Math.floor(abs / 12) };
}

export function monthLabel(m: number): string {
  if (m < 0) return 'Transition · May–June 2027';
  const { month, year } = monthDate(m);
  return `${MONTHS[month]} ${year}`;
}

/** Fiscal year (calendar year, as in the Philippines) for a month index. */
export const fiscalYear = (m: number) => monthDate(m).year;
