import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export interface ParallaxMediaProps {
  amount?: 6 | 8 | 12;
  axis?: "y" | "x";
  className?: string;
  children: ReactNode;
}

/** Curso real (rodada de sobriedade): ±3/4/5% com escala 1,06/1,08/1,10 para 6/8/12 (só cobre o curso). */
const CURSO = { 6: [3, 1.06], 8: [4, 1.08], 12: [5, 1.1] } as const;

/**
 * Parallax da mídia dentro de uma janela fixa: translate ±curso% + escala que só cobre o curso (CURSO).
 * Usa CSS scroll-driven (`animation-timeline: view()`, classes .px-y-8 etc. em styles.css) quando existe;
 * sem suporte, cai para useScroll + useTransform. O reveal fica no wrapper de fora, nunca neste elemento.
 */
export function ParallaxMedia({ amount = 8, axis = "y", className, children }: ParallaxMediaProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [cssOk, setCssOk] = useState(true);
  useEffect(() => {
    setCssOk(typeof CSS !== "undefined" && CSS.supports("animation-timeline: view()"));
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const [curso, escala] = CURSO[amount];
  const v = useTransform(scrollYProgress, [0, 1], [`-${curso}%`, `${curso}%`]);
  const js = !cssOk;

  return (
    <div ref={ref} data-motion="parallax" className={`relative h-full w-full overflow-clip ${className ?? ""}`}>
      <motion.div
        className={`h-full w-full ${cssOk ? `px-${axis}-${amount}` : ""}`}
        style={js ? { [axis]: v, scale: escala } : undefined}
      >
        {children}
      </motion.div>
    </div>
  );
}
