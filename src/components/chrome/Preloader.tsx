import { useEffect, useRef, useState } from "react";
import { lockScroll } from "../../lib/smooth-scroll";
import { Symbol } from "../ui/Symbol";

/**
 * Preloader (P1): vem sempre no SSR, mas só aparece sob html.intro (1ª entrada da sessão, movimento completo).
 * Animação 100% CSS (≤ 900 ms): fundo parado até 600 ms e sobe em 300 ms; símbolo monta; ano conta 1976 → 2026.
 * Pulável com clique ou qualquer tecla. O JS remove o nó no fim e destrava a rolagem.
 */
export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  const [fora, setFora] = useState(false);

  useEffect(() => {
    const h = document.documentElement;
    const el = ref.current;
    if (!el || !h.classList.contains("intro") || !h.classList.contains("motion-full")) {
      setFora(true);
      return;
    }
    lockScroll(true);
    let feito = false;
    const fim = () => {
      if (feito) return;
      feito = true;
      lockScroll(false);
      setFora(true);
    };
    const onAnim = (e: AnimationEvent) => {
      if (e.target === el && (e.animationName === "pre-sai" || e.animationName === "pre-pula")) fim();
    };
    const pular = () => el.classList.add("is-pulando");
    el.addEventListener("animationend", onAnim);
    window.addEventListener("keydown", pular, { once: true });
    el.addEventListener("pointerdown", pular, { once: true });
    const seguro = window.setTimeout(fim, 1400); // se o animationend não vier
    return () => {
      el.removeEventListener("animationend", onAnim);
      window.removeEventListener("keydown", pular);
      window.clearTimeout(seguro);
      if (!feito) lockScroll(false);
    };
  }, []);

  if (fora) return null;
  return (
    <div ref={ref} className="pt-preloader" aria-hidden>
      <div className="flex flex-col items-center gap-6">
        <Symbol size={120} tone="escuro" mode="css-montar" />
        <div className="flex flex-col items-center gap-3">
          <span className="pre-ano font-mono text-[15px] font-medium tracking-[0.16em] text-papel-300 tnum" />
          <span className="pre-linha block h-px w-28 bg-papel-500/50" />
        </div>
      </div>
    </div>
  );
}
