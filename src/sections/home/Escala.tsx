import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { NUMEROS, SECOES } from "../../data/site";
import { EASE_OUT, Odometer, Reveal, Rule, SectionRise, VIEWPORT, ease } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { motionPrefAtual, useMotionPref } from "../../lib/motion-pref";

/*
 * H1. Escala (design-final §9 H1). Número-título "20.000+" em odômetro e as outras 4 marcas em linhas com régua de
 * 10 ticks (enxerto D2). Só os números de NUMEROS (conteudo-site-atual.md). Tom escuro, sem foto.
 */

// Régua que se redesenha no hover da linha (só ponteiro fino e movimento completo).
const CSS = `
@keyframes esc-tick{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@media (hover:hover) and (pointer:fine){
  html.motion-full .esc-linha:hover .esc-tick{animation:esc-tick 220ms cubic-bezier(.16,1,.3,1) both;animation-delay:calc(var(--i) * 20ms)}
}
`;

/** "3M+" → { num: "3", sufixo: "M+" }. */
function separar(valor: string) {
  const m = /^([\d.]+)(.*)$/.exec(valor);
  return { num: m?.[1] ?? valor, sufixo: m?.[2] ?? "" };
}

/**
 * Separador e sufixo do número-título entram com fade depois dos dígitos. Fora da tela ao montar: somem e voltam
 * no inView. Já na tela, no SSR, sem JS ou no reduzido: ficam como estão (o HTML já traz o valor final).
 */
function useDepoisDosDigitos(ref: RefObject<HTMLElement>) {
  const [fase, setFase] = useState<"ok" | "espera" | "entra">("ok");
  const inView = useInView(ref, VIEWPORT);
  useEffect(() => {
    if (motionPrefAtual() === "reduced") return;
    const r = ref.current?.getBoundingClientRect();
    if (r && (r.top >= window.innerHeight || r.bottom <= 0)) setFase("espera");
  }, [ref]);
  useEffect(() => {
    if (inView) setFase((f) => (f === "espera" ? "entra" : f));
  }, [inView]);
  return fase === "espera" ? "opacity-0" : fase === "entra" ? "opacity-100 transition-opacity duration-[400ms] delay-[650ms]" : "";
}

/** Régua de 10 ticks pendurada na linha (o 5º e o 10º mais longos). */
function Regua({ atraso }: { atraso: number }) {
  const reduced = useMotionPref() === "reduced";
  const gatilho = reduced ? { animate: "show" } : { whileInView: "show", viewport: VIEWPORT };
  return (
    <motion.span
      aria-hidden
      data-motion="ticks"
      className="flex w-[146px] items-start justify-between"
      initial="hidden"
      variants={{ hidden: {}, show: { transition: { staggerChildren: reduced ? 0 : 0.02, delayChildren: reduced ? 0 : atraso } } }}
      {...gatilho}
    >
      {Array.from({ length: 10 }, (_, i) => {
        const longo = i === 4 || i === 9;
        return (
          <motion.span
            key={i}
            className={`esc-tick block w-px origin-top ${longo ? "h-3.5 bg-brasa-400" : "h-2 bg-papel-50/40"}`}
            style={{ "--i": i } as CSSProperties}
            variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1, transition: reduced ? { duration: 0 } : { duration: 0.35, ease: ease(EASE_OUT) } } }}
          />
        );
      })}
    </motion.span>
  );
}

/** H1 da home (`#numeros`). Sem props. */
export default function Escala() {
  const secao = useRef<HTMLDivElement>(null);
  const titulo = useRef<HTMLHeadingElement>(null);
  const reduced = useMotionPref() === "reduced";
  const { scrollYProgress } = useScroll({ target: secao, offset: ["start end", "end start"] });
  const numY = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);
  const luzOp = useTransform(scrollYProgress, [0, 1], [0.4, 0.9]);
  const luzEscala = useTransform(scrollYProgress, [0, 1], [0.8, 1.1]);
  const afixo = useDepoisDosDigitos(titulo);

  const [principal, ...linhas] = NUMEROS;
  const { num, sufixo } = separar(principal.valor);

  return (
    <SectionRise id="numeros" className="grain bg-noite-950">
      <style>{CSS}</style>
      <div ref={secao} className="relative isolate py-24 lg:py-40">
        {/* luz-brasa no canto inferior esquerdo: entra com fade e respira com a rolagem */}
        <motion.div
          aria-hidden
          data-motion="fade"
          className="pointer-events-none absolute -left-[20%] bottom-0 -z-[1] h-[85%] w-[95%] lg:-left-[12%] lg:w-[70%]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: reduced ? 0.2 : 0.6, ease: ease(EASE_OUT) }}
        >
          <motion.div className="h-full w-full origin-bottom-left bg-luz-brasa" style={reduced ? { opacity: 0.6 } : { opacity: luzOp, scale: luzEscala }} />
        </motion.div>

        <Container>
          <SectionLabel index={SECOES.escala.index} label={SECOES.escala.label} />

          <div className="mt-10 grid grid-cols-1 gap-y-16 lg:mt-14 lg:grid-cols-12 lg:gap-x-6">
            <div className="lg:col-span-7 lg:self-center">
              <motion.div style={reduced ? undefined : { y: numY }}>
                <h2 ref={titulo} aria-label={principal.ariaLabel}>
                  <span className="display-xxl stretch-62 block text-[30vw] text-papel-50 md:text-[22vw] lg:text-[min(18vw,260px)]">
                    <span className="inline-flex items-start">
                      <Odometer value={num} affixClassName={afixo} />
                      <span className={`ml-[0.03em] text-[0.6em] leading-none text-brasa-400 ${afixo}`}>{sufixo}</span>
                    </span>
                  </span>
                  <Reveal as="span" delay={0.3} className="corpo-l mt-1 block text-papel-300 lg:mt-2">
                    {principal.rotulo}
                  </Reveal>
                </h2>
              </motion.div>
            </div>

            <ul className="grid grid-cols-2 gap-x-5 gap-y-12 sm:gap-x-8 lg:col-span-5 lg:col-start-8 lg:grid-cols-1 lg:gap-y-0">
              {linhas.map((n, i) => {
                const partes = separar(n.valor);
                return (
                  <li key={n.valor} className="esc-linha group relative lg:pb-8 lg:pt-0">
                    <Rule delay={i * 0.12} />
                    <Regua atraso={0.1 + i * 0.12} />
                    <div className="mt-4 transition-transform duration-200 ease-out lg:mt-5 lg:group-hover:translate-x-2">
                      <p className="display-l stretch-75 text-papel-50 transition-colors duration-200 lg:group-hover:text-brasa-400">
                        <span className="sr-only">{n.ariaLabel}</span>
                        <span aria-hidden className="inline-flex items-start">
                          <Odometer value={partes.num} />
                          {partes.sufixo && (
                            <Reveal as="span" preset="carimbo" delay={0.45 + i * 0.12} className="inline-block text-brasa-400">
                              {partes.sufixo}
                            </Reveal>
                          )}
                        </span>
                      </p>
                      <Reveal as="p" delay={0.12 + i * 0.12} className="corpo mt-2 text-papel-300 lg:mt-3">
                        {n.rotulo}
                      </Reveal>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </Container>
      </div>
    </SectionRise>
  );
}
