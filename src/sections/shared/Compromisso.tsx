import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { IMAGENS } from "../../data/imagens.gen";
import { SECOES, SOCIAL, UI } from "../../data/site";
import { Reveal, RevealGroup, RevealItem } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { CaptionedFigure } from "../../components/ui/CaptionedFigure";
import { GhostCta } from "../../components/ui/cta";
import { Img } from "../../components/ui/Img";
import { ReservedSlot } from "../../components/ui/ReservedSlot";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { useMotionPref } from "../../lib/motion-pref";
import { usePath } from "../../lib/router";

/*
 * H9. Compromisso (design-final §9 H9, tom claro). Letreiro de 4 linhas que acende palavra por palavra com a
 * rolagem; abaixo, Kids ONG (colagem do acervo, logo e texto) e Sustentabilidade (mãos com muda flutuando).
 * Variante "kids" (Institucional, #kids-ong): só o letreiro e a Kids ONG, porque a Sustentabilidade tem seção própria.
 */

type Variante = "home" | "kids";
export interface CompromissoProps {
  variant?: Variante;
}

/*
 * Correção de texto do site atual (qa/RELATORIO-SITE-ATUAL.md, item 14): "sete anos de atuação" foi escrito em
 * 2025 e envelhece. O ano de início não está em referencia/conteudo-site-atual.md (não se inventa), então a frase
 * sai sem a contagem até a Protecin confirmar o ano; com KIDS_ANO_INICIO preenchido, vira "desde <ano>".
 * Se o site.ts mudar a frase, vale a de lá.
 */
const KIDS_ANO_INICIO: number | null = null; // [confirmar com a Protecin]
const TRECHO_ANTIGO = "projeto social com sete anos de atuação em Santo André – SP";
const KIDS_TEXTO = SOCIAL.kids.texto.replace(
  TRECHO_ANTIGO,
  KIDS_ANO_INICIO ? `projeto social que atua desde ${KIDS_ANO_INICIO} em Santo André – SP` : "projeto social em Santo André – SP",
);

/** Recuo de cada linha do letreiro no desktop (composição tipográfica escalonada). */
const RECUO = ["0%", "22%", "8%", "40%"];

function Palavra({ texto, destaque, progress, faixa, reduced }: { texto: string; destaque: boolean; progress: MotionValue<number>; faixa: [number, number]; reduced: boolean }) {
  const opacity = useTransform(progress, faixa, [0.16, 1]);
  return (
    <motion.span className={destaque ? "text-brasa-500" : undefined} style={reduced ? { opacity: 1 } : { opacity }}>
      {texto}
    </motion.span>
  );
}

/** Letreiro em linhas que acende palavra por palavra (preset "acende"); "*palavra*" = destaque em brasa-500. */
function Letreiro({ className }: { className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduced = useMotionPref() === "reduced";
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 45%"] });

  const conjunto = (linhas: readonly string[], cls: string, recuo?: string[]) => {
    const palavras = linhas.map((l) => l.split(" "));
    const total = palavras.flat().length;
    let k = 0;
    return (
      <span aria-hidden className={cls}>
        {palavras.map((ws, li) => (
          <span key={li} className="block whitespace-nowrap" style={recuo ? { paddingLeft: recuo[li] } : undefined}>
            {ws.map((w, wi) => {
              const i = k++;
              return (
                <span key={wi}>
                  <Palavra
                    texto={w.replace(/\*/g, "")}
                    destaque={w.includes("*")}
                    progress={scrollYProgress}
                    faixa={[i / total, (i + 1) / total]}
                    reduced={reduced}
                  />
                  {wi < ws.length - 1 ? " " : ""}
                </span>
              );
            })}
          </span>
        ))}
      </span>
    );
  };

  return (
    <h2 ref={ref} aria-label={SOCIAL.letreiroTexto} data-motion="acende" className={className}>
      {conjunto(SOCIAL.letreiro.desktop, "hidden md:block", RECUO)}
      {conjunto(SOCIAL.letreiro.celular, "md:hidden")}
    </h2>
  );
}

/** O recorte corta o antebraço na borda esquerda da foto: a borda some num degradê, sem linha dura no meio da página. */
const RECORTE = { WebkitMaskImage: "linear-gradient(90deg, transparent 2%, #000 34%)", maskImage: "linear-gradient(90deg, transparent 2%, #000 34%)" };

/** Mãos com muda (recorte ilustrativo) flutuando: y 8% → -8% e rotate -2° → 2° na rolagem. */
function Maos({ className }: { className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useMotionPref() === "reduced";
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-2, 2]);
  const id = SOCIAL.sustentabilidade.imagem;
  return (
    <figure ref={ref} className={className}>
      <Reveal>
        <motion.div style={reduced ? RECORTE : { ...RECORTE, y, rotate }}>
          <Img id={id} alt={IMAGENS[id].alt} sizes="(min-width: 1024px) 26vw, 60vw" className="block" imgClassName="h-auto w-full" />
        </motion.div>
      </Reveal>
      <figcaption className="rotulo mt-2 text-grafite-600">{UI.imagemIlustrativa.toUpperCase()}</figcaption>
    </figure>
  );
}

function KidsOng() {
  const k = SOCIAL.kids;
  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-x-6">
      <CaptionedFigure
        className="lg:col-span-7"
        img={{ id: k.colagem, alt: IMAGENS[k.colagem].alt, sizes: "(min-width: 1024px) 56vw, 100vw" }}
        credit="acervo"
        caption={k.legendaColagem}
        reveal="cortina"
        parallax={6}
        aspect="1080/845"
        tone="claro"
        brackets
      />
      <div className="mt-12 lg:col-span-4 lg:col-start-9 lg:mt-0 lg:flex lg:flex-col lg:justify-end lg:pb-12">
        <Reveal preset="carimbo" className="w-[96px] lg:w-[120px]">
          <Img id={k.logo} alt={IMAGENS[k.logo].alt} sizes="120px" className="block" imgClassName="h-auto w-full" />
        </Reveal>
        {/* o fecho "Protegemos seu maior patrimônio: A vida." já está na abertura e no rodapé: não se repete aqui */}
        <Reveal delay={0.08} className="mt-8">
          <p className="corpo-l text-pretty text-noite-950">{KIDS_TEXTO}</p>
        </Reveal>
      </div>
      <ReservedSlot id="depoimentos" className="mt-12 lg:col-span-12" />
    </div>
  );
}

function Sustentabilidade() {
  const s = SOCIAL.sustentabilidade;
  return (
    <div className="grid grid-cols-1 items-center gap-y-10 lg:grid-cols-12 lg:gap-x-6">
      <Maos className="mx-auto w-[min(72vw,320px)] lg:col-span-4 lg:col-start-2 lg:w-full lg:max-w-[380px]" />
      <div className="lg:col-span-6 lg:col-start-7">
        <RevealGroup stagger={0.08}>
          <RevealItem as="p" className="rotulo text-brasa-500">
            {ROTULO_SUSTENTABILIDADE}
          </RevealItem>
          <RevealItem as="div">
            <h3 className="display-l mt-4 text-noite-950">{s.titulo}</h3>
          </RevealItem>
          <RevealItem as="p" className="corpo mt-6 text-grafite-600">
            {s.texto}
          </RevealItem>
        </RevealGroup>
        <Reveal delay={0.2} className="mt-10">
          <GhostCta tone="claro" to={SOCIAL.link.to}>
            {SOCIAL.link.label}
          </GhostCta>
        </Reveal>
      </div>
    </div>
  );
}

/** Rótulo de interface do bloco (título da seção no site atual: "Responsabilidade e Sustentabilidade"). */
const ROTULO_SUSTENTABILIDADE = "Sustentabilidade";

/**
 * Sem a prop, a variante sai da rota (/institucional/ → "kids"), o que serve ao sandbox; a página passa a prop.
 */
export default function Compromisso({ variant }: CompromissoProps = {}) {
  const path = usePath();
  const v: Variante = variant ?? (path === "/institucional/" ? "kids" : "home");
  const home = v === "home";

  return (
    <section
      id={home ? "social" : "kids-ong"}
      data-section="H9"
      className="tom-claro relative overflow-clip bg-papel-50 py-24 text-noite-950 lg:py-40"
    >
      <Container>
        <SectionLabel index={home ? SECOES.compromisso.index : "04"} label={SOCIAL.label} tone="claro" />
        <Reveal y={16} delay={0.08}>
          <p className="corpo-l mt-5 max-w-[40ch] text-grafite-600">{SOCIAL.sobretitulo}</p>
        </Reveal>
        <Letreiro className="mt-10 text-[clamp(2.25rem,11.5vw,4rem)] font-[800] uppercase leading-[0.9] [font-stretch:66%] md:text-[clamp(4rem,9.4vw,9rem)] lg:mt-14" />

        <div className="mt-20 lg:mt-32">
          <KidsOng />
        </div>

        {home && (
          <div className="mt-24 border-t border-noite-950/10 pt-20 lg:mt-36 lg:pt-28">
            <Sustentabilidade />
          </div>
        )}
      </Container>
    </section>
  );
}
