import { Reveal, RevealGroup, SplitLines } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { OrcamentoCta, WhatsAppLink } from "../../components/ui/cta";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { SECOES, SERVICOS, SERVICOS_HEADER, UI, WA } from "../../data/site";
import { creditoDe } from "../servicos/capitulos/util";
import { CartaoServico } from "./servicos/CartaoServico";

export interface ServicosProps {
  /** id da âncora da seção (padrão "servicos") */
  id?: string;
  /** rótulo numerado (padrão "03 — Serviços", da home) */
  rotulo?: { index: string; label: string };
}

/** No celular o subtítulo fica só na 1ª frase (complemento do H2); o resto entra a partir do tablet. */
const CORTE = SERVICOS_HEADER.subtitulo.indexOf(". ");
const PRIMEIRA_FRASE = CORTE >= 0 ? SERVICOS_HEADER.subtitulo.slice(0, CORTE + 1) : SERVICOS_HEADER.subtitulo;
const RESTO = CORTE >= 0 ? SERVICOS_HEADER.subtitulo.slice(CORTE + 2) : "";

/**
 * H3. Serviços (rodada de sobriedade, por cima de design-final §9 H3): cabeçalho, os 8 serviços numa grade sóbria
 * (4 × 2 cartões no desktop, lista com miniatura no celular e no tablet), um crédito único das fotos de banco e uma
 * linha final com o orçamento (CTA principal) e o WhatsApp em texto. Entrada: cascata curta dos itens.
 */
export default function Servicos({ id = "servicos", rotulo = SECOES.servicos }: ServicosProps = {}) {
  const ilustrativas = SERVICOS.some((s) => creditoDe(s.imagem) === "ilustrativa");

  return (
    <section id={id} data-section="H3" className="grain relative bg-noite-950 py-16 lg:py-24">
      <Container>
        <header className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-end lg:gap-x-6">
          <div className="lg:col-span-7">
            <SectionLabel index={rotulo.index} label={rotulo.label} />
            <SplitLines
              as="h2"
              lines={SERVICOS_HEADER.h2.linhas}
              text={SERVICOS_HEADER.h2.texto}
              className="display-xl mt-4 text-[clamp(2.25rem,4.4vw,4rem)] text-papel-50"
            />
          </div>
          <Reveal y={20} delay={0.1} className="lg:col-span-5 lg:col-start-8">
            <p className="corpo text-pretty text-papel-300">
              {PRIMEIRA_FRASE}
              {RESTO && <span className="hidden md:inline"> {RESTO}</span>}
            </p>
          </Reveal>
        </header>

        <RevealGroup
          as="ul"
          stagger={0.06}
          y={20}
          className="mt-8 grid grid-cols-1 border-t border-noite-700 md:grid-cols-2 md:gap-x-8 lg:mt-9 xl:grid-cols-4 xl:gap-6 xl:border-t-0"
        >
          {SERVICOS.map((s) => (
            <CartaoServico key={s.slug} servico={s} />
          ))}
        </RevealGroup>
        {ilustrativas && (
          <Reveal as="p" preset="fade" className="mt-3 text-[13px] leading-none text-papel-500">
            {UI.imagemIlustrativa}
          </Reveal>
        )}

        <div className="mt-8 flex flex-col gap-5 lg:mt-7 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:border-t lg:border-noite-700 lg:pt-6">
          <Reveal y={20}>
            <p className="titulo text-balance text-papel-50">{SERVICOS_HEADER.linhaFinal}</p>
          </Reveal>
          <Reveal y={20} delay={0.06} className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-7">
            <OrcamentoCta formLocation="servicos" full className="sm:w-auto" />
            <WhatsAppLink
              location="servicos"
              message={WA.padrao}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2.5 whitespace-nowrap text-[15px] font-medium text-papel-300 underline-offset-4 transition-colors duration-200 hover:text-papel-50 hover:underline sm:justify-start"
            >
              <span aria-hidden className="h-2 w-2 rounded-full bg-whatsapp" />
              {UI.falarWhatsapp}
            </WhatsAppLink>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
