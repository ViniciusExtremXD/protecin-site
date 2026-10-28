import { createElement as h, useEffect, useRef, useState, type RefObject } from "react";
import { motion, useInView } from "framer-motion";
import { DUR, EASE_OUT, STAGGER, VIEWPORT, ease } from "../../../components/motion/tokens";
import { motionPrefAtual } from "../../../lib/motion-pref";

/*
 * Títulos revelados por palavra ("palavra") e por linha ("linha") que continuam legíveis sem JavaScript.
 * O SplitWords / SplitLines da base põem as palavras em translateY(110%) já no HTML do prerender, e o seguro
 * <noscript> só devolve o que tem opacity:0, então sem JS (ou com o motor falhando) o título some. Aqui o HTML
 * traz o texto no lugar; depois de montar, só no movimento completo e com o título ainda abaixo da tela, as
 * palavras descem em silêncio para a máscara e sobem quando o título entra (o mesmo truque do Odometer).
 * Arquivo .ts (sem JSX) para o sandbox não listar como seção.
 */

function useArmado(ref: RefObject<HTMLElement>) {
  const visto = useInView(ref, VIEWPORT);
  const [armado, setArmado] = useState(false);
  useEffect(() => {
    if (motionPrefAtual() !== "full") return;
    const r = ref.current?.getBoundingClientRect();
    if (r && r.top > window.innerHeight * 0.88) setArmado(true);
  }, [ref]);
  return armado && !visto;
}

const MASCARA = "-mb-[0.08em] -mt-[0.2em] overflow-clip pb-[0.08em] pt-[0.2em]";

export function PalavrasReveladas({ text, as = "h2", className, delay = 0, stagger = STAGGER.palavra }: { text: string; as?: "h2" | "h3" | "p"; className?: string; delay?: number; stagger?: number }) {
  const ref = useRef<HTMLElement>(null);
  const escondido = useArmado(ref);
  const palavras = text.split(" ");
  // o espaço entre as palavras fica fora das máscaras: dentro de um inline-block ele seria espaço de fim de linha
  // e colapsaria (as palavras grudariam)
  const filhos = palavras.flatMap((w, i) => {
    const mascara = h(
      "span",
      { key: `p${i}`, "aria-hidden": true, className: `${MASCARA} inline-block align-bottom` },
      h(
        motion.span,
        {
          className: "inline-block origin-bottom-left",
          initial: false,
          animate: escondido ? { y: "110%", rotate: 4 } : { y: "0%", rotate: 0 },
          transition: escondido ? { duration: 0 } : { duration: 0.7, ease: ease(EASE_OUT), delay: delay + i * stagger },
        },
        w,
      ),
    );
    return i < palavras.length - 1 ? [mascara, " "] : [mascara];
  });
  return h(as, { ref, className, "aria-label": text, "data-motion": "palavra" }, ...filhos);
}

export function LinhasReveladas({ lines, text, as = "h2", className, delay = 0, stagger = STAGGER.linha }: { lines: readonly string[]; text: string; as?: "h2" | "h3"; className?: string; delay?: number; stagger?: number }) {
  const ref = useRef<HTMLElement>(null);
  const escondido = useArmado(ref);
  return h(
    as,
    { ref, className, "aria-label": text, "data-motion": "linha" },
    lines.map((l, i) =>
      h(
        "span",
        { key: i, "aria-hidden": true, className: `${MASCARA} block` },
        h(
          motion.span,
          {
            className: "block origin-bottom-left",
            initial: false,
            animate: escondido ? { y: "110%", rotate: 3 } : { y: "0%", rotate: 0 },
            transition: escondido ? { duration: 0 } : { duration: DUR.longa, ease: ease(EASE_OUT), delay: delay + i * stagger },
          },
          l,
        ),
      ),
    ),
  );
}
