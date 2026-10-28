import { useEffect, useState } from "react";
import { pushEvent } from "./track";

/*
 * Preferência de movimento (design-final §7.1 e §14). O script síncrono do <head> já decidiu e marcou o <html>:
 * motion-full | motion-reduced (+ motion-reduced-sys quando foi o sistema que pediu) e proposta.
 * ?motion=full (ou 1) força o movimento para a apresentação e fica salvo em localStorage "pt-motion".
 */
export type MotionPref = "full" | "reduced";

const temClasse = (c: string) => typeof document !== "undefined" && document.documentElement.classList.contains(c);

/** "full" no 1º render (casa com o SSR); depois lê html.motion-reduced. */
export function useMotionPref(): MotionPref {
  const [pref, setPref] = useState<MotionPref>("full");
  useEffect(() => {
    if (temClasse("motion-reduced")) setPref("reduced");
  }, []);
  return pref;
}

/** Leitura direta (fora de componentes, ex.: roteador e smooth scroll). */
export function motionPrefAtual(): MotionPref {
  return temClasse("motion-reduced") ? "reduced" : "full";
}

export function setMotionPref(p: MotionPref): void {
  try {
    localStorage.setItem("pt-motion", p);
  } catch {
    /* armazenamento bloqueado: vale só para esta carga */
  }
  pushEvent("motion_toggle", { mode: p });
  // remove ?motion= da URL para a escolha salva valer na recarga
  const url = new URL(window.location.href);
  url.searchParams.delete("motion");
  window.location.replace(url.toString());
}

/** O sistema pediu menos movimento e não há preferência salva. */
export function useReducedBySystem(): boolean {
  const [sys, setSys] = useState(false);
  useEffect(() => setSys(temClasse("motion-reduced-sys")), []);
  return sys;
}

/** Modo proposta (?proposta=1): mostra os espaços reservados. false no 1º render. */
export function useProposalMode(): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => setOn(temClasse("proposta")), []);
  return on;
}
