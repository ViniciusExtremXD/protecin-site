import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useMotionPref } from "../../lib/motion-pref";

/** "Pavio" de 2 px no topo (P1): brasa-500 com scaleX = progresso da página e uma brasa de 6 px na ponta. */
export function ScrollFuse() {
  const reduced = useMotionPref() === "reduced";
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });
  const x = useTransform(p, (v) => `${v * 100}vw`);
  const brilho = useTransform(p, [0, 0.01], [0, 1]);
  return (
    <div aria-hidden data-motion="pavio" className="pointer-events-none fixed inset-x-0 top-0 z-[51] h-0.5">
      <motion.div className="h-full origin-left bg-brasa-500" style={{ scaleX: reduced ? scrollYProgress : p }} />
      <motion.span
        className="absolute -top-0.5 -ml-[3px] h-1.5 w-1.5 rounded-full bg-brasa-200 shadow-[0_0_12px_4px_rgba(232,68,46,0.7)]"
        style={{ x, opacity: brilho }}
      />
    </div>
  );
}
