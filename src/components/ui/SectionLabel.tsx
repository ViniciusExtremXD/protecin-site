import { Reveal } from "../motion/Reveal";

/**
 * Rótulo numerado de seção: "01 — Escala" (o único rótulo mono do bloco, AJUSTES-SOBRIEDADE §3). Ponto de 6 px
 * parado (sem pulso: nada pisca chamando atenção). Entra com o reveal normal, fade e subida curta.
 */
export function SectionLabel({ index, label, tone = "escuro", className }: { index: string; label: string; tone?: "escuro" | "claro"; className?: string }) {
  const claro = tone === "claro";
  return (
    <Reveal y={16} className={className}>
      <p className={`rotulo inline-flex items-center gap-3 ${claro ? "text-grafite-600" : "text-papel-500"}`}>
        <span aria-hidden className={`block h-1.5 w-1.5 rounded-full ${claro ? "bg-brasa-500" : "bg-brasa-400"}`} />
        <span className={claro ? "text-brasa-500" : "text-brasa-300"}>{index}</span>
        <span aria-hidden className={claro ? "text-noite-950/30" : "text-papel-50/25"}>
          —
        </span>
        <span>{label}</span>
      </p>
    </Reveal>
  );
}
