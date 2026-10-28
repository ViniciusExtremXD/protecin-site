import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useInView, useMotionValue, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { SECOES, TIMELINE, linhasTexto, type Marco } from "../../data/site";
import { EASE_OUT, PinStage, Reveal, ease, usePin } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { OrcamentoCta, WhatsAppCta } from "../../components/ui/cta";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { usePath } from "../../lib/router";
import { resizeSmoothScroll, scrollToProgress } from "../../lib/smooth-scroll";
import { pushEvent } from "../../lib/track";
import { MARCOS, irParaAno, tituloMarco } from "./historia/dados";
import { H2 } from "./historia/estilo";

/*
 * H7. 50 anos (design-final §9 H7, com qa/AJUSTES-SOBRIEDADE.md por cima). Linha do tempo de 1976 a 2026.
 * - Desktop (PinStage "pin" ativo): os 10 marcos correm na horizontal sobre um eixo com um nó por ano. A linha
 *   vermelha vai de 1976 a 2026 junto com a rolagem e acende cada nó que alcança. Rolagem presa de no máximo
 *   1,2 tela (altura da seção ≤ 220vh).
 * - Celular, tablet, tela baixa, SSR e sem JS: lista vertical compacta com o trilho à esquerda, que enche com a
 *   rolagem; o nó acende quando a linha chega nele. Sem cena presa.
 * Fora da rodada 1: odômetro do ano, mini-régua, carimbo e brilho dos nós, agulha com glow, anos em contorno,
 * símbolo e celular nos painéis, rótulos mono por marco (viraram títulos curtos) e o sobretítulo.
 */

type Variante = "home" | "completa";
export interface HistoriaProps {
  variant?: Variante;
}

const ROLAGEM_MAX = 1.2; // alturas de tela de rolagem presa
const N = MARCOS.length;
const CHAVE_SESSAO = "pt-timeline";
const entrada = (delay = 0) => ({ duration: 0.6, ease: ease(EASE_OUT), delay });

const cabecalho = (v: Variante) =>
  v === "completa"
    ? { index: "01", label: TIMELINE.label, h2: TIMELINE.h2Completa }
    : { index: SECOES.historia.index, label: SECOES.historia.label, h2: TIMELINE.h2 };

/** timeline_complete uma vez por sessão (§13). */
let avisado = false;
function avisarFim() {
  if (avisado) return;
  avisado = true;
  try {
    if (sessionStorage.getItem(CHAVE_SESSAO)) return;
    sessionStorage.setItem(CHAVE_SESSAO, "1");
  } catch {
    /* armazenamento bloqueado: dispara mesmo assim */
  }
  pushEvent("timeline_complete");
}

// ---------------------------------------------------------------- peças comuns

function Ctas({ variant, coluna }: { variant: Variante; coluna?: boolean }) {
  return (
    <div className={`flex flex-col items-start gap-3 ${coluna ? "" : "sm:flex-row sm:flex-wrap"}`}>
      <OrcamentoCta formLocation="historia" size="sm" />
      <WhatsAppCta location="historia" size="sm" detail={variant === "completa" ? "institucional" : undefined} />
    </div>
  );
}

function Cabecalho({ variant, palco }: { variant: Variante; palco?: boolean }) {
  const c = cabecalho(variant);
  // no palco fixo o título também respeita a altura da tela (telas baixas)
  const tam = palco ? "lg:text-[clamp(2rem,min(4.2vw,7.2svh),4rem)]" : "";
  return (
    <div className="max-w-[48rem]">
      <SectionLabel index={c.index} label={c.label} />
      <Reveal y={20} delay={0.06}>
        <h2 className={`${H2} ${tam} mt-4 text-papel-50 lg:mt-5`}>{c.h2.texto}</h2>
      </Reveal>
    </div>
  );
}

// ---------------------------------------------------------------- versão horizontal (cena fixada)

function Horizontal({ variant, definirAltura }: { variant: Variante; definirAltura: (h: number | null) => void }) {
  const { progress } = usePin();
  const palco = useRef<HTMLDivElement>(null);
  const faixa = useRef<HTMLDivElement>(null);
  const trilho = useRef<HTMLOListElement>(null);
  const paineis = useRef<(HTMLLIElement | null)[]>([]);
  const geo = useRef({ fl: 0, d: 0, lefts: [] as number[] });
  const dist = useMotionValue(0);
  const x = useTransform([progress, dist], ([p, d]: number[]) => -p * d);
  const visto = useInView(palco, { once: true, margin: "0px 0px -25% 0px" });
  const [ativo, setAtivo] = useState(0);
  const [revelado, setRevelado] = useState(-1);
  const lote = useRef(-1); // quantos painéis entraram juntos quando a seção apareceu (cascata só nesses)

  // mede o trilho (fontes, redimensionamento) e define a altura da seção: 100vh + rolagem presa
  useEffect(() => {
    const medir = () => {
      const f = faixa.current;
      const t = trilho.current;
      if (!f || !t) return;
      const d = Math.max(0, t.scrollWidth - f.clientWidth);
      geo.current = { fl: f.getBoundingClientRect().left, d, lefts: paineis.current.map((el) => el?.offsetLeft ?? 0) };
      dist.set(d);
      definirAltura(Math.round(window.innerHeight + Math.min(d, ROLAGEM_MAX * window.innerHeight)));
      calcular(progress.get());
    };
    medir();
    const ro = new ResizeObserver(medir);
    if (trilho.current) ro.observe(trilho.current);
    window.addEventListener("resize", medir);
    let vivo = true;
    document.fonts?.ready.then(() => vivo && medir());
    return () => {
      vivo = false;
      ro.disconnect();
      window.removeEventListener("resize", medir);
      definirAltura(null);
    };
  }, [dist, definirAltura]); // eslint-disable-line react-hooks/exhaustive-deps

  // nó alcançado pela linha (que vai de 1976 a 2026 com a rolagem) e painéis que já entraram na tela
  function calcular(p: number) {
    const a = Math.max(0, Math.min(N - 1, Math.floor(p * (N - 1) + 0.02)));
    setAtivo((v) => (v === a ? v : a));
    const { fl, d, lefts } = geo.current;
    let r = -1;
    lefts.forEach((l, i) => {
      if (fl + l - p * d < window.innerWidth * 0.92) r = i;
    });
    setRevelado((v) => Math.max(v, r));
  }
  useMotionValueEvent(progress, "change", calcular);

  useEffect(() => {
    if (visto && lote.current < 0) lote.current = revelado + 1;
  }, [visto, revelado]);
  useEffect(() => {
    if (ativo === N - 1) avisarFim();
  }, [ativo]);

  /** Rola até o ponto em que a linha alcança o marco i (nós e foco por teclado). */
  const irPara = (i: number) => {
    const secao = palco.current?.closest<HTMLElement>("[data-pin-stage]");
    if (secao) scrollToProgress(secao, i / (N - 1));
  };

  return (
    // título e trilho centrados juntos na altura que sobra abaixo do menu ("safe": em tela baixa encosta no topo)
    <div
      ref={palco}
      className="relative flex h-full flex-col pb-[clamp(24px,5svh,56px)] pt-[clamp(80px,10svh,96px)] [--hist-ano:clamp(3.25rem,min(6.2vw,10.5svh),6.5rem)] [--hist-pt:clamp(24px,5.5svh,56px)] [justify-content:safe_center]"
    >
      <Container className="relative z-[1] shrink-0">
        <Cabecalho variant={variant} palco />
      </Container>

      <div className="relative shrink-0">
        <Container>
          <div ref={faixa} className="relative">
            <motion.div data-pin-layer="" className="relative w-max" style={{ x }}>
              <ol ref={trilho} className="flex w-max items-start pt-[var(--hist-pt)]">
                {MARCOS.map((m, i) => (
                  <Painel
                    key={m.ano}
                    m={m}
                    i={i}
                    progress={progress}
                    aceso={ativo >= i}
                    visivel={visto && revelado >= i}
                    atraso={i < lote.current ? i * 0.08 : 0}
                    variant={variant}
                    irPara={irPara}
                    registrar={(el) => {
                      paineis.current[i] = el;
                    }}
                  />
                ))}
              </ol>
            </motion.div>
          </div>
        </Container>
      </div>
    </div>
  );
}

function Painel({
  m,
  i,
  progress,
  aceso,
  visivel,
  atraso,
  variant,
  irPara,
  registrar,
}: {
  m: Marco;
  i: number;
  progress: MotionValue<number>;
  aceso: boolean;
  visivel: boolean;
  atraso: number;
  variant: Variante;
  irPara: (i: number) => void;
  registrar: (el: HTMLLIElement | null) => void;
}) {
  const final = !!m.final;
  // trecho do eixo entre este nó e o próximo: enche conforme a linha passa por ele
  const enche = useTransform(progress, (p) => Math.min(1, Math.max(0, p * (N - 1) - i)));

  return (
    <li
      ref={registrar}
      className="relative w-[clamp(320px,24vw,380px)] shrink-0 pr-10"
      onFocusCapture={(e) => {
        if (e.target instanceof HTMLElement && e.target.matches(":focus-visible")) irPara(i);
      }}
    >
      <motion.h3
        className="stretch-62 tnum block text-[length:var(--hist-ano)] font-[850] uppercase leading-[0.82] text-papel-50"
        initial={false}
        animate={visivel ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={entrada(atraso)}
        data-motion="sobe"
      >
        {m.ano}
      </motion.h3>

      {/* eixo: trecho até o próximo nó + nó (botão que leva a rolagem até o ano) */}
      <div className="relative my-2 h-11">
        {!final && (
          <span aria-hidden className="absolute left-0 right-0 top-1/2 block h-px bg-noite-600">
            <motion.span className="absolute inset-0 block origin-left bg-brasa-500" style={{ scaleX: enche }} />
          </span>
        )}
        <button
          type="button"
          aria-label={irParaAno(m.ano)}
          onClick={() => irPara(i)}
          className="absolute left-0 top-1/2 z-[1] grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
        >
          <span
            aria-hidden
            className={`block h-2.5 w-2.5 rounded-full border-2 transition-colors duration-300 ${aceso ? "border-brasa-500 bg-brasa-500" : "border-noite-500 bg-noite-900"}`}
          />
        </button>
      </div>

      <motion.div
        initial={false}
        animate={visivel ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={entrada(atraso + 0.08)}
        data-motion="sobe"
      >
        <p className="text-[19px] font-semibold leading-snug text-papel-50">{tituloMarco(m)}</p>
        <p className="mt-2 text-[16px] leading-[1.6] text-papel-300 [@media(min-height:800px)]:text-[17px]">{m.texto}</p>
        {final && (
          <div className="mt-6">
            <Ctas variant={variant} coluna />
          </div>
        )}
      </motion.div>
    </li>
  );
}

// ---------------------------------------------------------------- versão vertical (celular, SSR, sem JS)

function Vertical({ variant }: { variant: Variante }) {
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);
  const lista = useRef<HTMLOListElement>(null);
  const itens = useRef<(HTMLLIElement | null)[]>([]);
  const fracoes = useRef<number[]>([]);
  const [aceso, setAceso] = useState(-1);
  const { scrollYProgress } = useScroll({ target: lista, offset: ["start 70%", "end 70%"] });

  const atualizar = (v: number) => {
    let k = -1;
    fracoes.current.forEach((f, i) => {
      if (v >= f - 0.0005) k = i;
    });
    setAceso((a) => (a === k ? a : k));
    if (k === N - 1) avisarFim();
  };
  useMotionValueEvent(scrollYProgress, "change", atualizar);

  // fração da lista em que fica o nó de cada item (o nó acende quando a linha vermelha chega nele)
  useEffect(() => {
    const medir = () => {
      const ol = lista.current;
      if (!ol || !ol.offsetHeight) return;
      fracoes.current = itens.current.map((li) => ((li?.offsetTop ?? 0) + 14) / ol.offsetHeight);
      atualizar(scrollYProgress.get());
    };
    medir();
    const ro = new ResizeObserver(medir);
    if (lista.current) ro.observe(lista.current);
    return () => ro.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // SSR e sem JS: linha cheia e todos os nós acesos
  const acende = (i: number) => !montado || aceso >= i;

  return (
    <div className="relative py-16 md:py-24 lg:py-28">
      <Container>
        <Cabecalho variant={variant} />

        <div className="relative mt-10 md:mt-14">
          <div aria-hidden className="pointer-events-none absolute bottom-2 left-[4px] top-3.5 w-px bg-noite-600">
            <motion.span className="absolute inset-0 block origin-top bg-brasa-500" style={montado ? { scaleY: scrollYProgress } : undefined} />
          </div>
          <ol ref={lista} className="relative">
            {MARCOS.map((m, i) => {
              const final = !!m.final;
              return (
                <li
                  key={m.ano}
                  ref={(el) => {
                    itens.current[i] = el;
                  }}
                  className="relative pb-7 pl-7 last:pb-0 md:grid md:grid-cols-[9rem_minmax(0,1fr)] md:gap-x-8 md:pb-10 md:pl-10"
                >
                  {/* nó */}
                  <span
                    aria-hidden
                    className={`absolute left-[4.5px] top-[14px] block h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-colors duration-300 md:top-[22px] ${
                      acende(i) ? "border-brasa-500 bg-brasa-500" : "border-noite-500 bg-noite-900"
                    }`}
                  />
                  <Reveal y={16} className="flex items-baseline gap-3 md:block">
                    <h3 className="stretch-62 tnum text-[30px] font-[850] uppercase leading-none text-papel-50 md:text-[44px]">{m.ano}</h3>
                    <p className="text-[15px] font-semibold leading-snug text-papel-50 md:mt-2 md:text-[16px] md:text-papel-300">{tituloMarco(m)}</p>
                  </Reveal>
                  <Reveal y={16} delay={0.06} className="mt-1.5 md:mt-0 md:pt-1">
                    <p className="max-w-[62ch] text-[16px] leading-[1.55] text-papel-300 lg:text-[17px]">{m.texto}</p>
                    {final && (
                      <div className="mt-5">
                        <Ctas variant={variant} />
                      </div>
                    )}
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </div>
  );
}

// ---------------------------------------------------------------- seção

function Palco({ variant, definirAltura }: { variant: Variante; definirAltura: (h: number | null) => void }) {
  const { active } = usePin();
  return active ? <Horizontal variant={variant} definirAltura={definirAltura} /> : <Vertical variant={variant} />;
}

/**
 * Linha do tempo de 1976 a 2026. `variant` "completa" (Institucional) troca o H2 e recomeça o rótulo em "01".
 * Sem a prop, a variante sai da rota (/institucional/ → "completa"), o que serve ao sandbox; a página passa a prop.
 */
export default function Historia({ variant }: HistoriaProps = {}) {
  const path = usePath();
  const v: Variante = variant ?? (path === "/institucional/" ? "completa" : "home");
  const [altura, setAltura] = useState<number | null>(null);
  const h2 = cabecalho(v).h2;

  // a altura da cena mudou: o useScroll e o Lenis precisam medir de novo
  useEffect(() => {
    const r = requestAnimationFrame(() => {
      window.dispatchEvent(new Event("resize"));
      resizeSmoothScroll();
    });
    return () => cancelAnimationFrame(r);
  }, [altura]);

  return (
    <div className="relative" style={altura ? ({ "--hist-h": `${altura}px` } as CSSProperties) : undefined}>
      <a
        href={v === "completa" ? "#valores" : "#setores"}
        className="sr-only left-5 top-5 z-[61] rounded-full bg-papel-50 text-[15px] font-semibold text-noite-950 focus:not-sr-only focus:absolute focus:px-5 focus:py-3 md:left-8 lg:left-12 xl:left-16"
      >
        {TIMELINE.pular}
      </a>
      <PinStage id="historia" mode="pin" heightClassName="h-[var(--hist-h,220vh)]" className="grain bg-noite-900" label={linhasTexto(h2.linhas)}>
        <Palco variant={v} definirAltura={setAltura} />
      </PinStage>
    </div>
  );
}
