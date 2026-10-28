import { useId } from "react";
import { motion } from "framer-motion";
import { MOTION_TOGGLE } from "../../data/site";
import { setMotionPref, useMotionPref, type MotionPref } from "../../lib/motion-pref";
import { SPRING } from "../motion/tokens";

/** "Animações: ligadas | reduzidas" (rodapé e menu). A escolha fica salva e a página recarrega. */
export function MotionToggle({ tone = "escuro", className }: { tone?: "escuro" | "claro"; className?: string }) {
  const pref = useMotionPref();
  const opcoes: { valor: MotionPref; rotulo: string }[] = [
    { valor: "full", rotulo: MOTION_TOGGLE.ligadas },
    { valor: "reduced", rotulo: MOTION_TOGGLE.reduzidas },
  ];
  const claro = tone === "claro";
  const idRotulo = `rotulo-animacoes${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <div className={`inline-flex items-center gap-3 text-[14px] ${claro ? "text-grafite-600" : "text-papel-300"} ${className ?? ""}`} data-motion="toggle">
      <span id={idRotulo}>{MOTION_TOGGLE.rotulo}</span>
      <div role="radiogroup" aria-labelledby={idRotulo} className={`relative inline-flex rounded-full border p-1 ${claro ? "border-noite-950/15" : "border-noite-600"}`}>
        {opcoes.map((o) => {
          const sel = pref === o.valor;
          return (
            <button
              key={o.valor}
              type="button"
              role="radio"
              aria-checked={sel}
              onClick={() => !sel && setMotionPref(o.valor)}
              className={`relative min-h-11 rounded-full px-4 text-[14px] font-medium transition-colors duration-200 ${sel ? (claro ? "text-papel-50" : "text-noite-950") : claro ? "text-grafite-600 hover:text-noite-950" : "text-papel-300 hover:text-papel-50"}`}
            >
              {sel && (
                <motion.span
                  layoutId={`toggle-${idRotulo}`}
                  aria-hidden
                  className={`absolute inset-0 rounded-full ${claro ? "bg-noite-950" : "bg-papel-50"}`}
                  transition={pref === "reduced" ? { duration: 0 } : { type: "spring", ...SPRING.pilula }}
                />
              )}
              <span className="relative">{o.rotulo}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
