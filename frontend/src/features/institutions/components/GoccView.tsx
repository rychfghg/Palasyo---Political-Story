import { useGameStore } from '@/features/game-engine/store/gameStore';
import { goccPay, NEW_GOCCS } from '@/features/game-engine/engine/institutions';
import { monthLabel } from '@/features/game-engine/engine/calendar';
import type { CampaignState, Gocc } from '@/features/game-engine/types/campaign';
import { peso } from '@/features/economy/utils/finance';
import { Portrait } from '@/shared/components/ui/Portrait';
import { OfficialCard } from './CentralBankView';

const pm = (b: number) => (Math.abs(b) < 1 && b !== 0 ? `₱${Math.round(b * 1000)}M` : peso(b));

/** Where each corporation stands: who runs it, whether there is trouble, and what is pending on the Agenda. */
function status(g: Gocc, s: CampaignState): { label: string; tone: 'ok' | 'warn' | 'bad' } {
  if (g.faultFound) return { label: `Fault found — replacing the ${g.ceoTitle} is on your Agenda`, tone: 'bad' };
  if (g.opensMonth > s.month) return { label: `Being set up · opens ${monthLabel(g.opensMonth)}`, tone: 'warn' };
  if ((s.cooldowns?.[`audit:${g.id}`] ?? -99) > s.month) return { label: 'COA audit under way — nothing found so far', tone: 'warn' };
  if (g.appointedBy === 'previous') return { label: 'Run by a Dela Paz appointee with a fixed term', tone: 'warn' };
  if (s.flags[`gocc_mine_${g.id}`]) return { label: 'Chief replaced by you after a proven fault', tone: 'ok' };
  return { label: 'Operating normally', tone: 'ok' };
}

function GoccCard({ g, s }: { g: Gocc; s: CampaignState }) {
  const st = status(g, s);
  const open = g.opensMonth <= s.month;
  return (
    <article className={`gocc ${g.faultFound ? 'has-fault' : ''}`}>
      <header>
        <div>
          <small className="official__role">{g.focus}</small>
          <h4>{g.name}</h4>
          <p className="muted">{g.description}</p>
          <span className={`gocc__status is-${st.tone}`}>{st.label}</span>
        </div>
        <div className="gocc__money">
          <b>{pm(goccPay(g, s.month) * 12)}<small>/yr</small></b>
          <em>{open ? `earned ${pm(g.earned)}` : `opens ${monthLabel(g.opensMonth)}`}</em>
        </div>
      </header>

      <div className="gocc__chief">
        <OfficialCard o={g.ceo} role={`${g.ceoTitle} · ${g.appointedBy === 'previous' ? 'appointed by the previous administration' : 'your appointee'}`} mood={g.faultFound ? 'worried' : 'neutral'} />
        <div className="gocc__actions">{g.faultFound && <p className="gocc__fault">⚠ {g.faultFound}</p>}</div>
      </div>

      <div className="board-row board-row--small">
        <span className="official__role">Board of directors</span>
        {g.board.map((m) => (
          <div key={m.name} className="board-member" title={`${m.name} — ${m.background}`}>
            <Portrait name={m.name} size={40} />
            <small>{m.name}</small>
          </div>
        ))}
      </div>
    </article>
  );
}

export function GoccView() {
  const s = useGameStore() as unknown as CampaignState;
  const goccs = s.goccs ?? [];
  const yearly = goccs.reduce((n, g) => n + goccPay(g, s.month) * 12, 0);
  const proposed = NEW_GOCCS.filter((t) => !goccs.some((g) => g.id === t.id)).length;

  return (
    <div className="stack">
      <header className="view-head">
        <div>
          <h2>Mga Korporasyon ng Gobyerno</h2>
          <p className="muted">
            Government-owned and -controlled corporations. They pay dividends to the Treasury — {pm(yearly)} a year right now. Audits, replacing chiefs, new boards, and new
            corporations are decided on the Agenda, through your Cabinet and Congress.
          </p>
        </div>
      </header>
      {goccs.map((g) => (
        <GoccCard key={g.id} g={g} s={s} />
      ))}
      {proposed > 0 && <p className="muted">Your Cabinet may propose up to {proposed} new corporations during your term. Each needs a charter from Congress.</p>}
    </div>
  );
}
