import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cubicBezier, motion, useMotionValue, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Phone } from "lucide-react";
import { COMPANY, HERO, UI } from "../../data/site";
import { IMAGENS } from "../../data/imagens.gen";
import { DropWindow, EASE_OUT, Embers, PinStage, ScrollLitText, comDestaque, useIsoLayoutEffect, usePin } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { OrcamentoCta, PhoneLink, WhatsAppCta } from "../../components/ui/cta";
import { LazyVideo } from "../../components/ui/LazyVideo";
import { PARTES, Symbol } from "../../components/ui/Symbol";

/*
 * H0. Abertura e símbolo (design-final §9 H0 + qa/AJUSTES-DESIGN.md).
 * Cena fixada: o vídeo de supressão em tela cheia encolhe até a gota do logo (DropWindow), as quatro cantoneiras
 * fecham o símbolo e o manifesto acende palavra por palavra. Brasas só de leve no fim. Sem luz que segue o mouse.
 *
 * Um DOM só para os dois estados:
 *  - fixado (data-pin="on"): palco de 100svh com camadas absolutas; o símbolo nasce no centro e desliza até o encaixe;
 *  - estático (SSR, sem JS, reduzido, tela baixa): hero de 100svh com o poster e, abaixo, o símbolo montado (gota com
 *    o poster dentro) e o manifesto aceso, em fluxo normal.
 * Desktop 250vh e celular 150vh de altura total (teto do QA: 2,5 e 1,5 alturas de tela).
 */

const curva = cubicBezier(EASE_OUT[0], EASE_OUT[1], EASE_OUT[2], EASE_OUT[3]);
const ROTULO_VIDEO = `${UI.imagemIlustrativa}: ${IMAGENS["hero-poster"].alt}`;

// Entradas próprias do hero (só sob html.motion-full; sem JS ou no reduzido aparecem paradas no estado final).
const CSS = `
@keyframes ab-sobe12{from{opacity:0;transform:translate3d(0,12px,0)}}
@keyframes ab-cinquenta{from{color:#F3EFE9;transform:scale(.9)}}
@keyframes ab-selo{from{opacity:0;transform:rotate(-30deg)}}
@keyframes ab-desce{0%{opacity:0;transform:translate3d(0,0,0)}18%{opacity:1}100%{opacity:1;transform:translate3d(0,42px,0)}}
.ab-cinquenta{display:inline-block;transform-origin:50% 60%}
html.motion-full .ab-sobe12{animation:ab-sobe12 var(--dur,400ms) cubic-bezier(.16,1,.3,1) both;animation-delay:calc(var(--t0) + var(--d,0ms))}
html.motion-full .ab-cinquenta{animation:ab-cinquenta 350ms cubic-bezier(.16,1,.3,1) both;animation-delay:calc(var(--t0) + 700ms)}
html.motion-full .ab-selo{animation:ab-selo 400ms cubic-bezier(.16,1,.3,1) both;animation-delay:calc(var(--t0) + 600ms)}
html.motion-full .ab-desce{animation:ab-desce 1.8s cubic-bezier(.65,0,.35,1) 3 both;animation-delay:calc(var(--t0) + 1000ms)}
.ab-selo-sym [data-parte]{transition:transform 200ms cubic-bezier(.16,1,.3,1)}
.ab-selo-sym [data-parte="tl"]{transform:translate(-9px,-9px)}
.ab-selo-sym [data-parte="tr"]{transform:translate(9px,-9px)}
.ab-selo-sym [data-parte="bl"]{transform:translate(-9px,9px)}
.ab-selo-sym [data-parte="br"]{transform:translate(9px,9px)}
.ab-selo:hover .ab-selo-sym [data-parte]{transform:none}
html.motion-reduced .ab-selo-sym [data-parte]{transform:none;transition:none}
@media (min-height:561px){html.motion-full:not(.motion-failed) #topo .ab-encaixe:not([data-pronto]){visibility:hidden}}
`;

/** Atraso das entradas CSS (somado a --t0 em styles.css). */
const atraso = (ms: number, dur?: number) => ({ "--d": `${ms}ms`, ...(dur ? { "--dur": `${dur}ms` } : {}) }) as CSSProperties;

// Cada cantoneira é um SVG próprio (recorte do viewBox do símbolo), para vir de fora da tela em vw/vh.
const CANTOS = [
  { parte: "tl", pos: "left-0 top-0", vb: "0 0 44 44", dir: [-1, -1], rot: -12, cor: "#F3EFE9" },
  { parte: "tr", pos: "right-0 top-0", vb: "56 0 44 44", dir: [1, -1], rot: 12, cor: "#E8442E" },
  { parte: "bl", pos: "bottom-0 left-0", vb: "0 56 44 44", dir: [-1, 1], rot: 12, cor: "#F3EFE9" },
  { parte: "br", pos: "bottom-0 right-0", vb: "56 56 44 44", dir: [1, 1], rot: -12, cor: "#F3EFE9" },
] as const;

function Canto({ c, p }: { c: (typeof CANTOS)[number]; p: MotionValue<number> }) {
  const x = useTransform(p, [0.42, 0.66], [`${c.dir[0] * 42}vw`, "0vw"], { ease: curva });
  const y = useTransform(p, [0.42, 0.66], [`${c.dir[1] * 40}vh`, "0vh"], { ease: curva });
  const rotate = useTransform(p, [0.42, 0.66], [c.rot, 0], { ease: curva });
  const opacity = useTransform(p, [0.42, 0.5], [0, 1]);
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
  const fim = 0.22 + 0.02 * i;
  const y = useTransform(p, [ini, fim], ["0vh", "-14vh"]);
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

  // ---- distância do encaixe do símbolo até o centro do palco (medida sem transform)
  const palco = useRef<HTMLDivElement>(null);
  const encaixe = useRef<HTMLDivElement>(null);
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
    };
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, [active]);
  const pronto = active && delta !== null;

  // ---- textos do hero (p 0 → 0,15) e chrome do hero (p 0 → 0,08)
  const tOp = useTransform(pTexto, [0, 0.15], [1, 0]);
  const tY = useTransform(pTexto, [0, 0.15], ["0vh", "-6vh"]);
  const indOp = useTransform(pTexto, [0, 0.08], [1, 0]);
  const { scrollY } = useScroll();
  const seloRot = useTransform(scrollY, (v) => v * 0.08);
  const [interativo, setInterativo] = useState(true);
  useMotionValueEvent(pTexto, "change", (v) => setInterativo(v < 0.15));

  // ---- símbolo, véu, manifesto e brasas
  const grupoX = useTransform(pFim, [0.6, 0.8], [delta?.x ?? 0, 0], { ease: curva });
  const grupoY = useTransform(pFim, [0.6, 0.8], [delta?.y ?? 0, 0], { ease: curva });
  const midiaY = useTransform(pFim, [0, 0.55], ["0%", "-4%"]);
  const veu = useTransform(pFim, [0.1, 0.5], [1, 0.35]);
  const brilho = useTransform(pFim, [0.5, 0.85], [0, 1]);
  // o manifesto só aparece quando o símbolo já está saindo do centro (sem sobrepor a cantoneira)
  const manifOp = useTransform(pFim, [0.66, 0.76], [0, 1]);
  const manifX = useTransform(pFim, [0.62, 0.8], ["3vw", "0vw"], { ease: curva });
  const apoioOp = useTransform(pFim, [0.86, 0.96], [0, 1]);
  const apoioY = useTransform(pFim, [0.86, 0.96], [20, 0]);
  const brasaOp = useTransform(pFim, [0.55, 0.85], [0, 0.75]);
  const brasaY = useTransform(pFim, [0.5, 1], ["0vh", "-8vh"]);
  const [brasas, setBrasas] = useState(false);
  useMotionValueEvent(pFim, "change", (v) => setBrasas((b) => active && (b ? v > 0.4 : v > 0.5)));

  const linhas = HERO.h1.linhas;

  return (
    <div
      ref={palco}
      className="relative h-[100svh] [--gota:min(30vw,14svh)] group-data-[pin=off]/pin:h-auto md:[--gota:min(24vw,13svh)] lg:[--gota:min(34vh,22vw)]"
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
                    <Phone aria-hidden size={16} strokeWidth={1.75} className="transition-transform duration-200 group-hover:translate-x-1" />
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

        {/* indicador "Role", crédito do vídeo e selo de 50 anos */}
        <motion.div data-pin-layer="" className="pointer-events-none absolute inset-x-0 bottom-0" style={{ opacity: indOp }}>
          <Container className="flex items-end justify-between pb-6 lg:pb-8">
            <div className="e-fade hidden items-center gap-4 md:flex [@media(max-height:780px)]:!hidden" style={atraso(600, 400)}>
              <span aria-hidden className="relative block h-12 w-px bg-papel-50/25">
                <span className="ab-desce absolute left-[-2.5px] top-0 block h-1.5 w-1.5 rounded-full bg-brasa-400" />
              </span>
              <span className="rotulo text-papel-300">{UI.rolar}</span>
            </div>
            <div className="ml-auto flex items-end gap-6">
              <p className="rotulo e-fade hidden text-papel-500 md:block" style={atraso(600, 400)}>
                {UI.imagemIlustrativa}
              </p>
              <div className="e-fade hidden lg:block" style={atraso(600, 400)}>
                <div aria-hidden className="ab-selo pointer-events-auto relative h-[120px] w-[120px]">
                  <motion.svg data-pin-layer="" viewBox="0 0 120 120" className="absolute inset-0 h-full w-full overflow-visible" style={{ rotate: seloRot }}>
                    <defs>
                      <path id="ab-anel" d="M60 60 m-43 0 a43 43 0 1 1 86 0 a43 43 0 1 1 -86 0" />
                    </defs>
                    <circle cx="60" cy="60" r="59.5" fill="none" stroke="rgba(243,239,233,.18)" />
                    <text className="rotulo fill-papel-300" style={{ fontSize: 13 }}>
                      <textPath href="#ab-anel" textLength={268} lengthAdjust="spacing">
                        {HERO.selo}
                      </textPath>
                    </text>
                  </motion.svg>
                  <div className="absolute inset-0 grid place-items-center">
                    <Symbol size={34} tone="escuro" className="ab-selo-sym" />
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </motion.div>
      </div>

      {/* ------------------------------------------------ símbolo + manifesto (fim da cena; em fluxo, depois do hero, no estático) */}
      <div className="pointer-events-none absolute inset-0 z-[1] group-data-[pin=off]/pin:pointer-events-auto group-data-[pin=off]/pin:relative group-data-[pin=off]/pin:inset-auto">
        <motion.div aria-hidden data-pin-layer="" className="absolute inset-x-0 bottom-0 h-3/4 bg-luz-brasa group-data-[pin=off]/pin:opacity-50" style={{ opacity: brilho }} />
        {brasas && (
          <motion.div aria-hidden className="absolute inset-0" style={{ opacity: brasaOp, y: brasaY }}>
            <Embers density={18} />
          </motion.div>
        )}
        <Container className="relative grid h-full grid-cols-1 content-center gap-y-6 pb-[4svh] pt-[8svh] group-data-[pin=off]/pin:py-24 lg:grid-cols-12 lg:gap-x-6 lg:py-0 lg:group-data-[pin=off]/pin:py-36">
          <div className="flex justify-center lg:col-span-6 lg:self-center">
            {/* Com movimento completo, a cena fixa logo depois da hidratação e a gota salta do fluxo (abaixo do hero)
                para cobrir a tela: com ela visível no estado estático, isso contava como deslocamento de layout
                (CLS 1,0 no celular). Até a cena ligar e a posição dela estar medida (data-pronto) ela fica invisível
                (só com motion-full e tela alta; sem JS, no reduzido, em tela baixa e com o motor caído ela aparece). */}
            <div ref={encaixe} data-pronto={pronto ? "" : undefined} className="ab-encaixe relative aspect-square w-[calc(var(--gota)*2)]">
              <motion.div data-pin-layer="" className="pointer-events-auto absolute inset-0" style={{ x: grupoX, y: grupoY }}>
                <div className="absolute inset-[25%] group-data-[pin=off]/pin:[&_button]:hidden">
                  <DropWindow progress={pFim} range={[0.08, 0.55]} mode="fechar" className="[--gota:100%]">
                    <motion.div className="h-full w-full" style={{ y: midiaY }}>
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

          <motion.div data-pin-layer="" className="mx-auto w-full max-w-[34rem] lg:col-span-6 lg:col-start-7 lg:mx-0 lg:max-w-none lg:self-center lg:pl-6" style={{ opacity: manifOp, x: manifX }}>
            <ScrollLitText as="h2" text={HERO.manifesto} progress={pFim} range={[0.68, 0.92]} className="display-xl text-balance text-papel-50" />
            <motion.div data-pin-layer="" style={{ opacity: apoioOp, y: apoioY }}>
              <p className="corpo mt-5 text-papel-300 lg:mt-8">{HERO.apoio}</p>
              <p className="rotulo mt-4 text-papel-500 lg:mt-6">{HERO.rotuloFinal}</p>
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
    <PinStage id="topo" mode="sempre" heightClassName="h-[150vh] lg:h-[250vh]" className="group/pin grain bg-noite-950">
      <Cena />
    </PinStage>
  );
}
