import { useRef } from "react";
import { useInView } from "framer-motion";
import { IMAGENS } from "../../data/imagens.gen";
import { INSTITUCIONAL } from "../../data/site";
import { Reveal, Rule, TextRoll } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { CaptionedFigure } from "../../components/ui/CaptionedFigure";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { useMotionPref } from "../../lib/motion-pref";
import { Revela } from "../shared/historia/Revela";

/*
 * /institucional/ · Missão, visão e valores (design-final §10.1, tom claro). Missão e Visão como duas declarações
 * grandes, separadas por uma régua vertical; os 6 valores numa lista numerada que acende ao cruzar o meio da tela,
 * ao lado da imagem ilustrativa.
 */

/** Rótulo de interface (no site atual o bloco se chama "Missão, Visão e Valores"). */
const ROTULO = "Missão, visão e valores";

function Valor({ numero, texto }: { numero: string; texto: string }) {
  const ref = useRef<HTMLLIElement>(null);
  const reduced = useMotionPref() === "reduced";
  // acende quando a linha passa do meio da tela, e fica acesa
  const passou = useInView(ref, { once: true, margin: "0px 0px -50% 0px" });
  const aceso = reduced || passou;

  return (
    <li ref={ref} className="group relative">
      <div className={`grid grid-cols-[3.25rem_minmax(0,1fr)] items-baseline gap-x-4 py-5 transition-opacity duration-[400ms] ease-out lg:py-6 ${aceso ? "opacity-100" : "opacity-[0.62]"}`}>
        <span className="font-mono text-[15px] font-medium tracking-[0.08em] text-brasa-500">{numero}</span>
        <span className="titulo text-noite-950">
          <TextRoll text={texto} />
        </span>
      </div>
      <Rule className={aceso ? "bg-brasa-500/50" : "bg-noite-950/15"} />
    </li>
  );
}

export default function MissaoVisaoValores() {
  const m = INSTITUCIONAL.mvv;

  return (
    <section id="valores" data-section="MVV" className="tom-claro relative overflow-clip bg-papel-50 py-24 text-noite-950 lg:py-40">
      <Container>
        {/* abertura: título à esquerda, introdução à direita */}
        <div className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-6">
          <div className="lg:col-span-7">
            <SectionLabel index="02" label={ROTULO} tone="claro" />
            <Revela
              as="h2"
              modo="palavra"
              texto={m.titulo}
              destaque={["segurança"]}
              destaqueClassName="text-brasa-500"
              className="stretch-66 mt-5 max-w-[20ch] text-[clamp(2.25rem,4.6vw,4.5rem)] font-[800] uppercase leading-[0.92] text-noite-950"
            />
          </div>
          <Reveal delay={0.15} className="mt-8 lg:col-span-5 lg:mt-0">
            <p className="corpo-l text-pretty text-grafite-600">{m.intro}</p>
          </Reveal>
        </div>

        {/* missão e visão */}
        <div className="mt-20 grid grid-cols-1 gap-y-14 lg:mt-32 lg:grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)] lg:gap-x-12 xl:gap-x-16">
          <div>
            <Reveal y={12}>
              <p className="rotulo text-brasa-500">{m.rotulos.missao}</p>
            </Reveal>
            <Revela texto={m.missao} className="mt-6 text-[clamp(1.75rem,2.5vw,2.625rem)] font-[700] leading-[1.06] text-noite-950 [font-stretch:75%]" />
          </div>
          <div aria-hidden className="hidden lg:block">
            <Rule axis="y" delay={0.1} className="bg-noite-950/15" />
          </div>
          <div>
            <Reveal y={12} delay={0.2}>
              <p className="rotulo text-brasa-500">{m.rotulos.visao}</p>
            </Reveal>
            <Revela texto={m.visao} delay={0.2} className="mt-6 text-[clamp(1.75rem,2.5vw,2.625rem)] font-[700] leading-[1.06] text-noite-950 [font-stretch:75%]" />
          </div>
        </div>

        {/* valores + imagem */}
        <div className="mt-24 grid grid-cols-1 gap-y-14 lg:mt-36 lg:grid-cols-12 lg:gap-x-6">
          <div className="lg:col-span-7">
            <Reveal y={12}>
              <p className="rotulo text-brasa-500">{m.rotulos.valores}</p>
            </Reveal>
            <div aria-hidden className="mt-6">
              <Rule className="bg-noite-950/15" />
            </div>
            <ol>
              {m.valores.map((v, i) => (
                <Valor key={v} numero={String(i + 1).padStart(2, "0")} texto={v} />
              ))}
            </ol>
          </div>
          <CaptionedFigure
            className="lg:col-span-4 lg:col-start-9 lg:self-end"
            img={{ id: m.imagem, alt: IMAGENS[m.imagem].alt, sizes: "(min-width: 1024px) 30vw, 100vw" }}
            credit="ilustrativa"
            parallax={8}
            aspect="4/5"
            tone="claro"
            brackets
          />
        </div>
      </Container>
    </section>
  );
}
