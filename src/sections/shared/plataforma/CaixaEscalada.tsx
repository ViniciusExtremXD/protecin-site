import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Caixa de projeto em px fixos (w × h) escalada para caber no espaço disponível, para que os aparelhos, o
 * caminho SVG e os pontos pré-calculados usem as mesmas coordenadas. A escala é transform (o texto mantém o
 * tamanho computado). Sem JS, vale o --k aproximado que vier por classe (`fallbackClassName`).
 *   fit "largura": ocupa a largura do pai e a altura acompanha (w × k).
 *   fit "conter": centraliza dentro de um pai com largura e altura definidas.
 */
export function CaixaEscalada({
  w,
  h,
  fit = "largura",
  max = 1,
  className,
  fallbackClassName,
  children,
}: {
  w: number;
  h: number;
  fit?: "largura" | "conter";
  max?: number;
  className?: string;
  fallbackClassName?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [k, setK] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const medir = () => {
      const largura = el.clientWidth;
      const altura = el.clientHeight;
      if (!largura) return;
      const novo = fit === "largura" ? Math.min(max, largura / w) : Math.min(max, largura / w, altura / h);
      setK((atual) => (atual !== null && Math.abs(atual - novo) < 0.001 ? atual : novo));
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, [w, h, fit, max]);

  const estilo = { ...(k !== null ? { "--k": String(k) } : {}), ...(fit === "largura" ? { height: `calc(${h}px * var(--k, 1))` } : {}) } as CSSProperties;
  const interno: CSSProperties =
    fit === "largura"
      ? { width: w, height: h, transform: "scale(var(--k, 1))", transformOrigin: "0 0" }
      : { width: w, height: h, left: "50%", top: "50%", transform: "translate(-50%, -50%) scale(var(--k, 1))", transformOrigin: "50% 50%" };

  return (
    <div ref={ref} className={`relative ${fallbackClassName ?? ""} ${className ?? ""}`} style={estilo}>
      <div className="absolute left-0 top-0" style={interno}>
        {children}
      </div>
    </div>
  );
}
