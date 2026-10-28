import type { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { useMotionPref } from "../../lib/motion-pref";
import { DUR, EASE_IN_OUT, EASE_OUT, VIEWPORT, ease } from "./tokens";

export interface ClipRevealProps {
  from?: "bottom" | "left" | "right" | "center";
  radius?: number; // 28
  delay?: number;
  scaleFrom?: number; // 1.25
  className?: string;
  innerClassName?: string;
  children: ReactNode;
}

/** Cortina: clip-path inset(100% … round R) → inset(0 round R) uma vez, com a mídia interna em scale 1.25 → 1. */
export function ClipReveal({ from = "bottom", radius = 28, delay = 0, scaleFrom = 1.25, className, innerClassName, children }: ClipRevealProps) {
  const reduced = useMotionPref() === "reduced";
  const r = `round ${radius}px`;
  const fechado = {
    bottom: `inset(100% 0% 0% 0% ${r})`,
    left: `inset(0% 100% 0% 0% ${r})`,
    right: `inset(0% 0% 0% 100% ${r})`,
    center: `inset(50% 50% 50% 50% ${r})`,
  }[from];
  const aberto = `inset(0% 0% 0% 0% ${r})`;

  // Fechada só por opacidade, e a cortina (clip-path) começa no disparo. O IntersectionObserver do Chrome aplica o
  // clip-path do próprio alvo: com inset(100% …) desde o início, a cortina só era "vista" quando a borda de baixo
  // entrava na tela, e nunca disparava ao chegar nela por salto ou rolando de baixo para cima (o cartão do
  // formulário ficava vazio).
  const externo: Variants = reduced
    ? { hidden: { opacity: 0 }, show: { opacity: 1, clipPath: aberto, transition: { duration: 0.2, clipPath: { duration: 0 } } } }
    : {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          clipPath: [fechado, aberto],
          transition: { opacity: { duration: 0, delay }, clipPath: { duration: DUR.max, ease: ease(EASE_IN_OUT), delay } },
        },
      };
  const interno: Variants = reduced
    ? { hidden: {}, show: { scale: 1, transition: { duration: 0 } } }
    : { hidden: { scale: scaleFrom }, show: { scale: 1, transition: { duration: DUR.max, ease: ease(EASE_OUT), delay } } };
  const gatilho = reduced ? { animate: "show" } : { whileInView: "show", viewport: VIEWPORT };

  return (
    <motion.div className={className} data-motion="cortina" initial="hidden" variants={externo} style={{ borderRadius: radius }} {...gatilho}>
      <motion.div className={`h-full w-full ${innerClassName ?? ""}`} variants={interno}>
        {children}
      </motion.div>
    </motion.div>
  );
}
