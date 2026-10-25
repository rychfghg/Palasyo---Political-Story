import type { Economy } from '@/features/game-engine/types/government';

/** Formats an amount given in billions of pesos: 850 → ₱850B, 17900 → ₱17.90T. */
export function peso(billions: number, digits = 1): string {
  const sign = billions < 0 ? '−' : '';
  const v = Math.abs(billions);
  if (v >= 1000) return `${sign}₱${(v / 1000).toFixed(2)}T`;
  return `${sign}₱${v.toFixed(v < 10 ? digits : 0)}B`;
}

export const debtToGdp = (e: Economy) => (e.debt / e.gdp) * 100;

export function creditRating(debtRatioPct: number): { rating: string; outlook: string } {
  if (debtRatioPct < 55) return { rating: 'BBB', outlook: 'Stable' };
  if (debtRatioPct < 62) return { rating: 'BBB', outlook: 'Negative' };
  if (debtRatioPct < 68) return { rating: 'BBB−', outlook: 'Negative' };
  if (debtRatioPct < 75) return { rating: 'BB+', outlook: 'Negative' };
  return { rating: 'BB', outlook: 'Negative' };
}

/** Minimum cash the Treasury keeps on hand; anything spent below this is borrowed. */
export const TREASURY_FLOOR = 50;

/**
 * Applies a spend to the economy. The Treasury pays what it can above its cash floor;
 * the rest is borrowed and added to the national debt.
 */
export function applySpend(e: Economy, amount: number): { economy: Economy; borrowed: number } {
  const available = Math.max(0, e.treasury - TREASURY_FLOOR);
  const borrowed = Math.max(0, amount - available);
  return {
    borrowed,
    economy: { ...e, treasury: e.treasury - (amount - borrowed), debt: e.debt + borrowed },
  };
}
