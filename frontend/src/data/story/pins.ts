import type { EventCategory, PinKey, StoryEvent } from '@/features/narrative/types/event';

/** Map coordinates (in the 1000×1000 archipelago map) for each place an issue can pop up. */
export const PIN_COORDS: Record<PinKey, { x: number; y: number; label: string }> = {
  palasyo: { x: 396, y: 318, label: 'Palasyo ng Malaya' },
  batasan: { x: 432, y: 298, label: 'Batasang Pambansa' },
  senate: { x: 450, y: 338, label: 'Senado' },
  court: { x: 388, y: 350, label: 'Korte Suprema' },
  maynilad: { x: 420, y: 356, label: 'Maynilad' },
  north: { x: 380, y: 150, label: 'Hilagang Luzara' },
  kapatagan: { x: 432, y: 245, label: 'Gitnang Kapatagan' },
  bikol: { x: 592, y: 440, label: 'Bikolandia' },
  iloilanan: { x: 395, y: 545, label: 'Iloilanan' },
  sugbu: { x: 505, y: 582, label: 'Sugbu City' },
  tacloban: { x: 612, y: 505, label: 'Silangang Visara' },
  cagayan: { x: 560, y: 700, label: 'Hilagang Mindara' },
  davira: { x: 676, y: 790, label: 'Davira City' },
  marawira: { x: 522, y: 752, label: 'Bangsa Lanao' },
  westsea: { x: 250, y: 420, label: 'Bahura ng Kalayaan' },
  pagasa: { x: 165, y: 560, label: 'Pag-asa Island' },
  abroad: { x: 860, y: 130, label: 'Abroad' },
};

const CATEGORY_PIN: Record<EventCategory, PinKey> = {
  family: 'palasyo',
  congress: 'batasan',
  cabinet: 'palasyo',
  address: 'batasan',
  crisis: 'maynilad',
  calamity: 'tacloban',
  media: 'maynilad',
  scandal: 'senate',
  diplomacy: 'westsea',
  court: 'court',
  economy: 'maynilad',
  society: 'maynilad',
  election: 'kapatagan',
  chapter: 'palasyo',
};

/** Places for existing events whose category default would be misleading. */
const EVENT_PINS: Record<string, PinKey> = {
  typhoon_kidlat: 'bikol',
  cabinet_rice: 'palasyo',
  farmers_march: 'kapatagan',
  tribal_mine: 'cagayan',
  water_crisis: 'kapatagan',
  harvest_boom: 'kapatagan',
  super_typhoon: 'tacloban',
  private_armies: 'north',
  campaign_violence: 'north',
  investment_summit: 'sugbu',
  ofw_crisis: 'abroad',
  haizhou_landing: 'pagasa',
  haizhou_retaliation: 'abroad',
  flagship_project: 'maynilad',
  opposition_smear: 'senate',
  brother_customs_scandal: 'maynilad',
  senate_budget: 'senate',
  midterm_election: 'maynilad',
  bribe_offer: 'maynilad',
  youth_protest: 'palasyo',
};

export function pinFor(e: StoryEvent): PinKey {
  return e.where ?? EVENT_PINS[e.id] ?? CATEGORY_PIN[e.category];
}
