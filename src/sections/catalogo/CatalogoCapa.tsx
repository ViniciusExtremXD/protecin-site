import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CATALOGO, COMPANY, UI } from "../../data/site";
import { IMAGENS } from "../../data/imagens.gen";
import { SplitLines } from "../../components/motion/SplitLines";
import { TiltCard } from "../../components/motion/TiltCard";
import { Container } from "../../components/layout/Container";
import { PrimaryCta, WhatsAppCta } from "../../components/ui/cta";
import { Img } from "../../components/ui/Img";
import { motionPrefAtual } from "../../lib/motion-pref";
import { Link } from "../../lib/router";
import { pushEvent } from "../../lib/track";

/*
 * Abertura de /catalogo-digital/ (design-final §10.4). Sem gota. Texto à esquerda com entrada CSS; à direita a capa
 * do catálogo (360 px, a resolução é baixa) como um livreto 3D: entra por CSS com rotateY -35° → -12° e y 60 → 0,
 * um brilho passa uma vez, depois de hidratar segue o ponteiro (TiltCard ±8°) e na rolagem endireita (-12° → 0) e
 * cresce (1 → 1,06). Celular: capa acima do texto, 240 px.
 */

const CSS = `
.cat-capa{transform:rotateY(-12deg);transform-style:preserve-3d}
.cat-lombada{position:absolute;top:0;right:0;height:100%;width:14px;background:#071A2B;transform-origin:100% 50%;transform:rotateY(-90deg)}
.cat-lombada::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(243,239,233,.10),rgba(243,239,233,0) 60%)}
.cat-brilho{position:absolute;inset:0;pointer-events:none;background:linear-gradient(105deg,transparent 30%,rgba(243,239,233,.38) 50%,transparent 70%);transform:translate3d(120%,0,0)}
@keyframes cat-capa{from{opacity:0;transform:translate3d(0,60px,0) rotateY(-35deg)}}
@keyframes cat-brilho{from{transform:translate3d(-120%,0,0)}to{transform:translate3d(120%,0,0)}}
html.motion-full .cat-capa{animation:cat-capa 900ms cubic-bezier(.16,1,.3,1) both;animation-delay:calc(var(--t0) + 120ms)}
html.motion-full .cat-brilho{animation:cat-brilho 900ms cubic-bezier(.65,0,.35,1) both;animation-delay:calc(var(--t0) + 520ms)}
`;

const atraso = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

function Capa() {
  const ref = useRef<HTMLDivElement>(null);
  const [ativo, setAtivo] = useState(false);
  useEffect(() => setAtivo(motionPrefAtual() === "full"), []);
  // a capa está acima da dobra: o progresso vai de 0 (topo da página) a 1 (capa saindo por cima)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 30%", "end start"] });
  const girar = useTransform(scrollYProgress, [0, 1], [0, 12]);
  const escala = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const sombra = useTransform(scrollYProgress, [0, 1], [0.7, 0.25]);

  return (
    <div ref={ref} className="relative w-[240px] [perspective:1400px] lg:w-[360px]">
      <span
        aria-hidden
        className="e-fade pointer-events-none absolute inset-x-[4%] -bottom-12 h-20 blur-[36px]"
        data-motion="css"
        style={{ "--d": "300ms", "--dur": "900ms" } as CSSProperties}
      >
        <motion.span className="absolute inset-0 rounded-[50%] bg-brasa-600" style={{ opacity: ativo ? sombra : 0.7 }} />
      </span>
      <motion.div className="[transform-style:preserve-3d]" style={ativo ? { rotateY: girar, scale: escala } : undefined} data-motion="capa">
        <TiltCard max={8} perspective={1400} glare className="rounded-[8px]">
          <div className="cat-capa relative" data-motion="css">
            <span aria-hidden className="cat-lombada" />
            <div className="relative overflow-clip rounded-[3px_8px_8px_3px] shadow-[0_30px_60px_-24px_rgba(0,0,0,0.85),inset_0_0_0_1px_rgba(243,239,233,0.06)]">
              <Img id={CATALOGO.capa} alt={IMAGENS[CATALOGO.capa].alt} sizes="(min-width: 1024px) 360px, 240px" eager imgClassName="block h-auto w-full" />
              <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-[10px] bg-gradient-to-r from-noite-950/35 to-transparent" />
              <span aria-hidden className="cat-brilho" />
            </div>
          </div>
        </TiltCard>
      </motion.div>
    </div>
  );
}

/** "Catálogo Digital Protecin" → uma palavra por linha (o título é curto e a coluna é estreita). */
const linhas = (t: string) => t.trim().split(/\s+/);

export default function CatalogoCapa() {
  const baixar = () => pushEvent("catalog_download", { location: "pagina_catalogo" });
  return (
    <section id="topo" data-section="catalogo-capa" className="grain relative isolate overflow-clip bg-noite-950 text-papel-50">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-luz-brasa opacity-30" />

      <Container className="relative grid min-h-[100svh] grid-cols-1 content-center items-center gap-12 pb-20 pt-24 md:pt-32 lg:grid-cols-12 lg:gap-6 lg:pb-24">
        <div className="order-2 lg:order-1 lg:col-span-6">
          <p className="rotulo e-fade text-papel-500" data-motion="css" style={atraso(0)}>
            <Link to="/" className="inline-flex min-h-11 items-center text-papel-300 transition-colors duration-200 hover:text-papel-50">
              {UI.inicio.toUpperCase()}
            </Link>
            <span aria-hidden className="px-2 text-papel-50/30">
              /
            </span>
            <span>{CATALOGO.trilha}</span>
          </p>
          <SplitLines as="h1" css lines={linhas(CATALOGO.titulo)} text={CATALOGO.titulo} className="display-xl mt-4 text-papel-50 lg:mt-5" delay={0.08} />
          <p className="e-sobe mt-7 text-[22px] font-semibold leading-tight text-papel-50 [font-stretch:75%] lg:mt-9 lg:text-[28px]" data-motion="css" style={atraso(280)}>
            {CATALOGO.subtitulo}
          </p>
          <p className="corpo-l e-sobe mt-4 max-w-[52ch] text-pretty text-papel-300" data-motion="css" style={atraso(340)}>
            {CATALOGO.texto}
          </p>
          <div className="e-sobe mt-8 flex flex-col gap-3 sm:flex-row lg:mt-10" data-motion="css" style={atraso(420)}>
            <PrimaryCta href={COMPANY.catalogoPdf} external icon="download" onClick={baixar}>
              {CATALOGO.cta}
            </PrimaryCta>
            <WhatsAppCta location="pagina_catalogo">{CATALOGO.ctaComercial}</WhatsAppCta>
          </div>
        </div>
        <div className="order-1 flex justify-center pt-4 lg:order-2 lg:col-span-4 lg:col-start-8 lg:pt-0">
          <Capa />
        </div>
      </Container>
    </section>
  );
}
