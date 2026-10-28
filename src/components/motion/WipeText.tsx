import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useMotionPref } from "../../lib/motion-pref";
import { comDestaque } from "./SplitLines";

type Offset = NonNullable<Parameters<typeof useScroll>[0]>["offset"];

function Linha({ texto, p, range, highlight, reduced }: { texto: string; p: MotionValue<number>; range: [number, number]; highlight: readonly string[]; reduced: boolean }) {
  const x = useTransform(p, range, ["-100%", "0%"]);
  const xi = useTransform(p, range, ["100%", "0%"]);
  return (
    <span className="relative block whitespace-nowrap">
      <span className="block text-outline">{texto}</span>
      <motion.span className="absolute inset-0 block overflow-x-clip overflow-y-visible" style={reduced ? { x: "0%" } : { x }}>
        <motion.span className="block" style={reduced ? { x: "0%" } : { x: xi }}>
          {comDestaque(texto, highlight, "text-brasa-400")}
        </motion.span>
      </motion.span>
    </span>
  );
}

/**
 * Letreiro que "limpa": contorno (.text-outline) com a cópia preenchida revelada da esquerda para a direita,
 * linha a linha, ligada à rolagem. Palavras de highlight preenchem em brasa-400.
 */
export function WipeText({ lines, highlight = [], className, offset = ["start end", "end end"] }: { lines: readonly string[]; highlight?: readonly string[]; className?: string; offset?: [string, string] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: offset as Offset });
  const reduced = useMotionPref() === "reduced";
  const n = lines.length;
  return (
    <div ref={ref} className={className} data-motion="wipe">
      <span className="sr-only">{lines.join(" ")}</span>
      <span aria-hidden className="block">
        {lines.map((l, i) => (
          <Linha key={i} texto={l} p={scrollYProgress} range={[i / n, (i + 1) / n]} highlight={highlight} reduced={reduced} />
        ))}
      </span>
    </div>
  );
}
