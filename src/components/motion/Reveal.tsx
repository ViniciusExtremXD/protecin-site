import { createContext, useContext, type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { useMotionPref } from "../../lib/motion-pref";
import { DUR, EASE_OUT, SPRING, STAGGER, VIEWPORT, ease, type Preset } from "./tokens";

type RevealTag = "div" | "li" | "p" | "span" | "section" | "article" | "figure" | "header" | "ul" | "ol";

export interface RevealProps {
  as?: RevealTag;
  preset?: Preset;
  delay?: number;
  y?: number;
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

/** Transição do modo reduzido: opacidade em 200 ms e qualquer transform instantâneo. */
export const TRANSICAO_REDUZIDA = {
  duration: DUR.micro,
  x: { duration: 0 },
  y: { duration: 0 },
  rotate: { duration: 0 },
  rotateX: { duration: 0 },
  scale: { duration: 0 },
};

/**
 * Movimento reduzido: só fade de 200 ms, sem deslocamento. O 1º render é sempre "full" (casa com o SSR), então
 * o estado final também zera os transforms que o preset aplicou na montagem.
 */
export const FADE_REDUZIDO: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, x: 0, y: 0, rotate: 0, rotateX: 0, scale: 1, transition: TRANSICAO_REDUZIDA },
};

/** Variantes de cada preset (§5.2). Sem `delay` quando o pai controla a cascata. */
export function variantesPreset(preset: Preset, y = 28, delay = 0): Variants {
  const out = ease(EASE_OUT);
  switch (preset) {
    case "fade":
      return { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.4, ease: out, delay } } };
    case "virada":
      return {
        hidden: { opacity: 0, rotateX: 70, transformPerspective: 900 },
        show: { opacity: 1, rotateX: 0, transformPerspective: 900, transition: { duration: DUR.base, ease: out, delay } },
      };
    case "monta":
      return {
        hidden: (i: number = 0) => ({ opacity: 0, x: ruido(i, 1) * 60, y: 80, rotate: ruido(i, 2) * 6 }),
        show: { opacity: 1, x: 0, y: 0, rotate: 0, transition: { duration: 0.65, ease: out, delay } },
      };
    case "carimbo":
      return {
        hidden: { opacity: 0, scale: 1.35, rotate: -8 },
        show: { opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", ...SPRING.encaixe, delay } },
      };
    default:
      return { hidden: { opacity: 0, y }, show: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: out, delay } } };
  }
}

const ORIGEM: Partial<Record<Preset, string>> = { virada: "50% 100%" };

/** Entrada única quando o elemento entra 12% na tela. */
export function Reveal({ as = "div", preset = "sobe", delay = 0, y = 28, index = 0, className, id, viewport = VIEWPORT, children }: RevealProps) {
  const reduced = useMotionPref() === "reduced";
  const Comp = motion[as] as typeof motion.div;
  const gatilho = reduced ? { animate: "show" } : { whileInView: "show", viewport };
  return (
    <Comp
      id={id}
      className={className}
      data-motion={preset}
      custom={index}
      initial="hidden"
      variants={reduced ? FADE_REDUZIDO : variantesPreset(preset, y, delay)}
      style={ORIGEM[preset] ? { transformOrigin: ORIGEM[preset] } : undefined}
      {...gatilho}
    >
      {children}
    </Comp>
  );
}

const GrupoCtx = createContext<{ preset: Preset; y: number }>({ preset: "sobe", y: 28 });

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
export function RevealGroup({ as = "div", preset = "sobe", stagger = STAGGER.item, delay = 0, y = 28, className, children }: RevealGroupProps) {
  const reduced = useMotionPref() === "reduced";
  const Comp = motion[as] as typeof motion.div;
  const gatilho = reduced ? { animate: "show" } : { whileInView: "show", viewport: VIEWPORT };
  return (
    <GrupoCtx.Provider value={{ preset, y }}>
      <Comp
        className={className}
        data-motion="grupo"
        initial="hidden"
        variants={{ hidden: {}, show: { transition: { staggerChildren: reduced ? 0 : stagger, delayChildren: reduced ? 0 : delay } } }}
        {...gatilho}
      >
        {children}
      </Comp>
    </GrupoCtx.Provider>
  );
}

export function RevealItem({ as = "div", className, index = 0, children }: { as?: RevealTag; className?: string; index?: number; children: ReactNode }) {
  const { preset, y } = useContext(GrupoCtx);
  const reduced = useMotionPref() === "reduced";
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      className={className}
      data-motion={preset}
      custom={index}
      variants={reduced ? FADE_REDUZIDO : variantesPreset(preset, y)}
      style={ORIGEM[preset] ? { transformOrigin: ORIGEM[preset] } : undefined}
    >
      {children}
    </Comp>
  );
}
