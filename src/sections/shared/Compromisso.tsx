import { IMAGENS } from "../../data/imagens.gen";
import { INSTITUCIONAL, SECOES, SOCIAL, UI } from "../../data/site";
import { Reveal } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { GhostCta } from "../../components/ui/cta";
import { Img } from "../../components/ui/Img";
import { ReservedSlot } from "../../components/ui/ReservedSlot";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { usePath } from "../../lib/router";
import { H2_FRASE, H3 } from "./historia/estilo";

/*
 * H9. Compromisso (design-final §9 H9, tom claro, com qa/AJUSTES-SOBRIEDADE.md por cima).
 * A colagem do Kids ONG (foto do acervo, na proporção dela) à esquerda; à direita o rótulo, o título, a logo e o
 * texto do Kids ONG e, na home, o fecho de sustentabilidade: o título, o fato de 2004 e o link para a
 * Institucional, onde a Sustentabilidade tem seção própria com o texto inteiro.
 * Variante "kids" (Institucional, #kids-ong): só o Kids ONG.
 * Fora da rodada 1: letreiro de 4 linhas que acendia palavra por palavra, sobretítulo, mãos com muda flutuando,
 * cortina e parallax da colagem e o texto longo de sustentabilidade na home.
 */

type Variante = "home" | "kids";
export interface CompromissoProps {
  variant?: Variante;
}

/*
 * Correção de texto do site atual (qa/RELATORIO-SITE-ATUAL.md, item 14): "sete anos de atuação" foi escrito em
 * 2025 e envelhece. O ano de início não está em referencia/conteudo-site-atual.md (não se inventa), então a frase
 * sai sem a contagem até a Protecin confirmar o ano; com KIDS_ANO_INICIO preenchido, vira "desde <ano>".
 * Se o site.ts mudar a frase, vale a de lá.
 */
const KIDS_ANO_INICIO: number | null = null; // [confirmar com a Protecin]
const TRECHO_ANTIGO = "projeto social com sete anos de atuação em Santo André – SP";
const KIDS_TEXTO = SOCIAL.kids.texto.replace(
  TRECHO_ANTIGO,
  KIDS_ANO_INICIO ? `projeto social que atua desde ${KIDS_ANO_INICIO} em Santo André – SP` : "projeto social em Santo André – SP",
);

/** Colagem do acervo (1080 × 845): quadro na proporção original, sem recorte. Rostos já borrados no arquivo. */
function Colagem() {
  const k = SOCIAL.kids;
  return (
    <figure>
      <Reveal y={20}>
        <div className="overflow-clip rounded-2xl" style={{ aspectRatio: "1080/845" }}>
          <Img
            id={k.colagem}
            alt={IMAGENS[k.colagem].alt}
            // largura exibida (5 de 12 colunas); o Img aplica a densidade mínima de 1,5× nas telas de DPR baixo
            sizes="(min-width: 1440px) 540px, (min-width: 1024px) 37vw, 100vw"
            className="block h-full w-full"
            imgClassName="h-full w-full object-cover"
          />
        </div>
      </Reveal>
      <figcaption className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-grafite-600">
        <span className="text-[15px] leading-snug">{SOCIAL.kids.legendaColagem}</span>
        <span className="rotulo text-[12px]">{UI.fotoAcervo.toUpperCase()}</span>
      </figcaption>
    </figure>
  );
}

/** Logo e texto do Kids ONG. */
function Kids() {
  const k = SOCIAL.kids;
  return (
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:gap-5">
      <Img id={k.logo} alt={IMAGENS[k.logo].alt} sizes="56px" className="block w-11 shrink-0 sm:w-12 lg:w-14" imgClassName="h-auto w-full" />
      {/* o fecho "Protegemos seu maior patrimônio: A vida." já está na abertura e no rodapé: não se repete aqui */}
      <p className="text-pretty text-[16px] leading-[1.6] text-grafite-600 lg:text-[17px]">{KIDS_TEXTO}</p>
    </div>
  );
}

/** Fecho de sustentabilidade da home: título, o fato de 2004 (marco da linha do tempo) e o link para a Institucional. */
function Sustentabilidade() {
  const s = SOCIAL.sustentabilidade;
  return (
    <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h3 className={`${H3} text-noite-950`}>{s.titulo}</h3>
        <p className="mt-1.5 text-[16px] leading-snug text-grafite-600">{INSTITUCIONAL.sustentabilidade.linha2004}.</p>
      </div>
      <GhostCta tone="claro" size="sm" to={SOCIAL.link.to} className="shrink-0">
        {SOCIAL.link.label}
      </GhostCta>
    </div>
  );
}

/**
 * Sem a prop, a variante sai da rota (/institucional/ → "kids"), o que serve ao sandbox; a página passa a prop.
 * Uma grade só: no celular vale a ordem do DOM (título, foto, Kids ONG, sustentabilidade); no desktop a foto ocupa
 * as linhas à esquerda e o texto fica centrado na altura dela, à direita.
 */
export default function Compromisso({ variant }: CompromissoProps = {}) {
  const path = usePath();
  const v: Variante = variant ?? (path === "/institucional/" ? "kids" : "home");
  const home = v === "home";
  const direita = "lg:col-span-6 lg:col-start-7";

  return (
    <section id={home ? "social" : "kids-ong"} data-section="H9" className="tom-claro relative bg-papel-50 py-16 text-noite-950 md:py-24 lg:py-28">
      <Container>
        <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:grid-rows-[1fr_auto_auto_auto_1fr] lg:gap-x-6 lg:gap-y-0">
          <div className={`${direita} lg:row-start-2`}>
            <SectionLabel index={home ? SECOES.compromisso.index : "04"} label={SOCIAL.label} tone="claro" />
            <Reveal y={20} delay={0.06}>
              <h2 className={`${H2_FRASE} mt-4 max-w-[24ch] text-noite-950 lg:mt-5`}>{SOCIAL.letreiroTexto}</h2>
            </Reveal>
          </div>

          <div className="lg:col-span-5 lg:row-span-5 lg:row-start-1 lg:self-center">
            <Colagem />
          </div>

          <Reveal y={20} delay={0.1} className={`${direita} lg:row-start-3 lg:mt-7`}>
            <Kids />
          </Reveal>

          {home && (
            <Reveal y={20} delay={0.16} className={`${direita} border-t border-noite-950/15 pt-6 lg:row-start-4 lg:mt-8 lg:pt-7`}>
              <Sustentabilidade />
            </Reveal>
          )}
        </div>
        <ReservedSlot id="depoimentos" className="mt-12" />
      </Container>
    </section>
  );
}
