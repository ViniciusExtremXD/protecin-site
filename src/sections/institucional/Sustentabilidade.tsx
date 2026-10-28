import { IMAGENS } from "../../data/imagens.gen";
import { INSTITUCIONAL, UI } from "../../data/site";
import { Reveal } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { Img } from "../../components/ui/Img";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { H2 } from "../shared/historia/estilo";

/*
 * /institucional/ · Sustentabilidade (design-final §10.1, tom escuro, com qa/AJUSTES-SOBRIEDADE.md por cima).
 * Texto à esquerda (título, o fato de 2004 e o texto literal) e a paisagem ilustrativa à direita, nítida e na
 * proporção dela (3:2), com o crédito.
 * Fora da rodada 1: paisagem velada ao fundo com parallax (ficava turva), seção de 110vh, "prevenir." em vermelho,
 * carimbo de 2004, cartão em cortina e as mãos com muda flutuando.
 */

/** Rótulo de interface (no site atual o bloco se chama "Responsabilidade e Sustentabilidade"). */
const ROTULO = "Sustentabilidade";

export default function Sustentabilidade() {
  const s = INSTITUCIONAL.sustentabilidade;

  return (
    <section id="sustentabilidade" data-section="SUST" className="grain relative bg-noite-950 py-16 text-papel-50 md:py-24 lg:py-28">
      <Container>
        <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:items-center lg:gap-x-6">
          <div className="lg:col-span-5">
            <SectionLabel index="03" label={ROTULO} />
            <Reveal y={20} delay={0.06}>
              <h2 className={`${H2} mt-4 text-papel-50 lg:mt-5`}>{s.titulo}</h2>
            </Reveal>
            <Reveal y={20} delay={0.12}>
              <p className="mt-5 flex items-center gap-3 text-[15px] font-semibold text-papel-50 lg:mt-6">
                <span aria-hidden className="block h-px w-6 shrink-0 bg-brasa-400" />
                {s.linha2004}
              </p>
              <p className="mt-5 max-w-[56ch] text-pretty text-[17px] leading-[1.6] text-papel-300">{s.texto}</p>
            </Reveal>
          </div>

          <Reveal as="figure" y={20} delay={0.1} className="lg:col-span-6 lg:col-start-7">
            <div>
              <div className="overflow-clip rounded-2xl bg-noite-900" style={{ aspectRatio: "3/2" }}>
                <Img
                  id={s.fundo}
                  alt={IMAGENS[s.fundo].alt}
                  // largura exibida (6 de 12 colunas), quadro 3:2 como a foto; o Img aplica a densidade mínima
                  sizes="(min-width: 1440px) 650px, (min-width: 1024px) 45vw, 100vw"
                  frame={3 / 2}
                  className="block h-full w-full"
                  imgClassName="h-full w-full object-cover"
                />
              </div>
            </div>
            <figcaption className="rotulo mt-3 text-papel-500">{UI.imagemIlustrativa.toUpperCase()}</figcaption>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
