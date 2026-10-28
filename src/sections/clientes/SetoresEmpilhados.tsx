import { SETORES, UI } from "../../data/site";
import { IMAGENS } from "../../data/imagens.gen";
import { RevealGroup, RevealItem } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { Img } from "../../components/ui/Img";

/*
 * /nossos-clientes/: os 3 setores (design-final §10.3, refeita pela qa/AJUSTES-SOBRIEDADE.md). Os painéis sticky de
 * 100svh saíram: agora é uma grade sóbria de 3 colunas (1 no celular), cada setor com a imagem em paisagem 3:2, o
 * nome e o texto literal. Continua logo abaixo da ClientesEscala, no mesmo fundo escuro. Imagens de banco: um crédito
 * "Imagem ilustrativa" para a grade, sem selo sobre cada foto. O id/data-section antigos ficam (âncora e verify).
 */

// Largura exibida do quadro 3:2 (3 colunas no desktop, 2 no tablet, 1 no celular; margens do Container e gap de 24 px).
// O Img soma o recorte do object-cover (frame) e a densidade mínima das telas de DPR baixo.
const SIZES =
  "(min-width: 1280px) calc((min(100vw, 1440px) - 176px) / 3), (min-width: 1024px) calc((100vw - 144px) / 3), (min-width: 768px) calc((100vw - 88px) / 2), calc(100vw - 40px)";

// Foto recortada (PNG com fundo transparente, a da esfera de gás): um zoom leve a partir da esquerda esconde o canto
// recortado em diagonal, que no quadro 3:2 parecia corte errado.
const RECORTE = 1.12;

/** SetoresEmpilhados (`#setores` em /nossos-clientes/). Sem props. */
export default function SetoresEmpilhados() {
  return (
    <section id="setores" data-section="setores-empilhados" className="grain relative bg-noite-950 pb-16 lg:pb-28">
      <Container>
        <RevealGroup as="ul" stagger={0.08} className="grid grid-cols-1 gap-y-12 border-t border-papel-50/10 pt-10 md:grid-cols-2 md:gap-x-6 lg:grid-cols-3 lg:pt-14">
          {SETORES.itens.map((s, i) => (
            <RevealItem key={s.id} as="li" index={i}>
              <article>
                <div className="relative aspect-[3/2] overflow-clip rounded-xl bg-noite-900">
                  <Img
                    id={s.imagem}
                    alt={IMAGENS[s.imagem].alt}
                    sizes={SIZES}
                    frame={3 / 2}
                    zoom={IMAGENS[s.imagem].alpha ? RECORTE : 1}
                    className="block h-full w-full"
                    imgClassName={`h-full w-full object-cover ${IMAGENS[s.imagem].alpha ? "origin-[0%_35%] scale-[1.12]" : ""}`}
                  />
                </div>
                <h3 className="titulo mt-5 text-papel-50 lg:mt-6">{s.nome}</h3>
                <p className="corpo mt-3 text-papel-300">{s.texto}</p>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
        <p className="rotulo mt-8 text-papel-500 lg:mt-10">{UI.imagemIlustrativa}</p>
      </Container>
    </section>
  );
}
