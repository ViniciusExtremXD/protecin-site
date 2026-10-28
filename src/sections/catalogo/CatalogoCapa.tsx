import type { CSSProperties } from "react";
import { CATALOGO, COMPANY, UI } from "../../data/site";
import { IMAGENS } from "../../data/imagens.gen";
import { Container } from "../../components/layout/Container";
import { PrimaryCta, WhatsAppCta } from "../../components/ui/cta";
import { Img } from "../../components/ui/Img";
import { Link } from "../../lib/router";
import { pushEvent } from "../../lib/track";
import { H1_PAGINA } from "../shared/historia/estilo";

/*
 * Abertura de /catalogo-digital/ (design-final §10.4, com qa/AJUSTES-SOBRIEDADE.md por cima). Texto à esquerda,
 * com o download do PDF e o WhatsApp do comercial; à direita a capa do catálogo, plana, em 300 px (a resolução do
 * arquivo é baixa: 554 px). Entradas em CSS (e-fade / e-sobe, sob html.motion-full).
 * Fora da rodada 1: livreto 3D com lombada, giro na entrada e na rolagem, tilt que seguia o ponteiro, brilho que
 * passava na capa, sombra vermelha e os 100svh de altura.
 */

const atraso = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default function CatalogoCapa() {
  const baixar = () => pushEvent("catalog_download", { location: "pagina_catalogo" });
  return (
    <section id="topo" data-section="catalogo-capa" className="grain relative bg-noite-950 text-papel-50">
      <Container className="grid grid-cols-1 items-center gap-12 pb-16 pt-28 md:pt-32 lg:grid-cols-12 lg:gap-6 lg:pb-24 lg:pt-40">
        <div className="lg:col-span-7">
          <p className="rotulo e-fade text-papel-500" data-motion="css" style={atraso(0)}>
            <Link to="/" className="inline-flex min-h-11 items-center text-papel-300 transition-colors duration-200 hover:text-papel-50">
              {UI.inicio.toUpperCase()}
            </Link>
            <span aria-hidden className="px-2 text-papel-50/30">
              /
            </span>
            <span>{CATALOGO.trilha}</span>
          </p>
          <h1 className={`${H1_PAGINA} e-sobe mt-3 text-papel-50 lg:mt-4`} data-motion="css" style={atraso(60)}>
            {CATALOGO.titulo}
          </h1>
          <p className="e-sobe mt-6 text-[20px] font-semibold leading-snug text-papel-50 lg:text-[22px]" data-motion="css" style={atraso(140)}>
            {CATALOGO.subtitulo}
          </p>
          <p className="e-sobe mt-3 max-w-[54ch] text-pretty text-[17px] leading-[1.6] text-papel-300 lg:text-[18px]" data-motion="css" style={atraso(200)}>
            {CATALOGO.texto}
          </p>
          <div className="e-sobe mt-8 flex flex-col gap-3 sm:flex-row lg:mt-10" data-motion="css" style={atraso(260)}>
            <PrimaryCta href={COMPANY.catalogoPdf} external icon="download" onClick={baixar}>
              {CATALOGO.cta}
            </PrimaryCta>
            <WhatsAppCta location="pagina_catalogo">{CATALOGO.ctaComercial}</WhatsAppCta>
          </div>
        </div>
        <div className="e-sobe flex justify-center lg:col-span-4 lg:col-start-9 lg:justify-end" data-motion="css" style={atraso(200)}>
          <div className="w-[200px] overflow-clip rounded-[6px] border border-papel-50/10 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.8)] sm:w-[240px] lg:w-[300px]">
            <Img id={CATALOGO.capa} alt={IMAGENS[CATALOGO.capa].alt} sizes="(min-width: 1024px) 300px, (min-width: 640px) 240px, 200px" eager imgClassName="block h-auto w-full" />
          </div>
        </div>
      </Container>
    </section>
  );
}
