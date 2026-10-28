import { useEffect, useLayoutEffect } from "react";

/* Vocabulário de motion (design-final §5.1). O CSS espelha esses valores em :root (styles.css). */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const; // entradas (Seven)
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const; // máscaras, traços, cortinas
export const EASE_IN = [0.7, 0, 0.84, 0] as const; // saídas
export const EASE_BACK = [0.34, 1.56, 0.64, 1] as const; // carimbo, encaixe
export const SPRING = {
  rolagem: { stiffness: 140, damping: 30, mass: 0.35 }, // suaviza progress de cena fixada
  ima: { stiffness: 220, damping: 16, mass: 0.4 }, // Magnetic
  pilula: { stiffness: 380, damping: 30 }, // layoutId, Reel por estado
  encaixe: { stiffness: 420, damping: 32, mass: 0.6 }, // cantoneiras, carimbos
  tilt: { stiffness: 220, damping: 18 }, // TiltCard
  previa: { stiffness: 160, damping: 22 }, // CursorPreview
} as const;
export const DUR = { micro: 0.2, curta: 0.35, base: 0.6, longa: 0.8, max: 0.9 } as const; // segundos
export const STAGGER = { linha: 0.08, palavra: 0.04, item: 0.06, grade: 0.05, digito: 0.04 } as const;
export const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;
export type Preset = "sobe" | "fade" | "virada" | "monta" | "carimbo";

/** Mutável (o framer-motion espera arrays mutáveis nas opções de ease). */
export const ease = (e: readonly [number, number, number, number]): [number, number, number, number] => [e[0], e[1], e[2], e[3]];

/** useLayoutEffect no cliente e useEffect no servidor (evita o aviso do React no prerender). */
export const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
