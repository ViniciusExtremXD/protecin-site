import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, cubicBezier, motion, useInView, useMotionValue, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";
import { DIAGRAMA, linhasTexto, servicoPorSlug, type Camada, type ServicoSlug } from "../../data/site";
import { Link } from "../../lib/router";
import { motionPrefAtual } from "../../lib/motion-pref";
import { pushEvent } from "../../lib/track";
import { scrollToProgress } from "../../lib/smooth-scroll";
import { EASE_IN_OUT, FocusBrackets, Odometer, PinStage, Reveal, RevealGroup, RevealItem, SPRING, SplitLines, StampBadge, ease, usePin } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { IsoDiagram } from "./diagrama/IsoDiagram";
import { CENTRO, FOCOS, VIEWBOX_CENA, transformCamera } from "./diagrama/iso";

/*
 * /servicos/ · Diagrama isométrico "Camada por camada" (design-final §10.2.1, enxerto D2, P1) + qa/AJUSTES-DESIGN.md.
 * Desktop (≥ 1024 e ≥ 640 de altura, movimento completo): cena fixada de 340vh (2,4 telas de rolagem; a spec pedia
 * 500vh, acima do teto de 2,5 telas do QA). Painel à esquerda (rótulo, H2 que encolhe, trilho C-01…Engenharia e
 * bloco da camada ativa), SVG à direita com câmera, chips das camadas na base.
 * Celular, tablet, tela baixa, reduzido e sem JS: fluxo normal (nada fica preso): diagrama inteiro, que se desenha
 * camada por camada por tempo quando entra na tela, e os 7 cartões em sequência com reveals.
 */

const CAMADAS: readonly Camada[] = DIAGRAMA.camadas;
const N = CAMADAS.length; // 7 (C-01..C-06 + Engenharia)
const ABERTURA = 0.08;
const FAIXAS: readonly [number, number][] = [
  [0.08, 0.2],
  [0.2, 0.33],
  [0.33, 0.46],
  [0.46, 0.6],
  [0.6, 0.72],
  [0.72, 0.85],
  [0.85, 1],
];
const ESCALA = 1.12; // a spec pede 1,15; o prédio (731 de altura) não cabe no quadro de 820 acima de ~1,12
const curva = cubicBezier(0.65, 0, 0.35, 1);
const UI_LOCAL = { camadas: "Camadas do diagrama" } as const;
const ESCALA_H2 = 0.45; // o H2 encolhe para perto do tamanho "titulo" depois da abertura

/** -1 = abertura; 0..5 = C-01..C-06; 6 = Engenharia (todas acesas). */
function ativoEm(p: number): number {
  if (p < ABERTURA) return -1;
  for (let i = 0; i < N; i++) if (p < FAIXAS[i][1]) return i;
  return N - 1;
}
/** Quantas camadas já têm os pictogramas de pé (entram ao cruzar 20% da faixa). */
function pictosEm(p: number): number {
  let n = 0;
  for (let i = 0; i < 6; i++) if (p >= FAIXAS[i][0] + 0.2 * (FAIXAS[i][1] - FAIXAS[i][0])) n = i + 1;
  return n;
}

interface Pose {
  s: number;
  fx: number;
  fy: number;
}
const GERAL: Pose = { s: 1, fx: CENTRO[0], fy: CENTRO[1] };
const poseDe = (i: number): Pose => (i < 0 || i >= 6 ? GERAL : { s: ESCALA, fx: FOCOS[i][0], fy: FOCOS[i][1] });
function cameraEm(p: number): string {
  const i = ativoEm(p);
  if (i < 0) return transformCamera(1, CENTRO);
  const [a, b] = FAIXAS[i];
  const t = Math.min(1, (p - a) / (0.28 * (b - a)));
  const de = poseDe(i - 1);
  const para = poseDe(i);
  const e = curva(t);
  const s = de.s + (para.s - de.s) * e;
  return transformCamera(s, [de.fx + (para.fx - de.fx) * e, de.fy + (para.fy - de.fy) * e]);
}

// ---------------------------------------------------------------- peças comuns
const COR_AMOSTRA: Record<Camada["cor"], ReactNode> = {
  brasa: <span className="h-[3px] w-8 rounded-full bg-brasa-400" />,
  alarme: (
    <span className="flex items-center gap-1">
      <span className="h-px w-6 border-t border-dashed border-marinho-300" />
      <span className="h-1.5 w-1.5 rounded-full bg-brasa-300" />
    </span>
  ),
  papel: <span className="h-[3px] w-8 rounded-full bg-papel-50" />,
  fotolum: (
    <span className="flex items-center gap-1">
      <span className="h-[3px] w-4 rounded-full bg-fotolum shadow-[0_0_6px_#D8F36A]" />
      <span className="h-px w-4 border-t border-dashed border-papel-50" />
    </span>
  ),
  todas: (
    <span className="flex items-center gap-1">
      <span className="h-[3px] w-2.5 rounded-full bg-brasa-400" />
      <span className="h-[3px] w-2.5 rounded-full bg-marinho-300" />
      <span className="h-[3px] w-2.5 rounded-full bg-papel-50" />
      <span className="h-[3px] w-2.5 rounded-full bg-fotolum" />
    </span>
  ),
};

function ChipServico({ slug }: { slug: ServicoSlug }) {
  const s = servicoPorSlug(slug);
  return (
    <Link
      to={`/servicos/#${slug}`}
      className="group/c inline-flex min-h-11 items-center gap-2 rounded-full border border-marinho-300/35 bg-marinho-800/60 px-4 text-[14px] font-medium leading-tight text-papel-50 transition-colors duration-200 hover:border-papel-50/70 hover:bg-marinho-700 lg:min-h-[38px]"
    >
      <span className="font-mono text-[12px] tracking-[0.08em] text-marinho-300 transition-colors duration-200 group-hover/c:text-papel-50">{s.numero}</span>
      {s.nomeCurto}
    </Link>
  );
}

/** No mundo azul o papel-500 do SectionLabel fica abaixo de AA (4,26): o rótulo passa a marinho-300. */
function Rotulo({ index }: { index: string }) {
  return (
    <div className="[&_p]:!text-marinho-300">
      <SectionLabel index={index} label={DIAGRAMA.label} />
    </div>
  );
}

function FundoAzul() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 bg-mundo-azul">
      <div className="bg-blueprint h-full w-full" />
    </div>
  );
}

/**
 * Bloco da camada ativa: o anterior sai (y −12, opacidade 0, 200 ms) e o novo entra (y 12 → 0, 400 ms).
 * Troca própria em vez de AnimatePresence mode="wait", que na rolagem rápida ficava preso num filho antigo
 * (código C-04 com o texto de C-06): aqui a troca sempre mostra a camada mais recente.
 */
function BlocoCamada({ indice }: { indice: number }) {
  const [mostrado, setMostrado] = useState(indice);
  const [saindo, setSaindo] = useState(false);
  const alvo = useRef(indice);
  alvo.current = indice;
  useEffect(() => {
    if (indice === mostrado) {
      setSaindo(false);
      return;
    }
    setSaindo(true);
    const t = window.setTimeout(() => {
      setMostrado(alvo.current);
      setSaindo(false);
    }, 200);
    return () => window.clearTimeout(t);
  }, [indice, mostrado]);
  const camada = CAMADAS[mostrado];
  return (
    <motion.div
      key={camada.id}
      initial={{ opacity: 0, y: 12 }}
      animate={saindo ? { opacity: 0, y: -12, transition: { duration: 0.2, ease: ease(EASE_IN_OUT) } } : { opacity: 1, y: 0, transition: { duration: 0.4, ease: ease(EASE_IN_OUT) } }}
    >
      <h3 className="titulo mt-2 text-papel-50">{camada.nome}</h3>
      {camada.textos.map((tx) => (
        <p key={tx} className="mt-3 text-[17px] leading-[1.55] text-papel-300">
          {tx}
        </p>
      ))}
      <div className="mt-4 flex flex-wrap gap-2">
        {camada.servicos.map((s) => (
          <ChipServico key={s} slug={s} />
        ))}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------- cena fixada (desktop)
function Cena({ index }: { index: string }) {
  const { progress } = usePin();
  const palco = useRef<HTMLDivElement>(null);
  const tituloRef = useRef<HTMLDivElement>(null);
  const colunaRef = useRef<HTMLDivElement>(null);
  const [topoTour, setTopoTour] = useState(300);
  const [caixa, setCaixa] = useState({ w: 700, h: 652 });
  const [estado, setEstado] = useState(() => ({ ativo: ativoEm(progress.get()), pictos: pictosEm(progress.get()) }));

  useMotionValueEvent(progress, "change", (v) => {
    const ativo = ativoEm(v);
    const pictos = pictosEm(v);
    setEstado((e) => (e.ativo === ativo && e.pictos === pictos ? e : { ativo, pictos }));
  });

  // o bloco da camada começa logo abaixo do H2 já encolhido (escala 0,5)
  useEffect(() => {
    const el = tituloRef.current;
    if (!el) return;
    const medir = () => setTopoTour(Math.round(el.offsetTop + el.offsetHeight * ESCALA_H2 + 22));
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // caixa do desenho na proporção do viewBox, o maior possível na coluna (as cantoneiras finais abraçam o prédio)
  useEffect(() => {
    const el = colunaRef.current;
    if (!el) return;
    const r = VIEWBOX_CENA.w / VIEWBOX_CENA.h;
    const medir = () => {
      const w = Math.min(el.clientWidth, el.clientHeight * r);
      setCaixa({ w: Math.round(w), h: Math.round(w / r) });
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const estrutura = useTransform(progress, [0, ABERTURA], [0, 1]);
  const c1 = useTransform(progress, [FAIXAS[0][0], FAIXAS[0][0] + 0.6 * (FAIXAS[0][1] - FAIXAS[0][0])], [0, 1]);
  const c2 = useTransform(progress, [FAIXAS[1][0], FAIXAS[1][0] + 0.6 * (FAIXAS[1][1] - FAIXAS[1][0])], [0, 1]);
  const c3 = useTransform(progress, [FAIXAS[2][0], FAIXAS[2][0] + 0.6 * (FAIXAS[2][1] - FAIXAS[2][0])], [0, 1]);
  const c4 = useTransform(progress, [FAIXAS[3][0], FAIXAS[3][0] + 0.6 * (FAIXAS[3][1] - FAIXAS[3][0])], [0, 1]);
  const c5 = useTransform(progress, [FAIXAS[4][0], FAIXAS[4][0] + 0.6 * (FAIXAS[4][1] - FAIXAS[4][0])], [0, 1]);
  const c6 = useTransform(progress, [FAIXAS[5][0], FAIXAS[5][0] + 0.6 * (FAIXAS[5][1] - FAIXAS[5][0])], [0, 1]);
  const camera = useTransform(progress, cameraEm);

  const escalaTitulo = useTransform(progress, [0.035, 0.085], [1, ESCALA_H2]);
  const corpoOpacidade = useTransform(progress, [0.02, 0.06], [1, 0]);
  const tourOpacidade = useTransform(progress, [0.06, 0.095], [0, 1]);
  const tourY = useTransform(progress, [0.06, 0.095], [16, 0]);
  const trilho = useTransform(progress, [ABERTURA, 1], [0, 1]);

  const { ativo, pictos } = estado;
  const final = ativo === N - 1;
  const camada = CAMADAS[Math.max(0, ativo)];
  const visiveis = [true, ...[1, 2, 3, 4, 5, 6].map((c) => pictos >= c)];
  const apagadas = [false, ...[1, 2, 3, 4, 5, 6].map((c) => !final && ativo > c - 1)];

  const irPara = (i: number) => {
    const secao = palco.current?.closest<HTMLElement>("[data-pin-stage]");
    if (!secao) return;
    const [a, b] = FAIXAS[i];
    scrollToProgress(secao, a + 0.62 * (b - a));
    pushEvent("diagram_layer", { layer: CAMADAS[i].id });
  };

  return (
    <div ref={palco} className="relative h-full w-full overflow-clip">
      <FundoAzul />
      <Container className="relative grid h-full grid-cols-12 gap-x-6 pb-[80px] pt-24 [@media(min-height:800px)]:pt-28">
        {/* painel */}
        <div className="relative col-span-5 xl:col-span-4">
          <Rotulo index={index} />
          <motion.div ref={tituloRef} className="mt-5 origin-top-left" style={{ scale: escalaTitulo }}>
            <SplitLines as="h2" lines={DIAGRAMA.h2.linhas} text={DIAGRAMA.h2.texto} className="display-l text-balance text-papel-50" />
          </motion.div>
          <motion.p aria-hidden={ativo >= 0 || undefined} className="corpo mt-6 text-papel-300" style={{ opacity: corpoOpacidade }}>
            {DIAGRAMA.corpo}
          </motion.p>

          <motion.div
            aria-hidden={ativo < 0 || undefined}
            {...(ativo < 0 ? ({ inert: "" } as Record<string, string>) : {})}
            className={`absolute inset-x-0 bottom-0 flex gap-6 ${ativo < 0 ? "pointer-events-none" : ""}`}
            style={{ top: topoTour, opacity: tourOpacidade, y: tourY }}
          >
            {/* trilho vertical C-01…Engenharia */}
            <div className="relative hidden w-[78px] shrink-0 self-start [@media(min-width:1280px)_and_(min-height:760px)]:block">
              <span aria-hidden className="absolute bottom-2 left-0 top-2 w-px bg-marinho-300/25" />
              <motion.span aria-hidden className="absolute bottom-2 left-0 top-2 w-px origin-top bg-brasa-400" style={{ scaleY: trilho }} />
              <ol className="relative flex flex-col gap-[14px] py-1" aria-label={UI_LOCAL.camadas}>
                {CAMADAS.map((c, i) => (
                  <li key={c.id} className="flex h-[16px] items-center gap-2" aria-current={i === ativo ? "step" : undefined}>
                    <motion.span
                      aria-hidden
                      className="block h-[2px] origin-left"
                      initial={false}
                      animate={{ width: i === ativo ? 24 : 8, backgroundColor: i === ativo ? "#E8442E" : "rgba(157,184,208,0.55)" }}
                      transition={{ type: "spring", ...SPRING.encaixe }}
                    />
                    <span className={`whitespace-nowrap font-mono text-[11px] tracking-[0.08em] transition-colors duration-200 ${i === ativo ? "text-papel-50" : "text-marinho-300"}`}>
                      {c.codigo === "Final" ? "ENG" : c.codigo}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* camada ativa */}
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[15px] font-medium tracking-[0.12em] text-brasa-300">
                <Odometer value={camada.codigo.toUpperCase()} trigger="value" ariaLabel={camada.codigo} />
              </p>
              <BlocoCamada indice={Math.max(0, ativo)} />
            </div>
          </motion.div>
        </div>

        {/* diagrama */}
        <div ref={colunaRef} className="relative col-span-7 flex min-h-0 items-center justify-center xl:col-span-8">
          <div className="relative" style={{ width: caixa.w, height: caixa.h }}>
            <IsoDiagram
              tracos={[estrutura, c1, c2, c3, c4, c5, c6]}
              pictos={visiveis}
              apagadas={apagadas}
              camera={camera}
              preencher
              className="h-full w-full"
            />
            {final && <FocusBrackets mode="enter" offset={14} size={28} key="final" className="!-inset-3" />}
            <div className="pointer-events-none absolute bottom-4 right-10">
              <StampBadge text={DIAGRAMA.carimbo} trigger="manual" show={final} className="bg-marinho-900/70 text-brasa-300" />
            </div>
          </div>
        </div>
      </Container>

      {/* chips das camadas na base da cena */}
      <div className="absolute inset-x-0 bottom-0">
        <Container className="pb-7">
          <ul className="flex flex-wrap gap-1.5" aria-label={UI_LOCAL.camadas}>
            {CAMADAS.map((c, i) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => irPara(i)}
                  aria-current={i === ativo ? "step" : undefined}
                  aria-label={`${c.codigo === "Final" ? "" : `${c.codigo} `}${c.nome}`}
                  title={c.nome}
                  className={`relative inline-flex h-10 items-center gap-2 overflow-hidden rounded-full border px-4 text-[14px] font-medium transition-colors duration-200 ${
                    i === ativo ? "border-brasa-500 text-white" : "border-marinho-300/30 text-papel-300 hover:border-papel-50/60 hover:text-papel-50"
                  }`}
                >
                  {i === ativo && <motion.span layoutId="diagrama-chip" aria-hidden className="absolute inset-0 bg-brasa-500" transition={{ type: "spring", ...SPRING.pilula }} />}
                  <span className="relative font-mono text-[12px] tracking-[0.08em] opacity-80 xl:hidden">{c.codigo === "Final" ? "ENG" : c.codigo}</span>
                  <span className="relative hidden whitespace-nowrap xl:inline">{c.nome}</span>
                </button>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- fluxo normal (celular, tablet, reduzido, sem JS)
function Fluxo({ index }: { index: string }) {
  const caixa = useRef<HTMLDivElement>(null);
  const naTela = useInView(caixa, { once: true, amount: 0.3 });
  // SSR e sem JS: tudo desenhado (valor final no HTML). No cliente, com movimento, zera em silêncio se o desenho
  // ainda está fora da tela e desenha camada por camada (800 ms cada) quando ele entra. A preferência é lida
  // direto do <html> (o useMotionPref devolve "full" no 1º render e o reduzido ficaria apagado).
  const t0 = useMotionValue(1);
  const t1 = useMotionValue(1);
  const t2 = useMotionValue(1);
  const t3 = useMotionValue(1);
  const t4 = useMotionValue(1);
  const t5 = useMotionValue(1);
  const t6 = useMotionValue(1);
  const tracos: MotionValue<number>[] = [t0, t1, t2, t3, t4, t5, t6];
  const [pictos, setPictos] = useState<boolean[]>(() => Array(7).fill(true));
  const esperando = useRef(false);

  useEffect(() => {
    if (motionPrefAtual() === "reduced" || !caixa.current) return;
    const r = caixa.current.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.85 && r.bottom > 0) return; // já estava à vista: fica desenhado
    tracos.forEach((m) => m.jump(0));
    setPictos(Array(7).fill(false));
    esperando.current = true;
  }, []);

  useEffect(() => {
    if (!naTela || !esperando.current) return;
    esperando.current = false;
    const anims = [animate(t0, 1, { duration: 0.8, ease: ease(EASE_IN_OUT) })];
    const timers: number[] = [];
    for (let c = 1; c <= 6; c++) {
      const atraso = 0.45 + (c - 1) * 0.38;
      anims.push(animate(tracos[c], 1, { duration: 0.8, ease: ease(EASE_IN_OUT), delay: atraso }));
      timers.push(window.setTimeout(() => setPictos((v) => v.map((x, i) => (i === c ? true : x))), (atraso + 0.2) * 1000));
    }
    return () => {
      anims.forEach((a) => a.stop());
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [naTela]);

  return (
    <div className="relative">
      <FundoAzul />
      <Container className="relative py-24 lg:py-40">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Rotulo index={index} />
            <SplitLines as="h2" lines={DIAGRAMA.h2.linhas} text={DIAGRAMA.h2.texto} className="display-l mt-5 text-balance text-papel-50" />
          </div>
          <Reveal as="p" y={16} className="corpo text-papel-300 lg:col-span-5 lg:self-end">
            {DIAGRAMA.corpo}
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 lg:mt-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <div ref={caixa} className="relative mx-auto max-w-[520px]">
                <IsoDiagram compacto tracos={tracos} pictos={pictos} />
                <FocusBrackets mode="enter" offset={12} size={24} className="!-inset-3" />
              </div>
              <div className="mt-6 flex justify-center">
                <StampBadge text={DIAGRAMA.carimbo} className="text-brasa-300" />
              </div>
            </div>
          </div>

          <RevealGroup as="ol" className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:col-span-7 lg:grid-cols-1" stagger={0.06}>
            {CAMADAS.map((c) => (
              <RevealItem as="li" key={c.id} className="rounded-r-md border border-marinho-300/20 bg-marinho-900/55 p-6 lg:p-7">
                <div className="flex items-center gap-3">
                  {COR_AMOSTRA[c.cor]}
                  <span className="rotulo text-brasa-300">{c.codigo}</span>
                </div>
                <h3 className="titulo mt-3 text-papel-50">{c.nome}</h3>
                {c.textos.map((tx) => (
                  <p key={tx} className="corpo mt-3 text-papel-300">
                    {tx}
                  </p>
                ))}
                <div className="mt-5 flex flex-wrap gap-2">
                  {c.servicos.map((s) => (
                    <ChipServico key={s} slug={s} />
                  ))}
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Container>
    </div>
  );
}

function Conteudo({ index }: { index: string }) {
  const { active } = usePin();
  return active ? <Cena index={index} /> : <Fluxo index={index} />;
}

// ---------------------------------------------------------------- seção
export interface DiagramaProps {
  id?: string;
  index?: string;
}

export default function Diagrama({ id = "sistema", index = "01" }: DiagramaProps = {}) {
  return (
    <section id={id} data-section="diagrama" aria-label={linhasTexto(DIAGRAMA.h2.linhas)} className="relative bg-marinho-900">
      <PinStage mode="pin" heightClassName="h-[340vh]">
        <Conteudo index={index} />
      </PinStage>
    </section>
  );
}
