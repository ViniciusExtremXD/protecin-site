import type { CSSProperties } from "react";
import { NOTFOUND } from "../../data/site";
import { Container } from "../../components/layout/Container";
import { GhostCta, WhatsAppCta } from "../../components/ui/cta";
import { Symbol } from "../../components/ui/Symbol";

/*
 * 404 (design-final §10.7, gravada em dist/404.html, noindex, com qa/AJUSTES-SOBRIEDADE.md por cima). Tudo acima da
 * dobra e em CSS, para valer antes da hidratação: o símbolo fecha as cantoneiras (16 px, 600 ms), o "404" e o
 * texto sobem; links para Início, Serviços e Contato e o WhatsApp.
 * Fora da rodada 1: odômetro girando o "404" em 168 px, cantoneiras abrindo 40 px e a luz vermelha de fundo.
 */

const FORA = 16; // px de tela que cada cantoneira anda até fechar
const CANTOS = { tl: [-1, -1], tr: [1, -1], bl: [-1, 1], br: [1, 1] } as const;

const CSS =
  Object.entries(CANTOS)
    .map(([p, [x, y]], i) => {
      const kf = `@keyframes nf-${p}{from{opacity:0;transform:translate3d(${x * FORA}px,${y * FORA}px,0)}}`;
      const regra = `html.motion-full .nf-simbolo [data-parte="${p}"]{animation:nf-${p} 600ms cubic-bezier(.16,1,.3,1) both;animation-delay:calc(var(--t0) + ${60 + i * 40}ms)}`;
      return kf + regra;
    })
    .join("") +
  '.nf-simbolo [data-parte="gota"]{transform-box:fill-box;transform-origin:50% 50%}@keyframes nf-gota{from{opacity:0;transform:scale(.6)}}' +
  'html.motion-full .nf-simbolo [data-parte="gota"]{animation:nf-gota 600ms cubic-bezier(.16,1,.3,1) both;animation-delay:calc(var(--t0) + 300ms)}';

const atraso = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default function NotFound() {
  return (
    <section id="topo" data-section="404" className="grain relative flex min-h-[80svh] items-center bg-noite-950 text-papel-50">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <Container className="flex flex-col items-center pb-20 pt-28 text-center lg:pt-36">
        <div data-motion="css">
          <Symbol size={56} tone="escuro" className="nf-simbolo" />
        </div>
        <p
          className="stretch-62 tnum e-sobe mt-8 text-[clamp(4.5rem,9vw,7rem)] font-[850] uppercase leading-[0.86] text-papel-50"
          data-motion="css"
          style={atraso(120)}
        >
          {NOTFOUND.numero}
        </p>
        <h1 className="stretch-66 e-sobe mt-4 text-balance text-[clamp(2rem,3.6vw,3rem)] font-[800] uppercase leading-[0.95] text-papel-50" data-motion="css" style={atraso(200)}>
          {NOTFOUND.h1}
        </h1>
        <p className="e-sobe mt-4 max-w-[40ch] text-[17px] leading-[1.6] text-papel-300 lg:text-[18px]" data-motion="css" style={atraso(260)}>
          {NOTFOUND.texto}
        </p>
        <div className="e-sobe mt-8 flex flex-wrap justify-center gap-3" data-motion="css" style={atraso(320)}>
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
