import { createContext, useContext, type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { DESLOCAMENTO, DUR, EASE_OUT, STAGGER, VIEWPORT, ease, limitarY, type Preset } from "./tokens";

type RevealTag = "div" | "li" | "p" | "span" | "section" | "article" | "figure" | "header" | "ul" | "ol";

export interface RevealProps {
  as?: RevealTag;
  preset?: Preset;
  delay?: number;
  y?: number; // limitado a 24 px
  index?: number; // posição para "monta"
  className?: string;
  id?: string;
  /** padrão VIEWPORT (once, margem de baixo -12%). O fim da página nunca entra nessa faixa: use margem 0 ali. */
  viewport?: { once?: boolean; margin?: string; amount?: number | "some" | "all" };
  children: ReactNode;
}

/**
 * Ruído determinístico em [-1, 1] (posições espalhadas do preset "monta", iguais no SSR e no cliente).
 * Hash inteiro (Math.imul): o Math.sin do Node e o do Chrome diferem na última casa, e o fator gigante do truque
 * "fract(sin(x) * 43758)" levava a diferença para o estilo, com aviso de hidratação.
 */
function ruido(i: number, semente: number): number {
  let h = Math.imul(i + 1, 0x9e3779b1) ^ Math.imul(semente + 1, 0x85ebca77);
  h = Math.imul(h ^ (h >>> 15), 0x2c1b3c6d);
  h = Math.imul(h ^ (h >>> 12), 0x297a2d39);
  h ^= h >>> 15;
  return Math.round(((h >>> 0) / 4294967295) * 2000) / 1000 - 1;
}

/** Mantido por compatibilidade (não há mais modo reduzido): opacidade em 200 ms e transform instantâneo. */
export const TRANSICAO_REDUZIDA = {
  duration: DUR.micro,
  x: { duration: 0 },
  y: { duration: 0 },
  rotate: { duration: 0 },
  rotateX: { duration: 0 },
  scale: { duration: 0 },
};

/** Mantido por compatibilidade (não há mais modo reduzido): só fade, sem deslocamento. */
export const FADE_REDUZIDO: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, x: 0, y: 0, rotate: 0, rotateX: 0, scale: 1, transition: TRANSICAO_REDUZIDA },
};

/**
 * Variantes de cada preset (§5.2, recalibradas na rodada de sobriedade). Sem `delay` quando o pai controla a cascata.
 *  - sobe: opacidade e subida de até 24 px (0,6 s);
 *  - fade: só opacidade (0,6 s);
 *  - virada: subida curta (16 px), sem giro (o nome fica pela API);
 *  - monta: posições levemente espalhadas (±12 px) que se alinham, sem giro;
 *  - carimbo: opacidade e escala 1,04 → 1 (0,5 s), sem giro.
 */
export function variantesPreset(preset: Preset, y: number = DESLOCAMENTO.base, delay = 0): Variants {
  const out = ease(EASE_OUT);
  const dy = limitarY(y);
  switch (preset) {
    case "fade":
      return { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: DUR.base, ease: out, delay } } };
    case "virada":
      return {
        hidden: { opacity: 0, y: DESLOCAMENTO.min },
        show: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: out, delay } },
      };
    case "monta":
      return {
        hidden: (i: number = 0) => ({ opacity: 0, x: ruido(i, 1) * 12, y: dy, rotate: 0 }),
        show: { opacity: 1, x: 0, y: 0, rotate: 0, transition: { duration: 0.65, ease: out, delay } },
      };
    case "carimbo":
      return {
        hidden: { opacity: 0, scale: 1.04, rotate: 0 },
        show: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.5, ease: out, delay } },
      };
    default:
      return { hidden: { opacity: 0, y: dy }, show: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: out, delay } } };
  }
}

/** Entrada única quando o elemento entra 12% na tela. */
export function Reveal({ as = "div", preset = "sobe", delay = 0, y = DESLOCAMENTO.base, index = 0, className, id, viewport = VIEWPORT, children }: RevealProps) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      id={id}
      className={className}
      data-motion={preset}
      custom={index}
      initial="hidden"
      variants={variantesPreset(preset, y, delay)}
      whileInView="show"
      viewport={viewport}
    >
      {children}
    </Comp>
  );
}

const GrupoCtx = createContext<{ preset: Preset; y: number }>({ preset: "sobe", y: DESLOCAMENTO.base });

export interface RevealGroupProps {
  as?: RevealTag;
  preset?: Preset;
  stagger?: number;
  delay?: number;
  y?: number;
  className?: string;
  children: ReactNode;
}

/** Dispara os RevealItem filhos em cascata (primeiro em até 100 ms, último em até 600 ms do gatilho). */
export function RevealGroup({ as = "div", preset = "sobe", stagger = STAGGER.item, delay = 0, y = DESLOCAMENTO.base, className, children }: RevealGroupProps) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <GrupoCtx.Provider value={{ preset, y }}>
      <Comp
        className={className}
        data-motion="grupo"
        initial="hidden"
        variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
        whileInView="show"
        viewport={VIEWPORT}
      >
        {children}
      </Comp>
    </GrupoCtx.Provider>
  );
}

export function RevealItem({ as = "div", className, index = 0, children }: { as?: RevealTag; className?: string; index?: number; children: ReactNode }) {
  const { preset, y } = useContext(GrupoCtx);
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp className={className} data-motion={preset} custom={index} variants={variantesPreset(preset, y)}>
      {children}
    </Comp>
  );
}
