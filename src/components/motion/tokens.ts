import { useEffect, useLayoutEffect } from "react";

/*
 * Vocabulário de motion (design-final §5.1, recalibrado na rodada de sobriedade, qa/AJUSTES-SOBRIEDADE.md §1).
 * O CSS espelha esses valores em :root (styles.css).
 *  - entradas: deslocamento de 16 a 24 px (DESLOCAMENTO) e duração de 0,5 a 0,8 s (DUR.base a DUR.longa);
 *  - escala em texto nunca passa de 1,06 (ESCALA_TEXTO_MAX) e título não gira;
 *  - hover sutil: ímã e inclinação com teto (IMA_MAX, TILT_MAX).
 */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const; // entradas (Seven)
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const; // máscaras, traços, cortinas
export const EASE_IN = [0.7, 0, 0.84, 0] as const; // saídas
export const EASE_BACK = [0.34, 1.56, 0.64, 1] as const; // encaixe (uso pontual; as entradas usam EASE_OUT)
export const SPRING = {
  rolagem: { stiffness: 140, damping: 30, mass: 0.35 }, // suaviza progress de cena fixada
  ima: { stiffness: 200, damping: 24, mass: 0.4 }, // Magnetic (amortecido: sem balanço)
  pilula: { stiffness: 380, damping: 34 }, // layoutId, Reel por estado
  encaixe: { stiffness: 380, damping: 36, mass: 0.6 }, // cantoneiras, carimbos (sem sobressalto)
  tilt: { stiffness: 200, damping: 24 }, // TiltCard
  previa: { stiffness: 160, damping: 24 }, // CursorPreview
} as const;
export const DUR = { micro: 0.2, curta: 0.35, base: 0.6, longa: 0.8, max: 0.8 } as const; // segundos
export const STAGGER = { linha: 0.08, palavra: 0.035, item: 0.06, grade: 0.05, digito: 0.04 } as const;
export const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;
/** Deslocamento das entradas, em px (AJUSTES-SOBRIEDADE §1). */
export const DESLOCAMENTO = { min: 16, base: 20, max: 24 } as const;
/** Teto de escala em texto (carimbos, títulos). */
export const ESCALA_TEXTO_MAX = 1.06;
/** Teto do ímã (fração da distância ao centro) e da inclinação dos cartões (graus). */
export const IMA_MAX = 0.08;
export const TILT_MAX = 4;
export type Preset = "sobe" | "fade" | "virada" | "monta" | "carimbo";

/** Limita um deslocamento de entrada ao teto de 24 px (mantém o sinal; 0 continua 0). */
export const limitarY = (y: number): number => Math.sign(y) * Math.min(Math.abs(y), DESLOCAMENTO.max);

/** Mutável (o framer-motion espera arrays mutáveis nas opções de ease). */
export const ease = (e: readonly [number, number, number, number]): [number, number, number, number] => [e[0], e[1], e[2], e[3]];

/** useLayoutEffect no cliente e useEffect no servidor (evita o aviso do React no prerender). */
export const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
