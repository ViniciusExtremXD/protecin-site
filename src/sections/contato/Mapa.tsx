import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { COMPANY, CONTATO } from "../../data/site";
import { Reveal } from "../../components/motion/Reveal";
import { TextRoll } from "../../components/motion/TextRoll";
import { Container } from "../../components/layout/Container";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { Symbol } from "../../components/ui/Symbol";
import { pushEvent } from "../../lib/track";
import { H2 } from "../shared/historia/estilo";

/*
 * Mapa de /contato/ (design-final §10.6, com qa/AJUSTES-SOBRIEDADE.md por cima). Nenhuma requisição de terceiro na
 * carga: a fachada (quadriculado discreto, o símbolo como pino e o endereço) só troca pelo iframe do Google Maps
 * quando o visitante clica em "Carregar mapa" (pushEvent "map_load"). "Como chegar" abre as rotas em outra aba
 * (map_directions_click).
 * Fora da rodada 1: anel pulsando, carimbo do pino, cortina do iframe e a sombra vermelha do botão.
 */

const GRADE: CSSProperties = {
  backgroundImage: "linear-gradient(rgba(37,52,71,.55) 1px, transparent 1px), linear-gradient(90deg, rgba(37,52,71,.55) 1px, transparent 1px)",
  backgroundSize: "96px 96px",
  backgroundPosition: "center",
};

export default function Mapa() {
  const [carregado, setCarregado] = useState(false);
  const iframe = useRef<HTMLIFrameElement>(null);
  const e = COMPANY.endereco;
  const complemento = `${e.bairro}, CEP ${e.cep}, ${e.cidade} - ${e.uf}`;

  useEffect(() => {
    if (carregado) iframe.current?.focus({ preventScroll: true });
  }, [carregado]);

  const carregar = () => {
    setCarregado(true);
    pushEvent("map_load");
  };

  return (
    <section id="mapa" data-section="contato-mapa" className="relative bg-noite-950 py-16 text-papel-50 md:py-24 lg:py-28">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <SectionLabel index="02" label={CONTATO.canais.endereco} />
            <Reveal y={20} delay={0.06}>
              <h2 className={`${H2} mt-4 text-papel-50 lg:mt-5`}>{e.rua}</h2>
              <p className="mt-3 text-[17px] leading-snug text-papel-300 lg:text-[18px]">{complemento}</p>
            </Reveal>
          </div>
          <Reveal y={20} delay={0.12}>
            <a
              href={COMPANY.mapsDirections}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => pushEvent("map_directions_click")}
              className="group relative inline-flex h-12 items-center gap-3 overflow-hidden rounded-full border border-papel-50/30 px-6 text-botao text-papel-50 transition-[transform,border-color] duration-[350ms] ease-out hover:border-papel-50/90 active:scale-[0.96]"
            >
              <span aria-hidden className="cta-varredura absolute inset-0 origin-left scale-x-0 bg-papel-50/[0.06] transition-transform duration-[350ms] ease-out group-hover:scale-x-100" />
              <TextRoll text={CONTATO.comoChegar} className="relative" />
              <ArrowUpRight aria-hidden size={18} strokeWidth={1.75} className="relative transition-transform duration-[350ms] ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </Reveal>
        </div>

        <Reveal y={20} className="mt-8 lg:mt-12">
          <div className="relative h-[360px] overflow-clip rounded-2xl border border-noite-700 bg-noite-900 md:h-[400px] lg:h-[440px]">
            {carregado ? (
              <iframe
                ref={iframe}
                src={COMPANY.mapsEmbed}
                title={CONTATO.mapa.titulo}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                className="absolute inset-0 block h-full w-full border-0"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center">
                <div aria-hidden className="absolute inset-0 opacity-70" style={GRADE} />
                <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_45%,rgba(9,17,28,0)_0%,rgba(9,17,28,0.6)_65%,#09111C_100%)]" />
                <div className="relative flex flex-col items-center gap-4">
                  <Symbol size={48} tone="escuro" />
                  <p className="rounded-full border border-noite-600 bg-noite-950/80 px-4 py-2 text-[15px] font-medium text-papel-300">
                    {e.rua}
                    <span className="hidden md:inline">
                      {" · "}
                      {e.cidade} - {e.uf}
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={carregar}
                  className="group relative inline-flex h-12 items-center gap-3 overflow-hidden rounded-full bg-brasa-500 px-6 text-botao text-white transition-transform duration-[350ms] ease-out active:scale-[0.96]"
                >
                  <span aria-hidden className="cta-varredura absolute inset-0 origin-left scale-x-0 bg-brasa-600 transition-transform duration-[350ms] ease-out group-hover:scale-x-100" />
                  <MapPin aria-hidden size={18} strokeWidth={1.75} className="relative" />
                  <TextRoll text={CONTATO.mapa.carregar} className="relative" />
                </button>
              </div>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
