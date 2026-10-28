import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { Reveal, RevealGroup, RevealItem } from "../../../components/motion";
import { OrcamentoCta, WhatsAppLink } from "../../../components/ui/cta";
import { ReservedSlot } from "../../../components/ui/ReservedSlot";
import { SERVICOS_HEADER, UI, WA, type Servico } from "../../../data/site";
import { Foto } from "./Foto";
import { fotoDoCapitulo } from "./util";

/**
 * Um capítulo de /servicos/ (rodada de sobriedade, por cima de §10.2.2): <article id={slug}> em duas colunas no
 * desktop (texto em 6 colunas e foto 16:10 em 5, alternando o lado a cada capítulo; nunca mais alto que a tela),
 * empilhado no celular (foto, nome, resumo, descrição e CTAs; a descrição também no celular, sem conteúdo a menos). Um CTA por capítulo
 * (orçamento deste serviço, que leva o serviço marcado para /contato/) e o WhatsApp do serviço em texto.
 * Avisa o pai quando cruza o meio da tela (margem -45%), para a barra de chips marcar o capítulo ativo.
 */
export function Capitulo({ servico, indice, onAtivo }: { servico: Servico; indice: number; onAtivo: (i: number) => void }) {
  const ref = useRef<HTMLElement>(null);
  const noMeio = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (noMeio) onAtivo(indice);
  }, [noMeio, indice, onAtivo]);

  const foto = fotoDoCapitulo(servico);
  const fotoAEsquerda = indice % 2 === 1;

  return (
    <article
      id={servico.slug}
      ref={ref}
      className="group/foto border-t border-noite-700 py-8 lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-6 lg:py-12"
    >
      <Reveal preset="fade" className={`lg:col-span-5 lg:row-start-1 ${fotoAEsquerda ? "lg:col-start-1" : "lg:col-start-8"}`}>
        <Foto
          id={foto.id}
          aspect="16/10"
          sizes="(min-width: 1440px) 533px, (min-width: 1024px) 37vw, (min-width: 768px) calc(100vw - 64px), calc(100vw - 40px)"
          credito={foto.credito}
          posicao={foto.posicao}
          className="w-full rounded-[14px]"
          zoom="group-hover/foto:scale-[1.03]"
        />
      </Reveal>

      <RevealGroup stagger={0.06} y={20} className={`mt-6 lg:col-span-6 lg:row-start-1 lg:mt-0 ${fotoAEsquerda ? "lg:col-start-7" : "lg:col-start-1"}`}>
        <RevealItem>
          <h2 className="display-l text-balance text-[clamp(1.625rem,2.6vw,2.5rem)] leading-[1.02] text-papel-50">{servico.nome}</h2>
        </RevealItem>
        <RevealItem className="mt-3 lg:mt-5">
          <p className="corpo-l text-pretty text-papel-50/90">{servico.resumo}</p>
        </RevealItem>
        {servico.descricao && (
          <RevealItem className="mt-3">
            <p className="corpo text-pretty text-papel-300">{servico.descricao}</p>
          </RevealItem>
        )}
        <RevealItem className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-1 lg:mt-7">
          <OrcamentoCta formLocation="pagina_servicos" servico={servico.slug} size="sm">
            {SERVICOS_HEADER.ctaServico}
          </OrcamentoCta>
          <WhatsAppLink
            location="pagina_servicos"
            detail={servico.slug}
            message={WA.servico(servico.nome)}
            className="inline-flex min-h-11 items-center gap-2.5 text-[15px] font-medium text-papel-300 underline-offset-4 transition-colors duration-200 hover:text-papel-50 hover:underline"
          >
            <span aria-hidden className="h-2 w-2 rounded-full bg-whatsapp" />
            {UI.falarWhatsapp}
          </WhatsAppLink>
        </RevealItem>
      </RevealGroup>

      {servico.slug === "manutencao-de-equipamentos" && <ReservedSlot id="preco-unico" className="mt-8 lg:col-span-12 lg:row-start-2" />}
    </article>
  );
}
