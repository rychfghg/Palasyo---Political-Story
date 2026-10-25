import type { CampaignState } from '../types/campaign';
import { monthLabel } from './calendar';

/** Badges earned during the presidency. Each unlocks once and is remembered with its date. */
export const ACHIEVEMENTS: { id: string; icon: string; title: string; text: string; check: (s: CampaignState) => boolean }[] = [
  { id: 'first_law', icon: '📜', title: 'Lawmaker', text: 'Sign your first law.', check: (s) => s.laws.length >= 1 },
  { id: 'ten_laws', icon: '⚖️', title: 'Legislative Legend', text: 'Sign ten laws.', check: (s) => s.laws.length >= 10 },
  { id: 'full_cabinet', icon: '🏛️', title: 'Full House', text: 'Fill every Cabinet and adviser post.', check: (s) => s.cabinet.length > 0 && s.cabinet.every((c) => c.nomineeId) },
  { id: 'popular', icon: '🌟', title: 'Beloved', text: 'Reach 70% approval.', check: (s) => (s.economy?.approval ?? 0) >= 70 },
  { id: 'debt_slayer', icon: '🗡️', title: 'Debt Slayer', text: 'Bring the debt below 55% of GDP.', check: (s) => !!s.economy && (s.economy.debt / s.economy.gdp) * 100 < 55 },
  { id: 'surplus', icon: '💰', title: 'In the Black', text: 'Finish a calendar year with a surplus.', check: (s) => Object.entries(s.yearBook ?? {}).some(([y, b]) => Number(y) < 2027 + Math.floor((s.month + 6) / 12) && b.taxes + b.investments + b.oneOffIncome > b.operations + b.interest + b.projects + b.oneOffSpend + b.debtRepaid + (b.principal ?? 0)) },
  { id: 'investor', icon: '🏗️', title: 'Builder', text: 'Own ten earning investments.', check: (s) => (s.assets ?? []).filter((a) => !a.failed && a.startedMonth <= s.month).length >= 10 },
  { id: 'low_inflation', icon: '🧺', title: 'Steady Prices', text: 'Keep inflation under 3%.', check: (s) => (s.economy?.inflation ?? 9) < 3 },
  { id: 'jobs', icon: '👷', title: 'Jobs, Jobs, Jobs', text: 'Bring unemployment under 4.5%.', check: (s) => (s.economy?.unemployment ?? 9) < 4.5 },
  { id: 'clean', icon: '🧼', title: 'Clean Hands', text: 'Drive corruption perception below 30.', check: (s) => s.politics.corruption < 30 },
  { id: 'coup_survivor', icon: '🛡️', title: 'Survived a Coup', text: 'Defeat a coup attempt.', check: (s) => !!s.flags.coup_foiled },
  { id: 'spy_hunter', icon: '🕵️', title: 'Spy Hunter', text: 'Catch the spy in your Cabinet.', check: (s) => !!s.flags.spy_caught },
  { id: 'peso_strong', icon: '₱', title: 'Strong Peso', text: 'See the peso below ₱55 to the dollar.', check: (s) => (s.centralBank?.peso ?? 99) < 55 },
  { id: 'promise_keeper', icon: '🤝', title: 'Promise Keeper', text: 'Keep three SONA promises.', check: (s) => (s.promises ?? []).filter((p) => p.kept).length >= 3 },
  { id: 'diplomat', icon: '🌏', title: 'Statesman', text: 'Become a close ally of three countries.', check: (s) => Object.values(s.relations ?? {}).filter((v) => v >= 70).length >= 3 },
  { id: 'governors', icon: '🗺️', title: 'Kingmaker', text: 'Have eight allied governors.', check: (s) => (s.governors ?? []).filter((g) => g.stance === 'ally').length >= 8 },
  { id: 'family', icon: '🏠', title: 'Family First', text: 'Keep family harmony above 80.', check: (s) => s.politics.family >= 80 },
  { id: 'full_term', icon: '🎖️', title: 'Six Years', text: 'Finish your full term.', check: (s) => s.month >= 71 && !s.flags.game_over },
];

/** Checks for newly earned badges each month. */
export function achievementsTick(s: CampaignState, notes: string[]) {
  for (const a of ACHIEVEMENTS) {
    if (s.flags[`ach_${a.id}`] !== undefined) continue;
    if (a.check(s)) {
      s.flags = { ...s.flags, [`ach_${a.id}`]: s.month };
      notes.push(`🏅 Achievement unlocked: ${a.title} — ${a.text}`);
    }
  }
}

export function earned(s: CampaignState) {
  return ACHIEVEMENTS.map((a) => ({ ...a, month: s.flags[`ach_${a.id}`] as number | undefined }));
}

/** How the history textbooks will describe this presidency, written from what actually happened. */
export function historyBook(s: CampaignState): { era: string; paragraphs: string[] } {
  const e = s.economy!;
  const p = s.politics;
  const name = s.player ? `${s.player.firstName} ${s.player.lastName}` : 'The President';
  const last = s.player?.lastName ?? 'the President';
  const ratio = (e.debt / e.gdp) * 100;
  const start = s.debtTally?.start ? (s.debtTally.start / e.gdp) * 100 : 62.8;
  const f = s.flags;
  const era =
    f.game_over === 'coup' ? `The ${last} Interruption`
      : f.game_over ? `The ${last} Collapse`
        : e.approval >= 60 && p.corruption <= 45 ? `The ${last} Renewal`
          : (e.growth ?? 5) >= 6.5 ? `The ${last} Boom`
            : p.corruption >= 65 ? `The ${last} Years of Plunder`
              : p.sovereignty >= 75 ? `The ${last} Years of the West Sea`
                : `The ${last} Era`;
  const out: string[] = [];
  out.push(`${name} took office in 2027 inheriting a growing but indebted Republic. ${f.game_over ? `The presidency ended early, ${f.game_over === 'coup' ? 'toppled by the military' : f.game_over === 'removed' ? 'cut short by impeachment' : f.game_over === 'ousted' ? 'swept away by People Power' : 'with a resignation'}.` : s.month >= 71 ? 'The administration served its full six years.' : `The administration is still in office as of ${monthLabel(s.month)}.`}`);
  out.push(`On the economy, ${(e.growth ?? 5) >= 6 ? 'growth was strong' : (e.growth ?? 5) >= 4.5 ? 'growth was steady' : 'growth disappointed'}, inflation ended near ${e.inflation.toFixed(1)}%, and the debt ${ratio < start - 1 ? `fell from ${start.toFixed(0)}% to ${ratio.toFixed(0)}% of GDP` : ratio > start + 1 ? `rose from ${start.toFixed(0)}% to ${ratio.toFixed(0)}% of GDP` : `held near ${ratio.toFixed(0)}% of GDP`}. ${(s.assets ?? []).filter((a) => !a.failed).length >= 8 ? 'Historians credit the administration with a wave of income-earning public investments — airports, ports, and hubs that paid off for years.' : ''}`);
  const laws = s.laws.slice(0, 4).map((l) => l.name);
  if (laws.length) out.push(`Its legislative record includes the ${laws.join(', the ')}${s.laws.length > 4 ? `, and ${s.laws.length - 4} other laws` : ''}.`);
  const scandals: string[] = [];
  if (f.took_bribe) scandals.push('a bribe from a contractor');
  if (f.ch2_cover_up || f.obstruction) scandals.push('cover-ups');
  if (f.blackmail_paid) scandals.push('a blackmail payment');
  if (f.hid_illness) scandals.push('a hidden illness');
  if (f.troll_army) scandals.push('a paid troll army');
  if (f.cronyism) scandals.push('contracts for friends');
  out.push(scandals.length ? `The period is also remembered for ${scandals.join(', ')}.` : p.corruption <= 45 ? 'It is remembered as unusually clean by the standards of its time.' : 'Corruption remained a stubborn part of public life.');
  if (f.coup_foiled) out.push('In a dramatic night, the government survived a military coup attempt.');
  if (f.spy_caught) out.push('Counter-intelligence exposed a foreign spy at the heart of the Cabinet.');
  if (f.party_split) out.push('The ruling coalition split in two before the end of the term.');
  out.push(e.approval >= 60 ? `${last} left office popular, and schoolchildren today learn the name with respect.` : e.approval >= 40 ? `The country remains divided over the ${last} years.` : `${last} left office deeply unpopular; the textbooks are not kind.`);
  return { era, paragraphs: out };
}
