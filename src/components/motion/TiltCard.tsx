import { useRef, type PointerEvent, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { SPRING, TILT_MAX } from "./tokens";

/**
 * Cartão com inclinação 3D pelo ponteiro (só mouse). `glare`: faixa de brilho linear que corre com a inclinação
 * (não é luz radial seguindo o ponteiro, que foi cortada no QA). Rodada de sobriedade: inclinação com teto de 4°.
 */
export function TiltCard({ max: maxPedido = TILT_MAX, perspective = 1200, glare = false, className, children }: { max?: number; perspective?: number; glare?: boolean; className?: string; children: ReactNode }) {
  const max = Math.min(maxPedido, TILT_MAX);
  const ref = useRef<HTMLDivElement>(null);
  const rect = useRef<DOMRect | null>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sx = useSpring(rx, SPRING.tilt);
  const sy = useSpring(ry, SPRING.tilt);
  const ativo = useMotionValue(0);
  const brilho = useSpring(ativo, { stiffness: 200, damping: 30 });
  const gx = useTransform(sy, [-max, max], ["-35%", "35%"]);

  const onEnter = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    rect.current = ref.current.getBoundingClientRect();
    ativo.set(1);
  };
  const onMove = (e: PointerEvent) => {
    const r = rect.current;
    if (!r || e.pointerType !== "mouse") return;
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 2 * max);
    rx.set(-py * 2 * max);
  };
  const onLeave = () => {
    rect.current = null;
    rx.set(0);
    ry.set(0);
    ativo.set(0);
  };

  return (
    <motion.div
      ref={ref}
      data-motion="tilt"
      className={`relative [transform-style:preserve-3d] ${className ?? ""}`}
      style={{ rotateX: sx, rotateY: sy, transformPerspective: perspective }}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
      {glare && (
        <span aria-hidden className="pointer-events-none absolute inset-0 overflow-clip rounded-[inherit]">
          <motion.span
            className="absolute inset-y-0 -left-1/2 w-[200%] bg-[linear-gradient(105deg,transparent_42%,rgba(243,239,233,0.1)_50%,transparent_58%)]"
            style={{ x: gx, opacity: brilho }}
          />
        </span>
      )}
    </motion.div>
  );
}
