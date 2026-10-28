import { AUTORIZADAS, COMPROMISSO, FILIACOES, MARCAS, SECOES, SELOS } from "../../data/site";
import { DrawIcon, Reveal, RevealGroup, RevealItem, SplitLines } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { FaixaMarcas } from "../shared/marcas/LogoTile";

/*
 * H2. Credibilidade (design-final §9 H2, enxugada pela qa/AJUSTES-SOBRIEDADE.md), tom claro ("papel").
 * Topo: H2 à esquerda e o texto à direita; logo abaixo, os três selos numa linha. Embaixo, a tabela de marcas
 * parada: autorizações oficiais, marcas com que trabalhamos e filiações técnicas, uma linha por grupo. Sem letreiro
 * correndo e sem o rótulo repetido entre os logos. Regra de honestidade §2: os logos são de fabricantes e entidades,
 * nunca de clientes.
 */

/** H2 da home (`#autorizacoes`). Sem props. A página insere `<ReservedSlot id="clientes" />` logo depois. */
export default function Credibilidade() {
  return (
    <section id="autorizacoes" data-section="H2" className="tom-claro relative bg-papel-50 py-16 text-noite-950 lg:py-28">
      <Container>
        <SectionLabel index={SECOES.credibilidade.index} label={SECOES.credibilidade.label} tone="claro" />

        <div className="mt-8 grid grid-cols-1 gap-y-8 lg:mt-12 lg:grid-cols-12 lg:gap-x-6">
          <div className="lg:col-span-6">
            <SplitLines as="h2" lines={COMPROMISSO.h2.linhas} text={COMPROMISSO.h2.texto} className="display-xl text-[2rem] text-noite-950 lg:text-[clamp(2.5rem,3.9vw,3.5rem)]" />
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <Reveal as="p" delay={0.1} className="corpo text-grafite-600">
              {COMPROMISSO.texto}
            </Reveal>
          </div>
        </div>

        <RevealGroup as="ul" stagger={0.06} delay={0.1} className="mt-8 flex flex-col gap-3 lg:mt-12 lg:flex-row lg:gap-x-12">
          {SELOS.map((s, i) => (
            <RevealItem key={s.texto} as="li" index={i} className="flex items-center gap-3">
              <DrawIcon icon={s.icone} size={20} delay={0.2 + i * 0.06} className="shrink-0 text-brasa-500" />
              <span className="text-[16px] font-semibold leading-snug text-noite-950">{s.texto}</span>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-10 border-b border-noite-950/10 lg:mt-14">
          <FaixaMarcas grupo="autorizada" itens={AUTORIZADAS} />
          <FaixaMarcas grupo="marca" itens={MARCAS} />
          <FaixaMarcas grupo="filiacao" itens={FILIACOES} />
        </div>
      </Container>
    </section>
  );
}
