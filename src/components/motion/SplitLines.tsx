import { useRef, type CSSProperties, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { useMotionPref } from "../../lib/motion-pref";
import { DUR, EASE_OUT, STAGGER, VIEWPORT, ease } from "./tokens";

export type Linhas = readonly string[] | { readonly desktop: readonly string[]; readonly celular: readonly string[] };

export interface SplitLinesProps {
  lines: Linhas;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  lineClassName?: string;
  highlight?: readonly string[]; // palavras inteiras destacadas
  highlightClassName?: string; // padrão "text-brasa-400"
  delay?: number;
  stagger?: number;
  css?: boolean; // true: entrada CSS .e-linha (acima da dobra, antes da hidratação)
  text?: string; // texto acessível (.sr-only); padrão = linhas unidas por espaço
}

const limpa = (w: string) => w.replace(/[.,:;!?…]/g, "");

/** Pinta palavras inteiras (comparação sem pontuação). */
export function comDestaque(linha: string, highlight: readonly string[], cls: string): ReactNode {
  if (!highlight.length) return linha;
  const alvo = new Set(highlight.map(limpa));
  return linha.split(/(\s+)/).map((p, i) =>
    alvo.has(limpa(p)) ? (
      <span key={i} className={cls}>
        {p}
      </span>
    ) : (
      p
    ),
  );
}

/** Título revelado linha a linha: cada linha numa máscara, y 110% → 0 e rotate 3° → 0 (800 ms, stagger 80 ms). */
export function SplitLines({
  lines,
  as: Tag = "h2",
  className,
  lineClassName,
  highlight = [],
  highlightClassName = "text-brasa-400",
  delay = 0,
  stagger = STAGGER.linha,
  css = false,
  text,
}: SplitLinesProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, VIEWPORT);
  const reduced = useMotionPref() === "reduced";
  const label = text ?? ("desktop" in lines ? lines.desktop : lines).join(" ");

  const conjunto = (ls: readonly string[], extra: string) => (
    <span className={`block ${extra}`} aria-hidden>
      {ls.map((linha, i) => {
        const conteudo = comDestaque(linha, highlight, highlightClassName);
        const atraso = delay + i * stagger;
        return (
          <span key={i} className={`block overflow-clip pb-[0.08em] pt-[0.2em] -mb-[0.08em] -mt-[0.2em] ${lineClassName ?? ""}`}>
            {css ? (
              <span className="e-linha-i block origin-bottom-left" style={{ "--d": `${Math.round(atraso * 1000)}ms` } as CSSProperties}>
                {conteudo}
              </span>
            ) : (
              <motion.span
                className="block origin-bottom-left"
                initial={{ y: "110%", rotate: 3 }}
                animate={inView || reduced ? { y: "0%", rotate: 0 } : undefined}
                transition={reduced ? { duration: 0 } : { duration: DUR.longa, ease: ease(EASE_OUT), delay: atraso }}
              >
                {conteudo}
              </motion.span>
            )}
          </span>
        );
      })}
    </span>
  );

  return (
    <Tag ref={ref as never} className={`${css ? "e-linha" : ""} ${className ?? ""}`} data-motion={css ? "css" : "linha"}>
      {/* texto acessível num .sr-only (aria-label em <span>/<p> é proibido pela ARIA); as linhas visuais são aria-hidden */}
      <span className="sr-only">{label}</span>
      {"desktop" in lines ? (
        <>
          {conjunto(lines.desktop, "hidden md:block")}
          {conjunto(lines.celular, "md:hidden")}
        </>
      ) : (
        conjunto(lines, "")
      )}
    </Tag>
  );
}
