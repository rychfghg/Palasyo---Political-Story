import { PROVINCES } from '@/data/world/provinces';
import { EVENTS_BY_ID } from '@/features/game-engine/engine/engine';
import type { MapMarker } from '@/features/map/components/ArchipelagoMap';
import type { EventCategory } from '@/features/narrative/types/event';
import type { CampaignState } from '@/features/game-engine/types/campaign';

const at = (id: string) => PROVINCES.find((p) => p.id === id)!;

/** Words in an event's location or text that place it somewhere on the map, most specific first. */
const PLACES: [RegExp, () => { x: number; y: number }][] = [
  [/West Sea|Pag-asa|Haizhou coast guard|shoal/i, () => ({ x: 215, y: 470 })],
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

/**
 * One pin per matter on the desk. Matters in a province go there; everything that happens in the
 * capital (the Palasyo, Congress, the courts) fans out in a ring around Maynilad so no pin hides another.
 */
export function deskMarkers(s: CampaignState, title: (id: string) => string, colors: Record<EventCategory, string>): MapMarker[] {
  const capital = at('maynilad');
  const ring: string[] = [];
  const placed: Record<string, { x: number; y: number }> = {};
  for (const id of s.queue) {
    const ev = EVENTS_BY_ID[id];
    if (!ev) continue;
    const where = `${ev.location} ${ev.title}`;
    const hit = PLACES.find(([re]) => re.test(where));
    if (hit) placed[id] = hit[1]();
    else ring.push(id);
  }
  ring.forEach((id, i) => {
    const r = ring.length === 1 ? 0 : 115 + Math.floor(i / 8) * 70;
    const a = (i % 8) * ((Math.PI * 2) / Math.min(8, ring.length)) - Math.PI / 2;
    placed[id] = { x: capital.x + Math.cos(a) * r, y: capital.y + Math.sin(a) * r };
  });
  // Two matters in the same province sit side by side.
  const seen: Record<string, number> = {};
  return s.queue.filter((id) => placed[id]).map((id, i) => {
    const p = placed[id];
    const key = `${Math.round(p.x)},${Math.round(p.y)}`;
    const n = (seen[key] = (seen[key] ?? -1) + 1);
    const ev = EVENTS_BY_ID[id];
    return { id, x: p.x + n * 34, y: p.y - n * 10, label: title(id), color: colors[ev.category], order: i, mark: String(i + 1) };
  });
}
