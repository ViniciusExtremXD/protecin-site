import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { motion, useInView, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Check, Server } from "lucide-react";
import { IMAGENS } from "../../data/imagens.gen";
import { PLATAFORMA, SECOES, UI, WA } from "../../data/site";
import {
  ClipReveal,
  DrawIcon,
  DrawPath,
  DropWindow,
  PinStage,
  Reel,
  Reveal,
  RevealGroup,
  RevealItem,
  Rule,
  SplitLines,
  StampBadge,
  TiltCard,
  usePin,
  variantesPreset,
} from "../../components/motion";
import { DUR, EASE_OUT, VIEWPORT, ease } from "../../components/motion/tokens";
import { Container } from "../../components/layout/Container";
import { OrcamentoCta, PrimaryCta, WhatsAppCta } from "../../components/ui/cta";
import { Img } from "../../components/ui/Img";
import { LazyVideo } from "../../components/ui/LazyVideo";
import { useMediaQuery } from "../../lib/media";
import { useMotionPref } from "../../lib/motion-pref";
import { usePath } from "../../lib/router";
import { scrollToProgress } from "../../lib/smooth-scroll";
import { pushEvent } from "../../lib/track";
import { CaixaEscalada } from "./plataforma/CaixaEscalada";
import { DataPacket, usePontoNoCaminho } from "./plataforma/DataPacket";
import { PhoneMock } from "./plataforma/PhoneMock";
import { RotuloAzul } from "./plataforma/RotuloAzul";
import { CARTAO_RELATORIO, CartaoRelatorio, TelaOrdens, Telas } from "./plataforma/Telas";
import { amostrar, dDe, inverter, reta, type Segmento } from "./plataforma/caminho";

/*
 * H5 Plataforma (§9 H5) e a variante da página /nosso-app/ (§10.5).
 * Desktop (≥ 1024 × 640, movimento completo): cena fixada de 2,5 telas (corte do QA) em que o celular e o
 * notebook se montam pelos 4 pilares. Celular, reduzido, tela baixa e sem JS: sequência normal com reveals,
 * dispositivos parados (celular na tela de ordens e notebook ao lado), os 4 pilares em lista, selo e chips.
 */
type Variante = "home" | "app";

/** Na página do app os rótulos recomeçam (01 Como funciona · 02 Plataforma · 03 Recursos · 04 Telas reais). */
const INDICE_APP = "02";

const P = PLATAFORMA;
const T = P.telas;

// ---------------------------------------------------------------- palco da cena fixada (px de projeto)
const CAIXA = { w: 760, h: 720 } as const;
const NOTE = { left: 0, top: 200, w: 560 } as const;
const CEL = { left: 430, top: 50 } as const; // pilar 01; no 02 anda 18% (54 px) e vai a 0,82
const VIDEO = { left: 8, top: 22, w: 300, h: 188 } as const;
const PROC = { left: 286, top: 646, w: 228, h: 56 } as const;
const SELO = { left: 6, top: 486 } as const;
const CHIPS = { left: 40, top: 262, recuo: [0, 44, 14, 58] } as const;

// notebook → processador → celular (o chip "Ordem de serviço" vai; os pacotes de dados voltam)
const CAMINHO: Segmento[] = [
  [[262, 588], [262, 646], [266, 674], [PROC.left, 674]],
  reta([PROC.left, 674], [PROC.left + PROC.w, 674]),
  [[PROC.left + PROC.w, 674], [596, 674], [634, 662], [634, 616]],
];
const D_CAMINHO = dDe(CAMINHO);
const PONTOS = amostrar(CAMINHO, 100);
const PONTOS_VOLTA = amostrar(inverter(CAMINHO), 48);

// ---------------------------------------------------------------- composição estática (px de projeto)
const EST = { w: 560, h: 700, note: { left: 0, top: 128, w: 380 }, cel: { left: 252, top: 40 }, proc: { left: 14, top: 594, w: 220, h: 54 } } as const;
const D_ESTATICO = dDe([
  [[186, 392], [186, 470], [124, 520], [124, EST.proc.top]],
]);
const D_ESTATICO_2 = dDe([[[EST.proc.left + EST.proc.w, 621], [262, 621], [292, 646], [292, 664]]]);

const CEL_NO_LUGAR = { y: 0, rotate: 0, opacity: 1 };
const altNotebook = IMAGENS["app-webmaster-notebook"].alt;
const altVideo = IMAGENS["poster-tablet"].alt;

/** `variant` omitido: "app" em /nosso-app/ e "home" no resto (a página do app pode só montar <Plataforma />). */
export default function Plataforma({ variant: pedida }: { variant?: Variante }) {
  const path = usePath();
  const variant: Variante = pedida ?? (path === "/nosso-app/" ? "app" : "home");
  const raiz = useRef<HTMLElement>(null);
  // a gota azul cresce enquanto a seção sobe (fim da tela → topo)
  const { scrollYProgress: entrada } = useScroll({ target: raiz, offset: ["start end", "start start"] });
  // pilares já vistos (platform_step uma vez por pilar); fica aqui porque a cena remonta ao trocar de layout
  const vistos = useRef(new Set<number>());
  return (
    <section
      ref={raiz}
      id="plataforma"
      data-section="H5"
      aria-label={P.h2.texto}
      className={`relative ${variant === "home" ? "bg-noite-950" : "bg-marinho-900"}`}
    >
      <PinStage mode="pin" heightClassName="h-[250vh]">
        <Conteudo variant={variant} entrada={entrada} vistos={vistos.current} />
      </PinStage>
    </section>
  );
}

function Conteudo({ variant, entrada, vistos }: { variant: Variante; entrada: MotionValue<number>; vistos: Set<number> }) {
  const { active } = usePin();
  return active ? <CenaFixada variant={variant} entrada={entrada} vistos={vistos} /> : <Sequencia variant={variant} entrada={entrada} />;
}

/** `curto`: na cena fixada abaixo de 1400 px os dois botões não cabem lado a lado; vão menores e o WhatsApp com o rótulo curto. */
function Ctas({ variant, size = "md", curto = false }: { variant: Variante; size?: "md" | "sm"; curto?: boolean }) {
  return (
    <div className={curto ? "flex flex-nowrap gap-3" : "flex flex-col gap-3 sm:flex-row sm:flex-wrap"}>
      {variant === "app" ? (
        <OrcamentoCta formLocation="plataforma" size={size} />
      ) : (
        <PrimaryCta to="/nosso-app/" size={size}>
          {P.ctas.conhecer}
        </PrimaryCta>
      )}
      <WhatsAppCta location="plataforma" message={WA.plataforma} size={size}>
        {curto ? UI.whatsapp : P.ctas.ver}
      </WhatsAppCta>
    </div>
  );
}

const indiceDe = (variant: Variante) => (variant === "home" ? SECOES.plataforma.index : INDICE_APP);

// ================================================================ cena fixada (desktop)
/**
 * Home: a gota azul (só o fundo) cresce do centro enquanto a seção sobe e o palco entra por cima, por opacidade e
 * translação ligadas à mesma rolagem. O conteúdo fica fora da gota de propósito: dentro dela, a escala com
 * will-change rasteriza o texto borrado durante a abertura.
 */
function CenaFixada({ variant, entrada, vistos }: { variant: Variante; entrada: MotionValue<number>; vistos: Set<number> }) {
  const opacity = useTransform(entrada, [0.42, 0.82], [0, 1]);
  const y = useTransform(entrada, [0.42, 1], [72, 0]);
  const [entrou, setEntrou] = useState(false);
  useMotionValueEvent(entrada, "change", (v) => v >= 0.62 && setEntrou(true));
  useEffect(() => {
    if (entrada.get() >= 0.62) setEntrou(true);
  }, [entrada]);
  if (variant === "app") return <Palco variant={variant} vistos={vistos} fundo />;
  return (
    <div className="relative h-[100svh] w-full bg-noite-950">
      <div aria-hidden className="absolute inset-0 flex items-center justify-center">
        <DropWindow progress={entrada} range={[0.12, 0.96]} mode="abrir" from={0.45} className="[--gota:min(56vh,40vw)]">
          <div className="h-full w-full bg-mundo-azul" />
        </DropWindow>
      </div>
      <motion.div className="absolute inset-0" style={{ opacity, y }}>
        <Palco variant={variant} vistos={vistos} fundo={false} entrou={entrou} />
      </motion.div>
    </div>
  );
}

function Palco({ variant, vistos, fundo, entrou }: { variant: Variante; vistos: Set<number>; fundo: boolean; entrou?: boolean }) {
  const { progress: p } = usePin();
  const [estado, setEstado] = useState({ ativo: 0, tela: 0, andamento: 0, banner: false, sinc: false, selo: false, chips: false, montou: false });

  const sincronizar = (v: number) => {
    const ativo = Math.min(3, Math.max(0, Math.floor(v * 4)));
    const local = (i: number) => Math.min(1, Math.max(0, v * 4 - i));
    const tela = v < 0.06 ? 0 : ativo <= 1 ? 1 : ativo;
    setEstado((e) => {
      const novo = {
        ativo,
        tela,
        andamento: local(0) >= 0.66 ? 2 : local(0) >= 0.33 ? 1 : 0,
        banner: local(1) >= 0.9,
        sinc: local(2) >= 0.7,
        selo: local(2) >= 0.5,
        chips: local(3) >= 0.5,
        montou: e.montou || tela >= 1,
      };
      return (Object.keys(novo) as (keyof typeof novo)[]).every((k) => novo[k] === e[k]) ? e : novo;
    });
    // platform_step: 1ª ativação de cada pilar (só com a cena já em andamento)
    if (v > 0.004 && !vistos.has(ativo)) {
      vistos.add(ativo);
      pushEvent("platform_step", { passo: P.pilares[ativo].numero });
    }
  };
  useMotionValueEvent(p, "change", sincronizar);
  useEffect(() => sincronizar(p.get()), []);

  const gradeY = useTransform(p, [0, 1], [0, -120]);

  return (
    <div className={`relative h-full w-full overflow-clip ${fundo ? "bg-mundo-azul" : ""}`}>
      <motion.div aria-hidden className="absolute inset-x-0 top-0 h-[calc(100%+120px)]" style={{ y: gradeY }}>
        <Reveal preset="fade" className="bg-blueprint h-full w-full">
          <span />
        </Reveal>
      </motion.div>
      <Container className="relative grid h-full grid-cols-12 gap-x-6 pb-6 pt-[88px] [@media(min-height:820px)]:pb-10 [@media(min-height:820px)]:pt-[104px]">
        <div className="col-span-6 flex min-h-0 flex-col justify-center xl:col-span-5">
          <Coluna variant={variant} p={p} ativo={estado.ativo} />
        </div>
        <div className="relative col-span-6 min-h-0 xl:col-span-7">
          <CaixaEscalada w={CAIXA.w} h={CAIXA.h} fit="conter" max={1.05} className="h-full w-full">
            <Dispositivos p={p} estado={estado} entrou={entrou} />
          </CaixaEscalada>
        </div>
      </Container>
    </div>
  );
}

function Coluna({ variant, p, ativo }: { variant: Variante; p: MotionValue<number>; ativo: number }) {
  const largo = useMediaQuery("(min-width: 1400px)", true);
  const ir = (e: MouseEvent<HTMLButtonElement>, i: number) => {
    const cena = e.currentTarget.closest<HTMLElement>("[data-pin-stage]");
    if (cena) scrollToProgress(cena, (i + 0.72) / 4);
  };
  return (
    <>
      <RotuloAzul index={indiceDe(variant)} label={P.label} />
      <Reveal y={16} className="[@media(max-height:780px)]:hidden">
        <p className="mt-5 text-[17px] leading-snug text-marinho-300">{P.sobretitulo}</p>
      </Reveal>
      <SplitLines
        as="h2"
        lines={P.h2.linhas}
        text={P.h2.texto}
        className="stretch-66 mt-4 text-[clamp(2rem,min(3.6vw,7svh),4rem)] font-extrabold uppercase leading-[0.92] text-papel-50"
      />
      <Reveal y={12}>
        <p className="rotulo mt-4 text-marinho-300">{P.software}</p>
      </Reveal>

      <RevealGroup as="ol" stagger={0.06} className="mt-6 flex flex-col [@media(min-height:820px)]:mt-8">
        {P.pilares.map((pl, i) => {
          const on = i === ativo;
          return (
            <RevealItem as="li" key={pl.numero}>
              <button
                type="button"
                onClick={(e) => ir(e, i)}
                aria-current={on ? "step" : undefined}
                className="group relative flex min-h-11 w-full items-center py-1 pl-5 text-left [@media(min-height:820px)]:py-1.5"
              >
                <motion.span
                  aria-hidden
                  className="absolute bottom-2 left-0 top-2 w-[3px] origin-top rounded-full bg-brasa-400"
                  initial={false}
                  animate={{ scaleY: on ? 1 : 0 }}
                  transition={{ duration: DUR.curta, ease: ease(EASE_OUT) }}
                />
                <motion.span className="flex items-baseline gap-4" initial={false} animate={{ x: on ? 0 : -6 }} transition={{ duration: DUR.curta, ease: ease(EASE_OUT) }}>
                  <span className={`rotulo transition-colors duration-[350ms] ${on ? "text-brasa-300" : "text-marinho-300"}`}>{pl.numero}</span>
                  <span
                    className={`titulo transition-colors duration-[350ms] [@media(max-height:760px)]:text-[20px] ${on ? "text-papel-50" : "text-marinho-300 group-hover:text-papel-300"}`}
                  >
                    {pl.titulo}
                  </span>
                </motion.span>
              </button>
            </RevealItem>
          );
        })}
      </RevealGroup>

      <SobePalco className="mt-4">
        <Reel count={4} index={ativo} className="h-[6.6em] text-[16px] leading-[1.65] text-papel-300 lg:text-[17px]">
          {P.pilares.map((pl) => (
            <p key={pl.numero} className="max-w-[46ch] text-pretty">
              {pl.texto}
            </p>
          ))}
        </Reel>
      </SobePalco>

      <Trilho p={p} />

      <SobePalco className="mt-6 [@media(min-height:820px)]:mt-8">
        <Ctas variant={variant} size={largo ? "md" : "sm"} curto={!largo} />
      </SobePalco>
    </>
  );
}

/**
 * Na cena fixada o palco não rola: o que fica nos 12% de baixo da tela nunca cruzaria a margem do VIEWPORT
 * padrão. Aqui a entrada "sobe" dispara com qualquer pixel visível.
 */
const NO_PALCO = { once: true, amount: 0 } as const;
function SobePalco({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <motion.div data-motion="sobe" className={className} initial="hidden" whileInView="show" viewport={NO_PALCO} variants={variantesPreset("sobe", 16)}>
      {children}
    </motion.div>
  );
}

function SegmentoTrilho({ p, i }: { p: MotionValue<number>; i: number }) {
  const s = useTransform(p, [i / 4, (i + 1) / 4], [0, 1]);
  return (
    <span className="relative block h-[3px] overflow-clip rounded-full bg-marinho-300/25">
      <motion.span className="absolute inset-0 origin-left bg-brasa-400" style={{ scaleX: s }} />
    </span>
  );
}

function Trilho({ p }: { p: MotionValue<number> }) {
  return (
    <motion.div
      aria-hidden
      data-motion="regua"
      className="mt-5 grid origin-left grid-cols-4 gap-2"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={NO_PALCO}
      transition={{ duration: DUR.max, ease: ease(EASE_OUT) }}
    >
      {[0, 1, 2, 3].map((i) => (
        <SegmentoTrilho key={i} p={p} i={i} />
      ))}
    </motion.div>
  );
}

interface EstadoCena {
  ativo: number;
  tela: number;
  andamento: number;
  banner: boolean;
  sinc: boolean;
  selo: boolean;
  chips: boolean;
  montou: boolean;
}

/** `entrou`: na home, a entrada do celular espera a gota passar de 60%; sem ele, entra ao aparecer na tela. */
function Dispositivos({ p, estado, entrou }: { p: MotionValue<number>; estado: EstadoCena; entrou?: boolean }) {
  const { ativo, tela, andamento, banner, sinc, selo, chips, montou } = estado;
  const l1 = useTransform(p, [0, 0.25], [0, 1]);
  const l2 = useTransform(p, [0.25, 0.5], [0, 1]);
  const l3 = useTransform(p, [0.5, 0.75], [0, 1]);
  const l4 = useTransform(p, [0.75, 1], [0, 1]);

  // pilar 01: barra "Andamento" do 1º cartão 1/3 → 3/3
  const barra = useTransform(l1, [0, 1], [1 / 3, 1]);
  // pilar 02: o notebook entra (e no 03 recua); o celular anda e diminui
  const noteX = useTransform(l2, [0, 0.35], ["40%", "0%"]);
  const noteRY = useTransform(l2, [0, 0.35], [-14, 0]);
  const noteOp = useTransform([l2, l3], ([a, b]: number[]) => (b > 0 ? 1 - 0.5 * Math.min(1, b / 0.3) : 0.3 + 0.7 * Math.min(1, a / 0.35)));
  const noteS = useTransform(l3, [0, 0.3], [1, 0.9]);
  const celX = useTransform(l2, [0, 0.35], ["0%", "18%"]);
  const celS = useTransform(l2, [0, 0.35], [1, 0.82]);
  // chip "Ordem de serviço" pela linha (l 0,5 → 0,9) e some no começo do pilar 03
  // para um pouco antes do fim da linha, encostado embaixo do celular (sem ficar meio escondido pelo aparelho)
  const chipS = useTransform(l2, [0.5, 0.9], [0, 0.93]);
  const chip = usePontoNoCaminho(PONTOS, chipS);
  const chipOp = useTransform([l2, l3], ([a, b]: number[]) => (b > 0.05 ? Math.max(0, 1 - (b - 0.05) / 0.1) : a < 0.5 ? 0 : Math.min(1, (a - 0.5) / 0.04)));
  // pilar 04: o cartão do relatório sai do celular (espelhado para a esquerda: à direita do aparelho não há palco)
  const cartaoX = useTransform(l4, [0.2, 0.5], [0, -236]);
  const cartaoY = useTransform(l4, [0.2, 0.5], [0, -64]);
  const cartaoR = useTransform(l4, [0.2, 0.5], [0, -6]);
  const aceso = ativo >= 2;

  const overlay = (
    <motion.div
      className="absolute"
      style={{ left: CARTAO_RELATORIO.left, top: CARTAO_RELATORIO.top, x: cartaoX, y: cartaoY, rotate: cartaoR }}
      initial={false}
      animate={{ opacity: tela === 3 ? 1 : 0 }}
      transition={{ duration: 0.25, delay: tela === 3 ? 0.28 : 0 }}
    >
      <CartaoRelatorio />
    </motion.div>
  );

  return (
    <div className="relative h-full w-full">
      {/* notebook (Web Master) */}
      <motion.div
        className="absolute z-[1]"
        style={{ left: NOTE.left, top: NOTE.top, width: NOTE.w, x: noteX, rotateY: noteRY, scale: noteS, opacity: noteOp, transformPerspective: 1600 }}
      >
        <Img id="app-webmaster-notebook" alt={altNotebook} sizes="560px" className="block w-full" imgClassName="h-auto w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.45)]" />
      </motion.div>

      {/* cartão de vídeo (banco, só toca no pilar 01) */}
      <div className="absolute z-[2]" style={{ left: VIDEO.left, top: VIDEO.top, width: VIDEO.w, height: VIDEO.h, rotate: "-4deg" }}>
        <ClipReveal radius={20} className="h-full w-full shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]">
          <LazyVideo id="tablet" label={altVideo} when="active" active={ativo === 0} sizes="300px" className="h-full w-full" />
        </ClipReveal>
        <span className="rotulo pointer-events-none absolute bottom-3 left-3 rounded-[6px] bg-noite-950/75 px-2 py-1 text-papel-50">{T.videoCredito}</span>
      </div>

      {/* linha tracejada notebook → processador → celular */}
      <svg aria-hidden className="absolute inset-0 z-[3] overflow-visible text-marinho-300" width={CAIXA.w} height={CAIXA.h} viewBox={`0 0 ${CAIXA.w} ${CAIXA.h}`}>
        <DrawPath d={D_CAMINHO} progress={l2} range={[0.3, 0.6]} dashed strokeWidth={1.5} />
      </svg>

      {/* Processador de Coleta Online */}
      <motion.div
        className="absolute z-[4] flex items-center gap-3 rounded-[10px] border bg-marinho-900 px-3.5"
        style={{ left: PROC.left, top: PROC.top, width: PROC.w, height: PROC.h }}
        initial={false}
        animate={{
          borderColor: aceso ? "rgba(232,68,46,1)" : "rgba(157,184,208,0.35)",
          boxShadow: aceso ? "0 0 0 4px rgba(232,68,46,0.14), 0 18px 40px -12px rgba(232,68,46,0.55)" : "0 0 0 0px rgba(232,68,46,0), 0 18px 40px -12px rgba(0,0,0,0.5)",
        }}
        transition={{ duration: DUR.curta }}
      >
        <Server size={20} strokeWidth={1.5} className={`shrink-0 transition-colors duration-[350ms] ${aceso ? "text-brasa-300" : "text-marinho-300"}`} />
        <span className="rotulo text-[13px] leading-[1.25] tracking-[0.1em] text-papel-50">{T.processador}</span>
      </motion.div>

      {/* chip "Ordem de serviço" andando pela linha */}
      <motion.div aria-hidden className="absolute left-0 top-0 z-[5]" style={{ x: chip.x, y: chip.y, opacity: chipOp }}>
        <span className="block whitespace-nowrap rounded-full bg-brasa-500 px-3 py-1.5 text-[13px] font-semibold leading-none text-white shadow-[0_10px_24px_-8px_rgba(190,30,41,0.8)]" style={{ translate: "-50% -50%" }}>
          {T.chipOrdem}
        </span>
      </motion.div>

      {/* pacotes de dados celular → processador → notebook, só no pilar 03 */}
      {ativo === 2 && (
        <div aria-hidden className="absolute inset-0 z-[5]">
          {[0, 1, 2].map((i) => (
            <DataPacket key={i} pontos={PONTOS_VOLTA} delay={i * 0.3} />
          ))}
        </div>
      )}

      {/* celular */}
      <motion.div
        className="absolute z-[6]"
        style={{ left: CEL.left, top: CEL.top }}
        initial={{ y: 120, rotate: 6, opacity: 0 }}
        {...(entrou === undefined ? { whileInView: CEL_NO_LUGAR, viewport: VIEWPORT } : { animate: entrou ? CEL_NO_LUGAR : undefined })}
        transition={{ duration: DUR.longa, ease: ease(EASE_OUT), opacity: { duration: 0.35 } }}
      >
        <motion.div style={{ x: celX, scale: celS }}>
          <TiltCard max={6}>
            <PhoneMock overlay={overlay}>
              <Telas tela={tela} ordens={{ andamento, barra, montar: montou, banner }} offline={{ checks: l3, sinc }} cartaoFora />
            </PhoneMock>
          </TiltCard>
        </motion.div>
      </motion.div>

      {/* carimbo NBR (pilar 03) */}
      <div className="absolute z-[7]" style={{ left: SELO.left, top: SELO.top, rotate: "-5deg" }}>
        <StampBadge text={P.selo} trigger="manual" show={selo} className="bg-marinho-900 text-brasa-300 shadow-[0_16px_30px_-14px_rgba(0,0,0,0.8)]" />
      </div>

      {/* benefícios (pilar 04) */}
      <ul aria-hidden className="absolute z-[7] flex flex-col items-start gap-2.5" style={{ left: CHIPS.left, top: CHIPS.top }}>
        {P.beneficios.map((b, i) => (
          <motion.li
            key={b}
            custom={i + 5}
            variants={variantesPreset("monta", 28, i * 0.06)}
            initial="hidden"
            animate={chips ? "show" : "hidden"}
            style={{ marginLeft: CHIPS.recuo[i] }}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-papel-50 py-2 pl-3 pr-4 text-[14px] font-semibold leading-none text-noite-950 shadow-[0_16px_30px_-14px_rgba(0,0,0,0.75)]"
          >
            <Check size={15} strokeWidth={2.25} className="text-brasa-500" />
            {b}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

// ================================================================ sequência (celular, reduzido, sem JS)
function Fundo({ home, entrada }: { home: boolean; entrada: MotionValue<number> }) {
  const reduced = useMotionPref() === "reduced";
  return (
    <>
      <div aria-hidden className="absolute inset-0 -z-10 bg-marinho-900" />
      {home && !reduced ? (
        <div aria-hidden className="absolute inset-x-0 top-0 -z-10 flex h-[100svh] items-center justify-center overflow-clip bg-noite-950">
          <DropWindow progress={entrada} range={[0.1, 0.95]} mode="abrir" from={0.45} className="[--gota:min(64vw,40svh)]">
            <div className="h-full w-full bg-mundo-azul" />
          </DropWindow>
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-marinho-900" />
        </div>
      ) : (
        <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[100svh] bg-mundo-azul">
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-marinho-900" />
        </div>
      )}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <Reveal preset="fade" className="bg-blueprint h-full w-full">
          <span />
        </Reveal>
      </div>
    </>
  );
}

function Sequencia({ variant, entrada }: { variant: Variante; entrada: MotionValue<number> }) {
  return (
    <div className="relative isolate">
      <Fundo home={variant === "home"} entrada={entrada} />
      <Container className="relative pb-24 pt-24 lg:pb-40 lg:pt-36">
        <header className="max-w-[60rem]">
          <RotuloAzul index={indiceDe(variant)} label={P.label} />
          <Reveal y={16}>
            <p className="corpo-l mt-5 text-marinho-300">{P.sobretitulo}</p>
          </Reveal>
          <SplitLines as="h2" lines={P.h2.linhas} text={P.h2.texto} className="display-xl mt-4 text-papel-50" />
          <Reveal y={16}>
            <p className="corpo-l mt-6 max-w-[46ch] text-papel-300">{P.apoio}</p>
          </Reveal>
          <Reveal y={12}>
            <p className="rotulo mt-5 text-marinho-300">{P.software}</p>
          </Reveal>
        </header>

        <div className="mt-14 grid grid-cols-1 gap-14 lg:mt-20 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-6 lg:col-start-7 lg:row-start-1">
            <div className="lg:sticky lg:top-28">
              <DispositivosEstaticos />
            </div>
          </div>
          <ol className="flex flex-col lg:col-span-6 lg:row-start-1 lg:pr-8">
            {P.pilares.map((pl, i) => (
              <Reveal as="li" key={pl.numero} className="relative py-8 first:pt-0 lg:py-10">
                {i > 0 && (
                  <span aria-hidden className="absolute inset-x-0 top-0">
                    <Rule className="bg-marinho-300/25" />
                  </span>
                )}
                <div className="grid grid-cols-[auto_1fr] gap-x-5">
                  <span className="rotulo pt-[0.45em] text-brasa-300">{pl.numero}</span>
                  <div>
                    <h3 className="titulo flex items-center gap-3 text-papel-50">
                      <DrawIcon icon={pl.icone} size={24} className="text-brasa-300" />
                      {pl.titulo}
                    </h3>
                    <p className="corpo mt-3 text-papel-300">{pl.texto}</p>
                    {i === 2 && (
                      <div className="mt-6">
                        <StampBadge text={P.selo} className="text-brasa-300" />
                      </div>
                    )}
                    {i === 3 && (
                      <RevealGroup as="ul" preset="monta" stagger={0.06} className="mt-6 flex flex-wrap gap-2">
                        {P.beneficios.map((b, j) => (
                          <RevealItem as="li" key={b} index={j}>
                            <span className="inline-flex min-h-[38px] items-center gap-2 rounded-full border border-marinho-300/30 bg-marinho-800/70 px-3.5 text-[14px] font-medium leading-tight text-papel-50">
                              <Check size={14} strokeWidth={2.25} className="shrink-0 text-brasa-300" />
                              {b}
                            </span>
                          </RevealItem>
                        ))}
                      </RevealGroup>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal y={16} className="mt-14 lg:mt-20">
          <Ctas variant={variant} />
        </Reveal>
      </Container>
    </div>
  );
}

/** Celular na tela de ordens com o notebook ao lado e o processador entre os dois (estado parado). */
function DispositivosEstaticos() {
  const reduced = useMotionPref() === "reduced";
  const ref = useRef<HTMLDivElement>(null);
  const visto = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const [andamento, setAndamento] = useState(0);

  // no movimento completo a vistoria avança uma vez: 1 de 3 → 2 de 3 → 3 de 3
  useEffect(() => {
    if (!visto || reduced) return;
    const t1 = window.setTimeout(() => setAndamento(1), 1400);
    const t2 = window.setTimeout(() => setAndamento(2), 2300);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [visto, reduced]);

  // o 1º render é sempre "full" (casa com o SSR): no reduzido o estado final precisa vir por animate
  const entradaCel = reduced
    ? { initial: false as const, animate: { y: 0, rotate: 0, opacity: 1 }, transition: { duration: 0 } }
    : { initial: { y: 120, rotate: 6, opacity: 0 }, whileInView: { y: 0, rotate: 0, opacity: 1 }, viewport: VIEWPORT, transition: { duration: DUR.longa, ease: ease(EASE_OUT), opacity: { duration: 0.35 } } };

  return (
    <div ref={ref}>
      <CaixaEscalada w={EST.w} h={EST.h} className="mx-auto w-full max-w-[560px]" fallbackClassName="[--k:0.625] sm:[--k:1] lg:[--k:0.8] xl:[--k:1]">
        <div className="absolute" style={{ left: EST.note.left, top: EST.note.top, width: EST.note.w }}>
          <Reveal y={40}>
            <Img id="app-webmaster-notebook" alt={altNotebook} sizes="(min-width: 1024px) 380px, 60vw" className="block w-full" imgClassName="h-auto w-full drop-shadow-[0_24px_32px_rgba(0,0,0,0.45)]" />
          </Reveal>
        </div>
        <svg aria-hidden className="absolute inset-0 overflow-visible text-marinho-300" width={EST.w} height={EST.h} viewBox={`0 0 ${EST.w} ${EST.h}`}>
          {/* no reduzido, traço parado: o DrawPath da base fica em pathLength 0 quando o reduzido chega depois do 1º render */}
          {reduced ? (
            <>
              <path d={D_ESTATICO} fill="none" stroke="currentColor" strokeWidth={1.5} strokeDasharray="4 3" />
              <path d={D_ESTATICO_2} fill="none" stroke="currentColor" strokeWidth={1.5} strokeDasharray="4 3" />
            </>
          ) : (
            <>
              <DrawPath d={D_ESTATICO} dashed strokeWidth={1.5} delay={0.3} />
              <DrawPath d={D_ESTATICO_2} dashed strokeWidth={1.5} delay={0.7} />
            </>
          )}
        </svg>
        <div className="absolute" style={{ left: EST.proc.left, top: EST.proc.top, width: EST.proc.w, height: EST.proc.h }}>
          <Reveal preset="carimbo" className="h-full w-full">
            <div className="flex h-full w-full items-center gap-3 rounded-[10px] border border-brasa-400/80 bg-marinho-900 px-3.5 shadow-[0_0_0_4px_rgba(232,68,46,0.12)]">
              <Server size={20} strokeWidth={1.5} className="shrink-0 text-brasa-300" />
              <span className="rotulo text-[13px] leading-[1.25] tracking-[0.1em] text-papel-50">{T.processador}</span>
            </div>
          </Reveal>
        </div>
        <motion.div className="absolute" style={{ left: EST.cel.left, top: EST.cel.top }} {...entradaCel}>
          <PhoneMock>
            <TelaOrdens andamento={andamento} montar={reduced ? undefined : visto} />
          </PhoneMock>
        </motion.div>
      </CaixaEscalada>
    </div>
  );
}
