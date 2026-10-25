import { useEffect, useMemo, useState } from 'react';
import { useGameStore } from '@/features/game-engine/store/gameStore';
import { availableChoices, check, EVENTS_BY_ID, fill, POLITICS_LABELS, tokens } from '@/features/game-engine/engine/engine';
import { CHAPTER_LAST_MONTH, monthLabel } from '@/features/game-engine/engine/calendar';
import { CHAPTER_2_SUBTITLE, CHAPTER_2_TITLE } from '@/data/story/chapter2';
import { CHAPTER_1_SUBTITLE, CHAPTER_1_TITLE } from '@/data/story/chapter1';
import { peso } from '@/features/economy/utils/finance';
import type { CampaignState, EventReport } from '@/features/game-engine/types/campaign';
import type { EventCategory, PoliticsKey } from '@/features/narrative/types/event';
import { ChapterEnd } from './ChapterEnd';
import { NationPulse } from './ClimatePanel';
import { Modal } from '@/shared/components/ui/Modal';
import { AdviserReactions } from '@/features/institutions/components/AdviserReactions';
import { FrontPage, PollsCard } from './FrontPage';
import { DraftingTable } from '@/features/extras/components/DraftingTable';
import { SituationMap, SocialTrends } from '@/features/extras/components/LiveWorld';

export const CATEGORY_LABEL: Record<EventCategory, string> = {
  family: 'Pamilya · Family',
  congress: 'Kongreso · Congress',
  cabinet: 'Gabinete · Cabinet',
  address: 'Talumpati · Address',
  crisis: 'Krisis · Crisis',
  calamity: 'Sakuna · Calamity',
  media: 'Media',
  scandal: 'Eskandalo · Scandal',
  diplomacy: 'Diplomasya · Diplomacy',
  court: 'Korte Suprema · Supreme Court',
  economy: 'Ekonomiya · Economy',
  society: 'Lipunan · Society',
  election: 'Halalan · Election',
  chapter: 'Kabanata · Chapter',
};

const CATEGORY_COLOR: Record<EventCategory, string> = {
  family: '#a0672f',
  congress: '#2f5fa7',
  cabinet: '#6b5a2f',
  address: '#b38a2e',
  crisis: '#c0392b',
  calamity: '#3d7ab8',
  media: '#8a4fa3',
  scandal: '#d0402f',
  diplomacy: '#2c8a7d',
  court: '#6b4fa0',
  economy: '#7d8a2c',
  society: '#b0603a',
  election: '#2f5fa7',
  chapter: '#d6b25e',
};

const useCampaign = () => useGameStore() as unknown as CampaignState;

function EventCard({ eventId }: { eventId: string }) {
  const s = useCampaign();
  const choose = useGameStore((x) => x.choose);
  const openCurrentEvent = useGameStore((x) => x.openCurrentEvent);
  const event = EVENTS_BY_ID[eventId];

  useEffect(() => {
    openCurrentEvent(eventId);
  }, [eventId, openCurrentEvent]);

  const t = useMemo(() => tokens(s), [s]);
  if (!event) return null;
  const ctx = s.context?.eventId === eventId ? s.context : undefined;
  const variants = (event.variants ?? []).filter((v) => v.when.every((c) => check(s, c)));
  const choices = availableChoices(s, event);

  return (
    <article className="paper event" key={event.id}>
      <header className="event__head">
        <span className="event__cat" style={{ background: CATEGORY_COLOR[event.category] }}>{CATEGORY_LABEL[event.category]}</span>
        <span className="event__date">{monthLabel(s.month)} · {fill(event.location, t)}</span>
      </header>
      <h2 className="paper__title">{fill(event.title, t)}</h2>
      {event.speaker && <p className="event__speaker">With {fill(event.speaker, t)}</p>}
      <div className="story__body">
        {event.body.map((p, i) => (
          <p key={i} style={{ animationDelay: `${i * 0.2}s` }}>{fill(p, t)}</p>
        ))}
        {variants.map((v, i) => (
          <p key={`v${i}`} className="story__variant">{fill(v.text, t)}</p>
        ))}
      </div>

      {ctx?.ruling && event.court && (
        <div className={`ruling ${ctx.ruling.upheld ? 'ruling--upheld' : 'ruling--struck'}`}>
          <span className="kicker">{fill(event.court.title, t)}</span>
          <b>{ctx.ruling.upheld ? 'UPHELD' : 'STRUCK DOWN'}</b>
          <span>Voting {ctx.ruling.yes}–{ctx.ruling.no}. {ctx.ruling.upheld ? 'The government’s position stands.' : 'The Court rules against the government.'}</span>
        </div>
      )}

      {ctx?.outcome && (
        <div className={`ruling ${ctx.outcome.success ? 'ruling--upheld' : 'ruling--struck'}`}>
          <b>{ctx.outcome.title}</b>
          {ctx.outcome.lines.map((l, i) => (
            <span key={i}>{fill(l, t)}</span>
          ))}
        </div>
      )}

      {ctx?.midterm && (
        <div className="midterm">
          <div>
            <span className="kicker">Senate seats won by your slate</span>
            <b className="serif-lg">{ctx.midterm.seatsWon} of 12</b>
          </div>
          <div>
            <span className="kicker">New Senate</span>
            <p>
              <b className="c-ally">{ctx.midterm.senateAfter.ally ?? 0}</b> administration · <b className="c-neutral">{ctx.midterm.senateAfter.neutral ?? 0}</b> independent ·{' '}
              <b className="c-opp">{ctx.midterm.senateAfter.opposition ?? 0}</b> opposition
            </p>
          </div>
          <div>
            <span className="kicker">House</span>
            <p>{ctx.midterm.houseShift >= 0 ? `+${ctx.midterm.houseShift} seats for your coalition` : `${ctx.midterm.houseShift} seats lost by your coalition`}</p>
          </div>
        </div>
      )}

      {event.draft && <DraftingTable event={event} />}
      {!event.draft && <ul className="choices">
        {choices.map((c) => (
          <li key={c.id}>
            <button className="choice" onClick={() => choose(event.id, c.id)}>
              <b>{fill(c.label, t)}</b>
              <span>{fill(c.description, t)}</span>
              {c.effects.spend ? <small className="choice__cost">Cost: {peso(c.effects.spend)}</small> : null}
              {c.effects.vote ? <small className="choice__cost">Goes to a vote in Congress</small> : null}
            </button>
          </li>
        ))}
      </ul>}
    </article>
  );
}

function ReportCard({ report, onClose }: { report: EventReport; onClose: () => void }) {
  const event = EVENTS_BY_ID[report.eventId];
  const choice = event?.choices.find((c) => c.id === report.choiceId);
  const t = tokens(useCampaign());

  return (
    <article className="paper event report">
      <header className="event__head">
        {event && <span className="event__cat" style={{ background: CATEGORY_COLOR[event.category] }}>{CATEGORY_LABEL[event.category]}</span>}
        <span className="event__date">{event ? fill(event.title, t) : ''}</span>
      </header>
      {choice && <p className="story__chosen">▸ {fill(choice.label, t)}</p>}
      <p>{report.outcome}</p>

      {report.vote && (
        <div className={`vote ${report.vote.passed ? 'vote--pass' : 'vote--fail'}`}>
          <span className="kicker">{report.vote.bill}</span>
          <b>{report.vote.passed ? 'APPROVED' : `DEFEATED${report.vote.failedIn ? ` IN THE ${report.vote.failedIn.toUpperCase()}` : ''}`}</b>
          <span>
            House {report.vote.houseYes}–{report.vote.houseNo}
            {report.vote.senateYes + report.vote.senateNo > 0 && <> · Senate {report.vote.senateYes}–{report.vote.senateNo}</>}
          </span>
        </div>
      )}

      {report.headline && <p className="headline headline--sm">{report.headline}</p>}

      {report.reactions.length > 0 && (
        <ul className="reactions">
          {report.reactions.map((r, i) => (
            <li key={i} className={`reaction reaction--${r.mood}`}>
              <b>{r.who}</b>
              <span>“{r.text}”</span>
            </li>
          ))}
        </ul>
      )}

      {report.notes.length > 0 && (
        <ul className="notes">
          {report.notes.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      )}

      {report.deltas.length > 0 && (
        <div className="deltas">
          {report.deltas.map((d) => (
            <span key={d.label} className={d.good ? 'is-good' : 'is-bad'}>
              {d.label} <b>{d.value}</b>
            </span>
          ))}
        </div>
      )}

      <div className="row row--end">
        <button className="btn btn--primary" onClick={onClose}>Continue →</button>
      </div>
    </article>
  );
}

function MonthDone() {
  const s = useCampaign();
  const endMonth = useGameStore((x) => x.endMonth);
  const vacancies = s.cabinet.filter((c) => !c.nomineeId).length;
  const last = s.month >= CHAPTER_LAST_MONTH[s.chapter ?? 1];
  return (
    <article className="card month-done">
      <span className="kicker kicker--gold">{monthLabel(s.month)}</span>
      <h3>The desk is clear.</h3>
      <p className="muted">
        No more urgent matters this month. When you end the month, taxes come in, the budget is spent, projects advance, and anything the Treasury
        cannot cover is borrowed.
      </p>
      {vacancies > 0 && <p className="alert alert--info">{vacancies} Cabinet posts are still vacant — acting officials are running those departments.</p>}
      {!last && (
        <button className="btn btn--primary" onClick={endMonth}>
          End {s.month < 0 ? 'the transition' : monthLabel(s.month)} →
        </button>
      )}
    </article>
  );
}

const GAUGES: PoliticsKey[] = ['capital', 'cohesion', 'cabinetCohesion', 'media', 'protest', 'corruption', 'crime', 'ombudsman', 'courtTension', 'sovereignty', 'investor', 'church', 'tribes', 'military', 'family'];

function Gauges() {
  const politics = useGameStore((x) => x.politics);
  return (
    <section className="card">
      <h3 className="section-title">Political climate</h3>
      <ul className="gauges">
        {GAUGES.map((k) => {
          const meta = POLITICS_LABELS[k];
          const v = Math.round(politics[k]);
          const good = meta.higherIsGood ? v >= 55 : v <= 45;
          const bad = meta.higherIsGood ? v <= 35 : v >= 65;
          return (
            <li key={k}>
              <span>{meta.label}</span>
              <div className="gauge"><i className={good ? 'is-good' : bad ? 'is-bad' : ''} style={{ width: `${v}%` }} /></div>
              <b>{v}</b>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Headlines() {
  const news = useGameStore((x) => x.news);
  if (!news.length) return null;
  return (
    <section className="card">
      <h3 className="section-title">Pahayagang Liwayway</h3>
      <ul className="news">
        {news.slice(0, 5).map((n, i) => (
          <li key={i}>
            <small>{monthLabel(n.month)}</small>
            <b>{n.headline}</b>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function AgendaView() {
  const s = useCampaign();
  const refreshQueue = useGameStore((x) => x.refreshQueue);
  const dismissReport = useGameStore((x) => x.dismissReport);
  const [showVitals, setShowVitals] = useState(false);

  // Saves made before the story engine existed start with an empty queue.
  useEffect(() => {
    if (s.month <= 0 && s.queue.length === 0 && Object.keys(s.resolved).length === 0) refreshQueue();
  }, [s.month, s.queue.length, s.resolved, refreshQueue]);

  if (s.chapterComplete) return <ChapterEnd />;

  const ch2 = (s.chapter ?? 1) >= 2;
  const progress = ch2 ? Math.min(100, ((s.month - 35) / 36) * 100) : Math.max(0, Math.min(100, ((s.month + 1) / (CHAPTER_LAST_MONTH[1] + 2)) * 100));

  return (
    <div className="agenda">
      <div className="stack">
        <header className="chapter-bar">
          <div>
            <span className="kicker kicker--gold">{ch2 ? CHAPTER_2_TITLE : CHAPTER_1_TITLE}</span>
            <p className="muted">{ch2 ? CHAPTER_2_SUBTITLE : CHAPTER_1_SUBTITLE}</p>
          </div>
          <div className="chapter-bar__progress" title={monthLabel(s.month)}>
            <i style={{ width: `${progress}%` }} />
          </div>
          <button className="btn btn--ghost btn--small btn--light" onClick={() => setShowVitals(true)}>Vital signs</button>
          <span className="chapter-bar__count">
            {s.queue.length > 0 ? `${s.queue.length} matter${s.queue.length > 1 ? 's' : ''} awaiting you` : 'No pending matters'}
          </span>
        </header>
        {!s.lastReport && <FrontPage />}
        {s.lastReport ? (
          <>
            <ReportCard report={s.lastReport} onClose={dismissReport} />
            <AdviserReactions />
          </>
        ) : s.queue.length > 0 ? (
          <EventCard eventId={s.queue[0]} />
        ) : (
          <MonthDone />
        )}
      </div>
      {showVitals && (
        <Modal title="Vital signs of the nation" onClose={() => setShowVitals(false)}>
          <NationPulse />
          <p className="muted">Trends over the last twelve months. Green lines are moving the right way; red lines the wrong way.</p>
        </Modal>
      )}
      <aside className="stack">
        <PollsCard />
        <SituationMap />
        <SocialTrends />
        <Gauges />
        <Headlines />
      </aside>
    </div>
  );
}
