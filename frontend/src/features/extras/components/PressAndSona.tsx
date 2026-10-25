import { useMemo, useState } from 'react';
import { useGameStore } from '@/features/game-engine/store/gameStore';
import { pressAnswer, pressDue, pressQuestions, promiseLabel, sonaBrags, sonaDue, SONA_PROMISES, SONA_TARGETS, type Tone } from '@/features/game-engine/engine/extras';
import { monthLabel } from '@/features/game-engine/engine/calendar';
import type { CampaignState } from '@/features/game-engine/types/campaign';
import type { Effects } from '@/features/narrative/types/event';
import { useUiStore } from '@/app/store/uiStore';
import { Modal } from '@/shared/components/ui/Modal';
import { Portrait } from '@/shared/components/ui/Portrait';

/** True when nothing else is on screen, so these scenes don't stack on other pop-ups. */
function useDeskClear(s: CampaignState) {
  const reviewSeen = useUiStore((u) => u.reviewSeen);
  const cabinetOpen = useUiStore((u) => u.cabinetWizardOpen);
  const reviewPending = !!s.monthReport && s.monthReport.month === s.month - 1 && reviewSeen < s.monthReport.month;
  return !s.lastReport && !reviewPending && !cabinetOpen && (s.budgetSubmitted || s.month >= 1) && !s.chapterComplete && !s.flags.game_over;
}

const TONES: { id: Tone; label: string; hint: string }[] = [
  { id: 'honest', label: 'Answer honestly', hint: 'Earns respect' },
  { id: 'dodge', label: 'Dodge the question', hint: 'Safe, but noticed' },
  { id: 'attack', label: 'Attack the reporter', hint: 'Your base loves it' },
  { id: 'joke', label: 'Make a joke', hint: 'Risky' },
];

/** Every quarter, the press corps gets its turn. */
export function PressConference() {
  const s = useGameStore() as unknown as CampaignState;
  const finishPress = useGameStore((x) => x.finishPress);
  const clear = useDeskClear(s);
  const due = pressDue(s);
  const questions = useMemo(() => (due ? pressQuestions(s) : []), [due, s.month]); // eslint-disable-line react-hooks/exhaustive-deps
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<{ line: string; fx: Effects }[]>([]);
  if (!due || !clear || !questions.length) return null;

  const done = step >= questions.length;
  const q = questions[Math.min(step, questions.length - 1)];
  const answer = (tone: Tone) => {
    setAnswers([...answers, pressAnswer(s, q, tone, step)]);
    setStep(step + 1);
  };
  const close = () => {
    finishPress(answers.map((a) => a.fx));
    setStep(0);
    setAnswers([]);
  };

  return (
    <Modal title="Press Conference" kicker={`Palasyo press room · ${monthLabel(s.month)}`} onClose={close} closable={done} className="press-modal">
      <div className="press-room">
        <div className="press-room__podium">
          <Portrait name={`${s.player?.firstName} ${s.player?.lastName}`} size={70} mood={done ? 'relieved' : 'neutral'} />
          <span>President {s.player?.lastName}</span>
        </div>
        {!done ? (
          <div className="press-q">
            <div className="press-q__reporter">
              <Portrait name={q.reporter} size={48} />
              <div>
                <b>{q.reporter}</b>
                <small>{q.outlet} · question {step + 1} of {questions.length}</small>
              </div>
            </div>
            <p className="press-q__text">“{q.text}”</p>
            <div className="press-q__tones">
              {TONES.map((tn) => (
                <button key={tn.id} className="choice choice--dark" onClick={() => answer(tn.id)}>
                  <b>{tn.label}</b>
                  <span>{tn.hint}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="press-summary">
            <h4>How it went</h4>
            <ul>{answers.map((a, i) => <li key={i}>{a.line}</li>)}</ul>
            <button className="btn btn--primary btn--small" onClick={close}>Leave the podium</button>
          </div>
        )}
      </div>
    </Modal>
  );
}

/** Once a year, in July, the President addresses Congress and the nation. */
export function Sona() {
  const s = useGameStore() as unknown as CampaignState;
  const giveSona = useGameStore((x) => x.giveSona);
  const clear = useDeskClear(s);
  const due = sonaDue(s);
  const [brags, setBrags] = useState<string[]>([]);
  const [promises, setPromises] = useState<string[]>([]);
  const [target, setTarget] = useState('none');
  const [result, setResult] = useState<string[] | null>(null);
  if ((!due || !clear) && !result) return null;

  const toggle = (list: string[], set: (v: string[]) => void, id: string, max: number) => set(list.includes(id) ? list.filter((x) => x !== id) : list.length >= max ? list : [...list, id]);
  const old = (s.promises ?? []).filter((p) => p.kept !== undefined);
  const year = 2027 + Math.round(s.month / 12);

  return (
    <Modal title={`State of the Nation Address ${year}`} kicker="Ulat sa Bayan · Joint session of Congress" onClose={() => setResult(null)} closable={!!result} className="sona-modal">
      {result ? (
        <div className="sona-result">
          <p>The applause fades. Here is how the country took it:</p>
          <ul>{result.map((l, i) => <li key={i}>{l}</li>)}</ul>
          <button className="btn btn--primary btn--small" onClick={() => setResult(null)}>Leave the rostrum</button>
        </div>
      ) : (
        <>
          {old.length > 0 && (
            <p className="sona-record">
              Last year’s promises: {old.map((p) => `${promiseLabel(p.id)} — ${p.kept ? 'kept ✓' : 'broken ✗'}`).join(' · ')}
            </p>
          )}
          <h4 className="section-title">1 · What will you brag about? (pick 2)</h4>
          <p className="muted">Fact-checkers are listening. True claims raise approval; false ones backfire.</p>
          <div className="sona-grid">
            {sonaBrags(s).map((b) => (
              <button key={b.id} className={`pick-chip ${brags.includes(b.id) ? 'is-picked' : ''}`} onClick={() => toggle(brags, setBrags, b.id, 2)}>{b.label}</button>
            ))}
          </div>
          <h4 className="section-title">2 · What will you promise? (pick up to 2)</h4>
          <p className="muted">Promises are checked at next year’s address. Kept promises win approval; broken ones are replayed by the opposition.</p>
          <div className="sona-grid">
            {SONA_PROMISES.map((p) => (
              <button key={p.id} className={`pick-chip ${promises.includes(p.id) ? 'is-picked' : ''}`} onClick={() => toggle(promises, setPromises, p.id, 2)}>{p.label}</button>
            ))}
          </div>
          <h4 className="section-title">3 · Who will you blame?</h4>
          <div className="sona-grid">
            {SONA_TARGETS.map((t) => (
              <button key={t.id} className={`pick-chip ${target === t.id ? 'is-picked' : ''}`} onClick={() => setTarget(t.id)}>{t.label}</button>
            ))}
          </div>
          <div className="wizard-foot">
            <span className="muted">{brags.length}/2 claims · {promises.length}/2 promises</span>
            <button className="btn btn--primary btn--small" disabled={brags.length < 2} onClick={() => setResult(giveSona(brags, promises, target))}>Deliver the speech</button>
          </div>
        </>
      )}
    </Modal>
  );
}
