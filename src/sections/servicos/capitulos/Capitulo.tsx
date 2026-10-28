import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { DrawIcon, Odometer, Reveal, RevealGroup, RevealItem, Rule, SplitLines } from "../../../components/motion";
import { CaptionedFigure } from "../../../components/ui/CaptionedFigure";
import { Chip } from "../../../components/ui/Chip";
import { OrcamentoCta, WhatsAppCta } from "../../../components/ui/cta";
import { ReservedSlot } from "../../../components/ui/ReservedSlot";
import { SERVICOS_HEADER, WA, type Servico } from "../../../data/site";
import { TOTAL_SERVICOS, altDe, creditoDe, linhasPara } from "./util";

/**
 * Um capítulo de /servicos/ (§10.2.2): <article id={slug}> com número em odômetro, ícone que se desenha, nome em
 * linhas, resumo e descrição, chips, CTAs (WhatsApp do serviço e "Monte sua solicitação" com o serviço marcado),
 * mídia principal em cortina com parallax e, nos capítulos 01, 04, 05 e 08, uma segunda mídia sobreposta.
 * Avisa o pai quando cruza o meio da tela (margem -45%), para o índice marcar o capítulo ativo.
 */
export function Capitulo({ servico, indice, onAtivo }: { servico: Servico; indice: number; onAtivo: (i: number) => void }) {
  const ref = useRef<HTMLElement>(null);
  const noMeio = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (noMeio) onAtivo(indice);
  }, [noMeio, indice, onAtivo]);

  const segunda = servico.imagem2;

  return (
    <article id={servico.slug} ref={ref} className="relative border-t border-noite-700 pb-14 pt-12 first:border-t-0 first:pt-2 lg:min-h-[90vh] lg:pb-28 lg:pt-20">
      <header>
        <Reveal y={12} className="flex items-center gap-4 lg:gap-6">
          <p className="rotulo flex shrink-0 items-center text-papel-500">
            <Odometer value={servico.numero} className="text-brasa-300" ariaLabel={`${servico.numero} de ${TOTAL_SERVICOS}`} />
            <span aria-hidden className="px-2 text-papel-50/25">
              /
            </span>
            <span aria-hidden>{TOTAL_SERVICOS}</span>
          </p>
          <span aria-hidden className="block min-w-0 flex-1">
            <Rule delay={0.1} />
          </span>
          <DrawIcon icon={servico.icone} size={40} delay={0.15} redrawOnHover className="text-brasa-400" />
        </Reveal>
        <SplitLines
          as="h2"
          lines={{ desktop: linhasPara(servico.nome, 22), celular: linhasPara(servico.nome, 16) }}
          text={servico.nome}
          className="display-l mt-6 text-[clamp(2.25rem,4.4vw,4.5rem)] text-papel-50 lg:mt-8"
        />
      </header>

      <div className="mt-8 grid grid-cols-1 gap-y-5 lg:mt-10 lg:grid-cols-8 lg:gap-x-6">
        <Reveal delay={0.1} className="lg:col-span-6">
          <p className="corpo-l text-pretty text-papel-50">{servico.resumo}</p>
        </Reveal>
        {servico.descricao && (
          <Reveal delay={0.2} className="lg:col-span-6">
            <p className="corpo text-pretty text-papel-300">{servico.descricao}</p>
          </Reveal>
        )}
      </div>

      <RevealGroup as="ul" preset="monta" stagger={0.05} className="mt-8 flex flex-wrap gap-2">
        {servico.chips.map((c, i) => (
          <RevealItem as="li" key={c} index={i}>
            <Chip>{c}</Chip>
          </RevealItem>
        ))}
      </RevealGroup>

      <RevealGroup stagger={0.06} className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:mt-10">
        <RevealItem>
          <OrcamentoCta formLocation="pagina_servicos" servico={servico.slug} full className="sm:w-auto">
            {SERVICOS_HEADER.ctaMonte}
          </OrcamentoCta>
        </RevealItem>
        <RevealItem>
          <WhatsAppCta location="pagina_servicos" detail={servico.slug} message={WA.servico(servico.nome)} full className="sm:w-auto">
            {SERVICOS_HEADER.ctaServico}
          </WhatsAppCta>
        </RevealItem>
      </RevealGroup>

      {/* o fade do bloco cobre os créditos; a cortina de cada figura corre por dentro */}
      <Reveal preset="fade" className="relative mt-12 lg:mt-16">
        <CaptionedFigure
          img={{ id: servico.imagem, alt: altDe(servico.imagem), sizes: "(min-width: 1024px) 60vw, 100vw" }}
          credit={creditoDe(servico.imagem)}
          reveal="cortina"
          parallax={8}
          aspect="16/10"
          brackets
          radius={24}
        />
        {segunda && (
          <div className="relative z-[1] ml-auto mt-6 w-[78%] sm:-mt-20 sm:w-[60%] lg:-mt-28 lg:w-[52%]">
            <div className="rounded-[26px] bg-noite-950 p-2 lg:p-2.5">
              <CaptionedFigure
                img={{ id: segunda, alt: altDe(segunda), sizes: "(min-width: 1024px) 32vw, 74vw", position: servico.imagem2Posicao }}
                credit={servico.imagem2Credito ?? creditoDe(segunda)}
                reveal="cortina"
                parallax={6}
                aspect="4/3"
                brackets
                radius={20}
                className="[&_figcaption]:px-1"
              />
            </div>
          </div>
        )}
      </Reveal>

      {servico.slug === "manutencao-de-equipamentos" && <ReservedSlot id="preco-unico" className="mt-12" />}
    </article>
  );
}
