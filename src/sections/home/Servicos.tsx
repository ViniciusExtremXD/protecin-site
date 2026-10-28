import { useEffect, useRef, useState } from "react";
import { Reveal, SplitLines } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { OrcamentoCta } from "../../components/ui/cta";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { SECOES, SERVICOS, SERVICOS_HEADER } from "../../data/site";
import { useMediaQuery } from "../../lib/media";
import { useMotionPref } from "../../lib/motion-pref";
import { Cartao } from "./servicos/Cartao";
import { PilhaCtx, usePilha } from "./servicos/pilha";

export interface ServicosProps {
  /** id da âncora da seção (padrão "servicos") */
  id?: string;
  /** rótulo numerado (padrão "03 — Serviços", da home) */
  rotulo?: { index: string; label: string };
}

/**
 * H3. Serviços (design-final §9 H3, tom escuro): cabeçalho em fluxo normal, os 8 serviços em cartões sticky que se
 * empilham (cada um com o orçamento já marcando o serviço no formulário) e a linha final "Monte sua solicitação".
 * Estático (SSR, sem JS, movimento reduzido ou tela baixa): cartões em fluxo, sem sticky, escala ou véu.
 */
export default function Servicos({ id = "servicos", rotulo = SECOES.servicos }: ServicosProps = {}) {
  const reduced = useMotionPref() === "reduced";
  const curto = useMediaQuery("(max-height: 560px)");
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);
  const ligada = montado && !reduced && !curto;
  const lista = useRef<HTMLOListElement>(null);
  const pilha = usePilha(ligada, lista);

  return (
    <section id={id} data-section="H3" data-pilha={ligada ? "on" : "off"} className="grain relative bg-noite-950 py-24 lg:py-40">
      <Container>
        <header className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-6">
          <div className="lg:col-span-7">
            <SectionLabel index={rotulo.index} label={rotulo.label} />
            <SplitLines as="h2" lines={SERVICOS_HEADER.h2.linhas} text={SERVICOS_HEADER.h2.texto} className="display-xl mt-5 text-papel-50" />
          </div>
          <Reveal delay={0.15} className="lg:col-span-4 lg:col-start-9">
            <p className="corpo-l text-pretty text-papel-300">{SERVICOS_HEADER.subtitulo}</p>
          </Reveal>
        </header>

        <PilhaCtx.Provider value={pilha}>
          <ol ref={lista} className="relative mt-16 lg:mt-24">
            {SERVICOS.map((s, i) => (
              <Cartao key={s.slug} servico={s} indice={i} />
            ))}
          </ol>
        </PilhaCtx.Provider>

        <div className="mt-16 flex flex-col gap-6 border-t border-noite-700 pt-10 lg:mt-24 lg:flex-row lg:items-center lg:justify-between lg:pt-12">
          <Reveal>
            <p className="titulo max-w-[30ch] text-balance text-papel-50">{SERVICOS_HEADER.linhaFinal}</p>
          </Reveal>
          <Reveal delay={0.06}>
            <OrcamentoCta formLocation="servicos" />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
