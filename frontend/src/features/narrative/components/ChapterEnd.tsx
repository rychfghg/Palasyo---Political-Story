import { useGameStore } from '@/features/game-engine/store/gameStore';
import { creditRating, debtToGdp, peso } from '@/features/economy/utils/finance';
import { INHERITED_ECONOMY } from '@/data/government/economy';
import { CHAPTER_1_TITLE } from '@/data/story/chapter1';
import type { FlagValue, Politics } from '@/features/narrative/types/event';
import type { Economy } from '@/features/game-engine/types/government';
import { Epilogue } from './Epilogue';
import { EndGameModal } from './EndGameModal';

interface Verdict {
  title: string;
  text: string;
}

/** Endings that cut the presidency short. */
const GAME_OVER: Record<string, Verdict> = {
  removed: { title: 'Removed from Office', text: 'Sixteen senators voted to convict. You are the first President of the Republic removed by impeachment. The Vice President took the oath within the hour. The cases the Ombudsman could not file while you were President can now be filed.' },
  resigned: { title: 'Resignation', text: 'You resigned the presidency. The Vice President now sits in the Palasyo. History will argue about whether you saved the country from something worse — or simply ran out of choices.' },
  ousted: { title: 'People Power', text: 'The people filled the avenue and the soldiers would not fire. Like the strongman before you, you left the Palasyo by helicopter at night.' },
  coup: { title: 'Ousted by the Military', text: 'The generals decided the Republic would be better off without you. The Constitution survived — barely. You did not.' },
};

/** A one-line characterization of the first half of the term, from the numbers and the choices. */
function verdict(e: Economy, p: Politics, flags: Record<string, FlagValue>): Verdict {
  if (flags.impeachment === 'impeached') return { title: 'The President on Trial', text: 'You enter the second half of your term facing a Senate impeachment trial. Everything now depends on sixteen votes.' };
  if (flags.house_lost && e.approval < 45) return { title: 'The Lame Duck', text: 'You have lost the House and the public. The second half will be a fight for survival.' };
  if (e.approval >= 60 && p.corruption <= 50) return { title: 'The Reformer Ascendant', text: 'The people trust you, and the numbers are with you. The powerful are afraid — and they will act.' };
  if (e.approval >= 55) return { title: 'The Popular Operator', text: 'You are loved and you get things done — but the cost has been counted in favors and envelopes.' };
  if (p.investor >= 60 && e.approval < 50) return { title: 'The Unloved Technocrat', text: 'Investors applaud. The people do not. The midterms made that clear.' };
  if (p.military >= 70 && p.courtTension >= 50) return { title: 'The Strongman in Waiting', text: 'The military is with you. The Court is not. The Republic is watching which way you turn.' };
  return { title: 'The Survivor', text: 'Three years of crises, compromises, and close calls. You are still standing. That, in this Palasyo, is not nothing.' };
}

export function ChapterEnd() {
  const { economy, politics, flags, laws, projects, courtRulings, justiceChanges, government, resolved, chapter, startChapter2 } = useGameStore();
  if (!economy || !government) return null;
  if ((chapter ?? 1) >= 2 && !flags.game_over) return <Epilogue />;
  const ending = flags.game_over ? GAME_OVER[String(flags.game_over)] : null;
  const v = ending ?? verdict(economy, politics, flags);
  const ratio = debtToGdp(economy);
  const startRatio = (INHERITED_ECONOMY.debt / INHERITED_ECONOMY.gdp) * 100;
  const senateAllies = government.senators.filter((s) => s.stance === 'ally').length;
  const houseAllies = government.house.blocs.filter((b) => b.stance === 'ally').reduce((n, b) => n + b.seats, 0);

  const threads: string[] = [];
  if (flags.impeachment === 'impeached') threads.push('Senate impeachment trial');
  if (flags.rival_open_war) threads.push(`Open war with ${flags.rival_name ?? 'your defeated rival'}`);
  if (flags.rival_blackmailed || flags.rival_leverage) threads.push(`You hold evidence against ${flags.rival_name ?? 'your rival'}`);
  if (flags.rival_movement) threads.push(`${flags.rival_name ?? 'Your rival'}’s Bantay Bayan movement (${flags.rival_movement})`);
  if (flags.vp_broker || flags.vp_rising_star) threads.push('The Vice President has become your indispensable broker — and a rising star');
  if (flags.operation_uncovered) threads.push('You and the VP have uncovered an operation against your government');
  if (flags.delapaz_arrested) threads.push('Former President Dela Paz is on trial for plunder');
  if (flags.fraud_narrative) threads.push('The opposition still claims the 2027 election was stolen');
  if (flags.hidden_debt === 'concealed') threads.push('The hidden ₱420B debt has not been disclosed');
  if (flags.brother_running) threads.push('Your brother is now your political enemy');
  if (flags.speaker_arrested) threads.push('The ex-Speaker is talking to prosecutors');
  if (flags.has_blackmail_files) threads.push('You kept the blackmail files');
  if (flags.pag_asa) threads.push(`Pag-asa Island: ${flags.pag_asa}`);
  if (flags.haizhou_collateral) threads.push('Haizhou holds a claim on patrimonial assets');
  if (flags.martial_law && !flags.martial_law_revoked) threads.push('Martial law in Hilagang Luzara');
  if (flags.took_bribe && !flags.confessed) threads.push('The Tiu money has not been forgotten');

  return (
    <article className="paper chapter-end">
      <p className="kicker">{ending ? 'Wakas ng Panunungkulan · The End of Your Presidency' : `${CHAPTER_1_TITLE} · Complete`}</p>
      <h2 className="paper__title">{v.title}</h2>
      <p>{v.text}</p>

      <div className="chapter-end__grid">
        <div><span>Approval</span><b>{Math.round(economy.approval)}%</b></div>
        <div><span>Debt</span><b>{peso(economy.debt)}</b><small>{ratio.toFixed(1)}% of GDP (from {startRatio.toFixed(1)}%)</small></div>
        <div><span>Credit rating</span><b>{creditRating(ratio).rating}</b></div>
        <div><span>Inflation</span><b>{economy.inflation.toFixed(1)}%</b></div>
        <div><span>House allies</span><b>{houseAllies} / {government.house.totalSeats}</b></div>
        <div><span>Senate allies</span><b>{senateAllies} / 24</b></div>
        <div><span>Laws signed</span><b>{laws.length}</b></div>
        <div><span>Projects</span><b>{projects.length}</b></div>
        <div><span>Court rulings</span><b>{courtRulings.filter((r) => r.upheld).length} won · {courtRulings.filter((r) => !r.upheld).length} lost</b></div>
        <div><span>Justices appointed</span><b>{justiceChanges.length}</b></div>
        <div><span>Decisions made</span><b>{Object.keys(resolved).length}</b></div>
      </div>

      {threads.length > 0 && (
        <>
          <h3 className="section-title">Carried into Chapter 2</h3>
          <ul className="memo__list">
            {threads.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </>
      )}

      {ending ? (
        <EndGameModal title={v.title} text={`Your presidency ended before your term did. ${v.text}`} />
      ) : (
        <div className="row row--end">
          <p className="muted">The second half of your term awaits — with everything you did in the first.</p>
          <button className="btn btn--primary" onClick={startChapter2}>Begin Chapter 2 →</button>
        </div>
      )}
    </article>
  );
}
