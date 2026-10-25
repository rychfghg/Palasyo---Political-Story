import { useState } from 'react';
import { useGameStore } from '@/features/game-engine/store/gameStore';
import { Modal } from '@/shared/components/ui/Modal';

/** True while a brand-new President still has the guided tour ahead (older saves skip it). */
export function useTutorialPending() {
  return useGameStore((s) => s.phase === 'presidency' && !!s.government && !s.flags.tutorial_done && s.month <= 0);
}

const STEPS: { icon: string; title: string; text: string[] }[] = [
  { icon: '🏛️', title: 'Welcome to the Palasyo', text: ['You are now President of the Republika ng Kapuluan. For six years, every month brings a desk full of decisions.', 'This short tour shows you where everything is. You can skip it at any time.'] },
  { icon: '📊', title: 'The numbers at the top', text: ['The header shows the state of the country: Treasury cash, this year’s balance, national debt, debt as a share of the economy, the credit rating, inflation, and your approval.', 'Hover over any number to see what it means. Red means trouble.'] },
  { icon: '📋', title: 'The Agenda', text: ['The Agenda tab is your desk. Each matter is a story card: read it, then choose. Every choice changes the economy, Congress, the courts, the streets — or your family.', 'Some choices come back months later. Some people never forget.'] },
  { icon: '🗂️', title: 'The branches and the offices', text: ['The tabs show Congress, the Senate, the Supreme Court, and the Bangko Sentral.', '“Other offices” opens the Cabinet, Treasury, Budget, Nation & BIR, GOCCs, Laws & Projects, Foreign Affairs, Statistics, and Achievements.'] },
  { icon: '📱', title: 'The side bar', text: ['The side bar has your party, government, regions, dossier, and settings (including save slots).', 'When someone texts you, a phone appears there. Answer before the message expires — ignoring people has consequences. You can also turn the ambient sound on.'] },
  { icon: '📰', title: 'When the month ends', text: ['Once the desk is clear, end the month. The economy moves, the central bank meets, and a month summary shows the newspapers, your texts, warnings, and achievements in one place.', 'Every July you give a State of the Nation Address; every quarter the press corps gets its turn.'] },
  { icon: '🎯', title: 'Tips for a first term', text: ['Keep inflation and debt in check — if they run wild for months, the streets will fill.', 'Watch your advisers’ reactions: if most think a decision is a mistake, you can reconsider it once. Invest in things that earn money, and fill your Cabinet early.', 'Good luck, President.'] },
];

/** A guided tour on the first visit to the President's desk. */
export function Tutorial() {
  const pending = useTutorialPending();
  const setFlag = useGameStore((s) => s.setFlag);
  const [step, setStep] = useState(0);
  if (!pending) return null;
  const st = STEPS[step];
  const done = () => setFlag('tutorial_done', true);
  return (
    <Modal title={st.title} kicker={`Gabay · Tutorial ${step + 1} of ${STEPS.length}`} onClose={done} className="tutorial-modal">
      <div className="tutorial">
        <span className="tutorial__icon" aria-hidden>{st.icon}</span>
        <div>{st.text.map((p) => <p key={p}>{p}</p>)}</div>
      </div>
      <div className="wizard-progress" aria-hidden>
        {STEPS.map((_, i) => <i key={i} className={`${i < step ? 'is-done' : ''} ${i === step ? 'is-current' : ''}`} onClick={() => setStep(i)} />)}
      </div>
      <div className="wizard-foot">
        <button className="btn btn--ghost btn--small btn--light" onClick={done}>Skip tutorial</button>
        <div className="row">
          <button className="btn btn--ghost btn--small btn--light" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</button>
          {step < STEPS.length - 1 ? (
            <button className="btn btn--primary btn--small" onClick={() => setStep(step + 1)}>Next</button>
          ) : (
            <button className="btn btn--primary btn--small" onClick={done}>Start governing</button>
          )}
        </div>
      </div>
    </Modal>
  );
}
