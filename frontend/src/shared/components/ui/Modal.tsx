import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

/** A centered dialog over a dimmed backdrop. Closes with Escape or a click outside. */
export function Modal({ title, kicker, onClose, children, className = '', closable = true }: { title: string; kicker?: string; onClose: () => void; children: ReactNode; className?: string; closable?: boolean }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => closable && e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, closable]);

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
