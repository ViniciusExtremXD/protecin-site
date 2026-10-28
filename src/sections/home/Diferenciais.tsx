import { DIFERENCIAIS, DIFERENCIAIS_HEADER, SECOES } from "../../data/site";
import { DrawIcon, Reveal, RevealGroup, RevealItem } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { H2, H3 } from "../shared/historia/estilo";

/*
 * H6. Por que a Protecin (design-final §9 H6, tom claro, com qa/AJUSTES-SOBRIEDADE.md por cima).
 * Título à esquerda e os 4 diferenciais à direita, em 2 × 2, separados por réguas finas: ícone de traço que se
 * desenha uma vez, título e o texto literal. Celular: título e os 4 em coluna, com o ícone ao lado do título.
 * Fora da rodada 1: ficha fixa com o número gigante e o ícone de 160 px, contador "01 / 04", blocos de 70vh,
 * opacidade por bloco ativo e o "Protecin" em vermelho no título.
 */

/** Rótulo de interface da seção (o site.ts usa "Por que a Protecin", que já é o H2). */
const ROTULO = "Diferenciais";

export default function Diferenciais() {
  return (
    <section id="diferenciais" data-section="H6" className="tom-claro relative bg-papel-50 py-16 text-noite-950 md:py-24 lg:py-28">
      <Container>
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-6">
          <div className="lg:col-span-4">
            <SectionLabel index={SECOES.diferenciais.index} label={ROTULO} tone="claro" />
            <Reveal y={20} delay={0.06}>
              <h2 className={`${H2} mt-4 max-w-[12ch] text-noite-950 lg:mt-5`}>{DIFERENCIAIS_HEADER.h2}</h2>
            </Reveal>
          </div>

          <RevealGroup as="ul" y={20} stagger={0.08} className="mt-10 grid grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-12 lg:col-span-8 lg:mt-1">
            {DIFERENCIAIS.map((d, i) => (
              <RevealItem as="li" key={d.numero} className="border-t border-noite-950/15 pt-5 lg:pt-7">
                <div className="flex items-center gap-4 sm:block">
                  <DrawIcon icon={d.icone} size={28} delay={0.1 + i * 0.08} className="shrink-0 text-brasa-500" />
                  <h3 className={`${H3} text-noite-950 sm:mt-5`}>{d.titulo}</h3>
                </div>
                <p className="mt-2.5 max-w-[46ch] text-[16px] leading-[1.6] text-grafite-600 lg:mt-3 lg:text-[17px]">{d.texto}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Container>
    </section>
  );
}
