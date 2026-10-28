import { useTransform, type MotionValue } from "framer-motion";

/*
 * Posição num caminho pré-calculado (caminho.ts): o chip "Ordem de serviço" do pilar 02 anda por transform (x/y),
 * sem medir nada no DOM. (Os pacotes de dados em loop saíram na rodada de sobriedade: nada fica em loop.)
 */

/** Posição (x, y) no caminho para um progresso 0–1. */
export function usePontoNoCaminho(pontos: readonly (readonly [number, number])[], progresso: MotionValue<number>) {
  const ultimo = pontos.length - 1;
  const indice = (v: number) => Math.round(Math.min(1, Math.max(0, v)) * ultimo);
  const x = useTransform(progresso, (v) => pontos[indice(v)][0]);
  const y = useTransform(progresso, (v) => pontos[indice(v)][1]);
  return { x, y };
}
