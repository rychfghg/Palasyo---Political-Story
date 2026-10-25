import { useMemo } from 'react';
import { useGameStore } from '@/features/game-engine/store/gameStore';
import { getParty } from '@/data/world/parties';
import { PARTY_LIST_GROUPS } from '@/data/government/congress';
import { StanceBadge, STANCE_COLOR } from '@/shared/components/ui/StanceBadge';
import type { Stance } from '@/features/game-engine/types/government';
import { Hemicycle, type HemicycleGroup } from './Hemicycle';

// Opposition sits on the left of the Speaker, the majority on the right.
const STANCES: Stance[] = ['opposition', 'neutral', 'ally'];
const LABEL: Record<Stance, string> = { ally: 'Majority coalition', neutral: 'Independents', opposition: 'Minority' };

export function HouseView() {
  const house = useGameStore((s) => s.government?.house);

  const summary = useMemo(() => {
    if (!house) return null;
    const by = (s: Stance) => house.blocs.filter((b) => b.stance === s).reduce((n, b) => n + b.seats, 0);
    return { ally: by('ally'), neutral: by('neutral'), opposition: by('opposition') };
  }, [house]);

  if (!house || !summary) return null;

  const majority = Math.floor(house.totalSeats / 2) + 1;
  const groups: HemicycleGroup[] = STANCES.flatMap((s) =>
    house.blocs
      .filter((b) => b.stance === s)
      .map((b) => ({
        key: b.label,
        label: b.label,
        seats: b.seats,
        color: b.kind === 'party' && b.partyId ? getParty(b.partyId)?.color ?? STANCE_COLOR[s] : b.kind === 'party-list' ? `${STANCE_COLOR[s]}bb` : '#8a95a3',
      })),
  );
  const legendGroups = groups.reduce<HemicycleGroup[]>((acc, g) => {
    const bloc = house.blocs.find((b) => b.label === g.key);
    if (bloc?.kind === 'party-list') {
      const key = `pl-${bloc.stance}`;
      const existing = acc.find((a) => a.key === key);
      if (existing) existing.seats += g.seats;
      else acc.push({ key, label: `Party-list (${bloc.stance === 'ally' ? 'admin' : bloc.stance})`, seats: g.seats, color: g.color });
    } else acc.push({ ...g });
    return acc;
  }, []);

  const speaker = house.leaders.find((l) => /Speaker/.test(l.role));
  const others = house.leaders.filter((l) => l !== speaker);
  const controls = summary.ally >= majority;

  return (
    <div className="stack congress">
      <header className="congress-banner">
        <div className="congress-banner__mace" aria-hidden>🏛</div>
        <div>
          <p className="kicker kicker--gold">Batasan · Maynilad</p>
          <h2>Kapulungan ng mga Kinatawan</h2>
          <p className="muted">The House of Representatives. It passes the budget first, and it alone can impeach a President.</p>
        </div>
      </header>

      <section className="congress-strip">
        <div><small>Members</small><b>{house.totalSeats}</b><em>{house.districtSeats} district · {house.partyListSeats} party-list</em></div>
        <div><small>Majority needed</small><b>{majority}</b><em>to pass any bill</em></div>
        <div className={controls ? 'is-good' : 'is-bad'}><small>Your coalition</small><b>{summary.ally}</b><em>{controls ? `${summary.ally - majority + 1} to spare` : `${majority - summary.ally} short`}</em></div>
        <div><small>Impeachment</small><b>{Math.ceil(house.totalSeats / 3)}</b><em>votes to impeach you (one third)</em></div>
        <div><small>Speaker</small><b className="congress-strip__name">{speaker?.name ?? '—'}</b><em>{speaker ? getParty(speaker.partyId)?.abbreviation : ''}</em></div>
      </section>

      <section className="session-hall">
        <div className="rostrum">
          <div className="rostrum__seal" aria-hidden>⚜</div>
          <span className="rostrum__role">Speaker of the House</span>
          <b>{speaker?.name ?? 'Vacant'}</b>
          <small>{speaker?.district}{speaker ? ` · ${getParty(speaker.partyId)?.abbreviation ?? ''}` : ''}</small>
        </div>
        <div className="session-hall__floor">
          <span className="session-hall__side session-hall__side--left">◀ Minority</span>
          <Hemicycle groups={legendGroups} label="Seats" rows={10} />
          <span className="session-hall__side session-hall__side--right">Majority ▶</span>
        </div>
        <div className="session-hall__tally">
          {STANCES.map((s) => (
            <div key={s} className={`bloc-total bloc-total--${s}`}>
              <StanceBadge stance={s} />
              <span>{LABEL[s]}</span>
              <b>{summary[s]}</b>
              <small>{((summary[s] / house.totalSeats) * 100).toFixed(0)}%</small>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h3 className="section-title">The leadership</h3>
        <div className="leaders-row">
          {others.map((l) => (
            <div key={l.role} className={`leader-plate leader-plate--${l.stance}`}>
              <span>{l.role}</span>
              <b>{l.name}</b>
              <small>{l.district} · {getParty(l.partyId)?.abbreviation}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="vote-board">
        <header>
          <span>Talaan ng mga Partido · Party roll</span>
          <span>Seats</span>
        </header>
        {house.blocs.filter((b) => b.kind !== 'party-list').sort((a, b) => b.seats - a.seats).map((b) => (
          <div key={b.label} className={`vote-board__row is-${b.stance}`}>
            <span className="badge" style={{ background: b.partyId ? getParty(b.partyId)?.color : '#6b6b6b' }}>{b.label}</span>
            <span>{b.partyId ? getParty(b.partyId)?.name : 'Unaffiliated district representatives'}</span>
            <b>{b.seats}</b>
            <StanceBadge stance={b.stance} />
          </div>
        ))}
        <header>
          <span>Party-list groups ({house.partyListSeats} seats)</span>
          <span />
        </header>
        {house.blocs.filter((b) => b.kind === 'party-list').sort((a, b) => b.seats - a.seats).map((b) => (
          <div key={b.label} className={`vote-board__row vote-board__row--small is-${b.stance}`}>
            <span className="vote-board__pl">{b.label}</span>
            <span className="muted">{PARTY_LIST_GROUPS.find((g) => g.name === b.label)?.sector}</span>
            <b>{b.seats}</b>
            <StanceBadge stance={b.stance} />
          </div>
        ))}
      </section>
    </div>
  );
}
