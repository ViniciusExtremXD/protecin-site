import { motion, useTransform, type MotionValue } from "framer-motion";

/*
 * Pacotes de dados da plataforma (enxerto D2). Os pontos do caminho vêm pré-calculados (caminho.ts), então o
 * pacote anda por transform (x/y) e nada é medido no DOM.
 */

/**
 * Ponto de 5 px brasa-400 que corre o caminho em loop (1200 ms linear). É a única animação infinita da seção:
 * quem usa só monta o pacote enquanto o pilar está ativo e a cena está na tela.
 */
export function DataPacket({ pontos, delay = 0, duracao = 1.2 }: { pontos: readonly (readonly [number, number])[]; delay?: number; duracao?: number }) {
  const xs = pontos.map((p) => p[0]);
  const ys = pontos.map((p) => p[1]);
  const corrida = { duration: duracao, ease: "linear" as const, repeat: Infinity, delay };
  return (
    <motion.span
      aria-hidden
      data-motion="pacote"
      className="pointer-events-none absolute left-0 top-0 block h-[6px] w-[6px] rounded-full bg-brasa-400 shadow-[0_0_10px_3px_rgba(232,68,46,0.55)]"
      style={{ translate: "-50% -50%" }}
      initial={{ x: xs[0], y: ys[0], opacity: 0 }}
      animate={{ x: xs, y: ys, opacity: [0, 1, 1, 0] }}
      transition={{ x: corrida, y: corrida, opacity: { ...corrida, times: [0, 0.08, 0.9, 1] } }}
    />
  );
}

/** Posição (x, y) no caminho para um progresso 0–1 vindo da rolagem. */
export function usePontoNoCaminho(pontos: readonly (readonly [number, number])[], progresso: MotionValue<number>) {
  const ultimo = pontos.length - 1;
  const indice = (v: number) => Math.round(Math.min(1, Math.max(0, v)) * ultimo);
  const x = useTransform(progresso, (v) => pontos[indice(v)][0]);
  const y = useTransform(progresso, (v) => pontos[indice(v)][1]);
  return { x, y };
}
