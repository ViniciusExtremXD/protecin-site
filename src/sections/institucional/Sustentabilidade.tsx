import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { IMAGENS } from "../../data/imagens.gen";
import { INSTITUCIONAL, UI } from "../../data/site";
import { ClipReveal, ParallaxMedia, Reveal, StampBadge } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { Img } from "../../components/ui/Img";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { useMotionPref } from "../../lib/motion-pref";
import { Revela } from "../shared/historia/Revela";

/*
 * /institucional/ · Sustentabilidade (design-final §10.1, tom escuro). Paisagem ilustrativa ao fundo (parallax,
 * véu escuro), a frase "Cuidar também é prevenir." palavra por palavra, o texto num cartão que abre em cortina,
 * o carimbo da Política de Preservação Ambiental (marco de 2004) e as mãos com a muda flutuando.
 */

/** Rótulo de interface (no site atual o bloco se chama "Responsabilidade e Sustentabilidade"). */
const ROTULO = "Sustentabilidade";

/** O recorte corta o antebraço na borda esquerda da foto: a borda some num degradê, sem linha dura. */
const RECORTE = { WebkitMaskImage: "linear-gradient(90deg, transparent 2%, #000 34%)", maskImage: "linear-gradient(90deg, transparent 2%, #000 34%)" };

function Maos() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useMotionPref() === "reduced";
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  const id = INSTITUCIONAL.sustentabilidade.imagem;
  return (
    <figure ref={ref} className="relative mx-auto w-[min(70vw,300px)] lg:w-full lg:max-w-[420px]">
      <Reveal>
        <motion.div style={reduced ? RECORTE : { ...RECORTE, y }}>
          <Img id={id} alt={IMAGENS[id].alt} sizes="(min-width: 1024px) 30vw, 70vw" className="block" imgClassName="h-auto w-full" />
        </motion.div>
      </Reveal>
      <figcaption className="rotulo mt-3 text-center text-papel-500 lg:text-left">{UI.imagemIlustrativa.toUpperCase()}</figcaption>
    </figure>
  );
}

export default function Sustentabilidade() {
  const s = INSTITUCIONAL.sustentabilidade;

  return (
    <section
      id="sustentabilidade"
      data-section="SUST"
      className="grain relative isolate flex min-h-[90svh] items-center overflow-clip bg-noite-950 lg:min-h-[110vh]"
    >
      {/* fundo: paisagem ilustrativa com parallax e véu */}
      <div aria-hidden className="absolute inset-0 -z-[1]">
        <div className="absolute inset-0 opacity-[0.35]">
          <ParallaxMedia amount={12}>
            <Img id={s.fundo} alt="" sizes="100vw" className="block h-full w-full" imgClassName="h-full w-full object-cover" />
          </ParallaxMedia>
        </div>
        <div className="absolute inset-0 bg-noite-950/70" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-noite-950 to-noite-950/0" />
      </div>
      <p className="rotulo absolute bottom-4 right-5 z-[1] rounded-[6px] bg-noite-950/70 px-2.5 py-1.5 text-papel-300 md:right-8 lg:right-12 xl:right-16">
        {UI.imagemIlustrativa.toUpperCase()}
      </p>

      <Container className="relative py-24 lg:py-36">
        <div className="grid grid-cols-1 items-center gap-y-14 lg:grid-cols-12 lg:gap-x-6">
          <div className="lg:col-span-7">
            <SectionLabel index="03" label={ROTULO} />
            <Revela as="h2" modo="palavra" texto={s.titulo} destaque={["prevenir"]} className="display-xl mt-6 max-w-[12ch] text-papel-50" />
            <div className="mt-8">
              <StampBadge text={s.linha2004} className="text-brasa-300" />
            </div>
            <ClipReveal radius={18} delay={0.1} className="mt-10 max-w-[38rem]">
              <div className="rounded-r-md border border-papel-50/10 bg-noite-900/80 p-7 lg:p-9">
                <p className="corpo-l text-pretty text-papel-300">{s.texto}</p>
              </div>
            </ClipReveal>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <Maos />
          </div>
        </div>
      </Container>
    </section>
  );
}
