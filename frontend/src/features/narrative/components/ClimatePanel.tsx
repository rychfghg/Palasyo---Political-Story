import { useGameStore } from '@/features/game-engine/store/gameStore';
import { POLITICS_LABELS } from '@/features/game-engine/engine/engine';
import type { HistoryPoint } from '@/features/game-engine/types/campaign';
import type { PoliticsKey } from '@/features/narrative/types/event';

const GROUPS: { title: string; keys: PoliticsKey[] }[] = [
  { title: 'Pulitika', keys: ['capital', 'cohesion', 'cabinetCohesion', 'courtTension', 'ombudsman'] },
  { title: 'Ekonomiya', keys: ['investor', 'corruption'] },
  { title: 'Lipunan', keys: ['media', 'protest', 'church', 'tribes', 'family'] },
  { title: 'Seguridad', keys: ['crime', 'military', 'sovereignty'] },
];

function tone(key: PoliticsKey, v: number) {
  const good = POLITICS_LABELS[key].higherIsGood ? v >= 55 : v <= 45;
  const bad = POLITICS_LABELS[key].higherIsGood ? v <= 35 : v >= 65;
  return good ? 'good' : bad ? 'bad' : 'mid';
}

function Ring({ k, v }: { k: PoliticsKey; v: number }) {
  const r = 17;
  const c = 2 * Math.PI * r;
  const t = tone(k, v);
  return (
    <div className={`ring ring--${t}`} title={`${POLITICS_LABELS[k].label}: ${Math.round(v)} / 100`}>
      <svg viewBox="0 0 44 44" aria-hidden="true">
        <circle cx="22" cy="22" r={r} className="ring__track" />
        <circle cx="22" cy="22" r={r} className="ring__value" strokeDasharray={`${(v / 100) * c} ${c}`} transform="rotate(-90 22 22)" />
        <text x="22" y="26">{Math.round(v)}</text>
      </svg>
      <span>{POLITICS_LABELS[k].label}</span>
    </div>
  );
}

/** A tiny trend line. */
function Spark({ values, invert = false }: { values: number[]; invert?: boolean }) {
  if (values.length < 2) return <svg className="spark" viewBox="0 0 80 24" />;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * 80},${22 - ((v - min) / span) * 20}`).join(' ');
  const rising = values[values.length - 1] > values[0];
  const good = invert ? !rising : rising;
  return (
    <svg className={`spark ${good ? 'spark--good' : 'spark--bad'}`} viewBox="0 0 80 24" aria-hidden="true">
      <polyline points={pts} />
    </svg>
  );
}

/** The nation’s vital signs with their trends — shown above the agenda. */
export function NationPulse() {
  const { economy, history } = useGameStore();
  if (!economy) return null;
  const h: HistoryPoint[] = (history ?? []).slice(-12);
  const cards = [
    { label: 'Approval', value: `${Math.round(economy.approval)}%`, series: h.map((x) => x.approval), invert: false },
    { label: 'Inflation', value: `${economy.inflation.toFixed(1)}%`, series: h.map((x) => x.inflation), invert: true },
    { label: 'GDP growth', value: `${(economy.growth ?? 5).toFixed(1)}%`, series: h.map((x) => x.growth), invert: false },
    { label: 'Debt / GDP', value: `${((economy.debt / economy.gdp) * 100).toFixed(1)}%`, series: h.map((x) => x.debtRatio), invert: true },
    { label: 'Unemployment', value: `${economy.unemployment.toFixed(1)}%`, series: h.map((x) => x.unemployment), invert: true },
  ];
  return (
    <section className="pulse">
      {cards.map((c) => (
        <div key={c.label} className="pulse__card">
          <span>{c.label}</span>
          <b>{c.value}</b>
          <Spark values={c.series} invert={c.invert} />
        </div>
      ))}
    </section>
  );
}

export function ClimatePanel() {
  const politics = useGameStore((x) => x.politics);
  return (
    <section className="card climate">
      <h3 className="section-title">Political climate</h3>
      {GROUPS.map((g) => (
        <div key={g.title} className="climate__group">
          <h4>{g.title}</h4>
          <div className="climate__rings">
            {g.keys.map((k) => (
              <Ring key={k} k={k} v={politics[k]} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
