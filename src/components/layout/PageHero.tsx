import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useMotionValue, useTransform, type MotionValue } from "framer-motion";
import { PAGE_HEROES, UI, linhasTexto } from "../../data/site";
import { Link } from "../../lib/router";
import { DropWindow } from "../motion/DropWindow";
import { PinStage, usePin } from "../motion/PinStage";
import { SplitLines } from "../motion/SplitLines";
import { OrcamentoCta, WhatsAppCta } from "../ui/cta";
import { Img } from "../ui/Img";
import { PARTES } from "../ui/Symbol";
import { Container } from "./Container";

type PaginaHero = "institucional" | "servicos" | "clientes";

// Cada cantoneira é um SVG próprio, para afastar em unidades de tela (vw/vh) na rolagem.
const CANTOS = [
  { parte: "tl", pos: "left-0 top-0", vb: "0 0 44 44", dir: [-1, -1], cor: "#F3EFE9" },
  { parte: "tr", pos: "right-0 top-0", vb: "56 0 44 44", dir: [1, -1], cor: "#E8442E" },
  { parte: "bl", pos: "bottom-0 left-0", vb: "0 56 44 44", dir: [-1, 1], cor: "#F3EFE9" },
  { parte: "br", pos: "bottom-0 right-0", vb: "56 56 44 44", dir: [1, 1], cor: "#F3EFE9" },
] as const;

function Canto({ c, p }: { c: (typeof CANTOS)[number]; p: MotionValue<number> }) {
  const x = useTransform(p, [0.1, 0.4], ["0vw", `${c.dir[0] * 50}vw`]);
  const y = useTransform(p, [0.1, 0.4], ["0vh", `${c.dir[1] * 50}vh`]);
  const opacity = useTransform(p, [0.28, 0.4], [1, 0]);
  const d = PARTES.find((x) => x.parte === c.parte)?.d;
  return (
    <motion.div data-pin-layer="" className={`absolute h-[44%] w-[44%] ${c.pos}`} style={{ x, y, opacity }}>
      <svg viewBox={c.vb} className={`e-cant e-cant-${c.parte} block h-full w-full overflow-visible`} aria-hidden>
        <path d={d} fill={c.cor} />
      </svg>
    </motion.div>
  );
}

function Palco({ page }: { page: PaginaHero }) {
  const dados = PAGE_HEROES[page];
  const { progress, active } = usePin();
  const parado = useMotionValue(0);
  const p = active ? progress : parado;
  const palco = useRef<HTMLDivElement>(null);
  const encaixe = useRef<HTMLDivElement>(null);
  const [delta, setDelta] = useState({ x: 0, y: 0 });

  // distância do centro do símbolo até o centro do palco (medida em elementos sem transform)
  useEffect(() => {
    const medir = () => {
      const a = palco.current?.getBoundingClientRect();
      const b = encaixe.current?.getBoundingClientRect();
      if (!a || !b) return;
      setDelta({ x: a.left + a.width / 2 - (b.left + b.width / 2), y: a.top + a.height / 2 - (b.top + b.height / 2) });
    };
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, [active]);

  const textoOpacidade = useTransform(p, [0, 0.3], [1, 0.3]);
  const textoY = useTransform(p, [0, 0.3], ["0vh", "-8vh"]);
  const grupoX = useTransform(p, [0.1, 0.6], [0, delta.x]);
  const grupoY = useTransform(p, [0.1, 0.6], [0, delta.y]);
  const imagemEscala = useTransform(p, [0.6, 1], [1.06, 1]);
  const extraY = useTransform(p, [0, 1], ["0%", "-18%"]);
  const extraR = useTransform(p, [0, 1], [0, -3]);
  const h1 = linhasTexto(dados.h1);

  return (
    <div ref={palco} className="relative flex min-h-[100svh] items-center bg-noite-950">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-luz-brasa opacity-40" />
      <Container className="relative z-[1] grid grid-cols-1 items-center gap-12 pb-14 pt-24 lg:grid-cols-12 lg:gap-6 lg:pb-16 lg:pt-28">
        <motion.div data-pin-layer="" className="lg:col-span-7" style={{ opacity: textoOpacidade, y: textoY }}>
          <p className="rotulo e-fade text-papel-500" style={{ "--d": "0ms" } as CSSProperties}>
            <Link to="/" className="inline-flex min-h-11 items-center text-papel-300 transition-colors duration-200 hover:text-papel-50">
              {UI.inicio.toUpperCase()}
            </Link>
            <span aria-hidden className="px-2 text-papel-50/30">
              /
            </span>
            <span>{dados.trilha}</span>
          </p>
          <SplitLines as="h1" css lines={dados.h1} text={h1} className="display-xl mt-4 text-papel-50 lg:mt-5" delay={0.08} />
          <p className="corpo-l e-sobe mt-6 max-w-[52ch] text-papel-300 lg:mt-8" style={{ "--d": "300ms" } as CSSProperties}>
            {dados.subtitulo}
          </p>
          <div className="e-sobe mt-8 flex flex-col gap-3 sm:flex-row lg:mt-10" style={{ "--d": "400ms" } as CSSProperties}>
            <OrcamentoCta formLocation={`pagina_${page}`} />
            <WhatsAppCta location={dados.waLocation} />
          </div>
        </motion.div>

        <div className="flex justify-center lg:col-span-5 lg:justify-end">
          <div ref={encaixe} className="relative aspect-square w-[64vw] max-w-[440px] lg:w-[min(56vh,34vw)] lg:max-w-none">
            <motion.div data-pin-layer="" className="absolute inset-0" style={{ x: grupoX, y: grupoY }}>
              {CANTOS.map((c) => (
                <Canto key={c.parte} c={c} p={p} />
              ))}
              <div className="absolute inset-[25%]">
                <DropWindow progress={p} range={[0.1, 0.6]} mode="abrir" from={1} className="[--gota:100%]">
                  <motion.div className="h-full w-full" style={{ scale: imagemEscala }}>
                    <Img id={dados.imagem} alt="" eager sizes="100vw" className="e-zoom block h-full w-full" imgClassName="h-full w-full object-cover" />
                  </motion.div>
                </DropWindow>
              </div>
              {dados.extra && (
                <motion.div data-pin-layer="" className="absolute -bottom-[6%] -left-[14%] z-[2] w-[62%]" style={{ y: extraY, rotate: extraR }}>
                  <Img id={dados.extra} alt="" sizes="(min-width: 1024px) 22vw, 40vw" eager className="e-sobe block" imgClassName="h-auto w-full drop-shadow-[0_24px_30px_rgba(0,0,0,0.55)]" />
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </Container>
    </div>
  );
}

/**
 * Abertura das páginas Institucional, Serviços e Nossos Clientes (§7.9): trilha, H1 em linhas, subtítulo e CTAs
 * à esquerda; o símbolo com a imagem dentro da gota à direita. Na rolagem a gota se abre até cobrir a tela.
 */
export function PageHero({ page }: { page: PaginaHero }) {
  const dados = PAGE_HEROES[page];
  return (
    <PinStage mode="sempre" heightClassName="h-[150svh] lg:h-[170vh]" label={linhasTexto(dados.h1)} className="grain bg-noite-950" id="topo">
      <Palco page={page} />
    </PinStage>
  );
}
