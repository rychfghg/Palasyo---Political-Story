import { useGameStore } from '@/features/game-engine/store/gameStore';
import { fill, tokens } from '@/features/game-engine/engine/engine';
import { monthLabel } from '@/features/game-engine/engine/calendar';
import { pollResults } from '@/features/game-engine/engine/society';
import type { CampaignState, DecisionLog } from '@/features/game-engine/types/campaign';
import { useUiStore } from '@/app/store/uiStore';
import { peso } from '@/features/economy/utils/finance';
import { Modal } from '@/shared/components/ui/Modal';
import { Portrait } from '@/shared/components/ui/Portrait';
import { warningsFor } from '@/features/economy/components/Warnings';
import { messageTemplate } from '@/features/game-engine/engine/extras';

const up = (x: string) => x.toUpperCase();

/** How each paper writes the story. Liwayway is friendly to the Palasyo; Tinig ng Bayan is not. */
function slant(d: DecisionLog, friendly: boolean, last: string, t: Record<string, string>): { head: string; deck: string } {
  const title = fill(d.title, t);
  const choice = fill(d.choice, t).replace(/[“”"]/g, '');
  const head = d.headline ? fill(d.headline, t) : `${up(last)}: ${up(choice)}`;
  if (friendly) {
    return {
      head,
      deck: d.approval >= 0 ? `A decisive President ${last} acts on “${title}” — supporters cheer.` : `A hard but necessary call on “${title},” allies say.`,
    };
  }
  return {
    head: d.approval > 0 ? `${up(choice)}? CRITICS CALL IT A STUNT` : d.headline ? `${fill(d.headline, t)} — AT WHAT COST?` : `PALASYO UNDER FIRE OVER ${up(title)}`,
    deck: d.approval > 0 ? `The opposition says the move on “${title}” is for the cameras.` : `Critics say President ${last}’s choice on “${title}” will cost the country.`,
  };
}

/**
 * The month closes with the morning papers: the month's biggest decision on two front pages,
 * a political cartoon, and the numbers from the Treasury.
 */
export function FrontPage() {
  const s = useGameStore() as unknown as CampaignState;
  const r = s.monthReport;
  const seen = useUiStore((u) => u.reviewSeen);
  const setSeen = useUiStore((u) => u.setReviewSeen);
  if (!r || r.month !== s.month - 1 || seen >= r.month) return null;

  const t = tokens(s);
  const last = s.player?.lastName ?? 'President';
  const log = [...(s.lastMonthLog ?? [])].sort((a, b) => b.weight - a.weight);
  const top = log[0];
  const briefs = log.slice(1, 4);
  const net = r.revenue - r.spending;
  const polls = pollResults(s);
  const approval = Math.round(s.economy?.approval ?? 50);
  // Sort the month's notes into the summary's sections.
  const isBank = (n: string) => /Bangko Sentral|reserves|peso (added|took)|policy rate/i.test(n);
  const isAch = (n: string) => n.includes('🏅');
  const isPromise = (n: string) => /^Promise (kept|broken)/.test(n);
  const isPeople = (n: string) => /skipped|dinner with|unusually quiet|stopped answering|caucus|fundraiser|procedural motion|never answered|was not answered|went unanswered|took your silence/i.test(n);
  const bank = r.notes.filter(isBank);
  const achievements = r.notes.filter(isAch);
  const promises = r.notes.filter(isPromise);
  const people = r.notes.filter(isPeople);
  const other = r.notes.filter((n) => !isBank(n) && !isAch(n) && !isPromise(n) && !isPeople(n));
  const texts = (s.inbox ?? []).filter((m) => m.month === r.month && m.answered === undefined && !m.expired);
  const warnings = warningsFor(s);
  const mood = !top ? 'neutral' : top.approval > 1 ? 'happy' : top.approval < -1 ? 'worried' : 'neutral';

  return (
    <Modal title={`${monthLabel(r.month)} in review`} kicker="Buod ng Buwan · Month summary" onClose={() => setSeen(r.month)} className="frontpage-modal">
      <div className="papers">
        {[true, false].map((friendly) => {
          const story = top ? slant(top, friendly, last, t) : { head: friendly ? 'A QUIET MONTH AT THE PALASYO' : 'WHERE IS THE PRESIDENT?', deck: friendly ? 'The President works behind closed doors.' : 'Critics ask what the Palasyo did all month.' };
          return (
            <article key={String(friendly)} className={`paper-front ${friendly ? 'is-friendly' : 'is-critical'}`}>
              <header className="paper-front__mast">
                <b>{friendly ? 'Pahayagang Liwayway' : 'Tinig ng Bayan'}</b>
                <small>{monthLabel(r.month + 1)} · ₱25 · {friendly ? 'Ang Pahayagan ng Bansa' : 'Walang Kinikilingan'}</small>
              </header>
              <h3>{story.head}</h3>
              <p className="paper-front__deck">{story.deck}</p>
              {friendly && top && (
                <figure className="cartoon">
                  <Portrait name={`${s.player?.firstName} ${last}`} mood={mood} size={84} />
                  <figcaption>
                    <span className="cartoon__bubble">“{fill(top.choice, t).replace(/[“”"]/g, '')}”</span>
                    <small>Cartoon by Pablo Guhit</small>
                  </figcaption>
                </figure>
              )}
              {!friendly && (
                <div className="paper-front__poll">
                  <small>Survey this month</small>
                  <b>{approval}%</b>
                  <span>{polls.filter((p) => p.kind === 'region').map((p) => `${p.label} ${Math.round(p.value)}%`).join(' · ')}</span>
                </div>
              )}
              {briefs.length > 0 && (
                <ul className="paper-front__briefs">
                  {briefs.map((b) => (
                    <li key={b.eventId}>{fill(b.title, t)} — <i>{fill(b.choice, t).replace(/[“”"]/g, '')}</i></li>
                  ))}
                </ul>
              )}
            </article>
          );
        })}
      </div>

      <div className="summary-grid">
        <section className="paper-econ">
          <b>💰 Ulat Pang-ekonomiya · {monthLabel(r.month)}</b>
          <div className="month-summary__row">
            <span>Revenue <b>{peso(r.revenue)}</b></span>
            <span>Spending <b>{peso(r.spending)}</b></span>
            <span className={net < 0 ? 'is-bad' : 'is-good'}>{net < 0 ? 'Deficit' : 'Surplus'} <b>{peso(Math.abs(net))}</b></span>
            {r.borrowed > 0 && <span className="is-bad">Borrowed <b>{peso(r.borrowed)}</b></span>}
          </div>
          {other.length > 0 && <ul>{other.map((n, i) => <li key={i}>{n}</li>)}</ul>}
        </section>
        {s.centralBank && (
          <section className="paper-econ">
            <b>🏦 Bangko Sentral</b>
            <p>{s.centralBank.lastAction}</p>
            <p className="muted">₱{s.centralBank.peso.toFixed(2)} to the dollar · rate {s.centralBank.rate.toFixed(2)}%</p>
            {bank.length > 0 && <ul>{bank.map((n, i) => <li key={i}>{n}</li>)}</ul>}
          </section>
        )}
        {texts.length > 0 && (
          <section className="paper-econ">
            <b>📱 New texts · open the phone in the side bar to reply</b>
            <ul>{texts.map((m) => { const tpl = messageTemplate(m.tpl); return tpl ? <li key={m.id}><b>{fill(tpl.from, t)}</b>: {fill(tpl.text, t).slice(0, 90)}{fill(tpl.text, t).length > 90 ? '…' : ''}</li> : null; })}</ul>
          </section>
        )}
        {(achievements.length > 0 || promises.length > 0) && (
          <section className="paper-econ">
            <b>🏅 Achievements & promises</b>
            <ul>{[...achievements, ...promises].map((n, i) => <li key={i}>{n}</li>)}</ul>
          </section>
        )}
        {warnings.length > 0 && (
          <section className="paper-econ is-warn">
            <b>⚠ Babala · Warnings</b>
            <ul>{warnings.map((w) => <li key={w.id} className={w.level === 'danger' ? 'is-danger' : ''}><b>{w.title}.</b> {w.text}</li>)}</ul>
          </section>
        )}
        {people.length > 0 && (
          <section className="paper-econ">
            <b>👥 In the corridors</b>
            <ul>{people.map((n, i) => <li key={i}>{n}</li>)}</ul>
          </section>
        )}
      </div>
      <div className="wizard-foot">
        <span className="muted">Everything that happened last month, in one place.</span>
        <button className="btn btn--primary btn--small" onClick={() => setSeen(r.month)}>Read the Agenda</button>
      </div>
    </Modal>
  );
}

/** Approval in each region and class. */
export function PollsCard() {
  const s = useGameStore() as unknown as CampaignState;
  const polls = pollResults(s);
  const bar = (v: number) => (v >= 55 ? '#8fd19e' : v <= 35 ? '#e0806f' : '#d6b25e');
  return (
    <section className="card polls">
      <h3 className="section-title">Pulso ng Bayan · Polls</h3>
      {(['region', 'class'] as const).map((kind) => (
        <div key={kind} className="polls__group">
          <small>{kind === 'region' ? 'By region' : 'By class'}</small>
          {polls.filter((p) => p.kind === kind).map((p) => (
            <div key={p.id} className="polls__row">
              <span>{p.label}</span>
              <div className="polls__bar"><i style={{ width: `${p.value}%`, background: bar(p.value) }} /></div>
              <b>{Math.round(p.value)}%</b>
            </div>
          ))}
        </div>
      ))}
      <p className="muted">Elections count regions and classes, not the national average.</p>
    </section>
  );
}
