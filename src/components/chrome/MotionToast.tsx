import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TOAST } from "../../data/site";
import { setMotionPref, useMotionPref } from "../../lib/motion-pref";
import { EASE_OUT, ease } from "../motion/tokens";

/**
 * Aviso (P1) só quando o sistema pediu menos movimento e não há preferência salva: aparece depois de 1,5 s,
 * uma vez por sessão (sessionStorage "pt-toast").
 * Posição: no canto inferior esquerdo ele cobria os CTAs do hero (desktop) e os dois CTAs no celular. Agora:
 *  - tablet e desktop: canto superior direito, logo abaixo da nav (os heróis põem texto e CTAs à esquerda);
 *  - celular: acima da barra inferior, mas só depois que o visitante rolou para além do hero (o CTA de
 *    orçamento do hero fica sempre livre na primeira tela).
 */
export function MotionToast() {
  const [aberto, setAberto] = useState(false);
  const reduced = useMotionPref() === "reduced";
  const dy = reduced ? 0 : 28;
  useEffect(() => {
    if (!document.documentElement.classList.contains("motion-reduced-sys")) return;
    try {
      if (sessionStorage.getItem("pt-toast")) return;
    } catch {
      /* sem storage: mostra mesmo assim */
    }
    const largo = window.matchMedia("(min-width: 768px)").matches;
    let tempo = false;
    let feito = false;
    const abrir = () => {
      if (feito || !tempo || (!largo && window.scrollY < window.innerHeight * 0.85)) return;
      feito = true;
      window.removeEventListener("scroll", abrir);
      try {
        sessionStorage.setItem("pt-toast", "1");
      } catch {
        /* sem storage */
      }
      setAberto(true);
    };
    const t = window.setTimeout(() => {
      tempo = true;
      abrir();
    }, 1500);
    if (!largo) window.addEventListener("scroll", abrir, { passive: true });
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("scroll", abrir);
    };
  }, []);

  return (
    <AnimatePresence>
      {aberto && (
        <motion.div
          role="status"
          data-motion="toast"
          className="fixed bottom-[calc(72px+env(safe-area-inset-bottom))] left-4 right-4 z-toast max-w-[420px] rounded-r-md border border-noite-700 bg-noite-900 p-5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)] md:bottom-auto md:left-auto md:right-6 md:top-[76px] md:w-[400px] lg:top-[92px]"
          initial={{ opacity: 0, y: dy }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: dy / 2 }}
          transition={{ duration: reduced ? 0.2 : 0.35, ease: ease(EASE_OUT) }}
        >
          <p className="text-[15px] leading-relaxed text-papel-50">{TOAST.texto}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMotionPref("full")}
              className="min-h-11 rounded-full bg-brasa-500 px-5 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-brasa-600"
            >
              {TOAST.ativar}
            </button>
            <button
              type="button"
              onClick={() => setAberto(false)}
              className="min-h-11 rounded-full border border-papel-50/30 px-5 text-[15px] font-semibold text-papel-50 transition-colors duration-200 hover:border-papel-50/90"
            >
              {TOAST.manter}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
