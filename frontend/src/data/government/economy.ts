import type { Economy } from '@/features/game-engine/types/government';

/**
 * The fiscal situation inherited from the Dela Paz administration on June 30, 2027.
 * Deliberately fragile: high debt, a wide deficit, thin cash, and unpaid bills.
 */
export const INHERITED_ECONOMY: Economy = {
  gdp: 28_500,
  debt: 17_900, // ≈ 62.8% of GDP
  treasury: 310,
  revenueAnnual: 4_850,
  projectedRevenueNextYear: 5_180,
  interestRate: 0.049,
  inflation: 5.8,
  unemployment: 6.1,
  poverty: 21.4,
  approval: 61,
};

export type BudgetLineKind = 'department' | 'mandatory' | 'other';

export interface BudgetLine {
  id: string;
  name: string;
  short: string;
  kind: BudgetLineKind;
  fy2027: number; // ₱B enacted by the previous Congress
  note: string;
}

/** FY2027 General Appropriations Act (inherited). Total ₱6,100B vs ₱4,850B revenue. */
export const BUDGET_LINES: BudgetLine[] = [
  { id: 'education', name: 'Department of Education', short: 'Education', kind: 'department', fy2027: 1_020, note: 'Classrooms, teachers, state universities. Largest department by law.' },
  { id: 'publicWorks', name: 'Department of Public Works & Highways', short: 'Public Works', kind: 'department', fy2027: 900, note: 'Roads, bridges, flood control — and the favorite hunting ground of kickbacks.' },
  { id: 'health', name: 'Department of Health', short: 'Health', kind: 'department', fy2027: 320, note: 'Hospitals, vaccines, the national health insurer.' },
  { id: 'interior', name: 'Department of the Interior & Local Government', short: 'Interior', kind: 'department', fy2027: 290, note: 'Includes the National Police and fire protection.' },
  { id: 'defense', name: 'Department of National Defense', short: 'Defense', kind: 'department', fy2027: 280, note: 'Armed Forces, modernization, the West Sea patrols.' },
  { id: 'socialWelfare', name: 'Department of Social Welfare', short: 'Social Welfare', kind: 'department', fy2027: 260, note: 'Cash transfers to 4.4 million poor families, disaster relief.' },
  { id: 'transportation', name: 'Department of Transportation', short: 'Transportation', kind: 'department', fy2027: 170, note: 'Rail, ports, airports. Maynilad’s subway is 4 years behind.' },
  { id: 'agriculture', name: 'Department of Agriculture', short: 'Agriculture', kind: 'department', fy2027: 160, note: 'Irrigation, rice subsidies, fisheries.' },
  { id: 'finance', name: 'Department of Finance', short: 'Finance', kind: 'department', fy2027: 75, note: 'Tax and customs collection.' },
  { id: 'labor', name: 'Department of Labor & Employment', short: 'Labor', kind: 'department', fy2027: 50, note: 'OFW welfare, emergency employment.' },
  { id: 'justice', name: 'Department of Justice', short: 'Justice', kind: 'department', fy2027: 45, note: 'Prosecutors, prisons, NBI.' },
  { id: 'environment', name: 'Department of Environment & Natural Resources', short: 'Environment', kind: 'department', fy2027: 35, note: 'Forests, mining permits, climate adaptation.' },
  { id: 'science', name: 'Department of Science & Technology', short: 'Science & Tech', kind: 'department', fy2027: 32, note: 'Weather bureau, research grants.' },
  { id: 'foreignAffairs', name: 'Department of Foreign Affairs', short: 'Foreign Affairs', kind: 'department', fy2027: 30, note: 'Embassies and the OFW assistance fund.' },
  { id: 'trade', name: 'Department of Trade & Industry', short: 'Trade', kind: 'department', fy2027: 25, note: 'Investment promotion, small business loans.' },
  { id: 'energy', name: 'Department of Energy', short: 'Energy', kind: 'department', fy2027: 12, note: 'Grid, rural electrification.' },
  { id: 'tourism', name: 'Department of Tourism', short: 'Tourism', kind: 'department', fy2027: 4, note: 'Promotion and heritage sites.' },
  { id: 'budgetMgmt', name: 'Department of Budget & Management', short: 'Budget Mgmt', kind: 'department', fy2027: 3, note: 'Prepares the budget and releases funds.' },

  { id: 'debtService', name: 'Debt Service (interest payments)', short: 'Debt interest', kind: 'mandatory', fy2027: 877, note: 'Automatically appropriated. Grows with every peso borrowed.' },
  { id: 'localShare', name: 'Local Government Share', short: 'LGU share', kind: 'mandatory', fy2027: 1_020, note: 'Constitutionally guaranteed share of national taxes for provinces, cities, and barangays.' },

  { id: 'officeOfPresident', name: 'Office of the President', short: 'Palasyo', kind: 'other', fy2027: 14, note: 'Includes ₱4.5B in confidential funds.' },
  { id: 'congress', name: 'Congress', short: 'Congress', kind: 'other', fy2027: 42, note: 'Senate and House operations.' },
  { id: 'judiciary', name: 'The Judiciary', short: 'Judiciary', kind: 'other', fy2027: 62, note: 'Fiscally autonomous under the Constitution.' },
  { id: 'constitutionalOffices', name: 'Constitutional Commissions & Ombudsman', short: 'Const. bodies', kind: 'other', fy2027: 48, note: 'COMELEC, COA, CSC, Ombudsman.' },
  { id: 'pensions', name: 'Pensions, Calamity Fund & Others', short: 'Pensions & others', kind: 'other', fy2027: 326, note: 'Military and civil pensions, NDRRM calamity fund, contingencies.' },
];

export const TOTAL_FY2027 = BUDGET_LINES.reduce((n, l) => n + l.fy2027, 0);

/** Bills left unpaid by the outgoing administration — the first decision of the presidency. */
export const INHERITED_ARREARS = {
  contractors: 85,
  healthInsurer: 38,
};
