import { Fragment, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useMotionPref } from "../../lib/motion-pref";
import { EASE_OUT, STAGGER, VIEWPORT, ease } from "./tokens";

export interface SplitWordsProps {
  text: string;
  as?: "h2" | "h3" | "p" | "span";
  className?: string;
  wordClassName?: string;
  highlight?: readonly string[];
  highlightClassName?: string;
  delay?: number;
  stagger?: number;
  immediate?: boolean;
  rotate?: number;
  replayKey?: string | number; // re-dispara a entrada quando muda (troca de ponto/etapa)
}

const limpa = (w: string) => w.replace(/[.,:;!?…]/g, "");

/** Título palavra a palavra (Seven): máscara por palavra, y 110% → 0 e rotate 4° → 0 (700 ms, stagger 40 ms). */
export function SplitWords({
  text,
  as: Tag = "span",
  className,
  wordClassName,
  highlight = [],
  highlightClassName = "text-brasa-400",
  delay = 0,
  stagger = STAGGER.palavra,
  immediate = false,
  rotate = 4,
  replayKey,
}: SplitWordsProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, VIEWPORT);
  const reduced = useMotionPref() === "reduced";
  const show = immediate || inView || reduced;
  const alvo = new Set(highlight.map(limpa));
  const palavras = text.split(" ");

  return (
    <Tag ref={ref as never} className={className} data-motion="palavra">
      {/* texto acessível num .sr-only (aria-label em <span>/<p> é proibido pela ARIA); as palavras visuais são aria-hidden */}
      <span className="sr-only">{text}</span>
      <Fragment key={replayKey}>
        {palavras.map((w, i) => (
          <span key={`${w}-${i}`} aria-hidden className="-mb-[0.08em] -mt-[0.2em] inline-block overflow-clip pb-[0.08em] pt-[0.2em] align-bottom">
            <motion.span
              className={`inline-block origin-bottom-left ${wordClassName ?? ""} ${alvo.has(limpa(w)) ? highlightClassName : ""}`}
              initial={{ y: "110%", rotate }}
              animate={show ? { y: "0%", rotate: 0 } : undefined}
              transition={reduced ? { duration: 0 } : { duration: 0.7, ease: ease(EASE_OUT), delay: delay + i * stagger }}
            >
              {w}
              {i < palavras.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </Fragment>
    </Tag>
  );
}
