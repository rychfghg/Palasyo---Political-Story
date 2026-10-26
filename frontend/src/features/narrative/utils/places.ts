import { PROVINCES } from '@/data/world/provinces';
import { EVENTS_BY_ID } from '@/features/game-engine/engine/engine';
import type { MapMarker } from '@/features/map/components/ArchipelagoMap';
import type { EventCategory, StoryEvent } from '@/features/narrative/types/event';
import type { CampaignState } from '@/features/game-engine/types/campaign';

const at = (id: string) => PROVINCES.find((p) => p.id === id)!;

export interface Landmark {
  id: string;
  name: string;
  icon: string;
  x: number;
  y: number;
}

/**
 * The seats of power in Maynilad (map units, 1000×1000). They are drawn on the map, and matters
 * about each office appear at its building.
 */
export const LANDMARKS: Landmark[] = [
  { id: 'palasyo', name: 'Palasyo ng Malaya', icon: '🏛️', x: 412, y: 330 },
  { id: 'batasan', name: 'Batasan (House)', icon: '🏢', x: 452, y: 288 },
  { id: 'senate', name: 'Senado', icon: '⚖️', x: 368, y: 300 },
  { id: 'court', name: 'Korte Suprema', icon: '🔨', x: 372, y: 362 },
  { id: 'bank', name: 'Bangko Sentral', icon: '🏦', x: 455, y: 360 },
  { id: 'justice', name: 'Ombudsman & courts', icon: '📜', x: 412, y: 395 },
  { id: 'ministries', name: 'Departments', icon: '🗂️', x: 412, y: 262 },
  { id: 'avenida', name: 'Avenida Liwayway', icon: '📣', x: 492, y: 322 },
  { id: 'ovp', name: 'Office of the VP', icon: '🏠', x: 340, y: 332 },
];
const LM = Object.fromEntries(LANDMARKS.map((l) => [l.id, l]));

/** Words in an event's location (then its title) that place it, most specific first. */
const PLACES: [RegExp, () => { x: number; y: number }][] = [
  [/Kataas-taasang Hukuman|Supreme Court|Korte Suprema|Judicial and Bar Council|\bJBC\b/i, () => LM.court],
  [/Senate|Senado|Blue Ribbon/i, () => LM.senate],
  [/House|Batasan|Congress|Session Hall|Kongreso|Speaker/i, () => LM.batasan],
  [/Bangko Sentral|central bank|Monetary Board|peso/i, () => LM.bank],
  [/Ombudsman|Sandiganbayan|anti-graft|NBI|Penitentiary|prosecutor|trial/i, () => LM.justice],
  [/Vice President/i, () => LM.ovp],
  [/Avenida|EDSA|protest|rally|march|strike/i, () => LM.avenida],
  [/Department of|Trade Department|Board of Investments|Statistics|Rating agencies|Finance|Budget|Customs|BIR/i, () => LM.ministries],
  [/Palasyo|Malacañ|Cabinet Room|Rizal Hall|Your study|Private residence|Presidential Security|National Security Council|press conference|State of the Nation/i, () => LM.palasyo],
  [/West Sea|Pag-asa|coast guard|shoal|Haizhou/i, () => ({ x: 215, y: 470 })],
  [/Sugbu/i, () => at('sugbu')],
  [/Davira/i, () => at('davira_city')],
  [/Marawira|Bangsamoro|Hilagang Mindara/i, () => at('marawira')],
  [/Cagayan de Ilog/i, () => at('cagayan')],
  [/Kapatagan/i, () => at('kapatagan')],
  [/San Fernando|Hilagang Luzara/i, () => at('sanfernando')],
  [/Legazpira|Bicol/i, () => at('legazpira')],
  [/Iloilanan|Kanlurang Visara/i, () => at('iloilanan')],
  [/Tacloban|Silangang Visara/i, () => at('tacloban')],
  [/Palawira/i, () => at('palawira')],
  [/Kanlurang Luzara/i, () => at('kanlurang_luzara')],
  [/Mindara/i, () => at('davira_city')],
  [/Visara/i, () => at('sugbu')],
];

/** When the text names no place, the kind of matter decides which building it belongs to. */
const BY_CATEGORY: Partial<Record<EventCategory, string>> = {
  court: 'court', cabinet: 'palasyo', address: 'palasyo', family: 'palasyo', media: 'palasyo', scandal: 'justice', economy: 'ministries', election: 'batasan', crisis: 'palasyo', society: 'avenida', diplomacy: 'palasyo', chapter: 'palasyo',
};

export function placeOf(ev: StoryEvent): { x: number; y: number } {
  const hit = PLACES.find(([re]) => re.test(ev.location)) ?? PLACES.find(([re]) => re.test(ev.title));
  if (hit) return hit[1]();
  return LM[BY_CATEGORY[ev.category] ?? 'palasyo'];
}

/** One pin per matter, at the place it happens. Several at one building fan out around it. */
export function deskMarkers(s: CampaignState, title: (id: string) => string, colors: Record<EventCategory, string>): MapMarker[] {
  const seen: Record<string, number> = {};
  return s.queue
    .filter((id) => EVENTS_BY_ID[id])
    .map((id, i) => {
      const ev = EVENTS_BY_ID[id];
      const p = placeOf(ev);
      const key = `${Math.round(p.x)},${Math.round(p.y)}`;
      const n = (seen[key] = (seen[key] ?? -1) + 1);
      // Pins sit just above the building so its name stays readable; extras line up beside the first.
      const side = n === 0 ? 0 : (n % 2 ? 1 : -1) * Math.ceil(n / 2) * 15;
      return { id, x: p.x + side, y: p.y - 13, label: title(id), color: colors[ev.category], order: i, mark: String(i + 1) };
    });
}
