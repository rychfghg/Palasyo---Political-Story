/** Fictional global companies the President can court. None represents a real company. */
export interface Company {
  id: string;
  name: string;
  industry: string;
  pitch: string;
  /** What they would build. */
  project: string;
  jobs: number;
  /** Tax income per month once operating (₱B), with standard incentives. */
  monthlyIncome: number;
  growth: number;
  inflation: number;
  /** Minimum investor confidence before they will even take the call. */
  minConfidence: number;
  /** Preferred province id. */
  province: string;
}

export const COMPANIES: Company[] = [
  { id: 'bayanihub', name: 'Bayanihub', industry: 'Social media platform', pitch: 'The world’s second-largest social network wants a regional headquarters.', project: 'Regional HQ, data center, and content-moderation hub', jobs: 15_000, monthlyIncome: 0.5, growth: 0.12, inflation: 0, minConfidence: 45, province: 'maynilad' },
  { id: 'kwentuhan', name: 'Kwentuhan', industry: 'Short-video app', pitch: 'The fast-growing short-video app wants a creator-economy campus.', project: 'Creator campus and ad-sales office', jobs: 6_000, monthlyIncome: 0.25, growth: 0.06, inflation: 0, minConfidence: 40, province: 'sugbu' },
  { id: 'chirpline', name: 'Chirpline', industry: 'Microblogging platform', pitch: 'The microblogging giant needs 10,000 trust-and-safety workers who speak English.', project: 'Global trust-and-safety center', jobs: 10_000, monthlyIncome: 0.2, growth: 0.05, inflation: 0, minConfidence: 38, province: 'iloilanan' },
  { id: 'nexora', name: 'Nexora AI', industry: 'Artificial intelligence', pitch: 'An AI lab wants a ₱200B data-center campus — if power is reliable.', project: 'AI data-center campus', jobs: 5_000, monthlyIncome: 0.7, growth: 0.2, inflation: 0.05, minConfidence: 55, province: 'kapatagan' },
  { id: 'voltcar', name: 'Voltcar', industry: 'Electric vehicles', pitch: 'An EV maker wants an assembly plant using local nickel batteries.', project: 'EV assembly plant', jobs: 22_000, monthlyIncome: 0.6, growth: 0.25, inflation: -0.05, minConfidence: 50, province: 'cagayan' },
  { id: 'sunforge', name: 'Sunforge', industry: 'Solar manufacturing', pitch: 'A solar-panel maker wants a factory — and cheap panels for the local grid.', project: 'Solar-panel factory', jobs: 9_000, monthlyIncome: 0.35, growth: 0.1, inflation: -0.15, minConfidence: 42, province: 'kanlurang_luzara' },
  { id: 'cargolink', name: 'Cargolink', industry: 'Logistics', pitch: 'A global shipping line wants a transshipment hub — lowering shipping costs nationwide.', project: 'Transshipment hub and cold chain', jobs: 12_000, monthlyIncome: 0.4, growth: 0.12, inflation: -0.2, minConfidence: 45, province: 'davira_city' },
  { id: 'mediq', name: 'Mediq', industry: 'Pharmaceuticals', pitch: 'A drug maker wants a plant producing generic medicines for the region.', project: 'Generic medicines plant', jobs: 7_000, monthlyIncome: 0.3, growth: 0.08, inflation: -0.1, minConfidence: 48, province: 'sugbu' },
  { id: 'pixelforge', name: 'Pixelforge', industry: 'Video games', pitch: 'A game studio wants to build its Southeast Asian studio.', project: 'Game development studio', jobs: 3_000, monthlyIncome: 0.12, growth: 0.04, inflation: 0, minConfidence: 35, province: 'maynilad' },
  { id: 'agrisense', name: 'Agrisense', industry: 'Agricultural technology', pitch: 'An agritech firm wants to modernize 200,000 small farms with drones and sensors.', project: 'Smart-farming program', jobs: 8_000, monthlyIncome: 0.15, growth: 0.06, inflation: -0.25, minConfidence: 36, province: 'kapatagan' },
  { id: 'aerocraft', name: 'AeroCraft', industry: 'Aircraft maintenance', pitch: 'An aircraft maker wants a maintenance and parts facility.', project: 'Aircraft maintenance hub', jobs: 6_000, monthlyIncome: 0.3, growth: 0.08, inflation: 0, minConfidence: 50, province: 'legazpira' },
  { id: 'streamly', name: 'Streamly', industry: 'Streaming', pitch: 'A streaming service wants to fund local films and series.', project: 'Kapuluan original productions fund', jobs: 4_000, monthlyIncome: 0.15, growth: 0.04, inflation: 0, minConfidence: 35, province: 'maynilad' },
];

export type Offer = 'generous' | 'standard' | 'tough';

export const OFFER_TERMS: Record<Offer, { label: string; description: string; chance: number; incomeFactor: number; cost: number }> = {
  generous: { label: 'Generous', description: '10-year tax holiday and free land.', chance: 0.25, incomeFactor: 0.35, cost: 3 },
  standard: { label: 'Standard', description: 'The usual incentives.', chance: 0, incomeFactor: 1, cost: 1 },
  tough: { label: 'Tough', description: 'No holidays — full taxes from day one.', chance: -0.2, incomeFactor: 1.4, cost: 0.5 },
};
