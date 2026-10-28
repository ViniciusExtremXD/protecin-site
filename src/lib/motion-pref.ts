import { useEffect, useState } from "react";

/*
 * Rodada de sobriedade (qa/AJUSTES-SOBRIEDADE.md §1): o site anima sempre, inclusive com prefers-reduced-motion:
 * reduce no sistema. Não há modo reduzido, ?motion=, preferência salva nem botão de animações; o script do <head>
 * marca o <html> com motion-full (sempre) e, com ?proposta=1, proposta. Daqui só sobra o modo proposta.
 */

/** Modo proposta (?proposta=1): mostra os espaços reservados. false no 1º render. */
export function useProposalMode(): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => setOn(document.documentElement.classList.contains("proposta")), []);
  return on;
}
