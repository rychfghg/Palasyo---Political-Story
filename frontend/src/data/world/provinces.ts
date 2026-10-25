/** Cities and provinces of the Kapuluan, with the numbers the tax bureau tracks. Monetary values in ₱B unless stated. */

export type Sector = 'tech' | 'manufacturing' | 'farming' | 'tourism' | 'infra' | 'energy';

export interface Province {
  id: string;
  name: string;
  kind: 'city' | 'province';
  regionId: string;
  /** Map position (1000×1000 archipelago map). */
  x: number;
  y: number;
  population: number; // millions
  /** Average annual income per person, ₱ thousands. */
  incomePerCapita: number;
  /** Taxes collected per year, ₱B. */
  taxBase: number;
  unemployment: number; // %
  /** How well each kind of investment fits here: 0.6 (poor fit) … 1.4 (ideal). */
  fit: Record<Sector, number>;
  note: string;
}

const f = (tech: number, manufacturing: number, farming: number, tourism: number, infra: number, energy: number): Record<Sector, number> => ({ tech, manufacturing, farming, tourism, infra, energy });

export const PROVINCES: Province[] = [
  { id: 'maynilad', name: 'Maynilad City', kind: 'city', regionId: 'kalakhang-maynilad', x: 412, y: 330, population: 14.2, incomePerCapita: 420, taxBase: 1650, unemployment: 5.8, fit: f(1.4, 0.9, 0.6, 0.9, 1.1, 0.8), note: 'The capital: finance, government, and the country’s biggest tech workforce.' },
  { id: 'sugbu', name: 'Sugbu City', kind: 'city', regionId: 'gitnang-visara', x: 505, y: 580, population: 3.1, incomePerCapita: 310, taxBase: 390, unemployment: 5.2, fit: f(1.2, 1.3, 0.7, 1.3, 1.0, 0.9), note: 'The second economy: ports, factories, call centers, and resorts.' },
  { id: 'davira_city', name: 'Davira City', kind: 'city', regionId: 'davira', x: 675, y: 790, population: 1.9, incomePerCapita: 250, taxBase: 180, unemployment: 6.1, fit: f(1.0, 1.1, 1.2, 1.0, 1.1, 1.1), note: 'The south’s commercial hub and gateway to the plantations.' },
  { id: 'kapatagan', name: 'Gitnang Kapatagan', kind: 'province', regionId: 'gitnang-kapatagan', x: 432, y: 245, population: 12.4, incomePerCapita: 190, taxBase: 310, unemployment: 6.4, fit: f(0.9, 1.3, 1.3, 0.7, 1.2, 1.1), note: 'The rice bowl, with industrial zones creeping outward.' },
  { id: 'sanfernando', name: 'San Fernando del Norte', kind: 'city', regionId: 'hilagang-luzara', x: 380, y: 140, population: 1.1, incomePerCapita: 170, taxBase: 42, unemployment: 6.9, fit: f(0.7, 0.8, 1.2, 1.1, 1.0, 1.3), note: 'Tobacco, garlic, and wind. Dynasty country.' },
  { id: 'legazpira', name: 'Legazpira', kind: 'city', regionId: 'bikolandia', x: 590, y: 435, population: 0.9, incomePerCapita: 140, taxBase: 26, unemployment: 7.4, fit: f(0.7, 0.8, 1.1, 1.4, 1.1, 1.3), note: 'Volcano views, typhoon season, geothermal power.' },
  { id: 'iloilanan', name: 'Iloilanan', kind: 'city', regionId: 'kanlurang-visara', x: 395, y: 545, population: 1.2, incomePerCapita: 200, taxBase: 58, unemployment: 6.0, fit: f(1.1, 1.0, 1.2, 1.1, 1.0, 0.9), note: 'Old sugar wealth and a growing IT sector.' },
  { id: 'tacloban', name: 'Tacloban Nuevo', kind: 'city', regionId: 'silangang-visara', x: 612, y: 505, population: 0.7, incomePerCapita: 110, taxBase: 14, unemployment: 8.9, fit: f(0.6, 0.8, 1.1, 1.0, 1.4, 1.1), note: 'The poorest region, first to be hit by every storm.' },
  { id: 'cagayan', name: 'Cagayan de Ilog', kind: 'city', regionId: 'hilagang-mindara', x: 560, y: 700, population: 1.0, incomePerCapita: 180, taxBase: 48, unemployment: 6.7, fit: f(0.9, 1.2, 1.2, 0.9, 1.1, 1.0), note: 'Gateway to the south, growing fast and unevenly.' },
  { id: 'marawira', name: 'Marawira', kind: 'city', regionId: 'bangsa-lanao', x: 525, y: 750, population: 0.4, incomePerCapita: 90, taxBase: 6, unemployment: 11.2, fit: f(0.6, 0.7, 1.2, 0.8, 1.4, 1.2), note: 'The autonomous region’s capital, still rebuilding.' },
  { id: 'palawira', name: 'Palawira', kind: 'province', regionId: 'kanlurang-visara', x: 300, y: 610, population: 1.2, incomePerCapita: 150, taxBase: 22, unemployment: 6.2, fit: f(0.6, 0.6, 1.0, 1.4, 0.9, 1.0), note: 'The last frontier: lagoons, reefs, and resorts.' },
  { id: 'kanlurang_luzara', name: 'Kanlurang Luzara Coast', kind: 'province', regionId: 'hilagang-luzara', x: 330, y: 260, population: 3.2, incomePerCapita: 160, taxBase: 55, unemployment: 7.1, fit: f(0.7, 1.0, 1.1, 1.1, 1.0, 1.4), note: 'Fishing towns and some of the best offshore wind in Asia.' },
];

export const SECTOR_LABEL: Record<Sector, string> = {
  tech: 'Technology hub',
  manufacturing: 'Economic zone',
  farming: 'Agri-modernization',
  tourism: 'Tourism development',
  infra: 'Infrastructure package',
  energy: 'Renewable power park',
};

/** Base economics of each state investment (before the province’s fit multiplier). */
/** Returns are about 7–11% of cost a year once built — like real public investments. `build` is months until it earns. */
export const SECTOR_ECONOMICS: Record<Sector, { cost: number; jobs: number; monthlyIncome: number; build: number; growth: number; inflation: number; description: string }> = {
  tech: { cost: 25, jobs: 20_000, monthlyIncome: 0.18, build: 9, growth: 0.15, inflation: 0, description: 'Fiber, co-working towers, and incentives for IT and AI firms.' },
  manufacturing: { cost: 20, jobs: 30_000, monthlyIncome: 0.15, build: 10, growth: 0.15, inflation: -0.05, description: 'An export zone with power, water, and a one-stop permit office.' },
  farming: { cost: 12, jobs: 18_000, monthlyIncome: 0.07, build: 6, growth: 0.05, inflation: -0.25, description: 'Irrigation, machinery, cold storage — cheaper food.' },
  tourism: { cost: 10, jobs: 14_000, monthlyIncome: 0.09, build: 8, growth: 0.08, inflation: 0, description: 'Airport upgrades, roads, and heritage restoration.' },
  infra: { cost: 30, jobs: 35_000, monthlyIncome: 0.2, build: 14, growth: 0.2, inflation: -0.05, description: 'Roads, bridges, and a port — with toll and port-fee income.' },
  energy: { cost: 18, jobs: 7_000, monthlyIncome: 0.14, build: 12, growth: 0.08, inflation: -0.15, description: 'Solar, wind, or geothermal — cheaper power and sales to the grid.' },
};

export const MAX_LEVEL_PER_SECTOR = 3;
