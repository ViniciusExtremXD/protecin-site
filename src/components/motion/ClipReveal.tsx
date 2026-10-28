import type { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { DUR, EASE_IN_OUT, EASE_OUT, VIEWPORT, ease } from "./tokens";

export interface ClipRevealProps {
  from?: "bottom" | "left" | "right" | "center";
  radius?: number; // 16
  delay?: number;
  scaleFrom?: number; // 1.06 (teto 1.08)
  className?: string;
  innerClassName?: string;
  children: ReactNode;
}

/**
 * Cortina: clip-path inset(100% … round R) → inset(0 round R) uma vez (0,8 s), com a mídia interna em
 * scale 1,06 → 1 (rodada de sobriedade: zoom curto, teto 1,08; raio padrão 16 px).
 */
export function ClipReveal({ from = "bottom", radius = 16, delay = 0, scaleFrom = 1.06, className, innerClassName, children }: ClipRevealProps) {
  const zoom = Math.min(Math.max(scaleFrom, 1), 1.08);
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
  const externo: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      clipPath: [fechado, aberto],
      transition: { opacity: { duration: 0, delay }, clipPath: { duration: DUR.longa, ease: ease(EASE_IN_OUT), delay } },
    },
  };
  const interno: Variants = { hidden: { scale: zoom }, show: { scale: 1, transition: { duration: DUR.longa, ease: ease(EASE_OUT), delay } } };
  const gatilho = { whileInView: "show", viewport: VIEWPORT };

  return (
    <motion.div className={className} data-motion="cortina" initial="hidden" variants={externo} style={{ borderRadius: radius }} {...gatilho}>
      <motion.div className={`h-full w-full ${innerClassName ?? ""}`} variants={interno}>
        {children}
      </motion.div>
    </motion.div>
  );
}
