import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { CREDITOS, CREDITOS_PAGINA, ROUTES, UI } from "../../data/site";
import { Reveal, RevealGroup, RevealItem } from "../../components/motion/Reveal";
import { Container } from "../../components/layout/Container";
import { Link } from "../../lib/router";
import { H1_PAGINA, H3 } from "../shared/historia/estilo";

/*
 * /creditos/ (design-final §10.7, noindex, com qa/AJUSTES-SOBRIEDADE.md por cima): os vídeos de banco com fonte,
 * autor, link e licença, e as fotos ilustrativas herdadas do site atual com a nota de licença a confirmar.
 * H1 e intro entram por CSS (acima da dobra); as linhas das listas sobem em cascata curta.
 * Fora da rodada 1: H1 em máscara com giro, títulos dos grupos em mono vermelho e réguas que se desenhavam.
 */

const atraso = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default function Creditos() {
  const videos = CREDITOS.filter((c) => c.tipo === "video");
  const fotos = CREDITOS.filter((c) => c.tipo === "foto");

  return (
    <section id="topo" data-section="creditos" className="grain relative bg-noite-950 text-papel-50">
      <Container className="pb-16 pt-28 md:pt-32 lg:pb-28 lg:pt-40">
        <p className="rotulo e-fade text-papel-500" data-motion="css" style={atraso(0)}>
          <Link to="/" className="inline-flex min-h-11 items-center text-papel-300 transition-colors duration-200 hover:text-papel-50">
            {UI.inicio.toUpperCase()}
          </Link>
          <span aria-hidden className="px-2 text-papel-50/30">
            /
          </span>
          <span>{(ROUTES.find((r) => r.page === "creditos")?.label ?? "").toUpperCase()}</span>
        </p>
        <h1 className={`${H1_PAGINA} e-sobe mt-3 max-w-[16ch] text-papel-50 lg:mt-4`} data-motion="css" style={atraso(60)}>
          {CREDITOS_PAGINA.h1}
        </h1>
        <p className="e-sobe mt-5 max-w-[52ch] text-[17px] leading-[1.6] text-papel-300 lg:mt-6 lg:text-[18px]" data-motion="css" style={atraso(160)}>
          {CREDITOS_PAGINA.intro}
        </p>

        {/* vídeos */}
        <div className="mt-14 grid grid-cols-1 gap-y-5 lg:mt-20 lg:grid-cols-12 lg:gap-x-6">
          <Reveal y={16} className="lg:col-span-3">
            <h2 className={`${H3} text-papel-50`}>{CREDITOS_PAGINA.videos}</h2>
          </Reveal>
          <RevealGroup as="ul" y={16} stagger={0.04} className="border-b border-noite-700 lg:col-span-9">
            {videos.map((c) => (
              <RevealItem as="li" key={c.url ?? c.titulo} className="border-t border-noite-700">
                <div className="grid grid-cols-1 gap-x-6 gap-y-1 py-4 md:grid-cols-12 md:items-center lg:py-5">
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
                        className="group inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-papel-50"
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
          </RevealGroup>
        </div>

        {/* fotos */}
        <div className="mt-14 grid grid-cols-1 gap-y-5 lg:mt-20 lg:grid-cols-12 lg:gap-x-6">
          <Reveal y={16} className="lg:col-span-3">
            <h2 className={`${H3} text-papel-50`}>{CREDITOS_PAGINA.fotos}</h2>
            <p className="mt-3 max-w-[34ch] text-[15px] leading-relaxed text-papel-300">{CREDITOS_PAGINA.notaFotos}</p>
          </Reveal>
          <RevealGroup as="ul" y={16} stagger={0.03} className="grid grid-cols-1 gap-x-6 md:grid-cols-2 lg:col-span-9">
            {fotos.map((c) => (
              <RevealItem as="li" key={c.titulo} className="border-t border-noite-700">
                <p className="py-3.5 text-[16px] leading-snug text-papel-50">{c.titulo}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Container>
    </section>
  );
}
