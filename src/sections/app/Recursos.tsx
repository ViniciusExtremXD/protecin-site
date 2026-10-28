import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PLATAFORMA } from "../../data/site";
import { DrawIcon, FADE_REDUZIDO, FocusBrackets, Reveal, SplitLines, variantesPreset } from "../../components/motion";
import { STAGGER } from "../../components/motion/tokens";
import { Container } from "../../components/layout/Container";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { useMotionPref } from "../../lib/motion-pref";

/*
 * Recursos que fazem a diferença (§10.5): quadro 4 × 2 (desktop) ou 2 × 4 (celular) com os 8 recursos literais
 * de §1.7. Os ladrilhos se montam a partir de posições espalhadas quando o quadro entra 20% e, depois, cada
 * ícone se desenha. Hover: sobe 4 px, borda brasa-400, ícone redesenha e as cantoneiras fecham.
 */
const R = PLATAFORMA.recursos;
const ROTULO = { index: "03", label: "Recursos" } as const;
/** O título literal em duas linhas ("Recursos que fazem" / "a diferença"). */
const PALAVRAS = R.titulo.split(" ");
const LINHAS = [PALAVRAS.slice(0, 3).join(" "), PALAVRAS.slice(3).join(" ")];

export default function Recursos() {
  const reduced = useMotionPref() === "reduced";
  const quadro = useRef<HTMLUListElement>(null);
  const visto = useInView(quadro, { once: true, amount: 0.2 });
  const gatilho = reduced ? { animate: "show" } : { animate: visto ? "show" : "hidden" };

  return (
    <section id="recursos" data-section="APP-RECURSOS" aria-label={R.titulo} className="grain relative bg-noite-950 py-24 lg:py-40">
      <Container>
        <SectionLabel index={ROTULO.index} label={ROTULO.label} />
        <SplitLines as="h2" lines={LINHAS} text={R.titulo} className="display-xl mt-5 text-papel-50" />
        <Reveal y={16} className="mt-8 flex items-center gap-4 lg:mt-10">
          <span aria-hidden className="h-px w-10 shrink-0 bg-brasa-400" />
          <p className="corpo-l text-papel-300">{R.subtitulo}</p>
        </Reveal>

        <motion.ul
          ref={quadro}
          data-motion="grupo"
          className="mt-12 grid grid-cols-2 gap-3 lg:mt-16 lg:grid-cols-4 lg:gap-4"
          initial="hidden"
          variants={{ hidden: {}, show: { transition: { staggerChildren: reduced ? 0 : STAGGER.grade } } }}
          {...gatilho}
        >
          {R.itens.map((item, i) => (
            <motion.li key={item.nome} data-motion="monta" custom={i} variants={reduced ? FADE_REDUZIDO : variantesPreset("monta")}>
              <div className="group relative flex h-full min-h-[176px] flex-col justify-between gap-6 rounded-r-md border border-noite-700 bg-noite-800 p-4 transition-[transform,border-color] duration-[350ms] ease-out hover:-translate-y-1 hover:border-brasa-400 sm:p-5 lg:min-h-[208px] lg:p-6">
                <div className="flex items-start justify-between gap-3">
                  <DrawIcon icon={item.icone} size={36} drawn={reduced || visto} delay={0.45 + i * 0.05} redrawOnHover className="text-brasa-400" />
                  <span className="rotulo text-papel-500">{`R-${String(i + 1).padStart(2, "0")}`}</span>
                </div>
                <p className="text-[16px] font-semibold leading-snug text-papel-50 lg:text-[19px]">{item.nome}</p>
                <FocusBrackets mode="hover" offset={8} size={18} />
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </Container>
    </section>
  );
}
