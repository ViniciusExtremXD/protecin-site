import { useId } from "react";
import { motion, useMotionValue, useTransform, type MotionValue } from "framer-motion";
import { useMotionPref } from "../../lib/motion-pref";
import { EASE_IN_OUT, VIEWPORT, ease } from "./tokens";

export interface DrawPathProps {
  d: string;
  progress?: MotionValue<number>;
  range?: [number, number];
  className?: string;
  strokeWidth?: number;
  duration?: number;
  delay?: number;
  dashed?: boolean;
}

/**
 * Traço SVG que se desenha (pathLength 0 → 1). Com `progress`, segue a rolagem; sem, desenha ao entrar na tela.
 * `dashed`: o tracejado "4 3" é revelado por uma máscara (o pathLength do framer ocupa o dasharray). Usar dentro de <svg>.
 */
export function DrawPath({ d, progress, range = [0, 1], className, strokeWidth = 1.5, duration = 0.7, delay = 0, dashed = false }: DrawPathProps) {
  const reduced = useMotionPref() === "reduced";
  const reserva = useMotionValue(1);
  const pl = useTransform(progress ?? reserva, range, [0, 1]);
  const id = `dp${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  // reduzido: o 1º render é sempre "full" (casa com o SSR); quando o modo reduzido chega, o caminho remonta (key)
  // já desenhado. Sem a remontagem, o pathLength ficava preso no 0 do `initial` e o traço sumia.
  const animacao = reduced
    ? { initial: { pathLength: 1 } }
    : progress
      ? { initial: false as const, style: { pathLength: pl } }
      : {
          initial: { pathLength: 0 },
          whileInView: { pathLength: 1 },
          viewport: VIEWPORT,
          transition: { duration, ease: ease(EASE_IN_OUT), delay },
        };

  if (!dashed) {
    return (
      <motion.path
        key={reduced ? "r" : "m"}
        data-motion="traco"
        d={d}
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...animacao}
      />
    );
  }
  return (
    <g data-motion="traco">
      <mask id={id} maskUnits="userSpaceOnUse">
        <motion.path key={reduced ? "r" : "m"} d={d} fill="none" stroke="#fff" strokeWidth={strokeWidth + 3} strokeLinecap="round" {...animacao} />
      </mask>
      <path d={d} className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeDasharray="4 3" mask={`url(#${id})`} />
    </g>
  );
}
