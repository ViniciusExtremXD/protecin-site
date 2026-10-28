import { useEffect, useRef, type ReactNode } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { useMotionPref } from "../../lib/motion-pref";

export interface VelocityMarqueeProps {
  baseVelocity?: number; // -1.2 (% da faixa por segundo; negativo corre para a esquerda)
  pauseOnHover?: boolean; // true
  className?: string;
  trackClassName?: string;
  ariaLabel?: string;
  children: ReactNode;
}

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

/**
 * Fita infinita (Seven + pausa): 4 cópias, acelera e inverte com a velocidade da rolagem, para no hover por mola e
 * só roda o laço de quadros enquanto está na tela. Reduzido: flex-wrap estático com 1 cópia.
 */
export function VelocityMarquee({ baseVelocity = -1.2, pauseOnHover = true, className, trackClassName, ariaLabel, children }: VelocityMarqueeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useMotionPref() === "reduced";
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const vel = useVelocity(scrollY);
  const velSuave = useSpring(vel, { damping: 50, stiffness: 400 });
  const fatorVel = useTransform(velSuave, [0, 1000], [0, 1.2], { clamp: false });
  const pausa = useMotionValue(1);
  const pausaSuave = useSpring(pausa, { stiffness: 140, damping: 24 });
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);
  const direcao = useRef(1);

  useEffect(() => {
    const el = ref.current;
    if (reduced || !el) return;
    let raf = 0;
    let ultimo = 0;
    const tick = (t: number) => {
      const delta = ultimo ? Math.min(64, t - ultimo) : 16;
      ultimo = t;
      let passo = direcao.current * baseVelocity * (delta / 1000);
      const f = fatorVel.get();
      if (f < 0) direcao.current = -1;
      else if (f > 0) direcao.current = 1;
      passo += direcao.current * passo * f;
      baseX.set(baseX.get() + passo * pausaSuave.get());
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (!raf) {
          ultimo = 0;
          raf = requestAnimationFrame(tick);
        }
      } else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [reduced, baseVelocity, baseX, fatorVel, pausaSuave]);

  const grupo = ariaLabel ? { role: "group", "aria-label": ariaLabel } : {};

  if (reduced) {
    return (
      <div ref={ref} data-motion="fita" className={`flex flex-wrap items-center ${className ?? ""}`} {...grupo}>
        <div className={`flex flex-wrap items-center ${trackClassName ?? ""}`}>{children}</div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      data-motion="fita"
      className={`flex overflow-clip whitespace-nowrap ${className ?? ""}`}
      onPointerEnter={pauseOnHover ? () => pausa.set(0) : undefined}
      onPointerLeave={pauseOnHover ? () => pausa.set(1) : undefined}
      onFocus={pauseOnHover ? () => pausa.set(0) : undefined}
      onBlur={pauseOnHover ? () => pausa.set(1) : undefined}
      {...grupo}
    >
      <motion.div className="flex flex-nowrap will-change-transform" style={{ x }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`flex shrink-0 items-center ${trackClassName ?? ""}`} aria-hidden={i > 0 ? true : undefined}>
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
