import { ArrowRight } from "lucide-react";
import { RevealItem } from "../../../components/motion";
import { SERVICOS_HEADER, type Servico } from "../../../data/site";
import { Link } from "../../../lib/router";
import { pushEvent } from "../../../lib/track";
import { Foto } from "../../servicos/capitulos/Foto";
import { creditoDe } from "../../servicos/capitulos/util";
import { FRASE_CURTA } from "./frases";

/**
 * Um serviço da grade do H3. Celular e tablet: linha de lista (miniatura 3:2 à esquerda, nome e uma frase), e a
 * linha inteira é o link. Desktop (≥ 1280): cartão com foto 3:2 em cima, nome, a frase e "Ver detalhes", com o
 * clique esticado sobre o cartão. Um único link por item, para /servicos/#slug, com service_open { origem: "home" }.
 * O crédito de cada foto fica para leitor de tela; a seção mostra uma linha de crédito do conjunto.
 */
export function CartaoServico({ servico }: { servico: Servico }) {
  return (
    <RevealItem
      as="li"
      className="group/card relative grid grid-cols-[96px_minmax(0,1fr)] items-center gap-x-4 border-b border-noite-700 py-4 md:grid-cols-[136px_minmax(0,1fr)] md:gap-x-5 xl:grid-cols-1 xl:grid-rows-[auto_1fr_auto] xl:items-stretch xl:gap-0 xl:overflow-hidden xl:rounded-[14px] xl:border xl:bg-noite-900 xl:py-0 xl:transition-colors xl:duration-300 xl:hover:border-noite-500"
    >
      <Foto
        id={servico.imagem}
        aspect="3/2"
        sizes="(min-width: 1440px) 312px, (min-width: 1280px) calc((100vw - 200px) / 4), (min-width: 768px) 136px, 96px"
        credito={creditoDe(servico.imagem)}
        creditoVisivel={false}
        className="w-full rounded-[10px] xl:rounded-none"
        zoom="group-hover/card:scale-[1.03]"
      />
      <div className="min-w-0 xl:px-6 xl:pt-4">
        <h3 className="text-balance text-[17px] font-semibold leading-[1.3] text-papel-50 xl:text-[19px]">{servico.nome}</h3>
        <p className="mt-1 text-pretty text-base leading-[1.45] text-papel-300 xl:mt-2 xl:text-[17px] xl:leading-normal">{FRASE_CURTA[servico.slug]}</p>
      </div>
      <Link
        to={`/servicos/#${servico.slug}`}
        onClick={() => pushEvent("service_open", { servico: servico.slug, origem: "home" })}
        className="absolute inset-0 rounded-[10px] text-[15px] font-medium text-papel-300 transition-colors duration-300 group-hover/card:text-papel-50 xl:static xl:flex xl:min-h-11 xl:items-center xl:gap-1.5 xl:rounded-none xl:px-6 xl:pb-4 xl:pt-2 xl:after:absolute xl:after:inset-0 xl:after:content-[''] xl:focus-visible:outline-none xl:focus-visible:after:rounded-[14px] xl:focus-visible:after:outline xl:focus-visible:after:outline-2 xl:focus-visible:after:[outline-offset:-3px] xl:focus-visible:after:[outline-color:var(--foco)]"
      >
        <span className="hidden xl:inline">{SERVICOS_HEADER.verDetalhes}</span>
        <span className="sr-only">
          <span className="xl:hidden">{SERVICOS_HEADER.verDetalhes}</span>: {servico.nome}
        </span>
        <ArrowRight aria-hidden size={16} strokeWidth={1.75} className="hidden transition-transform duration-300 ease-out group-hover/card:translate-x-1 xl:block" />
      </Link>
    </RevealItem>
  );
}
