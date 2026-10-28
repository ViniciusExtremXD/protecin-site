import { motion } from "framer-motion";
import { DUR, EASE_OUT, VIEWPORT, ease } from "./tokens";

const ESCONDIDO = { opacity: 0, scale: 1.04, rotate: 0 };
const VISIVEL = { opacity: 1, scale: 1, rotate: 0 };

/** Carimbo mono com borda (preset "carimbo" da rodada de sobriedade: opacidade e scale 1,04 → 1, sem giro). Cor por className. */
export function StampBadge({ text, className, trigger = "inView", show = true }: { text: string; className?: string; trigger?: "inView" | "manual"; show?: boolean }) {
  const gatilho = trigger === "manual" ? { animate: show ? VISIVEL : ESCONDIDO } : { whileInView: VISIVEL, viewport: VIEWPORT };
  return (
    <motion.span
      data-motion="carimbo"
      className={`inline-flex max-w-full items-center gap-2 rounded-r-sm border-2 border-current px-3 py-1.5 font-mono text-rotulo uppercase ${className ?? "text-brasa-300"}`}
      initial={ESCONDIDO}
      transition={{ duration: DUR.base - 0.1, ease: ease(EASE_OUT) }}
      {...gatilho}
    >
      {text}
    </motion.span>
  );
}
