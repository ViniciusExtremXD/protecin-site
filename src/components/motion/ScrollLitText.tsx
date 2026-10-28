import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useMotionPref } from "../../lib/motion-pref";

type Offset = NonNullable<Parameters<typeof useScroll>[0]>["offset"];

export interface ScrollLitTextProps {
  text: string; // "*palavra*" = destaque
  as?: "h2" | "p" | "span";
  className?: string;
  highlightClassName?: string;
  from?: number; // opacidade inicial (0.18)
  offset?: [string, string]; // ["start 80%", "end 45%"]
  progress?: MotionValue<number>; // usa o progress de uma cena fixada
  range?: [number, number];
}

interface Palavra {
  texto: string;
  destaque: boolean;
}

function separar(text: string): Palavra[] {
  return text.split(" ").map((w) => ({ texto: w.replace(/\*/g, ""), destaque: /\*/.test(w) }));
}

function Palavra({ p, progress, range, from, cls }: { p: Palavra; progress: MotionValue<number>; range: [number, number]; from: number; cls: string }) {
  const opacity = useTransform(progress, range, [from, 1]);
  return (
    <motion.span style={{ opacity }} className={p.destaque ? cls : undefined}>
      {p.texto}{" "}
    </motion.span>
  );
}

/** Texto cujas palavras acendem (opacidade 0,18 → 1) conforme a rolagem. */
export function ScrollLitText({
  text,
  as: Tag = "p",
  className,
  highlightClassName = "text-brasa-400",
  from = 0.18,
  offset = ["start 80%", "end 45%"],
  progress,
  range = [0, 1],
}: ScrollLitTextProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: offset as Offset });
  const reduced = useMotionPref() === "reduced";
  const palavras = separar(text);
  const limpo = palavras.map((p) => p.texto).join(" ");
  const fonte = progress ?? scrollYProgress;
  const [a, b] = progress ? range : [0, 1];
  const passo = (b - a) / palavras.length;

  return (
    <Tag ref={ref as never} className={className} aria-label={limpo} data-motion="acende">
      <span aria-hidden>
        {palavras.map((p, i) =>
          reduced ? (
            <span key={i} className={p.destaque ? highlightClassName : undefined}>
              {p.texto}{" "}
            </span>
          ) : (
            <Palavra key={i} p={p} progress={fonte} range={[a + i * passo, a + (i + 1) * passo]} from={from} cls={highlightClassName} />
          ),
        )}
      </span>
    </Tag>
  );
}
