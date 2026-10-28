import { useRef, type PointerEvent, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useMotionPref } from "../../lib/motion-pref";
import { SPRING } from "./tokens";

/** Puxa o filho na direção do ponteiro (só mouse). O retângulo é medido no pointerenter, não a cada movimento. */
export function Magnetic({ strength = 0.35, className, children }: { strength?: number; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const rect = useRef<DOMRect | null>(null);
  const reduced = useMotionPref() === "reduced";
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, SPRING.ima);
  const sy = useSpring(y, SPRING.ima);

  const onEnter = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && ref.current) rect.current = ref.current.getBoundingClientRect();
  };
  const onMove = (e: PointerEvent) => {
    const r = rect.current;
    if (reduced || e.pointerType !== "mouse" || !r) return;
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    rect.current = null;
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      data-motion="ima"
      style={{ x: sx, y: sy }}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={`inline-block ${className ?? ""}`}
    >
      {children}
    </motion.div>
  );
}
