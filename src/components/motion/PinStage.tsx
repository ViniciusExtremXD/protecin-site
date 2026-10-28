import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useScroll, useSpring, type MotionValue } from "framer-motion";
import { useMediaQuery } from "../../lib/media";
import { SPRING } from "./tokens";

export interface PinStageProps {
  id?: string;
  className?: string;
  stageClassName?: string;
  heightClassName: string; // altura por CSS, ex.: "h-[220vh] lg:h-[260vh]"
  mode?: "sempre" | "pin"; // "sempre": fixa em qualquer largura (exceto tela curta); "pin": só no breakpoint pin:
  smooth?: boolean; // suaviza com SPRING.rolagem (padrão true)
  label?: string; // aria-label da cena
  children: ReactNode;
}

interface PinInfo {
  progress: MotionValue<number>;
  raw: MotionValue<number>;
  active: boolean;
}

const PinCtx = createContext<PinInfo | null>(null);

/**
 * Cena fixada: seção alta com palco sticky de 100svh. SSR e inativo: data-pin="off" (cada seção define o
 * layout estático por esse seletor). Ativa depois de montar, na largura do modo (o movimento é sempre ligado).
 */
export function PinStage({ id, className, stageClassName, heightClassName, mode = "pin", smooth = true, label, children }: PinStageProps) {
  const ref = useRef<HTMLElement>(null);
  const pinMq = useMediaQuery("(min-width: 1024px) and (min-height: 640px)");
  const curto = useMediaQuery("(max-height: 560px)");
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);
  const active = montado && (mode === "sempre" ? !curto : pinMq);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const suave = useSpring(scrollYProgress, SPRING.rolagem);
  const progress = smooth ? suave : scrollYProgress;

  // Ao ligar/desligar a fixação a altura da seção muda: força a remedição e salta a mola para o valor real,
  // para a cena não "voltar" animando ao carregar a página.
  useEffect(() => {
    if (!montado) return;
    let r2 = 0;
    const r1 = requestAnimationFrame(() => {
      window.dispatchEvent(new Event("resize"));
      r2 = requestAnimationFrame(() => suave.jump(scrollYProgress.get()));
    });
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, [active, montado, suave, scrollYProgress]);

  return (
    <PinCtx.Provider value={{ progress, raw: scrollYProgress, active }}>
      <section
        ref={ref}
        id={id}
        aria-label={label}
        data-pin-stage=""
        data-pin={active ? "on" : "off"}
        data-pin-mode={mode}
        data-motion="cena"
        className={`relative ${heightClassName} ${className ?? ""}`}
      >
        <div className={`pin-palco sticky top-0 h-[100svh] overflow-clip ${stageClassName ?? ""}`}>{children}</div>
      </section>
    </PinCtx.Provider>
  );
}

/** Progresso da cena (0 a 1). `progress` já suavizado; `raw` cru; `active` = cena fixada de fato. */
export function usePin(): PinInfo {
  const c = useContext(PinCtx);
  if (!c) throw new Error("usePin() fora de <PinStage>");
  return c;
}
