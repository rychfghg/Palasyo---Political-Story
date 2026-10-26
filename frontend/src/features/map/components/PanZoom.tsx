import { useRef, useState, type ReactNode } from 'react';

const MIN = 0.8;
const MAX = 3;

/**
 * Lets the player drag the map around and zoom with the mouse wheel, a pinch, or the buttons.
 * A drag never counts as a click, so pins only open when tapped without moving.
 */
export function PanZoom({ children }: { children: ReactNode }) {
  const [view, setView] = useState({ x: 0, y: 0, k: 1 });
  const drag = useRef<{ x: number; y: number; vx: number; vy: number; moved: boolean } | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<number | null>(null);
  const box = useRef<HTMLDivElement>(null);

  const zoomAt = (k: number, cx = 0, cy = 0) =>
    setView((v) => {
      const nk = Math.min(MAX, Math.max(MIN, k));
      // Keep the point under the cursor in place while zooming.
      return { k: nk, x: cx - ((cx - v.x) * nk) / v.k, y: cy - ((cy - v.y) * nk) / v.k };
    });
  const center = (e: { clientX: number; clientY: number }) => {
    const r = box.current!.getBoundingClientRect();
    return [e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2] as const;
  };

  return (
    <div
      ref={box}
      className={`panzoom ${drag.current?.moved ? 'is-dragging' : ''}`}
      onWheel={(e) => {
        const [cx, cy] = center(e);
        zoomAt(view.k * (e.deltaY < 0 ? 1.15 : 1 / 1.15), cx, cy);
      }}
      onPointerDown={(e) => {
        pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
        drag.current = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y, moved: false };
      }}
      onPointerMove={(e) => {
        if (!pointers.current.has(e.pointerId)) return;
        pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (pointers.current.size === 2) {
          const [a, b] = [...pointers.current.values()];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (pinch.current) zoomAt(view.k * (d / pinch.current));
          pinch.current = d;
          if (drag.current) drag.current.moved = true;
          return;
        }
        const d = drag.current;
        if (!d) return;
        const dx = e.clientX - d.x, dy = e.clientY - d.y;
        if (!d.moved && Math.hypot(dx, dy) < 6) return;
        if (!d.moved) (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        d.moved = true;
        setView((v) => ({ ...v, x: d.vx + dx, y: d.vy + dy }));
      }}
      onPointerUp={(e) => {
        pointers.current.delete(e.pointerId);
        if (pointers.current.size < 2) pinch.current = null;
        // Let the click that follows a drag through only if the pointer did not move.
        const moved = drag.current?.moved;
        drag.current = null;
        if (moved) {
          const stop = (ev: Event) => { ev.stopPropagation(); ev.preventDefault(); };
          window.addEventListener('click', stop, { capture: true, once: true });
          setTimeout(() => window.removeEventListener('click', stop, { capture: true }), 0);
        }
      }}
      onPointerCancel={(e) => { pointers.current.delete(e.pointerId); drag.current = null; pinch.current = null; }}
    >
      <div className="panzoom__layer" style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})` }}>{children}</div>
      <div className="panzoom__controls" onPointerDown={(e) => e.stopPropagation()}>
        <button onClick={() => zoomAt(view.k * 1.3)} aria-label="Zoom in">＋</button>
        <button onClick={() => zoomAt(view.k / 1.3)} aria-label="Zoom out">−</button>
        <button onClick={() => setView({ x: 0, y: 0, k: 1 })} aria-label="Reset the map" title="Reset">⟲</button>
      </div>
    </div>
  );
}
