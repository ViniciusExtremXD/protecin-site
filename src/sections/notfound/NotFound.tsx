import type { CSSProperties } from "react";
import { NOTFOUND } from "../../data/site";
import { SplitLines } from "../../components/motion/SplitLines";
import { Container } from "../../components/layout/Container";
import { GhostCta, WhatsAppCta } from "../../components/ui/cta";
import { Symbol } from "../../components/ui/Symbol";

/*
 * 404 (design-final §10.7, gravada em dist/404.html, noindex). Tudo acima da dobra e em CSS, para valer antes da
 * hidratação: o símbolo com as cantoneiras abertas 40 px para fora fecha em 600 ms e a gota cresce (EASE_BACK);
 * o "404" é um odômetro em que cada dígito gira uma volta ao carregar, da direita para a esquerda.
 * (O Odometer da base não anima o que já está na tela ao montar, então o giro aqui é a mesma marcação .odo em CSS.)
 */

// 40 px de tela num símbolo de 96 px = 42 unidades do viewBox de 100
const FORA = 42;
const CANTOS = { tl: [-1, -1], tr: [1, -1], bl: [-1, 1], br: [1, 1] } as const;

function css(digitos: number[]): string {
  const cantos = Object.entries(CANTOS)
    .map(([p, [x, y]], i) => {
      const kf = `@keyframes nf-${p}{from{opacity:0;transform:translate3d(${x * FORA}px,${y * FORA}px,0)}}`;
      const regra = `html.motion-full .nf-simbolo [data-parte="${p}"]{animation:nf-${p} 600ms cubic-bezier(.16,1,.3,1) both;animation-delay:calc(var(--t0) + ${60 + i * 50}ms)}`;
      return kf + regra;
    })
    .join("");
  const gota =
    '.nf-simbolo [data-parte="gota"]{transform-box:fill-box;transform-origin:50% 50%}@keyframes nf-gota{from{transform:scale(0)}}' +
    'html.motion-full .nf-simbolo [data-parte="gota"]{animation:nf-gota 600ms cubic-bezier(.34,1.56,.64,1) both;animation-delay:calc(var(--t0) + 420ms)}';
  // cada dígito parte do mesmo dígito uma volta antes (-d·5%) e para em -(10+d)·5%, o valor do HTML
  const rolos = [...new Set(digitos)]
    .map(
      (d) =>
        `@keyframes nf-odo-${d}{from{transform:translate3d(0,-${d * 5}%,0)}}` +
        `html.motion-full .nf-rolo-${d}{animation:nf-odo-${d} 900ms cubic-bezier(.16,1,.3,1) both;animation-delay:calc(var(--t0) + var(--d,0ms))}`,
    )
    .join("");
  return cantos + gota + rolos;
}

const ROLO = Array.from({ length: 20 }, (_, i) => i % 10);

function Numero({ valor }: { valor: string }) {
  const chars = Array.from(valor);
  const total = chars.filter((c) => /\d/.test(c)).length;
  let k = 0;
  return (
    <p className="odo tnum display-xxl text-[26vw] text-papel-50 md:text-[clamp(3.25rem,min(10.5vw,17svh),10.5rem)]" data-motion="css">
      <span className="sr-only">{valor}</span>
      <span aria-hidden className="odo-vis">
        {chars.map((c, i) => {
          if (!/\d/.test(c)) return <span key={i} className="odo-a">{c}</span>;
          const d = Number(c);
          const j = k++;
          return (
            <span key={i} className="odo-col">
              <span
                className={`odo-rolo nf-rolo-${d}`}
                style={{ transform: `translate3d(0,-${(10 + d) * 5}%,0)`, "--d": `${300 + (total - 1 - j) * 40}ms` } as CSSProperties}
              >
                {ROLO.map((n, x) => (
                  <span key={x} className="odo-d">
                    {n}
                  </span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
    </p>
  );
}

export default function NotFound() {
  const digitos = Array.from(NOTFOUND.numero)
    .filter((c) => /\d/.test(c))
    .map(Number);
  const palavras = NOTFOUND.h1.split(" ");
  const h1 = palavras.length > 2 ? [palavras.slice(0, -1).join(" "), palavras[palavras.length - 1]] : palavras;

  return (
    <section id="topo" data-section="404" className="grain relative isolate flex min-h-[100svh] items-center overflow-clip bg-noite-950 text-papel-50">
      <style dangerouslySetInnerHTML={{ __html: css(digitos) }} />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-luz-brasa opacity-30" />

      <Container className="flex flex-col items-center pb-24 pt-28 text-center lg:pt-32">
        <div data-motion="css">
          <Symbol size={96} tone="escuro" className="nf-simbolo" />
        </div>
        <div className="mt-8 lg:mt-10">
          <Numero valor={NOTFOUND.numero} />
        </div>
        <SplitLines as="h1" css lines={h1} text={NOTFOUND.h1} className="display-xl mt-5 text-[clamp(2.25rem,4.6vw,4.25rem)] text-papel-50 lg:mt-6" delay={0.2} />
        <p className="corpo-l e-sobe mt-5 max-w-[40ch] text-papel-300 lg:mt-6" data-motion="css" style={{ "--d": "420ms" } as CSSProperties}>
          {NOTFOUND.texto}
        </p>
        <div className="e-sobe mt-10 flex flex-wrap justify-center gap-3" data-motion="css" style={{ "--d": "500ms" } as CSSProperties}>
          {NOTFOUND.links.map((l) => (
            <GhostCta key={l.to} to={l.to} size="sm">
              {l.label}
            </GhostCta>
          ))}
          <WhatsAppCta location="pagina_404" size="sm" />
        </div>
      </Container>
    </section>
  );
}
