import { IMAGENS, type ImagemId } from "../../data/imagens.gen";
import { PLATAFORMA } from "../../data/site";
import { Reveal, SplitLines } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { Img } from "../../components/ui/Img";

/*
 * Telas reais do sistema (§10.5, enxerto D2), em seção clara para dar ritmo à página azul. As três capturas reais
 * (splash e login do app, login do Web Master) lado a lado, alinhadas pela base e sem moldura extra (as capturas
 * já trazem o aparelho). Rodada de sobriedade: sem inclinação, brilho, cantoneiras nem parallax; entram com fade e
 * subida curta, 100 ms entre elas. `sizes` com folga para a densidade ≥ 1,5× (desktop) e 2× (celular).
 */
const TR = PLATAFORMA.telasReais;
const ROTULO = { index: "04", label: "Telas reais" } as const;
const H2 = "display-xl text-[clamp(2.25rem,4.4vw,4rem)] text-noite-950";

const FIGURAS: { id: ImagemId; classe: string; altura: string; sizes: string }[] = [
  { id: "app-splash", classe: "col-span-1 lg:col-span-3", altura: "h-[300px] sm:h-[400px] lg:h-[440px]", sizes: "(min-width: 1024px) 400px, 45vw" },
  { id: "app-webmaster-notebook", classe: "order-first col-span-2 lg:order-none lg:col-span-6", altura: "h-[260px] sm:h-[380px] lg:h-[440px]", sizes: "(min-width: 1024px) 900px, 90vw" },
  { id: "app-login-celular", classe: "col-span-1 lg:col-span-3", altura: "h-[300px] sm:h-[400px] lg:h-[440px]", sizes: "(min-width: 1024px) 400px, 45vw" },
];

export default function TelasReais() {
  return (
    <section id="telas-reais" data-section="APP-TELAS" aria-label={TR.titulo} className="tom-claro relative bg-papel-50 py-16 text-noite-950 lg:py-24">
      <Container>
        <SectionLabel index={ROTULO.index} label={ROTULO.label} tone="claro" />
        <SplitLines as="h2" lines={[TR.titulo]} text={TR.titulo} className={`${H2} mt-5`} />
        {/* as três capturas são uma figura só, com a legenda real (crédito: telas do sistema, dados ocultos) */}
        <figure className="m-0 mt-10 lg:mt-14">
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 lg:grid-cols-12 lg:items-end lg:gap-x-6">
            {FIGURAS.map((f, i) => (
              <Reveal key={f.id} y={16} delay={i * 0.1} className={f.classe}>
                <Img
                  id={f.id}
                  alt={IMAGENS[f.id].alt}
                  sizes={f.sizes}
                  className={`block w-full ${f.altura}`}
                  imgClassName="h-full w-full object-contain object-bottom drop-shadow-[0_24px_28px_rgba(5,10,18,0.22)]"
                />
              </Reveal>
            ))}
          </div>
          <figcaption className="corpo mt-8 text-grafite-600 lg:mt-10">
            <Reveal as="span" y={16} className="block">
              {TR.legenda}
            </Reveal>
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
