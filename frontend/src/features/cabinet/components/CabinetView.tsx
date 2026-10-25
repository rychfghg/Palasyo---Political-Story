import { useState } from 'react';
import { ADVISER_POSTS, CABINET_POSTS, VP_NOMINEE_ID, resolveNominee, type CabinetPost, type Nominee } from '@/data/government/cabinet';
import { getParty } from '@/data/world/parties';
import { useGameStore, type AppointResult } from '@/features/game-engine/store/gameStore';
import { commissionComposition } from '@/features/appointments/utils/hearing';
import { countStances } from '@/features/congress/utils/generateGovernment';
import { peso } from '@/features/economy/utils/finance';
import { useUiStore } from '@/app/store/uiStore';
import { Portrait } from '@/shared/components/ui/Portrait';

const FACTION_LABEL: Record<Nominee['faction'], string> = {
  technocrat: 'Technocrat',
  loyalist: 'Loyalist',
  party: 'Party politician',
  activist: 'Civil society',
  military: 'Military / police',
  business: 'Business',
  clan: 'Political clan',
  'vice-president': 'Vice President',
};

/**
 * The candidates for a post. After a secretary is fired or resigns, only the freshly
 * generated names are offered — the old shortlist has moved on.
 */
export function candidatesFor(post: CabinetPost, flags: Record<string, unknown>, extra: Record<string, Nominee[]> | undefined): Nominee[] {
  const fresh = extra?.[post.id] ?? [];
  if (flags[`fired_${post.id}`] && fresh.length) return fresh.slice(-3);
  return [...post.nominees, ...fresh];
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div className="meter">
      <span>{label}</span>
      <div><i style={{ width: `${value * 10}%` }} /></div>
    </div>
  );
}

/** One candidate, with their record and a button to nominate them. */
export function NomineeCard({ post, n, onPick }: { post: CabinetPost; n: Nominee; onPick: () => void }) {
  const { cabinet, flags } = useGameStore();
  const seat = cabinet.find((c) => c.postId === post.id);
  const vpName = String(flags.vp_name ?? 'Vice President');
  const vpElsewhere = flags.vp_in_cabinet && flags.vp_in_cabinet !== post.id;
  const nominee = n.id === VP_NOMINEE_ID ? { ...n, name: `VP ${vpName}` } : n;
  const rejected = !!seat?.rejectedIds.includes(n.id);
  const vpBlocked = n.id === VP_NOMINEE_ID && !!vpElsewhere;
  const party = getParty(n.partyId);
  return (
    <div className={`nominee ${rejected || vpBlocked ? 'is-disabled' : ''}`}>
      <div className="nominee__top">
        <Portrait name={nominee.name} size={48} />
        <b>{nominee.name}</b>
        <span className="tag">{n.id.startsWith('gen-') ? 'New candidate · ' : ''}{FACTION_LABEL[n.faction]}</span>
      </div>
      <p className="muted">
        {n.background}
        {party && <> · <span style={{ color: party.color }}>{party.abbreviation}</span></>}
      </p>
      <Meter label="Competence" value={n.competence} />
      <Meter label="Loyalty" value={n.loyalty} />
      <Meter label="Integrity" value={n.integrity} />
      <p className="nominee__note">{n.note}</p>
      {n.id === VP_NOMINEE_ID && flags.vp_is_ally === false && <p className="nominee__warn">The Vice President is from a rival camp.</p>}
      {n.demand && (
        <p className="nominee__warn">
          ⚠ {n.demand.text}
          {n.demand.cost ? ` (−${peso(n.demand.cost)})` : ''}
          {n.demand.approval ? ` (approval ${n.demand.approval > 0 ? '+' : ''}${n.demand.approval})` : ''}
        </p>
      )}
      <button className="btn btn--primary btn--small" disabled={rejected || vpBlocked} onClick={onPick}>
        {rejected ? 'Rejected' : vpBlocked ? 'VP already appointed' : post.requiresConfirmation && n.id !== VP_NOMINEE_ID ? 'Nominate' : 'Appoint'}
      </button>
    </div>
  );
}

function PostCard({ post }: { post: CabinetPost }) {
  const { cabinet, flags, appoint, extraNominees } = useGameStore();
  const candidates = candidatesFor(post, flags, extraNominees);
  const [result, setResult] = useState<AppointResult | null>(null);
  const seat = cabinet.find((c) => c.postId === post.id);
  const vpName = String(flags.vp_name ?? 'Vice President');
  const holder = seat?.nomineeId ? resolveNominee(post, seat.nomineeId, vpName) ?? extraNominees?.[post.id]?.find((n) => n.id === seat.nomineeId) : undefined;

  if (!seat) return null;

  return (
    <article className={`post ${holder ? 'post--filled' : ''}`}>
      <header className="post__head">
        <div>
          <h3>{post.title}</h3>
          <p className="muted">{post.description}</p>
        </div>
        <span className="post__conf">{post.requiresConfirmation ? 'Needs CA confirmation' : 'No confirmation needed'}</span>
      </header>

      {holder ? (
        <div className="post__holder">
          <Portrait name={holder.name} size={72} mood="happy" />
          <div>
            <b>{holder.name}</b>
            <p className="muted">{holder.background}</p>
            <p className="post__status">
              {seat.status === 'confirmed' && `Confirmed by the Commission on Appointments, ${seat.caVote?.yes}–${seat.caVote?.no}`}
              {seat.status === 'no_confirmation' && 'Appointed — no confirmation required'}
            </p>
            {result && result.cost > 0 && (
              <p className="post__cost">Charged {peso(result.cost)} to the Treasury{result.borrowed > 0 ? ` (${peso(result.borrowed)} borrowed)` : ''}.</p>
            )}
          </div>
        </div>
      ) : (
        <>
          {seat.status === 'rejected' && result?.hearing && (
            <p className="post__rejected">
              The Commission on Appointments rejected your nominee, {result.hearing.yes}–{result.hearing.no}. Choose again.
            </p>
          )}
          {seat.status === 'rejected' && !result && <p className="post__rejected">Your previous nominee was rejected. Choose again.</p>}
          <div className="nominees">
            {candidates.map((n) => (
              <NomineeCard key={n.id} post={post} n={n} onPick={() => setResult(appoint(post.id, n.id))} />
            ))}
          </div>
        </>
      )}
    </article>
  );
}

/** One chair in the Cabinet Room: the secretary's portrait, or an empty chair for a vacant post. */
function Chair({ post, picked, onPick }: { post: CabinetPost; picked: boolean; onPick: () => void }) {
  const { cabinet, flags, extraNominees } = useGameStore();
  const seat = cabinet.find((c) => c.postId === post.id);
  const vpName = String(flags.vp_name ?? 'Vice President');
  const holder = seat?.nomineeId ? resolveNominee(post, seat.nomineeId, vpName) ?? extraNominees?.[post.id]?.find((n) => n.id === seat.nomineeId) : undefined;
  const short = post.title.replace(/^Secretary of (the )?/, '').replace('Presidential Adviser on ', '').replace('Chief Presidential ', '').replace('Presidential ', '');
  return (
    <button className={`chair ${holder ? '' : 'is-vacant'} ${picked ? 'is-picked' : ''}`} onClick={onPick} title={post.title}>
      {holder ? <Portrait name={holder.name} size={52} /> : <span className="chair__empty">+</span>}
      <b>{holder ? holder.name.replace(/^(Atty\.|Dr\.|Engr\.|Gen\. \(Ret\.\)|Col\. \(Ret\.\)|Justice \(Ret\.\)|Sen\.|Rep\.|Gov\.|Mayor|Prof\.|Amb\.)\s*/, '') : 'Vacant'}</b>
      <small>{short}</small>
    </button>
  );
}

export function CabinetView() {
  const { cabinet, government, player } = useGameStore();
  const openWizard = useUiStore((u) => u.openCabinetWizard);
  const [picked, setPicked] = useState<string>('executive');
  const filled = cabinet.filter((c) => c.nomineeId).length;
  const confirmed = cabinet.filter((c) => c.status === 'confirmed').length;
  const ca = government ? countStances(commissionComposition(government).map((stance) => ({ stance }))) : null;

  const advisers = CABINET_POSTS.filter((p) => (ADVISER_POSTS as readonly string[]).includes(p.id));
  const secretaries = CABINET_POSTS.filter((p) => !(ADVISER_POSTS as readonly string[]).includes(p.id));
  // The Executive Secretary sits at the President's right hand; the rest alternate down both sides of the table.
  const left: CabinetPost[] = [];
  const right: CabinetPost[] = [];
  secretaries.forEach((p, i) => (i % 2 === 0 ? right : left).push(p));
  const post = CABINET_POSTS.find((p) => p.id === picked) ?? CABINET_POSTS[0];

  return (
    <div className="stack cabinet-office">
      <header className="congress-banner cabinet-banner">
        <div className="congress-banner__mace" aria-hidden>🏛</div>
        <div>
          <p className="kicker kicker--gold">Palasyo ng Malaya · Cabinet Room</p>
          <h2>Ang Gabinete</h2>
          <p className="muted">Your secretaries and advisers. Department secretaries face the Commission on Appointments; the Executive Secretary, the advisers, and the Vice President do not.</p>
        </div>
        {filled < CABINET_POSTS.length && (
          <button className="btn btn--primary btn--small cabinet-banner__cta" onClick={openWizard}>Fill vacant posts</button>
        )}
      </header>

      <section className="congress-strip">
        <div className={filled === CABINET_POSTS.length ? 'is-good' : ''}><small>Seats filled</small><b>{filled} / {CABINET_POSTS.length}</b><em>{CABINET_POSTS.length - filled ? `${CABINET_POSTS.length - filled} vacant` : 'full Cabinet'}</em></div>
        <div><small>Secretaries</small><b>{secretaries.filter((p) => cabinet.find((c) => c.postId === p.id)?.nomineeId).length} / {secretaries.length}</b><em>{confirmed} confirmed by the CA</em></div>
        <div><small>Advisers</small><b>{advisers.filter((p) => cabinet.find((c) => c.postId === p.id)?.nomineeId).length} / {advisers.length}</b><em>no confirmation needed</em></div>
        {ca && (
          <div className="congress-strip__wide">
            <small>Commission on Appointments</small>
            <b><span className="c-ally">{ca.ally}</span> · <span className="c-neutral">{ca.neutral}</span> · <span className="c-opp">{ca.opposition}</span></b>
            <em>administration · independent · opposition</em>
          </div>
        )}
      </section>

      <section className="cabinet-room">
        <div className="cabinet-room__wall">
          <span className="cabinet-room__label">Presidential advisers</span>
          <div className="cabinet-room__advisers">
            {advisers.map((p) => <Chair key={p.id} post={p} picked={picked === p.id} onPick={() => setPicked(p.id)} />)}
          </div>
        </div>
        <div className="cabinet-room__president">
          <Portrait name={player ? `${player.firstName} ${player.lastName}` : 'President'} size={72} mood="neutral" />
          <b>President {player?.lastName}</b>
          <small>Head of the table</small>
        </div>
        <div className="cabinet-table">
          <div className="cabinet-table__side">
            {left.map((p) => <Chair key={p.id} post={p} picked={picked === p.id} onPick={() => setPicked(p.id)} />)}
          </div>
          <div className="cabinet-table__top" aria-hidden><span>⚜</span></div>
          <div className="cabinet-table__side">
            {right.map((p) => <Chair key={p.id} post={p} picked={picked === p.id} onPick={() => setPicked(p.id)} />)}
          </div>
        </div>
        <p className="muted cabinet-room__hint">Select a chair to see who holds the post — or to choose someone for an empty one.</p>
      </section>

      <PostCard key={post.id} post={post} />
    </div>
  );
}
