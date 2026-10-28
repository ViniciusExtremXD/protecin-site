import { useEffect, useState } from "react";

/*
 * Preferência de movimento (rodada de sobriedade, qa/AJUSTES-SOBRIEDADE.md §1): o site anima sempre, inclusive
 * com prefers-reduced-motion: reduce no sistema. Não há mais modo reduzido para o visitante, nem ?motion=, nem
 * preferência salva. O script do <head> marca o <html> com motion-full (sempre) e, com ?proposta=1, proposta.
 * A API continua (as seções leem useMotionPref() e comparam com "reduced"), mas a resposta é sempre "full".
 */
export type MotionPref = "full" | "reduced";

/** Sempre "full" (no SSR e no cliente: sem divergência na hidratação). */
export function useMotionPref(): MotionPref {
  return "full";
}

/** Leitura direta (fora de componentes, ex.: roteador e smooth scroll). Sempre "full". */
export function motionPrefAtual(): MotionPref {
  return "full";
}

/** Modo proposta (?proposta=1): mostra os espaços reservados. false no 1º render. */
export function useProposalMode(): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => setOn(document.documentElement.classList.contains("proposta")), []);
  return on;
}
