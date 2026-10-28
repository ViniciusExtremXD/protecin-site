import { AUTORIZADAS, CLIENTES, FILIACOES, MARCAS } from "../../data/site";
import { Reveal, SplitLines } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { ReservedSlot } from "../../components/ui/ReservedSlot";
import { FaixaMarcas } from "../shared/marcas/LogoTile";
import { quebrar } from "./linhas";

/*
 * /nossos-clientes/: parcerias e filiações (design-final §10.3, enxugada pela qa/AJUSTES-SOBRIEDADE.md), tom claro.
 * Título e texto no topo e a tabela de marcas parada (a mesma da home): uma linha por grupo, separadas por régua.
 * Regra de honestidade §2: autorizações, marcas e filiações separadas; nenhum logo de cliente.
 * No fim, o espaço reservado de logos de clientes (só aparece com ?proposta=1).
 */

/** Parceiros (`#parceiros` em /nossos-clientes/). Sem props. */
export default function Parceiros() {
  const { titulo, texto } = CLIENTES.parceiros;
  return (
    <section id="parceiros" data-section="parceiros" className="tom-claro relative bg-papel-50 py-16 text-noite-950 lg:py-28">
      <Container>
        <div className="grid grid-cols-1 gap-y-6 lg:grid-cols-12 lg:gap-x-6">
          <SplitLines
            as="h2"
            lines={{ desktop: quebrar(titulo, 2), celular: quebrar(titulo, 3) }}
            text={titulo}
            className="display-xl text-[2rem] text-noite-950 lg:col-span-6 lg:text-[clamp(2.5rem,3.9vw,3.5rem)]"
          />
          <Reveal as="p" delay={0.1} className="corpo text-grafite-600 lg:col-span-5 lg:col-start-8 lg:self-end">
            {texto}
          </Reveal>
        </div>

        <div className="mt-10 border-b border-noite-950/10 lg:mt-14">
          <FaixaMarcas grupo="autorizada" itens={AUTORIZADAS} />
          <FaixaMarcas grupo="marca" itens={MARCAS} />
          <FaixaMarcas grupo="filiacao" itens={FILIACOES} />
        </div>

        <ReservedSlot id="clientes" className="mt-12 lg:mt-16" />
      </Container>
    </section>
  );
}
