import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { NA_PRATICA, SECOES, linhasTexto, servicoPorSlug, type Hotspot as PontoFoto, type ServicoSlug } from "../../data/site";
import { IMAGENS } from "../../data/imagens.gen";
import { Link } from "../../lib/router";
import { pushEvent } from "../../lib/track";
import { scrollToHash, scrollToY } from "../../lib/smooth-scroll";
import { DUR, EASE_IN_OUT, EASE_OUT, PinStage, Reel, Reveal, SplitLines, ease, usePin } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { Img } from "../../components/ui/Img";
import { ReservedSlot } from "../../components/ui/ReservedSlot";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { BlocoCilindros } from "./napratica/Chamadas";
import { Hotspot, numeroPonto, type EstadoHotspot } from "./napratica/Hotspot";

/*
 * H4 · Na prática (design-final §9 H4, recalibrado por qa/AJUSTES-SOBRIEDADE.md).
 * Desktop (≥ 1024 × 640): cena fixada curta (168vh, 0,68 tela presa). A foto real fica num quadro 4:3 da grade, e
 * uma "câmera" passeia pelos 5 pontos dela: a rolagem só escolhe o ponto, e a câmera vai até ele por tempo
 * (0,8 s), então a cena pode ser curta sem a foto "correr". À esquerda, a lista dos 5 pontos e o texto do ponto
 * ativo. O passeio começa um pouco antes de a cena prender (topo a 15% da tela).
 * Celular, tablet e tela baixa: sequência normal (foto com os 5 marcadores e a lista com a miniatura de cada ponto).
 * Depois: o bloco dos cilindros (250+), compacto.
 */

const PONTOS: readonly PontoFoto[] = NA_PRATICA.pontos;
const N = PONTOS.length;
/** Zoom máximo da câmera (era 1,9 e borrava): com o quadro de ~750 px e o arquivo de 2200, densidade ≥ 1,7. */
const ESCALA = 1.65;
/** Fração do passeio em visão geral (a foto inteira com os 5 números) antes do 1º ponto. */
const T0 = 0.1;
/** O passeio começa com o topo da cena a 15% da altura da tela, ainda entrando. */
const ANTES = 0.15;
const H2 = "display-xl text-[clamp(2.25rem,4.4vw,4rem)] text-balance text-papel-50";
/** Na cena o H2 cabe em 2 linhas na coluna de 5 (e encolhe nas telas baixas). */
const H2_CENA = "display-xl text-[clamp(2.25rem,min(3.9vw,6.6svh),3.6rem)] text-balance text-papel-50";
const UI_LOCAL = { servico: "Serviço", pontos: "Pontos da foto" } as const;

// ---------------------------------------------------------------- câmera
interface Pose {
  s: number; // escala
  x: number; // translação, em % do quadro
  y: number;
}
const GERAL: Pose = { s: 1, x: 0, y: 0 };
const LIMITE = ((ESCALA - 1) / 2) * 100; // a foto nunca descobre o quadro
const limitar = (v: number) => Math.max(-LIMITE, Math.min(LIMITE, v));
/** Ponto k no centro do quadro (o mais perto possível, sem descobrir a borda). */
const poseDe = (k: number): Pose => (k < 0 || k >= N ? GERAL : { s: ESCALA, x: limitar(-ESCALA * (PONTOS[k].x - 50)), y: limitar(-ESCALA * (PONTOS[k].y - 50)) });

const indiceEm = (t: number) => (t < T0 ? -1 : Math.min(N - 1, Math.floor(((t - T0) / (1 - T0)) * N)));
/** Meio da janela do ponto k (para onde o clique leva). */
const tDe = (k: number) => T0 + ((k + 0.5) / N) * (1 - T0);

// ---------------------------------------------------------------- peças comuns
function LinkServico({ slug, tabIndex }: { slug: ServicoSlug; tabIndex?: number }) {
  const s = servicoPorSlug(slug);
  return (
    <Link
      to={`/servicos/#${slug}`}
      tabIndex={tabIndex}
      className="group/l inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-papel-300 transition-colors duration-200 hover:text-papel-50"
    >
      <span className="underline decoration-papel-50/25 underline-offset-4 transition-[text-decoration-color] duration-200 group-hover/l:decoration-brasa-400">
        {UI_LOCAL.servico} {s.numero} · {s.nomeCurto}
      </span>
      <ArrowRight aria-hidden size={16} strokeWidth={1.75} className="transition-transform duration-200 ease-out group-hover/l:translate-x-0.5" />
    </Link>
  );
}

function Cabecalho({ index, className, h2 = H2 }: { index: string; className?: string; h2?: string }) {
  return (
    <div className={className}>
      <SectionLabel index={index} label={NA_PRATICA.label} />
      <SplitLines as="h2" lines={NA_PRATICA.h2.linhas} text={NA_PRATICA.h2.texto} className={`${h2} mt-5`} />
    </div>
  );
}

// ---------------------------------------------------------------- cena fixada (desktop)
function Palco({ index }: { index: string }) {
  const palco = useRef<HTMLDivElement>(null);
  const [ind, setInd] = useState(-1);
  const { scrollY } = useScroll();

  // t do passeio: 0 com o topo da cena a 15% da tela; 1 quando a cena solta
  const geometria = () => {
    const sec = palco.current?.closest<HTMLElement>("[data-pin-stage]");
    if (!sec) return null;
    const vh = window.innerHeight;
    const ini = vh * ANTES;
    return { topo: sec.getBoundingClientRect().top, ini, total: ini + sec.offsetHeight - vh };
  };
  const atualizar = () => {
    const g = geometria();
    if (!g || g.total <= 0) return;
    const i = indiceEm((g.ini - g.topo) / g.total);
    setInd((a) => (a === i ? a : i));
  };
  useMotionValueEvent(scrollY, "change", atualizar);
  useEffect(() => {
    atualizar();
    window.addEventListener("resize", atualizar);
    return () => window.removeEventListener("resize", atualizar);
  }, []);

  // câmera por tempo: a rolagem escolhe o ponto, a câmera vai até ele em 0,8 s
  const s = useMotionValue(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  useEffect(() => {
    const alvo = poseDe(ind);
    const de = s.get();
    const opts = { duration: DUR.longa, ease: ease(EASE_IN_OUT) };
    // entre dois pontos a câmera recua um pouco no meio do caminho, em vez de deslizar colada
    const escalas = de > 1.01 && alvo.s > 1.01 ? [de, Math.min(de, alvo.s) - 0.22, alvo.s] : alvo.s;
    const a = [animate(s, escalas, opts), animate(x, alvo.x, opts), animate(y, alvo.y, opts)];
    return () => a.forEach((c) => c.stop());
  }, [ind, s, x, y]);
  const xp = useTransform(x, (v) => `${v}%`);
  const yp = useTransform(y, (v) => `${v}%`);
  const inversa = useTransform(s, (v) => 1 / v);

  const irPara = (k: number, origem: "clique" | "foco") => {
    const sec = palco.current?.closest<HTMLElement>("[data-pin-stage]");
    const g = geometria();
    if (!sec || !g) return;
    if (origem === "foco" && k === ind) return;
    scrollToY(window.scrollY + g.topo - (g.ini - tDe(k) * g.total), { duration: 0.9 });
    if (origem === "clique") pushEvent("hotspot_open", { ponto: PONTOS[k].id });
  };

  const estadoDe = (k: number): EstadoHotspot => (ind < 0 ? "geral" : k === ind ? "ativo" : "inativo");
  const camada = { x: xp, y: yp, scale: s };
  const ativo = Math.max(0, ind);
  const semTexto = ind < 0;

  return (
    <div ref={palco} className="relative h-full w-full">
      <Container className="grid h-full grid-cols-12 items-center gap-x-6 pb-8 pt-[92px] [@media(min-height:820px)]:pb-12 [@media(min-height:820px)]:pt-[104px]">
        {/* lista dos pontos e texto do ponto ativo */}
        <div className="col-span-6 flex min-h-0 flex-col justify-center xl:col-span-5 xl:pr-6">
          <Cabecalho index={index} h2={H2_CENA} />
          <Reveal as="ol" y={16} delay={0.1} className="mt-7 border-t border-noite-700 [@media(min-height:820px)]:mt-10">
            {PONTOS.map((pt, k) => {
              const on = k === ind;
              return (
                <li key={pt.id} className="border-b border-noite-700">
                  <button
                    type="button"
                    onClick={() => irPara(k, "clique")}
                    aria-current={on ? "step" : undefined}
                    className="group flex min-h-9 w-full items-baseline gap-4 py-1.5 text-left [@media(min-height:700px)]:min-h-10 [@media(min-height:700px)]:py-2 [@media(min-height:820px)]:min-h-11 [@media(min-height:820px)]:py-2.5"
                  >
                    <span className={`tnum w-6 shrink-0 text-[15px] font-semibold transition-colors duration-300 ${on ? "text-brasa-300" : "text-papel-500"}`}>
                      {numeroPonto(pt.id)}
                    </span>
                    <span className={`text-[17px] font-medium leading-snug transition-colors duration-300 ${on ? "text-papel-50" : "text-papel-300 group-hover:text-papel-50"}`}>
                      {pt.titulo}
                    </span>
                  </button>
                </li>
              );
            })}
          </Reveal>
          <motion.div
            aria-hidden={semTexto || undefined}
            className="mt-5 [@media(min-height:820px)]:mt-7"
            initial={false}
            animate={{ opacity: semTexto ? 0 : 1, y: semTexto ? 12 : 0 }}
            transition={{ duration: DUR.base, ease: ease(EASE_OUT) }}
          >
            <Reel count={N} index={ativo} className="-mx-2 h-[176px] px-2 xl:h-[150px]" itemClassName="min-h-0 overflow-clip" label={NA_PRATICA.label}>
              {PONTOS.map((pt, k) => (
                <div key={pt.id}>
                  <p className="text-[17px] leading-[1.6] text-papel-300">{pt.texto}</p>
                  <div className="mt-1.5">
                    <LinkServico slug={pt.servico} tabIndex={k === ativo && !semTexto ? undefined : -1} />
                  </div>
                </div>
              ))}
            </Reel>
          </motion.div>
        </div>

        {/* a foto num quadro 4:3; câmera e marcadores com a mesma transformação */}
        <figure className="col-span-6 m-0 flex min-h-0 flex-col items-end xl:col-span-7">
          <Reveal preset="fade" className="w-full max-w-[calc((100svh-188px)*4/3)]">
            <div className="relative aspect-[4/3] w-full overflow-clip rounded-[16px] bg-noite-900 ring-1 ring-papel-50/10">
              <motion.div aria-hidden className="absolute inset-0 will-change-transform" style={camada}>
                <Img id={NA_PRATICA.imagem} alt="" sizes="(min-width: 1024px) 1800px, 100vw" className="block h-full w-full" imgClassName="h-full w-full object-cover" />
              </motion.div>
              <motion.div className="absolute inset-0" style={camada}>
                <ul aria-label={UI_LOCAL.pontos} className="contents">
                  {PONTOS.map((pt, k) => (
                    <li key={pt.id} className="absolute block h-0 w-0" style={{ left: `${pt.x}%`, top: `${pt.y}%` }}>
                      <motion.div className="absolute -left-[22px] -top-[22px]" style={{ scale: inversa }}>
                        <Hotspot ponto={pt} estado={estadoDe(k)} onSelect={() => irPara(k, "clique")} onFocus={() => irPara(k, "foco")} />
                      </motion.div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
            <figcaption className="mt-3 text-[14px] leading-snug text-papel-500">{NA_PRATICA.legenda}</figcaption>
          </Reveal>
        </figure>
      </Container>
    </div>
  );
}

// ---------------------------------------------------------------- sequência (celular, tablet, tela baixa, sem JS)
const MINI = 52; // lado da miniatura (px)
const ZOOM_MINI = 3.4; // a miniatura mostra ~1/3 da largura da foto em volta do ponto

/** Miniatura do ponto: a "câmera" parada nele. Entra com a foto assentando (scale 1,12 → 1). */
function Miniatura({ pt }: { pt: PontoFoto }) {
  const W = MINI * ZOOM_MINI;
  const H = W * 0.75;
  const left = Math.min(0, Math.max(MINI - W, MINI / 2 - (pt.x / 100) * W));
  const top = Math.min(0, Math.max(MINI - H, MINI / 2 - (pt.y / 100) * H));
  return (
    <div aria-hidden className="relative shrink-0 overflow-clip rounded-[10px] bg-noite-900 ring-1 ring-papel-50/10" style={{ width: MINI, height: MINI }}>
      <motion.div
        className="absolute"
        style={{ left, top, width: W, height: H, transformOrigin: `${pt.x}% ${pt.y}%` }}
        initial={{ scale: 1.12, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: DUR.longa, ease: ease(EASE_OUT) }}
      >
        <Img id={NA_PRATICA.imagem} alt="" sizes={`${Math.round(W)}px`} className="block h-full w-full" imgClassName="h-full w-full object-cover" />
      </motion.div>
    </div>
  );
}

function Sequencia({ index }: { index: string }) {
  const irPara = (pt: PontoFoto) => {
    scrollToHash(`#na-pratica-ponto-${pt.id}`);
    pushEvent("hotspot_open", { ponto: pt.id });
  };
  return (
    <Container className="pb-12 pt-16 md:pt-20 lg:pb-16 lg:pt-24">
      <div className="grid grid-cols-1 gap-x-6 lg:grid-cols-12">
        <Cabecalho index={index} className="lg:col-span-12" />

        <figure className="m-0 mt-8 lg:col-span-7 lg:mt-12">
          <div className="relative lg:sticky lg:top-28">
            <Reveal preset="fade">
              <div className="relative aspect-[4/3] overflow-clip rounded-[14px] bg-noite-900 ring-1 ring-papel-50/10">
                <Img
                  id={NA_PRATICA.imagem}
                  alt={IMAGENS[NA_PRATICA.imagem].alt}
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="block h-full w-full"
                  imgClassName="h-full w-full object-cover"
                />
              </div>
            </Reveal>
            <ul aria-label={UI_LOCAL.pontos} className="pointer-events-none absolute inset-x-0 top-0 aspect-[4/3]">
              {PONTOS.map((pt, k) => (
                <li key={pt.id} className="pointer-events-auto absolute block h-0 w-0" style={{ left: `${pt.x}%`, top: `${pt.y}%` }}>
                  <Reveal preset="fade" delay={0.3 + k * 0.06} className="absolute -left-[22px] -top-[22px]">
                    {/* no celular a foto tem ~350 px: o desenho encolhe para 32 px, o alvo de toque continua com 44 */}
                    <Hotspot ponto={pt} onSelect={irPara} className="[@media(max-width:767px)]:[&>svg]:scale-[0.72]" />
                  </Reveal>
                </li>
              ))}
            </ul>
            <figcaption className="mt-3 text-[14px] leading-snug text-papel-500">{NA_PRATICA.legenda}</figcaption>
          </div>
        </figure>

        <ol className="mt-6 grid grid-cols-1 gap-x-8 md:grid-cols-2 lg:col-span-5 lg:mt-12 lg:block">
          {PONTOS.map((pt) => (
            <li key={pt.id} id={`na-pratica-ponto-${pt.id}`} className="scroll-mt-24 border-t border-noite-700 py-4 first:border-t-0 md:[&:nth-child(2)]:border-t-0 lg:[&:nth-child(2)]:border-t lg:py-6">
              <Reveal y={16}>
                <div className="flex items-center gap-4">
                  <div className="lg:hidden">
                    <Miniatura pt={pt} />
                  </div>
                  <h3 className="text-[18px] font-semibold leading-snug text-papel-50 lg:text-[19px]">
                    <span className="tnum mr-2.5 text-brasa-300">{numeroPonto(pt.id)}</span>
                    {pt.titulo}
                  </h3>
                </div>
                <p className="mt-2.5 text-[16px] leading-[1.6] text-papel-300 lg:mt-1.5 lg:text-[17px]">{pt.texto}</p>
                <LinkServico slug={pt.servico} />
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
      <PinStage mode="pin" heightClassName="h-[168vh]">
        <Cena index={index} />
      </PinStage>
      <Container className="pb-16 lg:pb-20">
        <BlocoCilindros />
        <ReservedSlot id="obras" className="mt-10 lg:mt-14" aspect="16/6" />
      </Container>
    </section>
  );
}
