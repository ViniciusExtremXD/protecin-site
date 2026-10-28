import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { IMAGENS, type ImagemId } from "../../data/imagens.gen";
import { PLATAFORMA, UI } from "../../data/site";
import { FocusBrackets, Reveal, SplitLines, TiltCard } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { Img } from "../../components/ui/Img";
import { useMotionPref } from "../../lib/motion-pref";

/*
 * Telas reais do sistema (§10.5, enxerto D2), em seção clara para dar ritmo à página azul. As três capturas
 * reais do acervo (splash, login do app e login do Web Master) em TiltCard, com crédito "FOTO DO ACERVO
 * PROTECIN". Entrada "virada" com 100 ms entre elas; na rolagem, cada uma com o próprio parallax (4%, 8%, 6%).
 */
const TR = PLATAFORMA.telasReais;
const ROTULO = { index: "04", label: "Telas reais" } as const;
/** O título literal em duas linhas ("Telas reais" / "do sistema"). */
const PALAVRAS = TR.titulo.split(" ");
const LINHAS = [PALAVRAS.slice(0, 2).join(" "), PALAVRAS.slice(2).join(" ")];

const FIGURAS: { id: ImagemId; parallax: number; classe: string; painel: string; sizes: string }[] = [
  { id: "app-splash", parallax: 4, classe: "col-span-1 lg:col-span-3", painel: "h-[340px] sm:h-[420px] lg:h-[clamp(420px,38vw,560px)]", sizes: "(min-width: 1024px) 20vw, 40vw" },
  {
    id: "app-webmaster-notebook",
    parallax: 8,
    classe: "order-first col-span-2 lg:order-none lg:col-span-6",
    painel: "h-[260px] sm:h-[380px] lg:h-[clamp(420px,38vw,560px)]",
    sizes: "(min-width: 1024px) 46vw, 90vw",
  },
  { id: "app-login-celular", parallax: 6, classe: "col-span-1 lg:col-span-3", painel: "h-[340px] sm:h-[420px] lg:h-[clamp(420px,38vw,560px)]", sizes: "(min-width: 1024px) 20vw, 40vw" },
];

function Figura({ id, parallax, classe, painel, sizes, ordem }: (typeof FIGURAS)[number] & { ordem: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useMotionPref() === "reduced";
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`${parallax}%`, `${-parallax}%`]);
  return (
    <figure ref={ref} className={classe}>
      <Reveal preset="virada" delay={ordem * 0.1} className="h-full">
        <TiltCard max={6} glare className="rounded-r-lg">
          <div className={`group relative overflow-clip rounded-r-lg bg-papel-100 ring-1 ring-noite-950/10 ${painel}`}>
            <div aria-hidden className="absolute inset-0 opacity-70">
              <div className="bg-blueprint-claro h-full w-full" />
            </div>
            <motion.div data-motion="parallax" className="absolute inset-5 sm:inset-7" style={{ y: reduced ? "0%" : y }}>
              <Img
                id={id}
                alt={IMAGENS[id].alt}
                sizes={sizes}
                className="block h-full w-full"
                imgClassName="h-full w-full object-contain drop-shadow-[0_30px_30px_rgba(5,10,18,0.28)]"
              />
            </motion.div>
            <FocusBrackets mode="hover" tone="claro" offset={10} size={22} />
          </div>
        </TiltCard>
        <figcaption className="rotulo mt-3 text-grafite-600">{UI.fotoAcervo.toUpperCase()}</figcaption>
      </Reveal>
    </figure>
  );
}

export default function TelasReais() {
  return (
    <section id="telas-reais" data-section="APP-TELAS" aria-label={TR.titulo} className="tom-claro relative bg-papel-50 py-24 text-noite-950 lg:py-40">
      <Container>
        <SectionLabel index={ROTULO.index} label={ROTULO.label} tone="claro" />
        <SplitLines as="h2" lines={LINHAS} text={TR.titulo} className="display-xl mt-5 text-noite-950" />
        <div className="mt-14 grid grid-cols-2 gap-x-3 gap-y-8 lg:mt-20 lg:grid-cols-12 lg:items-end lg:gap-x-6">
          {FIGURAS.map((f, i) => (
            <Figura key={f.id} {...f} ordem={i} />
          ))}
        </div>
        <Reveal y={12} className="mt-10 flex items-center gap-4 lg:mt-14">
          <span aria-hidden className="h-px w-10 shrink-0 bg-brasa-500" />
          <p className="corpo text-grafite-600">{TR.legenda}</p>
        </Reveal>
      </Container>
    </section>
  );
}
