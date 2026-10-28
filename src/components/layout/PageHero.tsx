import { useRef, type CSSProperties } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PAGE_HEROES, UI, linhasTexto } from "../../data/site";
import { Link } from "../../lib/router";
import { SplitLines } from "../motion/SplitLines";
import { OrcamentoCta, WhatsAppCta } from "../ui/cta";
import { Img } from "../ui/Img";
import { PARTES } from "../ui/Symbol";
import { Container } from "./Container";

type PaginaHero = "institucional" | "servicos" | "clientes";

// Cada cantoneira é um SVG próprio (fecham de 16 px para fora até o lugar, em CSS: .e-cant-*).
const CANTOS = [
  { parte: "tl", pos: "left-0 top-0", vb: "0 0 44 44", cor: "#F3EFE9" },
  { parte: "tr", pos: "right-0 top-0", vb: "56 0 44 44", cor: "#E8442E" },
  { parte: "bl", pos: "bottom-0 left-0", vb: "0 56 44 44", cor: "#F3EFE9" },
  { parte: "br", pos: "bottom-0 right-0", vb: "56 56 44 44", cor: "#F3EFE9" },
] as const;

/**
 * Abertura das páginas Institucional, Serviços e Nossos Clientes (§7.9, rodada de sobriedade): trilha, H1 em caixa
 * normal (como o manifesto do hero da home; até 64 px, 3 linhas no desktop), subtítulo e CTAs à esquerda; no desktop,
 * o símbolo com a imagem dentro da gota à direita, menor (até 300 px). No celular o símbolo sai (o logo da nav já o
 * mostra) e o hero fica só com texto e CTAs. Não é mais cena fixada: a seção tem a altura do conteúdo (sem 100vh) e,
 * na rolagem, o símbolo só desce 24 px enquanto a imagem da gota assenta (1 → 1,04). Entrada toda em CSS, antes da
 * hidratação. Sem glow vermelho no fundo (só a Abertura e o Orçamento têm).
 */
export function PageHero({ page }: { page: PaginaHero }) {
  const dados = PAGE_HEROES[page];
  const h1 = linhasTexto(dados.h1);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const grupoY = useTransform(scrollYProgress, [0, 1], [0, 24]);
  const imagemEscala = useTransform(scrollYProgress, [0, 1], [1, 1.04]);
  const extraY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);

  return (
    <section ref={ref} id="topo" data-motion="hero" className="grain relative overflow-clip bg-noite-950">
      <Container className="relative z-[1] grid grid-cols-1 items-center gap-10 pb-14 pt-28 lg:grid-cols-12 lg:gap-6 lg:pb-20 lg:pt-36">
        <div className="lg:col-span-8">
          <p className="rotulo e-fade text-papel-500" style={{ "--d": "0ms" } as CSSProperties}>
            <Link to="/" className="inline-flex min-h-11 items-center text-papel-300 transition-colors duration-200 hover:text-papel-50">
              {UI.inicio.toUpperCase()}
            </Link>
            <span aria-hidden className="px-2 text-papel-50/30">
              /
            </span>
            <span>{dados.trilha}</span>
          </p>
          <SplitLines
            as="h1"
            css
            lines={dados.h1}
            text={h1}
            className="stretch-75 mt-3 text-[clamp(2rem,4.4vw,4rem)] font-[750] leading-[1.04] tracking-[-0.01em] text-papel-50 lg:mt-4"
            delay={0.08}
          />
          <p className="corpo-l e-sobe mt-5 max-w-[52ch] text-papel-300 lg:mt-6" style={{ "--d": "260ms" } as CSSProperties}>
            {dados.subtitulo}
          </p>
          <div className="e-sobe mt-7 flex flex-col gap-3 sm:flex-row lg:mt-8" style={{ "--d": "340ms" } as CSSProperties}>
            <OrcamentoCta formLocation={`pagina_${page}`} />
            <WhatsAppCta location={dados.waLocation} />
          </div>
        </div>

        <div aria-hidden className="hidden lg:col-span-4 lg:flex lg:justify-end">
          <motion.div className="relative aspect-square w-[min(36vh,22vw,300px)]" style={{ y: grupoY }}>
            {CANTOS.map((c) => (
              <div key={c.parte} className={`absolute h-[44%] w-[44%] ${c.pos}`}>
                <svg viewBox={c.vb} className={`e-cant-${c.parte} block h-full w-full overflow-visible`} aria-hidden>
                  <path d={PARTES.find((x) => x.parte === c.parte)?.d} fill={c.cor} />
                </svg>
              </div>
            ))}
            <div className="absolute inset-[25%] overflow-clip rounded-gota">
              <motion.div className="h-full w-full" style={{ scale: imagemEscala }}>
                <Img
                  id={dados.imagem}
                  alt=""
                  eager
                  sizes="150px"
                  frame={1}
                  zoom={1.08}
                  className="e-zoom block h-full w-full"
                  imgClassName="h-full w-full object-cover"
                />
              </motion.div>
            </div>
            {dados.extra && (
              <motion.div className="absolute -bottom-[8%] -left-[22%] z-[2] w-[58%]" style={{ y: extraY }}>
                <Img
                  id={dados.extra}
                  alt=""
                  sizes="175px"
                  eager
                  className="e-sobe block"
                  imgClassName="h-auto w-full drop-shadow-[0_18px_24px_rgba(0,0,0,0.5)]"
                />
              </motion.div>
            )}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
