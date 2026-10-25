import { useMemo } from 'react';
import type { IslandGroup } from '@/data/world/regions';
import './ArchipelagoMap.css';

interface Island {
  id: string;
  group: IslandGroup | 'islet';
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rot: number;
  seed: number;
}

interface City {
  name: string;
  x: number;
  y: number;
  capital?: boolean;
}

const ISLANDS: Island[] = [
  // Luzara — the long northern island
  { id: 'luzara-n', group: 'luzara', cx: 395, cy: 170, rx: 70, ry: 120, rot: -8, seed: 1 },
  { id: 'luzara-c', group: 'luzara', cx: 420, cy: 320, rx: 95, ry: 90, rot: 20, seed: 2 },
  { id: 'luzara-s', group: 'luzara', cx: 520, cy: 410, rx: 120, ry: 38, rot: 32, seed: 3 },
  // Visara — scattered central islands
  { id: 'vis-1', group: 'visara', cx: 400, cy: 535, rx: 62, ry: 34, rot: -25, seed: 4 },
  { id: 'vis-2', group: 'visara', cx: 505, cy: 560, rx: 22, ry: 72, rot: 12, seed: 5 },
  { id: 'vis-3', group: 'visara', cx: 600, cy: 520, rx: 44, ry: 52, rot: 5, seed: 6 },
  { id: 'vis-4', group: 'visara', cx: 305, cy: 610, rx: 20, ry: 95, rot: 38, seed: 7 },
  { id: 'vis-5', group: 'visara', cx: 470, cy: 470, rx: 30, ry: 20, rot: 0, seed: 8 },
  // Mindara — the great southern island
  { id: 'mindara-w', group: 'mindara', cx: 520, cy: 760, rx: 110, ry: 70, rot: -10, seed: 9 },
  { id: 'mindara-e', group: 'mindara', cx: 650, cy: 740, rx: 95, ry: 110, rot: 15, seed: 10 },
  { id: 'mindara-t', group: 'mindara', cx: 420, cy: 850, rx: 50, ry: 18, rot: -35, seed: 11 },
];

const CITIES: City[] = [
  { name: 'Maynilad', x: 412, y: 330, capital: true },
  { name: 'San Fernando del Norte', x: 380, y: 140 },
  { name: 'Legazpira', x: 590, y: 435 },
  { name: 'Iloilanan', x: 395, y: 545 },
  { name: 'Sugbu City', x: 505, y: 575 },
  { name: 'Tacloban Nuevo', x: 610, y: 505 },
  { name: 'Davira City', x: 675, y: 790 },
  { name: 'Marawira', x: 525, y: 750 },
];

const FOCUS: Record<IslandGroup | 'all', { x: number; y: number; scale: number }> = {
  all: { x: 0, y: 0, scale: 1 },
  luzara: { x: 40, y: 220, scale: 1.45 },
  visara: { x: 0, y: -20, scale: 1.55 },
  mindara: { x: -80, y: -260, scale: 1.45 },
};

function rng(seed: number) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/** Irregular coastline: an ellipse whose radius wobbles with seeded harmonics, smoothed with quadratic curves. */
function coastline(i: Island, points = 48): string {
  const r = rng(i.seed);
  const h = [r() * 0.18, r() * 0.12, r() * 0.08, r() * 0.06];
  const p = [r() * 6.28, r() * 6.28, r() * 6.28, r() * 6.28];
  const rot = (i.rot * Math.PI) / 180;
  const pts: [number, number][] = [];
  for (let k = 0; k < points; k++) {
    const t = (k / points) * Math.PI * 2;
    const wobble = 1 + h[0] * Math.sin(2 * t + p[0]) + h[1] * Math.sin(3 * t + p[1]) + h[2] * Math.sin(5 * t + p[2]) + h[3] * Math.sin(9 * t + p[3]);
    const x = Math.cos(t) * i.rx * wobble;
    const y = Math.sin(t) * i.ry * wobble;
    pts.push([i.cx + x * Math.cos(rot) - y * Math.sin(rot), i.cy + x * Math.sin(rot) + y * Math.cos(rot)]);
  }
  const mid = (a: [number, number], b: [number, number]) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  let d = `M ${mid(pts[points - 1], pts[0]).join(' ')}`;
  for (let k = 0; k < points; k++) {
    const next = pts[(k + 1) % points];
    d += ` Q ${pts[k].join(' ')} ${mid(pts[k], next).join(' ')}`;
  }
  return d + ' Z';
}

function makeIslets(): Island[] {
  const r = rng(77);
  return Array.from({ length: 46 }, (_, k) => ({
    id: `islet-${k}`,
    group: 'islet' as const,
    cx: 260 + r() * 520,
    cy: 90 + r() * 820,
    rx: 3 + r() * 11,
    ry: 3 + r() * 8,
    rot: r() * 180,
    seed: 100 + k,
  })).filter((i) => !ISLANDS.some((m) => Math.hypot(m.cx - i.cx, m.cy - i.cy) < Math.max(m.rx, m.ry) + 14));
}

export interface MapMarker {
  id: string;
  x: number;
  y: number;
  label: string;
  color: string;
  /** Stagger index so issues pop up one after another. */
  order: number;
}

interface Props {
  focus?: IslandGroup | 'all';
  highlight?: IslandGroup | null;
  showLabels?: boolean;
  /** Render inside a page container instead of as the fixed full-screen backdrop. */
  embedded?: boolean;
  markers?: MapMarker[];
  onMarkerClick?: (id: string) => void;
}

export function ArchipelagoMap({ focus = 'all', highlight = null, showLabels = true, embedded = false, markers = [], onMarkerClick }: Props) {
  const shapes = useMemo(() => [...ISLANDS, ...makeIslets()].map((i) => ({ ...i, d: coastline(i) })), []);
  const f = FOCUS[focus];

  return (
    <div className={`map-stage ${embedded ? 'map-stage--embedded' : ''}`} aria-hidden={embedded ? undefined : true}>
      <div className="map-camera" style={{ transform: `scale(${f.scale}) translate(${f.x}px, ${f.y}px)` }}>
        <div className="map-plane">
          <svg viewBox="0 0 1000 1000" className="map-svg">
            <defs>
              <radialGradient id="sea" cx="50%" cy="50%" r="65%">
                <stop offset="0%" stopColor="#123a52" />
                <stop offset="100%" stopColor="#06131d" />
              </radialGradient>
              <linearGradient id="land" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#e8dcb5" />
                <stop offset="100%" stopColor="#b9a878" />
              </linearGradient>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(200,220,235,0.07)" strokeWidth="1" />
              </pattern>
            </defs>

            <rect width="1000" height="1000" fill="url(#sea)" />
            <rect width="1000" height="1000" fill="url(#grid)" />
            <circle cx="500" cy="500" r="470" fill="none" stroke="rgba(214,178,94,0.18)" strokeDasharray="4 10" />

            {/* shallow-water halo */}
            {shapes.map((s) => (
              <path key={`h-${s.id}`} d={s.d} fill="none" stroke="rgba(120,200,220,0.13)" strokeWidth={s.group === 'islet' ? 8 : 22} strokeLinejoin="round" />
            ))}

            {/* extruded cliffs — stacked shadows give the plane its 3D thickness */}
            {[6, 5, 4, 3, 2, 1].map((depth) => (
              <g key={depth} transform={`translate(0 ${depth * 1.6})`}>
                {shapes.map((s) => (
                  <path key={s.id} d={s.d} fill={`rgb(${60 - depth * 6}, ${52 - depth * 5}, ${36 - depth * 4})`} />
                ))}
              </g>
            ))}

            {shapes.map((s) => (
              <path
                key={`l-${s.id}`}
                d={s.d}
                className={`land ${highlight && s.group === highlight ? 'land--hi' : ''} ${highlight && s.group !== highlight && s.group !== 'islet' ? 'land--dim' : ''}`}
                fill="url(#land)"
              />
            ))}

            {CITIES.map((c) => (
              <g key={c.name} transform={`translate(${c.x} ${c.y})`} className="city">
                {c.capital && <circle r="14" className="city-pulse" />}
                <circle r={c.capital ? 5 : 3.2} className={c.capital ? 'city-dot city-dot--capital' : 'city-dot'} />
                {showLabels && (
                  <text x="9" y="4" className={c.capital ? 'city-label city-label--capital' : 'city-label'}>
                    {c.name}
                  </text>
                )}
              </g>
            ))}

            {markers.map((m) => (
              <g
                key={m.id}
                className="issue-pin"
                transform={`translate(${m.x} ${m.y})`}
                style={{ animationDelay: `${0.4 + m.order * 0.45}s` }}
                role="button"
                tabIndex={0}
                aria-label={m.label}
                onClick={() => onMarkerClick?.(m.id)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onMarkerClick?.(m.id)}
              >
                <circle r="32" className="issue-pin__pulse" style={{ stroke: m.color }} />
                <circle r="16" className="issue-pin__dot" style={{ fill: m.color }} />
                <text y="7" className="issue-pin__mark">!</text>
                <g className="issue-pin__tag">
                  <rect x="22" y="-16" rx="4" width={Math.min(330, m.label.length * 9 + 20)} height="30" />
                  <text x="32" y="5">{m.label.length > 34 ? m.label.slice(0, 33) + '…' : m.label}</text>
                </g>
              </g>
            ))}

            {showLabels && (
              <g className="group-labels">
                <text x="250" y="250">LUZARA</text>
                <text x="190" y="480">VISARA</text>
                <text x="760" y="900">MINDARA</text>
                <text x="760" y="300" className="sea-label">Dagat Silangan</text>
                <text x="120" y="780" className="sea-label">Dagat Kanluran</text>
              </g>
            )}
          </svg>
        </div>
      </div>
      <div className="map-vignette" />
    </div>
  );
}
