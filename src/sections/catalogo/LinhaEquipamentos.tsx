import { CATALOGO, FITAS } from "../../data/site";
import { IMAGENS } from "../../data/imagens.gen";
import { Reveal, RevealGroup, RevealItem } from "../../components/motion/Reveal";
import { VelocityMarquee } from "../../components/motion/VelocityMarquee";
import { Container } from "../../components/layout/Container";
import { CaptionedFigure } from "../../components/ui/CaptionedFigure";
import { LinhasReveladas } from "../shared/orcamento/revelar";

/*
 * Linha de equipamentos de /catalogo-digital/ (design-final §10.4): foto ilustrativa com cortina e parallax, título,
 * a descrição do serviço 05 (versão da home) e os 6 equipamentos em chips grandes que se montam. Embaixo, a fita
 * com FITAS.equipamentos. O conteúdo do PDF não foi lido, então nada aqui lista o que está dentro dele.
 */

/** Quebra o título em duas linhas no espaço mais perto do meio ("Equipamentos que" / "comercializamos"). */
function duasLinhas(t: string): string[] {
  const p = t.trim().split(/\s+/);
  if (p.length < 2) return p;
  let melhor = 1;
  let dif = Infinity;
  for (let i = 1; i < p.length; i++) {
    const d = Math.abs(p.slice(0, i).join(" ").length - p.slice(i).join(" ").length);
    if (d < dif) {
      dif = d;
      melhor = i;
    }
  }
  return [p.slice(0, melhor).join(" "), p.slice(melhor).join(" ")];
}

export default function LinhaEquipamentos() {
  const { titulo, texto, chips, imagem } = CATALOGO.linha;
  return (
    <section id="equipamentos" data-section="catalogo-linha" className="relative overflow-clip bg-noite-900 pb-24 text-papel-50 lg:pb-40">
      <Container className="pb-16 pt-24 lg:pb-24 lg:pt-40">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-6">
          {/* o fade no invólucro cobre a legenda de crédito; a imagem tem a cortina dela por dentro */}
          <Reveal preset="fade" className="lg:col-span-6">
            <CaptionedFigure
              img={{ id: imagem, alt: IMAGENS[imagem].alt, sizes: "(min-width: 1024px) 46vw, 100vw" }}
              credit="ilustrativa"
              reveal="cortina"
              parallax={8}
              aspect="4/3"
              brackets
            />
          </Reveal>
          <div className="lg:col-span-5 lg:col-start-8">
            <LinhasReveladas lines={duasLinhas(titulo)} text={titulo} className="display-xl text-[clamp(2.25rem,4.4vw,4.75rem)] text-papel-50" />
            <Reveal delay={0.1}>
              <p className="corpo-l mt-7 max-w-[48ch] text-pretty text-papel-300 lg:mt-8">{texto}</p>
            </Reveal>
            <RevealGroup as="ul" preset="monta" stagger={0.05} delay={0.1} className="mt-9 flex flex-wrap gap-2.5 lg:mt-10 lg:gap-3">
              {chips.map((c, i) => (
                <RevealItem as="li" key={c} index={i}>
                  <span className="inline-flex min-h-12 items-center gap-3 rounded-full border border-noite-600 bg-noite-800 px-5 py-2.5 text-[17px] font-medium leading-tight text-papel-50 lg:min-h-[56px] lg:px-6 lg:text-[19px]">
                    <span aria-hidden className="h-2 w-2 shrink-0 rounded-gota bg-brasa-400" />
                    {c}
                  </span>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </Container>

      <div className="border-y border-noite-700 py-6 lg:py-8">
        <VelocityMarquee baseVelocity={-0.9} ariaLabel={titulo} className="text-papel-50" trackClassName="gap-0">
          {FITAS.equipamentos.map((item) => (
            <span key={item} className="display-l inline-flex items-center whitespace-nowrap uppercase [font-stretch:66%]">
              <span className="px-6 lg:px-9">{item}</span>
              <span aria-hidden className="inline-block h-[0.32em] w-[0.32em] rounded-gota bg-brasa-400" />
            </span>
          ))}
        </VelocityMarquee>
      </div>
    </section>
  );
}
