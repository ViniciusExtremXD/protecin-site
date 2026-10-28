import { ImagePlus } from "lucide-react";
import { RESERVADOS, type ReservadoId } from "../../data/site";
import { useProposalMode } from "../../lib/motion-pref";
import { Reveal } from "../motion/Reveal";

/**
 * Espaço reservado do modo proposta (?proposta=1). Só existe no cliente com html.proposta: sem o parâmetro,
 * nada aparece ("se o fato não existe, a seção não existe").
 */
export function ReservedSlot({ id, className, aspect }: { id: ReservadoId; className?: string; aspect?: string }) {
  const proposta = useProposalMode();
  if (!proposta) return null;
  const r = RESERVADOS[id];
  return (
    <Reveal preset="fade" className={className}>
      <div
        data-reservado={id}
        className="flex flex-col items-center justify-center gap-3 rounded-r-lg border border-dashed border-papel-500 bg-noite-900/60 px-6 py-10 text-center"
        style={aspect ? { aspectRatio: aspect } : undefined}
      >
        <ImagePlus aria-hidden size={32} strokeWidth={1.5} className="text-papel-500" />
        <p className="titulo text-papel-50">{r.titulo}</p>
        <p className="max-w-[46ch] text-[15px] leading-relaxed text-papel-300">{r.texto}</p>
      </div>
    </Reveal>
  );
}
