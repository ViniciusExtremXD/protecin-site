import { RevealGroup, RevealItem } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { FITAS } from "../../data/site";

/**
 * Uma linha de itens separados por ponto. O ponto fica no recuo à esquerda de cada item, e a lista entra com o mesmo
 * recuo negativo dentro de um overflow-x: clip: o ponto do primeiro item de cada linha (também depois de quebrar)
 * fica fora e é cortado, sem ponto solto no começo da linha.
 */
function Linha({ itens, forte }: { itens: readonly string[]; forte: boolean }) {
  return (
    <div className="overflow-x-clip">
      <RevealGroup as="ul" stagger={0.035} y={16} className="-ml-6 flex flex-wrap items-center gap-y-1 lg:-ml-8">
        {itens.map((t) => (
          <RevealItem
            as="li"
            key={t}
            className="relative pl-6 before:absolute before:left-[10px] before:top-1/2 before:h-1 before:w-1 before:-translate-y-1/2 before:rounded-full before:bg-papel-500/60 before:content-[''] lg:pl-8 lg:before:left-[14px]"
          >
            <span className={`stretch-75 whitespace-nowrap text-[17px] font-semibold leading-snug lg:text-[clamp(1.0625rem,1.45vw,1.25rem)] ${forte ? "text-papel-50" : "text-papel-500"}`}>{t}</span>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}

export interface FitasProps {
  id?: string;
}

/**
 * Fitas de /servicos/ (rodada de sobriedade: sem letreiro correndo nem inclinação). Duas linhas de texto entre filetes:
 * os equipamentos (claros) e os serviços de campo (em cinza). Entrada: cascata curta.
 */
export default function Fitas({ id = "fitas" }: FitasProps = {}) {
  return (
    <section id={id} data-section="servicos-fitas" className="grain relative bg-noite-950 py-8 lg:py-10">
      <Container>
        <div className="flex flex-col gap-2 border-y border-noite-700 py-6 lg:gap-3 lg:py-8">
          <Linha itens={FITAS.equipamentos} forte />
          <Linha itens={FITAS.servicosCampo} forte={false} />
        </div>
      </Container>
    </section>
  );
}
