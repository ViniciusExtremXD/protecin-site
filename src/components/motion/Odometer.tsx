import { useEffect, useRef } from "react";
import { DUR, STAGGER, useIsoLayoutEffect } from "./tokens";

export interface OdometerProps {
  value: string; // "20.000+", "3M+", "250+", "1976", "01", "1 de 3"
  className?: string;
  digitClassName?: string;
  affixClassName?: string;
  duration?: number;
  stagger?: number;
  trigger?: "inView" | "value"; // "value": anima a cada mudança de value (ano ativo)
  ariaLabel?: string;
}

// 0–9 duas vezes, um dígito por linha num único nó de texto (white-space: pre; linha de 1em): o mesmo rolo com 1
// nó em vez de 20 por coluna (a home tinha mais de mil nós só de dígitos dos odômetros)
const ROLO_TEXTO = Array.from({ length: 20 }, (_, i) => i % 10).join("\n");
const pos = (n: number) => `translate3d(0, -${n * 5}%, 0)`; // cada dígito = 5% do rolo de 20 itens
const CURVA = "cubic-bezier(0.16, 1, 0.3, 1)";

function colocar(el: HTMLElement, n: number) {
  el.style.transition = "none";
  el.style.transform = pos(n);
}

function girar(el: HTMLElement, n: number, dur: number, atraso: number, depois?: () => void) {
  void el.getBoundingClientRect();
  el.style.transition = `transform ${dur}ms ${CURVA} ${atraso}ms`;
  el.style.transform = pos(n);
  if (depois) {
    const fim = () => {
      el.removeEventListener("transitionend", fim);
      depois();
    };
    el.addEventListener("transitionend", fim);
  }
}

/**
 * Contador de odômetro (enxerto D3): cada dígito gira uma volta e para no valor, da direita para a esquerda.
 * O HTML do SSR já traz o valor final. Separadores e sufixos ficam estáticos.
 */
export function Odometer({
  value,
  className,
  digitClassName,
  affixClassName,
  duration = DUR.longa,
  stagger = STAGGER.digito,
  trigger = "inView",
  ariaLabel,
}: OdometerProps) {
  const raiz = useRef<HTMLSpanElement>(null);
  const rolos = useRef<(HTMLSpanElement | null)[]>([]);
  const anterior = useRef(value);
  const chars = Array.from(value);
  const digitos = chars.filter((c) => /\d/.test(c)).map(Number);
  const dur = Math.round(duration * 1000);
  const passo = Math.round(stagger * 1000);

  // inView: fora da tela ao montar → salta em silêncio para o mesmo dígito no 1º ciclo e gira uma volta ao entrar.
  useEffect(() => {
    if (trigger !== "inView") return;
    const el = raiz.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) return; // já estava na tela: não anima
    const lista = rolos.current.slice(0, digitos.length);
    lista.forEach((c, j) => c && colocar(c, digitos[j]));
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const n = lista.length;
        lista.forEach((c, j) => c && girar(c, 10 + digitos[j], dur, (n - 1 - j) * passo));
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []); // só na montagem

  // value: gira para a frente até o novo dígito e normaliza a posição em silêncio.
  useIsoLayoutEffect(() => {
    if (trigger !== "value") return;
    const antes = Array.from(anterior.current).filter((c) => /\d/.test(c)).map(Number);
    anterior.current = value;
    const n = digitos.length;
    digitos.forEach((d, j) => {
      const c = antes[j - (n - antes.length)] ?? 0; // alinha pela direita
      const el = rolos.current[j];
      if (!el || c === d) return;
      colocar(el, c);
      const alvo = d > c ? d : 10 + d;
      girar(el, alvo, dur, (n - 1 - j) * passo, () => colocar(el, 10 + d));
    });
  }, [value]);

  let k = 0;
  return (
    <span ref={raiz} className={`odo tnum ${className ?? ""}`} data-motion="odometro">
      <span className="sr-only">{ariaLabel ?? value}</span>
      <span aria-hidden className="odo-vis">
        {chars.map((c, i) => {
          if (!/\d/.test(c)) {
            return (
              <span key={`a${i}`} className={`odo-a ${affixClassName ?? ""}`}>
                {c === " " ? " " : c}
              </span>
            );
          }
          const j = k++;
          return (
            <span key={`d${chars.length - i}`} className={`odo-col ${digitClassName ?? ""}`}>
              <span
                className="odo-rolo"
                ref={(el) => {
                  rolos.current[j] = el;
                }}
                style={{ transform: pos(10 + Number(c)) }}
              >
                {ROLO_TEXTO}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
