import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Rule } from "./Rule";

/**
 * Seção que sobe por cima da anterior: -mt-[40px], cantos superiores arredondados, scale 0,98 → 1 e y 24 px → 0
 * enquanto o topo vai do fim da tela ao topo (rodada de sobriedade: curso curto). Linha clara de 1 px no topo
 * (neutra: o vermelho fica para os CTAs e destaques pontuais).
 */
export function SectionRise({ as = "section", id, className, radius = 40, children }: { as?: "section" | "footer" | "div"; id?: string; className?: string; radius?: number; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.98, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [24, 0]);
  const Comp = motion[as] as typeof motion.section;
  const cantos = { borderTopLeftRadius: radius, borderTopRightRadius: radius };

  return (
    <Comp
      ref={ref}
      id={id}
      data-motion="rise"
      className={`relative z-[1] -mt-[40px] overflow-clip ${className ?? ""}`}
      style={{ ...cantos, scale, y, transformOrigin: "50% 0%" }}
    >
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[2] flex justify-center">
        <Rule origin="center" className="w-3/4 bg-[linear-gradient(90deg,transparent,rgba(243,239,233,0.22),transparent)]" />
      </span>
      {children}
    </Comp>
  );
}
