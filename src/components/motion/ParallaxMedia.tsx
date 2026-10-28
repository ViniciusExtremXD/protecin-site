import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useMotionPref } from "../../lib/motion-pref";

export interface ParallaxMediaProps {
  amount?: 6 | 8 | 12;
  axis?: "y" | "x";
  className?: string;
  children: ReactNode;
}

/**
 * Parallax da mídia dentro de uma janela fixa: translate ±amount% + scale 1 + amount/50.
 * Usa CSS scroll-driven (`animation-timeline: view()`, classes .px-y-8 etc. em styles.css) quando existe;
 * sem suporte, cai para useScroll + useTransform. O reveal fica no wrapper de fora, nunca neste elemento.
 */
export function ParallaxMedia({ amount = 8, axis = "y", className, children }: ParallaxMediaProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [cssOk, setCssOk] = useState(true);
  const reduced = useMotionPref() === "reduced";
  useEffect(() => {
    setCssOk(typeof CSS !== "undefined" && CSS.supports("animation-timeline: view()"));
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const v = useTransform(scrollYProgress, [0, 1], [`-${amount}%`, `${amount}%`]);
  const js = !cssOk && !reduced;

  return (
    <div ref={ref} data-motion="parallax" className={`relative h-full w-full overflow-clip ${className ?? ""}`}>
      <motion.div
        className={`h-full w-full ${cssOk ? `px-${axis}-${amount}` : ""}`}
        style={js ? { [axis]: v, scale: 1 + amount / 50 } : undefined}
      >
        {children}
      </motion.div>
    </div>
  );
}
