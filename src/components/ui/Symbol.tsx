import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useInView, type MotionStyle } from "framer-motion";
import { EASE_IN_OUT, EASE_OUT, VIEWPORT, ease } from "../motion/tokens";

export type ParteSimbolo = "tl" | "tr" | "bl" | "br" | "gota";

export interface SymbolProps {
  size?: number | string;
  tone?: "escuro" | "claro" | "mono";
  title?: string;
  className?: string;
  partStyle?: Partial<Record<ParteSimbolo, MotionStyle>>; // transforms vindos de cena
  mode?: "estatico" | "montar" | "desenhar" | "css-montar";
  delay?: number;
}

/** Geometria tirada de SIMBOLO.png (design-final §4.5): cantoneira 44,3 × 13,2, vão 11,4, raio 9, gota de raio 25. */
export const PARTES: { parte: ParteSimbolo; d: string }[] = [
  { parte: "tl", d: "M44 0 H9 A9 9 0 0 0 0 9 V44 H13 V13 H44 Z" },
  { parte: "tr", d: "M56 0 H91 A9 9 0 0 1 100 9 V44 H87 V13 H56 Z" },
  { parte: "bl", d: "M0 56 V91 A9 9 0 0 0 9 100 H44 V87 H13 V56 Z" },
  { parte: "br", d: "M100 56 V91 A9 9 0 0 1 91 100 H56 V87 H87 V56 Z" },
  { parte: "gota", d: "M50 25 H75 V50 A25 25 0 0 1 50 75 A25 25 0 0 1 25 50 A25 25 0 0 1 50 25 Z" },
];

const CORES = {
  escuro: { base: "#F3EFE9", tr: "#E8442E", gota: "#E8442E" },
  claro: { base: "#0E3452", tr: "#BE1E29", gota: "#BE1E29" },
  mono: { base: "#F3EFE9", tr: "#F3EFE9", gota: "#F3EFE9" },
} as const;

// direção de saída de cada cantoneira no modo "montar" (unidades do viewBox; 14 ≈ 17 px num símbolo de 120 px)
const FORA: Record<Exclude<ParteSimbolo, "gota">, [number, number]> = { tl: [-14, -14], tr: [14, -14], bl: [-14, 14], br: [14, 14] };

/** O símbolo da Protecin vetorizado: 4 cantoneiras e a gota (canto superior direito reto). */
export function Symbol({ size = 48, tone = "escuro", title, className, partStyle, mode = "estatico", delay = 0 }: SymbolProps) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, VIEWPORT);
  const cores = CORES[tone];
  const corDe = (p: ParteSimbolo) => (p === "gota" ? cores.gota : p === "tr" ? cores.tr : cores.base);
  const dim = typeof size === "number" ? `${size}px` : size;
  const a11y = title ? { role: "img", "aria-label": title } : { "aria-hidden": true };

  // "montar" e "desenhar" saem do SSR (e do 1º render do cliente) com o símbolo completo e parado: sem JS ou com o
  // motor caído ele aparece inteiro. Depois de montar, os caminhos remontam (key) no estado inicial da animação e
  // entram quando o símbolo chega à tela.
  const animado = mode === "montar" || mode === "desenhar";
  const [vivo, setVivo] = useState(false);
  useEffect(() => {
    if (animado) setVivo(true);
  }, [animado]);
  const modo = animado && !vivo ? "estatico" : mode;
  const mostrar = inView;
  const pathProps = (p: ParteSimbolo, i: number) => {
    const cor = corDe(p);
    if (modo === "montar") {
      if (p === "gota")
        return {
          initial: { scale: 0 },
          animate: mostrar ? { scale: 1 } : undefined,
          transition: { duration: 0.6, ease: ease(EASE_OUT), delay: delay + 0.32 },
          style: { originX: "50%", originY: "50%", ...partStyle?.[p] },
          fill: cor,
        };
      const [dx, dy] = FORA[p];
      return {
        initial: { x: dx, y: dy, opacity: 0 },
        animate: mostrar ? { x: 0, y: 0, opacity: 1 } : undefined,
        transition: { duration: 0.7, ease: ease(EASE_OUT), delay: delay + i * 0.08 },
        style: partStyle?.[p],
        fill: cor,
      };
    }
    if (modo === "desenhar") {
      return {
        initial: { pathLength: 0, fillOpacity: 0 },
        animate: mostrar ? { pathLength: 1, fillOpacity: 1 } : undefined,
        transition: {
          pathLength: { duration: 0.8, ease: ease(EASE_IN_OUT), delay: delay + i * 0.06 },
          fillOpacity: { duration: 0.3, ease: ease(EASE_OUT), delay: delay + 0.8 },
        },
        style: partStyle?.[p],
        fill: cor,
        stroke: cor,
        strokeWidth: 1,
      };
    }
    // parado: no "desenhar" leva o mesmo contorno do estado final, para a troca não mudar o desenho
    return mode === "desenhar" ? { style: partStyle?.[p], fill: cor, stroke: cor, strokeWidth: 1 } : { style: partStyle?.[p], fill: cor };
  };

  return (
    <svg
      ref={ref}
      viewBox="0 0 100 100"
      width={typeof size === "number" ? size : undefined}
      height={typeof size === "number" ? size : undefined}
      className={`${mode === "css-montar" ? "sym-css" : ""} block shrink-0 overflow-visible ${className ?? ""}`}
      style={className?.match(/(^|\s)(w|h)-/) ? undefined : ({ width: dim, height: dim } as CSSProperties)}
      data-motion={mode === "estatico" ? undefined : mode === "css-montar" ? "css" : mode}
      {...a11y}
    >
      {title && <title>{title}</title>}
      {PARTES.map(({ parte, d }, i) => (
        <motion.path key={`${parte}-${modo}`} data-parte={parte} d={d} {...pathProps(parte, i)} />
      ))}
    </svg>
  );
}
