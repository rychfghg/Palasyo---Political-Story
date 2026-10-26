import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

const MIN = 0.5;
const MAX = 6;
const EDGE = 34; // how far from the border an off-screen arrow sits, px

export interface PanTarget {
  id: string;
  x: number;
  y: number;
  color: string;
  icon?: string;
  label: string;
}

/**
 * Lets the player drag the map around and zoom with the mouse wheel, a pinch, or the buttons.
 * A drag never counts as a click, so pins only open when tapped without moving.
 * Matters outside the view get an arrow on the edge of the map; clicking it glides there.
 * The child is a square 1000×1000-unit map as wide as this box, centered in it.
 */
export function PanZoom({ children, targets = [], onTarget }: { children: ReactNode; targets?: PanTarget[]; onTarget?: (id: string) => void }) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 1000, h: 600 });
  const [view, setView] = useState({ x: 0, y: 0, k: 1 });
  const [glide, setGlide] = useState(false);
  const drag = useRef<{ x: number; y: number; vx: number; vy: number; moved: boolean } | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<number | null>(null);

  // The starting view shows the whole archipelago, top to bottom.
  const home = (w = size.w, h = size.h) => ({ x: 0, y: 0, k: Math.min(1, (h / w) * 0.96) });
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    setView(home(el.clientWidth, el.clientHeight));
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const unit = size.w / 1000;
  // Where a map point (in units) appears on screen, relative to the box's top-left corner.
  const toScreen = (ux: number, uy: number) => ({ x: size.w / 2 + view.x + view.k * (ux - 500) * unit, y: size.h / 2 + view.y + view.k * (uy - 500) * unit });
  const goTo = (ux: number, uy: number) => {
    setGlide(true);
    setView((v) => { const k = Math.max(v.k, 1.6); return { k, x: -k * (ux - 500) * unit, y: -k * (uy - 500) * unit }; });
    setTimeout(() => setGlide(false), 600);
  };
  const zoomAt = (k: number, cx = 0, cy = 0) =>
    setView((v) => {
      const nk = Math.min(MAX, Math.max(MIN, k));
      return { k: nk, x: cx - ((cx - v.x) * nk) / v.k, y: cy - ((cy - v.y) * nk) / v.k };
    });
  const fromCenter = (e: { clientX: number; clientY: number }) => {
    const r = box.current!.getBoundingClientRect();
    return [e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2] as const;
  };

  // Arrows for matters outside the view, pinned to the border in the direction of the matter.
  const arrows = targets.flatMap((t) => {
    const p = toScreen(t.x, t.y);
    if (p.x > 10 && p.x < size.w - 10 && p.y > 10 && p.y < size.h - 10) return [];
    const cx = size.w / 2, cy = size.h / 2, dx = p.x - cx, dy = p.y - cy;
    const s = Math.min((cx - EDGE) / Math.abs(dx || 1e-6), (cy - EDGE) / Math.abs(dy || 1e-6));
    return [{ t, x: cx + dx * s, y: cy + dy * s, angle: (Math.atan2(dy, dx) * 180) / Math.PI }];
  });

  return (
    <div
      ref={box}
      className="panzoom"
      onWheel={(e) => {
        const [cx, cy] = fromCenter(e);
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
        // Swallow the click that ends a drag, so dragging never opens a pin.
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
      <div
        className={`panzoom__layer ${glide ? 'is-gliding' : ''} ${view.k < 1.4 ? 'is-far' : ''}`}
        style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})`, '--inv': 1 / view.k } as CSSProperties}
      >
        {children}
      </div>

      {arrows.map(({ t, x, y, angle }) => (
        <button
          key={t.id}
          className="panzoom__arrow"
          style={{ left: x, top: y, '--c': t.color } as CSSProperties}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => goTo(t.x, t.y)}
          title={`Go to: ${t.label}`}
          aria-label={`Go to: ${t.label}`}
        >
          <i style={{ transform: `rotate(${angle}deg)` }} aria-hidden>➤</i>
          <span aria-hidden>{t.icon ?? '❗'}</span>
        </button>
      ))}

      <div className="panzoom__controls" onPointerDown={(e) => e.stopPropagation()}>
        <button onClick={() => zoomAt(view.k * 1.3)} aria-label="Zoom in">＋</button>
        <button onClick={() => zoomAt(view.k / 1.3)} aria-label="Zoom out">−</button>
        <button onClick={() => { setGlide(true); setView(home()); setTimeout(() => setGlide(false), 600); }} aria-label="Show the whole map" title="Whole map">⟲</button>
      </div>
      {onTarget && null}
    </div>
  );
}
