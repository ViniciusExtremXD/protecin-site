import { motion } from "framer-motion";
import type { Hotspot as PontoFoto } from "../../../data/site";
import { useMotionPref } from "../../../lib/motion-pref";
import { EASE_IN_OUT, EASE_OUT, SPRING, ease } from "../../../components/motion";

/*
 * Marcador de um ponto da foto (H4). Anel de 44 px com o miolo brasa-400 numerado.
 *   geral   → visão geral da foto: todos inteiros e numerados
 *   ativo   → o anel se desenha (300 ms), o miolo carimba e o anel pulsa 2 vezes
 *   inativo → opacidade 0,5 com o anel desenhado
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
  const reduced = useMotionPref() === "reduced";
  const ativo = estado === "ativo";
  const anima = ativo && !reduced;
  const numero = numeroPonto(ponto.id);

  return (
    <button
      type="button"
      data-hotspot={ponto.id}
      aria-label={`${numero}: ${ponto.nome}. ${ponto.titulo}`}
      aria-current={ativo ? "step" : undefined}
      onClick={() => onSelect?.(ponto)}
      onFocus={() => onFocus?.(ponto)}
      className={`group/h relative block h-11 w-11 rounded-full transition-opacity duration-200 ease-out focus-visible:rounded-full ${className ?? ""}`}
      style={{ opacity: estado === "inativo" ? 0.5 : 1 }}
    >
      <svg
        viewBox="0 0 44 44"
        aria-hidden
        className="block h-11 w-11 overflow-visible transition-transform duration-[350ms] ease-out group-hover/h:scale-110"
      >
        {/* disco escuro: separa o marcador da parede clara */}
        <circle cx={C} cy={C} r={20} fill="rgba(5,10,18,0.5)" />
        {anima && (
          <motion.circle
            key={`pulso-${ponto.id}`}
            cx={C}
            cy={C}
            r={20}
            fill="none"
            stroke="#FF6A4D"
            strokeWidth={1.5}
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 0.9, ease: ease(EASE_OUT), repeat: 1, delay: 0.15 }}
          />
        )}
        {anima ? (
          <motion.circle
            key="anel-ativo"
            cx={C}
            cy={C}
            r={20}
            fill="none"
            stroke="#F3EFE9"
            strokeWidth={1.5}
            strokeLinecap="round"
            initial={{ pathLength: 0, rotate: -90 }}
            animate={{ pathLength: 1, rotate: -90 }}
            transition={{ duration: 0.3, ease: ease(EASE_IN_OUT) }}
          />
        ) : (
          <circle cx={C} cy={C} r={20} fill="none" stroke="#F3EFE9" strokeWidth={1.5} />
        )}
        <motion.g
          key={anima ? "miolo-ativo" : "miolo"}
          initial={anima ? { scale: 1.35, rotate: -8, opacity: 0 } : false}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", ...SPRING.encaixe }}
        >
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
        </motion.g>
      </svg>
    </button>
  );
}
