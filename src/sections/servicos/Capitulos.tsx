import { useCallback, useRef } from "react";
import { Container } from "../../components/layout/Container";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { SERVICOS, SERVICOS_HEADER } from "../../data/site";
import { pushEvent } from "../../lib/track";
import { Capitulo } from "./capitulos/Capitulo";
import { Sumario } from "./capitulos/Indice";

export interface CapitulosProps {
  /** id da seção (padrão "capitulos"; cada capítulo usa o slug do serviço como âncora) */
  id?: string;
  /** rótulo numerado (padrão "02 — Serviços": em /servicos/ o diagrama é o "01") */
  rotulo?: { index: string; label: string };
}

/**
 * Capítulos dos 8 serviços de /servicos/ (rodada de sobriedade, por cima de §10.2.2): rótulo e sumário de links no
 * topo (sem índice fixo nem barra de chips presa), depois os capítulos compactos, em duas colunas alternadas no
 * desktop. Cada capítulo é <article id={slug}> (as âncoras antigas do site e os links da home caem aqui). Primeira
 * vez que cada capítulo cruza o meio da tela: service_open { servico, origem: "servicos" }.
 */
export default function Capitulos({ id = "capitulos", rotulo = { index: "02", label: SERVICOS_HEADER.label } }: CapitulosProps = {}) {
  const abertos = useRef(new Set<string>());

  const onAtivo = useCallback((i: number) => {
    const slug = SERVICOS[i].slug;
    if (!abertos.current.has(slug)) {
      abertos.current.add(slug);
      pushEvent("service_open", { servico: slug, origem: "servicos" });
    }
  }, []);

  return (
    <section id={id} data-section="servicos-capitulos" className="grain relative bg-noite-950 pb-4 pt-16 lg:pb-6 lg:pt-24">
      <Container>
        <div className="flex flex-col gap-3 pb-4 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:pb-5">
          <SectionLabel index={rotulo.index} label={rotulo.label} className="shrink-0" />
          <Sumario />
        </div>
        {SERVICOS.map((s, i) => (
          <Capitulo key={s.slug} servico={s} indice={i} onAtivo={onAtivo} />
        ))}
      </Container>
    </section>
  );
}
