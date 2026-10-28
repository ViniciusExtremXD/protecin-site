import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { COMPANY, CONTATO } from "../../data/site";
import { ClipReveal } from "../../components/motion/ClipReveal";
import { Reveal } from "../../components/motion/Reveal";
import { TextRoll } from "../../components/motion/TextRoll";
import { Container } from "../../components/layout/Container";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { Symbol } from "../../components/ui/Symbol";
import { pushEvent } from "../../lib/track";
import { PalavrasReveladas } from "../shared/orcamento/revelar";

/*
 * Mapa de /contato/ (design-final §10.6). Nenhuma requisição de terceiro na carga: a fachada (noite-800, raio 28,
 * o símbolo como pino com carimbo) só troca pelo iframe do Google Maps quando o visitante clica em "Carregar mapa"
 * (pushEvent "map_load"). "Como chegar" abre as rotas em outra aba (map_directions_click).
 */

const GRADE: CSSProperties = {
  backgroundImage:
    "linear-gradient(rgba(37,52,71,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(37,52,71,.7) 1px, transparent 1px), linear-gradient(rgba(37,52,71,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(37,52,71,.35) 1px, transparent 1px)",
  backgroundSize: "120px 120px, 120px 120px, 24px 24px, 24px 24px",
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
    <section id="mapa" data-section="contato-mapa" className="relative bg-noite-950 py-24 text-papel-50 lg:py-36">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <SectionLabel index="02" label={CONTATO.canais.endereco} />
            <PalavrasReveladas text={e.rua} className="display-l mt-5 block text-papel-50 lg:mt-6" />
            <Reveal delay={0.1}>
              <p className="corpo-l mt-4 text-papel-300">{complemento}</p>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <a
              href={COMPANY.mapsDirections}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => pushEvent("map_directions_click")}
              className="group relative inline-flex h-12 items-center gap-3 overflow-hidden rounded-full border border-papel-50/30 px-6 text-botao text-papel-50 transition-[transform,border-color] duration-[350ms] ease-out hover:border-papel-50/90 active:scale-[0.96] lg:h-[52px]"
            >
              <span aria-hidden className="cta-varredura absolute inset-0 origin-left scale-x-0 bg-papel-50/[0.06] transition-transform duration-[350ms] ease-out group-hover:scale-x-100" />
              <TextRoll text={CONTATO.comoChegar} className="relative" />
              <ArrowUpRight aria-hidden size={18} strokeWidth={1.75} className="relative transition-transform duration-[350ms] ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </Reveal>
        </div>

        <Reveal className="mt-10 lg:mt-14">
          <div className="relative h-[440px] overflow-clip rounded-r-lg border border-noite-700 bg-noite-800 md:h-[460px] lg:h-[540px]">
            {carregado ? (
              <ClipReveal from="left" radius={28} scaleFrom={1} className="absolute inset-0">
                <iframe
                  ref={iframe}
                  src={COMPANY.mapsEmbed}
                  title={CONTATO.mapa.titulo}
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="block h-full w-full border-0"
                />
              </ClipReveal>
            ) : (
              <div className="absolute inset-0">
                <div aria-hidden className="absolute inset-0" style={GRADE} />
                <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_40%,rgba(15,26,40,0)_0%,rgba(15,26,40,0.5)_60%,#0F1A28_100%)]" />

                {/* pino: o símbolo carimbado no ponto da sede, com anel que pulsa 3 vezes */}
                <div className="absolute left-1/2 top-[34%] -translate-x-1/2 -translate-y-1/2 lg:top-[36%]">
                  <span aria-hidden className="anel-3 absolute -inset-5 rounded-full border border-brasa-400/60" />
                  <Reveal preset="carimbo" className="relative">
                    <Symbol size={64} tone="escuro" />
                  </Reveal>
                  <span aria-hidden className="absolute -bottom-6 left-1/2 h-2 w-16 -translate-x-1/2 rounded-[50%] bg-noite-950/80 blur-[3px]" />
                  <div className="absolute left-1/2 top-full mt-10 -translate-x-1/2 whitespace-nowrap">
                    <Reveal delay={0.2}>
                      <p className="rotulo rounded-full border border-noite-600 bg-noite-950/80 px-3 py-1.5 text-papel-300">
                        {e.rua}
                        <span className="hidden md:inline">
                          {" · "}
                          {e.cidade} - {e.uf}
                        </span>
                      </p>
                    </Reveal>
                  </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 flex justify-center p-8 md:p-10 lg:bottom-[8%]">
                  <Reveal delay={0.25}>
                    <button
                      type="button"
                      onClick={carregar}
                      className="group relative inline-flex h-12 items-center gap-3 overflow-hidden rounded-full bg-brasa-500 px-6 text-botao text-white shadow-[0_18px_40px_-18px_rgba(190,30,41,0.8)] transition-transform duration-[350ms] ease-out active:scale-[0.96] lg:h-[52px]"
                    >
                      <span aria-hidden className="cta-varredura absolute inset-0 origin-left scale-x-0 bg-brasa-600 transition-transform duration-[350ms] ease-out group-hover:scale-x-100" />
                      <MapPin aria-hidden size={18} strokeWidth={1.75} className="relative" />
                      <TextRoll text={CONTATO.mapa.carregar} className="relative" />
                    </button>
                  </Reveal>
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
