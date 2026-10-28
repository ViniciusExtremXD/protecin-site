import { useRef, type CSSProperties } from "react";
import { useInView } from "framer-motion";
import { VIEWPORT } from "./tokens";

export interface FocusBracketsProps {
  mode?: "hover" | "locked" | "enter";
  offset?: number; // 10
  size?: number | string; // "clamp(12px,8%,28px)"
  tone?: "escuro" | "claro";
  className?: string;
}

/**
 * As cantoneiras do logo como moldura de foco (enxerto D2): 4 Ls de 2 px, absolutos no pai (que precisa de
 * `relative` e, no modo hover, de `group`). hover: fecham no hover/foco do pai; locked: sempre; enter: travam ao entrar.
 */
export function FocusBrackets({ mode = "hover", offset = 10, size = "clamp(12px,8%,28px)", tone = "escuro", className }: FocusBracketsProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, VIEWPORT);
  const s = typeof size === "number" ? `${size}px` : size;
  return (
    <span
      ref={ref}
      aria-hidden
      data-motion="cantoneiras"
      data-mode={mode}
      className={`fb ${tone === "claro" ? "fb-claro" : ""} ${mode === "enter" && inView ? "is-on" : ""} ${className ?? ""}`}
      style={{ "--fb-off": `${offset}px`, "--fb-s": s } as CSSProperties}
    >
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}
