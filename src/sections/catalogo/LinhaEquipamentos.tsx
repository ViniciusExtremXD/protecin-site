import { CATALOGO, UI } from "../../data/site";
import { IMAGENS } from "../../data/imagens.gen";
import { Reveal, RevealGroup, RevealItem } from "../../components/motion/Reveal";
import { Container } from "../../components/layout/Container";
import { Img } from "../../components/ui/Img";
import { H2 } from "../shared/historia/estilo";

/*
 * Linha de equipamentos de /catalogo-digital/ (design-final §10.4, com qa/AJUSTES-SOBRIEDADE.md por cima): a foto
 * ilustrativa na proporção dela, o título, a descrição do serviço 05 (versão da home) e os 6 equipamentos numa
 * lista em duas colunas. O conteúdo do PDF não foi lido, então nada aqui lista o que está dentro dele.
 * Fora da rodada 1: chips grandes que se montavam, fita corrida com os equipamentos em caixa alta, cortina,
 * parallax e cantoneiras da foto.
 */

export default function LinhaEquipamentos() {
  const { titulo, texto, chips, imagem } = CATALOGO.linha;
  const info = IMAGENS[imagem];
  return (
    <section id="equipamentos" data-section="catalogo-linha" className="relative bg-noite-900 py-16 text-papel-50 md:py-24 lg:py-28">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-6">
          <Reveal as="figure" y={20} className="lg:col-span-6">
            <div>
              <div className="overflow-clip rounded-2xl bg-noite-800" style={{ aspectRatio: `${info.w}/${info.h}` }}>
                <Img
                  id={imagem}
                  alt={info.alt}
                  // largura exibida (6 de 12 colunas), quadro na proporção da foto; o Img aplica a densidade mínima
                  sizes="(min-width: 1440px) 650px, (min-width: 1024px) 45vw, 100vw"
                  className="block h-full w-full"
                  imgClassName="h-full w-full object-cover"
                />
              </div>
            </div>
            <figcaption className="rotulo mt-3 text-papel-500">{UI.imagemIlustrativa.toUpperCase()}</figcaption>
          </Reveal>

          <div className="lg:col-span-5 lg:col-start-8">
            <Reveal y={20}>
              <h2 className={`${H2} text-papel-50`}>{titulo}</h2>
            </Reveal>
            <Reveal y={20} delay={0.08}>
              <p className="mt-5 max-w-[48ch] text-pretty text-[17px] leading-[1.6] text-papel-300 lg:mt-6 lg:text-[18px]">{texto}</p>
            </Reveal>
            <RevealGroup as="ul" y={16} stagger={0.05} delay={0.1} className="mt-8 grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:mt-10">
              {chips.map((c) => (
                <RevealItem as="li" key={c} className="flex items-center gap-3 border-t border-noite-700 py-3.5 text-[17px] font-medium leading-snug text-papel-50">
                  <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-brasa-400" />
                  {c}
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </Container>
    </section>
  );
}
