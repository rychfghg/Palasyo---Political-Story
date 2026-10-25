/** Amounts are in billions of pesos (₱B) unless stated otherwise. */

export interface Economy {
  gdp: number;
  debt: number;
  treasury: number;
  revenueAnnual: number;
  projectedRevenueNextYear: number;
  interestRate: number; // average effective rate on debt, e.g. 0.049
  inflation: number; // %
  unemployment: number; // %
  poverty: number; // %
  approval: number; // %
  growth?: number; // real GDP growth, %
}

export interface LedgerEntry {
  id: string;
  date: string; // in-game date label
  label: string;
  amount: number; // + income / − spending
  borrowed: number; // portion financed by new debt
}

export type Stance = 'ally' | 'neutral' | 'opposition';

export type AppointmentStatus = 'vacant' | 'confirmed' | 'rejected' | 'no_confirmation';

export interface CabinetSeat {
  postId: string;
  nomineeId: string | null;
  status: AppointmentStatus;
  rejectedIds: string[];
  /** Confirmation tally from the Commission on Appointments, if a hearing happened. */
  caVote?: { yes: number; no: number };
}

export interface HouseBloc {
  label: string; // party abbreviation or party-list name
  kind: 'party' | 'party-list' | 'independent';
  partyId: string | null;
  seats: number;
  stance: Stance;
}

export interface HouseLeader {
  role: string;
  name: string;
  district: string;
  partyId: string | null;
  stance: Stance;
}

export interface HouseState {
  totalSeats: number;
  districtSeats: number;
  partyListSeats: number;
  blocs: HouseBloc[];
  leaders: HouseLeader[];
}

export interface SenatorState {
  id: string;
  stance: Stance;
  isSenatePresident: boolean;
}

export interface GovernmentState {
  house: HouseState;
  senators: SenatorState[];
}
