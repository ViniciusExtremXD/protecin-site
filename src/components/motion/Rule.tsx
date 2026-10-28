import { motion } from "framer-motion";
import { useMotionPref } from "../../lib/motion-pref";
import { DUR, EASE_OUT, VIEWPORT, ease } from "./tokens";

/** Régua de 1 px que se estende a partir da origem (scaleX/scaleY 0 → 1, 900 ms). Cor padrão noite-600. */
export function Rule({ axis = "x", origin = "start", delay = 0, className }: { axis?: "x" | "y"; origin?: "start" | "end" | "center"; delay?: number; className?: string }) {
  const reduced = useMotionPref() === "reduced";
  const prop = axis === "x" ? "scaleX" : "scaleY";
  const o = origin === "center" ? "50% 50%" : axis === "x" ? (origin === "start" ? "0% 50%" : "100% 50%") : origin === "start" ? "50% 0%" : "50% 100%";
  const cor = className?.includes("bg-") ? "" : "bg-noite-600";
  const tamanho = axis === "x" ? "h-px w-full" : "h-full w-px";
  return (
    <motion.span
      aria-hidden
      data-motion="regua"
      className={`block ${tamanho} ${cor} ${className ?? ""}`}
      style={{ transformOrigin: o }}
      initial={{ [prop]: 0 }}
      {...(reduced
        ? { animate: { [prop]: 1 }, transition: { duration: 0 } }
        : { whileInView: { [prop]: 1 }, viewport: VIEWPORT, transition: { duration: DUR.max, ease: ease(EASE_OUT), delay } })}
    />
  );
}
