import { useMemo } from 'react';
import { useGameStore } from '@/features/game-engine/store/gameStore';
import { adviserReactions } from '@/features/game-engine/engine/institutions';
import type { CampaignState } from '@/features/game-engine/types/campaign';
import { useUiStore } from '@/app/store/uiStore';
import { Modal } from '@/shared/components/ui/Modal';
import { Portrait } from '@/shared/components/ui/Portrait';

const MOOD_LABEL = { happy: 'Pleased', relieved: 'Relieved', neutral: 'Unmoved', worried: 'Worried', disappointed: 'Disappointed', angry: 'Upset' } as const;

/** The advisers with something to say about the decision just made, and whether they are still waiting to be heard. */
function useReactions() {
  const s = useGameStore() as unknown as CampaignState;
  const seen = useUiStore((u) => u.reactionSeen);
  const report = s.lastReport;
  const key = report ? `${report.eventId}:${report.choiceId}:${s.month}` : '';
  // Only advisers with a real reaction appear; the unmoved stay quiet.
  const list = useMemo(() => (report ? adviserReactions(s, report.eventId, report.choiceId).filter((a) => a.mood !== 'neutral') : []), [key]); // eslint-disable-line react-hooks/exhaustive-deps
  return { list, key, pending: !!report && list.length > 0 && seen !== key };
}

export function useReactionsPending() {
  return useReactions().pending;
}

/** After every decision, the President's advisers react — in person. `inline` shows them inside another pop-up. */
export function AdviserReactions({ inline = false }: { inline?: boolean }) {
  const setSeen = useUiStore((u) => u.setReactionSeen);
  const { list, key, pending } = useReactions();
  if (!pending) return null;
  const against = list.filter((a) => a.mood === 'disappointed' || a.mood === 'angry' || a.mood === 'worried').length;
  const behind = list.length - against;
  // When most of the room is against it, the President may change course — once.
  const canChange = against >= 2 && against > behind && useGameStore.getState().canReconsider();
  const reconsider = () => {
    setSeen(key);
    useGameStore.getState().reconsider();
  };

  const body = (
    <>
      <div className="adviser-row">
        {list.map((a) => (
          <figure key={a.post} className={`adviser adviser--${a.mood}`}>
            <Portrait name={a.name} mood={a.mood} size={88} />
            <figcaption>
              <span className="adviser__mood">{MOOD_LABEL[a.mood]}</span>
              <b>{a.name}</b>
              <small>{a.role}</small>
              <q>{a.text}</q>
            </figcaption>
          </figure>
        ))}
      </div>
      {canChange && (
        <p className="reconsider-note">⚠ {against} of your advisers think this is a mistake. You can still change your decision before it is announced — it will cost some political capital, and the press will notice.</p>
      )}
      <div className="wizard-foot">
        <span className="muted">Advisers who had no strong view stayed quiet.</span>
        <div className="row">
          {canChange && <button className="btn btn--ghost btn--small btn--light" onClick={reconsider}>Reconsider the decision</button>}
          <button className="btn btn--primary btn--small" onClick={() => setSeen(key)}>{canChange ? 'Stand by it' : 'Continue'}</button>
        </div>
      </div>
    </>
  );
  if (inline) return <div className="reactions-inline">{body}</div>;
  return (
    <Modal title="Ang Reaksyon ng mga Tagapayo" kicker="Your advisers react" onClose={() => setSeen(key)} className="reactions-modal">
      {body}
    </Modal>
  );
}
