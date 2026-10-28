import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Progresso de leitura: linha de 2 px no topo, brasa-500 a 80%, com scaleX = progresso da página.
 * Rodada de sobriedade: sem a brasa brilhante na ponta (nada de glow vermelho fora da Abertura e do Orçamento).
 */
export function ScrollFuse() {
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.3 });
  return (
    <div aria-hidden data-motion="pavio" className="pointer-events-none fixed inset-x-0 top-0 z-[51] h-0.5">
      <motion.div className="h-full origin-left bg-brasa-500/80" style={{ scaleX: p }} />
    </div>
  );
}
