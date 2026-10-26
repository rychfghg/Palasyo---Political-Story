import { useEffect, useId, useSyncExternalStore, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

// Only one pop-up is ever on screen. Pop-ups that open while another is showing wait in line
// and appear, in order, when the one in front closes.
let queue: string[] = [];
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const front = () => queue[0] ?? null;

/** A centered dialog over a dimmed backdrop. Closes with Escape or a click outside. */
export function Modal({ title, kicker, onClose, children, className = '', closable = true }: { title: string; kicker?: string; onClose: () => void; children: ReactNode; className?: string; closable?: boolean }) {
  const id = useId();
  useEffect(() => {
    queue = [...queue, id];
    notify();
    return () => {
      queue = queue.filter((x) => x !== id);
      notify();
    };
  }, [id]);
  const active = useSyncExternalStore(subscribe, front) === id;

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => closable && e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, closable, active]);

  if (!active) return null;
  // Rendered at the top of the page so it never inherits the styles of whatever card opened it.
  return createPortal(
    <div className="modal-backdrop" onClick={(e) => closable && e.target === e.currentTarget && onClose()}>
      <div className={`modal ${className}`} role="dialog" aria-modal="true" aria-label={title}>
        <header className="modal__head">
          <div>
            {kicker && <p className="kicker">{kicker}</p>}
            <h2>{title}</h2>
          </div>
          {closable && <button className="modal__close" onClick={onClose} aria-label="Close">✕</button>}
        </header>
        {children}
      </div>
    </div>,
    document.body,
  );
}
