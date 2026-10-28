import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CLIENTES, SETORES } from "../../data/site";
import { EASE_OUT, Odometer, Reveal, Rule, SplitLines, VIEWPORT, ease } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { useMotionPref } from "../../lib/motion-pref";

/*
 * /nossos-clientes/: escala (design-final §10.3). Sobretítulo, H2 e texto literais de §2.4 e o número
 * "20.000+ / clientes atendidos" em odômetro. Tom escuro, luz-brasa com parallax. Nenhum cliente nomeado.
 */

/** ClientesEscala (`#clientes-escala`). Sem props. */
export default function ClientesEscala() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useMotionPref() === "reduced";
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const luzY = useTransform(scrollYProgress, [0, 1], ["14%", "-14%"]);
  const luzOp = useTransform(scrollYProgress, [0, 0.5, 1], [0.45, 1, 0.6]);
  const { numero, rotulo, ariaLabel } = CLIENTES.escala;
  const digitos = numero.replace(/\+$/, "");
  const sufixo = numero.slice(digitos.length);

  return (
    <section ref={ref} id="clientes-escala" data-section="clientes-escala" className="grain relative isolate overflow-clip bg-noite-950 py-24 lg:py-40">
      <motion.div
        aria-hidden
        data-motion="fade"
        className="pointer-events-none absolute -right-[25%] bottom-[-10%] -z-[1] h-[90%] w-[110%] lg:-right-[8%] lg:w-[62%]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: reduced ? 0.2 : 0.6, ease: ease(EASE_OUT) }}
      >
        <motion.div className="h-full w-full bg-luz-brasa" style={reduced ? { opacity: 0.7 } : { y: luzY, opacity: luzOp }} />
      </motion.div>

      <Container className="relative grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-20">
        <div className="lg:col-span-12">
          <Reveal as="p" className="text-[17px] font-semibold leading-snug text-brasa-300 lg:text-[19px]">
            {SETORES.sobretitulo}
          </Reveal>
          <SplitLines as="h2" lines={SETORES.h2.linhas} text={SETORES.h2.texto} delay={0.08} className="display-xl mt-5 text-papel-50 lg:text-[clamp(2.75rem,6vw,6.25rem)]" />
        </div>

        <div className="lg:col-span-5">
          <Rule />
          <Reveal as="p" delay={0.15} className="corpo-l mt-6 max-w-[54ch] text-papel-300 lg:mt-8">
            {SETORES.texto}
          </Reveal>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <Rule />
          <div className="mt-6 lg:mt-8">
            <p data-motion="odometro" className="display-xxl stretch-62 text-[28vw] text-papel-50 md:text-[20vw] lg:text-[min(13vw,200px)]">
              <span className="sr-only">{ariaLabel}</span>
              <span aria-hidden className="inline-flex items-start">
                <Odometer value={digitos} />
                <Reveal as="span" preset="carimbo" delay={0.7} className="ml-[0.03em] inline-block text-[0.6em] leading-none text-brasa-400">
                  {sufixo}
                </Reveal>
              </span>
            </p>
            <Reveal as="p" delay={0.3} className="corpo-l mt-4 text-papel-300 lg:mt-6">
              {rotulo}
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
