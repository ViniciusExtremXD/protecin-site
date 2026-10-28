import { INSTITUCIONAL } from "../../data/site";
import { Reveal, RevealGroup, RevealItem } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { H2_FRASE, H3 } from "../shared/historia/estilo";

/*
 * /institucional/ · Missão, visão e valores (design-final §10.1, tom claro, com qa/AJUSTES-SOBRIEDADE.md por cima).
 * Título e introdução lado a lado; Missão e Visão em duas colunas; os 6 valores numa grade de 3 × 2 com réguas finas.
 * Fora da rodada 1: título em caixa alta com "segurança" em vermelho, declarações em 42 px, lista que acendia ao
 * cruzar o meio da tela, rolagem de texto no hover e a foto de banco (mãos empilhadas) recortada em retrato.
 */

/** Rótulo de interface (no site atual o bloco se chama "Missão, Visão e Valores"). */
const ROTULO = "Missão, visão e valores";

/** "NOSSA MISSÃO" → "Nossa missão" (os rótulos do site.ts estão em caixa alta para o mono). */
const frase = (t: string) => t.charAt(0) + t.slice(1).toLowerCase();

export default function MissaoVisaoValores() {
  const m = INSTITUCIONAL.mvv;

  return (
    <section id="valores" data-section="MVV" className="tom-claro relative bg-papel-50 py-16 text-noite-950 md:py-24 lg:py-28">
      <Container>
        {/* abertura: título à esquerda, introdução à direita */}
        <div className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-6">
          <div className="lg:col-span-6">
            <SectionLabel index="02" label={ROTULO} tone="claro" />
            <Reveal y={20} delay={0.06}>
              <h2 className={`${H2_FRASE} mt-4 max-w-[22ch] text-noite-950 lg:mt-5`}>{m.titulo}</h2>
            </Reveal>
          </div>
          <Reveal y={20} delay={0.12} className="mt-6 lg:col-span-5 lg:col-start-8 lg:mt-0">
            <p className="text-pretty text-[17px] leading-[1.6] text-grafite-600 lg:text-[18px]">{m.intro}</p>
          </Reveal>
        </div>

        {/* missão e visão */}
        <RevealGroup y={20} stagger={0.1} className="mt-12 grid grid-cols-1 gap-y-10 md:grid-cols-2 md:gap-x-10 lg:mt-20 lg:gap-x-6">
          {[
            { rotulo: m.rotulos.missao, texto: m.missao },
            { rotulo: m.rotulos.visao, texto: m.visao },
          ].map((b) => (
            <RevealItem key={b.rotulo} className="border-t border-noite-950/15 pt-6 lg:pr-10">
              <h3 className={`${H3} text-noite-950`}>{frase(b.rotulo)}</h3>
              <p className="mt-3 text-pretty text-[20px] font-medium leading-[1.45] text-noite-950 lg:text-[23px]">{b.texto}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* valores */}
        <div className="mt-12 lg:mt-20">
          <Reveal y={20}>
            <h3 className={`${H3} text-noite-950`}>{frase(m.rotulos.valores)}</h3>
          </Reveal>
          <RevealGroup as="ol" y={20} stagger={0.05} className="mt-5 grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
            {m.valores.map((v, i) => (
              <RevealItem as="li" key={v} className="flex items-baseline gap-4 border-t border-noite-950/15 py-4 lg:py-5">
                <span aria-hidden className="tnum w-6 shrink-0 text-[15px] font-semibold text-brasa-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[17px] font-medium leading-snug text-noite-950 lg:text-[18px]">{v}</span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Container>
    </section>
  );
}
