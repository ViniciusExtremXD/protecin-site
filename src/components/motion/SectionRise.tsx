import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useMotionPref } from "../../lib/motion-pref";
import { Rule } from "./Rule";

/**
 * Seção que sobe por cima da anterior: -mt-[40px], cantos superiores arredondados, scale .9 → 1 e y 12vh → 0
 * enquanto o topo vai do fim da tela ao topo. Linha de luz de 1 px no topo.
 */
export function SectionRise({ as = "section", id, className, radius = 40, children }: { as?: "section" | "footer" | "div"; id?: string; className?: string; radius?: number; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useMotionPref() === "reduced";
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ["12vh", "0vh"]);
  const Comp = motion[as] as typeof motion.section;
  const cantos = { borderTopLeftRadius: radius, borderTopRightRadius: radius };

  return (
    <Comp
      ref={ref}
      id={id}
      data-motion="rise"
      className={`relative z-[1] -mt-[40px] overflow-clip ${className ?? ""}`}
      style={reduced ? { ...cantos, scale: 1, y: 0 } : { ...cantos, scale, y, transformOrigin: "50% 0%" }}
    >
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[2] flex justify-center">
        <Rule origin="center" className="w-3/4 bg-[linear-gradient(90deg,transparent,#E8442E,transparent)]" />
      </span>
      {children}
    </Comp>
  );
}
