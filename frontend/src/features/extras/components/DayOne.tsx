import { useGameStore } from '@/features/game-engine/store/gameStore';
import { useUiStore } from '@/app/store/uiStore';
import { Modal } from '@/shared/components/ui/Modal';
import { CABINET_POSTS } from '@/data/government/cabinet';

/** True on the first day in office, after the tour, until the player chooses to start governing. */
export function useDayOnePending() {
  return useGameStore((s) => s.phase === 'presidency' && !!s.government && !!s.flags.tutorial_done && !s.flags.dayone_done && s.month <= 0 && !s.chapterComplete);
}

/** One checklist for the first day, instead of a chain of pop-ups. */
export function DayOne() {
  const pending = useDayOnePending();
  const { cabinet, budgetSubmitted, setFlag } = useGameStore();
  const { cabinetWizardOpen, openCabinetWizard, budgetRequested, requestBudget, putOffCabinet } = useUiStore();
  if (!pending || cabinetWizardOpen || (budgetRequested && !budgetSubmitted)) return null;

  const filled = cabinet.filter((c) => c.nomineeId).length;
  const cabinetDone = filled >= CABINET_POSTS.length;
  const tasks = [
    { done: cabinetDone, icon: '👥', title: 'Form your Cabinet', text: cabinetDone ? 'Every post is filled.' : `${filled} of ${CABINET_POSTS.length} posts filled. Secretaries shape how well each ministry runs. You can leave some for later.`, act: () => openCabinetWizard(), label: cabinetDone ? 'Review' : filled ? 'Continue' : 'Start' },
    { done: budgetSubmitted, icon: '💰', title: 'Draft the FY2028 budget', text: budgetSubmitted ? 'Submitted to Congress.' : 'Required before your first month ends. Decide how much each sector gets.', act: () => requestBudget(), label: budgetSubmitted ? 'Done' : 'Open' },
  ];

  // Posts left empty on Day One count as "decide later", so the Cabinet pop-up does not follow straight away.
  const start = () => {
    const vacant = CABINET_POSTS.filter((p) => { const seat = cabinet.find((c) => c.postId === p.id); return seat && !seat.nomineeId; }).map((p) => p.id);
    if (vacant.length) putOffCabinet(vacant.join(','));
    setFlag('dayone_done', true);
  };

  return (
    <Modal title="Your first day in the Palasyo" kicker="Unang Araw · Day One" onClose={() => undefined} closable={false} className="dayone-modal">
      <ul className="dayone">
        {tasks.map((t) => (
          <li key={t.title} className={t.done ? 'is-done' : ''}>
            <span className="dayone__icon" aria-hidden>{t.done ? '✓' : t.icon}</span>
            <div>
              <b>{t.title}</b>
              <small className="muted">{t.text}</small>
            </div>
            <button className="btn btn--ghost btn--small btn--light" disabled={t.done && t.label === 'Done'} onClick={t.act}>{t.label}</button>
          </li>
        ))}
      </ul>
      <div className="wizard-foot">
        <span className="muted">{budgetSubmitted ? 'Ready when you are.' : 'You must submit the budget before you begin.'}</span>
        <button className="btn btn--primary btn--small" disabled={!budgetSubmitted} onClick={start}>Start governing</button>
      </div>
    </Modal>
  );
}
