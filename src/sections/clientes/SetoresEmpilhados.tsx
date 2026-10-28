import { createRef, useMemo, type RefObject } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SETORES, UI, type Setor } from "../../data/site";
import { DrawIcon, ParallaxMedia, Reveal, SplitLines } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { Img } from "../../components/ui/Img";
import { useMotionPref } from "../../lib/motion-pref";
import { quebrar } from "./linhas";

/*
 * /nossos-clientes/: setores empilhados (design-final §10.3). Três painéis sticky de 100svh, um cobrindo o outro.
 * Quando o seguinte cobre, o de baixo faz scale 1 → 0,92 e escurece (véu 0 → 0,6). Imagens de banco com o crédito
 * "Imagem ilustrativa". Reduzido e tela baixa: painéis em fluxo normal.
 */

function Painel({ setor, proximo }: { setor: Setor; proximo: RefObject<HTMLDivElement> | null }) {
  const reduced = useMotionPref() === "reduced";
  // progresso do painel seguinte: do pé da tela (0) até o topo (1)
  // o marcador do seguinte vem depois no DOM: mede no useEffect (layoutEffect: false), quando a ref já existe
  const { scrollYProgress } = useScroll({ target: proximo ?? undefined, offset: ["start end", "start start"], layoutEffect: false });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const cobre = useTransform(scrollYProgress, [0, 1], [0, 0.6]);
  const ligado = !!proximo && !reduced;

  return (
    <article
      className="sticky top-0 h-[100svh] overflow-clip bg-noite-950 curto:relative curto:h-auto curto:min-h-[100svh] [.motion-reduced_&]:relative [.motion-reduced_&]:h-auto [.motion-reduced_&]:min-h-[90svh]"
    >
      <motion.div data-motion="empilha" className="relative h-full w-full curto:min-h-[100svh] [.motion-reduced_&]:min-h-[90svh]" style={ligado ? { scale, transformOrigin: "50% 30%" } : undefined}>
        <div className="absolute inset-0">
          <ParallaxMedia amount={8}>
            <Img id={setor.imagem} alt="" sizes="100vw" className="block h-full w-full" imgClassName="h-full w-full object-cover" />
          </ParallaxMedia>
        </div>
        <div aria-hidden className="absolute inset-0 bg-noite-950/65" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-noite-950 via-noite-950/55 to-transparent" />

        <Container className="relative flex h-full flex-col justify-end pb-14 pt-32 curto:min-h-[100svh] lg:pb-20 [.motion-reduced_&]:min-h-[90svh]">
          <div className="grid grid-cols-1 gap-y-6 lg:grid-cols-12 lg:gap-x-6">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-4 text-brasa-400 lg:gap-5">
                {setor.icones.map((ic, k) => (
                  <DrawIcon key={ic} icon={ic} size={34} delay={k * 0.15} />
                ))}
              </div>
              <SplitLines
                as="h3"
                lines={{ desktop: quebrar(setor.nome, 2), celular: [setor.nome] }}
                text={setor.nome}
                className="display-xl mt-6 text-papel-50 lg:mt-8 lg:text-[clamp(2.75rem,5.6vw,6rem)]"
              />
            </div>
            <div className="lg:col-span-4 lg:col-start-9 lg:self-end">
              <Reveal as="p" delay={0.15} className="corpo-l text-papel-50/90">
                {setor.texto}
              </Reveal>
            </div>
          </div>
        </Container>

        <p className="rotulo absolute right-5 top-24 rounded-[6px] bg-noite-950/70 px-2.5 py-1.5 text-papel-50 md:right-8 lg:right-12 lg:top-28 xl:right-16">
          {UI.imagemIlustrativa}
        </p>

        {ligado && <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-noite-950" style={{ opacity: cobre }} />}
      </motion.div>
    </article>
  );
}

/** SetoresEmpilhados (`#setores` em /nossos-clientes/). Sem props. */
export default function SetoresEmpilhados() {
  const marcas = useMemo(() => SETORES.itens.map(() => createRef<HTMLDivElement>()), []);
  return (
    <section id="setores" data-section="setores-empilhados" className="relative bg-noite-950">
      {SETORES.itens.map((s, i) => (
        <div key={s.id} className="contents">
          {/* marcador em fluxo normal no começo de cada painel (o sticky não serve de alvo de medida) */}
          <div ref={marcas[i]} aria-hidden className="h-0" />
          <Painel setor={s} proximo={marcas[i + 1] ?? null} />
        </div>
      ))}
    </section>
  );
}
