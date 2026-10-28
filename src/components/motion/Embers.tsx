import { useEffect, useRef, useState } from "react";
import { useMotionPref } from "../../lib/motion-pref";

interface Brasa {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  life: number;
  max: number;
  hue: number;
}

/** Teto do QA (qa/AJUSTES-DESIGN.md): no máximo 40 partículas. */
const MAX_BRASAS = 40;

/**
 * Brasas subindo num canvas (Seven). dpr ≤ 2, densidade × 0,45 abaixo de 768 px, laço de quadros só com o canvas
 * na tela, não monta no SSR nem no modo reduzido. repel: só ponteiro fino, afasta as brasas a menos de 120 px.
 */
export function Embers({ density = MAX_BRASAS, className, repel = false }: { density?: number; className?: string; repel?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useMotionPref() === "reduced";
  const [montado, setMontado] = useState(false);
  const [visivel, setVisivel] = useState(false);
  useEffect(() => setMontado(true), []);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || reduced) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = 0;
    let h = 0;
    let raf = 0;
    let t = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const base = Math.min(density, MAX_BRASAS);
    const total = window.innerWidth < 768 ? Math.max(6, Math.round(base * 0.45)) : base;
    const ponteiro = { x: -9999, y: -9999 };
    const fino = repel && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const nova = (inicial = false): Brasa => ({
      x: Math.random() * w,
      y: inicial ? Math.random() * h : h + 10,
      r: Math.random() * 1.6 + 0.4,
      vy: Math.random() * 0.6 + 0.22,
      vx: (Math.random() - 0.5) * 0.3,
      life: 0,
      max: Math.random() * 420 + 260,
      hue: Math.random() * 26 + 4,
    });
    const medir = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    medir();
    const brasas = Array.from({ length: total }, () => nova(true));

    const tick = () => {
      t += 0.01;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < brasas.length; i++) {
        const e = brasas[i];
        e.life++;
        if (fino) {
          const dx = e.x - ponteiro.x;
          const dy = e.y - ponteiro.y;
          const d = Math.hypot(dx, dy);
          if (d < 120 && d > 0.01) {
            const k = 0.6 * (1 - d / 120);
            e.x += (dx / d) * k;
            e.y += (dy / d) * k;
          }
        }
        e.y -= e.vy;
        e.x += e.vx + Math.sin(t * 2 + i) * 0.25;
        if (e.life > e.max || e.y < -10) {
          brasas[i] = nova();
          continue;
        }
        const fade = Math.sin((e.life / e.max) * Math.PI);
        const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 6);
        g.addColorStop(0, `hsla(${e.hue + 20}, 100%, 72%, ${0.85 * fade})`);
        g.addColorStop(0.35, `hsla(${e.hue}, 100%, 52%, ${0.32 * fade})`);
        g.addColorStop(1, "hsla(0, 100%, 40%, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r * 6, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([en]) => {
      setVisivel(en.isIntersecting);
      if (en.isIntersecting) {
        if (!raf) raf = requestAnimationFrame(tick);
      } else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(canvas);
    const mover = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      ponteiro.x = e.clientX - r.left;
      ponteiro.y = e.clientY - r.top;
    };
    if (fino) window.addEventListener("pointermove", mover, { passive: true });
    window.addEventListener("resize", medir);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", medir);
      window.removeEventListener("pointermove", mover);
    };
  }, [density, reduced, repel, montado]);

  if (!montado || reduced) return null;
  return (
    <canvas
      ref={ref}
      aria-hidden
      data-motion="brasas"
      className={`pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-[800ms] ${visivel ? "opacity-100" : "opacity-0"} ${className ?? ""}`}
    />
  );
}
