import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cubicBezier, motion, useMotionValue, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";
import { Phone } from "lucide-react";
import { COMPANY, HERO, UI } from "../../data/site";
import { IMAGENS } from "../../data/imagens.gen";
import { DropWindow, EASE_IN_OUT, EASE_OUT, PinStage, ScrollLitText, comDestaque, useIsoLayoutEffect, usePin } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { OrcamentoCta, PhoneLink, WhatsAppCta } from "../../components/ui/cta";
import { LazyVideo } from "../../components/ui/LazyVideo";
import { PARTES } from "../../components/ui/Symbol";

/*
 * H0. Abertura e símbolo (design-final §9 H0, enxugada pela qa/AJUSTES-SOBRIEDADE.md).
 * Cena fixada: o vídeo de supressão em tela cheia encolhe até a gota do logo (DropWindow), as quatro cantoneiras
 * fecham o símbolo e o manifesto acende palavra por palavra. Sem selo giratório, sem brasas, sem indicador "Role"
 * e sem luz que segue o mouse.
 *
 * Um DOM só para os dois estados:
 *  - fixado (data-pin="on"): palco de 100svh com camadas absolutas; o símbolo nasce no centro e desliza até o encaixe;
 *  - estático (SSR, sem JS, tela baixa): hero de 100svh com o poster e, abaixo, o símbolo montado (gota com o poster
 *    dentro) e o manifesto aceso, em fluxo normal.
 * Altura total: 200vh no desktop (1 tela de rolagem presa) e 150vh no celular (0,5 tela). Teto da sobriedade §2:
 * 1,2 tela no desktop e 0,6 no celular.
 */

const curva = cubicBezier(EASE_OUT[0], EASE_OUT[1], EASE_OUT[2], EASE_OUT[3]);
const curvaGota = cubicBezier(EASE_IN_OUT[0], EASE_IN_OUT[1], EASE_IN_OUT[2], EASE_IN_OUT[3]); // a mesma do DropWindow
const ROTULO_VIDEO = `${UI.imagemIlustrativa}: ${IMAGENS["hero-poster"].alt}`;

// Entradas próprias do hero (só sob html.motion-full; sem JS aparecem paradas no estado final).
// A gota fica invisível até a posição estar medida (data-pronto): ver o comentário do encaixe.
const CSS = `
@keyframes ab-sobe12{from{opacity:0;transform:translate3d(0,12px,0)}}
@keyframes ab-cinquenta{from{color:#F3EFE9;transform:scale(.94)}}
.ab-cinquenta{display:inline-block;transform-origin:50% 60%}
html.motion-full .ab-sobe12{animation:ab-sobe12 var(--dur,500ms) cubic-bezier(.16,1,.3,1) both;animation-delay:calc(var(--t0) + var(--d,0ms))}
html.motion-full .ab-cinquenta{animation:ab-cinquenta 500ms cubic-bezier(.16,1,.3,1) both;animation-delay:calc(var(--t0) + 700ms)}
@media (min-height:561px){html.motion-full:not(.motion-failed) #topo .ab-encaixe:not([data-pronto]){visibility:hidden}}
`;

/** Atraso das entradas CSS (somado a --t0 em styles.css). */
const atraso = (ms: number, dur?: number) => ({ "--d": `${ms}ms`, ...(dur ? { "--dur": `${dur}ms` } : {}) }) as CSSProperties;

// Cada cantoneira é um SVG próprio (recorte do viewBox do símbolo), para vir de fora do símbolo em vw/vh.
const CANTOS = [
  { parte: "tl", pos: "left-0 top-0", vb: "0 0 44 44", dir: [-1, -1], rot: -6, cor: "#F3EFE9" },
  { parte: "tr", pos: "right-0 top-0", vb: "56 0 44 44", dir: [1, -1], rot: 6, cor: "#E8442E" },
  { parte: "bl", pos: "bottom-0 left-0", vb: "0 56 44 44", dir: [-1, 1], rot: 6, cor: "#F3EFE9" },
  { parte: "br", pos: "bottom-0 right-0", vb: "56 56 44 44", dir: [1, 1], rot: -6, cor: "#F3EFE9" },
] as const;

// Linha do tempo da cena (p de 0 a 1). Com 1 tela de rolagem presa no desktop, cada fase tem de 150 a 400 px.
const T = {
  texto: [0, 0.14], // rótulo, parágrafo e CTAs saem
  gota: [0.06, 0.5], // o vídeo em tela cheia encolhe até a gota
  veu: [0.1, 0.5],
  cantos: [0.36, 0.58], // as cantoneiras fecham o símbolo
  grupo: [0.54, 0.74], // o símbolo desliza do centro até o encaixe
  manifesto: [0.6, 0.72], // o manifesto aparece…
  acende: [0.62, 0.86], // …e acende palavra por palavra
  apoio: [0.8, 0.92],
} as const;

function Canto({ c, p }: { c: (typeof CANTOS)[number]; p: MotionValue<number> }) {
  const x = useTransform(p, [...T.cantos], [`${c.dir[0] * 30}vw`, "0vw"], { ease: curva });
  const y = useTransform(p, [...T.cantos], [`${c.dir[1] * 30}vh`, "0vh"], { ease: curva });
  const rotate = useTransform(p, [...T.cantos], [c.rot, 0], { ease: curva });
  const opacity = useTransform(p, [T.cantos[0], T.cantos[0] + 0.08], [0, 1]);
  const d = PARTES.find((x) => x.parte === c.parte)?.d;
  return (
    <motion.div data-pin-layer="" className={`absolute h-[44%] w-[44%] ${c.pos}`} style={{ x, y, rotate, opacity }}>
      <svg viewBox={c.vb} className="block h-full w-full overflow-visible" aria-hidden>
        <path d={d} fill={c.cor} />
      </svg>
    </motion.div>
  );
}

/** Linha do H1: entrada CSS (máscara) por dentro e saída ligada à rolagem por fora. */
function LinhaH1({ texto, i, p }: { texto: string; i: number; p: MotionValue<number> }) {
  const ini = 0.02 + 0.02 * i;
  const fim = 0.18 + 0.02 * i;
  const y = useTransform(p, [ini, fim], ["0vh", "-8vh"]);
  const opacity = useTransform(p, [ini, fim], [1, 0]);
  return (
    <motion.span data-pin-layer="" className="block" style={{ y, opacity }}>
      <span className="-mb-[0.08em] -mt-[0.2em] block overflow-clip pb-[0.08em] pt-[0.2em]">
        <span className="e-linha-i block origin-bottom-left" style={atraso(80 * (i + 1))}>
          {comDestaque(texto, HERO.h1.destaque, "ab-cinquenta text-brasa-400")}
        </span>
      </span>
    </motion.span>
  );
}

/** Vídeo só depois do load + ocioso (o poster é o LCP). */
function useOcioso(): boolean {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    let cancelado = false;
    let idle = 0;
    let timer = 0;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (n: number) => void };
    const agendar = () => {
      if (w.requestIdleCallback) idle = w.requestIdleCallback(() => !cancelado && setOk(true), { timeout: 2000 });
      else timer = window.setTimeout(() => !cancelado && setOk(true), 1200);
    };
    if (document.readyState === "complete") agendar();
    else window.addEventListener("load", agendar, { once: true });
    return () => {
      cancelado = true;
      window.removeEventListener("load", agendar);
      window.clearTimeout(timer);
      if (idle && w.cancelIdleCallback) w.cancelIdleCallback(idle);
    };
  }, []);
  return ok;
}

function Cena() {
  const { progress, active } = usePin();
  const zero = useMotionValue(0);
  const um = useMotionValue(1);
  // Estático: textos do hero no começo da cena (p = 0) e símbolo/manifesto no fim (p = 1).
  const pTexto = active ? progress : zero;
  const pFim = active ? progress : um;
  const ocioso = useOcioso();

  // ---- distância do encaixe do símbolo até o centro do palco (medida sem transform) e geometria da gota
  const palco = useRef<HTMLDivElement>(null);
  const encaixe = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<{ s0: number; d: number; lado: number } | null>(null);
  // Medida antes da pintura (efeito de layout): no 1º quadro da cena fixada a gota já sai centrada e cobrindo a
  // tela. Medida depois (useEffect), um quadro com a gota fora do centro chegava a pintar o poster recortado, e o
  // Chrome contava esse quadro como o LCP (atrasado até a hidratação). Até medir, a gota fica invisível (CSS).
  const [delta, setDelta] = useState<{ x: number; y: number } | null>(null);
  useIsoLayoutEffect(() => {
    const medir = () => {
      const a = palco.current?.getBoundingClientRect();
      const b = encaixe.current?.getBoundingClientRect();
      if (!a || !b) return;
      setDelta({ x: a.left + a.width / 2 - (b.left + b.width / 2), y: a.top + a.height / 2 - (b.top + b.height / 2) });
      // a gota é a metade do encaixe (inset 25%); S0 como no DropWindow
      const d = b.width / 2 || 1;
      setGeo({ s0: (Math.hypot(window.innerWidth, window.innerHeight) / d) * 1.04, d, lado: Math.min(window.innerWidth, window.innerHeight) });
    };
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, [active]);
  const pronto = active && delta !== null;

  // ---- textos do hero
  const tOp = useTransform(pTexto, [...T.texto], [1, 0]);
  const tY = useTransform(pTexto, [...T.texto], ["0vh", "-4vh"]);
  const [interativo, setInterativo] = useState(true);
  useMotionValueEvent(pTexto, "change", (v) => setInterativo(v < T.texto[1]));

  // ---- símbolo, véu e manifesto
  const grupoX = useTransform(pFim, [...T.grupo], [delta?.x ?? 0, 0], { ease: curva });
  const grupoY = useTransform(pFim, [...T.grupo], [delta?.y ?? 0, 0], { ease: curva });
  const midiaY = useTransform(pFim, [0, T.gota[1]], ["0%", "-3%"]);
  // Nitidez: o DropWindow mantém a mídia do tamanho da tela (escala inversa), e a gota final mostrava só um recorte
  // ampliado e borrado do vídeo. Aqui a mídia encolhe junto quando a gota fica menor que a tela, sempre cobrindo a
  // gota com folga, até o menor lado da mídia valer 1,75 × a gota: no fim aparece um terço do quadro, em escala < 1.
  const sGota = useTransform(pFim, [...T.gota], [geo?.s0 ?? 1, 1], { ease: curvaGota });
  const midiaEscala = useTransform(sGota, (sv) => {
    if (!geo) return 1;
    const cobre = (sv * geo.d * 1.08) / geo.lado; // menor escala que ainda cobre a gota visível
    return Math.min(1, Math.max((1.75 * geo.d) / geo.lado, cobre));
  });
  const veu = useTransform(pFim, [...T.veu], [1, 0.35]);
  const brilho = useTransform(pFim, [0.5, 0.85], [0, 0.7]);
  // o manifesto só aparece quando o símbolo já está saindo do centro (sem sobrepor a cantoneira)
  const manifOp = useTransform(pFim, [...T.manifesto], [0, 1]);
  const manifX = useTransform(pFim, [T.grupo[0] + 0.06, T.grupo[1]], ["2vw", "0vw"], { ease: curva });
  const apoioOp = useTransform(pFim, [...T.apoio], [0, 1]);
  const apoioY = useTransform(pFim, [...T.apoio], [16, 0]);

  const linhas = HERO.h1.linhas;

  return (
    <div
      ref={palco}
      className="relative h-[100svh] [--gota:min(26vw,12svh)] group-data-[pin=off]/pin:h-auto md:[--gota:min(20vw,12svh)] lg:[--gota:min(24vh,17vw)]"
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ------------------------------------------------ hero (começo da cena) */}
      <div className="absolute inset-0 z-[2] group-data-[pin=off]/pin:relative group-data-[pin=off]/pin:inset-auto group-data-[pin=off]/pin:min-h-[100svh] group-data-[pin=on]/pin:pointer-events-none">
        {/* poster/vídeo do estado estático (no fixado quem mostra o vídeo é a gota, que começa cobrindo a tela) */}
        <div className="absolute inset-0 flex items-center justify-center overflow-clip group-data-[pin=on]/pin:hidden">
          <div className="e-zoom h-[100svh] w-screen shrink-0">
            <LazyVideo id="hero" label={ROTULO_VIDEO} when="active" active={!active && ocioso} posterPriority className="h-full w-full" />
          </div>
          <div aria-hidden className="e-fade pointer-events-none absolute inset-0 bg-veu-hero" />
        </div>

        <Container className="relative pb-28 pt-[max(12svh,5.5rem)] md:pb-32 lg:pt-[max(7rem,16vh)]">
          <div className="lg:w-[calc((100%+24px)*8/12)]">
            <motion.div data-pin-layer="" style={{ opacity: tOp, y: tY }}>
              <p className="rotulo ab-sobe12 max-w-[34ch] text-papel-300 md:max-w-none" style={atraso(0)}>
                {HERO.rotulo}
              </p>
            </motion.div>

            <h1 aria-label={HERO.h1.texto} className="display-xxl mt-5 text-papel-50 lg:mt-6 lg:text-[clamp(3.25rem,min(8.4vw,13.5svh),9rem)]">
              <span aria-hidden className="hidden md:block">
                {linhas.desktop.map((l, i) => (
                  <LinhaH1 key={l} texto={l} i={i} p={pTexto} />
                ))}
              </span>
              <span aria-hidden className="md:hidden">
                {linhas.celular.map((l, i) => (
                  <LinhaH1 key={l} texto={l} i={i} p={pTexto} />
                ))}
              </span>
            </h1>

            <motion.div data-pin-layer="" style={{ opacity: tOp, y: tY }}>
              <p className="corpo-l e-sobe mt-6 max-w-[52ch] text-papel-300 lg:mt-8" style={atraso(300)}>
                {HERO.paragrafo}
              </p>
            </motion.div>

            <motion.div data-pin-layer="" className={interativo ? "pointer-events-auto" : ""} style={{ opacity: tOp, y: tY }}>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:mt-10">
                <div className="e-sobe w-full sm:w-auto" style={atraso(380, 500)}>
                  <OrcamentoCta formLocation="hero" full>
                    {HERO.cta1}
                  </OrcamentoCta>
                </div>
                <div className="e-sobe w-full sm:w-auto" style={atraso(440, 500)}>
                  <WhatsAppCta location="hero" full>
                    {HERO.cta2}
                  </WhatsAppCta>
                </div>
                <p className="rotulo e-fade mt-2 text-papel-500 md:hidden" style={atraso(600, 400)}>
                  {UI.imagemIlustrativa}
                </p>
                <div className="e-sobe hidden lg:ml-3 lg:block" style={atraso(500, 500)}>
                  <PhoneLink location="hero" className="group inline-flex min-h-11 items-center gap-2.5 text-[15px] font-semibold text-papel-300 transition-colors duration-200 hover:text-papel-50">
                    <Phone aria-hidden size={16} strokeWidth={1.75} />
                    <span className="relative tnum">
                      {COMPANY.phoneDisplay}
                      <span aria-hidden className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-200 group-hover:scale-x-100" />
                    </span>
                  </PhoneLink>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>

        {/* crédito do vídeo (desktop e tablet; no celular ele fica sob os CTAs) */}
        <motion.div data-pin-layer="" className="pointer-events-none absolute inset-x-0 bottom-0 hidden md:block" style={{ opacity: tOp }}>
          <Container className="flex justify-end pb-6 lg:pb-8">
            <p className="rotulo e-fade text-papel-500" style={atraso(600, 400)}>
              {UI.imagemIlustrativa}
            </p>
          </Container>
        </motion.div>
      </div>

      {/* ------------------------------------------------ símbolo + manifesto (fim da cena; em fluxo, depois do hero, no estático) */}
      <div className="pointer-events-none absolute inset-0 z-[1] group-data-[pin=off]/pin:pointer-events-auto group-data-[pin=off]/pin:relative group-data-[pin=off]/pin:inset-auto">
        <motion.div aria-hidden data-pin-layer="" className="absolute inset-x-0 bottom-0 h-2/3 bg-luz-brasa group-data-[pin=off]/pin:opacity-40" style={{ opacity: brilho }} />
        <Container className="relative grid h-full grid-cols-1 content-center gap-y-8 pb-[4svh] pt-[8svh] group-data-[pin=off]/pin:py-20 lg:grid-cols-12 lg:gap-x-6 lg:py-0 lg:group-data-[pin=off]/pin:py-28">
          <div className="flex justify-center lg:col-span-6 lg:self-center">
            {/* Com movimento completo, a cena fixa logo depois da hidratação e a gota salta do fluxo (abaixo do hero)
                para cobrir a tela: com ela visível no estado estático, isso contava como deslocamento de layout
                (CLS 1,0 no celular). Até a cena ligar e a posição dela estar medida (data-pronto) ela fica invisível
                (só com motion-full e tela alta; sem JS, em tela baixa e com o motor caído ela aparece). */}
            <div ref={encaixe} data-pronto={pronto ? "" : undefined} className="ab-encaixe relative aspect-square w-[calc(var(--gota)*2)]">
              <motion.div data-pin-layer="" className="pointer-events-auto absolute inset-0" style={{ x: grupoX, y: grupoY }}>
                <div className="absolute inset-[25%] group-data-[pin=off]/pin:[&_button]:hidden">
                  <DropWindow progress={pFim} range={[...T.gota]} mode="fechar" className="[--gota:100%]">
                    <motion.div className="h-full w-full" style={{ y: midiaY, scale: midiaEscala }}>
                      <div className="e-zoom h-full w-full">
                        <LazyVideo id="hero" label={ROTULO_VIDEO} when="active" active={active && ocioso} posterPriority className="h-full w-full" />
                      </div>
                    </motion.div>
                    <motion.div aria-hidden className="e-fade absolute inset-0 bg-veu-hero" style={{ opacity: veu }} />
                  </DropWindow>
                </div>
                {CANTOS.map((c) => (
                  <Canto key={c.parte} c={c} p={pFim} />
                ))}
              </motion.div>
            </div>
          </div>

          <motion.div
            data-pin-layer=""
            className="mx-auto w-full max-w-[32rem] lg:col-span-6 lg:col-start-7 lg:mx-0 lg:max-w-[36rem] lg:self-center"
            style={{ opacity: manifOp, x: manifX }}
          >
            <ScrollLitText
              as="h2"
              text={HERO.manifesto}
              progress={pFim}
              range={[...T.acende]}
              className="stretch-75 text-balance text-[clamp(1.875rem,3.4vw,3.25rem)] font-bold leading-[1.06] tracking-[-0.01em] text-papel-50"
            />
            <motion.div data-pin-layer="" style={{ opacity: apoioOp, y: apoioY }}>
              <p className="corpo mt-5 text-papel-300 lg:mt-7">{HERO.apoio}</p>
            </motion.div>
          </motion.div>
        </Container>
      </div>
    </div>
  );
}

/** H0 da home (`#topo`). Sem props. */
export default function Abertura() {
  return (
    <PinStage id="topo" mode="sempre" heightClassName="h-[150vh] lg:h-[200vh]" className="group/pin grain bg-noite-950">
      <Cena />
    </PinStage>
  );
}
