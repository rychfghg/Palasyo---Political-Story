import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/features/game-engine/store/gameStore';
import type { CampaignState } from '@/features/game-engine/types/campaign';
import { seededRandom } from '@/features/game-engine/utils/random';
import { Portrait } from '@/shared/components/ui/Portrait';

interface Heir {
  id: string;
  name: string;
  tagline: string;
  bonus: number;
  money: number;
}
interface Card {
  id: string;
  title: string;
  text: string;
  options: { label: string; support: number; money: number; risk?: number; note: string }[];
  when?: (s: CampaignState) => boolean;
}

/** Your record follows your family: approval, how the presidency ended, and the scandals. */
function legacyStart(s: CampaignState) {
  const e = s.economy;
  const f = s.flags;
  let base = 30 + ((e?.approval ?? 50) - 50) * 0.4;
  const notes: string[] = [];
  const fate = String(f.final_fate ?? '');
  if (fate === 'imprisoned') { base -= 14; notes.push('Your conviction hangs over the family name (−14).'); }
  if (fate === 'exile' || fate === 'self_exile') { base -= 8; notes.push('Your life abroad makes voters suspicious (−8).'); }
  if (fate === 'senator' || fate === 'legislator') { base += 6; notes.push('Your seat in Congress keeps the machine running (+6).'); }
  if (f.game_over) { base -= 10; notes.push(`Your presidency ended early (−10).`); }
  if (f.successor_won) { base += 5; notes.push('Your camp still holds the Palasyo (+5).'); }
  const dirty = ['took_bribe', 'ch2_cover_up', 'obstruction', 'blackmail_paid', 'troll_army', 'cronyism'].filter((k) => f[k]).length;
  if (dirty) { base -= dirty * 3; notes.push(`Old scandals resurface (−${dirty * 3}).`); }
  if ((e?.approval ?? 50) >= 60) notes.push('You left office popular — a strong name to carry.');
  return { base: Math.max(8, Math.min(60, base)), notes };
}

const HEIRS = (s: CampaignState): Heir[] => [
  { id: 'bea', name: `Bea ${s.player?.lastName}`, tagline: 'The idealist. Former student activist, now a human-rights lawyer.', bonus: s.politics.family >= 60 ? 4 : 0, money: 60 },
  { id: 'migo', name: `Migo ${s.player?.lastName}`, tagline: 'The businessman. Tech founder with money and a past.', bonus: s.flags.migo_coverup ? -6 : s.flags.migo_charged ? -2 : 2, money: 140 },
  { id: 'tessa', name: `Tessa ${s.player?.lastName}`, tagline: s.flags.tessa_governor ? 'The governor. Runs your home province with an iron hand.' : 'The sister. A provincial organizer who knows every mayor.', bonus: s.flags.tessa_governor ? 5 : 0, money: 100 },
];

const SENATE: Card[] = [
  { id: 'brand', title: 'Ang Pangalan', text: 'Your campaign manager asks the first question: run on the family name, or build a new identity?', options: [
    { label: 'Run on the family name', support: 6, money: 0, note: 'Recognition — and baggage.' },
    { label: 'Build a new identity', support: 2, money: -20, note: 'Slower, cleaner.' },
    { label: 'Run against the old administration', support: 4, money: 0, risk: 0.1, note: 'Bold. The family is hurt.' },
  ] },
  { id: 'party', title: 'Ang Partido', text: 'Three parties want you on their Senate slate for 2036.', options: [
    { label: 'Your parent’s old party', support: 4, money: 30, note: 'Machinery and money.' },
    { label: 'The reformist coalition', support: 3, money: 10, note: 'Credibility with young voters.' },
    { label: 'Run as an independent', support: 1, money: -10, note: 'Free, but alone.' },
  ] },
  { id: 'scandal', title: 'Bumalik ang Nakaraan', text: 'A news site digs up the old scandals of your parent’s presidency and asks you to answer for them.', when: (s) => ['took_bribe', 'ch2_cover_up', 'obstruction', 'blackmail_paid', 'troll_army', 'cronyism'].some((k) => s.flags[k]), options: [
    { label: 'Apologize on the family’s behalf', support: 5, money: 0, note: 'Painful, but it ends the story.' },
    { label: 'Defend your parent', support: -3, money: 0, risk: 0.15, note: 'Loyal. Risky.' },
    { label: '“I am not my parent.”', support: 2, money: 0, note: 'Distance.' },
  ] },
  { id: 'ads', title: 'Ang Kampanya', text: 'The last three months. Where does the money go?', options: [
    { label: 'TV and radio ads nationwide', support: 5, money: -50, note: 'Expensive, effective.' },
    { label: 'Town halls in every province', support: 4, money: -15, note: 'Tiring, personal.' },
    { label: 'Social media and influencers', support: 3, money: -10, risk: 0.08, note: 'Cheap; can backfire.' },
  ] },
];

const PRESIDENT: Card[] = [
  { id: 'decide', title: 'Ang Pagpapasya', text: 'It is 2038. Allies say the country is ready for another one from your family. Will they run for President in 2039?', options: [
    { label: 'Run for President', support: 0, money: 0, note: 'The family business.' },
  ] },
  { id: 'mate', title: 'Ang Kapareha', text: 'Choose a running mate.', options: [
    { label: 'A popular TV host', support: 5, money: 20, risk: 0.08, note: 'Votes now, gaffes later.' },
    { label: 'A respected economist', support: 3, money: 0, note: 'Investors approve.' },
    { label: 'A governor from Mindara', support: 4, money: 10, note: 'Wins the south.' },
  ] },
  { id: 'debate', title: 'Ang Debate', text: 'The presidential debate. Your rival attacks the family’s record.', options: [
    { label: 'Answer calmly with your own plans', support: 4, money: 0, note: 'Presidential.' },
    { label: 'Hit back at the rival’s own scandals', support: 2, money: 0, risk: 0.1, note: 'Exciting. Messy.' },
    { label: 'Make it personal and emotional', support: 3, money: 0, note: 'Tears trend online.' },
  ] },
  { id: 'buying', title: 'Ang Alok', text: 'A provincial boss offers to deliver 300,000 votes — for ₱80M in “logistics.”', options: [
    { label: 'Refuse', support: 0, money: 0, note: 'Clean.' },
    { label: 'Pay', support: 6, money: -80, risk: 0.25, note: 'If it leaks, it is over.' },
  ] },
  { id: 'final', title: 'Huling Linggo', text: 'One week left. The polls say it is close.', options: [
    { label: 'A grand final rally in Maynilad', support: 3, money: -30, note: 'The crowd is the message.' },
    { label: 'Visit the provinces you are losing', support: 4, money: -20, note: 'Chase every vote.' },
    { label: 'Rest, and let the machine work', support: 1, money: 0, note: 'Save your voice.' },
  ] },
];

/**
 * Chapter 3 — Ang Susunod na Henerasyon. Your heir runs for the Senate in 2036 and, if they win,
 * for President in 2039. Your presidency decides where they start.
 */
export function LegacyGame() {
  const s = useGameStore() as unknown as CampaignState;
  const setFlag = useGameStore((x) => x.setFlag);
  const navigate = useNavigate();
  const start = useMemo(() => legacyStart(s), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [heir, setHeir] = useState<Heir | null>(null);
  const [stage, setStage] = useState<'senate' | 'senateResult' | 'president' | 'end'>('senate');
  const [step, setStep] = useState(0);
  const [support, setSupport] = useState(0);
  const [money, setMoney] = useState(0);
  const [risk, setRisk] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const [result, setResult] = useState<{ senate?: boolean; president?: boolean; scandal?: boolean }>({});

  if (!s.player || !s.economy) return <section className="center-stage"><p className="muted">Finish a presidency first.</p></section>;
  const last = s.player.lastName;
  const r = seededRandom(`${s.player.firstName}${last}:legacy:${heir?.id ?? ''}`);
  const cards = (stage === 'president' ? PRESIDENT : SENATE).filter((c) => !c.when || c.when(s));
  const card = cards[step];

  const pick = (o: Card['options'][number]) => {
    setSupport(support + o.support);
    setMoney(money + o.money);
    setRisk(risk + (o.risk ?? 0));
    setLog([...log, `${card.title}: ${o.label}`]);
    if (step + 1 < cards.length) return setStep(step + 1);
    if (stage === 'senate') {
      const scandal = r() < risk + (o.risk ?? 0) * 0.6;
      const score = support + o.support + (money + o.money < 0 ? -6 : 0) + (scandal ? -10 : 0) + (r() - 0.5) * 10;
      const won = score >= 44;
      setResult({ senate: won, scandal });
      setStage('senateResult');
    } else {
      const scandal = r() < risk + (o.risk ?? 0) * 0.6;
      const rival = 47 + r() * 8;
      const score = support + o.support + (money + o.money < 0 ? -5 : 0) + (scandal ? -12 : 0) + (r() - 0.5) * 8;
      const won = score > rival;
      setResult({ ...result, president: won, scandal: result.scandal || scandal });
      setFlag('ch3_result', won ? 'president' : 'senator');
      setStage('end');
    }
  };

  // Choosing an heir.
  if (!heir) {
    return (
      <section className="legacy">
        <header className="legacy__head">
          <p className="kicker kicker--gold">Kabanata 3 · Ang Susunod na Henerasyon</p>
          <h2>The Next Generation</h2>
          <p className="muted">Years after you left the Palasyo, someone in your family wants to run. Your record decides where they start: <b>{Math.round(start.base)}%</b> support.</p>
          <ul className="legacy__notes">{start.notes.map((n) => <li key={n}>{n}</li>)}</ul>
        </header>
        <div className="legacy__heirs">
          {HEIRS(s).map((h) => (
            <button key={h.id} className="legacy__heir" onClick={() => { setHeir(h); setSupport(start.base + h.bonus); setMoney(h.money); }}>
              <Portrait name={h.name} size={88} />
              <b>{h.name}</b>
              <small>{h.tagline}</small>
              <em>{h.bonus >= 0 ? '+' : ''}{h.bonus} support · ₱{h.money}M campaign fund</em>
            </button>
          ))}
        </div>
      </section>
    );
  }

  const meter = (
    <div className="legacy__meter">
      <Portrait name={heir.name} size={64} mood={support >= 45 ? 'happy' : support < 35 ? 'worried' : 'neutral'} />
      <div>
        <b>{heir.name}</b>
        <div className="legacy__bar"><i style={{ width: `${Math.max(0, Math.min(100, support))}%` }} /><em style={{ left: stage === 'president' ? '50%' : '44%' }} /></div>
        <small>Support {Math.round(support)}% · Campaign fund ₱{money}M{money < 0 ? ' (in debt!)' : ''} · Scandal risk {Math.round(risk * 100)}%</small>
      </div>
    </div>
  );

  if (stage === 'senateResult') {
    return (
      <section className="legacy">
        {meter}
        <article className="legacy__card is-result">
          <p className="kicker">Halalan 2036 · Senate</p>
          <h3>{result.senate ? `${heir.name} wins a Senate seat!` : `${heir.name} loses the Senate race.`}</h3>
          <p>{result.scandal ? 'A late scandal hurt the campaign. ' : ''}{result.senate ? `${heir.name} places in the top twelve. The ${last} name is back in national politics.` : 'The family name was not enough this time. Some say it was too much.'}</p>
          {result.senate ? (
            <button className="btn btn--primary" onClick={() => { setStage('president'); setStep(0); setRisk(0); }}>Continue to 2039 →</button>
          ) : (
            <button className="btn btn--primary" onClick={() => { setFlag('ch3_result', 'lost'); setStage('end'); }}>See how it ends</button>
          )}
        </article>
      </section>
    );
  }

  if (stage === 'end') {
    const line = result.president
      ? `${heir.name} is elected President of the Republic in 2039 — the second ${last} in the Palasyo. Historians will argue whether it is a dynasty or a legacy.`
      : result.senate
        ? `${heir.name} serves in the Senate but loses the 2039 presidential race. The ${last} name remains a force — just not the force in the Palasyo.`
        : `${heir.name} returns to private life. The ${last} era in politics is over.`;
    return (
      <section className="legacy">
        {meter}
        <article className="legacy__card is-result">
          <p className="kicker">Wakas ng Kabanata 3</p>
          <h3>{result.president ? 'Ang Ikalawang Palasyo' : result.senate ? 'Ang Senador' : 'Ang Pagbabalik sa Bahay'}</h3>
          <p>{line}</p>
          <ul className="legacy__log">{log.map((l) => <li key={l}>{l}</li>)}</ul>
          <div className="row">
            <button className="btn btn--ghost btn--light" onClick={() => navigate('/', { state: { clearSave: true } })}>Exit to main menu</button>
            <button className="btn btn--primary" onClick={() => navigate('/new')}>Play a new presidency</button>
          </div>
        </article>
      </section>
    );
  }

  return (
    <section className="legacy">
      {meter}
      <article className="legacy__card" key={`${stage}-${step}`}>
        <p className="kicker">{stage === 'president' ? 'Halalan 2039 · President' : 'Halalan 2036 · Senate'} · {step + 1} of {cards.length}</p>
        <h3>{card.title}</h3>
        <p>{card.text}</p>
        <div className="legacy__options">
          {card.options.map((o) => (
            <button key={o.label} className="choice choice--dark" onClick={() => pick(o)}>
              <b>{o.label}</b>
              <span>{o.note}</span>
            </button>
          ))}
        </div>
      </article>
    </section>
  );
}
