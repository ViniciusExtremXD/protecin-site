import { COMO_FUNCIONA, SECOES, UI, WA } from "../../data/site";
import { DrawIcon, Reveal, RevealGroup, RevealItem } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { OrcamentoCta, WhatsAppLink } from "../../components/ui/cta";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { H2, H3 } from "../shared/historia/estilo";

/*
 * Como funciona (rodada de conversão, qa/AJUSTES-CONVERSAO.md), tom claro, entre a Escala e o Orçamento.
 * Título e texto à esquerda; os 3 passos à direita, em colunas separadas por réguas finas (empilhados no celular):
 * número, ícone de traço que se desenha uma vez, título e uma frase. Fecha com o orçamento (CTA principal) e o
 * WhatsApp em texto. Substitui na home a Plataforma, o "Na prática" e os Diferenciais.
 */
export default function ComoFunciona() {
  return (
    <section id="como-funciona" data-section="H4" className="tom-claro relative bg-papel-50 py-16 text-noite-950 md:py-24">
      <Container>
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-6">
          <div className="lg:col-span-4">
            <SectionLabel index={SECOES.comoFunciona.index} label={SECOES.comoFunciona.label} tone="claro" />
            <Reveal y={20} delay={0.06}>
              <h2 className={`${H2} mt-4 max-w-[14ch] text-noite-950 lg:mt-5`}>{COMO_FUNCIONA.h2}</h2>
            </Reveal>
            <Reveal as="p" y={20} delay={0.12} className="mt-5 max-w-[40ch] text-pretty text-[17px] leading-[1.6] text-grafite-600 lg:text-[18px]">
              {COMO_FUNCIONA.texto}
            </Reveal>
          </div>

          <RevealGroup as="ol" y={20} stagger={0.08} className="mt-10 grid grid-cols-1 gap-y-8 md:grid-cols-3 md:gap-x-8 lg:col-span-8 lg:mt-1">
            {COMO_FUNCIONA.passos.map((p, i) => (
              <RevealItem as="li" key={p.numero} className="border-t border-noite-950/15 pt-5 lg:pt-7">
                <div className="flex items-center gap-4">
                  <span className="rotulo text-brasa-500">{p.numero}</span>
                  <DrawIcon icon={p.icone} size={26} delay={0.1 + i * 0.08} className="shrink-0 text-brasa-500" />
                </div>
                <h3 className={`${H3} mt-4 text-noite-950`}>{p.titulo}</h3>
                <p className="mt-2.5 max-w-[46ch] text-[16px] leading-[1.6] text-grafite-600 lg:mt-3 lg:text-[17px]">{p.texto}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <Reveal y={20} className="mt-10 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-7 lg:mt-14 lg:border-t lg:border-noite-950/10 lg:pt-8">
          <OrcamentoCta formLocation="como_funciona" tone="claro" full className="sm:w-auto" />
          <WhatsAppLink
            location="como_funciona"
            message={WA.padrao}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2.5 whitespace-nowrap text-[15px] font-medium text-grafite-600 underline-offset-4 transition-colors duration-200 hover:text-noite-950 hover:underline sm:justify-start"
          >
            <span aria-hidden className="h-2 w-2 rounded-full bg-whatsapp" />
            {UI.falarWhatsapp}
          </WhatsAppLink>
        </Reveal>
      </Container>
    </section>
  );
}
