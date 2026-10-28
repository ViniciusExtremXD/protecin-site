import { motion } from "framer-motion";
import type { Hotspot as PontoFoto } from "../../../data/site";
import { EASE_IN_OUT, EASE_OUT, ease } from "../../../components/motion";

/*
 * Marcador de um ponto da foto (H4). Anel de 44 px com o miolo brasa-400 numerado.
 *   geral   → visão geral da foto: todos inteiros e numerados
 *   ativo   → o anel se desenha (300 ms) e solta 1 pulso
 *   inativo → opacidade 0,55 com o anel desenhado
 * É um <button> de verdade (foco por teclado, nome acessível com o número, o objeto e o serviço).
 */
export type EstadoHotspot = "geral" | "ativo" | "inativo";

export const numeroPonto = (id: number) => String(id).padStart(2, "0");

const C = 22; // centro do viewBox 44×44

export function Hotspot({
  ponto,
  estado = "geral",
  onSelect,
  onFocus,
  className,
}: {
  ponto: PontoFoto;
  estado?: EstadoHotspot;
  onSelect?: (p: PontoFoto) => void;
  onFocus?: (p: PontoFoto) => void;
  className?: string;
}) {
  const ativo = estado === "ativo";

  return (
    <button
      type="button"
      data-hotspot={ponto.id}
      aria-label={`Ponto ${ponto.id}: ${ponto.nome}. ${ponto.titulo}`}
      aria-current={ativo ? "step" : undefined}
      onClick={() => onSelect?.(ponto)}
      onFocus={() => onFocus?.(ponto)}
      className={`group/h relative block h-11 w-11 rounded-full transition-opacity duration-300 ease-out focus-visible:rounded-full ${className ?? ""}`}
      style={{ opacity: estado === "inativo" ? 0.55 : 1 }}
    >
      <svg viewBox="0 0 44 44" aria-hidden className="block h-11 w-11 overflow-visible transition-transform duration-300 ease-out group-hover/h:scale-105">
        {/* disco escuro: separa o marcador da parede clara */}
        <circle cx={C} cy={C} r={20} fill="rgba(5,10,18,0.5)" />
        {ativo && (
          <motion.circle
            key={`pulso-${ponto.id}`}
            cx={C}
            cy={C}
            r={20}
            fill="none"
            stroke="#FF6A4D"
            strokeWidth={1.5}
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 0.8, ease: ease(EASE_OUT), delay: 0.3 }}
          />
        )}
        {ativo ? (
          <motion.circle
            key="anel-ativo"
            cx={C}
            cy={C}
            r={20}
            fill="none"
            stroke="#F3EFE9"
            strokeWidth={1.75}
            strokeLinecap="round"
            initial={{ pathLength: 0, rotate: -90 }}
            animate={{ pathLength: 1, rotate: -90 }}
            transition={{ duration: 0.3, ease: ease(EASE_IN_OUT) }}
          />
        ) : (
          <circle cx={C} cy={C} r={20} fill="none" stroke="#F3EFE9" strokeWidth={1.5} />
        )}
        <circle cx={C} cy={C} r={11.5} fill="#E8442E" />
        <text
          x={C}
          y={C}
          dy="0.36em"
          textAnchor="middle"
          fill="#050A12"
          fontSize={13}
          fontWeight={700}
          style={{ fontFamily: '"JetBrains Mono Variable", ui-monospace, monospace' }}
        >
          {ponto.id}
        </text>
      </svg>
    </button>
  );
}
