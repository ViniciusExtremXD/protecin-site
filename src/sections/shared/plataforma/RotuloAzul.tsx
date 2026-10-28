import { Reveal } from "../../../components/motion";

/**
 * Versão local do SectionLabel para o mundo azul: o SectionLabel usa papel-500, que a paleta proíbe sobre azul
 * (4,26:1). Aqui o rótulo vai em marinho-300 (6,25:1 sobre marinho-700) e o índice em brasa-300 (4,55:1).
 */
export function RotuloAzul({ index, label, className }: { index: string; label: string; className?: string }) {
  return (
    <Reveal y={12} className={className}>
      <p className="rotulo inline-flex items-center gap-3 text-marinho-300">
        <span aria-hidden className="relative flex h-1.5 w-1.5">
          <span className="pulso-3 absolute inset-0 rounded-full bg-brasa-400" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-brasa-400" />
        </span>
        <span className="text-brasa-300">{index}</span>
        <span aria-hidden className="text-papel-50/25">
          —
        </span>
        <span>{label}</span>
      </p>
    </Reveal>
  );
}
