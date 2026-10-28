import { useEffect, type ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { bindAnchorLinks, initSmoothScroll } from "../../lib/smooth-scroll";

/**
 * Raiz do motion: avisa o seguro anti-invisível que o motor subiu (html.motion-up) e liga o Lenis e as âncoras
 * internas. O movimento fica sempre ligado (AJUSTES-SOBRIEDADE §1): MotionConfig em reducedMotion="never", para o
 * framer-motion animar mesmo com prefers-reduced-motion: reduce no sistema.
 */
export function MotionRoot({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.add("motion-up");
    const parar = initSmoothScroll();
    const soltar = bindAnchorLinks();
    // O useScroll do framer só remede os alvos em eventos de rolagem e de resize da janela. Quando a altura da
    // página muda sem rolagem (cena fixada que liga, fonte que carrega, troca de rota), um "resize" sintético
    // faz todos os rastreadores remedirem; sem isso o progresso fica preso no valor antigo até o visitante rolar.
    let raf = 0;
    let altura = -1;
    const remedir = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.body.scrollHeight;
        if (h === altura) return;
        altura = h;
        window.dispatchEvent(new Event("resize"));
      });
    };
    const ro = new ResizeObserver(remedir);
    ro.observe(document.body);
    document.fonts?.ready.then(() => {
      altura = -1;
      remedir();
    });
    return () => {
      parar();
      soltar();
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);
  return <MotionConfig reducedMotion="never">{children}</MotionConfig>;
}
