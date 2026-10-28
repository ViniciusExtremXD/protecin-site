import { useRef, type PointerEvent, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { IMA_MAX, SPRING } from "./tokens";

/**
 * Puxa o filho na direção do ponteiro (só mouse). O retângulo é medido no pointerenter, não a cada movimento.
 * Rodada de sobriedade: a força tem teto IMA_MAX (0,08), hover sutil.
 */
export function Magnetic({ strength = IMA_MAX, className, children }: { strength?: number; className?: string; children: ReactNode }) {
  const forca = Math.min(strength, IMA_MAX);
  const ref = useRef<HTMLDivElement>(null);
  const rect = useRef<DOMRect | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, SPRING.ima);
  const sy = useSpring(y, SPRING.ima);

  const onEnter = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && ref.current) rect.current = ref.current.getBoundingClientRect();
  };
  const onMove = (e: PointerEvent) => {
    const r = rect.current;
    if (e.pointerType !== "mouse" || !r) return;
    x.set((e.clientX - (r.left + r.width / 2)) * forca);
    y.set((e.clientY - (r.top + r.height / 2)) * forca);
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
