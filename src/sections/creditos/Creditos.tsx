import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { CREDITOS, CREDITOS_PAGINA, ROUTES, UI } from "../../data/site";
import { Reveal, RevealGroup, RevealItem } from "../../components/motion/Reveal";
import { Rule } from "../../components/motion/Rule";
import { SplitLines } from "../../components/motion/SplitLines";
import { Container } from "../../components/layout/Container";
import { Link } from "../../lib/router";

/*
 * /creditos/ (design-final §10.7, noindex): os vídeos de banco com fonte, autor, link e licença, e as fotos
 * ilustrativas herdadas do site atual com a nota de licença a confirmar. H1 com "linha" (CSS, acima da dobra);
 * as linhas da lista entram com Rule + sobe, stagger 40 ms.
 */

const H1 = {
  desktop: ["Créditos de imagens", "e vídeos"],
  celular: ["Créditos", "de imagens", "e vídeos"],
};

export default function Creditos() {
  const videos = CREDITOS.filter((c) => c.tipo === "video");
  const fotos = CREDITOS.filter((c) => c.tipo === "foto");

  return (
    <section id="topo" data-section="creditos" className="grain relative isolate bg-noite-950 text-papel-50">
      <Container className="pb-24 pt-28 md:pt-36 lg:pb-36 lg:pt-44">
        <p className="rotulo e-fade text-papel-500" data-motion="css" style={{ "--d": "0ms" } as CSSProperties}>
          <Link to="/" className="inline-flex min-h-11 items-center text-papel-300 transition-colors duration-200 hover:text-papel-50">
            {UI.inicio.toUpperCase()}
          </Link>
          <span aria-hidden className="px-2 text-papel-50/30">
            /
          </span>
          <span>{(ROUTES.find((r) => r.page === "creditos")?.label ?? "").toUpperCase()}</span>
        </p>
        <SplitLines as="h1" css lines={H1} text={CREDITOS_PAGINA.h1} className="display-xl mt-4 text-papel-50 lg:mt-5" delay={0.08} />
        <p className="corpo-l e-sobe mt-6 max-w-[52ch] text-papel-300 lg:mt-8" data-motion="css" style={{ "--d": "280ms" } as CSSProperties}>
          {CREDITOS_PAGINA.intro}
        </p>

        {/* vídeos */}
        <div className="mt-16 grid grid-cols-1 gap-y-6 lg:mt-24 lg:grid-cols-12 lg:gap-x-6">
          <Reveal y={12} className="lg:col-span-3">
            <h2 className="rotulo text-brasa-300">{CREDITOS_PAGINA.videos}</h2>
          </Reveal>
          <RevealGroup as="ul" stagger={0.04} className="lg:col-span-9">
            {videos.map((c) => (
              <RevealItem as="li" key={c.url ?? c.titulo}>
                <Rule />
                <div className="grid grid-cols-1 gap-x-6 gap-y-1.5 py-5 md:grid-cols-12 md:items-baseline lg:py-6">
                  <p className="text-[17px] font-medium leading-snug text-papel-50 md:col-span-6">{c.titulo}</p>
                  <p className="text-[15px] leading-snug text-papel-300 md:col-span-3">
                    {c.autor}
                    <span className="block text-papel-500">{c.licenca}</span>
                  </p>
                  <p className="md:col-span-3 md:text-right">
                    {c.url ? (
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-papel-50 md:min-h-0"
                      >
                        <span className="relative">
                          {c.fonte}
                          <span aria-hidden className="absolute -bottom-0.5 left-0 h-px w-full bg-current opacity-40 transition-opacity duration-200 group-hover:opacity-100" />
                        </span>
                        <ArrowUpRight aria-hidden size={16} strokeWidth={1.75} className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </a>
                    ) : (
                      <span className="text-[15px] text-papel-300">{c.fonte}</span>
                    )}
                  </p>
                </div>
              </RevealItem>
            ))}
            <li aria-hidden>
              <Rule />
            </li>
          </RevealGroup>
        </div>

        {/* fotos */}
        <div className="mt-16 grid grid-cols-1 gap-y-6 lg:mt-24 lg:grid-cols-12 lg:gap-x-6">
          <Reveal y={12} className="lg:col-span-3">
            <h2 className="rotulo text-brasa-300">{CREDITOS_PAGINA.fotos}</h2>
            <p className="mt-4 max-w-[34ch] text-[15px] leading-relaxed text-papel-300">{CREDITOS_PAGINA.notaFotos}</p>
          </Reveal>
          <RevealGroup as="ul" stagger={0.04} className="grid grid-cols-1 gap-x-6 md:grid-cols-2 lg:col-span-9">
            {fotos.map((c) => (
              <RevealItem as="li" key={c.titulo}>
                <Rule />
                <p className="py-4 text-[16px] leading-snug text-papel-50">{c.titulo}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Container>
    </section>
  );
}
