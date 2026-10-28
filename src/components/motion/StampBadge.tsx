import { motion } from "framer-motion";
import { useMotionPref } from "../../lib/motion-pref";
import { SPRING, VIEWPORT } from "./tokens";

const ESCONDIDO = { opacity: 0, scale: 1.35, rotate: -8 };
const VISIVEL = { opacity: 1, scale: 1, rotate: 0 };

/** Carimbo mono com borda (preset "carimbo": scale 1.35 → 1, rotate -8° → 0, SPRING.encaixe). Cor por className. */
export function StampBadge({ text, className, trigger = "inView", show = true }: { text: string; className?: string; trigger?: "inView" | "manual"; show?: boolean }) {
  const reduced = useMotionPref() === "reduced";
  const gatilho =
    trigger === "manual" ? { animate: show ? VISIVEL : ESCONDIDO } : reduced ? { animate: VISIVEL } : { whileInView: VISIVEL, viewport: VIEWPORT };
  return (
    <motion.span
      data-motion="carimbo"
      className={`inline-flex max-w-full items-center gap-2 rounded-r-sm border-2 border-current px-3 py-1.5 font-mono text-rotulo uppercase ${className ?? "text-brasa-300"}`}
      initial={ESCONDIDO}
      transition={reduced ? { duration: 0.2, scale: { duration: 0 }, rotate: { duration: 0 } } : { type: "spring", ...SPRING.encaixe }}
      {...gatilho}
    >
      {text}
    </motion.span>
  );
}
