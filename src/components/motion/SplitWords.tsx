import { Fragment, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { DESLOCAMENTO, DUR, EASE_OUT, STAGGER, VIEWPORT, ease } from "./tokens";

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
  /** @deprecated ignorado: título não gira (AJUSTES-SOBRIEDADE §1). Fica pela API. */
  rotate?: number;
  replayKey?: string | number; // re-dispara a entrada quando muda (troca de ponto/etapa)
}

const limpa = (w: string) => w.replace(/[.,:;!?…]/g, "");

/**
 * Título palavra a palavra (rodada de sobriedade): cada palavra entra com opacidade 0 → 1 e subida de 20 px
 * (700 ms, stagger 35 ms). Sem máscara recortando e sem giro.
 */
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
  replayKey,
}: SplitWordsProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, VIEWPORT);
  const show = immediate || inView;
  const alvo = new Set(highlight.map(limpa));
  const palavras = text.split(" ");

  return (
    <Tag ref={ref as never} className={className} data-motion="palavra">
      {/* texto acessível num .sr-only (aria-label em <span>/<p> é proibido pela ARIA); as palavras visuais são aria-hidden */}
      <span className="sr-only">{text}</span>
      <Fragment key={replayKey}>
        {palavras.map((w, i) => (
          <span key={`${w}-${i}`} aria-hidden className="-mb-[0.08em] -mt-[0.2em] inline-block pb-[0.08em] pt-[0.2em] align-bottom">
            <motion.span
              className={`inline-block ${wordClassName ?? ""} ${alvo.has(limpa(w)) ? highlightClassName : ""}`}
              initial={{ opacity: 0, y: DESLOCAMENTO.base }}
              animate={show ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: DUR.longa - 0.1, ease: ease(EASE_OUT), delay: delay + i * stagger }}
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
