import { useGameStore } from '@/features/game-engine/store/gameStore';
import { useUiStore } from '@/app/store/uiStore';
import { Modal } from '@/shared/components/ui/Modal';
import { BudgetView } from './BudgetView';
import { useTutorialPending } from '@/features/extras/components/Tutorial';
import { useDayOnePending } from '@/features/extras/components/DayOne';

/**
 * The first budget is drafted as soon as the presidency begins: a pop-up that stays until the
 * National Expenditure Program is submitted to Congress.
 */
export function BudgetModal() {
  const { phase, month, budgetSubmitted, budgetProposal, chapterComplete } = useGameStore();
  const cabinetOpen = useUiStore((u) => u.cabinetWizardOpen);
  const tutorial = useTutorialPending();
  const dayOne = useDayOnePending();
  const requested = useUiStore((u) => u.budgetRequested);
  if (tutorial || (dayOne && !requested) || phase !== 'presidency' || budgetSubmitted || month >= 1 || !budgetProposal || chapterComplete || cabinetOpen) return null;
  return (
    <Modal title="Pambansang Badyet" kicker="Your first decision as President · FY2028 budget" onClose={() => undefined} closable={false} className="budget-modal">
      <BudgetView />
    </Modal>
  );
}
