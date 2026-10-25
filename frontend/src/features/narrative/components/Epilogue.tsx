import { useGameStore, fullName } from '@/features/game-engine/store/gameStore';
import { creditRating, debtToGdp, peso } from '@/features/economy/utils/finance';
import { INHERITED_ECONOMY } from '@/data/government/economy';
import { CABINET_POSTS } from '@/data/government/cabinet';
import { REGIONS } from '@/data/world/regions';
import { fill, tokens } from '@/features/game-engine/engine/engine';
import type { CampaignState } from '@/features/game-engine/types/campaign';
import { ADVISER_POSTS } from '@/data/government/cabinet';
import { EndGameModal } from './EndGameModal';
import { HistoryBook } from '@/features/extras/components/RecordView';

const FATES: Record<string, { title: string; text: string }> = {
  imprisoned: { title: 'Bilanggo', text: 'The anti-graft court found you guilty of plunder. You were sentenced to reclusion perpetua and taken to the same penitentiary where you once sent others. Your portrait still hangs in the Palasyo’s gallery of presidents — the guides now pause before it.' },
  acquitted: { title: 'Pinawalang-sala', text: 'After eighteen months of trial, the court acquitted you. Half the country calls it vindication; the other half calls it a failure of justice. You walk out of the courtroom free — and forever defined by the trial.' },
  exile: { title: 'Sa Ibang Bayan', text: 'You live abroad now, with your family, in a country that will not send you back. A warrant for your arrest waits at every Kapuluan airport. You follow the news from home every morning, and you never stop wondering whether you could have gone back.' },
  self_exile: { title: 'Kusang Paglisan', text: 'No one charged you, but you left anyway. At home, your absence is its own verdict. Your supporters say you were tired; your critics say you were afraid.' },
  pardoned: { title: 'Pinatawad', text: 'Your successor pardoned you. You are free — but the pardon cost your successor dearly, and history will remember that you needed one.' },
  plea: { title: 'Ang Kasunduan', text: 'You pleaded guilty to a lesser charge, returned ₱900 million, and served four years of house arrest in {home}. You wrote a memoir. It did not sell well.' },
  senator: { title: 'Mula Palasyo Hanggang Senado', text: 'You took your oath as Senator — the first former President to sit in the Senate in generations. From the chamber where you once counted votes, you now cast them, and the country still listens when you rise to speak.' },
  legislator: { title: 'Mula Palasyo Hanggang Kongreso', text: 'You took your seat in Congress — the first former President to serve in the legislature in generations. From the back rows, you watch your successors make your mistakes, and occasionally your speeches still fill the gallery.' },
  free: { title: 'Pribadong Mamamayan', text: 'You went home. No charges came. You plant mango trees, hold your grandchildren, and give interviews every June 30 about what the presidency was really like.' },
};

export function Epilogue() {
  const state = useGameStore();
  const { player, economy, politics, flags, laws, projects, courtRulings, justiceChanges, resolved, cabinet } = state;
  if (!economy || !player) return null;

  const fateKey = String(flags.final_fate ?? 'free');
  const fate = FATES[fateKey] ?? FATES.free;
  const ratio = debtToGdp(economy);
  const startRatio = (INHERITED_ECONOMY.debt / INHERITED_ECONOMY.gdp) * 100;
  const t = tokens(state as unknown as CampaignState);
  const successor = t.successor;
  const opponent = t.opponent;

  const legacy: string[] = [];
  legacy.push(flags.successor_won ? `Your chosen successor, ${successor}, won the presidency.` : `${opponent} won the presidency.`);
  if (flags.own_race === 'won') legacy.push(flags.post_plan === 'senate' ? 'You were elected to the Senate.' : 'You were elected to Congress from your home district.');
  if (flags.own_race === 'lost') legacy.push(flags.post_plan === 'senate' ? 'You lost your race for the Senate.' : 'You lost your own race for Congress.');
  if (flags.served_through_trial) legacy.push('You fought the charges from your seat in Congress — and were acquitted.');
  if (flags.expelled) legacy.push('You were convicted while in office as a legislator and lost your seat.');
  const ROLE: Record<string, string> = {
    opposition_leader: 'In Congress, you became the leader of the opposition to the new government.',
    ally: 'In Congress, you became your successor’s most important ally.',
    senate_president: 'Your colleagues elected you Senate President.',
    speaker: 'Your colleagues elected you Speaker of the House.',
    statesman: 'In Congress, you became an independent voice both sides quote.',
  };
  if (flags.post_role && ROLE[String(flags.post_role)]) legacy.push(ROLE[String(flags.post_role)]);
  if (flags.spouse_race === 'won') legacy.push('Your spouse won a Senate seat — a new political dynasty is born.');
  if (flags.spouse_race === 'lost') legacy.push('Your spouse lost the Senate race.');
  if (flags.delapaz_imprisoned) legacy.push('Your predecessor remains in prison for plunder.');
  if (flags.delapaz_surrendered) legacy.push('Your predecessor stands trial at the international tribunal.');
  if (flags.reef_lost || flags.pag_asa === 'shared') legacy.push('Territory was lost on your watch.');
  if (flags.pag_asa === 'retaken' || flags.pag_asa === 'defended') legacy.push('You defended Pag-asa Island.');
  if (flags.assets_abroad) legacy.push('Investigators are still tracing assets you moved abroad.');

  const verdictLine = Math.round(economy.approval) >= 60 ? 'You leave office popular.' : Math.round(economy.approval) >= 40 ? 'You leave office with the country divided about you.' : 'You leave office deeply unpopular.';

  return (
    <article className="paper chapter-end">
      <p className="kicker">Wakas · {fullName(player)}, President of the Republic, 2027–2033</p>
      <h2 className="paper__title">{fate.title}</h2>
      <p>{fill(fate.text, t)}</p>
      <p className="story__variant">{verdictLine}</p>

      <div className="chapter-end__grid">
        <div><span>Final approval</span><b>{Math.round(economy.approval)}%</b></div>
        <div><span>Debt</span><b>{peso(economy.debt)}</b><small>{ratio.toFixed(1)}% of GDP (from {startRatio.toFixed(1)}%)</small></div>
        <div><span>Credit rating</span><b>{creditRating(ratio).rating}</b></div>
        <div><span>Corruption perception</span><b>{Math.round(politics.corruption)}</b></div>
        <div><span>Laws signed</span><b>{laws.length}</b></div>
        <div><span>Projects</span><b>{projects.length}</b></div>
        <div><span>Court rulings</span><b>{courtRulings.filter((r) => r.upheld).length} won · {courtRulings.filter((r) => !r.upheld).length} lost</b></div>
        <div><span>Justices appointed</span><b>{justiceChanges.length}</b></div>
        <div><span>Decisions made</span><b>{Object.keys(resolved).length}</b></div>
      </div>

      <h3 className="section-title">What history records</h3>
      <ul className="memo__list">
        {legacy.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>

      <h3 className="section-title">The regions</h3>
      <ul className="memo__list">
        {REGIONS.map((r) => {
          const built = projects.filter((p) => p.region === r.name);
          const national = projects.filter((p) => p.region === 'National').length;
          return (
            <li key={r.id}>
              <b>{r.name}:</b>{' '}
              {built.length
                ? `${built.map((p) => p.name).join(', ')} — ${built.every((p) => p.monthsLeft <= 0) ? 'completed' : 'still under construction'}.`
                : national
                  ? 'Shared in the national programs, but no signature project of its own.'
                  : 'Felt forgotten by Maynilad.'}
            </li>
          );
        })}
      </ul>

      <h3 className="section-title">The projects</h3>
      <ul className="memo__list">
        {projects.length === 0 ? <li>No major projects were started.</li> : projects.map((p) => (
          <li key={p.id}>{p.name} ({p.region}) — {p.monthsLeft <= 0 ? 'completed' : `${p.monthsLeft} months from completion; your successor decides its fate`}.</li>
        ))}
      </ul>

      <h3 className="section-title">The laws · {laws.length}</h3>
      <ul className="memo__list">
        {laws.slice(0, 12).map((l) => (
          <li key={l.id}>{l.name}</li>
        ))}
        {laws.length > 12 && <li>…and {laws.length - 12} more.</li>}
      </ul>

      <h3 className="section-title">The Cabinet</h3>
      <ul className="memo__list">
        {CABINET_POSTS.map((p) => {
          const seat = cabinet.find((c) => c.postId === p.id);
          const fired = !!flags[`fired_${p.id}`];
          return (
            <li key={p.id}>
              <b>{p.title}:</b> {seat?.nomineeId ? (fired ? 'served after a predecessor was removed.' : 'served to the end of the term.') : fired ? 'left in disgrace; the post ended vacant.' : (ADVISER_POSTS as readonly string[]).includes(p.id) ? 'never filled.' : 'never filled — acting officials ran the department.'}
            </li>
          );
        })}
      </ul>

      <HistoryBook s={state as unknown as CampaignState} />
      <EndGameModal title={fate.title} text={`Your six years are over. ${verdictLine} ${legacy[0] ?? ''}`} />
    </article>
  );
}
