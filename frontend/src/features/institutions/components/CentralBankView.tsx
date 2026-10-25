import { useGameStore } from '@/features/game-engine/store/gameStore';
import { monthLabel } from '@/features/game-engine/engine/calendar';
import type { CampaignState, Official } from '@/features/game-engine/types/campaign';
import { Portrait, type Mood } from '@/shared/components/ui/Portrait';

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="meter">
      <span>{label}</span>
      <div><i style={{ width: `${value * 10}%` }} /></div>
    </div>
  );
}

export function OfficialCard({ o, role, mood, children }: { o: Official; role: string; mood?: Mood; children?: React.ReactNode }) {
  return (
    <div className="official">
      <Portrait name={o.name} mood={mood} size={64} />
      <div>
        <small className="official__role">{role}</small>
        <b>{o.name}</b>
        <p className="muted">{o.background}</p>
        <Stat label="Competence" value={o.competence} />
        <Stat label="Integrity" value={o.integrity} />
        <Stat label="Loyalty to you" value={o.loyalty} />
        {children}
      </div>
    </div>
  );
}

/** The peso over the last months, with its range marked. Higher means a weaker peso. */
function PesoChart({ history }: { history: number[] }) {
  if (history.length < 2) return <p className="muted">The peso chart fills in month by month.</p>;
  const min = Math.min(...history) - 0.3;
  const max = Math.max(...history) + 0.3;
  const y = (v: number) => 110 - ((v - min) / (max - min)) * 100;
  const pts = history.map((v, i) => `${40 + (i / (history.length - 1)) * 350},${y(v)}`).join(' ');
  const weaker = history[history.length - 1] > history[0];
  const color = weaker ? '#e0806f' : '#8fd19e';
  return (
    <svg className="peso-chart peso-chart--big" viewBox="0 0 400 120" aria-label="Peso exchange rate trend">
      {[max - 0.3, (max + min) / 2, min + 0.3].map((v) => (
        <g key={v}>
          <line x1="40" x2="390" y1={y(v)} y2={y(v)} stroke="rgba(255,255,255,0.08)" />
          <text x="34" y={y(v) + 3} textAnchor="end" fontSize="9" fill="rgba(232,226,212,0.6)">₱{v.toFixed(1)}</text>
        </g>
      ))}
      <polyline points={`40,110 ${pts} 390,110`} fill={color} opacity="0.12" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="390" cy={y(history[history.length - 1])} r="4" fill={color} />
    </svg>
  );
}

export function CentralBankView() {
  const s = useGameStore() as unknown as CampaignState;
  const cb = s.centralBank;
  if (!cb) return <p className="muted">The Bangko Sentral opens its books when your term begins.</p>;
  const worried = cb.adviceTone ? cb.adviceTone === 'warn' : /weaken|worr|above our|cannot keep|raise rates|pulling|slowed/.test(cb.advice);
  const first = cb.pesoHistory[0];
  const change = ((cb.peso - first) / first) * 100;
  const inflation = s.economy?.inflation ?? 0;
  const sides = [cb.board.slice(0, 3), cb.board.slice(3, 6)];

  return (
    <div className="stack bank-office">
      <header className="congress-banner bank-banner">
        <div className="congress-banner__mace" aria-hidden>₱</div>
        <div>
          <p className="kicker kicker--gold">Bangko Sentral ng Kapuluan · Maynilad</p>
          <h2>Bangko Sentral</h2>
          <p className="muted">The independent central bank. It sets interest rates to keep prices stable and defends the peso. You cannot fire its governor. Meetings with the governor come to you on the Agenda.</p>
        </div>
      </header>

      <section className="congress-strip">
        <div className={change > 1 ? 'is-bad' : change < -1 ? 'is-good' : ''}><small>Peso per dollar</small><b>₱{cb.peso.toFixed(2)}</b><em>{change >= 0 ? '+' : ''}{change.toFixed(1)}% since you took office</em></div>
        <div><small>Policy rate</small><b>{cb.rate.toFixed(2)}%</b><em>higher cools prices and growth</em></div>
        <div className={inflation > 4 || inflation < 2 ? 'is-bad' : 'is-good'}><small>Inflation vs target</small><b>{inflation.toFixed(1)}%</b><em>target 2–4%</em></div>
        <div className={cb.reserves < 70 ? 'is-bad' : ''}><small>Reserves</small><b>${cb.reserves.toFixed(1)}B</b><em>used to defend the peso</em></div>
        <div className={cb.independence < 50 ? 'is-bad' : 'is-good'}><small>Independence</small><b>{Math.round(cb.independence)} / 100</b><em>markets trust an independent bank</em></div>
      </section>

      <div className="bank-grid">
        <section className="card governor-office">
          <h3 className="section-title">Tanggapan ng Gobernador · The Governor’s office</h3>
          <OfficialCard o={cb.governor} role={`Governor · term ends ${monthLabel(cb.governorTermEnds)}`} mood={worried ? 'worried' : 'neutral'} />
          <blockquote className={`advice ${worried ? 'is-warn' : ''}`}>{cb.advice}</blockquote>
          <p className="muted">{cb.lastAction}</p>
        </section>

        <section className="card">
          <h3 className="section-title">Ang Piso · The peso against the dollar</h3>
          <PesoChart history={cb.pesoHistory} />
          <p className="muted">A weaker peso makes fuel, rice, and imports cost more, and pushes inflation up. Big deficits, heavy debt, and low investor confidence weaken it; higher interest rates and a trusted central bank strengthen it.</p>
        </section>
      </div>

      <section className="card">
        <h3 className="section-title">Monetary Board</h3>
        <p className="muted">The governor and six members vote on interest rates each month. All were appointed before your term.</p>
        <div className="boardroom">
          <div className="boardroom__head">
            <Portrait name={cb.governor.name} size={64} />
            <b>{cb.governor.name}</b>
            <small>Governor · chair</small>
          </div>
          <div className="boardroom__table">
            {sides.map((side, i) => (
              <div key={i} className="boardroom__side">
                {side.map((m) => (
                  <div key={m.name} className="board-member" title={`${m.name} — ${m.background}`}>
                    <Portrait name={m.name} size={48} />
                    <b>{m.name}</b>
                    <small>{m.background}</small>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
