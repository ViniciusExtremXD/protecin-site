import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { CONTATO, SECOES, UI } from "../../data/site";
import { ClipReveal } from "../../components/motion/ClipReveal";
import { DropWindow } from "../../components/motion/DropWindow";
import { Embers } from "../../components/motion/Embers";
import { Reveal } from "../../components/motion/Reveal";
import { Container } from "../../components/layout/Container";
import { LazyVideo } from "../../components/ui/LazyVideo";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { useCanPlayVideo, useIsDesktop, useMediaQuery } from "../../lib/media";
import { motionPrefAtual, useMotionPref } from "../../lib/motion-pref";
import { usePath } from "../../lib/router";
import Canais from "./orcamento/Canais";
import OrcamentoForm from "./orcamento/OrcamentoForm";
import { PalavrasReveladas } from "./orcamento/revelar";

/*
 * H10. Orçamento (#orcamento, design-final §9 H10). Fecho vermelho da home: a gota vermelha cresce até cobrir a
 * tela conforme a seção sobe, com o letreiro gigante "SOLICITAR ORÇAMENTO", as brasas (únicas do site, ≤ 40,
 * pausadas fora da tela, nenhuma no reduzido) e o vídeo de fogo só no desktop com vídeo permitido.
 * Variante "contato": fundo noite-900 simples, sem gota, letreiro, vídeo nem brasas.
 */

export interface OrcamentoProps {
  /** "home" (padrão) ou "contato". Sem a prop, a rota /contato/ escolhe "contato". */
  variant?: "home" | "contato";
}

export default function Orcamento({ variant }: OrcamentoProps) {
  const path = usePath();
  const v = variant ?? (path === "/contato/" ? "contato" : "home");
  return v === "contato" ? <OrcamentoContato /> : <OrcamentoHome />;
}

// ---------------------------------------------------------------- home: mundo vermelho
function OrcamentoHome() {
  const ref = useRef<HTMLElement>(null);
  const letreiro = useRef<HTMLDivElement>(null);
  const reduced = useMotionPref() === "reduced";
  const desktop = useIsDesktop();
  const largo = useMediaQuery("(min-width: 768px)");
  const podeVideo = useCanPlayVideo();
  const comVideo = desktop && podeVideo;

  // SSR, sem JS e reduzido: gota cheia (p = 1). Depois de montar no movimento completo, a gota segue a subida.
  const [ativo, setAtivo] = useState(false);
  const ativoRef = useRef(false);
  const { scrollYProgress: subida } = useScroll({ target: ref, offset: ["start end", "start start"] });
  // o letreiro corre enquanto ele mesmo está na tela (entra mostrando "SOLICITAR", sai mostrando "ORÇAMENTO")
  const { scrollYProgress: travessia } = useScroll({ target: letreiro, offset: ["start end", "end start"] });
  const gota = useMotionValue(1);
  useMotionValueEvent(subida, "change", (v) => {
    if (ativoRef.current) gota.set(v);
  });
  useEffect(() => {
    const full = motionPrefAtual() === "full";
    ativoRef.current = full;
    setAtivo(full);
    if (full) gota.set(subida.get());
  }, [gota, subida]);

  // desktop: 10% → -10% revela as duas pontas do letreiro, que é mais largo que a tela; no celular as duas linhas
  // cabem, então a deriva é curta para não cortar as palavras
  const deriva = useRef(10);
  deriva.current = largo ? 10 : 3;
  const letreiroX = useTransform(travessia, (v) => `${deriva.current * (1 - 2 * v)}%`);
  // enquanto a gota é pequena, o miolo dela é vermelho (o mundo-vermelho é escuro no alto); ao cobrir a tela, some
  const miolo = useTransform(gota, [0.55, 0.95], [1, 0]);
  const luzEscala = useTransform(subida, [0, 1], [0.6, 1.1]);
  const luzOpacidade = useTransform(subida, [0, 1], [0.4, 0.9]);
  const [linha1, linha2] = splitLetreiro(CONTATO.letreiro);

  return (
    <section ref={ref} id="orcamento" data-section="H10" className="relative isolate overflow-clip bg-noite-950 text-papel-50">
      {/* fundo fixo enquanto a seção passa: gota → mundo vermelho, vídeo de fogo, luz-brasa e brasas */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="sticky top-0 h-[100svh] overflow-clip">
          {reduced ? (
            <div className="absolute inset-0 bg-mundo-vermelho" />
          ) : (
            <div className="absolute inset-0 grid place-items-center">
              <DropWindow progress={gota} range={[0.1, 1]} mode="abrir" from={0.45} className="[--gota:min(64vh,52vw)]">
                <div className="absolute inset-0 bg-mundo-vermelho" />
                <motion.div
                  className="absolute inset-0 bg-[radial-gradient(34%_34%_at_50%_50%,#BE1E29_0%,#8F141B_55%,#3A0A0F_100%)]"
                  style={{ opacity: ativo ? miolo : 0 }}
                />
                {comVideo && <LazyVideo id="fogo" label={UI.imagemIlustrativa} when="near" className="absolute inset-0 opacity-[0.35] mix-blend-screen [&_button]:hidden" />}
              </DropWindow>
            </div>
          )}
          <motion.div
            data-motion="luz"
            className="absolute inset-x-0 bottom-0 h-[78%] origin-bottom bg-luz-brasa"
            style={ativo ? { scale: luzEscala, opacity: luzOpacidade } : { opacity: 0.7 }}
          />
          <Embers density={40} />
        </div>
      </div>
      {/* o vermelho apaga antes da próxima seção (sem corte seco no rodapé) */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-noite-950/0 to-noite-950 lg:h-56" />

      {/* letreiro decorativo: uma linha a 14vw no desktop (corre x 10% → -10% enquanto está na tela), duas no celular.
          Parado (sem JS ou reduzido) ele não corre, então encolhe para caber inteiro na tela. */}
      <div ref={letreiro} aria-hidden className="pointer-events-none flex select-none justify-center pt-24 lg:pt-28">
        <motion.p
          data-motion="letreiro"
          className="display-xxl whitespace-nowrap text-center text-[19vw] leading-[0.84] text-brasa-500/85 mix-blend-screen md:text-[11.4vw] md:[html.motion-full_&]:text-[14vw]"
          style={ativo ? { x: letreiroX } : undefined}
        >
          <span className="block md:inline">{linha1}</span>
          <span className="hidden md:inline"> </span>
          <span className="block md:inline">{linha2}</span>
        </motion.p>
      </div>

      <Container className="relative pb-24 pt-10 md:pt-14 lg:pb-40 lg:pt-16">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-14">
          <div className="lg:col-span-5">
            <SectionLabel index={SECOES.orcamento.index} label={SECOES.orcamento.label} className="[&_p]:text-papel-50/80 [&_span.text-brasa-300]:text-papel-50" />
            <PalavrasReveladas text={CONTATO.h2} className="display-l mt-5 block text-balance text-papel-50 lg:mt-6" />
            <Reveal delay={0.15}>
              <p className="corpo-l mt-7 max-w-[46ch] text-pretty text-papel-50/85 lg:mt-8">{CONTATO.texto}</p>
            </Reveal>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:self-start">
            <ClipReveal from="bottom" radius={28} scaleFrom={1.04} className="shadow-[0_40px_80px_-40px_rgba(0,0,0,0.75)]">
              <OrcamentoForm formLocation="orcamento" />
            </ClipReveal>
          </div>
          <div className="lg:col-span-5 lg:row-start-2">
            <Canais location="orcamento" tone="vermelho" />
            {comVideo && (
              <Reveal preset="fade" className="mt-8">
                <p className="rotulo text-papel-50/80">{UI.imagemIlustrativa}</p>
              </Reveal>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

/** "SOLICITAR ORÇAMENTO" → ["SOLICITAR", "ORÇAMENTO"] (duas linhas no celular). */
function splitLetreiro(texto: string): [string, string] {
  const p = texto.trim().split(/\s+/);
  const meio = Math.ceil(p.length / 2);
  return [p.slice(0, meio).join(" "), p.slice(meio).join(" ")];
}

// ---------------------------------------------------------------- /contato/: fundo noite-900 simples
function OrcamentoContato() {
  return (
    <section id="orcamento" data-section="H10" className="relative bg-noite-900 text-papel-50">
      <Container className="py-24 lg:py-36">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-12">
          <div className="lg:col-span-5">
            <SectionLabel index="01" label={CONTATO.label} />
            <PalavrasReveladas text={UI.menuRotuloCanais} className="display-l mt-5 block text-balance text-papel-50 lg:mt-6" />
          </div>
          <div className="lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:self-start">
            <ClipReveal from="bottom" radius={28} scaleFrom={1.04}>
              <OrcamentoForm formLocation="pagina_contato" card="fundo" />
            </ClipReveal>
          </div>
          <div className="lg:col-span-5 lg:row-start-2">
            <Canais location="pagina_contato" email2 tone="escuro" />
          </div>
        </div>
      </Container>
    </section>
  );
}
