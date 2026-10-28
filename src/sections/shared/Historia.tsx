import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { motion, useMotionValue, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { SECOES, TIMELINE, linhasTexto, type Marco } from "../../data/site";
import { DUR, EASE_OUT, Odometer, PinStage, Reveal, SPRING, ease, usePin } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { OrcamentoCta, WhatsAppCta } from "../../components/ui/cta";
import { Img } from "../../components/ui/Img";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { Symbol } from "../../components/ui/Symbol";
import { useMotionPref } from "../../lib/motion-pref";
import { usePath } from "../../lib/router";
import { resizeSmoothScroll, scrollToProgress } from "../../lib/smooth-scroll";
import { pushEvent } from "../../lib/track";
import { MARCOS, irParaAno } from "./historia/dados";
import { Revela } from "./historia/Revela";

/*
 * H7. 50 anos (design-final §9 H7; AJUSTES-DESIGN). Linha do tempo de 1976 a 2026.
 * - Desktop com movimento (PinStage "pin" ativo): os 10 painéis correm na horizontal sobre um trilho. Uma agulha
 *   fixa marca o presente: o que passou dela fica em brasa (linha, nó carimbado, ano preenchido) e o odômetro do
 *   canto mostra o ano. A rolagem presa fica em no máximo 2,4 alturas de tela (teto do QA: 2,5).
 * - Celular, tablet, tela baixa, movimento reduzido, SSR e sem JS: lista vertical com o trilho à esquerda, que
 *   enche com a rolagem; o nó e o ano acendem quando a linha vermelha chega neles.
 */

type Variante = "home" | "completa";
export interface HistoriaProps {
  variant?: Variante;
}

const AGULHA = 0.38; // fração da largura do palco onde fica a agulha
const ROLAGEM_MAX = 2.4; // alturas de tela de rolagem presa (≤ 2,5)
const N = MARCOS.length;
const CHAVE_SESSAO = "pt-timeline";

const cabecalho = (v: Variante) =>
  v === "completa"
    ? { index: "01", label: TIMELINE.label, sobretitulo: null, h2: TIMELINE.h2Completa }
    : { index: SECOES.historia.index, label: SECOES.historia.label, sobretitulo: TIMELINE.sobretitulo, h2: TIMELINE.h2 };

/**
 * Contorno do ano. A cor do texto continua papel-50 (é o que o axe lê para o contraste); só o preenchimento fica
 * transparente. A espessura vem de --traco.
 */
const CONTORNO = "text-papel-50 [-webkit-text-fill-color:transparent] [-webkit-text-stroke:var(--traco,1px)_rgba(243,239,233,0.42)]";

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

/** Ano em contorno com a cópia preenchida por cima (decorativa, aria-hidden). `aceso` liga o preenchimento. */
function Ano({ ano, aceso, transicao = true }: { ano: number; aceso: boolean; transicao?: boolean }) {
  return (
    <span className="relative block w-max">
      <span className={`block ${CONTORNO}`}>{ano}</span>
      <span
        aria-hidden
        className={`absolute inset-0 block text-brasa-400 ${transicao ? "transition-opacity duration-300 ease-out" : ""}`}
        style={{ opacity: aceso ? 1 : 0 }}
      >
        {ano}
      </span>
    </span>
  );
}

function Ctas({ variant }: { variant: Variante }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <OrcamentoCta formLocation="historia" />
      <WhatsAppCta location="historia" detail={variant === "completa" ? "institucional" : undefined} />
    </div>
  );
}

function Cabecalho({ variant, compacto, children }: { variant: Variante; compacto?: boolean; children?: ReactNode }) {
  const c = cabecalho(variant);
  return (
    <div className="flex items-end justify-between gap-10">
      <div className="min-w-0 max-w-[56rem]">
        <SectionLabel index={c.index} label={c.label} />
        {c.sobretitulo && (
          <Reveal y={16} delay={0.08} className={compacto ? "[@media(max-height:820px)]:hidden" : undefined}>
            <p className={`text-[17px] font-medium text-papel-300 ${compacto ? "mt-4" : "mt-5"}`}>{c.sobretitulo}</p>
          </Reveal>
        )}
        <Revela
          as="h2"
          texto={c.h2.linhas}
          className={
            compacto
              ? "stretch-66 mt-3 text-[clamp(1.75rem,min(3.1vw,5.4svh),3.25rem)] font-[800] uppercase leading-[0.92] text-papel-50"
              : "display-xl mt-4 text-papel-50"
          }
        />
      </div>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------- versão horizontal (cena fixada)

interface Geo {
  vw: number; // largura do palco
  cl: number; // borda esquerda do conteúdo (alinhada ao Container)
  w: number; // largura do trilho
  d: number; // distância horizontal total
  lefts: number[];
}

function Horizontal({ variant, definirAltura }: { variant: Variante; definirAltura: (h: number | null) => void }) {
  const { progress } = usePin();
  const palco = useRef<HTMLDivElement>(null);
  const faixa = useRef<HTMLDivElement>(null);
  const trilho = useRef<HTMLOListElement>(null);
  const paineis = useRef<(HTMLLIElement | null)[]>([]);
  const [geo, setGeo] = useState<Geo | null>(null);
  const [estado, setEstado] = useState({ ativo: 0, revelado: 0 });
  const dist = useMotionValue(0);
  const x = useTransform([progress, dist], ([p, d]: number[]) => -p * d);

  // mede o trilho (fontes, redimensionamento) e define a altura da seção: 100vh + rolagem presa
  useEffect(() => {
    const medir = () => {
      const p = palco.current;
      const f = faixa.current;
      const t = trilho.current;
      if (!p || !f || !t) return;
      const vw = p.clientWidth;
      const cl = f.getBoundingClientRect().left - p.getBoundingClientRect().left;
      const w = t.scrollWidth;
      const d = Math.max(0, cl + w - vw);
      const lefts = paineis.current.map((el) => el?.offsetLeft ?? 0);
      dist.set(d);
      setGeo((g) => (g && g.vw === vw && g.cl === cl && g.w === w && g.lefts.every((v, i) => v === lefts[i]) ? g : { vw, cl, w, d, lefts }));
      definirAltura(Math.round(window.innerHeight + Math.min(d, ROLAGEM_MAX * window.innerHeight)));
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
  }, [dist, definirAltura]);

  // o que passou da agulha está aceso; o texto sobe (uma vez) quando o painel entra na tela
  const calcular = (p: number) => {
    if (!geo) return;
    let ativo = 0;
    let revelado = 0;
    for (let i = 0; i < N; i++) {
      const s = geo.cl + geo.lefts[i] - p * geo.d; // borda esquerda do painel na tela
      if (s <= AGULHA * geo.vw + 2) ativo = i;
      if (s <= 0.9 * geo.vw) revelado = i;
    }
    setEstado((e) => {
      const rev = Math.max(e.revelado, revelado);
      return e.ativo === ativo && e.revelado === rev ? e : { ativo, revelado: rev };
    });
  };
  useMotionValueEvent(progress, "change", calcular);
  useEffect(() => calcular(progress.get()), [geo]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (estado.ativo === N - 1) avisarFim();
  }, [estado.ativo]);

  // linha vermelha: do início do trilho até a agulha (escala no eixo x do trilho)
  const preenchido = useTransform([progress, dist], ([p, d]: number[]) =>
    geo && geo.w > 0 ? Math.min(1, Math.max(0, (AGULHA * geo.vw - geo.cl + p * d) / geo.w)) : 0,
  );

  /** Rola até o ponto em que o painel i fica logo depois da agulha (nós e foco por teclado). */
  const irPara = (i: number) => {
    const secao = palco.current?.closest<HTMLElement>("[data-pin-stage]");
    if (!secao || !geo || geo.d <= 0) return;
    const alvo = i === 0 ? 0 : (geo.cl + geo.lefts[i] - (AGULHA - 0.04) * geo.vw) / geo.d;
    scrollToProgress(secao, Math.min(1, Math.max(0, alvo)));
  };

  const marco = MARCOS[estado.ativo];

  return (
    <div
      ref={palco}
      className="relative flex h-full flex-col [--base:15svh] [--traco:1.5px] [@media(max-height:820px)]:[--base:11svh] [@media(min-height:1000px)]:[--base:17svh]"
      style={{ "--agulha": `${AGULHA * 100}%` } as CSSProperties}
    >
      {/* luz estática da marca sob a agulha */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(36% 44% at var(--agulha) calc(100% - var(--base)), rgba(190,30,41,0.2), rgba(190,30,41,0) 70%)" }}
      />

      <Container className="relative z-[2] shrink-0 pt-[clamp(88px,12.5svh,124px)]">
        <Cabecalho variant={variant} compacto>
          <Reveal y={16} delay={0.12} className="shrink-0 text-right">
            <p className="rotulo text-papel-500">
              <motion.span
                key={marco.ano}
                className="inline-block"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DUR.curta, ease: ease(EASE_OUT) }}
              >
                {marco.rotulo}
              </motion.span>
            </p>
            <p className="mt-2 font-mono text-[28px] font-medium leading-none text-papel-50 [--od-w:0.6em]">
              <Odometer value={String(marco.ano)} trigger="value" />
            </p>
            <div aria-hidden className="rotulo mt-4 flex items-center justify-end gap-3 text-papel-500">
              <span>{MARCOS[0].ano}</span>
              <span className="relative block h-[2px] w-28 bg-noite-600">
                <motion.span className="absolute inset-0 block origin-left bg-brasa-400" style={{ scaleX: progress }} />
              </span>
              <span>{MARCOS[N - 1].ano}</span>
            </div>
          </Reveal>
        </Cabecalho>
      </Container>

      <div className="relative z-[1] min-h-0 flex-1">
        <Container className="absolute inset-0">
          <div ref={faixa} className="relative h-full">
            <motion.div data-pin-layer="" className="absolute inset-y-0 left-0 w-max" style={{ x }}>
              {/* trilho de 2 px em todo o comprimento, com a linha vermelha até a agulha */}
              <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-[var(--base)] h-[2px] translate-y-1/2 bg-noite-600">
                <motion.span className="absolute inset-0 block origin-left bg-brasa-500" style={{ scaleX: preenchido }} />
              </div>
              <ol ref={trilho} className="relative flex h-full w-max pr-[20vw]">
                {MARCOS.map((m, i) => (
                  <Painel
                    key={m.ano}
                    m={m}
                    i={i}
                    geo={geo}
                    progress={progress}
                    aceso={estado.ativo >= i}
                    revelado={estado.revelado >= i}
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

      {/* agulha: o presente da linha do tempo */}
      <span aria-hidden className="pointer-events-none absolute bottom-[var(--base)] left-[var(--agulha)] z-[3] block" style={{ translate: "-50% 50%" }}>
        <span className="absolute bottom-1/2 left-1/2 h-16 w-px -translate-x-1/2 bg-gradient-to-t from-brasa-400/80 to-brasa-400/0" />
        <span className="block h-2.5 w-2.5 rounded-full bg-brasa-400 shadow-[0_0_0_6px_rgba(232,68,46,0.16),0_0_24px_rgba(232,68,46,0.55)]" />
      </span>
    </div>
  );
}

function Painel({
  m,
  i,
  geo,
  progress,
  aceso,
  revelado,
  variant,
  irPara,
  registrar,
}: {
  m: Marco;
  i: number;
  geo: Geo | null;
  progress: MotionValue<number>;
  aceso: boolean;
  revelado: boolean;
  variant: Variante;
  irPara: (i: number) => void;
  registrar: (el: HTMLLIElement | null) => void;
}) {
  // deslocamento do painel em relação à posição de repouso (alinhado ao Container): 0 no 1976 parado
  const desloc = (p: number) => (geo ? p * geo.d - geo.lefts[i] : 0);
  const xAno = useTransform(progress, (p) => 0.06 * desloc(p)); // o ano corre um pouco mais devagar que o trilho
  const yCelular = useTransform(progress, (p) => -0.05 * desloc(p));
  const final = !!m.final;
  const entrada = { duration: DUR.base, ease: ease(EASE_OUT) };

  return (
    <li
      ref={registrar}
      className={`relative h-full shrink-0 ${final ? "w-[max(44vw,600px)]" : "w-[max(38vw,520px)]"}`}
      onFocusCapture={(e) => {
        if (e.target instanceof HTMLElement && e.target.matches(":focus-visible")) irPara(i);
      }}
    >
      <div className="pr-[4vw] pt-[clamp(14px,3.6svh,52px)]">
        <div className="flex items-end gap-6">
          <h3 className="display-xxl text-[min(14vw,21svh)] [@media(max-height:820px)]:text-[min(14vw,18svh)]">
            <motion.span className="block" style={{ x: xAno }}>
              <Ano ano={m.ano} aceso={aceso} />
            </motion.span>
          </h3>
          {(m.simbolo || final) && (
            <span className="mb-[0.4vw] shrink-0">
              <Symbol size={72} tone="escuro" mode="montar" />
            </span>
          )}
        </div>
        <motion.div
          initial={false}
          animate={revelado ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={entrada}
          data-motion="sobe"
          className={final ? "max-w-[36rem]" : m.imagem ? "max-w-[34ch]" : "max-w-[38ch]"}
        >
          <p className="rotulo mt-5 text-brasa-300">{m.rotulo}</p>
          {final ? (
            <>
              <p className="titulo mt-3 max-w-[22ch] text-papel-50">{m.texto}</p>
              <div className="mt-7">
                <Ctas variant={variant} />
              </div>
            </>
          ) : (
            <p className="mt-3 text-[17px] leading-[1.6] text-papel-300">{m.texto}</p>
          )}
        </motion.div>
      </div>

      {m.imagem && (
        <motion.div
          initial={false}
          animate={revelado ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ ...entrada, delay: 0.1 }}
          data-motion="sobe"
          className="pointer-events-none absolute bottom-[calc(var(--base)+32px)] right-[2.5vw] w-[clamp(120px,10vw,160px)]"
        >
          <motion.div style={{ y: yCelular }}>
            <Img id={m.imagem} alt="" sizes="160px" className="block" imgClassName="h-auto w-full drop-shadow-[0_28px_36px_rgba(0,0,0,0.6)]" />
          </motion.div>
        </motion.div>
      )}

      {/* nó: botão que leva a rolagem até o ano */}
      <button
        type="button"
        aria-label={irParaAno(m.ano)}
        onClick={() => irPara(i)}
        className="absolute bottom-[var(--base)] left-0 z-[2] grid h-11 w-11 place-items-center rounded-full"
        style={{ translate: "-50% 50%" }}
      >
        <span aria-hidden className="relative block h-3 w-3">
          <span className="absolute -inset-2 rounded-full bg-brasa-400/35 blur-[6px] transition-opacity duration-300" style={{ opacity: aceso ? 1 : 0 }} />
          <motion.span
            key={aceso ? "on" : "off"}
            className={`absolute inset-0 rounded-full border-2 ${aceso ? "border-brasa-400 bg-brasa-500" : "border-noite-500 bg-noite-900"}`}
            initial={aceso ? { scale: 1.6, rotate: -8, opacity: 0.4 } : false}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", ...SPRING.encaixe }}
          />
        </span>
      </button>
    </li>
  );
}

// ---------------------------------------------------------------- versão vertical (estática)

function Vertical({ variant }: { variant: Variante }) {
  const reduced = useMotionPref() === "reduced";
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);
  const lista = useRef<HTMLOListElement>(null);
  const itens = useRef<(HTMLLIElement | null)[]>([]);
  const fracoes = useRef<number[]>([]);
  const [aceso, setAceso] = useState(-1);
  const { scrollYProgress } = useScroll({ target: lista, offset: ["start 65%", "end 65%"] });

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
      fracoes.current = itens.current.map((li) => ((li?.offsetTop ?? 0) + 30) / ol.offsetHeight);
      atualizar(scrollYProgress.get());
    };
    medir();
    const ro = new ResizeObserver(medir);
    if (lista.current) ro.observe(lista.current);
    return () => ro.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // SSR, sem JS e reduzido: tudo aceso
  const todos = !montado || reduced;
  const montaSimbolo = montado && !reduced;
  const acende = (i: number) => todos || aceso >= i;

  return (
    <div className="relative py-24 lg:py-40">
      <Container>
        <Cabecalho variant={variant} />

        <div className="relative mt-16 lg:mt-24">
          <div aria-hidden className="pointer-events-none absolute bottom-3 left-[11px] top-3 w-[2px] bg-noite-600">
            <motion.span className="absolute inset-0 block origin-top bg-brasa-500" style={{ scaleY: reduced ? 1 : scrollYProgress }} />
          </div>
          <ol ref={lista} className="relative">
            {MARCOS.map((m, i) => {
              const on = acende(i);
              const final = !!m.final;
              return (
                <li
                  key={m.ano}
                  ref={(el) => {
                    itens.current[i] = el;
                  }}
                  className="relative grid grid-cols-1 gap-y-4 pb-16 pl-12 last:pb-0 md:grid-cols-[15rem_minmax(0,1fr)] md:gap-x-10 md:pl-16 lg:grid-cols-[24rem_minmax(0,1fr)] lg:pb-24"
                >
                  {/* nó */}
                  <span
                    aria-hidden
                    className="absolute left-[12px] top-[27px] block h-3 w-3 md:top-[38px] lg:top-[calc(clamp(6.5rem,9vw,8.5rem)*0.43)]"
                    style={{ translate: "-50% -50%" }}
                  >
                    <span className="absolute -inset-2 rounded-full bg-brasa-400/35 blur-[6px] transition-opacity duration-300" style={{ opacity: on ? 1 : 0 }} />
                    <span
                      className={`absolute inset-0 rounded-full border-2 transition-[background-color,border-color,transform] duration-300 ${
                        on ? "scale-100 border-brasa-400 bg-brasa-500" : "scale-75 border-noite-500 bg-noite-900"
                      }`}
                    />
                  </span>

                  <div className="flex items-start gap-5">
                    <h3 className="stretch-62 text-[64px] font-[850] uppercase leading-[0.86] md:text-[88px] lg:text-[clamp(6.5rem,9vw,8.5rem)]">
                      <Ano ano={m.ano} aceso={on} transicao={montado} />
                    </h3>
                    {(m.simbolo || final) && (
                      <span className="mt-1 md:mt-2">
                        {/* SSR/sem JS: símbolo parado (o "montar" da base sai do servidor sem as cantoneiras) */}
                        <Symbol
                          key={montaSimbolo ? "montar" : "estatico"}
                          size="100%"
                          tone="escuro"
                          mode={montaSimbolo ? "montar" : "estatico"}
                          className="h-14 w-14 md:h-[72px] md:w-[72px]"
                        />
                      </span>
                    )}
                  </div>

                  <Reveal className="md:pt-2 lg:pt-5">
                    <p className="rotulo text-brasa-300">{m.rotulo}</p>
                    {final ? (
                      <>
                        <p className="titulo mt-3 max-w-[24ch] text-papel-50">{m.texto}</p>
                        <div className="mt-8">
                          <Ctas variant={variant} />
                        </div>
                      </>
                    ) : (
                      <p className="corpo mt-3 max-w-[56ch] text-papel-300">{m.texto}</p>
                    )}
                    {m.imagem && (
                      <div className="mt-8 w-[132px] md:w-[156px]">
                        <Img id={m.imagem} alt="" sizes="156px" className="block" imgClassName="h-auto w-full drop-shadow-[0_24px_30px_rgba(0,0,0,0.55)]" />
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
      <PinStage id="historia" mode="pin" heightClassName="h-[var(--hist-h,340vh)]" className="grain bg-noite-900" label={linhasTexto(h2.linhas)}>
        <Palco variant={v} definirAltura={setAltura} />
      </PinStage>
    </div>
  );
}
