import { useMemo } from 'react';

export interface HemicycleGroup {
  key: string;
  label: string;
  seats: number;
  color: string;
}

/** Parliament-style half-circle seat chart. Groups are placed left → right in the order given. */
export function Hemicycle({ groups, rows = 8, label }: { groups: HemicycleGroup[]; rows?: number; label: string }) {
  const total = groups.reduce((n, g) => n + g.seats, 0);

  const dots = useMemo(() => {
    const inner = 0.38;
    const radii = Array.from({ length: rows }, (_, i) => inner + ((1 - inner) * i) / (rows - 1 || 1));
    const radiusSum = radii.reduce((a, b) => a + b, 0);
    const perRow = radii.map((r) => Math.floor((total * r) / radiusSum));
    let remaining = total - perRow.reduce((a, b) => a + b, 0);
    for (let i = rows - 1; remaining > 0; i = (i - 1 + rows) % rows, remaining--) perRow[i]++;

    const positions: { x: number; y: number; angle: number }[] = [];
    radii.forEach((r, row) => {
      const n = perRow[row];
      for (let k = 0; k < n; k++) {
        const angle = n === 1 ? Math.PI / 2 : Math.PI - (Math.PI * k) / (n - 1);
        positions.push({ x: 50 + 46 * r * Math.cos(angle), y: 50 - 46 * r * Math.sin(angle), angle });
      }
    });
    positions.sort((a, b) => b.angle - a.angle);

    const colors = groups.flatMap((g) => Array<string>(g.seats).fill(g.color));
    return positions.map((p, i) => ({ ...p, color: colors[i] }));
  }, [groups, rows, total]);

  const dotR = Math.min(1.6, 34 / Math.sqrt(total * 6));

  return (
    <figure className="hemicycle">
      <svg viewBox="0 0 100 54" role="img" aria-label={`${label}: ${groups.map((g) => `${g.label} ${g.seats}`).join(', ')}`}>
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={dotR} fill={d.color} />
        ))}
        <text x="50" y="47" className="hemicycle__total">{total}</text>
        <text x="50" y="52" className="hemicycle__label">{label}</text>
      </svg>
      <figcaption className="legend">
        {groups.map((g) => (
          <span key={g.key}>
            <i style={{ background: g.color }} />
            {g.label} <b>{g.seats}</b>
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
