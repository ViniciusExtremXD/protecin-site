import { useEffect, useId, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Plus } from "lucide-react";
import { SECOES, SETORES, type ImagemId, type Setor } from "../../data/site";
import { CursorPreview, DUR, DrawIcon, EASE_OUT, Reveal, Rule, SplitLines, VIEWPORT, ease } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { CaptionedFigure } from "../../components/ui/CaptionedFigure";
import { GhostCta } from "../../components/ui/cta";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { useMotionPref } from "../../lib/motion-pref";
import { pushEvent } from "../../lib/track";

/*
 * H8. Setores (design-final §9 H8), tom escuro. Três linhas tipográficas gigantes, cada uma um acordeão
 * (<h3><button aria-expanded>) que abre o texto literal do setor. Desktop: prévia da imagem que segue o ponteiro.
 * Celular: miniatura 16:9 sempre visível acima do nome.
 * O texto fica sempre no DOM. O recolhimento só vale com o motor no ar (html.motion-up): sem JS, tudo aberto.
 */

/** Entrada "linha" (máscara, y 110% → 0 e rotate 3° → 0) sem aria-label: o texto fica no nome do botão. */
function LinhaMascara({ children, className }: { children: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, VIEWPORT);
  const reduced = useMotionPref() === "reduced";
  return (
    <span ref={ref} data-motion="linha" className={`-mb-[0.08em] -mt-[0.2em] block overflow-clip pb-[0.08em] pt-[0.2em] ${className ?? ""}`}>
      <motion.span
        className="block origin-bottom-left"
        initial={{ y: "110%", rotate: 3 }}
        animate={inView || reduced ? { y: "0%", rotate: 0 } : undefined}
        transition={reduced ? { duration: 0 } : { duration: DUR.longa, ease: ease(EASE_OUT) }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function Linha({ setor, i, aberto, alternar, aoEntrar }: { setor: Setor; i: number; aberto: boolean; alternar: () => void; aoEntrar: () => void }) {
  const ref = useRef<HTMLLIElement>(null);
  const reduced = useMotionPref() === "reduced";
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);
  const id = useId();
  const painel = `${id}-painel`;
  const botao = `${id}-botao`;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const deriva = useTransform(scrollYProgress, [0, 1], i % 2 === 0 ? ["4%", "-4%"] : ["-4%", "4%"]);

  const itens = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: reduced ? { duration: DUR.micro } : { duration: DUR.base, ease: ease(EASE_OUT) } },
  };

  return (
    <li ref={ref} className="relative" onPointerEnter={aoEntrar}>
      {/* miniatura do celular */}
      <Reveal preset="fade" className="pt-8 lg:hidden">
        <CaptionedFigure
          img={{ id: setor.imagem, alt: "", sizes: "(min-width: 768px) 90vw, 100vw" }}
          credit="ilustrativa"
          creditPosition="sobre"
          parallax={6}
          aspect="16/9"
          radius={18}
        />
      </Reveal>

      <h3>
        <button
          id={botao}
          type="button"
          aria-expanded={aberto}
          aria-controls={painel}
          onClick={alternar}
          className="group flex w-full items-center justify-between gap-6 py-6 text-left lg:py-9"
        >
          <motion.span className="block min-w-0" style={reduced ? undefined : { x: deriva }}>
            <span className={`block transition-[transform,color] duration-200 ease-out lg:group-hover:translate-x-6 lg:group-hover:text-brasa-400 ${aberto ? "text-brasa-400" : "text-papel-50"}`}>
              <LinhaMascara className="display-l stretch-66 uppercase lg:text-[clamp(3rem,5.2vw,6.25rem)] lg:leading-[0.9]">{setor.nome}</LinhaMascara>
            </span>
          </motion.span>
          <Reveal as="span" preset="fade" delay={0.2} className="shrink-0">
            <span
              aria-hidden
              className={`grid h-11 w-11 place-items-center rounded-full border transition-[transform,border-color,background-color] duration-[350ms] ease-out lg:h-14 lg:w-14 ${
                aberto ? "rotate-[135deg] border-brasa-400 bg-brasa-400/10 text-brasa-300" : "border-papel-50/30 text-papel-50 group-hover:border-papel-50/80"
              }`}
            >
              <Plus size={22} strokeWidth={1.5} />
            </span>
          </Reveal>
        </button>
      </h3>

      <div
        id={painel}
        role="region"
        aria-labelledby={botao}
        aria-hidden={montado && !aberto ? true : undefined}
        className={`grid grid-rows-[1fr] transition-[grid-template-rows] duration-[400ms] ease-out [.motion-reduced_&]:duration-200 ${aberto ? "" : "[.motion-up_&]:grid-rows-[0fr]"}`}
      >
        <div className="min-h-0 overflow-hidden">
          <motion.div
            className="grid grid-cols-1 gap-6 pb-10 lg:grid-cols-12 lg:gap-x-6 lg:pb-14"
            initial={false}
            animate={aberto ? "show" : "hidden"}
            variants={{ hidden: {}, show: { transition: { staggerChildren: reduced ? 0 : 0.06 } } }}
          >
            <motion.div variants={itens} data-motion="sobe" className="flex items-center gap-5 text-brasa-400 lg:col-span-4">
              {setor.icones.map((ic, k) => (
                <DrawIcon key={ic} icon={ic} size={36} delay={k * 0.15} drawn={aberto} />
              ))}
            </motion.div>
            <motion.p variants={itens} data-motion="sobe" className="corpo-l max-w-[58ch] text-papel-300 lg:col-span-7 lg:col-start-6">
              {setor.texto}
            </motion.p>
          </motion.div>
        </div>
      </div>
      <Rule delay={0.12 * (i + 1)} />
    </li>
  );
}

/** H8 da home (`#setores`). Sem props. */
export default function Setores() {
  const lista = useRef<HTMLUListElement>(null);
  const [aberto, setAberto] = useState<Setor["id"] | null>(null);
  const [previa, setPrevia] = useState<ImagemId | null>(null);

  const alternar = (s: Setor) => {
    const abrir = aberto !== s.id;
    if (abrir) pushEvent("sector_open", { setor: s.id });
    setAberto(abrir ? s.id : null);
  };

  return (
    <section id="setores" data-section="H8" className="grain relative bg-noite-950 py-24 [contain-intrinsic-size:auto_1500px] [content-visibility:auto] lg:py-40">
      <Container>
        <SectionLabel index={SECOES.setores.index} label={SECOES.setores.label} />
        <div className="mt-10 grid grid-cols-1 gap-y-8 lg:mt-14 lg:grid-cols-12 lg:gap-x-6">
          <div className="lg:col-span-8">
            <Reveal as="p" className="text-[17px] font-semibold leading-snug text-brasa-300 lg:text-[19px]">
              {SETORES.sobretitulo}
            </Reveal>
            <SplitLines as="h2" lines={SETORES.h2.linhas} text={SETORES.h2.texto} delay={0.08} className="display-xl mt-5 text-papel-50 lg:text-[clamp(2.75rem,4.4vw,4.75rem)]" />
          </div>
          <div className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <Reveal as="p" delay={0.15} className="corpo text-papel-300">
              {SETORES.texto}
            </Reveal>
          </div>
        </div>

        <div className="mt-14 lg:mt-24">
          <Rule />
        </div>
        <ul ref={lista} onPointerLeave={() => setPrevia(null)}>
          {SETORES.itens.map((s, i) => (
            <Linha key={s.id} setor={s} i={i} aberto={aberto === s.id} alternar={() => alternar(s)} aoEntrar={() => setPrevia(s.imagem)} />
          ))}
        </ul>

        <Reveal className="mt-12 lg:mt-16">
          <GhostCta to={SETORES.link.to}>{SETORES.link.label}</GhostCta>
        </Reveal>
      </Container>
      <CursorPreview image={previa} containerRef={lista} />
    </section>
  );
}

