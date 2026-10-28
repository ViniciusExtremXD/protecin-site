import { AnimatePresence, motion } from "framer-motion";
import { useRouteTransition } from "../../lib/router";
import { EASE_IN_OUT, EASE_OUT, ease } from "../motion/tokens";
import { PARTES } from "../ui/Symbol";

const FORA = { tl: [-14, -14], tr: [14, -14], bl: [-14, 14], br: [14, 14], gota: [0, 0] } as const;

/**
 * Cortina da troca de página (§7.5, rodada de sobriedade): painel noite-900 sobe (450 ms) com o símbolo fechando as
 * cantoneiras, a rota troca por baixo e o painel sai para cima (550 ms). Sem o clarão vermelho de tela cheia.
 */
export function PageCurtain() {
  const { phase } = useRouteTransition();
  const ativo = phase !== "idle";

  return (
    <AnimatePresence>
      {ativo && (
        <motion.div
          aria-hidden
          data-motion="cortina-rota"
          className="fixed inset-0 z-cortina grid place-items-center bg-noite-900"
          initial={{ y: "100%" }}
          animate={phase === "cobrindo" ? { y: "0%", transition: { duration: 0.45, ease: ease(EASE_IN_OUT) } } : { y: "-100%", transition: { duration: 0.55, ease: ease(EASE_OUT) } }}
          exit={{ opacity: 0, transition: { duration: 0 } }}
        >
          <svg viewBox="0 0 100 100" width={96} height={96} className="overflow-visible">
            {PARTES.map(({ parte, d }) => (
              <motion.path
                key={parte}
                d={d}
                fill={parte === "gota" || parte === "tr" ? "#E8442E" : "#F3EFE9"}
                initial={parte === "gota" ? { scale: 0 } : { x: FORA[parte][0], y: FORA[parte][1], opacity: 0 }}
                animate={parte === "gota" ? { scale: 1 } : { x: 0, y: 0, opacity: 1 }}
                style={parte === "gota" ? { originX: "50%", originY: "50%" } : undefined}
                transition={{ duration: 0.2, ease: ease(EASE_OUT), delay: 0.25 }}
              />
            ))}
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
