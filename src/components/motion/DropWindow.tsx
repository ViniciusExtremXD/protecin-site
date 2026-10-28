import { useRef, useState, type ReactNode } from "react";
import { cubicBezier, motion, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";
import { EASE_IN_OUT, useIsoLayoutEffect } from "./tokens";

export interface DropWindowProps {
  progress: MotionValue<number>;
  range?: [number, number]; // [0.08, 0.55]
  mode: "fechar" | "abrir";
  from?: number; // 0.45; escala inicial do modo abrir
  className?: string; // define o tamanho D com a variável --gota, ex.: "[--gota:min(34vh,26vw)]"
  children: ReactNode;
}

const curva = cubicBezier(EASE_IN_OUT[0], EASE_IN_OUT[1], EASE_IN_OUT[2], EASE_IN_OUT[3]);

/**
 * Janela em forma de gota (canto superior direito reto, como no símbolo). S0 = diagonal da tela / D × 1,04:
 * em S0 a gota cobre a tela inteira. fechar: S0 → 1; abrir: from → S0. A mídia interna (100vw × 100svh) recebe
 * a escala inversa, então o enquadramento fica parado. Só transform.
 */
export function DropWindow({ progress, range = [0.08, 0.55], mode, from = 0.45, className, children }: DropWindowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [s0, setS0] = useState(8);
  const [ativa, setAtiva] = useState(false);

  // antes da pintura: a cena fixada nunca mostra a gota com a escala provisória
  useIsoLayoutEffect(() => {
    const medir = () => {
      const d = ref.current?.offsetWidth || 1;
      setS0((Math.hypot(window.innerWidth, window.innerHeight) / d) * 1.04);
    };
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, []);

  useMotionValueEvent(progress, "change", (v) => setAtiva(v > 0 && v < 1));

  const s = useTransform(progress, range, mode === "fechar" ? [s0, 1] : [from, s0], { ease: curva });
  const inversa = useTransform(s, (v) => 1 / v);

  return (
    <motion.div
      ref={ref}
      data-motion="gota"
      className={`relative overflow-clip rounded-gota ${className ?? ""}`}
      style={{ width: "var(--gota)", height: "var(--gota)", scale: s, willChange: ativa ? "transform" : "auto" }}
    >
      {/* 8 px de sangria: um arredondamento de 1–2 px na posição da gota não deixa um fio escuro na borda da tela */}
      <motion.div className="absolute left-1/2 top-1/2 h-[calc(100svh+8px)] w-[calc(100vw+8px)]" style={{ x: "-50%", y: "-50%", scale: inversa }}>
        {children}
      </motion.div>
    </motion.div>
  );
}
