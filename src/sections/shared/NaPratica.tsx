import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cubicBezier, motion, useMotionValue, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { NA_PRATICA, SECOES, UI, linhasTexto, servicoPorSlug, type Hotspot as PontoFoto, type ServicoSlug } from "../../data/site";
import { IMAGENS } from "../../data/imagens.gen";
import { Link } from "../../lib/router";
import { useInViewport } from "../../lib/media";
import { pushEvent } from "../../lib/track";
import { scrollToHash, scrollToProgress } from "../../lib/smooth-scroll";
import {
  ClipReveal,
  DrawPath,
  FocusBrackets,
  PinStage,
  Reel,
  Reveal,
  SplitLines,
  SplitWords,
  usePin,
} from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { Img } from "../../components/ui/Img";
import { ReservedSlot } from "../../components/ui/ReservedSlot";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { BlocoCilindros } from "./napratica/Chamadas";
import { Hotspot, numeroPonto, type EstadoHotspot } from "./napratica/Hotspot";

/*
 * H4 · Na prática (design-final §9 H4 + qa/AJUSTES-DESIGN.md).
 * Desktop (≥ 1024 e ≥ 640 de altura, movimento completo): cena fixada de 300vh (2 telas de rolagem). Uma "câmera"
 * passeia pelos 5 pontos da foto real; cartão de legenda único com Reel, linha-guia desenhada e contador.
 * Celular, tablet, tela baixa, movimento reduzido e sem JS: sequência em fluxo normal (foto com os 5 marcadores
 * numerados, depois os 5 pontos em lista, cada um com o recorte ampliado da foto) com reveals.
 * Depois da cena: bloco dos cilindros com as chamadas desenhadas e o espaço reservado "obras".
 */

const PONTOS: readonly PontoFoto[] = NA_PRATICA.pontos;
const N = PONTOS.length;
const P_IN = 0.08; // visão geral até aqui
const P_OUT = 0.92; // volta à visão geral a partir daqui
const JAN = (P_OUT - P_IN) / N; // janela de cada ponto
const VIAGEM = 0.38; // fração da janela gasta no deslocamento da câmera
const ESCALA = 1.9;
const curva = cubicBezier(0.65, 0, 0.35, 1); // EASE_IN_OUT

type Lado = "esq" | "dir";
/** O cartão fica do lado oposto ao ponto. */
const ladoDe = (p: PontoFoto): Lado => (p.x < 50 ? "dir" : "esq");
const UI_LOCAL = { servico: "Serviço", pontos: "Pontos da foto" } as const;
const legendaSemCredito = NA_PRATICA.legenda.replace(`${UI.fotoAcervo}. `, "");

// ---------------------------------------------------------------- câmera
interface Pose {
  s: number; // escala
  fx: number; // foco, % da foto
  fy: number;
  ox: number; // onde o foco pousa, em fração da tela a partir do centro
  oy: number;
}
const GERAL: Pose = { s: 1, fx: 50, fy: 50, ox: 0, oy: 0 };
const poseDe = (k: number): Pose =>
  k < 0 || k >= N ? GERAL : { s: ESCALA, fx: PONTOS[k].x, fy: PONTOS[k].y, ox: ladoDe(PONTOS[k]) === "esq" ? 0.13 : -0.13, oy: -0.05 };

function mistura(a: Pose, b: Pose, t: number): Pose {
  const l = (x: number, y: number) => x + (y - x) * t;
  // entre dois pontos a câmera recua um pouco no meio do caminho (dolly), em vez de deslizar colada
  const recuo = a.s > 1 && b.s > 1 ? 0.3 * Math.sin(Math.PI * t) : 0;
  return { s: l(a.s, b.s) - recuo, fx: l(a.fx, b.fx), fy: l(a.fy, b.fy), ox: l(a.ox, b.ox), oy: l(a.oy, b.oy) };
}

function poseEm(p: number): Pose {
  if (p <= P_IN) return GERAL;
  if (p >= P_OUT) return mistura(poseDe(N - 1), GERAL, curva(Math.min(1, (p - P_OUT) / (1 - P_OUT))));
  const r = (p - P_IN) / JAN;
  const k = Math.min(N - 1, Math.floor(r));
  const local = r - k;
  if (local >= VIAGEM) return poseDe(k);
  return mistura(poseDe(k - 1), poseDe(k), curva(local / VIAGEM));
}

/**
 * -1 = visão geral de abertura; N = visão geral de fecho; 0..N-1 = ponto ativo. A troca acontece no meio do
 * deslocamento da câmera, para o cartão e o contador mudarem junto com a imagem.
 */
const TROCA = (VIAGEM / 2) * JAN;
const indiceEm = (p: number) =>
  p < P_IN + TROCA ? -1 : p >= P_OUT + (1 - P_OUT) / 2 ? N : Math.min(N - 1, Math.floor((p - P_IN - TROCA) / JAN));

interface Dim {
  vw: number;
  vh: number;
}
const camDim = (d: Dim) => {
  const W = Math.max(d.vw, (d.vh * 4) / 3);
  return { W, H: (W * 3) / 4 };
};
const limitar = (v: number, m: number) => Math.max(-m, Math.min(m, v));

/** Escala e translação (px) da camada câmera, sem deixar a foto descobrir o palco. */
function enquadrar(pose: Pose, d: Dim) {
  const { W, H } = camDim(d);
  const tx = limitar(pose.ox * d.vw - pose.s * (pose.fx / 100 - 0.5) * W, Math.max(0, (pose.s * W - d.vw) / 2));
  const ty = limitar(pose.oy * d.vh - pose.s * (pose.fy / 100 - 0.5) * H, Math.max(0, (pose.s * H - d.vh) / 2));
  return { s: pose.s, tx, ty };
}

/** Onde o ponto k fica na tela quando a câmera para nele. */
function pousoNaTela(k: number, d: Dim) {
  const { W, H } = camDim(d);
  const { s, tx, ty } = enquadrar(poseDe(k), d);
  return { x: d.vw / 2 + tx + s * (PONTOS[k].x / 100 - 0.5) * W, y: d.vh / 2 + ty + s * (PONTOS[k].y / 100 - 0.5) * H };
}

/** Margem lateral do Container (20/32/48/64 px, até 1440). */
const margem = (vw: number) => (vw > 1440 ? (vw - 1440) / 2 + 64 : vw >= 1280 ? 64 : vw >= 1024 ? 48 : vw >= 768 ? 32 : 20);
const CARTAO_W = 380; // spec: 360; com o texto em 17 px (régua) o cartão alarga para não passar de 5 linhas
const baseCartao = (vh: number) => Math.round(Math.min(112, Math.max(76, vh * 0.11)));

// ---------------------------------------------------------------- peças comuns
function LinkServico({ slug, tabIndex }: { slug: ServicoSlug; tabIndex?: number }) {
  const s = servicoPorSlug(slug);
  return (
    <Link
      to={`/servicos/#${slug}`}
      tabIndex={tabIndex}
      className="rotulo group/l inline-flex min-h-11 items-center gap-2 text-papel-300 transition-colors duration-200 hover:text-papel-50"
    >
      <span className="relative">
        {UI_LOCAL.servico} {s.numero} · {s.nomeCurto}
        <span
          aria-hidden
          className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-100 bg-brasa-400 transition-transform duration-200 ease-out lg:scale-x-0 lg:group-hover/l:scale-x-100"
        />
      </span>
      <ArrowRight aria-hidden size={15} strokeWidth={1.75} className="transition-transform duration-200 ease-out group-hover/l:translate-x-1" />
    </Link>
  );
}

function Cabecalho({ index, className, h2ClassName }: { index: string; className?: string; h2ClassName?: string }) {
  return (
    <div className={className}>
      <SectionLabel index={index} label={NA_PRATICA.label} />
      <SplitLines as="h2" lines={NA_PRATICA.h2.linhas} text={NA_PRATICA.h2.texto} className={`display-xl mt-5 text-papel-50 ${h2ClassName ?? ""}`} />
    </div>
  );
}

// ---------------------------------------------------------------- cena fixada (desktop)
function LinhaGuia({ k, d, cartaoH, progress }: { k: number; d: Dim; cartaoH: number; progress: MotionValue<number> }) {
  const w0 = P_IN + k * JAN;
  const w1 = w0 + JAN;
  const iniDesenho = w0 + VIAGEM * JAN;
  const opacity = useTransform(progress, [iniDesenho - 0.004, iniDesenho, w1 - 0.012, w1], [0, 1, 1, 0]);
  const lado = ladoDe(PONTOS[k]);
  const m = margem(d.vw);
  const topo = d.vh - baseCartao(d.vh) - cartaoH;
  const ax = lado === "esq" ? m + CARTAO_W : d.vw - m - CARTAO_W;
  const ay = topo + 44;
  const sx = lado === "esq" ? 1 : -1;
  const ex = ax + sx * 36;
  const alvo = pousoNaTela(k, d);
  // termina na borda do anel (r = 22 px), não no centro
  const dx = alvo.x - ex;
  const dy = alvo.y - ay;
  const dist = Math.hypot(dx, dy) || 1;
  const fx = alvo.x - (dx / dist) * 26;
  const fy = alvo.y - (dy / dist) * 26;
  return (
    <motion.g style={{ opacity }} className="text-papel-50/80">
      <circle cx={ax} cy={ay} r={2.5} fill="#E8442E" />
      <DrawPath d={`M ${ax} ${ay} L ${ex} ${ay} L ${fx} ${fy}`} progress={progress} range={[iniDesenho, iniDesenho + 0.3 * JAN]} strokeWidth={1.25} />
    </motion.g>
  );
}

function Palco({ index }: { index: string }) {
  const { progress } = usePin();
  const palco = useRef<HTMLDivElement>(null);
  const cartao = useRef<HTMLDivElement>(null);
  const visivel = useInViewport(palco);
  const [d, setD] = useState<Dim>({ vw: 1440, vh: 900 });
  const [cartaoH, setCartaoH] = useState(380);
  const [ind, setInd] = useState(() => indiceEm(progress.get()));
  const vw = useMotionValue(1440);
  const vh = useMotionValue(900);

  useEffect(() => {
    const el = palco.current;
    if (!el) return;
    const medir = () => {
      const nd = { vw: el.clientWidth, vh: el.clientHeight };
      vw.set(nd.vw);
      vh.set(nd.vh);
      setD(nd);
      if (cartao.current) setCartaoH(cartao.current.offsetHeight);
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, [vw, vh]);

  useMotionValueEvent(progress, "change", (v) => {
    const i = indiceEm(v);
    setInd((a) => (a === i ? a : i));
  });

  const cam = useTransform([progress, vw, vh] as MotionValue<number>[], ([p, w, h]: number[]) => enquadrar(poseEm(p), { vw: w, vh: h }));
  const escala = useTransform(cam, (c) => c.s);
  const tx = useTransform(cam, (c) => c.tx);
  const ty = useTransform(cam, (c) => c.ty);
  const inversa = useTransform(escala, (s) => 1 / s);

  const titOpacidade = useTransform(progress, [0.1, 0.2, P_OUT, 1], [1, 0.4, 0.4, 1]);
  // em telas baixas o título recua mais, para o cartão (embaixo à esquerda) não encostar nele
  const escalaMin = useRef(0.62);
  escalaMin.current = d.vh < 760 ? 0.5 : 0.62;
  const titEscala = useTransform(progress, (p) => {
    const e = escalaMin.current;
    if (p <= 0.1 || p >= 1) return 1;
    if (p < 0.2) return 1 - (1 - e) * ((p - 0.1) / 0.1);
    if (p <= P_OUT) return e;
    return e + (1 - e) * ((p - P_OUT) / (1 - P_OUT));
  });
  const faixaCartao = [P_IN, P_IN + TROCA, P_OUT, P_OUT + (1 - P_OUT) / 2];
  const cartaoOpacidade = useTransform(progress, faixaCartao, [0, 1, 1, 0]);
  const cartaoY = useTransform(progress, faixaCartao, [28, 0, 0, 28]);

  const ativo = Math.max(0, Math.min(N - 1, ind));
  const cartaoOculto = ind < 0 || ind >= N; // nas visões gerais o cartão está apagado: fora da árvore de acessibilidade
  const lado = ladoDe(PONTOS[ativo]);
  const m = margem(d.vw);
  const xCartao = lado === "esq" ? 0 : d.vw - 2 * m - CARTAO_W;
  const { W, H } = camDim(d);
  const estadoDe = (k: number): EstadoHotspot => (ind < 0 || ind >= N ? "geral" : k === ind ? "ativo" : "inativo");

  const irPara = (pt: PontoFoto, origem: "clique" | "foco") => {
    const k = PONTOS.indexOf(pt);
    const secao = palco.current?.closest<HTMLElement>("[data-pin-stage]");
    if (!secao || k < 0) return;
    if (origem === "foco" && k === ind) return;
    scrollToProgress(secao, P_IN + (k + VIAGEM + 0.12) * JAN);
    if (origem === "clique") pushEvent("hotspot_open", { ponto: pt.id });
  };

  const camada: CSSProperties = { width: W, height: H, left: "50%", top: "50%", translate: "-50% -50%" };
  const will = visivel ? "will-change-transform" : "";

  return (
    <div ref={palco} className="relative h-full w-full bg-noite-950">
      <figure className="absolute inset-0 m-0">
        {/* camada câmera: a foto */}
        <motion.div data-pin-layer="" aria-hidden className={`absolute ${will}`} style={{ ...camada, x: tx, y: ty, scale: escala }}>
          <Img
            id={NA_PRATICA.imagem}
            alt=""
            sizes="(min-width: 1024px) 190vw, 100vw"
            className="block h-full w-full"
            imgClassName="h-full w-full object-cover [filter:contrast(1.08)_saturate(0.92)]"
          />
        </motion.div>
        {/* véu fixo na tela (vinheta + leitura do título no canto) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(transparent_40%,rgba(5,10,18,0.85)),linear-gradient(180deg,rgba(5,10,18,0.55)_0%,rgba(5,10,18,0)_34%)]"
        />
        {/* camada câmera: os marcadores (mesma transformação; cada marcador desfaz a escala) */}
        <motion.div data-pin-layer="" className={`absolute z-[2] ${will}`} style={{ ...camada, x: tx, y: ty, scale: escala }}>
          <ul aria-label={UI_LOCAL.pontos} className="contents">
            {PONTOS.map((pt, k) => (
              <li key={pt.id} className="absolute block h-0 w-0" style={{ left: `${pt.x}%`, top: `${pt.y}%` }}>
                <motion.div className="absolute -left-[22px] -top-[22px]" style={{ scale: inversa }}>
                  <Hotspot ponto={pt} estado={estadoDe(k)} onSelect={(p) => irPara(p, "clique")} onFocus={(p) => irPara(p, "foco")} />
                </motion.div>
              </li>
            ))}
          </ul>
        </motion.div>
        <figcaption className="absolute inset-x-0 bottom-0 z-[3]">
          <Container className="pb-7">
            <p className="flex max-w-[60%] flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="rotulo text-papel-300">{UI.fotoAcervo.toUpperCase()}</span>
              <span className="text-[14px] leading-snug text-papel-500">{legendaSemCredito}</span>
            </p>
          </Container>
        </figcaption>
      </figure>

      {/* linhas-guia (do cartão ao ponto) */}
      <svg aria-hidden className="pointer-events-none absolute inset-0 z-[3] h-full w-full" viewBox={`0 0 ${d.vw} ${d.vh}`}>
        {PONTOS.map((pt, k) => (
          <LinhaGuia key={pt.id} k={k} d={d} cartaoH={cartaoH} progress={progress} />
        ))}
      </svg>

      {/* rótulo e H2 no canto superior esquerdo */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[4]">
        <Container className="pt-28">
          <motion.div style={{ opacity: titOpacidade, scale: titEscala, transformOrigin: "0% 0%" }} className="w-[min(31vw,460px)]">
            <Cabecalho index={index} h2ClassName="text-[length:clamp(2.5rem,min(4.6vw,8.4svh),4.75rem)]" />
          </motion.div>
        </Container>
      </div>

      {/* cartão de legenda único: Reel dos 5 textos, troca de lado por mola */}
      <motion.div
        aria-hidden={cartaoOculto || undefined}
        className="absolute z-[5]"
        style={{ left: m, bottom: baseCartao(d.vh), width: CARTAO_W, opacity: cartaoOpacidade, y: cartaoY }}
      >
        <motion.div
          ref={cartao}
          initial={false}
          animate={{ x: xCartao }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          className="rounded-r-md border border-noite-700 bg-noite-900/[0.92] p-6 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]"
        >
          <Reel count={N} index={ativo} className="h-[292px]" label={NA_PRATICA.label}>
            {PONTOS.map((pt, k) => (
              <div key={pt.id} className="flex h-full flex-col">
                <p className="rotulo flex items-start gap-2 text-papel-500">
                  <span className="shrink-0 text-brasa-300">{numeroPonto(pt.id)}</span>
                  <span aria-hidden className="shrink-0 text-papel-50/25">
                    —
                  </span>
                  <span className="min-w-0">{pt.nome}</span>
                </p>
                <SplitWords as="h3" text={pt.titulo} className="titulo mt-3 text-balance text-papel-50" replayKey={k === ativo ? `${k}-on` : k} />
                <p className="mt-3 text-[17px] leading-[1.55] text-papel-300">{pt.texto}</p>
                <div className="mt-auto pt-2">
                  <LinkServico slug={pt.servico} tabIndex={k === ativo && !cartaoOculto ? undefined : -1} />
                </div>
              </div>
            ))}
          </Reel>
        </motion.div>
      </motion.div>

      {/* contador "01 / 05" */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[4]">
        <Container className="flex justify-end pb-7">
          <div className="mr-14 flex items-center gap-2 font-mono text-[15px] font-medium tracking-[0.12em] text-papel-500">
            <Reel count={N} index={ativo} className="h-[1.3em] w-[2.4ch] leading-[1.3em] text-papel-50">
              {PONTOS.map((pt) => (
                <span key={pt.id} className="block">
                  {numeroPonto(pt.id)}
                </span>
              ))}
            </Reel>
            <span>/ {numeroPonto(N)}</span>
          </div>
        </Container>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- sequência (celular, tablet, reduzido, sem JS)
/** Recorte ampliado da foto centrado no ponto (a "câmera" parada), com o mesmo limite de enquadramento. */
function Recorte({ pt }: { pt: PontoFoto }) {
  const s = ESCALA;
  // caixa 16:10; camada interna 4:3 da largura da caixa, centrada. Percentuais da própria camada.
  const tx = limitar(-(pt.x - 50) * s, ((s - 1) / 2) * 100);
  const ty = limitar(-(pt.y - 50) * s, ((s - 0.625 / 0.75) / 2) * 100);
  const mx = 50 + tx + s * (pt.x - 50);
  const my = 50 + (ty + s * (pt.y - 50)) * (0.75 / 0.625);
  return (
    <div className="relative aspect-[16/10]">
      <ClipReveal radius={18} className="absolute inset-0 overflow-clip">
        <div className="absolute left-0 top-1/2 aspect-[4/3] w-full" style={{ translate: "0 -50%" }}>
          <div className="h-full w-full" style={{ transform: `translate(${tx}%, ${ty}%) scale(${s})` }}>
            <Img
              id={NA_PRATICA.imagem}
              alt=""
              sizes="(max-width: 1023px) 170vw, 100vw"
              className="block h-full w-full"
              imgClassName="h-full w-full object-cover [filter:contrast(1.08)_saturate(0.92)]"
            />
          </div>
        </div>
        <span aria-hidden className="absolute inset-0 bg-[radial-gradient(transparent_55%,rgba(5,10,18,0.55))]" />
        <span
          aria-hidden
          className="absolute block h-10 w-10 rounded-full border-[1.5px] border-papel-50 shadow-[0_0_0_4px_rgba(5,10,18,0.35)]"
          style={{ left: `${mx}%`, top: `${my}%`, translate: "-50% -50%" }}
        />
      </ClipReveal>
      <FocusBrackets mode="enter" offset={8} size={18} />
    </div>
  );
}

function Sequencia({ index }: { index: string }) {
  const irPara = (pt: PontoFoto) => {
    scrollToHash(`#na-pratica-ponto-${pt.id}`);
    pushEvent("hotspot_open", { ponto: pt.id });
  };
  return (
    <Container className="py-24 lg:py-40">
      <div className="grid grid-cols-1 gap-x-6 lg:grid-cols-12">
        <Cabecalho index={index} className="lg:col-span-10" />

        <div className="mt-12 lg:col-span-7 lg:mt-16">
          <figure className="lg:sticky lg:top-28">
            <div className="relative aspect-[4/3]">
              <ClipReveal radius={28} className="absolute inset-0 overflow-clip">
                <Img
                  id={NA_PRATICA.imagem}
                  alt={IMAGENS[NA_PRATICA.imagem].alt}
                  sizes="(min-width: 1024px) 56vw, 100vw"
                  className="block h-full w-full"
                  imgClassName="h-full w-full object-cover [filter:contrast(1.08)_saturate(0.92)]"
                />
                <span aria-hidden className="absolute inset-0 bg-[radial-gradient(transparent_50%,rgba(5,10,18,0.6))]" />
              </ClipReveal>
              <ul aria-label={UI_LOCAL.pontos} className="absolute inset-0">
                {PONTOS.map((pt, k) => (
                  <li key={pt.id} className="absolute block h-0 w-0" style={{ left: `${pt.x}%`, top: `${pt.y}%` }}>
                    <Reveal preset="carimbo" delay={0.55 + k * 0.08} className="absolute -left-[22px] -top-[22px]">
                      {/* no celular a foto tem ~350 px: o desenho encolhe para 32 px, o alvo de toque continua com 44 */}
                      <Hotspot ponto={pt} onSelect={irPara} className="[@media(max-width:767px)]:[&>svg]:scale-[0.72]" />
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
            <figcaption className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-papel-500">
              <span className="text-[15px] leading-snug text-papel-300">{legendaSemCredito}</span>
              <span className="rotulo">{UI.fotoAcervo.toUpperCase()}</span>
            </figcaption>
          </figure>
        </div>

        <ol className="mt-14 flex flex-col gap-14 md:mt-16 lg:col-span-5 lg:mt-16 lg:gap-0">
          {PONTOS.map((pt) => (
            <li key={pt.id} id={`na-pratica-ponto-${pt.id}`} className="lg:border-t lg:border-noite-700 lg:py-8 lg:first:border-t-0 lg:first:pt-0">
              <div className="mb-6 lg:hidden">
                <Recorte pt={pt} />
              </div>
              <Reveal y={20}>
                <p className="rotulo flex items-center gap-2 text-papel-500">
                  <span className="text-brasa-300">{numeroPonto(pt.id)}</span>
                  <span aria-hidden className="text-papel-50/25">
                    —
                  </span>
                  <span>{pt.nome}</span>
                </p>
                <h3 className="titulo mt-3 text-balance text-papel-50">{pt.titulo}</h3>
                <p className="corpo mt-3 text-papel-300">{pt.texto}</p>
                <div className="mt-2">
                  <LinkServico slug={pt.servico} />
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </Container>
  );
}

function Cena({ index }: { index: string }) {
  const { active } = usePin();
  return active ? <Palco index={index} /> : <Sequencia index={index} />;
}

// ---------------------------------------------------------------- seção
export interface NaPraticaProps {
  id?: string;
  index?: string;
}

export default function NaPratica({ id = "na-pratica", index = SECOES.naPratica.index }: NaPraticaProps = {}) {
  return (
    <section id={id} data-section="H4" aria-label={linhasTexto(NA_PRATICA.h2.linhas)} className="grain relative bg-noite-950">
      <PinStage mode="pin" heightClassName="h-[300vh]">
        <Cena index={index} />
      </PinStage>
      <Container className="pb-24 pt-4 lg:pb-40 lg:pt-24">
        <BlocoCilindros />
        <ReservedSlot id="obras" className="mt-10 lg:mt-14" aspect="16/6" />
      </Container>
    </section>
  );
}
