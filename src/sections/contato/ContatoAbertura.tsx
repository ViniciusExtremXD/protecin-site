import type { CSSProperties } from "react";
import { CONTATO, UI } from "../../data/site";
import { SplitLines } from "../../components/motion/SplitLines";
import { Container } from "../../components/layout/Container";
import { PARTES } from "../../components/ui/Symbol";
import { Link } from "../../lib/router";

/*
 * Abertura de /contato/ (design-final §10.6): trilha, sobretítulo, H1 e texto (§2.7), 60svh, sem fixação.
 * À direita, o símbolo gigante (40vw) só em traço noite-600 que se desenha (900 ms) e a gota que enche por
 * scale 0 → 1 (EASE_BACK). Tudo acima da dobra entra por CSS (anima só sob html.motion-full; sem JS fica parado).
 */

// O Symbol da base desenha e depois preenche; aqui o símbolo fica só em traço, então a versão é local e em CSS.
const CSS = `
.ca-traco{fill:none;stroke:#253447;stroke-width:.3;stroke-dasharray:1;stroke-dashoffset:0}
@media (max-width:767px){.ca-traco{stroke-width:.55}}
.ca-gota{fill:#E8442E;transform-box:fill-box;transform-origin:50% 50%}
@keyframes ca-traco{from{stroke-dashoffset:1}}
@keyframes ca-gota{from{transform:scale(0)}}
html.motion-full .ca-traco{animation:ca-traco 900ms cubic-bezier(.65,0,.35,1) both;animation-delay:calc(var(--t0) + var(--d,0ms))}
html.motion-full .ca-gota{animation:ca-gota 700ms cubic-bezier(.34,1.56,.64,1) both;animation-delay:calc(var(--t0) + 650ms)}
`;

function SimboloTraco({ className }: { className?: string }) {
  return (
    <svg viewBox="-2 -2 104 104" aria-hidden className={`block overflow-visible ${className ?? ""}`} data-motion="css">
      {PARTES.filter((p) => p.parte !== "gota").map((p, i) => (
        <path key={p.parte} d={p.d} pathLength={1} className="ca-traco" style={{ "--d": `${120 + i * 80}ms` } as CSSProperties} />
      ))}
      {PARTES.filter((p) => p.parte === "gota").map((p) => (
        <g key={p.parte}>
          <path d={p.d} pathLength={1} className="ca-traco" style={{ "--d": "440ms" } as CSSProperties} />
          <path d={p.d} className="ca-gota" />
        </g>
      ))}
    </svg>
  );
}

/** "Contate a Protecin" → ["Contate a", "Protecin"]: a última palavra ganha a linha dela. */
function emLinhas(texto: string): string[] {
  const p = texto.trim().split(/\s+/);
  return p.length < 2 ? p : [p.slice(0, -1).join(" "), p[p.length - 1]];
}

export default function ContatoAbertura() {
  const { trilha, sobretitulo, h1, texto } = CONTATO.pagina;
  return (
    <section id="topo" data-section="contato-abertura" className="grain relative isolate overflow-clip bg-noite-950 text-papel-50">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-luz-brasa opacity-25" />

      <div aria-hidden className="pointer-events-none absolute -right-[16vw] top-[76px] -z-10 w-[64vw] md:-right-[6vw] md:top-1/2 md:w-[min(40vw,72svh)] md:-translate-y-1/2 lg:right-[2vw]">
        <SimboloTraco className="h-auto w-full" />
      </div>

      <Container className="relative flex min-h-[60svh] flex-col justify-end pb-16 pt-[200px] md:pt-36 lg:pb-24 lg:pt-44">
        <div className="max-w-[760px] md:max-w-[58%] lg:max-w-[56%]">
          <p className="rotulo e-fade text-papel-500" data-motion="css" style={{ "--d": "0ms" } as CSSProperties}>
            <Link to="/" className="inline-flex min-h-11 items-center text-papel-300 transition-colors duration-200 hover:text-papel-50">
              {UI.inicio.toUpperCase()}
            </Link>
            <span aria-hidden className="px-2 text-papel-50/30">
              /
            </span>
            <span>{trilha}</span>
          </p>
          <p className="e-sobe mt-6 text-[17px] font-semibold text-brasa-300 lg:mt-8 lg:text-[19px]" data-motion="css" style={{ "--d": "60ms" } as CSSProperties}>
            {sobretitulo}
          </p>
          <SplitLines as="h1" css lines={emLinhas(h1)} text={h1} className="display-xl mt-3 text-papel-50 lg:mt-4" delay={0.12} />
          <p className="corpo-l e-sobe mt-7 max-w-[54ch] text-pretty text-papel-300 lg:mt-9" data-motion="css" style={{ "--d": "320ms" } as CSSProperties}>
            {texto}
          </p>
        </div>
      </Container>
    </section>
  );
}
