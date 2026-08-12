import { useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

interface JoystickProps {
  onVector: (vec: { x: number; y: number } | null) => void;
  onInteract: () => void;
}

const Joystick = ({ onVector, onInteract }: JoystickProps) => {
  const baseRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const activePointerId = useRef<number | null>(null);

  const updateFromEvent = (e: ReactPointerEvent) => {
    const base = baseRef.current;
    if (!base) return;
    const rect = base.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let dx = e.clientX - cx;
    let dy = e.clientY - cy;
    const maxR = rect.width / 2;
    const dist = Math.hypot(dx, dy);
    if (dist > maxR) {
      dx = (dx / dist) * maxR;
      dy = (dy / dist) * maxR;
    }
    if (knobRef.current) {
      knobRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
    }
    onVector({ x: dx / maxR, y: dy / maxR });
  };

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    baseRef.current?.setPointerCapture(e.pointerId);
    activePointerId.current = e.pointerId;
    updateFromEvent(e);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (activePointerId.current !== e.pointerId) return;
    updateFromEvent(e);
  };

  const handlePointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (activePointerId.current !== e.pointerId) return;
    activePointerId.current = null;
    onVector(null);
    if (knobRef.current) knobRef.current.style.transform = "translate(0, 0)";
  };

  return (
    <div className="pointer-fine:hidden absolute inset-x-0 bottom-0 flex items-end justify-between p-6 pointer-events-none">
      <div
        ref={baseRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative w-28 h-28 rounded-full bg-surface-1/70 border border-border pointer-events-auto"
        style={{ touchAction: "none" }}
      >
        <div
          ref={knobRef}
          className="absolute left-1/2 top-1/2 w-12 h-12 -ml-6 -mt-6 rounded-full bg-primary/60"
        />
      </div>
      <button
        type="button"
        onPointerDown={onInteract}
        className="w-16 h-16 rounded-full bg-primary text-primary-foreground font-display font-bold pointer-events-auto"
        style={{ touchAction: "none" }}
        aria-label="Interact"
      >
        A
      </button>
    </div>
  );
};

export default Joystick;
