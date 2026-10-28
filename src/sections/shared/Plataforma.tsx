import { useEffect, useId, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { Server } from "lucide-react";
import { IMAGENS } from "../../data/imagens.gen";
import { PLATAFORMA, SECOES, WA } from "../../data/site";
import { DUR, EASE_IN_OUT, EASE_OUT, Reveal, SplitLines, ease } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { OrcamentoCta, PrimaryCta, WhatsAppCta } from "../../components/ui/cta";
import { Img } from "../../components/ui/Img";
import { usePath } from "../../lib/router";
import { pushEvent } from "../../lib/track";
import { CaixaEscalada } from "./plataforma/CaixaEscalada";
import { usePontoNoCaminho } from "./plataforma/DataPacket";
import { PhoneMock } from "./plataforma/PhoneMock";
import { RotuloAzul } from "./plataforma/RotuloAzul";
import { Telas } from "./plataforma/Telas";
import { amostrar, dDe, reta, type Segmento } from "./plataforma/caminho";

/*
 * H5 Plataforma (§9 H5) e a variante da página /nosso-app/ (§10.5), recalibradas na rodada de sobriedade
 * (qa/AJUSTES-SOBRIEDADE.md): sem cena fixada e sem a gota de abertura. Uma seção de ~1 tela: à esquerda o título
 * e os 4 pilares (todos legíveis, sem nada escondido); à direita o celular, o notebook do Web Master e o
 * Processador de Coleta Online, que se montam com calma quando entram na tela. Escolher um pilar (clique, toque,
 * foco ou mouse por cima) troca a tela do celular: ordens (01), a ordem que sai do painel e chega ao app (02),
 * a coleta offline que sincroniza (03) e o relatório (04). Nada fica em loop.
 */
type Variante = "home" | "app";

/** Na página do app os rótulos recomeçam (01 Como funciona · 02 Plataforma · 03 Recursos · 04 Telas reais). */
const INDICE_APP = "02";
const P = PLATAFORMA;
const T = P.telas;
const H2 = "display-xl text-[clamp(2.25rem,4.4vw,4rem)] text-papel-50";
/** "SOFTWARE PRÓPRIO DESDE 2021" vira frase do apoio (um rótulo mono por seção). */
const APOIO = `${P.software.charAt(0)}${P.software.slice(1).toLowerCase()}. ${P.apoio}`;

// ---------------------------------------------------------------- composição (px de projeto)
const EST = { w: 570, h: 660, note: { left: 0, top: 150, w: 400 }, cel: { left: 270, top: 20 }, proc: { left: 20, top: 586, w: 220, h: 54 } } as const;
// notebook → processador → celular (o caminho da ordem de serviço do pilar 02)
const TRECHO_1: Segmento = [[190, 452], [190, 520], [130, 540], [130, EST.proc.top]];
const TRECHO_2: Segmento = [[EST.proc.left + EST.proc.w, 613], [276, 613], [306, 618], [306, 640]];
const D_1 = dDe([TRECHO_1]);
const D_2 = dDe([TRECHO_2]);
const PONTOS_ORDEM = amostrar([TRECHO_1, reta([130, EST.proc.top], [EST.proc.left + EST.proc.w, 613]), TRECHO_2], 90);

const altNotebook = IMAGENS["app-webmaster-notebook"].alt;

/** `variant` omitido: "app" em /nosso-app/ e "home" no resto. */
export default function Plataforma({ variant: pedida }: { variant?: Variante }) {
  const path = usePath();
  const variant: Variante = pedida ?? (path === "/nosso-app/" ? "app" : "home");
  const [ativo, setAtivo] = useState(0);
  // platform_step: uma vez por pilar escolhido pelo visitante (o 01 já vem ativo)
  const vistos = useRef(new Set<number>([0]));
  const escolher = (i: number) => {
    setAtivo(i);
    if (vistos.current.has(i)) return;
    vistos.current.add(i);
    pushEvent("platform_step", { passo: P.pilares[i].numero });
  };

  return (
    <section id="plataforma" data-section="H5" aria-label={P.h2.texto} className="relative isolate overflow-clip bg-marinho-900">
      <div aria-hidden className="absolute inset-0 -z-10 bg-mundo-azul" />
      <div aria-hidden className="absolute inset-0 -z-10 opacity-60">
        <div className="bg-blueprint h-full w-full" />
      </div>
      {/* na home a seção anterior é escura: a entrada no azul é um degradê curto, sem gota */}
      {variant === "home" && <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-noite-950 to-transparent" />}

      <Container className="py-16 lg:py-24">
        <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-6 lg:gap-y-8">
          <header className="lg:col-span-6">
            <RotuloAzul index={variant === "home" ? SECOES.plataforma.index : INDICE_APP} label={P.label} />
            <SplitLines as="h2" lines={P.h2.linhas} text={P.h2.texto} className={`${H2} mt-5`} />
            <Reveal as="p" y={16} delay={0.1} className="corpo-l mt-5 max-w-[42ch] text-papel-300">
              {APOIO}
            </Reveal>
          </header>

          <div className="lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:self-center">
            <Dispositivos pilar={ativo} />
          </div>

          <div className="lg:col-span-6 lg:pr-4 xl:pr-10">
            <Pilares ativo={ativo} escolher={escolher} />
            <Reveal y={16} className="mt-8">
              <Ctas variant={variant} />
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Ctas({ variant }: { variant: Variante }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      {variant === "app" ? <OrcamentoCta formLocation="plataforma" /> : <PrimaryCta to="/nosso-app/">{P.ctas.conhecer}</PrimaryCta>}
      <WhatsAppCta location="plataforma" message={WA.plataforma}>
        {P.ctas.ver}
      </WhatsAppCta>
    </div>
  );
}

/** Os 4 pilares, todos com o texto à vista. O pilar escolhido acende o número, o título e o traço de cima. */
function Pilares({ ativo, escolher }: { ativo: number; escolher: (i: number) => void }) {
  return (
    <Reveal as="ol" y={16} className="border-b border-marinho-300/20">
      {P.pilares.map((pl, i) => {
        const on = i === ativo;
        return (
          <li
            key={pl.numero}
            className="relative border-t border-marinho-300/20 py-3.5 lg:py-4"
            onPointerEnter={(e) => e.pointerType === "mouse" && escolher(i)}
            onClick={() => escolher(i)}
          >
            <span
              aria-hidden
              className={`absolute inset-x-0 -top-px h-px origin-left bg-brasa-400 transition-transform duration-500 ease-out ${on ? "scale-x-100" : "scale-x-0"}`}
            />
            <h3>
              <button
                type="button"
                aria-pressed={on}
                onFocus={() => escolher(i)}
                className="group flex min-h-11 w-full items-center gap-4 text-left lg:min-h-0"
              >
                <span className={`tnum w-6 shrink-0 text-[15px] font-semibold transition-colors duration-300 ${on ? "text-brasa-300" : "text-marinho-300"}`}>{pl.numero}</span>
                <span className={`text-[19px] font-semibold leading-snug transition-colors duration-300 lg:text-[20px] ${on ? "text-papel-50" : "text-papel-300 group-hover:text-papel-50"}`}>
                  {pl.titulo}
                </span>
              </button>
            </h3>
            <p className="pl-10 text-[16px] leading-[1.6] text-papel-300 lg:mt-1.5 lg:text-[17px]">{pl.texto}</p>
          </li>
        );
      })}
    </Reveal>
  );
}

/**
 * Celular, notebook e processador. Entram uma vez (opacidade e 24 px, 0,7 s, em cascata) e o caminho tracejado se
 * desenha; o celular abre no splash e passa para a tela do pilar. Pilar 02: a ordem anda pelo caminho e o aviso
 * desce no celular. Pilar 03: os itens marcam e o "Sincronizado" acende. Tudo por tempo, uma vez por escolha.
 */
function Dispositivos({ pilar }: { pilar: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const visto = useInView(ref, { once: true, amount: 0.3 });
  const [montou, setMontou] = useState(false);
  const [andamento, setAndamento] = useState(0);
  const [banner, setBanner] = useState(false);
  const [sinc, setSinc] = useState(false);
  const checks = useMotionValue(0);
  const ordem = useMotionValue(0);
  const chip = usePontoNoCaminho(PONTOS_ORDEM, ordem);
  const chipOpacidade = useTransform(ordem, [0, 0.04, 0.94, 1], [0, 1, 1, 0]);

  // splash por ~1 s depois de entrar; então a tela do pilar
  useEffect(() => {
    if (!visto) return;
    const t = window.setTimeout(() => setMontou(true), 1100);
    return () => window.clearTimeout(t);
  }, [visto]);

  // pilar 01: a vistoria do 1º cartão avança uma vez (1 de 3 → 2 de 3)
  useEffect(() => {
    if (!montou || pilar !== 0 || andamento > 0) return;
    const t = window.setTimeout(() => setAndamento(1), 700);
    return () => window.clearTimeout(t);
  }, [montou, pilar, andamento]);

  // pilar 02: a ordem sai do painel, passa pelo processador e chega ao app
  useEffect(() => {
    setBanner(false);
    ordem.jump(0);
    if (!montou || pilar !== 1) return;
    const a = animate(ordem, 1, { duration: 1.3, ease: ease(EASE_IN_OUT), delay: 0.2, onComplete: () => setBanner(true) });
    return () => a.stop();
  }, [montou, pilar, ordem]);

  // pilar 03: os 4 itens marcam em sequência e sincroniza
  useEffect(() => {
    setSinc(false);
    checks.jump(0);
    if (!montou || pilar !== 2) return;
    const a = animate(checks, 1, { duration: 1.3, ease: "linear", delay: 0.3, onComplete: () => setSinc(true) });
    return () => a.stop();
  }, [montou, pilar, checks]);

  const tela = !montou ? 0 : pilar <= 1 ? 1 : pilar; // 0 splash · 1 ordens · 2 offline · 3 relatório
  const aceso = montou && (pilar === 1 || pilar === 2);
  const entra = (atraso: number, de: { x?: number; y?: number }) => ({
    initial: { opacity: 0, ...de },
    animate: visto ? { opacity: 1, x: 0, y: 0 } : undefined,
    transition: { duration: 0.7, ease: ease(EASE_OUT), delay: atraso },
  });

  return (
    <div ref={ref} aria-hidden>
      <CaixaEscalada w={EST.w} h={EST.h} max={1.08} className="mx-auto w-full max-w-[616px] lg:mr-0" fallbackClassName="[--k:0.61] sm:[--k:1] lg:[--k:0.8] xl:[--k:1.08]">
        {/* notebook (Web Master) */}
        <motion.div className="absolute" style={{ left: EST.note.left, top: EST.note.top, width: EST.note.w }} {...entra(0, { x: -24 })}>
          <Img id="app-webmaster-notebook" alt={altNotebook} sizes="(min-width: 1024px) 660px, 62vw" className="block w-full" imgClassName="h-auto w-full drop-shadow-[0_24px_32px_rgba(0,0,0,0.45)]" />
        </motion.div>

        {/* caminho tracejado notebook → processador → celular */}
        <svg className="absolute inset-0 overflow-visible text-marinho-300" width={EST.w} height={EST.h} viewBox={`0 0 ${EST.w} ${EST.h}`}>
          <DesenhoTracejado d={D_1} atraso={0.5} ativo={visto} />
          <DesenhoTracejado d={D_2} atraso={0.85} ativo={visto} />
        </svg>

        {/* a ordem de serviço andando pelo caminho (pilar 02); passa por baixo do processador */}
        <motion.div className="absolute left-0 top-0" style={{ x: chip.x, y: chip.y, opacity: chipOpacidade }}>
          <span className="block whitespace-nowrap rounded-full bg-brasa-500 px-3 py-1.5 text-[13px] font-semibold leading-none text-white" style={{ translate: "-50% -50%" }}>
            {T.chipOrdem}
          </span>
        </motion.div>

        {/* Processador de Coleta Online */}
        <motion.div className="absolute" style={{ left: EST.proc.left, top: EST.proc.top, width: EST.proc.w, height: EST.proc.h }} {...entra(0.4, { y: 16 })}>
          <div
            className={`flex h-full w-full items-center gap-3 rounded-[10px] border bg-marinho-900 px-3.5 transition-colors duration-500 ${aceso ? "border-brasa-400" : "border-marinho-300/40"}`}
          >
            <Server size={20} strokeWidth={1.5} className={`shrink-0 transition-colors duration-500 ${aceso ? "text-brasa-300" : "text-marinho-300"}`} />
            <span className="text-[13px] font-semibold leading-[1.25] text-papel-50">{T.processador}</span>
          </div>
        </motion.div>

        {/* celular */}
        <motion.div className="absolute" style={{ left: EST.cel.left, top: EST.cel.top }} {...entra(0.15, { y: 24 })}>
          <PhoneMock>
            <Telas tela={tela} ordens={{ andamento, banner }} offline={{ checks, sinc }} />
          </PhoneMock>
        </motion.div>
      </CaixaEscalada>
    </div>
  );
}

/** Tracejado que se desenha uma vez quando a composição entra na tela (sem JS, o seguro mostra o traço inteiro). */
function DesenhoTracejado({ d, atraso, ativo }: { d: string; atraso: number; ativo: boolean }) {
  const id = `pt${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <g data-motion="traco">
      <mask id={id} maskUnits="userSpaceOnUse">
        <motion.path
          d={d}
          fill="none"
          stroke="#fff"
          strokeWidth={5}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={ativo ? { pathLength: 1 } : undefined}
          transition={{ duration: DUR.longa, ease: ease(EASE_IN_OUT), delay: atraso }}
        />
      </mask>
      <path d={d} fill="none" stroke="currentColor" strokeWidth={1.5} strokeDasharray="4 3" mask={`url(#${id})`} />
    </g>
  );
}
