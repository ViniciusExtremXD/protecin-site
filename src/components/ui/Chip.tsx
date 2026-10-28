import { motion } from "framer-motion";
import { SPRING } from "../motion/tokens";

const TOM = {
  escuro: "border-noite-600 bg-noite-800/60 text-papel-300",
  claro: "border-noite-950/15 bg-papel-100 text-noite-950",
  azul: "border-marinho-300/30 bg-marinho-800/60 text-papel-50",
} as const;

/** Chip informativo (normas, itens, setores). */
export function Chip({ children, tone = "escuro", className }: { children: string; tone?: "escuro" | "claro" | "azul"; className?: string }) {
  return (
    <span className={`inline-flex min-h-[34px] items-center rounded-full border px-3.5 py-1 text-[14px] font-medium leading-tight ${TOM[tone]} ${className ?? ""}`}>
      {children}
    </span>
  );
}

/** Chip selecionável (formulário): aria-pressed, alvo de 44 px, fundo brasa-500 e Check desenhado quando marcado. */
export function ChipToggle({ children, selected, onToggle, tone = "escuro" }: { children: string; selected: boolean; onToggle: () => void; tone?: "escuro" | "claro" }) {
  const claro = tone === "claro";
  const borda = selected
    ? "border-brasa-500 text-white"
    : claro
      ? "border-noite-950/20 text-noite-950 hover:border-noite-950/50"
      : "border-noite-600 text-papel-300 hover:border-papel-50/50 hover:text-papel-50";
  return (
    <motion.button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      whileTap={{ scale: 0.97 }}
      className={`relative inline-flex min-h-11 items-center gap-2 overflow-hidden rounded-full border px-4 py-2 text-[15px] font-medium leading-tight transition-colors duration-200 ${borda} ${claro ? "[--foco:#BE1E29]" : ""}`}
    >
      {selected && <motion.span aria-hidden className="absolute inset-0 bg-brasa-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} />}
      <span className="relative inline-flex items-center gap-2">
        {selected && (
          <motion.span initial={{ width: 0, opacity: 0 }} animate={{ width: 16, opacity: 1 }} transition={{ type: "spring", ...SPRING.pilula }} className="inline-flex overflow-hidden">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <motion.path d="M20 6 9 17l-5-5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, delay: 0.05 }} />
            </svg>
          </motion.span>
        )}
        {children}
      </span>
    </motion.button>
  );
}
