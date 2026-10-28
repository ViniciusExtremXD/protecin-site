import type { ReactNode } from "react";
import { motion, useMotionValue, useTransform, type MotionValue } from "framer-motion";
import { useMotionPref } from "../../lib/motion-pref";
import { SPRING } from "./tokens";

export interface ReelProps {
  count: number;
  index?: number;
  progress?: MotionValue<number>;
  axis?: "y" | "x";
  className?: string; // o contêiner precisa de altura (y) ou largura (x) definida: mostra 1 item por vez
  itemClassName?: string;
  children: ReactNode[];
  label?: string;
}

/**
 * Rolo de itens empilhados dentro de uma janela: por `index` (mola SPRING.pilula) ou contínuo por `progress`.
 * Todos os itens ficam no DOM.
 */
export function Reel({ count, index = 0, progress, axis = "y", className, itemClassName, children, label }: ReelProps) {
  const reduced = useMotionPref() === "reduced";
  const reserva = useMotionValue(0);
  const fim = `-${((count - 1) * 100) / count}%`;
  const continuo = useTransform(progress ?? reserva, [0, 1], ["0%", fim]);
  const alvo = `-${(Math.min(Math.max(index, 0), count - 1) * 100) / count}%`;
  const dim = axis === "y" ? "height" : "width";

  return (
    <div data-motion="reel" role={label ? "group" : undefined} aria-label={label} className={`relative overflow-clip ${className ?? ""}`}>
      <motion.div
        className={`flex ${axis === "y" ? "w-full flex-col" : "h-full flex-row"}`}
        style={{ [dim]: `${count * 100}%`, ...(progress && !reduced ? { [axis]: continuo } : {}) }}
        initial={false}
        animate={progress ? undefined : { [axis]: alvo }}
        transition={reduced ? { duration: 0 } : { type: "spring", ...SPRING.pilula }}
      >
        {children.map((c, i) => (
          <div
            key={i}
            className={`shrink-0 ${axis === "y" ? "w-full" : "h-full"} ${itemClassName ?? ""}`}
            style={{ flexBasis: `${100 / count}%` }}
            aria-hidden={!progress && i !== index ? true : undefined}
          >
            {c}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
