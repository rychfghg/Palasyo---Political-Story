import { useState } from 'react';
import { useGameStore } from '@/features/game-engine/store/gameStore';
import { monthLabel } from '@/features/game-engine/engine/calendar';
import type { CampaignState, HistoryPoint } from '@/features/game-engine/types/campaign';

interface Series {
  key: keyof HistoryPoint;
  label: string;
  color: string;
  unit: string;
  goodUp: boolean;
}

const CHARTS: { title: string; series: Series[]; note: string }[] = [
  { title: 'Approval', note: 'Your national approval rating.', series: [{ key: 'approval', label: 'Approval', color: '#8fd19e', unit: '%', goodUp: true }] },
  { title: 'Inflation & unemployment', note: 'Prices and jobs — what families feel first.', series: [
    { key: 'inflation', label: 'Inflation', color: '#e0806f', unit: '%', goodUp: false },
    { key: 'unemployment', label: 'Unemployment', color: '#d6b25e', unit: '%', goodUp: false },
  ] },
  { title: 'Debt', note: 'National debt as a share of GDP.', series: [{ key: 'debtRatio', label: 'Debt / GDP', color: '#c98ad6', unit: '%', goodUp: false }] },
  { title: 'The peso', note: 'Pesos per dollar — higher means weaker.', series: [{ key: 'peso', label: 'Peso', color: '#5a9bd4', unit: '', goodUp: false }] },
  { title: 'Growth', note: 'Real GDP growth.', series: [{ key: 'growth', label: 'Growth', color: '#8fd19e', unit: '%', goodUp: true }] },
  { title: 'Regional approval', note: 'How each island group rates you.', series: [
    { key: 'luzara', label: 'Luzara', color: '#d6b25e', unit: '%', goodUp: true },
    { key: 'visara', label: 'Visara', color: '#5a9bd4', unit: '%', goodUp: true },
    { key: 'mindara', label: 'Mindara', color: '#8fd19e', unit: '%', goodUp: true },
  ] },
];

const W = 560;
const H = 180;
const PAD = { l: 38, r: 10, t: 12, b: 22 };

function Chart({ data, series, markers, hover, setHover }: { data: HistoryPoint[]; series: Series[]; markers: { month: number; headline: string }[]; hover: number | null; setHover: (m: number | null) => void }) {
  const values = series.flatMap((s) => data.map((d) => d[s.key] as number | undefined).filter((v): v is number => typeof v === 'number'));
  if (data.length < 2 || !values.length) return <p className="muted">The chart fills in month by month.</p>;
  let min = Math.min(...values);
  let max = Math.max(...values);
  const pad = (max - min) * 0.12 || 1;
  min -= pad;
  max += pad;
  const m0 = data[0].month;
  const m1 = data[data.length - 1].month;
  const x = (m: number) => PAD.l + ((m - m0) / Math.max(1, m1 - m0)) * (W - PAD.l - PAD.r);
  const y = (v: number) => PAD.t + (1 - (v - min) / (max - min)) * (H - PAD.t - PAD.b);
  const ticks = [min + pad, (min + max) / 2, max - pad];
  const point = hover !== null ? data.find((d) => d.month === hover) : undefined;

  return (
    <svg className="stat-chart" viewBox={`0 0 ${W} ${H}`} onMouseLeave={() => setHover(null)}>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} stroke="rgba(255,255,255,0.07)" />
          <text x={PAD.l - 6} y={y(t) + 3} textAnchor="end" fontSize="10" fill="rgba(232,226,212,0.55)">{t.toFixed(t > 20 ? 0 : 1)}</text>
        </g>
      ))}
      {markers.filter((mk) => mk.month >= m0 && mk.month <= m1).map((mk) => (
        <line key={`${mk.month}-${mk.headline}`} x1={x(mk.month)} x2={x(mk.month)} y1={PAD.t} y2={H - PAD.b} stroke="rgba(214,178,94,0.25)" strokeDasharray="3 3" />
      ))}
      {series.map((s) => {
        const pts = data.filter((d) => typeof d[s.key] === 'number').map((d) => `${x(d.month)},${y(d[s.key] as number)}`).join(' ');
        return <polyline key={s.key} points={pts} fill="none" stroke={s.color} strokeWidth="2.2" strokeLinejoin="round" />;
      })}
      {[m0, Math.round((m0 + m1) / 2), m1].map((m) => (
        <text key={m} x={x(m)} y={H - 6} textAnchor="middle" fontSize="10" fill="rgba(232,226,212,0.55)">{monthLabel(m)}</text>
      ))}
      {data.map((d) => (
        <rect key={d.month} x={x(d.month) - 4} y={PAD.t} width="8" height={H - PAD.t - PAD.b} fill="transparent" onMouseEnter={() => setHover(d.month)} />
      ))}
      {point && (
        <g>
          <line x1={x(point.month)} x2={x(point.month)} y1={PAD.t} y2={H - PAD.b} stroke="rgba(255,255,255,0.35)" />
          {series.map((s) => typeof point[s.key] === 'number' && <circle key={s.key} cx={x(point.month)} cy={y(point[s.key] as number)} r="4" fill={s.color} />)}
        </g>
      )}
    </svg>
  );
}

/** The whole term at a glance: where things turned, and which decisions came before. */
export function StatsView() {
  const s = useGameStore() as unknown as CampaignState;
  const [hover, setHover] = useState<number | null>(null);
  const data = s.history ?? [];
  const markers = [...(s.news ?? [])].filter((n) => n.month >= 0).sort((a, b) => a.month - b.month);
  const hoverPoint = hover !== null ? data.find((d) => d.month === hover) : undefined;
  const hoverNews = hover !== null ? markers.filter((n) => n.month === hover) : [];
  const first = data[0];
  const last = data[data.length - 1];

  return (
    <div className="stack">
      <header className="congress-banner stats-banner">
        <div className="congress-banner__mace" aria-hidden>📈</div>
        <div>
          <p className="kicker kicker--gold">Kapuluan Statistics Office</p>
          <h2>Mga Estadistika</h2>
          <p className="muted">Your whole term, month by month. Dashed gold lines mark headline decisions; hover over any chart to see that month.</p>
        </div>
      </header>

      {first && last && (
        <section className="congress-strip">
          {([['approval', 'Approval', '%', true], ['inflation', 'Inflation', '%', false], ['debtRatio', 'Debt / GDP', '%', false], ['unemployment', 'Unemployment', '%', false], ['peso', 'Peso', '', false]] as [keyof HistoryPoint, string, string, boolean][]).map(([k, label, unit, goodUp]) => {
            const a = first[k] as number | undefined;
            const b = last[k] as number | undefined;
            if (typeof a !== 'number' || typeof b !== 'number') return <div key={k}><small>{label}</small><b>—</b></div>;
            const d = b - a;
            const good = goodUp ? d >= 0 : d <= 0;
            return (
              <div key={k} className={Math.abs(d) < 0.05 ? '' : good ? 'is-good' : 'is-bad'}>
                <small>{label}</small>
                <b>{unit === '' ? `₱${b.toFixed(2)}` : `${b.toFixed(1)}${unit}`}</b>
                <em>{d >= 0 ? '+' : ''}{d.toFixed(1)} since {monthLabel(first.month)}</em>
              </div>
            );
          })}
        </section>
      )}

      {hoverPoint && (
        <div className="stat-hover">
          <b>{monthLabel(hoverPoint.month)}</b>
          <span>Approval {hoverPoint.approval.toFixed(0)}% · Inflation {hoverPoint.inflation.toFixed(1)}% · Debt {hoverPoint.debtRatio.toFixed(1)}% · Unemployment {hoverPoint.unemployment.toFixed(1)}%{hoverPoint.peso ? ` · ₱${hoverPoint.peso.toFixed(2)}` : ''}</span>
          {hoverNews.map((n) => <span key={n.headline} className="stat-hover__news">📰 {n.headline}</span>)}
        </div>
      )}

      <div className="stat-grid">
        {CHARTS.map((c) => (
          <section key={c.title} className="card">
            <h3 className="section-title">{c.title}</h3>
            <div className="stat-legend">{c.series.map((sr) => <span key={sr.key}><i style={{ background: sr.color }} />{sr.label}</span>)}</div>
            <Chart data={data} series={c.series} markers={markers} hover={hover} setHover={setHover} />
            <small className="muted">{c.note}</small>
          </section>
        ))}
      </div>

      <section className="card">
        <h3 className="section-title">Headline decisions</h3>
        <ul className="stat-timeline">
          {markers.slice(-24).reverse().map((n) => (
            <li key={`${n.month}-${n.headline}`}><b>{monthLabel(n.month)}</b><span>{n.headline}</span></li>
          ))}
          {!markers.length && <li className="muted">No headlines yet.</li>}
        </ul>
      </section>
    </div>
  );
}
