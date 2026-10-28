import { useCallback, useRef, useState } from "react";
import { Container } from "../../components/layout/Container";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { SERVICOS, SERVICOS_HEADER } from "../../data/site";
import { pushEvent } from "../../lib/track";
import { Capitulo } from "./capitulos/Capitulo";
import { BarraChips, Indice } from "./capitulos/Indice";

export interface CapitulosProps {
  /** id da seção (padrão "capitulos"; cada capítulo usa o slug do serviço como âncora) */
  id?: string;
  /** rótulo numerado (padrão "02 — Serviços": em /servicos/ o diagrama é o "01") */
  rotulo?: { index: string; label: string };
}

/**
 * Capítulos dos 8 serviços de /servicos/ (§10.2.2). Desktop: índice sticky nas colunas 1–3 e capítulos nas
 * colunas 5–12. Celular: barra de chips no topo que gruda sob a nav. Cada capítulo é <article id={slug}> (as
 * âncoras antigas do site caem aqui). Primeira ativação de cada capítulo: service_open { servico, origem }.
 */
export default function Capitulos({ id = "capitulos", rotulo = { index: "02", label: SERVICOS_HEADER.label } }: CapitulosProps = {}) {
  const [ativo, setAtivo] = useState(0);
  const abertos = useRef(new Set<string>());

  const onAtivo = useCallback((i: number) => {
    setAtivo(i);
    const slug = SERVICOS[i].slug;
    if (!abertos.current.has(slug)) {
      abertos.current.add(slug);
      pushEvent("service_open", { servico: slug, origem: "servicos" });
    }
  }, []);

  return (
    <section id={id} data-section="servicos-capitulos" className="grain relative bg-noite-950 pb-12 pt-24 lg:pb-16 lg:pt-36">
      <Container>
        {/* celular: rótulo e barra de chips (a barra é filha direta do Container para grudar durante todos os capítulos) */}
        <SectionLabel index={rotulo.index} label={rotulo.label} className="mb-6 lg:hidden" />
        <BarraChips ativo={ativo} />

        <div className="mt-10 lg:mt-0 lg:grid lg:grid-cols-12 lg:gap-x-6">
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-[120px]">
              <SectionLabel index={rotulo.index} label={rotulo.label} className="mb-8" />
              <Indice ativo={ativo} />
            </div>
          </aside>
          <div className="lg:col-span-8 lg:col-start-5">
            {SERVICOS.map((s, i) => (
              <Capitulo key={s.slug} servico={s} indice={i} onAtivo={onAtivo} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
