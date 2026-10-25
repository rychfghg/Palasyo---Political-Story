import { useEffect, useState } from 'react';
import { CABINET_POSTS } from '@/data/government/cabinet';
import { useGameStore, type AppointResult } from '@/features/game-engine/store/gameStore';
import { useUiStore } from '@/app/store/uiStore';
import { peso } from '@/features/economy/utils/finance';
import { Modal } from '@/shared/components/ui/Modal';
import { candidatesFor, NomineeCard } from './CabinetView';
import { useTutorialPending } from '@/features/extras/components/Tutorial';
import { useDayOnePending } from '@/features/extras/components/DayOne';

/**
 * Fills vacant Cabinet posts one at a time in a pop-up: at the start of the term, and again
 * whenever a secretary is fired or resigns (with a fresh, randomly generated shortlist).
 */
export function CabinetWizard() {
  const { cabinet, flags, extraNominees, appoint, phase, chapterComplete } = useGameStore();
  const { cabinetPutOff, cabinetWizardForced, putOffCabinet, setCabinetWizardOpen } = useUiStore();
  const vacant = CABINET_POSTS.filter((p) => {
    const seat = cabinet.find((c) => c.postId === p.id);
    return seat && !seat.nomineeId;
  }).map((p) => p.id);
  const key = vacant.join(',');
  const tutorial = useTutorialPending();
  const dayOne = useDayOnePending();
  // On Day One the wizard opens only from the checklist.
  const show = phase === 'presidency' && !tutorial && !chapterComplete && !flags.game_over && (cabinetWizardForced || (!dayOne && vacant.length > 0 && cabinetPutOff !== key));

  // The list of posts is fixed when the pop-up opens, so filled posts can still be revisited with Back.
  const [steps, setSteps] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Record<string, AppointResult | null>>({});

  useEffect(() => {
    if (show && (steps.length === 0 || vacant.some((v) => !steps.includes(v)))) {
      // A new vacancy brings up only the new post; the ones put off earlier stay put off.
      const earlier = cabinetWizardForced ? [] : cabinetPutOff.split(',');
      const fresh = vacant.filter((v) => !earlier.includes(v));
      setSteps(fresh.length ? fresh : vacant);
      setIndex(0);
      setResults({});
    }
    if (!show && steps.length) setSteps([]);
    setCabinetWizardOpen(show && vacant.length > 0);
  }, [show, key]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!show || steps.length === 0) return null;
  const post = CABINET_POSTS.find((p) => p.id === steps[index])!;
  const seat = cabinet.find((c) => c.postId === post.id)!;
  const filled = !!seat.nomineeId;
  const result = results[post.id];
  const holderName = filled ? candidatesFor(post, flags, extraNominees).find((n) => n.id === seat.nomineeId)?.name ?? post.nominees.find((n) => n.id === seat.nomineeId)?.name : undefined;
  const isReplacement = !!flags[`fired_${post.id}`];
  const last = index === steps.length - 1;
  const doneCount = steps.filter((id) => cabinet.find((c) => c.postId === id)?.nomineeId).length;

  const close = () => putOffCabinet(vacant.join(','));

  return (
    <Modal
      title={post.title}
      kicker={`${isReplacement ? 'Vacancy · choose a replacement' : 'Bumuo ng Gabinete · Form your Cabinet'} · post ${index + 1} of ${steps.length}`}
      onClose={close}
      className="cabinet-wizard"
    >
      <div className="wizard-progress" aria-hidden>
        {steps.map((id, i) => {
          const done = !!cabinet.find((c) => c.postId === id)?.nomineeId;
          return <i key={id} className={`${done ? 'is-done' : ''} ${i === index ? 'is-current' : ''}`} onClick={() => setIndex(i)} />;
        })}
      </div>
      <p className="muted">
        {post.description} {post.requiresConfirmation ? 'Your nominee must win a vote in the Commission on Appointments.' : 'No confirmation needed.'}
        {isReplacement && ' The previous secretary is gone — these are new names put forward by your advisers.'}
      </p>

      {filled ? (
        <div className="wizard-done">
          <span>✓</span>
          <div>
            <b>{holderName ?? 'Appointed'}</b>
            <p className="muted">
              {seat.status === 'confirmed' ? `Confirmed by the Commission on Appointments, ${seat.caVote?.yes}–${seat.caVote?.no}.` : 'Appointed. No confirmation required.'}
              {result && result.cost > 0 && ` ${peso(result.cost)} charged to the Treasury.`}
            </p>
          </div>
        </div>
      ) : (
        <>
          {seat.status === 'rejected' && (
            <p className="post__rejected">
              {result?.hearing ? `The Commission on Appointments rejected your nominee, ${result.hearing.yes}–${result.hearing.no}.` : 'Your previous nominee was rejected.'} Choose again.
            </p>
          )}
          <div className="nominees">
            {candidatesFor(post, flags, extraNominees).map((n) => (
              <NomineeCard key={n.id} post={post} n={n} onPick={() => setResults({ ...results, [post.id]: appoint(post.id, n.id) })} />
            ))}
          </div>
        </>
      )}

      <footer className="wizard-foot">
        <button className="btn btn--ghost btn--small btn--light" onClick={close}>Decide later</button>
        <span className="muted">{doneCount} of {steps.length} filled</span>
        <div className="row">
          <button className="btn btn--ghost btn--small btn--light" disabled={index === 0} onClick={() => setIndex(index - 1)}>Back</button>
          {last ? (
            <button className="btn btn--primary btn--small" onClick={close}>{doneCount === steps.length ? 'Finish' : 'Close'}</button>
          ) : (
            <button className="btn btn--primary btn--small" onClick={() => setIndex(index + 1)}>{filled ? 'Next' : 'Skip for now'}</button>
          )}
        </div>
      </footer>
    </Modal>
  );
}
