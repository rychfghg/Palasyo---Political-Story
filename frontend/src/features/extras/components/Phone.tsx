import { useState } from 'react';
import { useGameStore } from '@/features/game-engine/store/gameStore';
import { fill, tokens } from '@/features/game-engine/engine/engine';
import { messageTemplate } from '@/features/game-engine/engine/extras';
import { monthLabel } from '@/features/game-engine/engine/calendar';
import type { CampaignState } from '@/features/game-engine/types/campaign';
import { Modal } from '@/shared/components/ui/Modal';
import { Portrait } from '@/shared/components/ui/Portrait';

/** The President's phone: texts from allies, rivals, family, and foreign leaders. */
export function Phone() {
  const s = useGameStore() as unknown as CampaignState;
  const { replyMessage, markInboxRead } = useGameStore();
  const [open, setOpen] = useState(false);
  const phase = useGameStore((x) => x.phase);
  const [result, setResult] = useState<Record<string, string>>({});
  const inbox = s.inbox ?? [];
  const waiting = inbox.filter((m) => m.answered === undefined && !m.expired);
  const unread = inbox.filter((m) => !m.read).length;
  const t = tokens(s);

  return (
    <>
      {/* The phone is always in the side bar while you are in office; it glows when someone is waiting. */}
      {(phase === 'presidency' || inbox.length > 0) && (
        <button className={`sidenav__btn phone-nav ${waiting.length ? 'has-new' : ''}`} onClick={() => setOpen(true)} aria-label="Open your phone" title="Phone">
          <span className="phone-nav__icon" aria-hidden>📱</span>
          <span>Phone</span>
          {(unread || waiting.length) > 0 && <i>{Math.max(unread, waiting.length)}</i>}
        </button>
      )}
      {open && (
        <Modal title="Telepono" kicker="Your private phone" onClose={() => { markInboxRead(); setOpen(false); }} className="phone-modal">
          <div className="phone">
            <div className="phone__screen">
              {inbox.length === 0 && <p className="muted phone__empty">No messages yet. People will start texting once you are in office.</p>}
              {inbox.map((m) => {
                const tpl = messageTemplate(m.tpl);
                if (!tpl) return null;
                const from = fill(tpl.from, t);
                const live = m.answered === undefined && !m.expired;
                return (
                  <article key={m.id} className={`text ${live ? 'is-live' : ''} ${m.read ? '' : 'is-unread'}`}>
                    <header>
                      <Portrait name={from} size={34} />
                      <div>
                        <b>{from}</b>
                        <small>{tpl.role} · {monthLabel(m.month)}{live ? ` · expires ${monthLabel(m.expires)}` : ''}</small>
                      </div>
                    </header>
                    <p className="text__bubble">{fill(tpl.text, t)}</p>
                    {live ? (
                      <div className="text__replies">
                        {tpl.options.map((o, i) => (
                          <button key={i} className="text__reply" onClick={() => setResult({ ...result, [m.id]: replyMessage(m.id, i) })}>
                            {fill(o.label, t)}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text__me">{m.expired ? 'You never replied.' : `You: ${fill(tpl.options[m.answered!].label, t)}`}</p>
                    )}
                    {(result[m.id] || m.outcome) && <p className="text__outcome">{result[m.id] || m.outcome}</p>}
                  </article>
                );
              })}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
